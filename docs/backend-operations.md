# Phase 1 后端部署与运维

> 当前状态：Phase 1 已于 2026-07-13 部署到 Hermes；`api.beforeugone.com` 经 Cloudflare/Caddy 提供服务，`beforeugone.com` 仍由 GitHub Pages 托管。核心生产路径已验收，真实浏览器 Turnstile 写入和代码回滚演练仍待完成。仓库中的后端 GitHub activity snapshot 属于待发布变更，尚未部署或完成生产配置与验收。

服务器 OpenClaw 的日常巡检、故障处理和操作授权边界见 [`openclaw-backend-operations.md`](openclaw-backend-operations.md)。本文件仍是人类维护的部署、恢复与回滚基准。

## 1. 边界与拓扑

```text
beforeugone.com -> Cloudflare -> GitHub Pages
api.beforeugone.com -> Cloudflare -> Azure NSG :443 -> Caddy
                                                    -> 127.0.0.1:8787 beforeu-api
                                                    -> /var/lib/beforeu-api/beforeu.db
OpenClaw Gateway -> 127.0.0.1:18789（Phase 1 不连接）
```

- 不把静态站文件、主题滑块或文章迁到 Azure。
- Azure NSG 不开放 `8787` 和 `18789`；公网只进入 Caddy 的 `80/443`。
- [`deploy/Caddyfile.example`](../deploy/Caddyfile.example) 在公网入口直接隐藏 `/v1/admin/*`。管理操作从服务器本机执行，或通过 Tailscale SSH/普通 SSH 隧道访问 loopback。
- Cloudflare 负责边缘 TLS、基础 WAF 和第一层写入限流；Go 服务仍执行正文校验、Turnstile、应用层限流、幂等和审计。
- 浏览器不得获得 `ADMIN_TOKEN`、`TURNSTILE_SECRET`、`GITHUB_WEBHOOK_SECRET`、`GITHUB_API_TOKEN`、模型密钥或 OpenClaw 凭据。

## 2. 配置

以 [`backend/.env.example`](../backend/.env.example) 为唯一变量清单。systemd 从 `/etc/beforeu-api.env` 读取它，文件应由 `root` 持有并设置为 `0600`。

| 变量 | 生产建议 | 说明 |
| --- | --- | --- |
| `LISTEN_ADDR` | `127.0.0.1:8787` | 只监听 loopback，不能改成公网地址 |
| `DATABASE_PATH` | `/var/lib/beforeu-api/beforeu.db` | SQLite 主文件；`-wal` 和 `-shm` 由程序管理 |
| `ADMIN_TOKEN` | 独立随机值，至少 32 字节 | 管理接口 Bearer token，不得进入 Git、浏览器或日志 |
| `ANONYMIZATION_SECRET` | 独立随机值，至少 32 字节 | 匿名访客标识 HMAC；轮换会重置匿名去重语义 |
| `CORS_ALLOWED_ORIGINS` | `https://beforeugone.com` | 逗号分隔的完整 Origin，不要使用 `*` |
| `REACTION_PAGE_KEYS` | `/posts/hello-world.html` 等 | 逗号分隔的回应页面白名单；新增文章组件时同步增加 |
| `TURNSTILE_SECRET` | Cloudflare secret key | 公开写接口的服务端校验凭据 |
| `TURNSTILE_VERIFY_URL` | 保持示例默认值 | 仅测试时指向受控的模拟端点 |
| `TURNSTILE_ALLOWED_HOSTNAMES` | `beforeugone.com` | Siteverify 返回的 hostname 白名单 |
| `ALLOW_INSECURE_PUBLIC_WRITES` | `false` | 仅本地静态预览可用；生产不得开启 |
| `GITHUB_WEBHOOK_SECRET` | 独立随机值 | GitHub webhook HMAC secret |
| `GITHUB_ALLOWED_REPOSITORIES` | `owner/repo` 逗号列表 | 与 webhook secret 同时配置或同时留空 |
| `GITHUB_USERNAME` | `beforeugone520` | 后台 activity snapshot 读取的公开 GitHub 用户名 |
| `GITHUB_API_TOKEN` | 可选的最小权限公开只读 token | 配置时通过官方 GraphQL 刷新，禁止 classic `read:user`/`user`/`repo` scope、私有仓库访问及可读取非公开贡献的 fine-grained account permission；留空时通过 GitHub REST 与公开 contributions HTML 刷新 |
| `GITHUB_REFRESH_INTERVAL` | `15m` | 后台初次刷新后的周期；正数 Go duration |
| `GITHUB_REQUEST_TIMEOUT` | `10s` | 每次 GitHub 上游请求的超时；正数 Go duration |
| `STATIC_DIR` | 留空 | 仅用于本地开发；生产静态站仍在 GitHub Pages |
| `PUBLIC_WRITE_RATE_LIMIT` | `10` | 每个窗口允许的公共写请求数 |
| `PUBLIC_WRITE_RATE_WINDOW` | `1m` | Go duration，例如 `30s`、`1m` |
| `TRUST_PROXY_HEADERS` | `true` | 只信任 loopback Caddy 覆盖写入的 `X-BeforeU-Client-IP` |
| `SHUTDOWN_TIMEOUT` | `10s` | 优雅关闭等待时间 |

