"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { PLANS } from "@/lib/plans"
import {
  PROMO,
  fmtPromoAmount,
  formatCountdown,
  getReservation,
  isPromoLive,
  promoDaysLeft,
  promoDeadlineLabel,
  promoPrice,
  rememberPromo,
  reservePromo,
  type PromoLocale,
  type Reservation,
} from "@/lib/promo"
import { useCountdown } from "@/components/promo/use-countdown"

/**
 * SG_PROMO_V2 (2026-08-15) — founding-offer banner, variant-tested.
 *
 * Diagnosis that led here: the v1 banner ("30% off … use code FOUNDING30 at
 * checkout") ran 2026-07-29 → 08-15 with ZERO redemptions of 20, and the one
 * real trial signup in that window paid full price — the offer vanished the
 * moment they clicked (no promo on /pricing, no promo on signup, code buried
 * behind Stripe's collapsed "Add promotion code" link). So v2 changes three
 * things at once, and only the COPY is what varies between variants:
 *   1. Offer continuity — the CTA carries ?promo=FOUNDING30&bv=<variant> to
 *      /pricing (cards show the slashed price) → signup (chip shows it) →
 *      checkout (backend pre-applies the promotion code).
 *   2. Honest urgency — a real Stripe expires_at (PROMO.deadline) and the real
 *      20-seat cap. The banner hides itself after the deadline.
 *   3. Instrumentation — view/click/dismiss events stamped with the variant,
 *      and the variant rides into checkout metadata so revenue is attributable.
 *
 * Variant framework = Hormozi's value equation (dream outcome × likelihood ÷
 * time × effort) + scarcity/urgency that is TRUE:
 *   price   — state the number, not the percent ("$139/mo instead of $199").
 *   outcome — lead with the dream outcome, discount second.
 *   cohort  — reason-why scarcity ("20 founding customers, in exchange for
 *             blunt feedback") + risk reversal ($0 today).
 *   reserve — per-visitor 48-h seat reservation with a LIVE countdown to a real
 *             Stripe expiry (SG_PROMO_RESERVE_V1). Never re-minted after expiry;
 *             falls back to the `price` copy if the backend refuses (rate limit,
 *             sold out, closed) — logged with reserved:false.
 *
 * SG_PROMO_RESERVE_V2 (2026-09-03) — MINT ON INTENT, NOT ON VIEW.
 * v1 minted from a `useEffect` the moment the `reserve` variant was drawn, so a
 * page view was enough to create a real Stripe promotion code. On 2026-09-03 a
 * datacenter bot pool (Alibaba Cloud SG AS45102 + Huawei Cloud SG AS136907, ~1
 * request per IP to stay under the 3/h 5/day per-IP limit) rendered the site at
 * scale and saturated the campaign's 300-per-rolling-24h global mint cap by
 * 11:27 UTC — genuine visitors then got {error:"capacity"} and silently fell
 * back to the sitewide offer. 2,320 codes had been minted since 08-15 against a
 * Stripe coupon `times_redeemed` of 1. See INCIDENT-SG-BOT-WAVE-2026-09-03.md.
 * Now: mount only READS an existing reservation from localStorage (no network),
 * and the mint happens in the CTA click handler. A visitor who never clicks
 * never mints, so the cap once again measures interested humans. First-time
 * visitors therefore see the `price` fallback copy (no countdown claim we have
 * not yet backed with a real Stripe expiry); the countdown appears from the
 * next page view on, and /pricing already renders the personal code via
 * getReservation() in components/pricing/pricing-cards.tsx.
 *   bonus   — INACTIVE: adds a founder onboarding call. Needs operator sign-off
 *             because it commits operator time; flip `active` to test it.
 *
 * Assignment is sticky per visitor (localStorage) among ACTIVE variants. To
 * run a sequential test instead of a split, leave exactly one variant active.
 */

type VariantCopy = {
  /** Short bold lead-in, e.g. "Founding rate". */
  lead: string
  /** One sentence. Keep it under ~110 characters on desktop. */
  body: string
  cta: string
}

type Variant = {
  id: string
  active: boolean
  copy: Record<PromoLocale, VariantCopy>
}

// Anchor tier for the "state the number" variant — read from lib/plans.ts so
// a reprice can't leave the banner quoting a stale price.
const PLUS_FULL = PLANS.find((p) => p.id === "consultant")?.priceMonthly ?? 199
const PLUS_PROMO = promoPrice(PLUS_FULL) // 139.3 at $199 — shown to the cent, as charged

