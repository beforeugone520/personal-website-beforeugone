CREATE TABLE IF NOT EXISTS now_status (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    status TEXT NOT NULL,
    summary TEXT NOT NULL,
    detail TEXT NOT NULL DEFAULT '',
    link_url TEXT NOT NULL DEFAULT '',
    visible INTEGER NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ship_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL,
    repository TEXT NOT NULL DEFAULT '',
    external_id TEXT,
    occurred_at TEXT NOT NULL,
    visible INTEGER NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ship_entries_source_external_id
    ON ship_entries(source, external_id)
    WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS ship_entries_public_order
    ON ship_entries(visible, occurred_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS guestbook_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    reply TEXT NOT NULL DEFAULT '',
    visitor_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    moderated_at TEXT,
    replied_at TEXT,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS guestbook_entries_status_order
    ON guestbook_entries(status, created_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS page_reactions (
    page_key TEXT NOT NULL,
    reaction_type TEXT NOT NULL
        CHECK (reaction_type IN ('resonated', 'learned', 'want_more', 'confused')),
    visitor_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (page_key, reaction_type, visitor_hash)
);

CREATE INDEX IF NOT EXISTS page_reactions_counts
    ON page_reactions(page_key, reaction_type);

CREATE TABLE IF NOT EXISTS idempotency_requests (
    endpoint TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    request_hash TEXT NOT NULL,
    response_status INTEGER NOT NULL,
    response_body BLOB NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (endpoint, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idempotency_requests_created_at
    ON idempotency_requests(created_at);

CREATE TABLE IF NOT EXISTS github_deliveries (
    delivery_id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    repository TEXT NOT NULL,
    received_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL DEFAULT '',
    request_id TEXT NOT NULL DEFAULT '',
    detail TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS audit_log_created_at
    ON audit_log(created_at DESC, id DESC);
