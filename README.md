# Hermes Control Room

> W17ant/Claude-Office 포크 · 헤르메스 자동화 시스템 시각화 · SIM/LIVE 토글 · 한글 UI

실시간으로 AI 에이전트들이 작업하는 모습을 픽셀 아트 가상 사무실에서 시각화합니다. AI 에이전트들이 생성되어 책상에 앉고, 커피 브레이크를 가지며, Slack 스타일 채팅 패널에서 대화하는 모습을 볼 수 있습니다. 모두 등각 픽셀 아트 사무실로 렌더링됩니다. 헤르메스 자동화 시스템의 8개 부서 (Tistory 발행, 모닝 브리핑, 자동화 정비, 리서치/트렌드, Notion 동기화, 투자/트레이딩, 미디어/영상, DevOps)와 실시간 cron 상태를 반영하기 위해 **Hermes Control Room**으로 포크되었습니다.

## 데모

- 🟢 https://sigco3111.github.io/hermes-control-room/
- 진입 후 우상단 **`● SIM`** / **`● LIVE`** 토글로 두 모드 즉시 전환
- 기본값은 SIM(데모 시나리오 자동 재생), LIVE는 Gist polling으로 실제 이벤트 수신

| 모드 | 색상 | 데이터 소스 |
|------|------|------------|
| **SIM** | cyan (`#6ce5e8`) | 내장 시뮬레이션 (8개 부서 시나리오 + random event 자동 발사) |
| **LIVE** | green (`#5ee0a0`) + 펄스 | GitHub Gist `d04b26e667187cd133a14e833eed4bcb` 5초 polling |

## SIM ↔ LIVE 토글

모드 전환은 React state로 즉시 적용되며 페이지 새로고침이 필요 없습니다.

- SIM 진입: 보스 + Claude가 출근, 8개 부서 시나리오 자동 스폰, 60-120초마다 random event 자동 발사 (소방 훈련, 피자 배달, 배포 등)
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

### 지원 이벤트 타입

| type | payload | 효과 |
|------|---------|------|
| `agent_spawned` | `{agent:{id,name,role,task}}` | 캐릭터 생성 + 책상으로 워킹 |
| `agent_completed` | `{agentId, result}` | 캐릭터 책상 떠나 문으로 |
| `agent_working` | `{agentId, status}` | 상태 텍스트 + 채팅 메시지 |
| `chat_message` | `{sender,text,role?}` | 우측 채팅 패널에 메시지 |
| `mcp_call` | `{agentId, server, tool}` | MCP 사용 표시 |
| `mcp_done` | `{agentId, result}` | MCP 완료 |

## 한글화 노트

모든 사용자-facing 콘텐츠가 한국어로 통일되어 있습니다:

- **UI**: 헤더, 채팅 placeholder, 버튼 툰팁, 부서 라벨, 모든 라벨
- **SIM 모드**: 시뮬레이션 대사, 보스 답장, status 텍스트, 커피/물 break, 8개 부서 시나리오
- **OFFICE 토글 시**: Dunder Mifflin 톤 (OFFICE_SPAWN/WORK/DONE/COFFEE/WATER, OFFICE_SIM_TOOL_MESSAGES, OFFICE_EVENTS, DRAMA_CONVERSATIONS)도 모두 한국어 번역
- **Random events**: 60-120초마다 자동 발사되는 22개 random event (소방 훈련, 피자, 배포, 생일 등) + 8개 drama conversation 모두 한국어
- **부서 라벨**: `HERMES_DEPARTMENT_DISPLAY`에 17개 role 한국어 라벨 (Tistory 발행, 블로그/뉴스레터, 자기 개선, Knowledge Graph, 트렌드 모니터링, Notebook LM, 인프라 동기화, DB 아키텍트, 아키텍트 리뷰 등)
- **코드 식별자 보존**: `git blame`, `merge`, `POWER_BOT`, `bears beets` 같은 개발자 친숙 단어만 영문 유지

## Dunder Mifflin mode (`/the-office`)

채팅창에 `/the-office` 입력으로 The Office 테마 활성화:

