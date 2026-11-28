"use client"

import { useSyncExternalStore } from "react"
import { BF, BF_COPY, bfEndLabel, bfLocale, bfPhase, bfStartLabel, formatBfCountdown, type BfPhase } from "@/lib/black-friday"
import { useCountdown } from "@/components/promo/use-countdown"
import { BfCountdown } from "@/components/promo/bf-countdown"
import st from "./pricing-experience.module.css"

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
      <p className={st.notice} data-bf-campaign={`${BF.campaign}-${phase}`}>
        {t.stripTeaser(bfStartLabel(loc), endLabel)}
      </p>
    )
  }
  return (
    <section
      aria-label={`${t.badge}: ${t.headline}`}
      className={st.bf}
      data-bf-campaign={`${BF.campaign}-${phase}`}
    >
      <div className={st.bfRow}>
        <div className={st.bfLead}>
          <span className={st.bfBadge}>{t.badge}</span>
          <h2 className={st.bfHeadline}>{t.headline}</h2>
        </div>
        {msLeft !== null && msLeft > 0 && (
          <div className={st.bfCount} aria-live="off">
            <span className={st.bfEnds}>{t.endsIn}</span>
            <BfCountdown msLeft={msLeft} locale={loc} size="md" />
            <span className="sr-only">{formatBfCountdown(msLeft, loc)}</span>
          </div>
        )}
      </div>
      <p className={st.bfTerms}>{t.stripLive(endLabel)}</p>
    </section>
  )
}
