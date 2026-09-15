"""
CodeDNA Trained Machine Learning AI Agent
Classifies user queries using a trained Scikit-Learn NLP pipeline
and provides intelligent, platform-scoped assistance.
"""

import os
from pathlib import Path
import joblib
import numpy as np

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "codedna_chatbot_agent.joblib"

RESPONSES = {
    "greeting": (
        "Hello! I am the **CodeDNA Trained AI Agent**.\n\n"
        "I am trained on the CodeDNA genome intelligence platform. You can ask me about:\n"
        "- **DNA Scoring & Formula**: How biometric dev metrics are computed\n"
        "- **7D Engineering Radar**: Velocity, Quality, Entropy, Collaboration & more\n"
        "- **Anti-Burstiness & Entropy**: Detecting sustainable engineering rhythms\n"
        "- **Interactive Simulators**: What-if skill simulator & Career recommender\n"
        "- **Developer Profile**: Shruti Rai's DNA genome and achievements\n"
        "- **Open REST API**: Direct JSON endpoints without authentication\n\n"
        "How can I assist your analysis today?"
    ),
    "platform_overview": (
        "**CodeDNA** is an Enterprise Developer Genome & Biometric Intelligence Platform created by **Shruti Rai**.\n\n"
        "It transforms multi-dimensional GitHub commit telemetry into actionable biometric engineering signatures:\n"
        "- **7D Engineering Radar**: Multi-axial evaluation across velocity, quality, impact, consistency, entropy, breadth, and collaboration.\n"
        "- **Developer Archetyping**: Unsupervised clustering (K-Means & PCA) categorizing devs into Deep Specialists, Full-Stack Architects, and Momentum Drivers.\n"
        "- **Biometric Anti-Burstiness**: Rigorous mathematical modeling to distinguish authentic sustained mastery from bot or weekend-binge bursts.\n"
        "- **Interactive Simulator**: Dynamic career recommender and skill projection engines."
    ),
    "score_intelligence": (
        "### How the CodeDNA Score is Calculated\n\n"
        "The overall **DNA Score (0–100)** is computed using a weighted composite of normalized engineering dimensions:\n\n"
        "1. **Velocity & Momentum (20%)**: Rolling commit frequency, active day distribution, and throughput velocity.\n"
        "2. **Code Quality & Longevity (20%)**: Test coverage signals, PR survival rate, and low regression overhead.\n"
        "3. **Anti-Burstiness Index (15%)**: Measures commit interval variance. Penalizes sporadic artificial bulk bursts; rewards consistent daily execution.\n"
        "4. **Information Entropy (15%)**: Shannon entropy over commit dispersion and architectural subsystem changes.\n"
        "5. **Multi-Technology Breadth (10%)**: Diversity and proficiency across languages, runtimes, and frameworks.\n"
        "6. **Collaboration Factor (10%)**: PR discussions, code reviews, and community issue interactions.\n"
        "7. **Architecture Impact (10%)**: Scope and longevity of core codebase contributions."
    ),
    "anti_burstiness": (
        "### Understanding Anti-Burstiness\n\n"
        "**Anti-Burstiness** is a proprietary biometric metric that evaluates the temporal rhythm of coding activity.\n\n"
        "- **The Problem**: Superficial commit counts can easily be gamed by batch squashes, bot commits, or short-lived weekend binges.\n"
        "- **The Math**: We analyze the inter-arrival time (IAT) variance between commits, normalized across calendar weeks.\n"
        "- **The Score**: High anti-burstiness (>0.80) indicates steady, sustainable development cadence and genuine craftsmanship, while low scores highlight episodic or bot-driven bursts."
    ),
    "entropy": (
        "### Information Entropy in CodeDNA\n\n"
        "CodeDNA uses **Shannon Entropy** to evaluate the structural diversity and complexity of a developer's workflow:\n\n"
        "- **Commit Dispersion**: Quantifies whether commits are uniformly distributed across days or clumped artificially.\n"
        "- **Subsystem Breadth**: Measures whether code diffs touch backend, frontend, ML, and infrastructure systems in a balanced manner.\n"
        "- An optimal entropy score (0.70–0.90) indicates well-rounded, modular development without chaos."
    ),
    "seven_d_radar": (
        "### The 7D Engineering Radar\n\n"
        "CodeDNA benchmarks developers across 7 orthogonal engineering dimensions:\n\n"
        "1. **Velocity**: Deployment cadence, PR merge cycles, and commit throughput.\n"
        "2. **Quality**: Test density, static analysis adherence, and refactor ratios.\n"
        "3. **Consistency**: Longitudinal presence and anti-burstiness regularity.\n"
        "4. **Entropy**: Information diversity and systemic breadth.\n"
        "5. **Collaboration**: Review depth, community responsiveness, and mentorship.\n"
        "6. **Architecture Impact**: Core module ownership, longevity, and structural contributions.\n"
        "7. **Polyglot Breadth**: Multi-language adaptability across modern stacks."
    ),
    "technology_dna": (
        "### Technology DNA Matrix\n\n"
        "Shruti Rai's CodeDNA profile features an integrated full-stack & AI/Data telemetry:\n\n"
        "- **Languages**: Python (Core/ML), JavaScript/TypeScript (Web/UI), SQL (Data), HTML5/CSS3.\n"
        "- **Data & ML**: Scikit-Learn, Pandas, NumPy, PCA, K-Means Clustering, SciPy.\n"
        "- **Web & Backend**: FastAPI / Vercel Serverless, Streamlit, Docker.\n"
        "- **Architecture**: Microservices, RESTful API Design, Responsive Minimalist UX."
    ),
    "benchmark_peer": (
        "### Peer Benchmarks & Percentile Ranking\n\n"
        "CodeDNA aggregates telemetry across hundreds of developer profiles to provide empirical percentile rankings:\n\n"
        "- **Elite Tier (Top 5%)**: Anti-burstiness > 0.85, 7D composite > 88, Multi-language proficiency.\n"
        "- **Accomplished (Top 15%)**: Consistent rhythm, strong system impact, robust code quality.\n"
        "- **Emerging (Top 40%)**: Developing cadence, focused domain specialization.\n\n"
        "Shruti Rai ranks in the **Top 5%** for Anti-Burstiness and Architecture Entropy."
    ),
    "skill_simulator": (
        "### Interactive What-If Skill Simulator\n\n"
        "The **Skill Simulator** lets you project how acquiring or deepening specific engineering skills impacts your overall CodeDNA score.\n\n"
        "- Adjust sliders for Cloud Architecture, Distributed Systems, ML Engineering, and Test Automation.\n"
        "- Watch the 7D Radar and overall composite score re-balance dynamically in real time!\n"
        "- Try it right now on the homepage under the **Simulator** section."
    ),
    "career_recommender": (
        "### ML Career Recommender\n\n"
        "Our machine learning recommendation engine matches developer archetypes to tailored growth paths:\n\n"
        "- Uses cosine similarity and nearest-centroid matching against industry career clusters.\n"
        "- Pinpoints actionable gap analysis (e.g., adding CI/CD or System Design to bridge into a Staff Engineer role).\n"
        "- Provides instant recommendations for next high-impact technologies to master."
    ),
    "shruti_profile": (
        "### Developer Profile: Shruti Rai\n\n"
        "**Shruti Rai** is an AI Engineer, Data Analytics Specialist, and Full-Stack Developer who designed and created CodeDNA.\n\n"
        "- **Role**: Lead Developer & Creator of CodeDNA\n"
        "- **Core Expertise**: Machine Learning, Data Analytics & Visualization, Python, REST APIs, Modern Web Architecture\n"
        "- **GitHub**: [github.com/shrutirai29](https://github.com/shrutirai29)\n"
        "- **Portfolio Project**: CodeDNA Developer Genome Platform"
    ),
    "contact_links": (
        "### Contact & Connect with Shruti Rai\n\n"
        "- **GitHub**: [github.com/shrutirai29](https://github.com/shrutirai29)\n"
        "- **Project Repository**: [github.com/shrutirai29/CodeDNA](https://github.com/shrutirai29/CodeDNA)\n"
        "- **Platform Web App**: [code-dna-alpha.vercel.app](https://code-dna-alpha.vercel.app)\n\n"
        "Feel free to explore the repository, star the project, or reach out for collaboration!"
    ),
    "api_key_auth": (
        "### CodeDNA API Authentication\n\n"
        "**Good news: You do NOT need any API key!**\n\n"
        "The CodeDNA REST API is **100% open-access** and public. You can immediately send GET or POST requests to our endpoints with zero authentication headers:\n\n"
        "- `GET /api/profile` - Full developer genome and metrics\n"
        "- `GET /api/skills` - Skill taxonomy and proficiency\n"
        "- `GET /api/metrics` - 7D biometric telemetry data\n"
        "- `POST /api/chat` - Query this trained AI Agent\n\n"
        "Try it now with `curl https://code-dna-alpha.vercel.app/api/profile`!"
    ),
    "api_endpoints": (
        "### CodeDNA Public REST API Endpoints\n\n"
        "CodeDNA provides comprehensive REST APIs ready for integration:\n\n"
        "1. `GET /api/profile` - Returns Shruti Rai's full biometric genome profile.\n"
        "2. `GET /api/metrics` - High-resolution 7D radar telemetry and percentiles.\n"
        "3. `GET /api/skills` - Categorized technology stack breakdown.\n"
        "4. `GET /api/career` - Machine learning career trajectory recommendations.\n"
        "5. `POST /api/chat` - Query this trained Machine Learning AI Agent (payload: `{\"message\": \"your question\"}`).\n\n"
        "All endpoints return standard JSON and require no API keys."
    ),
    "export_download": (
        "### Export & Reporting Options\n\n"
        "You can export your CodeDNA analysis in multiple formats:\n\n"
        "- **JSON Feed**: Consume direct machine-readable data via `/api/profile` and `/api/metrics`.\n"
        "- **Interactive Dashboard**: Use the web platform to visualize and inspect 7D radar charts and archetype clusters.\n"
        "- **API Integration**: Easily pipe CodeDNA telemetry into custom CI/CD pipelines or HR dashboards."
    ),
    "clustering_archetypes": (
        "### Machine Learning Developer Archetypes\n\n"
        "CodeDNA clusters developers into archetypes using unsupervised machine learning (K-Means & PCA dimensional reduction):\n\n"
        "- **Deep Specialist**: High depth in a specific language/subsystem; exceptional code quality and anti-burstiness.\n"
        "- **Full-Stack Architect**: Broad polyglot footprint across backend, frontend, and infrastructure with high entropy.\n"
        "- **Momentum Driver**: High velocity, rapid PR turnaround, and strong collaboration rhythm.\n\n"
        "The model accurately identifies career archetypes from raw git commit histories."
    ),
    "code_dna_meaning": (
        "### What Does 'CodeDNA' Mean?\n\n"
        "Much like biological DNA defines an organism's traits, **CodeDNA** posits that every software engineer has a unique biometric signature embedded in how they write, commit, structure, and review code.\n\n"
        "Rather than judging developers purely on superficial commit counts or leetcode tests, CodeDNA decodes authentic engineering craftsmanship through multi-dimensional mathematical analysis."
    ),
    "dataset_details": (
        "### Telemetry & Dataset Details\n\n"
        "CodeDNA's intelligence engine analyzes temporal telemetry extracted from version control systems:\n\n"
        "- Longitudinal commit timestamps across calendar intervals\n"
        "- Diff metrics: additions, deletions, file dispersion, churn rates\n"
        "- Repository multi-language breakdown\n"
        "- Normalized against peer cohort baselines for fair percentile comparisons"
    ),
    "out_of_scope": (
        "I am the **CodeDNA Trained AI Agent**, specifically trained to assist with developer genome analytics, "
        "biometric scoring, architecture benchmarks, and the CodeDNA platform.\n\n"
        "I do not answer general or off-topic questions. Please feel free to ask about:\n"
        "- CodeDNA score calculation and formulas\n"
        "- Anti-burstiness & entropy metrics\n"
        "- 7D engineering radar\n"
        "- Shruti Rai's developer profile\n"
        "- Free REST API endpoints"
    )
}

