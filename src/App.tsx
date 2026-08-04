import { useEffect, useRef, useState } from 'react'
import { Application, Container, Graphics, Rectangle, Text, TextStyle } from 'pixi.js'
import './App.css'

type Room = { label: string; color: number; status: string; scripts: readonly string[]; lastRun: string; nextRun: string; lastStatus: string }
type State = { timestamp: string; activeCrons: number; memoryUsed: number; memoryCap: number; tistoryToday: number; sessionCount: number; rooms: Record<string, Room> }

const palette: Record<string, number> = { mintgreen: 0x76cdb2, red: 0xef7774, purple: 0xb195dc, orange: 0xf0a15c, yellow: 0xf0d36d, pink: 0xe99bb8, cyan: 0x70c5d7, gray: 0x9ba8ad }
const fallback: State = { timestamp: new Date().toISOString(), activeCrons: 19, memoryUsed: 2189, memoryCap: 2200, tistoryToday: 0, sessionCount: 1, rooms: {} }
const roomDefs = [
  ['tistory','📝 티스토리 발행실','mintgreen',['b1bca63a117a','0b0e9f44e10a','b21d94a14860']], ['errors','🔍 에러 감시실','red',['e0ba30d8a122','81f1c81f8664']], ['graph','🧠 지식 그래프실','purple',['d7bd4309bbf0','388898171a79','e330c7de50d1']], ['improve','🔄 자기 개선실','orange',['5d0f14aef84c','ed5f37705e68']], ['trend','🔥 트렌드 모니터실','yellow',['b26b0579a45f','e330c7de50d1','075bec58df7b']], ['notebook','📓 노트북LM실','pink',['dc9a2e6aaaaa']], ['blog','🎬 블로그/뉴스레터실','cyan',['b02a45f4d14e','0f893ba14797','582ecc59aaee']], ['infra','⚙️ 인프라/동기화실','gray',['5a376ec002c3','7c2b9a9be162','memory-error-tracker']],
] as const

function normalizeState(raw: Partial<State>): State { const rooms: Record<string, Room> = {}; roomDefs.forEach(([id,label,tone,scripts]) => { const r = raw.rooms?.[id]; rooms[id] = { label, color: palette[tone], status: r?.status ?? 'active', scripts: r?.scripts ?? scripts, lastRun: r?.lastRun ?? '2026-08-04T06:11', nextRun: r?.nextRun ?? '5분 이내', lastStatus: r?.lastStatus ?? 'success' } }); return { ...fallback, ...raw, rooms } }

function iso(x:number,y:number): {x:number;y:number} { return { x: (x-y)*1.0, y: (x+y)*0.5 } } // cos30:sin30 = 2:1
function drawScene(app: Application, state: State, onSelect: (id:string)=>void) {
  void state
  const world = new Container(); world.x = Math.max(430, app.screen.width * .38); world.y = Math.max(215, app.screen.height * .27); world.scale.set(Math.min(1.1, app.screen.width / 1200)); app.stage.addChild(world)
  const floor = new Graphics().rect(-560,-260,1120,540).fill(0x182d35).stroke({width:2,color:0x2c4b51,alpha:.8}); world.addChild(floor)
  for(let i=-10;i<=10;i++){ world.addChild(new Graphics().moveTo(i*52,-260).lineTo(i*52+270,10).stroke({width:1,color:0x2b5055,alpha:.65})); world.addChild(new Graphics().moveTo(-560+i*52,-10).lineTo(-290+i*52,260).stroke({width:1,color:0x2b5055,alpha:.65})) }
  roomDefs.forEach(([id,label,tone], index) => { const gridX=index%4, gridY=Math.floor(index/4); const p=iso(gridX*190,gridY*190); const card = new Container(); card.x=p.x; card.y=p.y; card.eventMode='static'; card.cursor='pointer'; card.hitArea=new Rectangle(-80,-70,160,110); card.on('pointertap',()=>onSelect(id));
    const g=new Graphics(); g.moveTo(-72,-42).lineTo(0,-78).lineTo(72,-42).lineTo(0,-6).closePath().fill(palette[tone]).stroke({width:2,color:0xffffff,alpha:.35}); g.moveTo(-72,-42).lineTo(-72,18).lineTo(0,54).lineTo(0,-6).closePath().fill(0x315862); g.moveTo(72,-42).lineTo(72,18).lineTo(0,54).lineTo(0,-6).closePath().fill(0x25434d); card.addChild(g)
    const tag=new Graphics().roundRect(-64,0,128,24,5).fill(0xf5f9f7).stroke({width:1,color:palette[tone]}); card.addChild(tag); const t=new Text({text:label,style:new TextStyle({fontFamily:'Arial, sans-serif',fontSize:11,fill:0x18313a,fontWeight:'700',align:'center'})}); t.anchor.set(.5); t.x=0;t.y=12;card.addChild(t)
    for(let c=0;c<2;c++){ const agent=new Container(); agent.x=-28+c*56; agent.y= -10; agent.pivot.set(0,24); agent.scale.set(1); const body=new Graphics().roundRect(-10,0,20,29,9).fill(c===0?0x69cf95:0x75b9d2).stroke({width:2,color:0x12343b}); const head=new Graphics().circle(0,-9,8).fill(0xffd7b5).stroke({width:2,color:0x12343b}); agent.addChild(body,head); card.addChild(agent); if(c===0) app.ticker.add(()=>{ const s=1+Math.sin(performance.now()/650+index)*.025; agent.scale.set(s) }) }
    // 나무 장식
    const tree=new Graphics().circle(-103,18,17).fill(0x6fbd88).circle(-115,4,13).fill(0x8fd49b).rect(-107,24,8,22).fill(0x875d49); card.addChild(tree); world.addChild(card)
  })
  void world
  return world
}

