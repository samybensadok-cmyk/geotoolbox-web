import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ProofResults } from "@/components/services/proof-results"
import { StickyServiceCta } from "@/components/services/sticky-cta"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats } from "@/lib/proof-stats"

const PAGE_URL = `${siteConfig.url}/services/answer-engine-optimization`
// Every CTA books a call — no free-tool CTA, no self-serve tier on this page.
const CALL_HREF = "https://calendly.com/samy-bensadok/30min-call"
// The $925 Report is a direct purchase — same live Stripe checkout handler
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

type FlowRow = { num: string; verb: string; title: string; body: string; output: string }

const flow: FlowRow[] = [
  {
    num: "01",
    verb: "Audit",
    title: "A map of the answer slots in your market — and who owns each one today.",
    body: "Week one: which of your buyers' questions resolve in a featured snippet, People Also Ask box or AI Overview answer slot, and whose text sits in each one right now — yours, or a competitor's. You start from a measured gap, not a hunch.",
    output: "answer-slot baseline",
  },
  {
    num: "02",
    verb: "Build",
    title: "Your pages restructured into blocks an engine can lift verbatim.",
    body: "Question-shaped headings, direct answers in the first sentences, clean structure and schema — the format answer engines extract. The focus is the questions that sit closest to a purchase, not trivia — while your classic Google rankings hold.",
    output: "extractable priority pages",
  },
  {
    num: "03",
    verb: "Track",
    title: "Monthly slot reports: which questions, which surfaces, what changed.",
    body: "AI Overview presence from our own tracker; snippet and People Also Ask slots from standard SERP tracking. Slots won, slots lost, per question, with deltas. If a month is flat, the report says flat. Same numbers, both of us.",
    output: "monthly slot report",
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
    price: "$925",
    billing: "One-off",
    summary: "The full baseline: the answer slots in your market, who owns them, and the pages worth building.",
    detail:
      "A one-off diagnostic that maps the buying-intent questions in your market, whose text owns each answer slot today, and the specific pages to restructure or build.",
    cta: { label: "Buy the Report — $925", href: CHECKOUT_REPORT },
    kind: "buy",
    chip: "One-off",
  },
  {
    name: "30-Day AI Visibility Sprint",
    pricePrefix: "From",
    price: "$4,500",
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
    price: "$3,500",
    cadence: "/mo",
    billing: "90-day initial commitment",
    summary: "The compounding version: new answer-ready pages, new questions, tracked every month.",
    detail:
      "Continuous AEO, GEO and SEO work — new extractable pages, more buying-intent questions taken one by one, and the monthly report. Then month to month.",
    cta: { label: "Book a call", href: CALL_HREF },
    kind: "call",
    chip: "Retainer",
  },
]

