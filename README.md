# BeforeUgone

Bruce 的个人站 —— 一个能用 AI 出活的 vibe coder 的写作、作品与跨栈工具栈。

线上地址：<https://beforeugone520.github.io/personal-website-beforeugone/>

## 结构

- `index.html` —— 主页（关于 / 作品 / 写作 / 工具栈 / 联系）
- `blog.html` —— 写作目录
- `posts/` —— 文章页（每篇一个 HTML 文件）
- `css/site.css` —— 共享设计系统（改主题只改这里）

纯静态，无构建步骤，托管于 GitHub Pages。

## 加一篇新文章

1. 复制 `posts/hello-world.html` 成新文件，改成你的内容；
2. 在 `blog.html` 的列表里取消注释那段模板、填好 `href`、日期、标题。
