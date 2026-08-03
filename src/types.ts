// 에르메스 관제실 타입 정의

/**
 * 캐릭터 상태 (정적 mock — 1단계)
 * - idle: 일하는 중 (idle 애니메이션 적용)
 * - waiting: 대기
 * - inactive: 비활성
 * - error: 에러
 */
export type CharacterStatus = 'idle' | 'waiting' | 'inactive' | 'error';

/**
 * 상태별 색상 매핑 (Three.js 머티리얼용 hex)
 */
export const STATUS_COLOR: Record<CharacterStatus, string> = {
  idle: '#22c55e', // 🟢 일하는 중
  waiting: '#eab308', // 🟡 대기
  inactive: '#9ca3af', // ⚪ 비활성
  error: '#ef4444', // 🔴 에러
};

/**
 * 8개 방 정의 — 운용 중인 Hermes 자동화 시스템 매핑
 */
export interface Room {
  id: string;
  name: string;
  emoji: string;
  color: string; // hex 색상
  scripts: string[]; // 연결된 cron/skript ID 일부
  // 4×2 그리드 위 위치 (열/행)
  col: number;
  row: number;
}

/**
 * 8개 방 메타데이터
 * 행 0 = 뒤쪽(z < 0), 행 1 = 앞쪽(z > 0)
 * 열 0..3 = 왼쪽 → 오른쪽 (x < 0 → x > 0)
 */
export const ROOMS: Room[] = [
  {
    id: 'tistory',
    name: '티스토리 발행실',
    emoji: '📝',
    color: '#86efac', // mintgreen
    scripts: ['b1bca63a117a', '0b0e9f44e10a', 'b21d94a14860'],
    col: 0,
    row: 0,
  },
  {
    id: 'error-watch',
    name: '에러 감시실',
    emoji: '🔍',
    color: '#fca5a5', // red
    scripts: ['e0ba30d8a122', '81f1c81f8664'],
    col: 1,
    row: 0,
  },
  {
    id: 'knowledge-graph',
    name: '지식 그래프실',
    emoji: '🧠',
    color: '#c4b5fd', // purple
    scripts: ['d7bd4309bbf0', '388898171a79', 'e330c7de50d1'],
    col: 2,
    row: 0,
  },
  {
    id: 'self-improve',
    name: '자기 개선실',
    emoji: '🔄',
    color: '#fdba74', // orange
    scripts: ['5d0f14aef84c', 'ed5f37705e68'],
    col: 3,
    row: 0,
  },
  {
    id: 'trend-monitor',
    name: '트렌드 모니터실',
    emoji: '🔥',
    color: '#fde68a', // yellow
    scripts: ['b26b0579a45f', 'e330c7de50d1', '075bec58df7b'],
    col: 0,
    row: 1,
  },
  {
    id: 'notebooklm',
    name: '노트북LM실',
    emoji: '📓',
    color: '#f9a8d4', // pink
    scripts: ['dc9a2e6aaaaa'],
    col: 1,
    row: 1,
  },
  {
    id: 'blog-newsletter',
    name: '블로그/뉴스레터실',
    emoji: '🎬',
    color: '#67e8f9', // cyan
    scripts: ['b02a45f4d14e', '0f893ba14797', '582ecc59aaee'],
    col: 2,
    row: 1,
  },
  {
    id: 'infra-sync',
    name: '인프라/동기화실',
    emoji: '⚙️',
    color: '#d1d5db', // gray
    scripts: ['5a376ec002c3', '7c2b9a9be162', 'memory-error-tracker'],
    col: 3,
    row: 1,
  },
];

/**
 * 그리드 간격 (월드 단위)
 */
export const GRID_SPACING = 6;

/**
 * 각 방의 박스 크기
 */
export const ROOM_SIZE: [number, number, number] = [4, 2.5, 4];

/**
 * 캐릭터 캡슐 크기
 */
export const CHARACTER_HEIGHT = 1.2;
export const CHARACTER_RADIUS = 0.35;
