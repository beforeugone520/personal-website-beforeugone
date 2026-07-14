package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync/atomic"
	"testing"
	"time"
)

func TestGitHubActivityClientFetchesPublicSnapshot(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost || r.Header.Get("Authorization") != "Bearer test-token" || r.Header.Get("User-Agent") != "beforeu-api" {
			t.Errorf("request = %s headers=%v", r.Method, r.Header)
		}
		var request struct {
			Query     string            `json:"query"`
			Variables map[string]string `json:"variables"`
		}
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			t.Errorf("decode request: %v", err)
		}
		if request.Variables["login"] != "beforeugone520" || !strings.Contains(request.Query, "privacy: PUBLIC") || !strings.Contains(request.Query, "isFork: false") || !strings.Contains(request.Query, "isArchived: false") {
			t.Errorf("GraphQL request = %#v", request)
		}
		writeJSON(w, http.StatusOK, map[string]any{
			"data": map[string]any{"user": map[string]any{
				"login": "beforeugone520", "url": "https://github.com/beforeugone520",
				"contributionsCollection": map[string]any{"contributionCalendar": map[string]any{
					"totalContributions": 10,
					"weeks":              testGitHubWeeks(),
				}},
				"repositories": map[string]any{"nodes": []any{
					map[string]any{
						"name": "site", "nameWithOwner": "beforeugone520/site", "description": "Personal site",
						"url": "https://github.com/beforeugone520/site", "stargazerCount": 4,
						"pushedAt": "2026-07-13T10:00:00Z", "isArchived": false, "isFork": false, "isPrivate": false,
						"primaryLanguage": map[string]any{"name": "Go", "color": "#00ADD8"},
					},
					map[string]any{"name": "old", "isArchived": true, "isFork": false, "isPrivate": false},
					map[string]any{"name": "fork", "isArchived": false, "isFork": true, "isPrivate": false},
					map[string]any{"name": "private", "isArchived": false, "isFork": false, "isPrivate": true},
				}},
			}},
		})
	}))
	defer upstream.Close()

	client := newGitHubActivityClient("test-token", time.Second)
	client.endpoint = upstream.URL
	snapshot, err := client.Fetch(context.Background(), "beforeugone520")
	if err != nil {
		t.Fatal(err)
	}
	if snapshot.Username != "beforeugone520" || snapshot.ProfileURL != "https://github.com/beforeugone520" || snapshot.TotalContributions != 10 {
		t.Fatalf("snapshot identity = %#v", snapshot)
	}
	if len(snapshot.Contributions) != 365 || snapshot.Contributions[0].Level != 0 || snapshot.Contributions[4].Level != 4 {
		t.Fatalf("contributions = %#v", snapshot.Contributions)
	}
	if len(snapshot.Repositories) != 1 || snapshot.Repositories[0].FullName != "beforeugone520/site" || snapshot.Repositories[0].LanguageColor != "#00ADD8" || snapshot.Repositories[0].Archived {
		t.Fatalf("repositories = %#v", snapshot.Repositories)
	}
}

