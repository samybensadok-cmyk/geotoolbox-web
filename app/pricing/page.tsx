import type { Metadata } from "next"
import Link from "next/link"
import { PricingCards } from "@/components/pricing/pricing-cards"
import { ComparisonTable } from "@/components/pricing/comparison-table"
import { FeatureFaq } from "@/components/features/feature-faq"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PLANS } from "@/lib/plans"

export const metadata: Metadata = {
  title: "Pricing — GEO Toolbox",
  description:
    "Simple, credit-based pricing for AI visibility tracking. Start free with 1,000 credits, no card. Paid plans from $49/mo across all 7 AI engines.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "GEO Toolbox Pricing",
    description:
      "Track your brand across ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Bing Copilot and Grok. Free plan, paid from $49/mo.",
    url: "/pricing",
    type: "website",
  },
}

const ENGINES = [
  "ChatGPT",
  "Perplexity",
  "Google AI Overviews",
  "Gemini",
  "Bing Copilot",
  "Claude",
  "Grok",
]

const FAQ = [
  {
    question: "What is a credit and how do credits get used?",
    answer:
      "A credit is the unit you spend each time we check one prompt on one AI engine, or run a one-off analysis like a content grade. Lighter engines cost about one credit per check; heavier ones, such as Google AI Overviews, cost a little more. Your live usage meter in the app shows exactly what every scan costs, so there are no surprises.",
  },
  {
    question: "What happens when I run out of credits?",
    answer:
      "Automated scans pause until your next billing cycle, when your monthly credits refill. If you need more before then, you can buy a one-time credit top-up pack, or upgrade to a higher plan. Nothing is deleted and your history stays intact.",
  },
  {
    question: "Do unused credits roll over?",
    answer:
      "No. Credits refresh at the start of each billing cycle and do not carry over, so plans are sized to give you comfortable monthly headroom. If your usage is spiky, a top-up pack is the simplest way to cover a busy month.",
  },
  {
    question: "Which AI engines do you track, and which plans unlock all of them?",
    answer:
      "We track seven: ChatGPT, Perplexity, Google AI Overviews, Gemini, Bing Copilot, Claude and Grok. Free covers ChatGPT, Starter adds Perplexity and Google AI Overviews, Consultant lets you pick 3 of 5, Agency picks 5 of all 7, and Scale and Enterprise run all seven.",
  },
  {
    question: "What is the difference between a brand and a prompt?",
    answer:
      "A brand is a domain you track. Prompts are the questions you want checked for that brand, like \"best AI visibility tool\" or \"how to track ChatGPT citations.\" Each plan includes a set number of brands and a set number of prompts per brand.",
  },
  {
    question: "How often are my prompts scanned, and can I run a scan on demand?",
    answer:
      "Free scans monthly, and all paid plans scan weekly. Daily automated scanning is available as a paid add-on on Scale and Enterprise. You can also trigger a manual scan any time on any plan; on-demand scans draw from your credit balance like any other check.",
  },
  {
    question: "Can I add more domains, prompts, or seats without changing plans?",
    answer:
      "Credit top-up packs let you add capacity without upgrading. Brand, prompt, seat and engine limits are tied to your plan tier, so growing past them means moving up a plan, or contacting us for a custom Enterprise setup.",
  },
  {
    question: "Do I need a credit card to start, and how does annual billing work?",
    answer:
      "No card is required for the free plan. Paid plans bill monthly or annually; annual saves about 17% (roughly two months free) and you can cancel any time.",
  },
]

export default function PricingPage() {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Pricing", item: `${siteConfig.url}/pricing` },
    ],
  }

  const priced = PLANS.filter((p) => p.priceMonthly !== null).map((p) => p.priceMonthly as number)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    description: siteConfig.description,
    url: `${siteConfig.url}/pricing`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    publisher: { "@id": `${siteConfig.url}/#organization` },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: String(Math.min(...priced)),
      highPrice: String(Math.max(...priced)),
      offerCount: PLANS.length,
    },
  }

  return (
    <>
      <JsonLd data={[breadcrumb, productSchema]} />

      {/* Hero + cards */}
      <section className="bg-white px-6 pt-16 pb-12 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Pricing</p>
          <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
            See what AI search says about your brand
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            Credit-based plans that scale from a single brand to a full agency portfolio. Start free with 1,000 credits, no card required.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-7xl">
          <PricingCards />
        </div>

        <div className="mx-auto mt-6 max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row">
            <p className="text-[14px] text-gray-700">
              <span className="font-semibold text-gray-900">Just exploring?</span> The Free plan gives you 1,000 credits a month of ChatGPT tracking, no credit card.
            </p>
            <Link
              href={siteConfig.appSignupUrl}
              prefetch={false}
              className="shrink-0 rounded-full border border-gray-300 px-5 py-2 text-[14px] font-semibold text-gray-900 transition-colors hover:border-gray-400 hover:bg-white"
            >
              Start free
            </Link>
          </div>
        </div>
      </section>

      {/* How credits work — the make-or-break explainer */}
      <section className="border-t border-gray-100 bg-accent-50/40 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-bold tracking-tight text-gray-900">
              How credits work
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
              One pool of credits powers everything — automated tracking, one-off scans, and content tools — so you are never juggling separate limits. Spend them however suits your work that month.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                t: "Spent per check",
                d: "A credit is used each time we check one prompt on one engine, or run an analysis. Track a 10-prompt brand across five engines weekly and you are in the low thousands of credits a month.",
              },
              {
                t: "Heavier engines cost more",
                d: "Lightweight model checks cost about a credit each; richer sources like Google AI Overviews cost a little more. The in-app meter shows the exact cost before and after every scan.",
              },
              {
                t: "Refills monthly, top up anytime",
                d: "Credits reset at the start of each billing cycle. Need more in a busy month? Buy a one-time top-up pack instead of jumping a whole tier.",
              },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="text-[15px] font-bold text-gray-900">{c.t}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engine trust bar */}
      <section className="border-t border-gray-100 bg-white px-6 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Tracked across every major AI engine
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {ENGINES.map((e) => (
              <li key={e} className="text-[14px] font-semibold text-gray-700">
                {e}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Full comparison */}
      <ComparisonTable />

      {/* Enterprise band */}
      <section className="bg-gray-950 px-6 py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-400">Enterprise</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">For large teams and portfolios</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-300">
              Custom credit volumes, unlimited brands and prompts, premium models, API &amp; MCP access (coming soon), SSO, a dedicated CSM, and a 4-hour support SLA — on a contract that fits your security and procurement needs.
            </p>
          </div>
          <Link
            href="/contact?topic=enterprise"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-gray-100"
          >
            Talk to sales
          </Link>
        </div>
      </section>

      <FeatureFaq items={FAQ} heading="Pricing questions" />

      {/* Final CTA */}
      <section className="border-t border-gray-100 bg-white px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[clamp(1.6rem,3vw,2.5rem)] font-bold tracking-tight text-gray-900">
            Start free in under two minutes
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-gray-600">
            1,000 credits, no credit card. Upgrade only when you are ready to track more brands across all seven engines.
          </p>
          <Link
            href={siteConfig.appSignupUrl}
            prefetch={false}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-accent-900 px-8 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25"
          >
            Start free
          </Link>
        </div>
      </section>
    </>
  )
}
