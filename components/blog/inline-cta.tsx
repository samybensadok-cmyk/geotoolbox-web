"use client"

import Link from "next/link"
import type { InlineCtaTarget } from "@/lib/inline-cta"
import { trackEvent } from "@/lib/analytics"
import { promoQuery, resolveOfferFromLocation } from "@/lib/promo"

type Variant = { text: string; button: string; href: string }

/**
 * SG_BLOG_CTA_V2 (2026-09-01) — every target is now a destination that DOES
 * something on the reader's own domain.
 *
 * What changed and why: until today the two non-commercial targets were
 * `ai-readiness` (a real free tool) and `content-analyzer`, which pointed at
 * `/features/content-analyzer` — a brochure page with no form, no input and no
 * fetch, whose own single CTA is `/app`. `content-analyzer` was served on 143
 * of the 260 published articles, so 55% of the corpus asked the reader to
 * click through to a page that does nothing. That target is gone; the routing
 * table in lib/inline-cta.ts now picks the free tool that matches what the
 * article is about.
 *
 * ⚠️ Hrefs are UNPREFIXED in every locale. The free tools live under
 * app/(marketing)/tools, outside the next-intl `[locale]` tree — verified live
 * 2026-09-01 that `/fr/tools/ai-readiness` returns 404 while `/tools/...` is
 * 200. `/app/*` is a rewrite to the Replit backend and has no locale segment
 * either.
 *
 * ⚠️ Attribution is `?ref=`, never `utm_*`. `/tools/*` is the same site on the
 * same GA4 property, and a `utm_source` on an internal link makes GA4 start a
 * new session attributed to "blog", overwriting the visitor's real acquisition
 * source. The countable signal is the `blog_cta_click` GA4 event below (which
 * only fires once the visitor has accepted the consent banner, since that is
 * what mounts gtag); `ref` is a human-readable breadcrumb in `page_location`.
 * Never `sg_checkout`/`sg_billing` — js/auth.js:192-204 fires a checkout resume
 * on any page carrying those.
 */

const REF = "ref=blog-inline"
const SIGNUP_BASE = "/app/?page=signup&interval=monthly"

// The sitewide banner advertises 30% off on these pages. A reader who saw it but did not click
// it used to reach checkout at list price — the read-30%-get-list mismatch that was fixed on
// /pricing, re-created on the highest-traffic surface. Same precedence /pricing uses, same
// isPromoLive() gate, so it self-expires. FR passes the checkout currency explicitly rather than
// letting js/auth.js fall through to navigator.language (SG_EUR_CHECKOUT_V1).
let cacheKey: string | null = null
let cacheVal = ""
function offerSuffix(): string {
  const key = typeof window === "undefined" ? "" : window.location.search
  if (cacheKey !== key) {
    cacheKey = key
    cacheVal = promoQuery(resolveOfferFromLocation())
  }
  return cacheVal
}
function signupHref(locale: string): string {
  return `${SIGNUP_BASE}${locale === "fr" ? "&currency=eur" : ""}&${REF}${offerSuffix()}`
}

