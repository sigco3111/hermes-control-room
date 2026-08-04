// drawScene.ts — Twin Lab 룩의 8개 isometric 룸 + 캐릭터 sprite 배치 + 바닥 decoration
//
// W17ant/Claude-Office의 rooms.ts 패턴 차용:
//   - main-office: 책상 다발 + plant/filing/printer/coffee/kanban 등 다양한 furniture
//   - manager/ceo/meeting-room/kitchen 등 각 방마다 다른 decor
// 우리 8개 부서에 동일하게 적용 — 각 방마다 다른 책상 색 + 다른 decoration 1~2개.

import { Application, Container, Graphics, Rectangle } from 'pixi.js'
import { drawRoom, iso, ROOM_W, ROOM_D, WALL_H, type DecorKind, type RoomFurniture } from './drawRoom'
import { drawCharacter, tickCharacter, type CharacterKey } from './drawCharacter'

// ───────────────────── 방 정의 (Twin Lab 룩에 맞춰 확장) ─────────────────────
export interface SceneRoom {
  id: string
  label: string
  tone: number              // 방 톤 컬러
  position: { gx: number; gy: number }  // 4x2 그리드 좌표 (월드 단위 X 190)
  furniture: RoomFurniture
  character?: { key: CharacterKey; offset: { x: number; y: number } } // 책상 옆 캐릭터 1명
  character2?: { key: CharacterKey; offset: { x: number; y: number } } // 보조 캐릭터 (옵션)
}

// 4x2 그리드. 각 방은 ROOM_W x ROOM_D 박스 + 약간의 간격(20).
const GRID_GAP_X = ROOM_W + 30
const GRID_GAP_Y = ROOM_D + 50

// 방 톤 — 원본 palette 와 호환되게 유지
const SCENE_ROOMS: SceneRoom[] = [
  {
    id: 'tistory',
    label: '📝 티스토리 발행실',
    tone: 0x76cdb2,
    position: { gx: 0, gy: 0 },
    furniture: {
      deskColor: 0x76cdb2,
      chairColor: 0x4f9c87,
      monitorColor: 0x6cd1c5,
      shelfColor: 0x6f4f3a,
      boardColor: 0xf0d36d,
      boardLabel: '발행 큐',
      decor: 'printer',
      carpetColor: 0x143230,
    },
    character: { key: 'tistory-a', offset: { x: -14, y: 6 } },
    character2: { key: 'tistory-b', offset: { x: 18, y: 6 } },
  },
  {
    id: 'errors',
    label: '🔍 에러 감시실',
    tone: 0xef7774,
    position: { gx: 1, gy: 0 },
    furniture: {
      deskColor: 0xef7774,
      chairColor: 0x8a3a38,
      monitorColor: 0xef7774,
      boardColor: 0xb195dc,
      boardLabel: '장애 패널',
      decor: 'coffee',
      carpetColor: 0x2c1f24,
    },
    character: { key: 'errors-a', offset: { x: -14, y: 6 } },
    character2: { key: 'errors-b', offset: { x: 18, y: 6 } },
  },
  {
    id: 'graph',
    label: '🧠 지식 그래프실',
    tone: 0xb195dc,
    position: { gx: 2, gy: 0 },
    furniture: {
      deskColor: 0xb195dc,
      chairColor: 0x6f4d8e,
      monitorColor: 0x6cd1c5,
      shelfColor: 0x6f4f3a,
      boardColor: 0xf0d36d,
      decor: 'bookshelf',
      carpetColor: 0x1f1830,
    },
    character: { key: 'graph-a', offset: { x: -14, y: 6 } },
  },
  {
    id: 'improve',
    label: '🔄 자기 개선실',
    tone: 0xf0a15c,
    position: { gx: 3, gy: 0 },
    furniture: {
      deskColor: 0xf0a15c,
      chairColor: 0xa86b30,
      monitorColor: 0x6cd1c5,
      boardColor: 0x76cdb2,
      boardLabel: 'KPI 보드',
      decor: 'whiteboard',
      carpetColor: 0x2c1f10,
    },
    character: { key: 'improve-a', offset: { x: -14, y: 6 } },
  },
  {
    id: 'trend',
    label: '🔥 트렌드 모니터실',
    tone: 0xf0d36d,
    position: { gx: 0, gy: 1 },
    furniture: {
      deskColor: 0xf0d36d,
      chairColor: 0xa8902c,
      monitorColor: 0xef7774,
      boardColor: 0x70c5d7,
      boardLabel: '트렌드 차트',
      decor: 'lamp',
      carpetColor: 0x2c2610,
    },
  },
  {
    id: 'notebook',
    label: '📓 노트북LM실',
    tone: 0xe99bb8,
    position: { gx: 1, gy: 1 },
    furniture: {
      deskColor: 0xe99bb8,
      chairColor: 0x9c5a73,
      monitorColor: 0x6cd1c5,
      boardColor: 0x76cdb2,
      boardLabel: '오디오북 큐',
      decor: 'laptop',
      carpetColor: 0x2c1820,
    },
    character: { key: 'notebook-a', offset: { x: -14, y: 6 } },
  },
  {
    id: 'blog',
    label: '🎬 블로그/뉴스레터실',
    tone: 0x70c5d7,
    position: { gx: 2, gy: 1 },
    furniture: {
      deskColor: 0x70c5d7,
      chairColor: 0x3f8590,
      monitorColor: 0xb195dc,
      boardColor: 0xf0a15c,
      boardLabel: '에피소드 보드',
      decor: 'plant',
      carpetColor: 0x102628,
    },
  },
  {
    id: 'infra',
    label: '⚙️ 인프라/동기화실',
    tone: 0x9ba8ad,
    position: { gx: 3, gy: 1 },
    furniture: {
      deskColor: 0x9ba8ad,
      chairColor: 0x5a6a70,
      monitorColor: 0x55bb84,
      boardColor: 0xef7774,
      boardLabel: '배포 상태',
      decor: 'server',
      carpetColor: 0x1a2224,
    },
    character: { key: 'infra-a', offset: { x: -14, y: 6 } },
  },
]

