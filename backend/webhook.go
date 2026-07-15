package main

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"hash/fnv"
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
			messages := make([]string, 0, len(payload.Commits))
			for _, commit := range payload.Commits {
				messages = append(messages, commit.Message)
			}
			headMessage := payload.Commits[len(payload.Commits)-1].Message
			link, occurredAt := payload.Compare, timestamp(a.store.now())
			if payload.HeadCommit != nil {
				headMessage = payload.HeadCommit.Message
				if payload.HeadCommit.URL != "" {
					link = payload.HeadCommit.URL
				}
				if parsed, parseErr := time.Parse(time.RFC3339, payload.HeadCommit.Timestamp); parseErr == nil {
					occurredAt = timestamp(parsed)
				}
			}
			title, summary := githubPushCopy(repository, branch, messages, headMessage, deliveryID)
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
			title, summary := githubReleaseCopy(repository, name, payload.Release.Body, deliveryID)
			ship = &ShipEntry{Title: truncateRunes(title, 120), Summary: truncateRunes(summary, 500),
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
	if accepted {
		a.github.Trigger()
	}
	writeJSON(w, http.StatusAccepted, map[string]bool{"accepted": accepted})
}

var githubCommitKindPriority = map[string]int{
	"feat": 7, "fix": 6, "perf": 5, "refactor": 4, "docs": 3, "test": 2, "chore": 1,
}

func githubPushCopy(repository, branch string, messages []string, headMessage, stableID string) (string, string) {
	label := friendlyRepository(repository)
	kind := ""
	for _, message := range messages {
		candidate, _ := parseCommitSubject(message)
		if githubCommitKindPriority[candidate] > githubCommitKindPriority[kind] {
			kind = candidate
		}
	}
	if headKind, _ := parseCommitSubject(headMessage); kind == "" {
		kind = headKind
	}

	templates := map[string][]string{
		"feat":     {"给%s添了一块新东西", "%s又多了一项新能力"},
		"fix":      {"把%s的一处别扭理顺了", "%s刚绕开了一个小坑"},
		"perf":     {"让%s跑得更轻快了一点", "%s这次少费了一点劲"},
		"refactor": {"把%s里面重新收拾了一遍", "%s的内部结构更顺了"},
		"docs":     {"把%s的说明补清楚了", "%s的说明又清楚了一点"},
		"test":     {"给%s多上了一道保险", "%s又经得起折腾了一点"},
		"chore":    {"替%s收了一点尾巴", "%s完成了一轮日常整理"},
	}
	choices := templates[kind]
	if len(choices) == 0 {
		choices = []string{"%s又往前走了一点", "%s今天也有新进展"}
	}
	title := fmt.Sprintf(stableStringChoice(choices, stableID+repository), label)

	_, subject := parseCommitSubject(headMessage)
	if subject == "" {
		_, subject = parseCommitSubject(messages[len(messages)-1])
	}
	if subject == "" {
		if branch == "" {
			branch = "默认"
		}
		subject = fmt.Sprintf("%d 个提交已经落到 %s 分支。", len(messages), branch)
	} else if len(messages) > 1 {
		subject = fmt.Sprintf("%d 个提交一起落地，最后一笔：%s", len(messages), subject)
	}
	return title, subject
}

func githubReleaseCopy(repository, name, body, stableID string) (string, string) {
	label := friendlyRepository(repository)
	if strings.TrimSpace(name) == "" {
		name = "新版本"
	}
	templates := []string{"%s · %s 正式放出来了", "%s 的 %s 可以用了"}
	title := fmt.Sprintf(stableStringChoice(templates, stableID+repository), label, name)
	return title, firstLine(body)
}

func friendlyRepository(repository string) string {
	name := repository
	if slash := strings.LastIndexByte(name, '/'); slash >= 0 {
		name = name[slash+1:]
	}
	labels := map[string]string{
		"personal-website-beforeugone": "这个站",
		"libghostty-ohos":              "FusionTerm 的终端内核",
		"wand-agent":                   "FusionTerm 的远程后端",
		"BeforeU-open":                 "开卷资料助手",
		"BeforeU-report":               "课程交付助手",
		"CS-AI-bet":                    "Major 情报终端",
		"AI-framecut":                  "AI Framecut",
		"skill-for-work":               "工作流技能集",
	}
	if label := labels[name]; label != "" {
		return label
	}
	if name != "" {
		return name
	}
	return "这个项目"
}

func parseCommitSubject(message string) (string, string) {
	subject := firstLine(message)
	colon := strings.IndexByte(subject, ':')
	if colon <= 0 {
		return "", subject
	}
	prefix := strings.TrimSpace(subject[:colon])
	prefix = strings.TrimSuffix(prefix, "!")
	if scope := strings.IndexByte(prefix, '('); scope >= 0 {
		prefix = prefix[:scope]
	}
	prefix = strings.ToLower(strings.TrimSpace(prefix))
	if _, known := githubCommitKindPriority[prefix]; !known {
		return "", subject
	}
	return prefix, strings.TrimSpace(subject[colon+1:])
}

func stableStringChoice(values []string, key string) string {
	if len(values) == 0 {
		return ""
	}
	hash := fnv.New32a()
	_, _ = hash.Write([]byte(key))
	return values[int(hash.Sum32())%len(values)]
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
