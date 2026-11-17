"""
Curated course database mapping skills to learning options (free and paid).
Integrated from SkillBridge / Analyzer into CodeDNA.
"""
from typing import Dict, List, Any


COURSES_DB: Dict[str, List[Dict[str, Any]]] = {
    "python": [
        {"title": "Python for Everybody Specialization", "platform": "Coursera", "provider": "University of Michigan", "duration": "7 weeks", "level": "Beginner", "url": "https://www.coursera.org/specializations/python", "is_free": False, "icon": "🐍"},
        {"title": "Complete Python Bootcamp: Zero to Hero", "platform": "Udemy", "provider": "Jose Portilla", "duration": "22 hours", "level": "Beginner", "url": "https://www.udemy.com/course/complete-python-bootcamp/", "is_free": False, "icon": "🐍"},
        {"title": "Python Full Course for Beginners", "platform": "YouTube", "provider": "freeCodeCamp", "duration": "4.5 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=rfscVS0vtbw", "is_free": True, "icon": "🐍"},
    ],
    "javascript": [
        {"title": "The Complete JavaScript Course 2026", "platform": "Udemy", "provider": "Jonas Schmedtmann", "duration": "68 hours", "level": "All Levels", "url": "https://www.udemy.com/course/the-complete-javascript-course/", "is_free": False, "icon": "⚡"},
        {"title": "JavaScript Algorithms & Data Structures", "platform": "freeCodeCamp", "provider": "freeCodeCamp", "duration": "Self-paced", "level": "Intermediate", "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", "is_free": True, "icon": "⚡"},
    ],
    "typescript": [
        {"title": "Understanding TypeScript", "platform": "Udemy", "provider": "Maximilian Schwarzmüller", "duration": "15 hours", "level": "Intermediate", "url": "https://www.udemy.com/course/understanding-typescript/", "is_free": False, "icon": "🔷"},
        {"title": "TypeScript for Beginners Tutorial", "platform": "YouTube", "provider": "freeCodeCamp", "duration": "3 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=BwuLxPH8IDs", "is_free": True, "icon": "🔷"},
    ],
    "react": [
        {"title": "React — The Complete Guide (incl. Next.js)", "platform": "Udemy", "provider": "Maximilian Schwarzmüller", "duration": "48 hours", "level": "All Levels", "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", "is_free": False, "icon": "⚛"},
        {"title": "Full Stack Open — React & Modern Web", "platform": "University of Helsinki", "provider": "U of Helsinki", "duration": "Self-paced", "level": "Intermediate", "url": "https://fullstackopen.com/", "is_free": True, "icon": "⚛"},
    ],
    "sql": [
        {"title": "SQL for Data Science", "platform": "Coursera", "provider": "UC Davis", "duration": "4 weeks", "level": "Beginner", "url": "https://www.coursera.org/learn/sql-for-data-science", "is_free": False, "icon": "🗄"},
        {"title": "SQL Tutorial — Full Database Course", "platform": "YouTube", "provider": "freeCodeCamp", "duration": "4 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=HXV3zeQKqGY", "is_free": True, "icon": "🗄"},
    ],
    "fastapi": [
        {"title": "FastAPI — The Complete Course 2026 (Python)", "platform": "Udemy", "provider": "Eric Roby", "duration": "15 hours", "level": "All Levels", "url": "https://www.udemy.com/course/fastapi-the-complete-course/", "is_free": False, "icon": "⚡"},
        {"title": "FastAPI Tutorial for Beginners", "platform": "YouTube", "provider": "freeCodeCamp", "duration": "3 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=tLKKmouUAMS", "is_free": True, "icon": "⚡"},
    ],
    "docker": [
        {"title": "Docker & Kubernetes: The Practical Guide", "platform": "Udemy", "provider": "Maximilian Schwarzmüller", "duration": "23 hours", "level": "Intermediate", "url": "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/", "is_free": False, "icon": "🐳"},
        {"title": "Docker Tutorial for Beginners", "platform": "YouTube", "provider": "TechWorld with Nana", "duration": "3 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=3c-iBn73dDE", "is_free": True, "icon": "🐳"},
    ],
    "kubernetes": [
        {"title": "Kubernetes for Absolute Beginners — Hands-on", "platform": "Udemy", "provider": "Mumshad Mannambeth", "duration": "6 hours", "level": "Beginner", "url": "https://www.udemy.com/course/learn-kubernetes/", "is_free": False, "icon": "⚙"},
        {"title": "Kubernetes Course — Full Beginners Tutorial", "platform": "YouTube", "provider": "freeCodeCamp", "duration": "3.5 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=X48VuDVv0do", "is_free": True, "icon": "⚙"},
    ],
    "machine learning": [
        {"title": "Machine Learning Specialization", "platform": "Coursera", "provider": "Andrew Ng / Stanford", "duration": "3 months", "level": "Beginner", "url": "https://www.coursera.org/specializations/machine-learning-introduction", "is_free": False, "icon": "🤖"},
        {"title": "Intro to Machine Learning Course", "platform": "Kaggle", "provider": "Kaggle", "duration": "Self-paced", "level": "Beginner", "url": "https://www.kaggle.com/learn/intro-to-machine-learning", "is_free": True, "icon": "🤖"},
    ],
    "deep learning": [
        {"title": "Deep Learning Specialization", "platform": "Coursera", "provider": "Andrew Ng / deeplearning.ai", "duration": "5 months", "level": "Intermediate", "url": "https://www.coursera.org/specializations/deep-learning", "is_free": False, "icon": "🧠"},
        {"title": "Practical Deep Learning for Coders", "platform": "Fast.ai", "provider": "Jeremy Howard", "duration": "Self-paced", "level": "All Levels", "url": "https://course.fast.ai/", "is_free": True, "icon": "🧠"},
    ],
    "aws": [
        {"title": "AWS Certified Solutions Architect Associate", "platform": "Udemy", "provider": "Stephane Maarek", "duration": "27 hours", "level": "Intermediate", "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", "is_free": False, "icon": "☁"},
        {"title": "AWS Certified Cloud Practitioner Training", "platform": "YouTube", "provider": "freeCodeCamp", "duration": "13 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=SOTamWNgDKc", "is_free": True, "icon": "☁"},
    ],
    "git": [
        {"title": "Git & GitHub Crash Course for Beginners", "platform": "YouTube", "provider": "Traversy Media", "duration": "1.5 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=SWYqp7iY_Tc", "is_free": True, "icon": "🌿"},
        {"title": "Version Control with Git", "platform": "Coursera", "provider": "Atlassian", "duration": "4 weeks", "level": "Beginner", "url": "https://www.coursera.org/learn/version-control-with-git", "is_free": False, "icon": "🌿"},
    ],
    "data analysis": [
        {"title": "Google Data Analytics Professional Certificate", "platform": "Coursera", "provider": "Google", "duration": "6 months", "level": "Beginner", "url": "https://www.coursera.org/professional-certificates/google-data-analytics", "is_free": False, "icon": "📊"},
        {"title": "Data Analysis with Python", "platform": "freeCodeCamp", "provider": "freeCodeCamp", "duration": "Self-paced", "level": "Intermediate", "url": "https://www.freecodecamp.org/learn/data-analysis-with-python/", "is_free": True, "icon": "📊"},
    ],
    "communication": [
        {"title": "Improving Communication Skills", "platform": "Coursera", "provider": "University of Pennsylvania", "duration": "4 weeks", "level": "Beginner", "url": "https://www.coursera.org/learn/wharton-communication-skills", "is_free": False, "icon": "💬"},
    ],
    "agile": [
        {"title": "Agile with Atlassian Jira", "platform": "Coursera", "provider": "Atlassian", "duration": "4 weeks", "level": "Beginner", "url": "https://www.coursera.org/learn/agile-atlassian-jira", "is_free": False, "icon": "🔄"},
    ],
    "golang": [
        {"title": "Go: The Complete Developer's Guide (Golang)", "platform": "Udemy", "provider": "Stephen Grider", "duration": "9 hours", "level": "Beginner", "url": "https://www.udemy.com/course/go-the-complete-developers-guide/", "is_free": False, "icon": "🔵"},
        {"title": "Learn Go Programming — Golang Tutorial", "platform": "YouTube", "provider": "freeCodeCamp", "duration": "6.5 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=YS4e4q9oBaU", "is_free": True, "icon": "🔵"},
    ],
    "rust": [
        {"title": "Rust Fundamentals & Systems Programming", "platform": "Udemy", "provider": "Nathan Stocks", "duration": "6 hours", "level": "All Levels", "url": "https://www.udemy.com/course/ultimate-rust-crash-course/", "is_free": False, "icon": "🦀"},
        {"title": "Rust Programming Course for Beginners", "platform": "YouTube", "provider": "freeCodeCamp", "duration": "14 hours", "level": "Beginner", "url": "https://www.youtube.com/watch?v=BpPEoQ4793M", "is_free": True, "icon": "🦀"},
    ]
}


