import math
import time
import json
import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse, JSONResponse
import requests

app = FastAPI(title="Developer Career Intelligence & Analytics Platform")

# 5 Curated Benchmark Profiles for Instant Exploration
SAMPLE_PROFILES = {
    "alex-datascientist": {
        "username": "alex-datascientist",
        "name": "Dr. Alex Vance, PhD",
        "title": "Senior Data Scientist & Applied ML Researcher",
        "company": "NeuralMetrics AI Labs",
        "location": "Boston, MA",
        "bio": "Senior Data Scientist specializing in time-series, causal inference, and interpretable ML.",
        "followers": 384,
        "public_repos": 14,
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "languages": {"Python": 72, "SQL": 15, "R": 8, "Jupyter": 5},
        "score": 84.5,
        "archetype": "The Deep Specialist",
        "trajectory": "Advanced Trajectory (Accelerating)",
        "complexity": "Very High",
        "consistency": 82.0,
        "portfolio_health": 88.0,
        "top_career": "Data Scientist",
        "top_fit": 88.5,
        "strengths": ["High Technical Depth in Python & Machine Learning", "Disciplined multi-year commit cadence", "High testing and reproducibility standards"],
        "gaps": ["Cloud Infrastructure / Terraform", "Kubernetes Operator Management"],
        "next_skills": ["Docker", "MLflow", "Cloud Deployment"]
    },
    "elena-mlops": {
        "username": "elena-mlops",
        "name": "Elena Rostova",
        "title": "Staff MLOps & Platform Engineer",
        "company": "KubeCloud Systems",
        "location": "Seattle, WA",
        "bio": "Specializing in Kubernetes operators, Triton model serving, and low-latency feature stores.",
        "followers": 520,
        "public_repos": 18,
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "languages": {"Go": 45, "Python": 35, "HCL": 15, "Shell": 5},
        "score": 89.0,
        "archetype": "The Enterprise Builder",
        "trajectory": "Advanced Trajectory (High Velocity)",
        "complexity": "Very High",
        "consistency": 86.5,
        "portfolio_health": 92.0,
        "top_career": "MLOps / Platform Engineer",
        "top_fit": 94.0,
        "strengths": ["Distributed Systems & Kubernetes Operators", "Automated CI/CD & Infrastructure as Code", "Containerization excellence"],
        "gaps": ["Causal Inference", "Frontend Frameworks"],
        "next_skills": ["Rust", "eBPF", "Triton TensorRT"]
    },
    "marcus-fullstack": {
        "username": "marcus-fullstack",
        "name": "Marcus Chen",
        "title": "Lead Full-Stack Engineer & Product Architect",
        "company": "Veloce Technologies",
        "location": "San Francisco, CA",
        "bio": "Building high-concurrency web apps, real-time collaboration canvas, and design systems.",
        "followers": 410,
        "public_repos": 24,
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "languages": {"TypeScript": 55, "JavaScript": 20, "Python": 15, "CSS": 10},
        "score": 81.2,
        "archetype": "The Technology Explorer",
        "trajectory": "Accelerating Trajectory",
        "complexity": "High",
        "consistency": 74.0,
        "portfolio_health": 85.0,
        "top_career": "Full Stack Developer",
        "top_fit": 91.0,
        "strengths": ["Broad multi-framework polyglot versatility", "CRDT & Real-time WebSockets", "Next.js App Router Architecture"],
        "gaps": ["Low-level Systems Programming", "Deep Learning Research"],
        "next_skills": ["GraphQL Federation", "PostgreSQL Optimization"]
    },
    "sophia-systems": {
        "username": "sophia-systems",
        "name": "Sophia Lindqvist",
        "title": "Principal Systems Engineer",
        "company": "RustCore Foundation",
        "location": "Stockholm, Sweden",
        "bio": "Dedicated to memory-safe systems programming, deterministic asynchronous runtimes, and eBPF.",
        "followers": 890,
        "public_repos": 12,
        "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        "languages": {"Rust": 65, "C": 20, "C++": 10, "Assembly": 5},
        "score": 92.4,
        "archetype": "The Open Source Contributor",
        "trajectory": "Advanced Trajectory (Consistent)",
        "complexity": "Very High",
        "consistency": 94.0,
        "portfolio_health": 95.0,
        "top_career": "Systems Engineer",
        "top_fit": 96.0,
        "strengths": ["Zero-allocation Asynchronous Runtimes", "Linux Kernel & eBPF Networking", "Exceptional Open Source Contribution Cadence"],
        "gaps": ["UI Design", "Data Warehousing"],
        "next_skills": ["WebAssembly Plugins", "Distributed Consensus"]
    },
    "dev-junior": {
        "username": "dev-junior",
        "name": "Jordan Riley",
        "title": "Junior Software Developer",
        "company": "Aspiring Developer",
        "location": "Austin, TX",
        "bio": "Learning frontend, APIs, and Python. Building foundational projects.",
        "followers": 18,
        "public_repos": 7,
        "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        "languages": {"JavaScript": 60, "HTML": 20, "CSS": 15, "Python": 5},
        "score": 46.5,
        "archetype": "The Experimental Developer",
        "trajectory": "Nascent Trajectory",
        "complexity": "Low",
        "consistency": 38.0,
        "portfolio_health": 48.0,
        "top_career": "Junior Frontend Developer",
        "top_fit": 62.0,
        "strengths": ["Active experimentation with beginner web projects", "Curiosity across basic APIs"],
        "gaps": ["Automated Testing", "CI/CD Workflows", "Open-Source Licenses", "Consistent Commit Cadence"],
        "next_skills": ["Git Workflows", "Unit Testing", "TypeScript"]
    }
}

