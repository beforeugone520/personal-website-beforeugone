package main

import (
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"mime"
	"net"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode/utf8"
)

type contextKey string

const requestIDKey contextKey = "request_id"

type API struct {
	cfg         Config
	store       *Store
	logger      *slog.Logger
	turnstile   *TurnstileVerifier
	github      *githubActivityRefresher
	rateLimiter *writeRateLimiter
	cors        map[string]struct{}
	static      http.Handler
	keyLocksMu  sync.Mutex
	keyLocks    map[string]*idempotencyLock
}

type errorEnvelope struct {
	Error     errorBody `json:"error"`
	RequestID string    `json:"request_id"`
}

type errorBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func newAPI(cfg Config, store *Store, logger *slog.Logger) *API {
	if logger == nil {
		logger = slog.New(slog.NewTextHandler(io.Discard, nil))
	}
	api := &API{
		cfg:         cfg,
		store:       store,
		logger:      logger,
		turnstile:   NewTurnstileVerifier(cfg.TurnstileSecret, cfg.TurnstileVerifyURL, cfg.TurnstileHostnames, nil),
		github:      newGitHubActivityRefresher(cfg, store, logger),
		rateLimiter: newWriteRateLimiter(cfg.PublicWriteLimit, cfg.PublicWriteWindow),
		cors:        stringSet(cfg.CORSAllowedOrigins),
		keyLocks:    make(map[string]*idempotencyLock),
	}
	if cfg.StaticDir != "" {
		api.static = http.FileServer(http.Dir(cfg.StaticDir))
	}
	return api
}

func (a *API) Handler() http.Handler {
	return a.requestIDMiddleware(a.recoverMiddleware(a.corsMiddleware(http.HandlerFunc(a.route))))
}

func (a *API) route(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-Content-Type-Options", "nosniff")
	if r.Method != http.MethodGet && r.Method != http.MethodHead && r.Method != http.MethodOptions {
		w.Header().Set("Cache-Control", "no-store")
	}
	switch r.URL.Path {
	case "/healthz":
		if !methodIs(w, r, http.MethodGet) {
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
		return
	case "/readyz":
		if !methodIs(w, r, http.MethodGet) {
			return
		}
		ctx, cancel := context.WithTimeout(r.Context(), time.Second)
		defer cancel()
		if err := a.store.Ready(ctx); err != nil {
			a.writeError(w, r, http.StatusServiceUnavailable, "not_ready", "database is unavailable")
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "ready"})
		return
	case "/v1/public/now":
		a.handlePublicNow(w, r)
		return
	case "/v1/public/ship":
		a.handlePublicShip(w, r)
		return
	case "/v1/public/github":
		a.handlePublicGitHub(w, r)
		return
	case "/v1/public/guestbook":
		if r.Method == http.MethodGet {
			a.handlePublicGuestbook(w, r)
		} else if r.Method == http.MethodPost {
			a.handleCreateGuestbook(w, r)
		} else {
			methodNotAllowed(w)
		}
		return
	case "/v1/public/reactions":
		if r.Method == http.MethodGet {
			a.handleReactionCounts(w, r)
		} else if r.Method == http.MethodPost {
			a.handleReaction(w, r)
		} else {
			methodNotAllowed(w)
		}
		return
	case "/v1/admin/now":
		if !a.requireAdmin(w, r) {
			return
		}
		a.handleAdminNow(w, r)
		return
	case "/v1/admin/ship":
		if !a.requireAdmin(w, r) {
			return
		}
		a.handleCreateShip(w, r)
		return
	case "/v1/admin/guestbook":
		if !a.requireAdmin(w, r) {
			return
		}
		a.handleAdminGuestbookList(w, r)
		return
	case "/v1/webhooks/github":
		a.handleGitHubWebhook(w, r)
		return
	}
	if strings.HasPrefix(r.URL.Path, "/v1/admin/ship/") {
		if !a.requireAdmin(w, r) {
			return
		}
		a.handleAdminShipItem(w, r)
		return
	}
	if strings.HasPrefix(r.URL.Path, "/v1/admin/guestbook/") {
		if !a.requireAdmin(w, r) {
			return
		}
		a.handleAdminGuestbookItem(w, r)
		return
	}
	if strings.HasPrefix(r.URL.Path, "/v1/") {
		a.writeError(w, r, http.StatusNotFound, "not_found", "route not found")
		return
	}
	if a.static != nil && (r.Method == http.MethodGet || r.Method == http.MethodHead) {
		a.static.ServeHTTP(w, r)
		return
	}
	a.writeError(w, r, http.StatusNotFound, "not_found", "route not found")
}

