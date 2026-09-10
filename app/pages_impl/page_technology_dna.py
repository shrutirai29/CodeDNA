import streamlit as st
import pandas as pd
from visualization.plotly_charts import PlotlyChartBuilder

def render_technology_dna(data: dict):
    dna = data["dna"]
    momentum = data["momentum"]
    languages_df = data["languages"]
    growth = data["growth"]

    st.title("Technology DNA & Ecosystem")
    st.caption("Deep hierarchical analysis of core technologies, ecosystem groupings, and skill momentum.")

    # Story box
    st.markdown(f"""
    <div class="story-box">
        <div class="story-header">Ecosystem Narrative • What Does This Mean?</div>
        <div class="story-text">{dna['dna_summary']}</div>
    </div>
    """, unsafe_allow_html=True)

    # 2 Columns: Sunburst chart & Primary / Supporting breakdown
    col_sun, col_table = st.columns([1.1, 0.9])
    with col_sun:
        st.subheader("Ecosystem Hierarchy")
        fig_sun = PlotlyChartBuilder.create_technology_sunburst(dna["sunburst_data"])
        st.plotly_chart(fig_sun, use_container_width=True)

    with col_table:
        st.subheader("Core vs Supporting Technologies")
        st.markdown("**Primary Technologies (Core Specialization)**")
        for p in dna.get("primary_technologies", []):
            st.markdown(f"- **{p['technology']}** (`{p['percentage']}%` of codebase) • *{p['ecosystem']}*")

        st.markdown("**Supporting Technologies**")
        for s in dna.get("supporting_technologies", []):
            st.markdown(f"- **{s['technology']}** (`{s['percentage']}%`) • *{s['ecosystem']}*")

    st.markdown("---")

    # Skill Momentum Board
    st.subheader("Skill Momentum Tracker")
    st.caption("Calculates velocity shifts using time-decayed commit activity (comparing last 6 months to prior history).")

    if momentum:
        mom_cols = st.columns(min(4, len(momentum)))
        for i, m in enumerate(momentum[:4]):
            with mom_cols[i % len(mom_cols)]:
                badge_style = f"background: {m['badge_color']}22; color: {m['badge_color']}; border: 1px solid {m['badge_color']};"
                st.markdown(f"""
                <div class="metric-card">
                    <div class="metric-label">{m['technology']}</div>
                    <div style="margin: 6px 0;"><span style="padding: 4px 10px; border-radius: 9999px; font-weight: 700; font-size: 0.8rem; {badge_style}">{m['momentum']}</span></div>
                    <div class="metric-subtext">{m['reason']}</div>
                </div>
                """, unsafe_allow_html=True)

        # Full table
        st.markdown("#### Full Skill Momentum Ledger")
        df_mom = pd.DataFrame(momentum)[["technology", "momentum", "repo_count", "days_since_push", "reason"]]
        df_mom.columns = ["Technology", "Momentum Category", "Repository Count", "Days Since Last Push", "Analytical Rationale"]
        st.dataframe(df_mom, use_container_width=True, hide_index=True)
    else:
        st.info("No skill momentum telemetry recorded.")
