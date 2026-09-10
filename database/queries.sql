-- =====================================================================
-- DEVELOPER CAREER INTELLIGENCE & ANALYTICS PLATFORM
-- Analytical SQL Views and Core Business Intelligence Queries
-- =====================================================================

-- VIEW 1: TOP LANGUAGES PER USER
CREATE VIEW IF NOT EXISTS v_top_languages_by_user AS
SELECT 
    u.id AS user_id,
    u.username,
    l.language_name,
    SUM(l.bytes_count) AS total_bytes,
    ROUND(SUM(l.bytes_count) * 100.0 / NULLIF(total_user_bytes.sum_bytes, 0), 2) AS usage_percentage,
    COUNT(DISTINCT l.repo_id) AS repo_count
FROM users u
JOIN languages l ON u.id = l.user_id
JOIN (
    SELECT user_id, SUM(bytes_count) AS sum_bytes
    FROM languages
    GROUP BY user_id
) total_user_bytes ON u.id = total_user_bytes.user_id
GROUP BY u.id, u.username, l.language_name
ORDER BY total_bytes DESC;

-- VIEW 2: MONTHLY COMMIT ACTIVITY
CREATE VIEW IF NOT EXISTS v_monthly_commit_activity AS
SELECT 
    user_id,
    strftime('%Y-%m', commit_date) AS commit_year_month,
    COUNT(id) AS commit_count,
    SUM(additions) AS total_additions,
    SUM(deletions) AS total_deletions,
    SUM(total_changes) AS total_changes,
    COUNT(DISTINCT repo_id) AS active_repos_count
FROM commits
GROUP BY user_id, strftime('%Y-%m', commit_date)
ORDER BY commit_year_month ASC;

-- VIEW 3: REPOSITORY HEALTH & QUALITY SUMMARY
CREATE VIEW IF NOT EXISTS v_repository_health_summary AS
SELECT 
    r.id AS repo_id,
    r.user_id,
    r.repo_name,
    r.primary_language,
    r.stargazers_count,
    r.forks_count,
    r.size_kb,
    r.has_readme,
    r.has_tests,
    r.has_ci,
    r.has_docker,
    r.complexity_score,
    r.complexity_tier,
    CASE 
        WHEN r.has_readme = 1 AND r.description IS NOT NULL AND length(r.description) > 15 AND r.license IS NOT NULL THEN 'Excellent'
        WHEN r.has_readme = 1 AND r.description IS NOT NULL THEN 'Good'
        WHEN r.has_readme = 1 THEN 'Fair'
        ELSE 'Needs Attention'
    END AS documentation_quality,
    COUNT(DISTINCT c.id) AS total_commits,
    MAX(c.commit_date) AS last_commit_date
FROM repositories r
LEFT JOIN commits c ON r.id = c.repo_id
GROUP BY r.id
ORDER BY r.stargazers_count DESC;

-- VIEW 4: COLLABORATION & PR ENGAGEMENT
CREATE VIEW IF NOT EXISTS v_collaboration_network AS
SELECT 
    r.user_id,
    COUNT(DISTINCT r.id) AS total_repos,
    COUNT(DISTINCT pr.id) AS total_prs,
    SUM(CASE WHEN pr.is_merged = 1 THEN 1 ELSE 0 END) AS merged_prs,
    COUNT(DISTINCT iss.id) AS total_issues,
    COUNT(DISTINCT cnt.id) AS unique_contributors,
    ROUND(CAST(COUNT(DISTINCT cnt.id) AS REAL) / NULLIF(COUNT(DISTINCT r.id), 0), 2) AS avg_contributors_per_repo
FROM repositories r
LEFT JOIN pull_requests pr ON r.id = pr.repo_id
LEFT JOIN issues iss ON r.id = iss.repo_id
LEFT JOIN contributors cnt ON r.id = cnt.repo_id
GROUP BY r.user_id;

-- VIEW 5: HOURLY & WEEKDAY COMMIT DISTRIBUTION
CREATE VIEW IF NOT EXISTS v_commit_timing_distribution AS
SELECT 
    user_id,
    weekday,
    hour,
    COUNT(*) AS commit_frequency
FROM commits
GROUP BY user_id, weekday, hour
ORDER BY weekday, hour;
