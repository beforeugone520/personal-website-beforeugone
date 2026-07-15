package main

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func testConfig() Config {
	return Config{
		ListenAddr:            "127.0.0.1:0",
		AdminToken:            "admin-secret-token",
		AnonymizationSecret:   "visitor-hmac-secret",
		CORSAllowedOrigins:    []string{"https://beforeugone.com"},
		TurnstileHostnames:    map[string]struct{}{"beforeugone.com": {}},
		AllowInsecureWrites:   true,
		GitHubWebhookSecret:   "github-secret",
		GitHubAllowedRepos:    map[string]struct{}{"beforeugone/site": {}},
		GitHubUsername:        "beforeugone520",
		GitHubRefreshInterval: 15 * time.Minute,
		GitHubRequestTimeout:  10 * time.Second,
		ReactionPageKeys:      map[string]struct{}{"/posts/hello-world.html": {}, "/posts/hello.html": {}},
		PublicWriteLimit:      100,
		PublicWriteWindow:     time.Minute,
		MaxRequestBodyBytes:   16 << 10,
	}
}

func testAPI(t *testing.T, mutate func(*Config)) (*API, *Store) {
	t.Helper()
	store := testStore(t)
	cfg := testConfig()
	if mutate != nil {
		mutate(&cfg)
	}
	api := newAPI(cfg, store, slog.New(slog.NewTextHandler(io.Discard, nil)))
	return api, store
}

func requestJSON(t *testing.T, handler http.Handler, method, target string, body any, headers map[string]string) *httptest.ResponseRecorder {
	t.Helper()
	var reader io.Reader
	if body != nil {
		encoded, err := json.Marshal(body)
		if err != nil {
			t.Fatal(err)
		}
		reader = bytes.NewReader(encoded)
	}
	req := httptest.NewRequest(method, target, reader)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	response := httptest.NewRecorder()
	handler.ServeHTTP(response, req)
	return response
}

func decodeResponse(t *testing.T, response *httptest.ResponseRecorder, target any) {
	t.Helper()
	if err := json.Unmarshal(response.Body.Bytes(), target); err != nil {
		t.Fatalf("decode response %d %q: %v", response.Code, response.Body.String(), err)
	}
}

func TestAPIHealthCORSAndAdminNow(t *testing.T) {
	api, _ := testAPI(t, nil)
	handler := api.Handler()

	health := requestJSON(t, handler, http.MethodGet, "/healthz", nil, nil)
	if health.Code != http.StatusOK || health.Header().Get("X-Request-ID") == "" || health.Body.String() != "{\"status\":\"ok\"}\n" {
		t.Fatalf("health = %d headers=%v body=%s", health.Code, health.Header(), health.Body.String())
	}
	ready := requestJSON(t, handler, http.MethodGet, "/readyz", nil, nil)
	if ready.Code != http.StatusOK || ready.Body.String() != "{\"status\":\"ready\"}\n" {
		t.Fatalf("ready = %d %s", ready.Code, ready.Body.String())
	}
	untrusted := requestJSON(t, handler, http.MethodGet, "/v1/public/now", nil, map[string]string{"Origin": "https://evil.example"})
	if untrusted.Code != http.StatusForbidden || untrusted.Header().Get("Access-Control-Allow-Origin") != "" {
		t.Fatalf("untrusted origin = %d headers=%v", untrusted.Code, untrusted.Header())
	}
	preflight := requestJSON(t, handler, http.MethodOptions, "/v1/public/now", nil, map[string]string{"Origin": "https://beforeugone.com"})
	if preflight.Code != http.StatusNoContent || preflight.Header().Get("Access-Control-Allow-Origin") != "https://beforeugone.com" {
		t.Fatalf("preflight = %d headers=%v", preflight.Code, preflight.Header())
	}

	missing := requestJSON(t, handler, http.MethodPut, "/v1/admin/now", map[string]any{
		"status": "working", "summary": "Building", "visible": true,
	}, nil)
	if missing.Code != http.StatusUnauthorized || missing.Header().Get("WWW-Authenticate") != "Bearer" {
		t.Fatalf("unauthorized = %d %s", missing.Code, missing.Body.String())
	}
	updated := requestJSON(t, handler, http.MethodPut, "/v1/admin/now", map[string]any{
		"status": "working", "summary": "Building P1", "detail": "Quietly shipping", "visible": true,
	}, map[string]string{"Authorization": "Bearer admin-secret-token", "X-Request-ID": "request-1234"})
	if updated.Code != http.StatusOK || updated.Header().Get("X-Request-ID") != "request-1234" {
		t.Fatalf("update = %d %s", updated.Code, updated.Body.String())
	}
	public := requestJSON(t, handler, http.MethodGet, "/v1/public/now", nil, nil)
	var nowEnvelope struct {
		Data *NowStatus `json:"data"`
	}
	decodeResponse(t, public, &nowEnvelope)
	if public.Code != http.StatusOK || nowEnvelope.Data == nil || nowEnvelope.Data.Summary != "Building P1" {
		t.Fatalf("public now = %d %#v", public.Code, nowEnvelope)
	}
}

