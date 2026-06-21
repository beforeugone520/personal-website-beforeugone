import { describe, it, expect } from 'vitest'
import { useSliderState } from '../components/composables/useSliderState'

describe('useSliderState 二态', () => {
  it('初始位反映 data-theme=light（浅色端也点火，方向为浅）', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const s = useSliderState()
    expect(s.sliderValue.value).toBe(0)
    expect(s.statusLabel.value).toBe('浅色')
    expect(s.isDark.value).toBe(false)
    expect(s.isActive.value).toBe(true)   // 两端都有火焰特效
    expect(s.isFull.value).toBe(true)     // slider=0 是浅色端的“满”端
  })
  it('初始位反映 data-theme=dark 并贴紧满端', () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    const s = useSliderState()
    expect(s.sliderValue.value).toBe(100)
    expect(s.statusLabel.value).toBe('深色')
    expect(s.isDark.value).toBe(true)
    expect(s.isActive.value).toBe(true)
    expect(s.isFull.value).toBe(true)
  })
  it('拖到深色端 → 标签/方向翻转', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const s = useSliderState()
    s.sliderValue.value = 80
    expect(s.statusLabel.value).toBe('深色')
    expect(s.isDark.value).toBe(true)
    expect(s.isActive.value).toBe(true)
  })
  it('中间地带不算满端（无端点辉光收束）', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const s = useSliderState()
    s.sliderValue.value = 60
    expect(s.isFull.value).toBe(false)
  })
})
