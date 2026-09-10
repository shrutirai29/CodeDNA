import streamlit as st
import pandas as pd

def render_portfolio(data: dict):
    portfolio = data["portfolio"]
    metrics = portfolio["metrics"]

    st.title("Portfolio Quality Auditor")
    st.caption("Automated audit of repository documentation, license compliance, discoverability, and maintenance hygiene.")

    # Hero score row
    p1, p2, p3, p4, p5 = st.columns(5)
    with p1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Portfolio Health</div>
            <div class="metric-value" style="color: #38BDF8;">{portfolio['portfolio_score']}</div>
            <div class="metric-subtext">{portfolio['tier']}</div>
        </div>
        """, unsafe_allow_html=True)
    with p2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">README Coverage</div>
            <div class="metric-value" style="color: #34D399;">{metrics['readme_pct']}%</div>
            <div class="metric-subtext">Documentation present</div>
        </div>
        """, unsafe_allow_html=True)
    with p3:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Description %</div>
            <div class="metric-value" style="color: #60A5FA;">{metrics['desc_pct']}%</div>
            <div class="metric-subtext">Clear purpose stated</div>
        </div>
        """, unsafe_allow_html=True)
    with p4:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">License %</div>
            <div class="metric-value" style="color: #A78BFA;">{metrics['license_pct']}%</div>
            <div class="metric-subtext">Open-source compliant</div>
        </div>
        """, unsafe_allow_html=True)
    with p5:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-label">Topic Tags %</div>
            <div class="metric-value" style="color: #FBBF24;">{metrics['topics_pct']}%</div>
            <div class="metric-subtext">Discoverability tags</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")

    # Actionable prioritized recommendations
    st.subheader("Actionable Optimization Roadmap")
    st.caption("Specific, non-hallucinated tasks to elevate portfolio appeal to recruiters and technical evaluators.")

    for i, rec in enumerate(portfolio["recommendations"], 1):
        st.markdown(f"""
        <div style="background: rgba(30, 41, 59, 0.5); border-left: 3px solid #38BDF8; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; font-size: 0.92rem;">
            <strong>Step {i}:</strong> {rec}
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")

    # Detailed repository checklist table
    st.subheader("Repository Audit Ledger")
    audited_repos = portfolio.get("audited_repos", [])
    if audited_repos:
        rows = []
        for r in audited_repos:
            issues_str = "; ".join(r["issues"]) if r["issues"] else "None (All checks passed)"
            rows.append({
                "Repository": r["repo_name"],
                "Language": r["primary_language"],
                "Health Score": f"{r['repo_score']}/100",
                "Audit Status": r["status"],
                "Detected Deficiencies": issues_str
            })
        df_audit = pd.DataFrame(rows)
        st.dataframe(df_audit, use_container_width=True, hide_index=True)
    else:
        st.info("No repositories audited.")