func TestAPIPublicGitHubSnapshot(t *testing.T) {
	api, store := testAPI(t, nil)
	handler := api.Handler()

	empty := requestJSON(t, handler, http.MethodGet, "/v1/public/github", nil, nil)
	if empty.Code != http.StatusServiceUnavailable || empty.Header().Get("Cache-Control") != "no-store" || !strings.Contains(empty.Body.String(), "github_unavailable") {
		t.Fatalf("empty GitHub response = %d headers=%v body=%s", empty.Code, empty.Header(), empty.Body.String())
	}
	snapshot := GitHubActivitySnapshot{
		Username: "beforeugone520", ProfileURL: "https://github.com/beforeugone520",
		TotalContributions: 232, RefreshedAt: "2026-07-13T12:00:00Z",
		Contributions: []GitHubContribution{{Date: "2026-07-13", Count: 4, Level: 3}},
		Repositories:  []GitHubRepository{{Name: "site", FullName: "beforeugone520/site", URL: "https://github.com/beforeugone520/site"}},
	}
	if err := store.PutGitHubActivity(context.Background(), snapshot); err != nil {
		t.Fatal(err)
	}
	response := requestJSON(t, handler, http.MethodGet, "/v1/public/github", nil, map[string]string{"Origin": "https://beforeugone.com"})
	if response.Code != http.StatusOK || response.Header().Get("Cache-Control") != "public, max-age=300, stale-while-revalidate=3600" || response.Header().Get("Access-Control-Allow-Origin") != "https://beforeugone.com" {
		t.Fatalf("GitHub response = %d headers=%v body=%s", response.Code, response.Header(), response.Body.String())
	}
	var envelope struct {
		Data GitHubActivitySnapshot `json:"data"`
	}
	decodeResponse(t, response, &envelope)
	if envelope.Data.Username != snapshot.Username || envelope.Data.TotalContributions != 232 || len(envelope.Data.Contributions) != 1 || len(envelope.Data.Repositories) != 1 {
		t.Fatalf("GitHub payload = %#v", envelope.Data)
	}
	api.cfg.GitHubUsername = "different-user"
	mismatch := requestJSON(t, handler, http.MethodGet, "/v1/public/github", nil, nil)
	if mismatch.Code != http.StatusServiceUnavailable || mismatch.Header().Get("Cache-Control") != "no-store" {
		t.Fatalf("mismatched GitHub cache = %d headers=%v body=%s", mismatch.Code, mismatch.Header(), mismatch.Body.String())
	}
	method := requestJSON(t, handler, http.MethodPost, "/v1/public/github", nil, nil)
	if method.Code != http.StatusMethodNotAllowed {
		t.Fatalf("GitHub POST = %d %s", method.Code, method.Body.String())
	}
}

