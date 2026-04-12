import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeShiki from "@shikijs/rehype"
import { getPostBySlug, getAllPosts } from "@/lib/content"
import { mdxComponents } from "@/components/mdx"
import { formatDate } from "@/lib/utils"
import { siteConfig } from "@/lib/config"
import Link from "next/link"

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `${siteConfig.url}/blog/${slug}`,
    },
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-10"
      >
        <span aria-hidden="true">&larr;</span>
        Blog
      </Link>

      {/* Post header */}
      <header className="mb-14">
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium tracking-wider text-accent-600 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] text-slate-900">
          {post.title}
        </h1>

        <div className="mt-5 flex items-center gap-3 text-sm text-slate-400">
          <span>{post.author}</span>
          <span>&middot;</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>&middot;</span>
          <span>{post.readingTime} min read</span>
        </div>
      </header>

      {/* Post content */}
      <article className="prose max-w-none">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [
                  rehypeShiki,
                  {
                    themes: {
                      light: "github-light",
                      dark: "one-dark-pro",
                    },
                  },
                ],
              ],
            },
          }}
        />
      </article>
    </div>
  )
}
