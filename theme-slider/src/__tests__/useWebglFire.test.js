import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, ref } from 'vue'
import { useWebglFire } from '../components/composables/useWebglFire'

function makeGl() {
  return {
    VERTEX_SHADER: 0x8B31,
    FRAGMENT_SHADER: 0x8B30,
    COMPILE_STATUS: 0x8B81,
    LINK_STATUS: 0x8B82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88E4,
    FLOAT: 0x1406,
    FRAMEBUFFER: 0x8D40,
    COLOR_ATTACHMENT0: 0x8CE0,
    TEXTURE_2D: 0x0DE1,
    RGBA: 0x1908,
    UNSIGNED_BYTE: 0x1401,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    LINEAR: 0x2601,
    CLAMP_TO_EDGE: 0x812F,
    COLOR_BUFFER_BIT: 0x4000,
    TEXTURE0: 0x84C0,
    TEXTURE1: 0x84C1,
    TRIANGLES: 0x0004,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    getShaderInfoLog: vi.fn(() => ''),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => ({})),
    attachShader: vi.fn(),
    bindAttribLocation: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    getProgramInfoLog: vi.fn(() => ''),
    createVertexArray: vi.fn(() => ({})),
    bindVertexArray: vi.fn(),
    createBuffer: vi.fn(() => ({})),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    getUniformLocation: vi.fn(() => ({})),
    createFramebuffer: vi.fn(() => ({})),
    createTexture: vi.fn(() => ({})),
    bindFramebuffer: vi.fn(),
    bindTexture: vi.fn(),
    texImage2D: vi.fn(),
    texParameteri: vi.fn(),
    framebufferTexture2D: vi.fn(),
    clearColor: vi.fn(),
    clear: vi.fn(),
    deleteFramebuffer: vi.fn(),
    deleteTexture: vi.fn(),
    deleteProgram: vi.fn(),
    deleteVertexArray: vi.fn(),
    deleteBuffer: vi.fn(),
    viewport: vi.fn(),
    useProgram: vi.fn(),
    uniform1f: vi.fn(),
    activeTexture: vi.fn(),
    uniform1i: vi.fn(),
    drawArrays: vi.fn(),
    uniform2f: vi.fn(),
    uniform3fv: vi.fn(),
  }
}

describe('useWebglFire 初始化', () => {
  let root
  let gl
  let originalResizeObserver

  beforeEach(() => {
    root = document.createElement('div')
    document.body.appendChild(root)
    gl = makeGl()
    originalResizeObserver = window.ResizeObserver
    window.ResizeObserver = class {
      observe() {}
      disconnect() {}
    }
    HTMLCanvasElement.prototype.getContext = vi.fn(() => gl)
    HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 168,
      height: 22,
    }))
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1)
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    window.ResizeObserver = originalResizeObserver
    window.requestAnimationFrame.mockRestore()
    window.cancelAnimationFrame.mockRestore()
    root.remove()
  })

  it('初始已经是 active 时，挂载后立即启动渲染循环', async () => {
    const app = createApp({
      setup() {
        const canvasRef = ref(null)
        useWebglFire(canvasRef, ref(100), ref(true), ref(true))
        return () => h('canvas', { ref: canvasRef })
      },
    })

    app.mount(root)
    await nextTick()
    await nextTick()

    expect(window.requestAnimationFrame).toHaveBeenCalled()
    app.unmount()
  })
})
