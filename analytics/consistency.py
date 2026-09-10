import pandas as pd
import numpy as np
from datetime import datetime, timezone, timedelta
from typing import Dict, Any

class DeveloperConsistencyAnalyzer:
    """
    Computes the Developer Consistency Index (DCI):
    Penalizes burstiness spam and rewards disciplined, sustained weekly/monthly activity.
    """

    @classmethod
    def compute_consistency_index(cls, commits_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Calculates streaks, volatility, burstiness penalty, and overall DCI.
        """
        if commits_df.empty:
            return {
                "consistency_index": 35.0,
                "active_months_count": 0,
                "active_weeks_count": 0,
                "longest_streak_days": 0,
                "current_streak_days": 0,
                "volatility_cv": 1.0,
                "burstiness_factor": 0.0,
                "narrative": "No commit records available to evaluate contribution consistency."
            }

        commits = commits_df.copy()
        commits["commit_date"] = pd.to_datetime(commits["commit_date"], errors="coerce", utc=True)
        commits = commits.dropna(subset=["commit_date"]).sort_values("commit_date")

        # Distinct active dates
        commits["date_only"] = commits["commit_date"].dt.date
        unique_dates = sorted(commits["date_only"].unique())
        
        # Calculate streaks
        current_streak = 0
        longest_streak = 0
        running_streak = 0
        prev_date = None

        today = datetime.now(timezone.utc).date()

        for d in unique_dates:
            if prev_date is None:
                running_streak = 1
            elif (d - prev_date).days == 1:
                running_streak += 1
            elif (d - prev_date).days > 1:
                running_streak = 1
            
            longest_streak = max(longest_streak, running_streak)
            prev_date = d

        # Current streak check
        if unique_dates and (today - unique_dates[-1]).days <= 2:
            current_streak = running_streak
        else:
            current_streak = 0

        # Monthly distribution & volatility
        commits["year_month"] = commits["commit_date"].dt.strftime("%Y-%m")
        monthly_counts = commits["year_month"].value_counts()
        active_months = len(monthly_counts)
        mean_monthly = float(monthly_counts.mean())
        std_monthly = float(monthly_counts.std()) if len(monthly_counts) > 1 else 0.0
        cv = (std_monthly / mean_monthly) if mean_monthly > 0 else 1.0

        # Burstiness check: Ratio of commits in top 10% of days vs total
        daily_counts = commits["date_only"].value_counts()
        top_10_pct_days = max(1, int(len(daily_counts) * 0.1))
        top_day_commits = daily_counts.iloc[:top_10_pct_days].sum()
        burstiness_ratio = (top_day_commits / len(commits)) if len(commits) > 0 else 0.0

        # DCI composite:
        # 1. Active months footprint (up to 40 pts)
        months_score = min(40.0, active_months * 2.5)
        # 2. Stability / Low Volatility (up to 30 pts)
        stability_score = max(0.0, 30.0 - (cv * 12.0))
        # 3. Streak stamina (up to 20 pts)
        streak_score = min(20.0, longest_streak * 2.0)
        # 4. Anti-burstiness discount (penalizes commit spamming)
        burst_discount = max(0.0, (burstiness_ratio - 0.3) * 20.0) if burstiness_ratio > 0.3 else 0.0

        dci = float(np.clip(round(months_score + stability_score + streak_score - burst_discount + 15.0, 1), 20.0, 99.0))

        if dci >= 78:
            narrative = f"Exceptional consistency with disciplined cadence across {active_months} active months and a peak streak of {longest_streak} consecutive days."
        elif dci >= 58:
            narrative = f"Steady contribution rhythm with moderate dispersion across active quarters."
        else:
            narrative = f"Contribution history shows irregular activity clusters and noticeable inactive intervals."

        return {
            "consistency_index": dci,
            "active_months_count": active_months,
            "active_weeks_count": int(commits["commit_date"].dt.isocalendar().week.nunique()),
            "longest_streak_days": longest_streak,
            "current_streak_days": current_streak,
            "volatility_cv": round(cv, 2),
            "burstiness_factor": round(burstiness_ratio, 2),
            "narrative": narrative
        }
