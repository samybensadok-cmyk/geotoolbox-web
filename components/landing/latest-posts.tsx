import { getAllPosts } from "@/lib/content"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"

export function LatestPosts() {
  const posts = getAllPosts().slice(0, 3)

  if (posts.length === 0) return null

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary">
              Latest from the blog
            </h2>
            <p className="mt-2 text-text-secondary">
              Insights on GEO, AI visibility, and the future of search.
            </p>
          </div>
          <Button href="/blog" variant="ghost" className="hidden sm:inline-flex">
            View All Posts &rarr;
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button href="/blog" variant="ghost">
            View All Posts &rarr;
          </Button>
        </div>
      </div>
    </section>
  )
}
