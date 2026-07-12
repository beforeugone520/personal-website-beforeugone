# AGENTS.md

## Current State

- This repository is the static source for `https://beforeugone.com/`.
- Production remains on GitHub Pages with Cloudflare managing the custom domain/edge. Do not migrate the static site to the Azure VM unless the user explicitly changes this decision.
- The dynamic backend and custom OpenClaw messaging surface are planned but not implemented. Read `docs/handoff-personal-backend.md` before starting that work.

## Frontend Workflow

- Preserve the existing static HTML/CSS/JavaScript architecture unless a feature genuinely needs a separate app.
- Use pnpm for the `theme-slider/` Vue/Vite subproject.
- After changing the theme slider, run `pnpm test`, `pnpm build`, and `./scripts/bump-cache-stamp.sh`; commit both source and generated assets.
- Dynamic enhancements must fail quietly so the static site remains readable when the API is unavailable.

## Backend Boundaries

- Keep OpenClaw Gateway on `127.0.0.1:18789`; never expose it directly to the public Internet.
- Browsers and mobile clients must not receive Gateway tokens, model keys, SSH keys, or private OpenClaw memory.
- Public AI Q&A may use only explicitly indexed public site/repository content and must not have tools.
- Prefer a lightweight Go service with SQLite for the Azure VM. Do not add a heavy database or local model to the 1 GB host.
- New routes, tables, environment variables, and deployment steps must be reflected in project docs, not only in code.
