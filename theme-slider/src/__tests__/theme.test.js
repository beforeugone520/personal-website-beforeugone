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
