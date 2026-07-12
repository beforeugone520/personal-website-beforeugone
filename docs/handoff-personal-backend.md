# BeforeUgone 个人站动态后端与 Agent 中枢 Handoff

> 状态：Phase 1 已在仓库本地实现，尚未部署到 Hermes/Azure，也未完成生产验收；Phase 2 至 Phase 4 仍为方案
> 定稿日期：2026-07-12

## 1. 目标

在不迁移现有静态站的前提下，为 `beforeugone.com` 增加一个轻量动态后端，并逐步发展成自有的 OpenClaw 消息入口。

最终形态不是普通留言板，也不是简单复刻微信聊天，而是一个单用户的私人 Agent 中枢：

- 个人站拥有实时状态、发布日志、留言、轻回应和互动数据。
- 用户通过自己的 PWA 或 HarmonyOS 客户端与 OpenClaw 双向通信。
- OpenClaw 可以主动推送任务完成、失败、审批和服务器告警。
- 长任务显示阶段、工具调用、产物和失败原因，不再是聊天黑箱。
- 微信降级为可选备用通道，而不是主入口。

## 2. 当前基线

- 主站：`https://beforeugone.com/`。
- 托管：GitHub Pages；域名和边缘能力由 Cloudflare 管理。
- 仓库：`beforeugone520/personal-website-beforeugone`。
- 前端：主体为静态 HTML/CSS/JavaScript；主题滑块是独立 Vue/Vite 子工程。
- 已有动态感：GitHub 仓库动态、贡献热力图、终端模式、Konami 彩蛋。
- 仓库现有 Phase 1 Go/SQLite API、静态动态层和部署样例；生产域名目前仍没有经过验收的自建业务 API。
- Hermes 已安装 Caddy 2.11.4 和 `sqlite3`，但 systemd/Caddy 配置、secret、DNS 和数据恢复演练尚未应用。
- 决策：不把静态前端迁到 Azure，Azure 只承载轻量 API、消息中继和 OpenClaw 集成。
- Phase 1 的实际接口以 [`backend-api.md`](backend-api.md) 为准，部署与恢复以 [`backend-operations.md`](backend-operations.md) 为准。

## 3. 产品范围

### 3.1 个人站动态层

动态层候选能力如下；Phase 1 本地实现了第 1 至 4 项，第 5 至 8 项尚未实现：

1. `Now`：首页显示站主当前状态和更新时间；支持从 OpenClaw 或管理端修改。
2. `Ship Log`：聚合 GitHub Push/Release 与手动记录，形成简洁的完成事项时间流。
3. 留一句话：匿名或昵称留言，先审后发，可显示站主回复。
4. 文章轻回应：有共鸣、学到了、想看后续、没看懂；无需账号，每设备每篇每类一次。
5. 项目催更：按项目计数，按周汇总，不逐次打扰。
6. 隐私友好统计：只保留按日聚合的页面、来源和大区数据，不保存完整 IP，不做浏览器指纹。
7. 时间胶囊：内容在指定日期自动公开。
8. Idea Incubator：公开想法、状态和轻量“我也想要”计数。

现有终端增加动态命令：

```text
now
ship
random
guestbook
status
ask <question>
uptime
```

`ask` 只能检索公开博客、项目介绍和公开 README；不得连接 OpenClaw 私人记忆、系统工具或服务器文件。

### 3.2 BeforeU Relay

`claw.beforeugone.com` 作为可安装 PWA，后续由 `Harmony-Claw` 提供鸿蒙原生客户端。

核心能力：

- 文字、图片、文件和语音消息。
- 流式回复、历史记录、已读状态和离线队列。
- 多 Agent、多会话与会话搜索。
- 任务状态：排队、运行、等待确认、完成、失败、取消。
- 工具调用时间线与可折叠详情。
- 审批中心：执行命令、修改文件、删除数据、发布网站、对外发送信息。
- 主动通知：GitHub、网站留言、定时任务、服务器和模型节点告警。
- 产物中心：预览、下载、任务归属、过期清理。
- 通知级别：静默、普通、重要、必须确认。

