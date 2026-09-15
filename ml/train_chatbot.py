import os
import json
import joblib
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, accuracy_score

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "chatbot_training_corpus.json"
MODEL_PATH = BASE_DIR / "models" / "codedna_chatbot_agent.joblib"

def load_data():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Training corpus not found at {DATA_PATH}")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        corpus = json.load(f)
    
    texts = []
    labels = []
    for label, examples in corpus.items():
        for ex in examples:
            clean_text = ex.strip()
            if clean_text:
                texts.append(clean_text)
                labels.append(label)
    return texts, labels

def train_model():
    print("=" * 60)
    print("CODEDNA MACHINE LEARNING AI AGENT TRAINING PIPELINE")
    print("=" * 60)
    
    texts, labels = load_data()
    print(f"Loaded {len(texts)} total labeled samples across {len(set(labels))} classes.")
    
    # Stratified Train/Test split for evaluation
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.20, random_state=42, stratify=labels
    )
    print(f"Train split: {len(X_train)} samples | Test split: {len(X_test)} samples.")
    
    from sklearn.pipeline import FeatureUnion

    # Build Scikit-Learn NLP Pipeline with word & char n-grams for typo/Hinglish tolerance
    features = FeatureUnion([
        ('word_tfidf', TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            lowercase=True,
            strip_accents='unicode',
            min_df=1
        )),
        ('char_tfidf', TfidfVectorizer(
            ngram_range=(3, 5),
            analyzer='char_wb',
            sublinear_tf=True,
            lowercase=True,
            strip_accents='unicode',
            min_df=2
        ))
    ])

    pipeline = Pipeline([
        ('features', features),
        ('clf', LogisticRegression(
            C=4.0,
            max_iter=1000,
            class_weight='balanced',
            random_state=42,
            solver='lbfgs'
        ))
    ])
    
    print("\nFitting model on training split...")
    pipeline.fit(X_train, y_train)
    
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Validation Test Accuracy: {acc * 100:.2f}%\n")
    
    # Full training on all data for maximum production generalization
    print("Fitting model on full training corpus...")
    pipeline.fit(texts, labels)
    
    # Ensure models directory exists
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f"Model saved successfully to: {MODEL_PATH} (size: {MODEL_PATH.stat().st_size / 1024:.1f} KB)")
    
    # Quick sanity checks
    test_queries = [
        ("hi there", "greeting"),
        ("what is codedna?", "platform_overview"),
        ("how is the score calculated?", "score_intelligence"),
        ("what is anti-burstiness?", "anti_burstiness"),
        ("who is shruti rai?", "shruti_profile"),
        ("do i need an api key?", "api_key_auth"),
        ("what is the weather in Mumbai?", "out_of_scope"),
        ("make me a chocolate cake", "out_of_scope"),
        ("who won the cricket match?", "out_of_scope")
    ]
    
    print("\nRunning post-training inference sanity checks:")
    for query, expected_class in test_queries:
        pred_class = pipeline.predict([query])[0]
        probs = pipeline.predict_proba([query])[0]
        max_prob = np.max(probs)
        passed = (pred_class == expected_class)
        status = "PASS" if passed else "FAIL"
        print(f"[{status}] '{query}' -> Pred: {pred_class} (Prob: {max_prob:.2f}) | Expected: {expected_class}")
        assert passed, f"Sanity check failed for '{query}'"
        
    print("\nALL SANITY CHECKS PASSED! AI AGENT TRAINING COMPLETE.\n")

if __name__ == "__main__":
    train_model()
