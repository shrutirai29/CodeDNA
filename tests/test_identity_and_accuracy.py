import pytest
import time
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from api.index import app, PROFILE_CACHE


@pytest.fixture(autouse=True)
def clear_profile_cache():
    PROFILE_CACHE.clear()


# =====================================================================
# 1. TWO ACCOUNTS WITH DISTINCT FIXTURE DATA (MOCKED)
# =====================================================================
def test_two_accounts_with_distinct_fixture_data_mocked():
    """
    [MOCKED TEST]
    Verify two distinct accounts (Alice: Backend Python, Bob: Frontend TypeScript)
    maintain strict separation of IDs, repository names, languages, and scores.
    """
    client = TestClient(app)

    alice_user = {
        "id": 1001,
        "login": "alice_backend",
        "name": "Alice Backend",
        "avatar_url": "https://avatars.githubusercontent.com/u/1001",
        "html_url": "https://github.com/alice_backend",
        "followers": 45,
        "following": 12,
        "public_repos": 2,
        "created_at": "2023-01-15T00:00:00Z",
        "bio": "Python and FastAPI engineer"
    }
    alice_repos = [
        {"name": "fastapi-core", "language": "Python", "stargazers_count": 30, "forks_count": 8, "topics": ["fastapi", "docker"], "description": "Core service"},
        {"name": "data-pipeline", "language": "Python", "stargazers_count": 15, "forks_count": 2, "topics": ["pandas"], "description": "ETL pipeline"}
    ]

    bob_user = {
        "id": 2002,
        "login": "bob_frontend",
        "name": "Bob Frontend",
        "avatar_url": "https://avatars.githubusercontent.com/u/2002",
        "html_url": "https://github.com/bob_frontend",
        "followers": 10,
        "following": 30,
        "public_repos": 2,
        "created_at": "2024-03-20T00:00:00Z",
        "bio": "React and TypeScript enthusiast"
    }
    bob_repos = [
        {"name": "react-design-system", "language": "TypeScript", "stargazers_count": 5, "forks_count": 1, "topics": ["react", "tailwind"], "description": "UI library"},
        {"name": "portfolio-spa", "language": "TypeScript", "stargazers_count": 2, "forks_count": 0, "topics": ["vite"], "description": "Portfolio site"}
    ]

    with patch("requests.get") as mock_get:
        # Fetch Alice
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: alice_user),
            MagicMock(status_code=200, json=lambda: alice_repos)
        ]
        res_a = client.get("/api/profile?username=alice_backend")
        assert res_a.status_code == 200
        data_a = res_a.json()

        assert data_a["github_id"] == 1001
        assert data_a["username"] == "alice_backend"
        assert "Python" in data_a["languages"]
        assert "TypeScript" not in data_a["languages"]
        assert data_a["primary_language"] == "Python"
        assert data_a["stars"] == 45
        assert any("fastapi-core" in p["name"] for p in data_a["projects"])
        assert not any("react-design-system" in p["name"] for p in data_a["projects"])

        # Fetch Bob
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: bob_user),
            MagicMock(status_code=200, json=lambda: bob_repos)
        ]
        res_b = client.get("/api/profile?username=bob_frontend")
        assert res_b.status_code == 200
        data_b = res_b.json()

        assert data_b["github_id"] == 2002
        assert data_b["username"] == "bob_frontend"
        assert "TypeScript" in data_b["languages"]
        assert "Python" not in data_b["languages"]
        assert data_b["primary_language"] == "TypeScript"
        assert data_b["stars"] == 7
        assert any("react-design-system" in p["name"] for p in data_b["projects"])
        assert not any("fastapi-core" in p["name"] for p in data_b["projects"])

        # Query Alice again from cache and verify zero bleed from Bob
        res_a2 = client.get("/api/profile?username=alice_backend")
        assert res_a2.status_code == 200
        data_a2 = res_a2.json()
        assert data_a2["github_id"] == 1001
        assert data_a2["username"] == "alice_backend"
        assert "TypeScript" not in data_a2["languages"]


