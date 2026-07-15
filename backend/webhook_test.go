package main

import (
	"strings"
	"testing"
)

func TestGitHubPushCopyUsesStableHumanCopy(t *testing.T) {
	messages := []string{
		"docs: record rollout",
		"fix(activity): accept week-aligned ranges",
	}
	title, summary := githubPushCopy(
		"beforeugone520/personal-website-beforeugone",
		"main",
		messages,
		messages[1],
		"delivery-0001",
	)
	repeatedTitle, repeatedSummary := githubPushCopy(
		"beforeugone520/personal-website-beforeugone",
		"main",
		messages,
		messages[1],
		"delivery-0001",
	)
	if title != repeatedTitle || summary != repeatedSummary {
		t.Fatalf("copy changed for the same delivery: %q/%q != %q/%q", title, summary, repeatedTitle, repeatedSummary)
	}
	if !strings.Contains(title, "这个站") || strings.Contains(title, "Pushed") {
		t.Fatalf("title = %q", title)
	}
	if summary != "2 个提交一起落地，最后一笔：accept week-aligned ranges" {
		t.Fatalf("summary = %q", summary)
	}
}

func TestGitHubPushCopyFallsBackWithoutConventionalCommit(t *testing.T) {
	title, summary := githubPushCopy(
		"beforeugone520/unknown-project",
		"topic",
		[]string{"Try another approach"},
		"Try another approach",
		"delivery-0002",
	)
	if !strings.Contains(title, "unknown-project") || summary != "Try another approach" {
		t.Fatalf("copy = %q / %q", title, summary)
	}
}

func TestGitHubReleaseCopyUsesRepositoryLabel(t *testing.T) {
	title, summary := githubReleaseCopy(
		"beforeugone520/libghostty-ohos",
		"v0.4.0",
		"Adds selection and search.\nMore details follow.",
		"delivery-0003",
	)
	if !strings.Contains(title, "FusionTerm 的终端内核") || !strings.Contains(title, "v0.4.0") {
		t.Fatalf("title = %q", title)
	}
	if summary != "Adds selection and search." {
		t.Fatalf("summary = %q", summary)
	}
}

func TestParseCommitSubject(t *testing.T) {
	kind, subject := parseCommitSubject("feat(ui)!: add compact mode\n\nbody")
	if kind != "feat" || subject != "add compact mode" {
		t.Fatalf("parsed = %q / %q", kind, subject)
	}
	kind, subject = parseCommitSubject("Notes: keep the colon")
	if kind != "" || subject != "Notes: keep the colon" {
		t.Fatalf("unknown prefix parsed = %q / %q", kind, subject)
	}
}
