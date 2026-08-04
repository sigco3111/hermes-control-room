// App.tsx — 헤르메스 관제실 (Twin Lab 룩 이식 버전)
// W17ant/Claude-Office의 rooms.ts 패턴 + 캐릭터 PNG sprite를 PixiJS v8로 이식.
// 출처 표기: public/assets/characters/CREDITS.md 참조
//
// 핵심 아키텍처:
//   src/scene/drawRoom.ts      — 룸 1개 (바닥/벽/지붕/창문/문/책상/의자/decoration)
//   src/scene/drawCharacter.ts — 캐릭터 1명 (PNG sprite 또는 fallback 도형)
//   src/scene/drawScene.ts     — 8개 방 + 캐릭터 배치 + 바닥 decoration
//   src/App.tsx                — PixiJS Application 마운트 + HUD/사이드 패널

import { useEffect, useRef, useState } from 'react'
import { Application } from 'pixi.js'
import { drawScene } from './scene/drawScene'
import { preloadCharacters } from './scene/drawCharacter'
import './App.css'

type Room = { label: string; color: number; status: string; scripts: readonly string[]; lastRun: string; nextRun: string; lastStatus: string }
type State = { timestamp: string; activeCrons: number; memoryUsed: number; memoryCap: number; tistoryToday: number; sessionCount: number; rooms: Record<string, Room> }

// Twin Lab 룩에서 차용한 팔레트 (W17ant/Claude-Office 톤과 호환)
const palette: Record<string, number> = { mintgreen: 0x76cdb2, red: 0xef7774, purple: 0xb195dc, orange: 0xf0a15c, yellow: 0xf0d36d, pink: 0xe99bb8, cyan: 0x70c5d7, gray: 0x9ba8ad }
const fallback: State = { timestamp: new Date().toISOString(), activeCrons: 19, memoryUsed: 2189, memoryCap: 2200, tistoryToday: 0, sessionCount: 1, rooms: {} }
const roomDefs = [
  ['tistory','📝 티스토리 발행실','mintgreen',['b1bca63a117a','0b0e9f44e10a','b21d94a14860']], ['errors','🔍 에러 감시실','red',['e0ba30d8a122','81f1c81f8664']], ['graph','🧠 지식 그래프실','purple',['d7bd4309bbf0','388898171a79','e330c7de50d1']], ['improve','🔄 자기 개선실','orange',['5d0f14aef84c','ed5f37705e68']], ['trend','🔥 트렌드 모니터실','yellow',['b26b0579a45f','e330c7de50d1','075bec58df7b']], ['notebook','📓 노트북LM실','pink',['dc9a2e6aaaaa']], ['blog','🎬 블로그/뉴스레터실','cyan',['b02a45f4d14e','0f893ba14797','582ecc59aaee']], ['infra','⚙️ 인프라/동기화실','gray',['5a376ec002c3','7c2b9a9be162','memory-error-tracker']],
] as const

function normalizeState(raw: Partial<State>): State {
  const rooms: Record<string, Room> = {}
  roomDefs.forEach(([id, label, tone, scripts]) => {
    const r = raw.rooms?.[id]
    rooms[id] = {
      label,
      color: palette[tone],
      status: r?.status ?? 'active',
      scripts: r?.scripts ?? scripts,
      lastRun: r?.lastRun ?? '2026-08-04T06:11',
      nextRun: r?.nextRun ?? '5분 이내',
      lastStatus: r?.lastStatus ?? 'success',
    }
  })
  return { ...fallback, ...raw, rooms }
}

