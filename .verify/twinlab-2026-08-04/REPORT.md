# Twin Lab 룩 이식 검증 — 2026-08-04

## 검증 명령
1. `npx tsc --noEmit -p tsconfig.app.json` → **0 에러**
2. `npx esbuild src/main.tsx --bundle --format=esm --outfile=/tmp/check.js --log-level=warning` → **0 에러**, 번들 2.7MB
3. `npm run build` → **성공**, dist 956KB (캐릭터 PNG 8개 168KB 포함)
4. dev 서버 (port 5180) → **HTTP 200** (살아있음)
5. Playwright 스크린샷 → **runtime errors: none**

## 빌드 사이즈
| 항목 | 크기 |
| --- | --- |
| dist 총합 | 956KB (1MB 가드 통과) |
| dist/assets JS | 752KB |
| dist/assets/characters PNG | 168KB (8명) |
| gzip 메인 번들 | 124.68KB |

## 스크린샷
- 1600×1000: `.verify/twinlab-2026-08-04/screenshot-1600x1000.png`
- 1920×1080: `.verify/twinlab-2026-08-04/screenshot-1920x1080.png`

## Twin Lab 룩 1:1 체크리스트
- [x] isometric 룸 8개 (4×2 그리드)
- [x] 박스형 룸: 바닥 평면 + 좌/우측 벽(visible 2개) + 지붕 평면/옆면
- [x] 창문: 양 벽에 박힌 작은 박스 (시안 톤)
- [x] 문: 우측 벽 끝 작은 박스 (브라운 톤)
- [x] 책상 + 의자 + 모니터 (방 한가운데)
- [x] decoration 1~2개 (방마다 다름):
      tistory=프린터, errors=커피머신, graph=책장,
      improve=Whiteboard, trend=스탠드 조명, notebook=노트북,
      blog=화분, infra=서버랙
- [x] 카펫 (방마다 다름)
- [x] 코너 큰 나무 4개
- [x] 바닥 타일 결 (다이아몬드 그리드 점)
- [x] 방 사이 통로 라인
- [x] 캐릭터 sprite 8명 — W17ant/Claude-Office MIT 차용
- [x] 캐릭터 호흡 애니메이션 (sin wave, 1.2% 진폭)

## 캐릭터 PNG 매핑
| 우리 방 | 차용 원본 | 우리 파일 |
| --- | --- | --- |
| tistory | michael-scott / pam-beesly | tistory-a / tistory-b |
| errors | dwight-schrute / angela-martin | errors-a / errors-b |
| graph | jim-halpert | graph-a |
| improve | kelly-kapoor | improve-a |
| notebook | creed-bratton | notebook-a |
| infra | stanley-hudson | infra-a |
| trend, blog | (sprite 미배정, 박스 + decoration만) | — |

## 알려진 이슈
- trend/blog 방(아래 줄 2개)은 캐릭터 sprite 미배정 — 8명 PNG로 한정했기 때문.
  향후 16명(각 방 2명) 옵션으로 확장 시 oscar/kevin + erin/phyllis 추가 가능.
- 룸 사이 카펫이 인접 룸으로 살짝 비침 — WALL_H/2 카펫 깊이 계산 보정 가능하나
  Twin Lab 룩에서 큰 결함은 아니므로 다음 위임에서 polish 가능.
- PixiJS v8 destroy try/catch + wheel handler cleanup은 이전 위임 패치 보존.