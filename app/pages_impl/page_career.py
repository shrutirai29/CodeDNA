import streamlit as st
import pandas as pd
from visualization.plotly_charts import PlotlyChartBuilder

def render_career(data: dict):
    career_recs = data["career_recs"]

    st.title("Career Intelligence & Skill Gap Analyzer")
    st.caption("Vector space cosine similarity matching across 8 industry roles and empirical skill gap breakdown.")

    # Story box
    st.markdown("""
    <div class="story-box">
        <div class="story-header">Model Guidance Note</div>
        <div class="story-text">
            Career readiness scores represent mathematical vector space cosine similarities between your detected codebase footprint and standardized industry role competency matrices. These are objective model estimates, not employment guarantees.
        </div>
    </div>
    """, unsafe_allow_html=True)

    # Top Rankings Overview
    st.subheader("Industry Role Alignment Rankings")
    
    col_cards = st.columns(min(4, len(career_recs)))
    for i in range(min(4, len(career_recs))):
        rec = career_recs[i]
        with col_cards[i]:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-label">Rank #{rec['rank']}</div>
                <div style="font-size: 1.1rem; font-weight: 700; color: #F8FAFC; margin-bottom: 4px;">{rec['role_name']}</div>
                <div class="metric-value" style="color: #38BDF8; font-size: 1.8rem;">{rec['fit_percentage']}%</div>
                <div class="metric-subtext">Estimated role alignment</div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown("---")

    # Role Selector & Deep Dive
    st.subheader("Deep Dive: Role Competency & Skill Gaps")
    role_names = [r["role_name"] for r in career_recs]
    selected_role = st.selectbox("Select Target Role to Inspect:", role_names, index=0)

    role_data = next((r for r in career_recs if r["role_name"] == selected_role), career_recs[0])

    col_rad, col_gaps = st.columns([1.1, 0.9])

    with col_rad:
        st.markdown(f"#### {selected_role} Competency Radar")
        fig_radar = PlotlyChartBuilder.create_career_radar(
            labels=role_data["radar_labels"],
            current_vals=role_data["radar_values"]
        )
        st.plotly_chart(fig_radar, use_container_width=True)

    with col_gaps:
        st.markdown("#### Competency Breakdown")
        
        st.markdown("**Evidenced Core Skills:**")
        if role_data["strong_skills"]:
            for s in role_data["strong_skills"]:
                st.markdown(f"🟢 `{s}` (Demonstrated in code repositories)")
        else:
            st.markdown("*Core foundational skills still emerging in public repositories.*")

        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("**Identified Skill Gaps:**")
        if role_data["skill_gaps"]:
            for g in role_data["skill_gaps"]:
                st.markdown(f"🔴 `{g}` (Limited or no repository evidence detected)")
        else:
            st.markdown("✅ *No major core skill gaps detected for this role.*")

        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("**Priority Next Skills to Learn:**")
        for rec_s in role_data["recommended_skills"]:
            st.markdown(f"⚡ **{rec_s}** • *High transferability to {selected_role} workflows*")
