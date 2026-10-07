import { ServiceExperience } from "@/components/services/service-experience"
import type { Metadata } from "next"
import { Suspense } from "react"
import { CheckoutStatusBanner } from "@/components/services/checkout-status-banner"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats } from "@/lib/proof-stats"

const PAGE_URL = `${siteConfig.url}/services/ai-seo-agency`
// Every call books an intro/teardown call — no free-tool CTA anywhere on this page.
const TEARDOWN_HREF = "https://calendly.com/samy-bensadok/30min-call"
// The $1,250 Report, the Flagship citable article, and the Content cluster
// sprint are direct purchases — wired to the live Stripe checkout endpoint
// (Vercel rewrites /app/* to the Replit app; the handler 303-redirects to
// Stripe Checkout). The 30-Day Sprint/retainer stay book-a-call (variable scope).
const CHECKOUT = {
  report: "/app/?action=service_checkout&item=report",
  article: "/app/?action=service_checkout&item=article",
  clusterSprint: "/app/?action=service_checkout&item=cluster_sprint",
}

export const metadata: Metadata = {
  title: "Done-For-You AI SEO & GEO Service",
  description:
    "I built GEO Toolbox — the platform used to measure AI visibility — and my team and I do the work ourselves. Priority pages rebuilt to get cited in ChatGPT, Perplexity and Copilot, proved monthly with our own tracker. A small founder-led team, not a faceless agency.",
  openGraph: {
    title: "Done-For-You AI SEO & GEO, By The Founder Who Built The Tracker",
    description:
      "I built the platform the industry uses to measure AI visibility — and my team and I rebuild your pages to get cited in ChatGPT, Perplexity and Copilot, proved monthly. A small founder-led team, not a faceless agency.",
  },
  alternates: { canonical: PAGE_URL },
}

type Tier = {
  name: string
  pricePrefix?: string
  price: string
  cadence?: string
  billing: string
  summary: string
  detail: string
  cta: { label: string; href: string }
  // kind drives the CTA style; chip is the billing label (the one-off Sprint
  // books a call, so the two can't be derived from each other).
  kind: "buy" | "call"
  chip: "One-off" | "Retainer"
  featured?: boolean
}

const tiers: Tier[] = [
  {
    name: "AI + SEO Visibility Report",
    price: "$1,250",
    billing: "One-off",
    summary: "The full AI + SEO baseline: prompts, engines, competitors, and the pages worth building.",
    detail:
      "A one-off diagnostic that maps the buying-intent prompts in your market, who gets cited today, and the specific pages to build.",
    cta: { label: "Buy the Report — $1,250", href: CHECKOUT.report },
    kind: "buy",
    chip: "One-off",
  },
  {
    name: "30-Day AI Visibility Sprint",
    pricePrefix: "From",
    price: "$6,500",
    billing: "One-off · scoped to project size",
    summary: "Thirty days of building: fixes shipped, priority pages rebuilt to be cited.",
    detail:
      "Technical fixes, your priority pages rebuilt to be citable, and the citation and source work that gets an engine to quote you. Scope and price depend on your site's size — we set both on the call. The Sprint counts as month one if you continue on a retainer within 30 days.",
    cta: { label: "Book a call", href: TEARDOWN_HREF },
    kind: "call",
    chip: "One-off",
    featured: true,
  },
  {
    name: "Ongoing GEO + SEO Growth",
    pricePrefix: "From",
    price: "$5,000",
    cadence: "/mo",
    billing: "90-day initial commitment",
    summary: "The compounding version: new pages, new prompts, tracked every month.",
    detail:
      "Continuous GEO and SEO work — new citable pages, more buying-intent prompts taken one by one, and the monthly tracker report. Then month to month.",
    cta: { label: "Book a call", href: TEARDOWN_HREF },
    kind: "call",
    chip: "Retainer",
  },
  {
    name: "Priority Growth",
    pricePrefix: "From",
    price: "$7,500",
    cadence: "/mo",
    billing: "90-day initial commitment",
    summary: "Everything in Growth, at a faster cadence — weekly builds, more pages taken each month.",
    detail:
      "For teams treating AI search as a primary channel: weekly cadence, more priority pages rebuilt per month, and multi-market tracking. One brand, maximum push.",
    cta: { label: "Book a call", href: TEARDOWN_HREF },
    kind: "call",
    chip: "Retainer",
  },
  {
    name: "Scale Retainer",
    pricePrefix: "From",
    price: "$10,000",
    cadence: "/mo",
    billing: "Multi-brand / enterprise · scoped on a call",
    summary: "Multi-brand or enterprise — weekly cadence, multi-market, priority build capacity.",
    detail:
      "For agencies, portfolios, or companies past $20M revenue running several brands. Weekly cadence, multi-market tracking, and priority build capacity across brands — scoped on a call.",
    cta: { label: "Book a call", href: TEARDOWN_HREF },
    kind: "call",
    chip: "Retainer",
  },
]

