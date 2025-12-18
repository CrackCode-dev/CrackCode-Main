import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps the '@' alias to the full path of the './src' directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
})