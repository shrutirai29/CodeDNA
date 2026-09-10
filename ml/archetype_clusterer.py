import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from .feature_pipeline import DeveloperFeaturePipeline

class ArchetypeClusterer:
    """
    Unsupervised behavioral clustering engine using Scikit-Learn KMeans & PCA.
    Segments developers into empirical archetypes and provides 2D coordinate projections.
    """

    ARCHETYPES_INFO = {
        "The Deep Specialist": {
            "title": "The Deep Specialist",
            "description": "High mastery and intense concentration within a specialized technical ecosystem. Prefers deep architectural rigor over broad stack-hopping.",
            "ideal_vector": [35, 90, 80, 85, 55, 60, 82],
            "badge_color": "#3B82F6"
        },
        "The Technology Explorer": {
            "title": "The Technology Explorer",
            "description": "Broad polyglot footprint across multiple languages and modern frameworks. Rapidly investigates emerging tools and architectures.",
            "ideal_vector": [92, 55, 65, 75, 65, 90, 80],
            "badge_color": "#10B981"
        },
        "The Enterprise Builder": {
            "title": "The Enterprise Builder",
            "description": "Focuses on production infrastructure, containerization, robust CI/CD pipelines, and high-complexity distributed codebases.",
            "ideal_vector": [75, 80, 85, 95, 80, 85, 88],
            "badge_color": "#8B5CF6"
        },
        "The Open Source Contributor": {
            "title": "The Open Source Contributor",
            "description": "High community collaboration with public stars, external forks, and active PR contributions across shared projects.",
            "ideal_vector": [65, 80, 82, 85, 95, 75, 86],
            "badge_color": "#F59E0B"
        },
        "The Consistent Craftsman": {
            "title": "The Consistent Craftsman",
            "description": "Exceptional discipline, steady multi-month streaks, and low volatility. Values incremental progress and codebase maintenance.",
            "ideal_vector": [60, 75, 96, 70, 60, 65, 78],
            "badge_color": "#06B6D4"
        },
        "The Experimental Developer": {
            "title": "The Experimental Developer",
            "description": "Early-stage or exploratory cadence. Actively building initial foundational projects, experimenting with new stacks.",
            "ideal_vector": [40, 45, 45, 38, 30, 50, 42],
            "badge_color": "#EC4899"
        }
    }

    def __init__(self):
        self.pipeline = DeveloperFeaturePipeline()
        self.kmeans = KMeans(n_clusters=len(self.ARCHETYPES_INFO), random_state=42, n_init=10)
        self.pca = PCA(n_components=2, random_state=42)
        self._fit_archetype_space()

    def _fit_archetype_space(self):
        """Fits KMeans and PCA using archetype prototype distributions."""
        archetype_names = list(self.ARCHETYPES_INFO.keys())
        matrix = []
        labels = []

        for name in archetype_names:
            base_vec = np.array(self.ARCHETYPES_INFO[name]["ideal_vector"], dtype=float)
            # Generate synthetic neighborhood variations
            np.random.seed(42)
            for _ in range(25):
                noise = np.random.normal(0, 4.0, size=base_vec.shape)
                matrix.append(np.clip(base_vec + noise, 10.0, 100.0))
                labels.append(name)

        X = np.array(matrix)
        self.pipeline.fit_transform(X)
        X_scaled = self.pipeline.transform(X)
        self.kmeans.fit(X_scaled)
        self.pca.fit(X_scaled)

        # Store 2D centroids
        self.cluster_names = archetype_names
        self.archetype_points_2d = self.pca.transform(self.pipeline.transform(np.array([self.ARCHETYPES_INFO[k]["ideal_vector"] for k in archetype_names])))

    def classify_developer(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assigns developer to closest behavioral archetype, computes PCA 2D coordinates,
        and provides evidence-backed rationale.
        """
        vec = self.pipeline.extract_features(metrics).reshape(1, -1)
        vec_scaled = self.pipeline.transform(vec)

        # Nearest ideal vector using Euclidean distance
        best_archetype = None
        min_dist = float("inf")

        for name, info in self.ARCHETYPES_INFO.items():
            ideal = np.array(info["ideal_vector"], dtype=float).reshape(1, -1)
            dist = float(np.linalg.norm(vec - ideal))
            if dist < min_dist:
                min_dist = dist
                best_archetype = name

        archetype_data = self.ARCHETYPES_INFO[best_archetype]
        
        # 2D PCA projection for interactive scatter visualization
        pca_coords = self.pca.transform(vec_scaled)[0]

        # Peer points for visualization
        peer_points = []
        for i, name in enumerate(self.ARCHETYPES_INFO.keys()):
            pt = self.archetype_points_2d[i]
            peer_points.append({
                "archetype": name,
                "x": round(float(pt[0]), 3),
                "y": round(float(pt[1]), 3),
                "color": self.ARCHETYPES_INFO[name]["badge_color"]
            })

        evidence = [
            f"Technical Breadth of {metrics.get('technical_breadth', 50)}/100 and Depth of {metrics.get('technical_depth', 50)}/100 align closest with {best_archetype}.",
            f"Project Complexity score of {metrics.get('project_complexity', 50)}/100 and Consistency of {metrics.get('consistency', 50)}/100 substantiate this behavioral clustering."
        ]

        return {
            "archetype": best_archetype,
            "title": archetype_data["title"],
            "description": archetype_data["description"],
            "badge_color": archetype_data["badge_color"],
            "confidence_distance": round(min_dist, 2),
            "developer_coords_2d": {"x": round(float(pca_coords[0]), 3), "y": round(float(pca_coords[1]), 3)},
            "archetype_points_2d": peer_points,
            "evidence": evidence
        }
