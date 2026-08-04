# Hermes Control Room — 핸드오프 문서

> 새 세션 / 다른 에이전트 인계용. **다음 작업: 1개 룸 + 8개 부서 (Hermes 자동화 시스템 시각화)**.

## 1. 한 줄 요약

`/Users/mac/work/hermes-control-room/` (W17ant/Claude-Office 포크) — 헤르메스 자동화 시스템의 8개 부서를 시각화. 현재 1개 큰 룸 (Dunder Mifflin 사무실) + Claude-Office 원본 디자인 (영문). **다음 세션에서 진행할 작업: 1개 룸은 유지 + 8개 부서 chip 헤더 + Twin Lab 톤 사이드 패널 + 하단 티커**.

## 2. 저장소 상태

| 항목 | 값 |
|------|-----|
| 위치 | `/Users/mac/work/hermes-control-room/` |
| 현재 main 브랜치 HEAD | `a08abdd` |
| origin main | `dbc0cd5` Initial commit (우리 repo main push unpack 오류로 안 올라감) |
| gh-pages HEAD (라이브) | `0204dd6` — a08abdd 빌드, Claude-Office 원본 |
| 라이브 URL | https://sigco3111.github.io/hermes-control-room/ |
| dev 서버 | `localhost:5182` (Vite, React 18) |
| 빌드 | `dist/index.html` + `dist/assets/index-*.js` (226KB) + `dist/assets/index-*.css` (24KB) |
| Playwright | 68개 200 + 1개 404 (cat-sprinkles) |

### Git reflog (시간순)

```
a08abdd fix: BASE_URL sprite path 일관성 (Twin Lab 도입 직전)
dd5e521 feat: Twin Lab tone header/side/ticker + Actions sed + data fetch (Twin Lab 도입)
72d8c7c fix: theme.ts cat sprite BASE_URL + state.json
25777e2 fix: theme.ts BASE_URL import
a7154b1 fix: getRoomImage BASE_URL prefix
a9b4975 fix: office.css .app-body 중복 정의 제거
56d9d5f fix: room 1개 (main-office) + 8개 부서 chip (Twin Lab 1:1) + CSS 비례
7b8c86b fix: room 1개 (main-office) + 부서 8개 (Twin Lab 1:1)
0204dd6 (gh-pages) deploy: a08abdd (Claude-Office 원본, 1개 룸, 영문)
```

## 3. 완료된 작업 (현재 시점)

- ✅ a08abdd 시점으로 reset (Twin Lab 전, Claude-Office 원본)
- ✅ 빌드 0 에러 (tsc 0 + vite build OK)
- ✅ `post-build.sh`로 sprite/room path prefix 박기 (`/hermes-control-room/...`)
- ✅ `dist/state.json` mock 생성 (8개 부서, cron skill 매핑)
- ✅ gh-pages push: `0204dd6`
- ✅ Playwright 68개 200 (sprite 1개 cat-sprinkles 404는 영향 미미)
- ✅ README.md 갱신 (Twin Lab 후 8부서 작업 섹션 추가)

## 4. 다음 작업 — 1개 룸 + 8개 부서 (Twin Lab 톤)

### 4-1. 핵심 결정 (사용자 확정)

- **룸 분리 안 함** — 1개 큰 룸 (main-office) 유지
- **8개 부서 chip 헤더** — Twin Lab 톤 (다크 네이비 + emoji + 메트릭)
- **부서 chip 클릭 → 사이드 패널** (룸 변경 X, 정보만 표시)
- **하단 티커** — Twin Lab 톤 (60s linear 흐름)
- **영문 디자인** + 한글 부서명 + 한글 부서 상태 표시 (한국어 UI)
- **Twin Lab 톤** = 다크 네이비 헤더 + glassmorphism 사이드 패널

### 4-2. 작업 단계