// À-la-carte add-ons — fixed unit prices so a Sprint or retainer extends
// without repricing the base. Single-sourced here; the GEO service page
// carries the same list — mirror any change there.
const addons = [
  {
    name: "Authority placements",
    price: "From $450",
    unit: "per secured placement",
    detail:
      "A mention or citation on a source AI engines actually quote in your market — sourced, negotiated, verified live before it's billed. Priced by niche: competitive verticals (finance, crypto, legal) run higher.",
  },
  {
    name: "Citable page pack",
    price: "$1,500",
    unit: "per 5 pages",
    detail:
      "Five additional pages written and structured to be quotable — entities, sources, schema — and interlinked with the pages you already rank with.",
  },
  {
    name: "Additional market",
    price: "From $500",
    unit: "/mo per market",
    detail:
      "Tracker coverage plus a localized content cadence in any of the 29 markets the platform measures.",
  },
  {
    name: "White-label delivery",
    price: "From $2,000",
    unit: "/mo",
    detail:
      "We run the campaigns under your brand — delivery, dashboards and reports included. Our platform and process, your client relationship.",
  },
  {
    name: "Flagship citable article",
    price: "$450",
    unit: "per article",
    detail:
      `The exact pipeline behind our own blog — ~${proofStats.aiCitations.total.toLocaleString("en-US")} AI-citation appearances in Bing’s AI Performance sample over ${proofStats.aiCitations.windowLabel}. One revenue keyword per article: AI research depth (multi-engine fact panel, SERP and competitor analysis), human editorial gates on every claim. 48-hour minimum turnaround — the QA is not skippable — then tracked for 90 days.`,
    cta: { label: "Buy — $450", href: CHECKOUT.article },
  },
  {
    name: "Content cluster sprint",
    price: "$3,500",
    unit: "10–12 articles, 30 days",
    detail:
      "A full topic cluster plus hub — the exact playbook behind our own blog — interlinked, fact-checked, and tracked from day one.",
    cta: { label: "Buy — $3,500", href: CHECKOUT.clusterSprint },
  },
]

const faqs = [
  {
    question: "How is this different from regular SEO?",
    answer: `Regular SEO earns a ranking a human might click. This earns a citation inside the answer the human actually reads — in ChatGPT, Perplexity, Copilot and AI Overviews. The overlap: good GEO work also lifts classic rankings (our test domain put ${proofStats.google.rankedKeywords.toLocaleString("en-US")} keywords into Google while chasing citations). The difference: a normal SEO can't hand you an AI-citation report. I built the platform that produces one.`,
  },
  {
    question: "How long until results?",
    answer:
      `Our own zero-authority domain took about ${proofStats.weeksToResult} weeks to first meaningful citations. Your site has age and authority ours didn't; your market has competition ours didn't — plan on first tracked movement in 4–8 weeks, compounding after. What you get in week one: the baseline. If someone promises AI citations in days, ask to see their tracking.`,
  },
  {
    question: "How do you measure it?",
    answer:
      "With the cross-engine tracker I built (geotoolbox.ai). It queries the real engines with the real prompts your buyers use and logs who's cited, where, how often. Your monthly report is its raw output — prompts, engines, citations, deltas. A log, not an estimate.",
  },
  {
    question: "What if it doesn't work?",
    answer:
      "The tracker will say so, the same month we see it — that's the deal with reporting from a measurement tool instead of a slide deck. Growth has a 90-day initial commitment, then runs month to month. The baseline is yours to keep. We can't guarantee an LLM's output — anyone who does is lying — but you'll always know exactly what you got for the money.",
  },
  {
    question: "Why you and not a big agency?",
    answer:
      "I built GEO Toolbox — the platform the industry uses to measure AI visibility — and I lead the work on your account, with a small senior team on delivery. Not a strategist on a sales call handing off to a junior, not three departments: the founder who built the measurement tool, in the code of your pages. What you get: founder-level execution in the one channel where your problem lives.",
  },
  {
    question: "Is my industry too niche?",
    answer:
      "Niche is the best case. Fewer sources means the engines have fewer candidates to cite; one well-built, verifiable page can own an answer for months. The real qualifier isn't your industry — it's whether your buyers research before they buy.",
  },
]