func (a *API) handlePublicGitHub(w http.ResponseWriter, r *http.Request) {
	if !methodIs(w, r, http.MethodGet) {
		return
	}
	snapshot, err := a.store.GitHubActivity(r.Context())
	if err != nil {
		a.internalError(w, r, err)
		return
	}
	if snapshot == nil || !strings.EqualFold(snapshot.Username, a.cfg.GitHubUsername) {
		w.Header().Set("Cache-Control", "no-store")
		a.writeError(w, r, http.StatusServiceUnavailable, "github_unavailable", "GitHub activity is not available yet")
		return
	}
	w.Header().Set("Cache-Control", "public, max-age=300, stale-while-revalidate=3600")
	writeJSON(w, http.StatusOK, map[string]any{"data": snapshot})
}

func (a *API) handlePublicNow(w http.ResponseWriter, r *http.Request) {
	if !methodIs(w, r, http.MethodGet) {
		return
	}
	item, err := a.store.PublicNow(r.Context())
	if err != nil {
		a.internalError(w, r, err)
		return
	}
	w.Header().Set("Cache-Control", "public, max-age=30")
	writeJSON(w, http.StatusOK, map[string]any{"data": item})
}

func (a *API) handlePublicShip(w http.ResponseWriter, r *http.Request) {
	if !methodIs(w, r, http.MethodGet) {
		return
	}
	limit, ok := a.parseLimit(w, r, 10)
	if !ok {
		return
	}
	items, next, err := a.store.PublicShip(r.Context(), limit, r.URL.Query().Get("cursor"))
	if err != nil {
		if strings.Contains(err.Error(), "invalid cursor") {
			a.writeError(w, r, http.StatusBadRequest, "invalid_cursor", "cursor is invalid")
		} else {
			a.internalError(w, r, err)
		}
		return
	}
	w.Header().Set("Cache-Control", "public, max-age=60")
	writeJSON(w, http.StatusOK, map[string]any{"items": items, "next_cursor": next})
}

func (a *API) handlePublicGuestbook(w http.ResponseWriter, r *http.Request) {
	limit, ok := a.parseLimit(w, r, 20)
	if !ok {
		return
	}
	items, next, err := a.store.PublicGuestbook(r.Context(), limit, r.URL.Query().Get("cursor"))
	if err != nil {
		if strings.Contains(err.Error(), "invalid cursor") {
			a.writeError(w, r, http.StatusBadRequest, "invalid_cursor", "cursor is invalid")
		} else {
			a.internalError(w, r, err)
		}
		return
	}
	w.Header().Set("Cache-Control", "public, max-age=30")
	writeJSON(w, http.StatusOK, map[string]any{"items": items, "next_cursor": next})
}

type createGuestbookRequest struct {
	Nickname       string `json:"nickname"`
	Message        string `json:"message"`
	VisitorToken   string `json:"visitor_token"`
	TurnstileToken string `json:"turnstile_token"`
	Website        string `json:"website"`
}

