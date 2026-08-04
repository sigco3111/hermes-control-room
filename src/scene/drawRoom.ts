// drawRoom.ts — Twin Lab 룩의 isometric 룸 1개를 그리는 모듈
// W17ant/Claude-Office의 rooms.ts 패턴(책상/의자/책장/Whiteboard/창문/문/카펫)을
// PixiJS v8 박스 그래픽으로 이식한다.
//
// 좌표계: 각 룸의 중심을 (0,0)으로 두고, isometric 투영:
//   화면X = (월드X - 월드Y)
//   화면Y = (월드X + 월드Y) * 0.5
//
// 룸 크기: 폭 200, 깊이 160 (월드 단위). 지붕 높이 80.

import { Container, Graphics } from 'pixi.js'

// 룸 1개에 들어가는 furniture 정의
export interface RoomFurniture {
  // 책상/의자/책장/Whiteboard/Kanban — 색상이 다르면 Twin Lab 룩이 강해진다
  deskColor?: number   // 책상 상판 색
  chairColor?: number  // 의자 색
  shelfColor?: number  // 책장 색
  boardColor?: number  // Whiteboard/Kanban 색
  monitorColor?: number // 모니터 액정 색
  // decoration 텍스트 (Whiteboard 글씨 같은 느낌)
  boardLabel?: string
  // 어떤 decoration을 켤지 (Twin Lab은 방마다 다른 1~2개)
  decor: DecorKind
  // 카펫 색 (방마다 다르게)
  carpetColor?: number
}

export type DecorKind =
  | 'plant'      // 큰 화분
  | 'lamp'       // 스탠드 조명
  | 'server'     // 서버랙 (infra)
  | 'bookshelf'  // 책장 (graph)
  | 'whiteboard' // 칠판 (improve/trend)
  | 'laptop'     // 노트북 (notebook)
  | 'printer'    // 프린터 (tistory)
  | 'coffee'     // 커피머신 (errors)

export interface RoomColors {
  floor: number   // 바닥 평면 (어두운 톤)
  wallLeft: number  // 좌측 벽 (밝은 톤)
  wallRight: number // 우측 벽 (어두운 톤)
  roof: number    // 지붕 평면
  roofSide: number // 지붕 옆면
  outline: number // 외곽선
  window: number  // 창문 프레임
  door: number    // 문 색
}

const DEFAULT_COLORS: RoomColors = {
  floor: 0x18313a,
  wallLeft: 0x2c4b51,
  wallRight: 0x1d3a40,
  roof: 0x2c4b51,
  roofSide: 0x1d3a40,
  outline: 0xf5f9f7,
  window: 0x6cd1c5,
  door: 0x6f4f3a,
}

// 룸 상수 — Twin Lab 룩에 맞춰 큰 박스형 룸으로 잡는다
export const ROOM_W = 200  // 월드 폭
export const ROOM_D = 160  // 월드 깊이
export const WALL_H = 80   // 벽 높이 (월드 Y 단위)

/**
 * iso(x, y): 월드 좌표 → 화면 좌표
 *  - 화면 X = x - y
 *  - 화면 Y = (x + y) * 0.5
 */
export function iso(x: number, y: number): { x: number; y: number } {
  return { x: x - y, y: (x + y) * 0.5 }
}

/**
 * 룸 1개를 그린다. 반환된 Container를 월드 컨테이너에 addChild하면 됨.
 * - 좌측 벽 = 화면 왼쪽으로 보이는 벽 (x=0 면)
 * - 우측 벽 = 화면 오른쪽으로 보이는 벽 (y=0 면)
 * - 바닥 = (0,0)~(W,D) 평면
 * - 지붕 = 바닥과 같은 평면 모양의 평면 + 옆면(2개)
 * - 창문 = 좌측 벽 또는 우측 벽 중앙에 작은 박스
 * - 문 = 좌측 벽 또는 우측 벽 끝에 작은 박스
 */
