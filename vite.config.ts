import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    // On some Windows setups, "localhost" resolves to the IPv6 loopback (::1)
    // first, but Vite's default host only binds one family - pin IPv4 so
    // http://localhost:5173 always connects regardless of resolution order.
    host: '127.0.0.1',
  },
})