func TestAPIAdminShipCreateUpdateAndHide(t *testing.T) {
	api, _ := testAPI(t, nil)
	handler := api.Handler()
	adminHeaders := map[string]string{"Authorization": "Bearer admin-secret-token"}
	created := requestJSON(t, handler, http.MethodPost, "/v1/admin/ship", map[string]any{
		"title": "Initial ship", "summary": "First version", "url": "https://beforeugone.com/",
		"occurred_at": "2026-07-12T10:00:00+08:00", "visible": true,
	}, adminHeaders)
	if created.Code != http.StatusCreated {
		t.Fatalf("create ship = %d %s", created.Code, created.Body.String())
	}
	var envelope struct {
		Data ShipEntry `json:"data"`
	}
	decodeResponse(t, created, &envelope)
	if envelope.Data.ID == 0 || envelope.Data.Source != "manual" || envelope.Data.OccurredAt != "2026-07-12T02:00:00Z" {
		t.Fatalf("created ship = %#v", envelope.Data)
	}
	updated := requestJSON(t, handler, http.MethodPut, "/v1/admin/ship/"+strconv64(envelope.Data.ID), map[string]any{
		"title": "Updated ship", "summary": "Corrected version", "occurred_at": "2026-07-12T03:00:00Z", "visible": true,
	}, adminHeaders)
	if updated.Code != http.StatusOK || !strings.Contains(updated.Body.String(), "Updated ship") {
		t.Fatalf("update ship = %d %s", updated.Code, updated.Body.String())
	}
	public := requestJSON(t, handler, http.MethodGet, "/v1/public/ship", nil, nil)
	if public.Code != http.StatusOK || !strings.Contains(public.Body.String(), "Updated ship") {
		t.Fatalf("public ship = %d %s", public.Code, public.Body.String())
	}
	hidden := requestJSON(t, handler, http.MethodPost, "/v1/admin/ship/"+strconv64(envelope.Data.ID)+"/hide", nil, adminHeaders)
	if hidden.Code != http.StatusNoContent {
		t.Fatalf("hide ship = %d %s", hidden.Code, hidden.Body.String())
	}
	public = requestJSON(t, handler, http.MethodGet, "/v1/public/ship", nil, nil)
	if public.Code != http.StatusOK || !strings.Contains(public.Body.String(), `"items":[]`) {
		t.Fatalf("public after hide = %d %s", public.Code, public.Body.String())
	}
}

