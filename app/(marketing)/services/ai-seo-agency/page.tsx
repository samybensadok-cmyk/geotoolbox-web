import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { PainScenarioSection } from "@/components/features/pain-scenario"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { SocialProofBlock } from "@/components/features/social-proof"
import { FeatureFaq } from "@/components/features/feature-faq"
import { DualCTA } from "@/components/features/dual-cta"
import { ProofResults } from "@/components/services/proof-results"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { proofStats } from "@/lib/proof-stats"

const PAGE_URL = `${siteConfig.url}/services/ai-seo-agency`
// The free "AI Visibility Check" — the GEO Scan feature page (a real, statically
// prerendered route in this repo) that funnels into the free in-app scan.
const FREE_CHECK_HREF = "/features/geo-scan"
const TEARDOWN_HREF = "/contact"

export const metadata: Metadata = {
  title: "Done-For-You AI SEO & GEO Service",
  description:
    "I personally rebuild your pages to get cited in ChatGPT, Perplexity and Copilot, and prove it monthly with the tracker I built. One specialist, not an agency.",
  openGraph: {
    title: "Done-For-You AI SEO & GEO, Run By One Specialist",
    description:
      "I personally rebuild your pages to get cited in ChatGPT, Perplexity and Copilot — and prove it monthly with the tracker I built. One specialist, four clients.",
  },
  alternates: { canonical: PAGE_URL },
}

const steps: Step[] = [
  {
    verb: "Audit",
    title: "Baseline from the tracker",
    body: "Week one, I run your prompts through my cross-engine tracker: which questions your buyers ask, which engines cite you, which cite your competitors instead. You start from numbers, not a hunch.",
  },
  {
    verb: "Build",
    title: "Rebuild pages to be citable",
    body: "I rewrite your priority pages so an AI engine can lift the answer with your name attached — verifiable claims, clean structure, the sources an engine trusts — while your classic Google rankings hold.",
  },
  {
    verb: "Track",
    title: "Monthly citation report",
    body: "Every month you get the raw tracker output: citations gained, which engines, which prompts, the deltas. A log from a measurement tool, not a slide deck. If a month is flat, it says flat.",
  },
]

const deliverables = [
  {
    tag: "Baseline",
    title: "You see exactly where you stand — before I touch anything.",
    body: "Week one: a cross-engine baseline from my own tracker — which prompts your buyers use, which engines cite you vs your competitors, the gap in numbers.",
  },
  {
    tag: "Rewrite",
    title: "Your content gets rewritten to be quotable, not just rankable.",
    body: "I rebuild your key pages so an AI engine can lift your answer with your name attached — while your classic Google rankings hold. A floor, not a trade-off.",
  },
  {
    tag: "Buying-intent",
    title: "You own the questions that end in a purchase.",
    body: "Not 'what is [category]' trivia — the comparison and 'which should I buy' prompts where the shortlist forms. Mapped, built, taken one by one.",
  },
  {
    tag: "Reporting",
    title: "Every month: citations gained, engines, prompts. Tracker logs, not sentiment.",
    body: "Your report is raw tracker output. If a month is flat, the report says flat. Same numbers, both of us.",
  },
]

