import streamlit as st
import pandas as pd
from visualization.plotly_charts import PlotlyChartBuilder
from analytics.eda_stats import EDAStatisticalAnalyzer

def render_activity(data: dict):
    commits_df = data["commits"]
    consistency = data["consistency_data"]

    st.title("Developer Activity & Cadence")
    st.caption("Temporal commit velocity, streaks, active hours, and consistency analytics.")

    # Consistency metrics row
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Consistency Index</div>
            <div class="metric-value" style="color: #60A5FA;">{consistency['consistency_index']}</div>
            <div class="metric-subtext">Anti-burstiness adjusted</div>
        </div>
        """, unsafe_allow_html=True)
    with c2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Longest Streak</div>
            <div class="metric-value" style="color: #34D399;">{consistency['longest_streak_days']} <span style="font-size: 1rem; color: #94A3B8;">days</span></div>
            <div class="metric-subtext">Current: {consistency['current_streak_days']} days</div>
        </div>
        """, unsafe_allow_html=True)
    with c3:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Active Months</div>
            <div class="metric-value" style="color: #A78BFA;">{consistency['active_months_count']}</div>
            <div class="metric-subtext">{consistency['active_weeks_count']} distinct weeks</div>
        </div>
        """, unsafe_allow_html=True)
    with c4:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Volatility CV</div>
            <div class="metric-value" style="color: #FBBF24;">{consistency['volatility_cv']}</div>
            <div class="metric-subtext">Dispersion coefficient</div>
        </div>
        """, unsafe_allow_html=True)

    # Narrative callout
    st.markdown(f"""
    <div class="story-box">
        <div class="story-header">Cadence Evaluation • What Does This Mean?</div>
        <div class="story-text">{consistency['narrative']}</div>
    </div>
    """, unsafe_allow_html=True)

    # Commit Timeline
    st.subheader("Longitudinal Contribution Velocity")
    fig_time = PlotlyChartBuilder.create_commit_timeline(commits_df)
    st.plotly_chart(fig_time, use_container_width=True)

    # Punchcard Heatmap & Timing Stats
    st.subheader("Coding Habits & Timing Analysis")
    col_punch, col_stats = st.columns([1.2, 0.8])

    timing_stats = EDAStatisticalAnalyzer.analyze_commit_timing(commits_df)

    with col_punch:
        fig_punch = PlotlyChartBuilder.create_punchcard_heatmap(commits_df)
        st.plotly_chart(fig_punch, use_container_width=True)

    with col_stats:
        st.markdown("#### Work Rhythm Profile")
        st.markdown(f"- **Peak Activity Day:** `{timing_stats['peak_day']}`")
        st.markdown(f"- **Peak Hour:** `{timing_stats['peak_hour']:02d}:00`")
        st.markdown(f"- **Business Hours Ratio:** `{timing_stats['business_hours_ratio']*100:.1f}%`")
        st.markdown(f"- **Weekend Activity:** `{timing_stats['weekend_ratio']*100:.1f}%`")
        st.markdown(f"- **Night Owl Ratio (10pm-5am):** `{timing_stats['night_owl_ratio']*100:.1f}%`")
        
        if timing_stats['business_hours_ratio'] > 0.65:
            st.info("🕒 Profile follows disciplined business-hours development.")
        elif timing_stats['weekend_ratio'] > 0.35:
            st.info("🌙 Strong weekend and personal-project contributor pattern.")
        else:
            st.info("⚖️ Balanced cadence across workdays and evenings.")
