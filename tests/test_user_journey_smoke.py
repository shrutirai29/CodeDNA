"""
CodeDNA & SkillBridge End-to-End User Journey Smoke Test Suite
Validates the full product flow across all major API tracks and state transitions.
"""
import pytest
from fastapi.testclient import TestClient
from api.index import app


@pytest.fixture
def client():
    return TestClient(app)


def test_complete_user_journey_smoke_flow(client):
    """
    Simulates the complete 12-step user journey from landing page entry,
    profile analysis, career matching, bookmarking, and history management.
    """
    # Step 1: Landing Page & Static Assets Entry
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert "html" in res_root.headers.get("content-type", "").lower()

    # Step 2: System Health and Diagnostic Sanitization
    res_health = client.get("/api/diagnostic")
    assert res_health.status_code == 200
    health_data = res_health.json()
    assert health_data.get("status") == "healthy"
    # Ensure sensitive environment tokens are not leaked
    env_str = str(health_data.get("environment", {}))
    assert "ghp_" not in env_str
    assert "AIzaSy" not in env_str

    # Step 3: Live GitHub Profile Search (Linus Torvalds)
    # Using mock to guarantee deterministic fast execution in smoke test
    from unittest.mock import patch, MagicMock
    mock_torvalds_user = {
        "id": 1024025,
        "login": "torvalds",
        "name": "Linus Torvalds",
        "avatar_url": "https://avatars.githubusercontent.com/u/1024025",
        "followers": 220000,
        "following": 0,
        "public_repos": 12,
        "created_at": "2011-09-03T15:26:22Z",
        "bio": "Creator of Linux and Git"
    }
    mock_torvalds_repos = [
        {"name": "linux", "language": "C", "stargazers_count": 185000, "forks_count": 54000, "topics": ["kernel", "os"], "description": "Linux kernel source tree"}
    ]

    with patch("requests.get") as mock_get:
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: mock_torvalds_user),
            MagicMock(status_code=200, json=lambda: mock_torvalds_repos)
        ]
        res_profile = client.get("/api/profile?username=torvalds&refresh=true")
        assert res_profile.status_code == 200
        prof_data = res_profile.json()
        assert prof_data["username"].lower() == "torvalds"
        assert prof_data["github_id"] == 1024025
        assert prof_data["data_source"] == "live"
        assert prof_data["primary_language"] == "C"

    # Step 4: Search Failure (Nonexistent account must return 404 and no benchmark substitution)
    with patch("requests.get") as mock_get:
        mock_get.return_value = MagicMock(status_code=404)
        res_404 = client.get("/api/profile?username=nonexistent_dev_404_xyz")
        assert res_404.status_code == 404
        data_404 = res_404.json()
        assert data_404["error"] == "USER_NOT_FOUND"
        assert "shrutirai29" not in str(data_404).lower()

    # Step 5: Explicit Benchmark Profile Selection
    res_bm = client.get("/api/profile?username=shrutirai29&benchmark=true")
    assert res_bm.status_code == 200
    bm_data = res_bm.json()
    assert bm_data["data_source"] == "benchmark"
    assert bm_data["is_demo"] is True

    # Step 6: SkillBridge Resume-to-Job Matching (Multipart Upload Simulation)
    user_session_token = "guest_smoke_test_session_99"
    resume_doc = (
        "resume.txt",
        b"Jane Developer\nFull-Stack Engineer\nSkills: Python, FastAPI, Docker, React, TypeScript, PostgreSQL",
        "text/plain"
    )
    res_match = client.post(
        "/api/career/analyze-match",
        data={
            "job_description": "Seeking Full-Stack Engineer with Python, Docker, and Kubernetes skills.",
            "target_role": "Full-Stack Engineer",
            "guest_token": user_session_token
        },
        files={"resume_file": resume_doc}
    )
    assert res_match.status_code == 200
    match_data = res_match.json()
    assert "match_score" in match_data
    assert "dimension_scores" in match_data
    assert any("python" in s.lower() for s in match_data["found_skills"])
    assert any("kubernetes" in s.lower() for s in match_data["missing_skills"])

    # Step 7: Rejection Email Analysis
    rejection_text = """
    Dear Jane,
    Thank you for taking the time to interview for the Full-Stack role.
    Unfortunately, we have decided to move forward with other candidates who have deeper Kubernetes production experience at this time.
    We wish you success in your job search.
    """
    res_email = client.post("/api/career/rejection-email", json={
        "email_text": rejection_text,
        "target_role": "Full-Stack Engineer",
        "guest_token": user_session_token
    })
    assert res_email.status_code == 200
    email_data = res_email.json()
    assert "Rejected" in email_data["decision"]
    assert len(email_data["next_steps"]) > 0

    # Step 8: Curated Course Catalog Discovery
    res_courses = client.get("/api/career/courses?skills=kubernetes,docker")
    assert res_courses.status_code == 200
    catalog = res_courses.json()
    assert "kubernetes" in catalog
    assert len(catalog["kubernetes"]) > 0

    # Step 9: Bookmarking a Recommended Course
    k8s_course = catalog["kubernetes"][0]
    res_save = client.post("/api/career/saved-courses", json={
        "guest_token": user_session_token,
        "skill": "Kubernetes",
        "title": k8s_course.get("title", "Kubernetes Hands-on"),
        "platform": k8s_course.get("platform", "freeCodeCamp"),
        "provider": k8s_course.get("provider", "Community"),
        "duration": k8s_course.get("duration", "4 hours"),
        "level": "Intermediate",
        "url": k8s_course.get("url", "https://youtube.com/watch?v=k8s"),
        "is_free": True
    })
    assert res_save.status_code == 200
    saved_course_id = res_save.json()["id"]

    # Step 10: Cross-Session Isolation & IDOR Protection
    other_user_token = "guest_attacker_session_77"
    # Other user cannot see the saved course
    other_list = client.get(f"/api/career/saved-courses?guest_token={other_user_token}").json()
    assert not any(c["id"] == saved_course_id for c in other_list)
    # Other user cannot delete the saved course
    attack_del = client.delete(f"/api/career/saved-courses/{saved_course_id}?guest_token={other_user_token}")
    assert attack_del.status_code == 200
    assert attack_del.json()["status"] == "not_found"

    # Step 11: History Retrieval and Authorized Cleanup
    history_res = client.get(f"/api/career/history?guest_token={user_session_token}")
    assert history_res.status_code == 200
    history_items = history_res.json()
    assert len(history_items) >= 1
    analysis_id = history_items[0]["id"]

    # Authorized user deletes their own analysis and course
    clean_hist = client.delete(f"/api/career/history/{analysis_id}?guest_token={user_session_token}")
    assert clean_hist.status_code == 200
    assert clean_hist.json()["status"] == "success"

    clean_course = client.delete(f"/api/career/saved-courses/{saved_course_id}?guest_token={user_session_token}")
    assert clean_course.status_code == 200
    assert clean_course.json()["status"] == "success"

    # Step 12: Analytics Export Verification (PowerBI & Data Mart Generation)
    from powerbi.export_mart import PowerBIExportMart
    import tempfile, os, pandas as pd

    with tempfile.TemporaryDirectory() as tmp_dir:
        exporter = PowerBIExportMart(export_dir=tmp_dir)
        user_meta = {"id": 1024025, "username": "torvalds", "name": "Linus", "followers": 220000, "public_repos": 12}
        metrics = {"overall_score": 85.0, "technical_depth": 90.0, "technical_breadth": 70.0, "consistency": 85.0, "project_complexity": 90.0, "collaboration": 80.0, "adaptability": 75.0}
        repos = pd.DataFrame([{"repo_name": "linux", "size_kb": 500000, "stargazers_count": 185000}])
        langs = pd.DataFrame([{"language_name": "C", "bytes_count": 1000000}])
        commits = pd.DataFrame([{"commit_hash": "c1", "commit_date": "2025-01-01", "total_changes": 20}])
        careers = [{"role_name": "Systems Architect", "fit_percentage": 95.0, "strong_skills": ["C"], "skill_gaps": [], "rank": 1}]
        benchmarks = {"percentiles": {"overall_score": 92.0}}

        exported = exporter.export_all(user_meta, metrics, repos, langs, commits, careers, benchmarks)
        assert len(exported) == 6
        for name, path in exported.items():
            assert os.path.exists(path)
            assert os.path.getsize(path) > 0
