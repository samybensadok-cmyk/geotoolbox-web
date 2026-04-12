import { getAllPosts } from "@/lib/content"
import { BlogCard } from "@/components/blog/blog-card"
import Link from "next/link"

export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3)

  if (posts.length === 0) return null

  return (
    <section className="bg-cream-dark px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium tracking-widest text-accent-600 uppercase">
              Research
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,3.5vw,2.25rem)] text-slate-900">
              From the blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden text-sm text-slate-500 underline underline-offset-4 decoration-slate-300 hover:text-slate-900 hover:decoration-slate-500 transition-colors sm:inline"
          >
            All posts
          </Link>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/blog"
            className="text-sm text-slate-500 underline underline-offset-4 decoration-slate-300"
          >
            All posts
          </Link>
        </div>
      </div>
    </section>
  )
}