生成 `ADMIN_TOKEN`、`ANONYMIZATION_SECRET` 和 webhook secret 时分别执行 `openssl rand -hex 32`，三个值不能复用。程序要求前两者以及启用后的 webhook secret 至少 32 个字符。`GITHUB_API_TOKEN` 不是上线前提；留空时后台使用无认证的 GitHub REST 与公开 contributions HTML 刷新。若以后配置 token，应在 GitHub 中单独创建并限制为公开读取；不要授予 classic `read:user`、`user`、`repo` scope、任何私有仓库访问或可读取非公开贡献的 fine-grained account permission。服务会拒绝响应头明确暴露这些 broad classic scope 的 token，但部署者仍必须核对 fine-grained 权限。它不能复用 webhook secret 或任何管理 token。`TURNSTILE_SECRET` 为空时读取接口仍可用，但所有公开写入都会返回 `503`；生产不得借助本地预览开关绕过。不要把真实值写回 `.env.example`。

## 3. 构建与首次安装

后端模块要求 Go 1.25.0 或更新版本；生产候选使用仍受支持的最新补丁版工具链。在开发机或 CI 构建，避免在 1 GB 的 Hermes 上做无必要的编译：

```bash
cd backend
go test ./...
mkdir -p ../build
CGO_ENABLED=0 go build -trimpath -ldflags='-s -w' -o ../build/beforeu-api .
```

将二进制和仓库中的运维文件传到服务器后执行：

```bash
sudo useradd --system --home /var/lib/beforeu-api --shell /usr/sbin/nologin beforeu-api
sudo install -d -o beforeu-api -g beforeu-api -m 0750 /var/lib/beforeu-api
sudo install -d -o beforeu-api -g beforeu-api -m 0700 /var/backups/beforeu-api
sudo install -d -o root -g root -m 0755 /opt/beforeu/scripts

sudo install -o root -g root -m 0755 build/beforeu-api /usr/local/bin/beforeu-api
sudo install -o root -g root -m 0755 scripts/backup-backend.sh /opt/beforeu/scripts/backup-backend.sh
sudo install -o root -g root -m 0644 deploy/beforeu-api.service /etc/systemd/system/
sudo install -o root -g root -m 0644 deploy/beforeu-api-backup.service /etc/systemd/system/
sudo install -o root -g root -m 0644 deploy/beforeu-api-backup.timer /etc/systemd/system/
sudo install -o root -g root -m 0600 backend/.env.example /etc/beforeu-api.env
sudoedit /etc/beforeu-api.env

sudo systemctl daemon-reload
sudo systemctl enable --now beforeu-api.service
sudo systemctl enable --now beforeu-api-backup.timer
```

`beforeu-api` 启动时会打开 SQLite、启用 WAL/foreign keys/busy timeout，并按文件名顺序应用尚未执行的嵌入式 migration。启动失败时不要手工修改 `schema_migrations`，先看日志：

