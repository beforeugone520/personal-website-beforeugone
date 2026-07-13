CREATE TABLE IF NOT EXISTS github_activity_cache (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    payload_json TEXT NOT NULL,
    fetched_at TEXT NOT NULL
);
