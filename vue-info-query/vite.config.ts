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
      '/api/v1': { // 精确匹配前端的 /api/v1 开头路径
        target: 'http://127.0.0.1:8080',
        changeOrigin: true, // 必须开启，否则后端收到的 Origin 是 localhost:5173
        // 无 rewrite，保留原始路径
      }
    }
  }
})
