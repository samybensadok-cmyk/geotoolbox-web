"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { PLANS, type Plan, type PlanSegment } from "@/lib/plans"
import {
  PROMO,
  RESERVATION_CODE_RE,
  fmtPromoAmount,
  formatCountdown,
  forgetPromo,
  getReservation,
  isPromoLive,
  normalizePromoCode,
  promoDeadlineLabel,
  promoPrice,
  recallPromo,
  rememberPromo,
  type PromoLocale,
} from "@/lib/promo"
import { useCountdown } from "@/components/promo/use-countdown"
import { currencyParam } from "@/lib/i18n/currency"

// SG_PROMO_V2 (2026-08-15): offer continuity. When the visitor arrives from the
// founding banner (?promo=FOUNDING30&bv=<variant>) — or clicked it earlier and
// navigated here by menu (localStorage) — the cards show the SLASHED price and
// the CTA carries the promo into signup, where the backend pre-applies the
// Stripe promotion code. Copy lives here (not messages/*.json) so the parity
// guard keeps validating the plan numbers untouched; every number still comes
// from lib/plans.ts + lib/promo.ts.
const PROMO_UI: Record<PromoLocale, { strip: string; stripReserved: string; pill: string; then: string; firstYear: string }> = {
  en: {
    strip: `Founding rate — ${PROMO.percentOff}% off for your first ${PROMO.months} months with code ${PROMO.code}. ${PROMO.seats} seats · ends {deadline}.`,
    stripReserved: `Your founding seat is reserved — ${PROMO.percentOff}% off for your first ${PROMO.months} months. Reservation expires in {cd} (code {code}, applied at checkout).`,
    pill: `−${PROMO.percentOff}% · ${PROMO.months} months`,
    then: `for ${PROMO.months} months, then {full}`,
    firstYear: `first year, then {full}/yr`,
  },
  fr: {
    strip: `Tarif fondateurs — −${PROMO.percentOff} % pendant vos ${PROMO.months} premiers mois avec le code ${PROMO.code}. ${PROMO.seats} places · jusqu’au {deadline}.`,
    stripReserved: `Votre place fondateur est réservée — −${PROMO.percentOff} % pendant vos ${PROMO.months} premiers mois. La réservation expire dans {cd} (code {code}, appliqué au paiement).`,
    pill: `−${PROMO.percentOff} % · ${PROMO.months} mois`,
    then: `pendant ${PROMO.months} mois, puis {full}`,
    firstYear: `la première année, puis {full}/an`,
  },
  es: {
    strip: `Tarifa fundadores — ${PROMO.percentOff} % de descuento durante tus primeros ${PROMO.months} meses con el código ${PROMO.code}. ${PROMO.seats} plazas · hasta el {deadline}.`,
    stripReserved: `Tu plaza fundadora está reservada — ${PROMO.percentOff} % de descuento durante tus primeros ${PROMO.months} meses. La reserva caduca en {cd} (código {code}, aplicado al pagar).`,
    pill: `−${PROMO.percentOff} % · ${PROMO.months} meses`,
    then: `durante ${PROMO.months} meses, luego {full}`,
    firstYear: `el primer año, luego {full}/año`,
  },
  de: {
    strip: `Gründerpreis — ${PROMO.percentOff} % Rabatt auf deine ersten ${PROMO.months} Monate mit dem Code ${PROMO.code}. ${PROMO.seats} Plätze · bis {deadline}.`,
    stripReserved: `Dein Gründerplatz ist reserviert — ${PROMO.percentOff} % Rabatt auf deine ersten ${PROMO.months} Monate. Die Reservierung läuft in {cd} ab (Code {code}, wird beim Checkout angewendet).`,
    pill: `−${PROMO.percentOff} % · ${PROMO.months} Monate`,
    then: `für ${PROMO.months} Monate, danach {full}`,
    firstYear: `im ersten Jahr, danach {full}/Jahr`,
  },
  nl: {
    strip: `Oprichtersprijs — ${PROMO.percentOff}% korting op je eerste ${PROMO.months} maanden met de code ${PROMO.code}. ${PROMO.seats} plekken · tot {deadline}.`,
    stripReserved: `Je oprichtersplek is gereserveerd — ${PROMO.percentOff}% korting op je eerste ${PROMO.months} maanden. De reservering verloopt over {cd} (code {code}, wordt bij het afrekenen toegepast).`,
    pill: `−${PROMO.percentOff}% · ${PROMO.months} maanden`,
    then: `gedurende ${PROMO.months} maanden, daarna {full}`,
    firstYear: `het eerste jaar, daarna {full}/jaar`,
  },
}

