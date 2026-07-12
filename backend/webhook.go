package main

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type githubRepository struct {
	FullName string `json:"full_name"`
}

type githubPushPayload struct {
	Ref        string           `json:"ref"`
	Compare    string           `json:"compare"`
	Repository githubRepository `json:"repository"`
	Commits    []struct {
		Message string `json:"message"`
	} `json:"commits"`
	HeadCommit *struct {
		Message   string `json:"message"`
		URL       string `json:"url"`
		Timestamp string `json:"timestamp"`
	} `json:"head_commit"`
}

type githubReleasePayload struct {
	Action     string           `json:"action"`
	Repository githubRepository `json:"repository"`
	Release    struct {
		TagName     string `json:"tag_name"`
		Name        string `json:"name"`
		Body        string `json:"body"`
		HTMLURL     string `json:"html_url"`
		PublishedAt string `json:"published_at"`
	} `json:"release"`
}

func (a *API) handleGitHubWebhook(w http.ResponseWriter, r *http.Request) {
	if !methodIs(w, r, http.MethodPost) {
		return
	}
	if a.cfg.GitHubWebhookSecret == "" || len(a.cfg.GitHubAllowedRepos) == 0 {
		a.writeError(w, r, http.StatusServiceUnavailable, "webhook_disabled", "GitHub webhook is not configured")
		return
	}
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	body, err := io.ReadAll(r.Body)
	if err != nil {
		var maxErr *http.MaxBytesError
		if errors.As(err, &maxErr) {
			a.writeError(w, r, http.StatusRequestEntityTooLarge, "body_too_large", "webhook body is too large")
		} else {
			a.writeError(w, r, http.StatusBadRequest, "invalid_body", "webhook body could not be read")
		}
		return
	}
	if !validGitHubSignature(body, r.Header.Get("X-Hub-Signature-256"), a.cfg.GitHubWebhookSecret) {
		a.writeError(w, r, http.StatusUnauthorized, "invalid_signature", "webhook signature is invalid")
		return
	}
	deliveryID := r.Header.Get("X-GitHub-Delivery")
	if len(deliveryID) < 8 || len(deliveryID) > 128 || containsControl(deliveryID) {
		a.writeError(w, r, http.StatusBadRequest, "invalid_delivery", "X-GitHub-Delivery is required")
		return
	}
	event := r.Header.Get("X-GitHub-Event")
	if event == "ping" {
		writeJSON(w, http.StatusOK, map[string]bool{"pong": true})
		return
	}
	var repository string
	var ship *ShipEntry
	switch event {
	case "push":
		var payload githubPushPayload
		if err := json.Unmarshal(body, &payload); err != nil {
			a.writeError(w, r, http.StatusBadRequest, "invalid_payload", "GitHub push payload is invalid")
			return
		}
		repository = payload.Repository.FullName
		if len(payload.Commits) > 0 {
			branch := strings.TrimPrefix(payload.Ref, "refs/heads/")
			title := fmt.Sprintf("Pushed %d commit", len(payload.Commits))
			if len(payload.Commits) != 1 {
				title += "s"
			}
			title += " to " + repository
			if branch != "" {
				title += "/" + branch
			}
			summary, link, occurredAt := payload.Commits[len(payload.Commits)-1].Message, payload.Compare, timestamp(a.store.now())
			if payload.HeadCommit != nil {
				summary = payload.HeadCommit.Message
				if payload.HeadCommit.URL != "" {
					link = payload.HeadCommit.URL
				}
				if parsed, parseErr := time.Parse(time.RFC3339, payload.HeadCommit.Timestamp); parseErr == nil {
					occurredAt = timestamp(parsed)
				}
			}
			ship = &ShipEntry{Title: truncateRunes(title, 120), Summary: truncateRunes(firstLine(summary), 500),
				URL: link, Source: "github_push", Repository: repository, OccurredAt: occurredAt, Visible: true}
		}
	case "release":
		var payload githubReleasePayload
		if err := json.Unmarshal(body, &payload); err != nil {
			a.writeError(w, r, http.StatusBadRequest, "invalid_payload", "GitHub release payload is invalid")
			return
		}
		repository = payload.Repository.FullName
		if payload.Action == "published" {
			name := payload.Release.Name
			if name == "" {
				name = payload.Release.TagName
			}
			occurredAt := timestamp(a.store.now())
			if parsed, parseErr := time.Parse(time.RFC3339, payload.Release.PublishedAt); parseErr == nil {
				occurredAt = timestamp(parsed)
			}
			ship = &ShipEntry{Title: truncateRunes("Released "+name, 120), Summary: truncateRunes(firstLine(payload.Release.Body), 500),
				URL: payload.Release.HTMLURL, Source: "github_release", Repository: repository, OccurredAt: occurredAt, Visible: true}
		}
	default:
		a.writeError(w, r, http.StatusBadRequest, "unsupported_event", "GitHub event is not supported")
		return
	}
	if _, allowed := a.cfg.GitHubAllowedRepos[repository]; !allowed {
		a.writeError(w, r, http.StatusForbidden, "repository_not_allowed", "repository is not allowed")
		return
	}
	accepted, replayed, err := a.store.ProcessGitHubDelivery(r.Context(), deliveryID, event, repository, ship)
	if err != nil {
		a.internalError(w, r, err)
		return
	}
	if replayed {
		w.Header().Set("Idempotency-Replayed", "true")
	}
	writeJSON(w, http.StatusAccepted, map[string]bool{"accepted": accepted})
}

