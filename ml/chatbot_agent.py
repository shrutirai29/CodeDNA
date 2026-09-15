"""
CodeDNA Trained Machine Learning AI Agent
Classifies user queries using a trained Scikit-Learn NLP pipeline
(with pure-Python TF-IDF vector centroid fallback for serverless runtimes)
and provides intelligent, platform-scoped assistance.
"""

import os
import math
import json
import re
from pathlib import Path
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "codedna_chatbot_agent.joblib"
DATA_PATH = BASE_DIR / "data" / "chatbot_training_corpus.json"

try:
    import joblib
    import numpy as np
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

RESPONSES = {
    "greeting": (
        "Hello! I am the **CodeDNA Assistant**.\n\n"
        "I can help you explore this website and understand how developer profiles work. You can ask me:\n"
        "- **How Analysis Happens**: 3 simple steps we use to analyze any GitHub profile\n"
        "- **Developer Score**: What makes up the 0 to 100 score\n"
        "- **The Skills Radar**: Code depth, variety, habit, teamwork, and learning speed\n"
        "- **Anti-Burstiness**: Why honest weekly coding matters more than sudden bulk dumping\n"
        "- **Career Matcher**: Which job roles fit best and what skill to learn next\n"
        "- **Shruti Rai's Profile**: Projects, skills, and background\n"
        "- **Free API**: How to get raw JSON data without any sign-up or API key\n\n"
        "What would you like to know?"
    ),
    "pleasantry": (
        "You're very welcome! If you have any other questions about your Developer Score, coding habits, or Shruti Rai's profile, feel free to ask anytime. Happy coding! 🚀"
    ),
    "platform_overview": (
        "**CodeDNA** is an open coding profile analyzer built by **Shruti Rai**.\n\n"
        "Instead of just counting green squares or vanity stars on GitHub, it looks at how you actually code:\n"
        "- **Core Strengths**: Speed, code quality, weekly habit, and skill variety\n"
        "- **Coding Style**: Whether you are an Explorer, Deep Specialist, or Fast Builder\n"
        "- **Honest Habits**: Rewards steady weekly coding and spots bot-spam or weekend dumping\n"
        "- **Career Direction**: Tells you which jobs match your skills and the exact next tool to learn!"
    ),
    "how_to_analyze": (
        "### How the Analysis Happens (3 Simple Steps)\n\n"
        "CodeDNA analyzes any public GitHub profile in **3 automated steps**:\n\n"
        "1. **Scan Public GitHub Repositories**:\n"
        "   We look at your public repositories, languages, commit frequency, stars, forks, and repository health (READMEs and licenses).\n\n"
        "2. **Spot Honest Coding Habits (Anti-Burstiness)**:\n"
        "   Our algorithm checks *when* you code across weeks and months. It rewards steady, honest weekly coding and filters out artificial bulk-dumping (like uploading 50 files in one night or using commit bots).\n\n"
        "3. **Calculate Scores & Match Careers**:\n"
        "   - Computes your **Developer Score (0–100)** across 6 core skills: Code Depth, Tech Variety, Weekly Habit, Project Depth, Teamwork, and Learning Velocity.\n"
        "   - Identifies your **Coding Personality** (Explorer, Deep Specialist, Contributor, Builder).\n"
        "   - Compares your skills against real job requirements to show your **Career Match %** and your **#1 recommended skill to learn next**."
    ),
    "score_intelligence": (
        "### How the Developer Score (0–100) Works\n\n"
        "Your overall score is calculated from real coding habits:\n\n"
        "1. **Coding Speed & Momentum (20%)**: How regularly and actively you push code.\n"
        "2. **Code Quality (20%)**: Building clean projects with tests and good structure.\n"
        "3. **Weekly Habit / Anti-Burstiness (15%)**: Coding steadily week after week instead of dumping everything at once.\n"
        "4. **Skill Variety (15%)**: Working comfortably across frontend, backend, or data tools.\n"
        "5. **Tool Mastery (10%)**: How deeply you know your primary languages.\n"
        "6. **Teamwork (10%)**: Pull requests, code reviews, and community collaboration.\n"
        "7. **Project Impact (10%)**: Creating real, working apps and tools."
    ),
    "anti_burstiness": (
        "### What is Anti-Burstiness?\n\n"
        "**Anti-Burstiness** simply checks whether you code with a **real, healthy habit**:\n\n"
        "- **The Issue**: It is easy to game GitHub stats by uploading 50 empty commits in one night or running a bot script.\n"
        "- **How CodeDNA Solves It**: We look at the gaps between your commits over weeks and months.\n"
        "- **The Result**: A developer who codes steadily 3 days every week earns a much higher habit score than someone who dumps 100 files in a single weekend."
    ),
    "shannon_entropy": (
        "### Skill Variety (Tech Diversity)\n\n"
        "Skill Variety measures how balanced and adaptable your programming languages and tools are:\n\n"
        "- **High Variety**: You can write frontend, backend, or data code smoothly across multiple tools.\n"
        "- **Deep Focus**: You concentrate heavily on mastering one primary language.\n"
        "- **Balanced Growth**: Shows recruiters you are not trapped in a single framework and can pick up new tools fast."
    ),
    "archetypes": (
        "### Your Coding Personality (Archetype)\n\n"
        "Based on your public GitHub code, CodeDNA categorizes your style into one of 4 archetypes:\n\n"
        "- **The Technology Explorer**: Versatile builder who loves experimenting across multiple languages.\n"
        "- **The Deep Specialist**: High focus and deep mastery in one specific technology stack.\n"
        "- **The Open Source Contributor**: Actively collaborates on shared projects, PRs, and community tools.\n"
        "- **The Builder**: Rapid full-cycle product creator shipping end-to-end applications."
    ),
    "technology_dna": (
        "### Your Tech Stack\n\n"
        "The Tech Stack section shows every language and library found in your public repositories:\n\n"
        "- **Core Languages**: Your most frequently used technologies (e.g. Python, TypeScript, JavaScript, C++).\n"
        "- **Learning Momentum**: Flags tools you are actively picking up with `↑ Rising` or `✨ New` badges.\n"
        "- **Ecosystem Balance**: Shows what percentage of your total code belongs to frontend, backend, or algorithms."
    ),
    "radar_dimensions": (
        "### 6 Core Skills Radar\n\n"
        "Your skills radar visualizes your coding strengths across 6 key areas:\n\n"
        "1. **Code Depth**: Mastery and deep technical work in your primary language.\n"
        "2. **Tech Variety**: Breadth across frontend, backend, or data tools.\n"
        "3. **Weekly Habit**: Consistent coding cadence week over week.\n"
        "4. **Project Depth**: Complexity and real-world scale of your projects.\n"
        "5. **Teamwork**: Pull requests, forks, reviews, and community collaboration.\n"
        "6. **Learning Velocity**: How quickly you adopt new tools and libraries."
    ),
    "growth_velocity": (
        "### Coding Growth & Velocity\n\n"
        "CodeDNA tracks how your coding footprint expands year over year:\n\n"
        "- **Yearly Progress**: Compares your repositories and code depth across consecutive years (e.g. 2024 to 2026).\n"
        "- **Momentum Lift**: Calculates your year-over-year growth percentage (e.g. `+42% YoY`) to show employers you are actively accelerating!"
    ),
    "focus_rhythm": (
        "### When Do You Code? (Weekly Activity Heatmap)\n\n"
        "This punchcard visualizes your peak coding hours across all 7 days of the week:\n\n"
        "- **Peak Focus Time**: Highlights the exact days and hours you commit the most code (e.g. Thursday evenings or weekend sprints).\n"
        "- **Honest Schedule**: Demonstrates your authentic workflow to recruiters without needing a resume."
    ),
    "shruti_profile": (
        "### About Shruti Rai (@shrutirai29)\n\n"
        "- **Role**: Full-Stack Developer & Computer Science Engineer\n"
        "- **University**: Rashtriya Raksha University, India\n"
        "- **Developer Score**: **86.4 / 100** (Top 8% among peers)\n"
        "- **Coding Personality**: **The Technology Explorer**\n"
        "- **Core Skills**: JavaScript, Python, TypeScript, React, C++, and algorithms\n"
        "- **Featured Projects**: **CodeDNA** (Developer profile analyzer), **study-roulette**, **code4nature**, and **SIH Hackathon** prototype."
    ),
    "audited_projects": (
        "### Projects & Repositories\n\n"
        "CodeDNA audits each of your public GitHub repositories:\n\n"
        "- **Code Quality & Size**: Measures project complexity, star ratings, and community interest.\n"
        "- **Tech Stack Used**: Detects the primary languages and frameworks in each codebase.\n"
        "- **Documentation Health**: Checks for clear READMEs and open-source licenses."
    ),
    "career_matching": (
        "### Career Matching & Next Skills\n\n"
        "CodeDNA compares your real GitHub skills against industry job requirements:\n\n"
        "- **Role Match %**: Calculates how well your code fits roles like Full-Stack Developer, SDE, Frontend Architect, or Data Scientist.\n"
        "- **Strengths & Gaps**: Shows what skills you already have and what critical tools you are missing.\n"
        "- **Next Best Skill**: Recommends the exact next tool to learn (e.g. Docker, CI/CD, or Redis) for the fastest promotion!"
    ),
    "api_integration": (
        "### Free Developer REST API\n\n"
        "Anyone can query CodeDNA data using our public REST endpoint:\n\n"
        "```bash\nGET /api/profile?username=shrutirai29\n```\n\n"
        "- **No API Key Required**: Free to use with zero registration.\n"
        "- **Instant JSON**: Returns developer scores, archetypes, skills, rhythm, and career matches for your portfolios or student projects."
    ),
    "api_key_auth": (
        "### Zero API Key Needed! ⚡\n\n"
        "All CodeDNA endpoints are **100% free and open**!\n\n"
        "- No signup, passwords, or credit cards required.\n"
        "- Just call: `GET /api/profile?username=YOUR_GITHUB_HANDLE`\n"
        "- Returns instant JSON data for portfolios, resumes, and student apps."
    ),
    "theme_system": (
        "### Website Design & Themes\n\n"
        "CodeDNA features a dual-mode high-tech developer aesthetic:\n\n"
        "- **Dark Mode**: Terminal obsidian canvas with a 3D interactive cyber constellation, horizon grid floor, and neon green/cyan developer accents.\n"
        "- **Light Mode**: Clean studio IDE theme with crisp borders and high-contrast syntax highlights.\n"
        "- **Toggle**: Click the sun/moon icon in the top navigation bar to switch anytime!"
    ),
    "out_of_scope": (
        "I am the **CodeDNA Assistant**, specifically here to help you with questions about this website, developer scores, coding habits, and Shruti Rai's profile.\n\n"
        "I don't answer general trivia or off-topic questions, but feel free to ask about:\n"
        "- How your coding score is calculated\n"
        "- What Anti-Burstiness means\n"
        "- The skills radar and job matching\n"
        "- Shruti Rai's projects\n"
        "- Using the free API!"
    )
}

