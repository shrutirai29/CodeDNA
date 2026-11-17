import pytest
from fastapi.testclient import TestClient
from api.index import app


def test_career_match_json_evaluation():
    """Verify resume-to-job match scoring, dimension breakdown, and skill gap discovery."""
    client = TestClient(app)

    resume_sample = """
    John Doe — Full-Stack Software Engineer
    Experience:
    Senior Developer at CloudTech (3 years):
    - Architected and deployed microservices in Python, FastAPI, and Docker.
    - Optimized PostgreSQL database queries, reducing p99 latency by 42%.
    - Built responsive frontend client components with React, TypeScript, and TailwindCSS.
    - Mentored junior engineers and led bi-weekly Agile sprints.
    Skills: Python, FastAPI, Docker, PostgreSQL, React, TypeScript, Git, Linux.
    Education: Bachelor of Science in Computer Science.
    """

    job_description_sample = """
    We are seeking a Senior Backend Engineer to build scalable distributed systems.
    Requirements:
    - 3+ years experience with Python and FastAPI or Django.
    - Strong database skills with PostgreSQL.
    - Experience containerizing workloads with Docker and Kubernetes.
    - Cloud infrastructure deployment with AWS or GCP.
    - Familiarity with CI/CD automation and unit testing.
    - Excellent communication and cross-functional leadership.
    """

    res = client.post("/api/career/analyze-match", json={
        "resume_text": resume_sample,
        "job_description": job_description_sample,
        "target_role": "Senior Backend Engineer",
        "guest_token": "test_guest_123"
    })

    assert res.status_code == 200
    data = res.json()

    assert "match_score" in data
    assert 50.0 <= data["match_score"] <= 100.0
    assert "dimension_scores" in data
    assert "technical" in data["dimension_scores"]
    assert "experience" in data["dimension_scores"]
    assert "education" in data["dimension_scores"]
    assert "soft_skills" in data["dimension_scores"]

    # Found skills must detect Python, FastAPI, Docker, PostgreSQL
    found_lower = [s.lower() for s in data["found_skills"]]
    assert any("python" in s for s in found_lower)
    assert any("fastapi" in s for s in found_lower)

    # Missing skills must flag Kubernetes, AWS/GCP, or CI/CD
    missing_lower = [s.lower() for s in data["missing_skills"]]
    assert any("kubernetes" in s or "aws" in s or "ci/cd" in s for s in missing_lower)

    # Must provide tailored tips and course recommendations
    assert len(data["tips"]) > 0
    assert "course_recommendations" in data
    assert len(data["course_recommendations"]) > 0


def test_rejection_email_classification():
    """Verify rejection email analyzer correctly classifies outcomes and tactical actions."""
    client = TestClient(app)

    # 1. Rejection email
    rejection_email = """
    Dear Candidate,
    Thank you for taking the time to interview with our engineering team for the Full Stack Developer role.
    Unfortunately, we have decided to move forward with other candidates whose experience more closely matches our current needs at this time.
    We wish you the best in your job search.
    """
    res_rej = client.post("/api/career/rejection-email", json={
        "email_text": rejection_email,
        "target_role": "Full Stack Developer",
        "guest_token": "test_guest_123"
    })
    assert res_rej.status_code == 200
    data_rej = res_rej.json()
    assert "Rejected" in data_rej["decision"]
    assert data_rej["confidence"] >= 65
    assert len(data_rej["next_steps"]) > 0

    # 2. Offer / Progression email
    offer_email = """
    Congratulations! We were very impressed by your technical interview and are pleased to invite you to the next round with our VP of Engineering.
    """
    res_off = client.post("/api/career/rejection-email", json={
        "email_text": offer_email,
        "target_role": "Full Stack Developer",
        "guest_token": "test_guest_123"
    })
    assert res_off.status_code == 200
    data_off = res_off.json()
    assert "Selected" in data_off["decision"]
    assert data_off["confidence"] >= 65


