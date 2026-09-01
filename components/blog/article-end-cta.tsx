"use client"

import Link from "next/link"
import { trackEvent } from "@/lib/analytics"

/**
 * SG_BLOG_CTA_V2 (2026-09-01) — the page-closing "What's next" button.
 *
 * Two things changed here:
 *
 * 1. **Destination.** It pointed at `/app`, which for an anonymous visitor
 *    renders the full logged-out application shell — ~25 sidebar tabs and the
 *    Content Studio panel, with no framing, no explanation, and the only
 *    signup affordance a small button in the sidebar footer (verified against
 *    the live rewrite target on 2026-09-01). A button labelled "try for free"
 *    at the end of an article now lands on the signup form itself, which is
 *    what the label promises.
 *
 * 2. **Attribution.** `blog_cta_click` fires before the hop to the Replit
 *    backend, which records no landing params of its own. `ref=` is a
 *    breadcrumb, deliberately not `utm_*` (an internal `utm_source` would
 *    overwrite the visitor's real acquisition source in GA4).
 */
export function ArticleEndCta({
  label,
  slug,
  locale,
  className,
}: {
  label: string
  slug: string
  locale: string
  className?: string
}) {
  return (
    <Link
      href="/app/?page=signup&interval=monthly&ref=blog-end"
      prefetch={false}
      onClick={() => trackEvent("blog_cta_click", { placement: "article_end", cta_target: "signup", article: slug, locale })}
      className={className}
    >
      {label}
      <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}