export default function App() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<State>(fallback)
  const [selected, setSelected] = useState('tistory')
  const [zoom, setZoom] = useState(1)

  // state.json fetch
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/state.json')
        if (r.ok) {
          const x = await r.json()
          setState(normalizeState(x))
        } else {
          setState(normalizeState({}))
        }
      } catch {
        setState(normalizeState({}))
      }
    })()
  }, [])

  // PixiJS Application 라이프사이클
  useEffect(() => {
    let app: Application | undefined
    let cancelled = false
    let wheelHandler: ((e: WheelEvent) => void) | undefined
    const mount = canvasRef.current
    if (!mount) return

    ;(async () => {
      // 1. 캐릭터 PNG 8명 preload (실패해도 fallback 도형으로 진행)
      try {
        await preloadCharacters([
          'tistory-a', 'tistory-b',
          'errors-a', 'errors-b',
          'graph-a',
          'improve-a',
          'notebook-a',
          'infra-a',
        ])
      } catch (err) {
        console.warn('[App] 캐릭터 preload 중 일부 실패 — fallback 사용', err)
      }

      // 2. Application 초기화
      app = new Application()
      await app.init({
        resizeTo: mount,
        background: 0xf5f9f7,
        antialias: false,
        preference: 'webgl',
      })
      if (cancelled) {
        // effect cleanup 됨 — 이미 init만 한 인스턴스 정리
        try { await app.destroy(true, { children: true }) } catch { /* ignore double-destroy */ }
        return
      }
      mount.appendChild(app.canvas)
      drawScene(app, (id) => setSelected(id))
      app.canvas.style.imageRendering = 'pixelated'

      // wheel zoom 핸들러 등록
      wheelHandler = (e: WheelEvent) => {
        e.preventDefault()
        setZoom((z) => Math.max(0.75, Math.min(1.35, z - e.deltaY * 0.0005)))
      }
      mount.addEventListener('wheel', wheelHandler, { passive: false })
    })()

    return () => {
      cancelled = true
      if (wheelHandler && mount) mount.removeEventListener('wheel', wheelHandler)
      // PixiJS v8 destroy는 async — try/catch로 안전하게
      if (app) {
        try { app.destroy(true, { children: true }) } catch (e) { /* ignore double-destroy */ void e }
      }
    }
  }, [state])

  const room = state.rooms[selected] ?? normalizeState({}).rooms.tistory
  const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <main className="app-root">
      <div ref={canvasRef} className="pixi-stage" style={{ '--zoom': zoom } as React.CSSProperties} />
      <header className="topbar">
        <div className="title">
          🏛️ 헤르메스 관제실 <span>PIXEL OPERATIONS / 2.5D · Twin Lab 룩</span>
        </div>
        <div className="metrics">
          <b>{now}</b>
          <span>활성 크론 <strong>{state.activeCrons}</strong></span>
          <span>메모리 <strong>{state.memoryUsed}/{state.memoryCap}</strong></span>
          <span>Tistory 오늘 <strong>{state.tistoryToday}</strong></span>
          <span>오늘 세션 <strong>{state.sessionCount}</strong></span>
        </div>
      </header>
      <aside className="side-panel">
        <div className="panel-kicker">ROOM TELEMETRY</div>
        <h2>{room.label}</h2>
        <div className="status"><i /> {room.status.toUpperCase()} · {room.lastStatus}</div>
        <dl>
          <dt>최근 실행</dt>
          <dd>{room.lastRun}</dd>
          <dt>다음 실행</dt>
          <dd>{room.nextRun}</dd>
        </dl>
        <h3>연결된 스크립트</h3>
        <ul>{room.scripts.map((x) => <li key={x}>{x}</li>)}</ul>
        <div className="credits">
          캐릭터: <a href="https://github.com/W17ant/Claude-Office" target="_blank" rel="noreferrer">W17ant/Claude-Office</a> (MIT)
        </div>
      </aside>
      <div className="legend">
        <b>상태</b>
        <span>🟢 idle</span>
        <span>🟡 waiting</span>
        <span>⚪ inactive</span>
        <span>🔴 error</span>
      </div>
      <div className="ticker">
        <b>EVENT STREAM</b>
        <span>● {state.timestamp.slice(11, 19)} snapshot-state 동기화 완료</span>
        <span>● 최근 이벤트 10건 · 모든 관제실 연결 정상</span>
        <span>● Twin Lab 룩 이식 — 8개 룸 + 캐릭터 sprite</span>
      </div>
    </main>
  )
}