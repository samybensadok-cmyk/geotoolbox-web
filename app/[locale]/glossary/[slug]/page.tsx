import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeShiki from "@shikijs/rehype"
import {
  getGlossaryTermBySlug,
  getAllGlossaryTerms,
  getAllGlossarySlugs,
} from "@/lib/content"
import { getMdxComponents } from "@/components/mdx"
import { formatDate } from "@/lib/utils"
import { routing } from "@/i18n/routing"
import { alternatesFor, urlFor } from "@/lib/i18n/siblings"
import { localePath } from "@/lib/i18n/paths"
import { setRequestLocale } from "next-intl/server"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import {
  definedTermSchema,
  faqPageSchema,
} from "@/lib/seo-schema"

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllGlossarySlugs(locale).map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const term = getGlossaryTermBySlug(slug, locale)
  if (!term) return {}
  const title = `${term.term}: Definition`
  return {
    title,
    description: term.definition,
    openGraph: { title, description: term.definition, type: "article" },
    twitter: { card: "summary", title, description: term.definition },
    alternates: {
      ...alternatesFor("glossary", slug, locale),
      // .md twin for AI agents (middleware.ts markdown mirrors)
      types: { "text/markdown": `${urlFor("glossary", slug, locale)}.md` },
    },
  }
}

export default async function GlossaryEntry({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const term = getGlossaryTermBySlug(slug, locale)
  if (!term) notFound()

  const all = getAllGlossaryTerms(locale)
  const related = term.related
    .map((s) => all.find((t) => t.slug === s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t))

  return (
    <>
      <section className="bg-[var(--surface-warm)] px-6 pt-16 pb-10 sm:pt-20 sm:pb-14">
        <JsonLd
          data={[
            definedTermSchema({ slug: term.slug, term: term.term, definition: term.definition }),
            faqPageSchema([{ question: `What is ${term.term}?`, answer: term.definition }]),
          ]}
        />
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Glossary", href: "/glossary" },
              { name: term.term, href: "" },
            ]}
          />
          <header className="mt-2">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              {term.category}
            </p>
            <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.15] tracking-tight text-gray-900">
              {term.term}
            </h1>
            {term.aliases.length > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                Also: {term.aliases.join(", ")}
              </p>
            )}
            {/* Answer-first definition — the chunk AI engines lift verbatim */}
            <p className="mt-5 text-[18px] leading-relaxed text-gray-800">
              {term.definition}
            </p>
            {term.updated && (
              <p className="mt-5 text-xs text-gray-500">
                Updated <time dateTime={term.updated}>{formatDate(term.updated)}</time>
              </p>
            )}
          </header>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          {term.content.trim().length > 0 && (
            <article className="prose prose-gray max-w-none prose-headings:tracking-tight prose-a:text-accent-700 prose-a:underline-offset-4 prose-strong:text-gray-900 prose-code:text-accent-700">
              <MDXRemote
                source={term.content}
                components={getMdxComponents(locale)}
                options={{
                  mdxOptions: {
                    rehypePlugins: [
                      [rehypeShiki, { themes: { light: "github-light", dark: "one-dark-pro" } }],
                    ],
                  },
                }}
              />
            </article>
          )}

          {term.article && (
            <div className="mt-10 rounded-2xl border border-[var(--surface-warm-border)] bg-[var(--surface-warm)] p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                Go deeper
              </p>
              <Link
                href={term.article}
                className="group mt-2 inline-flex items-center gap-2 text-[17px] font-semibold tracking-tight text-gray-900 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
              >
                {term.articleLabel ?? "Read the full guide"}
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {term.relatedArticles.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-[var(--surface-warm-border)] pt-4">
                  {term.relatedArticles.map((a) => (
                    <li key={a.href}>
                      <Link
                        href={a.href}
                        className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-gray-700 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                      >
                        {a.label}
                        <svg className="h-3 w-3 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-700" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-10 border-t border-gray-200 pt-8">
              <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Related terms
              </p>
              <div className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={localePath("glossary", r.slug, locale)}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
                  >
                    {r.term}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between gap-4 border-t border-gray-200 pt-8">
            <Link
              href="/glossary"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 transition-colors hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 7H4m0 0l3-3m-3 3l3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All terms
            </Link>
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-900 px-5 py-2.5 text-[13.5px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              Run a free scan
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
