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
  const endLabel = bfEndLabel(loc)
  if (phase === "teaser") {
    return (
      <p className="mx-auto mb-6 max-w-3xl rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-center text-[13px] font-medium text-neutral-800" data-bf-campaign={`${BF.campaign}-${phase}`}>
        {t.stripTeaser(bfStartLabel(loc), endLabel)}
      </p>
    )
  }
  // Redesign (operator review 2026-11-16): black card + yellow badge, headline first, terms in small print.
  return (
    <div className="mx-auto mb-8 max-w-3xl rounded-2xl bg-neutral-950 px-5 py-4 text-center text-white shadow-lg sm:px-7" data-bf-campaign={`${BF.campaign}-${phase}`}>
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        <span className="rounded-sm bg-yellow-400 px-2 py-0.5 text-[11px] font-extrabold tracking-[0.12em] text-neutral-950">{t.badge}</span>
        <strong className="text-lg font-extrabold sm:text-xl">{t.headline}</strong>
      </p>
      <p className="mt-1.5 text-[14px] text-white/85">{t.sub}{rush === "1" ? ` ${t.rushSub}` : ""}</p>
      <p className="mt-1.5 text-[12px] text-white/55">{t.stripLive(endLabel)}</p>
    </div>
  )
}
