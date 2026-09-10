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