const faqs = [
  {
    question: "What exactly is answer engine optimization?",
    answer:
      "The work of winning the extracted answer: the featured snippet, the People Also Ask box, the answer slot inside an AI Overview, the answer a voice assistant reads aloud. An engine picks one passage to show as the answer to a question — AEO structures your pages so that passage is yours. Full definition in the glossary: geotoolbox.ai/glossary/answer-engine-optimization.",
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
      "I built GEO Toolbox — the platform used to measure AI visibility — and I lead the work on your account, with a small team alongside me. Not a strategist handing off to a junior: the founder who built the measurement tool, in the code of your pages. Trade-off, stated plainly: we take 4 active clients at a time, so there's sometimes a wait.",
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
      price: "925",
      priceCurrency: "USD",
      description: "One-off diagnostic mapping buying-intent questions, current answer-slot owners, and the pages to build.",
    },
    {
      "@type": "Offer",
      name: "30-Day AI Visibility Sprint",
      description: "Thirty days of technical fixes and priority pages restructured to be extracted. From $4,500, scoped to project size.",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: "4500",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "Offer",
      name: "Ongoing GEO + SEO Growth",
      description: "Continuous AEO, GEO and SEO work with a monthly report. From $3,500/mo, 90-day initial commitment.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        minPrice: "3500",
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
  return (
    <>
      <JsonLd data={serviceSchema} />

      {/* 1 — Hero: extracted-block framing + founder credential + scan card */}
      <section className="relative overflow-hidden bg-white px-6 pt-10 pb-16 sm:pt-14 sm:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 640px 440px at 10% 12%, rgba(241, 243, 252, 0.7), transparent 70%)",
              "radial-gradient(ellipse 720px 520px at 88% 6%, rgba(204, 251, 241, 0.55), transparent 72%)",
            ].join(","),
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(15 23 42 / 1) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
            opacity: 0.05,
          }}
        />

        <div className="relative mx-auto max-w-7xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Services", href: "/services/ai-seo-agency" },
              { name: "Answer Engine Optimization", href: "" },
            ]}
          />

          <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="animate-fade-up lg:col-span-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                Answer engine optimization
              </p>

              <div className="mt-4">
                <span className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white/80 py-1 pl-1 pr-4 shadow-sm backdrop-blur">
                  <Image
                    src={PRIMARY_AUTHOR.avatar ?? "/authors/samy-ben-sadok.jpg"}
                    alt={PRIMARY_AUTHOR.name}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="text-[12px] font-medium text-gray-700">
                    <span className="font-semibold text-gray-900">Samy Ben Sadok</span>
                    <span className="mx-1.5 text-gray-300" aria-hidden="true">·</span>
                    Founder, GEO Toolbox
                  </span>
                </span>
              </div>

              <h1 className="mt-6 text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                When your buyer asks the question, one block of text gets picked as the answer.{" "}
                <span className="text-accent-700">We make that block yours.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
                Featured snippets, People Also Ask, AI Overview answer slots, voice answers — one extracted
                passage wins each question. I built GEO Toolbox — the platform used to measure AI visibility — and my
                team and I restructure your pages to win those slots, then report the presence monthly.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={CALL_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                >
                  Book a call
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="#results"
                  className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                >
                  See the results
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-500">20-min intro call · no obligation · we take 4 active clients at a time.</p>

              {/* Risk-reversal cue surfaced at the hero CTA, not just in pricing. */}
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {[
                  "On-time or we refund the milestone",
                  "You own every page & dataset",
                  "Reporting is raw slot data, no spin",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600">
                    <svg className="h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.5 8.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Product card — legal AI-scan in a browser frame. Wrapper not
                aria-hidden so the scan image + alt reach AT. The AEO-relevant
                fact (AI Overview answer at organic 5–6) lives in the caption. */}
            <div className="animate-fade-up stagger-2 lg:col-span-6">
              <div className="relative lg:-mr-4 xl:-mr-10">
                <div
                  aria-hidden="true"
                  className="absolute -inset-8 rounded-[3rem] opacity-70"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(94, 234, 212, 0.18), transparent 70%)",
                    filter: "blur(16px)",
                  }}
                />
                <div aria-hidden="true" className="absolute -bottom-6 left-8 right-8 h-8 rounded-full bg-gray-900/8 blur-xl" />
                <figure className="relative">
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.16)]">
                    <div aria-hidden="true" className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                      <span className="ml-3 inline-flex items-center gap-1.5 rounded-md border border-gray-100 bg-white px-2.5 py-1 font-mono text-[11px] text-gray-500">
                        <svg className="h-3 w-3 text-accent-600" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2.5" y="5.5" width="7" height="4.5" rx="1" />
                          <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" strokeLinecap="round" />
                        </svg>
                        geotoolbox.ai/scan
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500 shadow-sm">
                        Example scan
                      </span>
                    </div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50">
                      <Image
                        src="/services/track-record/legal-ai-scan.png"
                        width={1999}
                        height={1602}
                        alt="AI citation scan showing a client's page cited by all 7 AI engines as the #1 cited source, ahead of google.com."
                        fetchPriority="high"
                        sizes="(min-width: 1024px) min(48vw, 720px), 100vw"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 font-mono text-[12px] text-gray-500">
                    The same client guide is featured in Google&apos;s AI Overview — from organic position 5–6 in the US.
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Category definition: what AEO is, what it isn't */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              The category, defined honestly
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              What AEO is — <span className="text-accent-700">and what it isn&apos;t.</span>
            </h2>
          </div>

          <ol className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
            {definitionRows.map((d) => (
              <li key={d.num} className="grid grid-cols-1 gap-4 py-7 md:grid-cols-[auto_1fr] md:gap-10">
                <span className="font-mono text-2xl font-bold tabular-nums text-accent-700 md:text-3xl">
                  {d.num}
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-gray-900">{d.title}</h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-gray-600">{d.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-[14px] leading-relaxed text-gray-500">
            Want the deeper theory first? Read the guides:{" "}
            <Link href="/blog/what-is-answer-engine-optimization" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              what AEO is
            </Link>
            ,{" "}
            <Link href="/blog/aeo-best-practices" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              AEO best practices
            </Link>
            ,{" "}
            <Link href="/blog/geo-vs-aeo-vs-seo" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              GEO vs AEO vs SEO
            </Link>
            , or the{" "}
            <Link href="/glossary/answer-engine-optimization" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              glossary definition
            </Link>
            . This page is the done-for-you service.
          </p>
        </div>
      </section>

      {/* 3 — Proof band (dark) */}
      <ProofResults />

      {/* 4 — What you get + how it runs */}
      <section className="border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                What you get, and how it runs
              </p>
              <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
                Three outcomes. <span className="text-accent-700">Audit, build, track.</span>
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              No black box, no list of busywork tasks. Each stage is one outcome you can check, and each one
              produces an artifact you can hold — a baseline, a restructured page, a monthly report — so you
              always know what the money bought.
            </p>
          </div>

          <ol className="mt-14 space-y-4">
            {flow.map((f) => (
              <li
                key={f.num}
                className="grid grid-cols-1 gap-5 rounded-2xl border border-[var(--surface-mint-border)] bg-white/70 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-7"
              >
                <div className="flex items-center gap-4 md:w-36 md:flex-col md:items-start md:gap-2.5">
                  <span className="font-mono text-3xl font-bold tabular-nums text-accent-700 md:text-4xl">
                    {f.num}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-accent-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                    {f.verb}
                  </span>
                </div>
                <div className="md:border-l md:border-[var(--surface-mint-border)] md:pl-8">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-gray-900">{f.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">{f.body}</p>
                </div>
                <div className="md:text-right">
                  <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-[12px] text-gray-700">
                    <svg className="h-3 w-3 text-accent-600" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6h6m0 0L6 3m3 3L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{f.output}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 — Offer ladder */}
      <section id="pricing" className="scroll-mt-20 border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              How to start
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Start with the diagnostic. <span className="text-accent-700">Scale when the numbers say to.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              Two one-off purchases and one ongoing engagement. Start with the Report — you never commit to
              a retainer before you&apos;ve seen the opportunity in your own numbers.
            </p>
          </div>

          {/* Fit-filter — qualifies before the price so book-a-call slots go to
              real prospects, not tyre-kickers. */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-accent-200 bg-white/70 p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                This is for you if
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-snug text-gray-700">
                {[
                  "Your buyers research before they buy — a considered, higher-value purchase.",
                  "You have a real site with something true and specific to say.",
                  "You want proof from a tracker, not a monthly vibe check.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3.5 8.5l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/70 p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                This isn&apos;t for you if
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-snug text-gray-600">
                {[
                  "You need leads this week — answer slots take weeks to win, not days.",
                  "You sell pure impulse buys nobody researches first.",
                  "You can't ship changes to your pages, or won't.",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4l8 8m0-8l-8 8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 items-start gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={
                  t.featured
                    ? "relative flex flex-col rounded-2xl border-2 border-accent-500 bg-white p-7 shadow-[0_24px_50px_-24px_rgba(13,148,136,0.35)] md:-mt-3"
                    : "relative flex flex-col rounded-2xl border border-gray-200 bg-white p-7 transition-all hover:border-gray-300 hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.08)]"
                }
              >
                {t.featured && (
                  <span className="absolute -top-3 left-7 inline-flex items-center rounded-full bg-accent-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
                    Most popular
                  </span>
                )}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-bold tracking-tight text-gray-900">{t.name}</h3>
                  <span
                    className={
                      t.chip === "One-off"
                        ? "rounded-full bg-accent-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700"
                        : "rounded-full bg-gray-100 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500"
                    }
                  >
                    {t.chip}
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  {t.pricePrefix && (
                    <span className="text-[13px] font-medium text-gray-500">{t.pricePrefix}</span>
                  )}
                  <span className="text-3xl font-bold tracking-tight tabular-nums text-gray-900">{t.price}</span>
                  {t.cadence && <span className="text-[13px] font-medium text-gray-500">{t.cadence}</span>}
                </div>
                <p className="mt-1 text-[12px] font-medium text-gray-500">{t.billing}</p>
                <p className="mt-4 text-[13px] font-semibold leading-snug text-gray-800">{t.summary}</p>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-gray-600">{t.detail}</p>
                <div className="mt-6">
                  {t.kind === "buy" ? (
                    // Full-page navigation (not next/link) so the browser follows
                    // the checkout handler's 303 redirect to Stripe.
                    <a
                      href={t.cta.href}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-900 px-5 py-3 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 active:translate-y-[1px]"
                    >
                      {t.cta.label}
                      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ) : (
                  <Link
                    href={t.cta.href}
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-[13px] font-semibold text-gray-800 transition-colors hover:border-gray-400 hover:text-gray-900"
                  >
                    {t.cta.label}
                  </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[13px] font-medium text-gray-500">
            The Report fee is credited toward a Sprint or retainer if you continue within 14 days. We take 4
            active clients at a time, so there&apos;s sometimes a short wait.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
            The $925 Report is a fixed price, payable by card — buy it above and you&apos;ll go straight to secure checkout. The
            Sprint and retainer are scoped to your project on the call. Looking for the umbrella service?
            See{" "}
            <Link href="/services/ai-seo-agency" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              done-for-you AI SEO
            </Link>{" "}
            — or{" "}
            <Link href="/services/generative-engine-optimization" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              generative engine optimization
            </Link>{" "}
            if your market&apos;s questions end in a composed AI answer, not a snippet. For custom AI agents
            and tooling, see{" "}
            <Link href="/services/ai-automation-agency" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              AI automation &amp; agent development
            </Link>
            .
          </p>

          {/* Risk reversal — same terms as the flagship service page */}
          <div className="mt-10 grid grid-cols-1 gap-7 rounded-2xl border border-gray-200 bg-white p-8 sm:grid-cols-3">
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-gray-900">On-time delivery guarantee</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                If we miss a milestone after you&apos;ve given on-time access and feedback, we refund that
                milestone&apos;s fee. We never guarantee rankings or citations — no honest person can — only
                that we deliver on time or pay for missing.
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-gray-900">You own everything</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                Every page, dashboard and dataset is yours. If we stop working together, you keep the work,
                the tracker baseline, and the pages — nothing is held hostage.
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-gray-900">Start with the Report</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                If the opportunity doesn&apos;t justify implementation, you keep the research and owe no
                retainer. The Report has to earn the Sprint before the Sprint earns the retainer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — FAQ (also emits FAQPage JSON-LD from the same items) */}
      <FeatureFaq items={faqs} heading="The questions we get about AEO" />

      {/* 7 — Final CTA */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Every question in your market already has an answer slot.
              <br className="hidden sm:block" />{" "}Someone&apos;s text is in it. Make it yours.
            </h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-gray-300">
              Book a call. I&apos;ll read your answer-slot baseline with you and tell you straight whether
              AEO is worth doing for your market — founder to founder, no handoff.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href={CALL_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 hover:shadow-xl hover:shadow-black/30 active:translate-y-[1px]"
            >
              Book a call
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <StickyServiceCta callHref={CALL_HREF} pricingHref="#pricing" />
    </>
  )
}
