import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"

type Faq = { q: string; a: string }

export async function Playbook() {
  const t = await getTranslations("home.playbook")
  const locale = await getLocale()
  const faqs = t.raw("faqs") as Faq[]
  const guideHref =
    locale === "fr"
      ? "/fr/blog/generative-engine-optimization"
      : locale === "es"
        ? "/es/blog/que-es-geo"
        : "/blog/what-is-geo"

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
    <section className="border-b border-gray-200 bg-white px-5 py-[50px] sm:px-7 sm:py-[70px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-[1104px]">
        {/* Editorial header — asymmetric, matches marketing voice */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end lg:gap-[70px]">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-[32px] font-medium leading-[1.13] tracking-[-0.045em] text-gray-900 sm:text-[clamp(30px,3.5vw,46px)]">
              {t("h2")}
            </h2>
          </div>
          <p className="max-w-[540px] text-[15px] leading-[1.7] text-gray-600 sm:text-base">
            {t("intro")}
          </p>
        </div>

        {/* FAQ accordion — native <details>, no JS, progressive disclosure */}
        <div className="mt-7 divide-y divide-gray-200 sm:mt-11">
          {faqs.map((f, i) => (
            <details
              key={f.q}
              {...(i === 0 ? { open: true } : {})}
              className="group py-[17px]"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-6 list-none [&::-webkit-details-marker]:hidden">
                <span className="text-base font-medium tracking-tight text-gray-900">
                  {f.q}
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-accent-200 bg-white text-accent-700 transition-transform duration-200 group-open:rotate-45"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 2v10M2 7h10" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <div className="mt-3 max-w-3xl text-sm leading-[1.75] text-gray-600">
                {f.a}
              </div>
            </details>
          ))}
        </div>

        {/* Single outbound link for readers who want the full guide */}
        <div className="mt-6">
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
