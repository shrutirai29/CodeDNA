import pandas as pd
import numpy as np
from typing import Dict, Any, List

class GrowthVelocityAnalyzer:
    """
    Computes Developer Growth Velocity (DGV):
    Quantifies the acceleration and trajectory of a developer's skills over time.
    """

    @classmethod
    def analyze_growth(
        cls,
        commits_df: pd.DataFrame,
        repos_df: pd.DataFrame,
        languages_df: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Calculates DGV score, annual trajectory stages, and velocity momentum tier.
        """
        if commits_df.empty or repos_df.empty:
            return {
                "growth_velocity_score": 40.0,
                "velocity_tier": "Nascent Trajectory",
                "momentum": "Stable",
                "annual_trajectories": [],
                "narrative": "Insufficient longitudinal commit records to construct a multi-year growth velocity curve."
            }

        # Temporal breakdown by year
        commits_df["year"] = pd.to_datetime(commits_df["commit_date"]).dt.year
        years = sorted(commits_df["year"].unique())

        trajectories = []
        cumulative_langs = set()
        prev_commit_vol = 0
        growth_factors = []

        for yr in years:
            yr_commits = commits_df[commits_df["year"] == yr]
            commit_count = len(yr_commits)

            # Repos active in this year
            yr_repos = repos_df[repos_df["created_at"].astype(str).str.startswith(str(yr))]
            repo_count = len(yr_repos)
            
            # Languages active in this year
            new_langs_count = 0
            if "language_name" in languages_df.columns:
                active_langs = set(languages_df["language_name"].unique())
                new_langs = active_langs - cumulative_langs
                new_langs_count = len(new_langs)
                cumulative_langs.update(active_langs)

            # Trajectory designation based on empirical activity
            if commit_count > 100 and repo_count >= 2:
                trajectory_stage = "Expansion & Production"
                stage_tier = "Advanced Trajectory"
            elif commit_count > 40:
                trajectory_stage = "Systematic Development"
                stage_tier = "Intermediate Trajectory"
            else:
                trajectory_stage = "Foundational Exploration"
                stage_tier = "Foundational Trajectory"

            # Year-over-year commit acceleration
            delta_commits = commit_count - prev_commit_vol
            growth_pct = (delta_commits / max(1, prev_commit_vol)) if prev_commit_vol > 0 else 1.0
            prev_commit_vol = commit_count
            growth_factors.append(growth_pct)

            trajectories.append({
                "year": int(yr),
                "commits": int(commit_count),
                "repos_created": int(repo_count),
                "new_technologies": int(new_langs_count),
                "trajectory_stage": trajectory_stage,
                "stage_tier": stage_tier
            })

        # Calculate composite DGV score (0-100)
        recent_years = trajectories[-2:] if len(trajectories) >= 2 else trajectories
        avg_recent_commits = np.mean([t["commits"] for t in recent_years])
        tech_expansion_rate = len(cumulative_langs)
        
        raw_velocity = (avg_recent_commits * 0.35) + (tech_expansion_rate * 6.0) + (len(repos_df) * 2.5)
        dgv_score = float(np.clip(round(raw_velocity, 1), 20.0, 98.0))

        # Classify velocity tier
        if dgv_score >= 80:
            velocity_tier = "Accelerating Trajectory"
            momentum = "High Velocity"
            narrative = f"Developer demonstrates high momentum with frequent project deployments, active multi-language expansion, and strong annualized commit velocity."
        elif dgv_score >= 60:
            velocity_tier = "Steady Trajectory"
            momentum = "Consistent Cadence"
            narrative = f"Developer maintains a healthy, sustainable engineering pace with stable technology consolidation."
        elif dgv_score >= 40:
            velocity_tier = "Consolidating Trajectory"
            momentum = "Measured Cadence"
            narrative = f"Developer is currently in a consolidation phase, deepening existing repositories with moderate expansion."
        else:
            velocity_tier = "Nascent Trajectory"
            momentum = "Developing Cadence"
            narrative = f"Developer is in the early stages of building a consistent repository portfolio."

        return {
            "growth_velocity_score": dgv_score,
            "velocity_tier": velocity_tier,
            "momentum": momentum,
            "annual_trajectories": trajectories,
            "narrative": narrative
        }