// Minimal, valid Service node (no dedicated helper in lib/seo-schema). Typed as
// Service (not ProfessionalService) so serviceType/provider/offers validate cleanly.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Done-For-You AI SEO & GEO Service",
  description:
    "Done-for-you AI visibility and SEO from a small founder-led team led by Samy Ben Sadok, founder of GEO Toolbox: priority pages rebuilt to be cited in ChatGPT, Perplexity, Copilot and AI Overviews, measured monthly with a cross-engine citation tracker.",
  url: PAGE_URL,
  areaServed: "Worldwide",
  serviceType: ["Generative Engine Optimization", "AI Search Visibility", "SEO"],
  provider: {
    "@type": "Person",
    "@id": `${siteConfig.url}/author/${PRIMARY_AUTHOR.slug}#person`,
    name: PRIMARY_AUTHOR.name,
    url: `${siteConfig.url}/author/${PRIMARY_AUTHOR.slug}`,
    jobTitle: PRIMARY_AUTHOR.role,
    ...(PRIMARY_AUTHOR.avatar ? { image: `${siteConfig.url}${PRIMARY_AUTHOR.avatar}` } : {}),
  },
  offers: [
    {
      "@type": "Offer",
      name: "AI + SEO Visibility Report",
      price: "1250",
      priceCurrency: "USD",
      description: "One-off diagnostic mapping buying-intent prompts, current citations, and the pages to build.",
    },
    {
      "@type": "Offer",
      name: "30-Day AI Visibility Sprint",
      description: "Thirty days of technical fixes and priority pages rebuilt to be citable. From $6,500, scoped to project size.",
      priceSpecification: {
        "@type": "PriceSpecification",
        // Displayed as "from $6,500" — a floor, scoped on the call.
        minPrice: "6500",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "Offer",
      name: "Ongoing GEO + SEO Growth",
      description: "Continuous GEO and SEO work with a monthly citation report. From $5,000/mo, 90-day initial commitment.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        // Displayed as "from $5,000/mo" — represent as a floor, not an exact price.
        minPrice: "5000",
        priceCurrency: "USD",
        unitText: "MONTH",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: "1",
          unitText: "MONTH",
        },
      },
    },
    {
      "@type": "Offer",
      name: "Priority Growth",
      description: "Weekly-cadence GEO + SEO retainer: more priority pages per month plus multi-market tracking. From $7,500/mo, 90-day initial commitment.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        // Displayed as "from $7,500/mo" — a floor, not an exact price.
        minPrice: "7500",
        priceCurrency: "USD",
        unitText: "MONTH",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: "1",
          unitText: "MONTH",
        },
      },
    },
    {
      "@type": "Offer",
      name: "Scale Retainer",
      description:
        "Multi-brand or enterprise GEO + SEO retainer: weekly cadence, multi-market tracking, priority build capacity. From $10,000/mo, scoped on a call.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        // Displayed as "from $10,000/mo" — a floor, scoped on the call.
        minPrice: "10000",
        priceCurrency: "USD",
        unitText: "MONTH",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: "1",
          unitText: "MONTH",
        },
      },
    },
  ],
}

export default function AiSeoServicePage() {
  return <>
    <JsonLd data={serviceSchema} />
    <ServiceExperience
      eyebrow="AI SEO & GEO services"
      title="Get found in AI answers." accent="We do the work."
      description="We audit your visibility, rebuild priority pages and track what changes. Founder-led AI SEO and GEO, from a one-off report to ongoing delivery." callHref={TEARDOWN_HREF}
      offers={tiers} faqs={faqs} addons={addons}
      steps={[{"title": "See where you stand", "body": "A baseline of buyer prompts, competitors and citations identifies the pages to work on first.", "output": "Your visibility report"}, {"title": "Improve the pages that matter", "body": "We address technical barriers and rebuild priority content around the questions your buyers ask.", "output": "Your priority pages"}, {"title": "Track what changed", "body": "Monthly reporting shows citations gained and lost, by prompt and engine.", "output": "Your citation log"}]}
    >
      <Suspense fallback={null}><CheckoutStatusBanner /></Suspense>
    </ServiceExperience>
  </>
}
