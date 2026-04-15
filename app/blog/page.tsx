import type { Metadata } from "next"
import { getAllPosts, getAllTags } from "@/lib/content"
import { formatDate } from "@/lib/utils"
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

export default function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  return <BlogIndexInner searchParams={searchParams} />
}

async function BlogIndexInner({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const params = await searchParams
  const activeTag = params.tag
  const allPosts = getAllPosts()
  const allTags = getAllTags()
  const posts = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <>
      {/* Editorial header */}
      <section className="bg-white px-6 pt-20 pb-12 sm:pt-28">
      <JsonLd data={breadcrumbsSchema([{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }])} />

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[6fr_6fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Research
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                From the lab.
              </h1>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Research and insights on Generative Engine Optimization, AI visibility, and the future of search.
            </p>
          </div>

          {allTags.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className={`rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                  !activeTag
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                }`}
              >
                All
              </Link>
              {allTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                    activeTag === tag
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Posts */}
      <section className="bg-white px-6 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl">
          {posts.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
              <p className="text-gray-600">No posts yet. Check back soon.</p>
            </div>
          ) : rest.length === 0 ? (
            /* Single post — full-width editorial block */
            <Link href={`/blog/${featured.slug}`} className="group block border-t border-gray-200 pt-10">
              <div className="flex items-center gap-3">
                {featured.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                    {tag}
                  </span>
                ))}
                <span className="h-px flex-1 bg-gray-200" />
                <time className="font-mono text-[11px] text-gray-600" dateTime={featured.date}>
                  {formatDate(featured.date)}
                </time>
                <span className="font-mono text-[11px] text-gray-600">{featured.readingTime} min</span>
              </div>
              <h2 className="mt-5 max-w-3xl text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-accent-700">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-prose text-base leading-relaxed text-gray-600">
                {featured.description}
              </p>
              <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700">
                Read the post
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
            </Link>
          ) : (
            /* Featured (first) + secondary list */
            <div className="mt-2 grid grid-cols-1 gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
              {/* Featured */}
              <Link href={`/blog/${featured.slug}`} className="group block border-t border-gray-200 pt-10">
                <div className="flex items-center gap-3">
                  {featured.tags.slice(0, 1).map((tag) => (
                    <span key={tag} className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                      {tag}
                    </span>
                  ))}
                  <span className="h-px flex-1 bg-gray-200" />
                  <time className="font-mono text-[11px] text-gray-600" dateTime={featured.date}>
                    {formatDate(featured.date)}
                  </time>
                </div>
                <h2 className="mt-5 text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-accent-700">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-prose text-base leading-relaxed text-gray-600">
                  {featured.description}
                </p>
                <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700">
                  Read
                  <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </Link>

              {/* Secondary list */}
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block py-6"
                  >
                    <div className="flex items-center gap-3">
                      {post.tags.slice(0, 1).map((tag) => (
                        <span key={tag} className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700">
                          {tag}
                        </span>
                      ))}
                      <time className="font-mono text-[10px] text-gray-600" dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-accent-700">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600">
                      {post.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
