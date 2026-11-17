/**
 * SG_BF2026_V1 (2026-11-16) — Black Friday / Cyber Week 2026.
 *
 * Offer: 40% off the FIRST YEAR of any self-serve annual plan, 30% off the FIRST 3 MONTHS of any
 * self-serve monthly plan, new subscriptions. Window: 2026-11-16 00:00 UTC (operator moved the start from Nov 23)
 * -> Wed 2026-12-02 23:59:59 PT. Final-rush annual bonus from Sat 2026-11-28 00:00 PT.
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
 * So this site only DISPLAYS the offer. Plan cards show list price struck through + the BF price (pricing-cards.tsx); the discount is
 * applied at checkout, where Stripe shows the exact amount before payment.
 */

import { formatSaleCountdown, type SaleLocale } from "@/lib/sale"

export const BF = {
  /** Teaser line ("starts ...") from here. Operator 2026-11-16: the offer starts NOW instead of Nov 23, so the
   *  teaser window is empty (teaserStartIso === startIso); the teaser copy stays for a future re-use. */
  teaserStartIso: "2026-11-16T00:00:00Z",
  /** = 2026-11-16 00:00 UTC (already past at deploy). Mirrors SG_BF2026['start'] (backend applies the code from here). */
  startIso: "2026-11-16T00:00:00Z",
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
  /** Banner (one line on desktop): badge, punchy headline, short qualifier, CTA, countdown prefix. */
  badge: string
  headline: string
  sub: string
  rushSub: string
  bannerCta: string
  /** Mobile (< 640 px): one short line + short CTA. */
  mobileHeadline: string
  mobileCta: string
  endsIn: string
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
    badge: "BLACK FRIDAY",
    headline: "Up to 40% off GEO Toolbox",
    sub: "40% off year one (annual) · 30% off 3 months (monthly) · no code needed",
    rushSub: "+ free GEO audit & strategy call with annual",
    bannerCta: "Claim my discount",
    mobileHeadline: "Black Friday: up to 40% off",
    mobileCta: "Claim",
    endsIn: "Ends in",
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
      `Black Friday until ${e}, 11:59 PM PT: 40% off the first year of any annual plan, 30% off the first 3 months of any monthly plan, for new subscriptions. Applied automatically at checkout, where you see the exact amount before you pay.`,
  },
  fr: {
    badge: "BLACK FRIDAY",
    headline: "Jusqu’à −40 % sur GEO Toolbox",
    sub: "−40 % la 1re année (annuel) · −30 % pendant 3 mois (mensuel) · sans code",
    rushSub: "+ audit GEO et appel stratégie offerts en annuel",
    bannerCta: "J’en profite",
    mobileHeadline: "Black Friday : jusqu’à −40 %",
    mobileCta: "J’en profite",
    endsIn: "Fin dans",
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
      `Black Friday jusqu’au ${e} à 23 h 59 (heure du Pacifique) : −40 % sur la première année de toute formule annuelle, −30 % sur les 3 premiers mois de toute formule mensuelle, pour les nouveaux abonnements. Appliqué automatiquement au paiement, où le montant exact s’affiche avant de payer.`,
  },
  es: {
    badge: "BLACK FRIDAY",
    headline: "Hasta un 40 % de descuento en GEO Toolbox",
    sub: "−40 % el primer año (anual) · −30 % durante 3 meses (mensual) · sin código",
    rushSub: "+ auditoría GEO y llamada de estrategia gratis en anual",
    bannerCta: "Quiero mi descuento",
    mobileHeadline: "Black Friday: hasta −40 %",
    mobileCta: "Lo quiero",
    endsIn: "Termina en",
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
      `Black Friday hasta el ${e} a las 23:59 (hora del Pacífico): 40 % de descuento en el primer año de cualquier plan anual y 30 % en los 3 primeros meses de cualquier plan mensual, para nuevas suscripciones. Se aplica automáticamente al pagar, donde ves el importe exacto antes de confirmar.`,
  },
  de: {
    badge: "BLACK FRIDAY",
    headline: "Bis zu 40 % Rabatt auf GEO Toolbox",
    sub: "−40 % im ersten Jahr (jährlich) · −30 % für 3 Monate (monatlich) · ohne Code",
    rushSub: "+ kostenloses GEO-Audit und Strategiegespräch beim Jahrestarif",
    bannerCta: "Rabatt sichern",
    mobileHeadline: "Black Friday: bis zu −40 %",
    mobileCta: "Sichern",
    endsIn: "Endet in",
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
      `Black Friday bis ${e}, 23:59 Uhr (Pazifikzeit): 40 % Rabatt auf das erste Jahr jedes Jahrestarifs, 30 % auf die ersten 3 Monate jedes Monatstarifs, für neue Abos. Wird beim Bezahlen automatisch abgezogen; dort siehst du den genauen Betrag vor dem Bezahlen.`,
  },
}

