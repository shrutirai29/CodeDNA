import streamlit as st
import pandas as pd
from visualization.plotly_charts import PlotlyChartBuilder
from analytics.project_story import ProjectStoryGenerator

def render_repositories(data: dict):
    repos_df = data["repos"]
    languages_df = data["languages"]
    complexity_info = data["complexity_info"]

    st.title("Repository Intelligence & Project Stories")
    st.caption("Deep inspection of architectural complexity, project lifecycles, and analytical case studies.")

    # Complexity overview row
    r1, r2, r3, r4 = st.columns(4)
    with r1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Avg Project Complexity</div>
            <div class="metric-value" style="color: #60A5FA;">{complexity_info['avg_complexity']}/100</div>
            <div class="metric-subtext">Dominant: {complexity_info['dominant_tier']}</div>
        </div>
        """, unsafe_allow_html=True)
    with r2:
        total_stars = int(repos_df["stargazers_count"].sum()) if not repos_df.empty else 0
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Total Stargazers</div>
            <div class="metric-value" style="color: #FBBF24;">{total_stars}</div>
            <div class="metric-subtext">Community stars earned</div>
        </div>
        """, unsafe_allow_html=True)
    with r3:
        total_forks = int(repos_df["forks_count"].sum()) if not repos_df.empty else 0
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Total Forks</div>
            <div class="metric-value" style="color: #34D399;">{total_forks}</div>
            <div class="metric-subtext">Downstream repositories</div>
        </div>
        """, unsafe_allow_html=True)
    with r4:
        ci_count = repos_df["has_ci"].sum() if not repos_df.empty and "has_ci" in repos_df.columns else 0
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">CI/CD Automation</div>
            <div class="metric-value" style="color: #A78BFA;">{ci_count}/{len(repos_df)}</div>
            <div class="metric-subtext">Pipelines active</div>
        </div>
        """, unsafe_allow_html=True)

    # Complexity vs Stargazers Chart
    st.subheader("Architecture Complexity vs Community Validation")
    st.caption("Bubble size corresponds to codebase size (MB); color corresponds to primary language.")
    fig_scatter = PlotlyChartBuilder.create_complexity_scatter(repos_df)
    st.plotly_chart(fig_scatter, use_container_width=True)

    st.markdown("---")

    # Project Story Generator
    st.subheader("Project Stories (Automated Empirical Vignettes)")
    st.caption("Analytical breakdown of lifecycle patterns, contribution dynamics, and portfolio showcase value.")

    stories = ProjectStoryGenerator.generate_stories(repos_df, languages_df)

    if stories:
        for s in stories:
            badge_color = "#3B82F6" if s["complexity"] in ("High", "Very High") else "#10B981"
            st.markdown(f"""
            <div class="content-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h3 style="margin: 0; color: #F8FAFC;">{s['title']}</h3>
                    <span style="padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; background: {badge_color}22; color: {badge_color}; border: 1px solid {badge_color};">Complexity: {s['complexity']}</span>
                </div>
                <p style="color: #94A3B8; font-style: italic; margin-bottom: 12px;">{s['description']}</p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; font-size: 0.88rem; color: #E2E8F0;">
                    <div><strong>Tech Stack:</strong> {', '.join(s['technologies'])}</div>
                    <div><strong>Active Timeframe:</strong> {s['timeframe']}</div>
                    <div><strong>Stars / Forks:</strong> ⭐ {s['stars']} &nbsp; 🍴 {s['forks']}</div>
                </div>
                <div style="margin-top: 10px; font-size: 0.88rem;">
                    <div><strong>Development Pattern:</strong> {s['development_pattern']}</div>
                    <div><strong>Contribution Model:</strong> {s['contribution_pattern']}</div>
                    <div style="margin-top: 6px; color: #60A5FA;"><strong>Portfolio Recommendation:</strong> {s['portfolio_recommendation']}</div>
                </div>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("No repository stories generated.")
