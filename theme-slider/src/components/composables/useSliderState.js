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