func TestAPIGuestbookWorkflowAndIdempotency(t *testing.T) {
	api, _ := testAPI(t, nil)
	handler := api.Handler()
	body := map[string]any{
		"nickname": "Ada", "message": "This is a thoughtful note.",
		"visitor_token": "visitor-token-123456",
	}
	headers := map[string]string{"Idempotency-Key": "guestbook-key-0001"}
	created := requestJSON(t, handler, http.MethodPost, "/v1/public/guestbook", body, headers)
	if created.Code != http.StatusAccepted {
		t.Fatalf("create = %d %s", created.Code, created.Body.String())
	}
	var createdEnvelope struct {
		Data struct {
			ID     int64  `json:"id"`
			Status string `json:"status"`
		} `json:"data"`
		Message string `json:"message"`
	}
	decodeResponse(t, created, &createdEnvelope)
	if createdEnvelope.Data.ID == 0 || createdEnvelope.Data.Status != "pending" || createdEnvelope.Message == "" {
		t.Fatalf("created response = %#v", createdEnvelope)
	}
	replay := requestJSON(t, handler, http.MethodPost, "/v1/public/guestbook", body, headers)
	if replay.Code != http.StatusAccepted || replay.Header().Get("Idempotency-Replayed") != "true" || replay.Body.String() != created.Body.String() {
		t.Fatalf("replay = %d headers=%v body=%s", replay.Code, replay.Header(), replay.Body.String())
	}
	changedBody := map[string]any{
		"nickname": "Ada", "message": "This is a different thoughtful note.",
		"visitor_token": "visitor-token-123456",
	}
	conflict := requestJSON(t, handler, http.MethodPost, "/v1/public/guestbook", changedBody, headers)
	if conflict.Code != http.StatusConflict {
		t.Fatalf("conflict = %d %s", conflict.Code, conflict.Body.String())
	}
	publicBefore := requestJSON(t, handler, http.MethodGet, "/v1/public/guestbook", nil, nil)
	if publicBefore.Code != http.StatusOK || !strings.Contains(publicBefore.Body.String(), `"items":[]`) || !strings.Contains(publicBefore.Body.String(), `"next_cursor":null`) {
		t.Fatalf("public before = %d %s", publicBefore.Code, publicBefore.Body.String())
	}
	adminHeaders := map[string]string{"Authorization": "Bearer admin-secret-token"}
	pending := requestJSON(t, handler, http.MethodGet, "/v1/admin/guestbook?status=pending", nil, adminHeaders)
	if pending.Code != http.StatusOK || !strings.Contains(pending.Body.String(), `"status":"pending"`) {
		t.Fatalf("pending = %d %s", pending.Code, pending.Body.String())
	}
	approve := requestJSON(t, handler, http.MethodPost, "/v1/admin/guestbook/"+strconv64(createdEnvelope.Data.ID)+"/approve", nil, adminHeaders)
	if approve.Code != http.StatusOK {
		t.Fatalf("approve = %d %s", approve.Code, approve.Body.String())
	}
	reply := requestJSON(t, handler, http.MethodPost, "/v1/admin/guestbook/"+strconv64(createdEnvelope.Data.ID)+"/reply", map[string]string{"reply": "Thank you!"}, adminHeaders)
	if reply.Code != http.StatusOK {
		t.Fatalf("reply = %d %s", reply.Code, reply.Body.String())
	}
	publicAfter := requestJSON(t, handler, http.MethodGet, "/v1/public/guestbook", nil, nil)
	if publicAfter.Code != http.StatusOK || !strings.Contains(publicAfter.Body.String(), "Thank you!") || strings.Contains(publicAfter.Body.String(), `"status"`) {
		t.Fatalf("public after = %d %s", publicAfter.Code, publicAfter.Body.String())
	}
}

func TestAPIReactionsValidationDeduplicationAndRateLimit(t *testing.T) {
	api, _ := testAPI(t, func(cfg *Config) { cfg.PublicWriteLimit = 2 })
	handler := api.Handler()
	body := map[string]string{
		"page_key": "/posts/hello-world.html", "reaction_type": "resonated", "visitor_token": "visitor-token-123456",
	}
	first := requestJSON(t, handler, http.MethodPost, "/v1/public/reactions", body, map[string]string{"Idempotency-Key": "reaction-key-001"})
	if first.Code != http.StatusOK || !strings.Contains(first.Body.String(), `"accepted":true`) {
		t.Fatalf("first = %d %s", first.Code, first.Body.String())
	}
	duplicate := requestJSON(t, handler, http.MethodPost, "/v1/public/reactions", body, map[string]string{"Idempotency-Key": "reaction-key-002"})
	if duplicate.Code != http.StatusOK || !strings.Contains(duplicate.Body.String(), `"accepted":false`) {
		t.Fatalf("duplicate = %d %s", duplicate.Code, duplicate.Body.String())
	}
	limited := requestJSON(t, handler, http.MethodPost, "/v1/public/reactions", body, map[string]string{"Idempotency-Key": "reaction-key-003"})
	if limited.Code != http.StatusTooManyRequests || limited.Header().Get("Retry-After") == "" {
		t.Fatalf("limited = %d headers=%v body=%s", limited.Code, limited.Header(), limited.Body.String())
	}
	counts := requestJSON(t, handler, http.MethodGet, "/v1/public/reactions?page_key=%2Fposts%2Fhello-world.html", nil, nil)
	if counts.Code != http.StatusOK || !strings.Contains(counts.Body.String(), `"resonated":1`) || !strings.Contains(counts.Body.String(), `"confused":0`) {
		t.Fatalf("counts = %d %s", counts.Code, counts.Body.String())
	}
	for _, invalid := range []string{"anything", "/posts/../secret.html", "/posts/article", "/posts/hello%3Fquery.html"} {
		response := requestJSON(t, handler, http.MethodGet, "/v1/public/reactions?page_key="+url.QueryEscape(invalid), nil, nil)
		if response.Code != http.StatusBadRequest {
			t.Fatalf("page_key %q accepted: %d %s", invalid, response.Code, response.Body.String())
		}
	}
}