func (a *API) handleCreateGuestbook(w http.ResponseWriter, r *http.Request) {
	key, ok := a.idempotencyKey(w, r)
	if !ok {
		return
	}
	var input createGuestbookRequest
	if err := a.decodeJSON(w, r, &input); err != nil {
		return
	}
	input.Nickname = strings.TrimSpace(input.Nickname)
	input.Message = strings.TrimSpace(input.Message)
	if input.Website != "" {
		a.writeError(w, r, http.StatusBadRequest, "invalid_request", "request could not be accepted")
		return
	}
	if !runeLength(input.Nickname, 0, 40) || containsControl(input.Nickname) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_nickname", "nickname must be at most 40 characters")
		return
	}
	if !runeLength(input.Message, 10, 280) || containsDisallowedControl(input.Message) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_message", "message must be between 10 and 280 characters")
		return
	}
	if !validVisitorToken(input.VisitorToken) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_visitor_token", "visitor_token must be between 16 and 256 characters")
		return
	}
	hash := requestHash(struct {
		Nickname     string `json:"nickname"`
		Message      string `json:"message"`
		VisitorToken string `json:"visitor_token"`
		Website      string `json:"website"`
	}{input.Nickname, input.Message, input.VisitorToken, input.Website})
	unlock := a.lockIdempotency("/v1/public/guestbook", key)
	defer unlock()
	if a.replayIdempotency(w, r, "/v1/public/guestbook", key, hash) {
		return
	}
	if !a.allowPublicWrite(w, r) {
		return
	}
	if !a.verifyTurnstile(w, r, input.TurnstileToken, "/v1/public/guestbook", key) {
		return
	}
	result, err := a.store.CreateGuestbookIdempotent(r.Context(), "/v1/public/guestbook", key, hash,
		input.Nickname, input.Message, a.visitorHash(input.VisitorToken))
	if err != nil {
		a.handleIdempotencyError(w, r, err)
		return
	}
	writeIdempotent(w, result)
}

func (a *API) handleReactionCounts(w http.ResponseWriter, r *http.Request) {
	pageKey := strings.TrimSpace(r.URL.Query().Get("page_key"))
	if !a.validReactionPage(pageKey) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_page_key", "page_key is not enabled for reactions")
		return
	}
	counts, err := a.store.ReactionCounts(r.Context(), pageKey)
	if err != nil {
		a.internalError(w, r, err)
		return
	}
	w.Header().Set("Cache-Control", "public, max-age=15")
	writeJSON(w, http.StatusOK, map[string]any{"page_key": pageKey, "counts": counts})
}

type reactionRequest struct {
	PageKey        string `json:"page_key"`
	ReactionType   string `json:"reaction_type"`
	VisitorToken   string `json:"visitor_token"`
	TurnstileToken string `json:"turnstile_token"`
}

func (a *API) handleReaction(w http.ResponseWriter, r *http.Request) {
	key, ok := a.idempotencyKey(w, r)
	if !ok {
		return
	}
	var input reactionRequest
	if err := a.decodeJSON(w, r, &input); err != nil {
		return
	}
	input.PageKey = strings.TrimSpace(input.PageKey)
	if !a.validReactionPage(input.PageKey) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_page_key", "page_key is not enabled for reactions")
		return
	}
	if !isReactionType(input.ReactionType) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_reaction_type", "reaction_type is not supported")
		return
	}
	if !validVisitorToken(input.VisitorToken) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_visitor_token", "visitor_token must be between 16 and 256 characters")
		return
	}
	hash := requestHash(struct {
		PageKey      string `json:"page_key"`
		ReactionType string `json:"reaction_type"`
		VisitorToken string `json:"visitor_token"`
	}{input.PageKey, input.ReactionType, input.VisitorToken})
	unlock := a.lockIdempotency("/v1/public/reactions", key)
	defer unlock()
	if a.replayIdempotency(w, r, "/v1/public/reactions", key, hash) {
		return
	}
	if !a.allowPublicWrite(w, r) {
		return
	}
	if !a.verifyTurnstile(w, r, input.TurnstileToken, "/v1/public/reactions", key) {
		return
	}
	result, err := a.store.ReactIdempotent(r.Context(), "/v1/public/reactions", key, hash,
		input.PageKey, input.ReactionType, a.visitorHash(input.VisitorToken))
	if err != nil {
		a.handleIdempotencyError(w, r, err)
		return
	}
	writeIdempotent(w, result)
}

type nowRequest struct {
	Status  string `json:"status"`
	Summary string `json:"summary"`
	Detail  string `json:"detail"`
	LinkURL string `json:"link_url"`
	Visible *bool  `json:"visible"`
}

