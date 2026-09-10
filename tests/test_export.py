import pytest
import os
import pandas as pd
from powerbi.export_mart import PowerBIExportMart

def test_power_bi_export(tmp_path):
    exporter = PowerBIExportMart(export_dir=str(tmp_path / "powerbi"))
    user_meta = {"id": 1, "username": "alex", "name": "Alex", "followers": 200, "public_repos": 8}
    metrics = {"overall_score": 85.0, "technical_depth": 80.0, "technical_breadth": 75.0, "consistency": 82.0, "project_complexity": 88.0, "collaboration": 70.0, "adaptability": 84.0}
    repos = pd.DataFrame([{"repo_name": "ai-core", "size_kb": 5000, "stargazers_count": 20}])
    langs = pd.DataFrame([{"language_name": "Python", "bytes_count": 20000}])
    commits = pd.DataFrame([{"commit_hash": "c1", "commit_date": "2025-01-01", "total_changes": 20}])
    careers = [{"role_name": "Data Scientist", "fit_percentage": 88.0, "strong_skills": ["Python"], "skill_gaps": ["Cloud"], "rank": 1}]
    benchmarks = {"percentiles": {"overall_score": 85.0}}

    exported = exporter.export_all(user_meta, metrics, repos, langs, commits, careers, benchmarks)
    assert len(exported) == 6
    for name, path in exported.items():
        assert os.path.exists(path)
        assert os.path.getsize(path) > 0
