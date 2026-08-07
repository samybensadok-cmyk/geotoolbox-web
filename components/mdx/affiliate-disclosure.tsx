import type { ReactNode } from "react"

/**
 * FTC affiliate disclosure box for monetized posts. Drop `<AffiliateDisclosure />`
 * at the top of an article, ABOVE the first affiliate link. Pass children to
 * override the default copy for a specific post.
 *
 * Registered in components/mdx/index.tsx so MDX can use it directly.
 *
 * The heading and default copy are localized here rather than in the MDX: the
 * disclosure is legal furniture, not article content, and a localized post
 * should not have to restate it. `getMdxComponents(locale)` binds the `locale`
 * prop. Note the heading sits OUTSIDE the children slot, so passing Spanish
 * children was never enough to localize this box — that was the actual defect
 * this map fixes.
 *
 * `/review-methodology` and `/affiliate-disclosure` are English-only marketing
 * pages (they live outside the next-intl locale matcher), so every locale links
 * to the same URLs. Localize the link targets here if those pages are ever
 * translated.
 */
const COPY = {
  en: {
    heading: "Affiliate disclosure.",
    aria: "Affiliate disclosure",
    body: (
      <>
        Some links below are affiliate links — if you buy through them, GEO Toolbox may earn a
        commission at no extra cost to you. We only recommend tools we&apos;ve actually tested, and
        a commission never changes our verdict. See our{" "}
        <a href="/review-methodology" className="text-accent-700 underline hover:text-accent-800">
          review methodology
        </a>{" "}
        and{" "}
        <a href="/affiliate-disclosure" className="text-accent-700 underline hover:text-accent-800">
          affiliate disclosure
        </a>
        .
      </>
    ),
  },
  es: {
    heading: "Aviso de afiliación.",
    aria: "Aviso de afiliación",
    body: (
      <>
        Algunos enlaces de este artículo son de afiliado: si contratas a través de ellos, GEO
        Toolbox puede llevarse una comisión sin que a ti te cueste nada más. Solo recomendamos
        herramientas que hemos probado de verdad, y la comisión nunca cambia el veredicto. Puedes
        consultar nuestra{" "}
        <a href="/review-methodology" className="text-accent-700 underline hover:text-accent-800">
          metodología de análisis
        </a>{" "}
        y nuestro{" "}
        <a href="/affiliate-disclosure" className="text-accent-700 underline hover:text-accent-800">
          aviso de afiliación
        </a>{" "}
        (ambas páginas están en inglés).
      </>
    ),
  },
  fr: {
    heading: "Transparence affiliation.",
    aria: "Transparence affiliation",
    body: (
      <>
        Certains liens de cet article sont des liens affiliés : si vous souscrivez via ces liens,
        GEO Toolbox peut toucher une commission, sans surcoût pour vous. Nous ne recommandons que
        des outils que nous avons réellement testés, et une commission ne change jamais notre
        verdict. Voir notre{" "}
        <a href="/review-methodology" className="text-accent-700 underline hover:text-accent-800">
          méthodologie de test
        </a>{" "}
        et notre{" "}
        <a href="/affiliate-disclosure" className="text-accent-700 underline hover:text-accent-800">
          politique d&apos;affiliation
        </a>{" "}
        (pages en anglais).
      </>
    ),
  },
} as const

export function AffiliateDisclosure({
  children,
  locale,
}: {
  children?: ReactNode
  /** Bound by getMdxComponents(locale); selects the disclosure language. */
  locale?: string
}) {
  const t = COPY[locale as keyof typeof COPY] ?? COPY.en
  return (
    <aside
      className="my-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] leading-relaxed text-gray-600"
      role="note"
      aria-label={t.aria}
    >
      <strong className="font-semibold text-gray-900">{t.heading}</strong> {children ?? t.body}
    </aside>
  )
}
