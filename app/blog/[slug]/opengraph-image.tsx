import { ImageResponse } from "next/og"
import { getPostBySlug, extractHeadings } from "@/lib/content"
import { buildBlogCard, deriveCardData, type CardData } from "@/lib/og/blog-card"
import { loadOgFonts } from "@/lib/og/og-fonts"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Per-post alt text for the OG image (a11y + SEO) — the post's own title, which
// is what the card prominently shows. Descriptive, never keyword-stuffed.
export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  return [{ id: "og", alt: post ? `${post.title} — GEO Toolbox` : "GEO Toolbox", size, contentType }]
}

// Per-slug OG/social + AI-citation card. Auto-generated for every post from
// frontmatter + H2 headings (smart default by cluster). No per-post authoring.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const h2s = post
    ? extractHeadings(post.content).filter((h) => h.level === 2).map((h) => h.text)
    : []
  const data: CardData = post
    ? deriveCardData(post, h2s)
    : {
        cluster: "default",
        headline: "GEO Toolbox",
        sub: "Track and grow your brand's visibility across AI search.",
        kicker: "GEO TOOLBOX",
        panelHeader: "",
        items: [],
        meta: "geotoolbox.ai",
      }
  return new ImageResponse(buildBlogCard(data), { ...size, fonts: loadOgFonts() })
}
