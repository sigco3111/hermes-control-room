# Hermes Control Room

> W17ant/Claude-Office 포크 · 헤르메스 자동화 시스템 시각화 · SIM/LIVE 토글 · 한글 UI

A pixel art virtual office that visualizes your AI agents working in real-time. Watch Claude Code agents spawn, sit at desks, take coffee breaks, and chat in a Slack-inspired office chat panel — all rendered in an isometric pixel art office. Forked to **Hermes Control Room** so the office reflects 8 active automation departments (Tistory, briefing, automation, research, Notion, trading, media, DevOps) and their live cron status.

## 데모

- 🟢 https://sigco3111.github.io/hermes-control-room/
- 진입 후 우상단 **`● SIM`** / **`● LIVE`** 토글으로 두 모드 즉시 전환
- 기본값은 SIM(데모 시나리오 자동 재생), LIVE는 Gist polling으로 실제 이벤트 수신

| 모드 | 색상 | 데이터 소스 |
|------|------|------------|
| **SIM** | cyan (`#6ce5e8`) | 내장 시뮬레이션 (Security/Frontend/Reviewer 등 8개 부서 시나리오) |
| **LIVE** | green (`#5ee0a0`) + 펄스 | GitHub Gist `d04b26e667187cd133a14e833eed4bcb` 5초 polling |

## SIM ↔ LIVE 토글

모드 전환은 React state로 즉시 적용되며 페이지 새로고침이 필요 없습니다.

- SIM 진입: 보스 + Claude가 출근, 8개 부서 시나리오 자동 스폰
- LIVE 진입: 모든 SIM 상태 초기화, Gist polling 시작
- 클릭 시점의 Gist 내용이 즉시 채팅에 표시되고 이후 push된 이벤트가 5-10초 내 반영

## Live 모드 (Hermes cron ↔ 브라우저)

Live 모드는 GitHub Gist를 이벤트 로그로 사용해 **인프라 $0에 양방향 연동**을 구현합니다.

- 브라우저가 5초마다 Gist의 `events.jsonl`을 polling (cache-bust 쿼리로 CDN 캐시 우회)
- Hermes cron 작업이 Gist에 JSON Lines 1줄을 push → 5-10초 후 모든 연결된 브라우저에 반영
- Gist ID는 `?gist=<ID>` URL 파라미터로 override 가능
- 모드 진입 시 Gist 전체를 다시 파싱 → `recentChatKeysRef`로 메시지 dedup

### Hermes 운영자가 Gist에 이벤트 push하는 방법

```bash
GIST_ID=d04b26e667187cd133a14e833eed4bcb
GITHUB_TOKEN=ghp_...   # gist scope 필요

# 1. 에이전트 스폰 (캐릭터가 책상으로 걸어감)
curl -X PATCH \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.github.com/gists/$GIST_ID" \
  -d "{\"files\":{\"events.jsonl\":{\"content\":\"$(cat events.jsonl)\n$(echo '{\"type\":\"agent_spawned\",\"agent\":{\"id\":\"t1\",\"name\":\"Tistory Publisher\",\"role\":\"tistory-publisher\",\"task\":\"발행 시작\"}}')\"}}}"

# 2. 채팅 메시지 (Slack 패널에 즉시 표시)
curl -X PATCH \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.github.com/gists/$GIST_ID" \
  -d "{\"files\":{\"events.jsonl\":{\"content\":\"$(cat events.jsonl)\n$(echo '{\"type\":\"chat_message\",\"sender\":\"Tistory\",\"text\":\"발행 완료\",\"role\":\"tistory-publisher\"}')\"}}}"
```

또는 `gh` CLI로 더 간단히:

```bash
echo '{"type":"chat_message","sender":"DevOps","text":"cron 점검 완료","role":"devops-engineer"}' \
  >> events.jsonl
gh gist edit $GIST_ID --add events.jsonl
```

## 한글화 노트

- 기본 UI (헤더, 채팅 placeholder, 버튼 툴팁, 부서 라벨)는 모두 한국어
- SIM 모드의 시뮬레이션 대사, 보스 답장, status 텍스트 모두 한국어 번역
- `/the-office` 토글 시 활성화되는 Dunder Mifflin 톤 (`OFFICE_SIM_CHATTER`, `OFFICE_SIM_TOOL_MESSAGES`)은 **의도적으로 영문 유지** — TV 시리즈 "The Office"의 캐릭터성 보존을 위함
- 부서 라벨 매핑 (`HERMES_DEPARTMENT_DISPLAY`)에 8개 부서 + 확장 role 17개 한국어 라벨 정의

### 지원 이벤트 타입

| type | payload | 효과 |
|------|---------|------|
| `agent_spawned` | `{agent:{id,name,role,task}}` | 캐릭터 생성 + 책상으로 워킹 |
| `agent_completed` | `{agentId, result}` | 캐릭터 책상 떠나 문으로 |
| `agent_working` | `{agentId, status}` | 상태 텍스트 + 채팅 메시지 |
| `chat_message` | `{sender,text,role?}` | 우측 채팅 패널에 메시지 |
| `mcp_call` | `{agentId, server, tool}` | MCP 사용 표시 |
| `mcp_done` | `{agentId, result}` | MCP 완료 |

## 원본 저장소 (Upstream)

본 프로젝트는 아래 저장소에서 포크되었습니다.

| 항목 | 내용 |
|------|------|
| **Upstream** | [`W17ant/Claude-Office`](https://github.com/W17ant/Claude-Office) |
| **Fork** | [`sigco3111/hermes-control-room`](https://github.com/sigco3111/hermes-control-room) |
| **라이선스** | MIT (상속) |
| **기준 커밋** | `a08abdd` — Twin Lab 톤 미적용, 영문 디자인 |
| **포크 목적** | 헤르메스 자동화 시스템 8개 부서 시각화 + Dunder Mifflin 테마 추가 |

### 주요 포크 변경점

- Hermes Control Room 리브랜딩 (8개 부서: Tistory / 브리핑 / 자동화 / 리서치 / Notion / 트레이딩 / 미디어 / DevOps)
- `/the-office` 슬래시 커맨드로 The Office (Dunder Mifflin) 테마 토글
- 27명 cast 멤버 (Michael, Jim, Pam, Dwight 등) + 시그니처 소품 오버레이
- gh-pages 서브경로 대응 (`post-build.sh`로 sprite/room 경로 prefix 강제 적용)

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

MIT — [`W17ant/Claude-Office`](https://github.com/W17ant/Claude-Office) 상속. 원본 저작권 고지 및 라이선스 전문은 upstream 저장소를 참조하세요.
