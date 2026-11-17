"""
Career Intelligence Engine.
Provides comprehensive, evidence-based, personalized developer career intelligence.
Synthesizes multi-source evidence (GitHub profile, repository metadata, SkillBridge resume,
and user preferences) across an extensible taxonomy of career directions.
"""
import re
import math
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
from .courses_db import get_courses_for_skills, COURSES_DB


# ============================================================================
# EXTENSIBLE CAREER TAXONOMY
# ============================================================================

CAREER_TAXONOMY: Dict[str, Dict[str, Any]] = {
    "backend_engineering": {
        "id": "backend_engineering",
        "title": "Backend Engineering",
        "category": "Core Software Development",
        "summary": "Building resilient server-side services, APIs, databases, distributed systems, and business logic.",
        "core_skills": ["python", "sql", "postgresql", "fastapi", "rest api", "docker", "microservices"],
        "adjacent_skills": ["django", "flask", "node.js", "express", "mysql", "redis", "kafka", "graphql", "kubernetes", "system design", "distributed systems", "linux", "unit testing", "pytest"],
        "keywords": ["api", "server", "database", "backend", "endpoint", "crud", "orm", "sql", "query", "service", "microservice", "router", "worker", "queue", "rest api", "fastapi"],
        "project_archetypes": ["High-throughput REST / GraphQL API", "Distributed Task Queue Worker", "E-commerce transactional microservice"],
        "baseline_readiness_signals": ["unit tests", "database migrations", "error handling", "dockerfile", "api documentation"]
    },
    "fullstack_engineering": {
        "id": "fullstack_engineering",
        "title": "Full-Stack Engineering",
        "category": "End-to-End Application Engineering",
        "summary": "Bridging polished user interfaces with robust server architectures, databases, and deployment pipelines.",
        "core_skills": ["javascript", "typescript", "react", "node.js", "python", "sql", "html", "css", "tailwind", "rest api", "git"],
        "adjacent_skills": ["next.js", "vue", "fastapi", "postgresql", "docker", "ci/cd", "state management", "testing"],
        "keywords": ["fullstack", "full stack", "frontend", "backend", "client", "server", "web app", "spa", "dashboard", "responsive"],
        "project_archetypes": ["Modern SaaS Dashboard with Auth & Billing", "Interactive Collaborative Workspace", "Content Management System with Custom API"],
        "baseline_readiness_signals": ["responsive layout", "auth flow", "database integration", "state management", "clean separation of concerns"]
    },
    "frontend_engineering": {
        "id": "frontend_engineering",
        "title": "Frontend Engineering",
        "category": "User Experience & Web Client Engineering",
        "summary": "Designing high-performance, accessible, responsive client applications and interactive user interfaces.",
        "core_skills": ["javascript", "typescript", "react", "html", "css", "tailwind", "next.js"],
        "adjacent_skills": ["vue", "angular", "sass", "jest", "cypress", "web vitals", "accessibility", "storybook", "vite", "state management", "responsive design"],
        "keywords": ["ui", "ux", "component", "frontend", "css", "style", "tailwind", "browser", "react", "animation", "dom", "dashboard", "nextjs", "client", "web", "accessibility"],
        "project_archetypes": ["Component Design System Library", "Real-time Data Visualization Studio", "Progressive Web Application with Offline Support"],
        "baseline_readiness_signals": ["responsive breakpoints", "accessibility labels", "component modularity", "client-side state", "performance optimization"]
    },
    "application_security": {
        "id": "application_security",
        "title": "Application Security (AppSec)",
        "category": "Cybersecurity & Defensible Systems",
        "summary": "Identifying vulnerabilities, securing application code, hardening authentication, and threat modeling web systems.",
        "core_skills": ["security", "python", "owasp", "cryptography", "authentication", "authorization", "input validation", "jwt", "linux"],
        "adjacent_skills": ["penetration testing", "sast", "dast", "oauth2", "network security", "secure coding", "dependency auditing", "api security"],
        "keywords": ["security", "auth", "vulnerability", "encryption", "sanitization", "cve", "owasp", "token", "hash", "audit", "exploit"],
        "project_archetypes": ["Automated Code Vulnerability Scanner", "Zero-Trust Role-Based Authentication Gateway", "Security Audit & Threat Modeling Framework"],
        "baseline_readiness_signals": ["input validation", "parameterized queries", "token rotation", "rate limiting", "least-privilege permissions"]
    },
    "devsecops_cloud": {
        "id": "devsecops_cloud",
        "title": "DevSecOps & Cloud Engineering",
        "category": "Infrastructure, Automation & Delivery",
        "summary": "Automating continuous integration, container orchestration, cloud infrastructure, and security guardrails.",
        "core_skills": ["docker", "kubernetes", "aws", "ci/cd", "github actions", "linux", "terraform", "git", "bash"],
        "adjacent_skills": ["azure", "gcp", "prometheus", "grafana", "helm", "security pipelines", "infrastructure as code", "ansible"],
        "keywords": ["devops", "cloud", "docker", "container", "pipeline", "ci/cd", "deploy", "infrastructure", "cluster", "aws", "k8s"],
        "project_archetypes": ["Multi-stage Automated CI/CD Pipeline with Security Scanning", "Kubernetes Multi-Tier Microservice Deployment", "Terraform Cloud Infrastructure Automation"],
        "baseline_readiness_signals": ["reproducible Dockerfile", "automated GitHub Action workflow", "environment variable separation", "health checks"]
    },
    "ai_ml_engineering": {
        "id": "ai_ml_engineering",
        "title": "AI & Machine Learning Engineering",
        "category": "Intelligent Systems & Applied Data",
        "summary": "Developing, training, evaluating, and deploying machine learning models, neural networks, and generative AI agents.",
        "core_skills": ["python", "machine learning", "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy", "deep learning"],
        "adjacent_skills": ["nlp", "llm", "transformers", "opencv", "data analysis", "docker", "fastapi", "feature engineering", "mlops"],
        "keywords": ["ai", "ml", "model", "training", "dataset", "neural", "classification", "regression", "embedding", "llm", "inference"],
        "project_archetypes": ["End-to-End Predictive Model with REST Inference API", "Retrieval-Augmented Generation (RAG) Knowledge Assistant", "Computer Vision / Audio Classifier"],
        "baseline_readiness_signals": ["evaluation metrics reported", "data preprocessing pipeline", "model persistence", "clean dataset split", "inference endpoint"]
    },
    "data_engineering": {
        "id": "data_engineering",
        "title": "Data Engineering",
        "category": "Data Pipelines & Analytics Infrastructure",
        "summary": "Building scalable extract-transform-load (ETL) pipelines, data warehouses, streaming platforms, and data modeling.",
        "core_skills": ["python", "sql", "etl", "data pipeline", "pandas", "postgresql", "data analysis"],
        "adjacent_skills": ["spark", "kafka", "airflow", "redis", "elasticsearch", "data modeling", "dbt", "snowflake", "docker"],
        "keywords": ["etl", "pipeline", "warehouse", "analytics", "spark", "airflow", "streaming", "batch", "data lake", "aggregations"],
        "project_archetypes": ["Automated Web Scraper & ETL Ingestion Pipeline", "Real-Time Event Stream Analytics Engine", "Star-Schema Data Warehouse with Analytical Queries"],
        "baseline_readiness_signals": ["schema migrations", "data integrity checks", "automated pipeline scheduling", "indexing strategies"]
    },
    "systems_engineering": {
        "id": "systems_engineering",
        "title": "Systems & Low-Level Engineering",
        "category": "High-Performance & Low-Level Computing",
        "summary": "Engineering high-throughput, memory-safe, concurrent, and resource-constrained systems code.",
        "core_skills": ["c++", "rust", "c#", "golang", "linux", "git"],
        "adjacent_skills": ["multithreading", "concurrency", "networking", "memory management", "compilers", "operating systems", "embedded"],
        "keywords": ["memory", "thread", "concurrency", "socket", "low-level", "driver", "kernel", "systems", "binary", "protocol"],
        "project_archetypes": ["Custom High-Performance Memory Allocator / Key-Value Store", "Multi-Threaded Async Network Proxy", "Lightweight Bytecode Virtual Machine"],
        "baseline_readiness_signals": ["memory safety practices", "concurrency synchronization", "clean build configs", "benchmarks"]
    },
    "developer_tools": {
        "id": "developer_tools",
        "title": "Developer Tools & Platform Engineering",
        "category": "Internal Tooling & Developer Experience",
        "summary": "Crafting command-line utilities, linters, SDKs, build extensions, and internal platforms that multiply developer velocity.",
        "core_skills": ["python", "typescript", "golang", "git", "bash", "linux", "rest api"],
        "adjacent_skills": ["cli", "ast parsing", "package management", "testing frameworks", "docker", "documentation"],
        "keywords": ["cli", "tool", "sdk", "generator", "utility", "script", "linter", "formatter", "platform", "automation"],
        "project_archetypes": ["Interactive Developer CLI Tool with Rich Terminal UI", "Code Analysis & Linting Rule Plugin", "Project Scaffolding & Code Generation Engine"],
        "baseline_readiness_signals": ["CLI argument parsing", "helpful help text/flags", "package installation guide", "unit test suite"]
    },
    "mobile_engineering": {
        "id": "mobile_engineering",
        "title": "Mobile Application Engineering",
        "category": "Native & Cross-Platform Client Apps",
        "summary": "Building responsive, touch-first, offline-capable mobile applications for iOS and Android ecosystems.",
        "core_skills": ["react native", "flutter", "swift", "kotlin", "ios", "android", "mobile ui"],
        "adjacent_skills": ["javascript", "typescript", "react", "sqlite", "rest api", "push notifications"],
        "keywords": ["mobile", "ios", "android", "react native", "flutter", "touch", "native"],
        "project_archetypes": ["Cross-Platform Mobile Productivity App", "Offline-First Location Tracker App", "Mobile Health / Activity Log with Local SQLite"],
        "baseline_readiness_signals": ["touch responsive layout", "offline storage", "device permission handling", "clean navigation state"]
    },
    "site_reliability": {
        "id": "site_reliability",
        "title": "Site Reliability Engineering (SRE)",
        "category": "Availability, Scalability & Resilience",
        "summary": "Applying software engineering to production operations, ensuring maximum uptime, automated failover, and observability.",
        "core_skills": ["linux", "python", "docker", "kubernetes", "ci/cd", "git"],
        "adjacent_skills": ["prometheus", "grafana", "incident response", "slo/sli", "networking", "terraform", "bash"],
        "keywords": ["sre", "uptime", "latency", "monitoring", "alerting", "metrics", "log", "resilience", "incident", "chaos"],
        "project_archetypes": ["Centralized Distributed Log & Metrics Aggregator", "Automated Chaos Engineering Fault Injector", "High-Availability Load-Balanced Web Cluster"],
        "baseline_readiness_signals": ["health check endpoints", "metrics instrumentation", "graceful degradation", "structured logging"]
    }
}