func (a *API) handleAdminNow(w http.ResponseWriter, r *http.Request) {
	if !methodIs(w, r, http.MethodPut) {
		return
	}
	var input nowRequest
	if err := a.decodeJSON(w, r, &input); err != nil {
		return
	}
	input.Status = strings.TrimSpace(input.Status)
	input.Summary = strings.TrimSpace(input.Summary)
	input.Detail = strings.TrimSpace(input.Detail)
	input.LinkURL = strings.TrimSpace(input.LinkURL)
	if !oneOf(input.Status, "working", "learning", "resting", "paused") {
		a.writeError(w, r, http.StatusBadRequest, "invalid_status", "status must be working, learning, resting, or paused")
		return
	}
	if !runeLength(input.Summary, 1, 160) || !runeLength(input.Detail, 0, 500) || containsDisallowedControl(input.Summary+input.Detail) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_content", "summary or detail is outside its allowed length")
		return
	}
	if input.Visible == nil {
		a.writeError(w, r, http.StatusBadRequest, "invalid_visible", "visible is required")
		return
	}
	if !validOptionalHTTPURL(input.LinkURL) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_link_url", "link_url must be an http or https URL")
		return
	}
	item, err := a.store.PutNow(r.Context(), NowStatus{Status: input.Status, Summary: input.Summary,
		Detail: input.Detail, LinkURL: input.LinkURL, Visible: *input.Visible}, requestID(r.Context()))
	if err != nil {
		a.internalError(w, r, err)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"data": item})
}

type shipRequest struct {
	Title      string `json:"title"`
	Summary    string `json:"summary"`
	URL        string `json:"url"`
	OccurredAt string `json:"occurred_at"`
	Visible    *bool  `json:"visible"`
}

func (a *API) handleCreateShip(w http.ResponseWriter, r *http.Request) {
	if !methodIs(w, r, http.MethodPost) {
		return
	}
	input, ok := a.parseShipRequest(w, r)
	if !ok {
		return
	}
	item, err := a.store.CreateShip(r.Context(), ShipEntry{Title: input.Title, Summary: input.Summary,
		URL: input.URL, Source: "manual", OccurredAt: input.OccurredAt, Visible: *input.Visible}, requestID(r.Context()))
	if err != nil {
		a.internalError(w, r, err)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"data": item})
}

func (a *API) handleAdminShipItem(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/v1/admin/ship/")
	parts := strings.Split(path, "/")
	id, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil || id <= 0 {
		a.writeError(w, r, http.StatusNotFound, "not_found", "ship entry not found")
		return
	}
	if len(parts) == 1 && r.Method == http.MethodPut {
		input, ok := a.parseShipRequest(w, r)
		if !ok {
			return
		}
		item, err := a.store.UpdateShip(r.Context(), id, ShipEntry{Title: input.Title, Summary: input.Summary,
			URL: input.URL, OccurredAt: input.OccurredAt, Visible: *input.Visible}, requestID(r.Context()))
		if err != nil {
			a.handleStoreError(w, r, err, "ship entry")
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"data": item})
		return
	}
	if len(parts) == 2 && parts[1] == "hide" && r.Method == http.MethodPost {
		if err := a.store.HideShip(r.Context(), id, requestID(r.Context())); err != nil {
			a.handleStoreError(w, r, err, "ship entry")
			return
		}
		w.WriteHeader(http.StatusNoContent)
		return
	}
	methodNotAllowed(w)
}

func (a *API) parseShipRequest(w http.ResponseWriter, r *http.Request) (shipRequest, bool) {
	var input shipRequest
	if err := a.decodeJSON(w, r, &input); err != nil {
		return shipRequest{}, false
	}
	input.Title = strings.TrimSpace(input.Title)
	input.Summary = strings.TrimSpace(input.Summary)
	input.URL = strings.TrimSpace(input.URL)
	if !runeLength(input.Title, 1, 120) || !runeLength(input.Summary, 0, 500) || containsDisallowedControl(input.Title+input.Summary) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_content", "title or summary is outside its allowed length")
		return shipRequest{}, false
	}
	if !validOptionalHTTPURL(input.URL) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_url", "url must be an http or https URL")
		return shipRequest{}, false
	}
	if input.OccurredAt == "" {
		input.OccurredAt = timestamp(time.Now())
	} else if parsed, err := time.Parse(time.RFC3339, input.OccurredAt); err != nil {
		a.writeError(w, r, http.StatusBadRequest, "invalid_occurred_at", "occurred_at must use RFC3339")
		return shipRequest{}, false
	} else {
		input.OccurredAt = timestamp(parsed)
	}
	if input.Visible == nil {
		value := true
		input.Visible = &value
	}
	return input, true
}

