import pandas as pd
from typing import Dict, Any, List

class ProjectStoryGenerator:
    """
    Synthesizes empirical data into coherent analytical vignettes for key repositories.
    Grounds all narrative observations strictly in observable metrics.
    """

    @classmethod
    def generate_stories(cls, repos_df: pd.DataFrame, languages_df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Generates structured analytical project stories for top repositories.
        """
        if repos_df.empty:
            return []

        # Sort by stars and complexity
        sorted_repos = repos_df.sort_values(
            by=["stargazers_count", "complexity_score" if "complexity_score" in repos_df.columns else "size_kb"],
            ascending=False
        )

        stories = []
        for _, r in sorted_repos.head(5).iterrows():
            r_dict = r.to_dict()
            repo_id = r_dict.get("id")
            repo_name = r_dict.get("repo_name", "Untitled")

            # Tech stack
            tech_stack = []
            if not languages_df.empty and repo_id:
                repo_langs = languages_df[languages_df["repo_id"] == repo_id]
                if not repo_langs.empty:
                    tech_stack = repo_langs.sort_values("bytes_count", ascending=False)["language_name"].tolist()
            if not tech_stack:
                tech_stack = [r_dict.get("primary_language", "Other")]

            # Timelines
            created = str(r_dict.get("created_at", ""))[:10]
            pushed = str(r_dict.get("pushed_at", ""))[:10]
            timeframe = f"{created} → {pushed}" if created and pushed else "Longitudinal"

            # Development Pattern
            days_span = r_dict.get("age_days", 100)
            stars = r_dict.get("stargazers_count", 0)
            forks = r_dict.get("forks_count", 0)
            complexity = r_dict.get("complexity_tier", "Medium")

            if days_span > 365 and r_dict.get("is_active_recent", True):
                pattern = "Long-term sustained iterative engineering with recent maintenance."
            elif r_dict.get("is_active_recent", True):
                pattern = "Active rapid sprint development with recent pushes."
            else:
                pattern = "Completed development lifecycle, currently in archival/reference state."

            # Contribution Pattern
            if forks > 15 or stars > 50:
                collab_pattern = f"Open-source public adoption with {forks} community forks."
            else:
                collab_pattern = "Focused individual/core-team engineering."

            # Recommendation
            if complexity in ("High", "Very High") and r_dict.get("has_readme", True):
                rec = "Primary candidate for featured GitHub showcase project."
            elif complexity == "Medium":
                rec = "Solid practical portfolio demonstration project."
            else:
                rec = "Supporting codebase; consider adding architectural diagrams and automated tests."

            stories.append({
                "project_name": repo_name,
                "title": repo_name.replace("-", " ").replace("_", " ").title(),
                "description": r_dict.get("description", "No description provided."),
                "technologies": tech_stack[:4],
                "timeframe": timeframe,
                "development_pattern": pattern,
                "complexity": complexity,
                "contribution_pattern": collab_pattern,
                "stars": stars,
                "forks": forks,
                "portfolio_recommendation": rec
            })

        return stories