1. **헤더 (LabHeader) — 8개 부서 chip**:
   - 위치: `src/components/LabHeader.tsx` (현재 없음, dd5e521 시점의 source 참고 또는 새로 작성)
   - props: `metrics: HermesMetrics` (활성 크론 19, 메모리 2189/2200, Tistory 오늘 N, 오늘 세션 N)
   - props: `selectedRoomId: string | null`, `onSelectRoom: (id: string) => void`
   - 부서 chip: `📝 Tistory 발행 / 🌅 모닝 브리핑 / ⚙️ 자동화 정비 / 🔍 리서치/트렌드 / 📓 Notion 동기화 / 📈 투자/트레이딩 / 🎬 미디어/영상 / 🔧 DevOps`
   - Twin Lab 톤: 다크 네이비 배경 (`#0d0d12` → `#1a1f2e`), 시계 (HH:MM), 부서 chip 색상

2. **사이드 패널 (LabSidePanel) — 부서 상세**:
   - 위치: `src/components/LabSidePanel.tsx`
   - props: `selectedRoomId: HermesRoomId | null`, `onClose: () => void`
   - 부서명 + emoji + status (active/idle/waiting/error) + cron list (scripts) + lastRun + nextRun

3. **하단 티커 (LabTicker) — Twin Lab 톤**:
   - 위치: `src/components/LabTicker.tsx`
   - 60s linear 흐름 (좌→우)
   - 부서 이벤트 (예: "📝 Tistory 발행 완료", "🔍 에러 감시 0건")

4. **부서 데이터 (hermesRooms.ts)**:
   - 위치: `src/hermesRooms.ts`
   - 8개 부서 정의:
     ```ts
     export type HermesRoomId = 'tistory' | 'briefing' | 'automation' | 'research' | 'notion' | 'trading' | 'media' | 'devops'
     export interface HermesRoom {
       id: HermesRoomId
       emoji: string
       name: string
       status: 'active' | 'idle' | 'waiting' | 'inactive' | 'error'
       lastRun: string
       nextRun: string
       scripts: string[]
     }
     export const HERMES_ROOMS: Record<HermesRoomId, HermesRoom> = {
       tistory: { id: 'tistory', emoji: '📝', name: 'Tistory 발행', status: 'active', lastRun: '2026-08-04T17:25:00.000Z', nextRun: '5분 이내', scripts: ['b1bca63a117a', '0b0e9f44e10a', 'b21d94a14860'] },
       briefing: { id: 'briefing', emoji: '🌅', name: '모닝 브리핑', status: 'idle', lastRun: '2026-08-04T08:30:00.000Z', nextRun: '내일 08:30', scripts: ['075bec58df7b', '582ecc59aaee'] },
       automation: { id: 'automation', emoji: '⚙️', name: '자동화 정비', status: 'active', lastRun: '2026-08-04T17:00:00.000Z', nextRun: '3분 이내', scripts: ['81f1c81f8664', '388898171a79', 'e0ba30d8a122'] },
       research: { id: 'research', emoji: '🔍', name: '리서치/트렌드', status: 'active', lastRun: '2026-08-04T16:32:00.000Z', nextRun: '4분 이내', scripts: ['b26b0579a45f', 'e330c7de50d1'] },
       notion: { id: 'notion', emoji: '📓', name: 'Notion 동기화', status: 'waiting', lastRun: '2026-08-04T17:15:00.000Z', nextRun: '10분 이내', scripts: ['5d0f14aef84c', 'ed5f37705e68'] },
       trading: { id: 'trading', emoji: '📈', name: '투자/트레이딩', status: 'inactive', lastRun: '2026-08-03T18:00:00.000Z', nextRun: '1시간 이내', scripts: ['d7bd4309bbf0', 'dc9a2e6aaaaa'] },
       media: { id: 'media', emoji: '🎬', name: '미디어/영상', status: 'idle', lastRun: '2026-08-04T15:00:00.000Z', nextRun: '30분 이내', scripts: ['b02a45f4d14e', '0f893ba14797'] },
       devops: { id: 'devops', emoji: '🔧', name: 'DevOps', status: 'active', lastRun: '2026-08-04T16:00:00.000Z', nextRun: '5분 이내', scripts: ['5a376ec002c3', '7c2b9a9be162'] }
     }
     ```

