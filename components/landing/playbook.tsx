import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"

type Faq = { q: string; a: string }

export async function Playbook() {
  const t = await getTranslations("home.playbook")
  const locale = await getLocale()
  const faqs = t.raw("faqs") as Faq[]
  const guideHref = locale === "fr" ? "/fr/blog/generative-engine-optimization" : "/blog/what-is-geo"

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  }

  return (
    <section className="bg-accent-50/30 px-6 py-24 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-7xl">
        {/* Editorial header — asymmetric, matches marketing voice */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900">
              {t("h2")}
            </h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-gray-600">
            {t("intro")}
          </p>
        </div>

        {/* FAQ accordion — native <details>, no JS, progressive disclosure */}
        <div className="mt-16 divide-y divide-accent-100">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              {...(i === 0 ? { open: true } : {})}
              className="group py-6 md:py-7"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-6 list-none [&::-webkit-details-marker]:hidden">
                <span className="text-lg font-semibold tracking-tight text-gray-900 md:text-xl">
                  {f.q}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-200 bg-white/60 text-accent-700 transition-transform duration-200 group-open:rotate-45"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 2v10M2 7h10" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="mt-4 max-w-3xl text-[15px] leading-relaxed text-gray-600 md:text-base">
                {f.a}
              </div>
            </details>
          ))}
        </div>

        {/* Single outbound link for readers who want the full guide */}
        <div className="mt-12 border-t border-accent-100 pt-8">
          <Link
            href={guideHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 hover:text-accent-800"
          >
            {t("readGuide")}
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
