import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

DARK_THEME_LAYOUT = {
    "paper_bgcolor": "rgba(15, 23, 42, 0.0)",
    "plot_bgcolor": "rgba(15, 23, 42, 0.0)",
    "font": {"color": "#F8FAFC", "family": "Inter, system-ui, sans-serif"},
    "margin": {"l": 30, "r": 30, "t": 40, "b": 30}
}

class PlotlyChartBuilder:
    """
    Constructs high-aesthetic, interactive Plotly visualizations
    designed with a sleek modern SaaS dark-theme layout.
    """

    @classmethod
    def create_digital_twin_radar(cls, metrics: Dict[str, Any]) -> go.Figure:
        """Constructs 6-dimensional Digital Twin radar chart."""
        categories = [
            "Technical Depth",
            "Technical Breadth",
            "Consistency",
            "Project Complexity",
            "Collaboration",
            "Adaptability"
        ]
        values = [
            metrics.get("technical_depth", 50),
            metrics.get("technical_breadth", 50),
            metrics.get("consistency", 50),
            metrics.get("project_complexity", 50),
            metrics.get("collaboration", 50),
            metrics.get("adaptability", 50)
        ]
        # Close the loop
        categories.append(categories[0])
        values.append(values[0])

        fig = go.Figure()
        fig.add_trace(go.Scatterpolar(
            r=values,
            theta=categories,
            fill="toself",
            fillcolor="rgba(59, 130, 246, 0.28)",
            line=dict(color="#3B82F6", width=2.5),
            marker=dict(size=7, color="#60A5FA"),
            name="Developer Profile"
        ))

        fig.update_layout(
            polar=dict(
                radialaxis=dict(
                    visible=True,
                    range=[0, 100],
                    gridcolor="rgba(255, 255, 255, 0.12)",
                    tickfont=dict(color="#94A3B8", size=9)
                ),
                angularaxis=dict(
                    gridcolor="rgba(255, 255, 255, 0.12)",
                    tickfont=dict(color="#E2E8F0", size=11, family="Inter, sans-serif")
                ),
                bgcolor="rgba(15, 23, 42, 0.4)"
            ),
            showlegend=False,
            height=340,
            **DARK_THEME_LAYOUT
        )
        return fig

    @classmethod
    def create_commit_timeline(cls, commits_df: pd.DataFrame) -> go.Figure:
        """Constructs monthly commit volume and code changes area timeline."""
        if commits_df.empty:
            fig = go.Figure()
            fig.update_layout(title="No commit timeline available", **DARK_THEME_LAYOUT)
            return fig

        commits_df["year_month"] = pd.to_datetime(commits_df["commit_date"]).dt.strftime("%Y-%m")
        monthly = commits_df.groupby("year_month").agg(
            commit_count=("commit_hash", "count"),
            total_changes=("total_changes", "sum")
        ).reset_index().sort_values("year_month")

        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=monthly["year_month"],
            y=monthly["commit_count"],
            mode="lines+markers",
            name="Commits",
            line=dict(color="#3B82F6", width=3),
            fill="tozeroy",
            fillcolor="rgba(59, 130, 246, 0.15)",
            marker=dict(size=6, color="#60A5FA")
        ))

        fig.update_layout(
            title=dict(text="Monthly Contribution Velocity", font=dict(size=14, color="#E2E8F0")),
            xaxis=dict(
                title="",
                gridcolor="rgba(255, 255, 255, 0.08)",
                tickfont=dict(color="#94A3B8")
            ),
            yaxis=dict(
                title="Commits / Month",
                gridcolor="rgba(255, 255, 255, 0.08)",
                tickfont=dict(color="#94A3B8")
            ),
            height=300,
            hovermode="x unified",
            **DARK_THEME_LAYOUT
        )
        return fig

    @classmethod
    def create_punchcard_heatmap(cls, commits_df: pd.DataFrame) -> go.Figure:
        """Constructs Weekday (Mon-Sun) by Hour (0-23) activity punchcard matrix."""
        day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        
        matrix = np.zeros((7, 24))
        if not commits_df.empty:
            for _, c in commits_df.iterrows():
                w = int(c.get("weekday", 0)) % 7
                h = int(c.get("hour", 12)) % 24
                matrix[w, h] += 1

        fig = go.Figure(data=go.Heatmap(
            z=matrix,
            x=[f"{h:02d}:00" for h in range(24)],
            y=day_names,
            colorscale=[[0, "#0F172A"], [0.2, "#1E293B"], [0.5, "#2563EB"], [1.0, "#38BDF8"]],
            colorbar=dict(title=dict(text="Commits", font=dict(color="#94A3B8", size=10)), tickfont=dict(color="#94A3B8", size=9)),
            hoverongaps=False
        ))

        fig.update_layout(
            title=dict(text="Contribution Timing Punchcard (Weekday vs Hour)", font=dict(size=14, color="#E2E8F0")),
            xaxis=dict(tickangle=-45, tickfont=dict(color="#94A3B8", size=9), gridcolor="rgba(255, 255, 255, 0.05)"),
            yaxis=dict(tickfont=dict(color="#94A3B8", size=10), autorange="reversed"),
            height=280,
            **DARK_THEME_LAYOUT
        )
        return fig

    @classmethod
    def create_technology_sunburst(cls, sunburst_data: Dict[str, Any]) -> go.Figure:
        """Constructs hierarchical Technology DNA Sunburst visualization."""
        if not sunburst_data.get("ids"):
            fig = go.Figure()
            fig.update_layout(title="No technology hierarchy available", **DARK_THEME_LAYOUT)
            return fig

        fig = go.Figure(go.Sunburst(
            ids=sunburst_data["ids"],
            labels=sunburst_data["labels"],
            parents=sunburst_data["parents"],
            values=sunburst_data["values"],
            branchvalues="total",
            marker=dict(
                colorscale="Blues",
                line=dict(color="#0F172A", width=1.5)
            ),
            hoverinfo="label+value+percent parent"
        ))

        fig.update_layout(
            title=dict(text="Technology DNA Ecosystem Hierarchy", font=dict(size=14, color="#E2E8F0")),
            height=380,
            **DARK_THEME_LAYOUT
        )
        return fig

    @classmethod
    def create_complexity_scatter(cls, repos_df: pd.DataFrame) -> go.Figure:
        """Bubble chart: Complexity vs Stargazers with Size volume encoding."""
        if repos_df.empty:
            fig = go.Figure()
            fig.update_layout(title="No repository metrics available", **DARK_THEME_LAYOUT)
            return fig

        df = repos_df.copy()
        df["stars_display"] = df["stargazers_count"].clip(lower=1)
        df["size_mb"] = (df["size_kb"] / 1024.0).round(1)

        fig = px.scatter(
            df,
            x="complexity_score",
            y="stargazers_count",
            size="size_mb",
            color="primary_language",
            hover_name="repo_name",
            hover_data={"complexity_tier": True, "size_mb": True, "forks_count": True},
            size_max=35,
            title="Repository Architecture Complexity vs Community Validation"
        )

        fig.update_layout(
            xaxis=dict(title="Project Complexity Score (0-100)", gridcolor="rgba(255, 255, 255, 0.08)", tickfont=dict(color="#94A3B8")),
            yaxis=dict(title="Stargazers", gridcolor="rgba(255, 255, 255, 0.08)", tickfont=dict(color="#94A3B8")),
            legend=dict(font=dict(color="#CBD5E1", size=10), orientation="h", y=-0.2),
            height=360,
            **DARK_THEME_LAYOUT
        )
        return fig

    @classmethod
    def create_career_radar(cls, labels: List[str], current_vals: List[float], simulated_vals: Optional[List[float]] = None) -> go.Figure:
        """Career Readiness Radar comparing current skill vector against simulated/target competencies."""
        lbls = labels + [labels[0]]
        cur = current_vals + [current_vals[0]]

        fig = go.Figure()
        fig.add_trace(go.Scatterpolar(
            r=cur,
            theta=lbls,
            fill="toself",
            fillcolor="rgba(59, 130, 246, 0.25)",
            line=dict(color="#3B82F6", width=2),
            name="Current Readiness"
        ))

        if simulated_vals is not None:
            sim = simulated_vals + [simulated_vals[0]]
            fig.add_trace(go.Scatterpolar(
                r=sim,
                theta=lbls,
                fill="toself",
                fillcolor="rgba(16, 185, 129, 0.25)",
                line=dict(color="#10B981", width=2, dash="dash"),
                name="Simulated With New Skills"
            ))

        fig.update_layout(
            polar=dict(
                radialaxis=dict(visible=True, range=[0, 100], gridcolor="rgba(255, 255, 255, 0.12)", tickfont=dict(color="#94A3B8", size=9)),
                angularaxis=dict(gridcolor="rgba(255, 255, 255, 0.12)", tickfont=dict(color="#E2E8F0", size=10)),
                bgcolor="rgba(15, 23, 42, 0.4)"
            ),
            legend=dict(orientation="h", y=-0.15, font=dict(color="#94A3B8")),
            height=340,
            **DARK_THEME_LAYOUT
        )
        return fig

    @classmethod
    def create_archetype_pca_scatter(cls, dev_coords: Dict[str, float], peer_points: List[Dict[str, Any]], current_archetype: str) -> go.Figure:
        """2D PCA Projection scatter plot illustrating behavioral clusters and developer position."""
        fig = go.Figure()

        # Peer archetype points
        for pt in peer_points:
            is_active = (pt["archetype"] == current_archetype)
            fig.add_trace(go.Scatter(
                x=[pt["x"]],
                y=[pt["y"]],
                mode="markers+text",
                name=pt["archetype"],
                text=[pt["archetype"]],
                textposition="top center",
                textfont=dict(color=pt["color"], size=10, family="Inter, sans-serif"),
                marker=dict(
                    size=16 if is_active else 12,
                    color=pt["color"],
                    opacity=0.9 if is_active else 0.4,
                    line=dict(width=2, color="#FFFFFF" if is_active else pt["color"])
                )
            ))

        # Developer's exact coordinate
        fig.add_trace(go.Scatter(
            x=[dev_coords["x"]],
            y=[dev_coords["y"]],
            mode="markers+text",
            name="Your Position",
            text=["📍 You Are Here"],
            textposition="bottom center",
            textfont=dict(color="#F8FAFC", size=12, family="Inter, sans-serif"),
            marker=dict(size=20, color="#EF4444", symbol="star", line=dict(width=2, color="#FFFFFF"))
        ))

        fig.update_layout(
            title=dict(text="Behavioral Archetype Space (PCA 2D Cluster Projection)", font=dict(size=14, color="#E2E8F0")),
            xaxis=dict(title="PCA Component 1 (Breadth & Complexity)", gridcolor="rgba(255, 255, 255, 0.08)", tickfont=dict(color="#94A3B8")),
            yaxis=dict(title="PCA Component 2 (Consistency & Depth)", gridcolor="rgba(255, 255, 255, 0.08)", tickfont=dict(color="#94A3B8")),
            showlegend=False,
            height=360,
            **DARK_THEME_LAYOUT
        )
        return fig

    @classmethod
    def create_head_to_head_comparison(cls, dev_a_m: Dict[str, Any], dev_b_m: Dict[str, Any], name_a: str, name_b: str) -> go.Figure:
        """Dual radar comparison chart between two developers."""
        categories = ["Depth", "Breadth", "Consistency", "Complexity", "Collaboration", "Adaptability"]
        vals_a = [
            dev_a_m.get("technical_depth", 50),
            dev_a_m.get("technical_breadth", 50),
            dev_a_m.get("consistency", 50),
            dev_a_m.get("project_complexity", 50),
            dev_a_m.get("collaboration", 50),
            dev_a_m.get("adaptability", 50)
        ]
        vals_b = [
            dev_b_m.get("technical_depth", 50),
            dev_b_m.get("technical_breadth", 50),
            dev_b_m.get("consistency", 50),
            dev_b_m.get("project_complexity", 50),
            dev_b_m.get("collaboration", 50),
            dev_b_m.get("adaptability", 50)
        ]
        cats = categories + [categories[0]]
        va = vals_a + [vals_a[0]]
        vb = vals_b + [vals_b[0]]

        fig = go.Figure()
        fig.add_trace(go.Scatterpolar(
            r=va, theta=cats, fill="toself",
            fillcolor="rgba(59, 130, 246, 0.25)",
            line=dict(color="#3B82F6", width=2),
            name=name_a
        ))
        fig.add_trace(go.Scatterpolar(
            r=vb, theta=cats, fill="toself",
            fillcolor="rgba(245, 158, 11, 0.25)",
            line=dict(color="#F59E0B", width=2),
            name=name_b
        ))

        fig.update_layout(
            polar=dict(
                radialaxis=dict(visible=True, range=[0, 100], gridcolor="rgba(255, 255, 255, 0.12)", tickfont=dict(color="#94A3B8", size=9)),
                angularaxis=dict(gridcolor="rgba(255, 255, 255, 0.12)", tickfont=dict(color="#E2E8F0", size=10)),
                bgcolor="rgba(15, 23, 42, 0.4)"
            ),
            legend=dict(orientation="h", y=-0.15, font=dict(color="#94A3B8")),
            height=360,
            **DARK_THEME_LAYOUT
        )
        return fig
