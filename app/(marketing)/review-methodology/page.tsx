import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Review Methodology",
  description:
    "How GEO Toolbox tests and reviews the SEO, content, and link-building tools it recommends — what we run, what we measure, and how we stay independent.",
  alternates: { canonical: `${siteConfig.url}/review-methodology` },
}

export default function ReviewMethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Review Methodology</h1>
      <p className="mt-2 text-sm text-gray-600">Last updated: June 26, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <p>
            GEO Toolbox is run by an SEO agency operator who uses these tools on live client work.
            Our reviews and comparisons are written from hands-on use, not from a vendor&apos;s
            pricing page. This page explains how we test, so you can judge the recommendations for
            yourself.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">What we do before publishing a review</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong className="text-gray-900">We use the tool.</strong> Every tool we review gets a
              real account (trial or paid) and a real task — a benchmark query set, a live page to
              optimize, an outreach campaign, or an export we can inspect.
            </li>
            <li>
              <strong className="text-gray-900">We capture evidence.</strong> Screenshots, exported
              reports, and the specific inputs we ran, so claims are checkable rather than asserted.
            </li>
            <li>
              <strong className="text-gray-900">We verify pricing on the day.</strong> Prices and
              plan limits are confirmed against the vendor&apos;s site and dated. We re-check on
              update.
            </li>
            <li>
              <strong className="text-gray-900">We state who should not buy it.</strong> Every review
              names the cases where a tool is the wrong choice.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">How we score and compare</h2>
          <p className="mt-2">
            Roundups weigh tools on fit for the job in the article&apos;s title — not on what they pay.
            When a tool we can&apos;t fully test still belongs in a comparison, we mark it as a
            reference mention rather than a tested review, and say so.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Independence</h2>
          <p className="mt-2">
            Some links are affiliate links — see our{" "}
            <a href="/affiliate-disclosure" className="text-accent-700 underline hover:text-accent-800">
              affiliate disclosure
            </a>
            . A commission never decides our verdict or ordering, we include strong tools with no
            affiliate program when they win, and we never recommend a product that competes with GEO
            Toolbox. If we ever get something wrong, email{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">
              samy@geotoolbox.ai
            </a>{" "}
            and we&apos;ll fix it.
          </p>
        </section>
      </div>
    </div>
  )
}
