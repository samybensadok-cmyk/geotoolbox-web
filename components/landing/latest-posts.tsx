import { getAllPosts } from "@/lib/content"
import { BlogCard } from "@/components/blog/blog-card"
import Link from "next/link"

export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3)

  if (posts.length === 0) return null

  return (
    <section className="border-t border-gray-100 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-accent-600 uppercase">Research</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
              From the blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors sm:inline"
          >
            All posts &rarr;
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
