import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/hermes-control-room/',
  plugins: [react()],
  build: {
    sourcemap: false,
  },
})
