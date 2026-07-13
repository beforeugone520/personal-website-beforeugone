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
	"sort"
	"strconv"
	"strings"
	"time"

	"golang.org/x/net/html"
)

const (
	githubGraphQLEndpoint       = "https://api.github.com/graphql"
	githubRESTEndpoint          = "https://api.github.com"
	githubContributionsEndpoint = "https://github.com"
	githubResponseLimit         = 2 << 20
	githubUserAgent             = "beforeu-api"
	githubRepositoryLimit       = 6
	githubPublicMinimumRefresh  = 2 * time.Minute
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
	endpoint              string
	restEndpoint          string
	contributionsEndpoint string
	token                 string
	client                *http.Client
}

func newGitHubActivityClient(token string, timeout time.Duration) *githubActivityClient {
	if timeout <= 0 {
		timeout = 10 * time.Second
	}
	return &githubActivityClient{
		endpoint:              githubGraphQLEndpoint,
		restEndpoint:          githubRESTEndpoint,
		contributionsEndpoint: githubContributionsEndpoint,
		token:                 token,
		client:                &http.Client{Timeout: timeout},
	}
}

func (c *githubActivityClient) Fetch(ctx context.Context, username string) (GitHubActivitySnapshot, error) {
	if strings.TrimSpace(c.token) == "" {
		return c.fetchPublic(ctx, username)
	}
	return c.fetchGraphQL(ctx, username)
}

