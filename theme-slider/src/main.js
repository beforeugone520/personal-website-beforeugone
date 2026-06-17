import { createApp } from 'vue'
import ThemeSlider from './components/EffortCard.vue'

const el = document.getElementById('theme-slider')
if (el) {
  createApp(ThemeSlider).mount(el)
}