## 4. 选定架构

```text
beforeugone.com (GitHub Pages)
        |
        | HTTPS
        v
api.beforeugone.com (Cloudflare)
        |
        v
Caddy -> BeforeU Relay API -> SQLite
                  |
                  | localhost WebSocket
                  v
        OpenClaw Gateway 127.0.0.1:18789

claw.beforeugone.com (PWA) ---- HTTPS/WebSocket ----^
Harmony-Claw (later) ---------- HTTPS/WebSocket ----^
```

关键边界：

- OpenClaw Gateway 始终保持 loopback，不直接暴露公网。
- 浏览器和手机永远拿不到 Gateway operator token。
- Relay 后端负责客户端认证、设备配对、消息持久化、离线队列和推送。
- 最终使用 `openclaw-channel-beforeu` 自定义 Channel 插件，使回复、主动消息、附件和会话路由成为 OpenClaw 原生通道。
- Webhook 只适合早期验证，不作为最终消息协议。
- PWA 可以继续静态托管；动态状态全部经 API 获取，失败时静默降级，不影响主站阅读。

## 5. 建议技术栈

- Relay API：Go 单二进制，优先控制内存和部署复杂度。
- 数据库：SQLite，开启 WAL；每日生成一致性备份。
- 反向代理和 TLS：Caddy。
- 实时传输：WebSocket；普通公开读取接口可用 HTTP cache。
- 前端：现有静态站继续 Vanilla JS；Relay PWA 可独立使用 React/Vite 或轻量前端栈。
- 包管理：JavaScript/TypeScript 一律使用 pnpm。
- 文件：MVP 只允许小文件并设置总配额；大文件阶段再接 Azure Blob。
- 推送：PWA 先接 Web Push；HarmonyOS 阶段再评估鸿蒙推送。

## 6. 数据模型

Phase 1 已实现：

| 表 | 用途 |
| --- | --- |
| `now_status` | 当前状态、可见性、更新时间 |
| `ship_entries` | GitHub/手工完成记录及软隐藏 |
| `guestbook_entries` | 留言、审核状态、站主回复 |
| `page_reactions` | 页面与反应类型的匿名去重计数 |
| `idempotency_requests` | 公共写请求的幂等结果 |
| `github_deliveries` | GitHub delivery 去重 |
| `audit_log` | 管理操作和 webhook 写入审计 |

后续阶段草案：

| 表 | 用途 |
| --- | --- |
| `project_nudges` | 项目催更事件与周汇总 |
| `page_metrics_daily` | 隐私友好的日聚合统计 |
| `time_capsules` | 定时公开内容 |
| `ideas` | 想法、状态、兴趣计数 |
| `conversations` | Agent 会话索引 |
| `messages` | 双向消息与投递状态 |
| `tasks` | Agent 任务状态和关联运行 ID |
| `task_events` | 工具、阶段、审批和错误事件流 |
| `artifacts` | 文件元数据、任务归属和过期时间 |
| `devices` | 已配对设备与推送订阅 |

不要在数据库中保存模型密钥、Gateway token 或钥匙串密码。

## 7. API

Phase 1 已实现的详细 JSON、校验、幂等和错误契约见 [`backend-api.md`](backend-api.md)。路由如下：

公开读取：

```text
GET  /healthz
GET  /readyz
GET  /v1/public/now
GET  /v1/public/ship
GET  /v1/public/guestbook
GET  /v1/public/reactions?page_key=...
POST /v1/public/guestbook
POST /v1/public/reactions
```

Phase 1 管理与 webhook：

```text
PUT  /v1/admin/now
POST /v1/admin/ship
PUT  /v1/admin/ship/:id
POST /v1/admin/ship/:id/hide
GET  /v1/admin/guestbook?status=...
POST /v1/admin/guestbook/:id/approve
POST /v1/admin/guestbook/:id/reject
POST /v1/admin/guestbook/:id/reply
POST /v1/webhooks/github
```

后续阶段草案：

已认证客户端：

