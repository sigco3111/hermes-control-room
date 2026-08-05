import { useEffect, useRef } from 'react'
import type { OfficeEvent } from '../types'

const POLL_INTERVAL_MS = 5000
const BACKOFF_INITIAL = POLL_INTERVAL_MS
const BACKOFF_MAX = 60_000
const BACKOFF_FACTOR = 2

export interface LivePollingOptions {
  url: string
  onEvent: (event: OfficeEvent) => void
  enabled: boolean
}

export function useLivePolling({ url, onEvent, enabled }: LivePollingOptions) {
  const lastLenRef = useRef(0)
  const onEventRef = useRef(onEvent)
  useEffect(() => { onEventRef.current = onEvent }, [onEvent])

  useEffect(() => {
    if (!enabled || !url) return
    let cancelled = false
    let retryDelay = BACKOFF_INITIAL

    const tick = async () => {
      if (cancelled) return
      try {
        const bustUrl = url.includes('?') ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`
        const r = await fetch(bustUrl, { cache: 'no-store' })
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const text = await r.text()
        const fresh = text.slice(lastLenRef.current)
        lastLenRef.current = text.length
        for (const raw of fresh.split('\n')) {
          const line = raw.trim()
          if (!line) continue
          if (line.startsWith('{"_":')) continue
          try {
            const parsed = JSON.parse(line) as OfficeEvent
            onEventRef.current(parsed)
          } catch {
            void 0
          }
        }
        retryDelay = BACKOFF_INITIAL
      } catch {
        retryDelay = Math.min(retryDelay * BACKOFF_FACTOR, BACKOFF_MAX)
      }
      if (!cancelled) {
        setTimeout(tick, retryDelay)
      }
    }

    tick()
    return () => { cancelled = true }
  }, [url, enabled])
}
