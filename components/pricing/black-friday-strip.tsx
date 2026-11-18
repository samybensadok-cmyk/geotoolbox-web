"use client"

import { useSyncExternalStore } from "react"
import { BF, BF_COPY, bfEndLabel, bfLocale, bfPhase, bfStartLabel, formatBfCountdown, type BfPhase } from "@/lib/black-friday"
import { useCountdown } from "@/components/promo/use-countdown"
import { BfCountdown } from "@/components/promo/bf-countdown"

/**
 * SG_BF2026_V1 — Black Friday block above the plan cards (redesign 2026-11-17 after operator review: "not great in
 * terms of design and urgency"). Live: black panel, yellow badge, one headline, the two deals as chips, a ticking
 * D/H/M/S countdown to the real end (same instant the backend stops applying the code), terms in small print.
 * The cards below show the struck-through list price and the Black Friday price (pricing-cards.tsx).
 *
 * SG_BF2026_V2 (2026-11-18, operator: wording too long, design not good enough): slim band, one headline ("Up to 40%
 * off every plan"), ticking tiles, one short terms line. Interval terms + annual bonus moved to the cards. Benchmark:
 * BLACK-FRIDAY-DEALS-2026/design-bench/BENCHMARK-2026-11-18.md (Kajabi panel ~145 px; ours was ~280 px).
 *
 * Client-only phase (server snapshot "off") so a statically rendered /pricing never freezes the offer into HTML.
 */
function subscribe(cb: () => void): () => void {
  const id = window.setInterval(cb, 30_000)
  return () => window.clearInterval(id)
}
const snapshot = (): string => bfPhase()
const serverSnapshot = (): string => "off"

export function BlackFridayStrip({ locale = "en" }: { locale?: string }) {
  const phase = useSyncExternalStore(subscribe, snapshot, serverSnapshot) as BfPhase
  const msLeft = useCountdown(phase === "live" ? Math.floor(Date.parse(BF.endIso) / 1000) : null)
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
  return (
    <section
      aria-label={`${t.badge}: ${t.headline}`}
      className="relative mx-auto mb-8 max-w-5xl overflow-hidden rounded-2xl bg-neutral-950 px-5 py-5 text-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)] sm:px-8"
      data-bf-campaign={`${BF.campaign}-${phase}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-yellow-400/15 blur-3xl" />
      <div className="relative flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
          <span className="shrink-0 rounded-sm bg-yellow-400 px-2.5 py-1 text-[11px] font-extrabold tracking-[0.14em] text-neutral-950">{t.badge}</span>
          <h2 className="text-[22px] font-extrabold leading-tight tracking-tight sm:text-[26px]">{t.headline}</h2>
        </div>
        {msLeft !== null && msLeft > 0 && (
          <div className="flex shrink-0 items-center gap-2.5" aria-live="off">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{t.endsIn}</span>
            <BfCountdown msLeft={msLeft} locale={loc} size="md" />
            <span className="sr-only">{formatBfCountdown(msLeft, loc)}</span>
          </div>
        )}
      </div>
      <p className="relative mt-3 text-center text-[12px] leading-snug text-white/55 md:text-left">{t.stripLive(endLabel)}</p>
    </section>
  )
}