func (a *API) handleAdminGuestbookList(w http.ResponseWriter, r *http.Request) {
	if !methodIs(w, r, http.MethodGet) {
		return
	}
	status := r.URL.Query().Get("status")
	if status != "" && !oneOf(status, "pending", "approved", "rejected") {
		a.writeError(w, r, http.StatusBadRequest, "invalid_status", "status is invalid")
		return
	}
	limit, ok := a.parseLimit(w, r, 20)
	if !ok {
		return
	}
	items, next, err := a.store.AdminGuestbook(r.Context(), status, limit, r.URL.Query().Get("cursor"))
	if err != nil {
		if strings.Contains(err.Error(), "invalid cursor") {
			a.writeError(w, r, http.StatusBadRequest, "invalid_cursor", "cursor is invalid")
		} else {
			a.internalError(w, r, err)
		}
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"items": items, "next_cursor": next})
}

type replyRequest struct {
	Reply string `json:"reply"`
}

func (a *API) handleAdminGuestbookItem(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/v1/admin/guestbook/")
	parts := strings.Split(path, "/")
	if len(parts) != 2 || r.Method != http.MethodPost {
		methodNotAllowed(w)
		return
	}
	id, err := strconv.ParseInt(parts[0], 10, 64)
	if err != nil || id <= 0 {
		a.writeError(w, r, http.StatusNotFound, "not_found", "guestbook entry not found")
		return
	}
	var item GuestbookEntry
	switch parts[1] {
	case "approve", "reject":
		status := strings.TrimSuffix(parts[1], "e") + "ed"
		if parts[1] == "approve" {
			status = "approved"
		}
		item, err = a.store.ModerateGuestbook(r.Context(), id, status, requestID(r.Context()))
	case "reply":
		var input replyRequest
		if decodeErr := a.decodeJSON(w, r, &input); decodeErr != nil {
			return
		}
		input.Reply = strings.TrimSpace(input.Reply)
		if !runeLength(input.Reply, 1, 500) || containsDisallowedControl(input.Reply) {
			a.writeError(w, r, http.StatusBadRequest, "invalid_reply", "reply must be between 1 and 500 characters")
			return
		}
		item, err = a.store.ReplyGuestbook(r.Context(), id, input.Reply, requestID(r.Context()))
	default:
		a.writeError(w, r, http.StatusNotFound, "not_found", "route not found")
		return
	}
	if err != nil {
		a.handleStoreError(w, r, err, "guestbook entry")
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"data": item})
}

func (a *API) parseLimit(w http.ResponseWriter, r *http.Request, fallback int) (int, bool) {
	value := r.URL.Query().Get("limit")
	if value == "" {
		return fallback, true
	}
	limit, err := strconv.Atoi(value)
	if err != nil || limit < 1 || limit > 50 {
		a.writeError(w, r, http.StatusBadRequest, "invalid_limit", "limit must be between 1 and 50")
		return 0, false
	}
	return limit, true
}

func (a *API) requireAdmin(w http.ResponseWriter, r *http.Request) bool {
	if a.cfg.AdminToken == "" {
		a.writeError(w, r, http.StatusServiceUnavailable, "admin_disabled", "admin API is not configured")
		return false
	}
	const prefix = "Bearer "
	header := r.Header.Get("Authorization")
	if !strings.HasPrefix(header, prefix) || !secureEqual(strings.TrimPrefix(header, prefix), a.cfg.AdminToken) {
		w.Header().Set("WWW-Authenticate", "Bearer")
		a.writeError(w, r, http.StatusUnauthorized, "unauthorized", "valid administrator credentials are required")
		return false
	}
	return true
}

func secureEqual(got, want string) bool {
	gotHash := sha256.Sum256([]byte(got))
	wantHash := sha256.Sum256([]byte(want))
	return subtle.ConstantTimeCompare(gotHash[:], wantHash[:]) == 1
}

