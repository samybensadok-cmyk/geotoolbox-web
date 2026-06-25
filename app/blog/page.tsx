import type { Metadata } from "next"
import { getAllPosts } from "@/lib/content"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/lib/content"
import { TOPICS, primaryTopic, topicBySlug, topicCounts } from "@/lib/blog-topics"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbsSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Research and insights on Generative Engine Optimization, AI visibility, and the future of search.",
  alternates: { canonical: `${siteConfig.url}/blog` },
}

// Render tag slugs as clean labels: "ai-visibility" -> "AI Visibility", "geo" -> "GEO".
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

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[0_8px_30px_-12px_rgba(13,148,136,0.25)]"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700">
          {primaryTopic(post).label}
        </span>
        <span className="font-mono text-[10px] text-gray-400">{post.readingTime} min read</span>
      </div>
      <h3 className="mt-3.5 line-clamp-2 text-[1.0625rem] font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-accent-700">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-gray-600">
        {post.description}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3.5">
        <time className="font-mono text-[10.5px] text-gray-500" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
        <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold text-accent-700 opacity-0 transition-opacity group-hover:opacity-100">
          Read <Arrow />
        </span>
      </div>
    </Link>
  )
}

export default function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; topic?: string }>
}) {
  return <BlogIndexInner searchParams={searchParams} />
}

async function BlogIndexInner({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; topic?: string }>
}) {
  const params = await searchParams
  const allPosts = getAllPosts()
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

  const featured = posts[0]
  const sideList = posts.slice(1, 4)
  const grid = posts.slice(4)
  const hasSide = sideList.length > 0

  return (
    <>
      <JsonLd data={breadcrumbsSchema([{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }])} />

      {/* ===== Header band ===== */}
      <section className="border-b border-gray-100 bg-white px-6 pt-12 pb-8 sm:pt-14">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-700">
            GEO Toolbox · Blog
          </p>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1 className="max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Playbooks for getting cited by AI.
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-gray-600">
              Research, tactics, and honest takes on generative engine optimization, AI
              visibility, and the future of search.
              <span className="mt-1 block font-mono text-[12px] text-gray-400">
                {allPosts.length} articles and counting.
              </span>
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-[11px] uppercase tracking-widest text-gray-400">
              Topics
            </span>
            <Chip href="/blog" active={!isFiltered}>All</Chip>
            {TOPICS.map((t) => (
              <Chip key={t.slug} href={`/blog?topic=${t.slug}`} active={activeTopic?.slug === t.slug}>
                {t.label}
                <span className="ml-1.5 font-normal opacity-50">{counts[t.slug]}</span>
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
                No articles tagged{" "}
                <span className="font-semibold text-gray-900">
                  {activeLabel ?? ""}
                </span>{" "}
                yet.
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 hover:text-accent-800"
              >
                View all articles <Arrow />
              </Link>
            </div>
          ) : (
            <>
              {/* Featured — dark command block: latest large + next 3 beside it */}
              <div
                className={`animate-fade-up grid grid-cols-1 overflow-hidden rounded-3xl bg-[var(--surface-ink)] shadow-[0_24px_60px_-30px_rgba(11,18,32,0.55)] ${
                  hasSide ? "lg:grid-cols-[1.6fr_1fr]" : "lg:grid-cols-1"
                }`}
              >
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-12"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                        Latest
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
                        {primaryTopic(featured).label}
                      </span>
                    </div>
                    <h2 className="mt-6 max-w-2xl text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.12] tracking-tight text-white transition-colors group-hover:text-accent-200">
                      {featured.title}
                    </h2>
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-300 line-clamp-3">
                      {featured.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[11px] text-gray-400">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-accent-300">
                      Read the article <Arrow />
                    </span>
                    <span className="hidden h-px flex-1 bg-white/10 sm:block" />
                    <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                    <span>·</span>
                    <span>{featured.readingTime} min</span>
                  </div>
                </Link>

                {hasSide && (
                  <div className="flex flex-col divide-y divide-white/10 border-t border-white/10 lg:border-l lg:border-t-0">
                    {sideList.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-1 flex-col justify-center p-6 transition-colors hover:bg-white/[0.04] sm:p-7"
                      >
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                          <span className="text-accent-300/90">{primaryTopic(post).label}</span>
                          <span>·</span>
                          <span>{post.readingTime} min</span>
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug text-gray-100 transition-colors group-hover:text-accent-200">
                          {post.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid — the rest */}
              {grid.length > 0 && (
                <>
                  <div className="mt-14 mb-6 flex items-center gap-4">
                    <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                      {activeLabel ? `${activeLabel} articles` : "More articles"}
                    </h2>
                    <span className="h-px flex-1 bg-gray-200" />
                    <span className="font-mono text-[11px] text-gray-400">{posts.length} total</span>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {grid.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
