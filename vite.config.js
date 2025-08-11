import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the new proxy configuration
    proxy: {
      // Any request starting with /api will be forwarded
      '/api': {
        // Forward it to our backend server
        target: 'http://localhost:3001',
        // Important: this changes the origin of the host header
        changeOrigin: true,
      },
    },
  },
})