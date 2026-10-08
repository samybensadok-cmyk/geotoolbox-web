import { getAllPosts } from "@/lib/content"
import { primaryTopic } from "@/lib/blog-topics"
import { contentLocales } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"

export const revalidate = 86400
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  // Route handlers do not inherit the layout's generated locale params.
  return contentLocales.filter((locale) => getAllPosts(locale).length > 0).map((locale) => ({ locale }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!contentLocales.includes(locale as typeof contentLocales[number])) return new Response(null, { status: 404 })
  const posts = getAllPosts(locale)
  if (!posts.length) return new Response(null, { status: 404 })
  const t = await getTranslations({ locale, namespace: "blogTopics" })
  return Response.json(posts.map((post) => ({
    slug: post.slug, title: post.title, description: post.description.slice(0, 160),
    topicSlug: primaryTopic(post).slug, topicLabel: t(primaryTopic(post).slug),
  })))
}