export function drawRoom(opts: {
  tone: number          // 이 룸의 톤 컬러 (책상/문 강조)
  furniture?: RoomFurniture
  colors?: Partial<RoomColors>
}): Container {
  const colors: RoomColors = { ...DEFAULT_COLORS, ...(opts.colors ?? {}) }
  const tone = opts.tone
  const f = opts.furniture ?? { decor: 'plant' as DecorKind }

  const room = new Container()

  // ── 1. 바닥 평면 (다이아몬드형) ──────────────────────────────
  // (0,0) (W,0) (W,D) (0,D) → iso 변환
  const a = iso(0, 0)
  const b = iso(ROOM_W, 0)
  const c = iso(ROOM_W, ROOM_D)
  const d = iso(0, ROOM_D)
  const floor = new Graphics()
    .moveTo(a.x, a.y)
    .lineTo(b.x, b.y)
    .lineTo(c.x, c.y)
    .lineTo(d.x, d.y)
    .closePath()
    .fill(colors.floor)
    .stroke({ width: 2, color: colors.outline, alpha: 0.55 })
  room.addChild(floor)

  // ── 2. 카펫 (방 안 작은 직사각형, Twin Lab 룩) ──────────────
  if (f.carpetColor !== undefined) {
    const carpet = drawCarpet(f.carpetColor)
    room.addChild(carpet)
  }

  // ── 3. 좌측 벽 (x=0 면) — 벽이 "위로" 보이는 면 ───────────────
  // (0,0)→(0,0,-H)→(0,D,-H)→(0,D) 닫힌 평면
  const leftWall = drawWallFace(
    iso(0, 0),
    iso(0, ROOM_D),
    -WALL_H,
    colors.wallLeft,
    colors.outline,
  )
  room.addChild(leftWall)

  // ── 4. 우측 벽 (y=0 면) ───────────────────────────────────────
  const rightWall = drawWallFace(
    iso(0, 0),
    iso(ROOM_W, 0),
    -WALL_H,
    colors.wallRight,
    colors.outline,
  )
  room.addChild(rightWall)

  // ── 5. 지붕 평면 (ROOM_W × ROOM_D 평면을 WALL_H 만큼 위로) ───
  const roofTop = new Graphics()
    .moveTo(iso(0, 0).x, iso(0, 0).y - WALL_H)
    .lineTo(iso(ROOM_W, 0).x, iso(ROOM_W, 0).y - WALL_H)
    .lineTo(iso(ROOM_W, ROOM_D).x, iso(ROOM_W, ROOM_D).y - WALL_H)
    .lineTo(iso(0, ROOM_D).x, iso(0, ROOM_D).y - WALL_H)
    .closePath()
    .fill(colors.roof)
    .stroke({ width: 1.5, color: colors.outline, alpha: 0.5 })
  room.addChild(roofTop)

  // 지붕 옆면 (좌/우측 벽 위 모서리 띠) — 입체감
  const roofSideL = new Graphics()
    .moveTo(iso(0, 0).x, iso(0, 0).y - WALL_H)
    .lineTo(iso(0, ROOM_D).x, iso(0, ROOM_D).y - WALL_H)
    .lineTo(iso(0, ROOM_D).x, iso(0, ROOM_D).y)
    .lineTo(iso(0, 0).x, iso(0, 0).y)
    .closePath()
    .fill(colors.roofSide)
    .stroke({ width: 1, color: colors.outline, alpha: 0.35 })
  room.addChild(roofSideL)
  const roofSideR = new Graphics()
    .moveTo(iso(0, 0).x, iso(0, 0).y - WALL_H)
    .lineTo(iso(ROOM_W, 0).x, iso(ROOM_W, 0).y - WALL_H)
    .lineTo(iso(ROOM_W, 0).x, iso(ROOM_W, 0).y)
    .lineTo(iso(0, 0).x, iso(0, 0).y)
    .closePath()
    .fill(colors.roofSide)
    .stroke({ width: 1, color: colors.outline, alpha: 0.35 })
  room.addChild(roofSideR)

  // ── 6. 창문 (좌측 벽 중앙) ───────────────────────────────────
  const win = drawWindow(colors.window, colors.outline)
  win.x = iso(0, ROOM_D * 0.55).x + 2
  win.y = iso(0, ROOM_D * 0.55).y - WALL_H * 0.55
  room.addChild(win)

  // ── 7. 문 (우측 벽 끝) ───────────────────────────────────────
  const door = drawDoor(colors.door, tone, colors.outline)
  door.x = iso(ROOM_W * 0.2, 0).x + 4
  door.y = iso(ROOM_W * 0.2, 0).y - WALL_H * 0.5
  room.addChild(door)

  // ── 8. 책상 + 의자 (방 안, 책상 위 모니터) ──────────────────
  const deskColor = f.deskColor ?? tone
  const chairColor = f.chairColor ?? 0x5a3a30
  const monitorColor = f.monitorColor ?? 0x18313a
  const desk = drawDesk(deskColor, chairColor, monitorColor, colors.outline)
  // 책상은 방 한가운데 약간 뒤쪽에 배치
  desk.x = iso(ROOM_W * 0.45, ROOM_D * 0.45).x
  desk.y = iso(ROOM_W * 0.45, ROOM_D * 0.45).y - 4
  room.addChild(desk)

  // ── 9. decoration (Twin Lab은 방마다 다른 1~2개) ──────────────
  const decor = drawDecor(f.decor, f, colors.outline)
  room.addChild(decor)

  return room
}