- **캐릭터**: Michael Scott, Jim, Pam, Dwight, Kevin, Angela, Stanley, Creed, David Wallace, Bob Vance 등 27명 → boos/Claude/8개 부서 role에 자동 배치
- **시그니처 소품**: Michael의 World's Best Boss 머그/Dundie/Golden Ticket, Dwight의 CPR dummy 마스크/Schrute Buck, Jim의 젤로 스테이플러, Stanley의 프레첼, Angela의 고양이 2마리, Pam/Oscar/Toby의 Finer Things Club
- **한국어 대사**: 곰. 사탕무우. 캍스타 갈락티카. / 종이 팔고 있음 / Schrute Buck 부여 / 그녀가 그랬죠 / 팸. 로스트. / 모르시겠지만, 오늘은 프레첼 데이입니다. 등 (TV 시리즈 인용을 한국어 자연 번역)

## 부서 (Hermes 8개)

| 부서 | emoji | 설명 |
|------|-------|------|
| Tistory 발행 | 📝 | 자동 발행 파이프라인 |
| 모닝 브리핑 | 🌅 | 매일 아침 통합 인사이트 |
| 자동화 정비 | ⚙️ | nightly maintenance |
| 리서치/트렌드 | 🔍 | 기술 트렌드 수집 |
| Notion 동기화 | 📓 | Notion DB 자동 sync |
| 투자/트레이딩 | 📈 | Yahoo Finance 추적 |
| 미디어/영상 | 🎬 | Manim/뮤직비디오 |
| DevOps | 🔧 | cron 헬스체크 |

자세한 작업 지시사항은 [`HANDOFF.md`](./HANDOFF.md) 참조.

## 원본 저장소 (Upstream)

본 프로젝트는 아래 저장소에서 포크되었습니다.

| 항목 | 내용 |
|------|------|
| **Upstream** | [`W17ant/Claude-Office`](https://github.com/W17ant/Claude-Office) |
| **Fork** | [`sigco3111/hermes-control-room`](https://github.com/sigco3111/hermes-control-room) |
| **라이선스** | MIT (상속) |
| **기준 커밋** | `a08abdd` — Twin Lab 톤 미적용, 영문 디자인 |
| **포크 목적** | 헤르메스 자동화 시스템 8개 부서 시각화 + Dunder Mifflin 테마 |

## 트러블슈팅 / 함정

- **vite base prefix 누락**: `vite.config.ts`의 `base: '/hermes-control-room/'`가 빌드 시 JS 내부 절대경로에 자동 적용되지 않음 → `post-build.sh`로 sed 강제 박기
- **theme.ts BASE_URL 미정의**: `getAngelaCat`, `getRoomImage` 등 BASE_URL 사용 — `theme.ts`에 `import { BASE_URL } from './baseUrl'` 필수
- **office.css .app-body 중복 정의**: cascade 순서로 옛 정의가 이길 수 있음 — 1번만 정의
- **Gist CDN 5분 캐시**: `?live` 모드 첫 fetch가 옛 버전일 수 있음 → cache-bust 쿼리(`?t=Date.now()`)로 우회
- **mode state + dependencies**: simulation useEffect deps에 `mode` 포함 필수. 누락 시 모드 전환 후 시뮬레이션 종료 안 됨

## 빌드 / 배포

```bash
npm install
npm run build              # vite build → dist/
bash post-build.sh         # sprite/room path prefix 강제 박기
```

`dist/`를 `gh-pages` 브랜치에 푸시:

```bash
git worktree add -B gh-pages /tmp/hcr-gh-pages origin/gh-pages
cd /tmp/hcr-gh-pages
git rm -rf .
cp -r /path/to/dist/. .
touch .nojekyll
git add -A && git commit -m "deploy: ..."
git push -u origin gh-pages --force
```

## 라이선스

MIT — [`W17ant/Claude-Office`](https://github.com/W17ant/Claude-Office) 상속. 원본 저작권 고지 및 라이선스 전문은 upstream 저장소를 참조하세요.