function buildVariants(deadline: Record<PromoLocale, string>): Variant[] {
  return [
    {
      id: "price",
      active: true,
      copy: {
        en: {
          lead: "Founding rate",
          body: `The Plus plan for $${fmtPromoAmount(PLUS_PROMO, "en")}/mo instead of $${PLUS_FULL} — ${PROMO.percentOff}% off for ${PROMO.months} months. ${PROMO.seats} seats, ends ${deadline.en}.`,
          cta: "Claim founding rate",
        },
        fr: {
          lead: "Tarif fondateurs",
          body: `La formule Plus à ${fmtPromoAmount(PLUS_PROMO, "fr")} €/mois au lieu de ${PLUS_FULL} € — −${PROMO.percentOff} % pendant ${PROMO.months} mois. ${PROMO.seats} places, jusqu’au ${deadline.fr}.`,
          cta: "Profiter du tarif",
        },
        es: {
          lead: "Tarifa fundadores",
          body: `El plan Plus por $${fmtPromoAmount(PLUS_PROMO, "es")}/mes en lugar de $${PLUS_FULL} — ${PROMO.percentOff} % de descuento durante ${PROMO.months} meses. ${PROMO.seats} plazas, hasta el ${deadline.es}.`,
          cta: "Conseguir la tarifa",
        },
        de: {
          lead: "Gründerpreis",
          body: `Der Plus-Tarif für ${fmtPromoAmount(PLUS_PROMO, "de")} €/Monat statt ${PLUS_FULL} € — ${PROMO.percentOff} % Rabatt für ${PROMO.months} Monate. Nur ${PROMO.seats} Plätze, bis ${deadline.de}.`,
          cta: "Gründerpreis sichern",
        },
        nl: {
          lead: "Oprichtersprijs",
          body: `Het Plus-abonnement voor € ${fmtPromoAmount(PLUS_PROMO, "nl")}/maand in plaats van € ${PLUS_FULL} — ${PROMO.percentOff}% korting gedurende ${PROMO.months} maanden. Nog ${PROMO.seats} plekken, tot ${deadline.nl}.`,
          cta: "Oprichtersprijs vastzetten",
        },
      },
    },
    {
      id: "outcome",
      active: true,
      copy: {
        en: {
          lead: "Which AI engines cite you?",
          body: `See where ChatGPT, Perplexity, Gemini & co. cite you — and your competitors. Founding rate −${PROMO.percentOff}% for ${PROMO.months} months, until ${deadline.en}.`,
          cta: "Check my AI visibility",
        },
        fr: {
          lead: "Quelles IA vous citent ?",
          body: `Voyez où ChatGPT, Perplexity, Gemini & co vous citent — et vos concurrents. −${PROMO.percentOff} % pendant ${PROMO.months} mois, jusqu’au ${deadline.fr}.`,
          cta: "Voir ma visibilité IA",
        },
        es: {
          lead: "¿Qué IA te citan?",
          body: `Mira dónde te citan ChatGPT, Perplexity, Gemini y cía. — y a tus competidores. −${PROMO.percentOff} % durante ${PROMO.months} meses, hasta el ${deadline.es}.`,
          cta: "Ver mi visibilidad IA",
        },
        de: {
          lead: "Welche KI zitiert dich?",
          body: `Sieh nach, wo ChatGPT, Perplexity, Gemini & Co. dich zitieren — und deine Wettbewerber. Gründerpreis: ${PROMO.percentOff} % Rabatt für ${PROMO.months} Monate, bis ${deadline.de}.`,
          cta: "KI-Sichtbarkeit prüfen",
        },
        nl: {
          lead: "Welke AI citeert jou?",
          body: `Kijk waar ChatGPT, Perplexity, Gemini en co. jou citeren — en je concurrenten. Oprichtersprijs: ${PROMO.percentOff}% korting gedurende ${PROMO.months} maanden, tot ${deadline.nl}.`,
          cta: "AI-zichtbaarheid checken",
        },
      },
    },
    {
      id: "cohort",
      active: true,
      copy: {
        en: {
          lead: `${PROMO.seats} founding seats`,
          body: `${PROMO.percentOff}% off for a year for the first ${PROMO.seats} customers who give us blunt feedback. $0 today on trial plans. Closes ${deadline.en}.`,
          cta: "Take a founding seat",
        },
        fr: {
          lead: `${PROMO.seats} places fondateurs`,
          body: `−${PROMO.percentOff} % pendant un an pour les ${PROMO.seats} premiers clients qui nous font des retours sans filtre. 0 € aujourd’hui avec l’essai. Clôture le ${deadline.fr}.`,
          cta: "Réserver ma place",
        },
        es: {
          lead: `${PROMO.seats} plazas fundadoras`,
          body: `${PROMO.percentOff} % menos durante un año para los primeros ${PROMO.seats} clientes que nos den feedback sin filtros. $0 hoy en planes con prueba. Cierra el ${deadline.es}.`,
          cta: "Reservar plaza fundadora",
        },
        de: {
          lead: `${PROMO.seats} Gründerplätze`,
          body: `${PROMO.percentOff} % Rabatt für ein Jahr — für die ersten ${PROMO.seats} Kunden, die uns ehrliches Feedback geben. Heute 0 € dank Testphase. Endet am ${deadline.de}.`,
          cta: "Gründerplatz sichern",
        },
        nl: {
          lead: `${PROMO.seats} oprichtersplekken`,
          body: `${PROMO.percentOff}% korting voor een jaar — voor de eerste ${PROMO.seats} klanten die ons eerlijke feedback geven. Vandaag € 0 dankzij de proefperiode. Loopt af op ${deadline.nl}.`,
          cta: "Oprichtersplek reserveren",
        },
      },
    },
    {
      // {cd} is replaced with the live hh:mm:ss countdown at render time.
      id: "reserve",
      active: true,
      copy: {
        en: {
          lead: "Founding seat reserved for you",
          body: `${PROMO.percentOff}% off for ${PROMO.months} months — your reservation expires in {cd}, then the seat goes back to the pool.`,
          cta: "Claim my reserved seat",
        },
        fr: {
          lead: "Place fondateur réservée pour vous",
          body: `−${PROMO.percentOff} % pendant ${PROMO.months} mois — votre réservation expire dans {cd}, puis la place retourne au pool.`,
          cta: "Prendre ma place réservée",
        },
        es: {
          lead: "Plaza fundadora reservada para ti",
          body: `${PROMO.percentOff} % de descuento durante ${PROMO.months} meses — tu reserva caduca en {cd}, luego la plaza vuelve al cupo.`,
          cta: "Reclamar mi plaza",
        },
        de: {
          lead: "Gründerplatz für dich reserviert",
          body: `${PROMO.percentOff} % Rabatt für ${PROMO.months} Monate — deine Reservierung läuft in {cd} ab, danach geht der Platz zurück in den Pool.`,
          cta: "Reservierten Platz sichern",
        },
        nl: {
          lead: "Oprichtersplek voor je gereserveerd",
          body: `${PROMO.percentOff}% korting gedurende ${PROMO.months} maanden — je reservering verloopt over {cd}, daarna gaat de plek terug in de pool.`,
          cta: "Gereserveerde plek vastzetten",
        },
      },
    },
    {
      // Hormozi: a bonus beats a discount — but this one costs operator time
      // (up to 20 × 30 min). Inactive until approved. Copy is ready.
      id: "bonus",
      active: false,
      copy: {
        en: {
          lead: "Founding offer",
          body: `${PROMO.percentOff}% off for ${PROMO.months} months + a 30-min onboarding call with the founder. ${PROMO.seats} seats, ends ${deadline.en}.`,
          cta: "Claim my seat",
        },
        fr: {
          lead: "Offre fondateurs",
          body: `−${PROMO.percentOff} % pendant ${PROMO.months} mois + un appel d’onboarding de 30 min avec le fondateur. ${PROMO.seats} places, jusqu’au ${deadline.fr}.`,
          cta: "Réserver ma place",
        },
        es: {
          lead: "Oferta fundadores",
          body: `${PROMO.percentOff} % de descuento durante ${PROMO.months} meses + una llamada de onboarding de 30 min con el fundador. ${PROMO.seats} plazas, hasta el ${deadline.es}.`,
          cta: "Reservar mi plaza",
        },
        de: {
          lead: "Gründerangebot",
          body: `${PROMO.percentOff} % Rabatt für ${PROMO.months} Monate + ein 30-minütiges Onboarding-Gespräch mit dem Gründer. ${PROMO.seats} Plätze, bis ${deadline.de}.`,
          cta: "Platz sichern",
        },
        nl: {
          lead: "Oprichtersaanbod",
          body: `${PROMO.percentOff}% korting gedurende ${PROMO.months} maanden + een onboardinggesprek van 30 minuten met de oprichter. ${PROMO.seats} plekken, tot ${deadline.nl}.`,
          cta: "Plek reserveren",
        },
      },
    },
  ]
}

