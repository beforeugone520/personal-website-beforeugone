package main

import (
	"context"
	"encoding/json"
	"errors"
	"path/filepath"
	"testing"
	"time"
)

func testStore(t *testing.T) *Store {
	t.Helper()
	store, err := openStore(context.Background(), filepath.Join(t.TempDir(), "beforeu.db"))
	if err != nil {
		t.Fatalf("openStore: %v", err)
	}
	t.Cleanup(func() {
		if err := store.Close(); err != nil {
			t.Errorf("close store: %v", err)
		}
	})
	return store
}

func TestOpenStoreAppliesMigrationsAndPragmas(t *testing.T) {
	store := testStore(t)
	ctx := context.Background()

	var journalMode string
	if err := store.db.QueryRowContext(ctx, "PRAGMA journal_mode").Scan(&journalMode); err != nil {
		t.Fatal(err)
	}
	if journalMode != "wal" {
		t.Fatalf("journal_mode = %q, want wal", journalMode)
	}
	var foreignKeys, busyTimeout int
	if err := store.db.QueryRowContext(ctx, "PRAGMA foreign_keys").Scan(&foreignKeys); err != nil {
		t.Fatal(err)
	}
	if err := store.db.QueryRowContext(ctx, "PRAGMA busy_timeout").Scan(&busyTimeout); err != nil {
		t.Fatal(err)
	}
	if foreignKeys != 1 || busyTimeout != 5000 {
		t.Fatalf("pragmas foreign_keys=%d busy_timeout=%d", foreignKeys, busyTimeout)
	}
	var migrations int
	if err := store.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM schema_migrations").Scan(&migrations); err != nil {
		t.Fatal(err)
	}
	if migrations != 1 {
		t.Fatalf("migration count = %d, want 1", migrations)
	}
}

func TestStoreNowAndShipPagination(t *testing.T) {
	store := testStore(t)
	ctx := context.Background()
	fixed := time.Date(2026, 7, 12, 9, 0, 0, 0, time.UTC)
	store.now = func() time.Time { return fixed }

	now, err := store.PutNow(ctx, NowStatus{Status: "working", Summary: "Building", Visible: false}, "request-now")
	if err != nil {
		t.Fatal(err)
	}
	if now.UpdatedAt != timestamp(fixed) {
		t.Fatalf("updated_at = %q", now.UpdatedAt)
	}
	publicNow, err := store.PublicNow(ctx)
	if err != nil || publicNow != nil {
		t.Fatalf("hidden PublicNow = %#v, %v", publicNow, err)
	}
	_, err = store.PutNow(ctx, NowStatus{Status: "working", Summary: "Building", Visible: true}, "request-now-2")
	if err != nil {
		t.Fatal(err)
	}
	publicNow, err = store.PublicNow(ctx)
	if err != nil || publicNow == nil || publicNow.Summary != "Building" {
		t.Fatalf("visible PublicNow = %#v, %v", publicNow, err)
	}

	var created []ShipEntry
	for i, occurred := range []string{"2026-07-12T03:00:00Z", "2026-07-12T02:00:00Z", "2026-07-12T01:00:00Z"} {
		item, err := store.CreateShip(ctx, ShipEntry{Title: "Ship " + string(rune('A'+i)), Source: "manual", OccurredAt: occurred, Visible: true}, "ship-create")
		if err != nil {
			t.Fatal(err)
		}
		created = append(created, item)
	}
	first, cursor, err := store.PublicShip(ctx, 2, "")
	if err != nil {
		t.Fatal(err)
	}
	if len(first) != 2 || cursor == nil || first[0].Title != "Ship A" || first[1].Title != "Ship B" {
		t.Fatalf("first page = %#v, cursor=%v", first, cursor)
	}
	second, next, err := store.PublicShip(ctx, 2, *cursor)
	if err != nil {
		t.Fatal(err)
	}
	if len(second) != 1 || next != nil || second[0].Title != "Ship C" {
		t.Fatalf("second page = %#v, cursor=%v", second, next)
	}
	if err := store.HideShip(ctx, created[0].ID, "ship-hide"); err != nil {
		t.Fatal(err)
	}
	visible, _, err := store.PublicShip(ctx, 10, "")
	if err != nil || len(visible) != 2 || visible[0].Title != "Ship B" {
		t.Fatalf("visible after hide = %#v, %v", visible, err)
	}
	if _, _, err := store.PublicShip(ctx, 10, "not-a-cursor"); err == nil {
		t.Fatal("expected invalid cursor error")
	}
}