func TestGitHubActivityClientFetchesTokenlessPublicSnapshot(t *testing.T) {
	var requests atomic.Int32
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requests.Add(1)
		if r.Method != http.MethodGet || r.Header.Get("Authorization") != "" || r.Header.Get("User-Agent") != githubUserAgent {
			t.Errorf("request = %s %s headers=%v", r.Method, r.URL.String(), r.Header)
		}
		switch r.URL.Path {
		case "/users/beforeugone520/repos":
			if r.URL.Query().Get("type") != "owner" || r.URL.Query().Get("sort") != "pushed" ||
				r.URL.Query().Get("direction") != "desc" || r.URL.Query().Get("per_page") != "100" {
				t.Errorf("repository query = %s", r.URL.RawQuery)
			}
			writeJSON(w, http.StatusOK, []any{
				map[string]any{
					"name": "site", "full_name": "beforeugone520/site", "description": "Personal site",
					"html_url": "https://github.com/beforeugone520/site", "language": "Go",
					"stargazers_count": 4, "pushed_at": "2026-07-13T10:00:00Z",
					"archived": false, "fork": false, "private": false,
					"owner": map[string]any{"login": "beforeugone520"},
				},
				map[string]any{
					"name": "older", "full_name": "beforeugone520/older", "description": "Older project",
					"html_url": "https://github.com/beforeugone520/older", "language": "TypeScript",
					"stargazers_count": 2, "pushed_at": "2026-06-01T10:00:00Z",
					"archived": false, "fork": false, "private": false,
					"owner": map[string]any{"login": "beforeugone520"},
				},
				map[string]any{
					"name": "fork", "full_name": "beforeugone520/fork", "html_url": "https://github.com/beforeugone520/fork",
					"archived": false, "fork": true, "private": false,
					"owner": map[string]any{"login": "beforeugone520"},
				},
			})
		case "/users/beforeugone520/contributions":
			if r.Header.Get("Accept-Language") != "en-US" || !strings.Contains(r.Header.Get("Accept"), "text/html") {
				t.Errorf("contributions headers = %v", r.Header)
			}
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			_, _ = io.WriteString(w, testGitHubContributionsHTML("beforeugone520", 365))
		default:
			http.NotFound(w, r)
		}
	}))
	defer upstream.Close()

	client := newGitHubActivityClient("", time.Second)
	client.restEndpoint = upstream.URL
	client.contributionsEndpoint = upstream.URL
	snapshot, err := client.Fetch(context.Background(), "beforeugone520")
	if err != nil {
		t.Fatal(err)
	}
	if requests.Load() != 2 || snapshot.Username != "beforeugone520" || snapshot.TotalContributions != 10 || len(snapshot.Contributions) != 365 {
		t.Fatalf("requests=%d snapshot=%#v", requests.Load(), snapshot)
	}
	if len(snapshot.Repositories) != 2 || snapshot.Repositories[0].FullName != "beforeugone520/site" ||
		snapshot.Repositories[0].LanguageColor != "#00ADD8" || snapshot.Repositories[1].FullName != "beforeugone520/older" {
		t.Fatalf("repositories = %#v", snapshot.Repositories)
	}
}

func TestParseGitHubContributionsRejectsIncompleteOrMismatchedHTML(t *testing.T) {
	valid := testGitHubContributionsHTML("beforeugone520", 365)
	tests := []struct {
		name string
		body string
	}{
		{name: "wrong identity", body: strings.Replace(valid, "/users/beforeugone520/contributions", "/users/someone-else/contributions", 1)},
		{name: "wrong total", body: strings.Replace(valid, "10 contributions in the last year", "11 contributions in the last year", 1)},
		{name: "missing day", body: strings.Replace(valid, `<td id="day-000" class="ContributionCalendar-day" data-date="2025-07-14" data-level="0"></td>`, "", 1)},
		{name: "duplicate date", body: strings.Replace(valid, `data-date="2025-07-15"`, `data-date="2025-07-14"`, 1)},
		{name: "missing tooltip", body: strings.Replace(valid, `<tool-tip for="day-000">No contributions on 2025-07-14</tool-tip>`, "", 1)},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if _, _, err := parseGitHubContributions([]byte(test.body), "beforeugone520"); err == nil {
				t.Fatal("expected invalid contributions HTML error")
			}
		})
	}
}

func TestParseGitHubContributionsAcceptsWeekAlignedRollingRange(t *testing.T) {
	for _, days := range []int{365, 367, 371} {
		t.Run(fmt.Sprintf("%d days", days), func(t *testing.T) {
			contributions, total, err := parseGitHubContributions(
				[]byte(testGitHubContributionsHTML("beforeugone520", days)), "beforeugone520",
			)
			if err != nil {
				t.Fatal(err)
			}
			if len(contributions) != days || total != 10 {
				t.Fatalf("contributions=%d total=%d", len(contributions), total)
			}
		})
	}
}

