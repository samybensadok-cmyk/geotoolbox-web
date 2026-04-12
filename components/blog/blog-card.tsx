import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/lib/content"

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      {post.tags.length > 0 && (
        <div className="mb-2 flex gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs font-medium text-accent-600 uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      )}

      <h3 className="text-base font-semibold text-gray-900 leading-snug group-hover:text-accent-700 transition-colors line-clamp-2">
        {post.title}
      </h3>

      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
        {post.description}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>&middot;</span>
        <span>{post.readingTime} min</span>
      </div>
    </Link>
  )
}
