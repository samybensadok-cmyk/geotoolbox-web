/**
 * SG_SALE_OCT30_V1 (2026-10-24) — the October sitewide sale: 30% off the FIRST paid invoice of any plan,
 * monthly or annual, until the end of October.
 *
 * Separate from lib/promo.ts on purpose: FOUNDING30 (12 months, 20 seats, expired 2026-09-15) has its own
 * copy, seat counter and 48-h reservations, and lib/promo.ts says a re-run is a NEW campaign with a new
 * code, never a moved deadline. This file is that new campaign. Nothing here is a seat counter or a
 * reservation: the code is public, uncapped and ends at DEADLINE.
 *
 * Every number mirrors what is enforced elsewhere — change those FIRST, the copy must never promise more:
 *   - Stripe (live): coupon `OCT30-2026` = 30% off, duration=repeating, duration_in_months=1 (= the first
 *     paid invoice, also after the 7-day trial and for annual plans), redeem_by 2026-10-31T23:59:59Z;
 *     promotion code `OCT30` (promo_1UU5aKHTGOh11NTdDxomzbcf), expires_at the same instant, no
 *     max_redemptions.
 *   - Backend (Replit): inc/plan_limits.php SG_PROMO_AUTOAPPLY_CODES + SG_PROMO_AUTOAPPLY_DEADLINES['OCT30'].
 *   - Checkout pre-applies it from ?promo=OCT30 (inc/actions/stripe_checkout.php, SG_PROMO_AUTOAPPLY_V1).
 *
 * The banner hides itself after DEADLINE (isSaleLive), so a stale deploy can never advertise an expired
 * sale. Do NOT extend the deadline in place.
 */

export const SALE = {
  code: "OCT30",
  percentOff: 30,
  /** ISO date (UTC, end of day) — mirrors the Stripe promotion code expires_at. */
  deadline: "2026-10-31",
  /** GA4 `promo_variant` for the banner views/clicks. */
  campaign: "oct30-2026-10",
  /** `bv` carried into checkout metadata (allowlist [a-z0-9_-], <= 16 chars). */
  bannerVariant: "banner-oct30",
} as const

export type SaleLocale = "en" | "fr" | "es" | "de"

/** True until 23:59:59 UTC on the deadline day. */
export function isSaleLive(now: Date = new Date()): boolean {
  return now.getTime() <= Date.parse(`${SALE.deadline}T23:59:59Z`)
}

/** Deadline as unix SECONDS (what useCountdown consumes). */
export function saleDeadlineEpoch(): number {
  return Math.floor(Date.parse(`${SALE.deadline}T23:59:59Z`) / 1000)
}

/** "Oct 31" / "31 oct" / "31 oct" / "31. Okt" — short, locale-aware, no trailing dot. */
export function saleDeadlineLabel(locale: string): string {
  const loc = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : "en-US"
  return new Intl.DateTimeFormat(loc, { month: "short", day: "numeric", timeZone: "UTC" })
    .format(new Date(`${SALE.deadline}T12:00:00Z`))
    .replace(/\.$/, "")
}

export const SALE_COPY: Record<SaleLocale, { lead: (d: string) => string; body: string; cta: string; code: string; timeLeft: (cd: string) => string; dismiss: string; strip: (d: string) => string }> = {
  en: {
    lead: (d) => `30% off every plan until ${d}.`,
    body: "Applied automatically to your first payment, monthly or annual.",
    cta: "Get 30% off",
    code: "Code",
    timeLeft: (cd) => `${cd} left`,
    dismiss: "Dismiss",
    strip: (d) => `October sale: 30% off every plan until ${d}, applied automatically to your first payment (monthly or annual) with code ${SALE.code}.`,
  },
  fr: {
    lead: (d) => `−30 % sur toutes les formules jusqu’au ${d}.`,
    body: "Appliqué automatiquement à votre premier paiement, mensuel ou annuel.",
    cta: "Profiter des −30 %",
    code: "Code",
    timeLeft: (cd) => `reste ${cd}`,
    dismiss: "Fermer",
    strip: (d) => `Offre d’octobre : −30 % sur toutes les formules jusqu’au ${d}, appliqué automatiquement à votre premier paiement (mensuel ou annuel) avec le code ${SALE.code}.`,
  },
  es: {
    lead: (d) => `30 % de descuento en todos los planes hasta el ${d}.`,
    body: "Se aplica automáticamente a tu primer pago, mensual o anual.",
    cta: "Conseguir el 30 %",
    code: "Código",
    timeLeft: (cd) => `quedan ${cd}`,
    dismiss: "Cerrar",
    strip: (d) => `Oferta de octubre: 30 % de descuento en todos los planes hasta el ${d}, aplicado automáticamente a tu primer pago (mensual o anual) con el código ${SALE.code}.`,
  },
  de: {
    lead: (d) => `30 % Rabatt auf alle Tarife bis ${d}.`,
    body: "Wird automatisch auf deine erste Zahlung angewendet, monatlich oder jährlich.",
    cta: "30 % sichern",
    code: "Code",
    timeLeft: (cd) => `noch ${cd}`,
    dismiss: "Schließen",
    strip: (d) => `Oktober-Aktion: 30 % Rabatt auf alle Tarife bis ${d}, automatisch auf deine erste Zahlung (monatlich oder jährlich) mit dem Code ${SALE.code}.`,
  },
}
