// Zustand 스토어 — 헤더/사이드패널 공유 상태
import { create } from 'zustand';
import type { Room, CharacterStatus } from './types';
import { ROOMS } from './types';

interface ControlRoomState {
  // 1단계 mock: 활성 크론 19 / 메모리 2189/2200 / Tistory 오늘 0
  activeCrons: number;
  memoryUsed: number;
  memoryCap: number;
  tistoryToday: number;
  sessionCount: number;

  // 현재 선택된 방 (사이드 패널 표시용)
  selectedRoom: Room | null;

  // 현재 시간 (헤더 시계)
  currentTime: string;

  // 액션
  setSelectedRoom: (room: Room | null) => void;
  tickClock: () => void;
}

/**
 * 8개 방 × 2명 캐릭터의 mock 상태 시드 (1단계 고정)
 * - 1번째 캐릭터: idle (일하는 중)
 * - 2번째 캐릭터: waiting (대기)
 * 2단계에서 cron 데이터로 교체 예정
 */
export const CHARACTER_STATUS: Record<string, CharacterStatus[]> = {
  tistory: ['idle', 'waiting'],
  'error-watch': ['idle', 'idle'],
  'knowledge-graph': ['waiting', 'inactive'],
  'self-improve': ['idle', 'waiting'],
  'trend-monitor': ['idle', 'idle'],
  notebooklm: ['inactive', 'waiting'],
  'blog-newsletter': ['idle', 'inactive'],
  'infra-sync': ['idle', 'idle'],
};

export const useControlRoom = create<ControlRoomState>((set) => ({
  activeCrons: 19,
  memoryUsed: 2189,
  memoryCap: 2200,
  tistoryToday: 0,
  sessionCount: 1,

  selectedRoom: null,

  currentTime: formatHHMM(new Date()),

  setSelectedRoom: (room) => set({ selectedRoom: room }),
  tickClock: () => set({ currentTime: formatHHMM(new Date()) }),
}));

function formatHHMM(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// ROOMS는 store에서도 import 가능하도록 재내보내기 (편의용)
export { ROOMS };
