import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/purchaseOrders': { target: 'http://localhost:3001', changeOrigin: true },
      '/ingredients': { target: 'http://localhost:3001', changeOrigin: true },
      '/inventory': { target: 'http://localhost:3001', changeOrigin: true },
      '/recipes': { target: 'http://localhost:3001', changeOrigin: true },
      '/workorders': { target: 'http://localhost:3001', changeOrigin: true },
      '/productInventory': { target: 'http://localhost:3001', changeOrigin: true },
      '/customerOrders': { target: 'http://localhost:3001', changeOrigin: true },
      '/auth': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  build: {
    outDir: 'build',
  },
})
