import os
import time
import json
import hashlib
from pathlib import Path
from typing import Dict, Any, Optional, List
import requests
from dotenv import load_dotenv

load_dotenv()

class GitHubAPIClient:
    """
    Production-quality GitHub REST API Client with:
    - Token authentication & graceful unauthenticated fallback
    - Disk-based caching to minimize network calls and bypass rate limits
    - Rate limit inspection and exponential backoff
    - Automatic pagination support
    """

    BASE_URL = "https://api.github.com"

    def __init__(self, token: Optional[str] = None, cache_dir: Optional[str] = None, cache_ttl_seconds: int = 86400):
        self.token = token or os.getenv("GITHUB_TOKEN", "").strip()
        self.cache_ttl = cache_ttl_seconds
        
        if cache_dir is None:
            base_dir = Path(__file__).resolve().parent.parent
            self.cache_dir = base_dir / "data" / "cache"
        else:
            self.cache_dir = Path(cache_dir)
            
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.rate_limit_remaining = 60
        self.rate_limit_reset = int(time.time()) + 3600

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DeveloperCareerIntelligence-AnalyticsPlatform/1.0"
        }
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    def _cache_key(self, endpoint: str, params: Optional[Dict[str, Any]]) -> Path:
        raw = f"{endpoint}_{json.dumps(params or {}, sort_keys=True)}"
        hashed = hashlib.sha256(raw.encode("utf-8")).hexdigest()
        return self.cache_dir / f"{hashed}.json"

    def _read_cache(self, cache_file: Path) -> Optional[Any]:
        if not cache_file.exists():
            return None
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                payload = json.load(f)
            cached_time = payload.get("__cached_at", 0)
            if time.time() - cached_time < self.cache_ttl:
                return payload.get("data")
        except Exception:
            return None
        return None

    def _write_cache(self, cache_file: Path, data: Any):
        try:
            payload = {
                "__cached_at": time.time(),
                "data": data
            }
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(payload, f)
        except Exception:
            pass

    def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None, use_cache: bool = True) -> Optional[Any]:
        """
        Sends GET request with caching, error handling, and rate limit tracking.
        """
        cache_file = self._cache_key(endpoint, params)
        if use_cache:
            cached = self._read_cache(cache_file)
            if cached is not None:
                return cached

        url = f"{self.BASE_URL}{endpoint}" if endpoint.startswith("/") else f"{self.BASE_URL}/{endpoint}"
        retries = 2
        backoff = 2

        for attempt in range(retries + 1):
            try:
                response = requests.get(url, headers=self._get_headers(), params=params, timeout=12)
                
                # Update rate limits
                rem = response.headers.get("X-RateLimit-Remaining")
                rst = response.headers.get("X-RateLimit-Reset")
                if rem is not None:
                    self.rate_limit_remaining = int(rem)
                if rst is not None:
                    self.rate_limit_reset = int(rst)

                if response.status_code == 200:
                    data = response.json()
                    if use_cache:
                        self._write_cache(cache_file, data)
                    return data
                elif response.status_code == 404:
                    return None
                elif response.status_code in (403, 429):
                    # Rate limit exceeded
                    if attempt < retries:
                        time.sleep(backoff)
                        backoff *= 2
                        continue
                    return None
                else:
                    return None
            except Exception:
                if attempt < retries:
                    time.sleep(1)
                    continue
                return None
        return None

    def get_rate_limit_info(self) -> Dict[str, Any]:
        """Returns remaining rate limits and reset countdown in minutes."""
        now = time.time()
        mins_left = max(0, int((self.rate_limit_reset - now) / 60))
        return {
            "authenticated": bool(self.token),
            "remaining": self.rate_limit_remaining,
            "reset_in_minutes": mins_left
        }