const variants: Record<string, Record<InlineCtaTarget, Variant>> = {
  en: {
    signup: {
      text: "Comparing tools? See it on your own domain first — one scan across up to 8 AI engines, 7-day free trial.",
      button: "Start free trial",
      href: SIGNUP_BASE,   // replaced per-render by signupHref(locale) — see InlineCta below
    },
    "ai-readiness": {
      text: "Curious how your own site stacks up? Run the free AI-Readiness check — five live checks on your domain, no signup.",
      button: "Check your site free",
      href: `/tools/ai-readiness?${REF}`,
    },
    "ai-crawler-checker": {
      text: "Which AI crawlers does your robots.txt let in? Check it against every major AI bot — free, no signup.",
      button: "Check your crawlers",
      href: `/tools/ai-crawler-checker?${REF}`,
    },
    "llms-txt-checker": {
      text: "Does your own llms.txt validate? Check it against the spec in seconds — free, no signup.",
      button: "Check your llms.txt",
      href: `/tools/llms-txt-checker?${REF}`,
    },
    "query-fanout": {
      text: "See the real sub-queries an AI engine fires for your topic — free and in your browser, using your own Gemini key.",
      button: "Run a fan-out",
      href: `/tools/query-fanout?${REF}`,
    },
    "keyword-to-prompts": {
      text: "Turn one keyword into ~15 conversational prompts across six intents, with the brand-surfacing ones flagged — free, no signup.",
      button: "Turn a keyword into prompts",
      href: `/tools/keyword-to-prompts?${REF}`,
    },
  },
  fr: {
    signup: {
      text: "Vous comparez les outils ? Voyez d’abord le vôtre à l’œuvre : un scan sur jusqu’à 8 moteurs d’IA, 7 jours d’essai gratuit.",
      button: "Démarrer l’essai gratuit",
      href: SIGNUP_BASE,   // replaced per-render by signupHref(locale) — see InlineCta below
    },
    "ai-readiness": {
      text: "Envie de savoir ce que vaut votre site ? Lancez le score de préparation IA gratuit : cinq vérifications en direct sur votre domaine, sans inscription.",
      button: "Tester mon site gratuitement",
      href: `/tools/ai-readiness?${REF}`,
    },
    "ai-crawler-checker": {
      text: "Quels robots d’IA votre robots.txt laisse-t-il passer ? Confrontez-le à tous les grands crawlers IA — gratuit, sans inscription.",
      button: "Vérifier mes crawlers",
      href: `/tools/ai-crawler-checker?${REF}`,
    },
    "llms-txt-checker": {
      text: "Votre llms.txt est-il valide ? Vérifiez-le face à la spécification en quelques secondes — gratuit, sans inscription.",
      button: "Vérifier mon llms.txt",
      href: `/tools/llms-txt-checker?${REF}`,
    },
    "query-fanout": {
      text: "Découvrez les vraies sous-requêtes qu’un moteur d’IA lance sur votre sujet — gratuit, dans votre navigateur, avec votre propre clé Gemini.",
      button: "Lancer un fan-out",
      href: `/tools/query-fanout?${REF}`,
    },
    "keyword-to-prompts": {
      text: "Transformez un mot-clé en ~15 prompts conversationnels répartis sur six intentions, ceux qui font apparaître les marques étant signalés — gratuit, sans inscription.",
      button: "Convertir un mot-clé",
      href: `/tools/keyword-to-prompts?${REF}`,
    },
  },
  es: {
    signup: {
      text: "¿Estás comparando herramientas? Compruébalo primero en tu propio dominio: un escaneo en hasta 8 motores de IA, 7 días de prueba gratis.",
      button: "Empezar prueba gratis",
      href: SIGNUP_BASE,   // replaced per-render by signupHref(locale) — see InlineCta below
    },
    "ai-readiness": {
      text: "¿Quieres saber cómo se posiciona tu propio sitio? Ejecuta el análisis de preparación IA gratis: cinco comprobaciones en vivo sobre tu dominio, sin registro.",
      button: "Analiza tu sitio gratis",
      href: `/tools/ai-readiness?${REF}`,
    },
    "ai-crawler-checker": {
      text: "¿Qué rastreadores de IA deja pasar tu robots.txt? Contrástalo con todos los bots de IA importantes: gratis y sin registro.",
      button: "Revisar mis rastreadores",
      href: `/tools/ai-crawler-checker?${REF}`,
    },
    "llms-txt-checker": {
      text: "¿Tu llms.txt es válido? Compruébalo contra la especificación en segundos: gratis y sin registro.",
      button: "Revisar mi llms.txt",
      href: `/tools/llms-txt-checker?${REF}`,
    },
    "query-fanout": {
      text: "Descubre las subconsultas reales que lanza un motor de IA sobre tu tema: gratis, en tu navegador y con tu propia clave de Gemini.",
      button: "Lanzar un fan-out",
      href: `/tools/query-fanout?${REF}`,
    },
    "keyword-to-prompts": {
      text: "Convierte una palabra clave en ~15 prompts conversacionales repartidos en seis intenciones, con los que sacan marcas señalados: gratis y sin registro.",
      button: "Convertir una palabra clave",
      href: `/tools/keyword-to-prompts?${REF}`,
    },
  },
}

/**
 * Compact mid-article product band, injected at ~2/3 body depth by
 * lib/inline-cta.ts. One sentence + one button — deliberately lighter than
 * the page-closing "What's next" block so it doesn't compete with it.
 */
export function InlineCta({
  target = "ai-readiness",
  locale = "en",
  slug,
}: {
  target?: InlineCtaTarget
  locale?: string
  slug?: string
}) {
  const table = variants[locale] ?? variants.en
  const raw = table[target] ?? table["ai-readiness"]
  // The signup href is locale- and offer-dependent, so it is built at render time rather than
  // baked into the static variant table.
  const v = target === "signup" ? { ...raw, href: signupHref(locale) } : raw
  return (
    <aside className="not-prose my-10 flex flex-col items-start gap-4 rounded-2xl border border-[var(--surface-mint-border)] bg-[var(--surface-mint)] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="text-[14.5px] leading-relaxed text-gray-800">{v.text}</p>
      <Link
        href={v.href}
        prefetch={false}
        onClick={() => trackEvent("blog_cta_click", { placement: "inline", cta_target: target, article: slug ?? "", locale })}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-900 px-5 py-2.5 text-[13.5px] font-semibold text-white no-underline transition-all duration-200 hover:bg-accent-800 hover:shadow-lg hover:shadow-accent-900/20 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
      >
        {v.button}
        <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </aside>
  )
}
