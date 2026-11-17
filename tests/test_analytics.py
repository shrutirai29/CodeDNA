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


def test_canonical_dis_scoring_weights_and_bounds():
    """Verify DeveloperIntelligenceScorer implements the exact documented weights and bounds."""
    # Check weights sum exactly to 1.00
    weights = DeveloperIntelligenceScorer.DIMENSION_WEIGHTS
    assert sum(weights.values()) == pytest.approx(1.00)
    assert weights["technical_depth"] == 0.20
    assert weights["technical_breadth"] == 0.15
    assert weights["consistency"] == 0.20
    assert weights["project_complexity"] == 0.15
    assert weights["collaboration"] == 0.15
    assert weights["adaptability"] == 0.15

    # Test edge case: completely empty DataFrames
    user_empty = {"username": "ghost", "followers": 0}
    empty_repos = pd.DataFrame()
    empty_langs = pd.DataFrame()
    empty_commits = pd.DataFrame()
    empty_prs = pd.DataFrame()

    scores_empty = DeveloperIntelligenceScorer.compute_scores(
        user_empty, empty_repos, empty_langs, empty_commits, empty_prs
    )

    assert 10.0 <= scores_empty["overall_score"] <= 99.0
    for dim in ["technical_depth", "technical_breadth", "consistency", "project_complexity", "collaboration", "adaptability"]:
        assert dim in scores_empty
        assert 10.0 <= scores_empty[dim] <= 100.0

    # Test deterministic calculation
    expected_overall = round(
        scores_empty["technical_depth"] * 0.20 +
        scores_empty["technical_breadth"] * 0.15 +
        scores_empty["consistency"] * 0.20 +
        scores_empty["project_complexity"] * 0.15 +
        scores_empty["collaboration"] * 0.15 +
        scores_empty["adaptability"] * 0.15,
        1
    )
    assert scores_empty["overall_score"] == expected_overall




def test_zero_repo_empty_profile_scoring_and_uninflated_baseline():
    """Verify empty/zero-repo profiles do not suffer false score inflation and have truthful data quality."""
    from unittest.mock import patch, MagicMock
    from api.index import fetch_live_github

    mock_empty_user = {"login": "newuser", "name": "New User", "followers": 0, "created_at": "2026-01-01"}
    mock_empty_repos = []

    with patch("requests.get") as mock_get:
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: mock_empty_user),
            MagicMock(status_code=200, json=lambda: mock_empty_repos)
        ]
        profile = fetch_live_github("newuser")
        assert profile is not None
        # Score must be at baseline (uninflated, < 35), not falsely placed at 65+
        assert profile["score"] <= 35.0
        assert profile["data_quality"]["coverage_percent"] <= 50
        assert "Insufficient Evidence" in profile["data_quality"]["tier"] or "Preliminary Evidence" in profile["data_quality"]["tier"]


def test_cors_security_explicit_origins_no_wildcard_credentials():
    """Verify CORS middleware specifies explicit trusted origins and does not use wildcard * with credentials."""
    from api.index import app
    from starlette.middleware.cors import CORSMiddleware

    cors_middleware = None
    for middleware in app.user_middleware:
        if middleware.cls == CORSMiddleware:
            cors_middleware = middleware
            break

    assert cors_middleware is not None, "CORSMiddleware not configured on app"
    allow_origins = cors_middleware.kwargs.get("allow_origins", [])
    allow_credentials = cors_middleware.kwargs.get("allow_credentials", False)

    # When allow_credentials is True, allow_origins MUST NOT be ["*"] under the CORS specification
    if allow_credentials:
        assert "*" not in allow_origins, "Security defect: allow_credentials=True cannot be combined with wildcard origin '*'"
        assert len(allow_origins) > 0, "Explicit origins must be specified"


def test_growth_timeline_no_fabricated_scores_for_unmeasured_emergence_years():
    """Verify past repository emergence years have has_score_measurement == False and no fabricated score."""
    from unittest.mock import patch, MagicMock
    from api.index import fetch_live_github

    mock_user = {"login": "builder", "name": "Builder", "followers": 10, "created_at": "2022-01-01"}
    mock_repos = [
        {"name": "early-tool", "language": "Python", "stargazers_count": 2, "created_at": "2022-05-01T00:00:00Z"},
        {"name": "mid-app", "language": "TypeScript", "stargazers_count": 5, "created_at": "2024-03-01T00:00:00Z"},
        {"name": "latest-service", "language": "Go", "stargazers_count": 8, "created_at": "2026-01-01T00:00:00Z"}
    ]

    with patch("requests.get") as mock_get:
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: mock_user),
            MagicMock(status_code=200, json=lambda: mock_repos)
        ]
        profile = fetch_live_github("builder")
        assert profile is not None
        timeline = profile["growth_timeline"]
        assert len(timeline) >= 2

        # Past emergence years (2022, 2024) must NOT have fabricated scores
        past_milestones = [m for m in timeline if m.get("year") in ("2022", "2024")]
        for m in past_milestones:
            assert m.get("has_score_measurement") is False
            assert "score" not in m, "Historical scores must not be invented from repository creation dates"

        # The latest year / current scan MUST have a measured score
        latest_milestones = [m for m in timeline if m.get("year") == "2026"]
        assert len(latest_milestones) >= 1
        assert latest_milestones[0].get("has_score_measurement") is True
        assert "score" in latest_milestones[0]


