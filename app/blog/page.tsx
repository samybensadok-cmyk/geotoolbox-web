import type { Metadata } from "next"
import { getAllPosts, getAllTags } from "@/lib/content"
import { BlogCard } from "@/components/blog/blog-card"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Research and insights on Generative Engine Optimization, AI visibility, and the future of search.",
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
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Blog
        </h1>
        <p className="mt-3 text-base text-gray-500 leading-relaxed">
          Research and insights on GEO, AI visibility, and the future of search.
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/blog"
            className={`text-sm transition-colors ${!activeTag ? "font-medium text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
          >
            All
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className={`text-sm transition-colors ${activeTag === tag ? "font-medium text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {posts.length > 0 ? (
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-20">
          <p className="text-gray-400">No posts yet. Check back soon.</p>
        </div>
      )}
    </div>
  )
}
