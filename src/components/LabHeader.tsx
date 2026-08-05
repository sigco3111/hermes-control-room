// LabHeader — Twin Lab 톤 헤더 (8개 부서 chip + 시계 + 메트릭)
import { useState, useEffect } from 'react'
import { HERMES_ROOMS, type HermesRoomId } from '../hermesRooms'
//

export interface HermesMetrics {
  activeCrons: number
  memoryUsed: number
  memoryCap: number
  tistoryToday: number
  sessionCount: number
}

export interface LabHeaderProps {
  metrics: HermesMetrics
  selectedRoomId: HermesRoomId | null
  onSelectRoom: (id: HermesRoomId) => void
}

export function LabHeader({ metrics, selectedRoomId, onSelectRoom }: LabHeaderProps) {
  const [now, setNow] = useState<string>(formatHHMM(new Date()))

  useEffect(() => {
    const id = setInterval(() => setNow(formatHHMM(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="lab-header">
      <div className="lab-header__left">
        <span className="lab-header__title">🏛️ 헤르메스 관제실</span>
        <span className="lab-header__clock">{now}</span>
      </div>
      <div className="lab-header__center">
        {HERMES_ROOMS.map(r => {
          const active = selectedRoomId === r.id
          return (
            <button
              key={r.id}
              type="button"
              className={`lab-header__chip ${active ? 'is-active' : ''} lab-header__chip--${r.status}`}
              onClick={() => onSelectRoom(r.id)}
              title={r.description}
            >
              <span className="lab-header__chip-emoji">{r.emoji}</span>
              <span className="lab-header__chip-label">{(r as any).shortLabel || r.name}</span>
            </button>
          )
        })}
      </div>
      <div className="lab-header__right">
        <span className="lab-header__metric">
          <span className="lab-header__metric-label">활성</span>
          <span className="lab-header__metric-value">{metrics.activeCrons}</span>
        </span>
        <span className="lab-header__metric">
          <span className="lab-header__metric-label">메모리</span>
          <span className="lab-header__metric-value">
            {metrics.memoryUsed}/{metrics.memoryCap}
          </span>
        </span>
        <span className="lab-header__metric">
          <span className="lab-header__metric-label">Tistory</span>
          <span className="lab-header__metric-value">{metrics.tistoryToday}</span>
        </span>
        <span className="lab-header__metric">
          <span className="lab-header__metric-label">세션</span>
          <span className="lab-header__metric-value">{metrics.sessionCount}</span>
        </span>
      </div>
    </header>
  )
}

function formatHHMM(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
