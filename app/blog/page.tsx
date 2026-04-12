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
      {/* Header */}
      <div className="max-w-xl">
        <p className="text-sm font-medium tracking-widest text-accent-600 uppercase">
          Research
        </p>
        <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-slate-900">
          Blog
        </h1>
        <p className="mt-4 text-lg text-slate-500 leading-relaxed">
          Insights on GEO, AI visibility, and the future of search.
        </p>
      </div>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/blog"
            className={`text-sm transition-colors ${
              !activeTag
                ? "font-medium text-slate-900"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            All
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className={`text-sm transition-colors ${
                activeTag === tag
                  ? "font-medium text-slate-900"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-20">
          <p className="text-slate-400">No posts yet. Check back soon.</p>
        </div>
      )}
    </div>
  )
}
