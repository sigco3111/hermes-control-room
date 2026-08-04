// LabTicker — Twin Lab 톤 하단 티커 (뉴스 흐름)
import { useEffect, useState } from 'react'
import { HERMES_ROOMS } from '../hermesRooms'

export interface TickerItem {
  emoji: string
  room: string
  message: string
  timestamp?: string
}

export interface LabTickerProps {
  /** 초기 이벤트 (state.json에서 fetch 가능 시 override) */
  events?: TickerItem[]
}

/** 기본 mock 이벤트 — snapshot-state.mjs가 빌드 시 덮어쓸 수 있음 */
const DEFAULT_EVENTS: TickerItem[] = HERMES_ROOMS.flatMap((r) => [
  { emoji: r.emoji, room: r.name, message: '작업 시작', timestamp: '방금' },
  { emoji: r.emoji, room: r.name, message: '정상 가동 중', timestamp: '1분 전' },
  { emoji: r.emoji, room: r.name, message: '대기 상태', timestamp: '2분 전' },
])

export function LabTicker({ events = DEFAULT_EVENTS }: LabTickerProps) {
  // CSS marquee가 처리 — 별도 상태 불필요
  return (
    <footer className="lab-ticker">
      <div className="lab-ticker__track">
        {/* 트랙 2번 출력 → 무한 흐름 효과 */}
        <div className="lab-ticker__row">
          {events.map((e, i) => (
            <TickerBullet key={`a-${i}`} item={e} />
          ))}
        </div>
        <div className="lab-ticker__row" aria-hidden>
          {events.map((e, i) => (
            <TickerBullet key={`b-${i}`} item={e} />
          ))}
        </div>
      </div>
    </footer>
  )
}

function TickerBullet({ item }: { item: TickerItem }) {
  return (
    <span className="lab-ticker__bullet">
      <span className="lab-ticker__bullet-emoji">{item.emoji}</span>
      <span className="lab-ticker__bullet-room">{item.room}</span>
      <span className="lab-ticker__bullet-msg">{item.message}</span>
      {item.timestamp && <span className="lab-ticker__bullet-ts">{item.timestamp}</span>}
    </span>
  )
}