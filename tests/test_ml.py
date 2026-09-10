import pytest
import pandas as pd
from ml.archetype_clusterer import ArchetypeClusterer
from ml.career_recommender import CareerRecommender
from ml.skill_simulator import SkillPathSimulator

def test_archetype_clustering():
    clusterer = ArchetypeClusterer()
    metrics = {
        "technical_breadth": 85.0,
        "technical_depth": 60.0,
        "consistency": 70.0,
        "project_complexity": 75.0,
        "collaboration": 65.0,
        "adaptability": 85.0,
        "overall_score": 78.0
    }
    res = clusterer.classify_developer(metrics)
    assert res["archetype"] in clusterer.ARCHETYPES_INFO
    assert "developer_coords_2d" in res
    assert "x" in res["developer_coords_2d"]
    assert "y" in res["developer_coords_2d"]

def test_career_recommendation():
    langs = pd.DataFrame([
        {"language_name": "Python", "bytes_count": 800000},
        {"language_name": "SQL", "bytes_count": 150000}
    ])
    repos = pd.DataFrame([
        {"repo_name": "ml-engine", "topics": ["machine-learning", "scikit-learn", "pandas"], "has_docker": True, "has_ci": True}
    ])

    recs = CareerRecommender.evaluate_all_roles(langs, repos)
    assert len(recs) == 8
    # Data roles should rank highest
    top_role_names = [r["role_name"] for r in recs[:3]]
    assert any("Data" in name or "Machine Learning" in name for name in top_role_names)

def test_skill_simulator():
    langs = pd.DataFrame([
        {"language_name": "Python", "bytes_count": 500000}
    ])
    repos = pd.DataFrame([
        {"repo_name": "p1", "topics": ["python"], "has_docker": False, "has_ci": False}
    ])

    sim = SkillPathSimulator.simulate_skill_acquisition(
        target_role="Data Scientist",
        acquired_skills=["SQL", "Scikit-Learn"],
        languages_df=langs,
        repos_df=repos
    )
    assert sim["simulated_fit"] >= sim["baseline_fit"]
    assert "narrative" in sim
