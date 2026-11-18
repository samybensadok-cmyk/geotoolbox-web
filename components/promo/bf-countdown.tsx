"use client"

import type { SaleLocale } from "@/lib/sale"

/**
 * SG_BF2026_V2 (2026-11-18 redesign after a 19-brand benchmark, BLACK-FRIDAY-DEALS-2026/design-bench/) — ticking
 * D/H/M/S tiles, the countdown format used by Rank Math, WP Rocket, Babbel, Kinsta, Kajabi and Elementor.
 * "sm" = one-line top bar (number + unit letter in one small box), "md" = pricing band / exit popup (stacked label).
 * Pure display: the caller owns the useCountdown tick and passes msLeft.
 */
const SHORT: Record<SaleLocale, [string, string, string, string]> = {
  en: ["d", "h", "m", "s"],
  fr: ["j", "h", "m", "s"],
  es: ["d", "h", "m", "s"],
  de: ["T", "h", "m", "s"],
}
const LONG: Record<SaleLocale, [string, string, string, string]> = {
  en: ["days", "hrs", "min", "sec"],
  fr: ["jours", "h", "min", "s"],
  es: ["días", "h", "min", "s"],
  de: ["Tage", "Std", "Min", "Sek"],
}

export function bfParts(msLeft: number): [number, number, number, number] {
  const s = Math.max(0, Math.floor(msLeft / 1000))
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60]
}

export function BfCountdown({ msLeft, locale, size = "md" }: { msLeft: number; locale: SaleLocale; size?: "sm" | "md" }) {
  const parts = bfParts(msLeft)
  if (size === "sm") {
    const u = SHORT[locale]
    return (
      <span className="inline-flex items-center gap-1 font-mono text-[12px] tabular-nums" aria-hidden="true">
        {parts.map((n, i) => (
          <span key={u[i]} className="rounded bg-white/10 px-1.5 py-0.5 font-semibold text-white ring-1 ring-white/10">
            {String(n).padStart(2, "0")}
            <span className="font-normal text-white/55">{u[i]}</span>
          </span>
        ))}
      </span>
    )
  }
  const u = LONG[locale]
  return (
    <span className="inline-flex gap-1.5" aria-hidden="true">
      {parts.map((n, i) => (
        <span key={u[i]} className="flex min-w-[48px] flex-col items-center rounded-lg bg-white/10 px-1.5 py-1.5 ring-1 ring-white/15">
          <span className="font-mono text-[22px] font-bold tabular-nums leading-none text-white">{String(n).padStart(2, "0")}</span>
          <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-wider text-white/55">{u[i]}</span>
        </span>
      ))}
    </span>
  )
}
