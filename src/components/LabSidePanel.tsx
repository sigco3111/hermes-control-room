// LabSidePanel — Twin Lab 톤 사이드 패널 (방 상세)
import { HERMES_ROOMS, HermesRoomId, formatTimeAgo, formatTimeUntil, HERMES_ROOM_BY_ID } from '../hermesRooms'

export interface LabSidePanelProps {
  selectedRoomId: HermesRoomId | null
  onClose: () => void
  roomState?: {
    activeCrons?: number
    lastRun?: string | null
    nextRun?: string | null
    status?: 'active' | 'idle' | 'waiting' | 'error'
  }
}

export function LabSidePanel({ selectedRoomId, onClose, roomState }: LabSidePanelProps) {
  if (!selectedRoomId) {
    return (
      <aside className="lab-side-panel lab-side-panel--empty">
        <div className="lab-side-panel__head">
          <span className="lab-side-panel__kicker">ROOM TELEMETRY</span>
          <button className="lab-side-panel__close" onClick={onClose} aria-label="닫기">✕</button>
        </div>
        <div className="lab-side-panel__placeholder">
          <p>부서를 선택하면 상세 정보가 표시됩니다.</p>
          <ul className="lab-side-panel__chips">
            {HERMES_ROOMS.map((r) => (
              <li key={r.id} title={r.description}>
                <span className="lab-side-panel__chip-emoji">{r.emoji}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    )
  }

  const room = HERMES_ROOM_BY_ID[selectedRoomId]
  if (!room) return null

  const status = roomState?.status ?? 'active'
  const lastRun = roomState?.lastRun ?? null
  const nextRun = roomState?.nextRun ?? null

  return (
    <aside className="lab-side-panel">
      <div className="lab-side-panel__head">
        <span className="lab-side-panel__emoji">{room.emoji}</span>
        <h2 className="lab-side-panel__name">{room.name}</h2>
        <button className="lab-side-panel__close" onClick={onClose} aria-label="닫기">✕</button>
      </div>
      <div className="lab-side-panel__body">
        <p className="lab-side-panel__desc">{room.description}</p>
        <div className={`lab-side-panel__status lab-side-panel__status--${status}`}>
          <i /> {status.toUpperCase()}
        </div>
        <dl className="lab-side-panel__meta">
          <dt>최근 실행</dt>
          <dd>{lastRun ? formatTimeAgo(lastRun) : '—'}</dd>
          <dt>다음 실행</dt>
          <dd>{nextRun ? formatTimeUntil(nextRun) : '—'}</dd>
          <dt>매칭 skill</dt>
          <dd className="lab-side-panel__skills">
            {room.skillPrefixes.map((s) => (
              <code key={s} className="lab-side-panel__skill">
                {s}
              </code>
            ))}
          </dd>
        </dl>
      </div>
    </aside>
  )
}