const DISMISS_KEY = `promoBannerDismissed:${PROMO.code}:v2`
const VARIANT_KEY = `promoBannerVariant:${PROMO.code}:v2`
const UI = {
  en: { dismiss: "Dismiss", code: "Code", daysLeft: (n: number) => (n === 1 ? "1 day left" : `${n} days left`) },
  fr: { dismiss: "Fermer", code: "Code", daysLeft: (n: number) => (n === 1 ? "1 jour restant" : `${n} jours restants`) },
  es: { dismiss: "Cerrar", code: "Código", daysLeft: (n: number) => (n === 1 ? "queda 1 día" : `quedan ${n} días`) },
  de: { dismiss: "Schließen", code: "Code", daysLeft: (n: number) => (n === 1 ? "noch 1 Tag" : `noch ${n} Tage`) },
  nl: { dismiss: "Sluiten", code: "Code", daysLeft: (n: number) => (n === 1 ? "nog 1 dag" : `nog ${n} dagen`) },
} as const

function pickVariant(variants: Variant[]): Variant {
  const active = variants.filter((v) => v.active)
  const pool = active.length ? active : variants.slice(0, 1)
  try {
    const stored = localStorage.getItem(VARIANT_KEY)
    const hit = pool.find((v) => v.id === stored)
    if (hit) return hit
    const chosen = pool[Math.floor(Math.random() * pool.length)]
    localStorage.setItem(VARIANT_KEY, chosen.id)
    return chosen
  } catch {
    return pool[0]
  }
}

