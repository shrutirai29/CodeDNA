-- =====================================================================
-- DEVELOPER CAREER INTELLIGENCE & ANALYTICS PLATFORM
-- Normalized Relational Database Schema (SQLite / PostgreSQL Compatible)
-- =====================================================================

PRAGMA foreign_keys = ON;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    name TEXT,
    company TEXT,
    blog TEXT,
    location TEXT,
    email TEXT,
    bio TEXT,
    public_repos INTEGER DEFAULT 0,
    public_gists INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    avatar_url TEXT,
    html_url TEXT,
    ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. REPOSITORIES TABLE
CREATE TABLE IF NOT EXISTS repositories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    repo_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    description TEXT,
    fork BOOLEAN DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    pushed_at TIMESTAMP,
    size_kb INTEGER DEFAULT 0,
    stargazers_count INTEGER DEFAULT 0,
    watchers_count INTEGER DEFAULT 0,
    forks_count INTEGER DEFAULT 0,
    open_issues_count INTEGER DEFAULT 0,
    primary_language TEXT,
    default_branch TEXT DEFAULT 'main',
    license TEXT,
    topics TEXT, -- Comma-separated or JSON list
    archived BOOLEAN DEFAULT 0,
    has_readme BOOLEAN DEFAULT 1,
    has_tests BOOLEAN DEFAULT 0,
    has_ci BOOLEAN DEFAULT 0,
    has_docker BOOLEAN DEFAULT 0,
    complexity_score REAL DEFAULT 0.0,
    complexity_tier TEXT DEFAULT 'Medium',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, repo_name)
);

-- 3. LANGUAGES TABLE
CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    language_name TEXT NOT NULL,
    bytes_count INTEGER NOT NULL,
    percentage REAL DEFAULT 0.0,
    FOREIGN KEY (repo_id) REFERENCES repositories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. COMMITS TABLE
CREATE TABLE IF NOT EXISTS commits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    commit_hash TEXT,
    author_name TEXT,
    author_email TEXT,
    commit_date TIMESTAMP NOT NULL,
    message TEXT,
    weekday INTEGER, -- 0=Monday, 6=Sunday
    hour INTEGER,    -- 0-23
    additions INTEGER DEFAULT 0,
    deletions INTEGER DEFAULT 0,
    total_changes INTEGER DEFAULT 0,
    FOREIGN KEY (repo_id) REFERENCES repositories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. PULL REQUESTS TABLE
CREATE TABLE IF NOT EXISTS pull_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    pr_number INTEGER NOT NULL,
    title TEXT,
    state TEXT, -- open, closed, merged
    created_at TIMESTAMP,
    closed_at TIMESTAMP,
    merged_at TIMESTAMP,
    is_merged BOOLEAN DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    FOREIGN KEY (repo_id) REFERENCES repositories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. ISSUES TABLE
CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    issue_number INTEGER NOT NULL,
    title TEXT,
    state TEXT, -- open, closed
    created_at TIMESTAMP,
    closed_at TIMESTAMP,
    comments_count INTEGER DEFAULT 0,
    FOREIGN KEY (repo_id) REFERENCES repositories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. CONTRIBUTORS TABLE
CREATE TABLE IF NOT EXISTS contributors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    contributions_count INTEGER DEFAULT 1,
    is_external BOOLEAN DEFAULT 0,
    FOREIGN KEY (repo_id) REFERENCES repositories(id) ON DELETE CASCADE
);

-- 8. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    org_name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. DEVELOPER METRICS TABLE
CREATE TABLE IF NOT EXISTS developer_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    developer_intelligence_score REAL,
    growth_velocity_score REAL,
    growth_velocity_tier TEXT,
    technical_breadth REAL,
    technical_depth REAL,
    consistency_index REAL,
    collaboration_score REAL,
    project_complexity_avg REAL,
    portfolio_score REAL,
    technology_adaptability REAL,
    archetype_name TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. TECHNOLOGY TRENDS TABLE
CREATE TABLE IF NOT EXISTS technology_trends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    period_year INTEGER NOT NULL,
    period_quarter INTEGER NOT NULL,
    technology TEXT NOT NULL,
    activity_weight REAL DEFAULT 0.0,
    momentum_category TEXT DEFAULT 'STABLE', -- RISING, STABLE, DECLINING, NEW, DORMANT
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. CAREER PREDICTIONS TABLE
CREATE TABLE IF NOT EXISTS career_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    role_name TEXT NOT NULL,
    fit_percentage REAL NOT NULL,
    strong_skills TEXT, -- Comma-separated
    missing_skills TEXT, -- Comma-separated
    recommendation_rank INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. SKILL RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS skill_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_name TEXT NOT NULL,
    priority_tier TEXT NOT NULL, -- High, Medium, Low
    reason TEXT NOT NULL,
    complementary_to TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================================
-- PERFORMANCE INDEXES
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_repos_user ON repositories(user_id);
CREATE INDEX IF NOT EXISTS idx_repos_lang ON repositories(primary_language);
CREATE INDEX IF NOT EXISTS idx_languages_user ON languages(user_id);
CREATE INDEX IF NOT EXISTS idx_languages_repo ON languages(repo_id);
CREATE INDEX IF NOT EXISTS idx_commits_user ON commits(user_id);
CREATE INDEX IF NOT EXISTS idx_commits_repo ON commits(repo_id);
CREATE INDEX IF NOT EXISTS idx_commits_date ON commits(commit_date);
CREATE INDEX IF NOT EXISTS idx_metrics_user ON developer_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_tech_trends_user ON technology_trends(user_id);
CREATE INDEX IF NOT EXISTS idx_career_pred_user ON career_predictions(user_id);
