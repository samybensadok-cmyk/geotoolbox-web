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
    lead: "Free SEO/GEO audit + 30-min call with any annual plan.",
    body: (d) => `Until ${d}, midnight PT. We email you within 1 business day to book it.`,
    cta: "See annual plans",
    timeLeft: (cd) => `${cd} left`,
    dismiss: "Dismiss",
    strip: (d) =>
      `This week only: buy any annual plan before ${d}, midnight Pacific time, and get a free SEO/GEO audit of your site + a 30-minute consultation call. We email you within 1 business day of your purchase to book it.`,
  },
  fr: {
    lead: "Audit SEO/GEO offert + appel de 30 min avec toute formule annuelle.",
    body: (d) => `Jusqu’au ${d}, minuit (heure du Pacifique). Nous vous écrivons sous 1 jour ouvré pour le planifier.`,
    cta: "Voir les formules annuelles",
    timeLeft: (cd) => `reste ${cd}`,
    dismiss: "Fermer",
    strip: (d) =>
      `Cette semaine seulement : souscrivez une formule annuelle avant le ${d}, minuit (heure du Pacifique), et recevez un audit SEO/GEO de votre site + un appel de conseil de 30 minutes offerts. Nous vous écrivons sous 1 jour ouvré après l’achat pour le planifier.`,
  },
  es: {
    lead: "Auditoría SEO/GEO gratis + llamada de 30 min con cualquier plan anual.",
    body: (d) => `Hasta el ${d}, a medianoche (hora del Pacífico). Te escribimos en 1 día laborable para agendarla.`,
    cta: "Ver planes anuales",
    timeLeft: (cd) => `quedan ${cd}`,
    dismiss: "Cerrar",
    strip: (d) =>
      `Solo esta semana: contrata cualquier plan anual antes del ${d}, a medianoche (hora del Pacífico), y recibe gratis una auditoría SEO/GEO de tu sitio + una llamada de consultoría de 30 minutos. Te escribimos en 1 día laborable tras la compra para agendarla.`,
  },
  de: {
    lead: "Kostenloses SEO/GEO-Audit + 30-Min.-Call zu jedem Jahrestarif.",
    body: (d) => `Bis ${d}, Mitternacht (Pazifikzeit). Wir melden uns innerhalb von 1 Werktag zur Terminabstimmung.`,
    cta: "Jahrestarife ansehen",
    timeLeft: (cd) => `noch ${cd}`,
    dismiss: "Schließen",
    strip: (d) =>
      `Nur diese Woche: Buche bis ${d}, Mitternacht (Pazifikzeit), einen beliebigen Jahrestarif und erhalte ein kostenloses SEO/GEO-Audit deiner Website + ein 30-minütiges Beratungsgespräch. Wir melden uns innerhalb von 1 Werktag nach dem Kauf zur Terminabstimmung.`,
  },
}