func (a *API) idempotencyKey(w http.ResponseWriter, r *http.Request) (string, bool) {
	key := r.Header.Get("Idempotency-Key")
	if len(key) < 8 || len(key) > 128 {
		a.writeError(w, r, http.StatusBadRequest, "invalid_idempotency_key", "Idempotency-Key must be between 8 and 128 characters")
		return "", false
	}
	for _, ch := range key {
		if !(ch >= 'a' && ch <= 'z') && !(ch >= 'A' && ch <= 'Z') && !(ch >= '0' && ch <= '9') && !strings.ContainsRune("._:-", ch) {
			a.writeError(w, r, http.StatusBadRequest, "invalid_idempotency_key", "Idempotency-Key contains unsupported characters")
			return "", false
		}
	}
	return key, true
}

func (a *API) replayIdempotency(w http.ResponseWriter, r *http.Request, endpoint, key, hash string) bool {
	record, err := a.store.GetIdempotency(r.Context(), endpoint, key, hash)
	if errors.Is(err, errIdempotencyConflict) {
		a.writeError(w, r, http.StatusConflict, "idempotency_conflict", err.Error())
		return true
	}
	if err != nil {
		a.internalError(w, r, err)
		return true
	}
	if record == nil {
		return false
	}
	w.Header().Set("Idempotency-Replayed", "true")
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(record.Status)
	_, _ = w.Write(record.Body)
	return true
}

func (a *API) handleIdempotencyError(w http.ResponseWriter, r *http.Request, err error) {
	if errors.Is(err, errIdempotencyConflict) {
		a.writeError(w, r, http.StatusConflict, "idempotency_conflict", err.Error())
		return
	}
	a.internalError(w, r, err)
}

func writeIdempotent(w http.ResponseWriter, result IdempotentResult) {
	if result.Replayed {
		w.Header().Set("Idempotency-Replayed", "true")
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(result.Status)
	_, _ = w.Write(result.Body)
}

func requestHash(value any) string {
	encoded, _ := json.Marshal(value)
	sum := sha256.Sum256(encoded)
	return hex.EncodeToString(sum[:])
}

func (a *API) visitorHash(token string) string {
	mac := hmac.New(sha256.New, []byte(a.cfg.AnonymizationSecret))
	_, _ = mac.Write([]byte(token))
	return hex.EncodeToString(mac.Sum(nil))
}

func (a *API) decodeJSON(w http.ResponseWriter, r *http.Request, target any) error {
	if mediaType, _, err := mime.ParseMediaType(r.Header.Get("Content-Type")); err != nil || mediaType != "application/json" {
		a.writeError(w, r, http.StatusUnsupportedMediaType, "unsupported_media_type", "Content-Type must be application/json")
		return errors.New("invalid content type")
	}
	r.Body = http.MaxBytesReader(w, r.Body, a.cfg.MaxRequestBodyBytes)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(target); err != nil {
		var maxErr *http.MaxBytesError
		if errors.As(err, &maxErr) {
			a.writeError(w, r, http.StatusRequestEntityTooLarge, "body_too_large", "request body is too large")
		} else {
			a.writeError(w, r, http.StatusBadRequest, "invalid_json", "request body must be one valid JSON object")
		}
		return err
	}
	if err := decoder.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_json", "request body must contain one JSON object")
		return errors.New("multiple JSON values")
	}
	return nil
}

func (a *API) allowPublicWrite(w http.ResponseWriter, r *http.Request) bool {
	if a.cfg.TurnstileSecret == "" && !a.cfg.AllowInsecureWrites {
		a.writeError(w, r, http.StatusServiceUnavailable, "public_writes_disabled", "public writes are not configured")
		return false
	}
	allowed, retry := a.rateLimiter.Allow(a.clientIP(r), time.Now())
	if allowed {
		return true
	}
	w.Header().Set("Retry-After", strconv.Itoa(max(1, int(retry.Seconds()+0.5))))
	a.writeError(w, r, http.StatusTooManyRequests, "rate_limited", "too many write requests; try again later")
	return false
}

