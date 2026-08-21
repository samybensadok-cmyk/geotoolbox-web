import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { contentLocales, bcp47, type Locale } from "@/i18n/routing"
import { getAllPosts } from "@/lib/content"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbsSchema } from "@/lib/seo-schema"
import { TOPICS, primaryTopic, topicBySlug, topicCounts } from "@/lib/blog-topics"
import { BlogResults, type LitePost } from "@/components/blog/blog-results"
import { setRequestLocale, getTranslations } from "next-intl/server"

// No `revalidate` here on purpose: this route reads `searchParams` (?tag / ?topic),
// so it already renders on demand and its $MONTH/$YEAR tokens (lib/seo-tokens.ts)
// are always current. The ISR setting lives on the static routes that need it —
// [slug]/page.tsx and [slug]/opengraph-image.tsx.

// A wired locale still 404s its blog until it has posts — so /es/blog goes
// live automatically with the first ES article, no flag to flip. The default
// locale (en) is always live.
function blogIsLive(locale: string): boolean {
  if (!(contentLocales as readonly string[]).includes(locale)) return false
  return locale === "en" || getAllPosts(locale).length > 0
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  // Mirror the page guard: never emit metadata (canonical to a 404) for
  // locales whose blog isn't live yet.
  if (!blogIsLive(locale)) notFound()
  const basePath = locale === "en" ? "" : `/${locale}`
  const t = await getTranslations({ locale, namespace: "blogIndex" })
  // hreflang only for locales whose blog index actually resolves.
  const languages = Object.fromEntries([
    ...(contentLocales as readonly string[])
      .filter(blogIsLive)
      .map((l) => [bcp47[l as Locale], l === "en" ? `${siteConfig.url}/blog` : `${siteConfig.url}/${l}/blog`]),
    ["x-default", `${siteConfig.url}/blog`],
  ])
  return {
    title: "Blog",
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.url}${basePath}/blog`,
      languages,
    },
    openGraph: { locale: bcp47[locale as Locale].replace("-", "_") },
  }
}

// Render tag slugs as clean labels: "ai-visibility" -> "AI Visibility", "geo" -> "GEO".
// Used only for the legacy ?tag= filter label (per-article tag links).
const ACRONYMS = new Set([
  "geo", "aeo", "seo", "llmo", "llm", "ai", "gpt", "faq", "ugc", "saas", "b2b",
  "cms", "waf", "api", "url", "html", "json", "kpi", "roi", "sge", "eeat",
])
function tagLabel(tag: string): string {
  return tag
    .split("-")
    .map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ")
}

function Arrow() {
  return (
    <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors ${
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-accent-400 hover:text-accent-700"
      }`}
    >
      {children}
    </Link>
  )
}

export default async function BlogIndex({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tag?: string; topic?: string }>
}) {
  const { locale } = await params
  // 404 until this locale's blog is live (wired in contentLocales AND has
  // at least one post) — never render an empty index.
  if (!blogIsLive(locale)) notFound()
  setRequestLocale(locale)
  return <BlogIndexInner locale={locale} searchParams={searchParams} />
}

async function BlogIndexInner({
  locale,
  searchParams,
}: {
  locale: string
  searchParams: Promise<{ tag?: string; topic?: string }>
}) {
  const params = await searchParams
  const t = await getTranslations("blogIndex")
  const tBlog = await getTranslations("blog")
  const base = locale === "en" ? "" : `/${locale}`
  const allPosts = getAllPosts(locale)
  const counts = topicCounts(allPosts)

  // New: curated topic filter (`?topic=`). Legacy: raw tag filter (`?tag=`) is
  // still honored so existing per-article tag links keep working.
  const activeTopic = params.topic ? topicBySlug(params.topic) : undefined
  const legacyTag = !activeTopic && params.tag ? params.tag : undefined
  const isFiltered = Boolean(activeTopic || legacyTag)
  const activeLabel = activeTopic?.label ?? (legacyTag ? tagLabel(legacyTag) : undefined)

  const posts = activeTopic
    ? allPosts.filter((p) => primaryTopic(p).slug === activeTopic.slug)
    : legacyTag
      ? allPosts.filter((p) => p.tags.includes(legacyTag))
      : allPosts

  // Lightweight DTO for the client component (never ship the MDX body to the client).
  const lite: LitePost[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    readingTime: p.readingTime,
    topicLabel: primaryTopic(p).label,
  }))

  return (
    <>
      <JsonLd data={breadcrumbsSchema([{ name: tBlog("home"), url: base || "/" }, { name: "Blog", url: `${base}/blog` }])} />

      {/* ===== Header band ===== */}
      <section className="border-b border-gray-100 bg-white px-6 pt-12 pb-8 sm:pt-14">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-700">
            {t("eyebrow")}
          </p>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              {t("heading")}
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-gray-600">
              {t("intro")}
              <span className="mt-1 block font-mono text-[12px] text-gray-400">
                {t("count", { count: allPosts.length })}
              </span>
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-widest text-gray-400">
              {t("topics")}
            </span>
            <Chip href={`${base}/blog`} active={!isFiltered}>{t("all")}</Chip>
            {TOPICS.map((topic) => (
              <Chip key={topic.slug} href={`${base}/blog?topic=${topic.slug}`} active={activeTopic?.slug === topic.slug}>
                {topic.label}
                <span className="ml-1.5 font-normal opacity-50">{counts[topic.slug]}</span>
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Body ===== */}
      <section className="bg-gray-50 px-6 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl">
          {posts.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center">
              <p className="text-gray-600">
                {t("noArticles", { label: activeLabel ?? "" })}
              </p>
              <Link
                href={`${base}/blog`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 hover:text-accent-800"
              >
                {t("viewAll")} <Arrow />
              </Link>
            </div>
          ) : (
            <BlogResults posts={lite} activeLabel={activeLabel} locale={locale} />
          )}
        </div>
      </section>
    </>
  )
}
