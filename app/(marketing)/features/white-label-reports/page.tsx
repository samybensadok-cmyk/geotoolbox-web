import type { Metadata } from "next"
import Link from "next/link"
import { FeatureHero } from "@/components/features/feature-hero"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { PainScenarioSection } from "@/components/features/pain-scenario"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { ActVsMonitorWedge } from "@/components/features/act-vs-monitor"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { TrustSecurityBlock } from "@/components/features/trust-security"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "White-Label SEO Reports for Agency Clients",
  description:
    "Send clients a monthly white-label SEO report under your own logo and colors, with a link they open without logging in. On Growth plans and up.",
  openGraph: {
    title: "White-Label SEO Reports for Agency Clients | GEO Toolbox",
    description:
      "A monthly, client-facing AI-visibility report under your own brand: logo, accent color, footer, and an optional switch to hide GEO Toolbox entirely.",
  },
  alternates: { canonical: `${siteConfig.url}/features/white-label-reports` },
}

const steps: Step[] = [
  {
    verb: "Brand it",
    title: "Your logo, your colors, your name",
    body: "Upload your agency logo, set an accent color, add a footer line with your contact details — and flip a switch to hide GEO Toolbox from the report entirely if you want it fully unbranded from us.",
  },
  {
    verb: "Automate",
    title: "One report, sent every month",
    body: "Turn on monthly reporting per brand and add any CC recipients — the client's marketing lead, your account manager. Each brand only ever gets one report per month; nothing doubles up.",
  },
  {
    verb: "Share",
    title: "A link the client can open without logging in",
    body: "Every report gets a unique, shareable link your client can open directly — visibility by engine, top-performing prompts, competitor share of voice, and AI Readiness, presented under your brand.",
  },
]

const comparisonRows = [
  { label: "Client-facing report with your own logo & colors", cells: [true, false, true] },
  { label: "Automated, sent every month with no manual work", cells: [false, false, true] },
  { label: "Shareable link the client opens without a login", cells: ["—", false, true] },
  { label: "Built from live cross-engine citation data", cells: [false, true, true] },
  { label: "Option to hide the vendor's own branding entirely", cells: ["—", false, true] },
  { label: "Competitor share-of-voice included automatically", cells: [false, "Manual", true] },
]

const faqs = [
  {
    question: "What gets white-labeled in the SEO report?",
    answer:
      "Your logo, an accent color, and a footer line (contact info, address, whatever you want your client to see). There's also a toggle to hide GEO Toolbox branding from the report entirely, so it reads as your agency's own deliverable.",
  },
  {
    question: "What's actually in the report?",
    answer:
      "Visibility by AI engine (presence, citation rate, share of voice across ChatGPT, Claude, Gemini, Perplexity, Grok, Google AI Overviews, Google AI Mode, and Bing Copilot), the client's top-performing prompts with mention counts and sentiment, a competitor share-of-voice comparison, and an AI Readiness score — all pulled from the same live tracked data as the app.",
  },
  {
    question: "How does the client receive it?",
    answer:
      "Two ways: an automated monthly email (to the account owner plus any CC recipients you add), and a shareable link the client can open directly without creating an account or logging in.",
  },
  {
    question: "Can I turn monthly emails off and just use the link?",
    answer:
      "Yes — monthly automated sending is a per-brand toggle. Leave it off and just send the shareable link whenever you want, on your own schedule.",
  },
  {
    question: "Will a client ever get the same report twice?",
    answer:
      "No. Monthly sends are tracked per brand per calendar month, so a brand only ever receives one automated report in a given month even if something reruns in the background.",
  },
  {
    question: "Which plans include white-label reports?",
    answer:
      "Growth and every plan above it — Scale and Enterprise. It's not available on Free, Starter, or Consultant.",
  },
  {
    question: "Is there a separate cost per client report?",
    answer:
      "No — white-label branding and reporting is included in the plan, not billed per report or per client.",
  },
]

