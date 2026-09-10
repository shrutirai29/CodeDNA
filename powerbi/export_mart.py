import os
import pandas as pd
from pathlib import Path
from typing import Dict, Any, Optional

class PowerBIExportMart:
    """
    Generates normalized, production-ready CSV tables formatted
    specifically for Power BI star-schema ingestion and reporting.
    """

    def __init__(self, export_dir: Optional[str] = None):
        if export_dir is None:
            base_dir = Path(__file__).resolve().parent.parent
            self.export_dir = base_dir / "data" / "processed" / "powerbi"
        else:
            self.export_dir = Path(export_dir)

        self.export_dir.mkdir(parents=True, exist_ok=True)

    def export_all(
        self,
        user_meta: Dict[str, Any],
        developer_metrics: Dict[str, Any],
        repos_df: pd.DataFrame,
        languages_df: pd.DataFrame,
        commits_df: pd.DataFrame,
        career_predictions: list,
        peer_benchmarks: Dict[str, Any]
    ) -> Dict[str, str]:
        """
        Exports all 6 normalized CSV data mart tables.
        Returns dictionary of file paths.
        """
        user_id = user_meta.get("id", 1)
        username = user_meta.get("username", "developer")

        exported_files = {}

        # 1. developer_metrics.csv
        dev_row = {
            "user_id": user_id,
            "username": username,
            "name": user_meta.get("name", username),
            "followers": user_meta.get("followers", 0),
            "public_repos": user_meta.get("public_repos", len(repos_df)),
            "overall_score": developer_metrics.get("overall_score", 50.0),
            "technical_depth": developer_metrics.get("technical_depth", 50.0),
            "technical_breadth": developer_metrics.get("technical_breadth", 50.0),
            "consistency": developer_metrics.get("consistency", 50.0),
            "project_complexity": developer_metrics.get("project_complexity", 50.0),
            "collaboration": developer_metrics.get("collaboration", 50.0),
            "adaptability": developer_metrics.get("adaptability", 50.0),
            "archetype": developer_metrics.get("archetype_name", "The Builder")
        }
        df_dev = pd.DataFrame([dev_row])
        dev_path = self.export_dir / "developer_metrics.csv"
        df_dev.to_csv(dev_path, index=False)
        exported_files["developer_metrics"] = str(dev_path)

        # 2. repository_metrics.csv
        if not repos_df.empty:
            df_repos = repos_df.copy()
            df_repos["user_id"] = user_id
            repo_path = self.export_dir / "repository_metrics.csv"
            df_repos.to_csv(repo_path, index=False)
            exported_files["repository_metrics"] = str(repo_path)

        # 3. language_metrics.csv
        if not languages_df.empty:
            df_lang = languages_df.copy()
            df_lang["user_id"] = user_id
            lang_path = self.export_dir / "language_metrics.csv"
            df_lang.to_csv(lang_path, index=False)
            exported_files["language_metrics"] = str(lang_path)

        # 4. activity_metrics.csv
        if not commits_df.empty:
            df_comm = commits_df.copy()
            df_comm["user_id"] = user_id
            act_path = self.export_dir / "activity_metrics.csv"
            df_comm.to_csv(act_path, index=False)
            exported_files["activity_metrics"] = str(act_path)

        # 5. career_metrics.csv
        if career_predictions:
            career_rows = []
            for cp in career_predictions:
                career_rows.append({
                    "user_id": user_id,
                    "role_name": cp.get("role_name"),
                    "fit_percentage": cp.get("fit_percentage"),
                    "strong_skills": ", ".join(cp.get("strong_skills", [])),
                    "missing_skills": ", ".join(cp.get("skill_gaps", [])),
                    "rank": cp.get("rank", 1)
                })
            df_career = pd.DataFrame(career_rows)
            car_path = self.export_dir / "career_metrics.csv"
            df_career.to_csv(car_path, index=False)
            exported_files["career_metrics"] = str(car_path)

        # 6. peer_benchmark.csv
        pcts = peer_benchmarks.get("percentiles", {})
        bench_rows = []
        for metric, pct_val in pcts.items():
            bench_rows.append({
                "user_id": user_id,
                "dimension": metric.replace("_", " ").title(),
                "percentile_rank": pct_val
            })
        df_bench = pd.DataFrame(bench_rows)
        bench_path = self.export_dir / "peer_benchmark.csv"
        df_bench.to_csv(bench_path, index=False)
        exported_files["peer_benchmark"] = str(bench_path)

        return exported_files
