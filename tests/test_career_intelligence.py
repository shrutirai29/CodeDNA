"""
Comprehensive tests for Career Intelligence Engine.
Validates multi-source evidence synthesis, dynamic career discovery,
separate Fit/Growth/Readiness/Confidence scoring, insufficient evidence handling,
provenance tracking, grounded Q&A explanations, and guest session isolation.
"""
import io
import pytest
from fastapi.testclient import TestClient
from api.index import app
from analytics.career_intelligence import (
    CareerIntelligenceEngine,
    PROVENANCE_OBSERVED,
    PROVENANCE_INFERRED,
    PROVENANCE_USER_STATED,
    PROVENANCE_INSUFFICIENT
)


@pytest.fixture
def client():
    return TestClient(app)


def test_distinct_profiles_produce_distinct_recommendations():
    """Verify that different technical evidence produces appropriately different career directions."""
    # 1. Backend-focused profile
    backend_profile = {
        "username": "backend_dev",
        "repositories": [
            {"name": "fastapi-microservices", "description": "High performance REST API with PostgreSQL, Docker, and Pytest", "stargazers_count": 15, "primary_language": "Python", "topics": ["docker", "pytest"]},
            {"name": "redis-queue-worker", "description": "Distributed background task worker with Celery", "stargazers_count": 8, "primary_language": "Python", "topics": []}
        ],
        "languages": [{"language_name": "python", "bytes_count": 250000}, {"language_name": "sql", "bytes_count": 30000}],
        "scores": {"technical_depth": 85, "technical_breadth": 60, "consistency": 75, "project_complexity": 80, "adaptability": 70}
    }
    report_backend = CareerIntelligenceEngine.analyze(github_profile=backend_profile)
    top_dir_backend = report_backend["metadata"]["target_direction_id"]
    assert top_dir_backend == "backend_engineering"
    assert report_backend["section_5_career_directions"][0]["current_fit"]["score"] >= 60.0

    # 2. Frontend-focused profile
    frontend_profile = {
        "username": "frontend_dev",
        "repositories": [
            {"name": "react-component-library", "description": "Accessible Tailwind and TypeScript component design system", "stargazers_count": 22, "primary_language": "TypeScript", "topics": ["react", "tailwind"]},
            {"name": "nextjs-dashboard", "description": "Responsive client workspace with state management", "stargazers_count": 14, "primary_language": "JavaScript", "topics": ["nextjs"]}
        ],
        "languages": [{"language_name": "typescript", "bytes_count": 200000}, {"language_name": "javascript", "bytes_count": 150000}],
        "scores": {"technical_depth": 80, "technical_breadth": 65, "consistency": 80, "project_complexity": 75, "adaptability": 75}
    }
    report_frontend = CareerIntelligenceEngine.analyze(github_profile=frontend_profile)
    top_dir_frontend = report_frontend["metadata"]["target_direction_id"]
    assert top_dir_frontend in ["frontend_engineering", "fullstack_engineering"]
    assert report_frontend["section_5_career_directions"][0]["current_fit"]["score"] >= 60.0


def test_security_evidence_influences_appsec_recommendation():
    """Verify security-specific evidence properly boosts Application Security direction."""
    sec_profile = {
        "username": "sec_dev",
        "repositories": [
            {"name": "owasp-vulnerability-scanner", "description": "Automated security linter detecting SQL injection and hardcoded token secrets", "stargazers_count": 18, "primary_language": "Python", "topics": ["security", "owasp", "auth"]},
            {"name": "jwt-auth-gateway", "description": "Zero trust authentication gateway with cryptography and rate limiting", "stargazers_count": 10, "primary_language": "Python", "topics": ["security"]}
        ],
        "languages": [{"language_name": "python", "bytes_count": 180000}],
        "scores": {"technical_depth": 78, "technical_breadth": 60, "consistency": 70, "project_complexity": 82, "adaptability": 72}
    }
    sec_resume = "Experience conducting penetration testing, OWASP Top 10 mitigation, static code analysis, and authentication hardening."
    report = CareerIntelligenceEngine.analyze(github_profile=sec_profile, resume_text=sec_resume)
    top_dirs = [d["id"] for d in report["section_5_career_directions"][:3]]
    assert "application_security" in top_dirs