func validGitHubSignature(body []byte, signature, secret string) bool {
	const prefix = "sha256="
	if !strings.HasPrefix(signature, prefix) {
		return false
	}
	provided, err := hex.DecodeString(strings.TrimPrefix(signature, prefix))
	if err != nil {
		return false
	}
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write(body)
	return hmac.Equal(provided, mac.Sum(nil))
}

func (s *Store) ProcessGitHubDelivery(ctx context.Context, deliveryID, event, repository string, ship *ShipEntry) (accepted, replayed bool, err error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return false, false, err
	}
	defer tx.Rollback()
	now := timestamp(s.now())
	result, err := tx.ExecContext(ctx, `INSERT OR IGNORE INTO github_deliveries
		(delivery_id, event_type, repository, received_at) VALUES (?, ?, ?, ?)`, deliveryID, event, repository, now)
	if err != nil {
		return false, false, err
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return false, true, nil
	}
	if ship != nil {
		ship.CreatedAt, ship.UpdatedAt = now, now
		result, err = tx.ExecContext(ctx, `INSERT INTO ship_entries
			(title, summary, url, source, repository, external_id, occurred_at, visible, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`, ship.Title, ship.Summary, ship.URL, ship.Source,
			ship.Repository, deliveryID, ship.OccurredAt, now, now)
		if err != nil {
			return false, false, err
		}
		ship.ID, err = result.LastInsertId()
		if err != nil {
			return false, false, err
		}
		if _, err = tx.ExecContext(ctx, `INSERT INTO audit_log
			(action, target_type, target_id, detail, created_at) VALUES (?, 'ship', ?, ?, ?)`,
			"webhook."+event, strconv.FormatInt(ship.ID, 10), repository, now); err != nil {
			return false, false, err
		}
		accepted = true
	}
	if err := tx.Commit(); err != nil {
		return false, false, err
	}
	return accepted, false, nil
}

func firstLine(value string) string {
	value = strings.TrimSpace(value)
	if index := strings.IndexByte(value, '\n'); index >= 0 {
		value = value[:index]
	}
	return strings.TrimSpace(value)
}

func truncateRunes(value string, limit int) string {
	runes := []rune(value)
	if len(runes) <= limit {
		return value
	}
	return string(runes[:limit])
}
