import pandas as pd
import numpy as np
from typing import Dict, Any, List

class PortfolioAuditor:
    """
    Automated GitHub Portfolio Quality Auditor:
    Audits documentation, descriptions, topics, licenses, and architecture completeness.
    """

    @classmethod
    def audit_portfolio(cls, repos_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Performs a systematic audit across all repositories.
        Returns portfolio strength score, repository audit table, and prioritized actionable advice.
        """
        if repos_df.empty:
            return {
                "portfolio_score": 40.0,
                "tier": "Needs Attention",
                "audited_repos": [],
                "recommendations": ["Create at least one public repository showcasing your primary technical skills."],
                "metrics": {"readme_pct": 0, "license_pct": 0, "description_pct": 0, "topics_pct": 0}
            }

        total_repos = len(repos_df)
        audited = []
        missing_readme = 0
        missing_desc = 0
        missing_license = 0
        missing_topics = 0
        stale_repos = 0

        for _, r in repos_df.iterrows():
            r_dict = r.to_dict()
            issues = []
            passes = []

            # 1. README
            has_readme = bool(r_dict.get("has_readme", True))
            if has_readme:
                passes.append("README documentation present")
            else:
                issues.append("Missing README documentation")
                missing_readme += 1

            # 2. Description
            desc = str(r_dict.get("description") or "").strip()
            if desc and desc != "No description provided." and len(desc) > 15:
                passes.append("Clear project description")
            else:
                issues.append("Vague or missing repository description")
                missing_desc += 1

            # 3. License
            license_val = str(r_dict.get("license") or "None")
            if license_val not in ("None", "null", ""):
                passes.append(f"Open source license ({license_val})")
            else:
                issues.append("Missing open-source license")
                missing_license += 1

            # 4. Topics
            topics = r_dict.get("topics", "")
            has_topics = bool(topics and str(topics) != "[]" and len(str(topics)) > 2)
            if has_topics:
                passes.append("Categorized with topic tags")
            else:
                issues.append("No topic tags for discoverability")
                missing_topics += 1

            # 5. Stale check
            days_since = r_dict.get("days_since_push", 0)
            if days_since > 365:
                issues.append(f"Inactive for {round(days_since/30.4, 0):.0f} months")
                stale_repos += 1

            # Calculate individual repo score
            repo_score = 100.0 - (len(issues) * 18.0)
            repo_score = max(20.0, min(100.0, repo_score))

            audited.append({
                "repo_name": r_dict.get("repo_name"),
                "primary_language": r_dict.get("primary_language", "Other"),
                "stargazers_count": r_dict.get("stargazers_count", 0),
                "repo_score": repo_score,
                "issues": issues,
                "passes": passes,
                "status": "Healthy" if repo_score >= 80 else ("Fair" if repo_score >= 60 else "Action Required")
            })

        # Calculate portfolio strength score (0-100)
        readme_pct = round(((total_repos - missing_readme) / total_repos) * 100, 1)
        desc_pct = round(((total_repos - missing_desc) / total_repos) * 100, 1)
        license_pct = round(((total_repos - missing_license) / total_repos) * 100, 1)
        topics_pct = round(((total_repos - missing_topics) / total_repos) * 100, 1)

        portfolio_score = (
            readme_pct * 0.35 +
            desc_pct * 0.25 +
            license_pct * 0.20 +
            topics_pct * 0.20
        )
        portfolio_score = float(np.clip(round(portfolio_score, 1), 20.0, 99.0))

        # Generate targeted, non-hallucinated recommendations
        recommendations = []
        if missing_readme > 0:
            recommendations.append(f"Add comprehensive README files to {missing_readme} repos. Include problem statement, architecture diagrams, and quickstart commands.")
        if missing_desc > 0:
            recommendations.append(f"Provide concise, 1-2 sentence descriptions for {missing_desc} repositories to help recruiters and collaborators understand project scope.")
        if missing_license > 0:
            recommendations.append(f"Add open-source licenses (such as MIT or Apache-2.0) to {missing_license} repositories to enable legal code reuse and open-source validation.")
        if missing_topics > 0:
            recommendations.append(f"Tag {missing_topics} repositories with relevant GitHub topics (e.g., 'machine-learning', 'fastapi', 'react') to maximize SEO and discoverability.")
        if stale_repos >= 3:
            recommendations.append(f"Archive or pin {stale_repos} stale repositories to keep the primary profile showcase clean and focused on your latest engineering standards.")

        if not recommendations:
            recommendations.append("Outstanding portfolio hygiene! All repositories maintain documentation, licenses, and topic tags.")

        tier = "Industry Ready" if portfolio_score >= 85 else ("Solid Foundation" if portfolio_score >= 68 else "Needs Optimization")

        return {
            "portfolio_score": portfolio_score,
            "tier": tier,
            "audited_repos": audited,
            "recommendations": recommendations,
            "metrics": {
                "readme_pct": readme_pct,
                "desc_pct": desc_pct,
                "license_pct": license_pct,
                "topics_pct": topics_pct
            }
        }
