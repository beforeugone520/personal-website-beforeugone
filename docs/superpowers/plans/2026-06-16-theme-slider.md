# 主题滑块 widget 实现计划

> 历史归档：该计划已经落地，未勾选框不代表当前待办。不要执行其中的旧 macOS 路径、stash/branch 步骤或 npm fallback；当前工作流以仓库根 `AGENTS.md` 和 `README.md` 为准。
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `claude-range-slider`（Vue3 + WebGL2 火焰滑块）原样迁入本仓库并改装成控制浅/深主题的滑块，构建成自挂载 bundle，缩小后挂到导航替掉 sun/moon 按钮（按钮保留为无 JS 兜底）。

**Architecture:** `theme-slider/` 是独立 Vue+Vite 子工程；纯逻辑（滑块值↔主题映射、写 `data-theme`/`localStorage`/Hero 重染）抽到无框架依赖的 `theme.js` 用 Vitest 单测；组件本体（`EffortCard.vue` + WebGL 引擎 + shader）原样拷入仅做最小改动；`vite build` 产出 `assets/theme-slider.js|css`（提交进仓库，无 CI）；三页保留按钮当基线、加挂载容器、引 bundle，挂载成功后 JS 隐藏按钮。

**Tech Stack:** Vue 3.5、Vite 8（lib 模式）、Vitest + jsdom（单测）、WebGL2/GLSL（原样保留）、纯静态 GitHub Pages。

---

## 前置：隔离与基线

- [ ] **Step A1：开分支**（不在 main 上直接做）

Run:
```bash
cd /Users/bruce/Desktop/CodeForWork/personal-website-beforeugone
git stash -u 2>/dev/null; git switch -c theme-slider
```
说明：工作树里那份 linter 重排过的 `index.html` 先 `git stash -u` 收起，避免混入；本计划结束再决定如何处置。若 `git switch` 报未提交冲突，先 stash。

- [ ] **Step A2：拷入源组件**（原样，不改）

Run:
```bash
cd /Users/bruce/Desktop/CodeForWork/personal-website-beforeugone
mkdir -p theme-slider/src/components/composables theme-slider/src/components/shaders
git clone --depth 1 https://github.com/beforeugone520/claude-range-slider /tmp/crs
cp /tmp/crs/src/components/EffortCard.vue                 theme-slider/src/components/EffortCard.vue
cp /tmp/crs/src/components/composables/useSliderState.js  theme-slider/src/components/composables/useSliderState.js
cp /tmp/crs/src/components/composables/useWebglFire.js    theme-slider/src/components/composables/useWebglFire.js
cp /tmp/crs/src/components/shaders/index.js               theme-slider/src/components/shaders/index.js
```
注意：`useWebglFire.js` 与 `shaders/index.js` **全程原样保留，不改**。

---

## Task 1：`theme.js` —— 主题映射与副作用（核心逻辑，TDD）

**Files:**
- Create: `theme-slider/src/theme.js`
- Test: `theme-slider/src/__tests__/theme.test.js`

- [ ] **Step 1：建工程骨架与测试依赖**

Create `theme-slider/package.json`:
```json
{
  "name": "theme-slider",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run"
  },
  "dependencies": { "vue": "^3.5.34" },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.6",
    "vite": "^8.0.12",
    "vitest": "^3.0.0",
    "jsdom": "^25.0.0"
  }
}
```
Run:
```bash
cd theme-slider && (pnpm install || npm install)
```

- [ ] **Step 2：写失败测试**

Create `theme-slider/src/__tests__/theme.test.js`:
```js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { valueToTheme, themeToValue, getInitialTheme, applyTheme, THEMES } from '../theme'

describe('valueToTheme（跨中点翻转）', () => {
  it('< 50 为浅色', () => { expect(valueToTheme(0)).toBe('light'); expect(valueToTheme(49)).toBe('light') })
  it('>= 50 为深色', () => { expect(valueToTheme(50)).toBe('dark'); expect(valueToTheme(100)).toBe('dark') })
})

describe('themeToValue（主题→初始滑块位）', () => {
  it('深→偏满端、浅→偏低端', () => { expect(themeToValue('dark')).toBe(85); expect(themeToValue('light')).toBe(15) })
})

describe('getInitialTheme', () => {
  beforeEach(() => { document.documentElement.removeAttribute('data-theme') })
  it('读 <html data-theme>', () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    expect(getInitialTheme()).toBe('dark')
  })
  it('无属性时回退浅色', () => { expect(getInitialTheme()).toBe('light') })
})

describe('applyTheme', () => {
  beforeEach(() => { document.documentElement.removeAttribute('data-theme'); localStorage.clear(); delete window.__heroField })
  it('写 data-theme 与 localStorage', () => {
    applyTheme('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('bug-theme')).toBe('dark')
  })
  it('存在时调用 Hero 重染', () => {
    const retheme = vi.fn(); window.__heroField = { retheme }
    applyTheme('light'); expect(retheme).toHaveBeenCalledOnce()
  })
})
```
Create `theme-slider/vitest.config.js`:
```js
import { defineConfig } from 'vitest/config'
export default defineConfig({ test: { environment: 'jsdom' } })
```

