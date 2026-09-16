import pytest
import pandas as pd
from analytics.developer_score import DeveloperIntelligenceScorer
from analytics.growth_velocity import GrowthVelocityAnalyzer
from analytics.complexity import ProjectComplexityAnalyzer
from analytics.consistency import DeveloperConsistencyAnalyzer
from analytics.portfolio_auditor import PortfolioAuditor

def test_developer_intelligence_score_calculation():
    user = {"username": "scorer", "followers": 150}
    repos = pd.DataFrame([
        {"repo_name": "repo1", "complexity_score": 85.0, "has_ci": True, "has_docker": True, "has_tests": True, "is_active_recent": True}
    ])
    langs = pd.DataFrame([
        {"language_name": "Python", "bytes_count": 500000},
        {"language_name": "SQL", "bytes_count": 80000}
    ])
    commits = pd.DataFrame([
        {"commit_hash": "c1", "commit_date": "2025-01-15T12:00:00Z", "total_changes": 45},
        {"commit_hash": "c2", "commit_date": "2025-02-15T12:00:00Z", "total_changes": 60}
    ])
    prs = pd.DataFrame([{"is_merged": True}])

    scores = DeveloperIntelligenceScorer.compute_scores(user, repos, langs, commits, prs)
    assert "overall_score" in scores
    assert 10.0 <= scores["overall_score"] <= 100.0
    assert "technical_depth" in scores
    assert "technical_breadth" in scores
    assert len(scores["evidence"]) > 0

def test_project_complexity_analysis():
    repo = {
        "repo_name": "test-repo",
        "size_kb": 12000,
        "has_docker": True,
        "has_ci": True,
        "has_tests": True,
        "stargazers_count": 80,
        "forks_count": 15
    }
    res = ProjectComplexityAnalyzer.evaluate_repo_complexity(repo, languages_in_repo=3)
    assert res["complexity_score"] >= 70.0
    assert res["complexity_tier"] in ("High", "Very High")

def test_portfolio_auditor():
    repos = pd.DataFrame([
        {
            "repo_name": "r1",
            "has_readme": True,
            "description": "Production machine learning pipeline for classification.",
            "license": "MIT",
            "topics": ["ml", "python"],
            "days_since_push": 10,
            "stargazers_count": 5
        },
        {
            "repo_name": "r2",
            "has_readme": False,
            "description": "",
            "license": "None",
            "topics": [],
            "days_since_push": 400,
            "stargazers_count": 0
        }
    ])
    audit = PortfolioAuditor.audit_portfolio(repos)
    assert 20.0 <= audit["portfolio_score"] <= 100.0
    assert len(audit["recommendations"]) > 0
    assert len(audit["audited_repos"]) == 2


def test_dynamic_live_github_intelligence():
    """Verify that fetch_live_github produces authentic, varied, non-clone profiles with rich tech stacks."""
    from unittest.mock import patch, MagicMock
    from api.index import fetch_live_github

    # 1. Mock Data Scientist Profile
    mock_ds_user = {"login": "datasci", "name": "Data Scientist", "followers": 25, "created_at": "2023-01-01"}
    mock_ds_repos = [
        {"name": "fastapi-ml-service", "language": "Python", "stargazers_count": 12, "forks_count": 3, "description": "Production ML model serving with FastAPI and PyTorch", "topics": ["pytorch", "fastapi"]},
        {"name": "timeseries-analytics", "language": "Python", "stargazers_count": 8, "forks_count": 2, "description": "Pandas and Scikit-Learn forecasting", "topics": ["pandas", "sklearn"]},
        {"name": "data-pipeline", "language": "Python", "stargazers_count": 4, "forks_count": 1, "description": "PostgreSQL data warehouse pipeline", "topics": ["postgres", "sql"]}
    ]

    # 2. Mock Systems Programmer Profile
    mock_sys_user = {"login": "sysdev", "name": "Systems Dev", "followers": 60, "created_at": "2021-01-01"}
    mock_sys_repos = [
        {"name": "kernel-driver", "language": "C", "stargazers_count": 45, "forks_count": 10, "description": "Linux kernel character device driver", "topics": ["linux", "kernel"]},
        {"name": "allocator-cpp", "language": "C++", "stargazers_count": 22, "forks_count": 4, "description": "Custom lock-free memory allocator", "topics": ["dsa", "systems"]}
    ]

    with patch("requests.get") as mock_get:
        # Test Data Scientist
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: mock_ds_user),
            MagicMock(status_code=200, json=lambda: mock_ds_repos)
        ]
        p_ds = fetch_live_github("datasci")
        assert p_ds is not None
        assert p_ds["top_career"] in ("Data Scientist / ML Engineer", "Backend Engineer", "Full-Stack Developer")
        ds_tech_names = [n["name"] for n in p_ds["dna_nodes"]]
        assert "Other" not in ds_tech_names
        assert any(t in ds_tech_names for t in ["FastAPI", "PyTorch", "Python", "Pandas"])

        # Test Systems Programmer
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: mock_sys_user),
            MagicMock(status_code=200, json=lambda: mock_sys_repos)
        ]
        p_sys = fetch_live_github("sysdev")
        assert p_sys is not None
        assert p_sys["top_career"] == "Systems & Software Engineer (SDE)"
        sys_tech_names = [n["name"] for n in p_sys["dna_nodes"]]
        assert "Other" not in sys_tech_names
        assert any(t in sys_tech_names for t in ["C", "C++", "Algorithms / DSA"])

        # Confirm career fit scores and roles differ between the two profiles
        assert p_ds["top_career"] != p_sys["top_career"] or p_ds["top_fit"] != p_sys["top_fit"]

