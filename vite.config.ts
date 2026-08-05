import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Default base: '/hermes-control-room/' (gh-pages subpath).
// Override via VITE_BASE env var (e.g. for Vercel root: VITE_BASE=/).
const base = process.env.VITE_BASE || '/hermes-control-room/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3333,
    proxy: {
      '/ws': {
        target: 'ws://localhost:3334',
        ws: true,
      },
    },
  },
})