func TestAPIPublicWritesFailClosedWithoutTurnstile(t *testing.T) {
	api, _ := testAPI(t, func(cfg *Config) {
		cfg.AllowInsecureWrites = false
		cfg.TurnstileSecret = ""
	})
	response := requestJSON(t, api.Handler(), http.MethodPost, "/v1/public/guestbook", map[string]string{
		"message": "This valid message must not bypass verification.", "visitor_token": "visitor-token-123456",
	}, map[string]string{"Idempotency-Key": "disabled-write-001"})
	if response.Code != http.StatusServiceUnavailable || !strings.Contains(response.Body.String(), "public_writes_disabled") {
		t.Fatalf("disabled write = %d %s", response.Code, response.Body.String())
	}
	if response.Header().Get("Cache-Control") != "no-store" {
		t.Fatalf("write cache policy = %q", response.Header().Get("Cache-Control"))
	}
}

func TestAPITrustedClientIPRequiresLoopbackProxy(t *testing.T) {
	api, _ := testAPI(t, func(cfg *Config) { cfg.TrustedProxyHeader = true })
	trusted := httptest.NewRequest(http.MethodPost, "/", nil)
	trusted.RemoteAddr = "127.0.0.1:43123"
	trusted.Header.Set("X-BeforeU-Client-IP", "203.0.113.9")
	if got := api.clientIP(trusted); got != "203.0.113.9" {
		t.Fatalf("trusted client IP = %q", got)
	}

	untrusted := httptest.NewRequest(http.MethodPost, "/", nil)
	untrusted.RemoteAddr = "198.51.100.7:43123"
	untrusted.Header.Set("X-BeforeU-Client-IP", "203.0.113.9")
	if got := api.clientIP(untrusted); got != "198.51.100.7" {
		t.Fatalf("spoofed proxy header was trusted: %q", got)
	}
}

