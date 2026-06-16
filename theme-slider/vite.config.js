import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // lib 产物直接喂浏览器：把 Vue esm-bundler 里的 process.env.NODE_ENV
  // 编译期替成字面量，否则浏览器无 process 会 ReferenceError 整个崩。
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: '../assets',
    emptyOutDir: false,
    cssCodeSplit: false,
    lib: {
      entry: 'src/main.js',
      formats: ['es'],
      fileName: () => 'theme-slider.js',
    },
  },
})