```bash
sudo systemctl status beforeu-api --no-pager
sudo journalctl -u beforeu-api -n 100 --no-pager
```

## 4. Caddy 与 Cloudflare

安装并校验 Caddy 样例：

```bash
sudo install -o root -g root -m 0644 deploy/Caddyfile.example /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

样例 Caddy 会校验 Cloudflare 代理链、覆盖内部客户端 IP 头、拒绝从公网 IP 直连 origin，并隐藏管理路由。样例内的 Cloudflare CIDR 必须定期与 `https://www.cloudflare.com/ips/` 对照；更新范围后重新执行 `caddy validate`。

Cloudflare 侧：

1. 仅为 `api.beforeugone.com` 建立指向 `20.89.43.110` 的 A 记录，`beforeugone.com` 继续指向 GitHub Pages。
2. 首次证书引导优先直接尝试橙云：加载 Caddy 配置并观察证书签发日志。如果 Cloudflare 的强制 HTTPS 与 Full (strict) 在源站尚无证书时阻断 ACME，则临时把该记录切为 DNS only，让 Caddy 完成 HTTP-01；确认 `https://api.beforeugone.com/healthz` 的公开证书有效后立刻恢复橙云。不要在此过程中公开 `8787` 或放开管理路由。
3. SSL/TLS 模式使用 Full (strict)，确认 Caddy 的源站证书有效后再发布静态动态入口。
4. 对 `POST /v1/public/*` 配置边缘限流；阈值应比应用层略宽，避免正常重试被双重阻断。
5. 对 `/v1/admin/*` 不建立绕过规则。样例 Caddy 返回 `404`，管理请求走本机或 SSH 隧道。
6. 橙云恢复并验证后，把 Azure NSG 的 `80/443` 来源限制为 Cloudflare 当前公布的 IP 段。Caddy 自身也拒绝非 Cloudflare公网来源，不能只依赖 DNS 橙云隐藏 origin。
7. 保持 `TRUST_PROXY_HEADERS=true`。Go 服务只接受来自 loopback 的 `X-BeforeU-Client-IP`，而样例 Caddy 会在验证代理链后覆盖该头；不要把 `8787` 改为公网监听。

部署前复核 NSG：公网不得访问 `8787`、`18789`、SQLite 文件、备份目录或 systemd 环境文件。

### 静态前端切流

API 先通过外部健康检查后，再发布 GitHub Pages 的动态入口：

1. 页面里的 `<meta name="beforeu-api-base" content="">` 留空时，非 localhost 页面默认请求 `https://api.beforeugone.com`；预览环境可填完整的受控 API origin。
2. 首页和带回应组件文章的 `<meta name="beforeu-turnstile-site-key">` 已写入生产公开 site key；轮换 widget 时必须同步所有页面。Secret 仍只存在于服务器环境文件。
3. 保持 `CORS_ALLOWED_ORIGINS=https://beforeugone.com`。只有确实存在的预览站才加入第二个完整 Origin，不使用通配符。
4. 确认每个带回应组件的 `data-page-key` 都精确列在 `REACTION_PAGE_KEYS`；未列入的页面读取和写入都返回 `invalid_page_key`。
5. API 基址或 site key 改动仍作为静态站提交到 GitHub Pages；不能为了注入配置把页面搬到 VM。

动态读取有短超时并各自降级。上线时仍要实际断开 API 复核首页和文章正文，而不是只检查正常路径。

### 2026-07-13 生产验收记录

- `beforeu-api`、Caddy、备份 timer 均已启用；OpenClaw Gateway 仍只监听 `127.0.0.1:18789`。
- Cloudflare DNS 与 Full (strict) 已生效；公网 `/healthz`、`/readyz` 和当时已有的公开读取返回 `200`，直连 origin 返回 `403`，公网管理路由返回 `404`。
- 已写入生产 Turnstile site key/secret，缺失 token 的公开写入返回 `400 turnstile_failed`。自动化浏览器无法取得真实 widget token，因此仍需用普通浏览器完成一次留言提交、审核、公开和移除闭环。
- GitHub webhook 的 ping 和真实 push 均成功；重送同一 delivery 后 Ship 条目数不变，幂等验证通过。
- 已生成在线 SQLite 备份，校验 SHA-256，将归档解压到临时数据库并通过 `PRAGMA quick_check`；服务重启后 Now/Ship 数据仍存在。
- GitHub Pages 已发布动态前端；本地浏览器回归覆盖留言和回应写入，生产浏览器回归覆盖桌面、390/320 px、终端、动态读取和 API 失败降级。真实 Turnstile token 写入仍按上项保留。
- Azure NSG 的 Cloudflare-only 来源限制尚未从本机控制面复核；Caddy 的 Cloudflare CIDR gate 已验证会拒绝直接 origin 请求。

