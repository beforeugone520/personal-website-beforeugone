package main

import (
	"fmt"
	"net"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	ListenAddr          string
	DatabasePath        string
	AdminToken          string
	AnonymizationSecret string
	CORSAllowedOrigins  []string
	TurnstileSecret     string
	TurnstileVerifyURL  string
	TurnstileHostnames  map[string]struct{}
	AllowInsecureWrites bool
	GitHubWebhookSecret string
	GitHubAllowedRepos  map[string]struct{}
	ReactionPageKeys    map[string]struct{}
	StaticDir           string
	PublicWriteLimit    int
	PublicWriteWindow   time.Duration
	TrustedProxyHeader  bool
	ShutdownTimeout     time.Duration
	MaxRequestBodyBytes int64
}

func loadConfig() (Config, error) {
	cfg := Config{
		ListenAddr:          envOr("LISTEN_ADDR", "127.0.0.1:8787"),
		DatabasePath:        envOr("DATABASE_PATH", "./data/beforeu.db"),
		AdminToken:          os.Getenv("ADMIN_TOKEN"),
		AnonymizationSecret: os.Getenv("ANONYMIZATION_SECRET"),
		CORSAllowedOrigins:  splitCSV(envOr("CORS_ALLOWED_ORIGINS", "https://beforeugone.com")),
		TurnstileSecret:     os.Getenv("TURNSTILE_SECRET"),
		TurnstileVerifyURL:  envOr("TURNSTILE_VERIFY_URL", "https://challenges.cloudflare.com/turnstile/v0/siteverify"),
		TurnstileHostnames:  stringSet(lowerStrings(splitCSV(envOr("TURNSTILE_ALLOWED_HOSTNAMES", "beforeugone.com")))),
		GitHubWebhookSecret: os.Getenv("GITHUB_WEBHOOK_SECRET"),
		GitHubAllowedRepos:  stringSet(splitCSV(os.Getenv("GITHUB_ALLOWED_REPOSITORIES"))),
		ReactionPageKeys:    stringSet(splitCSV(envOr("REACTION_PAGE_KEYS", "/posts/hello-world.html"))),
		StaticDir:           os.Getenv("STATIC_DIR"),
		PublicWriteLimit:    10,
		PublicWriteWindow:   time.Minute,
		ShutdownTimeout:     10 * time.Second,
		MaxRequestBodyBytes: 16 << 10,
	}

	var err error
	if cfg.PublicWriteLimit, err = envInt("PUBLIC_WRITE_RATE_LIMIT", cfg.PublicWriteLimit, 1, 10000); err != nil {
		return Config{}, err
	}
	if cfg.PublicWriteWindow, err = envDuration("PUBLIC_WRITE_RATE_WINDOW", cfg.PublicWriteWindow); err != nil {
		return Config{}, err
	}
	if cfg.ShutdownTimeout, err = envDuration("SHUTDOWN_TIMEOUT", cfg.ShutdownTimeout); err != nil {
		return Config{}, err
	}
	if value := os.Getenv("TRUST_PROXY_HEADERS"); value != "" {
		cfg.TrustedProxyHeader, err = strconv.ParseBool(value)
		if err != nil {
			return Config{}, fmt.Errorf("TRUST_PROXY_HEADERS: %w", err)
		}
	}
	if value := os.Getenv("ALLOW_INSECURE_PUBLIC_WRITES"); value != "" {
		cfg.AllowInsecureWrites, err = strconv.ParseBool(value)
		if err != nil {
			return Config{}, fmt.Errorf("ALLOW_INSECURE_PUBLIC_WRITES: %w", err)
		}
	}
	if !loopbackAddress(cfg.ListenAddr) {
		return Config{}, fmt.Errorf("LISTEN_ADDR must use a loopback address")
	}
	if len(cfg.AnonymizationSecret) < 32 {
		return Config{}, fmt.Errorf("ANONYMIZATION_SECRET must contain at least 32 characters")
	}
	if cfg.AdminToken != "" && len(cfg.AdminToken) < 32 {
		return Config{}, fmt.Errorf("ADMIN_TOKEN must contain at least 32 characters when configured")
	}
	if cfg.GitHubWebhookSecret != "" && len(cfg.GitHubWebhookSecret) < 32 {
		return Config{}, fmt.Errorf("GITHUB_WEBHOOK_SECRET must contain at least 32 characters when configured")
	}
	if (cfg.GitHubWebhookSecret == "") != (len(cfg.GitHubAllowedRepos) == 0) {
		return Config{}, fmt.Errorf("GITHUB_WEBHOOK_SECRET and GITHUB_ALLOWED_REPOSITORIES must be configured together")
	}
	if cfg.TurnstileSecret != "" && len(cfg.TurnstileHostnames) == 0 {
		return Config{}, fmt.Errorf("TURNSTILE_ALLOWED_HOSTNAMES is required when TURNSTILE_SECRET is configured")
	}
	if cfg.AllowInsecureWrites && cfg.StaticDir == "" {
		return Config{}, fmt.Errorf("ALLOW_INSECURE_PUBLIC_WRITES requires STATIC_DIR and is only for local previews")
	}
	for pageKey := range cfg.ReactionPageKeys {
		if !validPageKey(pageKey) {
			return Config{}, fmt.Errorf("REACTION_PAGE_KEYS contains invalid site path %q", pageKey)
		}
	}
	return cfg, nil
}

func envOr(name, fallback string) string {
	if value := os.Getenv(name); value != "" {
		return value
	}
	return fallback
}

func envInt(name string, fallback, min, max int) (int, error) {
	value := os.Getenv(name)
	if value == "" {
		return fallback, nil
	}
	n, err := strconv.Atoi(value)
	if err != nil || n < min || n > max {
		return 0, fmt.Errorf("%s must be an integer between %d and %d", name, min, max)
	}
	return n, nil
}

func envDuration(name string, fallback time.Duration) (time.Duration, error) {
	value := os.Getenv(name)
	if value == "" {
		return fallback, nil
	}
	d, err := time.ParseDuration(value)
	if err != nil || d <= 0 {
		return 0, fmt.Errorf("%s must be a positive Go duration", name)
	}
	return d, nil
}

func splitCSV(value string) []string {
	var values []string
	for _, item := range strings.Split(value, ",") {
		if item = strings.TrimSpace(item); item != "" {
			values = append(values, item)
		}
	}
	return values
}

func stringSet(values []string) map[string]struct{} {
	set := make(map[string]struct{}, len(values))
	for _, value := range values {
		set[value] = struct{}{}
	}
	return set
}

func lowerStrings(values []string) []string {
	for index := range values {
		values[index] = strings.ToLower(values[index])
	}
	return values
}

func loopbackAddress(address string) bool {
	host, _, err := net.SplitHostPort(address)
	if err != nil {
		return false
	}
	if strings.EqualFold(host, "localhost") {
		return true
	}
	ip := net.ParseIP(host)
	return ip != nil && ip.IsLoopback()
}