5. **App.tsx 통합**:
   - import: `LabHeader`, `LabSidePanel`, `LabTicker`, `hermesRooms.ts`
   - state: `const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)`
   - JSX:
     ```tsx
     <div className="app-wrapper">
       <LabHeader metrics={metrics} selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} />
       {/* 기존 1개 큰 룸 (main-office) 그대로 */}
       <div className="app-body">
         <div className="office-view">{/* MAIN_ROOM = ROOMS['main-office'] */}</div>
       </div>
       <LabTicker />
       <LabSidePanel selectedRoomId={selectedRoomId as any} onClose={() => setSelectedRoomId(null)} />
       <SlackChat {...existingProps} />
     </div>
     ```

6. **CSS 비례 문제**:
   - `.app-body` 단일 정의 (이전 a9b4975 패치 보존)
   - `.office-view` flex: 1, position: relative, min-width: auto
   - `.room-container` width: 100%, aspectRatio 동적 (room.width / room.height), 룸이 viewport 가득 채움

7. **검증**:
   - `npx tsc --noEmit -p tsconfig.json` 0 에러
   - `npm run build` 0 exit
   - `post-build.sh` (sprite/room path prefix)
   - `dist/state.json` 갱신 (timestamp + 8개 부서 mock)
   - Playwright 캡쳐 (1440x900) — Twin Lab 톤 헤더 + 8개 부서 chip + 1개 룸 + 캐릭터
   - main + gh-pages 푸시
   - 라이브 검증

### 4-3. 빌드 + 푸시 패턴

```bash
cd /Users/mac/work/hermes-control-room

# 빌드
npx tsc --noEmit -p tsconfig.json
npm run build

# sprite/room path prefix 박기
bash post-build.sh

# state.json 갱신
cat > dist/state.json << 'EOF'
{
  "timestamp": "<ISO 8601>",
  "activeCrons": 19, "memoryUsed": 2189, "memoryCap": 2200, "tistoryToday": 0, "sessionCount": 1,
  "rooms": { /* 8개 부서 mock */ }
}
EOF

# index.html cache-bust 추가 (선택)
# cache-bust 미적용: 강력 새로고침 시 즉시 반영 (3~5분)

# gh-pages 푸시
rm -rf /tmp/fresh-clone
git clone https://github.com/sigco3111/hermes-control-room.git /tmp/fresh-clone
cd /tmp/fresh-clone
git checkout --orphan gh-pages
git rm -rf .
cp -r /Users/mac/work/hermes-control-room/dist/. .
touch .nojekyll
git add -A
git commit -m "deploy: 1개 룸 + 8개 부서 (Twin Lab 톤)"
git push -u origin gh-pages --force
```

## 5. 알려진 함정 (회피 패턴)

| 함정 | 회피 |
|------|------|
| `vite.config.ts base: '/hermes-control-room/'`이 JS 내부 절대경로에 자동 적용 안 됨 | `post-build.sh`로 `'/sprites/'` → `'/hermes-control-room/sprites/'` 강제 변환 |
| `theme.ts`의 `getAngelaCat`이 `BASE_URL` 식별자 사용하지만 import 누락 | `theme.ts`에 `import { BASE_URL } from './baseUrl'` 명시 |
| `theme.ts:142-146`의 `getRoomImage`가 `'/rooms/...'` (base prefix 없음) 반환 | `\`${BASE_URL}rooms/...\`` 로 변환 |
| `office.css .app-body` 중복 정의 (line 169 + 454) | 1번만 정의 (옛 Claude-Office CSS 제거) |
| `main.tsx` 누락 (dd5e521 이전 커밋엔 없음) | React 18 + `createRoot` + `<App />` 추가 |
| `@vitejs/plugin-react` import 오류 | `vite.config.ts`에 `import react from '@vitejs/plugin-react'` |
| Playwright가 옛 빌드 캡쳐 (cache race) | `--no-cache --disable-cache` + `waitForTimeout(8000)` |
| `git push --force`로 gh-pages의 옛 dist 사라짐 | **주의**: 푸시 전 항상 옛 dist 백업 또는 git history 보존 |
| `nohup / disown / setsid` 금지 (Hermes 가드) | background=true 또는 process 액션 |
| `tsc 6133` unused-variable | noUnusedLocals: false (현재 설정) 또는 prefix _ |

