"use client"

import { NewsletterSignup } from "@/components/newsletter/newsletter-signup"

/**
 * SG_TOOL_CAPTURE_V1 (2026-09-01) — the free tools stop being a dead end.
 *
 * The ten `/tools/*` utilities are the only place a prospect experiences the
 * product working: real checks, on their own domain, with no signup, no email
 * gate and no trial clock. That is deliberate and stays. But until today a
 * visitor ran the Agent Readiness scan, got a genuine score, and left behind
 * nothing at all — no email, and no reason to come back. Meanwhile the blog,
 * which sends ~1,400 organic clicks a month, now routes its mid-article CTA
 * here (SG_BLOG_CTA_V2), so this is where that traffic lands.
 *
 * Renders only AFTER a result exists, so the ask follows the value rather than
 * gating it.
 *
 * ⚠️ Honesty: this subscribes to the newsletter — a double-opt-in list that
 * emails when we publish. It does NOT promise a scheduled re-check of this
 * score: nothing on the backend re-runs these tools on a schedule for an
 * anonymous address, and the copy must not promise what no cron delivers. If a
 * re-check job is ever built, change the copy then, not before.
 *
 * The tools live under app/(marketing)/tools, outside the next-intl `[locale]`
 * tree (verified live 2026-09-01: `/fr/tools/ai-readiness` 404s), so the copy
 * is EN-only by construction — same as every other string on these pages.
 */
export function ToolResultCapture({
  slug,
  what,
}: {
  /** tool slug — becomes the `source` attribution tag, e.g. "tool:ai-readiness" */
  slug: string
  /**
   * What the reader just got, as a lowercase noun phrase: "readiness score",
   * "prompt set", "sitemap report". Kept neutral on purpose — an earlier draft
   * said the result "reflects how AI engines read your site", which is wrong
   * for the two tools that take a keyword or a query rather than a domain.
   */
  what: string
}) {
  return (
    <div className="mt-8">
      <NewsletterSignup
        source={`tool:${slug}`}
        title="AI search moves fast. This will look different in a month."
        description={`Your ${what} is a snapshot of how AI search works today. We send one email when we publish something worth reading about what changed — no spam, unsubscribe anytime.`}
      />
    </div>
  )
}
