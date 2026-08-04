// ===== ASSET MANIFEST =====
// Maps logical asset names to actual file paths
// Sizes are display sizes (px) at 800x600 room resolution
// Source images are ~6x larger (4800x3584 room)

export interface SpriteAsset {
  path: string
  width: number     // display width in px
  height: number    // display height in px
  category: 'character' | 'furniture' | 'appliance' | 'decoration' | 'effect' | 'culture' | 'room'
}

// All available sprite assets — sizes derived from actual image dimensions / scale
export const ASSETS: Record<string, SpriteAsset> = {
  // === CHARACTERS (307x862 source → ~51x144 display... too tall, scale to fit ~65px height) ===
  'char-debugger':       { path: '/hermes-control-room/sprites/debugger.png', width: 24, height: 65, category: 'character' },
  'char-reviewer':       { path: '/hermes-control-room/sprites/reviewer.png', width: 24, height: 65, category: 'character' },
  'char-frontend':       { path: '/hermes-control-room/sprites/frontend.png', width: 24, height: 65, category: 'character' },
  'char-fullstack':      { path: '/hermes-control-room/sprites/fullstack.png', width: 24, height: 65, category: 'character' },
  'char-tester':         { path: '/hermes-control-room/sprites/tester.png', width: 24, height: 65, category: 'character' },
  'char-security':       { path: '/hermes-control-room/sprites/security.png', width: 24, height: 65, category: 'character' },
  'char-devops':         { path: '/hermes-control-room/sprites/devops.png', width: 24, height: 65, category: 'character' },
  'char-manager':        { path: '/hermes-control-room/sprites/manager.png', width: 24, height: 65, category: 'character' },

  // === FURNITURE ===
  'desk-standing-left-front':  { path: '/hermes-control-room/sprites/furniture/standing-desk-left-front.png', width: 84, height: 106, category: 'furniture' },
  'desk-standing-left-rear':   { path: '/hermes-control-room/sprites/furniture/standing-desk-left-rear.png', width: 84, height: 102, category: 'furniture' },
  'desk-standing-right-front': { path: '/hermes-control-room/sprites/furniture/standing-desk-right-front.png', width: 84, height: 106, category: 'furniture' },
  'desk-standing-right-rear':  { path: '/hermes-control-room/sprites/furniture/standing-desk-right-rear.png', width: 84, height: 102, category: 'furniture' },
  'filing-closed':             { path: '/hermes-control-room/sprites/furniture/filling-closed.png', width: 42, height: 56, category: 'furniture' },
  'filing-open':               { path: '/hermes-control-room/sprites/furniture/filling-open.png', width: 46, height: 60, category: 'furniture' },

  // === APPLIANCES ===
  'coffee-off':    { path: '/hermes-control-room/sprites/appliances/coffee-off.png', width: 40, height: 51, category: 'appliance' },
  'coffee-on':     { path: '/hermes-control-room/sprites/appliances/coffee-on.png', width: 40, height: 51, category: 'appliance' },

  // === DECORATION ===
  'plant-monstera':  { path: '/hermes-control-room/sprites/decoration/monstera-plant.png', width: 50, height: 71, category: 'decoration' },
  'plant-snake':     { path: '/hermes-control-room/sprites/decoration/snake-plant.png', width: 40, height: 63, category: 'decoration' },
  'plant-money':     { path: '/hermes-control-room/sprites/decoration/money-tree.png', width: 42, height: 63, category: 'decoration' },
  'whiteboard':      { path: '/hermes-control-room/sprites/decoration/white-board.png', width: 65, height: 86, category: 'decoration' },
  'ac-unit':         { path: '/hermes-control-room/sprites/decoration/ac-wall-unit.png', width: 50, height: 39, category: 'decoration' },
  'printer':         { path: '/hermes-control-room/sprites/decoration/printer.png', width: 55, height: 69, category: 'decoration' },
  'printer-working': { path: '/hermes-control-room/sprites/decoration/printer-working.png', width: 55, height: 69, category: 'decoration' },
  'printer-broken':  { path: '/hermes-control-room/sprites/decoration/printer-broken.png', width: 55, height: 69, category: 'decoration' },

  // === CULTURE ===
  'bell':              { path: '/hermes-control-room/sprites/culture/bell.png', width: 18, height: 36, category: 'culture' },
  'days-last-incident': { path: '/hermes-control-room/sprites/culture/days-last-incident.png', width: 80, height: 66, category: 'culture' },
  'deploying-screen':  { path: '/hermes-control-room/sprites/culture/deploying-screen.png', width: 60, height: 70, category: 'culture' },
  'todo-board':        { path: '/hermes-control-room/sprites/culture/todo-board.png', width: 55, height: 62, category: 'culture' },

  // === EFFECTS ===
  'fx-build-failed':   { path: '/hermes-control-room/sprites/effects/build-failed.png', width: 24, height: 24, category: 'effect' },
  'fx-fire':           { path: '/hermes-control-room/sprites/effects/fire.png', width: 24, height: 24, category: 'effect' },
  'fx-pr-merge':       { path: '/hermes-control-room/sprites/effects/github-pr-merge.png', width: 24, height: 24, category: 'effect' },
  'fx-need-coffee':    { path: '/hermes-control-room/sprites/effects/need-coffee.png', width: 24, height: 24, category: 'effect' },
  'fx-rocket':         { path: '/hermes-control-room/sprites/effects/rocket.png', width: 24, height: 24, category: 'effect' },
  'fx-sleeping':       { path: '/hermes-control-room/sprites/effects/sleeping.png', width: 24, height: 24, category: 'effect' },
  'fx-star':           { path: '/hermes-control-room/sprites/effects/star.png', width: 24, height: 24, category: 'effect' },
  'fx-thumb-up':       { path: '/hermes-control-room/sprites/effects/thumb-up.png', width: 24, height: 24, category: 'effect' },
  'fx-typing':         { path: '/hermes-control-room/sprites/effects/typing.png', width: 24, height: 24, category: 'effect' },

  // === ROOMS ===
  'room-office-day':   { path: '/hermes-control-room/rooms/office-day-dm.png', width: 800, height: 600, category: 'room' },
  'room-office-night': { path: '/hermes-control-room/rooms/office-night-dm.png', width: 800, height: 600, category: 'room' },
}

// Helper: get asset by key, returns path or fallback
export function getAssetPath(key: string): string | null {
  return ASSETS[key]?.path ?? null
}

// Helper: get all assets by category
export function getAssetsByCategory(category: SpriteAsset['category']): Record<string, SpriteAsset> {
  return Object.fromEntries(
    Object.entries(ASSETS).filter(([, a]) => a.category === category)
  )
}

// Helper: check if an asset exists in the manifest
export function hasAsset(key: string): boolean {
  return key in ASSETS
}
