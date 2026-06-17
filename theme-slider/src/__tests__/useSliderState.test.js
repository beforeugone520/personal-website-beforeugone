import { describe, it, expect } from 'vitest'
import { useSliderState } from '../components/composables/useSliderState'

describe('useSliderState 二态', () => {
  it('初始位反映 data-theme=light', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const s = useSliderState()
    expect(s.sliderValue.value).toBe(0)
    expect(s.statusLabel.value).toBe('浅色')
    expect(s.isActive.value).toBe(false)
    expect(s.isFull.value).toBe(false)
  })
  it('初始位反映 data-theme=dark 并贴紧满端', () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    const s = useSliderState()
    expect(s.sliderValue.value).toBe(100)
    expect(s.statusLabel.value).toBe('深色')
    expect(s.isActive.value).toBe(true)
    expect(s.isFull.value).toBe(true)
  })
  it('拖到深色端 → 标签/激活态翻转', () => {
    document.documentElement.setAttribute('data-theme', 'light')
    const s = useSliderState()
    s.sliderValue.value = 80
    expect(s.statusLabel.value).toBe('深色')
    expect(s.isActive.value).toBe(true)
  })
})