# Aliases to guarantee all keys map cleanly
RESPONSES["seven_d_radar"] = RESPONSES["radar_dimensions"]
RESPONSES["clustering_archetypes"] = RESPONSES["archetypes"]
RESPONSES["entropy"] = RESPONSES["shannon_entropy"]
RESPONSES["career_recommender"] = RESPONSES["career_matching"]
RESPONSES["api_endpoints"] = RESPONSES["api_integration"]
RESPONSES["dataset_details"] = RESPONSES["how_to_analyze"]
RESPONSES["benchmark_peer"] = RESPONSES["radar_dimensions"]
RESPONSES["contact_links"] = RESPONSES["shruti_profile"]
RESPONSES["skill_simulator"] = RESPONSES["career_matching"]
RESPONSES["code_dna_meaning"] = RESPONSES["platform_overview"]
RESPONSES["export_download"] = RESPONSES["api_integration"]

TOPIC_TITLES = {
    "greeting": "Welcome to CodeDNA",
    "pleasantry": "Pleasantry",
    "platform_overview": "What is CodeDNA?",
    "how_to_analyze": "How the Analysis Works",
    "score_intelligence": "How the Score Works",
    "anti_burstiness": "What is Anti-Burstiness?",
    "shannon_entropy": "Skill Variety",
    "archetypes": "Coding Personality",
    "technology_dna": "Your Tech Stack",
    "radar_dimensions": "Skills Radar",
    "growth_velocity": "Growth & Rhythm",
    "focus_rhythm": "Coding Rhythm",
    "shruti_profile": "About Shruti Rai",
    "audited_projects": "Projects & Repositories",
    "career_matching": "Career Matcher",
    "api_integration": "Public API Endpoints",
    "api_key_auth": "Free API (No Key Needed)",
    "theme_system": "Website Design & Themes",
    "out_of_scope": "Question Out of Scope",
    # Aliases
    "seven_d_radar": "Skills Radar",
    "clustering_archetypes": "Coding Personality",
    "entropy": "Skill Variety",
    "career_recommender": "Career Matcher",
    "api_endpoints": "Public API Endpoints",
    "dataset_details": "How the Analysis Works",
    "contact_links": "Contact & Links",
    "benchmark_peer": "Skills Radar",
    "skill_simulator": "Career Matcher",
    "code_dna_meaning": "What is CodeDNA?",
    "export_download": "Public API Endpoints"
}