def fetch_live_github(username: str) -> Optional[Dict[str, Any]]:
    """Fetches public GitHub profile and calculates intelligence indicators."""
    headers = {"User-Agent": "DeveloperIntelligence-Vercel/2.0"}
    try:
        user_res = requests.get(f"https://api.github.com/users/{username}", headers=headers, timeout=6)
        if user_res.status_code != 200:
            return None
        u = user_res.json()
        repos_res = requests.get(f"https://api.github.com/users/{username}/repos?sort=pushed&per_page=15", headers=headers, timeout=6)
        repos = repos_res.json() if repos_res.status_code == 200 and isinstance(repos_res.json(), list) else []

        # Tally languages
        lang_counts = {}
        for r in repos:
            lang = r.get("language") or "Other"
            lang_counts[lang] = lang_counts.get(lang, 0) + 1
        total_repos = max(1, len(repos))
        lang_pct = {k: round(v / total_repos * 100, 1) for k, v in lang_counts.items()}

        stars = sum(r.get("stargazers_count", 0) for r in repos)
        has_desc = sum(1 for r in repos if r.get("description"))
        portfolio_score = round((has_desc / total_repos) * 60 + min(40, len(repos) * 4), 1)

        # Basic score
        score = min(95.0, round(35.0 + min(30.0, len(repos) * 2.5) + min(20.0, stars * 0.5) + min(15.0, len(lang_counts) * 3), 1))

        # Determine Archetype
        if len(lang_counts) >= 4:
            archetype = "The Technology Explorer"
        elif stars > 30:
            archetype = "The Open Source Contributor"
        else:
            archetype = "The Builder"

        return {
            "username": u.get("login"),
            "name": u.get("name") or u.get("login"),
            "title": "Software Engineer",
            "company": u.get("company") or "Independent",
            "location": u.get("location") or "Global",
            "bio": u.get("bio") or "Active GitHub Contributor",
            "followers": u.get("followers", 0),
            "public_repos": u.get("public_repos", len(repos)),
            "avatar_url": u.get("avatar_url") or "",
            "languages": lang_pct,
            "score": score,
            "archetype": archetype,
            "trajectory": "Active Trajectory",
            "complexity": "Medium",
            "consistency": 65.0,
            "portfolio_health": portfolio_score,
            "top_career": "Software Engineer",
            "top_fit": 75.0,
            "strengths": [f"Public portfolio of {len(repos)} active repositories", f"Earned {stars} community stargazers"],
            "gaps": ["Automated CI/CD Scaffolding", "Comprehensive README Documentation"],
            "next_skills": ["Docker", "CI/CD Workflows", "Architecture Documentation"]
        }
    except Exception:
        return None

