// HUD 오버레이 — 상단 헤더 / 우측 사이드 패널 / 하단 티커 / 좌하단 범례
import { useEffect } from 'react';
import { useControlRoom } from '../store';
import { ROOMS } from '../types';

export function HUD() {
  const {
    activeCrons,
    memoryUsed,
    memoryCap,
    tistoryToday,
    sessionCount,
    currentTime,
    selectedRoom,
    setSelectedRoom,
    tickClock,
  } = useControlRoom();

  // 1분마다 시계 갱신
  useEffect(() => {
    const id = setInterval(tickClock, 60_000);
    return () => clearInterval(id);
  }, [tickClock]);

  return (
    <>
      {/* 상단 헤더 */}
      <header className="hud-header glass">
        <div className="hud-header__left">
          <span className="hud-header__title">🏛️ 헤르메스 관제실</span>
          <span className="hud-header__clock">{currentTime}</span>
        </div>
        <div className="hud-header__right">
          <span className="hud-chip">활성 크론 <b>{activeCrons}</b></span>
          <span className="hud-chip">메모리 <b>{memoryUsed}</b>/{memoryCap}</span>
          <span className="hud-chip">Tistory 오늘 <b>{tistoryToday}</b></span>
          <span className="hud-chip">오늘 세션 <b>{sessionCount}</b></span>
        </div>
      </header>

      {/* 우측 사이드 패널 */}
      <aside className="hud-sidebar glass">
        {selectedRoom ? (
          <>
            <div className="hud-sidebar__head">
              <span style={{ fontSize: 24 }}>{selectedRoom.emoji}</span>
              <h2>{selectedRoom.name}</h2>
              <button
                className="hud-sidebar__close"
                onClick={() => setSelectedRoom(null)}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div className="hud-sidebar__body">
              <p className="hud-sidebar__hint">
                1단계 placeholder — 2단계에서 실제 cron 상태 + 최근 로그 표시 예정.
              </p>
              <h3>연결된 스크립트 ({selectedRoom.scripts.length})</h3>
              <ul className="hud-sidebar__list">
                {selectedRoom.scripts.map((s) => (
                  <li key={s}><code>{s}</code></li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="hud-sidebar__placeholder">
            <span style={{ fontSize: 32 }}>🏢</span>
            <h2>방 선택</h2>
            <p>3D 룸을 클릭하면<br/>여기에 상세 정보가 표시됩니다.</p>
            <div className="hud-sidebar__rooms">
              {ROOMS.map((r) => (
                <button
                  key={r.id}
                  className="hud-sidebar__room-chip"
                  onClick={() => setSelectedRoom(r)}
                  title={r.name}
                >
                  {r.emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* 하단 티커 */}
      <footer className="hud-ticker glass">
        <span>🚧 1단계 빌드 진행 중... 정적 mock 상태 — 2단계에서 실제 cron 이벤트 스트림 연결</span>
      </footer>

      {/* 좌하단 범례 */}
      <div className="hud-legend glass">
        <div className="hud-legend__title">상태</div>
        <div className="hud-legend__row"><span className="dot dot--idle" /> 일하는 중</div>
        <div className="hud-legend__row"><span className="dot dot--waiting" /> 대기</div>
        <div className="hud-legend__row"><span className="dot dot--inactive" /> 비활성</div>
        <div className="hud-legend__row"><span className="dot dot--error" /> 에러</div>
      </div>
    </>
  );
}