- [ ] **Step 3：运行测试确认失败**

Run: `cd theme-slider && (pnpm test || npm test)`
Expected: FAIL —— `Failed to resolve import "../theme"`。

- [ ] **Step 4：写最小实现**

Create `theme-slider/src/theme.js`:
```js
// 主题副作用与映射：无框架依赖，可单测。
export const THEMES = { LIGHT: 'light', DARK: 'dark' }
const STORAGE_KEY = 'bug-theme'

// 滑块值(0..100) → 主题：跨中点(50)翻转
export function valueToTheme(value) {
  return value >= 50 ? THEMES.DARK : THEMES.LIGHT
}

// 主题 → 初始滑块位（深 85 偏满端、浅 15 偏低端，留拖拽手感）
export function themeToValue(theme) {
  return theme === THEMES.DARK ? 85 : 15
}

// 当前主题：站点早执行脚本已写到 <html data-theme>，否则跟随系统
export function getInitialTheme() {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === THEMES.LIGHT || attr === THEMES.DARK) return attr
  if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) return THEMES.DARK
  return THEMES.LIGHT
}

// 应用主题：data-theme + localStorage + 通知 Hero 重染
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  try { localStorage.setItem(STORAGE_KEY, theme) } catch (e) {}
  if (window.__heroField && typeof window.__heroField.retheme === 'function') {
    window.__heroField.retheme()
  }
  return theme
}
```

- [ ] **Step 5：运行测试确认通过**

Run: `cd theme-slider && (pnpm test || npm test)`
Expected: PASS（4 个 describe 全绿）。

- [ ] **Step 6：提交**

```bash
git add theme-slider/package.json theme-slider/vitest.config.js theme-slider/src/theme.js theme-slider/src/__tests__/theme.test.js
git commit -m "feat(theme-slider): 主题映射与副作用 + 单测"
```

---

## Task 2：`useSliderState.js` —— 二态化（接 theme.js）

**Files:**
- Modify: `theme-slider/src/components/composables/useSliderState.js`（整文件替换）

- [ ] **Step 1：替换为二态主题版**

Replace 整个 `theme-slider/src/components/composables/useSliderState.js` with:
```js
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { valueToTheme, themeToValue, getInitialTheme, applyTheme, THEMES } from '../../theme'

export function useSliderState() {
  const sliderValue = ref(themeToValue(getInitialTheme()))
  const isAnimating = ref(false)
  let timer = null

  const theme = computed(() => valueToTheme(sliderValue.value))
  const isDark = computed(() => theme.value === THEMES.DARK)
  const isActive = isDark                       // 火焰/辉光绑定到“深色/夜”端
  const isFull = computed(() => sliderValue.value === 100)
  const statusLabel = computed(() => (isDark.value ? '深色' : '浅色'))

  function clearAnimation() { if (timer != null) { clearTimeout(timer); timer = null } isAnimating.value = false }
  function playFlipUp() { clearAnimation(); isAnimating.value = true; timer = setTimeout(() => { isAnimating.value = false; timer = null }, 460) }

  // 主题翻转：写站点主题 + 播标签翻转动画
  watch(theme, (n, o) => { if (n !== o) { applyTheme(n); playFlipUp() } })

  function onInput(e) { sliderValue.value = parseInt(e.target.value, 10) }

  onBeforeUnmount(clearAnimation)
  return { sliderValue, isActive, isFull, isAnimating, statusLabel, theme, onInput }
}
```

- [ ] **Step 2：单测 computed 映射**

