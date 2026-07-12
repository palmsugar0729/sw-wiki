import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


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
      // 本地开发时，/api 请求转发到 wrangler pages dev（默认 8788 端口）
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
      }
    }
  }
})
