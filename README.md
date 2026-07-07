# BeforeUgone

个人站 —— 写作、作品与跨栈工具栈。

线上地址：<https://beforeugone.com/>（GitHub Pages + 自定义域名）

## 结构

- `index.html` —— 主页（作品 / 写作 / 工具栈 / 联系）
- `blog.html` —— 写作目录
- `posts/` —— 文章页（每篇一个 HTML 文件）
- `css/site.css` —— 共享设计系统（改主题只改这里）
- `404.html` / `robots.txt` / `sitemap.xml` —— Pages 自定义 404 与 SEO 基建
- `assets/og.png` —— 社交分享卡片图（1200×630 静态资源，改品牌文案时需重新生成）
- `scripts/bump-cache-stamp.sh` —— 重建滑块产物后一键同步全站 `?v=` 缓存戳

主体纯静态、托管于 GitHub Pages；唯一例外是导航的主题滑块 widget，需构建（见下）。

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
