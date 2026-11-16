/**
 * SG_BF2026_V1 (2026-11-16) — Black Friday / Cyber Week 2026.
 *
 * Offer: 40% off the FIRST YEAR of any self-serve annual plan, 30% off the FIRST 3 MONTHS of any
 * self-serve monthly plan. Window: Mon 2026-11-23 00:00 PT -> Wed 2026-12-02 23:59:59 PT.
 * Teaser ("starts Nov 23") from TEASER_START until START.
 *
 * New campaign, new module, new dismiss key (same discipline as lib/sale.ts / lib/annual-bonus.ts):
 * never move a date in place; a re-run is a new campaign.
 *
 * Every number mirrors what is enforced elsewhere — change those FIRST, copy must never promise more:
 *   - Stripe (live): coupon BF40-2026 = 40%, repeating 1 month (= the first paid invoice: the whole first
 *     year on an annual price, after the 7-day trial when there is one); coupon BF30-2026 = 30%, repeating
 *     3 months (= the first 3 monthly invoices). redeem_by + promotion-code expires_at = END.
 *     Verified with Stripe test clocks 2026-11-16 (BLACK-FRIDAY-DEALS-2026/build/stripe-testclock-2026-11-16.txt).
 *   - Backend (Replit): inc/plan_limits.php SG_BF2026 window + codes; inc/actions/stripe_checkout.php applies
 *     the code for the checkout's billing interval to EVERY eligible checkout inside the window. It does
 *     not depend on a ?promo= carrier from this site (that carrier is what silently failed for OCT30).
 *
 * So this site only DISPLAYS the offer. Plan cards keep list prices; the strip says the discount is
 * applied at checkout, where Stripe shows the exact amount before payment.
 */

import { formatSaleCountdown, type SaleLocale } from "@/lib/sale"

export const BF = {
  /** Teaser line ("starts Monday Nov 23") from here. */
  teaserStartIso: "2026-11-17T00:00:00Z",
  /** = Mon 2026-11-23 00:00:00 America/Los_Angeles (PST, UTC-8). */
  startIso: "2026-11-23T08:00:00Z",
  /** = Wed 2026-12-02 23:59:59 America/Los_Angeles (PST, UTC-8). Mirrors SG_BF2026['end'] (backend stops applying
   *  the code after it). Stripe redeem_by / expires_at = 2026-12-03T10:00:00Z, a 2 h tail so a session created just
   *  before the end can still be paid. */
  endIso: "2026-12-03T07:59:59Z",
  /** Final-rush bonus: annual plans bought from here to the end also get a free GEO audit + consultation call
   *  (manual fulfilment, no code). = Sat 2026-11-28 00:00 PT. Mirrors SG_BF2026['rush_start']. */
  rushStartIso: "2026-11-28T08:00:00Z",
  annualPercentOff: 40,
  monthlyPercentOff: 30,
  monthlyMonths: 3,
  /** GA4 `promo_variant` for banner views/clicks/dismissals. */
  campaign: "bf-2026",
} as const

export type BfPhase = "off" | "teaser" | "live"

export function bfPhase(now: Date = new Date()): BfPhase {
  const t = now.getTime()
  if (t < Date.parse(BF.teaserStartIso)) return "off"
  if (t < Date.parse(BF.startIso)) return "teaser"
  if (t <= Date.parse(BF.endIso)) return "live"
  return "off"
}

export function isBfRush(now: Date = new Date()): boolean {
  return bfPhase(now) === "live" && now.getTime() >= Date.parse(BF.rushStartIso)
}

/** Unix SECONDS the visible countdown runs to: the start while teasing, the end while live. */
export function bfCountdownEpoch(now: Date = new Date()): number | null {
  const p = bfPhase(now)
  if (p === "teaser") return Math.floor(Date.parse(BF.startIso) / 1000)
  if (p === "live") return Math.floor(Date.parse(BF.endIso) / 1000)
  return null
}

export function bfLocale(locale: string | undefined): SaleLocale {
  return locale === "fr" || locale === "es" || locale === "de" ? locale : "en"
}

function label(iso: string, locale: SaleLocale): string {
  const loc = locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : "en-US"
  // "Monday, November 23" / "lundi 23 novembre" / "lunes, 23 de noviembre" / "Montag, 23. November"
  return new Intl.DateTimeFormat(loc, { weekday: "long", month: "long", day: "numeric", timeZone: "America/Los_Angeles" }).format(new Date(iso))
}
export const bfStartLabel = (l: SaleLocale) => label(BF.startIso, l)
export const bfEndLabel = (l: SaleLocale) => label(BF.endIso, l)

export { formatSaleCountdown as formatBfCountdown }

type Copy = {
  teaserLead: string
  teaserBody: (start: string) => string
  liveLead: string
  liveBody: (end: string) => string
  rushBonus: string
  cta: string
  timeLeft: (cd: string) => string
  startsIn: (cd: string) => string
  dismiss: string
  stripTeaser: (start: string, end: string) => string
  stripLive: (end: string) => string
}