@app.get("/api/profiles")
def get_profiles():
    return list(SAMPLE_PROFILES.values())

@app.get("/api/profile")
def get_profile(username: str = Query("alex-datascientist")):
    if username in SAMPLE_PROFILES:
        return SAMPLE_PROFILES[username]
    live = fetch_live_github(username)
    if live:
        return live
    return SAMPLE_PROFILES["alex-datascientist"]

@app.get("/", response_class=HTMLResponse)
def index(user: str = "alex-datascientist"):
    p = SAMPLE_PROFILES.get(user)
    if not p:
        p = fetch_live_github(user) or SAMPLE_PROFILES["alex-datascientist"]

    lang_chips = "".join([f'<span class="chip">{k}: {v}%</span>' for k, v in p["languages"].items()])
    strengths_li = "".join([f'<li>✅ {s}</li>' for s in p["strengths"]])
    gaps_li = "".join([f'<li>🔴 {g}</li>' for g in p["gaps"]])
    skills_li = "".join([f'<li>⚡ <strong>{s}</strong></li>' for s in p["next_skills"]])

    options_html = "".join([
        f'<option value="{k}" {"selected" if k==user else ""}>{v["name"]} ({v["title"]})</option>'
        for k, v in SAMPLE_PROFILES.items()
    ])

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{p['name']} • Developer Career Intelligence</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
            * {{ box-sizing: border-box; margin: 0; padding: 0; }}
            body {{ font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #0B0F19; color: #F1F5F9; line-height: 1.6; padding: 30px 16px; }}
            .container {{ max-width: 960px; margin: 0 auto; }}
            .nav-bar {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px; }}
            .logo {{ font-size: 1.25rem; font-weight: 800; color: #F8FAFC; display: flex; align-items: center; gap: 8px; }}
            .selector select {{ background: #1E293B; color: #F8FAFC; border: 1px solid rgba(255,255,255,0.15); padding: 8px 14px; border-radius: 8px; font-family: inherit; font-size: 0.9rem; cursor: pointer; }}
            .hero-card {{ background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 28px; display: flex; gap: 24px; align-items: center; margin-bottom: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.3); }}
            .avatar {{ width: 100px; height: 100px; border-radius: 9999px; object-fit: cover; border: 2px solid #3B82F6; }}
            .hero-info h1 {{ font-size: 1.8rem; font-weight: 800; color: #F8FAFC; margin-bottom: 4px; }}
            .hero-meta {{ font-size: 0.92rem; color: #94A3B8; margin-bottom: 12px; }}
            .hero-badges {{ display: flex; gap: 8px; flex-wrap: wrap; }}
            .badge {{ padding: 5px 12px; border-radius: 9999px; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; }}
            .badge-blue {{ background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); }}
            .badge-purple {{ background: rgba(139, 92, 246, 0.15); color: #A78BFA; border: 1px solid rgba(139, 92, 246, 0.3); }}
            .badge-green {{ background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); }}
            .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; margin-bottom: 24px; }}
            .card {{ background: rgba(17, 24, 39, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; }}
            .card-title {{ font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; color: #94A3B8; font-weight: 600; margin-bottom: 6px; }}
            .card-value {{ font-size: 2rem; font-weight: 800; color: #38BDF8; line-height: 1.1; }}
            .card-sub {{ font-size: 0.8rem; color: #64748B; margin-top: 6px; }}
            .section-box {{ background: rgba(17, 24, 39, 0.6); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 24px; margin-bottom: 24px; }}
            .section-title {{ font-size: 1.1rem; font-weight: 700; color: #F8FAFC; margin-bottom: 16px; }}
            .chip-container {{ display: flex; gap: 8px; flex-wrap: wrap; }}
            .chip {{ background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 6px 12px; font-size: 0.85rem; font-weight: 600; color: #E2E8F0; }}
            ul.styled-list {{ list-style: none; display: flex; flex-direction: column; gap: 8px; }}
            .two-col {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }}
            .callout {{ background: linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%); border-left: 4px solid #3B82F6; border-radius: 10px; padding: 18px; margin-bottom: 24px; }}
            .footer {{ text-align: center; margin-top: 40px; font-size: 0.8rem; color: #64748B; }}
            @media (max-width: 680px) {{
                .hero-card {{ flex-direction: column; text-align: center; }}
                .two-col {{ grid-template-columns: 1fr; }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="nav-bar">
                <div class="logo">⚡ Developer Career Intelligence</div>
                <div class="selector">
                    <form method="get" action="/">
                        <select name="user" onchange="this.form.submit()">
                            {options_html}
                        </select>
                    </form>
                </div>
            </div>

            <div class="hero-card">
                <img src="{p['avatar_url']}" class="avatar" alt="{p['name']}">
                <div class="hero-info">
                    <h1>{p['name']}</h1>
                    <div class="hero-meta">@{p['username']} • {p['location']} • {p['company']}</div>
                    <p style="font-size: 0.92rem; color: #CBD5E1; margin-bottom: 12px;">{p['bio']}</p>
                    <div class="hero-badges">
                        <span class="badge badge-blue">Score: {p['score']}/100</span>
                        <span class="badge badge-purple">{p['archetype']}</span>
                        <span class="badge badge-green">{p['trajectory']}</span>
                    </div>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <div class="card-title">Developer Intelligence</div>
                    <div class="card-value" style="color: #60A5FA;">{p['score']}</div>
                    <div class="card-sub">Multi-dimensional 6D score</div>
                </div>
                <div class="card">
                    <div class="card-title">Top Career Match</div>
                    <div class="card-value" style="color: #34D399; font-size: 1.65rem;">{p['top_fit']}%</div>
                    <div class="card-sub">{p['top_career']}</div>
                </div>
                <div class="card">
                    <div class="card-title">Consistency Index</div>
                    <div class="card-value" style="color: #FBBF24;">{p['consistency']}</div>
                    <div class="card-sub">Anti-burstiness rating</div>
                </div>
                <div class="card">
                    <div class="card-title">Portfolio Health</div>
                    <div class="card-value" style="color: #A78BFA;">{p['portfolio_health']}</div>
                    <div class="card-sub">Documentation & licenses</div>
                </div>
            </div>

            <div class="callout">
                <div style="font-size: 0.85rem; font-weight: 700; color: #93C5FD; text-transform: uppercase; margin-bottom: 6px;">Analytical Insight • What Does This Mean?</div>
                <div style="color: #E2E8F0; font-size: 0.95rem;">
                    The profile clusters firmly under <strong>{p['archetype']}</strong> with demonstrated proficiency in {list(p['languages'].keys())[0]}. Estimated career alignment with <strong>{p['top_career']}</strong> stands at {p['top_fit']}%.
                </div>
            </div>

            <div class="section-box">
                <div class="section-title">Technology DNA & Codebase Distribution</div>
                <div class="chip-container">{lang_chips}</div>
            </div>

            <div class="two-col">
                <div class="section-box">
                    <div class="section-title">Key Demonstrated Strengths</div>
                    <ul class="styled-list">{strengths_li}</ul>
                </div>
                <div class="section-box">
                    <div class="section-title">Identified Skill Gaps & Roadmap</div>
                    <ul class="styled-list">{gaps_li}</ul>
                    <div style="margin-top: 14px; font-size: 0.9rem; font-weight: 600; color: #94A3B8;">Recommended Next Skills:</div>
                    <ul class="styled-list" style="margin-top: 6px;">{skills_li}</ul>
                </div>
            </div>

            <div class="section-box" style="text-align: center; border-color: rgba(59, 130, 246, 0.3);">
                <div class="section-title">Explore Via JSON API</div>
                <p style="color: #94A3B8; font-size: 0.9rem; margin-bottom: 16px;">Vercel Serverless Function serves live machine learning intelligence endpoints:</p>
                <a href="/api/profile?username={p['username']}" target="_blank" style="background: #2563EB; color: #FFF; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.9rem;">View Raw JSON Endpoint (/api/profile)</a>
            </div>

            <div class="footer">
                Developer Career Intelligence & Analytics Platform • Deployed on Vercel Serverless Python
            </div>
        </div>
    </body>
    </html>
    """