def test_mixed_technical_background_recommends_multiple_plausible_directions():
    """Verify multi-stack profiles discover multiple competitive career avenues."""
    mixed_profile = {
        "username": "polyglot_dev",
        "repositories": [
            {"name": "fullstack-saas", "description": "React and FastAPI web application with PostgreSQL and Docker", "stargazers_count": 25, "primary_language": "TypeScript", "topics": ["docker", "react"]},
            {"name": "data-pipeline", "description": "ETL pipeline scraping metrics with Pandas and SQL warehouse", "stargazers_count": 9, "primary_language": "Python", "topics": []}
        ],
        "languages": [
            {"language_name": "python", "bytes_count": 120000},
            {"language_name": "typescript", "bytes_count": 110000},
            {"language_name": "sql", "bytes_count": 40000}
        ],
        "scores": {"technical_depth": 75, "technical_breadth": 90, "consistency": 70, "project_complexity": 75, "adaptability": 88}
    }
    report = CareerIntelligenceEngine.analyze(github_profile=mixed_profile)
    directions = report["section_5_career_directions"]
    # Top 3 directions should all have strong fit (> 50.0)
    top_fits = [d["current_fit"]["score"] for d in directions[:3]]
    assert all(f >= 50.0 for f in top_fits)
    top_ids = [d["id"] for d in directions[:4]]
    # Should identify both Full-Stack and Backend/Data paths
    assert "fullstack_engineering" in top_ids or "backend_engineering" in top_ids


def test_sparse_profile_handles_insufficient_evidence_honestly():
    """Verify sparse profiles receive low confidence and honest explanations without zero ability penalty."""
    sparse_profile = {
        "username": "newbie_account",
        "repositories": [],
        "languages": [],
        "scores": {}
    }
    report = CareerIntelligenceEngine.analyze(github_profile=sparse_profile, resume_text="")

    confidence = report["metadata"]["overall_confidence"]
    # Confidence must be low (< 40)
    assert confidence <= 35
    # Fit score must NOT be penalized to 0.0 (it starts at an honest baseline around 25-35)
    top_fit = report["section_5_career_directions"][0]["current_fit"]["score"]
    assert 20.0 <= top_fit <= 45.0

    # Weaknesses section must explicitly clarify that missing evidence is NOT lack of ability
    gaps = report["section_4_weaknesses_and_gaps"]
    sparse_gap = next((g for g in gaps if "sparse" in g["title"].lower() or "limited" in g["title"].lower()), None)
    assert sparse_gap is not None
    assert "not proof of inability" in sparse_gap["why_it_matters"].lower()


def test_provenance_distinguishes_resume_claims_from_demonstrated_code():
    """Verify skills listed on a resume receive USER_STATED while GitHub code receives OBSERVED."""
    profile = {
        "username": "coder",
        "repositories": [{"name": "py-tool", "description": "Python CLI", "primary_language": "Python"}],
        "languages": [{"language_name": "python", "bytes_count": 50000}],
        "scores": {}
    }
    resume = "Expert in Kubernetes, Terraform, and AWS cloud architecture."
    report = CareerIntelligenceEngine.analyze(github_profile=profile, resume_text=resume)

    ledger = report["evidence_provenance_ledger"]
    python_entry = next((e for e in ledger if e["skill"] == "python"), None)
    kubernetes_entry = next((e for e in ledger if e["skill"] == "kubernetes"), None)

    assert python_entry is not None
    assert python_entry["provenance"] == PROVENANCE_OBSERVED

    assert kubernetes_entry is not None
    assert kubernetes_entry["provenance"] == PROVENANCE_USER_STATED
    assert "resume" in kubernetes_entry["detail"].lower()