// ───────────────────────── helper: 카펫 ──────────────────────────
function drawCarpet(color: number): Graphics {
  const w = ROOM_W * 0.55
  const d = ROOM_D * 0.45
  const cx = ROOM_W * 0.5
  const cy = ROOM_D * 0.5
  const g = new Graphics()
  const a = iso(cx - w / 2, cy - d / 2)
  const b = iso(cx + w / 2, cy - d / 2)
  const cc = iso(cx + w / 2, cy + d / 2)
  const dd = iso(cx - w / 2, cy + d / 2)
  g.moveTo(a.x, a.y)
    .lineTo(b.x, b.y)
    .lineTo(cc.x, cc.y)
    .lineTo(dd.x, dd.y)
    .closePath()
    .fill(color)
    .stroke({ width: 1, color: 0xffffff, alpha: 0.25 })
  // 카펫 결 (가로 라인 2개)
  for (let i = 1; i < 3; i++) {
    const t = i / 3
    const p1 = iso(cx - w / 2 + t * w, cy - d / 2)
    const p2 = iso(cx - w / 2 + t * w, cy + d / 2)
    g.moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).stroke({ width: 1, color: 0xffffff, alpha: 0.12 })
  }
  return g
}

// ───────────────────────── helper: 벽 한 면 ──────────────────────────
function drawWallFace(
  bottomNear: { x: number; y: number },
  bottomFar: { x: number; y: number },
  riseY: number,
  fill: number,
  outline: number,
): Graphics {
  const g = new Graphics()
  // 벽을 "세로로 길게" 그리는 게 아니라, isometric에서 벽은 평행사변형
  // bottomNear → bottomFar → bottomFar + (0, riseY) → bottomNear + (0, riseY)
  g.moveTo(bottomNear.x, bottomNear.y)
    .lineTo(bottomFar.x, bottomFar.y)
    .lineTo(bottomFar.x, bottomFar.y + riseY)
    .lineTo(bottomNear.x, bottomNear.y + riseY)
    .closePath()
    .fill(fill)
    .stroke({ width: 1.5, color: outline, alpha: 0.55 })
  return g
}

// ───────────────────────── helper: 창문 ──────────────────────────
function drawWindow(glass: number, outline: number): Container {
  const c = new Container()
  // 좌측 벽에 박힌 작은 박스: 폭 26, 높이 18
  const g = new Graphics()
    .roundRect(-13, -9, 26, 18, 2)
    .fill(glass)
    .stroke({ width: 1.5, color: outline, alpha: 0.85 })
  c.addChild(g)
  // 창살 (가로 1, 세로 1)
  const m = new Graphics()
    .moveTo(-13, 0).lineTo(13, 0)
    .moveTo(0, -9).lineTo(0, 9)
    .stroke({ width: 1, color: outline, alpha: 0.6 })
  c.addChild(m)
  return c
}

// ───────────────────────── helper: 문 ──────────────────────────
function drawDoor(doorColor: number, accent: number, outline: number): Container {
  const c = new Container()
  const g = new Graphics()
    .roundRect(-12, -28, 24, 28, 2)
    .fill(doorColor)
    .stroke({ width: 1.5, color: outline, alpha: 0.85 })
  c.addChild(g)
  // 손잡이
  const knob = new Graphics().circle(6, -14, 1.5).fill(accent)
  c.addChild(knob)
  return c
}