func TestAPITurnstileEnforcement(t *testing.T) {
	verification := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseForm(); err != nil {
			t.Fatal(err)
		}
		if r.Form.Get("secret") != "turnstile-secret" {
			t.Errorf("secret = %q", r.Form.Get("secret"))
		}
		if len(r.Form.Get("idempotency_key")) != 36 {
			t.Errorf("idempotency_key = %q", r.Form.Get("idempotency_key"))
		}
		token := r.Form.Get("response")
		hostname := "beforeugone.com"
		if token == "wrong-host-token" {
			hostname = "evil.example"
		}
		writeJSON(w, http.StatusOK, map[string]any{
			"success": token == "valid-token" || token == "wrong-host-token", "hostname": hostname,
		})
	}))
	defer verification.Close()
	api, _ := testAPI(t, func(cfg *Config) {
		cfg.TurnstileSecret = "turnstile-secret"
		cfg.TurnstileVerifyURL = verification.URL
	})
	handler := api.Handler()
	body := map[string]string{
		"page_key": "/posts/hello.html", "reaction_type": "learned", "visitor_token": "visitor-token-123456",
	}
	failed := requestJSON(t, handler, http.MethodPost, "/v1/public/reactions", body, map[string]string{"Idempotency-Key": "turnstile-key-01"})
	if failed.Code != http.StatusBadRequest || !strings.Contains(failed.Body.String(), "turnstile_failed") {
		t.Fatalf("failed = %d %s", failed.Code, failed.Body.String())
	}
	body["turnstile_token"] = "wrong-host-token"
	wrongHost := requestJSON(t, handler, http.MethodPost, "/v1/public/reactions", body, map[string]string{"Idempotency-Key": "turnstile-key-host"})
	if wrongHost.Code != http.StatusBadRequest || !strings.Contains(wrongHost.Body.String(), "turnstile_failed") {
		t.Fatalf("wrong host = %d %s", wrongHost.Code, wrongHost.Body.String())
	}
	body["turnstile_token"] = "valid-token"
	passed := requestJSON(t, handler, http.MethodPost, "/v1/public/reactions", body, map[string]string{"Idempotency-Key": "turnstile-key-02"})
	if passed.Code != http.StatusOK {
		t.Fatalf("passed = %d %s", passed.Code, passed.Body.String())
	}
	body["turnstile_token"] = "fresh-single-use-token"
	replayed := requestJSON(t, handler, http.MethodPost, "/v1/public/reactions", body, map[string]string{"Idempotency-Key": "turnstile-key-02"})
	if replayed.Code != http.StatusOK || replayed.Header().Get("Idempotency-Replayed") != "true" || replayed.Body.String() != passed.Body.String() {
		t.Fatalf("fresh-token replay = %d headers=%v body=%s", replayed.Code, replayed.Header(), replayed.Body.String())
	}
}

func TestAPIConcurrentIdempotentRetriesVerifyTurnstileOnce(t *testing.T) {
	var calls atomic.Int32
	verification := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseForm(); err != nil {
			t.Error(err)
		}
		attempt := calls.Add(1)
		writeJSON(w, http.StatusOK, map[string]any{
			"success": attempt == 1, "hostname": "beforeugone.com",
		})
	}))
	defer verification.Close()
	api, _ := testAPI(t, func(cfg *Config) {
		cfg.TurnstileSecret = "turnstile-secret"
		cfg.TurnstileVerifyURL = verification.URL
	})
	body := map[string]string{
		"page_key": "/posts/hello.html", "reaction_type": "learned",
		"visitor_token": "visitor-token-123456", "turnstile_token": "single-use-token",
	}
	headers := map[string]string{"Idempotency-Key": "concurrent-key-001"}
	responses := make(chan *httptest.ResponseRecorder, 2)
	var wait sync.WaitGroup
	for index := 0; index < 2; index++ {
		wait.Add(1)
		go func() {
			defer wait.Done()
			responses <- requestJSON(t, api.Handler(), http.MethodPost, "/v1/public/reactions", body, headers)
		}()
	}
	wait.Wait()
	close(responses)
	replayed := 0
	for response := range responses {
		if response.Code != http.StatusOK {
			t.Fatalf("concurrent response = %d %s", response.Code, response.Body.String())
		}
		if response.Header().Get("Idempotency-Replayed") == "true" {
			replayed++
		}
	}
	if calls.Load() != 1 || replayed != 1 {
		t.Fatalf("Turnstile calls=%d replayed=%d", calls.Load(), replayed)
	}
}

