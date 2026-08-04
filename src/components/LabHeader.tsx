// LabHeader — Twin Lab 톤 헤더
import { useState, useEffect } from 'react'
import { HERMES_ROOMS, HermesRoom } from '../hermesRooms'

export interface HermesMetrics {
  activeCrons: number
  memoryUsed: number
  memoryCap: number
  tistoryToday: number
  sessionCount: number
}

export interface LabHeaderProps {
  metrics: HermesMetrics
  selectedRoomId: string | null
  onSelectRoom: (id: string) => void
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
        {HERMES_ROOMS.map((r) => (
          <button
            key={r.id}
            className={`lab-header__chip ${selectedRoomId === r.id ? 'is-active' : ''}`}
            onClick={() => onSelectRoom(r.id)}
            title={r.name}
          >
            <span className="lab-header__chip-emoji">{r.emoji}</span>
            <span className="lab-header__chip-label">{r.name}</span>
          </button>
        ))}
      </div>
      <div className="lab-header__right">
        <span className="lab-header__metric">
          활성 크론 <b>{metrics.activeCrons}</b>
        </span>
        <span className="lab-header__metric">
          메모리 <b>{metrics.memoryUsed}</b>/{metrics.memoryCap}
        </span>
        <span className="lab-header__metric">
          Tistory 오늘 <b>{metrics.tistoryToday}</b>
        </span>
        <span className="lab-header__metric">
          오늘 세션 <b>{metrics.sessionCount}</b>
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