import streamlit as st
import pandas as pd
from visualization.plotly_charts import PlotlyChartBuilder

def render_archetype(data: dict):
    archetype = data["archetype"]
    benchmarks = data["benchmarks"]
    scores = data["scores"]

    st.title("Developer Archetype & Peer Benchmarking")
    st.caption("Unsupervised Scikit-Learn KMeans clustering and PCA 2D dimensional projection.")

    # Hero Archetype Card
    badge_style = f"background: {archetype['badge_color']}22; color: {archetype['badge_color']}; border: 1px solid {archetype['badge_color']};"
    st.markdown(f"""
    <div class="content-card" style="border-left: 5px solid {archetype['badge_color']};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h2 style="margin: 0; color: #F8FAFC;">{archetype['title']}</h2>
            <span style="padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; {badge_style}">Cluster Centroid Distance: {archetype['confidence_distance']}</span>
        </div>
        <p style="font-size: 1.05rem; line-height: 1.6; color: #CBD5E1;">{archetype['description']}</p>
    </div>
    """, unsafe_allow_html=True)

    # PCA 2D Cluster Map
    st.subheader("Behavioral Archetype Space (PCA Projection)")
    st.caption("Dimensionality reduction maps the developer's 7-dimensional feature vector into a 2D coordinate system alongside peer archetype centroids.")
    fig_pca = PlotlyChartBuilder.create_archetype_pca_scatter(
        dev_coords=archetype["developer_coords_2d"],
        peer_points=archetype["archetype_points_2d"],
        current_archetype=archetype["archetype"]
    )
    st.plotly_chart(fig_pca, use_container_width=True)

    st.markdown("---")

    # Peer Cohort Benchmarking
    st.subheader("Peer Cohort Percentile Benchmarking")
    st.caption("Percentile ranks calculated within the analyzed peer cohort dataset.")

    p_cols = st.columns(3)
    metrics_to_show = [
        ("Technical Depth", "technical_depth"),
        ("Technical Breadth", "technical_breadth"),
        ("Consistency", "consistency"),
        ("Project Complexity", "project_complexity"),
        ("Collaboration", "collaboration"),
        ("Adaptability", "adaptability")
    ]

    percentiles = benchmarks.get("percentiles", {})
    for idx, (label, key) in enumerate(metrics_to_show):
        pct = percentiles.get(key, 50.0)
        with p_cols[idx % 3]:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-label">{label}</div>
                <div class="metric-value" style="color: #60A5FA;">Top {100 - int(pct)}%</div>
                <div class="metric-subtext">Higher than {int(pct)}% of cohort peers</div>
            </div>
            """, unsafe_allow_html=True)

    # Narrative callouts
    st.markdown("#### Peer Analysis Highlights")
    for nar in benchmarks.get("top_percentile_narratives", []):
        st.markdown(f"🌟 **{nar}**")

    st.caption(f"ℹ️ {benchmarks.get('disclaimer', '')}")