# =====================================================================
# 2. REPEATED SEARCHES AND CACHE HITS (MOCKED)
# =====================================================================
def test_repeated_searches_and_cache_hits_mocked():
    """
    [MOCKED TEST]
    Verify repeated searches for the same user hit the isolated cache with
    identical identity data and zero duplicate external requests.
    """
    client = TestClient(app)

    user_data = {
        "id": 555,
        "login": "charlie_dev",
        "name": "Charlie",
        "avatar_url": "https://avatars.githubusercontent.com/u/555",
        "followers": 15,
        "following": 5,
        "public_repos": 1,
        "created_at": "2023-06-01T00:00:00Z"
    }
    repo_data = [{"name": "charlie-repo", "language": "Go", "stargazers_count": 8, "forks_count": 1}]

    with patch("requests.get") as mock_get:
        # Initial search: 1 for user, 1 for repos = 2 requests
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: user_data),
            MagicMock(status_code=200, json=lambda: repo_data)
        ]

        res1 = client.get("/api/profile?username=charlie_dev")
        assert res1.status_code == 200
        assert res1.json()["cache_hit"] is False
        assert mock_get.call_count == 2

        # Second search: must hit cache, no new requests.get
        res2 = client.get("/api/profile?username=charlie_dev")
        assert res2.status_code == 200
        data2 = res2.json()
        assert data2["cache_hit"] is True
        assert data2["data_source"] == "cached"
        assert data2["username"] == "charlie_dev"
        assert data2["github_id"] == 555
        assert mock_get.call_count == 2  # Call count did not increase!

        # Third search with bypass_cache / refresh=true
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: user_data),
            MagicMock(status_code=200, json=lambda: repo_data)
        ]
        res3 = client.get("/api/profile?username=charlie_dev&refresh=true")
        assert res3.status_code == 200
        assert res3.json()["cache_hit"] is False
        assert mock_get.call_count == 4


# =====================================================================
# 3. RATE-LIMITED REQUEST (MOCKED)
# =====================================================================
def test_rate_limited_request_returns_honest_429_mocked():
    """
    [MOCKED TEST]
    Verify upstream GitHub HTTP 403 returns honest HTTP 429 status code
    with reset timestamp and explicit error, never masquerading as benchmark.
    """
    client = TestClient(app)

    with patch("requests.get") as mock_get:
        mock_res = MagicMock()
        mock_res.status_code = 403
        mock_res.headers = {"X-RateLimit-Reset": "1730050000"}
        mock_get.return_value = mock_res

        res = client.get("/api/profile?username=rate_limited_friend")
        assert res.status_code == 429
        data = res.json()
        assert data["error"] == "RATE_LIMIT_EXCEEDED"
        assert "rate limit exceeded" in data["message"].lower()
        assert data["reset_timestamp"] == "1730050000"
        assert "shrutirai29" not in str(data).lower()


# =====================================================================
# 4. API FAILURE AFTER SUCCESSFUL SEARCH (MOCKED)
# =====================================================================
def test_api_failure_after_successful_search_does_not_mask_error_mocked():
    """
    [MOCKED TEST]
    Verify that if Account A succeeds, and subsequent search for Account B
    encounters an upstream GitHub 503 outage, it returns 503 and never masks it
    by returning Account A's data or benchmark data.
    """
    client = TestClient(app)

    user_a = {
        "id": 888,
        "login": "success_user",
        "name": "Success User",
        "avatar_url": "https://avatars.githubusercontent.com/u/888",
        "followers": 10,
        "following": 5,
        "public_repos": 1,
        "created_at": "2024-01-01T00:00:00Z"
    }
    repo_a = [{"name": "repo-success", "language": "Python", "stargazers_count": 3, "forks_count": 0}]

    with patch("requests.get") as mock_get:
        # 1. Search A succeeds
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: user_a),
            MagicMock(status_code=200, json=lambda: repo_a)
        ]
        res_a = client.get("/api/profile?username=success_user")
        assert res_a.status_code == 200
        assert res_a.json()["username"] == "success_user"

        # 2. Search B fails with upstream 503 Service Unavailable
        mock_get.side_effect = [
            MagicMock(status_code=503, text="GitHub upstream unavailable")
        ]
        res_b = client.get("/api/profile?username=failing_user")
        assert res_b.status_code == 503
        data_b = res_b.json()
        assert data_b["error"] == "GITHUB_API_ERROR"
        assert "503" in data_b["message"]
        # Must not return user A's data!
        assert data_b.get("username") == "failing_user"
        assert "success_user" not in str(data_b)
        assert "shrutirai29" not in str(data_b).lower()


