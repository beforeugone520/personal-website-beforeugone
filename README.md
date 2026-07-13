# BeforeUgone

个人站 —— 写作、作品与跨栈工具栈。

线上地址：<https://beforeugone.com/>（GitHub Pages + 自定义域名）

## 结构

- `index.html` —— 主页（作品 / 写作 / 工具栈 / 联系）
- `blog.html` —— 写作目录
- `posts/` —— 文章页（每篇一个 HTML 文件）
- `css/site.css` —— 共享设计系统（改主题只改这里）
- `assets/site-dynamic.js` —— Now / Ship Log / GitHub activity / 留言 / 文章回应的静态端接入与失败降级
- `backend/` —— Phase 1 Go API、SQLite migration 与测试
- `deploy/` —— systemd、备份 timer 和 Caddy 的无密钥部署样例
- `docs/backend-api.md` —— 已实现的 Phase 1 HTTP 契约
- `docs/backend-operations.md` —— Cloudflare/Azure 部署、备份、恢复与回滚 runbook
- `docs/openclaw-backend-operations.md` —— 服务器 OpenClaw 日常代管手册与操作授权边界
- `404.html` / `robots.txt` / `sitemap.xml` —— Pages 自定义 404 与 SEO 基建
- `assets/og.png` —— 社交分享卡片图（1200×630 静态资源，改品牌文案时需重新生成）
- `scripts/bump-cache-stamp.sh` —— 重建滑块产物后一键同步全站 `?v=` 缓存戳
- `scripts/backup-backend.sh` —— SQLite WAL 一致性日备与周备

主体纯静态、托管于 GitHub Pages；唯一例外是导航的主题滑块 widget，需构建（见下）。

## 动态后端

Phase 1 已部署到 Hermes/Azure，并通过 Cloudflare/Caddy 由 `https://api.beforeugone.com` 提供 Now、Ship Log、留言审核、文章轻回应、GitHub webhook、健康检查、限流和基础审计。

仓库已加入由后端官方 GitHub GraphQL 周期刷新、SQLite 保存 last-good snapshot 的 GitHub activity 路径；该扩展及其新版首页尚待生产部署、server-only token 配置与验收，不能并入上面的已部署清单。待办以 [`docs/backend-operations.md`](docs/backend-operations.md) 为准。

静态站不迁移，仍由 GitHub Pages 承载；Azure 只运行 `api.beforeugone.com` 的轻量 Go/SQLite 服务。后续 OpenClaw 私人消息中枢仍处于规划阶段。

架构和后续阶段见 [`docs/handoff-personal-backend.md`](docs/handoff-personal-backend.md)，实际 API 与部署步骤分别见 [`docs/backend-api.md`](docs/backend-api.md) 和 [`docs/backend-operations.md`](docs/backend-operations.md)。

本地验证后端：

```bash
cd backend
go test ./...
ANONYMIZATION_SECRET=local-anonymization-secret-32-chars \
ADMIN_TOKEN=local-admin-token-at-least-32-chars \
ALLOW_INSECURE_PUBLIC_WRITES=true \
CORS_ALLOWED_ORIGINS=http://127.0.0.1:8787 \
STATIC_DIR=.. \
go run .
```

然后打开 `http://127.0.0.1:8787/`。本地页面会跳过生产 Turnstile widget；上述不安全写入开关只有在同时设置 `STATIC_DIR` 时才可用。生产必须保持关闭并配置 Turnstile，否则公开写接口会以 `503` 拒绝请求。环境变量全集见 [`backend/.env.example`](backend/.env.example)。

## 加一篇新文章

1. 复制 `posts/hello-world.html` 成新文件，改成你的内容；
2. 在 `blog.html` 的列表里取消注释那段模板、填好 `href`、日期、标题。

## 主题滑块 widget

导航的浅/深主题滑块源码在 `theme-slider/`（Vue + Vite，改自 [`claude-range-slider`](https://github.com/beforeugone520/claude-range-slider)）。**改动后必须重新构建并提交产物**：

```bash
cd theme-slider
pnpm install
pnpm build      # 构建 → assets/theme-slider.js|css
pnpm test       # 跑逻辑单测
```

> esbuild 构建脚本的审批已记在 `theme-slider/pnpm-workspace.yaml`（`allowBuilds: esbuild: true`），所以 `pnpm build` / `pnpm test` 开箱即用。

产物 `assets/theme-slider.js|css` 由 `index.html` / `blog.html` / `posts/*.html` 引用并自挂载到导航 `#theme-slider`；导航只保留滑块作为浅/深主题切换控件。

产物文件名无 hash，各页引用带 `?v=<短哈希>` 缓存戳。**重建后跑一键脚本同步**（手动逐页替换曾出过戳分裂事故——index 与 blog/posts 各挂一个版本）：

```bash
./scripts/bump-cache-stamp.sh   # 取 js 产物短哈希，统一替换所有页面的 ?v=
```
