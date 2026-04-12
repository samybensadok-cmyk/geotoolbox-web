import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/lib/content"

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col"
    >
      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-3 flex gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium tracking-wider text-accent-600 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 leading-snug group-hover:text-accent-700 transition-colors line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
        {post.description}
      </p>

      {/* Meta */}
      <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>&middot;</span>
        <span>{post.readingTime} min</span>
      </div>
    </Link>
  )
}
