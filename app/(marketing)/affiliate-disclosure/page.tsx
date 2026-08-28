import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How GEO Toolbox uses affiliate links, how we keep recommendations honest, and how a commission never changes our verdict.",
  alternates: { canonical: `${siteConfig.url}/affiliate-disclosure` },
}

export default function AffiliateDisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Affiliate Disclosure</h1>
      <p className="mt-2 text-sm text-gray-600">Last updated: June 26, 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">The short version</h2>
          <p className="mt-2">
            Some of the outbound links in our articles — to SEO, content, link-building, and
            related software — are affiliate links. If you click one and buy, GEO Toolbox may earn a
            commission. <strong className="text-gray-900">It costs you nothing extra</strong>, and a
            commission never changes whether we recommend a tool, where it ranks in a comparison, or
            what we say about its weaknesses.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">How we keep it honest</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              We only write a review or recommendation for a tool we have actually used or tested.
              See our{" "}
              <a href="/review-methodology" className="text-accent-700 underline hover:text-accent-800">
                review methodology
              </a>
              .
            </li>
            <li>
              Every comparison names trade-offs and a &quot;who should not buy this&quot; — including
              for tools that pay us the most.
            </li>
            <li>
              We link plenty of tools that have <em>no</em> affiliate program (for example, Ahrefs)
              when they are the right answer.
            </li>
            <li>
              We never put an affiliate link to a product that competes with GEO Toolbox.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">How the links work</h2>
          <p className="mt-2">
            Affiliate links route through our own <code>/go/</code> redirect so we can keep them
            current and measure clicks. They are tagged <code>rel=&quot;sponsored&quot;</code>{" "}and
            open in a new tab, in line with Google&apos;s guidance for qualifying paid and affiliate
            links. These redirects are excluded from search indexing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">FTC &amp; advertising standards</h2>
          <p className="mt-2">
            This disclosure exists so our relationship with the products we mention is clear, as
            required by the U.S. Federal Trade Commission&apos;s endorsement guidelines and
            equivalent advertising standards elsewhere. Where a post contains affiliate links, it
            also carries a short disclosure near the top, before the first such link.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
          <p className="mt-2">
            Email{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">
              samy@geotoolbox.ai
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