def test_courses_catalog_and_saved_courses_crud():
    """Verify course recommendations by skill and user bookmarking CRUD operations."""
    client = TestClient(app)

    # 1. Query courses by skills
    res_courses = client.get("/api/career/courses?skills=docker,python,kubernetes")
    assert res_courses.status_code == 200
    catalog = res_courses.json()
    assert "docker" in catalog
    assert "python" in catalog
    assert len(catalog["docker"]) > 0
    assert "url" in catalog["docker"][0]

    # 2. Bookmark course
    sample_course = {
        "guest_token": "guest_abc",
        "skill": "Docker",
        "title": "Docker for Beginners",
        "platform": "freeCodeCamp",
        "provider": "TechWorld",
        "duration": "3 hours",
        "level": "Beginner",
        "url": "https://youtube.com/watch?v=3c-iBn73dDE",
        "is_free": True
    }
    res_save = client.post("/api/career/saved-courses", json=sample_course)
    assert res_save.status_code == 200
    saved_id = res_save.json()["id"]

    # 3. Retrieve saved courses
    res_list = client.get("/api/career/saved-courses?guest_token=guest_abc")
    assert res_list.status_code == 200
    saved_list = res_list.json()
    assert any(c["title"] == "Docker for Beginners" for c in saved_list)

    # 4. Delete saved course
    res_del = client.delete(f"/api/career/saved-courses/{saved_id}?guest_token=guest_abc")
    assert res_del.status_code == 200
    assert res_del.json()["status"] == "success"


def test_career_history_crud():
    """Verify analysis history retrieval and deletion."""
    client = TestClient(app)

    # Run analysis to generate history
    client.post("/api/career/analyze-match", json={
        "resume_text": "Python developer with SQL experience.",
        "job_description": "Looking for Python and SQL developer.",
        "target_role": "Junior Python Dev",
        "guest_token": "history_test_user"
    })

    # Retrieve history
    res_hist = client.get("/api/career/history?guest_token=history_test_user")
    assert res_hist.status_code == 200
    history = res_hist.json()
    assert len(history) >= 1
    analysis_id = history[0]["id"]

    # Delete history record
    res_del = client.delete(f"/api/career/history/{analysis_id}?guest_token=history_test_user")
    assert res_del.status_code == 200
    assert res_del.json()["status"] == "success"


def test_skillbridge_idor_prevention_and_user_isolation():
    """
    [SECURITY TEST]
    Verify that saved courses and career history are strictly isolated between guest tokens.
    User B must NEVER be able to read or delete User A's data by guessing resource IDs (IDOR).
    Missing tokens must return HTTP 400 MISSING_TOKEN or empty datasets.
    """
    client = TestClient(app)

    token_a = "guest_alice_isolated_001"
    token_b = "guest_bob_isolated_002"

    # 1. User A bookmarks a course
    course_a = {
        "guest_token": token_a,
        "skill": "Python",
        "title": "Advanced Python Metaprogramming",
        "platform": "Coursera",
        "provider": "DeepLearning",
        "duration": "5 hours",
        "level": "Advanced",
        "url": "https://example.com/python-adv",
        "is_free": False
    }
    save_res = client.post("/api/career/saved-courses", json=course_a)
    assert save_res.status_code == 200
    course_id_a = save_res.json()["id"]

    # Reject bookmarking with invalid or injection token
    invalid_token_res = client.post("/api/career/saved-courses", json={
        "guest_token": "malicious' OR 1=1--",
        "title": "Hacked Course",
        "skill": "Python"
    })
    assert invalid_token_res.status_code == 400
    assert invalid_token_res.json()["error"] == "INVALID_TOKEN"

    # 2. User B queries saved courses -> must be empty (cannot see User A's course)
    list_b = client.get(f"/api/career/saved-courses?guest_token={token_b}").json()
    assert not any(c["id"] == course_id_a for c in list_b)

    # 3. User B attempts to DELETE User A's course by ID -> IDOR attack must FAIL (returns not_found)
    del_attack = client.delete(f"/api/career/saved-courses/{course_id_a}?guest_token={token_b}")
    assert del_attack.status_code == 200
    assert del_attack.json()["status"] == "not_found"

    # Verify User A's course is still intact
    list_a = client.get(f"/api/career/saved-courses?guest_token={token_a}").json()
    assert any(c["id"] == course_id_a for c in list_a)

    # 4. Attempt DELETE without any token -> must return 400 MISSING_TOKEN
    del_no_token = client.delete(f"/api/career/saved-courses/{course_id_a}")
    assert del_no_token.status_code == 400
    assert del_no_token.json()["error"] == "MISSING_TOKEN"

    # 5. Clean up by authorized User A
    del_a = client.delete(f"/api/career/saved-courses/{course_id_a}?guest_token={token_a}")
    assert del_a.status_code == 200
    assert del_a.json()["status"] == "success"


