import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 專案使用 .js 副檔名撰寫 JSX；告知 React plugin 及 esbuild 一併處理
  plugins: [react({ include: /\.(jsx|js)$/ })],
  // 讓 vite:esbuild 核心插件在 import analysis 之前將 src/ 下的 .js 視為 JSX
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' }
    }
  },
  // 開發伺服器代理，對應 CRA 的 "proxy" 設定
  server: {
    port: 3000,
    proxy: {
      '/1': 'http://localhost:3001'
    }
  },
  // 保留 process.env.NODE_ENV 相容性（serviceWorker.js 有使用）
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.PUBLIC_URL': JSON.stringify('')
  }
})
