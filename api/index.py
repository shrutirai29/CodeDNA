from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse, JSONResponse
import sys
from pathlib import Path

# Add root directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from database.database import DatabaseManager
from ingestion.sample_profiles import list_sample_profiles, get_sample_profile, seed_sample_profiles
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
import pandas as pd

app = FastAPI(title="Developer Career Intelligence & Analytics API")

db = DatabaseManager(str(BASE_DIR / "data" / "developer_intelligence.db"))
seed_sample_profiles(db)
clusterer = ArchetypeClusterer()

@app.get("/api/profiles")
def get_profiles():
    return list_sample_profiles()

@app.get("/api/profile")
def get_profile(username: str = Query("alex-datascientist")):
    user = db.get_user_by_username(username)
    if not user:
        return JSONResponse(status_code=404, content={"error": f"User {username} not found."})

    user_id = user["id"]
    repos = db.get_repositories(user_id)
    langs = db.get_languages(user_id)
    commits = db.get_commits(user_id)
    prs = db.execute_query("SELECT * FROM pull_requests WHERE user_id = ?", (user_id,))

    scores = DeveloperIntelligenceScorer.compute_scores(user, repos, langs, commits, prs)
    growth = GrowthVelocityAnalyzer.analyze_growth(commits, repos, langs)
    archetype = clusterer.classify_developer(scores)
    career_recs = CareerRecommender.evaluate_all_roles(langs, repos)
    portfolio = PortfolioAuditor.audit_portfolio(repos)
    benchmarks = PeerBenchmarkingEngine.calculate_percentiles(scores)

    return {
        "user": user,
        "developer_intelligence_score": scores["overall_score"],
        "archetype": archetype["title"],
        "growth_velocity_tier": growth["velocity_tier"],
        "top_career_path": career_recs[0]["role_name"] if career_recs else "Software Engineer",
        "top_career_fit_pct": career_recs[0]["fit_percentage"] if career_recs else 75,
        "dimension_scores": scores,
        "portfolio_health": portfolio["portfolio_score"],
        "peer_percentiles": benchmarks["percentiles"]
    }

@app.get("/", response_class=HTMLResponse)
def index():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Developer Career Intelligence Platform</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', sans-serif; background: #0B0F19; color: #F1F5F9; line-height: 1.6; padding: 40px 20px; }
            .container { max-width: 900px; margin: 0 auto; }
            .hero { text-align: center; margin-bottom: 40px; }
            h1 { font-size: 2.6rem; font-weight: 800; color: #F8FAFC; margin-bottom: 12px; letter-spacing: -0.02em; }
            p.lead { font-size: 1.15rem; color: #94A3B8; margin-bottom: 24px; }
            .badge-bar { display: flex; justify-content: center; gap: 10px; margin-bottom: 30px; }
            .badge { padding: 6px 14px; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 40px; }
            .card { background: rgba(17, 24, 39, 0.75); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
            .card-title { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.06em; color: #94A3B8; font-weight: 600; margin-bottom: 8px; }
            .card-value { font-size: 2.2rem; font-weight: 800; color: #38BDF8; margin-bottom: 4px; }
            .card-sub { font-size: 0.84rem; color: #64748B; }
            .callout { background: rgba(30, 41, 59, 0.6); border-left: 4px solid #3B82F6; border-radius: 10px; padding: 20px; margin-bottom: 30px; }
            .cta-bar { display: flex; justify-content: center; gap: 16px; margin-top: 20px; }
            .btn { display: inline-block; padding: 12px 24px; font-weight: 700; border-radius: 8px; text-decoration: none; font-size: 0.95rem; transition: background 0.2s; }
            .btn-primary { background: #2563EB; color: #FFF; }
            .btn-primary:hover { background: #1D4ED8; }
            .btn-secondary { background: rgba(255, 255, 255, 0.08); color: #E2E8F0; }
            .btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
            footer { text-align: center; margin-top: 50px; font-size: 0.8rem; color: #64748B; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="hero">
                <div class="badge-bar">
                    <span class="badge">Vercel Serverless Ready</span>
                    <span class="badge">Production Analytics</span>
                </div>
                <h1>Developer Career Intelligence</h1>
                <p class="lead">Machine Learning and statistical profiling for developer trajectories, skill gaps, and career readiness.</p>
                <div class="cta-bar">
                    <a href="/api/profile?username=alex-datascientist" class="btn btn-primary" target="_blank">View Live JSON Profile</a>
                    <a href="/api/profiles" class="btn btn-secondary" target="_blank">List Benchmark Personas</a>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <div class="card-title">Developer Intelligence Score</div>
                    <div class="card-value">84.2</div>
                    <div class="card-sub">Multi-dimensional empirical index</div>
                </div>
                <div class="card">
                    <div class="card-title">Primary Archetype</div>
                    <div class="card-value" style="font-size: 1.4rem; color: #A78BFA; margin-top: 8px;">The Deep Specialist</div>
                    <div class="card-sub">Scikit-learn KMeans & PCA cluster</div>
                </div>
                <div class="card">
                    <div class="card-title">Top Career Match</div>
                    <div class="card-value" style="color: #34D399;">86.4%</div>
                    <div class="card-sub">Data Scientist / ML Engineer</div>
                </div>
            </div>

            <div class="callout">
                <h3 style="color: #93C5FD; margin-bottom: 8px;">🚀 Full 9-Page Interactive Dashboard</h3>
                <p style="color: #CBD5E1; font-size: 0.95rem;">
                    For the complete 9-page interactive Streamlit experience (with live WebSockets, What-if skill simulator, and Plotly radar charts), run <code>streamlit run app/streamlit_app.py</code> or deploy with 1-click on <strong>Streamlit Community Cloud</strong>.
                </p>
            </div>

            <footer>
                Developer Career Intelligence & Analytics Platform • Powered by Scikit-learn, Plotly, SQLite & FastAPI
            </footer>
        </div>
    </body>
    </html>
    """
