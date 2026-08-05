/** theme.ts — Office TV theme pack (characters, rooms, chatter, names, events) */

import { useSyncExternalStore } from 'react'
import { BASE_URL } from './baseUrl'

export type ThemeName = 'default' | 'office' | 'hermes'

// Why: 27 Office characters — shuffle-dealt to roles. Sprites live at
// /hermes-control-room/sprites/office/characters/{slug}-{front|rear}-{left|right}.png (prefixed with BASE_URL at runtime).
const OFFICE_CHARACTERS = [
  'andy-bernard', 'angela-martin', 'bob-vance', 'carol-stills',
  'creed-bratton', 'darryl-philbin', 'david-wallace', 'dwight-schrute',
  'erin-hannon', 'gabe-lewis', 'holly-flax', 'jan-levinson',
  'jim-halpert', 'karen-filippelli', 'kelly-kapoor', 'kevin-malone',
  'meredith-palmer', 'michael-scott', 'nellie-bertram', 'oscar-martinez',
  'pam-beesly', 'phyllis-vance', 'robert-california', 'roy-anderson',
  'ryan-howard', 'stanley-hudson', 'toby-flenderson',
] as const

const OFFICE_CATS = [
  'cat-bandit', 'cat-bandits-kittens', 'cat-comstock', 'cat-comstock-alt',
  'cat-ember', 'cat-garbage', 'cat-mr-ash', 'cat-mr-ash-alt',
  'cat-phillip', 'cat-princess-lady', 'cat-princess-lady-alt', 'cat-sprinkles',
]

// Fixed casting by role — same character used for Slack avatar AND room sprite
const FIXED_ROLE_CASTING: Record<string, string> = {
  boss: 'michael-scott',
  assistant: 'jim-halpert',
}

interface ThemeState {
  name: ThemeName
  // Role → Office character slug. Keyed by role so SlackChat (role) and
  // Character.tsx (agent.role) resolve to the same cast.
  castByRole: Record<string, string>
  angelaRole: string | null
  angelaCat: string | null
}

let state: ThemeState = loadInitial()
const listeners = new Set<() => void>()

function loadInitial(): ThemeState {
  try {
    const saved = localStorage.getItem('agent-office-theme')
    if (saved === 'office') {
      return { name: 'office', castByRole: {}, angelaRole: null, angelaCat: null }
    }
    if (saved === 'hermes') {
      return { name: 'hermes', castByRole: {}, angelaRole: null, angelaCat: null }
    }
  } catch {}
  return { name: 'hermes', castByRole: {}, angelaRole: null, angelaCat: null }
}

function persist() {
  try { localStorage.setItem('agent-office-theme', state.name) } catch {}
}

function emit() { listeners.forEach(l => l()) }

function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a as T[]
}
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

export function getTheme(): ThemeName { return state.name }

export function setTheme(name: ThemeName) {
  if (state.name === name) return
  state = { name, castByRole: {}, angelaRole: null, angelaCat: null }
  persist()
  emit()
}

export function toggleTheme() {
  setTheme(state.name === 'office' ? 'hermes' : 'office')
}

