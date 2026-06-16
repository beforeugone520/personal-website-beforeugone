# 主题滑块 widget · 设计

> 定稿日期：2026-06-16
> 一句话：把 `claude-range-slider`（Vue3 + WebGL2 火焰滑块）当组件**原样迁入**本仓库，做"部分调整"让它控制浅/深主题，构建成一个自挂载 bundle，**缩小后挂到导航替掉 sun/moon 按钮**。

## 背景

- 源组件：<https://github.com/beforeugone520/claude-range-slider>（复刻 Claude Code 的 Low/Med/High/Ultracode 努力滑块）。技术栈：Vue 3.5 + Vite 8 + WebGL2/GLSL；结构为 `EffortCard.vue`（模板+样式）+ 两个 composable（`useSliderState` 业务、`useWebglFire` 引擎）+ `shaders/index.js`。是一张**卡片**，比站点导航的图标按钮大得多。
- 目标站点：`personal-website-beforeugone`，纯静态、托管 GitHub Pages、`data-theme` + `localStorage('bug-theme')` 二态主题系统，导航有 `#themeBtn` sun/moon 按钮，Hero 有 `window.__heroField.retheme()`。
- 用户硬约束：**零成本**（免费静态托管，不买服务器）。构建步骤本身可接受（产物仍是静态文件）。

## 已确认的决策

1. **语义**：二态·华丽开关。滑块拖拽手感连续，**跨中点(50)翻转** light↔dark，滑块自身视觉（火焰）可连续变。不做连续插值主题、不做三档。
2. **路线**：原样迁移源 Vue + WebGL 组件 + 部分调整。**不**用 vanilla 重写，**不**整站迁 Vite。
3. **集成**：源码拷进本仓库 `theme-slider/`，Vite 只产出这个 widget 的 bundle，挂载进现有静态页。
4. **落点**：把卡片**缩小**成导航尺寸的紧凑控件，替掉 `#themeBtn`。

## 架构与集成

- `theme-slider/`：独立 Vue+Vite 工程（`vue` 唯一运行时依赖）。`vite build` 产出**一个自挂载 bundle** → 提交到仓库 `assets/theme-slider.js` + `assets/theme-slider.css`（**提交构建产物，不上 CI**：Pages 直接服务静态文件，零成本、零 GitHub Action）。
- bundle 行为：在页面里找到挂载容器（如 `#theme-slider`）即 `createApp(...).mount()`；找不到则静默退出。
- 三个页面 `index.html` / `blog.html` / `posts/hello-world.html`：**保留**现有 sun/moon 按钮当无增强基线（关 JS / bundle 失败时仍可切主题），在其旁加挂载容器并引 `assets/theme-slider.[js|css]`；bundle 挂载成功后接管主题切换、隐藏按钮。**全站一致**。
- 各页**保留**现有"开屏即从 `localStorage` 设 `data-theme`"的早执行脚本（防闪屏）；widget 仅负责 UI 与"改动时写入"。

## 部分调整（只动这几处，其余原样）

- `useSliderState.js`：`statusLabel` 从 Low/Med/High/Ultracode 改为二态语义；新增"跨中点翻转主题"判定。
- 新增副作用：滑块变化时写 `document.documentElement.dataset.theme`、`localStorage('bug-theme')`，并调用 `window.__heroField?.retheme()`。
- 初始 `sliderValue` 反映当前 `data-theme`（深→满端、浅→低端）。
- 火焰：**保留**，归到"深色/夜"那端当签名视觉。
- 视觉 token 对齐站点 `site.css`（衬线 display + 鸿蒙黑体 + 朱红），剥掉源组件的 DM Sans 与黑底网格背景（那是源 demo 的 `App.vue` 外壳，不迁）。
- 卡片外壳瘦身为紧凑控件（轨道 + knob + 小火苗）以适配导航；移动端在汉堡菜单内给落点。

## 降级与无障碍（守站点纪律）

- 无 WebGL2 / `prefers-reduced-motion` / bundle 加载失败 → **回退到原 sun/moon 按钮**（HTML 里保留按钮作为 `<noscript>`/fallback 基线，bundle 成功挂载后再接管），绝不只剩死控件或白块。
- `prefers-reduced-motion` 下火焰静止（不跑 rAF）。
- 朱红 ≤2×/屏纪律：火焰辉光算"氛围"，不算实心朱红 UI。

## 连带影响（已知，需周知）

- **工作流变化**：改这个 widget 需先 `pnpm build` 再提交产物——"改 HTML 即发布"的简单性在这一块打折。
- **OD 同步**：`assets/theme-slider.[js|css]` 及挂载点改动也纳入自动同步，OD 预览才看得到滑块。
- **体积**：Vue 运行时 + WebGL ≈ 数十 KB，重于现有纯 CSS 按钮。

## 非目标（YAGNI）

- 不做连续插值主题、不做三档 auto。
- 不整站迁 Vite、不引入 CI。
- 不改其它区块、不重写主题系统。

## 风险与兜底

| 风险 | 兜底 |
| --- | --- |
| WebGL2 不支持 / bundle 加载失败 | 回退原 sun/moon 按钮 |
| 火焰在导航小尺寸下像噪点 | "缩小"阶段实测；不行则缩为更克制的微火/去火留辉光 |
| 弱设备性能 | 闲置自动停 rAF（源组件已有）；reduced-motion 静止 |
| 构建产物与源码脱节 | 约定"改 `theme-slider/` 必 `pnpm build` 并提交产物"；写进 README |

## 落地顺序（实现计划展开）

1. 拷源码进 `theme-slider/`，配 Vite 输出自挂载 bundle。
2. 部分调整：`useSliderState` 二态化 + 主题副作用 + 初始同步 + token 对齐 + 外壳瘦身。
3. 三页接入：替换按钮为容器 + 引 bundle，保留早执行防闪脚本与按钮 fallback。
4. 降级/ a11y：WebGL2 探测、reduced-motion、加载失败回退。
5. 构建产物提交；README 记工作流；同步 OD。

## 验证标准

- 拖动滑块跨中点 → 全站主题翻转、Hero 重染、刷新记忆保持；三页一致。
- 无 WebGL2 / reduced-motion / 关 JS → 有可用的主题切换兜底，不白块。
- 朱红仍克制；导航布局不被撑破（含移动端）。
