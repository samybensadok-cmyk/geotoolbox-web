import type { Metadata } from "next"
import Link from "next/link"
import { getAllGlossaryTerms, getGlossaryCategories } from "@/lib/content"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbsSchema } from "@/lib/seo-schema"
import { setRequestLocale } from "next-intl/server"
import { localePath } from "@/lib/i18n/paths"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const basePath = locale === "en" ? "" : `/${locale}`
  return {
    title: "GEO Glossary",
    description:
      "Plain-English definitions of generative engine optimization (GEO), AI search, and AI crawler terms. Short answers that link to the full guides.",
    alternates: { canonical: `${siteConfig.url}${basePath}/glossary` },
  }
}

export default async function GlossaryIndex({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const basePath = locale === "en" ? "" : `/${locale}`
  const terms = getAllGlossaryTerms(locale)
  const categories = getGlossaryCategories(locale)

  return (
    <>
      <section className="bg-[var(--surface-warm)] px-6 pt-20 pb-12 sm:pt-28">
        <JsonLd
          data={[
            breadcrumbsSchema([
              { name: "Home", url: "/" },
              { name: "Glossary", url: "/glossary" },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "DefinedTermSet",
              name: `${siteConfig.name} Glossary`,
              url: `${siteConfig.url}${basePath}/glossary`,
              description:
                "Definitions of generative engine optimization, AI search, and AI crawler terms.",
              hasDefinedTerm: terms.map((t) => ({
                "@type": "DefinedTerm",
                name: t.term,
                description: t.definition,
                url: `${siteConfig.url}${basePath}/glossary/${t.slug}`,
              })),
            },
          ]}
        />
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[6fr_6fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                Reference
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                GEO Glossary.
              </h1>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Short, plain-English definitions of the terms behind generative engine
              optimization and AI search. Each one links to the full guide.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface-warm)] px-6 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl">
          {terms.length === 0 ? (
            <div className="mt-2 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
              <p className="text-gray-600">Definitions are on the way. Check back soon.</p>
            </div>
          ) : (
            <div className="mt-2 space-y-14">
              {categories.map((cat) => {
                const inCat = terms.filter((t) => t.category === cat)
                return (
                  <div key={cat} className="border-t border-gray-200 pt-8">
                    <h2 className="mb-6 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                      {cat}
                    </h2>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {inCat.map((t) => (
                        <Link
                          key={t.slug}
                          href={localePath("glossary", t.slug, locale)}
                          className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                        >
                          <h3 className="text-[15px] font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-accent-700">
                            {t.term}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-gray-600">
                            {t.definition}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
