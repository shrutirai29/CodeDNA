import pandas as pd
from typing import Dict, Any, List
from .career_recommender import CareerRecommender

class SkillPathSimulator:
    """
    Simulates hypothetical career skill acquisition scenarios.
    Recalculates vector space fit and returns projected delta increases.
    """

    @classmethod
    def simulate_skill_acquisition(
        cls,
        target_role: str,
        acquired_skills: List[str],
        languages_df: pd.DataFrame,
        repos_df: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Calculates baseline readiness vs simulated readiness when hypothetical skills are added.
        """
        # 1. Baseline calculation
        baseline_recs = CareerRecommender.evaluate_all_roles(languages_df, repos_df, additional_skills=None)
        baseline_match = next((r for r in baseline_recs if r["role_name"] == target_role), baseline_recs[0])
        baseline_fit = baseline_match["fit_percentage"]
        baseline_radar = baseline_match["radar_values"]

        # 2. Simulated calculation with acquired skills
        simulated_recs = CareerRecommender.evaluate_all_roles(languages_df, repos_df, additional_skills=acquired_skills)
        simulated_match = next((r for r in simulated_recs if r["role_name"] == target_role), simulated_recs[0])
        simulated_fit = simulated_match["fit_percentage"]
        simulated_radar = simulated_match["radar_values"]

        delta = round(simulated_fit - baseline_fit, 1)

        # Generate narrative
        if delta > 0:
            skills_str = ", ".join(acquired_skills)
            narrative = (
                f"Acquiring proficiency in **{skills_str}** closes primary competency gaps for the "
                f"**{target_role}** role, projecting a **+{delta}%** readiness increase from {baseline_fit}% to {simulated_fit}%."
            )
        else:
            narrative = f"The selected skills represent existing proficiencies with minor incremental lift for {target_role}."

        return {
            "target_role": target_role,
            "acquired_skills": acquired_skills,
            "baseline_fit": baseline_fit,
            "simulated_fit": simulated_fit,
            "delta_increase": delta,
            "baseline_radar": baseline_radar,
            "simulated_radar": simulated_radar,
            "radar_labels": baseline_match["radar_labels"],
            "remaining_gaps": simulated_match["skill_gaps"],
            "narrative": narrative,
            "disclaimer": "Projections are mathematical scenario estimates based on vector space similarity, not employment guarantees."
        }
