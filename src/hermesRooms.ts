// src/hermesRooms.ts — Hermes 자동화 시스템 8개 부서 정의
// ICBM2 cron job들의 skill 카테고리 ↔ 부서 매핑
// 각 부서는 부서명, emoji, 설명, 관련 cron skill prefix, rooms.ts 배경 매핑을 가짐

export type HermesRoomId =
  | 'tistory'      // 📝 Tistory 발행
  | 'briefing'     // 🌅 모닝 브리핑
  | 'automation'   // ⚙️ 자동화 (cron self-heal, error monitor)
  | 'research'     // 🔍 리서치 (github-trending, agentnews)
  | 'notion'       // 📓 Notion 동기화
  | 'trading'      // 📈 트레이딩/주식
  | 'media'        // 🎬 미디어 (youtube, music-video)
  | 'devops'       // 🔧 DevOps (lint, kanban, project)

export type HermesRoomStatus = 'active' | 'idle' | 'waiting' | 'inactive' | 'error'

export interface HermesRoom {
  id: HermesRoomId
  name: string
  shortLabel?: string
  emoji: string
  description: string
  /** 부서 배경 (rooms.ts room id 매핑) */
  sourceRoom: string
  /** 매칭되는 cron skill prefix 목록 (jobs.json의 skill 필드와 매칭) */
  skillPrefixes: string[]
  /** 부서 운용 상태 (mock — 실제 cron 동기화는 후속) */
  status: HermesRoomStatus
  /** 마지막 실행 시각 (ISO 8601) */
  lastRun: string
  /** 다음 실행 시각 (ISO 8601) */
  nextRun: string
}

export const HERMES_ROOMS: HermesRoom[] = [
  {
    id: 'tistory',
    name: 'Tistory 발행',
    emoji: '📝',
    shortLabel: '발행',
    description: '블로그 자동 발행 — SEO + 트렌드 + 중복 방지',
    sourceRoom: 'main-office',
    skillPrefixes: ['tistory-publisher', 'periodic-data-pipeline'],
    status: 'active',
    lastRun: '2026-08-04T17:25:00.000Z',
    nextRun: '2026-08-04T17:30:00.000Z',
  },
  {
    id: 'briefing',
    name: '모닝 브리핑',
    emoji: '🌅',
    shortLabel: '브리핑',
    description: '매일 아침 통합 인사이트 — 주식/뉴스/일정',
    sourceRoom: 'lobby',
    skillPrefixes: ['morning-briefing', 'invest-memo', 'agentnews-monitor'],
    status: 'idle',
    lastRun: '2026-08-04T08:30:00.000Z',
    nextRun: '2026-08-05T08:30:00.000Z',
  },
  {
    id: 'automation',
    name: '자동화 정비',
    emoji: '⚙️',
    shortLabel: '자동화',
    description: 'Cron self-heal + 에러 모니터 + 야간 정비',
    sourceRoom: 'server-room',
    skillPrefixes: [
      'automation-healthcheck',
      'cron-error-pattern-tuning',
      'cron-stale-triage',
      'nightly-maintenance-workflow',
      'memory-error-tracker',
      'icbm2-daily-workspace-cleanup',
    ],
    status: 'active',
    lastRun: '2026-08-04T17:00:00.000Z',
    nextRun: '2026-08-04T17:03:00.000Z',
  },
  {
    id: 'research',
    name: '리서치/트렌드',
    emoji: '🔍',
    shortLabel: '리서치',
    description: 'GitHub trending + iOS 뉴스 + 기술 트렌드',
    sourceRoom: 'meeting-room',
    skillPrefixes: [
      'github-trending-monitor',
      'ios-trend-digest',
      'gazette-trend-analyzer',
      'tech-doc-translator',
      'auto-researcher',
    ],
    status: 'active',
    lastRun: '2026-08-04T16:32:00.000Z',
    nextRun: '2026-08-04T16:36:00.000Z',
  },
  {
    id: 'notion',
    name: 'Notion 동기화',
    emoji: '📓',
    shortLabel: '노션',
    description: 'Notion DB + 지식 그래프 + 위키',
    sourceRoom: 'manager-office',
    skillPrefixes: [
      'notion-dashboard',
      'notion',
      'knowledge-graph',
      'llm-wiki',
      'dev-news-to-wiki',
      'notion-wiki-extraction-recipes',
      'notion-dev-news-sync',
    ],
    status: 'waiting',
    lastRun: '2026-08-04T17:15:00.000Z',
    nextRun: '2026-08-04T17:25:00.000Z',
  },
  {
    id: 'trading',
    name: '투자/트레이딩',
    emoji: '📈',
    shortLabel: '투자',
    description: '주식 시장 + 포트폴리오 리밸런싱',
    sourceRoom: 'ceo-office',
    skillPrefixes: [
      'stock-market-tracker',
      'stock-market-pro',
      'portfolio-rebalancer',
      'trading-strategy',
    ],
    status: 'inactive',
    lastRun: '2026-08-03T18:00:00.000Z',
    nextRun: '2026-08-04T19:00:00.000Z',
  },
  {
    id: 'media',
    name: '미디어/영상',
    emoji: '🎬',
    shortLabel: '미디어',
    description: 'YouTube + 음성/영상 + 뮤직비디오',
    sourceRoom: 'rooftop',
    skillPrefixes: [
      'notebooklm-youtube-automation',
      'music-video-generator',
      'ai-music',
      'gallery-sync',
    ],
    status: 'idle',
    lastRun: '2026-08-04T15:00:00.000Z',
    nextRun: '2026-08-04T15:30:00.000Z',
  },
  {
    id: 'devops',
    name: 'DevOps',
    emoji: '🔧',
    shortLabel: 'DevOps',
    description: 'Hermes Kanban + 코드 품질 + 위임 시스템',
    sourceRoom: 'gym',
    skillPrefixes: [
      'kanban-project-delivery',
      'requesting-code-review',
      'simplify-code',
      'flywheel',
      'ad-hoc-verification',
    ],
    status: 'active',
    lastRun: '2026-08-04T16:00:00.000Z',
    nextRun: '2026-08-04T17:05:00.000Z',
  },
]