class FallbackVectorClassifier:
    """
    Exact mathematical TF-IDF N-gram Centroid Classifier.
    Trained directly on the labeled training corpus.
    Requires 0 binary C-dependencies (runs everywhere including bare serverless).
    """
    def __init__(self):
        self.idf = {}
        self.centroids = {}
        self._train()

    def _tokenize(self, text: str):
        text = text.lower().strip()
        words = re.findall(r'\b\w+\b', text)
        tokens = list(words)
        # Word bigrams
        for i in range(len(words) - 1):
            tokens.append(f"{words[i]}_{words[i+1]}")
        # Subword character trigrams
        for w in words:
            if len(w) >= 3:
                for i in range(len(w) - 2):
                    tokens.append(f"#{w[i:i+3]}")
        return tokens

    def _train(self):
        corpus = {}
        if DATA_PATH.exists():
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                corpus = json.load(f)
        else:
            # Emergency minimal dataset
            corpus = {
                "greeting": ["hi", "hello", "hey", "namaste"],
                "platform_overview": ["what is codedna", "explain codedna"],
                "out_of_scope": ["weather", "cake", "cricket"]
            }

        docs = []
        doc_labels = []
        for label, samples in corpus.items():
            for s in samples:
                tokens = self._tokenize(s)
                if tokens:
                    docs.append(tokens)
                    doc_labels.append(label)

        n_docs = len(docs)
        df = Counter()
        for d in docs:
            for t in set(d):
                df[t] += 1

        self.idf = {t: math.log((n_docs + 1) / (cnt + 1)) + 1.0 for t, cnt in df.items()}

        raw_centroids = {}
        for d, lbl in zip(docs, doc_labels):
            vec = self._vectorize(d)
            if lbl not in raw_centroids:
                raw_centroids[lbl] = Counter()
            for t, w in vec.items():
                raw_centroids[lbl][t] += w

        self.centroids = {}
        for lbl, c in raw_centroids.items():
            norm = math.sqrt(sum(w * w for w in c.values())) or 1.0
            self.centroids[lbl] = {t: w / norm for t, w in c.items()}

    def _vectorize(self, tokens):
        tf = Counter(tokens)
        vec = {}
        norm_sq = 0.0
        for t, count in tf.items():
            if t in self.idf:
                weight = (1 + math.log(count)) * self.idf[t]
                vec[t] = weight
                norm_sq += weight * weight
        norm = math.sqrt(norm_sq) or 1.0
        return {t: w / norm for t, w in vec.items()}

    def predict(self, text: str):
        tokens = self._tokenize(text)
        q_vec = self._vectorize(tokens)
        scores = {}
        for lbl, c_vec in self.centroids.items():
            scores[lbl] = sum(w * c_vec.get(t, 0.0) for t, w in q_vec.items())

        if not scores or max(scores.values()) <= 0.0:
            return "out_of_scope", 0.0

        best_lbl = max(scores, key=scores.get)
        confidence = float(scores[best_lbl])
        return best_lbl, confidence


