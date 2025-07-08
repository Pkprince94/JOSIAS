import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

console.log('vite.config.js loaded')

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5154,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
  base: '/', // nécessaire pour bon fonctionnement sur Render
})
