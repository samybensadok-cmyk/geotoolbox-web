"use client"

import { useSyncExternalStore } from "react"
import { BF, BF_COPY, bfEndLabel, bfLocale, bfPhase, bfStartLabel, isBfRush, type BfPhase } from "@/lib/black-friday"

/**
 * SG_BF2026_V1 — one-line notice above the plan cards: the teaser before Mon Nov 23 00:00 PT, the live terms until
 * Wed Dec 2 11:59 PM PT (+ the final-rush annual bonus from Sat Nov 28). Plan cards keep LIST prices; the backend
 * applies the discount at checkout, where Stripe shows the exact amount before payment.
 *
 * Review fix (Fable/Sonnet): the phase is read through useSyncExternalStore with a server snapshot of "off", so a
 * statically rendered /pricing never freezes a build-time phase into its HTML (no hydration mismatch, no stale
 * offer for crawlers after Dec 2), and a 30 s tick flips the phase in a tab left open across the start or end.
 */
function subscribe(cb: () => void): () => void {
  const id = window.setInterval(cb, 30_000)
  return () => window.clearInterval(id)
}
const snapshot = (): string => `${bfPhase()}|${isBfRush() ? 1 : 0}`
const serverSnapshot = (): string => "off|0"

export function BlackFridayStrip({ locale = "en" }: { locale?: string }) {
  const [phase, rush] = useSyncExternalStore(subscribe, snapshot, serverSnapshot).split("|") as [BfPhase, string]
  if (phase === "off") return null
  const loc = bfLocale(locale)
  const t = BF_COPY[loc]
  return (
    <p
      className="mx-auto mb-6 max-w-3xl rounded-xl border border-accent-200 bg-accent-50 px-4 py-2.5 text-center text-[13px] font-medium text-accent-900"
      data-bf-campaign={`${BF.campaign}-${phase}`}
    >
      {phase === "teaser" ? t.stripTeaser(bfStartLabel(loc), bfEndLabel(loc)) : `${t.stripLive(bfEndLabel(loc))}${rush === "1" ? ` ${t.rushBonus}` : ""}`}
    </p>
  )
}