### GitHub activity snapshot 待发布清单

下面各项均未包含在 2026-07-13 验收记录中，完成前不得声称新 activity 路径已部署：

1. 在开发机对包含 `0002_github_activity_cache.sql` 的候选版本运行 `go test ./...`、`go vet ./...`，构建并记录 commit 与 SHA-256。
2. 先完成并校验一次 WAL 一致性备份，再按版本化二进制流程部署；启动后只读确认 `schema_migrations` 已记录 `0002_github_activity_cache.sql`，且进程没有重启循环。
3. 经用户确认后，在 `/etc/beforeu-api.env` 增加 `GITHUB_USERNAME`、`GITHUB_REFRESH_INTERVAL`、`GITHUB_REQUEST_TIMEOUT`；`GITHUB_API_TOKEN` 可留空以启用无认证 fallback。若选择配置 token，只能从受控密码管理位置写入公开只读 token，并明确排除 `read:user`/`user`/`repo`、私有访问和可读取非公开贡献的权限；不得在终端回显、聊天、日志或仓库中展示 token。
4. 重启后确认后台首次刷新成功并记录实际数据源模式，SQLite 中存在 last-good singleton；随后确认 15 分钟周期刷新会原子更新时间且失败不会清空旧快照。
5. 在无 token 模式下确认 GitHub REST 仓库元数据与公开 rolling contributions HTML 能生成完整快照；再以受控的 HTML 解析或上游失败验证匹配用户名的旧快照继续返回 `200`，`/healthz` 与 `/readyz` 不受影响，空缓存或用户名不匹配的缓存返回 `503`。同时验证 local 与 public `GET /v1/public/github` 的完整数据和 `Cache-Control: public, max-age=300, stale-while-revalidate=3600`。
6. 发布 GitHub Pages 前端后，在桌面、390 px、320 px、深浅主题、键盘和 reduced-motion 下检查 activity 布局；断开 API 时静态作品与正文仍须可读。
7. 发送一次受控的已签名、白名单内 push webhook，确认 Ship delivery 仍幂等，且可唤醒刷新但 webhook 响应不等待 GitHub 上游。
8. 观察至少 10 分钟的 API journal、Caddy 5xx、GitHub refresh 错误、内存和数据库增长，再把本文件、OpenClaw 手册中的生产基线、commit 与 checksum 更新为实测值。

## 5. Turnstile

1. 在 Cloudflare Turnstile 创建 widget，允许 hostname `beforeugone.com`。
2. site key 只用于静态前端；secret key 只写入服务器的 `TURNSTILE_SECRET`。
3. 公开写请求发送刚取得且未重复使用的 token；后端向 `TURNSTILE_VERIFY_URL` 验证。
4. 后端同时校验 Siteverify 的 `success` 与 `hostname`，并用公开请求的幂等键派生 Siteverify 重试 UUID。上线前分别验证有效 token、缺失 token、过期/重复 token 和错误 hostname。失败请求必须保持留言文本可重试，不能绕过审核直接公开。

生产环境不能通过清空 secret 来“临时关闭验证码”。需要排障时优先在 Cloudflare 或应用日志定位，必要时暂时关闭公开写入口。

## 6. GitHub Activity 与 Webhook

### Activity snapshot

