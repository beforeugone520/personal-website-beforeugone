package main

import (
	"context"
	"database/sql"
	"embed"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"

	_ "modernc.org/sqlite"
)

//go:embed migrations/*.sql
var migrationFS embed.FS

var (
	errNotFound            = errors.New("not found")
	errIdempotencyConflict = errors.New("idempotency key reused with a different request")
)

var reactionTypes = []string{"resonated", "learned", "want_more", "confused"}

type Store struct {
	db  *sql.DB
	now func() time.Time
}

type NowStatus struct {
	Status    string `json:"status"`
	Summary   string `json:"summary"`
	Detail    string `json:"detail,omitempty"`
	LinkURL   string `json:"link_url,omitempty"`
	Visible   bool   `json:"visible"`
	UpdatedAt string `json:"updated_at"`
}

type ShipEntry struct {
	ID         int64  `json:"id"`
	Title      string `json:"title"`
	Summary    string `json:"summary,omitempty"`
	URL        string `json:"url,omitempty"`
	Source     string `json:"source"`
	Repository string `json:"repository,omitempty"`
	OccurredAt string `json:"occurred_at"`
	Visible    bool   `json:"visible"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}

type GuestbookEntry struct {
	ID          int64   `json:"id"`
	Nickname    string  `json:"nickname,omitempty"`
	Message     string  `json:"message"`
	Status      string  `json:"status,omitempty"`
	Reply       string  `json:"reply,omitempty"`
	CreatedAt   string  `json:"created_at"`
	ModeratedAt *string `json:"moderated_at,omitempty"`
	RepliedAt   *string `json:"replied_at,omitempty"`
	UpdatedAt   string  `json:"updated_at,omitempty"`
}

type IdempotencyRecord struct {
	RequestHash string
	Status      int
	Body        []byte
}

type IdempotentResult struct {
	Status   int
	Body     []byte
	Replayed bool
}

func openStore(ctx context.Context, path string) (*Store, error) {
	var databaseFile string
	if path != ":memory:" && !strings.HasPrefix(path, "file:") {
		if err := os.MkdirAll(filepath.Dir(path), 0o750); err != nil {
			return nil, fmt.Errorf("create database directory: %w", err)
		}
	}
	dsn := path
	if path != ":memory:" && !strings.HasPrefix(path, "file:") {
		absolute, err := filepath.Abs(path)
		if err != nil {
			return nil, fmt.Errorf("resolve database path: %w", err)
		}
		databaseFile = absolute
		dsn = (&url.URL{Scheme: "file", Path: filepath.ToSlash(absolute)}).String()
	}
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("open sqlite: %w", err)
	}
	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	store := &Store{db: db, now: time.Now}
	if err := store.initialize(ctx); err != nil {
		db.Close()
		return nil, err
	}
	if databaseFile != "" {
		if err := os.Chmod(databaseFile, 0o640); err != nil {
			db.Close()
			return nil, fmt.Errorf("set database permissions: %w", err)
		}
	}
	return store, nil
}

func (s *Store) initialize(ctx context.Context) error {
	for _, statement := range []string{
		"PRAGMA journal_mode = WAL",
		"PRAGMA foreign_keys = ON",
		"PRAGMA busy_timeout = 5000",
	} {
		if _, err := s.db.ExecContext(ctx, statement); err != nil {
			return fmt.Errorf("configure sqlite (%s): %w", statement, err)
		}
	}
	if _, err := s.db.ExecContext(ctx, `CREATE TABLE IF NOT EXISTS schema_migrations (
		version TEXT PRIMARY KEY,
		applied_at TEXT NOT NULL
	)`); err != nil {
		return fmt.Errorf("create migration table: %w", err)
	}
	entries, err := fs.ReadDir(migrationFS, "migrations")
	if err != nil {
		return fmt.Errorf("read migrations: %w", err)
	}
	sort.Slice(entries, func(i, j int) bool { return entries[i].Name() < entries[j].Name() })
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".sql") {
			continue
		}
		var applied int
		if err := s.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM schema_migrations WHERE version = ?", entry.Name()).Scan(&applied); err != nil {
			return fmt.Errorf("check migration %s: %w", entry.Name(), err)
		}
		if applied != 0 {
			continue
		}
		contents, err := migrationFS.ReadFile("migrations/" + entry.Name())
		if err != nil {
			return fmt.Errorf("read migration %s: %w", entry.Name(), err)
		}
		tx, err := s.db.BeginTx(ctx, nil)
		if err != nil {
			return fmt.Errorf("begin migration %s: %w", entry.Name(), err)
		}
		if _, err = tx.ExecContext(ctx, string(contents)); err == nil {
			_, err = tx.ExecContext(ctx, "INSERT INTO schema_migrations(version, applied_at) VALUES (?, ?)", entry.Name(), timestamp(s.now()))
		}
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("apply migration %s: %w", entry.Name(), err)
		}
		if err := tx.Commit(); err != nil {
			return fmt.Errorf("commit migration %s: %w", entry.Name(), err)
		}
	}
	return s.db.PingContext(ctx)
}

func (s *Store) Close() error { return s.db.Close() }

func (s *Store) Ready(ctx context.Context) error { return s.db.PingContext(ctx) }

func timestamp(t time.Time) string { return t.UTC().Format(time.RFC3339Nano) }

func (s *Store) GitHubActivity(ctx context.Context) (*GitHubActivitySnapshot, error) {
	var payload, fetchedAt string
	err := s.db.QueryRowContext(ctx, `SELECT payload_json, fetched_at FROM github_activity_cache WHERE id = 1`).Scan(&payload, &fetchedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	var snapshot GitHubActivitySnapshot
	if err := json.Unmarshal([]byte(payload), &snapshot); err != nil {
		return nil, fmt.Errorf("decode GitHub activity cache: %w", err)
	}
	snapshot.RefreshedAt = fetchedAt
	return &snapshot, nil
}

func (s *Store) PutGitHubActivity(ctx context.Context, snapshot GitHubActivitySnapshot) error {
	payload, err := json.Marshal(snapshot)
	if err != nil {
		return fmt.Errorf("encode GitHub activity cache: %w", err)
	}
	_, err = s.db.ExecContext(ctx, `INSERT INTO github_activity_cache(id, payload_json, fetched_at)
		VALUES (1, ?, ?)
		ON CONFLICT(id) DO UPDATE SET payload_json=excluded.payload_json, fetched_at=excluded.fetched_at`,
		string(payload), snapshot.RefreshedAt)
	return err
}

func (s *Store) PublicNow(ctx context.Context) (*NowStatus, error) {
	var item NowStatus
	var visible int
	err := s.db.QueryRowContext(ctx, `SELECT status, summary, detail, link_url, visible, updated_at
		FROM now_status WHERE id = 1`).Scan(&item.Status, &item.Summary, &item.Detail, &item.LinkURL, &visible, &item.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	item.Visible = visible != 0
	if !item.Visible {
		return nil, nil
	}
	return &item, nil
}

func (s *Store) PutNow(ctx context.Context, item NowStatus, requestID string) (NowStatus, error) {
	item.UpdatedAt = timestamp(s.now())
	visible := boolInt(item.Visible)
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return NowStatus{}, err
	}
	defer tx.Rollback()
	_, err = tx.ExecContext(ctx, `INSERT INTO now_status(id, status, summary, detail, link_url, visible, updated_at)
		VALUES (1, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET status=excluded.status, summary=excluded.summary,
		detail=excluded.detail, link_url=excluded.link_url, visible=excluded.visible, updated_at=excluded.updated_at`,
		item.Status, item.Summary, item.Detail, item.LinkURL, visible, item.UpdatedAt)
	if err == nil {
		err = insertAudit(ctx, tx, "now.update", "now", "1", requestID, "")
	}
	if err != nil {
		return NowStatus{}, err
	}
	return item, tx.Commit()
}

func (s *Store) CreateShip(ctx context.Context, item ShipEntry, requestID string) (ShipEntry, error) {
	now := timestamp(s.now())
	if item.OccurredAt == "" {
		item.OccurredAt = now
	}
	item.CreatedAt, item.UpdatedAt = now, now
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return ShipEntry{}, err
	}
	defer tx.Rollback()
	result, err := tx.ExecContext(ctx, `INSERT INTO ship_entries
		(title, summary, url, source, repository, occurred_at, visible, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, item.Title, item.Summary, item.URL, item.Source,
		item.Repository, item.OccurredAt, boolInt(item.Visible), item.CreatedAt, item.UpdatedAt)
	if err != nil {
		return ShipEntry{}, err
	}
	item.ID, err = result.LastInsertId()
	if err == nil {
		err = insertAudit(ctx, tx, "ship.create", "ship", strconv.FormatInt(item.ID, 10), requestID, "")
	}
	if err != nil {
		return ShipEntry{}, err
	}
	return item, tx.Commit()
}

func (s *Store) UpdateShip(ctx context.Context, id int64, item ShipEntry, requestID string) (ShipEntry, error) {
	item.ID = id
	item.UpdatedAt = timestamp(s.now())
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return ShipEntry{}, err
	}
	defer tx.Rollback()
	result, err := tx.ExecContext(ctx, `UPDATE ship_entries SET title=?, summary=?, url=?, occurred_at=?,
		visible=?, updated_at=? WHERE id=?`, item.Title, item.Summary, item.URL, item.OccurredAt,
		boolInt(item.Visible), item.UpdatedAt, id)
	if err != nil {
		return ShipEntry{}, err
	}
	changed, _ := result.RowsAffected()
	if changed == 0 {
		return ShipEntry{}, errNotFound
	}
	if err := tx.QueryRowContext(ctx, `SELECT source, repository, created_at FROM ship_entries WHERE id=?`, id).
		Scan(&item.Source, &item.Repository, &item.CreatedAt); err != nil {
		return ShipEntry{}, err
	}
	if err := insertAudit(ctx, tx, "ship.update", "ship", strconv.FormatInt(id, 10), requestID, ""); err != nil {
		return ShipEntry{}, err
	}
	return item, tx.Commit()
}