// ───────────────────────── helper: 책상 + 의자 + 모니터 ──────────────────────────
function drawDesk(
  deskColor: number,
  chairColor: number,
  monitorColor: number,
  outline: number,
): Container {
  const c = new Container()

  // 책상 상판 — 박스형 평면 (월드 단위 → iso 좌표)
  const w = 50
  const d = 28
  const deskPos = iso(0, 0)
  const deskA = deskPos
  const deskB = iso(w, 0)
  const deskC = iso(w, d)
  const deskD = iso(0, d)
  const desk = new Graphics()
    .moveTo(deskA.x, deskA.y)
    .lineTo(deskB.x, deskB.y)
    .lineTo(deskC.x, deskC.y)
    .lineTo(deskD.x, deskD.y)
    .closePath()
    .fill(deskColor)
    .stroke({ width: 1.5, color: outline, alpha: 0.85 })
  c.addChild(desk)

  // 책상 다리 (앞쪽 좌우) — 짧은 세로 박스 2개
  const legL = new Graphics().rect(-3, 0, 3, 10).fill(0x1d3a40)
  legL.x = deskD.x
  legL.y = deskD.y - 4
  c.addChild(legL)
  const legR = legL.clone()
  legR.x = deskC.x - 3
  legR.y = deskC.y - 4
  c.addChild(legR)

  // 모니터 (책상 위 뒤쪽) — 작은 박스 위에 액정
  const mon = new Container()
  const monBody = new Graphics().roundRect(-12, -14, 24, 16, 2).fill(0x111a1d).stroke({ width: 1, color: outline, alpha: 0.85 })
  const monScreen = new Graphics().roundRect(-10, -12, 20, 12, 1).fill(monitorColor)
  mon.addChild(monBody, monScreen)
  // 받침대
  const monStand = new Graphics().rect(-3, 0, 6, 4).fill(0x111a1d)
  mon.addChild(monStand)
  mon.x = iso(w * 0.5, 4).x
  mon.y = iso(w * 0.5, 4).y - 14
  c.addChild(mon)

  // 의자 — 책상 앞쪽에 작은 박스
  const chair = new Container()
  const chairBack = new Graphics().roundRect(-7, -10, 14, 6, 1).fill(chairColor).stroke({ width: 1, color: outline, alpha: 0.8 })
  const chairSeat = new Graphics().roundRect(-7, -4, 14, 4, 1).fill(chairColor)
  chair.addChild(chairBack, chairSeat)
  chair.x = iso(w * 0.5, d + 6).x
  chair.y = iso(w * 0.5, d + 6).y
  c.addChild(chair)

  return c
}

// ───────────────────────── helper: decoration (Twin Lab은 방마다 다름) ──────────────────────────
function drawDecor(kind: DecorKind, f: RoomFurniture, outline: number): Container {
  switch (kind) {
    case 'plant':
      return drawPlant(outline)
    case 'lamp':
      return drawLamp(f.boardColor ?? 0xf0d36d, outline)
    case 'server':
      return drawServerRack(outline)
    case 'bookshelf':
      return drawBookshelf(f.shelfColor ?? 0x6f4f3a, outline)
    case 'whiteboard':
      return drawWhiteboard(outline, f.boardLabel ?? 'TODO')
    case 'laptop':
      return drawLaptop(outline)
    case 'printer':
      return drawPrinter(outline)
    case 'coffee':
      return drawCoffeeMachine(outline)
    default:
      return new Container()
  }
}

function drawPlant(outline: number): Container {
  const c = new Container()
  // 화분 (왼쪽 구석)
  const pot = new Graphics().roundRect(-9, 0, 18, 14, 2).fill(0x875d49).stroke({ width: 1, color: outline, alpha: 0.85 })
  const leaf1 = new Graphics().circle(0, -2, 9).fill(0x4a9c64)
  const leaf2 = new Graphics().circle(-7, -5, 6).fill(0x6fbd88)
  const leaf3 = new Graphics().circle(6, -7, 5).fill(0x6fbd88)
  c.addChild(pot, leaf1, leaf2, leaf3)
  c.x = iso(20, ROOM_D * 0.7).x
  c.y = iso(20, ROOM_D * 0.7).y - 12
  return c
}

function drawLamp(bulbColor: number, outline: number): Container {
  const c = new Container()
  const stand = new Graphics().rect(-1, 0, 2, 18).fill(0x111a1d)
  const shade = new Graphics().roundRect(-8, -10, 16, 10, 2).fill(0x6f4f3a).stroke({ width: 1, color: outline, alpha: 0.85 })
  const bulb = new Graphics().ellipse(0, -5, 6, 3).fill(bulbColor)
  c.addChild(stand, shade, bulb)
  c.x = iso(ROOM_W - 18, 18).x
  c.y = iso(ROOM_W - 18, 18).y - 18
  return c
}

