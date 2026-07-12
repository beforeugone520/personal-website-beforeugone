# Phase 1 API Contract

> Contract for the implementation under [`backend/`](../backend). Production base URL is planned as `https://api.beforeugone.com`; deployment has not yet been completed.

## Conventions

- JSON request bodies require `Content-Type: application/json`. Unknown fields, multiple JSON values, and bodies larger than 16 KiB are rejected. The GitHub webhook has a separate 1 MiB limit.
- Times are UTC RFC 3339 strings. Clients must treat cursors as opaque.
- List endpoints accept `limit=1..50` and an optional `cursor`. They return `{"items":[],"next_cursor":null}` when empty or complete.
- Responses carry `X-Request-ID`. A valid incoming `X-Request-ID` may be reused; otherwise the server creates one.
- Allowed browser origins come from `CORS_ALLOWED_ORIGINS`. CORS is not an authentication mechanism.
- Public read responses may be cached for 15 to 60 seconds. Do not assume a write is visible through an edge cache immediately.

Most errors use this shape:

```json
{
  "error": {
    "code": "invalid_message",
    "message": "message must be between 10 and 280 characters"
  },
  "request_id": "a-request-id"
}
```

Log `request_id` when reporting an API failure. Expected status classes include `400` validation, `401` invalid admin credentials, `403` origin/repository denial, `404` missing resource, `409` idempotency conflict, `413` oversized body, `415` wrong media type, `429` write limit, and `503` disabled/unready service.

## Route Summary