## 6. 핵심 결정 (다음 세션 참고)

1. **룸 분리 안 함** — 1개 큰 룸 (Dunder Mifflin) 유지. Twin Lab 룩 + 부서 chip 헤더 + 사이드 패널
2. **Twin Lab 톤** — 다크 네이비 헤더 + glassmorphism 사이드 + 60s linear 티커
3. **한글 부서명 + 영문 디자인** — 사용자 결정
4. **base prefix 강제 박기** — `post-build.sh` sed 변환
5. **`main.tsx` 필수** — React 18 진입점
6. **Sprite 1개 (cat-sprinkles) 404** — 영향 미미, 무시

## 7. 성공 지표

- ✅ 라이브 (https://sigco3111.github.io/hermes-control-room/) 에서 **Twin Lab 톤 헤더 + 8개 부서 chip + 메트릭 + 사이드 패널 + 하단 티커 + 1개 큰 룸 (Dunder Mifflin + 캐릭터들)** 모두 정상
- ✅ 부서 chip 클릭 시 사이드 패널에 부서 정보 표시 (룸 안 바뀜)
- ✅ Playwright 0개 404 (cat-sprinkles 포함)
- ✅ 사용자 preview에서 직접 확인 가능 (Cmd+Shift+R 강력 새로고침)
- ✅ main + gh-pages 푸시 완료, 빌드 크기 230~250KB (gzip 75~85KB)
- ✅ TS 0 에러, vite build 0 exit

## 8. 참고 자료 (dd5e521 시점 source)

- `/Users/mac/.hermes/cache/delegation/live/deleg_ad596f14/task-0.log` — 어제 Twin Lab 시점 작업 로그
- `/tmp/dd5e521_src/` — dd5e521 시점 source 추출본 (App.tsx 78KB, office.css 34KB, LabHeader.tsx 2KB, LabSidePanel.tsx 2.5KB, LabTicker.tsx 1.7KB, hermesRooms.ts 4.9KB)
- `git show dd5e521:src/components/LabHeader.tsx` — LabHeader reference 구현 (Twin Lab 톤 헤더)
- `git show dd5e521:src/styles/office.css` — Twin Lab 톤 CSS 변수 + 헤더/사이드/티커 스타일

## 9. 환경

- macOS 26.6 (M4)
- Node v22 / npm 10
- React 18.3.1, Vite 5.4.0
- Playwright (chromium) — 검증용
- git + GitHub CLI (gh)

## 10. 메모리 (다음 세션)

- **사용자 = 희정님, 한국어 소통, 짧고 미니멀한 보고**
- "OK 예감" 자신감 표현 금지
- "변화없음" = "옛 빌드 보고 있음" 또는 "다른 거 보고 있음" — 사용자 환경 캐시 가능성 큼, 사용자가 강력 새로고침한 경우 우리 푸시 미반영 가능성
- 자동위임 OK
- 풀빌드 푸시 (gh-pages --force) 시 **이전 dist 사라짐** — 신중히
- Playwright는 `--no-cache --disable-cache` + `waitForTimeout(8000)` 권장
- **cat sprite는 12개** 중 1개 (cat-sprinkles) 404 — 영향 미미
- **state.json mock** — 8개 부서 + cron script IDs (실제 cron 동기화는 후속)
- **post-build.sh** — vite base prefix 우회 sprite/room path 변환
