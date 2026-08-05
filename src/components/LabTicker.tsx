// LabTicker — Twin Lab 톤 하단 티커 (60s linear flow)
import { HERMES_ROOMS } from '../hermesRooms'

export interface TickerItem {
  emoji: string
  room: string
  message: string
  timestamp?: string
}

export interface LabTickerProps {
  events?: TickerItem[]
}

const STATUS_LABELS: Record<string, string> = {
  active: '작업 중',
  idle: '대기',
  waiting: '대기열',
  inactive: '비활성',
  error: '오류',
}

const DEFAULT_EVENTS: TickerItem[] = HERMES_ROOMS.flatMap(r => [
  { emoji: r.emoji, room: r.name, message: `${STATUS_LABELS[r.status] ?? r.status} — ${r.description.slice(0, 18)}…`, timestamp: 'live' },
])

export function LabTicker({ events = DEFAULT_EVENTS }: LabTickerProps) {
  return (
    <footer className="lab-ticker">
      <span className="lab-ticker__label">LIVE</span>
      <div className="lab-ticker__track">
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
