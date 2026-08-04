import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 💠 Hermes Control Room — Twin Lab 톤
// gh-pages 서브경로 + base URL prefix 처리
export default defineConfig({
  base: '/hermes-control-room/',
  plugins: [react()],
  server: {
    port: 5182,
    proxy: {
      '/ws': {
        target: 'ws://localhost:3334',
        ws: true,
      },
    },
  },
})
