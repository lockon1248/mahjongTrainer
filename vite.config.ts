import { fileURLToPath, URL } from 'node:url'
import UnoCSS from '@unocss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [UnoCSS(), vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'node',
    exclude: ['e2e/**', 'node_modules/**', 'dist/**']
  }
})