func (a *API) verifyTurnstile(w http.ResponseWriter, r *http.Request, token, endpoint, key string) bool {
	err := a.turnstile.Verify(r.Context(), token, a.clientIP(r), turnstileIdempotencyKey(endpoint, key))
	if err == nil {
		return true
	}
	if errors.Is(err, errTurnstileFailed) {
		a.writeError(w, r, http.StatusBadRequest, "turnstile_failed", "human verification failed")
		return false
	}
	a.logger.Warn("Turnstile verification unavailable", "request_id", requestID(r.Context()), "error", err)
	a.writeError(w, r, http.StatusServiceUnavailable, "turnstile_unavailable", "human verification is temporarily unavailable")
	return false
}

func turnstileIdempotencyKey(endpoint, key string) string {
	sum := sha256.Sum256([]byte(endpoint + "\x00" + key))
	value := sum[:16]
	value[6] = (value[6] & 0x0f) | 0x40
	value[8] = (value[8] & 0x3f) | 0x80
	encoded := hex.EncodeToString(value)
	return encoded[:8] + "-" + encoded[8:12] + "-" + encoded[12:16] + "-" + encoded[16:20] + "-" + encoded[20:]
}

func (a *API) clientIP(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		host = r.RemoteAddr
	}
	remoteIP := net.ParseIP(host)
	if a.cfg.TrustedProxyHeader && remoteIP != nil && remoteIP.IsLoopback() {
		if value := net.ParseIP(strings.TrimSpace(r.Header.Get("X-BeforeU-Client-IP"))); value != nil {
			return value.String()
		}
	}
	return host
}

func (a *API) requestIDMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.Header.Get("X-Request-ID")
		if len(id) < 8 || len(id) > 128 || containsControl(id) {
			bytes := make([]byte, 16)
			if _, err := rand.Read(bytes); err != nil {
				id = strconv.FormatInt(time.Now().UnixNano(), 36)
			} else {
				id = hex.EncodeToString(bytes)
			}
		}
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), requestIDKey, id)))
	})
}

func (a *API) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Origin")
		origin := r.Header.Get("Origin")
		if origin != "" {
			if _, ok := a.cors[origin]; !ok {
				a.writeError(w, r, http.StatusForbidden, "origin_not_allowed", "request origin is not allowed")
				return
			}
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Idempotency-Key, X-Request-ID, Authorization")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
			w.Header().Set("Access-Control-Expose-Headers", "X-Request-ID, Idempotency-Replayed, Retry-After")
			w.Header().Set("Access-Control-Max-Age", "600")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (a *API) recoverMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if recovered := recover(); recovered != nil {
				a.logger.Error("panic serving request", "request_id", requestID(r.Context()), "panic", recovered)
				a.writeError(w, r, http.StatusInternalServerError, "internal_error", "an internal error occurred")
			}
		}()
		next.ServeHTTP(w, r)
	})
}

func (a *API) writeError(w http.ResponseWriter, r *http.Request, status int, code, message string) {
	writeJSON(w, status, errorEnvelope{Error: errorBody{Code: code, Message: message}, RequestID: requestID(r.Context())})
}

func (a *API) internalError(w http.ResponseWriter, r *http.Request, err error) {
	a.logger.Error("request failed", "request_id", requestID(r.Context()), "method", r.Method, "path", r.URL.Path, "error", err)
	a.writeError(w, r, http.StatusInternalServerError, "internal_error", "an internal error occurred")
}

