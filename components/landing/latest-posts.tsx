import { getAllPosts } from "@/lib/content"
import { BlogCard } from "@/components/blog/blog-card"
import Link from "next/link"

export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3)

  if (posts.length === 0) return null

  return (
    <section className="bg-gray-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            From the blog
          </h2>
          <Link
            href="/blog"
            className="hidden text-sm text-gray-500 hover:text-gray-900 transition-colors sm:inline"
          >
            All posts &rarr;
          </Link>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
