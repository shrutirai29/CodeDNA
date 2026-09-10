import pandas as pd
import numpy as np
from typing import Dict, Any, List

class ProjectComplexityAnalyzer:
    """
    Computes empirical Project Complexity Scores across repositories
    using architectural, testing, containerization, and scale indicators.
    """

    @classmethod
    def evaluate_repo_complexity(cls, repo: Dict[str, Any], languages_in_repo: int = 1) -> Dict[str, Any]:
        """
        Calculates complexity for an individual repository.
        Returns continuous score (0-100), tier, and evidence signals.
        """
        score = 30.0 # Baseline
        evidence = []

        # 1. Codebase Byte Mass (0 - 25 points)
        size_kb = repo.get("size_kb", repo.get("size", 0))
        if size_kb > 20000:
            score += 25.0
            evidence.append(f"Large repository footprint ({round(size_kb/1024, 1)} MB).")
        elif size_kb > 5000:
            score += 18.0
            evidence.append(f"Substantial repository volume ({round(size_kb/1024, 1)} MB).")
        elif size_kb > 1000:
            score += 10.0
            evidence.append(f"Moderate repository volume ({round(size_kb/1024, 1)} MB).")
        else:
            score += 4.0
            evidence.append(f"Lightweight codebase ({size_kb} KB).")

        # 2. Multi-Language Heterogeneity (0 - 15 points)
        if languages_in_repo >= 3:
            score += 15.0
            evidence.append(f"Polyglot architecture spanning {languages_in_repo} languages.")
        elif languages_in_repo == 2:
            score += 8.0
            evidence.append("Dual-language structure.")
        else:
            evidence.append("Single-language codebase.")

        # 3. Production Infrastructure & Tooling (0 - 25 points)
        infra_signals = []
        if repo.get("has_docker"):
            score += 8.0
            infra_signals.append("Containerization (Docker)")
        if repo.get("has_ci"):
            score += 9.0
            infra_signals.append("Automated CI/CD Workflows")
        if repo.get("has_tests"):
            score += 8.0
            infra_signals.append("Automated Test Suites")

        if infra_signals:
            evidence.append(f"Production infrastructure present: {', '.join(infra_signals)}.")
        else:
            evidence.append("No automated CI/CD or test scaffolding detected.")

        # 4. Collaboration & Community Scale (0 - 15 points)
        stars = repo.get("stargazers_count", 0)
        forks = repo.get("forks_count", 0)
        if stars > 100 or forks > 20:
            score += 15.0
            evidence.append(f"High community validation ({stars} stars, {forks} forks).")
        elif stars > 10 or forks > 3:
            score += 8.0
            evidence.append(f"Growing community adoption ({stars} stars, {forks} forks).")

        # Cap score
        final_score = float(np.clip(round(score, 1), 10.0, 98.0))

        # Assign Tier
        if final_score >= 82.0:
            tier = "Very High"
        elif final_score >= 65.0:
            tier = "High"
        elif final_score >= 45.0:
            tier = "Medium"
        else:
            tier = "Low"

        return {
            "complexity_score": final_score,
            "complexity_tier": tier,
            "evidence": evidence
        }

    @classmethod
    def evaluate_portfolio_complexity(cls, repos_df: pd.DataFrame, languages_df: pd.DataFrame) -> Dict[str, Any]:
        """Calculates portfolio-wide complexity distributions."""
        if repos_df.empty:
            return {"avg_complexity": 40.0, "dominant_tier": "Medium", "evaluated_repos": []}

        repo_lang_counts = {}
        if not languages_df.empty:
            repo_lang_counts = languages_df.groupby("repo_id")["language_name"].nunique().to_dict()

        evaluated = []
        for _, r in repos_df.iterrows():
            r_dict = r.to_dict()
            lang_count = repo_lang_counts.get(r_dict.get("id"), 1)
            eval_res = cls.evaluate_repo_complexity(r_dict, lang_count)
            r_dict.update(eval_res)
            evaluated.append(r_dict)

        avg_comp = float(np.mean([e["complexity_score"] for e in evaluated]))
        tier_counts = pd.Series([e["complexity_tier"] for e in evaluated]).value_counts()
        dominant_tier = tier_counts.index[0] if not tier_counts.empty else "Medium"

        return {
            "avg_complexity": round(avg_comp, 1),
            "dominant_tier": dominant_tier,
            "evaluated_repos": evaluated
        }
