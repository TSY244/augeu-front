import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      },
      '/get': {
        target: 'http://127.0.0.1:8080/api/v1',
        changeOrigin: true,
        secure: false
      },
      '/login': {
        target: 'http://127.0.0.1:8080/api/v1',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
