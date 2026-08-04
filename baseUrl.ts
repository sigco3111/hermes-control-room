// baseUrl.ts — Vite base 경로 prefix 헬퍼.
// Why: vite.config.ts의 base: '/hermes-control-room/'가 모든 정적 asset 참조에도 적용되어야 함.
//      누락되면 라이브 (https://sigco3111.github.io/hermes-control-room/)에서 404 발생.

/** Vite base URL — 슬래시 trailing 보장. 빌드 시점에 결정됨. */
export const BASE_URL: string = import.meta.env.BASE_URL

/** BASE_URL prefix로 절대경로 생성. 입력이 '/foo/bar' → '/hermes-control-room/foo/bar'. */
export function withBase(path: string): string {
  if (!path) return BASE_URL
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path
  if (path.startsWith(BASE_URL)) return path
  const sep = path.startsWith('/') ? '' : '/'
  return `${BASE_URL}${sep}${path}`
}