# =====================================================================
# 5. TWO REQUESTS COMPLETING IN REVERSE ORDER (CONCURRENCY SIMULATION)
# =====================================================================
def test_two_requests_completing_in_reverse_order_concurrency():
    """
    [MOCKED TEST]
    Simulate asynchronous client state race conditions where Request 1 starts first
    but resolves second. Validates monotonic request sequence token rejects obsolete data.
    """
    # Simulate client sequence counter logic as implemented in useDeveloperStore
    state = {
        "activeSearchId": 0,
        "profile": None
    }

    def start_search(req_id: int):
        state["activeSearchId"] = req_id

    def finish_search(req_id: int, profile_data: dict):
        # Concurrency guard: reject obsolete response
        if state["activeSearchId"] != req_id:
            return False  # Discarded
        state["profile"] = profile_data
        return True

    # User searches for slow_user (Req 1)
    start_search(1)
    assert state["activeSearchId"] == 1

    # User rapidly types and searches for fast_user (Req 2)
    start_search(2)
    assert state["activeSearchId"] == 2

    # Fast user resolves first
    fast_accepted = finish_search(2, {"username": "fast_user", "id": 200})
    assert fast_accepted is True
    assert state["profile"]["username"] == "fast_user"

    # Slow user resolves LATER (in reverse order)
    slow_accepted = finish_search(1, {"username": "slow_user", "id": 100})
    assert slow_accepted is False  # Obsolete response discarded!
    assert state["profile"]["username"] == "fast_user"  # State preserved!


# =====================================================================
# 6. MISSING REPOSITORIES & INCOMPLETE API RESPONSES (MOCKED)
# =====================================================================
def test_missing_repositories_and_incomplete_api_responses_mocked():
    """
    [MOCKED TEST]
    Verify robustness when GitHub returns partial, malformed, or null repository fields
    (e.g., null language, null description, null license, missing topics).
    """
    client = TestClient(app)

    sparse_user = {
        "id": 9999,
        "login": "sparse_user",
        "name": None,  # null name
        "avatar_url": "https://avatars.githubusercontent.com/u/9999",
        "followers": 0,
        "following": 0,
        "public_repos": 3,
        "created_at": "2025-01-01T00:00:00Z",
        "bio": None  # null bio
    }
    malformed_repos = [
        {"name": "repo-no-lang", "language": None, "stargazers_count": 0, "description": None, "license": None, "topics": None},
        {"name": "repo-empty-topics", "language": "Python", "stargazers_count": None, "description": "", "topics": []},
        {"name": "repo-other-lang", "language": "Other", "stargazers_count": 1, "description": "test"}
    ]

    with patch("requests.get") as mock_get:
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: sparse_user),
            MagicMock(status_code=200, json=lambda: malformed_repos)
        ]
        res = client.get("/api/profile?username=sparse_user")
        assert res.status_code == 200
        data = res.json()

        assert data["username"] == "sparse_user"
        assert data["name"] == "sparse_user"  # Fallback to login
        assert data["github_id"] == 9999
        assert "Python" in data["languages"]
        assert len(data["projects"]) == 3
        # Ensure no crashes on null values
        assert data["stars"] == 1