func (s *Store) HideShip(ctx context.Context, id int64, requestID string) error {
	now := timestamp(s.now())
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()
	result, err := tx.ExecContext(ctx, "UPDATE ship_entries SET visible=0, updated_at=? WHERE id=?", now, id)
	if err != nil {
		return err
	}
	changed, _ := result.RowsAffected()
	if changed == 0 {
		return errNotFound
	}
	if err := insertAudit(ctx, tx, "ship.hide", "ship", strconv.FormatInt(id, 10), requestID, ""); err != nil {
		return err
	}
	return tx.Commit()
}

func (s *Store) PublicShip(ctx context.Context, limit int, cursor string) ([]ShipEntry, *string, error) {
	query := `SELECT id, title, summary, url, source, repository, occurred_at, visible, created_at, updated_at
		FROM ship_entries WHERE visible=1`
	args := []any{}
	if cursor != "" {
		occurredAt, id, err := decodeCursor(cursor)
		if err != nil {
			return nil, nil, err
		}
		query += " AND (occurred_at < ? OR (occurred_at = ? AND id < ?))"
		args = append(args, occurredAt, occurredAt, id)
	}
	query += " ORDER BY occurred_at DESC, id DESC LIMIT ?"
	args = append(args, limit+1)
	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()
	items := make([]ShipEntry, 0, limit)
	for rows.Next() {
		var item ShipEntry
		var visible int
		if err := rows.Scan(&item.ID, &item.Title, &item.Summary, &item.URL, &item.Source, &item.Repository,
			&item.OccurredAt, &visible, &item.CreatedAt, &item.UpdatedAt); err != nil {
			return nil, nil, err
		}
		item.Visible = visible != 0
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, nil, err
	}
	var next *string
	if len(items) > limit {
		last := items[limit-1]
		value := encodeCursor(last.OccurredAt, last.ID)
		next = &value
		items = items[:limit]
	}
	return items, next, nil
}

