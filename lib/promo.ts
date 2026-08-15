/**
 * SG_PROMO_V2 (2026-08-15) — single source of truth for the sitewide founding
 * offer + the banner experiment.
 *
 * Why one file: the banner, the pricing cards and the signup deep-link all have
 * to describe the SAME offer (same code, same %, same duration, same deadline,
 * same seat count) or the visitor is promised something checkout won't honour.
 * Every number here is mirrored in Stripe on the promotion code `FOUNDING30`
 * (coupon sKGeUpvV: 30% off, repeating 12 months; promotion code
 * max_redemptions=20, expires_at = DEADLINE below). If you change a value here,
 * change Stripe first — the copy must never promise more than Stripe enforces.
 *
 * Deadline discipline: the banner HIDES ITSELF after DEADLINE (see isPromoLive)
 * so a stale deploy can never advertise an expired offer. Do NOT "extend" the
 * deadline in place — a moved deadline is a fake deadline. If the offer is
 * re-run, that's a NEW campaign with a new code and a new dismiss key.
 */

export const PROMO = {
  code: "FOUNDING30",
  percentOff: 30,
  months: 12,
  seats: 20,
  /** ISO date (UTC, end of day) — mirrors the Stripe promotion code expires_at. */
  deadline: "2026-09-15",
} as const

export type PromoLocale = "en" | "fr" | "es"

/**
 * Discounted price, exact to the cent ($199 → 139.3, $948 → 663.6). Never round
 * to whole dollars: Stripe charges the exact percentage ($139.30), and an
 * advertised price below the charged one is the direction that gets disputed.
 */
export function promoPrice(price: number): number {
  return Math.round(price * (100 - PROMO.percentOff)) / 100
}

/** "139.30" / "139,30" — 2 decimals only when there are cents. */
export function fmtPromoAmount(n: number, locale: string): string {
  const loc = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US"
  const cents = Math.round(n * 100) % 100 !== 0
  return n.toLocaleString(loc, { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 })
}

/** True until 23:59:59 UTC on the deadline day. */
export function isPromoLive(now: Date = new Date()): boolean {
  const end = Date.parse(`${PROMO.deadline}T23:59:59Z`)
  return now.getTime() <= end
}

/** Days left, floored at 0 — used for "ends in N days" copy. */
export function promoDaysLeft(now: Date = new Date()): number {
  const end = Date.parse(`${PROMO.deadline}T23:59:59Z`)
  return Math.max(0, Math.ceil((end - now.getTime()) / 86_400_000))
}

/** "Sep 15" / "15 sept." / "15 sept" — short, locale-aware deadline label. */
export function promoDeadlineLabel(locale: string): string {
  const d = new Date(`${PROMO.deadline}T12:00:00Z`)
  const loc = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-US"
  // Strip the abbreviation dot ("15 sept." → "15 sept") so sentence-final
  // punctuation in banner copy never doubles up.
  return new Intl.DateTimeFormat(loc, { month: "short", day: "numeric", timeZone: "UTC" }).format(d).replace(/\.$/, "")
}

/** Only ever accept the one code we run — this string is echoed into URLs. */
export function normalizePromoCode(raw: string | null | undefined): string | null {
  if (!raw) return null
  const v = raw.trim().toUpperCase()
  return v === PROMO.code ? v : null
}

/** localStorage key the banner writes on click and the pricing page reads. */
export const PROMO_STORAGE_KEY = "sg_promo"

/**
 * Persist {code, variant} so the offer survives the banner → pricing → signup
 * hop even when a visitor navigates by menu instead of the banner CTA. Best
 * effort; storage may be blocked.
 */
export function rememberPromo(code: string, variant: string): void {
  try {
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify({ code, variant, at: Date.now() }))
  } catch {
    /* ignore */
  }
}

export function recallPromo(): { code: string; variant: string } | null {
  try {
    const raw = localStorage.getItem(PROMO_STORAGE_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as { code?: string; variant?: string }
    const code = normalizePromoCode(v.code)
    if (!code) return null
    return { code, variant: typeof v.variant === "string" ? v.variant.slice(0, 16) : "" }
  } catch {
    return null
  }
}