func TestStoreShipMutationRollsBackWhenAuditFails(t *testing.T) {
	store := testStore(t)
	ctx := context.Background()
	if _, err := store.db.ExecContext(ctx, `CREATE TRIGGER fail_ship_audit
		BEFORE INSERT ON audit_log WHEN NEW.action = 'ship.create'
		BEGIN SELECT RAISE(ABORT, 'audit unavailable'); END`); err != nil {
		t.Fatal(err)
	}
	if _, err := store.CreateShip(ctx, ShipEntry{
		Title: "Must roll back", Source: "manual", OccurredAt: "2026-07-12T03:00:00Z", Visible: true,
	}, "request-audit-failure"); err == nil {
		t.Fatal("expected audit failure")
	}
	var ships int
	if err := store.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM ship_entries").Scan(&ships); err != nil {
		t.Fatal(err)
	}
	if ships != 0 {
		t.Fatalf("ship mutation committed without audit row: count=%d", ships)
	}
}

func TestStoreGuestbookModerationAndIdempotency(t *testing.T) {
	store := testStore(t)
	ctx := context.Background()

	created, err := store.CreateGuestbookIdempotent(ctx, "guestbook", "same-key", "hash-one", "Ada", "A thoughtful note", "visitor-hash")
	if err != nil {
		t.Fatal(err)
	}
	if created.Status != 202 || created.Replayed {
		t.Fatalf("created = %#v", created)
	}
	var envelope struct {
		Data struct {
			ID     int64  `json:"id"`
			Status string `json:"status"`
		} `json:"data"`
	}
	if err := json.Unmarshal(created.Body, &envelope); err != nil {
		t.Fatal(err)
	}
	if envelope.Data.ID == 0 || envelope.Data.Status != "pending" {
		t.Fatalf("response = %s", created.Body)
	}
	replayed, err := store.CreateGuestbookIdempotent(ctx, "guestbook", "same-key", "hash-one", "Ada", "A thoughtful note", "visitor-hash")
	if err != nil || !replayed.Replayed || string(replayed.Body) != string(created.Body) {
		t.Fatalf("replay = %#v, %v", replayed, err)
	}
	_, err = store.CreateGuestbookIdempotent(ctx, "guestbook", "same-key", "different-hash", "Ada", "Changed", "visitor-hash")
	if !errors.Is(err, errIdempotencyConflict) {
		t.Fatalf("conflict error = %v", err)
	}
	pending, _, err := store.AdminGuestbook(ctx, "pending", 10, "")
	if err != nil || len(pending) != 1 {
		t.Fatalf("pending = %#v, %v", pending, err)
	}
	public, _, err := store.PublicGuestbook(ctx, 10, "")
	if err != nil || len(public) != 0 {
		t.Fatalf("public before approval = %#v, %v", public, err)
	}
	approved, err := store.ModerateGuestbook(ctx, envelope.Data.ID, "approved", "approve-request")
	if err != nil || approved.Status != "approved" {
		t.Fatalf("approve = %#v, %v", approved, err)
	}
	replied, err := store.ReplyGuestbook(ctx, envelope.Data.ID, "Thank you", "reply-request")
	if err != nil || replied.Reply != "Thank you" || replied.RepliedAt == nil {
		t.Fatalf("reply = %#v, %v", replied, err)
	}
	public, _, err = store.PublicGuestbook(ctx, 10, "")
	if err != nil || len(public) != 1 || public[0].Status != "" || public[0].Reply != "Thank you" {
		t.Fatalf("public after approval = %#v, %v", public, err)
	}
}

func TestStoreReactionDeduplicationAndIdempotency(t *testing.T) {
	store := testStore(t)
	ctx := context.Background()

	first, err := store.ReactIdempotent(ctx, "reactions", "key-one-1", "hash-one", "/posts/hello.html", "learned", "visitor-one")
	if err != nil {
		t.Fatal(err)
	}
	var response struct {
		Accepted bool             `json:"accepted"`
		Counts   map[string]int64 `json:"counts"`
	}
	if err := json.Unmarshal(first.Body, &response); err != nil {
		t.Fatal(err)
	}
	if !response.Accepted || response.Counts["learned"] != 1 || len(response.Counts) != 4 {
		t.Fatalf("first response = %s", first.Body)
	}
	replay, err := store.ReactIdempotent(ctx, "reactions", "key-one-1", "hash-one", "/posts/hello.html", "learned", "visitor-one")
	if err != nil || !replay.Replayed {
		t.Fatalf("replay = %#v, %v", replay, err)
	}
	duplicate, err := store.ReactIdempotent(ctx, "reactions", "key-two-2", "hash-two", "/posts/hello.html", "learned", "visitor-one")
	if err != nil {
		t.Fatal(err)
	}
	if err := json.Unmarshal(duplicate.Body, &response); err != nil {
		t.Fatal(err)
	}
	if response.Accepted || response.Counts["learned"] != 1 {
		t.Fatalf("duplicate response = %s", duplicate.Body)
	}
	counts, err := store.ReactionCounts(ctx, "/posts/hello.html")
	if err != nil || counts["learned"] != 1 || counts["confused"] != 0 {
		t.Fatalf("counts = %#v, %v", counts, err)
	}
}