export default function App(){ const canvasRef=useRef<HTMLDivElement>(null); const [state,setState]=useState<State>(fallback); const [selected,setSelected]=useState('tistory'); const [zoom,setZoom]=useState(1)
  useEffect(()=>{ fetch('/state.json').then(r=>r.ok?r.json():Promise.reject()).then((x:State)=>setState(normalizeState(x))).catch(()=>setState(normalizeState({}))) },[])
  useEffect(()=>{ let app:Application|undefined; const mount=canvasRef.current; if(!mount)return; (async()=>{ app=new Application(); await app.init({ resizeTo:mount, background:0xf5f9f7, antialias:false, preference:'webgl' }); mount.appendChild(app.canvas); drawScene(app,state,(id)=>setSelected(id)); app.canvas.style.imageRendering='pixelated'; const wheel=(e:WheelEvent)=>{e.preventDefault();setZoom(z=>Math.max(.75,Math.min(1.35,z-e.deltaY*.0005)))}; mount.addEventListener('wheel',wheel,{passive:false}); return()=>{mount.removeEventListener('wheel',wheel);app?.destroy(true,{children:true})} })(); return()=>{ app?.destroy(true,{children:true}) } },[state])
  const room=state.rooms[selected] ?? normalizeState({}).rooms.tistory
  const now=new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',second:'2-digit'})
  return <main className="app-root"><div ref={canvasRef} className="pixi-stage" style={{'--zoom':zoom} as React.CSSProperties}/><header className="topbar"><div className="title">🏛️ 헤르메스 관제실 <span>PIXEL OPERATIONS / 2.5D</span></div><div className="metrics"><b>{now}</b><span>활성 크론 <strong>{state.activeCrons}</strong></span><span>메모리 <strong>{state.memoryUsed}/{state.memoryCap}</strong></span><span>Tistory 오늘 <strong>{state.tistoryToday}</strong></span><span>오늘 세션 <strong>{state.sessionCount}</strong></span></div></header><aside className="side-panel"><div className="panel-kicker">ROOM TELEMETRY</div><h2>{room.label}</h2><div className="status"><i/> {room.status.toUpperCase()} · {room.lastStatus}</div><dl><dt>최근 실행</dt><dd>{room.lastRun}</dd><dt>다음 실행</dt><dd>{room.nextRun}</dd></dl><h3>연결된 스크립트</h3><ul>{room.scripts.map(x=><li key={x}>{x}</li>)}</ul></aside><div className="legend"><b>상태</b><span>🟢 idle</span><span>🟡 waiting</span><span>⚪ inactive</span><span>🔴 error</span></div><div className="ticker"><b>EVENT STREAM</b><span>● {state.timestamp.slice(11,19)} snapshot-state 동기화 완료</span><span>● 최근 이벤트 10건 · 모든 관제실 연결 정상</span><span>● 픽셀 관제실 heartbeat 수신</span></div></main>
}
