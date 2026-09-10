import pytest
import os
import pandas as pd
from database.database import DatabaseManager

@pytest.fixture
def temp_db(tmp_path):
    db_file = tmp_path / "test_suite.db"
    return DatabaseManager(str(db_file))

def test_database_initialization(temp_db):
    users = temp_db.get_all_users()
    assert isinstance(users, pd.DataFrame)
    assert len(users) == 0

def test_user_crud(temp_db):
    user_payload = {
        "username": "testdev",
        "name": "Test Developer",
        "public_repos": 5,
        "followers": 12
    }
    uid = temp_db.save_user(user_payload)
    assert uid > 0

    fetched = temp_db.get_user_by_username("testdev")
    assert fetched is not None
    assert fetched["name"] == "Test Developer"
    assert fetched["followers"] == 12

def test_repositories_and_languages(temp_db):
    uid = temp_db.save_user({"username": "repodev", "name": "Repo Dev"})
    repos = [
        {
            "repo_name": "alpha-service",
            "full_name": "repodev/alpha-service",
            "primary_language": "Python",
            "stargazers_count": 45,
            "size_kb": 3200,
            "complexity_score": 75.0
        }
    ]
    repo_map = temp_db.save_repositories(uid, repos)
    assert "alpha-service" in repo_map
    repo_id = repo_map["alpha-service"]

    # Save languages
    langs = [
        {"repo_id": repo_id, "language_name": "Python", "bytes_count": 100000, "percentage": 85.0},
        {"repo_id": repo_id, "language_name": "Docker", "bytes_count": 15000, "percentage": 15.0}
    ]
    temp_db.save_languages(uid, langs)
    fetched_langs = temp_db.get_languages(uid)
    assert len(fetched_langs) == 2
