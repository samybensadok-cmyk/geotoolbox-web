/**
 * SG_ANNUAL_BONUS_NOV15_V1 (2026-11-09) — one-week bonus: any ANNUAL plan bought before Sunday
 * 2026-11-15 23:59:59 Los Angeles time gets a free SEO/GEO audit of the buyer's site + a 30-minute
 * consultation call.
 *
 * New campaign, new module, new dismiss key (same discipline as lib/sale.ts and lib/promo.ts): never move
 * DEADLINE in place, a re-run is a new campaign.
 *
 * Nothing is enforced in Stripe or the backend: there is no code. Fulfilment is manual — the operator
 * emails every annual buyer of the window within 1 business day to book the call, from the Stripe list of
 * annual subscriptions created before DEADLINE. The copy promises exactly that and nothing more.
 * (Scale annual already lists a "one-off GEO audit & strategy session", so copy never says "extra".)
 *
 * The banner and the pricing strip hide themselves after DEADLINE (isBonusLive).
 */

import { formatSaleCountdown, type SaleLocale } from "@/lib/sale"

export const BONUS = {
  /** = Sun 2026-11-15 23:59:59 America/Los_Angeles (PST, UTC-8; DST ended 2026-11-01). */
  deadlineIso: "2026-11-16T07:59:59Z",
  /** GA4 `promo_variant` for the banner views/clicks/dismissals. */
  campaign: "audit-annual-2026-11",
} as const

export type BonusLocale = SaleLocale

export function bonusLocale(locale: string | undefined): BonusLocale {
  return locale === "fr" || locale === "es" || locale === "de" ? locale : "en"
}

/** True up to and including DEADLINE. */
export function isBonusLive(now: Date = new Date()): boolean {
  return now.getTime() <= Date.parse(BONUS.deadlineIso)
}

/** Deadline as unix SECONDS (what useCountdown consumes). */
export function bonusDeadlineEpoch(): number {
  return Math.floor(Date.parse(BONUS.deadlineIso) / 1000)
}

/** "Sunday, Nov 15" in Los Angeles time, per locale, no trailing abbreviation dot. */
export function bonusDeadlineLabel(locale: BonusLocale): string {
  const loc = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : "en-US"
  return new Intl.DateTimeFormat(loc, { weekday: "long", month: "short", day: "numeric", timeZone: "America/Los_Angeles" })
    .format(new Date(BONUS.deadlineIso))
    .replace(/\.$/, "")
}

export { formatSaleCountdown as formatBonusCountdown }

export const BONUS_COPY: Record<
  BonusLocale,
  { lead: string; body: (d: string) => string; cta: string; timeLeft: (cd: string) => string; dismiss: string; strip: (d: string) => string }
> = {
  en: {
    lead: "Free SEO/GEO audit + 30-min strategy call",
    body: () => "with any annual plan. Ends Sunday midnight PT.",
    cta: "Claim my audit",
    timeLeft: (cd) => `${cd} left`,
    dismiss: "Dismiss",
    strip: () => "Any annual plan = a free SEO/GEO audit of your site + a 30-min strategy call. Ends Sunday midnight PT.",
  },
  fr: {
    lead: "Audit SEO/GEO + appel stratégie de 30 min offerts",
    body: () => "avec toute formule annuelle. Fin dimanche minuit (heure du Pacifique).",
    cta: "Obtenir mon audit",
    timeLeft: (cd) => `reste ${cd}`,
    dismiss: "Fermer",
    strip: () => "Toute formule annuelle = un audit SEO/GEO de votre site + un appel stratégie de 30 min offerts. Fin dimanche minuit (heure du Pacifique).",
  },
  es: {
    lead: "Auditoría SEO/GEO + llamada de estrategia de 30 min gratis",
    body: () => "con cualquier plan anual. Termina el domingo a medianoche (hora del Pacífico).",
    cta: "Quiero mi auditoría",
    timeLeft: (cd) => `quedan ${cd}`,
    dismiss: "Cerrar",
    strip: () => "Cualquier plan anual = una auditoría SEO/GEO de tu sitio + una llamada de estrategia de 30 min gratis. Termina el domingo a medianoche (hora del Pacífico).",
  },
  de: {
    lead: "Kostenloses SEO/GEO-Audit + 30-Min.-Strategiecall",
    body: () => "zu jedem Jahrestarif. Endet Sonntag um Mitternacht (Pazifikzeit).",
    cta: "Audit sichern",
    timeLeft: (cd) => `noch ${cd}`,
    dismiss: "Schließen",
    strip: () => "Jeder Jahrestarif = ein kostenloses SEO/GEO-Audit deiner Website + ein 30-Min.-Strategiecall. Endet Sonntag um Mitternacht (Pazifikzeit).",
  },
}