Create `theme-slider/src/__tests__/useSliderState.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { useSliderState } from '../components/composables/useSliderState'

describe('useSliderState 二态', () => {
  it('初始位反映 data-theme=light', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const s = useSliderState()
    expect(s.sliderValue.value).toBe(15)
    expect(s.statusLabel.value).toBe('浅色')
    expect(s.isActive.value).toBe(false)
  })
  it('拖到深色端 → 标签/激活态翻转', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const s = useSliderState()
    s.sliderValue.value = 80
    expect(s.statusLabel.value).toBe('深色')
    expect(s.isActive.value).toBe(true)
  })
})
```

- [ ] **Step 3：运行测试确认通过**

Run: `cd theme-slider && (pnpm test || npm test)`
Expected: PASS。（watch→applyTheme 的副作用走浏览器集成验证，见 Task 6。）

- [ ] **Step 4：提交**

```bash
git add theme-slider/src/components/composables/useSliderState.js theme-slider/src/__tests__/useSliderState.test.js
git commit -m "feat(theme-slider): useSliderState 二态主题化"
```

---

## Task 3：组件改装（标签 + token 对齐 + 缩小）—— 视觉，dev server 验

**Files:**
- Modify: `theme-slider/src/components/EffortCard.vue`（模板文案 + `<style>`）

- [ ] **Step 1：改模板文案**（只改文字，不动结构）

在 `EffortCard.vue` 模板中：
- `<span class="label-text">Effort</span>` → `<span class="label-text">主题</span>`
- `.scale-labels` 两个 `<span>`：`Faster` / `Smarter` → `浅色` / `深色`
- `statusLabel`、`isActive`、`isAnimating`、`onInput` 绑定保持不变（已由 Task 2 改成二态语义）。

- [ ] **Step 2：token 对齐站点 + 改紫为朱红**

在 `EffortCard.vue` 的 `<style scoped>` 顶部加 CSS 变量回退，并把卡片配色从黑底/紫光改为吃站点变量（站点 `site.css` 在宿主页已加载，`var()` 可继承）：
```css
.card {
  background: var(--surface, #fff);
  border: 1px solid var(--border, rgba(0,0,0,.1));
  color: var(--fg, #222);
}
.label-text { color: var(--muted, #777); }
.status-text { color: var(--muted, #777); font-family: var(--font-mono, ui-monospace, monospace); }
/* 紫→朱红：把所有 168,85,247 / #c084fc 换成 accent */
.status-text.glowing { color: var(--accent, #d8431d); text-shadow: 0 0 12px color-mix(in oklch, var(--accent, #d8431d) 55%, transparent); }
```
并把 `input[type='range'].glowing::-webkit-slider-thumb` / `::-moz-range-thumb` 里的 `rgba(168, 85, 247, …)` 辉光替换为 `color-mix(in oklch, var(--accent) 50%, transparent)` 同义值（逐处替换，保留阴影层次）。
`.track-wrapper` 的 `#0c0c0c` 深底改 `var(--fg-soft, rgba(0,0,0,.06))`，`.dot` 的 `#494950` 改 `var(--border)`。

- [ ] **Step 3：缩小成导航控件尺寸**

在 `<style scoped>` 末尾追加紧凑覆写（导航里只需轨道+knob+小火苗，砍掉大留白）：
```css
.card { width: 168px; padding: 6px 8px; border-radius: 12px; }
.header { margin-bottom: 5px; }
.header-left { font-size: 11px; gap: 4px; }
.help-btn { display: none; }              /* 导航里不放问号 */
.scale-labels { font-size: 9px; margin-bottom: 3px; letter-spacing: .02em; }
.track-wrapper { height: 22px; border-radius: 8px; }
input[type='range']::-webkit-slider-thumb { width: 20px; height: 20px; border-radius: 7px; }
input[type='range']::-moz-range-thumb { width: 18px; height: 18px; border-radius: 7px; }
.card-shadow { filter: drop-shadow(0 4px 10px color-mix(in oklch, var(--fg, #000) 14%, transparent)); }
```

- [ ] **Step 4：reduced-motion 守火焰**

在 `EffortCard.vue` `<script setup>` 中，把 `useWebglFire(canvasRef, sliderValue, isActive)` 包一层守卫：
```js
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches
if (!reduceMotion) useWebglFire(canvasRef, sliderValue, isActive)
```