func TestGitHubActivityRefresherThrottlesTokenlessAttempts(t *testing.T) {
	var requests atomic.Int32
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		requests.Add(1)
		w.WriteHeader(http.StatusServiceUnavailable)
	}))
	defer upstream.Close()

	refresher := newGitHubActivityRefresher(Config{
		GitHubUsername: "beforeugone520", GitHubRefreshInterval: time.Hour, GitHubRequestTimeout: time.Second,
	}, nil, slog.New(slog.NewTextHandler(io.Discard, nil)))
	refresher.client.restEndpoint = upstream.URL
	now := time.Date(2026, 7, 13, 12, 0, 0, 0, time.UTC)
	refresher.now = func() time.Time { return now }

	refresher.refresh(context.Background())
	refresher.refresh(context.Background())
	now = now.Add(githubPublicMinimumRefresh)
	refresher.refresh(context.Background())
	if requests.Load() != 2 {
		t.Fatalf("tokenless refresh requests = %d, want 2", requests.Load())
	}
}

func TestGitHubActivityClientRejectsErrorsAndOversizedResponses(t *testing.T) {
	tests := []struct {
		name    string
		handler http.HandlerFunc
	}{
		{
			name: "GraphQL errors",
			handler: func(w http.ResponseWriter, _ *http.Request) {
				writeJSON(w, http.StatusOK, map[string]any{"errors": []any{map[string]string{"message": "token-value-must-not-escape"}}})
			},
		},
		{
			name: "oversized response",
			handler: func(w http.ResponseWriter, _ *http.Request) {
				w.WriteHeader(http.StatusOK)
				_, _ = io.WriteString(w, strings.Repeat("x", githubResponseLimit+1))
			},
		},
		{
			name: "missing user",
			handler: func(w http.ResponseWriter, _ *http.Request) {
				writeJSON(w, http.StatusOK, map[string]any{"data": map[string]any{"user": nil}})
			},
		},
		{
			name: "private activity scope",
			handler: func(w http.ResponseWriter, _ *http.Request) {
				w.Header().Set("X-OAuth-Scopes", "public_repo, read:user")
				writeJSON(w, http.StatusOK, map[string]any{"data": map[string]any{"user": map[string]any{
					"login": "beforeugone520", "url": "https://github.com/beforeugone520",
					"contributionsCollection": map[string]any{"contributionCalendar": map[string]any{
						"totalContributions": 10, "weeks": testGitHubWeeks(),
					}},
					"repositories": map[string]any{"nodes": []any{}},
				}}})
			},
		},
		{
			name: "incomplete calendar",
			handler: func(w http.ResponseWriter, _ *http.Request) {
				writeJSON(w, http.StatusOK, map[string]any{"data": map[string]any{"user": map[string]any{
					"login": "beforeugone520", "url": "https://github.com/beforeugone520",
				}}})
			},
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			upstream := httptest.NewServer(test.handler)
			defer upstream.Close()
			client := newGitHubActivityClient("test-token", time.Second)
			client.endpoint = upstream.URL
			_, err := client.Fetch(context.Background(), "beforeugone520")
			if err == nil || strings.Contains(err.Error(), "token-value-must-not-escape") || strings.Contains(err.Error(), "test-token") {
				t.Fatalf("error = %v", err)
			}
		})
	}
}

