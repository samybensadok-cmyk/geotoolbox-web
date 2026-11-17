"use client"

import { useSyncExternalStore } from "react"
import { BF, BF_COPY, bfEndLabel, bfLocale, bfPhase, bfStartLabel, isBfRush, type BfPhase } from "@/lib/black-friday"
import { useCountdown } from "@/components/promo/use-countdown"
import type { SaleLocale } from "@/lib/sale"

/**
 * SG_BF2026_V1 — Black Friday block above the plan cards (redesign 2026-11-17 after operator review: "not great in
 * terms of design and urgency"). Live: black panel, yellow badge, one headline, the two deals as chips, a ticking
 * D/H/M/S countdown to the real end (same instant the backend stops applying the code), terms in small print.
 * The cards below show the struck-through list price and the Black Friday price (pricing-cards.tsx).
 *
 * Client-only phase (server snapshot "off") so a statically rendered /pricing never freezes the offer into HTML.
 */
function subscribe(cb: () => void): () => void {
  const id = window.setInterval(cb, 30_000)
  return () => window.clearInterval(id)
}
const snapshot = (): string => `${bfPhase()}|${isBfRush() ? 1 : 0}`
const serverSnapshot = (): string => "off|0"

const UNITS: Record<SaleLocale, [string, string, string, string]> = {
  en: ["days", "hrs", "min", "sec"],
  fr: ["jours", "h", "min", "s"],
  es: ["días", "h", "min", "s"],
  de: ["Tage", "Std", "Min", "Sek"],
}
const HEAD: Record<SaleLocale, { title: string; annual: string; monthly: string; endsIn: string }> = {
  en: { title: "Up to 40% off every plan", annual: "Annual: 40% off year one", monthly: "Monthly: 30% off 3 months", endsIn: "Offer ends in" },
  fr: { title: "Jusqu’à −40 % sur toutes les formules", annual: "Annuel : −40 % la 1re année", monthly: "Mensuel : −30 % pendant 3 mois", endsIn: "L’offre se termine dans" },
  es: { title: "Hasta un 40 % de descuento en todos los planes", annual: "Anual: −40 % el primer año", monthly: "Mensual: −30 % durante 3 meses", endsIn: "La oferta termina en" },
  de: { title: "Bis zu 40 % Rabatt auf alle Tarife", annual: "Jährlich: −40 % im 1. Jahr", monthly: "Monatlich: −30 % für 3 Monate", endsIn: "Angebot endet in" },
}

function Tile({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex min-w-[56px] flex-col items-center rounded-lg bg-white/10 px-2 py-1.5 ring-1 ring-white/15 sm:min-w-[64px]">
      <span className="font-mono text-2xl font-bold tabular-nums leading-none text-white sm:text-[28px]">{String(n).padStart(2, "0")}</span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">{label}</span>
    </div>
  )
}

export function BlackFridayStrip({ locale = "en" }: { locale?: string }) {
  const [phase, rush] = useSyncExternalStore(subscribe, snapshot, serverSnapshot).split("|") as [BfPhase, string]
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
  const h = HEAD[loc]
  const u = UNITS[loc]
  const s = Math.max(0, Math.floor((msLeft ?? 0) / 1000))
  const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60]
  return (
    <section
      aria-label={`${t.badge}: ${h.title}`}
      className="relative mx-auto mb-10 max-w-5xl overflow-hidden rounded-3xl bg-neutral-950 px-5 py-7 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:px-10 sm:py-9"
      data-bf-campaign={`${BF.campaign}-${phase}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-red-600/25 blur-3xl" />
      <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <div className="max-w-xl">
          <span className="inline-block rounded-sm bg-yellow-400 px-2.5 py-1 text-[12px] font-extrabold tracking-[0.14em] text-neutral-950">{t.badge}</span>
          <h2 className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">{h.title}</h2>
          <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-[13px] font-bold text-neutral-950">{h.annual}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold text-white ring-1 ring-white/20">{h.monthly}</span>
          </div>
          {rush === "1" && <p className="mt-3 text-[14px] font-semibold text-yellow-200">{t.rushBonus}</p>}
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-white/70">{h.endsIn}</span>
          <div className="flex gap-2" aria-live="off">
            {parts.map((n, i) => (
              <Tile key={u[i]} n={n} label={u[i]} />
            ))}
          </div>
        </div>
      </div>
      <p className="relative mt-6 text-center text-[11.5px] leading-snug text-white/50 lg:text-left">{t.stripLive(endLabel)}</p>
    </section>
  )
}
