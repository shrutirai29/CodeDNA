import datetime
import random
from typing import Dict, List, Any, Optional
from pathlib import Path

def _generate_synthetic_commits(repo_name: str, primary_lang: str, months_back: int = 24, commit_density: str = "high") -> List[Dict[str, Any]]:
    """Generates realistic timestamped commit records over past months."""
    now = datetime.datetime.now(datetime.timezone.utc)
    commits = []
    
    # Frequency modifier
    if commit_density == "high":
        avg_commits_per_month = 18
    elif commit_density == "medium":
        avg_commits_per_month = 8
    elif commit_density == "sporadic":
        avg_commits_per_month = 3
    else:
        avg_commits_per_month = 12

    commit_verbs = ["Refactor", "Implement", "Add unit tests for", "Optimize", "Fix bug in", "Update documentation for", "Benchmark", "Upgrade dependencies for"]
    
    random.seed(hash(repo_name) % 10000)

    for m in range(months_back, -1, -1):
        month_target = now - datetime.timedelta(days=m * 30.5)
        # Add some variance
        count = max(0, int(random.gauss(avg_commits_per_month, avg_commits_per_month * 0.4)))
        for i in range(count):
            day_offset = random.randint(1, 28)
            hour = random.choice([9, 10, 11, 14, 15, 16, 17, 19, 21, 22])
            weekday = (month_target.weekday() + day_offset) % 7
            commit_dt = month_target.replace(day=day_offset, hour=hour, minute=random.randint(0, 59), second=random.randint(0, 59))
            
            sha = f"{hash(f'{repo_name}_{m}_{i}') & 0xffffffff:08x}"
            verb = random.choice(commit_verbs)
            component = repo_name.replace("-", " ").title()
            
            commits.append({
                "commit_hash": sha,
                "author_name": "Developer Profile",
                "author_email": "dev@intelligence.platform",
                "commit_date": commit_dt.isoformat(),
                "message": f"{verb} core module in {component}",
                "weekday": commit_dt.weekday(),
                "hour": hour,
                "additions": random.randint(10, 180),
                "deletions": random.randint(2, 60),
                "total_changes": random.randint(15, 240)
            })

    # Sort chronologically
    commits.sort(key=lambda c: c["commit_date"])
    return commits