func (c *githubActivityClient) fetchGraphQL(ctx context.Context, username string) (GitHubActivitySnapshot, error) {
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
	req.Header.Set("User-Agent", githubUserAgent)

	response, err := c.client.Do(req)
	if err != nil {
		return GitHubActivitySnapshot{}, fmt.Errorf("request GitHub GraphQL: %w", err)
	}
	defer response.Body.Close()
	body, err := readGitHubResponse(response, "GitHub GraphQL")
	if err != nil {
		return GitHubActivitySnapshot{}, err
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
		if repo.IsFork || repo.IsPrivate || repo.IsArchived || len(snapshot.Repositories) == githubRepositoryLimit {
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

func (c *githubActivityClient) fetchPublic(ctx context.Context, username string) (GitHubActivitySnapshot, error) {
	repositories, err := c.fetchPublicRepositories(ctx, username)
	if err != nil {
		return GitHubActivitySnapshot{}, err
	}
	contributions, total, err := c.fetchPublicContributions(ctx, username)
	if err != nil {
		return GitHubActivitySnapshot{}, err
	}
	snapshot := GitHubActivitySnapshot{
		Username:           username,
		ProfileURL:         "https://github.com/" + username,
		TotalContributions: total,
		Contributions:      contributions,
		Repositories:       repositories,
	}
	if err := validateGitHubActivitySnapshot(snapshot, username); err != nil {
		return GitHubActivitySnapshot{}, err
	}
	return snapshot, nil
}

func (c *githubActivityClient) fetchPublicRepositories(ctx context.Context, username string) ([]GitHubRepository, error) {
	endpoint, err := githubURL(c.restEndpoint, "users", username, "repos")
	if err != nil {
		return nil, fmt.Errorf("create GitHub REST URL: %w", err)
	}
	query := endpoint.Query()
	query.Set("type", "owner")
	query.Set("sort", "pushed")
	query.Set("direction", "desc")
	query.Set("per_page", "100")
	endpoint.RawQuery = query.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("create GitHub REST request: %w", err)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")
	req.Header.Set("User-Agent", githubUserAgent)

	response, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request GitHub REST: %w", err)
	}
	defer response.Body.Close()
	if githubLinkHasNext(response.Header.Get("Link")) {
		return nil, errors.New("GitHub REST response requires pagination")
	}
	body, err := readGitHubResponse(response, "GitHub REST")
	if err != nil {
		return nil, err
	}

	var upstream []struct {
		Name        string `json:"name"`
		FullName    string `json:"full_name"`
		Description string `json:"description"`
		HTMLURL     string `json:"html_url"`
		Language    string `json:"language"`
		Stars       int    `json:"stargazers_count"`
		PushedAt    string `json:"pushed_at"`
		Archived    bool   `json:"archived"`
		Fork        bool   `json:"fork"`
		Private     bool   `json:"private"`
		Owner       struct {
			Login string `json:"login"`
		} `json:"owner"`
	}
	if err := json.Unmarshal(body, &upstream); err != nil {
		return nil, fmt.Errorf("decode GitHub REST response: %w", err)
	}

	repositories := make([]GitHubRepository, 0, len(upstream))
	for _, repo := range upstream {
		if repo.Private || repo.Fork || repo.Archived {
			continue
		}
		if !strings.EqualFold(repo.Owner.Login, username) || repo.Name == "" ||
			!strings.EqualFold(repo.FullName, username+"/"+repo.Name) {
			return nil, errors.New("GitHub REST returned invalid repository ownership")
		}
		repositories = append(repositories, GitHubRepository{
			Name: repo.Name, FullName: repo.FullName, Description: repo.Description,
			URL: repo.HTMLURL, Language: repo.Language, LanguageColor: githubLanguageColor(repo.Language),
			Stars: repo.Stars, PushedAt: repo.PushedAt, Archived: repo.Archived,
		})
	}
	sort.Slice(repositories, func(i, j int) bool {
		if repositories[i].PushedAt == repositories[j].PushedAt {
			return strings.ToLower(repositories[i].FullName) < strings.ToLower(repositories[j].FullName)
		}
		return repositories[i].PushedAt > repositories[j].PushedAt
	})
	if len(repositories) > githubRepositoryLimit {
		repositories = repositories[:githubRepositoryLimit]
	}
	return repositories, nil
}

func githubLinkHasNext(value string) bool {
	for _, link := range strings.Split(value, ",") {
		parts := strings.Split(link, ";")
		for _, parameter := range parts[1:] {
			parameter = strings.ToLower(strings.TrimSpace(parameter))
			if parameter == `rel="next"` || parameter == "rel=next" {
				return true
			}
		}
	}
	return false
}

func (c *githubActivityClient) fetchPublicContributions(ctx context.Context, username string) ([]GitHubContribution, int, error) {
	endpoint, err := githubURL(c.contributionsEndpoint, "users", username, "contributions")
	if err != nil {
		return nil, 0, fmt.Errorf("create GitHub contributions URL: %w", err)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint.String(), nil)
	if err != nil {
		return nil, 0, fmt.Errorf("create GitHub contributions request: %w", err)
	}
	req.Header.Set("Accept", "text/html")
	req.Header.Set("Accept-Language", "en-US")
	req.Header.Set("User-Agent", githubUserAgent)

	response, err := c.client.Do(req)
	if err != nil {
		return nil, 0, fmt.Errorf("request GitHub contributions: %w", err)
	}
	defer response.Body.Close()
	body, err := readGitHubResponse(response, "GitHub contributions")
	if err != nil {
		return nil, 0, err
	}
	return parseGitHubContributions(body, username)
}

func readGitHubResponse(response *http.Response, source string) ([]byte, error) {
	body, err := io.ReadAll(io.LimitReader(response.Body, githubResponseLimit+1))
	if err != nil {
		return nil, fmt.Errorf("read %s response: %w", source, err)
	}
	if len(body) > githubResponseLimit {
		return nil, fmt.Errorf("%s response is too large", source)
	}
	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%s returned status %d", source, response.StatusCode)
	}
	return body, nil
}

func githubURL(base string, pathSegments ...string) (*url.URL, error) {
	parsed, err := url.Parse(base)
	if err != nil {
		return nil, err
	}
	path := strings.TrimRight(parsed.Path, "/")
	for _, segment := range pathSegments {
		path += "/" + url.PathEscape(segment)
	}
	parsed.Path = path
	parsed.RawPath = ""
	parsed.RawQuery = ""
	parsed.Fragment = ""
	return parsed, nil
}

type githubContributionDay struct {
	ID    string
	Date  string
	Level int
}

func parseGitHubContributions(body []byte, username string) ([]GitHubContribution, int, error) {
	document, err := html.Parse(bytes.NewReader(body))
	if err != nil {
		return nil, 0, fmt.Errorf("parse GitHub contributions response: %w", err)
	}
	days := make([]githubContributionDay, 0, 371)
	tooltips := make(map[string]string, 371)
	duplicateTooltip := make(map[string]bool)
	graphMarkers := make([]githubContributionGraphMarker, 0, 1)
	headings := make([]string, 0, 1)
	var walk func(*html.Node) error
	walk = func(node *html.Node) error {
		if node.Type == html.ElementNode {
			switch node.Data {
			case "td":
				if htmlClassContains(node, "ContributionCalendar-day") {
					id, idOK := htmlAttribute(node, "id")
					date, dateOK := htmlAttribute(node, "data-date")
					levelValue, levelOK := htmlAttribute(node, "data-level")
					level, levelErr := strconv.Atoi(levelValue)
					if !idOK || id == "" || !dateOK || !levelOK || levelErr != nil || level < 0 || level > 4 {
						return errors.New("GitHub contributions returned invalid day data")
					}
					days = append(days, githubContributionDay{ID: id, Date: date, Level: level})
				}
			case "tool-tip":
				if target, ok := htmlAttribute(node, "for"); ok && target != "" {
					if _, exists := tooltips[target]; exists {
						duplicateTooltip[target] = true
					}
					tooltips[target] = htmlText(node)
				}
			case "div":
				if htmlClassContains(node, "ContributionCalendar") {
					marker, ok := githubContributionMarker(node)
					if ok {
						graphMarkers = append(graphMarkers, marker)
					}
				}
			case "h2":
				if id, ok := htmlAttribute(node, "id"); ok && id == "js-contribution-activity-description" {
					headings = append(headings, htmlText(node))
				}
			}
		}
		for child := node.FirstChild; child != nil; child = child.NextSibling {
			if err := walk(child); err != nil {
				return err
			}
		}
		return nil
	}
	if err := walk(document); err != nil {
		return nil, 0, err
	}
	if len(graphMarkers) != 1 || len(headings) != 1 {
		return nil, 0, errors.New("GitHub contributions returned incomplete graph metadata")
	}
	marker := graphMarkers[0]
	if !strings.EqualFold(marker.GraphURL, "/users/"+username+"/contributions") ||
		!strings.EqualFold(marker.ProfileURL, "/"+username) {
		return nil, 0, errors.New("GitHub contributions returned invalid graph identity")
	}
	from, err := time.Parse("2006-01-02 15:04:05 MST", marker.From)
	if err != nil {
		return nil, 0, errors.New("GitHub contributions returned invalid graph range")
	}
	to, err := time.Parse("2006-01-02 15:04:05 MST", marker.To)
	if err != nil || !to.After(from) {
		return nil, 0, errors.New("GitHub contributions returned invalid graph range")
	}
	headingTotal, ok := githubContributionHeadingTotal(headings[0])
	if !ok {
		return nil, 0, errors.New("GitHub contributions returned invalid graph total")
	}

	contributions := make([]GitHubContribution, 0, len(days))
	seenIDs := make(map[string]struct{}, len(days))
	seenDates := make(map[string]struct{}, len(days))
	total := 0
	for _, day := range days {
		if _, exists := seenIDs[day.ID]; exists {
			return nil, 0, errors.New("GitHub contributions returned duplicate day data")
		}
		seenIDs[day.ID] = struct{}{}
		if _, exists := seenDates[day.Date]; exists {
			return nil, 0, errors.New("GitHub contributions returned duplicate day data")
		}
		seenDates[day.Date] = struct{}{}
		tooltip, ok := tooltips[day.ID]
		if !ok || duplicateTooltip[day.ID] {
			return nil, 0, errors.New("GitHub contributions returned missing tooltip data")
		}
		count, ok := githubTooltipContributionCount(tooltip)
		if !ok {
			return nil, 0, errors.New("GitHub contributions returned invalid tooltip data")
		}
		contributions = append(contributions, GitHubContribution{Date: day.Date, Count: count, Level: day.Level})
		total += count
	}
	sort.Slice(contributions, func(i, j int) bool {
		return contributions[i].Date < contributions[j].Date
	})
	if len(contributions) != 365 && len(contributions) != 366 {
		return nil, 0, errors.New("GitHub contributions returned incomplete day data")
	}
	if contributions[0].Date != from.Format("2006-01-02") ||
		contributions[len(contributions)-1].Date != to.Format("2006-01-02") {
		return nil, 0, errors.New("GitHub contributions returned inconsistent graph range")
	}
	for i := 1; i < len(contributions); i++ {
		previous, _ := time.Parse("2006-01-02", contributions[i-1].Date)
		current, parseErr := time.Parse("2006-01-02", contributions[i].Date)
		if parseErr != nil || !current.Equal(previous.AddDate(0, 0, 1)) {
			return nil, 0, errors.New("GitHub contributions returned non-contiguous day data")
		}
	}
	if total != headingTotal {
		return nil, 0, errors.New("GitHub contributions returned inconsistent graph total")
	}
	return contributions, total, nil
}

type githubContributionGraphMarker struct {
	GraphURL   string
	ProfileURL string
	From       string
	To         string
}

func githubContributionMarker(node *html.Node) (githubContributionGraphMarker, bool) {
	graphURL, graphOK := htmlAttribute(node, "data-graph-url")
	profileURL, profileOK := htmlAttribute(node, "data-url")
	from, fromOK := htmlAttribute(node, "data-from")
	to, toOK := htmlAttribute(node, "data-to")
	return githubContributionGraphMarker{GraphURL: graphURL, ProfileURL: profileURL, From: from, To: to},
		graphOK && profileOK && fromOK && toOK
}

func githubContributionHeadingTotal(value string) (int, bool) {
	fields := strings.Fields(value)
	if len(fields) != 6 || fields[2] != "in" || fields[3] != "the" || fields[4] != "last" || fields[5] != "year" {
		return 0, false
	}
	count, err := strconv.Atoi(strings.ReplaceAll(fields[0], ",", ""))
	if err != nil || count < 0 || (count == 1 && fields[1] != "contribution") || (count != 1 && fields[1] != "contributions") {
		return 0, false
	}
	return count, true
}

func githubTooltipContributionCount(value string) (int, bool) {
	fields := strings.Fields(value)
	if len(fields) < 3 || fields[2] != "on" {
		return 0, false
	}
	if fields[0] == "No" && fields[1] == "contributions" {
		return 0, true
	}
	count, err := strconv.Atoi(strings.ReplaceAll(fields[0], ",", ""))
	if err != nil || count < 1 || (count == 1 && fields[1] != "contribution") || (count != 1 && fields[1] != "contributions") {
		return 0, false
	}
	return count, true
}

func htmlAttribute(node *html.Node, name string) (string, bool) {
	for _, attribute := range node.Attr {
		if attribute.Key == name {
			return attribute.Val, true
		}
	}
	return "", false
}

func htmlClassContains(node *html.Node, className string) bool {
	value, ok := htmlAttribute(node, "class")
	if !ok {
		return false
	}
	for _, candidate := range strings.Fields(value) {
		if candidate == className {
			return true
		}
	}
	return false
}

func htmlText(node *html.Node) string {
	var builder strings.Builder
	var walk func(*html.Node)
	walk = func(current *html.Node) {
		if current.Type == html.TextNode {
			builder.WriteString(current.Data)
		}
		for child := current.FirstChild; child != nil; child = child.NextSibling {
			walk(child)
		}
	}
	walk(node)
	return strings.TrimSpace(builder.String())
}

func githubLanguageColor(language string) string {
	colors := map[string]string{
		"C":                "#555555",
		"C#":               "#178600",
		"C++":              "#f34b7d",
		"CSS":              "#563d7c",
		"Dart":             "#00B4AB",
		"Go":               "#00ADD8",
		"HTML":             "#e34c26",
		"Java":             "#b07219",
		"JavaScript":       "#f1e05a",
		"Jupyter Notebook": "#DA5B0B",
		"Kotlin":           "#A97BFF",
		"Lua":              "#000080",
		"Objective-C":      "#438eff",
		"PHP":              "#4F5D95",
		"Python":           "#3572A5",
		"R":                "#198CE7",
		"Ruby":             "#701516",
		"Rust":             "#dea584",
		"Scala":            "#c22d40",
		"Shell":            "#89e051",
		"Swift":            "#F05138",
		"TypeScript":       "#3178c6",
		"Vue":              "#41b883",
	}
	return colors[language]
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
		return errors.New("GitHub returned invalid user data")
	}
	if snapshot.TotalContributions < 0 || (len(snapshot.Contributions) != 365 && len(snapshot.Contributions) != 366) {
		return errors.New("GitHub returned incomplete contribution data")
	}
	var previous time.Time
	total := 0
	for _, contribution := range snapshot.Contributions {
		date, err := time.Parse("2006-01-02", contribution.Date)
		if err != nil || (!previous.IsZero() && !date.Equal(previous.AddDate(0, 0, 1))) || contribution.Count < 0 || contribution.Level < 0 || contribution.Level > 4 {
			return errors.New("GitHub returned invalid contribution data")
		}
		previous = date
		total += contribution.Count
	}
	if total != snapshot.TotalContributions {
		return errors.New("GitHub returned inconsistent contribution totals")
	}
	for _, repository := range snapshot.Repositories {
		if repository.Name == "" || !strings.EqualFold(repository.FullName, snapshot.Username+"/"+repository.Name) ||
			!validGitHubURL(repository.URL) || repository.Stars < 0 || repository.Archived {
			return errors.New("GitHub returned invalid repository data")
		}
		if repository.PushedAt != "" {
			if _, err := time.Parse(time.RFC3339, repository.PushedAt); err != nil {
				return errors.New("GitHub returned invalid repository data")
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
	lastTry  time.Time
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
	return r != nil && r.username != ""
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
	now := r.now()
	if strings.TrimSpace(r.token) == "" && !r.lastTry.IsZero() && !now.Before(r.lastTry) &&
		now.Sub(r.lastTry) < githubPublicMinimumRefresh {
		return
	}
	r.lastTry = now
	snapshot, err := r.client.Fetch(ctx, r.username)
	if err == nil {
		snapshot.RefreshedAt = timestamp(now)
		err = r.store.PutGitHubActivity(ctx, snapshot)
	}
	if err != nil && ctx.Err() == nil {
		r.logger.Warn("GitHub activity refresh failed", "error", err)
	}
}
