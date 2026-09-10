import pytest
from ingestion.sample_profiles import get_sample_profile, list_sample_profiles, SAMPLE_PROFILES
from ingestion.github_client import GitHubAPIClient

def test_sample_profiles_integrity():
    profiles = list_sample_profiles()
    assert len(profiles) == 5
    expected_keys = ["alex-datascientist", "elena-mlops", "marcus-fullstack", "sophia-systems", "dev-junior"]
    for k in expected_keys:
        prof = get_sample_profile(k)
        assert prof is not None
        assert "user" in prof
        assert "repositories" in prof
        assert len(prof["repositories"]) > 0

def test_github_client_cache(tmp_path):
    client = GitHubAPIClient(cache_dir=str(tmp_path / "cache"), cache_ttl_seconds=3600)
    assert client.cache_dir.exists()
    rate_info = client.get_rate_limit_info()
    assert "remaining" in rate_info