func (s *Store) PublicGuestbook(ctx context.Context, limit int, cursor string) ([]GuestbookEntry, *string, error) {
	query := `SELECT id, nickname, message, reply, created_at, replied_at
		FROM guestbook_entries WHERE status='approved'`
	args := []any{}
	if cursor != "" {
		createdAt, id, err := decodeCursor(cursor)
		if err != nil {
			return nil, nil, err
		}
		query += " AND (created_at < ? OR (created_at = ? AND id < ?))"
		args = append(args, createdAt, createdAt, id)
	}
	query += " ORDER BY created_at DESC, id DESC LIMIT ?"
	args = append(args, limit+1)
	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()
	items := make([]GuestbookEntry, 0, limit)
	for rows.Next() {
		var item GuestbookEntry
		var repliedAt sql.NullString
		if err := rows.Scan(&item.ID, &item.Nickname, &item.Message, &item.Reply, &item.CreatedAt, &repliedAt); err != nil {
			return nil, nil, err
		}
		if repliedAt.Valid {
			item.RepliedAt = &repliedAt.String
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, nil, err
	}
	var next *string
	if len(items) > limit {
		last := items[limit-1]
		value := encodeCursor(last.CreatedAt, last.ID)
		next = &value
		items = items[:limit]
	}
	return items, next, nil
}

func (s *Store) AdminGuestbook(ctx context.Context, status string, limit int, cursor string) ([]GuestbookEntry, *string, error) {
	query := `SELECT id, nickname, message, status, reply, created_at, moderated_at, replied_at, updated_at
		FROM guestbook_entries WHERE 1=1`
	args := []any{}
	if status != "" {
		query += " AND status=?"
		args = append(args, status)
	}
	if cursor != "" {
		createdAt, id, err := decodeCursor(cursor)
		if err != nil {
			return nil, nil, err
		}
		query += " AND (created_at < ? OR (created_at = ? AND id < ?))"
		args = append(args, createdAt, createdAt, id)
	}
	query += " ORDER BY created_at DESC, id DESC LIMIT ?"
	args = append(args, limit+1)
	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()
	items := make([]GuestbookEntry, 0, limit)
	for rows.Next() {
		var item GuestbookEntry
		var moderatedAt, repliedAt sql.NullString
		if err := rows.Scan(&item.ID, &item.Nickname, &item.Message, &item.Status, &item.Reply,
			&item.CreatedAt, &moderatedAt, &repliedAt, &item.UpdatedAt); err != nil {
			return nil, nil, err
		}
		if moderatedAt.Valid {
			item.ModeratedAt = &moderatedAt.String
		}
		if repliedAt.Valid {
			item.RepliedAt = &repliedAt.String
		}
		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, nil, err
	}
	var next *string
	if len(items) > limit {
		last := items[limit-1]
		value := encodeCursor(last.CreatedAt, last.ID)
		next = &value
		items = items[:limit]
	}
	return items, next, nil
}

func (s *Store) ModerateGuestbook(ctx context.Context, id int64, status, requestID string) (GuestbookEntry, error) {
	now := timestamp(s.now())
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return GuestbookEntry{}, err
	}
	defer tx.Rollback()
	result, err := tx.ExecContext(ctx, `UPDATE guestbook_entries SET status=?, moderated_at=?, updated_at=? WHERE id=?`,
		status, now, now, id)
	if err != nil {
		return GuestbookEntry{}, err
	}
	changed, _ := result.RowsAffected()
	if changed == 0 {
		return GuestbookEntry{}, errNotFound
	}
	if err := insertAudit(ctx, tx, "guestbook."+status, "guestbook", strconv.FormatInt(id, 10), requestID, ""); err != nil {
		return GuestbookEntry{}, err
	}
	item, err := guestbookByID(ctx, tx, id)
	if err != nil {
		return GuestbookEntry{}, err
	}
	return item, tx.Commit()
}

