import numpy as np
import pandas as pd
from typing import Dict, Any, List

class EDAStatisticalAnalyzer:
    """
    Computes statistical indicators, distributions, correlations,
    and longitudinal dynamics for developer activity and repositories.
    """

    @staticmethod
    def compute_distribution_metrics(series: pd.Series, name: str = "metric") -> Dict[str, Any]:
        """Calculates deep descriptive statistics for a numeric series."""
        clean = pd.to_numeric(series, errors="coerce").dropna()
        if clean.empty:
            return {
                "name": name, "count": 0, "mean": 0.0, "median": 0.0,
                "std": 0.0, "var": 0.0, "min": 0.0, "max": 0.0,
                "q25": 0.0, "q75": 0.0, "iqr": 0.0, "skew": 0.0
            }

        mean = float(clean.mean())
        std = float(clean.std()) if len(clean) > 1 else 0.0
        q25 = float(clean.quantile(0.25))
        q75 = float(clean.quantile(0.75))

        return {
            "name": name,
            "count": int(clean.count()),
            "mean": round(mean, 2),
            "median": round(float(clean.median()), 2),
            "std": round(std, 2),
            "var": round(float(clean.var()) if len(clean) > 1 else 0.0, 2),
            "min": round(float(clean.min()), 2),
            "max": round(float(clean.max()), 2),
            "q25": round(q25, 2),
            "q75": round(q75, 2),
            "iqr": round(q75 - q25, 2),
            "skew": round(float(clean.skew()) if len(clean) > 2 else 0.0, 2)
        }

    @staticmethod
    def analyze_commit_timing(commits_df: pd.DataFrame) -> Dict[str, Any]:
        """Analyzes distribution of commits across days of the week and hours of day."""
        if commits_df.empty:
            return {
                "total_commits": 0,
                "peak_day": "N/A",
                "peak_hour": 0,
                "weekend_ratio": 0.0,
                "night_owl_ratio": 0.0,
                "business_hours_ratio": 0.0,
                "weekday_counts": {},
                "hourly_counts": {}
            }

        total = len(commits_df)
        day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        
        weekday_counts = commits_df["weekday"].value_counts().to_dict()
        weekday_named = {day_names[k]: int(v) for k, v in weekday_counts.items() if 0 <= k < 7}
        
        hourly_counts = commits_df["hour"].value_counts().to_dict()
        hourly_formatted = {int(k): int(v) for k, v in sorted(hourly_counts.items())}

        peak_weekday_idx = commits_df["weekday"].mode().iloc[0] if not commits_df["weekday"].empty else 0
        peak_hour = int(commits_df["hour"].mode().iloc[0]) if not commits_df["hour"].empty else 12

        weekend_commits = commits_df["is_weekend"].sum() if "is_weekend" in commits_df.columns else 0
        night_commits = commits_df["hour"].isin([22, 23, 0, 1, 2, 3, 4]).sum()
        business_commits = commits_df["is_business_hours"].sum() if "is_business_hours" in commits_df.columns else 0

        return {
            "total_commits": total,
            "peak_day": day_names[peak_weekday_idx] if 0 <= peak_weekday_idx < 7 else "Monday",
            "peak_hour": peak_hour,
            "weekend_ratio": round(float(weekend_commits) / total, 3) if total > 0 else 0.0,
            "night_owl_ratio": round(float(night_commits) / total, 3) if total > 0 else 0.0,
            "business_hours_ratio": round(float(business_commits) / total, 3) if total > 0 else 0.0,
            "weekday_counts": weekday_named,
            "hourly_counts": hourly_formatted
        }

    @staticmethod
    def analyze_repository_metrics(repos_df: pd.DataFrame) -> Dict[str, Any]:
        """Calculates portfolio-wide aggregates and correlation metrics."""
        if repos_df.empty:
            return {
                "total_repos": 0,
                "total_stars": 0,
                "total_forks": 0,
                "total_size_mb": 0.0,
                "avg_stars": 0.0,
                "license_coverage_pct": 0.0,
                "readme_coverage_pct": 0.0,
                "correlations": {}
            }

        total_repos = len(repos_df)
        total_stars = int(repos_df["stargazers_count"].sum())
        total_forks = int(repos_df["forks_count"].sum())
        total_size_mb = round(float(repos_df["size_kb"].sum()) / 1024.0, 2)

        has_license_count = (repos_df["license"].notna() & (repos_df["license"] != "None")).sum()
        has_readme_count = repos_df["has_readme"].sum() if "has_readme" in repos_df.columns else total_repos

        # Correlations
        corrs = {}
        numeric_cols = ["stargazers_count", "forks_count", "size_kb", "complexity_score"]
        available_cols = [c for c in numeric_cols if c in repos_df.columns]
        if len(available_cols) >= 2 and total_repos >= 3:
            corr_matrix = repos_df[available_cols].corr().fillna(0).round(2).to_dict()
            corrs = corr_matrix

        return {
            "total_repos": total_repos,
            "total_stars": total_stars,
            "total_forks": total_forks,
            "total_size_mb": total_size_mb,
            "avg_stars": round(total_stars / max(1, total_repos), 1),
            "license_coverage_pct": round((has_license_count / total_repos) * 100.0, 1),
            "readme_coverage_pct": round((has_readme_count / total_repos) * 100.0, 1),
            "correlations": corrs
        }
