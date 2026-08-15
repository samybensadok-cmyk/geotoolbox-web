"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { PLANS } from "@/lib/plans"
import {
  PROMO,
  isPromoLive,
  promoDaysLeft,
  fmtPromoAmount,
  promoDeadlineLabel,
  promoPrice,
  rememberPromo,
  type PromoLocale,
} from "@/lib/promo"

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
  const pathname = usePathname()
  const loc: PromoLocale = locale === "fr" || locale === "es" ? locale : "en"
  const ui = UI[loc]

  const variants = useMemo(
    () =>
      buildVariants({
        en: promoDeadlineLabel("en"),
        fr: promoDeadlineLabel("fr"),
        es: promoDeadlineLabel("es"),
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
    if (!isDismissed) setVariant(pickVariant(variants))
  }, [variants])

  // One view event per page load where the banner is actually visible.
  const suppressed = pathname?.startsWith("/services") ?? false
  useEffect(() => {
    if (dismissed || !variant || suppressed) return
    trackEvent("promo_banner_view", { promo_variant: variant.id, promo_code: PROMO.code, locale: loc, page_path: pathname })
  }, [dismissed, variant, suppressed, loc, pathname])

  // Suppress the sitewide discount banner on service (money) pages — a
  // sitewide discount code above a $4,000 offer creates discount ambiguity.
  if (suppressed) return null
  if (dismissed || !variant) return null

  const t = variant.copy[loc]
  const pricingPath = loc === "en" ? "/pricing" : `/${loc}/pricing`
  const href = `${pricingPath}?promo=${PROMO.code}&bv=${variant.id}`
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
            {ui.code} {PROMO.code}
          </span>
          {daysLeft <= 14 && (
            <span className="rounded border border-white/30 px-1.5 py-0.5">{ui.daysLeft(daysLeft)}</span>
          )}
        </span>
        <a
          href={href}
          onClick={() => {
            rememberPromo(PROMO.code, variant.id)
            trackEvent("promo_banner_click", { promo_variant: variant.id, promo_code: PROMO.code, locale: loc, page_path: pathname })
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
            trackEvent("promo_banner_dismiss", { promo_variant: variant.id, promo_code: PROMO.code, locale: loc, page_path: pathname })
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