// SG_LADDER_V3 2026-07-28: segment-pure tabs. Each tab shows exactly the
// three cards whose story is coherent for that audience:
//   Brands & consultants → Starter · Plus · Pro (footprint ladder, pooled prompts)
//   Agencies             → Growth · Scale · Enterprise (client-capacity ladder)
// Everything segment-dependent (inheritsFrom, featured, tagline/highlights
// overrides) resolves against the ACTIVE tab so a card can never reference a
// tier the visitor can't see.

// Localized display copy for the cards. EVERY number (price, quota figure) still
// comes from lib/plans.ts — this only carries the words around them, keyed by
// plan id, so a translation can never drift a price. Tier names (Starter,
// Plus, Pro, Growth, Scale, Enterprise) are product identifiers tied to billing
// and stay English in all locales.
export type PricingCardsCopy = {
  billingLabel: string
  monthly: string
  annual: string
  annualBadge: string
  perMo: string
  custom: string
  /** currency template, e.g. "${amount}" (en) or "{amount} $" (fr) */
  money: string
  billedYearly: string
  billedMonthly: string
  save: string
  everythingIn: string
  segmentLabel?: string
  segments?: { brands: string; agencies: string }
  /** shown under the CTA on plans with a free trial */
  trialNote?: string
  cta: { getStarted: string; bookCall: string; startTrial?: string }
  badge: { mostPopular: string }
  plans: Record<
    string,
    {
      tagline: string
      quotas: { domains: string; prompts: string; engines: string; scans: string }
      highlights: string[]
      /** optional overrides used when the card renders under the Agencies tab */
      agency?: { tagline?: string; highlights?: string[] }
    }
  >
}

/**
 * SG_PROMO_ORGANIC_V1: banner-variant id used when the founding offer is shown
 * to a visitor who did NOT arrive via the banner. Must match the `bv` allowlist
 * shape in js/auth.js (`[a-z0-9_-]`, ≤16 chars) so it survives into Stripe
 * metadata as `promo_variant`.
 */
const ORGANIC_VARIANT = "organic"

const fill = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)

function priceDisplay(plan: Plan, annual: boolean, copy: PricingCardsCopy, locale: string, promo: boolean) {
  const money = (n: number) => fill(copy.money, { amount: fmtPromoAmount(n, locale) })
  if (plan.priceMonthly === null) return { big: copy.custom, sub: null, save: null, strike: null }
  if (promo && plan.priceMonthly > 0) {
    // SG_PROMO_V2: the 12-month repeating coupon covers 12 monthly invoices,
    // or the FIRST annual invoice — after that the plan reverts to list price.
    // Say so on the card; the signup chip and the Stripe disclosure repeat it.
    const ui = PROMO_UI[(locale === "fr" || locale === "es" || locale === "de" || locale === "nl" ? locale : "en") as PromoLocale]
    if (annual && plan.priceYearly) {
      const perMo = Math.round(plan.priceYearly / 12)
      const promoYear = promoPrice(plan.priceYearly)
      return {
        big: money(Math.round((promoYear / 12) * 100) / 100),
        strike: money(perMo),
        sub: `${fill(copy.billedYearly, { total: money(promoYear) })} · ${fill(ui.firstYear, { full: money(plan.priceYearly) })}`,
        save: null,
      }
    }
    return {
      big: money(promoPrice(plan.priceMonthly)),
      strike: money(plan.priceMonthly),
      sub: fill(ui.then, { full: `${money(plan.priceMonthly)}${copy.perMo}` }),
      save: null,
    }
  }
  if (annual && plan.priceYearly) {
    const perMo = Math.round(plan.priceYearly / 12)
    const save = plan.priceMonthly * 12 - plan.priceYearly
    return {
      big: money(perMo),
      // Ahrefs-style anchor (2026-07-31, operator ask): the undiscounted
      // 12×monthly total struck through next to the real annual bill.
      strike: money(plan.priceMonthly * 12),
      sub: fill(copy.billedYearly, { total: money(plan.priceYearly) }),
      save: fill(copy.save, { amount: money(save) }),
    }
  }
  return { big: money(plan.priceMonthly), sub: copy.billedMonthly, save: null, strike: null }
}