def test_scoring_consistency_and_bounds():
    """Verify that scores are mathematically consistent, deterministic, and within 0-100 bounds."""
    profile = {
        "username": "alice",
        "repositories": [{"name": "repo1", "description": "Python and Docker project", "primary_language": "Python"}],
        "languages": [{"language_name": "python", "bytes_count": 80000}],
        "scores": {"technical_depth": 65, "technical_breadth": 50, "consistency": 60, "project_complexity": 60, "adaptability": 65}
    }

    # Run analysis twice with identical inputs
    rep1 = CareerIntelligenceEngine.analyze(github_profile=profile)
    rep2 = CareerIntelligenceEngine.analyze(github_profile=profile)

    dir1 = rep1["section_5_career_directions"][0]
    dir2 = rep2["section_5_career_directions"][0]

    assert dir1["id"] == dir2["id"]
    assert dir1["current_fit"]["score"] == dir2["current_fit"]["score"]
    assert dir1["growth_potential"]["score"] == dir2["growth_potential"]["score"]
    assert dir1["career_readiness"]["score"] == dir2["career_readiness"]["score"]

    for d in rep1["section_5_career_directions"]:
        assert 0.0 <= d["current_fit"]["score"] <= 100.0
        assert 0.0 <= d["growth_potential"]["score"] <= 100.0
        assert 0.0 <= d["career_readiness"]["score"] <= 100.0
        assert 0.0 <= d["evidence_confidence"]["score"] <= 100.0


def test_grounded_qa_does_not_hallucinate(client):
    """Verify interactive Q&A answers link to real analysis and cite evidence."""
    res_analyze = client.post("/api/career/intelligence/analyze", json={
        "username": "shrutirai29",
        "resume_text": "Experienced Python and JavaScript engineer with FastAPI and React projects.",
        "guest_token": "guest_qa_test_token"
    })
    assert res_analyze.status_code == 200
    report = res_analyze.json()["report"]

    # 1. Ask why recommended
    res_why = client.post("/api/career/intelligence/explain", json={
        "report": report,
        "question": "Why did you recommend this career?"
    })
    assert res_why.status_code == 200
    ans_why = res_why.json()
    assert "answer" in ans_why
    assert "evidence_citations" in ans_why
    assert len(ans_why["evidence_citations"]) >= 1

    # 2. Ask about weaknesses
    res_gap = client.post("/api/career/intelligence/explain", json={
        "report": report,
        "question": "What is my biggest weakness and what should I improve first?"
    })
    assert res_gap.status_code == 200
    ans_gap = res_gap.json()
    assert len(ans_gap["evidence_citations"]) >= 1


def test_career_intelligence_api_guest_isolation_and_idor(client):
    """Verify strict guest token isolation and IDOR protection on intelligence reports."""
    # User A creates a report
    res_a = client.post("/api/career/intelligence/analyze", json={
        "username": "shrutirai29",
        "resume_text": "Developer A resume.",
        "guest_token": "token_user_alpha"
    })
    assert res_a.status_code == 200
    report_id = res_a.json()["saved_id"]
    assert report_id is not None

    # User B tries to read User A's report
    res_b_read = client.get(f"/api/career/intelligence/report/{report_id}?guest_token=token_user_beta")
    assert res_b_read.status_code == 404

    # User B tries to delete User A's report
    res_b_del = client.delete(f"/api/career/intelligence/report/{report_id}?guest_token=token_user_beta")
    assert res_b_del.status_code == 200
    assert res_b_del.json()["status"] == "not_found"

    # User A reads their own report
    res_a_read = client.get(f"/api/career/intelligence/report/{report_id}?guest_token=token_user_alpha")
    assert res_a_read.status_code == 200
    assert res_a_read.json()["id"] == report_id

    # User A deletes their own report
    res_a_del = client.delete(f"/api/career/intelligence/report/{report_id}?guest_token=token_user_alpha")
    assert res_a_del.status_code == 200
    assert res_a_del.json()["status"] == "success"
