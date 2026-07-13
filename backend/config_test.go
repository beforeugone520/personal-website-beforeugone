package main

import (
	"testing"
	"time"
)

func TestLoadConfigDefaultsAndOverrides(t *testing.T) {
	for _, name := range []string{
		"LISTEN_ADDR", "DATABASE_PATH", "ADMIN_TOKEN", "CORS_ALLOWED_ORIGINS", "TURNSTILE_SECRET",
		"TURNSTILE_VERIFY_URL", "GITHUB_WEBHOOK_SECRET", "GITHUB_ALLOWED_REPOSITORIES", "STATIC_DIR",
		"PUBLIC_WRITE_RATE_LIMIT", "PUBLIC_WRITE_RATE_WINDOW", "TRUST_PROXY_HEADERS", "SHUTDOWN_TIMEOUT",
		"REACTION_PAGE_KEYS", "TURNSTILE_ALLOWED_HOSTNAMES", "ALLOW_INSECURE_PUBLIC_WRITES",
		"GITHUB_USERNAME", "GITHUB_API_TOKEN", "GITHUB_REFRESH_INTERVAL", "GITHUB_REQUEST_TIMEOUT",
	} {
		t.Setenv(name, "")
	}
	t.Setenv("ANONYMIZATION_SECRET", "test-anonymization-secret-32-bytes")
	cfg, err := loadConfig()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.ListenAddr != "127.0.0.1:8787" || cfg.DatabasePath != "./data/beforeu.db" {
		t.Fatalf("default address/path = %q, %q", cfg.ListenAddr, cfg.DatabasePath)
	}
	if cfg.PublicWriteLimit != 10 || cfg.PublicWriteWindow != time.Minute || cfg.ShutdownTimeout != 10*time.Second {
		t.Fatalf("default timing = limit %d, window %s, shutdown %s", cfg.PublicWriteLimit, cfg.PublicWriteWindow, cfg.ShutdownTimeout)
	}
	if cfg.GitHubUsername != "beforeugone520" || cfg.GitHubRefreshInterval != 15*time.Minute || cfg.GitHubRequestTimeout != 10*time.Second {
		t.Fatalf("default GitHub config = username %q, refresh %s, timeout %s", cfg.GitHubUsername, cfg.GitHubRefreshInterval, cfg.GitHubRequestTimeout)
	}
	if _, ok := cfg.ReactionPageKeys["/posts/hello-world.html"]; !ok {
		t.Fatalf("default reaction pages = %#v", cfg.ReactionPageKeys)
	}
	if _, ok := cfg.TurnstileHostnames["beforeugone.com"]; !ok {
		t.Fatalf("default Turnstile hostnames = %#v", cfg.TurnstileHostnames)
	}

	t.Setenv("LISTEN_ADDR", "127.0.0.1:9999")
	t.Setenv("PUBLIC_WRITE_RATE_LIMIT", "25")
	t.Setenv("PUBLIC_WRITE_RATE_WINDOW", "2m")
	t.Setenv("TRUST_PROXY_HEADERS", "true")
	t.Setenv("REACTION_PAGE_KEYS", "/posts/one.html,/posts/two.html")
	t.Setenv("GITHUB_USERNAME", "beforeu-test")
	t.Setenv("GITHUB_API_TOKEN", "test-token")
	t.Setenv("GITHUB_REFRESH_INTERVAL", "30m")
	t.Setenv("GITHUB_REQUEST_TIMEOUT", "5s")
	cfg, err = loadConfig()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.ListenAddr != "127.0.0.1:9999" || cfg.PublicWriteLimit != 25 || cfg.PublicWriteWindow != 2*time.Minute || !cfg.TrustedProxyHeader {
		t.Fatalf("overrides = %#v", cfg)
	}
	if len(cfg.ReactionPageKeys) != 2 {
		t.Fatalf("reaction pages = %#v", cfg.ReactionPageKeys)
	}
	if cfg.GitHubUsername != "beforeu-test" || cfg.GitHubAPIToken != "test-token" || cfg.GitHubRefreshInterval != 30*time.Minute || cfg.GitHubRequestTimeout != 5*time.Second {
		t.Fatalf("GitHub overrides = %#v", cfg)
	}
}

func TestLoadConfigRejectsInvalidGitHubRefreshSettings(t *testing.T) {
	t.Setenv("ANONYMIZATION_SECRET", "test-anonymization-secret-32-bytes")
	t.Setenv("GITHUB_USERNAME", "-invalid")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected invalid GITHUB_USERNAME error")
	}

	t.Setenv("GITHUB_USERNAME", "beforeugone520")
	t.Setenv("GITHUB_REFRESH_INTERVAL", "never")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected invalid GITHUB_REFRESH_INTERVAL error")
	}

	t.Setenv("GITHUB_REFRESH_INTERVAL", "15m")
	t.Setenv("GITHUB_REQUEST_TIMEOUT", "0s")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected invalid GITHUB_REQUEST_TIMEOUT error")
	}
}

func TestLoadConfigRequiresSecretsAndValidReactionPages(t *testing.T) {
	t.Setenv("ANONYMIZATION_SECRET", "")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected missing ANONYMIZATION_SECRET error")
	}
	t.Setenv("ANONYMIZATION_SECRET", "test-anonymization-secret-32-bytes")
	t.Setenv("REACTION_PAGE_KEYS", "not-a-site-path")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected invalid REACTION_PAGE_KEYS error")
	}
}

func TestLoadConfigRejectsUnsafeNetworkAndPreviewSettings(t *testing.T) {
	t.Setenv("ANONYMIZATION_SECRET", "test-anonymization-secret-32-bytes")
	t.Setenv("LISTEN_ADDR", "0.0.0.0:8787")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected non-loopback LISTEN_ADDR error")
	}

	t.Setenv("LISTEN_ADDR", "127.0.0.1:8787")
	t.Setenv("ALLOW_INSECURE_PUBLIC_WRITES", "true")
	t.Setenv("STATIC_DIR", "")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected insecure public writes without STATIC_DIR error")
	}

	t.Setenv("ALLOW_INSECURE_PUBLIC_WRITES", "false")
	t.Setenv("TURNSTILE_SECRET", "turnstile-secret")
	t.Setenv("TURNSTILE_ALLOWED_HOSTNAMES", ",")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected missing Turnstile hostname error")
	}
}

func TestLoadConfigRequiresStrongPairedWebhookSettings(t *testing.T) {
	t.Setenv("ANONYMIZATION_SECRET", "test-anonymization-secret-32-bytes")
	t.Setenv("GITHUB_ALLOWED_REPOSITORIES", "beforeugone/site")
	t.Setenv("GITHUB_WEBHOOK_SECRET", "short")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected short webhook secret error")
	}

	t.Setenv("GITHUB_WEBHOOK_SECRET", "github-webhook-secret-at-least-32-chars")
	t.Setenv("GITHUB_ALLOWED_REPOSITORIES", "")
	if _, err := loadConfig(); err == nil {
		t.Fatal("expected unpaired webhook settings error")
	}
}
