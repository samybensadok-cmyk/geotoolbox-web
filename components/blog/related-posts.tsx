import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { localePath } from "@/lib/i18n/paths"
import type { Post } from "@/lib/content"

// Same tinted-card surfaces as the "What's next" feature cards so the two
// blocks read as one visual system at the end of an article.
const cardTints = [
  { bg: "bg-[var(--surface-mint)]", border: "border-[var(--surface-mint-border)]", dot: "bg-accent-500" },
  { bg: "bg-[var(--surface-lilac)]", border: "border-[var(--surface-lilac-border)]", dot: "bg-indigo-500" },
  { bg: "bg-[var(--surface-steel)]", border: "border-[var(--surface-steel-border)]", dot: "bg-slate-500" },
]

export function RelatedPosts({ posts, locale }: { posts: Post[]; locale: string }) {
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="related-posts-heading" className="mt-16">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
        Keep reading
      </p>
      <h2 id="related-posts-heading" className="mt-2 text-[clamp(1.25rem,2.5vw,1.625rem)] font-bold tracking-tight text-gray-900">
        More on this topic
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {posts.map((post, i) => {
          const tint = cardTints[i % cardTints.length]
          return (
            <Link
              key={post.slug}
              href={localePath("blog", post.slug, locale)}
              className={`group/card flex flex-col rounded-2xl border ${tint.border} ${tint.bg} p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2`}
            >
              {post.tags.length > 0 && (
                <div className="mb-2.5 flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${tint.dot}`} aria-hidden="true" />
                  <span className="font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-600">
                    {post.tags[0]}
                  </span>
                </div>
              )}
              <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover/card:text-accent-700 line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-gray-700 line-clamp-2">
                {post.description}
              </p>
              <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-gray-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true" className="text-gray-400">&middot;</span>
                <span>{post.readingTime} min read</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