SAMPLE_PROFILES: Dict[str, Dict[str, Any]] = {
    "alex-datascientist": {
        "user": {
            "username": "alex-datascientist",
            "name": "Dr. Alex Vance, PhD",
            "company": "NeuralMetrics AI Labs",
            "blog": "https://alexvance-data.io",
            "location": "Boston, MA",
            "email": "alex.vance@neuralmetrics.io",
            "bio": "Senior Data Scientist & Applied ML Researcher. Passionate about time-series, causal inference, and interpretable machine learning systems.",
            "public_repos": 14,
            "public_gists": 8,
            "followers": 384,
            "following": 112,
            "created_at": "2021-03-15T14:20:00Z",
            "updated_at": "2026-02-10T18:30:00Z",
            "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "html_url": "https://github.com/alex-datascientist"
        },
        "repositories": [
            {
                "repo_name": "credit-fraud-detection-engine",
                "description": "High-throughput real-time credit card fraud detection engine using XGBoost and SHAP explainability.",
                "primary_language": "Python",
                "stargazers_count": 312,
                "forks_count": 64,
                "size_kb": 18450,
                "created_at": "2023-01-10T10:00:00Z",
                "updated_at": "2026-02-01T12:00:00Z",
                "pushed_at": "2026-02-01T12:00:00Z",
                "license": "MIT",
                "topics": ["machine-learning", "xgboost", "fraud-detection", "shap", "scikit-learn"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": True,
                "complexity_score": 88.5, "complexity_tier": "Very High",
                "languages": {"Python": 1420000, "SQL": 220000, "Shell": 45000},
                "commits_density": "high"
            },
            {
                "repo_name": "deep-timeseries-forecasting",
                "description": "Temporal fusion transformers and multi-horizon probabilistic time-series forecasting for supply chain demand.",
                "primary_language": "Python",
                "stargazers_count": 189,
                "forks_count": 35,
                "size_kb": 12300,
                "created_at": "2023-08-14T09:00:00Z",
                "updated_at": "2026-01-18T15:30:00Z",
                "pushed_at": "2026-01-18T15:30:00Z",
                "license": "Apache-2.0",
                "topics": ["deep-learning", "pytorch", "transformers", "time-series", "forecasting"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": False,
                "complexity_score": 84.0, "complexity_tier": "High",
                "languages": {"Python": 980000, "Jupyter Notebook": 310000},
                "commits_density": "high"
            },
            {
                "repo_name": "clinical-nlp-pipeline",
                "description": "NER and entity linkage on medical research papers using biomedical transformers and spaCy.",
                "primary_language": "Python",
                "stargazers_count": 142,
                "forks_count": 22,
                "size_kb": 9400,
                "created_at": "2024-02-20T11:20:00Z",
                "updated_at": "2025-11-15T10:00:00Z",
                "pushed_at": "2025-11-15T10:00:00Z",
                "license": "MIT",
                "topics": ["nlp", "transformers", "spacy", "huggingface", "bioinformatics"],
                "has_readme": True, "has_tests": True, "has_ci": False, "has_docker": True,
                "complexity_score": 79.2, "complexity_tier": "High",
                "languages": {"Python": 840000, "Jupyter Notebook": 160000},
                "commits_density": "medium"
            },
            {
                "repo_name": "customer-churn-propensity-analytics",
                "description": "End-to-end churn prediction and survival analysis pipeline with interactive Streamlit diagnostic dashboard.",
                "primary_language": "Python",
                "stargazers_count": 94,
                "forks_count": 18,
                "size_kb": 6500,
                "created_at": "2024-06-11T16:00:00Z",
                "updated_at": "2026-01-25T14:00:00Z",
                "pushed_at": "2026-01-25T14:00:00Z",
                "license": "MIT",
                "topics": ["data-analysis", "churn", "survival-analysis", "streamlit", "pandas"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": False,
                "complexity_score": 72.0, "complexity_tier": "Medium",
                "languages": {"Python": 520000, "R": 180000, "SQL": 95000},
                "commits_density": "medium"
            },
            {
                "repo_name": "sql-analytics-templates",
                "description": "Collection of production SQL query patterns for cohort analysis, rolling retention, and attribution modeling.",
                "primary_language": "SQL",
                "stargazers_count": 67,
                "forks_count": 29,
                "size_kb": 2200,
                "created_at": "2023-04-05T12:00:00Z",
                "updated_at": "2025-12-05T09:00:00Z",
                "pushed_at": "2025-12-05T09:00:00Z",
                "license": "MIT",
                "topics": ["sql", "analytics", "cohort-analysis", "data-warehousing", "postgres"],
                "has_readme": True, "has_tests": False, "has_ci": False, "has_docker": False,
                "complexity_score": 58.0, "complexity_tier": "Medium",
                "languages": {"SQL": 340000, "Shell": 15000},
                "commits_density": "medium"
            }
        ]
    },

    "elena-mlops": {
        "user": {
            "username": "elena-mlops",
            "name": "Elena Rostova",
            "company": "KubeCloud Systems",
            "blog": "https://rostova-cloud.dev",
            "location": "Seattle, WA",
            "email": "elena.rostova@kubecloud.io",
            "bio": "Staff MLOps & Distributed Infrastructure Engineer. Specializing in Kubernetes operators, Triton model serving, and feature stores.",
            "public_repos": 18,
            "public_gists": 12,
            "followers": 520,
            "following": 140,
            "created_at": "2020-05-18T08:00:00Z",
            "updated_at": "2026-02-14T11:00:00Z",
            "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            "html_url": "https://github.com/elena-mlops"
        },
        "repositories": [
            {
                "repo_name": "k8s-model-serving-operator",
                "description": "Kubernetes CRD operator for dynamic auto-scaling and canary deployment of LLMs and Triton inference servers.",
                "primary_language": "Go",
                "stargazers_count": 640,
                "forks_count": 124,
                "size_kb": 24500,
                "created_at": "2022-09-12T14:00:00Z",
                "updated_at": "2026-02-12T19:00:00Z",
                "pushed_at": "2026-02-12T19:00:00Z",
                "license": "Apache-2.0",
                "topics": ["kubernetes", "golang", "operator", "mlops", "triton", "llm-serving"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": True,
                "complexity_score": 94.0, "complexity_tier": "Very High",
                "languages": {"Go": 1890000, "Dockerfile": 45000, "Shell": 38000},
                "commits_density": "high"
            },
            {
                "repo_name": "realtime-feature-store-gateway",
                "description": "Low-latency streaming feature extraction gateway built with FastAPI, Redis, and Kafka connectors.",
                "primary_language": "Python",
                "stargazers_count": 280,
                "forks_count": 48,
                "size_kb": 14200,
                "created_at": "2023-04-10T10:00:00Z",
                "updated_at": "2026-01-28T16:00:00Z",
                "pushed_at": "2026-01-28T16:00:00Z",
                "license": "MIT",
                "topics": ["python", "fastapi", "kafka", "redis", "feature-store", "docker"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": True,
                "complexity_score": 86.5, "complexity_tier": "Very High",
                "languages": {"Python": 1150000, "Shell": 52000, "Dockerfile": 21000},
                "commits_density": "high"
            },
            {
                "repo_name": "terraform-aws-ml-platform",
                "description": "Modular Terraform blueprints for deploying compliant, secure EKS clusters and Kubeflow environments.",
                "primary_language": "HCL",
                "stargazers_count": 215,
                "forks_count": 62,
                "size_kb": 8900,
                "created_at": "2023-11-01T15:00:00Z",
                "updated_at": "2026-02-05T12:00:00Z",
                "pushed_at": "2026-02-05T12:00:00Z",
                "license": "MIT",
                "topics": ["terraform", "hcl", "aws", "eks", "kubeflow", "devops"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": False,
                "complexity_score": 81.0, "complexity_tier": "High",
                "languages": {"HCL": 680000, "Shell": 120000},
                "commits_density": "medium"
            },
            {
                "repo_name": "mlflow-monitoring-daemon",
                "description": "Prometheus exporter for MLflow model drift, latency distribution, and anomaly detection in production.",
                "primary_language": "Python",
                "stargazers_count": 172,
                "forks_count": 31,
                "size_kb": 5600,
                "created_at": "2024-03-15T09:00:00Z",
                "updated_at": "2025-12-20T17:00:00Z",
                "pushed_at": "2025-12-20T17:00:00Z",
                "license": "Apache-2.0",
                "topics": ["mlflow", "prometheus", "monitoring", "drift-detection", "python"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": True,
                "complexity_score": 76.5, "complexity_tier": "High",
                "languages": {"Python": 490000, "Go": 120000},
                "commits_density": "medium"
            }
        ]
    },

    "marcus-fullstack": {
        "user": {
            "username": "marcus-fullstack",
            "name": "Marcus Chen",
            "company": "Veloce Technologies",
            "blog": "https://chencodes.dev",
            "location": "San Francisco, CA",
            "email": "marcus@chencodes.dev",
            "bio": "Lead Full-Stack Engineer & Product Architect. Building high-concurrency web apps, real-time collaboration tools, and design systems.",
            "public_repos": 24,
            "public_gists": 15,
            "followers": 410,
            "following": 180,
            "created_at": "2019-10-01T12:00:00Z",
            "updated_at": "2026-02-16T14:00:00Z",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "html_url": "https://github.com/marcus-fullstack"
        },
        "repositories": [
            {
                "repo_name": "nextjs-enterprise-saas-starter",
                "description": "Full-featured multi-tenant SaaS starter with Next.js App Router, Prisma ORM, Stripe billing, and Tailwind UI.",
                "primary_language": "TypeScript",
                "stargazers_count": 820,
                "forks_count": 195,
                "size_kb": 28400,
                "created_at": "2023-03-10T14:00:00Z",
                "updated_at": "2026-02-14T20:00:00Z",
                "pushed_at": "2026-02-14T20:00:00Z",
                "license": "MIT",
                "topics": ["nextjs", "typescript", "prisma", "react", "tailwindcss", "stripe"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": True,
                "complexity_score": 91.0, "complexity_tier": "Very High",
                "languages": {"TypeScript": 2100000, "JavaScript": 280000, "CSS": 120000},
                "commits_density": "high"
            },
            {
                "repo_name": "realtime-collaborative-canvas",
                "description": "CRDT-powered multi-user vector canvas with WebSockets, WebRTC sync, and undo/redo tree persistence.",
                "primary_language": "TypeScript",
                "stargazers_count": 450,
                "forks_count": 82,
                "size_kb": 16500,
                "created_at": "2023-09-05T10:00:00Z",
                "updated_at": "2026-01-30T17:00:00Z",
                "pushed_at": "2026-01-30T17:00:00Z",
                "license": "MIT",
                "topics": ["websockets", "crdt", "canvas", "react", "webrtc"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": False,
                "complexity_score": 85.0, "complexity_tier": "Very High",
                "languages": {"TypeScript": 1450000, "JavaScript": 110000},
                "commits_density": "high"
            },
            {
                "repo_name": "graphql-federation-gateway",
                "description": "High-speed Apollo Federation v2 gateway with caching, distributed tracing, and role-based ACLs.",
                "primary_language": "TypeScript",
                "stargazers_count": 190,
                "forks_count": 34,
                "size_kb": 7400,
                "created_at": "2024-04-12T11:00:00Z",
                "updated_at": "2025-11-20T13:00:00Z",
                "pushed_at": "2025-11-20T13:00:00Z",
                "license": "Apache-2.0",
                "topics": ["graphql", "apollo", "nodejs", "microservices", "docker"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": True,
                "complexity_score": 77.0, "complexity_tier": "High",
                "languages": {"TypeScript": 650000, "JavaScript": 90000},
                "commits_density": "medium"
            },
            {
                "repo_name": "design-system-tokens",
                "description": "Design tokens library exporting CSS variables, Tailwind configuration, and Figma sync scripts.",
                "primary_language": "JavaScript",
                "stargazers_count": 110,
                "forks_count": 20,
                "size_kb": 3200,
                "created_at": "2024-01-18T16:00:00Z",
                "updated_at": "2025-10-15T09:00:00Z",
                "pushed_at": "2025-10-15T09:00:00Z",
                "license": "MIT",
                "topics": ["design-system", "tailwind", "figma", "css"],
                "has_readme": True, "has_tests": False, "has_ci": True, "has_docker": False,
                "complexity_score": 62.0, "complexity_tier": "Medium",
                "languages": {"JavaScript": 220000, "CSS": 140000},
                "commits_density": "medium"
            }
        ]
    },

    "sophia-systems": {
        "user": {
            "username": "sophia-systems",
            "name": "Sophia Lindqvist",
            "company": "RustCore Foundation",
            "blog": "https://sophia-systems.tech",
            "location": "Stockholm, Sweden",
            "email": "sophia@rustcore.org",
            "bio": "Principal Systems Engineer & Open Source Maintainer. Dedicated to memory-safe systems programming, low-latency networking, and eBPF.",
            "public_repos": 12,
            "public_gists": 22,
            "followers": 890,
            "following": 95,
            "created_at": "2018-04-10T10:00:00Z",
            "updated_at": "2026-02-18T16:00:00Z",
            "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
            "html_url": "https://github.com/sophia-systems"
        },
        "repositories": [
            {
                "repo_name": "async-reactor-runtime",
                "description": "Zero-allocation asynchronous runtime and work-stealing thread pool engineered for deterministic low latency.",
                "primary_language": "Rust",
                "stargazers_count": 1450,
                "forks_count": 210,
                "size_kb": 22400,
                "created_at": "2021-05-15T12:00:00Z",
                "updated_at": "2026-02-18T15:00:00Z",
                "pushed_at": "2026-02-18T15:00:00Z",
                "license": "Apache-2.0",
                "topics": ["rust", "async", "networking", "low-latency", "concurrency"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": False,
                "complexity_score": 96.0, "complexity_tier": "Very High",
                "languages": {"Rust": 2340000, "Assembly": 45000, "C": 32000},
                "commits_density": "high"
            },
            {
                "repo_name": "ebpf-network-telemetry",
                "description": "Kernel-level eBPF packet inspection and tracing daemon for Linux microservices.",
                "primary_language": "C",
                "stargazers_count": 680,
                "forks_count": 92,
                "size_kb": 13800,
                "created_at": "2022-11-20T14:00:00Z",
                "updated_at": "2026-01-10T11:00:00Z",
                "pushed_at": "2026-01-10T11:00:00Z",
                "license": "GPL-2.0",
                "topics": ["ebpf", "linux-kernel", "c", "networking", "observability"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": True,
                "complexity_score": 92.5, "complexity_tier": "Very High",
                "languages": {"C": 1250000, "Rust": 340000, "Makefile": 25000},
                "commits_density": "high"
            },
            {
                "repo_name": "wasm-micro-runtime",
                "description": "Embeddable WebAssembly interpreter with sandboxed memory isolation for plugin architectures.",
                "primary_language": "Rust",
                "stargazers_count": 420,
                "forks_count": 55,
                "size_kb": 8900,
                "created_at": "2023-10-05T09:00:00Z",
                "updated_at": "2025-12-14T18:00:00Z",
                "pushed_at": "2025-12-14T18:00:00Z",
                "license": "MIT",
                "topics": ["wasm", "webassembly", "rust", "sandbox", "virtual-machine"],
                "has_readme": True, "has_tests": True, "has_ci": True, "has_docker": False,
                "complexity_score": 88.0, "complexity_tier": "Very High",
                "languages": {"Rust": 920000, "WebAssembly": 85000},
                "commits_density": "medium"
            }
        ]
    },

    "dev-junior": {
        "user": {
            "username": "dev-junior",
            "name": "Jordan Riley",
            "company": "Aspiring Developer",
            "blog": "",
            "location": "Austin, TX",
            "email": "jordan.dev@gmail.com",
            "bio": "Junior software developer learning frontend and Python. Building beginner web apps and exploring APIs.",
            "public_repos": 7,
            "public_gists": 1,
            "followers": 18,
            "following": 45,
            "created_at": "2024-05-10T16:00:00Z",
            "updated_at": "2026-01-20T10:00:00Z",
            "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            "html_url": "https://github.com/dev-junior"
        },
        "repositories": [
            {
                "repo_name": "weather-app-react",
                "description": "Simple weather forecast app fetching OpenWeatherMap API using React and CSS.",
                "primary_language": "JavaScript",
                "stargazers_count": 8,
                "forks_count": 2,
                "size_kb": 2100,
                "created_at": "2024-06-12T14:00:00Z",
                "updated_at": "2025-08-10T12:00:00Z",
                "pushed_at": "2025-08-10T12:00:00Z",
                "license": None, # Missing license
                "topics": ["react", "javascript", "weather-app"],
                "has_readme": True, "has_tests": False, "has_ci": False, "has_docker": False,
                "complexity_score": 42.0, "complexity_tier": "Low",
                "languages": {"JavaScript": 180000, "CSS": 95000, "HTML": 45000},
                "commits_density": "sporadic"
            },
            {
                "repo_name": "python-web-scraper-basics",
                "description": "", # Missing description
                "primary_language": "Python",
                "stargazers_count": 4,
                "forks_count": 1,
                "size_kb": 850,
                "created_at": "2024-09-02T10:00:00Z",
                "updated_at": "2025-04-15T09:00:00Z",
                "pushed_at": "2025-04-15T09:00:00Z",
                "license": None,
                "topics": [],
                "has_readme": False, # Missing README
                "has_tests": False, "has_ci": False, "has_docker": False,
                "complexity_score": 35.0, "complexity_tier": "Low",
                "languages": {"Python": 65000},
                "commits_density": "sporadic"
            },
            {
                "repo_name": "personal-portfolio-site",
                "description": "My first web development portfolio page with animated buttons.",
                "primary_language": "HTML",
                "stargazers_count": 6,
                "forks_count": 0,
                "size_kb": 1200,
                "created_at": "2024-07-01T15:00:00Z",
                "updated_at": "2025-11-01T14:00:00Z",
                "pushed_at": "2025-11-01T14:00:00Z",
                "license": "MIT",
                "topics": ["portfolio", "html", "css"],
                "has_readme": True, "has_tests": False, "has_ci": False, "has_docker": False,
                "complexity_score": 38.0, "complexity_tier": "Low",
                "languages": {"HTML": 140000, "CSS": 110000, "JavaScript": 25000},
                "commits_density": "sporadic"
            }
        ]
    }
}

def list_sample_profiles() -> List[Dict[str, str]]:
    """Returns list of available sample profiles with their titles."""
    return [
        {"username": "alex-datascientist", "name": "Dr. Alex Vance", "title": "Senior Data Scientist", "archetype": "The Specialist"},
        {"username": "elena-mlops", "name": "Elena Rostova", "title": "Staff MLOps & Platform Engineer", "archetype": "The Enterprise Builder"},
        {"username": "marcus-fullstack", "name": "Marcus Chen", "title": "Lead Full-Stack Engineer", "archetype": "The Technology Explorer"},
        {"username": "sophia-systems", "name": "Sophia Lindqvist", "title": "Principal Systems Engineer", "archetype": "The Open Source Contributor"},
        {"username": "dev-junior", "name": "Jordan Riley", "title": "Junior Software Developer", "archetype": "The Experimental Developer"},
    ]

def get_sample_profile(username: str) -> Optional[Dict[str, Any]]:
    return SAMPLE_PROFILES.get(username)

def seed_sample_profiles(db_manager) -> None:
    """Seeds all mock profiles into the SQLite database with full commits, repos, and languages."""
    for username, data in SAMPLE_PROFILES.items():
        user_id = db_manager.save_user(data["user"])
        repo_map = db_manager.save_repositories(user_id, data["repositories"])

        all_languages = []
        all_commits = []
        all_prs = []
        all_issues = []
        all_contributors = []

        for r in data["repositories"]:
            repo_id = repo_map.get(r["repo_name"])
            if not repo_id:
                continue

            # Languages
            lang_dict = r.get("languages", {})
            total_bytes = sum(lang_dict.values()) or 1
            for lang_name, bytes_cnt in lang_dict.items():
                all_languages.append({
                    "repo_id": repo_id,
                    "language_name": lang_name,
                    "bytes_count": bytes_cnt,
                    "percentage": round(bytes_cnt * 100.0 / total_bytes, 2)
                })

            # Synthetic commits
            commits = _generate_synthetic_commits(
                repo_name=r["repo_name"],
                primary_lang=r.get("primary_language", "Python"),
                months_back=24,
                commit_density=r.get("commits_density", "medium")
            )
            for c in commits:
                c["repo_id"] = repo_id
                all_commits.append(c)

            # Sample PRs
            if r.get("complexity_score", 50) > 60:
                all_prs.append({
                    "repo_id": repo_id,
                    "pr_number": 14,
                    "title": f"Feature: enhance {r['repo_name']} performance",
                    "state": "merged",
                    "created_at": "2025-10-10T12:00:00Z",
                    "closed_at": "2025-10-12T15:00:00Z",
                    "merged_at": "2025-10-12T15:00:00Z",
                    "is_merged": True,
                    "comments_count": 4
                })
                all_contributors.append({
                    "repo_id": repo_id,
                    "username": "collaborator-core",
                    "contributions_count": 18,
                    "is_external": True
                })

        db_manager.save_languages(user_id, all_languages)
        db_manager.save_commits(user_id, all_commits)
        db_manager.save_pull_requests(user_id, all_prs)
        db_manager.save_issues(user_id, all_issues)
        db_manager.save_contributors(all_contributors)
