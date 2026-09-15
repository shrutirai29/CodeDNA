import pytest
from fastapi.testclient import TestClient
from api.index import app, CodeDNAChatEngine

client = TestClient(app)

def test_engine_greetings():
    res_hi = CodeDNAChatEngine.answer("hi")
    assert res_hi["in_scope"] is True
    assert res_hi["topic"] == "greeting"
    assert "Greetings! I am CodeDNA Platform Assistant" in res_hi["response"]

    res_hello = CodeDNAChatEngine.answer("Hello there")
    assert res_hello["in_scope"] is True
    assert res_hello["topic"] == "greeting"

    res_namaste = CodeDNAChatEngine.answer("Namaste")
    assert res_namaste["in_scope"] is True
    assert res_namaste["topic"] == "greeting"


def test_engine_platform_queries():
    # What is CodeDNA
    res_codedna = CodeDNAChatEngine.answer("What is CodeDNA?")
    assert res_codedna["in_scope"] is True
    assert "Developer Career Intelligence Platform" in res_codedna["response"]

    # Score calculation
    res_score = CodeDNAChatEngine.answer("How is the developer intelligence score calculated?")
    assert res_score["in_scope"] is True
    assert "Developer Intelligence Score" in res_score["response"]
    assert "Technical Depth" in res_score["response"]

    # Anti-burstiness
    res_burst = CodeDNAChatEngine.answer("Tell me about the anti-burstiness filter")
    assert res_burst["in_scope"] is True
    assert "Anti-Burstiness" in res_burst["response"]

    # Shruti Rai profile
    res_shruti = CodeDNAChatEngine.answer("Who is Shruti Rai?")
    assert res_shruti["in_scope"] is True
    assert "Shruti Rai" in res_shruti["response"]
    assert "shrutirai29" in res_shruti["response"]

    # API
    res_api = CodeDNAChatEngine.answer("How do I query the REST API?")
    assert res_api["in_scope"] is True
    assert "/api/profile" in res_api["response"]

    # API Key specific question
    res_key = CodeDNAChatEngine.answer("what is the api key")
    assert res_key["in_scope"] is True
    assert res_key["topic"] == "api_key"
    assert "No API Key Required" in res_key["response"]


def test_engine_out_of_scope_rejection():
    # Unrelated queries must be strictly rejected
    off_topic_questions = [
        "What is the capital of France?",
        "Make me a chocolate cake recipe",
        "Who won the cricket match yesterday?",
        "Tell me a funny joke",
        "How is the weather today?",
        "Write a python script to reverse a string",
        "Can you help me with my math homework?"
    ]

    for q in off_topic_questions:
        res = CodeDNAChatEngine.answer(q)
        assert res["in_scope"] is False, f"Expected '{q}' to be out of scope"
        assert res["topic"] == "out_of_scope"
        assert "Query Out of Scope" in res["response"]


def test_chat_api_endpoint():
    # Test POST /api/chat
    payload = {"message": "What is CodeDNA?"}
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["in_scope"] is True

    # Test POST /api/chat with off-topic
    payload_off = {"message": "What is the capital of Spain?"}
    response_off = client.post("/api/chat", json=payload_off)
    assert response_off.status_code == 200
    data_off = response_off.json()
    assert data_off["in_scope"] is False
    assert "Query Out of Scope" in data_off["response"]

    # Test GET /api/chat?message=hi
    res_get = client.get("/api/chat?message=hi")
    assert res_get.status_code == 200
    assert res_get.json()["in_scope"] is True
