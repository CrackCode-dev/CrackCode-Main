import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5177, // frontend port
    proxy: {
      '/api': 'http://localhost:5050', // forward API calls to backend
    },
  },
})