func (s *Store) ReplyGuestbook(ctx context.Context, id int64, reply, requestID string) (GuestbookEntry, error) {
	now := timestamp(s.now())
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return GuestbookEntry{}, err
	}
	defer tx.Rollback()
	result, err := tx.ExecContext(ctx, `UPDATE guestbook_entries SET reply=?, replied_at=?, updated_at=? WHERE id=?`,
		reply, now, now, id)
	if err != nil {
		return GuestbookEntry{}, err
	}
	changed, _ := result.RowsAffected()
	if changed == 0 {
		return GuestbookEntry{}, errNotFound
	}
	if err := insertAudit(ctx, tx, "guestbook.reply", "guestbook", strconv.FormatInt(id, 10), requestID, ""); err != nil {
		return GuestbookEntry{}, err
	}
	item, err := guestbookByID(ctx, tx, id)
	if err != nil {
		return GuestbookEntry{}, err
	}
	return item, tx.Commit()
}

func (s *Store) guestbookByID(ctx context.Context, id int64) (GuestbookEntry, error) {
	return guestbookByID(ctx, s.db, id)
}

type rowGetter interface {
	QueryRowContext(context.Context, string, ...any) *sql.Row
}

func guestbookByID(ctx context.Context, queryer rowGetter, id int64) (GuestbookEntry, error) {
	var item GuestbookEntry
	var moderatedAt, repliedAt sql.NullString
	err := queryer.QueryRowContext(ctx, `SELECT id, nickname, message, status, reply, created_at,
		moderated_at, replied_at, updated_at FROM guestbook_entries WHERE id=?`, id).
		Scan(&item.ID, &item.Nickname, &item.Message, &item.Status, &item.Reply, &item.CreatedAt,
			&moderatedAt, &repliedAt, &item.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return GuestbookEntry{}, errNotFound
	}
	if err != nil {
		return GuestbookEntry{}, err
	}
	if moderatedAt.Valid {
		item.ModeratedAt = &moderatedAt.String
	}
	if repliedAt.Valid {
		item.RepliedAt = &repliedAt.String
	}
	return item, nil
}