# ============================================================================
# EVIDENCE PROVENANCE MODEL
# ============================================================================

PROVENANCE_OBSERVED = "OBSERVED"           # Directly verified in GitHub code, commits, or repos
PROVENANCE_INFERRED = "INFERRED"           # Derived logically from combinations of observed signals
PROVENANCE_USER_STATED = "USER_STATED"     # Listed on resume or questionnaire, not yet independently verified in code
PROVENANCE_INSUFFICIENT = "INSUFFICIENT_EVIDENCE" # Insufficient public data (explicitly NOT proof of inability)


class CareerIntelligenceEngine:
    """
    Evidence-based career intelligence synthesizer.
    Combines GitHub profile, repo metadata, parsed resume, and user questionnaire.
    Calculates separate Fit, Growth Potential, Readiness, and Evidence Confidence metrics.
    """

    VERSION = "2.4.0"
    METHODOLOGY = "Multi-Source Empirical Evidence Synthesis (v2)"

    @classmethod
    def analyze(
        cls,
        github_profile: Optional[Dict[str, Any]] = None,
        resume_text: str = "",
        user_preferences: Optional[Dict[str, Any]] = None,
        target_role_override: str = ""
    ) -> Dict[str, Any]:
        """
        Main entry point for generating the complete 10-section Career Intelligence Report.
        """
        github_data = github_profile or {}
        prefs = user_preferences or {}

        # 1. Harvest & classify all available evidence
        evidence_store = cls._extract_evidence(github_data, resume_text, prefs)

        # 2. Evaluate all career directions in taxonomy
        directions_analysis = []
        for direction_id, dir_def in CAREER_TAXONOMY.items():
            evaluated = cls._evaluate_direction(dir_def, evidence_store, prefs)
            directions_analysis.append(evaluated)

        # Sort directions by fit score descending
        directions_analysis.sort(key=lambda d: d["current_fit"]["score"], reverse=True)

        # If user specified a target role override, promote or adapt it
        if target_role_override.strip():
            matched_custom = cls._find_or_create_custom_direction(target_role_override, evidence_store, prefs)
            # Prepend or rank appropriately
            existing_idx = next((i for i, d in enumerate(directions_analysis) if d["id"] == matched_custom["id"]), None)
            if existing_idx is not None:
                # Move to top as the selected target
                directions_analysis.insert(0, directions_analysis.pop(existing_idx))
            else:
                directions_analysis.insert(0, matched_custom)

        top_direction = directions_analysis[0] if directions_analysis else None

        # 3. Compile Strengths with Evidence
        strengths = cls._compile_strengths(evidence_store, directions_analysis)

        # 4. Compile Development Areas & Gaps
        development_areas = cls._compile_development_areas(evidence_store, top_direction)

        # 5. Compile Prioritized Skill Gaps
        skill_gaps = cls._compile_skill_gaps(evidence_store, top_direction)

        # 6. Generate Personalized Learning Roadmap
        learning_roadmap = cls._generate_learning_roadmap(skill_gaps, top_direction)

        # 7. Generate Personalized Project Recommendations
        project_recommendations = cls._generate_project_recommendations(top_direction, evidence_store)

        # 8. Generate Action Plan
        action_plan = cls._generate_action_plan(top_direction, skill_gaps, project_recommendations)

        # 9. Synthesize Developer Identity
        developer_identity = cls._synthesize_developer_identity(evidence_store, github_data, top_direction)

        # 10. Generate Executive Summary
        executive_summary = cls._generate_executive_summary(
            evidence_store,
            top_direction,
            strengths,
            development_areas
        )

        # 11. Career Comparison Matrix
        career_comparison = cls._build_career_comparison(directions_analysis[:4], prefs)

        # Assembly into the 10-section report
        report = {
            "metadata": {
                "report_version": cls.VERSION,
                "scoring_methodology": cls.METHODOLOGY,
                "analyzed_at": datetime.utcnow().isoformat() + "Z",
                "evidence_sources": evidence_store["source_summary"],
                "overall_confidence": evidence_store["overall_confidence"],
                "target_direction_id": top_direction["id"] if top_direction else "backend_engineering",
                "target_direction_title": top_direction["title"] if top_direction else "Backend Engineering"
            },
            "section_1_executive_summary": executive_summary,
            "section_2_developer_identity": developer_identity,
            "section_3_strengths_with_evidence": strengths,
            "section_4_weaknesses_and_gaps": development_areas,
            "section_5_career_directions": directions_analysis,
            "section_6_career_comparison": career_comparison,
            "section_7_skill_gap_analysis": skill_gaps,
            "section_8_personalized_learning_roadmap": learning_roadmap,
            "section_9_personalized_project_recommendations": project_recommendations,
            "section_10_final_action_plan": action_plan,
            "evidence_provenance_ledger": evidence_store["ledger"]
        }

        return report

    # ========================================================================
    # INTERNAL EVIDENCE EXTRACTION & PROVENANCE
    # ========================================================================

    @classmethod
    def _extract_evidence(
        cls,
        github_data: Dict[str, Any],
        resume_text: str,
        prefs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Aggregates raw evidence from all channels and assigns provenance labels.
        """
        ledger = []
        observed_skills = set()
        inferred_skills = set()
        user_stated_skills = set()
        repo_evidence = []
        has_github = bool(github_data and (github_data.get("username") or github_data.get("repositories")))
        has_resume = bool(resume_text and len(resume_text.strip()) > 30)
        has_prefs = bool(prefs and (prefs.get("targetRole") or prefs.get("primaryGoal") or prefs.get("desiredSkills")))

        # --- A. GITHUB PROFILE SIGNALS ---
        repos = github_data.get("repositories", []) or []
        langs = github_data.get("languages", []) or []
        dim_scores = github_data.get("scores", {}) or {}
        user_meta = github_data.get("user", {}) or {}

        # Languages
        for lang_item in langs:
            raw_name = lang_item.get("language_name") or lang_item.get("name")
            name = str(raw_name).lower() if (raw_name and not (isinstance(raw_name, float) and math.isnan(raw_name))) else ""
            raw_bytes = lang_item.get("bytes_count") or lang_item.get("bytes") or 0
            try:
                bytes_count = int(raw_bytes) if not (isinstance(raw_bytes, float) and math.isnan(raw_bytes)) else 0
            except (ValueError, TypeError):
                bytes_count = 0
            if name:
                observed_skills.add(name)
                ledger.append({
                    "skill": name,
                    "provenance": PROVENANCE_OBSERVED,
                    "detail": f"{bytes_count:,} bytes detected in GitHub repositories",
                    "confidence": min(95, 60 + int(math.log10(max(10, bytes_count)) * 7))
                })

        # Repositories & Implementation Depth
        total_stars = 0
        has_tests_detected = False
        has_ci_detected = False
        has_docker_detected = False

        for r in repos:
            raw_name = r.get("name")
            r_name = str(raw_name) if (raw_name and not (isinstance(raw_name, float) and math.isnan(raw_name))) else "repository"
            raw_desc = r.get("description")
            r_desc = str(raw_desc).lower() if (raw_desc and not (isinstance(raw_desc, float) and math.isnan(raw_desc))) else ""
            try:
                r_stars = int(r.get("stargazers_count", 0) or 0)
            except (ValueError, TypeError):
                r_stars = 0
            total_stars += r_stars
            raw_lang = r.get("primary_language") or r.get("language")
            r_lang = str(raw_lang).lower() if (raw_lang and not (isinstance(raw_lang, float) and math.isnan(raw_lang))) else ""
            topics = [str(t).lower() for t in r.get("topics", []) if t and isinstance(t, str)]

            # Check for engineering quality indicators in description, topics, or names
            text_context = f"{r_name.lower()} {r_desc} {' '.join(topics)}"
            if any(k in text_context for k in ["test", "pytest", "jest", "unittest", "cypress", "spec"]):
                has_tests_detected = True
            if any(k in text_context for k in ["docker", "container", "compose", "dockerfile"]):
                has_docker_detected = True
            if any(k in text_context for k in ["ci", "action", "workflow", "deploy", "pipeline"]):
                has_ci_detected = True

            # Match keywords to technical skills
            for tech_key in ["python", "javascript", "typescript", "react", "fastapi", "django", "flask", "docker", "sql", "postgres", "aws", "kubernetes", "linux", "tailwind", "next.js", "nextjs", "html", "css"]:
                if tech_key in text_context:
                    normalized = "next.js" if tech_key == "nextjs" else ("postgresql" if tech_key == "postgres" else tech_key)
                    observed_skills.add(normalized)

            repo_evidence.append({
                "name": r_name,
                "description": r_desc if r_desc else "No description provided",
                "language": r_lang or "Multi-language",
                "stars": r_stars,
                "has_readme": bool(r_desc)
            })

        # --- B. INFERRED SKILLS ---
        if "fastapi" in observed_skills or "django" in observed_skills or "flask" in observed_skills:
            inferred_skills.add("rest api")
            inferred_skills.add("backend architecture")
            ledger.append({
                "skill": "rest api",
                "provenance": PROVENANCE_INFERRED,
                "detail": "Inferred from usage of Python backend web frameworks (FastAPI/Django/Flask)",
                "confidence": 85
            })
        if "react" in observed_skills:
            inferred_skills.add("component architecture")
            inferred_skills.add("frontend state management")
            ledger.append({
                "skill": "component architecture",
                "provenance": PROVENANCE_INFERRED,
                "detail": "Inferred from demonstrated React repository codebase",
                "confidence": 85
            })
        if "docker" in observed_skills or has_docker_detected:
            inferred_skills.add("containerization")
            ledger.append({
                "skill": "containerization",
                "provenance": PROVENANCE_INFERRED,
                "detail": "Inferred from Docker configurations in project metadata",
                "confidence": 80
            })

        # --- C. RESUME PARSED SIGNALS ---
        if has_resume:
            clean_res = resume_text.lower()
            all_tech = [
                "python", "javascript", "typescript", "react", "node.js", "express", "sql",
                "postgresql", "mysql", "mongodb", "fastapi", "django", "flask", "docker",
                "kubernetes", "aws", "gcp", "azure", "git", "ci/cd", "linux", "security",
                "machine learning", "pytorch", "tensorflow", "c++", "rust", "golang", "tailwind"
            ]
            for t in all_tech:
                if re.search(r'\b' + re.escape(t) + r'\b', clean_res):
                    if t not in observed_skills:
                        user_stated_skills.add(t)
                        ledger.append({
                            "skill": t,
                            "provenance": PROVENANCE_USER_STATED,
                            "detail": "Stated in uploaded resume; pending independent source-code verification",
                            "confidence": 60
                        })

        # --- D. USER QUESTIONNAIRE / PREFERENCES ---
        if has_prefs:
            desired = [s.strip().lower() for s in prefs.get("desiredSkills", []) if s.strip()]
            for ds in desired:
                if ds not in observed_skills and ds not in user_stated_skills:
                    user_stated_skills.add(ds)
                    ledger.append({
                        "skill": ds,
                        "provenance": PROVENANCE_USER_STATED,
                        "detail": "Stated as learning priority in user preferences questionnaire",
                        "confidence": 50
                    })

        # Calculate Overall Evidence Confidence
        # Sparse = only 1 weak source or 0 repos.
        repo_count = len(repos)
        confidence_points = 0
        if has_github:
            confidence_points += 30 if repo_count >= 3 else (15 if repo_count >= 1 else 5)
            if langs:
                confidence_points += 20
            if dim_scores.get("consistency", 0) > 30:
                confidence_points += 15
        if has_resume:
            confidence_points += 25
        if has_prefs:
            confidence_points += 10

        overall_confidence = min(98, max(20, confidence_points))

        # Check if sparse
        is_sparse = (repo_count == 0 and not has_resume) or (repo_count <= 1 and not has_resume and len(langs) <= 1)
        if is_sparse:
            overall_confidence = min(35, overall_confidence)

        return {
            "has_github": has_github,
            "has_resume": has_resume,
            "has_prefs": has_prefs,
            "is_sparse": is_sparse,
            "overall_confidence": overall_confidence,
            "observed_skills": observed_skills,
            "inferred_skills": inferred_skills,
            "user_stated_skills": user_stated_skills,
            "all_demonstrated_skills": observed_skills.union(inferred_skills),
            "all_known_skills": observed_skills.union(inferred_skills).union(user_stated_skills),
            "repo_evidence": repo_evidence,
            "repo_count": repo_count,
            "total_stars": total_stars,
            "engineering_signals": {
                "has_tests": has_tests_detected,
                "has_docker": has_docker_detected,
                "has_ci": has_ci_detected
            },
            "dim_scores": dim_scores,
            "ledger": ledger,
            "source_summary": {
                "github_connected": has_github,
                "repositories_inspected": repo_count,
                "resume_provided": has_resume,
                "preferences_configured": has_prefs
            }
        }

    # ========================================================================
    # DIRECTION EVALUATION (CURRENT FIT, GROWTH, READINESS)
    # ========================================================================

    @classmethod
    def _evaluate_direction(
        cls,
        dir_def: Dict[str, Any],
        store: Dict[str, Any],
        prefs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Evaluates a specific career direction across Current Fit, Growth Potential,
        and Career Readiness independently, with transparent scoring provenance.
        """
        dir_id = dir_def["id"]
        core_reqs = dir_def["core_skills"]
        adjacent_reqs = dir_def["adjacent_skills"]
        keywords = dir_def["keywords"]

        observed = store["observed_skills"]
        inferred = store["inferred_skills"]
        stated = store["user_stated_skills"]
        all_demonstrated = store["all_demonstrated_skills"]

        # 1. Relevant demonstrated technical skills (25%)
        matched_observed = [s for s in core_reqs if s in observed]
        matched_inferred = [s for s in core_reqs if s in inferred and s not in observed]
        matched_stated = [s for s in core_reqs if s in stated and s not in all_demonstrated]
        missing_core = [s for s in core_reqs if s not in observed and s not in inferred and s not in stated]

        demonstrated_core_count = len(matched_observed) + (0.75 * len(matched_inferred)) + (0.4 * len(matched_stated))
        core_ratio = min(1.0, demonstrated_core_count / max(1, len(core_reqs)))
        # Base tech score: sparse profiles start at a fair, non-penalizing floor (25-30) rather than 0
        tech_score = round(min(98.0, max(20.0, (core_ratio * 70.0) + min(28.0, len(matched_observed) * 6.0))), 1)

        # 2. Project experience (25%)
        # Look for keyword and topic matches in repositories
        matched_repos = []
        for r in store["repo_evidence"]:
            r_text = f"{r['name']} {r['description']}".lower()
            if any(kw in r_text for kw in keywords):
                matched_repos.append(r["name"])

        project_ratio = min(1.0, len(matched_repos) / 3.0)
        project_score = round(min(96.0, max(20.0, 30.0 + (project_ratio * 55.0) + min(15.0, store["repo_count"] * 2.0))), 1)
        if store["repo_count"] == 0 and not store["has_resume"]:
            project_score = 30.0 # Honest unmeasured baseline

        # 3. Problem solving & engineering ability (15%)
        complexity_score = store["dim_scores"].get("project_complexity", 45.0)
        depth_score = store["dim_scores"].get("technical_depth", 40.0)
        problem_solving_score = round(min(95.0, max(25.0, (complexity_score * 0.55) + (depth_score * 0.45))), 1)

        # 4. Evidence of practical implementation (15%)
        eng_signals = store["engineering_signals"]
        practical_base = 35.0
        if eng_signals["has_tests"]: practical_base += 20.0
        if eng_signals["has_docker"]: practical_base += 20.0
        if eng_signals["has_ci"]: practical_base += 15.0
        if store["total_stars"] > 5: practical_base += 10.0
        practical_score = round(min(95.0, max(20.0, practical_base)), 1)
        if store["is_sparse"]:
            practical_score = 35.0

        # 5. Relevant learning and experience (10%)
        breadth_score = store["dim_scores"].get("technical_breadth", 35.0)
        learning_score = round(min(95.0, max(25.0, 35.0 + (breadth_score * 0.6))), 1)

        # 6. Alignment with stated interests and goals (10%)
        interest_score = 50.0 # Neutral if unstated
        target_role = (prefs.get("targetRole") or "").lower()
        if target_role:
            if any(kw in target_role for kw in keywords) or dir_def["title"].lower() in target_role:
                interest_score = 95.0
            else:
                interest_score = 45.0

        # COMPOSITE CURRENT FIT SCORE (0 - 100)
        fit_composite = (
            (tech_score * 0.25) +
            (project_score * 0.25) +
            (problem_solving_score * 0.15) +
            (practical_score * 0.15) +
            (learning_score * 0.10) +
            (interest_score * 0.10)
        )
        current_fit_score = round(min(98.0, max(18.0, fit_composite)), 1)

        # B. GROWTH POTENTIAL (0 - 100)
        # Evaluates transferable abilities, language adaptability, and adjacent stack overlaps
        adaptability_score = store["dim_scores"].get("adaptability", 50.0)
        matched_adjacent = [s for s in adjacent_reqs if s in observed or s in inferred]
        transferable_ratio = min(1.0, len(matched_adjacent) / max(1, len(adjacent_reqs)))
        growth_composite = (
            (adaptability_score * 0.40) +
            (learning_score * 0.30) +
            (transferable_ratio * 100.0 * 0.30)
        )
        growth_score = round(min(96.0, max(30.0, growth_composite)), 1)

        # C. CAREER READINESS (0 - 100)
        # Evaluates whether projects demonstrate entry/target level completeness (testing, CI/CD, docs)
        readiness_composite = (
            (current_fit_score * 0.45) +
            (practical_score * 0.35) +
            (min(100.0, len(matched_repos) * 35.0) * 0.20)
        )
        readiness_score = round(min(95.0, max(15.0, readiness_composite)), 1)

        # EVIDENCE CONFIDENCE FOR THIS DIRECTION
        dir_confidence = store["overall_confidence"]
        if not matched_repos and not matched_observed:
            dir_confidence = max(15, dir_confidence - 15)

        # Readiness Tier Label
        if readiness_score >= 78:
            readiness_label = "Production & Interview Ready"
        elif readiness_score >= 60:
            readiness_label = "Competitive Foundations"
        elif readiness_score >= 42:
            readiness_label = "Developing Competency"
        else:
            readiness_label = "Early Exploration"

        # Transferable Skills Identified
        transferable = [s for s in store["all_known_skills"] if s in adjacent_reqs or s in ["git", "docker", "sql", "linux", "rest api"]]

        # Direction-specific Limitations / Insufficient Evidence notes
        limitations = []
        if store["is_sparse"]:
            limitations.append("Assessment relies on sparse public evidence; missing projects do not indicate a lack of engineering ability.")
        if not matched_repos:
            limitations.append(f"No dedicated public repository found matching {dir_def['title']} patterns.")
        if matched_stated and not matched_observed:
            limitations.append(f"Skills {', '.join(matched_stated[:2])} are listed on resume but lack verified code samples.")

        return {
            "id": dir_id,
            "title": dir_def["title"],
            "category": dir_def["category"],
            "summary": dir_def["summary"],
            "current_fit": {
                "score": current_fit_score,
                "status": "High Alignment" if current_fit_score >= 75 else ("Promising Alignment" if current_fit_score >= 58 else "Emerging Fit"),
                "breakdown": {
                    "demonstrated_technical_skills": tech_score,
                    "project_experience": project_score,
                    "problem_solving_depth": problem_solving_score,
                    "practical_implementation": practical_score,
                    "learning_velocity": learning_score,
                    "stated_interest_alignment": interest_score
                }
            },
            "growth_potential": {
                "score": growth_score,
                "label": "High Velocity" if growth_score >= 75 else ("Moderate Growth" if growth_score >= 55 else "Steady Foundation"),
                "rationale": f"Supported by demonstrated adaptability in polyglot learning and {len(transferable)} transferable skills."
            },
            "career_readiness": {
                "score": readiness_score,
                "tier": readiness_label,
                "production_signals_detected": {
                    "automated_tests": eng_signals["has_tests"],
                    "containerization": eng_signals["has_docker"],
                    "ci_cd_workflows": eng_signals["has_ci"]
                }
            },
            "evidence_confidence": {
                "score": dir_confidence,
                "rating": "High Confidence" if dir_confidence >= 70 else ("Moderate Confidence" if dir_confidence >= 45 else "Low Confidence — Sparse Evidence"),
                "provenance_summary": f"{len(matched_observed)} verified observed, {len(matched_inferred)} inferred, {len(matched_stated)} self-stated",
                "limitations": limitations
            },
            "supporting_skills": [s.title() for s in (matched_observed + matched_inferred)],
            "missing_skills": [s.title() for s in missing_core[:6]],
            "transferable_skills": [s.title() for s in transferable[:5]],
            "relevant_projects": matched_repos[:3],
            "archetype_recommendations": dir_def["project_archetypes"]
        }

    # ========================================================================
    # CUSTOM DIRECTION / ADAPTATION
    # ========================================================================

    @classmethod
    def _find_or_create_custom_direction(
        cls,
        target_role: str,
        store: Dict[str, Any],
        prefs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Dynamically derives career fit when a user inputs a role outside the standard list.
        """
        clean_role = target_role.strip().lower()
        # Look for match in existing taxonomy
        for dir_id, dir_def in CAREER_TAXONOMY.items():
            if clean_role in dir_def["title"].lower() or dir_def["title"].lower() in clean_role:
                return cls._evaluate_direction(dir_def, store, prefs)

        # Dynamic fallback definition
        synthetic_def = {
            "id": f"custom_{re.sub(r'[^a-z0-9]', '_', clean_role)}",
            "title": target_role.title(),
            "category": "Custom Specialized Path",
            "summary": f"Custom career path targeting {target_role.title()} synthesized from demonstrated developer DNA.",
            "core_skills": ["python", "javascript", "git", "sql", "docker", "rest api"],
            "adjacent_skills": ["linux", "testing", "ci/cd", "system design"],
            "keywords": [clean_role, "engineering", "development", "architecture"],
            "project_archetypes": [f"Portfolio project showcasing end-to-end {target_role.title()} capabilities"],
            "baseline_readiness_signals": ["core documentation", "unit testing", "clean git history"]
        }
        return cls._evaluate_direction(synthetic_def, store, prefs)

    # ========================================================================
    # REPORT SECTIONS COMPILATION
    # ========================================================================

    @classmethod
    def _compile_strengths(
        cls,
        store: Dict[str, Any],
        directions: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Builds Section 3: Strengths with Evidence.
        Every strength cites direct evidence, provenance, and applicable career paths.
        """
        strengths = []
        observed = store["observed_skills"]
        dim_scores = store["dim_scores"]

        # Technical Depth Strength
        if dim_scores.get("technical_depth", 0) >= 55 or len(observed) >= 3:
            top_langs = [s.title() for s in list(observed)[:3]]
            strengths.append({
                "title": f"Demonstrated Specialization in {', '.join(top_langs)}",
                "explanation": "You have constructed real codebases with measurable byte volume in your primary languages, demonstrating hands-on implementation ability rather than purely theoretical familiarity.",
                "evidence_citation": f"Verified in public repositories across {len(observed)} active technology stacks.",
                "provenance": PROVENANCE_OBSERVED,
                "impact": "Crucial for backend, full-stack, and systems roles requiring deep domain mastery.",
                "relevant_directions": ["Backend Engineering", "Full-Stack Engineering"],
                "confidence": 90
            })

        # Consistency & Rhythm Strength
        if dim_scores.get("consistency", 0) >= 45:
            strengths.append({
                "title": "Consistent Engineering Rhythm",
                "explanation": "Your contribution history shows sustained development activity across multiple months, indicating steady developer momentum and commitment.",
                "evidence_citation": "Measured across commit frequency and active calendar periods in Developer Intelligence Score.",
                "provenance": PROVENANCE_OBSERVED,
                "impact": "Signals reliability and self-motivated execution to engineering managers.",
                "relevant_directions": ["All Engineering Disciplines"],
                "confidence": 85
            })

        # Transferable Polyglot Breadth
        if len(store["all_known_skills"]) >= 5:
            strengths.append({
                "title": "Transferable Polyglot Adaptability",
                "explanation": "You demonstrate the ability to navigate across multiple languages, frameworks, or database technologies without being confined to a single narrow toolset.",
                "evidence_citation": f"Observed footprint includes {len(store['all_known_skills'])} combined skills and frameworks.",
                "provenance": PROVENANCE_INFERRED,
                "impact": "Accelerates onboarding time in cross-functional product teams.",
                "relevant_directions": ["Full-Stack Engineering", "DevSecOps & Cloud Engineering"],
                "confidence": 80
            })

        # Project Implementation
        if store["repo_count"] >= 2:
            top_repo = store["repo_evidence"][0]["name"] if store["repo_evidence"] else "main repositories"
            strengths.append({
                "title": "Practical Project Architecture",
                "explanation": f"You have authored substantive standalone codebases (such as '{top_repo}'), showing ability to translate conceptual designs into working software.",
                "evidence_citation": f"Repository '{top_repo}' with active source files and configuration.",
                "provenance": PROVENANCE_OBSERVED,
                "impact": "Distinguishes self-directed builders from purely academic candidates.",
                "relevant_directions": ["Backend Engineering", "Developer Tools & Platform Engineering"],
                "confidence": 88
            })

        # Baseline Strength if sparse
        if not strengths:
            strengths.append({
                "title": "Foundation for Targeted Specialization",
                "explanation": "Your clean slate provides flexibility to architect a high-signal portfolio tailored directly to high-demand engineering disciplines without legacy technical debt.",
                "evidence_citation": "Profile analysis baseline.",
                "provenance": PROVENANCE_INFERRED,
                "impact": "Allows rapid focused skill acquisition targeting specific job requirements.",
                "relevant_directions": ["Backend Engineering", "Full-Stack Engineering"],
                "confidence": 70
            })

        return strengths

    @classmethod
    def _compile_development_areas(
        cls,
        store: Dict[str, Any],
        top_dir: Optional[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Builds Section 4: Weaknesses and Development Areas.
        Critically: Missing evidence is distinguished from demonstrated inability.
        """
        areas = []
        signals = store["engineering_signals"]

        # 1. Automated Testing Gap
        if not signals["has_tests"]:
            areas.append({
                "title": "Automated Testing Coverage Unverified",
                "gap": "Minimal or no automated unit, integration, or regression test suites detected in inspected repositories.",
                "evidence_citation": "Inspected repository source files lack pytest, jest, or test directory structures.",
                "provenance": PROVENANCE_OBSERVED if store["repo_count"] > 0 else PROVENANCE_INSUFFICIENT,
                "why_it_matters": "Production teams require automated testing to ensure resilience and prevent regressions in continuous deployment pipelines.",
                "affected_directions": ["Backend Engineering", "Application Security", "Site Reliability Engineering"],
                "remediation_step": "Add a dedicated pytest or jest suite to your primary project covering edge cases, authentication errors, and core API responses.",
                "how_to_demonstrate": "Achieve 70%+ test coverage and configure automated test execution via GitHub Actions."
            })

        # 2. Containerization & Production Deployment Gap
        if not signals["has_docker"]:
            areas.append({
                "title": "Containerization & Deployment Evidence Absent",
                "gap": "No Dockerfiles or docker-compose manifests observed in public project repositories.",
                "evidence_citation": "Project trees lack Dockerfile or container configurations.",
                "provenance": PROVENANCE_OBSERVED if store["repo_count"] > 0 else PROVENANCE_INSUFFICIENT,
                "why_it_matters": "Modern engineering teams standardize local environments and cloud deployments on container runtimes.",
                "affected_directions": ["DevSecOps & Cloud Engineering", "Backend Engineering", "Data Engineering"],
                "remediation_step": "Containerize your top project with a multi-stage Dockerfile and create a docker-compose.yml file linking your web service and database.",
                "how_to_demonstrate": "Provide one-click reproduction instructions (`docker compose up`) in your project README."
            })

        # 3. CI/CD Automation Gap
        if not signals["has_ci"]:
            areas.append({
                "title": "Continuous Integration Pipeline Missing",
                "gap": "No GitHub Actions or automated build/lint workflow configuration found in project repositories.",
                "evidence_citation": ".github/workflows directory not detected in public repositories.",
                "provenance": PROVENANCE_OBSERVED if store["repo_count"] > 0 else PROVENANCE_INSUFFICIENT,
                "why_it_matters": "Employers look for candidates who understand the software development lifecycle beyond manual local runs.",
                "affected_directions": ["DevSecOps & Cloud Engineering", "All Engineering Roles"],
                "remediation_step": "Add a `.github/workflows/ci.yml` file that runs linter checks and unit tests on every pull request.",
                "how_to_demonstrate": "Display passing CI build badges in your repository README."
            })

        # 4. Sparse Public Portfolio Note (if applicable)
        if store["is_sparse"]:
            areas.append({
                "title": "Public Demonstration Evidence Is Limited",
                "gap": "Few or no public repositories are currently available for deep source code auditing.",
                "evidence_citation": f"Found {store['repo_count']} public repositories and {len(store['observed_skills'])} detected technologies.",
                "provenance": PROVENANCE_INSUFFICIENT,
                "why_it_matters": "Note: Missing evidence is NOT proof of inability. However, hiring teams cannot verify skills they cannot inspect.",
                "affected_directions": ["All Career Directions"],
                "remediation_step": "Publish or un-privatize 1 or 2 well-documented end-to-end projects showcasing your engineering standards.",
                "how_to_demonstrate": "Provide public GitHub repositories featuring comprehensive READMEs, setup instructions, and architecture diagrams."
            })

        return areas

    @classmethod
    def _compile_skill_gaps(
        cls,
        store: Dict[str, Any],
        top_dir: Optional[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Builds Section 7: Prioritized Skill-Gap Analysis.
        Prioritizes by importance, difficulty, dependencies, and expected ROI.
        """
        if not top_dir:
            return []

        gaps = []
        missing_skills = top_dir["missing_skills"]
        observed = store["observed_skills"]

        # Skill metadata catalog for prioritizing
        SKILL_METADATA = {
            "Docker": {"importance": "Essential", "difficulty": "Moderate", "deps": ["Linux", "CLI"], "roi": "Very High", "weeks": 2},
            "Fastapi": {"importance": "High Advantage", "difficulty": "Moderate", "deps": ["Python", "REST API"], "roi": "High", "weeks": 2},
            "Postgresql": {"importance": "Essential", "difficulty": "Moderate", "deps": ["SQL"], "roi": "Very High", "weeks": 3},
            "Sql": {"importance": "Essential", "difficulty": "Moderate", "deps": [], "roi": "Very High", "weeks": 2},
            "Kubernetes": {"importance": "Advanced", "difficulty": "High", "deps": ["Docker", "Networking"], "roi": "High", "weeks": 4},
            "Typescript": {"importance": "High Advantage", "difficulty": "Moderate", "deps": ["JavaScript"], "roi": "Very High", "weeks": 2},
            "React": {"importance": "Essential", "difficulty": "Moderate", "deps": ["JavaScript", "HTML/CSS"], "roi": "Very High", "weeks": 3},
            "Rest Api": {"importance": "Essential", "difficulty": "Low", "deps": ["HTTP"], "roi": "Very High", "weeks": 1},
            "Pytest": {"importance": "Essential", "difficulty": "Low", "deps": ["Python"], "roi": "High", "weeks": 1},
            "Redis": {"importance": "High Advantage", "difficulty": "Low", "deps": ["Backend"], "roi": "High", "weeks": 1},
            "Aws": {"importance": "High Advantage", "difficulty": "Moderate", "deps": ["Linux", "Networking"], "roi": "High", "weeks": 4},
            "Ci/Cd": {"importance": "Essential", "difficulty": "Low", "deps": ["Git"], "roi": "Very High", "weeks": 1}
        }

        for skill in missing_skills[:6]:
            meta = SKILL_METADATA.get(skill, {
                "importance": "High Advantage",
                "difficulty": "Moderate",
                "deps": [],
                "roi": "High",
                "weeks": 2
            })
            gaps.append({
                "skill": skill,
                "importance": meta["importance"],
                "difficulty": meta["difficulty"],
                "prerequisites": meta["deps"],
                "expected_career_roi": meta["roi"],
                "estimated_learning_time": f"{meta['weeks']} weeks",
                "provenance": PROVENANCE_INSUFFICIENT,
                "remediation_summary": f"Acquire {skill} via guided exercises and integrate into your target portfolio project."
            })

        return gaps

    @classmethod
    def _generate_learning_roadmap(
        cls,
        skill_gaps: List[Dict[str, Any]],
        top_dir: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Builds Section 8: Personalized Learning Roadmap reusing SkillBridge course catalog.
        """
        target_title = top_dir["title"] if top_dir else "Software Engineering"
        gap_skill_names = [g["skill"].lower() for g in skill_gaps[:4]]
        if not gap_skill_names:
            gap_skill_names = ["docker", "fastapi", "sql"]

        # Fetch curated courses from existing courses_db
        matched_courses = get_courses_for_skills(gap_skill_names)

        milestones = [
            {
                "phase": "Phase 1: Foundations & Quick Wins",
                "timeline": "Weeks 1 - 2",
                "focus": f"Bridge the most critical essential gap ({gap_skill_names[0].title() if gap_skill_names else 'Core Stack'}).",
                "practical_exercise": "Build an isolated standalone module or service proving basic CRUD, configuration, and execution.",
                "measurement": "Passing local test suite and functional Git repository."
            },
            {
                "phase": "Phase 2: Architectural Integration",
                "timeline": "Weeks 3 - 5",
                "focus": f"Integrate containerization, automated testing, and relational database persistence.",
                "practical_exercise": "Dockerize the service, add database migrations, and write integration tests with mock data.",
                "measurement": "Single-command container startup (`docker compose up`) without manual intervention."
            },
            {
                "phase": "Phase 3: Production Readiness & Portfolio Polish",
                "timeline": "Weeks 6 - 8",
                "focus": "Implement CI/CD workflows, comprehensive documentation, and performance benchmarking.",
                "practical_exercise": "Deploy the application to a cloud host (e.g. Render, Railway, AWS) with GitHub Actions automated deployment.",
                "measurement": "Live deployed URL and documented architecture diagram in repository README."
            }
        ]

        return {
            "target_role": target_title,
            "recommended_courses": matched_courses,
            "structured_milestones": milestones,
            "evidence_collection_guide": [
                "Commit code regularly with clear, conventional commit messages.",
                "Include a comprehensive README with architecture overview, API documentation, and setup steps.",
                "Tag stable releases with Git release tags (e.g. v1.0.0)."
            ]
        }

    @classmethod
    def _generate_project_recommendations(
        cls,
        top_dir: Optional[Dict[str, Any]],
        store: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Builds Section 9: Personalized Project Recommendations with tiered difficulty.
        """
        role_id = top_dir["id"] if top_dir else "backend_engineering"

        # Catalog of rich, high-signal project templates
        PROJECTS_CATALOG = {
            "backend_engineering": [
                {
                    "title": "High-Throughput Task Queue & Rate-Limited API",
                    "problem_solved": "Handles asynchronous background job execution, retries, and strict per-client rate limiting under heavy concurrency.",
                    "why_it_fits": "Directly demonstrates distributed system patterns, Redis caching, and robust API design prized by backend hiring managers.",
                    "skills_developed": ["FastAPI / Express", "Redis", "Celery / BullMQ", "Docker", "Pytest"],
                    "difficulty_tiers": {
                        "MVP": "REST API with background threading and in-memory queue.",
                        "Intermediate": "Redis-backed persistent queue with exponential backoff retries and worker pool.",
                        "Advanced": "Token bucket distributed rate limiter, Prometheus metrics endpoint, and Docker Compose orchestration."
                    },
                    "what_it_demonstrates": "Ability to design resilient distributed systems that handle failures gracefully."
                },
                {
                    "title": "Audit-Logged Financial Ledger Microservice",
                    "problem_solved": "Ensures double-entry bookkeeping accuracy with immutable transaction logs and optimistic locking.",
                    "why_it_fits": "Highlights data integrity, relational database modeling, and strict transactional correctness.",
                    "skills_developed": ["PostgreSQL", "SQLAlchemy / Prisma", "ACID Transactions", "Automated Testing"],
                    "difficulty_tiers": {
                        "MVP": "Basic debit/credit transaction recording with relational schema.",
                        "Intermediate": "Optimistic locking to prevent race conditions during concurrent balance transfers.",
                        "Advanced": "Idempotency key enforcement, automated reconciliation scripts, and 90%+ test coverage."
                    },
                    "what_it_demonstrates": "Engineering maturity handling mission-critical data integrity."
                }
            ],
            "fullstack_engineering": [
                {
                    "title": "Real-Time Collaborative Workspace & Document Editor",
                    "problem_solved": "Enables multi-user synchronous document editing with presence indicators and offline sync.",
                    "why_it_fits": "Bridges complex frontend state management with low-latency WebSocket / SSE backend communication.",
                    "skills_developed": ["React / Next.js", "WebSockets / CRDT", "Node.js / FastAPI", "Tailwind CSS"],
                    "difficulty_tiers": {
                        "MVP": "Single-page document editor with Markdown preview and REST persistence.",
                        "Intermediate": "Multi-client real-time synchronization using WebSockets and conflict-free data types.",
                        "Advanced": "Role-based workspace permissions, version history diff viewer, and responsive mobile layout."
                    },
                    "what_it_demonstrates": "Full-stack mastery from interactive UX components to persistent server state."
                }
            ],
            "application_security": [
                {
                    "title": "Automated Static Code Analysis (SAST) Linter Plugin",
                    "problem_solved": "Scans codebases for hardcoded secrets, SQL injection vulnerabilities, and insecure cryptographic defaults.",
                    "why_it_fits": "Proves deep practical understanding of OWASP Top 10 vulnerabilities and secure software development lifecycle.",
                    "skills_developed": ["Python AST", "Regex Heuristics", "OWASP Standards", "CLI Packaging"],
                    "difficulty_tiers": {
                        "MVP": "CLI script detecting hardcoded API keys and unescaped database queries.",
                        "Intermediate": "Abstract Syntax Tree (AST) analyzer tracking taint propagation across function arguments.",
                        "Advanced": "GitHub Action linter that annotates pull requests with remediation suggestions and SARIF reports."
                    },
                    "what_it_demonstrates": "Practical application of defensive engineering and developer tooling."
                }
            ],
            "devsecops_cloud": [
                {
                    "title": "GitOps Automated Kubernetes Infrastructure & Pipeline",
                    "problem_solved": "Provides fully automated zero-downtime deployments with health checks and rollbacks.",
                    "why_it_fits": "Essential demonstration for cloud and DevSecOps positions requiring modern IaC practices.",
                    "skills_developed": ["Terraform", "Kubernetes", "GitHub Actions", "Prometheus", "Helm"],
                    "difficulty_tiers": {
                        "MVP": "Dockerized microservices deployed via docker-compose with local environment isolation.",
                        "Intermediate": "Multi-stage CI pipeline running lint, test, security scans, and publishing signed container images.",
                        "Advanced": "Automated blue/green deployment strategy with Prometheus alerting and automated rollback."
                    },
                    "what_it_demonstrates": "Infrastructure as Code proficiency and enterprise reliability thinking."
                }
            ]
        }

        # Fallback to backend projects if specific role catalog not defined
        projects = PROJECTS_CATALOG.get(role_id) or PROJECTS_CATALOG["backend_engineering"]
        return projects

    @classmethod
    def _generate_action_plan(
        cls,
        top_dir: Optional[Dict[str, Any]],
        skill_gaps: List[Dict[str, Any]],
        project_recs: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Builds Section 10: Final Action Plan.
        Prioritized, high-impact next steps with measurable criteria.
        """
        target_name = top_dir["title"] if top_dir else "Software Engineering"
        top_gap = skill_gaps[0]["skill"] if skill_gaps else "Automated Testing"
        top_project = project_recs[0]["title"] if project_recs else "Portfolio Anchor Project"

        return [
            {
                "step_number": 1,
                "title": f"Bridge Top Essential Requirement: {top_gap}",
                "priority": "Immediate (Days 1 - 7)",
                "action": f"Complete hands-on tutorials or sample implementations for {top_gap}. Write a working proof-of-concept module.",
                "why_it_matters": f"{top_gap} is currently the highest-frequency missing requirement for {target_name} positions.",
                "how_to_measure": f"A clean repository showing working usage of {top_gap} with automated test validation."
            },
            {
                "step_number": 2,
                "title": f"Initiate Anchor Project: '{top_project}'",
                "priority": "Short-Term (Weeks 2 - 4)",
                "action": "Implement the MVP tier of the recommended anchor project. Focus on clean architecture, modular file structure, and clear error handling.",
                "why_it_matters": "Real, running codebases provide concrete evidence that eliminates employer doubt far more effectively than resume bullet points.",
                "how_to_measure": "MVP working locally with a clean Git commit history."
            },
            {
                "step_number": 3,
                "title": "Incorporate Production Engineering Rigor",
                "priority": "Medium-Term (Weeks 5 - 6)",
                "action": "Add a Dockerfile, automated tests, and GitHub Actions CI workflow to your anchor repository.",
                "why_it_matters": "Demonstrates production readiness, elevating you from an academic programmer to an industry-ready engineer.",
                "how_to_measure": "Green build status badge and single-command local setup (`docker compose up`)."
            },
            {
                "step_number": 4,
                "title": "Publish Technical Architecture Write-Up",
                "priority": "Finishing Step (Week 7)",
                "action": "Document your project's architectural decisions, performance tradeoffs, and database schema in a polished README.",
                "why_it_matters": "Engineers are evaluated on their communication and architectural reasoning as much as their raw code.",
                "how_to_measure": "README includes problem overview, architecture diagram, API documentation, and deployment link."
            }
        ]

    @classmethod
    def _synthesize_developer_identity(
        cls,
        store: Dict[str, Any],
        github_data: Dict[str, Any],
        top_dir: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Builds Section 2: Developer Identity.
        Explicitly separates observed facts from inferred characteristics.
        """
        observed_facts = []
        inferred_traits = []

        # Observed facts
        observed_facts.append(f"Primary detected technologies: {', '.join([s.title() for s in store['observed_skills']]) or 'Standard Web Stack'}")
        observed_facts.append(f"Public repositories analyzed: {store['repo_count']}")
        observed_facts.append(f"Total stargazers accumulated: {store['total_stars']}")
        if store["dim_scores"]:
            dis = store["dim_scores"].get("overall", 50.0)
            observed_facts.append(f"Developer Intelligence Score baseline: {dis}/100")

        # Inferred traits
        if len(store["observed_skills"]) >= 3:
            inferred_traits.append("Adaptive polyglot capability: demonstrated facility across distinct languages.")
        else:
            inferred_traits.append("Specialized focus: activity concentrated within core stack.")

        if store["engineering_signals"]["has_tests"]:
            inferred_traits.append("Quality-conscious: demonstrates automated testing discipline.")
        else:
            inferred_traits.append("Rapid prototyper: prioritizes functional feature delivery over formal test coverage.")

        return {
            "archetype": github_data.get("scores", {}).get("archetype", "Versatile Software Engineer"),
            "primary_specialization": top_dir["title"] if top_dir else "Software Engineering",
            "technical_breadth_summary": f"Active across {len(store['all_known_skills'])} technologies and frameworks.",
            "technical_depth_summary": f"Depth score of {store['dim_scores'].get('technical_depth', 40.0)}/100 based on repository codebase density.",
            "observed_facts": observed_facts,
            "inferred_characteristics": inferred_traits
        }

    @classmethod
    def _generate_executive_summary(
        cls,
        store: Dict[str, Any],
        top_dir: Optional[Dict[str, Any]],
        strengths: List[Dict[str, Any]],
        development_areas: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Builds Section 1: Executive Summary.
        Clear, plain-language synthesis of who the user is and where they should go next.
        """
        role_title = top_dir["title"] if top_dir else "Software Engineering"
        fit_score = top_dir["current_fit"]["score"] if top_dir else 60.0
        confidence = store["overall_confidence"]

        if fit_score >= 75:
            fit_narrative = f"You demonstrate strong alignment ({fit_score}/100) for {role_title}, backed by verified repository evidence."
        elif fit_score >= 55:
            fit_narrative = f"You possess a promising foundation ({fit_score}/100) for {role_title}. Your core technical skills align well, while targeted additions will quickly elevate your market competitiveness."
        else:
            fit_narrative = f"You are in early exploration ({fit_score}/100) for {role_title}. Transferable programming foundations are visible, providing a springboard for focused preparation."

        if store["is_sparse"]:
            confidence_note = "Public evidence is currently sparse; this report reflects an un-inflated baseline and does NOT imply a lack of engineering ability."
        else:
            confidence_note = f"Assessment calculated with {confidence}% evidence confidence based on multi-source repository and code inspection."

        return {
            "headline": f"Personalized Career Intelligence: {role_title} ({fit_score}% Fit)",
            "narrative": fit_narrative,
            "confidence_note": confidence_note,
            "key_strengths_summary": [s["title"] for s in strengths[:3]],
            "key_priorities_summary": [a["title"] for a in development_areas[:2]],
            "recommended_next_action": "Review the prioritized learning roadmap and anchor project specifications below."
        }

    @classmethod
    def _build_career_comparison(
        cls,
        top_directions: List[Dict[str, Any]],
        prefs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Builds Section 6: Career Comparison Matrix.
        Allows side-by-side evaluation of top promising directions.
        """
        comparison_rows = []
        for d in top_directions:
            comparison_rows.append({
                "direction_id": d["id"],
                "title": d["title"],
                "current_fit_score": d["current_fit"]["score"],
                "growth_potential_score": d["growth_potential"]["score"],
                "career_readiness_score": d["career_readiness"]["score"],
                "readiness_tier": d["career_readiness"]["tier"],
                "evidence_confidence": d["evidence_confidence"]["score"],
                "missing_skills_count": len(d["missing_skills"]),
                "key_missing_skills": d["missing_skills"][:3],
                "supporting_projects_count": len(d["relevant_projects"])
            })

        return {
            "directions_compared": comparison_rows,
            "comparison_summary": "Compare fit, growth, readiness, and confidence across promising specializations to align your learning with your personal goals."
        }

    # ========================================================================
    # GROUNDED INTERACTIVE EXPLANATION (Q&A)
    # ========================================================================

    @classmethod
    def explain_report(
        cls,
        report: Dict[str, Any],
        question: str
    ) -> Dict[str, Any]:
        """
        Answers user questions strictly grounded in their generated report data.
        Never hallucinates scores or claims evidence that was not collected.
        """
        q = (question or "").lower().strip()
        top_dir_title = report["metadata"]["target_direction_title"]
        top_dir_id = report["metadata"]["target_direction_id"]
        confidence = report["metadata"]["overall_confidence"]
        directions = report.get("section_5_career_directions", [])
        strengths = report.get("section_3_strengths_with_evidence", [])
        gaps = report.get("section_4_weaknesses_and_gaps", [])
        projects = report.get("section_9_personalized_project_recommendations", [])

        # Match question intent
        # 1. Why did you recommend this career?
        if any(w in q for w in ["why", "recommend", "fit", "suggest"]) and any(w in q for w in ["career", "role", "direction", "this"]):
            matched_dir = next((d for d in directions if d["id"] == top_dir_id), directions[0] if directions else None)
            if matched_dir:
                fit_score = matched_dir["current_fit"]["score"]
                supporting = ", ".join(matched_dir["supporting_skills"][:4]) or "core programming principles"
                transferable = ", ".join(matched_dir["transferable_skills"][:3]) or "foundational skills"
                return {
                    "question": question,
                    "answer": (
                        f"We recommended {top_dir_title} because you scored {fit_score}/100 in Current Career Fit. "
                        f"This evaluation is grounded in your demonstrated skills in {supporting}, combined with "
                        f"transferable strengths in {transferable}. Your Growth Potential for this path is "
                        f"{matched_dir['growth_potential']['score']}/100."
                    ),
                    "evidence_citations": [f"Demonstrated skills: {supporting}", f"Evidence confidence: {confidence}%"],
                    "related_section": "section_5_career_directions"
                }

        # 2. Which projects influenced my score?
        if any(w in q for w in ["project", "repo", "repository", "codebase"]) and any(w in q for w in ["influence", "score", "affect", "count"]):
            matched_dir = next((d for d in directions if d["id"] == top_dir_id), None)
            relevant_projects = matched_dir.get("relevant_projects", []) if matched_dir else []
            if relevant_projects:
                proj_list = ", ".join([f"'{p}'" for p in relevant_projects])
                return {
                    "question": question,
                    "answer": (
                        f"Your score for {top_dir_title} was directly influenced by repository evidence including {proj_list}. "
                        "These repositories demonstrated matching technical keywords, source code implementation, and project structure."
                    ),
                    "evidence_citations": [f"Public repository matches: {proj_list}"],
                    "related_section": "section_5_career_directions"
                }
            else:
                return {
                    "question": question,
                    "answer": (
                        f"Currently, no dedicated public repositories explicitly matching {top_dir_title} patterns were detected. "
                        "Your score was derived from demonstrated programming languages, resume signals, and engineering fundamentals. "
                        "Building one of the recommended anchor projects below will directly raise your project-level evidence score."
                    ),
                    "evidence_citations": ["No project-specific keyword match found in public repos."],
                    "related_section": "section_9_personalized_project_recommendations"
                }

        # 3. What is my biggest weakness / What should I improve first?
        if any(w in q for w in ["weakness", "gap", "improve", "first", "lacking", "holding back"]):
            if gaps:
                top_gap = gaps[0]
                return {
                    "question": question,
                    "answer": (
                        f"Your most impactful development area is '{top_gap['title']}'. {top_gap['gap']} "
                        f"Why this matters: {top_gap['why_it_matters']} "
                        f"Recommended remediation: {top_gap['remediation_step']}"
                    ),
                    "evidence_citations": [top_gap["evidence_citation"]],
                    "related_section": "section_4_weaknesses_and_gaps"
                }

        # 4. What information would make this assessment more accurate?
        if any(w in q for w in ["accurate", "accuracy", "more information", "improve assessment", "confidence", "sparse"]):
            return {
                "question": question,
                "answer": (
                    f"Your assessment currently has {confidence}% Evidence Confidence. To increase precision: "
                    "1. Connect an active GitHub account with public code repositories. "
                    "2. Include automated test suites (pytest/jest) and a Dockerfile in your repositories. "
                    "3. Upload a complete resume detailing education, technical internships, and project metrics. "
                    "4. Complete the user preferences questionnaire to state your specific career priorities."
                ),
                "evidence_citations": [f"Current confidence: {confidence}%", "Inspected sources: GitHub, Resume, Preferences"],
                "related_section": "metadata"
            }

        # 5. Comparing another specific career direction
        for d in directions:
            if d["title"].lower() in q or d["id"].replace("_", " ") in q:
                return {
                    "question": question,
                    "answer": (
                        f"For {d['title']}, your Current Fit is {d['current_fit']['score']}/100, "
                        f"Growth Potential is {d['growth_potential']['score']}/100, and Career Readiness is "
                        f"{d['career_readiness']['score']}/100 ({d['career_readiness']['tier']}). "
                        f"Key supporting skills: {', '.join(d['supporting_skills'][:3]) or 'None observed'}. "
                        f"Missing skills to acquire: {', '.join(d['missing_skills'][:3])}."
                    ),
                    "evidence_citations": [f"Evaluated against {d['title']} criteria"],
                    "related_section": "section_5_career_directions"
                }

        # 6. Check for queries about uncollected/unmeasured information
        uncollected_keywords = ["gpa", "grade", "exam", "marks", "salary", "compensation", "hired by", "will i get", "pass interview"]
        if any(w in q for w in uncollected_keywords):
            return {
                "question": question,
                "answer": (
                    "This specific information (such as academic grades, exact compensation projections, or external company hiring decisions) "
                    "was not collected in your profile analysis. The Career Intelligence Report is strictly grounded in "
                    f"inspected GitHub repositories, verified technology stacks, and stated preparation goals. For {top_dir_title}, "
                    f"your assessed Current Fit is {report['section_5_career_directions'][0]['current_fit']['score'] if directions else 60}/100."
                ),
                "evidence_citations": ["Notice: Uncollected external data not present in analysis ledger"],
                "related_section": "metadata"
            }

        # Generic grounded fallback
        return {
            "question": question,
            "answer": (
                f"Based on your Career Intelligence Report, your top direction is {top_dir_title} "
                f"with a fit score of {report['section_5_career_directions'][0]['current_fit']['score'] if directions else 60}/100 "
                f"and an overall evidence confidence of {confidence}%. "
                f"Your primary strength is '{strengths[0]['title'] if strengths else 'Solid Foundations'}', "
                f"and your primary development priority is '{gaps[0]['title'] if gaps else 'Automated Testing'}'. "
                "Consult the Personalized Learning Roadmap and Anchor Projects sections for specific implementation milestones."
            ),
            "evidence_citations": [f"Evidence confidence: {confidence}%"],
            "related_section": "section_1_executive_summary"
        }