浏览器只调用 `GET /v1/public/github`，不得直接调用 GitHub GraphQL、REST 或 contributions HTML，不得把 `GITHUB_API_TOKEN` 放进静态资源，也不得把公开请求变成同步 GitHub 代理。服务启动会立即尝试刷新，此后按 `GITHUB_REFRESH_INTERVAL` 运行；每次上游请求受 `GITHUB_REQUEST_TIMEOUT` 限制。配置 token 时使用官方 GitHub GraphQL；未配置时组合 GitHub REST 的公开仓库元数据与 GitHub 公开 rolling contributions HTML，且包括 Webhook 唤醒在内的无 token 尝试至少间隔 2 分钟。任一模式只有在结果完整并通过校验后，才原子替换 `github_activity_cache` 的 last-good singleton。

rolling contributions HTML 是 GitHub 的内部公开网页接口，不是稳定的版本化 API；其日历按完整周对齐，完整连续窗口可包含 365 至 371 天。页面结构变化、超出该范围或解析失败按普通上游刷新失败处理。此时保留旧快照并记录去敏错误；有与当前 `GITHUB_USERNAME` 匹配的快照时 public route 继续返回 `200` 和原 `refreshed_at`，没有匹配快照时返回 `503`。`/healthz` 不依赖 GitHub，`/readyz` 仍只表示 SQLite 可用；HTML 解析失败不会改变二者，activity 新鲜度要单独看响应中的 `refreshed_at` 和 refresh 日志。

### Webhook

仓库 Settings -> Webhooks 中配置：

- Payload URL：`https://api.beforeugone.com/v1/webhooks/github`
- Content type：`application/json`
- Secret：与 `GITHUB_WEBHOOK_SECRET` 完全一致
- Events：只选择 Push 和 Releases
- Active：开启

同时把完整的 `owner/repository` 写入 `GITHUB_ALLOWED_REPOSITORIES`。后端必须同时通过 `X-Hub-Signature-256`、`X-GitHub-Delivery` 去重、事件类型和仓库白名单检查，不能只依赖 GitHub 来源 IP。重送相同 delivery 不应生成第二条 Ship；不支持的事件返回 `400` 且不写库。

已验证且接受的 push/release delivery 可以向后台 refresher 发送非阻塞唤醒信号。无 token 模式会合并 2 分钟窗口内的重复尝试，避免耗尽 GitHub 未认证 REST 限额。该信号只是尽快刷新 activity 的提示：Webhook 的成功、幂等与响应时间不能依赖任一 GitHub 上游是否可用。

## 7. 健康检查

```bash
curl --fail --silent --show-error http://127.0.0.1:8787/healthz
curl --fail --silent --show-error http://127.0.0.1:8787/readyz
curl --fail --silent --show-error https://api.beforeugone.com/healthz
curl --fail --silent --show-error -D - https://api.beforeugone.com/v1/public/github -o /dev/null
sudo -u beforeu-api sqlite3 -readonly /var/lib/beforeu-api/beforeu.db \
  "SELECT fetched_at FROM github_activity_cache WHERE id=1;"
```

- `/healthz` 表示进程及 HTTP handler 存活，不应依赖外部服务。
- `/readyz` 会检查 SQLite；失败时 Caddy 不应继续把新流量发给该实例。
- 外部监控使用 `/healthz`，部署与重启判断使用 `/readyz`。
- GitHub activity 应额外检查 HTTP 状态、`Cache-Control` 和 `data.refreshed_at`；不要把旧快照或 contributions HTML 解析失败误报成服务宕机，也不要仅凭 `200` 断言后台刷新正常。

还应抽查首页：API 不可用时 `Now`、Ship Log、留言等动态区静默隐藏或显示局部错误，静态作品、文章与联系方式必须仍可阅读。

## 8. 管理访问

推荐建立 SSH 隧道，不把管理路由暴露到 Cloudflare：

```bash
ssh -L 8787:127.0.0.1:8787 hermes
export BEFOREU_ADMIN_TOKEN='从密码管理器读取'
curl --fail \
  -H "Authorization: Bearer $BEFOREU_ADMIN_TOKEN" \
  http://127.0.0.1:8787/v1/admin/guestbook?status=pending
```