export function PromoBanner({ locale = "en" }: { locale?: string }) {
  const [dismissed, setDismissed] = useState(true)
  const [variant, setVariant] = useState<Variant | null>(null)
  // SG_PROMO_RESERVE_V1: null = not read yet / not this variant; false = none held.
  const [reservation, setReservation] = useState<Reservation | null | false>(null)
  // SG_PROMO_RESERVE_V2: a mint is in flight from the CTA click.
  const [minting, setMinting] = useState(false)
  const pathname = usePathname()
  const loc: PromoLocale =
    locale === "fr" || locale === "es" || locale === "de" || locale === "nl" ? locale : "en"
  const ui = UI[loc]

  const variants = useMemo(
    () =>
      buildVariants({
        en: promoDeadlineLabel("en"),
        fr: promoDeadlineLabel("fr"),
        es: promoDeadlineLabel("es"),
        de: promoDeadlineLabel("de"),
        nl: promoDeadlineLabel("nl"),
      }),
    []
  )

  useEffect(() => {
    // Old campaign keys — clear so a visitor who dismissed v1 sees v2 once.
    try {
      localStorage.removeItem("promoBannerDismissed:LAUNCH20")
      localStorage.removeItem("promoBannerDismissed:FOUNDING30")
    } catch {
      /* ignore */
    }
    if (!isPromoLive()) return
    let isDismissed = false
    try {
      isDismissed = localStorage.getItem(DISMISS_KEY) === "1"
    } catch {
      /* ignore */
    }
    setDismissed(isDismissed)
    if (!isDismissed) {
      const chosen = pickVariant(variants)
      setVariant(chosen)
      // SG_PROMO_RESERVE_V2: read-only. Surfaces a reservation this visitor
      // already minted on an earlier click; never creates one. Pure
      // localStorage, no fetch — a crawler that renders the page costs nothing.
      if (chosen.id === "reserve") setReservation(getReservation() ?? false)
    }
  }, [variants])
  const msLeft = useCountdown(reservation ? reservation.expiresAt : null)
  const reservationLive = !!reservation && msLeft !== null && msLeft > 0

  // One view event per page load where the banner is actually visible. For the
  // reserve variant, wait until we know whether a reservation exists so the
  // event carries `reserved` (the fallback copy is a different treatment).
  const suppressed = pathname?.startsWith("/services") ?? false
  const reserveSettled = variant?.id !== "reserve" || reservation !== null
  useEffect(() => {
    if (dismissed || !variant || suppressed || !reserveSettled) return
    trackEvent("promo_banner_view", {
      promo_variant: variant.id,
      promo_code: reservation ? reservation.code : PROMO.code,
      reserved: variant.id === "reserve" ? !!reservation : undefined,
      locale: loc,
      page_path: pathname,
    })
  }, [dismissed, variant, suppressed, reserveSettled, reservation, loc, pathname])

  // Suppress the sitewide discount banner on service (money) pages — a
  // sitewide discount code above a $4,000 offer creates discount ambiguity.
  if (suppressed) return null
  if (dismissed || !variant) return null
  // Reserve variant: nothing to show until the mint resolves (avoids a flash of
  // fallback copy that then swaps to a countdown).
  if (variant.id === "reserve" && reservation === null) return null

  // Reserve variant without a live reservation (refused, or expired on a later
  // visit) shows the standard `price` copy — honest fallback, still measured
  // under promo_variant=reserve with reserved:false.
  const isReserve = variant.id === "reserve" && reservationLive && reservation
  const copyVariant = isReserve ? variant : variant.id === "reserve" ? variants.find((v) => v.id === "price") ?? variant : variant
  const cd = isReserve && msLeft !== null ? formatCountdown(msLeft) : ""
  const t = {
    lead: copyVariant.copy[loc].lead,
    body: copyVariant.copy[loc].body.replace("{cd}", cd),
    cta: copyVariant.copy[loc].cta,
  }
  const activeCode = isReserve && reservation ? reservation.code : PROMO.code
  const pricingPath = loc === "en" ? "/pricing" : `/${loc}/pricing`
  // SG_PROMO_RESERVE_V2: reserve variant, no live reservation held → the click
  // is what mints one. `href` stays the sitewide-code URL so the link is valid
  // for middle-click, "open in new tab", and JS-off; the handler upgrades it.
  const mintsOnClick = variant.id === "reserve" && !isReserve
  const href = `${pricingPath}?promo=${activeCode}&bv=${variant.id}`
  const daysLeft = promoDaysLeft()

  return (
    <div
      role="region"
      aria-label={t.lead}
      className="bg-accent-700 px-3 py-2 text-white sm:px-4"
      data-promo-variant={variant.id}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-[13px] leading-snug sm:text-sm">
        <p className="min-w-0">
          <strong className="font-semibold">{t.lead}{/[?!]$/.test(t.lead) ? "" : ":"}</strong> {t.body}
        </p>
        <span className="hidden items-center gap-1.5 whitespace-nowrap font-mono text-[11px] text-white/85 xl:inline-flex">
          <span className="rounded border border-white/30 px-1.5 py-0.5">
            {ui.code} {activeCode}
          </span>
          {!isReserve && daysLeft <= 14 && (
            <span className="rounded border border-white/30 px-1.5 py-0.5">{ui.daysLeft(daysLeft)}</span>
          )}
        </span>
        <a
          href={href}
          aria-busy={minting || undefined}
          onClick={(e) => {
            trackEvent("promo_banner_click", { promo_variant: variant.id, promo_code: activeCode, reserved: isReserve ? true : variant.id === "reserve" ? false : undefined, mint_on_click: mintsOnClick || undefined, locale: loc, page_path: pathname })
            // SG_PROMO_RESERVE_V2: the reserve variant mints HERE, on a real
            // click, and only then navigates. reservePromo() returns any code
            // this visitor already holds and null once it is spent or refused —
            // either way we fall through to the sitewide code, never blocking
            // the visitor on a backend that says no.
            // A modifier- or non-primary click is opening this somewhere else —
            // let the browser have the href (the sitewide code, always valid)
            // rather than preventDefault-ing it into the current tab. Middle
            // click never reaches here; it fires auxclick.
            const opensElsewhere = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0
            if (!mintsOnClick || opensElsewhere) {
              rememberPromo(activeCode, variant.id)
              return
            }
            e.preventDefault()
            if (minting) return
            setMinting(true)
            reservePromo(variant.id)
              .then((r) => {
                const code = r?.code ?? PROMO.code
                rememberPromo(code, variant.id)
                window.location.assign(`${pricingPath}?promo=${code}&bv=${variant.id}`)
              })
              .catch(() => {
                rememberPromo(PROMO.code, variant.id)
                window.location.assign(`${pricingPath}?promo=${PROMO.code}&bv=${variant.id}`)
              })
          }}
          className="inline-flex shrink-0 items-center rounded-full bg-white px-3.5 py-1 text-[13px] font-semibold text-accent-800 shadow-sm transition-colors hover:bg-accent-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {t.cta} →
        </a>
        <button
          type="button"
          aria-label={ui.dismiss}
          onClick={() => {
            try {
              localStorage.setItem(DISMISS_KEY, "1")
            } catch {
              /* ignore */
            }
            trackEvent("promo_banner_dismiss", { promo_variant: variant.id, promo_code: activeCode, locale: loc, page_path: pathname })
            setDismissed(true)
          }}
          className="shrink-0 rounded px-1 text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