func (a *API) handleStoreError(w http.ResponseWriter, r *http.Request, err error, resource string) {
	if errors.Is(err, errNotFound) {
		a.writeError(w, r, http.StatusNotFound, "not_found", resource+" not found")
		return
	}
	a.internalError(w, r, err)
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func methodIs(w http.ResponseWriter, r *http.Request, method string) bool {
	if r.Method != method {
		methodNotAllowed(w)
		return false
	}
	return true
}

func methodNotAllowed(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(http.StatusMethodNotAllowed)
	_, _ = w.Write([]byte(`{"error":{"code":"method_not_allowed","message":"method not allowed"}}`))
}

func requestID(ctx context.Context) string {
	value, _ := ctx.Value(requestIDKey).(string)
	return value
}

func validOptionalHTTPURL(value string) bool {
	if value == "" {
		return true
	}
	if utf8.RuneCountInString(value) > 500 {
		return false
	}
	parsed, err := url.ParseRequestURI(value)
	return err == nil && (parsed.Scheme == "http" || parsed.Scheme == "https") && parsed.Host != ""
}

func validPageKey(value string) bool {
	if !runeLength(value, 1, 200) || containsControl(value) || !strings.HasPrefix(value, "/") {
		return false
	}
	if value != path.Clean(value) || strings.Contains(value, "//") {
		return false
	}
	if value != "/" && !strings.HasSuffix(value, ".html") {
		return false
	}
	for _, r := range value {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || strings.ContainsRune("/._-", r) {
			continue
		}
		return false
	}
	return true
}

func (a *API) validReactionPage(value string) bool {
	if !validPageKey(value) {
		return false
	}
	_, ok := a.cfg.ReactionPageKeys[value]
	return ok
}

func validVisitorToken(value string) bool {
	return len(value) >= 16 && len(value) <= 256 && !containsControl(value)
}

func runeLength(value string, minLength, maxLength int) bool {
	if !utf8.ValidString(value) {
		return false
	}
	length := utf8.RuneCountInString(value)
	return length >= minLength && length <= maxLength
}

func containsControl(value string) bool {
	for _, r := range value {
		if r < 0x20 || r == 0x7f {
			return true
		}
	}
	return false
}

func containsDisallowedControl(value string) bool {
	for _, r := range value {
		if (r < 0x20 && r != '\n' && r != '\t' && r != '\r') || r == 0x7f {
			return true
		}
	}
	return false
}

func oneOf(value string, choices ...string) bool {
	for _, choice := range choices {
		if value == choice {
			return true
		}
	}
	return false
}

func isReactionType(value string) bool { return oneOf(value, reactionTypes...) }

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

type idempotencyLock struct {
	mu   sync.Mutex
	refs int
}

func (a *API) lockIdempotency(endpoint, key string) func() {
	lockKey := endpoint + "\x00" + key
	a.keyLocksMu.Lock()
	entry := a.keyLocks[lockKey]
	if entry == nil {
		entry = &idempotencyLock{}
		a.keyLocks[lockKey] = entry
	}
	entry.refs++
	a.keyLocksMu.Unlock()

	entry.mu.Lock()
	return func() {
		entry.mu.Unlock()
		a.keyLocksMu.Lock()
		entry.refs--
		if entry.refs == 0 {
			delete(a.keyLocks, lockKey)
		}
		a.keyLocksMu.Unlock()
	}
}

type writeRateLimiter struct {
	mu      sync.Mutex
	limit   int
	window  time.Duration
	clients map[string]rateWindow
	calls   uint64
}

type rateWindow struct {
	started time.Time
	count   int
}

func newWriteRateLimiter(limit int, window time.Duration) *writeRateLimiter {
	return &writeRateLimiter{limit: limit, window: window, clients: make(map[string]rateWindow)}
}

func (l *writeRateLimiter) Allow(key string, now time.Time) (bool, time.Duration) {
	l.mu.Lock()
	defer l.mu.Unlock()
	l.calls++
	if l.calls%256 == 0 {
		for client, entry := range l.clients {
			if now.Sub(entry.started) >= l.window*2 {
				delete(l.clients, client)
			}
		}
	}
	entry := l.clients[key]
	if entry.started.IsZero() || now.Sub(entry.started) >= l.window {
		l.clients[key] = rateWindow{started: now, count: 1}
		return true, 0
	}
	if entry.count >= l.limit {
		return false, l.window - now.Sub(entry.started)
	}
	entry.count++
	l.clients[key] = entry
	return true, 0
}

func ensureStaticDir(path string) error {
	if path == "" {
		return nil
	}
	info, err := os.Stat(filepath.Clean(path))
	if err != nil {
		return fmt.Errorf("STATIC_DIR: %w", err)
	}
	if !info.IsDir() {
		return fmt.Errorf("STATIC_DIR must point to a directory")
	}
	return nil
}