- [ ] **Step 5：dev server 目视验证**

临时建 `theme-slider/src/main.js`（下一 Task 会定稿）与 `theme-slider/index.html` 最小宿主，`pnpm dev` 打开：
- 拖动滑块跨中点 → 标签在「浅色 / 深色」间翻转、有翻转动画；深色端火焰出现。
- 控件宽约 168px、无问号、配色不是黑紫而是吃 `var()`（此处宿主未引 site.css，回退色应是浅底）。
Expected：交互与尺寸符合；火焰在深色端可见。无自动断言，目视为准。

- [ ] **Step 6：提交**

```bash
git add theme-slider/src/components/EffortCard.vue
git commit -m "feat(theme-slider): 文案/朱红token对齐 + 导航缩小 + reduced-motion守火焰"
```

---

## Task 4：自挂载入口 + Vite lib 构建

**Files:**
- Create/replace: `theme-slider/src/main.js`
- Create: `theme-slider/vite.config.js`

- [ ] **Step 1：自挂载入口**

Write `theme-slider/src/main.js`:
```js
import { createApp } from 'vue'
import ThemeSlider from './components/EffortCard.vue'

const el = document.getElementById('theme-slider')
if (el) {
  createApp(ThemeSlider).mount(el)
  const btn = document.getElementById('themeBtn')   // 挂载成功 → 隐藏无 JS 兜底按钮
  if (btn) btn.hidden = true
}
```

- [ ] **Step 2：Vite lib 配置（输出到 ../assets，不哈希、不清目录）**

Write `theme-slider/vite.config.js`:
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: '../assets',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: { entry: 'src/main.js', formats: ['es'], fileName: () => 'theme-slider.js' },
  },
})
```

- [ ] **Step 3：构建并确认产物名**

Run: `cd theme-slider && (pnpm build || npm run build)`
Expected：`assets/theme-slider.js` 生成；同时生成一个 CSS 文件。
Run: `ls -1 ../assets/`
记下 CSS 实际文件名（Vite lib 可能叫 `theme-slider.css` 或 `style.css`）。若叫 `style.css`，重命名：
```bash
[ -f ../assets/style.css ] && mv ../assets/style.css ../assets/theme-slider.css || true
```
后续 HTML 一律引 `assets/theme-slider.css`。

- [ ] **Step 4：提交（源 + 产物一起）**

```bash
git add theme-slider/src/main.js theme-slider/vite.config.js assets/theme-slider.js assets/theme-slider.css
git commit -m "build(theme-slider): 自挂载入口 + lib 构建产物"
```

---

## Task 5：接入三页（容器 + 引 bundle + 保留按钮兜底）

**Files:**
- Modify: `index.html`、`blog.html`、`posts/hello-world.html`

> 注意：当前工作树的 `index.html` 是 linter 重排版（已在 Step A1 stash）。本 Task 在 `git stash pop` 之后、或直接在 HEAD 版上做；以 HEAD 的 `index.html` 为准。三页的导航结构相同：`.nav-tools` 内有 `#themeBtn` 按钮。

- [ ] **Step 1：每页在 `#themeBtn` 前插入挂载容器**

在三页的 `.nav-tools` 里，`<button class="icon-btn" id="themeBtn" ...>` **之前**插入：
```html
      <span id="theme-slider" aria-hidden="true"></span>
```

- [ ] **Step 2：每页 `<head>` 引 bundle CSS（在 site.css 之后）**

`index.html` / `blog.html`：
```html
<link rel="stylesheet" href="assets/theme-slider.css" />
```
`posts/hello-world.html`（子目录，路径加 `../`）：
```html
<link rel="stylesheet" href="../assets/theme-slider.css" />
```

- [ ] **Step 3：每页 `</body>` 前引 bundle JS（module）**

`index.html` / `blog.html`：
```html
<script type="module" src="assets/theme-slider.js"></script>
```
`posts/hello-world.html`：
```html
<script type="module" src="../assets/theme-slider.js"></script>
```

- [ ] **Step 4：保留各页现有 sun/moon 按钮与其内联主题脚本**——不删。它们是关 JS / bundle 失败时的兜底；bundle 成功时由 `main.js` 设 `btn.hidden=true` 接管。

- [ ] **Step 5：本地起静态服务目视验证三页**

