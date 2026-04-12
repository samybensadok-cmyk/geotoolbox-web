import type { Metadata } from "next"
import { getAllPosts, getAllTags } from "@/lib/content"
import { BlogCard } from "@/components/blog/blog-card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on Generative Engine Optimization, AI visibility, and the future of search.",
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary">
          Blog
        </h1>
        <p className="mt-4 text-lg text-text-secondary leading-relaxed">
          Insights on GEO, AI visibility, and the future of search.
        </p>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/blog">
            <Badge
              variant={!activeTag ? "default" : "outline"}
              className="cursor-pointer"
            >
              All
            </Badge>
          </Link>
          {allTags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${tag}`}>
              <Badge
                variant={activeTag === tag ? "default" : "outline"}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-text-muted">No posts yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