| Method | Route | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/healthz` | none | Process liveness |
| `GET` | `/readyz` | none | SQLite readiness |
| `GET` | `/v1/public/now` | none | Visible current status |
| `GET` | `/v1/public/ship` | none | Visible Ship Log |
| `GET` | `/v1/public/guestbook` | none | Approved messages |
| `POST` | `/v1/public/guestbook` | Turnstile + idempotency | Submit to moderation |
| `GET` | `/v1/public/reactions` | none | Reaction counts |
| `POST` | `/v1/public/reactions` | Turnstile + idempotency | Add one device reaction |
| `PUT` | `/v1/admin/now` | Bearer | Replace current status |
| `POST` | `/v1/admin/ship` | Bearer | Create a manual Ship entry |
| `PUT` | `/v1/admin/ship/{id}` | Bearer | Replace an entry's editable fields |
| `POST` | `/v1/admin/ship/{id}/hide` | Bearer | Hide an entry |
| `GET` | `/v1/admin/guestbook` | Bearer | List moderation queue/history |
| `POST` | `/v1/admin/guestbook/{id}/approve` | Bearer | Approve a message |
| `POST` | `/v1/admin/guestbook/{id}/reject` | Bearer | Reject a message |
| `POST` | `/v1/admin/guestbook/{id}/reply` | Bearer | Add or replace owner reply |
| `POST` | `/v1/webhooks/github` | GitHub HMAC | Import Push/Release Ship entries |

## Health

`GET /healthz`:

```json
{"status":"ok"}
```

`GET /readyz` returns `200` with `{"status":"ready"}` after a successful database ping. It returns `503 not_ready` when SQLite is unavailable.

## Now

`GET /v1/public/now` returns `{"data":null}` before a status exists or while it is hidden. A visible item is:

```json
{
  "data": {
    "status": "working",
    "summary": "Finishing the personal-site backend",
    "detail": "Phase 1 local verification",
    "link_url": "https://beforeugone.com/",
    "visible": true,
    "updated_at": "2026-07-12T08:00:00Z"
  }
}
```

`status` is one of `working`, `learning`, `resting`, or `paused`. Optional empty `detail` and `link_url` are omitted in responses.

`PUT /v1/admin/now` replaces the singleton status:

```json
{
  "status": "learning",
  "summary": "Reading about reliable message delivery",
  "detail": "",
  "link_url": "",
  "visible": true
}
```

`summary` is 1 to 160 characters; `detail` is at most 500; `visible` is required; `link_url` is empty or an absolute HTTP(S) URL. Success returns `200 {"data": ...}` and writes an audit event.

## Ship Log

`GET /v1/public/ship?limit=10&cursor=...` returns newest visible items first:

```json
{
  "items": [
    {
      "id": 12,
      "title": "Phase 1 backend",
      "summary": "Now, Ship Log, guestbook and reactions",
      "url": "https://github.com/beforeugone520/personal-website-beforeugone",
      "source": "manual",
      "occurred_at": "2026-07-12T08:00:00Z",
      "visible": true,
      "created_at": "2026-07-12T08:01:00Z",
      "updated_at": "2026-07-12T08:01:00Z"
    }
  ],
  "next_cursor": null
}
```

Webhook entries use `source` values `github_push` or `github_release` and also include `repository`.

`POST /v1/admin/ship` and `PUT /v1/admin/ship/{id}` accept:

```json
{
  "title": "Phase 1 backend",
  "summary": "Local implementation complete",
  "url": "https://github.com/beforeugone520/personal-website-beforeugone",
  "occurred_at": "2026-07-12T08:00:00Z",
  "visible": true
}
```

`title` is 1 to 120 characters; `summary` is at most 500; `url` is empty or absolute HTTP(S). `occurred_at` defaults to now and `visible` defaults to `true` when omitted. Create returns `201`; replace returns `200`; both wrap the entry in `{"data":...}`. `POST /v1/admin/ship/{id}/hide` returns `204` and preserves the row for audit/history.

## Guestbook

`GET /v1/public/guestbook?limit=20&cursor=...` exposes only approved messages. Public items include `id`, optional `nickname`, `message`, optional `reply`, `created_at`, and optional `replied_at`; moderation state is not exposed.

`POST /v1/public/guestbook` requires an `Idempotency-Key` header and this body:

```json
{
  "nickname": "visitor",
  "message": "Thanks for sharing how the site was built.",
  "visitor_token": "random-browser-token-at-least-16-chars",
  "turnstile_token": "fresh-turnstile-response",
  "website": ""
}
```

- `nickname` is optional and at most 40 characters.
- `message` is 10 to 280 characters.
- `visitor_token` is a browser-generated random token of 16 to 256 bytes. Use an ASCII UUID/random value. The server stores only its keyed hash; it is not a fingerprint or login credential.
- `turnstile_token` must be fresh when Turnstile is configured.
- The verified Turnstile `hostname` must appear in `TURNSTILE_ALLOWED_HOSTNAMES`.
- `website` is a honeypot and must remain empty. Do not visually label or autofill it.

Accepted submissions return `202` and are never immediately public:

```json
{
  "data": {"id": 42, "status": "pending"},
  "message": "Thanks. Your message is awaiting review."
}
```

`GET /v1/admin/guestbook?status=pending&limit=20&cursor=...` accepts an empty status or `pending`, `approved`, `rejected`. Admin items also include `status`, `moderated_at`, and `updated_at` when present.

Approve and reject requests have no JSON body. They return `200 {"data":...}`. A reply uses:

```json
{"reply":"Thanks for the thoughtful note."}
```

`reply` is 1 to 500 characters. Replying does not itself approve a pending/rejected entry; call the approval route separately when it should become public.

## Reactions

The four stable reaction keys are `resonated`, `learned`, `want_more`, and `confused`.

`GET /v1/public/reactions?page_key=%2Fposts%2Fhello-world.html` returns all keys, including zero counts:

```json
{
  "page_key": "/posts/hello-world.html",
  "counts": {
    "resonated": 3,
    "learned": 5,
    "want_more": 1,
    "confused": 0
  }
}
```

`page_key` must be a canonical site path such as `/posts/hello-world.html`: it starts with `/`, is either `/` or ends in `.html`, uses only ASCII letters, digits, `/`, `.`, `_`, and `-`, has no doubled/path-traversal segment, and is at most 200 characters. It must also appear exactly in the server's comma-separated `REACTION_PAGE_KEYS` allowlist; unknown article paths are rejected for reads and writes.

`POST /v1/public/reactions` requires `Idempotency-Key` and:

```json
{
  "page_key": "/posts/hello-world.html",
  "reaction_type": "learned",
  "visitor_token": "random-browser-token-at-least-16-chars",
  "turnstile_token": "fresh-turnstile-response"
}
```

Success returns current counts and whether this device/type pair was newly inserted:

```json
{
  "accepted": true,
  "counts": {
    "resonated": 3,
    "learned": 6,
    "want_more": 1,
    "confused": 0
  }
}
```

The same visitor may select several reaction types, but each type is counted once per `page_key`.

## Public Write Rules

Both public POST routes apply these rules:

1. `Idempotency-Key` is required, 8 to 128 characters, using only letters, digits, `.`, `_`, `:`, or `-`.
2. Retrying the same key and the same logical content returns the stored status/body with `Idempotency-Replayed: true`. The Turnstile response is deliberately excluded from the semantic request hash, so a failed attempt can retry with a fresh Turnstile token and the same idempotency key.
3. Reusing a key with different nickname/message/visitor fields or different page/reaction/visitor fields returns `409 idempotency_conflict`.
4. The API serializes concurrent requests sharing one endpoint/idempotency key. It also derives a stable UUID from that key for Cloudflare Siteverify retries, so a lost verification response does not force the same Turnstile token to be redeemed twice.
5. Application rate limiting uses the direct client address by default. With `TRUST_PROXY_HEADERS=true`, it accepts `X-BeforeU-Client-IP` only from a loopback peer. The supplied Caddy config validates Cloudflare's proxy chain and overwrites that internal header with Caddy's parsed client IP.
6. When `TURNSTILE_SECRET` is empty, public writes return `503 public_writes_disabled`. The only bypass is `ALLOW_INSECURE_PUBLIC_WRITES=true` together with `STATIC_DIR`, which is restricted to local previews.
7. `429` includes `Retry-After`. The UI should keep user input and retry with the same key only for the same logical operation.

## Admin Authentication

All `/v1/admin/*` routes require:

```http
Authorization: Bearer <ADMIN_TOKEN>
```

If `ADMIN_TOKEN` is empty, admin routes return `503 admin_disabled`; an invalid token returns `401` with `WWW-Authenticate: Bearer`. Production Caddy additionally returns `404` for these paths at the public edge, so use server-local access or an SSH tunnel. Admin mutations are recorded in `audit_log` with their request ID.

## GitHub Webhook

`POST /v1/webhooks/github` requires:

- `X-Hub-Signature-256: sha256=<HMAC>` using `GITHUB_WEBHOOK_SECRET`.
- A unique `X-GitHub-Delivery` of 8 to 128 characters.
- `X-GitHub-Event` equal to `ping`, `push`, or `release`.
- A payload repository `full_name` present in `GITHUB_ALLOWED_REPOSITORIES`.

`ping` returns `200 {"pong":true}`. Pushes with commits and releases whose action is `published` create one visible Ship item. Other supported-event payloads can return `202 {"accepted":false}` without creating an item. Replayed deliveries also return `202`, add `Idempotency-Replayed: true`, and do not duplicate data. Unsupported events return `400`; invalid signatures return `401`; non-allowlisted repositories return `403`.
