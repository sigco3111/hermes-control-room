# Hermes Control Room

PixiJS v8 기반 2.5D dimetric 관제실. 브라우저는 `/state.json`을 우선 fetch하고, 실패하면 8개 방 mock 상태로 안전하게 동작합니다.

```bash
npm install
npm run dev
```

`node scripts/snapshot-state.mjs`는 Hermes CLI가 존재하는 환경에서 cron/memory 정보를 읽어 `public/state.json`을 갱신합니다. GitHub Actions는 5분마다 실행됩니다.
