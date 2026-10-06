import { ServiceExperience } from "@/components/services/service-experience"
import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats } from "@/lib/proof-stats"

const PAGE_URL = `${siteConfig.url}/services/answer-engine-optimization`
// Every CTA books a call — no free-tool CTA, no self-serve tier on this page.
const CALL_HREF = "https://calendly.com/samy-bensadok/30min-call"
// The $1,250 Report is a direct purchase — same live Stripe checkout handler
// as the flagship /services/ai-seo-agency page.
const CHECKOUT_REPORT = "/app/?action=service_checkout&item=report"

export const metadata: Metadata = {
  // Base title 34 chars — template suffix "| GEO Toolbox" keeps total ≤60.
  title: "Answer Engine Optimization Service",
  description:
    "Done-for-you AEO by the founder who built the tracker: your pages restructured to win the extracted answer — featured snippets, People Also Ask, AI Overview answer slots and voice — with the slot presence reported monthly.",
  openGraph: {
    title: "Answer Engine Optimization, Done For You By The Founder",
    description:
      "When your buyer asks the question, one block of text gets picked as the answer. We restructure your pages to make that block yours — and report the answer-slot presence monthly.",
  },
  alternates: { canonical: PAGE_URL },
}

// What AEO is / isn't — the category-definition rows this page exists to own.
const definitionRows = [
  {
    num: "01",
    title: "AEO is winning the extracted answer.",
    body: "Featured snippets, People Also Ask, the answer slot inside an AI Overview, the answer a voice assistant reads aloud — one passage gets picked and shown as the answer. Answer engine optimization is the work of structuring your pages so that passage is yours for the questions your buyers ask.",
  },
  {
    num: "02",
    title: "It is not classic SEO — it sits above it.",
    body: "SEO competes for ten ranked links; AEO competes for the single slot above them. The overlap is real — you usually need page-one relevance before an engine will extract you — but the scoreboard is different: answer-slot presence per question, not just position.",
  },
  {
    num: "03",
    title: "It is not GEO either.",
    body: "Generative engine optimization targets the composed answer an AI writes across several cited sources — ChatGPT, Perplexity, Gemini, Copilot. AEO targets the single extracted block. The two jobs meet inside AI Overviews, which both cite sources and extract blocks; we run both, measured separately.",
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
    summary: "The full baseline: the answer slots in your market, who owns them, and the pages worth building.",
    detail:
      "A one-off diagnostic that maps the buying-intent questions in your market, whose text owns each answer slot today, and the specific pages to restructure or build.",
    cta: { label: "Buy the Report — $1,250", href: CHECKOUT_REPORT },
    kind: "buy",
    chip: "One-off",
  },
  {
    name: "30-Day AI Visibility Sprint",
    pricePrefix: "From",
    price: "$6,500",
    billing: "One-off · scoped to project size",
    summary: "Thirty days of building: fixes shipped, priority pages restructured to be extracted.",
    detail:
      "Technical fixes, your priority pages restructured into extractable answers with the schema and structure engines look for. Scope and price depend on your site's size — we set both on the call. The Sprint counts as month one if you continue on a retainer within 30 days.",
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
    summary: "The compounding version: new answer-ready pages, new questions, tracked every month.",
    detail:
      "Continuous AEO, GEO and SEO work — new extractable pages, more buying-intent questions taken one by one, and the monthly report. Then month to month.",
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
      "For teams treating AI answers as a primary channel: weekly cadence, more priority pages restructured to be extracted per month, and multi-market tracking. One brand, maximum push.",
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

const faqs = [
  {
    question: "What exactly is answer engine optimization?",
    answer:
      "The work of winning the extracted answer: the featured snippet, the People Also Ask box, the answer slot inside an AI Overview, the answer a voice assistant reads aloud. An engine picks one passage to show as the answer to a question — AEO structures your pages so that passage is yours. Full definition: geotoolbox.ai/blog/what-is-answer-engine-optimization.",
  },
  {
    question: "How is AEO different from SEO?",
    answer:
      "SEO competes for ten ranked links a human might click; AEO competes for the single answer slot above them. You usually need page-one relevance before an engine will extract you — so the work overlaps — but the scoreboard is different: answer-slot presence per question. A client guide we worked on sat at organic position 5–6 in the US while featured in Google's AI Overview — the slot, not the rank, is what the buyer reads.",
  },
  {
    question: "How is AEO different from GEO?",
    answer:
      "GEO targets the composed answer an AI writes across several cited sources — ChatGPT, Perplexity, Gemini, Copilot. AEO targets the single block an engine lifts verbatim — snippets, People Also Ask, the AI Overview answer slot, voice. If your market's questions get a one-passage answer, AEO is the lever; if they get a synthesized multi-source answer, GEO is; AI Overviews reward both. We run them as separate, separately measured services.",
  },
  {
    question: "How do you measure AEO?",
    answer:
      "AI Overview presence with the cross-engine tracker I built (geotoolbox.ai); featured snippet and People Also Ask slots with standard SERP tracking. Your monthly report lists each target question, the surface, who owns the slot, and the deltas. A log, not an estimate.",
  },
  {
    question: "How long until I win answer slots?",
    answer: `Slots turn over faster than rankings — a page that already ranks can win a snippet with a restructure — but nothing honest happens in days. Plan on first tracked movement in 4–8 weeks; our own zero-authority test domain took about ${proofStats.weeksToResult} weeks to meaningful visibility, and an established site moves faster. Week one you get the baseline.`,
  },
  {
    question: "Why hire the founder instead of an agency?",
    answer:
      "I built GEO Toolbox — the platform used to measure AI visibility — and I lead the work on your account, with a small senior team on delivery. Not a strategist handing off to a junior: the founder who built the measurement tool, in the code of your pages.",
  },
]

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Answer Engine Optimization Service",
  description:
    "Done-for-you answer engine optimization from a small founder-led team led by Samy Ben Sadok, founder of GEO Toolbox: priority pages restructured to win featured snippets, People Also Ask, AI Overview answer slots and voice answers, with answer-slot presence reported monthly.",
  url: PAGE_URL,
  areaServed: "Worldwide",
  serviceType: ["Answer Engine Optimization", "AI Search Visibility"],
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
      description: "One-off diagnostic mapping buying-intent questions, current answer-slot owners, and the pages to build.",
    },
    {
      "@type": "Offer",
      name: "30-Day AI Visibility Sprint",
      description: "Thirty days of technical fixes and priority pages restructured to be extracted. From $6,500, scoped to project size.",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: "6500",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "Offer",
      name: "Ongoing GEO + SEO Growth",
      description: "Continuous AEO, GEO and SEO work with a monthly report. From $5,000/mo, 90-day initial commitment.",
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
      description: "Weekly-cadence AEO + GEO + SEO retainer: more extractable pages per month plus multi-market tracking. From $7,500/mo, 90-day initial commitment.",
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
        "Multi-brand or enterprise AEO + GEO + SEO retainer: weekly cadence, multi-market tracking, priority build capacity. From $10,000/mo, scoped on a call.",
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

export default function AeoServicePage() {
  return <>
    <JsonLd data={serviceSchema} />
    <ServiceExperience
      eyebrow="Answer engine optimization"
      title="Make your expertise" accent="easier to find and quote."
      description="Done-for-you AEO for featured snippets, People Also Ask and AI answers. We turn priority pages into clear, structured answers and track their presence." callHref={CALL_HREF}
      offers={tiers} faqs={faqs} context={definitionRows}
      steps={[{"title": "Find the answer opportunities", "body": "Map buyer questions, current answer placements and the pages that can compete.", "output": "Answer-opportunity baseline"}, {"title": "Restructure your answers", "body": "Improve question headings, answer passages and relevant schema on priority pages.", "output": "Answer-ready pages"}, {"title": "Track the placements", "body": "Measure AI Overview presence with our tracker, and snippet and People Also Ask placements through SERP tracking.", "output": "Monthly placement report"}]}
    >

    </ServiceExperience>
  </>
}
