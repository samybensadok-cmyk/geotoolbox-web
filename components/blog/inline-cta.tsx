import Link from "next/link"
import type { InlineCtaTarget } from "@/lib/inline-cta"

type Variant = { text: string; button: string; href: string }

const variants: Record<string, Record<InlineCtaTarget, Variant>> = {
  en: {
    "ai-readiness": {
      text: "Curious how your own site stacks up? Run the free AI-Readiness check — five live checks on your domain, no signup.",
      button: "Check your site free",
      href: "/tools/ai-readiness",
    },
    "content-analyzer": {
      text: "Want this analysis for your own pages? Content Analyzer grades any URL A–F across 21 AI-citability signals.",
      button: "Grade a page",
      href: "/features/content-analyzer",
    },
    signup: {
      text: "Comparing tools? See it on your own domain first — one scan across all eight engines, 7-day free trial.",
      button: "Start free trial",
      href: "/app/?page=signup&interval=monthly",
    },
  },
  fr: {
    "ai-readiness": {
      text: "Envie de savoir ce que vaut votre site ? Lancez le score de préparation IA gratuit : cinq vérifications en direct sur votre domaine, sans inscription.",
      button: "Tester mon site gratuitement",
      href: "/tools/ai-readiness",
    },
    "content-analyzer": {
      text: "Vous voulez cette analyse pour vos propres pages ? L’Analyseur de contenu note chaque URL de A à F sur 21 signaux de citabilité IA.",
      button: "Évaluer une page",
      href: "/features/content-analyzer",
    },
    signup: {
      text: "Vous comparez les outils ? Voyez d’abord le vôtre à l’œuvre : un scan sur les huit moteurs, 7 jours d’essai gratuit.",
      button: "Démarrer l’essai gratuit",
      href: "/app/?page=signup&interval=monthly",
    },
  },
  es: {
    "ai-readiness": {
      text: "¿Quieres saber cómo se posiciona tu propio sitio? Ejecuta el análisis de preparación IA gratis: cinco comprobaciones en vivo sobre tu dominio, sin registro.",
      button: "Analiza tu sitio gratis",
      href: "/tools/ai-readiness",
    },
    "content-analyzer": {
      text: "¿Quieres este mismo análisis para tus propias páginas? El Analizador de contenido califica cualquier URL de A a F en 21 señales de citabilidad IA.",
      button: "Evaluar una página",
      href: "/features/content-analyzer",
    },
    signup: {
      text: "¿Estás comparando herramientas? Compruébalo primero en tu propio dominio: un escaneo en los ocho motores, 7 días de prueba gratis.",
      button: "Empezar prueba gratis",
      href: "/app/?page=signup&interval=monthly",
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
}: {
  target?: InlineCtaTarget
  locale?: string
}) {
  const table = variants[locale] ?? variants.en
  const v = table[target] ?? table["ai-readiness"]
  return (
    <aside className="not-prose my-10 flex flex-col items-start gap-4 rounded-2xl border border-[var(--surface-mint-border)] bg-[var(--surface-mint)] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="text-[14.5px] leading-relaxed text-gray-800">{v.text}</p>
      <Link
        href={v.href}
        prefetch={false}
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
