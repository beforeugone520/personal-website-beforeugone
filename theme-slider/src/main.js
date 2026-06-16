import { createApp } from 'vue'
import ThemeSlider from './components/EffortCard.vue'

const el = document.getElementById('theme-slider')
if (el) {
  createApp(ThemeSlider).mount(el)
  const btn = document.getElementById('themeBtn')   // 挂载成功 → 隐藏无 JS 兜底按钮
  if (btn) btn.hidden = true
}
