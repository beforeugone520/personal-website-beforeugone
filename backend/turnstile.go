package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

var errTurnstileFailed = errors.New("turnstile verification failed")

type TurnstileVerifier struct {
	secret           string
	url              string
	allowedHostnames map[string]struct{}
	client           *http.Client
}

func NewTurnstileVerifier(secret, verifyURL string, allowedHostnames map[string]struct{}, client *http.Client) *TurnstileVerifier {
	if client == nil {
		client = &http.Client{Timeout: 3 * time.Second}
	}
	return &TurnstileVerifier{secret: secret, url: verifyURL, allowedHostnames: allowedHostnames, client: client}
}

func (v *TurnstileVerifier) Verify(ctx context.Context, token, remoteIP, idempotencyKey string) error {
	if v.secret == "" {
		return nil
	}
	if strings.TrimSpace(token) == "" {
		return errTurnstileFailed
	}
	form := url.Values{"secret": {v.secret}, "response": {token}}
	if remoteIP != "" {
		form.Set("remoteip", remoteIP)
	}
	if idempotencyKey != "" {
		form.Set("idempotency_key", idempotencyKey)
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, v.url, strings.NewReader(form.Encode()))
	if err != nil {
		return fmt.Errorf("build turnstile request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	resp, err := v.client.Do(req)
	if err != nil {
		return fmt.Errorf("verify turnstile: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("verify turnstile: status %d", resp.StatusCode)
	}
	var result struct {
		Success  bool   `json:"success"`
		Hostname string `json:"hostname"`
	}
	if err := json.NewDecoder(io.LimitReader(resp.Body, 16<<10)).Decode(&result); err != nil {
		return fmt.Errorf("decode turnstile response: %w", err)
	}
	if !result.Success {
		return errTurnstileFailed
	}
	if _, allowed := v.allowedHostnames[strings.ToLower(strings.TrimSpace(result.Hostname))]; !allowed {
		return errTurnstileFailed
	}
	return nil
}
