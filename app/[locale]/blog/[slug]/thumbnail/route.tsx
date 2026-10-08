import { getAllPosts, getPostBySlug } from "@/lib/content"
import { contentLocales } from "@/i18n/routing"
import { renderBlogThumbnail } from "@/lib/og/blog-thumbnail"

export const revalidate = 86400
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  // Route handlers do not inherit the layout's generated locale params.
  return contentLocales.flatMap((locale) => getAllPosts(locale).map((post) => ({ locale, slug: post.slug })))
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!contentLocales.includes(locale as typeof contentLocales[number])) return new Response(null, { status: 404 })
  const post = getPostBySlug(slug, locale)
  if (!post || post.draft || post.noindex) return new Response(null, { status: 404 })
  return renderBlogThumbnail(post)
}