/**
 * Twin Lab 룩 scene 전체를 그려서 반환.
 * - 8개 방 (4x2 그리드)
 * - 각 방마다 캐릭터 0~2명
 * - 바닥 decoration (카펫 색은 방마다, 통로 라인, 작은 화분/나무 몇 개)
 * - 캐릭터 클릭/탭 시 onRoomSelect 콜백 호출
 */
export function drawScene(
  app: Application,
  onRoomSelect: (id: string) => void,
): Container {
  const world = new Container()
  // 화면 중앙에 배치 — Twin Lab 룩은 살짝 우측 상단에서 내려다보는 뷰
  world.x = Math.max(420, app.screen.width * 0.34)
  world.y = Math.max(180, app.screen.height * 0.18)
  world.scale.set(Math.min(1.05, app.screen.width / 1280))
  app.stage.addChild(world)

  // ── 1. 바닥 평면 (Twin Lab의 "통로가 있는 큰 바닥") ─────────────
  const floorW = 4 * GRID_GAP_X + 40
  const floorD = 2 * GRID_GAP_Y + 40
  const floorA = iso(-20, -20)
  const floorB = iso(floorW, -20)
  const floorC = iso(floorW, floorD)
  const floorD2 = iso(-20, floorD)
  const floor = new Graphics()
    .moveTo(floorA.x, floorA.y)
    .lineTo(floorB.x, floorB.y)
    .lineTo(floorC.x, floorC.y)
    .lineTo(floorD2.x, floorD2.y)
    .closePath()
    .fill(0x182d35)
    .stroke({ width: 2, color: 0x2c4b51, alpha: 0.8 })
  world.addChild(floor)

  // 바닥 타일 결 — 작은 다이아몬드 그리드
  const tileSize = 26
  for (let i = -2; i < (floorW / tileSize) + 1; i++) {
    for (let j = -2; j < (floorD / tileSize) + 1; j++) {
      const p = iso(i * tileSize, j * tileSize)
      const dot = new Graphics().circle(p.x, p.y, 0.8).fill(0x3a6066)
      world.addChild(dot)
    }
  }
  // 통로 라인 (방 사이 이음새) — Twin Lab이 방 사이 길이 있듯
  for (let col = 1; col < 4; col++) {
    const p1 = iso(col * GRID_GAP_X - 15, -20)
    const p2 = iso(col * GRID_GAP_X - 15, floorD)
    world.addChild(new Graphics().moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).stroke({ width: 1, color: 0x3a6066, alpha: 0.55 }))
  }
  const corridorP1 = iso(-20, GRID_GAP_Y - 25)
  const corridorP2 = iso(floorW, GRID_GAP_Y - 25)
  world.addChild(new Graphics().moveTo(corridorP1.x, corridorP1.y).lineTo(corridorP2.x, corridorP2.y).stroke({ width: 1, color: 0x3a6066, alpha: 0.55 }))

  // 외곽 큰 화분 4개 (모서리)
  const cornerDecors = [
    { gx: -0.05, gy: -0.05 },
    { gx: 3.85, gy: -0.05 },
    { gx: -0.05, gy: 1.7 },
    { gx: 3.85, gy: 1.7 },
  ]
  cornerDecors.forEach((c) => {
    const px = c.gx * GRID_GAP_X
    const py = c.gy * GRID_GAP_Y
    const p = iso(px, py)
    const tree = new Container()
    const trunk = new Graphics().rect(-3, 0, 6, 18).fill(0x875d49)
    const leaves1 = new Graphics().circle(0, -4, 13).fill(0x4a9c64)
    const leaves2 = new Graphics().circle(-9, 0, 9).fill(0x6fbd88)
    const leaves3 = new Graphics().circle(8, -2, 8).fill(0x6fbd88)
    tree.addChild(trunk, leaves1, leaves2, leaves3)
    tree.x = p.x
    tree.y = p.y
    world.addChild(tree)
  })

  // ── 2. 8개 방 배치 ──────────────────────────────────────────────
  SCENE_ROOMS.forEach((room, idx) => {
    const px = room.position.gx * GRID_GAP_X
    const py = room.position.gy * GRID_GAP_Y
    const roomContainer = new Container()
    roomContainer.x = iso(px, py).x
    roomContainer.y = iso(px, py).y

    const roomShape = drawRoom({
      tone: room.tone,
      furniture: room.furniture,
    })
    // 룸 박스 영역에 hit area (탭하면 해당 부서 선택)
    roomShape.eventMode = 'static'
    roomShape.cursor = 'pointer'
    // 룸 박스 크기만큼 hit area 설정
    roomShape.hitArea = new Rectangle(-ROOM_W / 2, -WALL_H - ROOM_D / 2, ROOM_W + ROOM_D, WALL_H + ROOM_D)
    roomShape.on('pointertap', () => onRoomSelect(room.id))
    roomContainer.addChild(roomShape)

    // ── 캐릭터 1명 (책상 옆) ──────────────────────────────────────
    if (room.character) {
      const ch = drawCharacter(room.character.key)
      const deskCenter = iso(ROOM_W * 0.45, ROOM_D * 0.45)
      ch.x = deskCenter.x + room.character.offset.x
      ch.y = deskCenter.y + room.character.offset.y + 10
      roomContainer.addChild(ch)
      app.ticker.add((ticker) => tickCharacter(ch, ticker.deltaTime, idx * 0.7))
    }
    if (room.character2) {
      const ch = drawCharacter(room.character2.key)
      const deskCenter = iso(ROOM_W * 0.45, ROOM_D * 0.45)
      ch.x = deskCenter.x + room.character2.offset.x
      ch.y = deskCenter.y + room.character2.offset.y + 10
      ch.scale.set(0.85) // 살짝 작게
      roomContainer.addChild(ch)
      app.ticker.add((ticker) => tickCharacter(ch, ticker.deltaTime, idx * 0.7 + 1.5))
    }

    world.addChild(roomContainer)
  })

  return world
}

export { SCENE_ROOMS }
void ({} as DecorKind) // 타입 보존