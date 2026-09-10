import pandas as pd
import numpy as np
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List

class SkillMomentumAnalyzer:
    """
    Computes dynamic momentum categories (RISING, STABLE, DECLINING, NEW, DORMANT)
    for every detected programming language or technology stack.
    """

    @classmethod
    def compute_momentum(
        cls,
        languages_df: pd.DataFrame,
        repos_df: pd.DataFrame,
        commits_df: pd.DataFrame
    ) -> List[Dict[str, Any]]:
        """
        Evaluates time-decayed activity in the recent 6 months versus prior history.
        """
        if languages_df.empty or repos_df.empty:
            return []

        now = datetime.now(timezone.utc)
        six_months_ago = now - timedelta(days=180)
        one_year_ago = now - timedelta(days=365)

        # Merge repos with languages to get timestamps per language
        merged = pd.merge(
            languages_df,
            repos_df[["id", "created_at", "pushed_at", "repo_name"]],
            left_on="repo_id",
            right_on="id",
            how="inner"
        )

        results = []
        for lang_name, group in merged.groupby("language_name"):
            total_bytes = int(group["bytes_count"].sum())
            latest_push = group["pushed_at"].max()
            earliest_created = group["created_at"].min()

            # Time deltas
            days_since_latest = (now - latest_push).days if pd.notna(latest_push) else 999
            days_since_created = (now - earliest_created).days if pd.notna(earliest_created) else 999

            # Determine category based on empirical temporal dynamics
            if days_since_created <= 180 and days_since_latest <= 90:
                momentum = "NEW"
                reason = "Adopted within the last 6 months with ongoing active pushes."
                badge_color = "#10B981" # Green
            elif days_since_latest > 365:
                momentum = "DORMANT"
                reason = "No active repository commits or pushes detected in over 12 months."
                badge_color = "#64748B" # Gray
            elif days_since_latest > 180:
                momentum = "DECLINING"
                reason = "Activity tapered off over the preceding two quarters."
                badge_color = "#F59E0B" # Amber
            else:
                # Active recently: distinguish Rising vs Stable
                recent_repos = group[group["pushed_at"] >= six_months_ago]
                if len(recent_repos) >= 2 or len(recent_repos) == len(group):
                    momentum = "RISING"
                    reason = "Accelerated push cadence across multiple recent repositories."
                    badge_color = "#3B82F6" # Blue
                else:
                    momentum = "STABLE"
                    reason = "Maintained sustained development cadence across established codebases."
                    badge_color = "#8B5CF6" # Purple

            results.append({
                "technology": lang_name,
                "momentum": momentum,
                "badge_color": badge_color,
                "total_bytes": total_bytes,
                "days_since_push": days_since_latest,
                "repo_count": len(group),
                "reason": reason
            })

        # Sort by total bytes descending
        results.sort(key=lambda x: x["total_bytes"], reverse=True)
        return results