/**
 * SG_BF2026_SVC_V1 (2026-11-16, operator): Black Friday on the SERVICES pages only (never in the sitewide banner).
 * 25% off the three direct-buy services, applied by inc/actions/service_checkout.php (Stripe coupon BFSVC25-2026,
 * duration once), same window as the SaaS offer. Call-based sprint/retainers: 15% off the first month when signed
 * by the end date (applied by hand in the proposal).
 */
export const BF_SERVICES = {
  percentOff: 25,
  retainerMonth1PercentOff: 15,
  /** Only these checkout links are discounted server-side. */
  directBuyRe: /action=service_checkout&item=(report|article|cluster_sprint)\b/,
} as const

/** "$1,250" -> 1250; null when the string holds no single dollar amount. */
export function parseUsd(s: string): number | null {
  const m = s.match(/\$\s?([\d,]+(?:\.\d+)?)/)
  return m ? Number(m[1].replace(/,/g, "")) : null
}

/** 937.5 -> "$937.50", 2625 -> "$2,625" (cents only when there are cents, like Stripe shows). */
export function fmtUsd(n: number): string {
  const cents = Math.round(n * 100) % 100 !== 0
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 })
}

export function bfServicePrice(listUsd: number): number {
  return Math.round(listUsd * (100 - BF_SERVICES.percentOff)) / 100
}

/** SG_BF2026_V1 — plan-card copy while the offer is live ({total}/{full}/{amount} are pre-formatted money strings). */
export const BF_CARD_COPY: Record<SaleLocale, { pillAnnual: string; pillMonthly: string; subAnnual: string; subMonthly: string; save: string; toggle: string; ribbon: string }> = {
  en: { pillAnnual: "−40% year one", pillMonthly: "−30% for 3 months", subAnnual: "{total} billed for year one, then {full}/yr", subMonthly: "for 3 months, then {full}/mo", save: "You save {amount}", toggle: "−40%", ribbon: "Black Friday" },
  fr: { pillAnnual: "−40 % la 1re année", pillMonthly: "−30 % pendant 3 mois", subAnnual: "{total} facturés la 1re année, puis {full}/an", subMonthly: "pendant 3 mois, puis {full}/mois", save: "Vous économisez {amount}", toggle: "−40 %", ribbon: "Black Friday" },
  es: { pillAnnual: "−40 % el primer año", pillMonthly: "−30 % durante 3 meses", subAnnual: "{total} facturados el primer año, luego {full}/año", subMonthly: "durante 3 meses, luego {full}/mes", save: "Ahorras {amount}", toggle: "−40 %", ribbon: "Black Friday" },
  de: { pillAnnual: "−40 % im 1. Jahr", pillMonthly: "−30 % für 3 Monate", subAnnual: "{total} für das 1. Jahr, danach {full}/Jahr", subMonthly: "für 3 Monate, danach {full}/Monat", save: "Du sparst {amount}", toggle: "−40 %", ribbon: "Black Friday" },
}

/** Exact-to-the-cent BF prices (Stripe charges the exact percentage). */
export const bfAnnualYear = (yearly: number) => Math.round(yearly * (100 - BF.annualPercentOff)) / 100
export const bfMonthly = (monthly: number) => Math.round(monthly * (100 - BF.monthlyPercentOff)) / 100
