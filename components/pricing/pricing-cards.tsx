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
import { useBfLive } from "@/components/promo/use-bf-live"
import { BF_CARD_COPY, bfAnnualYear, bfLocale, bfMonthly, isBfRush } from "@/lib/black-friday"
import k from "@/components/brand/dark-kit.module.css"
import st from "./pricing-experience.module.css"

// Dark kit (2026-11-28): presentation only. The colours, spacing and card treatments live in
// pricing-experience.module.css + the shared kit; every number, label and href below is unchanged.
function CheckIcon() {
  return (
    <svg className={st.check} aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M3 8.5 6.5 12 13 4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// SG_PROMO_V2 (2026-08-15): offer continuity. When the visitor arrives from the
// founding banner (?promo=FOUNDING30&bv=<variant>) — or clicked it earlier and
// navigated here by menu (localStorage) — the cards show the SLASHED price and
// the CTA carries the promo into signup, where the backend pre-applies the
// Stripe promotion code. Copy lives here (not messages/*.json) so the parity
// guard keeps validating the plan numbers untouched; every number still comes
// from lib/plans.ts + lib/promo.ts.
const PROMO_UI: Record<PromoLocale, { strip: string; stripReserved: string; pill: string; then: string; firstYear: string }> = {
  en: {
    strip: `Founding rate — ${PROMO.percentOff}% off for your first ${PROMO.months} months with code ${PROMO.code}. ${PROMO.seatsLeft} spots left · ends {deadline}.`,
    stripReserved: `Your founding seat is reserved — ${PROMO.percentOff}% off for your first ${PROMO.months} months. Reservation expires in {cd} (code {code}, applied at checkout).`,
    pill: `−${PROMO.percentOff}% · ${PROMO.months} months`,
    then: `for ${PROMO.months} months, then {full}`,
    firstYear: `first year, then {full}/yr`,
  },
  fr: {
    strip: `Tarif fondateurs — −${PROMO.percentOff} % pendant vos ${PROMO.months} premiers mois avec le code ${PROMO.code}. Plus que ${PROMO.seatsLeft} places · jusqu’au {deadline}.`,
    stripReserved: `Votre place fondateur est réservée — −${PROMO.percentOff} % pendant vos ${PROMO.months} premiers mois. La réservation expire dans {cd} (code {code}, appliqué au paiement).`,
    pill: `−${PROMO.percentOff} % · ${PROMO.months} mois`,
    then: `pendant ${PROMO.months} mois, puis {full}`,
    firstYear: `la première année, puis {full}/an`,
  },
  es: {
    strip: `Tarifa fundadores — ${PROMO.percentOff} % de descuento durante tus primeros ${PROMO.months} meses con el código ${PROMO.code}. Quedan ${PROMO.seatsLeft} plazas · hasta el {deadline}.`,
    stripReserved: `Tu plaza fundadora está reservada — ${PROMO.percentOff} % de descuento durante tus primeros ${PROMO.months} meses. La reserva caduca en {cd} (código {code}, aplicado al pagar).`,
    pill: `−${PROMO.percentOff} % · ${PROMO.months} meses`,
    then: `durante ${PROMO.months} meses, luego {full}`,
    firstYear: `el primer año, luego {full}/año`,
  },
  de: {
    strip: `Gründerpreis — ${PROMO.percentOff} % Rabatt auf deine ersten ${PROMO.months} Monate mit dem Code ${PROMO.code}. Nur noch ${PROMO.seatsLeft} Plätze · bis {deadline}.`,
    stripReserved: `Dein Gründerplatz ist reserviert — ${PROMO.percentOff} % Rabatt auf deine ersten ${PROMO.months} Monate. Die Reservierung läuft in {cd} ab (Code {code}, wird beim Checkout angewendet).`,
    pill: `−${PROMO.percentOff} % · ${PROMO.months} Monate`,
    then: `für ${PROMO.months} Monate, danach {full}`,
    firstYear: `im ersten Jahr, danach {full}/Jahr`,
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
const TRIAL_COPY: Record<string, { label: string; body: string }> = {
  en: { label: "What’s included in the trial?", body: "25% of monthly credits · {brands} brand(s) · up to 3 articles where included. Full allowances unlock after the first payment." },
  fr: { label: "Que comprend l’essai ?", body: "25 % des crédits mensuels · {brands} marque(s) · jusqu’à 3 articles si inclus. Les quotas complets sont disponibles après le premier paiement." },
  es: { label: "¿Qué incluye la prueba?", body: "25 % de los créditos mensuales · {brands} marca(s) · hasta 3 artículos si están incluidos. Los límites completos se activan tras el primer pago." },
  de: { label: "Was enthält die Testphase?", body: "25 % der monatlichen Credits · {brands} Marke(n) · bis zu 3 Artikel, sofern enthalten. Volle Kontingente nach der ersten Zahlung." },
}

// Card feature lists show the first few lines; the rest folds away so the
// three cards stay scannable. Label only — every feature line still renders.
const SHOW_ALL: Record<string, string> = {
  en: "All features",
  fr: "Toutes les fonctionnalités",
  es: "Todas las funciones",
  de: "Alle Funktionen",
}
const VISIBLE_HIGHLIGHTS = 3
// Highlight lines (by index — order is identical in every locale's messages)
// that only restate a quota row already shown as a checkmark. They move to the
// end so the visible lines are the plan's differentiators; nothing is dropped.
const RESTATES_QUOTA: Record<string, number[]> = {
  starter: [1, 2],
  consultant: [1],
  pro: [1],
  scale: [0],
  enterprise: [0],
}

const ORGANIC_VARIANT = "organic"

const fill = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m)

type PriceView = { big: string; sub: string | null; save: string | null; strike: string | null; bfPill?: string }
function priceDisplay(plan: Plan, annual: boolean, copy: PricingCardsCopy, locale: string, promo: boolean, bf = false): PriceView {
  const money = (n: number) => fill(copy.money, { amount: fmtPromoAmount(n, locale) })
  if (plan.priceMonthly === null) return { big: copy.custom, sub: null, save: null, strike: null }
  // SG_BF2026_V1 (redesign 2026-11-17, operator: "prices are not strike through with discount visible on the cards"):
  // while Black Friday is live every self-serve card shows list price struck through, the BF price, a pill and the
  // saving. Same numbers the backend applies at checkout (lib/black-friday.ts mirrors SG_BF2026 + the Stripe coupons).
  if (bf && plan.priceMonthly > 0) {
    const t = BF_CARD_COPY[bfLocale(locale)]
    if (annual && plan.priceYearly) {
      const year = bfAnnualYear(plan.priceYearly)
      return {
        big: money(Math.round((year / 12) * 100) / 100),
        strike: money(Math.round((plan.priceYearly / 12) * 100) / 100),
        sub: fill(t.subAnnual, { total: money(year), full: money(plan.priceYearly) }),
        save: null,
        bfPill: t.pillAnnual,
      }
    }
    const mo = bfMonthly(plan.priceMonthly)
    return {
      big: money(mo),
      strike: money(plan.priceMonthly),
      sub: fill(t.subMonthly, { full: money(plan.priceMonthly) }),
      save: null,
      bfPill: t.pillMonthly,
    }
  }
  if (promo && plan.priceMonthly > 0) {
    // SG_PROMO_V2: the 12-month repeating coupon covers 12 monthly invoices,
    // or the FIRST annual invoice — after that the plan reverts to list price.
    // Say so on the card; the signup chip and the Stripe disclosure repeat it.
    const ui = PROMO_UI[(locale === "fr" || locale === "es" || locale === "de" ? locale : "en") as PromoLocale]
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

/** SG_BF2026_V2 — "$47.40" -> $47 + small ".40"; "47,40 €" -> 47 + small ",40" + " €". Other strings unchanged. */
function BfPrice({ value }: { value: string }) {
  const m = value.match(/^(.*?\d)([.,]\d{2})(\D*)$/)
  if (!m) return <>{value}</>
  return (
    <>
      {m[1]}
      <span className={st.cents}>{m[2]}</span>
      {m[3]}
    </>
  )
}

export function PricingCards({ copy, locale, creditsLabel = "Monthly credits" }: { copy: PricingCardsCopy; locale: string; creditsLabel?: string }) {
  // Monthly first (operator call 2026-07-31): lead with the real monthly price,
  // let the annual toggle reveal the discount via the strikethrough anchor.
  // SG_BF2026_V1: until the visitor picks an interval, Black Friday opens on annual (the bigger, 40% deal).
  const bfLive = useBfLive()
  const [annualChoice, setAnnual] = useState<boolean | null>(null)
  const annual = annualChoice ?? bfLive
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
  // SG_ANNUAL_BONUS_NOV15_V1: `?interval=annual` (the annual-bonus banner CTA) opens on the annual toggle.
  // Own effect on purpose: the promo effect below returns early once FOUNDING30 is dead.
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get("interval") === "annual") setAnnual(true)
    } catch {
      /* ignore */
    }
  }, [])
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
  // During Black Friday the backend applies the BF code itself; legacy promo carriers are ignored here too.
  const promoOn = !!promo && !bfLive
  const promoUi = PROMO_UI[(locale === "fr" || locale === "es" || locale === "de" ? locale : "en") as PromoLocale]

  return (
    <div>
      {/* Audience tabs (left) + billing toggle (right); stacked full width on phones */}
      <div className={st.controls}>
        <div
          role="group"
          aria-label={copy.segmentLabel ?? "Choose audience"}
          className={st.seg}
        >
          {([
            [copy.segments?.brands ?? "For brands & consultants", "brand"],
            [copy.segments?.agencies ?? "For agencies", "agency"],
          ] as const).map(([label, value]) => (
            <button
              key={value}
              type="button"
              aria-pressed={segment === value}
              onClick={() => setSegment(value)}
              className={st.segBtn}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Billing toggle */}
        <div
          role="group"
          aria-label={copy.billingLabel}
          className={st.seg}
        >
          {([
            [copy.monthly, false],
            [copy.annual, true],
          ] as const).map(([label, isAnnual]) => (
            <button
              key={label}
              type="button"
              aria-pressed={annual === isAnnual}
              onClick={() => setAnnual(isAnnual)}
              className={st.segBtn}
            >
              {label}
              {isAnnual && (
                bfLive ? (
                  <span className={st.bfToggle}>
                    {BF_CARD_COPY[bfLocale(locale)].toggle}
                  </span>
                ) : (
                  <span className={st.saveBadge}>
                    {copy.annualBadge}
                  </span>
                )
              )}
            </button>
          ))}
        </div>
      </div>

      {promoOn && (
        <p
          className={cn(st.notice, st.noticeLime, st.noticeTop)}
          data-promo-strip={promo?.variant || "direct"}
        >
          {resMatches && msLeft !== null
            ? fill(promoUi.stripReserved, { cd: formatCountdown(msLeft), code: promo?.code ?? "" })
            : fill(promoUi.strip, { deadline: promoDeadlineLabel(locale) })}
        </p>
      )}

      {/* Cards — both tabs render exactly three */}
      <div className={st.grid}>
        {visibleTiers.map((plan) => {
          const trialBrands = ({ starter: 1, consultant: 2, pro: 2, agency: 3 } as Record<string, number>)[plan.id]
          const trialCopy = TRIAL_COPY[locale] ?? TRIAL_COPY.en
          const p = priceDisplay(plan, annual, copy, locale, promoOn, bfLive)
          const bfCard = !!p.bfPill
          const c = copy.plans[plan.id]
          const seg = segment === "agency" ? c.agency : undefined
          const tagline = seg?.tagline ?? c.tagline
          const rawHighlights = seg?.highlights ?? c.highlights
          const restated = RESTATES_QUOTA[plan.id] ?? []
          const highlights = [
            ...rawHighlights.filter((_, i) => !restated.includes(i)),
            ...rawHighlights.filter((_, i) => restated.includes(i)),
          ]
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
              className={cn(st.plan, isFeatured ? cn(k.cardLime, st.featured) : k.card)}
            >
              {isFeatured && (
                <span className={cn(k.badge, st.popular)}>
                  {copy.badge.mostPopular}
                </span>
              )}

              {/* h2, not h3: PricingCards is rendered directly under the /pricing
                  <h1> with no intervening section heading, so an <h3> here was a
                  level skip (h1 → h3) on the page. The classes carry the visual
                  size, so this is a semantics-only change. */}
              <h2 className={st.planName}>{plan.name}</h2>

              {/* SG_BF2026_V2 (2026-11-18 benchmark: Proton, WP Rocket, Elementor, SE Ranking): the discount is quiet
                  (small grey strike + one soft pill), the price is loud in normal ink with small cents. */}
              {/* Row slots: every card renders the same 10 grid rows (empty when a row does not apply), so the
                  cards share one row structure via subgrid and prices, CTAs and quota lists line up. */}
              <div className={st.slotStrike}>
                {bfCard && p.strike && (
                  <div className={st.bfStrikeRow}>
                    <s className={st.bfStrike}>{p.strike}</s>
                    <span className={st.bfPill}>{p.bfPill}</span>
                  </div>
                )}
              </div>
              <div className={st.priceRow}>
                <span className={cn(st.big, bfCard && st.bigBf, plan.priceMonthly === null && st.bigWord)}>{bfCard ? <BfPrice value={p.big} /> : p.big}</span>
                {plan.priceMonthly !== null && plan.priceMonthly > 0 && (
                  <span className={st.per}>{copy.perMo}</span>
                )}
              </div>
              <div className={st.meta}>
                {!bfCard && p.strike && (annual || promoOn) && (
                  <s className={st.strike}>{p.strike}</s>
                )}
                {promoOn && plan.priceMonthly !== null && plan.priceMonthly > 0 && (
                  <span className={st.promoPill}>
                    {promoUi.pill}
                  </span>
                )}
                {p.sub && <span>{p.sub}</span>}
                {p.save && annual && (
                  <span className={st.saveChip}>
                    {p.save}
                  </span>
                )}
              </div>

              <div>
              {bfCard && annual && isBfRush() && (
                <p className={st.bonus}>
                  <span>
                    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="12" height="8" rx="1" /><path d="M1.5 6h13V4h-13zM8 4v10M8 4c-1-2.5-4-2.5-4-.8C4 4 6 4 8 4zm0 0c1-2.5 4-2.5 4-.8C12 4 10 4 8 4z" /></svg>
                    {BF_CARD_COPY[bfLocale(locale)].bonus}
                  </span>
                </p>
              )}
              </div>

              <p className={st.tagline}>{tagline}</p>

              <Link
                href={ctaHref}
                prefetch={false}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={cn(isFeatured ? k.btnLime : k.btnOutline, st.cta)}
              >
                {ctaLabel}
              </Link>
              <div className={st.slotTrial}>
              {hasTrial && copy.trialNote && (
                <p className={st.trialNote}>{copy.trialNote}</p>
              )}

              {hasTrial && <details className={st.trial}>
                <summary className={st.disclose}>{trialCopy.label} <span aria-hidden="true">+</span></summary>
                <p>{fill(trialCopy.body, { brands: String(trialBrands) })}</p>
              </details>}
              </div>

              {/* Quota block — same 4 rows, same order, every card */}
              <ul className={st.quotas}>
                {Object.values(c.quotas).map((q, i) => (
                  <li key={i}>
                    <CheckIcon />
                    <span className={i === 0 ? st.quotaLead : undefined}>{q}</span>
                  </li>
                ))}
              </ul>

              {/* Feature highlights */}
              <div className={st.features}>
                {inheritsFrom && (
                  <p className={st.inherits}>
                    {fill(copy.everythingIn, { plan: inheritsFrom })}
                  </p>
                )}
                <ul className={st.hlList}>
                  {highlights.slice(0, VISIBLE_HIGHLIGHTS).map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                {highlights.length > VISIBLE_HIGHLIGHTS && (
                  <details className={st.more}>
                    <summary className={st.disclose}>
                      {SHOW_ALL[locale] ?? SHOW_ALL.en} (+{highlights.length - VISIBLE_HIGHLIGHTS})
                      <span aria-hidden="true">+</span>
                    </summary>
                    <ul className={st.hlList}>
                      {highlights.slice(VISIBLE_HIGHLIGHTS).map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
