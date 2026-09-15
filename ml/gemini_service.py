"""
CodeDNA Gemini Generative AI Service
Provides dynamic conversational responses using Google Gemini 1.5 Flash (Free Tier)
with strict domain guardrails, CodeDNA knowledge injection, and seamless fallback
to the local Scikit-Learn ML Agent.
"""

import os
import json
import requests
from typing import Optional, Dict, Any, List

try:
    from dotenv import load_dotenv
    load_dotenv(override=True)
except Exception:
    pass

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()

GEMINI_SYSTEM_INSTRUCTION = """You are the official AI Assistant for CodeDNA (https://code-dna-alpha.vercel.app), a smart developer profile analyzer platform created by Shruti Rai (@shrutirai29), a Computer Science Engineering student at Rashtriya Raksha University, India.

Your Mission:
Help visitors, recruiters, and developers understand their developer profiles, scoring, skills, and coding habits in simple, friendly, conversational English.

Platform Knowledge:
1. Developer Score (0–100): Calculated from real coding habits across 6 skills:
   - Code Depth (20%): Depth and mastery in primary languages.
   - Code Quality (20%): Clean repository structure, tests, and documentation.
   - Weekly Habit / Anti-Burstiness (15%): Steady weekly coding vs artificial bulk dumps.
   - Skill Variety (15%): Ability to build across frontend, backend, or data tools.
   - Teamwork (10%): Pull requests, forks, reviews, and community collaboration.
   - Project Impact (10%): Real apps and tools created.
2. Anti-Burstiness:
   - Checks temporal commit cadence over weeks and months.
   - Rewards developers who code 3-4 days consistently every week.
   - Spots and discounts artificial gaming (like uploading 100 commits in one night or running commit bots).
3. 4 Coding Personalities (Archetypes):
   - The Technology Explorer: Loves trying new stacks, polyglot agility (e.g. Shruti Rai).
   - The Deep Specialist: Masters one primary stack with extreme depth.
   - The Open Source Contributor: High community focus, public libraries, and PRs.
   - The Builder: Ships complete end-to-end products fast.
4. Skills Radar (6 Core Axes): Code Depth, Tech Variety, Weekly Habit, Project Depth, Teamwork, and Fast Learner.
5. Tech Stack: Visualizes primary languages, rising tools, and frameworks.
6. Coding Rhythm: 7x24 weekly commit heatmap showing peak focus hours and days.
7. Career Matcher: Compares GitHub skills against real job roles and recommends the #1 next best skill to learn (e.g. Docker & Containerization).
8. Free REST API: Public endpoint `GET /api/profile?username=...` with zero keys or sign-up needed.
9. Shruti Rai (@shrutirai29): CSE student at Rashtriya Raksha University. Built CodeDNA, study-roulette, code4nature, and SIH Hackathon project. Score: 86.4 / 100 (Top 8%).

Tone & Guidelines:
- Speak in friendly, clear, plain English so students and recruiters immediately understand.
- Use clean Markdown with bullet points and bold highlights where appropriate.
- Keep answers concise and direct (around 2 to 4 short paragraphs).

STRICT DOMAIN GUARDRAIL:
- You ONLY answer questions about CodeDNA, developer profiles, coding habits, scores, GitHub analysis, careers in software, and Shruti Rai's profile.
- If the user asks general trivia, homework, recipes, cricket, movies, or off-topic questions, politely decline and steer them back:
  "I am the **CodeDNA Assistant**, specifically here to help you with questions about this website, developer scores, coding habits, and Shruti Rai's profile. Feel free to ask anything about CodeDNA!"
"""

def query_gemini(user_message: str, history: Optional[List[Dict[str, str]]] = None, api_key: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Calls Google Gemini via standard REST API.
    Tries gemini-flash-latest, gemini-1.5-flash, and gemini-flash-lite-latest with CodeDNA system prompt.
    Returns structured response or None if unavailable/rate-limited.
    """
    key = api_key or os.environ.get("GEMINI_API_KEY", "").strip()
    if not key or len(key) < 15:
        try:
            from dotenv import load_dotenv
            load_dotenv(override=True)
            key = os.environ.get("GEMINI_API_KEY", "").strip()
        except Exception:
            pass

    if not key or len(key) < 15:
        return None

    # Build conversation contents
    contents = []
    if history:
        for msg in history[-4:]:
            role = "user" if msg.get("role") == "user" else "model"
            content = msg.get("content", "").strip()
            if content:
                contents.append({"role": role, "parts": [{"text": content}]})

    contents.append({"role": "user", "parts": [{"text": user_message}]})

    payload = {
        "system_instruction": {
            "parts": [{"text": GEMINI_SYSTEM_INSTRUCTION}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 600,
            "topP": 0.85
        }
    }

    # Try latest models in order
    models_to_try = ["gemini-flash-latest", "gemini-1.5-flash", "gemini-flash-lite-latest"]

    for model_name in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
        try:
            res = requests.post(url, json=payload, timeout=8)
            if res.status_code == 200:
                data = res.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        text = parts[0].get("text", "").strip()
                        is_off_topic = "specifically here to help you with questions about this website" in text or "only answer questions about codedna" in text.lower()
                        return {
                            "response": text,
                            "topic": "Question Out of Scope" if is_off_topic else "Gemini AI Intelligence",
                            "confidence": 0.99,
                            "in_scope": not is_off_topic,
                            "intent": "gemini_generative",
                            "engine": "gemini_1.5_flash"
                        }
        except Exception:
            continue

    return None