export function PricingCards({ copy, locale }: { copy: PricingCardsCopy; locale: string }) {
  // Monthly first (operator call 2026-07-31): lead with the real monthly price,
  // let the annual toggle reveal the discount via the strikethrough anchor.
  const [annual, setAnnual] = useState(false)
  // Defaults to "brand" because Starter is the advertised entry point.
  const [segment, setSegment] = useState<PlanSegment>("brand")
  const visibleTiers = PLANS.filter((p) => p.segments.includes(segment))

  // SG_PROMO_V2: promo continuity — URL param wins, then the banner's stored
  // click; nothing after the deadline. Resolved client-side only (the pricing
  // page is statically rendered), so the default paint is list price and the
  // slashed price appears on hydration — the same moment the toggle activates.
  // window.location (not useSearchParams) so the static page needs no
  // Suspense boundary and stays fully prerendered.
  const [promo, setPromo] = useState<{ code: string; variant: string } | null>(null)
  useEffect(() => {
    if (!isPromoLive()) return
    let qs: URLSearchParams | null = null
    try {
      qs = new URLSearchParams(window.location.search)
    } catch {
      qs = null
    }
    const fromUrl = normalizePromoCode(qs?.get("promo"))
    if (fromUrl) {
      const variant = (qs?.get("bv") ?? "").replace(/[^a-z0-9_-]/gi, "").slice(0, 16)
      rememberPromo(fromUrl, variant)
      setPromo({ code: fromUrl, variant })
      return
    }
    const recalled = recallPromo()
    if (recalled) {
      setPromo(recalled)
      return
    }
    // SG_PROMO_ORGANIC_V1 (2026-09-01): a visitor who reaches /pricing WITHOUT
    // the banner — organic search, a blog link, a bookmark — used to read the
    // sitewide banner's "30% off" and then scroll to cards quoting full list
    // price. That mismatch reads as a bait. The offer is sitewide and public
    // (the banner prints the code itself), so the cards honour it for everyone
    // while `isPromoLive()` says it is live.
    //
    // ⚠️ Deliberately NO `rememberPromo` here. The card CTA already carries
    // `?promo=…&bv=organic` in its href, and js/auth.js persists a `?promo=`
    // arrival on the signup page, so the code reaches Stripe without this page
    // writing anything. Persisting on mere PAGE VIEW would (a) write campaign
    // attribution to storage before the visitor has interacted or consented,
    // which the consent UI's "strictly necessary only" promise does not cover,
    // and (b) stamp `variant:"organic"` over a banner variant the A/B test
    // depends on. The banner writes on CLICK; viewing a page is not a click.
    //
    // Residual risk, accepted and logged: `isPromoLive()` knows the deadline,
    // not the 20-seat cap. If the cap fills before 2026-09-15 an organic
    // visitor could see 139.30 here and then be quoted 199 on the Stripe
    // Checkout page (stripe_checkout.php re-validates the code live and falls
    // back to list price, logging `promo_requested`). Stripe always shows the
    // amount before the buyer confirms, so nobody is CHARGED more than they
    // were shown — but they would be disappointed. Verified live 2026-09-01:
    // FOUNDING30 is active with 0/20 redeemed. Revisit if redemptions climb.
    setPromo({ code: PROMO.code, variant: ORGANIC_VARIANT })
  }, [])
  // SG_PROMO_RESERVE_V1: a personal FOUND- code with a stored reservation gets a
  // live countdown; when it hits zero the offer is withdrawn on this page too.
  const isPersonal = !!promo && RESERVATION_CODE_RE.test(promo.code)
  const reservation = isPersonal ? getReservation() : null
  const resMatches = !!reservation && !!promo && reservation.code === promo.code
  const msLeft = useCountdown(resMatches ? reservation!.expiresAt : null)
  useEffect(() => {
    // A personal code is only honoured on this page while ITS reservation is
    // live in this browser (expired, unknown or another device → no slashed
    // prices; checkout re-validates anyway and falls back to list price).
    //
    // SG_PROMO_ORGANIC_V1: withdrawing a dead personal code no longer drops the
    // visitor to list price — it falls back to the PUBLIC offer, which is what
    // every other visitor sees. Without this, someone who once opened a shared
    // `?promo=FOUND-XXXXXX` link (the reservation lives in the sharer's
    // browser, not theirs) kept a poisoned `sg_promo` carrier that `recallPromo`
    // happily returns forever, so the organic branch above could never run for
    // them. Setting the public code makes `isPersonal` false on the next pass,
    // so this effect settles in one extra render and cannot loop.
    const fallback = isPromoLive() ? { code: PROMO.code, variant: ORGANIC_VARIANT } : null
    if (isPersonal && !resMatches) {
      // Purge the carrier as well as the state. `getReservation()`'s own
      // cleanup only runs when RESERVATION_KEY exists and has expired; a code
      // that arrived from someone ELSE's shared link leaves no reservation in
      // this browser at all, so nothing ever clears `sg_promo` and every later
      // visit re-enters this branch. Clearing it makes the repair permanent.
      forgetPromo()
      setPromo(fallback)
    } else if (resMatches && msLeft !== null && msLeft <= 0) setPromo(fallback)
  }, [isPersonal, resMatches, msLeft])
  const promoOn = !!promo
  const promoUi = PROMO_UI[(locale === "fr" || locale === "es" || locale === "de" || locale === "nl" ? locale : "en") as PromoLocale]

  return (
    <div>
      {/* Audience tabs — Brands & consultants / Agencies */}
      <div className="mb-6 flex items-center justify-center">
        <div
          role="radiogroup"
          aria-label={copy.segmentLabel ?? "Choose audience"}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1"
        >
          {([
            [copy.segments?.brands ?? "For brands & consultants", "brand"],
            [copy.segments?.agencies ?? "For agencies", "agency"],
          ] as const).map(([label, value]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={segment === value}
              onClick={() => setSegment(value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                segment === value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center">
        <div
          role="radiogroup"
          aria-label={copy.billingLabel}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 p-1"
        >
          {([
            [copy.monthly, false],
            [copy.annual, true],
          ] as const).map(([label, isAnnual]) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={annual === isAnnual}
              onClick={() => setAnnual(isAnnual)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                annual === isAnnual
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {label}
              {isAnnual && (
                <span className="ml-1.5 rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-semibold text-accent-800">
                  {copy.annualBadge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {promoOn && (
        <p
          className="mx-auto mt-5 max-w-3xl rounded-xl border border-accent-200 bg-accent-50 px-4 py-2.5 text-center text-[13px] font-medium text-accent-900"
          data-promo-strip={promo?.variant || "direct"}
        >
          {resMatches && msLeft !== null
            ? fill(promoUi.stripReserved, { cd: formatCountdown(msLeft), code: promo?.code ?? "" })
            : fill(promoUi.strip, { deadline: promoDeadlineLabel(locale) })}
        </p>
      )}

      {/* Cards — both tabs render exactly three */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:mx-auto lg:max-w-5xl">
        {visibleTiers.map((plan) => {
          const p = priceDisplay(plan, annual, copy, locale, promoOn)
          const c = copy.plans[plan.id]
          const seg = segment === "agency" ? c.agency : undefined
          const tagline = seg?.tagline ?? c.tagline
          const highlights = seg?.highlights ?? c.highlights
          const inheritsFrom = plan.inheritsFrom[segment]
          const isFeatured = plan.featured?.includes(segment) ?? false
          const isExternal = plan.cta.href.startsWith("http")
          const hasTrial = !!plan.trialDays && !isExternal
          const ctaLabel = isExternal
            ? copy.cta.bookCall
            : hasTrial
              ? copy.cta.startTrial ?? "Start 7-day free trial"
              : copy.cta.getStarted
          // Plan-aware signup deep link (SG_SIGNUP_V2): the signup page reads
          // ?plan=&interval=, shows a plan chip, and nudges the upgrade after
          // the first scan. Billing toggle state rides along. FR passes the
          // checkout currency explicitly (SG_EUR_CHECKOUT_V1) so js/auth.js
          // doesn't fall back to heuristics.
          const promoQs = promoOn && promo ? `&promo=${promo.code}${promo.variant ? `&bv=${promo.variant}` : ""}` : ""
          const ctaHref = isExternal
            ? plan.cta.href
            : `${plan.cta.href}&plan=${plan.id}&interval=${annual ? "annual" : "monthly"}${currencyParam(locale)}${promoQs}`
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-6",
                isFeatured
                  ? "border-accent-300 shadow-[0_20px_60px_-24px_rgba(13,148,136,0.45)] xl:-mt-3 xl:mb-3"
                  : "border-gray-200"
              )}
            >
              {isFeatured && (
                <span className="absolute -top-3 left-6 inline-flex items-center rounded-full bg-accent-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {copy.badge.mostPopular}
                </span>
              )}

              {/* h2, not h3: PricingCards is rendered directly under the /pricing
                  <h1> with no intervening section heading, so an <h3> here was a
                  level skip (h1 → h3) on the page. The classes carry the visual
                  size, so this is a semantics-only change. */}
              <h2 className="text-[15px] font-bold tracking-tight text-gray-900">{plan.name}</h2>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold tracking-tight text-gray-900">{p.big}</span>
                {plan.priceMonthly !== null && plan.priceMonthly > 0 && (
                  <span className="text-sm font-medium text-gray-500">{copy.perMo}</span>
                )}
              </div>
              <div className="mt-1 flex min-h-[20px] flex-wrap items-center gap-x-2 gap-y-1">
                {p.strike && (annual || promoOn) && (
                  <s className="text-xs text-gray-400">{p.strike}</s>
                )}
                {promoOn && plan.priceMonthly !== null && plan.priceMonthly > 0 && (
                  <span className="rounded bg-accent-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {promoUi.pill}
                  </span>
                )}
                {p.sub && <span className="text-xs text-gray-500">{p.sub}</span>}
                {p.save && annual && (
                  <span className="rounded bg-accent-50 px-1.5 py-0.5 text-[11px] font-semibold text-accent-700">
                    {p.save}
                  </span>
                )}
              </div>

              <p className="mt-4 min-h-[40px] text-[13px] leading-snug text-gray-600">{tagline}</p>

              <Link
                href={ctaHref}
                prefetch={false}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={cn(
                  "mt-5 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2",
                  isFeatured
                    ? "bg-accent-900 text-white hover:bg-accent-800 hover:shadow-lg hover:shadow-accent-900/25"
                    : "border border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50"
                )}
              >
                {ctaLabel}
              </Link>
              {hasTrial && copy.trialNote && (
                <p className="mt-2 text-center text-[11px] leading-snug text-gray-500">{copy.trialNote}</p>
              )}

              {/* Quota block — same 4 rows, same order, every card */}
              <dl className="mt-6 space-y-2 border-t border-gray-100 pt-5 text-[13px]">
                {Object.values(c.quotas).map((q, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700">
                    <svg className="h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={i === 0 ? "font-semibold text-gray-900" : ""}>{q}</span>
                  </div>
                ))}
              </dl>

              {/* Feature highlights */}
              <div className="mt-5 border-t border-gray-100 pt-5">
                {inheritsFrom && (
                  <p className="mb-2 text-[12px] font-medium text-gray-500">
                    {fill(copy.everythingIn, { plan: inheritsFrom })}
                  </p>
                )}
                <ul className="space-y-1.5 text-[13px] text-gray-700">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