def test_resume_upload_file_restrictions_and_size_limits():
    """
    [SECURITY TEST]
    Verify that upload restrictions enforce valid file extensions (.pdf, .docx, .txt),
    reject files exceeding the 10MB limit, and reject missing inputs.
    """
    client = TestClient(app)

    # 1. Reject invalid file extension (.exe)
    invalid_file = ("malicious.exe", b"MZ\x90\x00executable binary content", "application/x-msdownload")
    res_bad_ext = client.post(
        "/api/career/analyze-match",
        data={"job_description": "Software engineer with Python skills", "target_role": "Python Dev"},
        files={"resume_file": invalid_file}
    )
    assert res_bad_ext.status_code == 400
    assert res_bad_ext.json()["error"] == "INVALID_FILE_TYPE"

    # 2. Reject file exceeding 10MB
    huge_bytes = b"A" * (10 * 1024 * 1024 + 1024)  # 10MB + 1KB
    huge_file = ("huge_resume.txt", huge_bytes, "text/plain")
    res_huge = client.post(
        "/api/career/analyze-match",
        data={"job_description": "Software engineer", "target_role": "Dev"},
        files={"resume_file": huge_file}
    )
    assert res_huge.status_code == 400
    assert res_huge.json()["error"] == "FILE_TOO_LARGE"

    # 3. Reject missing resume text
    res_missing_res = client.post(
        "/api/career/analyze-match",
        json={"resume_text": "", "job_description": "Some job"}
    )
    assert res_missing_res.status_code == 400
    assert res_missing_res.json()["error"] == "MISSING_RESUME"

    # 4. Reject missing job description
    res_missing_jd = client.post(
        "/api/career/analyze-match",
        json={"resume_text": "Experienced Python engineer", "job_description": ""}
    )
    assert res_missing_jd.status_code == 400
    assert res_missing_jd.json()["error"] == "MISSING_JOB_DESCRIPTION"

    # 5. Reject empty file (0 bytes)
    res_empty = client.post(
        "/api/career/analyze-match",
        data={"job_description": "Software engineer", "target_role": "Dev"},
        files={"resume_file": ("empty.pdf", b"", "application/pdf")}
    )
    assert res_empty.status_code == 400
    assert res_empty.json()["error"] == "PARSER_ERROR"
    assert "empty" in res_empty.json()["message"].lower()

    # 6. Reject extension spoofing (PDF extension with non-PDF header)
    res_spoof_pdf = client.post(
        "/api/career/analyze-match",
        data={"job_description": "Software engineer", "target_role": "Dev"},
        files={"resume_file": ("spoof.pdf", b"MZ\x90\x00executable binary masquerading as pdf", "application/pdf")}
    )
    assert res_spoof_pdf.status_code == 400
    assert res_spoof_pdf.json()["error"] == "PARSER_ERROR"
    assert "pdf" in res_spoof_pdf.json()["message"].lower()

    # 7. Reject extension spoofing (DOCX extension with non-zip header)
    res_spoof_docx = client.post(
        "/api/career/analyze-match",
        data={"job_description": "Software engineer", "target_role": "Dev"},
        files={"resume_file": ("spoof.docx", b"NOT_A_ZIP_HEADER_RAW_DATA", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    )
    assert res_spoof_docx.status_code == 400
    assert res_spoof_docx.json()["error"] == "PARSER_ERROR"
    assert "docx" in res_spoof_docx.json()["message"].lower()

    # 8. Accept authentic TXT file upload
    valid_txt = ("resume.txt", b"Jane Doe\nFull-Stack Engineer\nSkills: Python, Docker, React, FastAPI, PostgreSQL", "text/plain")
    res_valid_txt = client.post(
        "/api/career/analyze-match",
        data={"job_description": "We need a Python and Docker Engineer", "target_role": "Full-Stack Dev"},
        files={"resume_file": valid_txt}
    )
    assert res_valid_txt.status_code == 200
    assert res_valid_txt.json()["match_score"] >= 40.0


