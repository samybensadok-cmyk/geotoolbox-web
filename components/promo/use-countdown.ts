"use client"

import { useEffect, useState } from "react"

/**
 * SG_PROMO_RESERVE_V1 — ticks once a second toward a unix-seconds deadline.
 * Returns milliseconds left (0 when passed) or null when no deadline.
 */
export function useCountdown(expiresAt: number | null | undefined): number | null {
  const [left, setLeft] = useState<number | null>(() =>
    typeof expiresAt === "number" ? Math.max(0, expiresAt * 1000 - Date.now()) : null
  )
  useEffect(() => {
    if (typeof expiresAt !== "number") {
      setLeft(null)
      return
    }
    const tick = () => setLeft(Math.max(0, expiresAt * 1000 - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [expiresAt])
  return left
}