TOPIC_TITLES = {
    "greeting": "CodeDNA Assistant Greeting",
    "platform_overview": "CodeDNA Platform Overview",
    "score_intelligence": "Biometric Scoring Intelligence",
    "anti_burstiness": "Anti-Burstiness Mathematical Metric",
    "entropy": "Information Entropy & Dispersion",
    "seven_d_radar": "7D Engineering Radar",
    "technology_dna": "Technology DNA Matrix",
    "benchmark_peer": "Peer Benchmarks & Percentiles",
    "skill_simulator": "What-If Skill Simulator",
    "career_recommender": "ML Career Recommender",
    "shruti_profile": "Shruti Rai Developer Profile",
    "contact_links": "Contact & Project Links",
    "api_key_auth": "API Authentication (Zero Key Required)",
    "api_endpoints": "Public REST API Endpoints",
    "export_download": "Telemetry Export & Downloads",
    "clustering_archetypes": "Developer Archetype Clustering",
    "code_dna_meaning": "CodeDNA Concept & Philosophy",
    "dataset_details": "Telemetry & Dataset Specifications",
    "out_of_scope": "Out of Domain Scope"
}

_MODEL_CACHE = None

def get_model():
    """Singleton loader for the trained ML pipeline."""
    global _MODEL_CACHE
    if _MODEL_CACHE is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Trained model not found at {MODEL_PATH}. Run ml/train_chatbot.py first.")
        _MODEL_CACHE = joblib.load(MODEL_PATH)
    return _MODEL_CACHE


