"""
Career Matcher & Resume Intelligence Engine.
Evaluates resume alignment against job descriptions, identifies skill gaps,
recommends targeted learning paths, and analyzes career communications.
Integrated from SkillBridge / Analyzer into CodeDNA.
"""
import re
import math
from typing import Dict, List, Any
from .courses_db import get_courses_for_skills


COMMON_TECH_SKILLS = [
    "python", "javascript", "typescript", "java", "golang", "rust", "c++", "c#", "php", "ruby", "swift", "kotlin",
    "react", "vue", "angular", "next.js", "node.js", "express", "django", "flask", "fastapi", "spring boot", "asp.net",
    "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "sqlite", "cassandra", "dynamodb",
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ci/cd", "github actions", "jenkins", "linux", "git",
    "machine learning", "deep learning", "nlp", "llm", "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy",
    "rest api", "graphql", "microservices", "grpc", "system design", "distributed systems", "kafka", "rabbitmq",
    "html", "css", "tailwind", "sass", "bootstrap", "responsive design",
    "agile", "scrum", "jira", "unit testing", "pytest", "jest", "cypress", "security", "ci/cd pipelines"
]

COMMON_SOFT_SKILLS = [
    "communication", "teamwork", "collaboration", "problem-solving", "critical thinking",
    "leadership", "mentorship", "adaptability", "time management", "ownership",
    "cross-functional", "stakeholder management", "client-facing", "presentation"
]

EXPERIENCE_KEYWORDS = [
    "architected", "developed", "led", "engineered", "scaled", "optimized",
    "deployed", "designed", "implemented", "mentored", "maintained", "built",
    "reduced", "increased", "accelerated", "spearheaded", "automated"
]

EDUCATION_KEYWORDS = [
    "bachelor", "master", "phd", "btech", "mtech", "degree", "computer science",
    "software engineering", "bootcamp", "certified", "certification", "gpa"
]


