import Link from "next/link"
import type { InlineCtaTarget } from "@/lib/inline-cta"

const variants: Record<InlineCtaTarget, { text: string; button: string; href: string }> = {
  "ai-readiness": {
    text: "Curious how your own site stacks up? Run the free AI-Readiness check — five live checks on your domain, no signup.",
    button: "Check your site free",
    href: "/tools/ai-readiness",
  },
  "content-analyzer": {
    text: "Want this analysis for your own pages? Content Analyzer grades any URL A–F across 21 AI-citability signals.",
    button: "Grade a page",
    href: "/features/content-analyzer",
  },
}

/**
 * Compact mid-article product band, injected at ~2/3 body depth by
 * lib/inline-cta.ts. One sentence + one button — deliberately lighter than
 * the page-closing "What's next" block so it doesn't compete with it.
 */
export function InlineCta({ target = "ai-readiness" }: { target?: InlineCtaTarget }) {
  const v = variants[target] ?? variants["ai-readiness"]
  return (
    <aside className="not-prose my-10 flex flex-col items-start gap-4 rounded-2xl border border-[var(--surface-mint-border)] bg-[var(--surface-mint)] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <p className="text-[14.5px] leading-relaxed text-gray-800">{v.text}</p>
      <Link
        href={v.href}
        prefetch={false}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-900 px-5 py-2.5 text-[13.5px] font-semibold text-white no-underline transition-all duration-200 hover:bg-accent-800 hover:shadow-lg hover:shadow-accent-900/20 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
      >
        {v.button}
        <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </aside>
  )
}
