// File: vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy configuration is the key for local development.
    // It tells Vite's dev server how to handle API requests.
    proxy: {
      // This rule says: if you see a request that starts with "/api"...
      '/api': {
        // ...forward that request to our backend server, which is
        // running on http://localhost:3001
        target: 'http://localhost:3001',

        // This is a recommended setting that helps prevent
        // potential issues with server configurations.
        changeOrigin: true,
      },
    },
  },
});