# 🏛️ 헤르메스 관제실 (Hermes Control Room)

> 3D로 한눈에 보는 Hermes 자동화 관제실 — 19개 cron + 8개 부서 + 16명 캐릭터

## 🎯 컨셉

`twin.quantlabnote.com/guest` 에서 영감을 받아, 운용 중인 Hermes 자동화 시스템(19개 cron + 60+ scripts)을 **3D 사무실 룸**으로 시각화한 실시간 관제실.

- 상단 헤더: 시스템 KPI (활성 크론 / 메모리 / Tistory 오늘 / 오늘 세션)
- 중앙 3D: 8개 부서 (각 부서 = 1개 룸 + 2명 캐릭터)
- 우측 사이드 패널: 클릭한 부서 상세 (스크립트 목록, 상태)
- 하단 티커: 실시간 이벤트 스트림 (2단계)
- 좌하단 범례: 캐릭터 상태 색상 안내

## 🛠️ 스택

- **Vite + React 19 + TypeScript**
- **@react-three/fiber + @react-three/drei** (Three.js 풀 3D)
- **Zustand** (상태 관리)
- **gh-pages** (GitHub Pages 배포)

## 🚀 실행

```bash
npm install
npm run dev          # http://localhost:5180
npm run build        # dist/
npm run deploy       # gh-pages (게이트 후)
```

## 📁 구조

```
src/
  components/
    Scene.tsx       — 3D 씬 (그리드 + 8개 방 + OrbitControls)
    Room.tsx        — 단일 방 (박스 + 라벨 + 캐릭터 2명)
    Character.tsx   — 캡슐 + 상태 색상 + idle 애니메이션
    HUD.tsx         — 헤더 / 사이드 패널 / 티커 / 범례
  store.ts          — Zustand 스토어
  types.ts          — Room / CharacterStatus 타입 + 8개 방 메타데이터
  App.tsx           — Canvas + HUD 오버레이
  App.css           — Glassmorphism + 레이아웃
```

## 🗺️ 8개 방 (운용 중인 Hermes 자동화 시스템 매핑)

| 부서 | 색상 | 연결된 시스템 |
|---|---|---|
| 📝 티스토리 발행실 | mintgreen | `b1bca63a117a`, `0b0e9f44e10a`, `b21d94a14860` |
| 🔍 에러 감시실 | red | `e0ba30d8a122`, `81f1c81f8664` |
| 🧠 지식 그래프실 | purple | `d7bd4309bbf0`, `388898171a79`, `e330c7de50d1` |
| 🔄 자기 개선실 | orange | `5d0f14aef84c`, `ed5f37705e68` |
| 🔥 트렌드 모니터실 | yellow | `b26b0579a45f`, `e330c7de50d1`, `075bec58df7b` |
| 📓 노트북LM실 | pink | `dc9a2e6aaaaa` |
| 🎬 블로그/뉴스레터실 | cyan | `b02a45f4d14e`, `0f893ba14797`, `582ecc59aaee` |
| ⚙️ 인프라/동기화실 | gray | `5a376ec002c3`, `7c2b9a9be162`, `memory-error-tracker` |

## 🎮 인터랙션

- **드래그**: 카메라 궤도 회전
- **휠**: 줌 인/아웃 (5 ~ 40 단위)
- **우클릭 + 드래그**: 팬
- **방 클릭**: 우측 패널에 부서 상세 표시
- **빈 공간 클릭**: 선택 해제
- **헤더 우측 룸 emoji 칩**: 패널 placeholder에서 직접 선택 가능

## 📍 검증

```bash
# 검증 폴더: /tmp/hermes-control-room-verify/
npx tsx screenshot.ts
```

## 🚧 1단계 한계 / 2단계 진입 준비

| 항목 | 1단계 (현재) | 2단계 |
|---|---|---|
| 캐릭터 상태 | 정적 mock | cron 데이터 fetch |
| 데이터 fetch | 없음 | GitHub Actions 5분 cron |
| 부서 상세 | placeholder | 최근 로그 + 상태 + 다음 실행 시각 |
| 하단 티커 | 정적 텍스트 | 실시간 이벤트 스트림 |
| 캐릭터 애니메이션 | idle만 호흡 | working/walking/error 모션 |

## 📄 라이선스

Internal Hermes project. 사용자 게이트 후 GitHub 공개 결정.
