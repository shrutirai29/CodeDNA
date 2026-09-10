import os
import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import streamlit as st
import pandas as pd
from database.database import DatabaseManager
from ingestion.collectors import DeveloperDataCollector
from ingestion.sample_profiles import SAMPLE_PROFILES, get_sample_profile, list_sample_profiles, seed_sample_profiles
from analytics.preprocessing import DataPreprocessor
from analytics.developer_score import DeveloperIntelligenceScorer
from analytics.growth_velocity import GrowthVelocityAnalyzer
from analytics.technology_dna import TechnologyDNAAnalyzer
from analytics.skill_momentum import SkillMomentumAnalyzer
from analytics.complexity import ProjectComplexityAnalyzer
from analytics.consistency import DeveloperConsistencyAnalyzer
from analytics.portfolio_auditor import PortfolioAuditor
from analytics.benchmarking import PeerBenchmarkingEngine
from ml.archetype_clusterer import ArchetypeClusterer
from ml.career_recommender import CareerRecommender
from powerbi.export_mart import PowerBIExportMart

from app.pages_impl import (
    render_overview,
    render_technology_dna,
    render_activity,
    render_repositories,
    render_career,
    render_archetype,
    render_portfolio,
    render_comparison,
    render_simulator
)

# Streamlit Page Setup
st.set_page_config(
    page_title="Developer Career Intelligence & Analytics Platform",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Inject Custom CSS Styles
def load_css():
    css_file = Path(__file__).resolve().parent / "styles.css"
    if css_file.exists():
        with open(css_file, "r", encoding="utf-8") as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css()

# Initialize Database
@st.cache_resource
def get_db():
    db = DatabaseManager()
    # Check if empty, seed if so
    users = db.get_all_users()
    if users.empty:
        seed_sample_profiles(db)
    return db

db = get_db()

@st.cache_resource
def get_ml_clusterer():
    return ArchetypeClusterer()

ml_clusterer = get_ml_clusterer()

# Pipeline execution helper for a user
def build_developer_profile_payload(username: str, db_manager: DatabaseManager) -> dict:
    """Retrieves or ingests data and runs the entire analytics + ML pipeline."""
    user = db_manager.get_user_by_username(username)
    if not user:
        # Check if it's in sample profiles
        if username in SAMPLE_PROFILES:
            seed_sample_profiles(db_manager)
            user = db_manager.get_user_by_username(username)

    if not user:
        return None

    user_id = user["id"]
    repos_df = db_manager.get_repositories(user_id)
    languages_df = db_manager.get_languages(user_id)
    commits_df = db_manager.get_commits(user_id)
    prs_df = db_manager.execute_query("SELECT * FROM pull_requests WHERE user_id = ?", (user_id,))

    # Clean data
    repos_clean = DataPreprocessor.clean_repositories(repos_df)
    commits_clean = DataPreprocessor.clean_commits(commits_df)

    # Analytics
    scores = DeveloperIntelligenceScorer.compute_scores(user, repos_clean, languages_df, commits_clean, prs_df)
    growth = GrowthVelocityAnalyzer.analyze_growth(commits_clean, repos_clean, languages_df)
    dna = TechnologyDNAAnalyzer.build_dna_profile(languages_df, repos_clean)
    momentum = SkillMomentumAnalyzer.compute_momentum(languages_df, repos_clean, commits_clean)
    complexity_info = ProjectComplexityAnalyzer.evaluate_portfolio_complexity(repos_clean, languages_df)
    consistency_data = DeveloperConsistencyAnalyzer.compute_consistency_index(commits_clean)
    portfolio = PortfolioAuditor.audit_portfolio(repos_clean)
    benchmarks = PeerBenchmarkingEngine.calculate_percentiles(scores)

    # Machine Learning
    archetype = ml_clusterer.classify_developer(scores)
    career_recs = CareerRecommender.evaluate_all_roles(languages_df, repos_clean)

    # Save computed metrics back to DB
    scores["archetype_name"] = archetype["archetype"]
    scores["growth_velocity_score"] = growth["growth_velocity_score"]
    scores["growth_velocity_tier"] = growth["velocity_tier"]
    scores["portfolio_score"] = portfolio["portfolio_score"]
    scores["consistency_index"] = consistency_data["consistency_index"]
    scores["project_complexity_avg"] = complexity_info["avg_complexity"]
    db_manager.save_developer_metrics(user_id, scores)

    return {
        "user": user,
        "repos": repos_clean,
        "languages": languages_df,
        "commits": commits_clean,
        "prs": prs_df,
        "scores": scores,
        "growth": growth,
        "dna": dna,
        "momentum": momentum,
        "complexity_info": complexity_info,
        "consistency_data": consistency_data,
        "portfolio": portfolio,
        "benchmarks": benchmarks,
        "archetype": archetype,
        "career_recs": career_recs
    }

# =====================================================================
# SIDEBAR CONTROLS & NAVIGATION
# =====================================================================
st.sidebar.markdown("""
<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
    <span style="font-size: 1.6rem;">⚡</span>
    <span style="font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em; color: #F8FAFC;">Developer Career Intelligence</span>
</div>
""", unsafe_allow_html=True)

mode = st.sidebar.radio(
    "Data Source Mode",
    ["Curated Benchmark Profiles", "Live GitHub User Analysis"],
    index=0
)

active_username = "alex-datascientist"

if mode == "Curated Benchmark Profiles":
    sample_list = list_sample_profiles()
    sample_display_map = {f"{s['name']} ({s['title']})": s["username"] for s in sample_list}
    selected_display = st.sidebar.selectbox("Select Profile:", list(sample_display_map.keys()), index=0)
    active_username = sample_display_map[selected_display]
else:
    live_user_input = st.sidebar.text_input("Enter GitHub Username:", value="torvalds")
    if st.sidebar.button("Ingest Profile", type="primary"):
        with st.spinner(f"Ingesting GitHub data for @{live_user_input}..."):
            collector = DeveloperDataCollector()
            user_profile = collector.fetch_user_profile(live_user_input)
            if user_profile:
                u_id = db.save_user(user_profile)
                repos_raw = collector.fetch_user_repositories(live_user_input, max_repos=20)
                repo_map = db.save_repositories(u_id, repos_raw)
                st.sidebar.success(f"Ingested {len(repos_raw)} repositories!")
                active_username = live_user_input
            else:
                st.sidebar.warning(f"Could not reach GitHub API or user '@{live_user_input}' not found. Falling back to benchmark profile.")
                active_username = "alex-datascientist"
    else:
        active_username = live_user_input if db.get_user_by_username(live_user_input) else "alex-datascientist"

# Build Profile Data Payload
data_payload = build_developer_profile_payload(active_username, db)

if not data_payload:
    # Graceful fallback
    active_username = "alex-datascientist"
    data_payload = build_developer_profile_payload(active_username, db)

st.sidebar.markdown("---")

# Page Navigation
pages = [
    "1. Executive Overview",
    "2. Technology DNA",
    "3. Developer Activity",
    "4. Repository Intelligence",
    "5. Career Intelligence",
    "6. Developer Archetype",
    "7. Portfolio Auditor",
    "8. Developer Comparison",
    "9. Career Simulator"
]

selected_page = st.sidebar.radio("Platform Analytics Pages", pages, index=0)

st.sidebar.markdown("---")

# Power BI Exporter Button
if st.sidebar.button("📊 Export Power BI Data Mart"):
    exporter = PowerBIExportMart()
    exported = exporter.export_all(
        user_meta=data_payload["user"],
        developer_metrics=data_payload["scores"],
        repos_df=data_payload["repos"],
        languages_df=data_payload["languages"],
        commits_df=data_payload["commits"],
        career_predictions=data_payload["career_recs"],
        peer_benchmarks=data_payload["benchmarks"]
    )
    st.sidebar.success("6 Power BI CSVs Generated in data/processed/powerbi/")

st.sidebar.markdown("""
<div style="font-size: 0.76rem; color: #64748B; margin-top: 15px;">
    <strong>API Status:</strong> Cached & Safe<br>
    <strong>Engine:</strong> Scikit-learn + Plotly + SQLite<br>
    <strong>Version:</strong> 2.0 Production
</div>
""", unsafe_allow_html=True)

# =====================================================================
# MAIN PAGE ROUTING
# =====================================================================
if selected_page == "1. Executive Overview":
    render_overview(data_payload)
elif selected_page == "2. Technology DNA":
    render_technology_dna(data_payload)
elif selected_page == "3. Developer Activity":
    render_activity(data_payload)
elif selected_page == "4. Repository Intelligence":
    render_repositories(data_payload)
elif selected_page == "5. Career Intelligence":
    render_career(data_payload)
elif selected_page == "6. Developer Archetype":
    render_archetype(data_payload)
elif selected_page == "7. Portfolio Auditor":
    render_portfolio(data_payload)
elif selected_page == "8. Developer Comparison":
    render_comparison(data_payload)
elif selected_page == "9. Career Simulator":
    render_simulator(data_payload)

# =====================================================================
# ETHICAL & RESPONSIBLE ANALYTICS FOOTER
# =====================================================================
st.markdown("""
<div class="disclaimer-banner">
    <strong>⚖️ Responsible Analytics & Methodological Disclaimer:</strong><br>
    This platform evaluates publicly available GitHub repository, language, and commit activity to compute empirical proxy indicators and machine learning scenario estimates. It does not measure innate programming talent, general intelligence, or employment fitness with certainty. Metrics should be used for developer self-reflection, skill path planning, and portfolio enhancement.
</div>
""", unsafe_allow_html=True)
