import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.metrics.pairwise import cosine_similarity

class CareerRecommender:
    """
    Evaluates developer fit against 8 core tech career roles using
    Vector Space Cosine Similarity and Skill Matrix Gap Analysis.
    """

    ROLE_SKILL_MATRICES = {
        "Data Scientist": {
            "core_skills": ["Python", "SQL", "Pandas", "Scikit-Learn", "Statistics", "Machine Learning", "Data Visualization", "Jupyter"],
            "complementary_skills": ["Docker", "FastAPI", "PyTorch", "MLflow", "Cloud"],
            "skill_weights": {"Python": 0.25, "Machine Learning": 0.20, "Pandas": 0.15, "SQL": 0.15, "Statistics": 0.10, "Data Visualization": 0.10, "Docker": 0.05},
            "radar_categories": ["Python", "SQL", "Machine Learning", "Data Visualization", "Statistics", "Deployment"]
        },
        "Machine Learning Engineer": {
            "core_skills": ["Python", "PyTorch", "Scikit-Learn", "Docker", "FastAPI", "Machine Learning", "Deep Learning", "CI/CD"],
            "complementary_skills": ["Kubernetes", "MLflow", "Triton", "CUDA", "Kafka"],
            "skill_weights": {"Python": 0.20, "Machine Learning": 0.20, "Deep Learning": 0.15, "Docker": 0.15, "CI/CD": 0.10, "PyTorch": 0.10, "FastAPI": 0.10},
            "radar_categories": ["Python", "Deep Learning", "Model Deployment", "Docker & K8s", "Data Pipelines", "CI/CD"]
        },
        "Data Analyst": {
            "core_skills": ["SQL", "Python", "Data Visualization", "Pandas", "Statistics", "Tableau", "Excel"],
            "complementary_skills": ["dbt", "Power BI", "R", "Airflow", "Cloud Warehousing"],
            "skill_weights": {"SQL": 0.30, "Data Visualization": 0.25, "Python": 0.20, "Statistics": 0.15, "Pandas": 0.10},
            "radar_categories": ["SQL Querying", "Python", "Data Storytelling", "Dashboards", "Statistics", "Data Modeling"]
        },
        "Backend Developer": {
            "core_skills": ["Python", "Go", "SQL", "Docker", "FastAPI", "PostgreSQL", "REST APIs", "CI/CD"],
            "complementary_skills": ["Redis", "Kafka", "GraphQL", "Kubernetes", "Microservices"],
            "skill_weights": {"Python": 0.20, "SQL": 0.20, "REST APIs": 0.15, "Docker": 0.15, "FastAPI": 0.10, "Go": 0.10, "CI/CD": 0.10},
            "radar_categories": ["API Architecture", "Database & SQL", "Containerization", "Backend Languages", "Concurrency", "Security"]
        },
        "Full Stack Developer": {
            "core_skills": ["TypeScript", "JavaScript", "React", "Node.js", "HTML", "CSS", "SQL", "REST APIs"],
            "complementary_skills": ["Next.js", "TailwindCSS", "GraphQL", "Docker", "Prisma"],
            "skill_weights": {"TypeScript": 0.25, "React": 0.20, "Node.js": 0.15, "SQL": 0.15, "HTML/CSS": 0.15, "REST APIs": 0.10},
            "radar_categories": ["Frontend (React)", "TypeScript", "Node.js Backend", "UI & CSS", "Database Design", "DevOps Basics"]
        },
        "DevOps & Cloud Engineer": {
            "core_skills": ["Docker", "Kubernetes", "CI/CD", "Terraform", "Go", "Shell", "Linux", "AWS"],
            "complementary_skills": ["Prometheus", "Helm", "Ansible", "Python", "GitOps"],
            "skill_weights": {"Docker": 0.25, "Kubernetes": 0.20, "CI/CD": 0.20, "Terraform": 0.15, "Linux": 0.10, "Go": 0.10},
            "radar_categories": ["Containers & K8s", "Infrastructure as Code", "CI/CD Automation", "Cloud Platforms", "Linux Internals", "Monitoring"]
        },
        "AI Research Engineer": {
            "core_skills": ["Python", "PyTorch", "Deep Learning", "Transformers", "Mathematics", "NLP", "Computer Vision"],
            "complementary_skills": ["JAX", "CUDA", "C++", "Hugging Face", "Distributed Training"],
            "skill_weights": {"Python": 0.20, "PyTorch": 0.25, "Transformers": 0.20, "Mathematics": 0.15, "Deep Learning": 0.20},
            "radar_categories": ["PyTorch & DL", "Transformers & LLMs", "Math & Algorithms", "Python", "GPU Computing", "Research Prototyping"]
        },
        "Systems Engineer": {
            "core_skills": ["Rust", "C", "C++", "Linux", "Concurrency", "Networking", "Operating Systems"],
            "complementary_skills": ["eBPF", "WebAssembly", "Assembly", "Docker", "Distributed Systems"],
            "skill_weights": {"Rust": 0.30, "C/C++": 0.25, "Linux": 0.20, "Concurrency": 0.15, "Networking": 0.10},
            "radar_categories": ["Memory Safety (Rust)", "C / C++", "Linux & eBPF", "Low-Latency Networking", "Concurrency", "Algorithms"]
        }
    }

    # Universally tracked skill dictionary for vectorization
    ALL_SKILLS = [
        "Python", "SQL", "Pandas", "Scikit-Learn", "Machine Learning", "Deep Learning", "PyTorch",
        "Data Visualization", "Statistics", "Docker", "Kubernetes", "FastAPI", "Go", "Rust",
        "C", "C++", "TypeScript", "JavaScript", "React", "Node.js", "HTML", "CSS", "CI/CD",
        "Terraform", "Linux", "PostgreSQL", "REST APIs", "Transformers", "Networking", "Concurrency"
    ]

    @classmethod
    def _build_developer_skill_vector(
        cls,
        languages_df: pd.DataFrame,
        repos_df: pd.DataFrame,
        additional_skills: List[str] = None
    ) -> Dict[str, float]:
        """Maps developer's languages, topics, and code signals to normalized skill master dict."""
        skill_scores = {s: 10.0 for s in cls.ALL_SKILLS} # baseline foundational weight

        # Ingest languages
        if not languages_df.empty:
            lang_totals = languages_df.groupby("language_name")["bytes_count"].sum()
            max_bytes = max(1, lang_totals.max())
            for lang, b in lang_totals.items():
                ratio = b / max_bytes
                score = min(95.0, 30.0 + (ratio * 65.0))
                if lang in skill_scores:
                    skill_scores[lang] = max(skill_scores[lang], score)
                if lang == "Python":
                    skill_scores["Pandas"] = max(skill_scores["Pandas"], score * 0.8)
                    skill_scores["Machine Learning"] = max(skill_scores["Machine Learning"], score * 0.75)
                elif lang in ("TypeScript", "JavaScript"):
                    skill_scores["React"] = max(skill_scores["React"], score * 0.75)
                    skill_scores["Node.js"] = max(skill_scores["Node.js"], score * 0.7)
                elif lang == "Rust":
                    skill_scores["Concurrency"] = max(skill_scores["Concurrency"], score * 0.8)

        # Ingest repo topics & flags
        if not repos_df.empty:
            all_topics = []
            for t in repos_df["topics"].dropna():
                if isinstance(t, list):
                    all_topics.extend(t)
                elif isinstance(t, str):
                    all_topics.extend([x.strip().lower() for x in t.split(",")])

            topic_set = {t.lower() for t in all_topics}

            if any(t in topic_set for t in ["pytorch", "deep-learning", "torch"]):
                skill_scores["PyTorch"] = 85.0
                skill_scores["Deep Learning"] = 80.0
            if any(t in topic_set for t in ["scikit-learn", "xgboost", "machine-learning"]):
                skill_scores["Scikit-Learn"] = 85.0
                skill_scores["Machine Learning"] = 85.0
            if any(t in topic_set for t in ["fastapi", "flask", "django"]):
                skill_scores["FastAPI"] = 80.0
                skill_scores["REST APIs"] = 80.0
            if any(t in topic_set for t in ["docker", "container"]):
                skill_scores["Docker"] = 85.0
            if any(t in topic_set for t in ["kubernetes", "k8s"]):
                skill_scores["Kubernetes"] = 85.0
            if any(t in topic_set for t in ["terraform", "iac"]):
                skill_scores["Terraform"] = 85.0
            if any(t in topic_set for t in ["react", "nextjs"]):
                skill_scores["React"] = 85.0
            if any(t in topic_set for t in ["transformers", "llm", "nlp"]):
                skill_scores["Transformers"] = 85.0
            if any(t in topic_set for t in ["linux", "kernel", "ebpf"]):
                skill_scores["Linux"] = 90.0

            # CI / Docker repo booleans
            if repos_df["has_docker"].sum() > 0:
                skill_scores["Docker"] = max(skill_scores["Docker"], 75.0)
            if repos_df["has_ci"].sum() > 0:
                skill_scores["CI/CD"] = max(skill_scores["CI/CD"], 75.0)

        # Apply hypothetical simulated skills
        if additional_skills:
            for s in additional_skills:
                if s in skill_scores:
                    skill_scores[s] = max(skill_scores[s], 85.0)

        return skill_scores

    @classmethod
    def evaluate_all_roles(
        cls,
        languages_df: pd.DataFrame,
        repos_df: pd.DataFrame,
        additional_skills: List[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Evaluates cosine similarity and readiness score across all 8 career paths.
        """
        dev_skills = cls._build_developer_skill_vector(languages_df, repos_df, additional_skills)
        dev_vector = np.array([dev_skills[s] for s in cls.ALL_SKILLS]).reshape(1, -1)

        recommendations = []

        for role_name, role_info in cls.ROLE_SKILL_MATRICES.items():
            # Build target ideal vector
            role_vector = np.zeros((1, len(cls.ALL_SKILLS)))
            for i, s in enumerate(cls.ALL_SKILLS):
                if s in role_info["core_skills"]:
                    role_vector[0, i] = 85.0
                elif s in role_info["complementary_skills"]:
                    role_vector[0, i] = 60.0
                else:
                    role_vector[0, i] = 10.0

            # Cosine similarity
            cos_sim = float(cosine_similarity(dev_vector, role_vector)[0, 0])
            
            # Weighted competency score for role
            weighted_score = 0.0
            total_weight = 0.0
            for skill, w in role_info["skill_weights"].items():
                # match skill directly or proxy
                s_score = dev_skills.get(skill, 20.0)
                weighted_score += s_score * w
                total_weight += w

            normalized_role_score = weighted_score / max(0.1, total_weight)
            # Combine cosine similarity and weighted mastery
            fit_pct = float(np.clip(round((cos_sim * 45.0) + (normalized_role_score * 0.55), 1), 15.0, 98.0))

            # Identify strong skills vs skill gaps
            strong = [s for s in role_info["core_skills"] if dev_skills.get(s, 0) >= 65.0]
            gaps = [s for s in role_info["core_skills"] if dev_skills.get(s, 0) < 65.0]
            next_recommended = [s for s in gaps[:3]] + [s for s in role_info["complementary_skills"] if dev_skills.get(s, 0) < 55.0][:2]

            # Radar values for this role
            radar_labels = role_info["radar_categories"]
            radar_values = []
            for cat in radar_labels:
                # Find best matching tracked skill
                matched_val = 40.0
                for s in cls.ALL_SKILLS:
                    if s.lower() in cat.lower() or cat.lower() in s.lower():
                        matched_val = dev_skills[s]
                        break
                radar_values.append(round(matched_val, 1))

            recommendations.append({
                "role_name": role_name,
                "fit_percentage": fit_pct,
                "strong_skills": strong,
                "skill_gaps": gaps,
                "recommended_skills": next_recommended,
                "radar_labels": radar_labels,
                "radar_values": radar_values,
                "why_recommended": f"Strong alignment in {', '.join(strong[:3]) if strong else 'core technologies'}, with high transferability to {role_name} workflows."
            })

        # Sort by fit percentage descending
        recommendations.sort(key=lambda x: x["fit_percentage"], reverse=True)
        for rank, rec in enumerate(recommendations, 1):
            rec["rank"] = rank

        return recommendations
