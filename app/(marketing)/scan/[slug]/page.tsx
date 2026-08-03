import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { siteConfig } from "@/lib/config"
import { getSnapshot, isValidSlug, oneLine } from "@/lib/lgs-public"
import { Hero } from "./hero"
import { WinLose } from "./win-lose"
import { ScanCta, Visibility } from "./visibility"

/**
 * Public AI-visibility snapshot (/scan/<slug>) — the prospect-facing half of the
 * leadgen scan. It renders the frozen `lgs-public-v1` projection and nothing
 * else: the Replit handler decides what a prospect may see, this page decides
 * how it reads.
 *
 * noindex, like /r/<id>: these are per-prospect pages, not content. The slug is
 * a 128-bit unguessable token, so the route lives at (marketing)/scan/[slug] and
 * inherits the EN root layout. A top-level app/scan would have no root layout
 * and fail the build.
 */

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!isValidSlug(slug)) {
    return { title: "AI Visibility Snapshot", robots: { index: false, follow: true } }
  }
  const data = await getSnapshot(slug)
  const brand = data ? oneLine(data.brand, 80) : ""
  /* Middot, not an em dash: the marketing house style forbids em dashes. The
     two quote-attribution dashes in the sections are the MM citation
     convention and are deliberately kept. */
  const title = brand ? `${brand} · AI Visibility Snapshot` : "AI Visibility Snapshot"
  const description = brand
    ? `How AI engines answer buying questions about ${brand}, measured across ChatGPT, Google AI Overviews, Gemini, and Perplexity.`
    : "How AI engines answer buying questions about a brand, measured across ChatGPT, Google AI Overviews, Gemini, and Perplexity."

  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: `${siteConfig.url}/scan/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/scan/${slug}`,
      // With two root layouts in route groups the colocated file-convention OG
      // image does not auto-attach, so it is referenced explicitly.
      images: [{ url: `${siteConfig.url}/scan/${slug}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.url}/scan/${slug}/opengraph-image`],
    },
  }
}

export default async function ScanReportPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isValidSlug(slug)) notFound()

  const data = await getSnapshot(slug)
  if (!data) notFound()

  return (
    <>
      <Hero data={data} />
      <WinLose data={data} />
      <Visibility data={data} />
      <ScanCta />
    </>
  )
}
