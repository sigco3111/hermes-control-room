// src/__tests__/hermesRooms.test.ts — Hermes 8-department contract
import { test, expect, describe } from 'bun:test'
import {
  HERMES_ROOMS,
  HERMES_ROOM_BY_ID,
  type HermesRoomId,
  type HermesRoomStatus,
  resolveRoomBySkill,
  formatTimeAgo,
  formatTimeUntil,
} from '../hermesRooms'

// ─────────────────────────────────────────────────────────────────────────────
// 1. Boilerplate completeness
// ─────────────────────────────────────────────────────────────────────────────

describe('HERMES_ROOMS', () => {
  test('contains exactly 8 departments', () => {
    expect(HERMES_ROOMS.length).toBe(8)
  })

  test('every entry has required fields with non-empty values', () => {
    for (const room of HERMES_ROOMS) {
      expect(typeof room.id).toBe('string')
      expect(room.id.length).toBeGreaterThan(0)
      expect(typeof room.name).toBe('string')
      expect(room.name.length).toBeGreaterThan(0)
      expect(typeof room.emoji).toBe('string')
      expect(room.emoji.length).toBeGreaterThan(0)
      expect(typeof room.description).toBe('string')
      expect(room.description.length).toBeGreaterThan(0)
      expect(typeof room.sourceRoom).toBe('string')
      expect(room.sourceRoom.length).toBeGreaterThan(0)
      expect(Array.isArray(room.skillPrefixes)).toBe(true)
      expect(room.skillPrefixes.length).toBeGreaterThan(0)
      expect(typeof room.status).toBe('string')
      expect(typeof room.lastRun).toBe('string')
      expect(typeof room.nextRun).toBe('string')
    }
  })

  test('all ids are unique', () => {
    const ids = HERMES_ROOMS.map(r => r.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test('all 8 expected department ids are present', () => {
    const expected: HermesRoomId[] = [
      'tistory',
      'briefing',
      'automation',
      'research',
      'notion',
      'trading',
      'media',
      'devops',
    ]
    for (const id of expected) {
      expect(HERMES_ROOMS.find(r => r.id === id)).toBeDefined()
    }
  })

  test('every status is one of the allowed enum values', () => {
    const allowed: HermesRoomStatus[] = ['active', 'idle', 'waiting', 'inactive', 'error']
    for (const room of HERMES_ROOMS) {
      expect(allowed).toContain(room.status)
    }
  })

  test('every lastRun value is a valid ISO-8601 timestamp', () => {
    for (const room of HERMES_ROOMS) {
      const t = Date.parse(room.lastRun)
      expect(Number.isFinite(t)).toBe(true)
    }
  })

  test('every nextRun value is a valid ISO-8601 timestamp', () => {
    for (const room of HERMES_ROOMS) {
      const t = Date.parse(room.nextRun)
      expect(Number.isFinite(t)).toBe(true)
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. Lookup table contract
// ─────────────────────────────────────────────────────────────────────────────

describe('HERMES_ROOM_BY_ID', () => {
  test('contains every room in HERMES_ROOMS', () => {
    for (const room of HERMES_ROOMS) {
      const looked = HERMES_ROOM_BY_ID[room.id]
      expect(looked).toBeDefined()
      expect(looked.id).toBe(room.id)
      expect(looked.name).toBe(room.name)
    }
  })

  test('keys are exhaustive over the HermesRoomId union', () => {
    const expectedKeys: HermesRoomId[] = [
      'tistory',
      'briefing',
      'automation',
      'research',
      'notion',
      'trading',
      'media',
      'devops',
    ]
    for (const k of expectedKeys) {
      expect(HERMES_ROOM_BY_ID[k]).toBeDefined()
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. Skill resolver
// ─────────────────────────────────────────────────────────────────────────────

describe('resolveRoomBySkill', () => {
  test('returns automation on null', () => {
    expect(resolveRoomBySkill(null)).toBe('automation')
  })
  test('returns automation on undefined', () => {
    expect(resolveRoomBySkill(undefined)).toBe('automation')
  })
  test('returns automation on empty string', () => {
    expect(resolveRoomBySkill('')).toBe('automation')
  })
  test('returns tistory for tistory-publisher skill', () => {
    expect(resolveRoomBySkill('tistory-publisher-daily')).toBe('tistory')
  })
  test('returns notion for knowledge-graph skill', () => {
    expect(resolveRoomBySkill('knowledge-graph-sync')).toBe('notion')
  })
  test('returns trading for stock-market-tracker skill', () => {
    expect(resolveRoomBySkill('stock-market-tracker-daily')).toBe('trading')
  })
  test('returns media for music-video-generator skill', () => {
    expect(resolveRoomBySkill('music-video-generator-nightly')).toBe('media')
  })
  test('returns devops for kanban-project-delivery skill', () => {
    expect(resolveRoomBySkill('kanban-project-delivery')).toBe('devops')
  })
  test('returns research for github-trending-monitor skill', () => {
    expect(resolveRoomBySkill('github-trending-monitor')).toBe('research')
  })
  test('returns briefing for morning-briefing skill', () => {
    expect(resolveRoomBySkill('morning-briefing-daily')).toBe('briefing')
  })
  test('returns automation for unknown skill', () => {
    expect(resolveRoomBySkill('totally-unknown-skill')).toBe('automation')
  })
  test('is case-insensitive', () => {
    expect(resolveRoomBySkill('TISTORY-PUBLISHER')).toBe('tistory')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. Time formatters
// ─────────────────────────────────────────────────────────────────────────────

describe('formatTimeAgo', () => {
  test('returns em-dash for null/undefined/empty', () => {
    expect(formatTimeAgo(null)).toBe('—')
    expect(formatTimeAgo(undefined)).toBe('—')
    expect(formatTimeAgo('')).toBe('—')
  })
  test('returns "방금 전" for very recent timestamp', () => {
    const iso = new Date(Date.now() - 10_000).toISOString()
    expect(formatTimeAgo(iso)).toBe('방금 전')
  })
  test('returns "N분 전" for minutes', () => {
    const iso = new Date(Date.now() - 5 * 60_000).toISOString()
    expect(formatTimeAgo(iso)).toBe('5분 전')
  })
  test('returns "N시간 전" for hours', () => {
    const iso = new Date(Date.now() - 3 * 3_600_000).toISOString()
    expect(formatTimeAgo(iso)).toBe('3시간 전')
  })
  test('returns "HH:MM" for older than 24h', () => {
    const d = new Date(Date.now() - 36 * 3_600_000)
    const iso = d.toISOString()
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    expect(formatTimeAgo(iso)).toBe(`${hh}:${mm}`)
  })
})

describe('formatTimeUntil', () => {
  test('returns em-dash for null/undefined/empty', () => {
    expect(formatTimeUntil(null)).toBe('—')
    expect(formatTimeUntil(undefined)).toBe('—')
    expect(formatTimeUntil('')).toBe('—')
  })
  test('returns "곧 실행" for past timestamps', () => {
    const iso = new Date(Date.now() - 60_000).toISOString()
    expect(formatTimeUntil(iso)).toBe('곧 실행')
  })
  test('returns "곧 실행" for under 1 minute', () => {
    const iso = new Date(Date.now() + 30_000).toISOString()
    expect(formatTimeUntil(iso)).toBe('곧 실행')
  })
  test('returns "N분 후" for minutes', () => {
    const iso = new Date(Date.now() + 5 * 60_000).toISOString()
    expect(formatTimeUntil(iso)).toBe('5분 후')
  })
  test('returns "N시간 후" for hours', () => {
    const iso = new Date(Date.now() + 3 * 3_600_000).toISOString()
    expect(formatTimeUntil(iso)).toBe('3시간 후')
  })
  test('returns "N일 후" for days', () => {
    const iso = new Date(Date.now() + 2 * 86_400_000).toISOString()
    expect(formatTimeUntil(iso)).toBe('2일 후')
  })
})
