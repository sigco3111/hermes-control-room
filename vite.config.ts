// vite.config.ts — 에르메스 관제실
// GitHub Pages 배포용 base path (사용자 게이트 후 결정 시 username 적용)
// 기본은 /hermes-control-room/ 로 설정 — gh-pages에서 username 자동 감지하도록 후처리 가능
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // gh-pages는 상대경로가 가장 호환성 좋음 (서브 path 변경에 강함)
  server: {
    host: '0.0.0.0',
    port: 5180,
  },
})