func (s *Store) GetIdempotency(ctx context.Context, endpoint, key, requestHash string) (*IdempotencyRecord, error) {
	var record IdempotencyRecord
	err := s.db.QueryRowContext(ctx, `SELECT request_hash, response_status, response_body
		FROM idempotency_requests WHERE endpoint=? AND idempotency_key=?`, endpoint, key).
		Scan(&record.RequestHash, &record.Status, &record.Body)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if record.RequestHash != requestHash {
		return nil, errIdempotencyConflict
	}
	return &record, nil
}

func (s *Store) CreateGuestbookIdempotent(ctx context.Context, endpoint, key, requestHash, nickname, message, visitorHash string) (IdempotentResult, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return IdempotentResult{}, err
	}
	defer tx.Rollback()
	if result, ok, err := findIdempotencyTx(ctx, tx, endpoint, key, requestHash); err != nil || ok {
		return result, err
	}
	now := timestamp(s.now())
	result, err := tx.ExecContext(ctx, `INSERT INTO guestbook_entries
		(nickname, message, status, visitor_hash, created_at, updated_at)
		VALUES (?, ?, 'pending', ?, ?, ?)`, nickname, message, visitorHash, now, now)
	if err != nil {
		return IdempotentResult{}, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return IdempotentResult{}, err
	}
	body, _ := json.Marshal(map[string]any{
		"data":    map[string]any{"id": id, "status": "pending"},
		"message": "Thanks. Your message is awaiting review.",
	})
	const status = 202
	if err := saveIdempotencyTx(ctx, tx, endpoint, key, requestHash, status, body, now); err != nil {
		return IdempotentResult{}, err
	}
	if err := tx.Commit(); err != nil {
		return IdempotentResult{}, err
	}
	return IdempotentResult{Status: status, Body: body}, nil
}

func (s *Store) ReactIdempotent(ctx context.Context, endpoint, key, requestHash, pageKey, reactionType, visitorHash string) (IdempotentResult, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return IdempotentResult{}, err
	}
	defer tx.Rollback()
	if result, ok, err := findIdempotencyTx(ctx, tx, endpoint, key, requestHash); err != nil || ok {
		return result, err
	}
	now := timestamp(s.now())
	result, err := tx.ExecContext(ctx, `INSERT OR IGNORE INTO page_reactions
		(page_key, reaction_type, visitor_hash, created_at) VALUES (?, ?, ?, ?)`, pageKey, reactionType, visitorHash, now)
	if err != nil {
		return IdempotentResult{}, err
	}
	rows, _ := result.RowsAffected()
	counts, err := reactionCountsTx(ctx, tx, pageKey)
	if err != nil {
		return IdempotentResult{}, err
	}
	body, _ := json.Marshal(map[string]any{"accepted": rows == 1, "counts": counts})
	const status = 200
	if err := saveIdempotencyTx(ctx, tx, endpoint, key, requestHash, status, body, now); err != nil {
		return IdempotentResult{}, err
	}
	if err := tx.Commit(); err != nil {
		return IdempotentResult{}, err
	}
	return IdempotentResult{Status: status, Body: body}, nil
}

