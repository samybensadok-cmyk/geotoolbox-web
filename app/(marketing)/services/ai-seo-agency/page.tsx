import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { CheckoutStatusBanner } from "@/components/services/checkout-status-banner"
import { StickyServiceCta } from "@/components/services/sticky-cta"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ProofResults } from "@/components/services/proof-results"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats } from "@/lib/proof-stats"

const PAGE_URL = `${siteConfig.url}/services/ai-seo-agency`
// Every call books an intro/teardown call — no free-tool CTA anywhere on this page.
const TEARDOWN_HREF = "https://calendly.com/samy-bensadok/30min-call"
// The $750 Report is a direct purchase — wired to the live Stripe checkout
// endpoint (Vercel rewrites /app/* to the Replit app; the handler 303-redirects
// to Stripe Checkout). Sprint/retainer stay book-a-call.
const CHECKOUT = { report: "/app/?action=service_checkout&item=report", sprint: "https://calendly.com/samy-bensadok/30min-call" }

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

// Merged "what you get" (outcomes) + "how it runs" (process) — one section so
// the near-duplicate baseline→rewrite→report copy isn't stamped twice. Each row:
// the outcome as headline, the process verb as a mono tag, the output as a chip.
type FlowRow = { num: string; verb: string; title: string; body: string; output: string }

const flow: FlowRow[] = [
  {
    num: "01",
    verb: "Audit",
    title: "You see exactly where you stand — before we touch anything.",
    body: "Week one: a cross-engine baseline from our own tracker — which prompts your buyers use, which engines cite you versus your competitors, the gap in numbers. You start from data, not a hunch.",
    output: "cross-engine baseline",
  },
  {
    num: "02",
    verb: "Build",
    title: "Your pages get rewritten to be quotable — and you own the questions that end in a purchase.",
    body: "We rebuild your priority pages so an AI engine can lift your answer with your name attached: verifiable claims, clean structure, the sources an engine trusts. The focus is the comparison and “which should I buy” prompts where the shortlist forms, past the “what is [category]” trivia — while your classic Google rankings hold.",
    output: "priority pages rebuilt",
  },
  {
    num: "03",
    verb: "Track",
    title: "Every month: citations gained, engines, prompts — tracker logs, not sentiment.",
    body: "Your report is the raw tracker output — which engines, which prompts, the deltas. A log from a measurement tool. If a month is flat, it says flat. Same numbers, both of us.",
    output: "monthly citation log",
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
    name: "Visibility Report",
    price: "$750",
    billing: "One-off",
    summary: "The full baseline: prompts, engines, competitors, and the pages worth building.",
    detail:
      "A one-off diagnostic that maps the buying-intent prompts in your market, who gets cited today, and the specific pages to build.",
    cta: { label: "Buy the Report — $750", href: CHECKOUT.report },
    kind: "buy",
    chip: "One-off",
  },
  {
    name: "30-Day AI Visibility Sprint",
    pricePrefix: "From",
    price: "$4,500",
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
    price: "$3,500",
    cadence: "/mo",
    billing: "90-day initial commitment",
    summary: "The compounding version: new pages, new prompts, tracked every month.",
    detail:
      "Continuous GEO and SEO work — new citable pages, more buying-intent prompts taken one by one, and the monthly tracker report. Then month to month.",
    cta: { label: "Book a call", href: TEARDOWN_HREF },
    kind: "call",
    chip: "Retainer",
  },
]

type PastClientResult = {
  label: string
  points: string[]
  image: { src: string; width: number; height: number; alt: string }
}

// Past CLIENT projects the operator personally led, before geotoolbox — public
// data only (AI-engine citation scans + Ahrefs). Numbers single-sourced here.
// Accuracy: "#1 / #2 cited source" and "N of 7 AI engines" come from an AI
// citation scan (not organic rank); the legal guide is #1 in Google's AI
// OVERVIEW, organic 5–6. No Ahrefs traffic estimates — positions only.
const pastClientResults: PastClientResult[] = [
  {
    label: "Legal-services vertical · client guide",
    points: [
      "Cited by 7 of 7 AI engines — the #1 cited source for “how to run google ads for lawyers,” cited ahead of google.com itself.",
      "Featured in Google’s AI Overview for “google ads for lawyers.” Organic position 5–6.",
      "On page 1 within weeks of publishing, with no prior topical authority.",
    ],
    image: {
      src: "/services/track-record/legal-ai-scan.png",
      width: 1999,
      height: 1602,
      alt: "AI citation scan: the client's Google Ads for lawyers guide cited by all 7 AI engines, the #1 cited source above google.com.",
    },
  },
  {
    label: "Fintech / crypto vertical · client guide",
    points: [
      "Cited by 6 of 7 AI engines — the #2 cited source, behind only google.com, for “how to run crypto Google Ads without getting disapproved.”",
      "Ranks a cluster of crypto-ads terms at positions 2–10 (Ahrefs), several surfaced in Google’s AI Overview.",
    ],
    image: {
      src: "/services/track-record/crypto-ai-scan.png",
      width: 2208,
      height: 1742,
      alt: "AI citation scan: the client's crypto Google Ads guide cited by 6 of 7 AI engines, the #2 cited source behind only google.com.",
    },
  },
]

