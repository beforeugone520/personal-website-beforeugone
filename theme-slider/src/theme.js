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
