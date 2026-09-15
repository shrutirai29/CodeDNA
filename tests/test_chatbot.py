import pytest
from fastapi.testclient import TestClient
from api.index import app
from ml.chatbot_agent import TrainedCodeDNAAgent

client = TestClient(app)

def test_trained_agent_greetings():
    res_hi = TrainedCodeDNAAgent.answer("hi")
    assert res_hi["in_scope"] is True
    assert res_hi["intent"] == "greeting"
    assert "CodeDNA Assistant" in res_hi["response"]

    res_hello = TrainedCodeDNAAgent.answer("Hello there")
    assert res_hello["in_scope"] is True
    assert res_hello["intent"] == "greeting"

    res_namaste = TrainedCodeDNAAgent.answer("Namaste")
    assert res_namaste["in_scope"] is True
    assert res_namaste["intent"] == "greeting"


def test_trained_agent_platform_queries():
    # What is CodeDNA
    res_codedna = TrainedCodeDNAAgent.answer("What is CodeDNA?")
    assert res_codedna["in_scope"] is True
    assert res_codedna["intent"] == "platform_overview"
    assert "CodeDNA" in res_codedna["response"]
    assert res_codedna["confidence"] >= 0.5

    # Score calculation
    res_score = TrainedCodeDNAAgent.answer("How is the developer score calculated?")
    assert res_score["in_scope"] is True
    assert res_score["intent"] == "score_intelligence"
    assert "Developer Score" in res_score["response"] or "Coding Speed" in res_score["response"]

    # Anti-burstiness
    res_burst = TrainedCodeDNAAgent.answer("Tell me about anti-burstiness")
    assert res_burst["in_scope"] is True
    assert res_burst["intent"] == "anti_burstiness"
    assert "Anti-Burstiness" in res_burst["response"]

    # Shruti Rai profile
    res_shruti = TrainedCodeDNAAgent.answer("Who is Shruti Rai?")
    assert res_shruti["in_scope"] is True
    assert res_shruti["intent"] == "shruti_profile"
    assert "Shruti Rai" in res_shruti["response"]

    # API
    res_api = TrainedCodeDNAAgent.answer("What are the public API endpoints?")
    assert res_api["in_scope"] is True
    assert "/api/profile" in res_api["response"]

    # API Key question
    res_key = TrainedCodeDNAAgent.answer("Do I need an API key to access CodeDNA?")
    assert res_key["in_scope"] is True
    assert res_key["intent"] == "api_key_auth"
    assert "No API key" in res_key["response"] or "API" in res_key["response"]


def test_trained_agent_out_of_scope_rejection():
    # Unrelated queries must be classified as out_of_scope or below confidence threshold
    off_topic_questions = [
        "What is the capital of France?",
        "Make me a chocolate cake recipe",
        "Who won the cricket match yesterday?",
        "Tell me a funny joke",
        "How is the weather in Delhi today?",
        "Can you help me do my calculus homework?"
    ]

    for q in off_topic_questions:
        res = TrainedCodeDNAAgent.answer(q)
        assert res["in_scope"] is False, f"Expected '{q}' to be rejected as out of scope"
        assert "CodeDNA Assistant" in res["response"]


def test_chat_api_endpoint():
    # Test POST /api/chat with valid question
    payload = {"message": "What is CodeDNA?"}
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["in_scope"] is True
    assert data["confidence"] > 0.3
    assert data["intent"] == "platform_overview"

    # Test POST /api/chat with off-topic question
    payload_off = {"message": "What is the capital of Spain?"}
    response_off = client.post("/api/chat", json=payload_off)
    assert response_off.status_code == 200
    data_off = response_off.json()
    assert data_off["in_scope"] is False

    # Test GET /api/chat?message=hello
    res_get = client.get("/api/chat?message=hello")
    assert res_get.status_code == 200
    data_get = res_get.json()
    assert data_get["in_scope"] is True
    assert data_get["intent"] == "greeting"
