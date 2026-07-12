# AGENTS.md

## Current State

- This repository is the static source for `https://beforeugone.com/`.
- Production remains on GitHub Pages with Cloudflare managing the custom domain/edge. Do not migrate the static site to the Azure VM unless the user explicitly changes this decision.
- Phase 1 dynamic-site code now exists locally under `backend/` and `assets/site-dynamic.js`, but it has not been deployed or production-verified. Do not describe it as live until the checks in `docs/backend-operations.md` have passed against the real domain.
- The custom OpenClaw messaging surface is still planned, not implemented. Read `docs/handoff-personal-backend.md` before starting Phase 2 or later work.

## Frontend Workflow

- Preserve the existing static HTML/CSS/JavaScript architecture unless a feature genuinely needs a separate app.
- Use pnpm for the `theme-slider/` Vue/Vite subproject.
- After changing the theme slider, run `pnpm test`, `pnpm build`, and `./scripts/bump-cache-stamp.sh`; commit both source and generated assets.
- Dynamic enhancements must fail quietly so the static site remains readable when the API is unavailable.
- Keep Phase 1 API calls in `assets/site-dynamic.js`; render remote strings with DOM text APIs rather than `innerHTML`.
- The public Turnstile site key is supplied through page metadata. Its production value must never be confused with the server-only `TURNSTILE_SECRET`.
- Production public writes fail closed when `TURNSTILE_SECRET` is absent. `ALLOW_INSECURE_PUBLIC_WRITES` is only for a loopback static preview with `STATIC_DIR` set.

## Backend Workflow

- The Phase 1 service is a single Go module in `backend/`; run `go test ./...` and `go vet ./...` there after backend changes.
- `backend/.env.example`, `docs/backend-api.md`, and `docs/backend-operations.md` must stay synchronized with config, route, request/response, migration, and deployment changes.
- Add a new migration instead of editing a migration that may already have run. SQLite must keep WAL, foreign keys, and busy timeout enabled.
- Production binds to `127.0.0.1:8787`; only Caddy receives public traffic. The public Caddy route must continue to hide `/v1/admin/*`.
- Keep the Caddy Cloudflare CIDRs current and preserve its overwritten `X-BeforeU-Client-IP`; the Go service trusts that header only from loopback.
- Use `scripts/backup-backend.sh` or the matching systemd timer for WAL-consistent backups. A raw copy of the live `.db` file is not an acceptable backup.

## Backend Boundaries

- Keep OpenClaw Gateway on `127.0.0.1:18789`; never expose it directly to the public Internet.
- Browsers and mobile clients must not receive Gateway tokens, model keys, SSH keys, or private OpenClaw memory.
- Public AI Q&A may use only explicitly indexed public site/repository content and must not have tools.
- Prefer a lightweight Go service with SQLite for the Azure VM. Do not add a heavy database or local model to the 1 GB host.
- New routes, tables, environment variables, and deployment steps must be reflected in project docs, not only in code.
- `ADMIN_TOKEN`, `ANONYMIZATION_SECRET`, `TURNSTILE_SECRET`, and `GITHUB_WEBHOOK_SECRET` are server-only. Never commit them or place them in HTML/JavaScript.
