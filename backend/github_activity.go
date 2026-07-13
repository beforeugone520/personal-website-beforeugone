package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const (
	githubGraphQLEndpoint = "https://api.github.com/graphql"
	githubResponseLimit   = 2 << 20
)

const githubActivityQuery = `query PublicGitHubActivity($login: String!) {
  user(login: $login) {
    login
    url
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
    repositories(first: 6, ownerAffiliations: OWNER, privacy: PUBLIC, isArchived: false, isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        name
        nameWithOwner
        description
        url
        stargazerCount
        pushedAt
        isArchived
        isFork
        isPrivate
        primaryLanguage {
          name
          color
        }
      }
    }
  }
}`

type GitHubActivitySnapshot struct {
	Username           string               `json:"username"`
	ProfileURL         string               `json:"profile_url"`
	TotalContributions int                  `json:"total_contributions"`
	Contributions      []GitHubContribution `json:"contributions"`
	Repositories       []GitHubRepository   `json:"repositories"`
	RefreshedAt        string               `json:"refreshed_at"`
}

type GitHubContribution struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
	Level int    `json:"level"`
}

type GitHubRepository struct {
	Name          string `json:"name"`
	FullName      string `json:"full_name"`
	Description   string `json:"description"`
	URL           string `json:"url"`
	Language      string `json:"language"`
	LanguageColor string `json:"language_color"`
	Stars         int    `json:"stars"`
	PushedAt      string `json:"pushed_at"`
	Archived      bool   `json:"archived"`
}

type githubActivityClient struct {
	endpoint string
	token    string
	client   *http.Client
}

func newGitHubActivityClient(token string, timeout time.Duration) *githubActivityClient {
	if timeout <= 0 {
		timeout = 10 * time.Second
	}
	return &githubActivityClient{
		endpoint: githubGraphQLEndpoint,
		token:    token,
		client:   &http.Client{Timeout: timeout},
	}
}

func (c *githubActivityClient) Fetch(ctx context.Context, username string) (GitHubActivitySnapshot, error) {
	requestBody, err := json.Marshal(map[string]any{
		"query":     githubActivityQuery,
		"variables": map[string]string{"login": username},
	})
	if err != nil {
		return GitHubActivitySnapshot{}, fmt.Errorf("encode GitHub GraphQL request: %w", err)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.endpoint, bytes.NewReader(requestBody))
	if err != nil {
		return GitHubActivitySnapshot{}, fmt.Errorf("create GitHub GraphQL request: %w", err)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+c.token)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "beforeu-api")

	response, err := c.client.Do(req)
	if err != nil {
		return GitHubActivitySnapshot{}, fmt.Errorf("request GitHub GraphQL: %w", err)
	}
	defer response.Body.Close()
	body, err := io.ReadAll(io.LimitReader(response.Body, githubResponseLimit+1))
	if err != nil {
		return GitHubActivitySnapshot{}, fmt.Errorf("read GitHub GraphQL response: %w", err)
	}
	if len(body) > githubResponseLimit {
		return GitHubActivitySnapshot{}, errors.New("GitHub GraphQL response is too large")
	}
	if response.StatusCode != http.StatusOK {
		return GitHubActivitySnapshot{}, fmt.Errorf("GitHub GraphQL returned status %d", response.StatusCode)
	}
	if githubScopesExposePrivateActivity(response.Header.Get("X-OAuth-Scopes")) {
		return GitHubActivitySnapshot{}, errors.New("GitHub API token has private activity scopes")
	}

	var envelope struct {
		Data struct {
			User *struct {
				Login                   string `json:"login"`
				URL                     string `json:"url"`
				ContributionsCollection struct {
					ContributionCalendar struct {
						TotalContributions int `json:"totalContributions"`
						Weeks              []struct {
							ContributionDays []struct {
								Date              string `json:"date"`
								ContributionCount int    `json:"contributionCount"`
								ContributionLevel string `json:"contributionLevel"`
							} `json:"contributionDays"`
						} `json:"weeks"`
					} `json:"contributionCalendar"`
				} `json:"contributionsCollection"`
				Repositories struct {
					Nodes []struct {
						Name            string `json:"name"`
						NameWithOwner   string `json:"nameWithOwner"`
						Description     string `json:"description"`
						URL             string `json:"url"`
						StargazerCount  int    `json:"stargazerCount"`
						PushedAt        string `json:"pushedAt"`
						IsArchived      bool   `json:"isArchived"`
						IsFork          bool   `json:"isFork"`
						IsPrivate       bool   `json:"isPrivate"`
						PrimaryLanguage *struct {
							Name  string `json:"name"`
							Color string `json:"color"`
						} `json:"primaryLanguage"`
					} `json:"nodes"`
				} `json:"repositories"`
			} `json:"user"`
		} `json:"data"`
		Errors []json.RawMessage `json:"errors"`
	}
	if err := json.Unmarshal(body, &envelope); err != nil {
		return GitHubActivitySnapshot{}, fmt.Errorf("decode GitHub GraphQL response: %w", err)
	}
	if len(envelope.Errors) != 0 {
		return GitHubActivitySnapshot{}, errors.New("GitHub GraphQL returned errors")
	}
	if envelope.Data.User == nil {
		return GitHubActivitySnapshot{}, errors.New("GitHub user was not found")
	}

	user := envelope.Data.User
	snapshot := GitHubActivitySnapshot{
		Username:           user.Login,
		ProfileURL:         user.URL,
		TotalContributions: user.ContributionsCollection.ContributionCalendar.TotalContributions,
		Contributions:      make([]GitHubContribution, 0, 371),
		Repositories:       make([]GitHubRepository, 0, len(user.Repositories.Nodes)),
	}
	for _, week := range user.ContributionsCollection.ContributionCalendar.Weeks {
		for _, day := range week.ContributionDays {
			level, ok := githubContributionLevel(day.ContributionLevel)
			if !ok || day.ContributionCount < 0 {
				return GitHubActivitySnapshot{}, errors.New("GitHub GraphQL returned invalid contribution data")
			}
			snapshot.Contributions = append(snapshot.Contributions, GitHubContribution{
				Date: day.Date, Count: day.ContributionCount, Level: level,
			})
		}
	}
	for _, repo := range user.Repositories.Nodes {
		if repo.IsFork || repo.IsPrivate || repo.IsArchived || len(snapshot.Repositories) == 6 {
			continue
		}
		item := GitHubRepository{
			Name: repo.Name, FullName: repo.NameWithOwner, Description: repo.Description,
			URL: repo.URL, Stars: repo.StargazerCount, PushedAt: repo.PushedAt, Archived: repo.IsArchived,
		}
		if repo.PrimaryLanguage != nil {
			item.Language = repo.PrimaryLanguage.Name
			item.LanguageColor = repo.PrimaryLanguage.Color
		}
		snapshot.Repositories = append(snapshot.Repositories, item)
	}
	if err := validateGitHubActivitySnapshot(snapshot, username); err != nil {
		return GitHubActivitySnapshot{}, err
	}
	return snapshot, nil
}

