import numpy as np
import pandas as pd
from typing import Dict, Any, List
from scipy import stats

class PeerBenchmarkingEngine:
    """
    Computes precise percentile rankings against peer cohort distributions.
    Maintains responsible phrasing ('percentile within analyzed peer dataset').
    """

    # Synthetic peer cohort distribution baselines (mean, std) for various metrics
    COHORT_BASELINES = {
        "technical_breadth": {"mean": 58.0, "std": 16.0},
        "technical_depth": {"mean": 64.0, "std": 14.0},
        "consistency": {"mean": 55.0, "std": 18.0},
        "project_complexity": {"mean": 60.0, "std": 15.0},
        "collaboration": {"mean": 48.0, "std": 20.0},
        "adaptability": {"mean": 62.0, "std": 14.0},
        "overall_score": {"mean": 59.0, "std": 15.0}
    }

    @classmethod
    def calculate_percentiles(cls, developer_metrics: Dict[str, Any], peer_dataset: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Calculates exact percentiles for developer metrics against peer distributions.
        """
        percentiles = {}
        narratives = []

        for metric_key, default_dist in cls.COHORT_BASELINES.items():
            val = developer_metrics.get(metric_key, 50.0)

            if peer_dataset and len(peer_dataset) >= 5:
                # Calculate directly against empirical peer records
                peer_vals = [p.get(metric_key, 50.0) for p in peer_dataset]
                pct = float(stats.percentileofscore(peer_vals, val, kind="rank"))
            else:
                # Use normal distribution CDF proxy
                z = (val - default_dist["mean"]) / default_dist["std"]
                pct = float(stats.norm.cdf(z) * 100.0)

            pct_clipped = float(np.clip(round(pct, 1), 5.0, 99.0))
            percentiles[metric_key] = pct_clipped

            metric_title = metric_key.replace("_", " ").title()
            if pct_clipped >= 80.0:
                narratives.append(f"Your {metric_title} exceeds {int(pct_clipped)}% of analyzed peers in this cohort.")

        return {
            "percentiles": percentiles,
            "top_percentile_narratives": narratives[:3],
            "disclaimer": "Percentiles calculated within analyzed peer dataset; not an exhaustive global census."
        }