type Tier = {
  name: string
  price: string
  cadence?: string
  summary: string
  detail: string
  cta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

const tiers: Tier[] = [
  {
    name: "AI Visibility Check",
    price: "Free",
    summary: "See where you stand across the AI engines, then talk it through with me.",
    detail:
      "Run a free AI visibility check on your own domain, plus a free 20-minute teardown call where I read the result with you and tell you honestly whether this is worth doing.",
    cta: { label: "Run my free check", href: FREE_CHECK_HREF },
    secondaryCta: { label: "Book the 20-min teardown", href: TEARDOWN_HREF },
  },
  {
    name: "AI Search Opportunity Map",
    price: "$1,250",
    cadence: "fixed",
    summary: "The full baseline: prompts, engines, competitors, and the pages worth building.",
    detail:
      "A one-off diagnostic that maps the buying-intent prompts in your market, who gets cited today, and the specific pages to build. Credited toward a Sprint or retainer if you start within 14 days.",
    cta: { label: "Start with the Map", href: TEARDOWN_HREF },
  },
  {
    name: "30-Day AI Visibility Sprint",
    price: "$4,000",
    cadence: "fixed",
    summary: "Thirty days of building: fixes shipped, priority pages rebuilt to be cited.",
    detail:
      "Technical fixes, your priority pages rebuilt to be citable, and the citation and source work that gets an engine to quote you. A fixed scope with a fixed price. The Sprint counts as month one if you continue on a retainer within 30 days.",
    cta: { label: "Book a sprint", href: TEARDOWN_HREF },
  },
  {
    name: "Ongoing GEO + SEO Growth",
    price: "$4,000",
    cadence: "/mo, from",
    summary: "The compounding version: new pages, new prompts, tracked every month.",
    detail:
      "Continuous GEO and SEO work — new citable pages, more buying-intent prompts taken one by one, and the monthly tracker report. A 90-day initial commitment, then month to month.",
    cta: { label: "Talk about ongoing work", href: TEARDOWN_HREF },
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
    label: "Legal client · Google Ads guide",
    points: [
      "Cited by 7 of 7 AI engines — the #1 cited source for “how to run google ads for lawyers,” ranked above google.com itself.",
      "Featured in Google’s AI Overview for “google ads for lawyers.” Organic position 5–6.",
      "On page 1 within days of publishing, with no prior topical authority.",
    ],
    image: {
      src: "/services/track-record/legal-ai-scan.png",
      width: 1999,
      height: 1602,
      alt: "AI citation scan: the client's Google Ads for lawyers guide cited by all 7 AI engines, the #1 cited source above google.com.",
    },
  },
  {
    label: "Crypto client · Google Ads guide",
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

const faqs = [
  {
    question: "How is this different from regular SEO?",
    answer: `Regular SEO earns a ranking a human might click. This earns a citation inside the answer the human actually reads — in ChatGPT, Perplexity, Copilot and AI Overviews. The overlap: good GEO work also lifts classic rankings (my test domain put ${proofStats.google.rankedKeywords.toLocaleString("en-US")} keywords into Google while chasing citations). The difference: a normal SEO can't hand you an AI-citation report. I built the tool that produces one.`,
  },
  {
    question: "How long until results?",
    answer:
      "My own zero-authority domain took about 7 weeks to first meaningful citations. Your site has age and authority mine didn't; your market has competition mine didn't — plan on first tracked movement in 4–8 weeks, compounding after. What you get in week one: the baseline. If someone promises AI citations in days, ask to see their tracking.",
  },
  {
    question: "How do you measure it?",
    answer:
      "With the cross-engine tracker I built (geotoolbox.ai). It queries the real engines with the real prompts your buyers use and logs who's cited, where, how often. Your monthly report is its raw output — prompts, engines, citations, deltas. A log, not an estimate.",
  },
  {
    question: "What if it doesn't work?",
    answer:
      "The tracker will say so, the same month I see it — that's the deal with reporting from a measurement tool instead of a slide deck. No long-term lock-in; the baseline is yours to keep. I can't guarantee an LLM's output — anyone who does is lying — but you'll always know exactly what you got for the money.",
  },
  {
    question: "Why you and not an agency?",
    answer:
      "The person who ran the 7-week experiment, built the tracker, and wrote this page does the work. At an agency that's three departments, and the person from the sales call is in none of them. Trade-off, stated plainly: I take few clients, so there's sometimes a wait. What you get: senior-only execution in the one channel where your problem lives.",
  },
  {
    question: "Is my industry too niche?",
    answer:
      "Niche is the best case. Fewer sources means the engines have fewer candidates to cite; one well-built, verifiable page can own an answer for months. The real qualifier isn't your industry — it's whether your buyers research before they buy.",
  },
]

// Minimal, valid ProfessionalService node (no dedicated helper in lib/seo-schema).
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Done-For-You AI SEO & GEO Service",
  description:
    "Done-for-you AI visibility and SEO, run personally by Samy Ben Sadok: priority pages rebuilt to be cited in ChatGPT, Perplexity, Copilot and AI Overviews, measured monthly with a cross-engine citation tracker.",
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
      name: "AI Search Opportunity Map",
      price: "1250",
      priceCurrency: "USD",
      description: "One-off diagnostic mapping buying-intent prompts, current citations, and the pages to build.",
    },
    {
      "@type": "Offer",
      name: "30-Day AI Visibility Sprint",
      price: "4000",
      priceCurrency: "USD",
      description: "Thirty days of technical fixes and priority pages rebuilt to be citable.",
    },
    {
      "@type": "Offer",
      name: "Ongoing GEO + SEO Growth",
      description: "Continuous GEO and SEO work with a monthly citation report. From $4,000/mo, 90-day initial commitment.",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "4000",
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
  return (
    <>
      <JsonLd data={serviceSchema} />

      {/* 1 — Hero: self-demo headline + solo-specialist identity card */}
      <section className="relative overflow-hidden bg-[var(--surface-mint)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Services", href: "" },
              { name: "AI SEO & GEO", href: "" },
            ]}
          />

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="animate-fade-up lg:col-span-7">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                Done-for-you AI visibility &amp; SEO
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                Ask ChatGPT who&apos;s best in your market. If the answer isn&apos;t you,{" "}
                <span className="text-accent-700">that&apos;s the problem I fix.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Your buyers ask AI engines who to trust before they ever reach your site. I rebuild your
                pages to get cited in those answers — and prove it monthly with the tracker I built. One
                specialist doing the work, not a team you never meet.
              </p>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
                Searching for an &ldquo;AI SEO agency&rdquo;? Here&apos;s what actually moves the needle — run by one
                specialist, not a team.
              </p>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-500">
                On my own zero-authority test domain — indexed since April but near-zero traffic until I started
                publishing — about {proofStats.weeksToResult} weeks of content publishing put{" "}
                {(Math.floor(proofStats.google.rankedKeywords / 1000) * 1000).toLocaleString("en-US")}+ keywords into
                Google Search Console, {proofStats.google.top3} of them in the top 3. Separately, Bing Webmaster Tools
                logged 10,000+ AI-citation appearances over a trailing 3-month window (Copilot + partner assistants, a
                sample). First AI citations landed around week {proofStats.weeksToResult}.
              </p>
              <div className="mt-8">
                <DualCTA
                  primaryLabel="Run my free AI visibility check"
                  primaryHref={FREE_CHECK_HREF}
                  secondaryLabel="Book a 20-min teardown"
                  secondaryHref={TEARDOWN_HREF}
                  microcopy="Free check · free 20-min call · no obligation"
                  align="left"
                />
              </div>
            </div>

            {/* Solo-specialist identity card — reinforces "I personally run this" */}
            <div className="animate-fade-up stagger-2 lg:col-span-5">
              <div className="rounded-3xl border border-[var(--surface-mint-border)] bg-white p-7 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)]">
                <div className="flex items-center gap-4">
                  <Image
                    src={PRIMARY_AUTHOR.avatar ?? "/authors/samy-ben-sadok.jpg"}
                    alt={PRIMARY_AUTHOR.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[15px] font-bold tracking-tight text-gray-900">{PRIMARY_AUTHOR.name}</p>
                    <p className="text-[13px] text-gray-500">Solo GEO + SEO specialist · Barcelona</p>
                  </div>
                </div>
                <p className="mt-5 text-[14px] leading-relaxed text-gray-600">
                  I ran the 7-week experiment, built the tracker that measures it, and I&apos;m the one who does
                  your work. No account manager, no handoff.
                </p>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[var(--surface-mint)] px-4 py-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                    Capacity
                  </span>
                  <span className="text-[14px] font-semibold text-gray-900">I take 4 active clients.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Proof bar, hardest results first */}
      <ProofResults />

      {/* 3 — Problem frame */}
      <PainScenarioSection
        eyebrow="What's actually happening"
        scenario="Your Google Search Console shows impressions climbing and clicks flat or falling. A buyer asks ChatGPT &ldquo;best [your category]&rdquo; and it names three competitors, by name — not you. And your classic SEO report has no column for any of it, because rank trackers can&apos;t see inside an AI answer."
        bridge="Three symptoms, one cause: the answer your buyer reads is being written by an AI engine that doesn't cite you yet. That's the gap I close — and the one I can actually measure."
      />

      {/* 4 — Deliverables: 4 outcome pillars */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              What you actually get
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Four outcomes, not a list of tasks.
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {deliverables.map((d) => (
              <div key={d.tag}>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  {d.tag}
                </p>
                <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-gray-900">{d.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — How it works */}
      <HowItWorks3Step heading="How the work runs: audit, build, track." steps={steps} />

      {/* 6 — Full case study */}
      <section className="border-t border-[var(--surface-mint-border)] bg-[var(--surface-mint)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            The case study is my own site
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            From a zero-authority domain to page one — and into the AI answers.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-600">
            <p>
              I didn&apos;t buy an aged domain or a link package. I started geotoolbox.ai from nothing and
              published, applying the exact method I sell here. About {proofStats.weeksToResult} weeks in, the
              Google Search Console numbers were {proofStats.google.rankedKeywords.toLocaleString("en-US")} keywords
              ranked, {proofStats.google.top10.toLocaleString("en-US")} of them in the top 10 and{" "}
              {proofStats.google.top3} in the top 3, at roughly{" "}
              {proofStats.google.dailyImpressions.toLocaleString("en-US")} impressions a day. Real, unique, and
              verifiable in GSC.
            </p>
            <p>
              The part a normal SEO can&apos;t report: over a three-month window, Bing Webmaster Tools&apos; AI
              Performance report logged about {proofStats.aiCitations.total.toLocaleString("en-US")} AI-citation
              appearances across Microsoft Copilot and partner assistants; Bing reports about{" "}
              {proofStats.aiCitations.avgCitedPages} pages cited on average over the window. That figure is a sampled appearance count, not
              unique citations, and it&apos;s Bing&apos;s data — not ChatGPT&apos;s, Perplexity&apos;s or Google&apos;s.
            </p>
            <p>
              Here&apos;s why it matters commercially: the prompts I get cited for most aren&apos;t trivia. The top AI
              grounding queries are buying-intent — &ldquo;best tools for Search Generative Experience&rdquo; (around{" "}
              {proofStats.topGroundingQuery.appearances.toLocaleString("en-US")} appearances in Bing&apos;s AI
              Performance report), &ldquo;answer engine optimization vs SEO,&rdquo; &ldquo;Copilot vs Gemini.&rdquo; Those
              are comparison and shortlist questions, the moment a buyer is deciding. That&apos;s the real estate I
              build for clients.
            </p>
          </div>
          <div className="mt-10">
            <SocialProofBlock
              miniCase={{
                result: `A brand-new, zero-authority domain: ${proofStats.google.top3} keywords into Google's top 3 in about ${proofStats.weeksToResult} weeks of publishing, plus ~${proofStats.aiCitations.total.toLocaleString("en-US")} AI-citation appearances in Bing's trailing 3-month report — on buying-intent prompts.`,
                attribution: `geotoolbox.ai · Google Search Console + Bing WMT AI Performance · as of ${proofStats.asOf}`,
              }}
              showEngineGrid={false}
              provenanceLine="Google figures are unique GSC data. The AI-citation figure is a 3-month sampled appearance count from Bing Webmaster Tools, not unique citations and sourced from Microsoft Copilot and partners — not ChatGPT, Perplexity, or Google."
            />
          </div>
        </div>
      </section>

      {/* 6b — Past client results (client projects the operator led before geotoolbox) */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Before geotoolbox
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              What the method did for clients before geotoolbox
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              Two client projects I personally led. Public data only — AI-engine citation scans from my own
              tracker and Ahrefs, no private analytics. This ran on an earlier version of the content system I
              use now.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {pastClientResults.map((r) => (
              <div
                key={r.label}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-7 transition-all hover:border-gray-300 hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.08)]"
              >
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    src={r.image.src}
                    width={r.image.width}
                    height={r.image.height}
                    alt={r.image.alt}
                    loading="lazy"
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="h-auto w-full"
                  />
                </div>
                <p className="mt-2 text-[12px] text-gray-500">
                  Live cross-engine scan · geotoolbox GEO Scan
                </p>
                <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
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
              </div>
            ))}
          </div>

          <p className="mt-6 text-[13px] font-medium text-gray-500">
            Figures from public AI-engine citation scans (via my own tracker) and Ahrefs — not client analytics.
          </p>
        </div>
      </section>

      {/* 7 — Offer ladder + risk reversal */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              How to start
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Start free. Scale only when the numbers say to.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
              Every step earns the next. You never commit to a retainer before you&apos;ve seen the opportunity in
              your own numbers.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.08)]"
              >
                <h3 className="text-[15px] font-bold tracking-tight text-gray-900">{t.name}</h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-gray-900 tabular-nums">{t.price}</span>
                  {t.cadence && <span className="text-[13px] font-medium text-gray-500">{t.cadence}</span>}
                </div>
                <p className="mt-3 text-[13px] font-semibold leading-snug text-gray-800">{t.summary}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">{t.detail}</p>
                <div className="mt-5 flex flex-col gap-2 pt-2">
                  <Link
                    href={t.cta.href}
                    prefetch={false}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 active:translate-y-[1px]"
                  >
                    {t.cta.label}
                  </Link>
                  {t.secondaryCta && (
                    <Link
                      href={t.secondaryCta.href}
                      className="inline-flex items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
                    >
                      {t.secondaryCta.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[13px] font-medium text-gray-500">
            The Map fee is credited toward a Sprint or retainer if you start within 14 days. I take 4 active clients, so
            there&apos;s sometimes a short wait.
          </p>

          {/* Risk reversal */}
          <div className="mt-10 grid grid-cols-1 gap-6 rounded-2xl border border-[var(--surface-mint-border)] bg-[var(--surface-mint)] p-7 sm:grid-cols-3">
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-gray-900">On-time delivery guarantee</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                If I miss a milestone after you&apos;ve given on-time access and feedback, I refund that milestone&apos;s
                fee. I never guarantee rankings or citations — no honest person can — only that I deliver on time or
                pay for missing.
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-gray-900">You own everything</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                Every page, dashboard and dataset is yours. If we stop working together, you keep the work, the
                tracker baseline, and the pages — nothing is held hostage.
              </p>
            </div>
            <div>
              <h3 className="text-[14px] font-bold tracking-tight text-gray-900">Start with the Map</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                If the opportunity doesn&apos;t justify implementation, you keep the research and owe no retainer. The
                Map has to earn the sprint before the sprint earns the retainer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8 — FAQ (also emits FAQPage JSON-LD from the same items) */}
      <FeatureFaq items={faqs} heading="The six questions I always get" />

      {/* 9 — Final CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              The answers are being written right now.
              <br className="hidden sm:block" /> With you or without you.
            </h2>
            <p className="mt-3 text-base text-gray-300">
              Book the free 20-minute teardown. I&apos;ll read your AI visibility with you and tell you straight
              whether this is worth doing.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <Link
              href={TEARDOWN_HREF}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
            >
              Book a 20-min teardown
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href={FREE_CHECK_HREF}
              prefetch={false}
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:border-white/50"
            >
              Run my free check first
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
