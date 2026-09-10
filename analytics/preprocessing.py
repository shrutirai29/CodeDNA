import math
import numpy as np
import pandas as pd
from datetime import datetime, timezone
from typing import Dict, List, Any, Tuple

class DataPreprocessor:
    """
    Handles data cleaning, missing value imputation, timestamp normalization,
    outlier detection, and feature engineering for GitHub data.
    """

    @staticmethod
    def clean_repositories(repos_df: pd.DataFrame) -> pd.DataFrame:
        """Cleans and standardizes repository dataframe."""
        if repos_df.empty:
            return repos_df

        df = repos_df.copy()
        
        # Missing value handling
        df["description"] = df["description"].fillna("No description provided.")
        df["primary_language"] = df["primary_language"].fillna("Unknown")
        df["license"] = df["license"].fillna("None")
        df["topics"] = df["topics"].fillna("")

        # Ensure numeric fields are non-null and positive
        numeric_cols = ["stargazers_count", "forks_count", "watchers_count", "open_issues_count", "size_kb"]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

        # Datetime normalization
        for col in ["created_at", "updated_at", "pushed_at"]:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors="coerce", utc=True)

        # Derived metrics
        now = datetime.now(timezone.utc)
        if "created_at" in df.columns:
            df["age_days"] = (now - df["created_at"]).dt.days.clip(lower=0)
            df["age_months"] = (df["age_days"] / 30.4375).round(1)

        if "pushed_at" in df.columns:
            df["days_since_push"] = (now - df["pushed_at"]).dt.days.clip(lower=0)
            df["is_active_recent"] = df["days_since_push"] <= 180

        return df

    @staticmethod
    def clean_commits(commits_df: pd.DataFrame) -> pd.DataFrame:
        """Cleans and extracts temporal features from commits dataframe."""
        if commits_df.empty:
            return commits_df

        df = commits_df.copy()
        df["commit_date"] = pd.to_datetime(df["commit_date"], errors="coerce", utc=True)
        df = df.dropna(subset=["commit_date"])

        # Temporal feature engineering
        df["year"] = df["commit_date"].dt.year
        df["month"] = df["commit_date"].dt.month
        df["year_month"] = df["commit_date"].dt.strftime("%Y-%m")
        df["weekday"] = df["commit_date"].dt.weekday  # 0=Mon, 6=Sun
        df["hour"] = df["commit_date"].dt.hour
        df["is_weekend"] = df["weekday"].isin([5, 6]).astype(int)
        df["is_business_hours"] = ((df["hour"] >= 9) & (df["hour"] <= 18) & (~df["weekday"].isin([5, 6]))).astype(int)

        # Code churn metrics
        for col in ["additions", "deletions", "total_changes"]:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

        return df.sort_values("commit_date")

    @staticmethod
    def detect_outliers_iqr(series: pd.Series, factor: float = 1.5) -> Tuple[pd.Series, Dict[str, float]]:
        """
        Detects statistical outliers using Interquartile Range (IQR).
        Returns boolean mask where True indicates an outlier, and summary bounds.
        """
        clean_s = series.dropna()
        if len(clean_s) < 4:
            return pd.Series(False, index=series.index), {"q1": 0, "q3": 0, "iqr": 0, "lower": 0, "upper": 0}

        q1 = float(clean_s.quantile(0.25))
        q3 = float(clean_s.quantile(0.75))
        iqr = q3 - q1
        lower_bound = q1 - factor * iqr
        upper_bound = q3 + factor * iqr

        is_outlier = (series < lower_bound) | (series > upper_bound)
        bounds = {
            "q1": q1,
            "q3": q3,
            "iqr": iqr,
            "lower": lower_bound,
            "upper": upper_bound
        }
        return is_outlier, bounds

    @staticmethod
    def calculate_entropy(series: pd.Series) -> float:
        """Calculates normalized Shannon Entropy of a probability/proportional distribution (0.0 to 1.0)."""
        counts = series.dropna()
        total = counts.sum()
        if total <= 0 or len(counts) <= 1:
            return 0.0

        probs = counts / total
        probs = probs[probs > 0]
        entropy = -sum(p * math.log2(p) for p in probs)
        max_entropy = math.log2(len(counts))
        if max_entropy == 0:
            return 0.0
        return float(np.clip(entropy / max_entropy, 0.0, 1.0))