func TestAPIGitHubWebhookSignatureAllowlistAndDedupe(t *testing.T) {
	api, _ := testAPI(t, nil)
	api.github.token = "test-token"
	handler := api.Handler()
	payload := []byte(`{"ref":"refs/heads/main","compare":"https://github.com/beforeugone/site/compare/a...b","repository":{"full_name":"beforeugone/site"},"commits":[{"message":"feat: add activity"},{"message":"fix: align contribution weeks"}],"head_commit":{"message":"fix: align contribution weeks","url":"https://github.com/beforeugone/site/commit/b","timestamp":"2026-07-12T10:00:00Z"}}`)
	signature := githubSignature(payload, "github-secret")
	send := func(delivery, sig string, body []byte) *httptest.ResponseRecorder {
		req := httptest.NewRequest(http.MethodPost, "/v1/webhooks/github", bytes.NewReader(body))
		req.Header.Set("X-GitHub-Event", "push")
		req.Header.Set("X-GitHub-Delivery", delivery)
		req.Header.Set("X-Hub-Signature-256", sig)
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, req)
		return response
	}
	invalid := send("delivery-0001", "sha256=bad", payload)
	if invalid.Code != http.StatusUnauthorized {
		t.Fatalf("invalid signature = %d %s", invalid.Code, invalid.Body.String())
	}
	accepted := send("delivery-0001", signature, payload)
	if accepted.Code != http.StatusAccepted || !strings.Contains(accepted.Body.String(), `"accepted":true`) {
		t.Fatalf("accepted = %d %s", accepted.Code, accepted.Body.String())
	}
	select {
	case <-api.github.trigger:
	default:
		t.Fatal("accepted webhook did not signal GitHub activity refresh")
	}
	replay := send("delivery-0001", signature, payload)
	if replay.Code != http.StatusAccepted || replay.Header().Get("Idempotency-Replayed") != "true" || !strings.Contains(replay.Body.String(), `"accepted":false`) {
		t.Fatalf("replay = %d headers=%v body=%s", replay.Code, replay.Header(), replay.Body.String())
	}
	select {
	case <-api.github.trigger:
		t.Fatal("replayed webhook signaled GitHub activity refresh")
	default:
	}
	ships := requestJSON(t, handler, http.MethodGet, "/v1/public/ship", nil, nil)
	if ships.Code != http.StatusOK || strings.Count(ships.Body.String(), `"source":"github_push"`) != 1 ||
		strings.Contains(ships.Body.String(), "Pushed 2 commits") || !strings.Contains(ships.Body.String(), "2 个提交一起落地") {
		t.Fatalf("ships = %d %s", ships.Code, ships.Body.String())
	}
	deniedPayload := bytes.ReplaceAll(payload, []byte("beforeugone/site"), []byte("someone/else"))
	denied := send("delivery-0002", githubSignature(deniedPayload, "github-secret"), deniedPayload)
	if denied.Code != http.StatusForbidden {
		t.Fatalf("denied = %d %s", denied.Code, denied.Body.String())
	}
}

func TestAPIStaticPreviewAndBodyLimits(t *testing.T) {
	staticDir := t.TempDir()
	if err := os.WriteFile(filepath.Join(staticDir, "index.html"), []byte("preview home"), 0o600); err != nil {
		t.Fatal(err)
	}
	api, _ := testAPI(t, func(cfg *Config) {
		cfg.StaticDir = staticDir
		cfg.MaxRequestBodyBytes = 64
	})
	handler := api.Handler()
	preview := requestJSON(t, handler, http.MethodGet, "/", nil, nil)
	if preview.Code != http.StatusOK || preview.Body.String() != "preview home" {
		t.Fatalf("preview = %d %q", preview.Code, preview.Body.String())
	}
	tooLarge := requestJSON(t, handler, http.MethodPost, "/v1/public/guestbook", map[string]string{
		"message": strings.Repeat("x", 100), "visitor_token": "visitor-token-123456",
	}, map[string]string{"Idempotency-Key": "oversize-key-001"})
	if tooLarge.Code != http.StatusRequestEntityTooLarge {
		t.Fatalf("too large = %d %s", tooLarge.Code, tooLarge.Body.String())
	}
}

func githubSignature(body []byte, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write(body)
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}

func strconv64(value int64) string {
	return strconv.FormatInt(value, 10)
}
