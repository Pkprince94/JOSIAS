import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('vite.config.js loaded')

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5154,
    strictPort: true
  },
});