def test_diagnostic_endpoint_security_sanitization():
    """Verify /api/diagnostic does not leak internal filesystem paths, directory listings, or sys.path."""
    from api.index import get_diagnostic

    diag = get_diagnostic()
    assert diag["status"] == "healthy"
    assert "cwd" not in diag, "Security leak: cwd must not be exposed"
    assert "files_in_cwd" not in diag, "Security leak: files_in_cwd must not be exposed"
    assert "sys_path" not in diag, "Security leak: sys_path must not be exposed"


def test_zero_evidence_parity_and_baseline():
    """Verify that an empty account with zero evidence strictly receives 10.0 baseline across all dimensions."""
    from analytics.developer_score import DeveloperIntelligenceScorer
    import pandas as pd

    empty_user = {"username": "ghost_dev", "followers": 0}
    empty_repos = pd.DataFrame()
    empty_langs = pd.DataFrame()
    empty_commits = pd.DataFrame()
    empty_prs = pd.DataFrame()

    scores = DeveloperIntelligenceScorer.compute_scores(
        empty_user, empty_repos, empty_langs, empty_commits, empty_prs
    )

    assert scores["overall_score"] == 10.0, f"Expected 10.0 baseline, got {scores['overall_score']}"
    assert scores["technical_depth"] == 10.0
    assert scores["technical_breadth"] == 10.0
    assert scores["consistency"] == 10.0
    assert scores["project_complexity"] == 10.0
    assert scores["collaboration"] == 10.0
    assert scores["adaptability"] == 10.0
    assert len(scores["evidence"]) > 0


def test_scorer_resilience_to_nan_and_negative_inputs():
    """Verify DeveloperIntelligenceScorer gracefully handles NaN, None, and negative values without crashing or returning NaN."""
    from analytics.developer_score import DeveloperIntelligenceScorer
    import pandas as pd
    import numpy as np

    adversarial_user = {"username": "test_adversarial", "followers": -99}
    corrupt_repos = pd.DataFrame([
        {"repo_name": "corrupt1", "complexity_score": np.nan, "has_ci": None, "has_docker": False, "has_tests": None, "is_active_recent": False}
    ])
    corrupt_langs = pd.DataFrame([
        {"language_name": None, "bytes_count": -500}
    ])
    corrupt_commits = pd.DataFrame([
        {"commit_hash": "c_bad", "commit_date": "invalid_date", "total_changes": -10}
    ])
    corrupt_prs = pd.DataFrame([{"is_merged": None}])

    scores = DeveloperIntelligenceScorer.compute_scores(
        adversarial_user, corrupt_repos, corrupt_langs, corrupt_commits, corrupt_prs
    )

    assert not np.isnan(scores["overall_score"]), "Score must never be NaN"
    assert 10.0 <= scores["overall_score"] <= 100.0
    assert not np.isnan(scores["project_complexity"])
    assert not np.isnan(scores["technical_depth"])


def test_api_simulate_sanitization():
    """Verify /api/simulate sanitizes invalid, negative, or NaN baselines and maintains bounded scores."""
    from fastapi.testclient import TestClient
    from api.index import app

    client = TestClient(app)

    # Test extreme high baseline in POST (should fallback safely to 68.0)
    res_high = client.post("/api/simulate", json={"baseline": 150.0, "skills": ["Rust"]})
    assert res_high.status_code == 200
    data_high = res_high.json()
    assert data_high["baseline_fit"] == 68.0
    assert 10.0 <= data_high["projected_fit"] <= 100.0

    # Test negative baseline in POST (should fallback safely to 68.0)
    res_low = client.post("/api/simulate", json={"baseline": -20.0, "skills": ["Docker"]})
    assert res_low.status_code == 200
    data_low = res_low.json()
    assert data_low["baseline_fit"] == 68.0
    assert 10.0 <= data_low["projected_fit"] <= 100.0

    # Test valid baseline in POST
    res_valid = client.post("/api/simulate", json={"baseline": 80.0, "skills": ["Kubernetes", "AWS"]})
    assert res_valid.status_code == 200
    data_valid = res_valid.json()
    assert data_valid["baseline_fit"] == 80.0
    assert data_valid["projected_fit"] > 80.0

    # Test GET endpoint
    res_get = client.get("/api/simulate?role=Data+Scientist&skills=SQL,Docker")
    assert res_get.status_code == 200
    assert "target_role" in res_get.json()


def test_api_chat_input_capping():
    """Verify /api/chat caps extremely long messages and history without throwing server errors."""
    from fastapi.testclient import TestClient
    from api.index import app

    client = TestClient(app)

    huge_message = "A" * 5000
    huge_history = [{"sender": "user", "text": f"Msg {i}"} for i in range(50)]
    res = client.post("/api/chat", json={"message": huge_message, "history": huge_history})

    assert res.status_code == 200
    data = res.json()
    assert "response" in data
    assert len(data["response"]) > 0
    assert "TRAINED_AGENT_ERROR" not in data["response"]
