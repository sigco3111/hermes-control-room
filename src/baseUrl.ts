// src/baseUrl.ts — Hermes Control Room base URL 헬퍼
// gh-pages 서브경로 (/hermes-control-room/) 대응
export const BASE_URL: string = import.meta.env.BASE_URL

export function withBase(path: string): string {
  if (!path) return BASE_URL
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path
  if (path.startsWith(BASE_URL)) return path
  const sep = path.startsWith('/') ? '' : '/'
  return `${BASE_URL}${sep}${path}`
}