export function subscribeTheme(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useTheme(): ThemeName {
  return useSyncExternalStore(
    (cb) => subscribeTheme(cb),
    () => state.name,
    () => 'hermes',
  )
}

function dealt(): Set<string> { return new Set(Object.values(state.castByRole)) }

/** Assign (or return existing) Office character for a role. Same for SlackChat & Character. */
export function getCharacterBaseForRole(role: string, defaultBase: string): string {
  if (state.name !== 'office') return defaultBase
  if (state.castByRole[role]) return state.castByRole[role]

  // Fixed casting wins
  const fixed = FIXED_ROLE_CASTING[role]
  if (fixed) {
    state.castByRole[role] = fixed
    return fixed
  }

  // Pick from remaining — exclude already-dealt + reserved-fixed-not-yet-used
  const used = dealt()
  const reservedNotYetUsed = new Set(
    Object.values(FIXED_ROLE_CASTING).filter(c => !used.has(c))
  )
  const pool = OFFICE_CHARACTERS.filter(c => !used.has(c) && !reservedNotYetUsed.has(c))
  // Fallback when all 22 are dealt: reuse an existing non-fixed cast slug.
  // Why: prevents duplicating boss (Michael) or assistant (Jim) on screen when chat roles overflow.
  const fixedSet = new Set(Object.values(FIXED_ROLE_CASTING))
  const nonFixedUsed = [...used].filter(c => !fixedSet.has(c))
  const chosen = pool.length > 0
    ? pick(pool as string[])
    : (nonFixedUsed.length > 0 ? pick(nonFixedUsed) : OFFICE_CHARACTERS[2]) // Why: [2] is not Michael/Jim
  state.castByRole[role] = chosen

  if (chosen === 'angela-martin') {
    state.angelaRole = role
    state.angelaCat = pick(OFFICE_CATS)
  }
  return chosen
}

export function getSpriteDir(): string {
  return state.name === 'office' ? `${BASE_URL}sprites/office/characters` : `${BASE_URL}sprites/characters`
}

/** Kept signature-compatible for existing callers — agentId ignored; role is the key. */
export function getSpritePath(_agentId: string, role: string, defaultBase: string, direction: string): string {
  const base = getCharacterBaseForRole(role, defaultBase)
  return `${getSpriteDir()}/${base}-${direction}.png`
}

export function getRoomImage(phase: 'day' | 'night'): string {
  if (state.name === 'office') {
    return phase === 'night' ? `${BASE_URL}rooms/office-night-dm.png` : `${BASE_URL}rooms/office-day-dm.png`
  }
  return phase === 'night' ? `${BASE_URL}rooms/office-night-dm.png` : `${BASE_URL}rooms/office-day-dm.png`
}

/** Returns the ROLE currently cast as Angela (if any), plus cat sprite path. */
export function getAngelaCat(): { role: string; catSprite: string } | null {
  if (state.name !== 'office' || !state.angelaRole || !state.angelaCat) return null
  return { role: state.angelaRole, catSprite: `${BASE_URL}sprites/office/cats/${state.angelaCat}.png` }
}

/** Human-readable display name for a slug (e.g. "michael-scott" → "Michael Scott") */
function slugToName(slug: string): string {
  return slug.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join(' ')
}

/** Swap sender display name to the cast Office character when theme is active. */
const HERMES_DEPARTMENT_DISPLAY: Record<string, string> = {
  'boss': 'Hermes 관제실',
  'assistant': 'Tistory 발행',
  'debugger': '에러 모니터링',
  'code-reviewer': 'Knowledge Graph',
  'frontend-developer': '자기 개선',
  'fullstack-developer': '트렌드 모니터링',
  'test-engineer': 'Notebook LM',
  'security-auditor': '블로그/뉴스레터',
  'devops-engineer': '인프라 동기화',
  'database-architect': 'DB 아키텍트',
  'architect-reviewer': '아키텍트 리뷰',
  'performance-engineer': '성능 엔지니어',
  'typescript-pro': 'TS 프로',
  'ai-engineer': 'AI 엔지니어',
  'prompt-engineer': '프롬프트 엔지니어',
  'general-purpose': '범용 에이전트',
  'Explore': '코드베이스 탐색',
}

export function themedDisplayName(role: string, fallback: string): string {
  // Why: Hermes default 모드와 office 모드 모두에서 한글 부서 라벨 우선 적용
  if (HERMES_DEPARTMENT_DISPLAY[role]) return HERMES_DEPARTMENT_DISPLAY[role]
  if (state.name !== 'office') return fallback
  const cast = state.castByRole[role]
  if (!cast) {
    // Force-assign so the name matches the avatar on first render
    const base = getCharacterBaseForRole(role, '')
    return slugToName(base)
  }
  return slugToName(cast)
}


// ===== THEMED CHATTER POOLS =====

const OFFICE_SPAWN = [
  '신원 도용은 농담이 아니야, Jim!',
  'Scranton 지사로 출근',
  '종이, 종이, 종이',
  '곰. 사탕무우. �스타 갈락티카.',
  'D-U-N-D-E-R... 그 다음은?',
  '나는 항상 Beyoncé.',
  'Dunder Mifflin 스타일로 출근',
]
const OFFICE_WORK = [
  '종이 팔고 있음',
  '린 처리 중',
  '아니. 검은 곰.',
  'Schrute Buck 부여',
  '본사와 협상 중',
  'TPS 리포트 제출',
  'Finer Things Club 뉴스레터',
]
const OFFICE_DONE = [
  '그녀가 그랬죠',
  '팸. 로스트.',
  'PR 출하 — 24lb 본드처럼 �직함',
  "World's Best Boss 승인",
  '계약 성사',
  '머지 완료 — Jim 승인',
]
const OFFICE_COFFEE = [
  'Jim이 내려준 그란데 라떼',
  'Kevin의 유명한 칠리 브레이크',
  '프레첼 데이!',
  '잠�, 휴게실',
]
const OFFICE_WATER = [
  '수분 보충 — Angela는 물만 마심',
  'Stanley가 거의 5시라고 함',
  '물 채우고 프레첼로',
  '휴게실 들려',
]

const DEFAULT_SPAWN = [
  '🛎 출근했습니다', '✅ 업무 개시', '🚀 작업 준비 완료',
  '☕ 커피 한 잔 하고 시작', '📋 오늘 할 일 정리', '🔍 점검 시작', '📥 최신본 가져오기',
]
const DEFAULT_WORK = [
  '💻 작업 중', '⌨️ 타이핑 중', '🎯 집중 모드', '📈 진행 중',
  '📚 문서 확인', '🔎 원인 분석', '🧪 테스트 진행',
]
const DEFAULT_DONE = [
  '✅ 작업 완료!', '🚀 배포 완료', '📝 PR 오픈', '✔️ 마무리',
  '👍 LGTM', '🔀 main 머지 완료', '🌐 배포 끝',
]
const DEFAULT_COFFEE = ['☕ 커피 타임', '🥤 카페인 충전', '☕ 한 잔 마시고', '🥐 잠깐 휴식']
const DEFAULT_WATER = [
  '💧 수분 보충', '🚰 물 마시는 중', '💧 물 리필', '🧃 단잠 채우기',
  '💧 수분 체크', '🥛 가벼운 휴식',
]

export function themedSpawn(): string  { return pick(state.name === 'office' ? OFFICE_SPAWN  : DEFAULT_SPAWN) }
export function themedWork(): string   { return pick(state.name === 'office' ? OFFICE_WORK   : DEFAULT_WORK) }
export function themedDone(): string   { return pick(state.name === 'office' ? OFFICE_DONE   : DEFAULT_DONE) }
export function themedCoffee(): string { return pick(state.name === 'office' ? OFFICE_COFFEE : DEFAULT_COFFEE) }
export function themedWater(): string  { return pick(state.name === 'office' ? OFFICE_WATER  : DEFAULT_WATER) }

// ===== SIM / VIDEO MODE OFFICE SCRIPT =====
// Parallel tool-output messages keyed by role — used when ?sim or ?video loads with Office theme.
export const OFFICE_SIM_TOOL_MESSAGES: Record<string, string[]> = {
  'security-auditor': [
    '⚡ 시즌9 취약점 관련 미들웨어 감사 중',
    '⚠️ Dwight가 세션 토큰을 사탕무우 저장고에 보관',
    '🚨 JWT 리프레시 토큰 만료 "없음" — 클래식',
    'Toby가 눈치 채기 전에 모두 httpOnly로 이전',
  ],
  'code-reviewer': [
    '⚡ 실행: grep -r "그녀가 그랬죠" src/',
    '🔍 리뷰 중 — 이번 PR이 Dundies보다 더 드라마틱',
    '💡 httpOnly 쿠키 제안 — localStorage 말고, 이건 Schrute 농장이 아님',
    'LGTM, Stamford 지사로 출하',
  ],
  'frontend-developer': [
    '⚡ src/auth/tokenStore.ts 수정 중',
    '🎨 새 로그인 화면이 Phyllis의 결혼식보다 더 세련됨',
    '쿠키 마이그레이션 처리 가능, 큰 일 아님',
    '모바일 반응형 — Stanley도 승인',
  ],
  'assistant': [
    '프린터 또 걸렸음. 오늘 세 번째. Sabre의 저주.',
    '누가 Michael 좀 봐줘, 독백 중',
    "내가 처리할게 — 신원 도용은 농담이 아니야",
  ],
  'boss': [
    '로비에 피자! 오늘은 프레� 데이!',
    '레드불 마실 사람? 또는 Schrute Buck?',
    '그냥 배포, 프로덕션에서 고치자. PARKOUR!',
    '대시보드 어때?',
  ],
}

/** Sim replacement for Hermes's typed questions, when theme is Office */
export const OFFICE_SIM_BOSS_PROMPTS = [
  '/ultra-think Dwight가 사탕무우 농장 감사하듯 우리 인증 감사해줘',
  'localStorage 이슈 얼마나 심각해 — Kevin이 칠리 흘린 것보다 더?',
]

// ===== Rotation helpers for the Office ?sim rotation =====

export function getAllOfficeCharacters(): readonly string[] { return OFFICE_CHARACTERS }

/** Force a specific role → character mapping (used by sim rotation). */
export function assignCharacterToRole(role: string, slug: string) {
  state.castByRole[role] = slug
  if (slug === 'angela-martin') {
    state.angelaRole = role
    state.angelaCat = pick(OFFICE_CATS)
  }
  emit()
}

/** Release a role's cast slot so another role can use that character later. */
export function releaseRole(role: string) {
  const slug = state.castByRole[role]
  if (!slug) return
  delete state.castByRole[role]
  if (state.angelaRole === role) {
    state.angelaRole = null
    state.angelaCat = null
  }
  emit()
}

/** Return the set of character slugs currently on-screen (dealt to some role). */
export function getActiveCastSlugs(): Set<string> {
  return new Set(Object.values(state.castByRole))
}

/**
 * Pick the next unused Office character — cycles fairly through all 22 over time.
 * @param ignoreSet  extra slugs to avoid (e.g. just-used)
 */
export function nextUnusedOfficeCharacter(ignoreSet: Set<string> = new Set()): string {
  const used = getActiveCastSlugs()
  const avail = OFFICE_CHARACTERS.filter(c => !used.has(c) && !ignoreSet.has(c))
  if (avail.length > 0) return pick(avail as string[])
  // All 22 on-screen: pick any not in the ignore set
  const fallback = OFFICE_CHARACTERS.filter(c => !ignoreSet.has(c))
  return fallback.length > 0 ? pick(fallback as string[]) : OFFICE_CHARACTERS[0]
}

/** Display name for a slug — used when renaming sim staff on spawn. */
export function displayNameFromSlug(slug: string): string {
  return slug.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join(' ')
}

// Character-specific prop overlays — replace the energy-drink bubble above cast members.
// Why: visual easter eggs tying props to iconic bits. Each slug maps to a pool
// of signature props — when there's more than one, a deterministic hash picks
// per-role so the same agent keeps the same prop within a session.
const OFFICE_PROPS_BY_SLUG: Record<string, string[]> = {
  'michael-scott':   [
    `${BASE_URL}sprites/office/props/worlds-best-boss-mug.png`,
    `${BASE_URL}sprites/office/props/dundie-award.png`,
    `${BASE_URL}sprites/office/props/golden-ticket-box.png`,
    `${BASE_URL}sprites/office/props/prison-mike.png`,
    `${BASE_URL}sprites/office/props/no-god-please-no.png`,
  ],
  'dwight-schrute':  [
    `${BASE_URL}sprites/office/props/cpr-dummy-mask.png`,
    `${BASE_URL}sprites/office/props/schrute-buck.png`,
  ],
  'jim-halpert':     [`${BASE_URL}sprites/office/props/jello-stapler.png`],
  'stanley-hudson':  [`${BASE_URL}sprites/office/props/pretzel-day.png`],
  'jan-levinson':    [`${BASE_URL}sprites/office/props/serenity-by-jan-candle.png`],
  // Why: Finer Things Club members share the prop — Oscar, Pam, and Toby.
  'oscar-martinez':  [`${BASE_URL}sprites/office/props/finer-things-club.png`],
  'pam-beesly':      [`${BASE_URL}sprites/office/props/finer-things-club.png`],
  'toby-flenderson': [`${BASE_URL}sprites/office/props/finer-things-club.png`],
  // Angela: randomized second cat assigned per-role below — not a prop file.
}

// Why: generic fallback for remaining cast so every Office character has a prop.
const OFFICE_GENERIC_PROPS = [
  `${BASE_URL}sprites/office/props/dunder-mifflin-logo.png`,
  `${BASE_URL}sprites/office/props/dunder-mifflin-paper-box.png`,
  `${BASE_URL}sprites/office/props/schrute-buck.png`,
  `${BASE_URL}sprites/office/props/golden-ticket-box.png`,
]

const OFFICE_CATS_PATHS = OFFICE_CATS.map(c => `${BASE_URL}sprites/office/cats/${c}.png`)

// Stable per-role generic prop / head-cat assignment — deterministic hash so it doesn't flicker.
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Prop sprite override for a given role's cast, or null to fall back to energy drink. */
export function getOfficePropForRole(role: string): string | null {
  if (state.name !== 'office') return null
  const slug = state.castByRole[role]
  if (!slug) return null

  // Angela: show a different cat above her head (head-cat, separate from her follower cat)
  if (slug === 'angela-martin') {
    const idx = hashString(role + 'head') % OFFICE_CATS_PATHS.length
    return OFFICE_CATS_PATHS[idx]
  }

  const specificPool = OFFICE_PROPS_BY_SLUG[slug]
  if (specificPool && specificPool.length > 0) {
    // Why: hash by role + slug so each cast member keeps a stable prop pick
    return specificPool[hashString(role + slug) % specificPool.length]
  }

  // Generic fallback: dunder logo / Schrute buck / golden ticket, deterministic per slug
  return OFFICE_GENERIC_PROPS[hashString(slug) % OFFICE_GENERIC_PROPS.length]
}
