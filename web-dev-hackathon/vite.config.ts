import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // This redirects http://localhost:5173/api to http://localhost:3000/api
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})