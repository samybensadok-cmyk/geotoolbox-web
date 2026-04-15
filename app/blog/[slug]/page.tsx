import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import rehypeShiki from "@shikijs/rehype"
import { getPostBySlug, getAllPosts } from "@/lib/content"
import { mdxComponents } from "@/components/mdx"
import { formatDate } from "@/lib/utils"
import { siteConfig } from "@/lib/config"
import { Breadcrumbs } from "@/components/features/breadcrumbs"

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
      <Breadcrumbs
        trail={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: "" },
        ]}
      />

      <header className="mb-12">
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span key={tag} className="font-mono text-[11px] font-semibold tracking-widest text-accent-700 uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.15] tracking-tight text-gray-900">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
          <span>{post.author}</span>
          <span aria-hidden="true" className="text-gray-300">&middot;</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true" className="text-gray-300">&middot;</span>
          <span>{post.readingTime} min read</span>
        </div>
      </header>

      <article className="prose max-w-none">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypeShiki, { themes: { light: "github-light", dark: "one-dark-pro" } }],
              ],
            },
          }}
        />
      </article>
    </div>
  )
}