Run:
```bash
cd /Users/bruce/Desktop/CodeForWork/personal-website-beforeugone && python3 -m http.server 8000
```
浏览器开 `localhost:8000/index.html`、`/blog.html`、`/posts/hello-world.html`：
- 导航出现滑块、sun/moon 按钮被隐藏。
- 拖动跨中点 → 整页主题翻转、Hero 重染（仅主页）、刷新后保持（localStorage）。
- 三页主题一致（切到深色再开另一页仍是深色）。
Expected：全部满足。无自动断言，目视为准。

- [ ] **Step 6：提交**

```bash
git add index.html blog.html posts/hello-world.html
git commit -m "feat: 三页接入主题滑块 widget（保留按钮兜底）"
```

---

## Task 6：降级与集成验证

**Files:** 无新增；验证为主。

- [ ] **Step 1：bundle 失败兜底**

临时把某页的 `src="assets/theme-slider.js"` 改成错误路径，刷新：
Expected：滑块不出现、**sun/moon 按钮仍在且能切主题**（兜底成立）。验毕改回。

- [ ] **Step 2：reduced-motion**

系统开「减少动态效果」（或 DevTools 模拟 `prefers-reduced-motion: reduce`），刷新：
Expected：滑块可用、主题能切，火焰静止（不跑 rAF）。

- [ ] **Step 3：watch→applyTheme 集成确认**

DevTools Console 拖动滑块跨中点，检查 `document.documentElement.dataset.theme` 与 `localStorage['bug-theme']` 同步翻转、`window.__heroField` 在主页被重染。
Expected：三者一致联动（覆盖 Task 2 未单测的 watch 副作用）。

- [ ] **Step 4：单测回归**

Run: `cd theme-slider && (pnpm test || npm test)`
Expected：PASS。

---

## Task 7：产物、文档、OD 同步、收尾

**Files:**
- Modify: `README.md`、`theme-slider/.gitignore`
- Sync: OD `beforeugone`

- [ ] **Step 1：忽略 node_modules / dist 噪声，但**保留** assets 产物**

Create `theme-slider/.gitignore`:
```
node_modules/
```
（`assets/theme-slider.*` 是**有意提交**的产物，不忽略。）

- [ ] **Step 2：README 记工作流**

在 `README.md` 加一节：
```markdown
## 主题滑块 widget
导航的浅/深主题滑块源码在 `theme-slider/`（Vue+Vite）。改动后必须重新构建并提交产物：
\`\`\`
cd theme-slider && pnpm install && pnpm build
\`\`\`
产物 `assets/theme-slider.js|css` 由三页引用；sun/moon 按钮保留为无 JS 兜底。
```

- [ ] **Step 3：同步 OD**（按既定自动同步规则）

把改动的网站文件推到 OD `beforeugone`（project id `97dbfccd-b98f-4d33-a067-8151719f8d1b`）：`index.html`、`blog.html`、`posts/hello-world.html`、`assets/theme-slider.js`、`assets/theme-slider.css`、`README.md`。每个 `write_file` 后比对 `list_files` size 与本地 `wc -c`。
注意：OD 之前未有 `assets/` 工件，首推即新建。

- [ ] **Step 4：提交收尾**

```bash
git add README.md theme-slider/.gitignore
git commit -m "docs: 主题滑块构建工作流 + 忽略 node_modules"
```

- [ ] **Step 5：交回用户决定合并与发布**

汇报：分支 `theme-slider` 完成；列出 commit。**不自动合并/不 push**（用户的 commit/push 须点头规矩）。问用户：合回 main？push 上线？stash 的 linter 版 index.html 如何处置（pop 后再合，还是丢弃）。

---

## 自查记录

- **Spec 覆盖**：语义二态(Task2)、原样迁移(StepA2/引擎不改)、构建挂载(Task4)、三页接入(Task5)、缩小(Task3)、降级/a11y(Task3 Step4 + Task6)、产物提交/README/OD(Task7) —— 均有对应任务。
- **占位扫描**：无 TBD/TODO；CSS 实际文件名在 Task4 Step3 显式处理；视觉任务给了起点 CSS + 目视验证（前端视觉不可单测，属合理手验）。
- **类型/命名一致**：`valueToTheme/themeToValue/getInitialTheme/applyTheme/THEMES` 在 theme.js 定义并在 useSliderState 一致引用；`#theme-slider` 容器 id 与 main.js、三页一致；`#themeBtn` 与隐藏逻辑一致。
