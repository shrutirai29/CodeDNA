import streamlit as st
import pandas as pd
from visualization.plotly_charts import PlotlyChartBuilder
from ingestion.sample_profiles import SAMPLE_PROFILES, get_sample_profile
from analytics.developer_score import DeveloperIntelligenceScorer
from analytics.complexity import ProjectComplexityAnalyzer
from analytics.consistency import DeveloperConsistencyAnalyzer
from analytics.portfolio_auditor import PortfolioAuditor

def _compute_profile_summary(profile_data: dict) -> dict:
    user = profile_data["user"]
    repos_df = pd.DataFrame(profile_data["repositories"])
    
    # Flatten languages
    lang_records = []
    for idx, r in enumerate(profile_data["repositories"]):
        ld = r.get("languages", {})
        for lname, bcount in ld.items():
            lang_records.append({"repo_id": idx, "language_name": lname, "bytes_count": bcount})
    langs_df = pd.DataFrame(lang_records)

    # Commits
    from ingestion.sample_profiles import _generate_synthetic_commits
    commits_list = []
    for idx, r in enumerate(profile_data["repositories"]):
        c_list = _generate_synthetic_commits(r["repo_name"], r.get("primary_language", "Python"), 24, r.get("commits_density", "medium"))
        for c in c_list:
            c["repo_id"] = idx
            commits_list.append(c)
    commits_df = pd.DataFrame(commits_list)
    prs_df = pd.DataFrame()

    scores = DeveloperIntelligenceScorer.compute_scores(user, repos_df, langs_df, commits_df, prs_df)
    portfolio = PortfolioAuditor.audit_portfolio(repos_df)

    return {
        "user": user,
        "scores": scores,
        "portfolio": portfolio,
        "repos_df": repos_df,
        "langs_df": langs_df
    }

def render_comparison(current_data: dict):
    st.title("Developer vs. Developer Comparative Analysis")
    st.caption("Normalized side-by-side benchmark highlighting complementary engineering strengths without subjective ranking.")

    # Select Developer B to compare against
    sample_keys = list(SAMPLE_PROFILES.keys())
    current_username = current_data["user"].get("username", "alex-datascientist")
    other_keys = [k for k in sample_keys if k != current_username]
    if not other_keys:
        other_keys = sample_keys

    st.subheader("Select Comparison Profile")
    dev_b_key = st.selectbox("Benchmark against developer:", other_keys, index=0)

    # Compute Developer B metrics
    profile_b = get_sample_profile(dev_b_key)
    summary_b = _compute_profile_summary(profile_b)

    dev_a_name = current_data["user"].get("name", current_username)
    dev_b_name = summary_b["user"].get("name", dev_b_key)

    scores_a = current_data["scores"]
    scores_b = summary_b["scores"]

    # Comparative Head-to-Head Radar
    st.subheader("Normalized Competency Footprint")
    fig_comp = PlotlyChartBuilder.create_head_to_head_comparison(scores_a, scores_b, dev_a_name, dev_b_name)
    st.plotly_chart(fig_comp, use_container_width=True)

    # Comparison metrics table
    metrics_list = [
        ("Developer Intelligence Score", "overall_score"),
        ("Technical Depth", "technical_depth"),
        ("Technical Breadth", "technical_breadth"),
        ("Consistency Index", "consistency"),
        ("Project Complexity", "project_complexity"),
        ("Collaboration", "collaboration"),
        ("Adaptability", "adaptability")
    ]

    comp_rows = []
    for label, key in metrics_list:
        val_a = scores_a.get(key, 50.0)
        val_b = scores_b.get(key, 50.0)
        diff = round(val_a - val_b, 1)
        diff_str = f"+{diff}" if diff > 0 else f"{diff}"
        comp_rows.append({
            "Dimension": label,
            f"{dev_a_name} (A)": f"{val_a}/100",
            f"{dev_b_name} (B)": f"{val_b}/100",
            "Variance (A - B)": diff_str
        })

    st.markdown("#### Dimension Variance Ledger")
    st.dataframe(pd.DataFrame(comp_rows), use_container_width=True, hide_index=True)

    st.markdown("---")

    # Strength Differentiation
    col_str_a, col_str_b = st.columns(2)
    with col_str_a:
        st.markdown(f"### Unique Strengths: {dev_a_name}")
        for label, key in metrics_list:
            if scores_a.get(key, 50) > scores_b.get(key, 50) + 5:
                st.markdown(f"⭐ **{label}**: Demonstrates higher empirical focus (+{round(scores_a[key]-scores_b[key], 1)} pts).")
    with col_str_b:
        st.markdown(f"### Unique Strengths: {dev_b_name}")
        for label, key in metrics_list:
            if scores_b.get(key, 50) > scores_a.get(key, 50) + 5:
                st.markdown(f"⭐ **{label}**: Demonstrates higher empirical focus (+{round(scores_b[key]-scores_a[key], 1)} pts).")
