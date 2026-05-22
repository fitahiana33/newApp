import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [ vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/prestashop/api': {
        target: 'http://localhost/prestashop/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/prestashop\/api/, '')
      }
    }
  }
})