_SKLEARN_MODEL = None
_FALLBACK_MODEL = None

def get_engine():
    """Returns (engine, engine_type)."""
    global _SKLEARN_MODEL, _FALLBACK_MODEL
    if HAS_SKLEARN and MODEL_PATH.exists():
        if _SKLEARN_MODEL is None:
            try:
                _SKLEARN_MODEL = joblib.load(MODEL_PATH)
            except Exception:
                _SKLEARN_MODEL = None
        if _SKLEARN_MODEL is not None:
            return _SKLEARN_MODEL, "sklearn"

    if _FALLBACK_MODEL is None:
        _FALLBACK_MODEL = FallbackVectorClassifier()
    return _FALLBACK_MODEL, "vector_centroid"


class TrainedCodeDNAAgent:
    """Trained NLP Classification & Inference Agent for CodeDNA."""
    
    CONFIDENCE_THRESHOLD = 0.18
    
    @classmethod
    def answer(cls, user_message: str) -> dict:
        text = (user_message or "").strip()
        
        if not text:
            return {
                "response": "Please enter a question regarding the CodeDNA platform, scoring metrics, or Shruti Rai's profile.",
                "topic": "Empty Query",
                "confidence": 0.0,
                "in_scope": False,
                "intent": "empty"
            }
            
        engine, engine_type = get_engine()
        
        if engine_type == "sklearn":
            pred_class = str(engine.predict([text])[0])
            probs = engine.predict_proba([text])[0]
            class_idx = list(engine.classes_).index(pred_class)
            confidence = float(probs[class_idx])

            # Platform domain intent booster:
            # If model leaned towards out_of_scope but user clearly asked a platform question,
            # select the highest scoring in-scope intent!
            platform_keywords = [
                "analysis", "analyze", "analyzing", "analyzer", "score", "codedna", "dna",
                "burstiness", "anti-burstiness", "shruti", "github", "profile", "skill",
                "skills", "radar", "career", "job", "projects", "repo", "repos", "repository",
                "api", "endpoint", "personality", "archetype", "rhythm", "heatmap", "theme",
                "dark mode", "light mode", "how it works", "methodology", "kpi", "habit"
            ]
            has_platform_kw = any(kw in text.lower() for kw in platform_keywords)
            if pred_class == "out_of_scope" and has_platform_kw:
                in_scope_classes = [c for c in engine.classes_ if c != "out_of_scope"]
                in_scope_probs = [(c, probs[list(engine.classes_).index(c)]) for c in in_scope_classes]
                in_scope_probs.sort(key=lambda x: x[1], reverse=True)
                if in_scope_probs and in_scope_probs[0][1] >= 0.05:
                    pred_class, confidence = in_scope_probs[0]
        else:
            pred_class, confidence = engine.predict(text)
            
        # Check domain guardrails
        is_out_of_scope = (pred_class == "out_of_scope") or (confidence < cls.CONFIDENCE_THRESHOLD)
        
        if is_out_of_scope:
            return {
                "response": RESPONSES["out_of_scope"],
                "topic": TOPIC_TITLES["out_of_scope"],
                "confidence": round(confidence, 3),
                "in_scope": False,
                "intent": pred_class,
                "engine": engine_type
            }
            
        response_text = RESPONSES.get(pred_class, RESPONSES["platform_overview"])
        topic_title = TOPIC_TITLES.get(pred_class, "CodeDNA Intelligence")
        
        return {
            "response": response_text,
            "topic": topic_title,
            "confidence": round(confidence, 3),
            "in_scope": True,
            "intent": pred_class,
            "engine": engine_type
        }


if __name__ == "__main__":
    queries = [
        "Hello!",
        "what is codedna?",
        "how do i get an api key?",
        "what is anti burstiness?",
        "tell me a recipe for pancakes",
        "who is Shruti Rai?"
    ]
    print("Testing TrainedCodeDNAAgent:")
    for q in queries:
        ans = TrainedCodeDNAAgent.answer(q)
        print(f"\nQuery: '{q}'")
        print(f"Intent: {ans['intent']} | In-Scope: {ans['in_scope']} | Confidence: {ans['confidence']} | Engine: {ans.get('engine')}")
        print(f"Topic: {ans['topic']}")
        print(f"Response: {ans['response'][:90]}...")
