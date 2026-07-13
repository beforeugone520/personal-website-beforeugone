package main

import (
	"context"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
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
