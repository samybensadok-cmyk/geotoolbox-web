import { ImageResponse } from "next/og"
import { getPostBySlug, extractHeadings } from "@/lib/content"
import { buildBlogCard, deriveCardData, type CardData } from "@/lib/og/blog-card"
import { loadOgFonts } from "@/lib/og/og-fonts"

// KNOWN LIMITATION, deliberate. This card renders post.title, so a title using
// the $MONTH/$YEAR tokens (lib/seo-tokens.ts) bakes the month into the image.
// Unlike the page route, a metadata-image convention does not honour
// `revalidate` — verified against .next/prerender-manifest.json, where the page
// paths carry 86400 and these do not — so the card is frozen until the next
// deploy. Accepted because the card only surfaces on social shares, it is
// cosmetic there, and this repo deploys often enough to keep it close. If that
// ever stops being true, generate the card from the raw frontmatter title
// instead of the resolved one rather than forcing this route dynamic.

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Per-post alt text for the OG image (a11y + SEO) — the post's own title, which
// is what the card prominently shows. Descriptive, never keyword-stuffed.
export async function generateImageMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug, locale)
  return [{ id: "og", alt: post ? `${post.title} — GEO Toolbox` : "GEO Toolbox", size, contentType }]
}

// Per-slug OG/social + AI-citation card. Auto-generated for every post from
// frontmatter + H2 headings (smart default by cluster). No per-post authoring.
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug, locale)
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
