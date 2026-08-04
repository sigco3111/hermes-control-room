// drawCharacter.ts — W17ant/Claude-Office 픽셀 아트 캐릭터 PNG를 PixiJS v8 Sprite로 그린다.
//
// 출처: W17ant/Claude-Office (https://github.com/W17ant/Claude-Office)
// 라이선스: MIT — public/assets/characters/CREDITS.md 참조
//
// PixiJS v8의 Assets.load() API로 비동기 로드 후 Sprite로 변환.
// 로딩 실패 시 fallback 도형(캡슐+원)을 그려서 화면이 비지 않도록 한다.

import { Assets, Container, Graphics, Sprite } from 'pixi.js'

export type CharacterKey =
  | 'tistory-a'
  | 'tistory-b'
  | 'errors-a'
  | 'errors-b'
  | 'graph-a'
  | 'improve-a'
  | 'notebook-a'
  | 'infra-a'

const FALLBACK_COLORS: Record<CharacterKey, { body: number; head: number }> = {
  'tistory-a': { body: 0x76cdb2, head: 0xffd7b5 },
  'tistory-b': { body: 0xe99bb8, head: 0xffd7b5 },
  'errors-a': { body: 0xef7774, head: 0xf0d36d },
  'errors-b': { body: 0xb195dc, head: 0xffd7b5 },
  'graph-a': { body: 0x70c5d7, head: 0xffd7b5 },
  'improve-a': { body: 0xf0a15c, head: 0xd8a878 },
  'notebook-a': { body: 0x9ba8ad, head: 0xf0d36d },
  'infra-a': { body: 0x9ba8ad, head: 0xffd7b5 },
}

// PixiJS v8: Assets.load()는 비동기. 모듈 로드 시 1회 미리 캐싱.
// (App.tsx가 mount 되기 전에 호출되므로 main 진입점에서 preload 권장)
let cached = false
export async function preloadCharacters(keys: CharacterKey[]): Promise<void> {
  if (cached) return
  await Promise.all(
    keys.map((k) =>
      Assets.load({ alias: k, src: `assets/characters/${k}.png` }).catch((err) => {
        console.warn(`[drawCharacter] 캐릭터 로드 실패: ${k}`, err)
      }),
    ),
  )
  cached = true
}

/**
 * 캐릭터 1명을 그린다.
 * - key에 해당하는 PNG가 있으면 Sprite로 표시
 * - 없거나 로드 실패 시 캡슐+원 fallback
 *
 * 반환된 Container의 anchor/원점: 발 위치 (0, 0).
 *   → 컨테이너의 (x, y)는 캐릭터가 "서 있는 발 위치"
 */
export function drawCharacter(key: CharacterKey): Container {
  const wrap = new Container()

  const tex = Assets.cache.get(key)
  if (tex && tex.source) {
    const sprite = new Sprite(tex)
    // 원본 197x527 (다운스케일 후 ~50x134). 화면 표시 크기 약 60x120.
    sprite.width = 60
    sprite.height = 120
    // 발 위치 기준으로 정렬 (좌하단)
    sprite.anchor.set(0.5, 1)
    wrap.addChild(sprite)
  } else {
    // fallback: 캡슐 몸통 + 머리 원
    const c = FALLBACK_COLORS[key]
    const body = new Graphics().roundRect(-12, -38, 24, 32, 10).fill(c.body).stroke({ width: 1.5, color: 0x12343b })
    const head = new Graphics().circle(0, -45, 10).fill(c.head).stroke({ width: 1.5, color: 0x12343b })
    wrap.addChild(body, head)
  }

  // 발 위치로 정렬 — 컨테이너는 (0,0) 기준, sprite는 anchor로 발 위치 고정
  // → wrap의 (x, y)는 발 끝
  return wrap
}

/**
 * 캐릭터 발 위치의 살짝 숨 쉬기/걷기 애니메이션용 ticker 콜백
 * 호출 예: app.ticker.add((ticker) => tickCharacter(character, ticker.deltaTime))
 */
export function tickCharacter(wrap: Container, deltaTime: number, phase: number): void {
  // 살짝 위아래 호흡 (Twin Lab 룩: 캐릭터가 "서 있다" 느낌 유지)
  const breathe = 1 + Math.sin(performance.now() / 700 + phase) * 0.012
  wrap.scale.set(breathe)
  void deltaTime
}