```text
POST /v1/pair/start
POST /v1/pair/complete
GET  /v1/conversations
GET  /v1/conversations/:id/messages
POST /v1/conversations/:id/messages
POST /v1/tasks/:id/cancel
POST /v1/approvals/:id/resolve
GET  /v1/artifacts/:id
GET  /v1/events/ws
```

后续路由仍允许调整，但任何已实现路由变更都必须同时更新接口文档、前端集成和 operator runbook，不能只改代码。

## 8. 安全要求

- 系统按单用户私人控制台设计，不宣称多租户隔离。
- 初始设备通过 Tailscale 或服务器 CLI 产生的一次性短码配对。
- 每台设备使用独立、可撤销的凭据，不共享管理员密码。
- 公共写接口使用 Cloudflare Turnstile、可信客户端 IP 限流、正文长度限制和审核队列；Turnstile secret 缺失时必须关闭写入而不是绕过验证。
- 推送通知默认不携带敏感正文，只提示“有新消息”，打开客户端后再拉取。
- Phase 1 公共匿名写接口使用幂等键，GitHub webhook 使用 delivery ID 去重；后续消息、任务和审批写接口也必须在实现时设计幂等语义。
- 审批操作写入审计日志；危险动作默认不得自动批准。
- `ask` 公开问答使用单独的公开资料索引和无工具模型调用，防止提示词注入触达私人环境。
- 附件限制 MIME、大小、数量和保存期限；不得直接按用户文件名落盘。

## 9. 分阶段实施

### Phase 1：动态个人站

- [x] 建立 Go API、SQLite migration、systemd 服务和 Caddy 样例。
- [x] 实现 `Now`、`Ship Log`、留言审核、轻回应和 GitHub webhook。
- [x] 主站增加无阻塞动态区域；API 失败时保留静态体验。
- [x] 增加一致性备份脚本、健康检查、应用层限流、幂等和基础审计。
- [ ] 在 Hermes/Azure 安装服务并配置真实 secret。
- [ ] 配置 Cloudflare DNS、Full (strict)、Turnstile、边缘限流和 GitHub webhook。
- [ ] 完成重启、API 故障、真实留言审核、备份恢复和回滚演练。

验收：主站动态功能可用，服务器重启后数据不丢，API 故障不拖垮首页。当前只完成本地代码与自动测试，生产验收尚未达成。

### Phase 2：Relay PWA

- 单用户设备配对。
- 会话列表、文字消息、流式回复、历史记录。
- 离线队列和 Web Push。
- 任务阶段、取消和失败状态。

验收：手机不依赖微信即可稳定收发 OpenClaw 消息，断网重连不重发消息。

### Phase 3：OpenClaw 原生 Channel

- 创建独立的 `openclaw-channel-beforeu` 插件。
- 支持主动消息、附件、回复线程、typing/busy 和投递回执。
- 接入审批、任务事件和产物索引。

验收：定时任务和后台事件可以主动推送到 Relay，回复保持正确会话归属。

### Phase 4：Harmony-Claw

- 将 `Harmony-Claw` 改为 Relay 的鸿蒙原生客户端。
- 增加系统通知、文件选择、语音和设备能力。
- PWA 保留为跨平台备用客户端。

## 10. Azure 部署约束

目标服务器 `Hermes` 当前只有约 898 MiB RAM、2 vCPU 和 2 GiB swap。OpenClaw 已占用主要常驻内存，因此：

- Relay 必须保持单进程和轻依赖。
- 不在服务器运行本地大模型、视频转码或重型数据库。
- 不在服务器构建大型前端；优先由 GitHub Actions 构建静态产物。
- 80/443 可供 Caddy 使用，但部署前仍需复核 Azure NSG 和 Cloudflare DNS。
- OpenClaw 的 `18789` 不得改成公网监听。

## 11. 尚未决定

- Relay PWA 的具体前端栈。
- 首版只通过 Tailscale访问，还是直接启用公开域名和设备配对。
- Web Push 与鸿蒙推送的先后顺序。
- 产物保存到本机磁盘还是首版就接 Azure Blob。

这些决策不阻塞 Phase 1。实现者应先完成数据边界、API 失败降级和安全模型，再设计视觉界面。
