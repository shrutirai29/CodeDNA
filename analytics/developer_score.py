import numpy as np
import pandas as pd
from typing import Dict, Any, List
from .preprocessing import DataPreprocessor

class DeveloperIntelligenceScorer:
    """
    Computes the multi-dimensional Developer Intelligence Score (DIS)
    and sub-dimension scores with empirical evidence breakdowns.
    """

    DIMENSION_WEIGHTS = {
        "technical_depth": 0.20,
        "technical_breadth": 0.15,
        "consistency": 0.20,
        "project_complexity": 0.15,
        "collaboration": 0.15,
        "adaptability": 0.15
    }

    @classmethod
    def compute_scores(
        cls,
        user_meta: Dict[str, Any],
        repos_df: pd.DataFrame,
        languages_df: pd.DataFrame,
        commits_df: pd.DataFrame,
        prs_df: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Calculates all component scores and overall Developer Intelligence Score.
        Returns score dictionary with strengths, weaknesses, and direct evidence.
        """
        strengths = []
        weaknesses = []
        evidence = []

        # -------------------------------------------------------------
        # 1. TECHNICAL DEPTH (0 - 100)
        # Evaluated by dominant language byte mass, top repo size, and codebase depth.
        # -------------------------------------------------------------
        depth_score = 40.0
        if not languages_df.empty:
            lang_totals = languages_df.groupby("language_name")["bytes_count"].sum()
            total_bytes = lang_totals.sum()
            if total_bytes > 0:
                top_lang_bytes = lang_totals.max()
                top_ratio = top_lang_bytes / total_bytes
                # High ratio in a primary stack indicates specialization
                depth_score = float(np.clip(30.0 + (top_ratio * 40.0) + min(30.0, np.log10(total_bytes + 1) * 4.5), 10.0, 100.0))
                evidence.append(f"Top language represents {round(top_ratio * 100, 1)}% of detected code ({lang_totals.idxmax()}).")
        
        if depth_score >= 75:
            strengths.append("High Technical Depth: Substantial codebase volume and mastery in primary technology.")
        elif depth_score < 50:
            weaknesses.append("Moderate Technical Depth: Stack specialization is still developing across primary repositories.")

        # -------------------------------------------------------------
        # 2. TECHNICAL BREADTH (0 - 100)
        # Evaluated by language entropy and unique language count.
        # -------------------------------------------------------------
        breadth_score = 35.0
        if not languages_df.empty:
            unique_langs = languages_df["language_name"].nunique()
            lang_totals = languages_df.groupby("language_name")["bytes_count"].sum()
            entropy = DataPreprocessor.calculate_entropy(lang_totals)
            # Breadth scales with unique languages and balanced entropy
            breadth_score = float(np.clip((entropy * 60.0) + min(40.0, unique_langs * 8.0), 10.0, 100.0))
            evidence.append(f"Active in {unique_langs} distinct programming languages with an entropy index of {round(entropy, 2)}.")
        
        if breadth_score >= 75:
            strengths.append("Broad Technical Footprint: Capable of multi-language polyglot development.")
        elif breadth_score < 45:
            weaknesses.append("Narrow Breadth: Activity is concentrated within a very small set of technologies.")

        # -------------------------------------------------------------
        # 3. CONSISTENCY (0 - 100)
        # Evaluated by active months, commit gaps, and distribution smoothness.
        # -------------------------------------------------------------
        consistency_score = 45.0
        if not commits_df.empty:
            clean_c = DataPreprocessor.clean_commits(commits_df)
            active_months = clean_c["year_month"].nunique()
            monthly_counts = clean_c["year_month"].value_counts()
            mean_c = monthly_counts.mean()
            std_c = monthly_counts.std() if len(monthly_counts) > 1 else 0.0
            cv = (std_c / mean_c) if mean_c > 0 else 1.0 # Coefficient of variation

            # Low CV and high active months yield high consistency
            month_factor = min(50.0, active_months * 3.0)
            stability_factor = max(0.0, 50.0 - (cv * 20.0))
            consistency_score = float(np.clip(month_factor + stability_factor, 15.0, 100.0))
            evidence.append(f"Active in {active_months} distinct calendar months with contribution volatility CV of {round(cv, 2)}.")

        if consistency_score >= 75:
            strengths.append("Exemplary Consistency: Highly disciplined contribution cadence over extended periods.")
        elif consistency_score < 50:
            weaknesses.append("Volatile Cadence: Irregular bursts of activity separated by extended dormant periods.")

        # -------------------------------------------------------------
        # 4. PROJECT COMPLEXITY (0 - 100)
        # Evaluated by repo architectures, test suites, Docker, CI/CD, and size.
        # -------------------------------------------------------------
        complexity_score = 45.0
        if not repos_df.empty:
            comp_mean = repos_df["complexity_score"].mean() if "complexity_score" in repos_df.columns else 50.0
            has_ci_pct = (repos_df["has_ci"].sum() / len(repos_df)) if "has_ci" in repos_df.columns else 0.0
            has_docker_pct = (repos_df["has_docker"].sum() / len(repos_df)) if "has_docker" in repos_df.columns else 0.0
            has_tests_pct = (repos_df["has_tests"].sum() / len(repos_df)) if "has_tests" in repos_df.columns else 0.0

            ci_bonus = (has_ci_pct + has_docker_pct + has_tests_pct) * 10.0
            complexity_score = float(np.clip(comp_mean * 0.7 + ci_bonus + 15.0, 20.0, 100.0))
            evidence.append(f"Average project complexity of {round(comp_mean, 1)}/100 with CI/CD & test automation across {round((has_ci_pct+has_tests_pct)/2*100, 1)}% of repos.")

        if complexity_score >= 75:
            strengths.append("High Project Complexity: Proven ability to build tested, containerized, production architectures.")
        elif complexity_score < 50:
            weaknesses.append("Elementary Project Scope: Projects are largely standalone scripts with limited architectural scaffolding.")

        # -------------------------------------------------------------
        # 5. COLLABORATION (0 - 100)
        # Evaluated by PRs, issues, forks, and followers.
        # -------------------------------------------------------------
        collab_score = 35.0
        pr_count = len(prs_df) if not prs_df.empty else 0
        merged_pr_count = prs_df["is_merged"].sum() if not prs_df.empty and "is_merged" in prs_df.columns else 0
        followers = user_meta.get("followers", 0)
        
        pr_factor = min(40.0, pr_count * 8.0 + merged_pr_count * 5.0)
        audience_factor = min(30.0, np.log10(followers + 1) * 12.0)
        collab_score = float(np.clip(25.0 + pr_factor + audience_factor, 15.0, 100.0))
        evidence.append(f"Recorded {pr_count} pull requests ({merged_pr_count} merged) and an audience of {followers} followers.")

        if collab_score >= 70:
            strengths.append("Collaborative Velocity: Demonstrates active peer review, PR contributions, and community interaction.")
        else:
            weaknesses.append("Solo Development Bias: Primarily works on personal standalone repositories without upstream PR collaboration.")

        # -------------------------------------------------------------
        # 6. TECHNOLOGY ADAPTABILITY (0 - 100)
        # Evaluated by introduction of recent technologies and topic diversity.
        # -------------------------------------------------------------
        adaptability_score = 50.0
        if not repos_df.empty:
            recent_active = repos_df["is_active_recent"].sum() if "is_active_recent" in repos_df.columns else 1
            recent_ratio = recent_active / max(1, len(repos_df))
            adaptability_score = float(np.clip(40.0 + (recent_ratio * 40.0) + min(20.0, breadth_score * 0.2), 20.0, 100.0))
            evidence.append(f"{round(recent_ratio * 100, 1)}% of repositories sustained activity within the last 6 months.")

        # -------------------------------------------------------------
        # 7. OVERALL DEVELOPER INTELLIGENCE SCORE (DIS)
        # Weighted composite score
        # -------------------------------------------------------------
        overall_score = (
            depth_score * cls.DIMENSION_WEIGHTS["technical_depth"] +
            breadth_score * cls.DIMENSION_WEIGHTS["technical_breadth"] +
            consistency_score * cls.DIMENSION_WEIGHTS["consistency"] +
            complexity_score * cls.DIMENSION_WEIGHTS["project_complexity"] +
            collab_score * cls.DIMENSION_WEIGHTS["collaboration"] +
            adaptability_score * cls.DIMENSION_WEIGHTS["adaptability"]
        )
        overall_score = float(np.clip(round(overall_score, 1), 10.0, 99.0))

        return {
            "overall_score": overall_score,
            "technical_depth": round(depth_score, 1),
            "technical_breadth": round(breadth_score, 1),
            "consistency": round(consistency_score, 1),
            "project_complexity": round(complexity_score, 1),
            "collaboration": round(collab_score, 1),
            "adaptability": round(adaptability_score, 1),
            "strengths": strengths,
            "weaknesses": weaknesses,
            "evidence": evidence
        }