func TestGitHubActivityRefresherKeepsLastGoodSnapshotAndRespondsToTrigger(t *testing.T) {
	store := testStore(t)
	old := GitHubActivitySnapshot{Username: "old", RefreshedAt: "2026-07-12T00:00:00Z"}
	if err := store.PutGitHubActivity(context.Background(), old); err != nil {
		t.Fatal(err)
	}

	responses := make(chan bool, 3)
	requests := make(chan struct{}, 3)
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		requests <- struct{}{}
		success := <-responses
		if !success {
			writeJSON(w, http.StatusOK, map[string]any{"errors": []any{map[string]string{"message": "unavailable"}}})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"data": map[string]any{"user": map[string]any{
			"login": "beforeugone520", "url": "https://github.com/beforeugone520",
			"contributionsCollection": map[string]any{"contributionCalendar": map[string]any{"totalContributions": 10, "weeks": testGitHubWeeks()}},
			"repositories":            map[string]any{"nodes": []any{}},
		}}})
	}))
	defer upstream.Close()

	refresher := newGitHubActivityRefresher(Config{
		GitHubUsername: "beforeugone520", GitHubAPIToken: "test-token",
		GitHubRefreshInterval: time.Hour, GitHubRequestTimeout: time.Second,
	}, store, slog.New(slog.NewTextHandler(io.Discard, nil)))
	refresher.client.endpoint = upstream.URL
	refresher.now = func() time.Time { return time.Date(2026, 7, 13, 12, 0, 0, 0, time.UTC) }

	responses <- false
	refresher.refresh(context.Background())
	<-requests
	got, err := store.GitHubActivity(context.Background())
	if err != nil || got == nil || got.Username != "old" {
		t.Fatalf("last good snapshot = %#v, %v", got, err)
	}

	responses <- true
	ctx, cancel := context.WithCancel(context.Background())
	done := make(chan struct{})
	go func() {
		defer close(done)
		refresher.Run(ctx)
	}()
	select {
	case <-requests:
	case <-time.After(time.Second):
		t.Fatal("initial refresh did not reach upstream")
	}
	waitForGitHubSnapshot(t, store, "beforeugone520")

	responses <- true
	refresher.Trigger()
	select {
	case <-time.After(time.Second):
		t.Fatal("triggered refresh did not reach upstream")
	case <-requests:
	}
	cancel()
	<-done
}

func testGitHubWeeks() []any {
	start := time.Date(2025, 7, 14, 0, 0, 0, 0, time.UTC)
	levels := []string{"NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"}
	weeks := make([]any, 0, 53)
	for offset := 0; offset < 365; {
		days := make([]any, 0, 7)
		for len(days) < 7 && offset < 365 {
			count := 0
			level := "NONE"
			if offset < len(levels) {
				count = offset
				level = levels[offset]
			}
			days = append(days, map[string]any{
				"date":              start.AddDate(0, 0, offset).Format("2006-01-02"),
				"contributionCount": count,
				"contributionLevel": level,
			})
			offset++
		}
		weeks = append(weeks, map[string]any{"contributionDays": days})
	}
	return weeks
}

func testGitHubContributionsHTML(username string, days int) string {
	start := time.Date(2025, 7, 14, 0, 0, 0, 0, time.UTC)
	var cells strings.Builder
	var tooltips strings.Builder
	total := 0
	for offset := 0; offset < days; offset++ {
		date := start.AddDate(0, 0, offset).Format("2006-01-02")
		count := 0
		if offset < 5 {
			count = offset
		}
		level := count
		if level > 4 {
			level = 4
		}
		id := fmt.Sprintf("day-%03d", offset)
		fmt.Fprintf(&cells, `<td id="%s" class="ContributionCalendar-day" data-date="%s" data-level="%d"></td>`, id, date, level)
		switch count {
		case 0:
			fmt.Fprintf(&tooltips, `<tool-tip for="%s">No contributions on %s</tool-tip>`, id, date)
		case 1:
			fmt.Fprintf(&tooltips, `<tool-tip for="%s">1 contribution on %s</tool-tip>`, id, date)
		default:
			fmt.Fprintf(&tooltips, `<tool-tip for="%s">%d contributions on %s</tool-tip>`, id, count, date)
		}
		total += count
	}
	end := start.AddDate(0, 0, days-1).Format("2006-01-02")
	return fmt.Sprintf(`<!doctype html><html><body>
<div class="ContributionCalendar" data-graph-url="/users/%s/contributions" data-url="/%s" data-from="%s 00:00:00 UTC" data-to="%s 00:00:00 UTC">
<table><tbody><tr>%s</tr></tbody></table>%s</div>
<h2 id="js-contribution-activity-description">%d contributions in the last year</h2>
</body></html>`, username, username, start.Format("2006-01-02"), end, cells.String(), tooltips.String(), total)
}

func waitForGitHubSnapshot(t *testing.T, store *Store, username string) {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		got, err := store.GitHubActivity(context.Background())
		if err != nil {
			t.Fatal(err)
		}
		if got != nil && got.Username == username {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}
	t.Fatalf("GitHub snapshot was not refreshed for %q", username)
}