class TrainedCodeDNAAgent:
    """Trained NLP Classification & Inference Agent for CodeDNA."""
    
    CONFIDENCE_THRESHOLD = 0.22
    
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
            
        try:
            model = get_model()
            pred_class = model.predict([text])[0]
            probs = model.predict_proba([text])[0]
            class_idx = list(model.classes_).index(pred_class)
            confidence = float(probs[class_idx])
        except Exception as e:
            # Graceful fallback if model cannot be loaded
            return {
                "response": f"AI model inference error: {str(e)}. Please ensure the model is trained.",
                "topic": "Inference Error",
                "confidence": 0.0,
                "in_scope": False,
                "intent": "error"
            }
            
        # Check domain guardrails
        is_out_of_scope = (pred_class == "out_of_scope") or (confidence < cls.CONFIDENCE_THRESHOLD)
        
        if is_out_of_scope:
            return {
                "response": RESPONSES["out_of_scope"],
                "topic": TOPIC_TITLES["out_of_scope"],
                "confidence": round(confidence, 3),
                "in_scope": False,
                "intent": pred_class
            }
            
        response_text = RESPONSES.get(pred_class, RESPONSES["platform_overview"])
        topic_title = TOPIC_TITLES.get(pred_class, "CodeDNA Intelligence")
        
        return {
            "response": response_text,
            "topic": topic_title,
            "confidence": round(confidence, 3),
            "in_scope": True,
            "intent": pred_class
        }


# Quick CLI test
if __name__ == "__main__":
    queries = [
        "Hello!",
        "what is codedna?",
        "how do i get an api key?",
        "what is anti burstiness?",
        "tell me a recipe for pancakes",
        "who is Shruti Rai?"
    ]
    agent = TrainedCodeDNAAgent()
    print("Testing TrainedCodeDNAAgent:")
    for q in queries:
        ans = agent.answer(q)
        print(f"\nQuery: '{q}'")
        print(f"Intent: {ans['intent']} | In-Scope: {ans['in_scope']} | Confidence: {ans['confidence']}")
        print(f"Topic: {ans['topic']}")
        print(f"Response: {ans['response'][:90]}...")
