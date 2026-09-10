import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional

plt.style.use("seaborn-v0_8-darkgrid" if "seaborn-v0_8-darkgrid" in plt.style.available else "default")

class StaticChartBuilder:
    """
    Generates Matplotlib and Seaborn figures for static report generation,
    PDFs, and Jupyter exploratory notebooks.
    """

    @classmethod
    def plot_commit_distribution_seaborn(cls, commits_df: pd.DataFrame) -> plt.Figure:
        """Plots hourly commit density distribution using Seaborn KDE & histogram."""
        fig, ax = plt.subplots(figsize=(8, 4), dpi=150)
        if not commits_df.empty and "hour" in commits_df.columns:
            sns.histplot(commits_df["hour"], bins=24, kde=True, color="#3B82F6", ax=ax)
            ax.set_title("Hourly Commit Density Distribution", fontsize=12, fontweight="bold")
            ax.set_xlabel("Hour of Day (0-23)")
            ax.set_ylabel("Commit Frequency")
        else:
            ax.text(0.5, 0.5, "No commit records available", ha="center", va="center")
        plt.tight_layout()
        return fig

    @classmethod
    def plot_language_breakdown_seaborn(cls, languages_df: pd.DataFrame) -> plt.Figure:
        """Plots horizontal bar chart of top languages by byte share."""
        fig, ax = plt.subplots(figsize=(8, 4), dpi=150)
        if not languages_df.empty:
            lang_totals = languages_df.groupby("language_name")["bytes_count"].sum().sort_values(ascending=True)
            top_langs = lang_totals.tail(8)
            y_pos = np.arange(len(top_langs))
            ax.barh(y_pos, top_langs.values / 1024.0, color="#2563EB", edgecolor="none")
            ax.set_yticks(y_pos)
            ax.set_yticklabels(top_langs.index)
            ax.set_title("Top Programming Languages by Volume (KB)", fontsize=12, fontweight="bold")
            ax.set_xlabel("Volume (KB)")
        else:
            ax.text(0.5, 0.5, "No language telemetry available", ha="center", va="center")
        plt.tight_layout()
        return fig