function drawServerRack(outline: number): Container {
  const c = new Container()
  const rack = new Graphics().roundRect(-12, -30, 24, 32, 2).fill(0x111a1d).stroke({ width: 1.5, color: outline, alpha: 0.85 })
  c.addChild(rack)
  // LED 라인 5개
  for (let i = 0; i < 5; i++) {
    const led = new Graphics().roundRect(-10, -28 + i * 6, 20, 4, 1).fill(i % 2 === 0 ? 0x55bb84 : 0x2c4b51)
    c.addChild(led)
  }
  c.x = iso(ROOM_W * 0.18, ROOM_D * 0.65).x
  c.y = iso(ROOM_W * 0.18, ROOM_D * 0.65).y - 28
  return c
}

function drawBookshelf(shelfColor: number, outline: number): Container {
  const c = new Container()
  const shelf = new Graphics().roundRect(-16, -34, 32, 36, 2).fill(shelfColor).stroke({ width: 1.5, color: outline, alpha: 0.85 })
  c.addChild(shelf)
  // 책 3단
  const bookColors = [0xb195dc, 0xf0a15c, 0xef7774, 0x70c5d7]
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 5; col++) {
      const book = new Graphics().rect(-14 + col * 6, -32 + row * 10, 5, 8).fill(bookColors[(row + col) % bookColors.length])
      c.addChild(book)
    }
  }
  c.x = iso(ROOM_W * 0.82, ROOM_D * 0.6).x
  c.y = iso(ROOM_W * 0.82, ROOM_D * 0.6).y - 34
  return c
}

function drawWhiteboard(outline: number, label: string): Container {
  const c = new Container()
  const board = new Graphics().roundRect(-24, -18, 48, 24, 2).fill(0xf5f9f7).stroke({ width: 1.5, color: outline, alpha: 0.85 })
  c.addChild(board)
  // 글씨 라인 3개 (label을 짧게 그리기엔 text 렌더가 무거우니 직선으로)
  const lines = new Graphics()
  for (let i = 0; i < 3; i++) {
    lines.moveTo(-20, -12 + i * 7).lineTo(20 - (i === 2 ? 8 : 0), -12 + i * 7).stroke({ width: 1, color: 0x18313a, alpha: 0.8 })
  }
  c.addChild(lines)
  // label 무시 (직선으로 대체), 정보 손실 없음
  void label
  c.x = iso(ROOM_W * 0.5, 12).x
  c.y = iso(ROOM_W * 0.5, 12).y - WALL_H * 0.55
  return c
}

function drawLaptop(outline: number): Container {
  const c = new Container()
  const base = new Graphics().roundRect(-14, 0, 28, 4, 1).fill(0x111a1d).stroke({ width: 1, color: outline, alpha: 0.85 })
  const screen = new Graphics().roundRect(-13, -16, 26, 16, 1).fill(0x111a1d).stroke({ width: 1, color: outline, alpha: 0.85 })
  const screenInner = new Graphics().roundRect(-11, -14, 22, 12, 1).fill(0x6cd1c5)
  c.addChild(base, screen, screenInner)
  c.x = iso(ROOM_W * 0.78, ROOM_D * 0.75).x
  c.y = iso(ROOM_W * 0.78, ROOM_D * 0.75).y - 16
  return c
}

function drawPrinter(outline: number): Container {
  const c = new Container()
  const body = new Graphics().roundRect(-12, -10, 24, 16, 2).fill(0xf5f9f7).stroke({ width: 1.5, color: outline, alpha: 0.85 })
  const slot = new Graphics().rect(-10, -8, 20, 3).fill(0x18313a)
  const paper = new Graphics().rect(-6, -14, 12, 4).fill(0xf5f9f7).stroke({ width: 0.5, color: outline, alpha: 0.8 })
  c.addChild(body, slot, paper)
  c.x = iso(ROOM_W * 0.18, ROOM_D * 0.25).x
  c.y = iso(ROOM_W * 0.18, ROOM_D * 0.25).y - 10
  return c
}

function drawCoffeeMachine(outline: number): Container {
  const c = new Container()
  const body = new Graphics().roundRect(-10, -22, 20, 26, 2).fill(0x111a1d).stroke({ width: 1.5, color: outline, alpha: 0.85 })
  const spout = new Graphics().rect(-3, 0, 6, 8).fill(0x111a1d)
  const cup = new Graphics().roundRect(-4, 6, 8, 6, 1).fill(0xf5f9f7).stroke({ width: 0.5, color: outline, alpha: 0.8 })
  const led = new Graphics().circle(0, -16, 2).fill(0xef7774)
  c.addChild(body, spout, cup, led)
  c.x = iso(ROOM_W * 0.8, ROOM_D * 0.25).x
  c.y = iso(ROOM_W * 0.8, ROOM_D * 0.25).y - 22
  return c
}