// 부서 id → HermesRoom 매핑
export const HERMES_ROOM_BY_ID: Record<HermesRoomId, HermesRoom> = HERMES_ROOMS.reduce(
  (acc, r) => ({ ...acc, [r.id]: r }),
  {} as Record<HermesRoomId, HermesRoom>,
)

/**
 * cron job의 skill 필드로 부서 id 결정
 * - job.skill이 부서 prefix 중 하나에 매칭되면 그 부서로
 * - 매칭 안 되면 'automation' (default fallback)
 */
export function resolveRoomBySkill(skill: string | null | undefined): HermesRoomId {
  if (!skill) return 'automation'
  const s = skill.toLowerCase()
  for (const room of HERMES_ROOMS) {
    if (room.skillPrefixes.some(prefix => s.includes(prefix) || prefix.includes(s))) {
      return room.id
    }
  }
  return 'automation'
}

/** ISO timestamp → 한국어 "HH:MM" / "방금 전" / "N분 전" 형식 */
export function formatTimeAgo(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const t = new Date(iso).getTime()
    const diff = Date.now() - t
    if (diff < 60_000) return '방금 전'
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}분 전`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}시간 전`
    const date = new Date(iso)
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  } catch {
    return '—'
  }
}

/** 다음 실행까지 남은 시간 */
export function formatTimeUntil(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const t = new Date(iso).getTime()
    const diff = t - Date.now()
    if (diff < 0) return '곧 실행'
    if (diff < 60_000) return '곧 실행'
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}분 후`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}시간 후`
    return `${Math.floor(diff / 86_400_000)}일 후`
  } catch {
    return '—'
  }
}
