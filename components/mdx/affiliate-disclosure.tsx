import type { ReactNode } from "react"

/**
 * FTC affiliate disclosure box for monetized posts. Drop `<AffiliateDisclosure />`
 * at the top of an article, ABOVE the first affiliate link. Pass children to
 * override the default copy for a specific post.
 *
 * Registered in components/mdx/index.tsx so MDX can use it directly.
 */
export function AffiliateDisclosure({ children }: { children?: ReactNode }) {
  return (
    <aside
      className="my-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] leading-relaxed text-gray-600"
      role="note"
      aria-label="Affiliate disclosure"
    >
      <strong className="font-semibold text-gray-900">Affiliate disclosure.</strong>{" "}
      {children ?? (
        <>
          Some links below are affiliate links — if you buy through them, GEO Toolbox may earn a
          commission at no extra cost to you. We only recommend tools we&apos;ve actually tested, and
          a commission never changes our verdict. See our{" "}
          <a href="/review-methodology" className="text-accent-700 underline hover:text-accent-800">
            review methodology
          </a>{" "}
          and{" "}
          <a href="/affiliate-disclosure" className="text-accent-700 underline hover:text-accent-800">
            affiliate disclosure
          </a>
          .
        </>
      )}
    </aside>
  )
}