func githubScopesExposePrivateActivity(value string) bool {
	for _, scope := range strings.Split(value, ",") {
		switch strings.ToLower(strings.TrimSpace(scope)) {
		case "read:user", "user", "repo":
			return true
		}
	}
	return false
}

func validateGitHubActivitySnapshot(snapshot GitHubActivitySnapshot, expectedUsername string) error {
	if !strings.EqualFold(snapshot.Username, expectedUsername) || !validGitHubURL(snapshot.ProfileURL) {
		return errors.New("GitHub GraphQL returned invalid user data")
	}
	if snapshot.TotalContributions < 0 || len(snapshot.Contributions) < 300 || len(snapshot.Contributions) > 371 {
		return errors.New("GitHub GraphQL returned incomplete contribution data")
	}
	var previous time.Time
	total := 0
	for _, contribution := range snapshot.Contributions {
		date, err := time.Parse("2006-01-02", contribution.Date)
		if err != nil || (!previous.IsZero() && !date.After(previous)) || contribution.Count < 0 || contribution.Level < 0 || contribution.Level > 4 {
			return errors.New("GitHub GraphQL returned invalid contribution data")
		}
		previous = date
		total += contribution.Count
	}
	if total != snapshot.TotalContributions {
		return errors.New("GitHub GraphQL returned inconsistent contribution totals")
	}
	for _, repository := range snapshot.Repositories {
		if repository.Name == "" || !strings.EqualFold(repository.FullName, snapshot.Username+"/"+repository.Name) ||
			!validGitHubURL(repository.URL) || repository.Stars < 0 || repository.Archived {
			return errors.New("GitHub GraphQL returned invalid repository data")
		}
		if repository.PushedAt != "" {
			if _, err := time.Parse(time.RFC3339, repository.PushedAt); err != nil {
				return errors.New("GitHub GraphQL returned invalid repository data")
			}
		}
	}
	return nil
}

func validGitHubURL(value string) bool {
	parsed, err := url.Parse(value)
	return err == nil && parsed.Scheme == "https" && strings.EqualFold(parsed.Hostname(), "github.com")
}

func githubContributionLevel(value string) (int, bool) {
	switch strings.ToUpper(value) {
	case "NONE":
		return 0, true
	case "FIRST_QUARTILE":
		return 1, true
	case "SECOND_QUARTILE":
		return 2, true
	case "THIRD_QUARTILE":
		return 3, true
	case "FOURTH_QUARTILE":
		return 4, true
	default:
		return 0, false
	}
}

type githubActivityRefresher struct {
	username string
	token    string
	interval time.Duration
	store    *Store
	client   *githubActivityClient
	logger   *slog.Logger
	trigger  chan struct{}
	now      func() time.Time
}

func newGitHubActivityRefresher(cfg Config, store *Store, logger *slog.Logger) *githubActivityRefresher {
	interval := cfg.GitHubRefreshInterval
	if interval <= 0 {
		interval = 15 * time.Minute
	}
	return &githubActivityRefresher{
		username: cfg.GitHubUsername,
		token:    cfg.GitHubAPIToken,
		interval: interval,
		store:    store,
		client:   newGitHubActivityClient(cfg.GitHubAPIToken, cfg.GitHubRequestTimeout),
		logger:   logger,
		trigger:  make(chan struct{}, 1),
		now:      time.Now,
	}
}

func (r *githubActivityRefresher) Enabled() bool {
	return r != nil && r.token != ""
}

func (r *githubActivityRefresher) Trigger() {
	if !r.Enabled() {
		return
	}
	select {
	case r.trigger <- struct{}{}:
	default:
	}
}

func (r *githubActivityRefresher) Run(ctx context.Context) {
	if !r.Enabled() {
		return
	}
	r.refresh(ctx)
	ticker := time.NewTicker(r.interval)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			r.refresh(ctx)
		case <-r.trigger:
			r.refresh(ctx)
		}
	}
}

func (r *githubActivityRefresher) refresh(ctx context.Context) {
	snapshot, err := r.client.Fetch(ctx, r.username)
	if err == nil {
		snapshot.RefreshedAt = timestamp(r.now())
		err = r.store.PutGitHubActivity(ctx, snapshot)
	}
	if err != nil && ctx.Err() == nil {
		r.logger.Warn("GitHub activity refresh failed", "error", err)
	}
}
