import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeShiki from "@shikijs/rehype"
import { getPostBySlug, getAllPosts, extractHeadings } from "@/lib/content"
import { mdxComponents } from "@/components/mdx"
import { formatDate } from "@/lib/utils"
import { siteConfig } from "@/lib/config"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { articleSchema, breadcrumbsSchema } from "@/lib/seo-schema"

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `${siteConfig.url}/blog/${slug}`,
    },
  }
}

// Feature cards surfaced in the post footer "What's next" block. Same
// atmospheric tokens + accent colors as the /features tinted gallery
// so readers transitioning from article to product see continuity.
const relatedFeatures = [
  {
    slug: "geo-scan",
    name: "GEO Scan",
    blurb: "Measure how 6 AI engines cite your brand for any keyword. Baseline in minutes.",
    bg: "bg-[var(--surface-mint)]",
    border: "border-[var(--surface-mint-border)]",
    dot: "bg-accent-500",
  },
  {
    slug: "content-analyzer",
    name: "Content Analyzer",
    blurb: "Grade any URL A–F for AI citability. 19 signals with exact fixes.",
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
]

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const headings = extractHeadings(post.content)

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
              author: post.author,
              image: post.image,
            }),
            breadcrumbsSchema([
              { name: "Home", url: "/" },
              { name: "Blog", url: "/blog" },
              { name: post.title, url: `/blog/${post.slug}` },
            ]),
          ]}
        />
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
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
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-gray-700">
              {post.description}
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{post.author}</span>
              <span aria-hidden="true" className="text-gray-400">&middot;</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true" className="text-gray-400">&middot;</span>
              <span>{post.readingTime} min read</span>
            </div>
          </header>
        </div>
      </section>

      {/* Article body — 2-col layout with sticky TOC sidebar on desktop */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          {/* Mobile TOC — collapsible */}
          {headings.length >= 4 && (
            <details className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-4 lg:hidden">
              <summary className="cursor-pointer list-none font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-700 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  <span>
                    In this post
                    <span className="ml-2 font-normal text-gray-500">
                      {headings.filter((h) => h.level === 2).length} sections
                    </span>
                  </span>
                  <svg className="h-3 w-3 transition-transform group-open:rotate-90" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 3l4 3-4 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <ul className="mt-4 space-y-2">
                {headings.map((h) => (
                  <li key={h.slug} className={h.level === 3 ? "pl-4" : ""}>
                    <a
                      href={`#${h.slug}`}
                      className="block text-[13.5px] leading-snug text-gray-700 hover:text-accent-700"
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
                    In this post
                  </p>
                  <nav aria-label="Article sections">
                    <ul className="space-y-2.5">
                      {headings.map((h) => (
                        <li key={h.slug} className={h.level === 3 ? "pl-4" : ""}>
                          <a
                            href={`#${h.slug}`}
                            className={`block border-l-2 py-0.5 pl-3 text-[13px] leading-snug transition-colors ${
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
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    rehypePlugins: [
                      [rehypeShiki, { themes: { light: "github-light", dark: "one-dark-pro" } }],
                    ],
                  },
                }}
              />
            </article>
          </div>
        </div>
      </section>

      {/* What's next — product pitch + related features */}
      <section className="border-t border-gray-200 bg-gray-50 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                What&rsquo;s next
              </p>
              <h2 className="mt-2 text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight text-gray-900">
                Put this into practice.
              </h2>
              <p className="mt-2 max-w-xl text-[15px] text-gray-600">
                Stop guessing whether AI engines cite your brand. Run a scan, grade your pages, and watch your visibility over time.
              </p>
            </div>
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-900 px-6 py-3 text-[14.5px] font-semibold text-white transition-all hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]"
            >
              Try it for free
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {relatedFeatures.map((f) => (
              <Link
                key={f.slug}
                href={`/features/${f.slug}`}
                className={`group/card block rounded-2xl border ${f.border} ${f.bg} p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2`}
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
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 transition-colors hover:text-accent-700"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 7H4m0 0l3-3m-3 3l3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to all posts
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
