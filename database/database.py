import sqlite3
import os
import json
from pathlib import Path
from typing import Dict, List, Any, Optional
import pandas as pd
from datetime import datetime

class DatabaseManager:
    """
    Manages SQLite database connections, schema setup, analytical views,
    and transactional CRUD operations for the Developer Intelligence Platform.
    """

    def __init__(self, db_path: Optional[str] = None):
        if db_path is None:
            # Default to data/developer_intelligence.db relative to project root
            base_dir = Path(__file__).resolve().parent.parent
            self.db_path = str(base_dir / "data" / "developer_intelligence.db")
        else:
            self.db_path = db_path

        # Ensure directory exists
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        self._init_database()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def _init_database(self):
        """Initializes tables and analytical views from schema and query files."""
        current_dir = Path(__file__).resolve().parent
        schema_file = current_dir / "schema.sql"
        queries_file = current_dir / "queries.sql"

        with self.get_connection() as conn:
            cursor = conn.cursor()
            if schema_file.exists():
                with open(schema_file, "r", encoding="utf-8") as f:
                    cursor.executescript(f.read())
            if queries_file.exists():
                with open(queries_file, "r", encoding="utf-8") as f:
                    cursor.executescript(f.read())
            conn.commit()

    def execute_query(self, query: str, params: tuple = ()) -> pd.DataFrame:
        """Executes a SQL query and returns results as a pandas DataFrame."""
        with self.get_connection() as conn:
            return pd.read_sql_query(query, conn, params=params)

    # -------------------------------------------------------------
    # USER OPERATIONS
    # -------------------------------------------------------------
    def save_user(self, user_data: Dict[str, Any]) -> int:
        """Inserts or updates a user profile, returning the database user_id."""
        sql = """
        INSERT INTO users (
            username, name, company, blog, location, email, bio,
            public_repos, public_gists, followers, following,
            created_at, updated_at, avatar_url, html_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(username) DO UPDATE SET
            name=excluded.name,
            company=excluded.company,
            blog=excluded.blog,
            location=excluded.location,
            email=excluded.email,
            bio=excluded.bio,
            public_repos=excluded.public_repos,
            public_gists=excluded.public_gists,
            followers=excluded.followers,
            following=excluded.following,
            updated_at=excluded.updated_at,
            avatar_url=excluded.avatar_url,
            html_url=excluded.html_url,
            ingested_at=CURRENT_TIMESTAMP;
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, (
                user_data.get("username"),
                user_data.get("name"),
                user_data.get("company"),
                user_data.get("blog"),
                user_data.get("location"),
                user_data.get("email"),
                user_data.get("bio"),
                user_data.get("public_repos", 0),
                user_data.get("public_gists", 0),
                user_data.get("followers", 0),
                user_data.get("following", 0),
                user_data.get("created_at"),
                user_data.get("updated_at"),
                user_data.get("avatar_url"),
                user_data.get("html_url")
            ))
            conn.commit()
            
            # Fetch user id
            cursor.execute("SELECT id FROM users WHERE username = ?", (user_data.get("username"),))
            row = cursor.fetchone()
            return row["id"] if row else -1

    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def get_all_users(self) -> pd.DataFrame:
        return self.execute_query("SELECT * FROM users ORDER BY username ASC")

    # -------------------------------------------------------------
    # REPOSITORIES OPERATIONS
    # -------------------------------------------------------------
    def save_repositories(self, user_id: int, repos: List[Dict[str, Any]]) -> Dict[str, int]:
        """Saves repositories for a user. Returns mapping of repo_name -> repo_id."""
        repo_map = {}
        sql = """
        INSERT INTO repositories (
            user_id, repo_name, full_name, description, fork,
            created_at, updated_at, pushed_at, size_kb,
            stargazers_count, watchers_count, forks_count, open_issues_count,
            primary_language, default_branch, license, topics,
            archived, has_readme, has_tests, has_ci, has_docker,
            complexity_score, complexity_tier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, repo_name) DO UPDATE SET
            full_name=excluded.full_name,
            description=excluded.description,
            fork=excluded.fork,
            updated_at=excluded.updated_at,
            pushed_at=excluded.pushed_at,
            size_kb=excluded.size_kb,
            stargazers_count=excluded.stargazers_count,
            watchers_count=excluded.watchers_count,
            forks_count=excluded.forks_count,
            open_issues_count=excluded.open_issues_count,
            primary_language=excluded.primary_language,
            license=excluded.license,
            topics=excluded.topics,
            archived=excluded.archived,
            has_readme=excluded.has_readme,
            has_tests=excluded.has_tests,
            has_ci=excluded.has_ci,
            has_docker=excluded.has_docker,
            complexity_score=excluded.complexity_score,
            complexity_tier=excluded.complexity_tier;
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            for r in repos:
                topics_val = r.get("topics", [])
                if isinstance(topics_val, list):
                    topics_str = ",".join(topics_val)
                else:
                    topics_str = str(topics_val or "")

                cursor.execute(sql, (
                    user_id,
                    r.get("repo_name", r.get("name")),
                    r.get("full_name", f"{user_id}/{r.get('name')}"),
                    r.get("description"),
                    int(bool(r.get("fork", False))),
                    r.get("created_at"),
                    r.get("updated_at"),
                    r.get("pushed_at"),
                    r.get("size_kb", r.get("size", 0)),
                    r.get("stargazers_count", 0),
                    r.get("watchers_count", 0),
                    r.get("forks_count", 0),
                    r.get("open_issues_count", 0),
                    r.get("primary_language", r.get("language")),
                    r.get("default_branch", "main"),
                    r.get("license"),
                    topics_str,
                    int(bool(r.get("archived", False))),
                    int(bool(r.get("has_readme", True))),
                    int(bool(r.get("has_tests", False))),
                    int(bool(r.get("has_ci", False))),
                    int(bool(r.get("has_docker", False))),
                    float(r.get("complexity_score", 50.0)),
                    r.get("complexity_tier", "Medium")
                ))

            conn.commit()

            cursor.execute("SELECT id, repo_name FROM repositories WHERE user_id = ?", (user_id,))
            for row in cursor.fetchall():
                repo_map[row["repo_name"]] = row["id"]

        return repo_map

    def get_repositories(self, user_id: int) -> pd.DataFrame:
        return self.execute_query("SELECT * FROM repositories WHERE user_id = ? ORDER BY stargazers_count DESC", (user_id,))

    # -------------------------------------------------------------
    # LANGUAGES OPERATIONS
    # -------------------------------------------------------------
    def save_languages(self, user_id: int, languages: List[Dict[str, Any]]):
        """Saves language breakdown per repository."""
        delete_sql = "DELETE FROM languages WHERE user_id = ?"
        insert_sql = """
        INSERT INTO languages (repo_id, user_id, language_name, bytes_count, percentage)
        VALUES (?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_sql, (user_id,))
            for lang in languages:
                cursor.execute(insert_sql, (
                    lang.get("repo_id"),
                    user_id,
                    lang.get("language_name"),
                    lang.get("bytes_count", 0),
                    lang.get("percentage", 0.0)
                ))
            conn.commit()

    def get_languages(self, user_id: int) -> pd.DataFrame:
        return self.execute_query("SELECT * FROM languages WHERE user_id = ?", (user_id,))

    # -------------------------------------------------------------
    # COMMITS OPERATIONS
    # -------------------------------------------------------------
    def save_commits(self, user_id: int, commits: List[Dict[str, Any]]):
        """Saves commit records."""
        delete_sql = "DELETE FROM commits WHERE user_id = ?"
        insert_sql = """
        INSERT INTO commits (
            repo_id, user_id, commit_hash, author_name, author_email,
            commit_date, message, weekday, hour, additions, deletions, total_changes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_sql, (user_id,))
            for c in commits:
                cursor.execute(insert_sql, (
                    c.get("repo_id"),
                    user_id,
                    c.get("commit_hash", c.get("sha")),
                    c.get("author_name"),
                    c.get("author_email"),
                    c.get("commit_date"),
                    c.get("message"),
                    c.get("weekday"),
                    c.get("hour"),
                    c.get("additions", 0),
                    c.get("deletions", 0),
                    c.get("total_changes", 0)
                ))
            conn.commit()

    def get_commits(self, user_id: int) -> pd.DataFrame:
        return self.execute_query("SELECT * FROM commits WHERE user_id = ? ORDER BY commit_date DESC", (user_id,))

    # -------------------------------------------------------------
    # PULL REQUESTS & ISSUES
    # -------------------------------------------------------------
    def save_pull_requests(self, user_id: int, prs: List[Dict[str, Any]]):
        delete_sql = "DELETE FROM pull_requests WHERE user_id = ?"
        insert_sql = """
        INSERT INTO pull_requests (
            repo_id, user_id, pr_number, title, state, created_at, closed_at, merged_at, is_merged, comments_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_sql, (user_id,))
            for pr in prs:
                cursor.execute(insert_sql, (
                    pr.get("repo_id"),
                    user_id,
                    pr.get("pr_number", pr.get("number", 0)),
                    pr.get("title"),
                    pr.get("state", "closed"),
                    pr.get("created_at"),
                    pr.get("closed_at"),
                    pr.get("merged_at"),
                    int(bool(pr.get("is_merged", False))),
                    pr.get("comments_count", 0)
                ))
            conn.commit()

    def save_issues(self, user_id: int, issues: List[Dict[str, Any]]):
        delete_sql = "DELETE FROM issues WHERE user_id = ?"
        insert_sql = """
        INSERT INTO issues (
            repo_id, user_id, issue_number, title, state, created_at, closed_at, comments_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_sql, (user_id,))
            for iss in issues:
                cursor.execute(insert_sql, (
                    iss.get("repo_id"),
                    user_id,
                    iss.get("issue_number", iss.get("number", 0)),
                    iss.get("title"),
                    iss.get("state", "closed"),
                    iss.get("created_at"),
                    iss.get("closed_at"),
                    iss.get("comments_count", 0)
                ))
            conn.commit()

    # -------------------------------------------------------------
    # CONTRIBUTORS
    # -------------------------------------------------------------
    def save_contributors(self, contributors: List[Dict[str, Any]]):
        insert_sql = """
        INSERT INTO contributors (repo_id, username, contributions_count, is_external)
        VALUES (?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            for cnt in contributors:
                cursor.execute(insert_sql, (
                    cnt.get("repo_id"),
                    cnt.get("username"),
                    cnt.get("contributions_count", 1),
                    int(bool(cnt.get("is_external", False)))
                ))
            conn.commit()

    # -------------------------------------------------------------
    # DEVELOPER METRICS & ANALYTICAL OUTPUTS
    # -------------------------------------------------------------
    def save_developer_metrics(self, user_id: int, m: Dict[str, Any]):
        delete_sql = "DELETE FROM developer_metrics WHERE user_id = ?"
        insert_sql = """
        INSERT INTO developer_metrics (
            user_id, developer_intelligence_score, growth_velocity_score, growth_velocity_tier,
            technical_breadth, technical_depth, consistency_index, collaboration_score,
            project_complexity_avg, portfolio_score, technology_adaptability, archetype_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_sql, (user_id,))
            cursor.execute(insert_sql, (
                user_id,
                float(m.get("developer_intelligence_score", 0.0)),
                float(m.get("growth_velocity_score", 0.0)),
                str(m.get("growth_velocity_tier", "Steady")),
                float(m.get("technical_breadth", 0.0)),
                float(m.get("technical_depth", 0.0)),
                float(m.get("consistency_index", 0.0)),
                float(m.get("collaboration_score", 0.0)),
                float(m.get("project_complexity_avg", 0.0)),
                float(m.get("portfolio_score", 0.0)),
                float(m.get("technology_adaptability", 0.0)),
                str(m.get("archetype_name", "The Builder"))
            ))
            conn.commit()

    def get_developer_metrics(self, user_id: int) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM developer_metrics WHERE user_id = ? ORDER BY computed_at DESC LIMIT 1", (user_id,))
            row = cursor.fetchone()
            return dict(row) if row else None

    # -------------------------------------------------------------
    # TECHNOLOGY TRENDS & CAREER PREDICTIONS
    # -------------------------------------------------------------
    def save_technology_trends(self, user_id: int, trends: List[Dict[str, Any]]):
        delete_sql = "DELETE FROM technology_trends WHERE user_id = ?"
        insert_sql = """
        INSERT INTO technology_trends (user_id, period_year, period_quarter, technology, activity_weight, momentum_category)
        VALUES (?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_sql, (user_id,))
            for t in trends:
                cursor.execute(insert_sql, (
                    user_id,
                    t.get("period_year"),
                    t.get("period_quarter", 1),
                    t.get("technology"),
                    float(t.get("activity_weight", 1.0)),
                    t.get("momentum_category", "STABLE")
                ))
            conn.commit()

    def save_career_predictions(self, user_id: int, predictions: List[Dict[str, Any]]):
        delete_sql = "DELETE FROM career_predictions WHERE user_id = ?"
        insert_sql = """
        INSERT INTO career_predictions (user_id, role_name, fit_percentage, strong_skills, missing_skills, recommendation_rank)
        VALUES (?, ?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_sql, (user_id,))
            for p in predictions:
                cursor.execute(insert_sql, (
                    user_id,
                    p.get("role_name"),
                    float(p.get("fit_percentage", 0.0)),
                    p.get("strong_skills", ""),
                    p.get("missing_skills", ""),
                    p.get("recommendation_rank", 1)
                ))
            conn.commit()

    def save_skill_recommendations(self, user_id: int, recs: List[Dict[str, Any]]):
        delete_sql = "DELETE FROM skill_recommendations WHERE user_id = ?"
        insert_sql = """
        INSERT INTO skill_recommendations (user_id, skill_name, priority_tier, reason, complementary_to)
        VALUES (?, ?, ?, ?, ?)
        """
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_sql, (user_id,))
            for r in recs:
                cursor.execute(insert_sql, (
                    user_id,
                    r.get("skill_name"),
                    r.get("priority_tier", "Medium"),
                    r.get("reason", ""),
                    r.get("complementary_to", "")
                ))
            conn.commit()

    def get_career_predictions(self, user_id: int) -> pd.DataFrame:
        return self.execute_query("SELECT * FROM career_predictions WHERE user_id = ? ORDER BY recommendation_rank ASC", (user_id,))

    def get_skill_recommendations(self, user_id: int) -> pd.DataFrame:
        return self.execute_query("SELECT * FROM skill_recommendations WHERE user_id = ? ORDER BY id ASC", (user_id,))

    def get_technology_trends(self, user_id: int) -> pd.DataFrame:
        return self.execute_query("SELECT * FROM technology_trends WHERE user_id = ? ORDER BY period_year DESC, period_quarter DESC", (user_id,))

    # -------------------------------------------------------------
    # CAREER ANALYZER & SKILLBRIDGE OPERATIONS
    # -------------------------------------------------------------
    def save_career_analysis(self, data: Dict[str, Any]) -> int:
        """Saves a resume-to-job match analysis."""
        sql = """
        INSERT INTO career_analyses (
            user_id, guest_token, job_title, job_description, resume_text,
            match_score, technical_score, experience_score, education_score, soft_skills_score,
            found_skills, missing_skills, ai_tips, verdict
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        raw_uid = data.get("user_id")
        user_id = raw_uid if isinstance(raw_uid, int) else None
        guest_token = data.get("guest_token") or (str(raw_uid) if isinstance(raw_uid, str) and raw_uid.startswith("guest_") else None)
        job_title = data.get("job_title") or data.get("target_role") or "Software Engineer"
        tips = data.get("ai_tips") or data.get("tips") or data.get("actionable_tips") or []

        params = (
            user_id,
            guest_token,
            job_title,
            data.get("job_description", ""),
            data.get("resume_text", ""),
            float(data.get("match_score", 0.0)),
            float(data.get("technical_score", 0.0)),
            float(data.get("experience_score", 0.0)),
            float(data.get("education_score", 0.0)),
            float(data.get("soft_skills_score", 0.0)),
            json.dumps(data.get("found_skills", [])),
            json.dumps(data.get("missing_skills", [])),
            json.dumps(tips),
            data.get("verdict", "")
        )
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()
            return cursor.lastrowid

    def get_career_analyses(self, user_id: Optional[int] = None, guest_token: Optional[str] = None, limit: int = 20) -> List[Dict[str, Any]]:
        """Retrieves saved career analyses for a user or guest session."""
        if user_id is not None:
            sql = "SELECT * FROM career_analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT ?"
            params = (user_id, limit)
        elif guest_token:
            sql = "SELECT * FROM career_analyses WHERE guest_token = ? ORDER BY created_at DESC LIMIT ?"
            params = (guest_token, limit)
        else:
            return []

        results = []
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            for row in cursor.fetchall():
                results.append({
                    "id": row["id"],
                    "job_title": row["job_title"],
                    "target_role": row["job_title"],
                    "job_description_snippet": row["job_description"][:160] + "..." if len(row["job_description"]) > 160 else row["job_description"],
                    "match_score": row["match_score"],
                    "technical_alignment": row["technical_score"],
                    "experience_score": row["experience_score"],
                    "domain_relevance": row["soft_skills_score"],
                    "keyword_coverage": row["education_score"],
                    "dimension_scores": {
                        "technical": row["technical_score"],
                        "experience": row["experience_score"],
                        "education": row["education_score"],
                        "soft_skills": row["soft_skills_score"]
                    },
                    "found_skills": json.loads(row["found_skills"]) if row["found_skills"] else [],
                    "missing_skills": json.loads(row["missing_skills"]) if row["missing_skills"] else [],
                    "ai_tips": json.loads(row["ai_tips"]) if row["ai_tips"] else [],
                    "actionable_tips": json.loads(row["ai_tips"]) if row["ai_tips"] else [],
                    "tips": json.loads(row["ai_tips"]) if row["ai_tips"] else [],
                    "verdict": row["verdict"],
                    "created_at": row["created_at"]
                })
        return results

    def delete_career_analysis(self, analysis_id: int, user_id: Optional[int] = None, guest_token: Optional[str] = None) -> bool:
        """Deletes a career analysis ensuring proper user/guest ownership."""
        if user_id is not None:
            sql = "DELETE FROM career_analyses WHERE id = ? AND user_id = ?"
            params = (analysis_id, user_id)
        elif guest_token:
            sql = "DELETE FROM career_analyses WHERE id = ? AND guest_token = ?"
            params = (analysis_id, guest_token)
        else:
            return False

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()
            return cursor.rowcount > 0

    def save_course(self, data: Dict[str, Any]) -> int:
        """Bookmarks a recommended course."""
        sql = """
        INSERT INTO saved_courses (
            user_id, guest_token, skill, title, platform, provider, duration, level, url, is_free, is_completed
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        raw_uid = data.get("user_id")
        user_id = raw_uid if isinstance(raw_uid, int) else None
        guest_token = data.get("guest_token") or (str(raw_uid) if isinstance(raw_uid, str) and raw_uid.startswith("guest_") else None)
        title = data.get("title") or data.get("course_title") or ""
        skill = data.get("skill") or data.get("skill_name") or ""
        url = data.get("url") or data.get("course_url") or ""
        provider = data.get("provider") or data.get("platform") or ""

        params = (
            user_id,
            guest_token,
            skill,
            title,
            provider,
            provider,
            data.get("duration", ""),
            data.get("level", ""),
            url,
            1 if data.get("is_free") else 0,
            1 if data.get("is_completed") else 0
        )
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()
            return cursor.lastrowid

    def get_saved_courses(self, user_id: Optional[int] = None, guest_token: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieves saved courses for a user or guest session."""
        if user_id is not None:
            sql = "SELECT * FROM saved_courses WHERE user_id = ? ORDER BY saved_at DESC"
            params = (user_id,)
        elif guest_token:
            sql = "SELECT * FROM saved_courses WHERE guest_token = ? ORDER BY saved_at DESC"
            params = (guest_token,)
        else:
            return []

        results = []
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            for row in cursor.fetchall():
                results.append({
                    "id": row["id"],
                    "skill": row["skill"],
                    "skill_name": row["skill"],
                    "title": row["title"],
                    "course_title": row["title"],
                    "platform": row["platform"],
                    "provider": row["provider"],
                    "duration": row["duration"],
                    "level": row["level"],
                    "url": row["url"],
                    "course_url": row["url"],
                    "is_free": bool(row["is_free"]),
                    "is_completed": bool(row["is_completed"]),
                    "saved_at": row["saved_at"]
                })
        return results

    def delete_saved_course(self, course_id: int, user_id: Optional[int] = None, guest_token: Optional[str] = None) -> bool:
        """Deletes a bookmarked course."""
        if user_id is not None:
            sql = "DELETE FROM saved_courses WHERE id = ? AND user_id = ?"
            params = (course_id, user_id)
        elif guest_token:
            sql = "DELETE FROM saved_courses WHERE id = ? AND guest_token = ?"
            params = (course_id, guest_token)
        else:
            return False

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()
            return cursor.rowcount > 0

    def save_email_analysis(self, data: Dict[str, Any]) -> int:
        """Persists rejection/interview email classification."""
        sql = """
        INSERT INTO email_analyses (
            user_id, guest_token, target_role, decision, confidence, summary, possible_reasons, next_steps, raw_email_excerpt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        params = (
            data.get("user_id"),
            data.get("guest_token"),
            data.get("target_role", ""),
            data.get("decision", ""),
            int(data.get("confidence", 0)),
            data.get("summary", ""),
            json.dumps(data.get("possible_reasons", [])),
            json.dumps(data.get("next_steps", [])),
            data.get("raw_email_excerpt", "")[:500]
        )
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()
            return cursor.lastrowid

    # -------------------------------------------------------------
    # CAREER INTELLIGENCE COMPREHENSIVE REPORTS
    # -------------------------------------------------------------
    def save_intelligence_report(self, data: Dict[str, Any]) -> int:
        """Persists a complete 10-section Career Intelligence Report."""
        sql = """
        INSERT INTO career_intelligence_reports (
            user_id, guest_token, username, target_direction, overall_confidence, report_json, summary_excerpt
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        raw_uid = data.get("user_id")
        user_id = raw_uid if isinstance(raw_uid, int) else None
        guest_token = data.get("guest_token") or (str(raw_uid) if isinstance(raw_uid, str) and raw_uid.startswith("guest_") else None)
        report_obj = data.get("report") or {}
        summary_text = ""
        if isinstance(report_obj, dict):
            sec1 = report_obj.get("section_1_executive_summary") or {}
            summary_text = sec1.get("headline", "") or sec1.get("narrative", "")
        
        report_json_str = json.dumps(report_obj) if not isinstance(data.get("report_json"), str) else data["report_json"]

        params = (
            user_id,
            guest_token,
            data.get("username", ""),
            data.get("target_direction", report_obj.get("metadata", {}).get("target_direction_title", "")),
            float(data.get("overall_confidence", report_obj.get("metadata", {}).get("overall_confidence", 0.0))),
            report_json_str,
            summary_text[:300]
        )
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()
            return cursor.lastrowid

    def get_intelligence_reports(
        self,
        user_id: Optional[int] = None,
        guest_token: Optional[str] = None,
        limit: int = 15
    ) -> List[Dict[str, Any]]:
        """Retrieves past intelligence report summaries for a user or guest session."""
        if user_id is not None:
            sql = "SELECT id, username, target_direction, overall_confidence, summary_excerpt, created_at FROM career_intelligence_reports WHERE user_id = ? ORDER BY created_at DESC LIMIT ?"
            params = (user_id, limit)
        elif guest_token:
            sql = "SELECT id, username, target_direction, overall_confidence, summary_excerpt, created_at FROM career_intelligence_reports WHERE guest_token = ? ORDER BY created_at DESC LIMIT ?"
            params = (guest_token, limit)
        else:
            return []

        results = []
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            for row in cursor.fetchall():
                results.append({
                    "id": row["id"],
                    "username": row["username"],
                    "target_direction": row["target_direction"],
                    "overall_confidence": row["overall_confidence"],
                    "summary_excerpt": row["summary_excerpt"],
                    "created_at": row["created_at"]
                })
        return results

    def get_intelligence_report_by_id(
        self,
        report_id: int,
        user_id: Optional[int] = None,
        guest_token: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Retrieves full intelligence report JSON by ID with strict ownership validation."""
        if user_id is not None:
            sql = "SELECT * FROM career_intelligence_reports WHERE id = ? AND user_id = ?"
            params = (report_id, user_id)
        elif guest_token:
            sql = "SELECT * FROM career_intelligence_reports WHERE id = ? AND guest_token = ?"
            params = (report_id, guest_token)
        else:
            return None

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            row = cursor.fetchone()
            if not row:
                return None
            try:
                report_data = json.loads(row["report_json"])
            except Exception:
                report_data = {}
            return {
                "id": row["id"],
                "username": row["username"],
                "target_direction": row["target_direction"],
                "overall_confidence": row["overall_confidence"],
                "report": report_data,
                "created_at": row["created_at"]
            }

    def delete_intelligence_report(
        self,
        report_id: int,
        user_id: Optional[int] = None,
        guest_token: Optional[str] = None
    ) -> bool:
        """Deletes an intelligence report ensuring strict user or guest ownership."""
        if user_id is not None:
            sql = "DELETE FROM career_intelligence_reports WHERE id = ? AND user_id = ?"
            params = (report_id, user_id)
        elif guest_token:
            sql = "DELETE FROM career_intelligence_reports WHERE id = ? AND guest_token = ?"
            params = (report_id, guest_token)
        else:
            return False

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()
            return cursor.rowcount > 0
