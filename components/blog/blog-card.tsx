import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/lib/content"

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-surface-border bg-surface-secondary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-200"
    >
      {/* Image */}
      {post.image && (
        <div className="aspect-video overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-text-primary line-clamp-2 group-hover:text-brand-600 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mb-4 text-sm text-text-secondary line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* Meta */}
        <div className="mt-auto flex items-center gap-3 text-xs text-text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>&middot;</span>
          <span>{post.readingTime} min read</span>
        </div>
      </div>
    </Link>
  )
}