class CareerMatcher:
    """Evaluates resume vs job description alignment and career communications."""

    @classmethod
    def match_resume_to_job(cls, resume_text: str, job_description: str, target_role: str = "") -> Dict[str, Any]:
        """Calculates ATS-style alignment, dimension scores, found & missing skills, and course recommendations."""
        res_clean = resume_text.lower()
        job_clean = job_description.lower()

        # 1. Technical Skills Extraction & Overlap
        job_tech_found = [s for s in COMMON_TECH_SKILLS if re.search(r'\b' + re.escape(s) + r'\b', job_clean)]
        if not job_tech_found:
            # If standard list missed custom tech words, harvest words that match typical programming terms
            job_tech_found = ["python", "javascript", "sql", "git", "rest api"]

        resume_tech_found = [s for s in job_tech_found if re.search(r'\b' + re.escape(s) + r'\b', res_clean)]
        missing_tech = [s for s in job_tech_found if s not in resume_tech_found]

        tech_ratio = len(resume_tech_found) / max(1, len(job_tech_found))
        technical_score = round(min(98.0, max(15.0, tech_ratio * 90.0 + min(10.0, len(resume_tech_found) * 1.5))), 1)

        # 2. Soft Skills Overlap
        job_soft_found = [s for s in COMMON_SOFT_SKILLS if re.search(r'\b' + re.escape(s) + r'\b', job_clean)]
        resume_soft_found = [s for s in COMMON_SOFT_SKILLS if re.search(r'\b' + re.escape(s) + r'\b', res_clean)]
        soft_overlap = len(resume_soft_found)
        soft_skills_score = round(min(95.0, max(25.0, 40.0 + soft_overlap * 12.0)), 1)

        # 3. Experience & Impact Score
        exp_matches = sum(1 for kw in EXPERIENCE_KEYWORDS if re.search(r'\b' + re.escape(kw) + r'\b', res_clean))
        has_metrics = bool(re.search(r'\d+%\s*|\$\d+|\d+\s*users|\d+\s*ms|\d+\s*x', res_clean))
        metrics_bonus = 15.0 if has_metrics else 0.0
        experience_score = round(min(96.0, max(20.0, 30.0 + min(50.0, exp_matches * 6.0) + metrics_bonus)), 1)

        # 4. Education & Certification Score
        edu_matches = sum(1 for kw in EDUCATION_KEYWORDS if re.search(r'\b' + re.escape(kw) + r'\b', res_clean))
        education_score = round(min(95.0, max(30.0, 50.0 + min(45.0, edu_matches * 15.0))), 1)

        # Composite Match Score (0 - 100)
        overall_match = round(
            technical_score * 0.45 +
            experience_score * 0.30 +
            soft_skills_score * 0.15 +
            education_score * 0.10,
            1
        )
        overall_match = min(98.0, max(12.0, overall_match))

        # Dynamic Verdict
        role_label = target_role.strip() or "target role"
        if overall_match >= 80:
            verdict = f"Strong candidate alignment for {role_label}. Demonstrated core tech stack and impact narrative with minimal skill gaps."
        elif overall_match >= 65:
            verdict = f"Competitive foundation for {role_label}. Solid transferable experience, though key technical qualifications should be emphasized."
        elif overall_match >= 45:
            verdict = f"Emerging fit for {role_label}. Foundational skills detected, but closing missing technical requirements will significantly boost interview conversion."
        else:
            verdict = f"Significant skill gap for {role_label}. The job description requires specialized experience not yet reflected in this resume draft."

        # Actionable Tailored Tips
        tips = []
        if missing_tech:
            top_missing = ", ".join(t.title() for t in missing_tech[:3])
            tips.append(f"Add direct evidence or portfolio project links demonstrating {top_missing}.")
        if not has_metrics:
            tips.append("Quantify your achievements: incorporate percentage improvements, latency reductions, or project scale numbers into experience bullet points.")
        if len(resume_soft_found) < 2:
            tips.append("Highlight cross-functional collaboration and communication in team-based engineering projects.")
        tips.append("Mirror critical keyword phrasing from the job posting in your dedicated skills and summary sections.")

        # Course Recommendations for Missing Skills
        course_recommendations = get_courses_for_skills(missing_tech[:5] if missing_tech else ["docker", "fastapi", "system design"])

        return {
            "match_score": overall_match,
            "dimension_scores": {
                "technical": technical_score,
                "experience": experience_score,
                "education": education_score,
                "soft_skills": soft_skills_score
            },
            "found_skills": [s.title() for s in (resume_tech_found + resume_soft_found[:3])],
            "missing_skills": [s.title() for s in missing_tech[:8]],
            "verdict": verdict,
            "tips": tips[:4],
            "course_recommendations": course_recommendations,
            "target_role": target_role or "Software Engineer",
            "disclaimer": "Scenario model estimate based on ATS vector keyword alignment; not an employer guarantee."
        }

    @classmethod
    def classify_rejection_email(cls, email_text: str, target_role: str = "") -> Dict[str, Any]:
        """Classifies interview or rejection correspondence into actionable insights."""
        text = (email_text or "").lower()

        shortlisted_signals = [
            "congratulations", "pleased to inform", "next round", "interview with",
            "offer", "welcome to", "schedule your next", "excited to invite"
        ]
        rejection_signals = [
            "unfortunately", "not selected", "other candidates", "not moving forward",
            "regret to inform", "at this time", "pursuing other", "high volume of applicants"
        ]

        shortlisted_hits = sum(1 for s in shortlisted_signals if s in text)
        rejection_hits = sum(1 for s in rejection_signals if s in text)

        if shortlisted_hits > rejection_hits:
            decision = "Selected / Moving Forward"
            confidence = min(96, 60 + shortlisted_hits * 12)
            summary = "The correspondence indicates progression to the interview or offer stage."
            reasons = [
                "Your resume demonstrated the requisite technical stack.",
                "Your qualifications closely aligned with current team priorities."
            ]
            next_steps = [
                "Respond promptly (within 24 hours) confirming availability.",
                "Review STAR methodology for behavioral and technical problem-solving.",
                "Research the company's engineering blog, recent open-source work, and architecture."
            ]
        elif rejection_hits > 0:
            decision = "Rejected / Not Moving Forward"
            confidence = min(96, 65 + rejection_hits * 10)
            summary = "The company has chosen to move forward with other applicants for this position."
            reasons = [
                "High candidate volume with candidates possessing closer domain specialization.",
                "Possible misalignment with specific seniority, tooling, or immediate timeline requirements."
            ]
            next_steps = [
                "Send a brief, gracious thank-you note leaving the door open for future openings.",
                "Audit the job requirements against your resume and bridge the 2 top missing technical skills.",
                "Continue parallel applications and leverage CodeDNA Skill Simulator to improve role fit."
            ]
        else:
            decision = "Unclear / Process Update"
            confidence = 50
            summary = "The message appears to be an application acknowledgement or process update."
            reasons = [
                "No explicit progression or rejection keywords were detected.",
                "The hiring team may be reviewing applicants in waves."
            ]
            next_steps = [
                "Check whether any requested assessment links or forms require action.",
                "If 7+ business days pass without updates, send a polite follow-up inquiry."
            ]

        role_suffix = f" for {target_role.strip()}" if target_role.strip() else ""
        return {
            "decision": decision,
            "confidence": confidence,
            "summary": f"{summary}{role_suffix}",
            "possible_reasons": reasons,
            "next_steps": next_steps,
            "target_role": target_role.strip()
        }
