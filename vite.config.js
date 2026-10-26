import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // In development, forward /api calls to the backend (TPI-DSW-2026).
    // The browser sees the same origin, so the backend CORS list is not involved.
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        // Accept the self-signed .NET development certificate
        secure: false,
      },
    },
  },
})
