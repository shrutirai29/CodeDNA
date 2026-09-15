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
        "- **How the Developer Score Works**: What makes up the 0 to 100 score\n"
        "- **The Skills Radar**: Speed, quality, teamwork, and variety\n"
        "- **Anti-Burstiness**: Why regular weekly coding matters more than sudden bulk uploads\n"
        "- **Career Matcher**: Which job roles fit best and what skill to learn next\n"
        "- **Shruti Rai's Profile**: Projects, skills, and background\n"
        "- **Free API**: How to get raw JSON data without any sign-up or API key\n\n"
        "What would you like to know?"
    ),
    "platform_overview": (
        "**CodeDNA** is an open coding profile analyzer built by **Shruti Rai**.\n\n"
        "Instead of just counting green squares or vanity stars on GitHub, it looks at how you actually code:\n"
        "- **Core Strengths**: Speed, code quality, weekly habit, and skill variety\n"
        "- **Coding Style**: Whether you are an Explorer, Deep Specialist, or Fast Builder\n"
        "- **Honest Habits**: Rewards steady weekly coding and spots bot-spam or weekend dumping\n"
        "- **Career Direction**: Tells you which jobs match your skills and the exact next tool to learn!"
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
        "- **What We Do**: We check your activity over weeks and months.\n"
        "- **The Reward**: If you code steadily week by week, you get a high consistency score (like Shruti Rai's **84/100**). If someone dumps all their code on one Sunday and vanishes for months, their score drops."
    ),
    "entropy": (
        "### What is Skill Variety (Entropy)?\n\n"
        "Skill Variety measures whether you only know one tool or can comfortably adapt to different layers of tech:\n\n"
        "- Developers who only touch one file format have low variety.\n"
        "- Developers who build across web apps (JavaScript/TypeScript), backend APIs (Python), and databases have healthy variety and adapt faster to modern engineering teams."
    ),
    "seven_d_radar": (
        "### The 7 Core Skills Radar\n\n"
        "CodeDNA visualizes your coding profile across 7 key strengths:\n\n"
        "1. **Depth**: How well you understand your core languages.\n"
        "2. **Breadth**: The range of different tools and frameworks you can use.\n"
        "3. **Consistency**: Your day-to-day coding habit and steady rhythm.\n"
        "4. **Complexity**: Building full, multi-tier projects.\n"
        "5. **Teamwork**: Working with others through reviews and open-source.\n"
        "6. **Adaptability**: How fast you pick up fresh libraries and modern tools.\n"
        "7. **Impact**: Delivering real-world applications that solve problems."
    ),
    "technology_dna": (
        "### Your Tech Stack\n\n"
        "The Tech Stack view shows the tools you actually use in your GitHub projects:\n\n"
        "- **Languages**: Python, JavaScript, TypeScript, C++, and HTML/CSS.\n"
        "- **Libraries & Frameworks**: React, FastAPI, Scikit-Learn, TailwindCSS, Docker.\n"
        "- **Activity Signals**: Shows which tools you are actively using more this month vs. mature tools in your toolkit."
    ),
    "benchmark_peer": (
        "### How You Compare to Other Developers\n\n"
        "CodeDNA compares your coding activity against hundreds of developer profiles so you can see where you stand:\n\n"
        "- **Top 5%**: Outstanding weekly consistency (>84/100) and multi-skill adaptability.\n"
        "- **Top 15%**: Strong project depth and steady development rhythm.\n"
        "- **Top 40%**: Emerging developer with clear domain focus.\n\n"
        "Shruti Rai ranks in the **Top 5%** for consistency and adaptability!"
    ),
    "skill_simulator": (
        "### Interactive Skill Simulator\n\n"
        "The **Skill Simulator** lets you see how learning a new tool would boost your career:\n\n"
        "- Pick a skill like Docker, Kubernetes, or ML Engineering.\n"
        "- Watch your skills radar and match percentage update immediately in real time!\n"
        "- Try it out right on the homepage in the Simulator tab."
    ),
    "career_recommender": (
        "### Career Matcher\n\n"
        "Our system matches your GitHub skills with real industry jobs:\n\n"
        "- Finds the roles that fit what you already build (like Full-Stack Developer or Software Engineer).\n"
        "- Shows you the exact gap to fill (e.g. adding Docker to jump from 80% to 90% job readiness)."
    ),
    "shruti_profile": (
        "### Developer Profile: Shruti Rai\n\n"
        "**Shruti Rai** is a Full-Stack Developer and Computer Science Engineering student who created CodeDNA:\n\n"
        "- **Creator of**: CodeDNA Developer Career Intelligence Platform\n"
        "- **Core Skills**: Python, JavaScript, TypeScript, FastAPI, Scikit-Learn, Web Architecture\n"
        "- **University**: Rashtriya Raksha University\n"
        "- **GitHub**: [github.com/shrutirai29](https://github.com/shrutirai29)"
    ),
    "contact_links": (
        "### Connect with Shruti Rai\n\n"
        "- **GitHub**: [github.com/shrutirai29](https://github.com/shrutirai29)\n"
        "- **CodeDNA Repository**: [github.com/shrutirai29/CodeDNA](https://github.com/shrutirai29/CodeDNA)\n"
        "- **Live Website**: [code-dna-alpha.vercel.app](https://code-dna-alpha.vercel.app)"
    ),
    "api_key_auth": (
        "### Do You Need an API Key?\n\n"
        "**Good news: You do NOT need any API key!**\n\n"
        "The CodeDNA REST API is **100% free and open to everyone** with zero sign-up or headers required:\n\n"
        "- `GET /api/profile?username=shrutirai29`\n"
        "- `POST /api/chat`\n\n"
        "Try it in your browser or with curl anytime!"
    ),
    "api_endpoints": (
        "### Free Public API Endpoints\n\n"
        "You can use our free REST API directly without any key:\n\n"
        "1. `GET /api/profile?username={handle}` — Returns full skill breakdown and score in clean JSON.\n"
        "2. `POST /api/chat` — Ask this AI Assistant any question via API.\n"
        "3. `GET /api/profiles` — Returns list of benchmark profiles."
    ),
    "export_download": (
        "### Exporting Your Profile\n\n"
        "You can access your CodeDNA data in multiple simple ways:\n\n"
        "- **Live JSON**: Click 'View Raw JSON' to get clean machine-readable data.\n"
        "- **Interactive Visuals**: Inspect the Skills Radar and weekly heatmap directly on the page.\n"
        "- **Share Profile**: Share your direct URL with recruiters and team leads."
    ),
    "clustering_archetypes": (
        "### Coding Personalities (Archetypes)\n\n"
        "CodeDNA identifies your primary coding style:\n\n"
        "- **The Explorer**: Loves trying new languages, modern frameworks, and cross-stack apps (like Shruti Rai).\n"
        "- **The Deep Specialist**: Goes very deep into one language and system.\n"
        "- **The Fast Builder**: High velocity, quick turnaround, and steady shipping."
    ),
    "code_dna_meaning": (
        "### What Does 'CodeDNA' Mean?\n\n"
        "Just like biological DNA makes every person unique, every programmer has their own unique way of coding, choosing tools, and solving problems.\n\n"
        "CodeDNA celebrates authentic coding craftsmanship instead of empty vanity metrics."
    ),
    "dataset_details": (
        "### How We Read Data\n\n"
        "CodeDNA safely looks at your public GitHub commits:\n\n"
        "- When and how often you push code\n"
        "- What programming languages you write in\n"
        "- How organized your project repositories are"
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

TOPIC_TITLES = {
    "greeting": "Welcome to CodeDNA",
    "platform_overview": "What is CodeDNA?",
    "score_intelligence": "How the Score Works",
    "anti_burstiness": "What is Anti-Burstiness?",
    "entropy": "Skill Variety",
    "seven_d_radar": "7 Core Skills Radar",
    "technology_dna": "Your Tech Stack",
    "benchmark_peer": "How You Compare",
    "skill_simulator": "Interactive Skill Simulator",
    "career_recommender": "Career Matcher",
    "shruti_profile": "About Shruti Rai",
    "contact_links": "Contact & Links",
    "api_key_auth": "Free API (No Key Needed)",
    "api_endpoints": "Public API Endpoints",
    "export_download": "Exporting Your Data",
    "clustering_archetypes": "Your Coding Personality",
    "code_dna_meaning": "The Meaning of CodeDNA",
    "dataset_details": "How We Read Data",
    "out_of_scope": "Question Out of Scope"
}

# =====================================================================
# PURE-PYTHON TF-IDF VECTOR CLASSIFIER (ZERO-DEPENDENCY ML ENGINE)
# =====================================================================
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
