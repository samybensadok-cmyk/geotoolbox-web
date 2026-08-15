import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeShiki from "@shikijs/rehype"
import { getPostBySlug, getAllPostSlugs, getRelatedPosts, extractHeadings, extractFaq } from "@/lib/content"
import { getMdxComponents } from "@/components/mdx"
import { formatDate } from "@/lib/utils"
import { routing, bcp47, type Locale } from "@/i18n/routing"
import { alternatesFor, urlFor } from "@/lib/i18n/siblings"
import { rehypeLocalizeLinks } from "@/lib/i18n/rehype-localize-links"
import { setRequestLocale, getTranslations, getMessages } from "next-intl/server"
import { frenchTypography, rehypeFrenchTypography } from "@/lib/french-typography"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { articleSchema, faqPageSchema, reviewSchema } from "@/lib/seo-schema"
import { getAuthorByName } from "@/lib/authors"
import { AuthorBio } from "@/components/blog/author-bio"
import { RelatedPosts } from "@/components/blog/related-posts"
import { InlineCta } from "@/components/blog/inline-cta"
import { injectInlineCta, isCommercialIntent } from "@/lib/inline-cta"
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup"
import { newsletterCopyFrom } from "@/components/newsletter/copy"
import { Avatar } from "@/components/ui/avatar"