export const BF_COPY: Record<SaleLocale, Copy> = {
  en: {
    teaserLead: "Black Friday: 40% off your first year on annual plans, 30% off your first 3 months on monthly.",
    teaserBody: (s) => `Starts ${s}, 12:00 AM PT.`,
    liveLead: "Black Friday: 40% off your first year on annual plans, 30% off your first 3 months on monthly.",
    liveBody: (e) => `New subscriptions, applied automatically at checkout. Ends ${e}, 11:59 PM PT.`,
    rushBonus: "Annual plans bought now also get a free GEO audit + consultation call.",
    cta: "See plans",
    timeLeft: (cd) => `${cd} left`,
    startsIn: (cd) => `starts in ${cd}`,
    dismiss: "Dismiss",
    stripTeaser: (s, e) =>
      `Black Friday runs ${s}, 12:00 AM PT, to ${e}, 11:59 PM PT: 40% off the first year of any annual plan, 30% off the first 3 months of any monthly plan, for new subscriptions, applied automatically at checkout.`,
    stripLive: (e) =>
      `Black Friday until ${e}, 11:59 PM PT: 40% off the first year of any annual plan, 30% off the first 3 months of any monthly plan, for new subscriptions. Applied automatically at checkout, where you see the exact amount before you pay. Prices below are list prices.`,
  },
  fr: {
    teaserLead: "Black Friday : −40 % sur votre première année en annuel, −30 % sur vos 3 premiers mois en mensuel.",
    teaserBody: (s) => `À partir du ${s}, 0 h (heure du Pacifique).`,
    liveLead: "Black Friday : −40 % sur votre première année en annuel, −30 % sur vos 3 premiers mois en mensuel.",
    liveBody: (e) => `Nouveaux abonnements, appliqué automatiquement au paiement. Fin le ${e} à 23 h 59 (heure du Pacifique).`,
    rushBonus: "Les formules annuelles souscrites maintenant incluent aussi un audit GEO et un appel conseil offerts.",
    cta: "Voir les formules",
    timeLeft: (cd) => `reste ${cd}`,
    startsIn: (cd) => `début dans ${cd}`,
    dismiss: "Fermer",
    stripTeaser: (s, e) =>
      `Black Friday du ${s}, 0 h, au ${e}, 23 h 59 (heure du Pacifique) : −40 % sur la première année de toute formule annuelle, −30 % sur les 3 premiers mois de toute formule mensuelle, pour les nouveaux abonnements, appliqué automatiquement au paiement.`,
    stripLive: (e) =>
      `Black Friday jusqu’au ${e} à 23 h 59 (heure du Pacifique) : −40 % sur la première année de toute formule annuelle, −30 % sur les 3 premiers mois de toute formule mensuelle, pour les nouveaux abonnements. Appliqué automatiquement au paiement, où le montant exact s’affiche avant de payer. Les prix ci-dessous sont les prix catalogue.`,
  },
  es: {
    teaserLead: "Black Friday: 40 % de descuento en tu primer año con plan anual, 30 % en tus 3 primeros meses con plan mensual.",
    teaserBody: (s) => `Empieza el ${s}, a las 0:00 (hora del Pacífico).`,
    liveLead: "Black Friday: 40 % de descuento en tu primer año con plan anual, 30 % en tus 3 primeros meses con plan mensual.",
    liveBody: (e) => `Nuevas suscripciones, se aplica automáticamente al pagar. Termina el ${e} a las 23:59 (hora del Pacífico).`,
    rushBonus: "Los planes anuales contratados ahora incluyen además una auditoría GEO y una llamada de consultoría gratis.",
    cta: "Ver planes",
    timeLeft: (cd) => `quedan ${cd}`,
    startsIn: (cd) => `empieza en ${cd}`,
    dismiss: "Cerrar",
    stripTeaser: (s, e) =>
      `Black Friday del ${s}, 0:00, al ${e}, 23:59 (hora del Pacífico): 40 % de descuento en el primer año de cualquier plan anual y 30 % en los 3 primeros meses de cualquier plan mensual, para nuevas suscripciones, aplicado automáticamente al pagar.`,
    stripLive: (e) =>
      `Black Friday hasta el ${e} a las 23:59 (hora del Pacífico): 40 % de descuento en el primer año de cualquier plan anual y 30 % en los 3 primeros meses de cualquier plan mensual, para nuevas suscripciones. Se aplica automáticamente al pagar, donde ves el importe exacto antes de confirmar. Los precios de abajo son precios de lista.`,
  },
  de: {
    teaserLead: "Black Friday: 40 % Rabatt auf dein erstes Jahr im Jahrestarif, 30 % auf deine ersten 3 Monate im Monatstarif.",
    teaserBody: (s) => `Ab ${s}, 0:00 Uhr (Pazifikzeit).`,
    liveLead: "Black Friday: 40 % Rabatt auf dein erstes Jahr im Jahrestarif, 30 % auf deine ersten 3 Monate im Monatstarif.",
    liveBody: (e) => `Für neue Abos, wird beim Bezahlen automatisch abgezogen. Endet am ${e} um 23:59 Uhr (Pazifikzeit).`,
    rushBonus: "Jahrestarife, die du jetzt abschließt, enthalten zusätzlich ein kostenloses GEO-Audit und ein Beratungsgespräch.",
    cta: "Tarife ansehen",
    timeLeft: (cd) => `noch ${cd}`,
    startsIn: (cd) => `startet in ${cd}`,
    dismiss: "Schließen",
    stripTeaser: (s, e) =>
      `Black Friday von ${s}, 0:00 Uhr, bis ${e}, 23:59 Uhr (Pazifikzeit): 40 % Rabatt auf das erste Jahr jedes Jahrestarifs, 30 % auf die ersten 3 Monate jedes Monatstarifs, für neue Abos, beim Bezahlen automatisch abgezogen.`,
    stripLive: (e) =>
      `Black Friday bis ${e}, 23:59 Uhr (Pazifikzeit): 40 % Rabatt auf das erste Jahr jedes Jahrestarifs, 30 % auf die ersten 3 Monate jedes Monatstarifs, für neue Abos. Wird beim Bezahlen automatisch abgezogen; dort siehst du den genauen Betrag vor dem Bezahlen. Die Preise unten sind Listenpreise.`,
  },
}