func (s *Store) ReactionCounts(ctx context.Context, pageKey string) (map[string]int64, error) {
	return reactionCounts(ctx, s.db, pageKey)
}

type rowQueryer interface {
	QueryContext(context.Context, string, ...any) (*sql.Rows, error)
}

func reactionCounts(ctx context.Context, queryer rowQueryer, pageKey string) (map[string]int64, error) {
	counts := map[string]int64{"resonated": 0, "learned": 0, "want_more": 0, "confused": 0}
	rows, err := queryer.QueryContext(ctx, `SELECT reaction_type, COUNT(*) FROM page_reactions
		WHERE page_key=? GROUP BY reaction_type`, pageKey)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var reactionType string
		var count int64
		if err := rows.Scan(&reactionType, &count); err != nil {
			return nil, err
		}
		counts[reactionType] = count
	}
	return counts, rows.Err()
}

func reactionCountsTx(ctx context.Context, tx *sql.Tx, pageKey string) (map[string]int64, error) {
	return reactionCounts(ctx, tx, pageKey)
}

func findIdempotencyTx(ctx context.Context, tx *sql.Tx, endpoint, key, requestHash string) (IdempotentResult, bool, error) {
	var storedHash string
	var result IdempotentResult
	err := tx.QueryRowContext(ctx, `SELECT request_hash, response_status, response_body
		FROM idempotency_requests WHERE endpoint=? AND idempotency_key=?`, endpoint, key).
		Scan(&storedHash, &result.Status, &result.Body)
	if errors.Is(err, sql.ErrNoRows) {
		return IdempotentResult{}, false, nil
	}
	if err != nil {
		return IdempotentResult{}, false, err
	}
	if storedHash != requestHash {
		return IdempotentResult{}, false, errIdempotencyConflict
	}
	result.Replayed = true
	return result, true, nil
}

func saveIdempotencyTx(ctx context.Context, tx *sql.Tx, endpoint, key, requestHash string, status int, body []byte, now string) error {
	_, err := tx.ExecContext(ctx, `INSERT INTO idempotency_requests
		(endpoint, idempotency_key, request_hash, response_status, response_body, created_at)
		VALUES (?, ?, ?, ?, ?, ?)`, endpoint, key, requestHash, status, body, now)
	return err
}

func insertAudit(ctx context.Context, tx *sql.Tx, action, targetType, targetID, requestID, detail string) error {
	_, err := tx.ExecContext(ctx, `INSERT INTO audit_log
		(action, target_type, target_id, request_id, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
		action, targetType, targetID, requestID, detail, timestamp(time.Now()))
	return err
}

func encodeCursor(value string, id int64) string {
	return base64.RawURLEncoding.EncodeToString([]byte(value + "|" + strconv.FormatInt(id, 10)))
}

func decodeCursor(cursor string) (string, int64, error) {
	decoded, err := base64.RawURLEncoding.DecodeString(cursor)
	if err != nil {
		return "", 0, fmt.Errorf("invalid cursor")
	}
	parts := strings.Split(string(decoded), "|")
	if len(parts) != 2 {
		return "", 0, fmt.Errorf("invalid cursor")
	}
	if _, err := time.Parse(time.RFC3339Nano, parts[0]); err != nil {
		return "", 0, fmt.Errorf("invalid cursor")
	}
	id, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil || id <= 0 {
		return "", 0, fmt.Errorf("invalid cursor")
	}
	return parts[0], id, nil
}

func boolInt(value bool) int {
	if value {
		return 1
	}
	return 0
}
