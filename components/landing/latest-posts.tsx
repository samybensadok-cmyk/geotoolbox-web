import { getAllPosts } from "@/lib/content"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3)
  if (posts.length === 0) return null

  const [featured, ...secondary] = posts
  const hasSecondary = secondary.length > 0

  return (
    <section className="border-t border-gray-100 bg-white px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Editorial header */}
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
              Research
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900">
              From the lab.
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden shrink-0 text-sm font-semibold text-gray-700 hover:text-accent-700 transition-colors sm:inline-flex items-center gap-1.5"
          >
            All posts
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {hasSecondary ? (
          /* Featured + secondary — asymmetric */
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <Link href={`/blog/${featured.slug}`} className="group block">
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
              <h3 className="mt-5 text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-accent-700">
                {featured.title}
              </h3>
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

            <div className="divide-y divide-gray-200">
              {secondary.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block py-6 first:pt-0 last:pb-0"
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
              <Link
                href="/blog"
                className="group block pt-6 text-sm font-semibold text-gray-700 transition-colors hover:text-accent-700 sm:hidden"
              >
                All posts &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* Single-post fallback — centered editorial card when secondary is empty */
          <div className="mt-14">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-3xl border border-gray-200 bg-gray-50/60 p-8 transition-all hover:border-accent-300 hover:bg-white hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.1)] sm:p-12"
            >
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
              <h3 className="mt-6 max-w-3xl text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900 transition-colors group-hover:text-accent-700">
                {featured.title}
              </h3>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
                {featured.description}
              </p>
              <p className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700">
                Read the guide
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
            </Link>
          </div>
        )}

        {!hasSecondary && (
          <Link
            href="/blog"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 transition-colors hover:text-accent-700 sm:hidden"
          >
            All posts &rarr;
          </Link>
        )}
      </div>
    </section>
  )
}
