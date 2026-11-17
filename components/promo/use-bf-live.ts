"use client"

import { useSyncExternalStore } from "react"
import { bfPhase } from "@/lib/black-friday"

/**
 * SG_BF2026_V1 — true while the Black Friday offer is live. Client-only (server snapshot = false) so statically
 * rendered pages never freeze the offer into their HTML; a 30 s tick flips it in an open tab at the end.
 */
function subscribe(cb: () => void): () => void {
  const id = window.setInterval(cb, 30_000)
  return () => window.clearInterval(id)
}
const live = (): boolean => bfPhase() === "live"
const off = (): boolean => false

export function useBfLive(): boolean {
  return useSyncExternalStore(subscribe, live, off)
}