def get_courses_for_skills(skills: List[str]) -> Dict[str, List[Dict[str, Any]]]:
    """Returns curated course recommendations matching missing or requested skills."""
    results: Dict[str, List[Dict[str, Any]]] = {}
    normalized_skills = [s.strip().lower() for s in skills if s.strip()]

    for raw_skill in normalized_skills:
        # Match exact key or substring
        matched_key = None
        for db_key in COURSES_DB.keys():
            if raw_skill == db_key or raw_skill in db_key or db_key in raw_skill:
                matched_key = db_key
                break
        
        if matched_key:
            results[raw_skill] = COURSES_DB[matched_key]
        else:
            # Fallback search recommendation on Coursera & freeCodeCamp
            results[raw_skill] = [
                {
                    "title": f"Mastering {raw_skill.title()} — Comprehensive Guide",
                    "platform": "Coursera",
                    "provider": "Industry Specialists",
                    "duration": "4-6 weeks",
                    "level": "All Levels",
                    "url": f"https://www.coursera.org/search?query={raw_skill}",
                    "is_free": False,
                    "icon": "🎓"
                },
                {
                    "title": f"Learn {raw_skill.title()} Full Course",
                    "platform": "YouTube",
                    "provider": "freeCodeCamp",
                    "duration": "4 hours",
                    "level": "Beginner",
                    "url": f"https://www.youtube.com/results?search_query=freecodecamp+{raw_skill}",
                    "is_free": True,
                    "icon": "📺"
                }
            ]
    return results
