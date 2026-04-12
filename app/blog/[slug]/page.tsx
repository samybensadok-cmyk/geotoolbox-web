import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeShiki from "@shikijs/rehype"
import { getPostBySlug, getAllPosts } from "@/lib/content"
import { mdxComponents } from "@/components/mdx"
import { Badge } from "@/components/ui/badge"
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
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-8"
      >
        &larr; Back to blog
      </Link>

      {/* Post header */}
      <header className="mb-12">
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-3 text-sm text-text-muted">
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
