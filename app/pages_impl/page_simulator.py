import streamlit as st
from ml.skill_simulator import SkillPathSimulator
from ml.career_recommender import CareerRecommender
from visualization.plotly_charts import PlotlyChartBuilder

def render_simulator(data: dict):
    languages_df = data["languages"]
    repos_df = data["repos"]
    career_recs = data["career_recs"]

    st.title("Interactive Career Path Simulator")
    st.caption("Hypothetical scenario simulator: Select target career paths and test the impact of learning new technologies.")

    # Target Role Selection
    role_names = [r["role_name"] for r in career_recs]
    selected_role = st.selectbox("Select Target Career Track:", role_names, index=0)

    role_data = next((r for r in career_recs if r["role_name"] == selected_role), career_recs[0])
    baseline_fit = role_data["fit_percentage"]

    # Candidate skills to simulate learning
    all_available_skills = [
        "SQL", "Docker", "Kubernetes", "PyTorch", "FastAPI", "Terraform",
        "React", "TypeScript", "Go", "Rust", "CI/CD", "Machine Learning",
        "Transformers", "Data Visualization", "PostgreSQL", "Statistics"
    ]
    # Filter out skills already strong
    strong_set = set(role_data.get("strong_skills", []))
    learnable_skills = [s for s in all_available_skills if s not in strong_set]

    st.markdown("#### Scenario Sandbox: What If You Learn...")
    selected_skills = st.multiselect(
        "Select skills to hypothetically acquire:",
        learnable_skills,
        default=[s for s in role_data.get("recommended_skills", [])[:2] if s in learnable_skills]
    )

    # Run Simulation
    sim_result = SkillPathSimulator.simulate_skill_acquisition(
        target_role=selected_role,
        acquired_skills=selected_skills,
        languages_df=languages_df,
        repos_df=repos_df
    )

    # Simulated Results KPI row
    s1, s2, s3 = st.columns(3)
    with s1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Current Baseline Fit</div>
            <div class="metric-value" style="color: #94A3B8;">{sim_result['baseline_fit']}%</div>
            <div class="metric-subtext">Present portfolio evidence</div>
        </div>
        """, unsafe_allow_html=True)
    with s2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Projected Role Fit</div>
            <div class="metric-value" style="color: #34D399;">{sim_result['simulated_fit']}%</div>
            <div class="metric-subtext">With simulated skills</div>
        </div>
        """, unsafe_allow_html=True)
    with s3:
        delta = sim_result['delta_increase']
        delta_color = "#10B981" if delta > 0 else "#94A3B8"
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Projected Lift</div>
            <div class="metric-value" style="color: {delta_color};">+{delta}%</div>
            <div class="metric-subtext">Net readiness delta</div>
        </div>
        """, unsafe_allow_html=True)

    # Narrative callout
    st.markdown(f"""
    <div class="story-box">
        <div class="story-header">Simulation Projection • What Does This Mean?</div>
        <div class="story-text">{sim_result['narrative']}</div>
    </div>
    """, unsafe_allow_html=True)

    # Simulated Radar Chart
    st.subheader("Competency Radar Delta")
    st.caption("Solid blue = Current baseline; Dashed green = Projected competency with acquired skills.")
    fig_sim_radar = PlotlyChartBuilder.create_career_radar(
        labels=sim_result["radar_labels"],
        current_vals=sim_result["baseline_radar"],
        simulated_vals=sim_result["simulated_radar"]
    )
    st.plotly_chart(fig_sim_radar, use_container_width=True)

    st.caption(f"⚠️ {sim_result['disclaimer']}")