const problemPoints = [
  {
    num: "01",
    text: "Your Google Search Console shows impressions climbing and clicks flat or falling.",
  },
  {
    num: "02",
    text: "A buyer asks ChatGPT “best [your category]” and it names three competitors, by name — not you.",
  },
  {
    num: "03",
    text: "Your classic SEO report has no column for any of it, because rank trackers can’t see inside an AI answer.",
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
      "Our own zero-authority domain took about 7 weeks to first meaningful citations. Your site has age and authority ours didn't; your market has competition ours didn't — plan on first tracked movement in 4–8 weeks, compounding after. What you get in week one: the baseline. If someone promises AI citations in days, ask to see their tracking.",
  },
  {
    question: "How do you measure it?",
    answer:
      "With the cross-engine tracker I built (geotoolbox.ai). It queries the real engines with the real prompts your buyers use and logs who's cited, where, how often. Your monthly report is its raw output — prompts, engines, citations, deltas. A log, not an estimate.",
  },
  {
    question: "What if it doesn't work?",
    answer:
      "The tracker will say so, the same month we see it — that's the deal with reporting from a measurement tool instead of a slide deck. No long-term lock-in; the baseline is yours to keep. We can't guarantee an LLM's output — anyone who does is lying — but you'll always know exactly what you got for the money.",
  },
  {
    question: "Why you and not a big agency?",
    answer:
      "I built GEO Toolbox — the platform the industry uses to measure AI visibility — and I lead the work on your account, with a small team alongside me. Not a strategist on a sales call handing off to a junior, not three departments: the founder who built the measurement tool, in the code of your pages. Trade-off, stated plainly: we take 4 active clients at a time, so there's sometimes a wait. What you get: founder-level execution in the one channel where your problem lives.",
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
      name: "Visibility Report",
      price: "750",
      priceCurrency: "USD",
      description: "One-off diagnostic mapping buying-intent prompts, current citations, and the pages to build.",
    },
    {
      "@type": "Offer",
      name: "30-Day AI Visibility Sprint",
      description: "Thirty days of technical fixes and priority pages rebuilt to be citable. From $4,500, scoped to project size.",
      priceSpecification: {
        "@type": "PriceSpecification",
        // Displayed as "from $4,500" — a floor, scoped on the call.
        minPrice: "4500",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "Offer",
      name: "Ongoing GEO + SEO Growth",
      description: "Continuous GEO and SEO work with a monthly citation report. From $3,500/mo, 90-day initial commitment.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        // Displayed as "from $3,500/mo" — represent as a floor, not an exact price.
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

export default function AiSeoServicePage() {
  const fmt = (n: number) => n.toLocaleString("en-US")

  return (
    <>
      <JsonLd data={serviceSchema} />

      {/* 0 — Stripe Checkout return banner (renders only with ?status=…) */}
      <Suspense fallback={null}>
        <CheckoutStatusBanner />
      </Suspense>

      {/* 1 — Hero: self-demo headline + founder credential + live-scan product card */}
      <section className="relative overflow-hidden bg-white px-6 pt-10 pb-16 sm:pt-14 sm:pb-24">
        {/* Ambient depth — two low-opacity radial glows behind a dotted grid */}
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
              { name: "Services", href: "" },
              { name: "AI SEO & GEO", href: "" },
            ]}
          />

          <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            {/* Text column */}
            <div className="animate-fade-up lg:col-span-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                Done-for-you AI visibility
              </p>

              {/* Founder credential pill */}
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
                When buyers ask AI who&apos;s best in your market — if it isn&apos;t you,{" "}
                <span className="text-accent-700">that&apos;s what we fix.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
                Your buyers ask AI engines who to trust before they ever reach your site. I built GEO
                Toolbox — the platform used to measure AI visibility — and my team and I rebuild your pages
                to get cited in those answers, then prove it monthly with the tracker I built.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={TEARDOWN_HREF}
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

              {/* Risk-reversal cue surfaced at the hero CTA (not just buried in
                  pricing) — the two guarantees a skeptic wants before scrolling. */}
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {[
                  "On-time or we refund the milestone",
                  "You own every page & dataset",
                  "Reporting is raw tracker output",
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

            {/* Product card — legal AI-scan in a browser frame. Wrapper is NOT
                aria-hidden so the meaningful scan image + alt reach AT; only the
                decorative browser chrome is hidden. */}
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
                    {/* Browser chrome — decorative, hidden from AT */}
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
                    {/* Fixed-aspect crop to the impactful TOP of the scan (the
                        "7/7 AI SERVICES CITED" score + top cited domains) so it
                        reads large and legible. Full image lives in the
                        track-record card below. */}
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
                    A client&apos;s page cited by all 7 AI engines — example scan.
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Proof band (dark) */}
      <ProofResults />

      {/* 3 — Problem frame: three symptoms, one cause */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              What&apos;s actually happening
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Three symptoms. <span className="text-accent-700">One cause.</span>
            </h2>
          </div>

          <ol className="mt-10 divide-y divide-gray-200 border-y border-gray-200">
            {problemPoints.map((p) => (
              <li key={p.num} className="flex items-start gap-6 py-6 md:gap-10">
                <span className="font-mono text-2xl font-bold tabular-nums text-accent-700 md:text-3xl">
                  {p.num}
                </span>
                <p className="max-w-2xl pt-1 text-[17px] font-medium leading-snug tracking-tight text-gray-800 md:text-lg">
                  {p.text}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-3xl text-[clamp(1.15rem,2vw,1.5rem)] font-semibold leading-snug tracking-tight text-gray-600">
            One cause: the answer your buyer reads is being written by an AI engine that{" "}
            <span className="text-accent-700">doesn&apos;t cite you yet.</span> That&apos;s the gap we close —
            and the one we can actually measure.
          </p>
        </div>
      </section>

      {/* 4 — What you get + how it runs, merged: outcome headline + process
          verb tag + output-chip endpoint. Distinct card/step treatment so the
          mid-page doesn't read as the same hairline list stamped repeatedly. */}
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
              produces an artifact you can hold — a baseline, a rebuilt page, a monthly log — so you always
              know what the money bought.
            </p>
          </div>

          <ol className="mt-14 space-y-4">
            {flow.map((f) => (
              <li
                key={f.num}
                className="grid grid-cols-1 gap-5 rounded-2xl border border-[var(--surface-mint-border)] bg-white/70 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8 md:p-7"
              >
                {/* Step number + process verb */}
                <div className="flex items-center gap-4 md:w-36 md:flex-col md:items-start md:gap-2.5">
                  <span className="font-mono text-3xl font-bold tabular-nums text-accent-700 md:text-4xl">
                    {f.num}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-accent-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                    {f.verb}
                  </span>
                </div>
                {/* Outcome headline + detail */}
                <div className="md:border-l md:border-[var(--surface-mint-border)] md:pl-8">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-gray-900">{f.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">{f.body}</p>
                </div>
                {/* Output endpoint chip */}
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

      {/* 6 — Case study: my own site (designed block with a receipt card) */}
      <section className="border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                The case study is my own site
              </p>
              <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
                From a zero-authority domain to page one —{" "}
                <span className="text-accent-700">and into the AI answers.</span>
              </h2>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-600">
                <p>
                  I started geotoolbox.ai from nothing — no aged domain, no link package. About{" "}
                  {proofStats.weeksToResult} weeks in, Google Search Console showed it ranking across
                  thousands of keywords, hundreds on page one (real, unique, verifiable in GSC). And the part
                  a normal SEO can&apos;t report: over a {proofStats.aiCitations.windowMonths}-month window,
                  Bing&apos;s AI Performance report logged a large volume of AI-citation appearances across
                  Copilot and partners — a sampled count, Bing&apos;s data, in the receipt.
                </p>
                <p>
                  Why it matters commercially: the prompts we get cited for most aren&apos;t trivia — they&apos;re
                  buying-intent comparison and shortlist questions (&ldquo;best tools for Search Generative
                  Experience,&rdquo; &ldquo;answer engine optimization vs SEO,&rdquo; &ldquo;Copilot vs
                  Gemini&rdquo;). The moment a buyer decides. That&apos;s the real estate we build for clients.
                </p>
              </div>
            </div>

            {/* Receipt card — the headline figures, single-sourced */}
            <div className="lg:pt-2">
              <div className="rounded-2xl border border-[var(--surface-mint-border)] bg-white p-7 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.16)]">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  geotoolbox.ai · the receipt
                </p>
                {/* Slimmed so it doesn't repeat the dark proof band's lead figure
                    (keywords ranked); keeps the story's payoff — the speed (weeks)
                    and the AI-citation count — so the card reads as a receipt, not
                    a duplicate. */}
                <dl className="mt-6 space-y-5">
                  <div className="flex items-baseline justify-between gap-4 border-b border-gray-100 pb-5">
                    <dt className="text-[13px] font-medium text-gray-600">Google results, in about</dt>
                    <dd className="font-mono text-2xl font-bold tabular-nums text-gray-900">
                      {proofStats.weeksToResult} wks
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-gray-100 pb-5">
                    <dt className="text-[13px] font-medium text-gray-600">In Google&apos;s top 3</dt>
                    <dd className="font-mono text-2xl font-bold tabular-nums text-gray-900">
                      {proofStats.google.top3}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[13px] font-medium text-gray-600">
                      AI-citation appearances
                      <span className="mt-0.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                        {proofStats.aiCitations.windowMonths}-month Bing sample
                      </span>
                    </dt>
                    <dd className="font-mono text-2xl font-bold tabular-nums text-gray-900">
                      ~{fmt(proofStats.aiCitations.total)}
                    </dd>
                  </div>
                </dl>
                <p className="mt-6 border-t border-gray-100 pt-4 text-[12px] leading-relaxed text-gray-500">
                  Google figures are unique GSC data. The AI-citation figure is a{" "}
                  {proofStats.aiCitations.windowMonths}-month sampled appearance count from Bing Webmaster
                  Tools (Microsoft Copilot and partners) — not unique citations, not ChatGPT, Perplexity, or
                  Google. As of {proofStats.asOf}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6b — Past client track record: framed product cards */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Client results, before geotoolbox
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              One client, two verticals —{" "}
              <span className="text-accent-700">cited across the AI engines.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              Two guides on one client&apos;s site, in very different markets — both projects I led before
              geotoolbox. The client stays unnamed, but the proof is public: AI-engine citation scans (from
              the tracker I built) and Ahrefs positions, not private analytics. This ran on an earlier version
              of the system we use now.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {pastClientResults.map((r) => (
              <figure
                key={r.label}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-gray-300 hover:shadow-[0_20px_40px_-20px_rgba(15,23,42,0.14)]"
              >
                {/* Browser-framed screenshot — this IS the proof section, so
                    eager-load and give the image area a light placeholder so no
                    white void shows while it decodes. */}
                <div className="border-b border-gray-100">
                  <div aria-hidden="true" className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                      geotoolbox GEO Scan
                    </span>
                  </div>
                  <div className="bg-gray-50">
                    <Image
                      src={r.image.src}
                      width={r.image.width}
                      height={r.image.height}
                      alt={r.image.alt}
                      loading="eager"
                      sizes="(min-width: 768px) min(46vw, 640px), 100vw"
                      className="h-auto w-full"
                    />
                  </div>
                </div>
                <figcaption className="flex flex-1 flex-col p-7">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                    {r.label}
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {r.points.map((point) => (
                      <li key={point} className="flex gap-2.5 text-[15px] leading-relaxed text-gray-600">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-700" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-6 text-[13px] font-medium text-gray-500">
            Figures from public AI-engine citation scans (via the tracker I built) and Ahrefs — not client analytics.
          </p>
        </div>
      </section>

      {/* 7 — Offer ladder + risk reversal */}
      <section id="pricing" className="scroll-mt-20 border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-16 sm:py-24">
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

          {/* Fit-filter — qualifies before the price so the book-a-call slots go
              to real prospects, not tyre-kickers. Two honest columns. */}
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
                  "You need leads this week — GEO compounds over months, not days.",
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
            The $750 Report is a fixed price, payable by card — buy it above and you&apos;ll go straight to secure checkout. The Sprint and retainer are scoped to your project on the call. Focused on one surface? See the{" "}
            <Link href="/services/generative-engine-optimization" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              generative engine optimization
            </Link>{" "}
            and{" "}
            <Link href="/services/answer-engine-optimization" className="font-medium text-accent-700 underline decoration-accent-200 underline-offset-2 hover:decoration-accent-500">
              answer engine optimization
            </Link>{" "}
            services.
          </p>

          {/* Risk reversal */}
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

      {/* 8 — FAQ (also emits FAQPage JSON-LD from the same items) */}
      <FeatureFaq items={faqs} heading="The six questions we always get" />

      {/* 9 — Final CTA */}
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
              The answers are being written right now.
              <br className="hidden sm:block" /> With you or without you.
            </h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-gray-300">
              Book a call. I&apos;ll read your AI visibility with you and tell you straight whether this is
              worth doing — founder to founder, no handoff.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href={TEARDOWN_HREF}
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

      {/* Sticky book-a-call bar — fades in past the hero, keeps the CTA + a
          jump-to-pricing link in reach on a long page. */}
      <StickyServiceCta callHref={TEARDOWN_HREF} pricingHref="#pricing" />
    </>
  )
}
