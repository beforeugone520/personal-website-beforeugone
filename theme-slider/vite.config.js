import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
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
