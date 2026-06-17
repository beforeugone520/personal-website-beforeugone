# BeforeUgone

Bruce 的个人站 —— 一个能用 AI 出活的 vibe coder 的写作、作品与跨栈工具栈。

线上地址：<https://beforeugone520.github.io/personal-website-beforeugone/>

## 结构

- `index.html` —— 主页（关于 / 作品 / 写作 / 工具栈 / 联系）
- `blog.html` —— 写作目录
- `posts/` —— 文章页（每篇一个 HTML 文件）
- `css/site.css` —— 共享设计系统（改主题只改这里）

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

产物文件名无 hash，三页引用带 `?v=<短哈希>` 缓存戳。**重建后须更新这个戳**，否则浏览器吃旧缓存：

```bash
shasum -a 256 assets/theme-slider.js | cut -c1-8   # 取新短哈希，替换三页 ?v=
```
