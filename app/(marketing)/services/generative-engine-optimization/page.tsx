import { ServiceExperience } from "@/components/services/service-experience"
import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats } from "@/lib/proof-stats"

const PAGE_URL = `${siteConfig.url}/services/generative-engine-optimization`
const CALL_HREF = "https://calendly.com/samy-bensadok/30min-call"
// The $1,250 Report, the Flagship citable article, and the Content cluster
// sprint are direct purchases — same live Stripe checkout handler as the
// flagship /services/ai-seo-agency page. Everything else books a call.
const CHECKOUT_REPORT = "/app/?action=service_checkout&item=report"
const CHECKOUT_ARTICLE = "/app/?action=service_checkout&item=article"
const CHECKOUT_CLUSTER_SPRINT = "/app/?action=service_checkout&item=cluster_sprint"

export const metadata: Metadata = {
  // Base title 38 chars — template suffix "| GEO Toolbox" keeps total ≤60.
  title: "Generative Engine Optimization Service",
  description:
    "Done-for-you GEO by the founder who built the tracker: your pages rebuilt to be cited inside ChatGPT, Perplexity, Gemini, Copilot and AI Overviews answers — proved monthly with cross-engine citation logs.",
  openGraph: {
    title: "Generative Engine Optimization, Done For You By The Founder",
    description:
      "AI engines compose the answer your buyer reads and cite a handful of sources. My team and I rebuild your pages to be one of them — and prove it monthly with the citation tracker I built.",
  },
  alternates: { canonical: PAGE_URL },
}

// What GEO is / isn't — the category-definition rows this page exists to own.
const definitionRows = [
  {
    num: "01",
    title: "GEO is getting cited inside the composed answer.",
    body: "When ChatGPT, Perplexity, Gemini, Copilot or Google's AI Overviews write an answer, they pull from a handful of sources and name them. Generative engine optimization is the work of becoming one of those named sources for the prompts your buyers actually ask.",
  },
  {
    num: "02",
    title: "It is not classic SEO — and it doesn't replace it.",
    body: "SEO earns a ranking a human might click. GEO earns a citation inside the answer the human reads instead of clicking. The overlap is real — clean structure and verifiable claims lift both — but the scoreboard is different: citations per prompt per engine, not positions.",
  },
  {
    num: "03",
    title: "It is not AEO either.",
    body: "Answer engine optimization targets the extracted block — the featured snippet, People Also Ask, the answer slot inside an AI Overview, the voice answer. GEO targets the synthesized answer an AI composes across cited sources. The two jobs meet inside AI Overviews, which both cite sources and extract blocks; we run both, measured separately.",
  },
]

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
      "A one-off diagnostic that maps the buying-intent prompts in your market, who gets cited today across the AI engines, and the specific pages to build.",
    cta: { label: "Buy the Report — $1,250", href: CHECKOUT_REPORT },
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
    cta: { label: "Book a call", href: CALL_HREF },
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
    summary: "The compounding version: new citable pages, new prompts, tracked every month.",
    detail:
      "Continuous GEO and SEO work — new citable pages, more buying-intent prompts taken one by one, and the monthly tracker report. Then month to month.",
    cta: { label: "Book a call", href: CALL_HREF },
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
    cta: { label: "Book a call", href: CALL_HREF },
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
    cta: { label: "Book a call", href: CALL_HREF },
    kind: "call",
    chip: "Retainer",
  },
]

// À-la-carte add-ons — fixed unit prices; single-sourced on the AI SEO agency
// page conceptually — keep the two lists identical when editing either.
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
      `The exact pipeline behind our own blog — ~${proofStats.aiCitations.total.toLocaleString("en-US")} AI-citation appearances in a trailing ${proofStats.aiCitations.windowDays}-day Bing sample. One revenue keyword per article: AI research depth (multi-engine fact panel, SERP and competitor analysis), human editorial gates on every claim. 48-hour minimum turnaround — the QA is not skippable — then tracked for 90 days.`,
    cta: { label: "Buy — $450", href: CHECKOUT_ARTICLE },
  },
  {
    name: "Content cluster sprint",
    price: "$3,500",
    unit: "10–12 articles, 30 days",
    detail:
      "A full topic cluster plus hub — the exact playbook behind our own blog — interlinked, fact-checked, and tracked from day one.",
    cta: { label: "Buy — $3,500", href: CHECKOUT_CLUSTER_SPRINT },
  },
]

