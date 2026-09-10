import streamlit as st
from visualization.plotly_charts import PlotlyChartBuilder

def render_overview(data: dict):
    user = data["user"]
    scores = data["scores"]
    growth = data["growth"]
    archetype = data["archetype"]
    career_recs = data["career_recs"]

    # Header section with Profile Bio
    col_av, col_bio = st.columns([1, 4])
    with col_av:
        if user.get("avatar_url"):
            st.image(user["avatar_url"], width=120)
    with col_bio:
        st.markdown(f"## {user.get('name', user.get('username'))}")
        st.markdown(f"**@{user.get('username')}** • *{user.get('location', 'Global')}* • {user.get('company', 'Independent Contributor')}")
        if user.get("bio"):
            st.markdown(f"> *{user.get('bio')}*")
        
        # Tags / Badges
        b1 = f'<span class="hero-badge badge-blue">Score: {scores["overall_score"]}/100</span>'
        b2 = f'<span class="hero-badge badge-purple">{archetype["title"]}</span>'
        b3 = f'<span class="hero-badge badge-green">Trajectory: {growth["velocity_tier"]}</span>'
        st.markdown(f"{b1} &nbsp; {b2} &nbsp; {b3}", unsafe_allow_html=True)

    st.markdown("---")

    # 4 KPI Cards
    k1, k2, k3, k4 = st.columns(4)
    with k1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Developer Intelligence</div>
            <div class="metric-value" style="color: #60A5FA;">{scores['overall_score']}</div>
            <div class="metric-subtext">Composite 6D Index</div>
        </div>
        """, unsafe_allow_html=True)
    with k2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Growth Velocity</div>
            <div class="metric-value" style="color: #34D399;">{growth['growth_velocity_score']}</div>
            <div class="metric-subtext">{growth['momentum']}</div>
        </div>
        """, unsafe_allow_html=True)
    with k3:
        top_role = career_recs[0]["role_name"] if career_recs else "Software Engineer"
        top_fit = career_recs[0]["fit_percentage"] if career_recs else 75
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Top Career Fit</div>
            <div class="metric-value" style="color: #A78BFA; font-size: 1.6rem;">{top_fit}%</div>
            <div class="metric-subtext">{top_role}</div>
        </div>
        """, unsafe_allow_html=True)
    with k4:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Consistency Index</div>
            <div class="metric-value" style="color: #FBBF24;">{scores['consistency']}</div>
            <div class="metric-subtext">Active Cadence & Streak</div>
        </div>
        """, unsafe_allow_html=True)

    # 2-Column: Digital Twin Radar & Dimension Breakdown
    c_rad, c_break = st.columns([1.1, 0.9])
    with c_rad:
        st.subheader("Developer Digital Twin")
        st.caption("Multi-dimensional analytical fingerprint of technical capability.")
        fig_radar = PlotlyChartBuilder.create_digital_twin_radar(scores)
        st.plotly_chart(fig_radar, use_container_width=True)

    with c_break:
        st.subheader("Dimension Scorecard")
        st.caption("Empirical signals derived from repository, commit, and stack telemetry.")
        dims = [
            ("Technical Depth", scores["technical_depth"], "#3B82F6"),
            ("Technical Breadth", scores["technical_breadth"], "#10B981"),
            ("Consistency Index", scores["consistency"], "#F59E0B"),
            ("Project Complexity", scores["project_complexity"], "#8B5CF6"),
            ("Collaboration", scores["collaboration"], "#EC4899"),
            ("Adaptability", scores["adaptability"], "#06B6D4")
        ]
        for name, val, col in dims:
            st.markdown(f"**{name}**: `{val}/100`")
            st.progress(int(val) / 100.0)

    # Data Storytelling Callout
    st.markdown(f"""
    <div class="story-box">
        <div class="story-header">Analytical Insight • What Does This Mean?</div>
        <div class="story-text">
            {growth['narrative']}
            The developer's profile clusters firmly under <strong>{archetype['title']}</strong>, 
            backed by an empirical Technical Depth of {scores['technical_depth']}/100 and Project Complexity score of {scores['project_complexity']}/100.
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Strengths and Development Opportunities
    col_str, col_opp = st.columns(2)
    with col_str:
        st.markdown("### Key Technical Strengths")
        for s in scores.get("strengths", []):
            st.markdown(f"✅ {s}")
    with col_opp:
        st.markdown("### Growth Opportunities")
        for w in scores.get("weaknesses", []):
            st.markdown(f"💡 {w}")
