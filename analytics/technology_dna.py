import pandas as pd
import numpy as np
from typing import Dict, Any, List

class TechnologyDNAAnalyzer:
    """
    Constructs the Technology DNA ecosystem hierarchy:
    Categorizes technologies into Primary Core, Supporting Stacks,
    Emerging Technologies, and Declining Stacks.
    """

    # Knowledge base mapping languages/topics to ecosystem families
    ECOSYSTEM_MAPPINGS = {
        "Python": {
            "family": "Pythonic Data & Backend",
            "frameworks": ["Pandas", "NumPy", "Scikit-Learn", "FastAPI", "PyTorch", "Flask", "Django", "XGBoost", "Streamlit"]
        },
        "TypeScript": {
            "family": "Modern Web & Distributed Services",
            "frameworks": ["React", "Next.js", "Node.js", "GraphQL", "TailwindCSS", "Prisma", "Express"]
        },
        "JavaScript": {
            "family": "Frontend & Node Ecosystem",
            "frameworks": ["React", "Node.js", "Vue", "Webpack", "Express", "TailwindCSS"]
        },
        "Rust": {
            "family": "Systems & Low-Latency Runtimes",
            "frameworks": ["Tokio", "Actix", "Async-Std", "Wasm", "eBPF", "Diesel"]
        },
        "Go": {
            "family": "Cloud Native & Microservices",
            "frameworks": ["Kubernetes", "Docker", "gRPC", "Gin", "Prometheus", "Terraform"]
        },
        "C++": {
            "family": "High-Performance Computing & Systems",
            "frameworks": ["CUDA", "Boost", "Qt", "CMake", "OpenCV"]
        },
        "SQL": {
            "family": "Relational Data & Warehousing",
            "frameworks": ["PostgreSQL", "MySQL", "Snowflake", "BigQuery", "dbt"]
        },
        "HTML": {
            "family": "Web Markup & UI Basics",
            "frameworks": ["CSS", "Bootstrap", "TailwindCSS"]
        }
    }

    @classmethod
    def build_dna_profile(
        cls,
        languages_df: pd.DataFrame,
        repos_df: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Builds full DNA breakdown and sunburst hierarchical nodes.
        """
        if languages_df.empty:
            return {
                "primary_technologies": [],
                "supporting_technologies": [],
                "ecosystem_tree": {},
                "sunburst_data": {"ids": [], "labels": [], "parents": [], "values": []},
                "dna_summary": "No language telemetry detected."
            }

        lang_totals = languages_df.groupby("language_name")["bytes_count"].sum()
        total_bytes = max(1, lang_totals.sum())
        lang_percentages = (lang_totals / total_bytes * 100.0).sort_values(ascending=False)

        # Extract topics across repos
        all_topics = []
        if "topics" in repos_df.columns:
            for t in repos_df["topics"].dropna():
                if isinstance(t, list):
                    all_topics.extend(t)
                elif isinstance(t, str) and t.strip():
                    all_topics.extend([x.strip().lower() for x in t.split(",") if x.strip()])

        topic_counts = pd.Series(all_topics).value_counts().to_dict()

        primary = []
        supporting = []

        for lang, pct in lang_percentages.items():
            entry = {
                "technology": lang,
                "percentage": round(float(pct), 1),
                "bytes": int(lang_totals[lang]),
                "ecosystem": cls.ECOSYSTEM_MAPPINGS.get(lang, {}).get("family", "General Engineering")
            }
            if pct >= 20.0 or len(primary) == 0:
                primary.append(entry)
            else:
                supporting.append(entry)

        # Build Sunburst hierarchy
        # Root -> Primary/Supporting Categories -> Language -> Frameworks/Topics
        ids = ["Developer Ecosystem", "Primary Core", "Supporting Stack"]
        labels = ["DNA Ecosystem", "Primary Core", "Supporting Stack"]
        parents = ["", "Developer Ecosystem", "Developer Ecosystem"]
        values = [100.0, 0.0, 0.0]

        primary_sum = sum(p["percentage"] for p in primary)
        supporting_sum = sum(s["percentage"] for s in supporting)
        values[1] = round(primary_sum, 1)
        values[2] = round(supporting_sum, 1)

        # Add primary languages
        for p in primary:
            lang_id = f"prim_{p['technology']}"
            ids.append(lang_id)
            labels.append(f"{p['technology']} ({p['percentage']}%)")
            parents.append("Primary Core")
            values.append(p["percentage"])

            # Add mapped frameworks detected in topics
            known_fw = cls.ECOSYSTEM_MAPPINGS.get(p["technology"], {}).get("frameworks", [])
            for fw in known_fw:
                if fw.lower() in topic_counts:
                    fw_id = f"{lang_id}_{fw}"
                    ids.append(fw_id)
                    labels.append(fw)
                    parents.append(lang_id)
                    values.append(round(p["percentage"] * 0.25, 1))

        # Add supporting languages
        for s in supporting:
            lang_id = f"supp_{s['technology']}"
            ids.append(lang_id)
            labels.append(f"{s['technology']} ({s['percentage']}%)")
            parents.append("Supporting Stack")
            values.append(s["percentage"])

        primary_names = [p["technology"] for p in primary]
        summary = f"Core engineering DNA anchored around {', '.join(primary_names)} ({round(primary_sum, 1)}% of codebase), augmented by {len(supporting)} supporting technologies."

        return {
            "primary_technologies": primary,
            "supporting_technologies": supporting,
            "sunburst_data": {
                "ids": ids,
                "labels": labels,
                "parents": parents,
                "values": values
            },
            "dna_summary": summary
        }