Tailscale 负责管理面接入和 SSH，不能用来把 OpenClaw `18789` 转成公开服务。管理 token 怀疑泄漏时立即更换 `/etc/beforeu-api.env` 中的值并重启 API，然后检查 `audit_log` 和 Caddy 日志。

## 9. 备份

安装 `sqlite3`、`gzip`、`sha256sum` 和 `flock` 后，timer 每日执行 [`scripts/backup-backend.sh`](../scripts/backup-backend.sh)。脚本使用 SQLite online backup API，而不是直接复制 `.db` 文件，因此会一致地包含已经提交到 WAL 的页面。备份 unit 允许专用 `beforeu-api` 用户在状态目录创建或恢复 WAL/SHM 元数据；把源目录强制设为只读会导致停服时的备份失败。

默认策略：

- 每日备份保留 14 天。
- 每周日额外复制一份周备，保留 84 天。
- 每个 gzip 归档都生成 SHA-256 文件并执行 `PRAGMA quick_check`。
- 可用 `BEFOREU_BACKUP_DIR`、`BEFOREU_BACKUP_DAILY_DAYS`、`BEFOREU_BACKUP_WEEKLY_DAYS` 调整目录和保留期。

手动验证：

```bash
sudo systemctl start beforeu-api-backup.service
sudo journalctl -u beforeu-api-backup -n 50 --no-pager
sudo -u beforeu-api find /var/backups/beforeu-api -maxdepth 2 -type f -print
```

备份仍在同一台 VM 上不算完整灾备。部署后应把加密副本同步到 Azure Blob 或另一受控位置，并至少做一次离机恢复演练。

## 10. 恢复

以下示例中的归档和数据库路径应与 `/etc/beforeu-api.env` 一致：

```bash
archive=/var/backups/beforeu-api/daily/beforeu-YYYYMMDDTHHMMSSZ.sqlite3.gz
cd "$(dirname "$archive")"
sudo -u beforeu-api sha256sum -c "$(basename "$archive").sha256"
sudo -u beforeu-api sh -c 'gzip -dc "$1" > "$2"' sh \
  "$archive" /var/lib/beforeu-api/restore.tmp
sudo -u beforeu-api sqlite3 /var/lib/beforeu-api/restore.tmp 'PRAGMA quick_check;'

sudo systemctl stop beforeu-api
sudo mv /var/lib/beforeu-api/beforeu.db /var/lib/beforeu-api/beforeu.db.pre-restore
sudo rm -f /var/lib/beforeu-api/beforeu.db-wal /var/lib/beforeu-api/beforeu.db-shm
sudo mv /var/lib/beforeu-api/restore.tmp /var/lib/beforeu-api/beforeu.db
sudo chown beforeu-api:beforeu-api /var/lib/beforeu-api/beforeu.db
sudo chmod 0600 /var/lib/beforeu-api/beforeu.db
sudo systemctl start beforeu-api
curl --fail http://127.0.0.1:8787/readyz
```

确认数据后再删除 `.pre-restore`。任何恢复都要记录归档名、原因、操作者和验证结果。

## 11. 发布与回滚

每次发布按以下顺序：

1. 在干净检出中运行 `go test ./...` 并构建带提交 SHA 的二进制。
2. 记录当前二进制 SHA-256，手动触发一次一致性备份并验证归档。
3. 把新二进制安装为临时文件，再原子替换 `/usr/local/bin/beforeu-api`。
4. `systemctl restart beforeu-api`，随后检查 `/readyz`、公共读取、一次受控管理读取以及静态站降级。
5. 观察 journal、Caddy 5xx 和资源占用至少 10 分钟。

Hermes 当前只有活动 API 二进制，没有可直接使用的历史 API 二进制。下一次发布覆盖前必须把当前文件保存为带 UTC 时间与旧 commit 的版本化 rollback artifact，并记录 SHA-256；不能把旧默认 Caddy 配置备份当作 API 回滚包。

回滚代码时恢复上一版本二进制。若新版本已经执行了旧二进制不理解的 schema migration，则必须同时恢复发布前数据库；不能只降级二进制。回滚后再次执行健康检查和一条真实读取，不以“进程正在运行”代替业务验证。