const faqs = [
  {
    question: "What exactly is generative engine optimization?",
    answer:
      "The work of getting your pages cited inside the answers AI engines compose — ChatGPT, Perplexity, Gemini, Copilot, Google's AI Overviews. When an engine writes an answer it pulls from a handful of sources and names them; GEO makes you one of those named sources for the prompts your buyers ask. Full definition: geotoolbox.ai/blog/what-is-geo.",
  },
  {
    question: "How is GEO different from SEO?",
    answer: `SEO earns a ranking a human might click; GEO earns a citation inside the answer the human actually reads. The work overlaps more than the names suggest — our test domain put ${proofStats.google.rankedKeywords.toLocaleString("en-US")} keywords into Google while chasing citations — but the measurement is different: citations per prompt per engine, not positions. A normal SEO report has no column for it.`,
  },
  {
    question: "How is GEO different from AEO?",
    answer:
      "AEO targets the extracted block — the featured snippet, People Also Ask, the AI Overview answer slot, the voice answer: one passage lifted verbatim. GEO targets the composed answer an AI writes across several cited sources. If your market's questions get answered by AI chat, GEO is the lever; if they get answered by a snippet, AEO is; AI Overviews reward both. We run them as separate, separately measured services.",
  },
  {
    question: "How do you measure GEO?",
    answer:
      "With the cross-engine tracker I built (geotoolbox.ai). It queries the real engines with the real prompts your buyers use and logs who's cited, where, how often. Your monthly report is its raw output — prompts, engines, citations, deltas. A log, not an estimate.",
  },
  {
    question: "How long until an engine cites me?",
    answer: `Our own zero-authority domain took about ${proofStats.weeksToResult} weeks to first meaningful citations. Your site has age and authority ours didn't; your market has competition ours didn't — plan on first tracked movement in 4–8 weeks, compounding after. Week one you get the baseline. If someone promises AI citations in days, ask to see their tracking.`,
  },
  {
    question: "Why hire the founder instead of a GEO agency?",
    answer:
      "I built GEO Toolbox — the platform used to measure AI visibility — and I lead the work on your account, with a small senior team on delivery. Not a strategist handing off to a junior: the founder who built the measurement tool, in the code of your pages.",
  },
]

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Generative Engine Optimization Service",
  description:
    "Done-for-you generative engine optimization from a small founder-led team led by Samy Ben Sadok, founder of GEO Toolbox: priority pages rebuilt to be cited inside ChatGPT, Perplexity, Gemini, Copilot and AI Overviews answers, measured monthly with a cross-engine citation tracker.",
  url: PAGE_URL,
  areaServed: "Worldwide",
  serviceType: ["Generative Engine Optimization", "AI Search Visibility"],
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
      description: "One-off diagnostic mapping buying-intent prompts, current AI citations, and the pages to build.",
    },
    {
      "@type": "Offer",
      name: "30-Day AI Visibility Sprint",
      description: "Thirty days of technical fixes and priority pages rebuilt to be citable. From $6,500, scoped to project size.",
      priceSpecification: {
        "@type": "PriceSpecification",
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

export default function GeoServicePage() {
  return <>
    <JsonLd data={serviceSchema} />
    <ServiceExperience
      eyebrow="Generative engine optimization"
      title="Become a source" accent="AI answers can cite."
      description="Done-for-you GEO for the prompts your buyers use. We find citation gaps, improve your pages and measure changes across AI engines." callHref={CALL_HREF}
      offers={tiers} faqs={faqs} addons={addons} context={definitionRows}
      steps={[{"title": "Map the citation gap", "body": "See which sources AI engines cite for your buyer prompts and where your brand is missing.", "output": "Cross-engine baseline"}, {"title": "Build citable pages", "body": "Improve priority pages with clear answers, verifiable claims and relevant sources.", "output": "Rebuilt priority content"}, {"title": "Measure each engine", "body": "Track citation gains and losses across prompts, with a monthly record of changes.", "output": "Monthly citation log"}]}
    >

    </ServiceExperience>
  </>
}