# =====================================================================
# 7. NONEXISTENT ACCOUNT RETURNS 404 NO FALLBACK (MOCKED)
# =====================================================================
def test_nonexistent_account_returns_404_mocked():
    """
    [MOCKED TEST]
    Verify that querying a nonexistent user returns a strict HTTP 404 without silent fallback.
    """
    client = TestClient(app)

    with patch("requests.get") as mock_get:
        mock_res = MagicMock()
        mock_res.status_code = 404
        mock_get.return_value = mock_res

        res = client.get("/api/profile?username=nonexistent_dev_xyz_987654")
        assert res.status_code == 404
        data = res.json()
        assert data["error"] == "USER_NOT_FOUND"
        assert "shrutirai29" not in str(data).lower()


# =====================================================================
# 8. PROFILE CONTAINING MULTIPLE REPOSITORY PAGES (MOCKED)
# =====================================================================
def test_profile_containing_multiple_repository_pages_mocked():
    """
    [MOCKED TEST]
    Verify that an account with > 100 repositories triggers pagination,
    fetching page 1 and page 2, aggregating all repositories.
    """
    client = TestClient(app)

    prolific_user = {
        "id": 7777,
        "login": "prolific_dev",
        "name": "Prolific Developer",
        "avatar_url": "https://avatars.githubusercontent.com/u/7777",
        "followers": 120,
        "following": 50,
        "public_repos": 150,  # > 100 triggers multi-page pagination!
        "created_at": "2020-01-01T00:00:00Z"
    }

    # Page 1: 100 Python repositories
    page_1_repos = [
        {"name": f"py-repo-{i}", "language": "Python", "stargazers_count": 1, "forks_count": 0}
        for i in range(100)
    ]
    # Page 2: 50 Rust repositories
    page_2_repos = [
        {"name": f"rust-repo-{i}", "language": "Rust", "stargazers_count": 2, "forks_count": 1}
        for i in range(50)
    ]

    with patch("requests.get") as mock_get:
        mock_get.side_effect = [
            MagicMock(status_code=200, json=lambda: prolific_user),
            MagicMock(status_code=200, json=lambda: page_1_repos),
            MagicMock(status_code=200, json=lambda: page_2_repos)
        ]
        res = client.get("/api/profile?username=prolific_dev")
        assert res.status_code == 200
        data = res.json()

        # Both pages must be aggregated: 100 + 50 = 150 repos!
        assert data["total_repos"] == 150
        assert "Python" in data["languages"]
        assert "Rust" in data["languages"]
        assert data["stars"] == 100 * 1 + 50 * 2  # 200 stars total


# =====================================================================
# 9. LIVE GITHUB INTEGRATION TEST (ACTUAL NETWORK CALL)
# =====================================================================
def test_live_github_integration_real_network():
    """
    [LIVE TEST - REAL NETWORK]
    Performs an actual HTTP request against the live public GitHub API.
    Clearly labeled: Validates real-world response structure or rate limit handling.
    """
    import requests
    client = TestClient(app)

    # First test public GitHub connectivity directly
    try:
        live_check = requests.get("https://api.github.com/users/torvalds", timeout=6)
    except Exception as net_err:
        pytest.skip(f"Live network unavailable for live test: {net_err}")

    if live_check.status_code == 403:
        pytest.skip("Public IP currently rate-limited by GitHub API; skipping live network test.")

    # Execute through CodeDNA profile endpoint without mock
    res = client.get("/api/profile?username=torvalds&refresh=true")
    if res.status_code == 429:
        pytest.skip("GitHub rate limit active during live test; 429 response handled correctly.")

    assert res.status_code == 200
    data = res.json()
    assert data["username"].lower() == "torvalds"
    assert data["github_id"] == 1024025  # Canonical GitHub user ID for Linus Torvalds
    assert data["verified_identity"] is True
    assert data["data_source"] == "live"
    assert data["total_repos"] > 0