export default function WhiteLabelReportsPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "White-Label Client Reports",
            description:
              "A branded, monthly AI-visibility report for agency clients — the agency's own logo, accent color, and footer, sent automatically and shareable via a login-free link.",
            url: `${siteConfig.url}/features/white-label-reports`,
          }),
          howToSchema({
            name: "How to send a white-labeled AI visibility report to a client",
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      <FeatureHero
        featureName="White-Label Reports"
        hue="amber"
        eyebrow="Client reporting"
        title={
          <>
            Your brand on the report. <span className="text-accent-300">Not ours.</span>
          </>
        }
        subhead="Every client gets a monthly white-label SEO report of their AI visibility, with your logo, your colors, and your footer. Sent automatically, shareable with a link they open without logging in, and with a switch to hide GEO Toolbox entirely so it reads as your own deliverable."
        primaryLabel="See Growth plans"
        primaryHref="/pricing"
        secondaryLabel="How it works"
        secondaryHref="#how"
        microcopy="On Growth plans and up"
      >
        {/* Illustrative report preview — the referenced real screenshot was never
            captured (public/screenshots/white-label-reports/ is empty and the
            image 400s in prod), so this JSX card follows the same explicitly
            illustrative pattern as the analytics/community heroes until a real
            capture replaces it. */}
        <figure
          aria-label="Illustrative example of a white-label report with sample data"
          className="m-0"
        >
          <span className="sr-only">Example, illustrative data:</span>
          <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_30px_80px_-28px_rgba(15,23,42,0.30)]">
            {/* Report masthead — the agency's slots, not ours */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-gray-300 font-mono text-[9px] font-semibold uppercase text-gray-400">
                  Logo
                </span>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">Your Agency</p>
                  <p className="font-mono text-[10px] text-gray-500">AI Visibility Report · Monthly</p>
                </div>
              </div>
              <span className="rounded-full bg-accent-50 px-2.5 py-1 font-mono text-[10px] font-semibold text-accent-700">
                Your accent color
              </span>
            </div>
            {/* Headline stats */}
            <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 text-center">
              {[
                { v: "72", l: "Visibility score" },
                { v: "148", l: "AI citations" },
                { v: "31%", l: "Share of voice" },
              ].map((s) => (
                <div key={s.l} className="px-2 py-4">
                  <div className="font-mono text-2xl font-bold tabular-nums text-gray-900">{s.v}</div>
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-gray-500">{s.l}</div>
                </div>
              ))}
            </div>
            {/* Engine rows */}
            <ul className="divide-y divide-gray-100 px-6">
              {[
                { e: "ChatGPT", s: "Cited", up: true },
                { e: "Perplexity", s: "Cited", up: true },
                { e: "Gemini", s: "Mentioned", up: false },
              ].map((r) => (
                <li key={r.e} className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-[12px] font-medium text-gray-800">{r.e}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      r.up ? "bg-accent-50 text-accent-700" : "bg-amber-50 text-amber-800"
                    }`}
                  >
                    {r.s}
                  </span>
                </li>
              ))}
            </ul>
            {/* White-label footer — the point of the feature */}
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3">
              <span className="font-mono text-[10px] text-gray-500">Prepared by Your Agency</span>
              <span className="font-mono text-[10px] text-gray-400 line-through decoration-gray-400">
                Powered by GEO Toolbox
              </span>
            </div>
          </div>
          <figcaption className="mt-3 text-[12px] leading-relaxed text-gray-400">
            Illustrative preview — your logo, accent color and footer replace ours on every report,
            with a switch to hide GEO Toolbox entirely.
          </figcaption>
        </figure>
      </FeatureHero>

      <PainScenarioSection
        eyebrow="The retainer problem"
        scenario="Your client doesn't log into your tools — they read a monthly deliverable with your agency's name on it. Every AI-visibility platform you've evaluated ships its own dashboard, its own logo, its own login. Sending a screenshot of someone else's software isn't a client report."
        bridge="White-label reports put your brand on the number — logo, colors, footer — and hand your client a link they can open on their own, no account required."
      />

      <div id="how">
        <HowItWorks3Step heading="From your branding to a client's inbox" steps={steps} />
      </div>

      <TrustSecurityBlock
        heading="Built on the same live data, presented under your name"
        items={[
          {
            title: "Real data, not a template",
            body: "Every number in the report — visibility, citation rate, share of voice, top prompts — comes from the same live tracked data behind the Tracker and Domain Overview. Nothing is templated or invented for the report.",
          },
          {
            title: "Optional full unbranding",
            body: "The hide-GEO Toolbox toggle removes our name from the report entirely, so it reads as a deliverable from your agency, not a screenshot of our product.",
          },
          {
            title: "No login required for the client",
            body: "The shareable link opens the report directly — your client never needs to create an account, remember a password, or navigate a dashboard.",
          },
          {
            title: "One send per brand per month",
            body: "Monthly automated sends are logged per brand per calendar month, so a client is never accidentally emailed the same report twice.",
          },
        ]}
      />

      <ActVsMonitorWedge
        body="A raw dashboard export shows the client numbers with no story. White-label reports come pre-assembled — engine-by-engine visibility, the prompts that actually work, and how you stack up against competitors — so it reads like an update from your agency, not a data dump."
        example="A client asks why they're paying you every month. A branded report showing their citation rate climbing across five engines, with competitor share of voice alongside it, answers that question before they finish asking it."
        link={{ label: "Pair it with PR Coverage Tracker for earned-media ROI", href: "/features/pr-coverage-tracker" }}
      />

      <section className="border-t border-[var(--surface-warm-border)] bg-[var(--surface-warm)] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            How it compares
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            White-label reports vs. the alternatives
          </h2>
          <div className="mt-8">
            <FeatureComparisonTable
              columns={["Manual slide deck", "Raw dashboard export", "White-Label Reports"]}
              rows={comparisonRows}
            />
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures
        current="white-label-reports"
        related={["pr-coverage-tracker", "domain-overview", "competitor-intel"]}
      />

      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Send the next report under your brand.
            </h2>
            <p className="mt-2 text-base text-gray-300">Available on Growth and up. See which plan fits.</p>
          </div>
          <Link
            href="/pricing"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            View plans
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