// Daily ISR. The blog is otherwise fully static, which would freeze the
// $MONTH/$YEAR title tokens (lib/seo-tokens.ts) at whatever month the site was
// last deployed. Revalidating once a day lets the month roll over on its own,
// within 24h of the 1st, while pages still serve from the static cache.
export const revalidate = 86400

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllPostSlugs(locale).map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(slug, locale)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    robots: post.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: urlFor("blog", slug, locale),
      locale: bcp47[locale as Locale].replace("-", "_"),
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      // Omit `images` when no frontmatter override, so Next auto-injects the
      // file-convention card from opengraph-image.tsx. A future `image:` in
      // frontmatter still wins.
      ...(post.image ? { images: [post.image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    // Self-canonical + reciprocal hreflang from the sibling map. Pre-FR this
    // returns only the canonical, so EN output is unchanged. The text/markdown
    // alternate advertises the .md twin served for AI agents (middleware.ts).
    alternates: {
      ...alternatesFor("blog", slug, locale),
      types: { "text/markdown": `${urlFor("blog", slug, locale)}.md` },
    },
  }
}

// Feature cards surfaced in the post footer "What's next" block. Same
// atmospheric tokens + accent colors as the /features tinted gallery so
// readers transitioning from article to product see continuity. `name` is
// the product's proper noun and stays untranslated across locales, matching
// how the feature pages themselves keep "Content Analyzer"/"Domain Overview"
// in the FR/ES hero eyebrow (messages/{fr,es}.json → featurePages.*.hero.eyebrow)
// — only `blurb` is locale copy. Was hardcoded EN-only until 2026-08-15 (Fable
// QA catch): every FR/ES article shipped these three cards in English, and the
// href had no locale prefix even though /[locale]/features/<slug> exists for
// all three.
const RELATED_FEATURES: Record<string, { slug: string; name: string; blurb: string; bg: string; border: string; dot: string }[]> = {
  en: [
    {
      slug: "geo-scan",
      name: "GEO Scan",
      blurb: "Measure how 8 AI engines cite your brand for any keyword. Baseline in minutes.",
      bg: "bg-[var(--surface-mint)]",
      border: "border-[var(--surface-mint-border)]",
      dot: "bg-accent-500",
    },
    {
      slug: "content-analyzer",
      name: "Content Analyzer",
      blurb: "Grade any URL A–F for AI citability. 21 signals with exact fixes.",
      bg: "bg-[var(--surface-lilac)]",
      border: "border-[var(--surface-lilac-border)]",
      dot: "bg-indigo-500",
    },
    {
      slug: "domain-overview",
      name: "Domain Overview",
      blurb: "The command center for your AI visibility. Aggregated across every scan.",
      bg: "bg-[var(--surface-steel)]",
      border: "border-[var(--surface-steel-border)]",
      dot: "bg-slate-500",
    },
  ],
  fr: [
    {
      slug: "geo-scan",
      name: "GEO Scan",
      blurb: "Mesurez comment 8 moteurs IA citent votre marque, pour n’importe quel mot-clé. Résultats en quelques minutes.",
      bg: "bg-[var(--surface-mint)]",
      border: "border-[var(--surface-mint-border)]",
      dot: "bg-accent-500",
    },
    {
      slug: "content-analyzer",
      name: "Content Analyzer",
      blurb: "Notez n’importe quelle URL de A à F pour la citabilité IA. 21 signaux, avec les correctifs exacts.",
      bg: "bg-[var(--surface-lilac)]",
      border: "border-[var(--surface-lilac-border)]",
      dot: "bg-indigo-500",
    },
    {
      slug: "domain-overview",
      name: "Domain Overview",
      blurb: "Le poste de commande de votre visibilité IA. Agrégé sur tous vos scans.",
      bg: "bg-[var(--surface-steel)]",
      border: "border-[var(--surface-steel-border)]",
      dot: "bg-slate-500",
    },
  ],
  es: [
    {
      slug: "geo-scan",
      name: "GEO Scan",
      blurb: "Mide cómo te citan 8 motores de IA para cualquier palabra clave. Resultados en minutos.",
      bg: "bg-[var(--surface-mint)]",
      border: "border-[var(--surface-mint-border)]",
      dot: "bg-accent-500",
    },
    {
      slug: "content-analyzer",
      name: "Content Analyzer",
      blurb: "Califica cualquier URL de A a F en citabilidad IA. 21 señales con las correcciones exactas.",
      bg: "bg-[var(--surface-lilac)]",
      border: "border-[var(--surface-lilac-border)]",
      dot: "bg-indigo-500",
    },
    {
      slug: "domain-overview",
      name: "Domain Overview",
      blurb: "El centro de mando de tu visibilidad en IA. Todos tus escaneos, en un solo lugar.",
      bg: "bg-[var(--surface-steel)]",
      border: "border-[var(--surface-steel-border)]",
      dot: "bg-slate-500",
    },
  ],
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = getPostBySlug(slug, locale)
  if (!post) notFound()

  const t = await getTranslations("blog")
  const tc = await getTranslations("common")
  const allMessages = await getMessages()
  const isFr = locale === "fr"
  const typo = (s: string) => (isFr ? frenchTypography(s) : s)
  const author = getAuthorByName(post.author)
  const headings = extractHeadings(post.content)
  const faqs = extractFaq(post.content)
  const relatedPosts = getRelatedPosts(slug, 3, locale)
  const relatedFeatures = RELATED_FEATURES[locale] ?? RELATED_FEATURES.en
  const { source: mdxSource } = injectInlineCta(post)

  return (
    <>
      {/* Article hero — warm atmosphere, full-width surface */}
      <section className="bg-[var(--surface-warm)] px-6 pt-16 pb-10 sm:pt-20 sm:pb-14">
        <JsonLd
          data={[
            articleSchema({
              slug: post.slug,
              title: post.title,
              description: post.description,
              date: post.date,
              updated: post.updated,
              author: post.author,
              image: post.image,
              inLanguage: bcp47[locale as Locale],
              url: urlFor("blog", post.slug, locale),
            }),
            ...(faqs.length > 0 ? [faqPageSchema(faqs, bcp47[locale as Locale])] : []),
            ...(post.review
              ? [
                  reviewSchema({
                    slug: post.slug,
                    title: post.title,
                    description: post.description,
                    date: post.date,
                    updated: post.updated,
                    author: post.author,
                    url: urlFor("blog", post.slug, locale),
                    review: post.review,
                  }),
                ]
              : []),
          ]}
        />
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: t("home"), href: "/" },
              {
                name: "Blog",
                // Locale-aware, not an fr/en binary: the hardcoded ternary sent
                // every ES reader to the English blog index.
                href: locale === routing.defaultLocale ? "/blog" : `/${locale}/blog`,
              },
              { name: post.title, href: "" },
            ]}
          />
          <header className="mt-2">
            {post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--surface-warm-border)] bg-white px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-gray-900">
              {typo(post.title)}
            </h1>
            <p className="speakable-summary mt-5 max-w-3xl text-[17px] leading-relaxed text-gray-700">
              {typo(post.description)}
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
              {author ? (
                <Link
                  href={`/author/${author.slug}`}
                  className="group/byline flex items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                >
                  <Avatar name={author.name} src={author.avatar} size={28} />
                  <span className="font-semibold text-gray-900 group-hover/byline:text-accent-700">
                    {author.name}
                  </span>
                </Link>
              ) : (
                <span className="font-semibold text-gray-900">{post.author}</span>
              )}
              <span aria-hidden="true" className="text-gray-400">&middot;</span>
              <time dateTime={post.updated ?? post.date}>
                {post.updated
                  ? t("updated", { date: formatDate(post.updated, locale) })
                  : formatDate(post.date, locale)}
              </time>
              <span aria-hidden="true" className="text-gray-400">&middot;</span>
              <span>{t("minRead", { count: post.readingTime })}</span>
            </div>
          </header>
        </div>
      </section>

      {/* Article body — 2-col layout with sticky TOC sidebar on desktop */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          {/* Mobile TOC — collapsible */}
          {headings.length >= 4 && (
            <details className="group mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-4 lg:hidden">
              <summary className="cursor-pointer list-none rounded-md font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  <span>
                    {t("inThisPost")}
                    <span className="ml-2 font-normal text-gray-500">
                      {t("sections", { count: headings.filter((h) => h.level === 2).length })}
                    </span>
                  </span>
                  <svg className="h-3 w-3 transition-transform duration-200 group-open:rotate-90" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 3l4 3-4 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <ul className="mt-4 space-y-0.5">
                {headings.map((h) => (
                  <li key={h.slug} className={h.level === 3 ? "pl-4" : ""}>
                    <a
                      href={`#${h.slug}`}
                      className="-mx-2 block rounded px-2 py-2 text-[13.5px] leading-snug text-gray-700 transition-colors duration-200 hover:bg-white hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[3fr_9fr] lg:gap-14">
            {/* Desktop sticky TOC sidebar */}
            {headings.length >= 4 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                    {t("inThisPost")}
                  </p>
                  <nav aria-label="Article sections">
                    <ul className="space-y-2.5">
                      {headings.map((h) => (
                        <li key={h.slug} className={h.level === 3 ? "pl-4" : ""}>
                          <a
                            href={`#${h.slug}`}
                            className={`block rounded-r-md border-l-2 py-1 pl-3 text-[13px] leading-snug transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 ${
                              h.level === 2
                                ? "border-gray-200 font-medium text-gray-700 hover:border-accent-500 hover:text-accent-700"
                                : "border-gray-100 text-gray-500 hover:border-accent-400 hover:text-accent-600"
                            }`}
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </aside>
            )}

            {/* Article content */}
            <article className="prose prose-gray max-w-none prose-headings:tracking-tight prose-a:text-accent-700 prose-a:underline-offset-4 prose-strong:text-gray-900 prose-code:text-accent-700">
              <MDXRemote
                source={mdxSource}
                components={{
                  ...getMdxComponents(locale),
                  InlineCta: (props: { target?: Parameters<typeof InlineCta>[0]["target"] }) => (
                    <InlineCta {...props} locale={locale} />
                  ),
                }}
                options={{
                  mdxOptions: {
                    rehypePlugins: [
                      [rehypeShiki, { themes: { light: "github-light", dark: "one-dark-pro" } }],
                      ...(isFr ? [rehypeFrenchTypography] : []),
                      // Localize hrefs on ALL anchors (incl. raw-HTML links inside
                      // `<table>` grids, which the `a` component override misses).
                      ...(locale !== routing.defaultLocale ? [rehypeLocalizeLinks(locale)] : []),
                    ],
                  },
                }}
              />
            </article>
          </div>

          {author && <AuthorBio author={author} locale={locale} />}

          {/* Email capture — double opt-in; source tag = per-article attribution. */}
          <div className="mt-12">
            <NewsletterSignup
              source={`article:${slug}`}
              copy={newsletterCopyFrom(allMessages.footer as Record<string, string>)}
            />
          </div>

          <RelatedPosts posts={relatedPosts} locale={locale} />
        </div>
      </section>

      {/* What's next — product pitch + related features */}
      <section className="border-t border-gray-200 bg-gray-50 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                {t("whatsNext")}
              </p>
              <h2 className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-gray-900">
                {t("putIntoPractice")}
              </h2>
              <p className="mt-2 max-w-xl text-[15px] text-gray-600">
                {t("whatsNextCopy")}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <Link
                href="/app"
                prefetch={false}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-900 px-6 py-3 text-[14.5px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
              >
                {tc("tryForFree")}
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              {/* Commercial-intent articles: the reader is tool-shopping — give
                  them the pricing page, and (EN) the done-for-you route too. */}
              {isCommercialIntent(slug) && (
                <p className="text-[13px] text-gray-600">
                  <Link
                    href={locale === routing.defaultLocale ? "/pricing" : `/${locale}/pricing`}
                    className="font-semibold text-accent-700 hover:text-accent-800"
                  >
                    {t("seePricing")}
                  </Link>
                  {/* /services/ai-seo-agency is EN-only (spec §10 P3) — locale
                      check, not an fr/en binary: `!isFr` alone would leak this
                      English-only link to ES readers the moment an ES slug
                      joins COMMERCIAL_INTENT_SLUGS. */}
                  {locale === routing.defaultLocale && (
                    <>
                      {" · "}
                      <Link href="/services/ai-seo-agency" className="font-semibold text-accent-700 hover:text-accent-800">
                        {t("dfyLink")}
                      </Link>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {relatedFeatures.map((f) => (
              <Link
                key={f.slug}
                href={locale === routing.defaultLocale ? `/features/${f.slug}` : `/${locale}/features/${f.slug}`}
                className={`group/card block rounded-2xl border ${f.border} ${f.bg} p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${f.dot}`} aria-hidden="true" />
                    <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">{f.name}</h3>
                  </div>
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform group-hover/card:translate-x-0.5 group-hover/card:text-gray-700"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-gray-700">{f.blurb}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center">
            <Link
              href={locale === routing.defaultLocale ? "/blog" : `/${locale}/blog`}
              className="inline-flex items-center gap-1.5 rounded-sm text-[13px] font-semibold text-gray-600 transition-colors duration-200 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 7H4m0 0l3-3m-3 3l3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t("backToPosts")}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
