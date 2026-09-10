import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.preprocessing import StandardScaler

class DeveloperFeaturePipeline:
    """
    Constructs normalized multi-dimensional feature vectors from
    developer metrics and repositories for machine learning models.
    """

    FEATURE_NAMES = [
        "technical_breadth",
        "technical_depth",
        "consistency",
        "project_complexity",
        "collaboration",
        "adaptability",
        "overall_score"
    ]

    def __init__(self):
        self.scaler = StandardScaler()
        self.is_fitted = False

    def extract_features(self, metrics: Dict[str, Any]) -> np.ndarray:
        """Extracts 1D feature array from metric dictionary."""
        vector = [
            float(metrics.get("technical_breadth", 50.0)),
            float(metrics.get("technical_depth", 50.0)),
            float(metrics.get("consistency", 50.0)),
            float(metrics.get("project_complexity", 50.0)),
            float(metrics.get("collaboration", 50.0)),
            float(metrics.get("adaptability", 50.0)),
            float(metrics.get("overall_score", 50.0))
        ]
        return np.array(vector, dtype=np.float32)

    def fit_transform(self, feature_matrix: np.ndarray) -> np.ndarray:
        scaled = self.scaler.fit_transform(feature_matrix)
        self.is_fitted = True
        return scaled

    def transform(self, feature_matrix: np.ndarray) -> np.ndarray:
        if not self.is_fitted:
            # Fallback min-max / standard scale if unfitted
            return (feature_matrix - 50.0) / 20.0
        return self.scaler.transform(feature_matrix)
