# Hermes Control Room

> W17ant/Claude-Office 포크 · 헤르메스 자동화 시스템 시각화 (Dunder Mifflin 모드)

A pixel art virtual office that visualizes your AI agents working in real-time. Watch Claude Code agents spawn, sit at desks, take coffee breaks, and chat in a Slack-inspired office chat panel — all rendered in an isometric pixel art office. Forked to **Hermes Control Room** so the office reflects 8 active automation departments (Tistory, briefing, automation, research, Notion, trading, media, DevOps) and their live cron status.

## 라이브 데모

- 🟢 https://sigco3111.github.io/hermes-control-room/
- source: `a08abdd` (Claude-Office 원본, Twin Lab 톤 미적용, 영문 디자인)
- 1개 룸 (Dunder Mifflin 사무실) + 27 cast members

## Update — Dunder Mifflin mode

Type `/the-office` in the Slack chat panel to flip the whole office into a Scranton-branch tribute. The room, the cast, and the chatter all swap over — Michael Scott runs the place, Jim is your assistant, and Dwight guards the beet cellar.

### Pretzel day, every day
<p>
  <img src="docs/images/dunder-mifflin-day.png" alt="Dunder Mifflin — Day" width="48%">
  <img src="docs/images/dunder-mifflin-night.png" alt="Dunder Mifflin — Night" width="48%">
</p>

**What changes when you toggle it on**
- 27 cast members (Michael, Jim, Pam, Dwight, Kevin, Angela, Stanley, Creed, David Wallace, Bob Vance — the whole office) dealt to agent roles
- Role chatter swaps to in-character lines (`"Bears. Beets. Battlestar Galactica."`, `"selling paper"`, `"Schrute bucks awarded"`)
- Michael occasionally lands his signature `"That's what she said 😏"` when replying to finished work
- Character prop overlays — Michael rotates World's Best Boss mug / Dundie / Golden Ticket / Prison Mike bandana / "NO GOD PLEASE NO", Dwight gets the CPR dummy mask or a Schrute Buck, Jim keeps his jello stapler, Stanley gets a pretzel, Jan gets a Serenity by Jan candle, Oscar / Pam / Toby share the Finer Things Club
- Angela gets a follower cat *and* a head-cat (randomized from 12 cat sprites)
- Kevin's chili, pretzel day, and Finer Things Club references sprinkled through the break-room chatter

### The cast
<p align="center">
  <img src="docs/images/michael-scott.png" alt="Michael Scott" height="140">
  <img src="docs/images/jim-halpert.png" alt="Jim Halpert" height="140">
  <img src="docs/images/pam-beesly.png" alt="Pam Beesly" height="140">
  <img src="docs/images/dwight-schrute.png" alt="Dwight Schrute" height="140">
  <img src="docs/images/angela-martin.png" alt="Angela Martin" height="140">
  <img src="docs/images/kevin-malone.png" alt="Kevin Malone" height="140">
  <img src="docs/images/stanley-hudson.png" alt="Stanley Hudson" height="140">
  <img src="docs/images/andy-bernard.png" alt="Andy Bernard" height="140">
  <img src="docs/images/kelly-kapoor.png" alt="Kelly Kapoor" height="140">
  <img src="docs/images/ryan-howard.png" alt="Ryan Howard" height="140">
  <img src="docs/images/creed-bratton.png" alt="Creed Bratton" height="140">
  <img src="docs/images/robert-california.png" alt="Robert California" height="140">
  <img src="docs/images/david-wallace.png" alt="David Wallace" height="140">
  <img src="docs/images/bob-vance.png" alt="Bob Vance, Vance Refrigeration" height="140">
</p>

### Easter-egg props
Each cast member gets a signature prop floating above their desk in place of the usual coffee/Red Bull bubble.

<p align="center">
  <img src="docs/images/prop-worlds-best-boss.png" alt="World's Best Boss mug (Michael)" height="70">
  &nbsp;&nbsp;
  <img src="docs/images/prop-dundie.png" alt="Dundie Award (Michael)" height="70">
  &nbsp;&nbsp;
  <img src="docs/images/prop-golden-ticket.png" alt="Golden Ticket (Michael)" height="70">
  &nbsp;&nbsp;
</p>

## Hermes Control Room — 8개 부서 (다음 작업)

본 포크는 헤르메스 자동화 시스템의 8개 부서를 시각화하는 방향으로 확장 예정:

| 부서 | emoji | 설명 | status 표시 |
|------|-------|------|-------------|
| Tistory 발행 | 📝 | 자동 발행 파이프라인 | active / idle / error |
| 모닝 브리핑 | 🌅 | 매일 아침 통합 인사이트 | active / idle |
| 자동화 정비 | ⚙️ | nightly maintenance | active / idle |
| 리서치/트렌드 | 🔍 | 기술 트렌드 수집 | active / idle |
| Notion 동기화 | 📓 | Notion DB 자동 sync | active / waiting |
| 투자/트레이딩 | 📈 | Yahoo Finance 추적 | active / inactive |
| 미디어/영상 | 🎬 | Manim/뮤직비디오 | active / idle |
| DevOps | 🔧 | cron 헬스체크 | active / error |

자세한 작업 지시사항은 [`HANDOFF.md`](./HANDOFF.md) 참조.

## 트러블슈팅 / 함정

본 프로젝트는 gh-pages 서브경로(`/hermes-control-room/`)에 호스팅됩니다. 다음 함정 회피:

- **vite base prefix 누락**: `vite.config.ts`의 `base: '/hermes-control-room/'`가 빌드 시 JS 내부 절대경로에 자동 적용되지 않음 → `post-build.sh`로 sed 강제 박기
- **theme.ts BASE_URL 미정의**: `getAngelaCat` 등 일부 함수가 `BASE_URL` 식별자 사용 — `theme.ts`에 `import { BASE_URL } from './baseUrl'` 필수
- **getRoomImage prefix 누락**: `theme.ts:142-146`의 `getRoomImage`가 `/rooms/...` 반환 — `\`${BASE_URL}rooms/...\`` 로 변경
- **office.css .app-body 중복 정의**: cascade 순서로 옛 정의가 이길 수 있음 — 1번만 정의
- **main.tsx 누락**: dd5e521 이전 커밋엔 `src/main.tsx` 없음 — React 18 + `createRoot` + `<App />` 필요
- **@vitejs/plugin-react import**: vite.config.ts에 `import react from '@vitejs/plugin-react'` 정상이어야 함

## 빌드 / 배포

```bash
npm install
npm run build
bash post-build.sh              # sprite/room path prefix 박기
```

`dist/`를 `gh-pages` 브랜치에 푸시:

```bash
git clone https://github.com/sigco3111/hermes-control-room.git /tmp/fresh-clone
cd /tmp/fresh-clone
git checkout --orphan gh-pages
git rm -rf .
cp -r <project>/dist/. .
touch .nojekyll
git add -A
git commit -m "deploy: ..."
git push -u origin gh-pages --force
```

## 라이선스

MIT (W17ant/Claude-Office 상속)
