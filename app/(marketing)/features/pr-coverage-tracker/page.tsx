import type { Metadata } from "next"
import Link from "next/link"
import { FeatureHero } from "@/components/features/feature-hero"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ScreenshotFrame } from "@/components/features/screenshot-frame"
import { PainScenarioSection } from "@/components/features/pain-scenario"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { ActVsMonitorWedge } from "@/components/features/act-vs-monitor"
import { SocialProofBlock } from "@/components/features/social-proof"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { TrustSecurityBlock } from "@/components/features/trust-security"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "PR Coverage Tracker: Prove Earned Media in AI",
  description:
    "Upload your earned media and see which placements are still live, indexed in Google, and cited by AI engines when buyers ask about your client.",
  openGraph: {
    title: "PR Coverage Tracker: Prove Earned Media Works in AI | GEO Toolbox",
    description:
      "See which of your earned media placements are still live, indexed in Google, and cited by AI engines for your client's prompts. Built for proving PR ROI in AI search.",
  },
  alternates: { canonical: `${siteConfig.url}/features/pr-coverage-tracker` },
}

const steps: Step[] = [
  {
    verb: "Upload",
    title: "The coverage you earned",
    body: "Paste a list of placement URLs, or drop in a spreadsheet export: URL, publication, date, headline, in any order. Duplicates get merged. Nothing is fetched until you run a check, and the cost estimate is shown before you do.",
  },
  {
    verb: "Check",
    title: "Live, indexed, and still on-message",
    body: "Every placement is verified in the background, hundreds at a time: is the page still live (a publisher WAF block is never mistaken for a dead link), is the exact URL indexed in Google, and does it still mention the brand?",
  },
  {
    verb: "Attribute",
    title: "Which placements AI actually cites",
    body: "We cross-reference your placements against the sources AI engines cite for the brand's tracked prompts, across all eight engines, so you see exactly which coverage shows up in AI answers, split into own-site versus third-party media, plus the media AI cites for the brand that you're not tracking yet.",
  },
]

const comparisonRows = [
  { label: "Checks every placement is still live", cells: ["Partial", true, true] },
  { label: "Tells a dead link apart from a WAF block", cells: [false, false, true] },
  { label: "Verifies the exact URL is indexed in Google", cells: [false, false, true] },
  { label: "Shows which placements AI engines cite", cells: [false, false, true] },
  { label: "Built on your live AI-citation data", cells: [false, false, true] },
  { label: "Re-runnable monthly for MoM ROI proof", cells: ["Manual", true, true] },
  { label: "Honest co-occurrence framing — no inflated claims", cells: ["—", "—", true] },
]

const faqs = [
  {
    question: "What does PR Coverage Tracker actually do?",
    answer:
      "Upload the media coverage you earned for a brand. It checks each placement is still live, indexed in Google, and still mentions the brand, then cross-references your placements against the sources AI engines cite for that brand's tracked prompts. You see exactly which coverage shows up in AI answers, plus any media AI cites that you're not yet tracking.",
  },
  {
    question: "How is this different from media monitoring like Meltwater?",
    answer:
      "Media monitoring tells you a mention happened. PR Coverage Tracker tells you whether that placement is still live, still indexed, still on-message, and whether AI engines cite it when buyers ask about your client. It measures whether the coverage is working, not whether it existed.",
  },
  {
    question: "Does it claim my coverage caused an AI citation?",
    answer:
      "No. The attribution is co-occurrence: AI engines cite this publication for your prompts. We never claim a placement caused a citation, because that would be dishonest and it wouldn't survive a client's follow-up question. The data is precise about exactly what it proves.",
  },
  {
    question: "What happens with paywalled or WAF-blocked publishers?",
    answer:
      "They're flagged 'blocked,' never 'dead,' and confirmed via a Google index check: a site: query in the brand's market verifying the exact URL still appears. A genuine 404 is the only thing marked dead.",
  },
  {
    question: "How does the Google index check work?",
    answer:
      "For each placement we run a site: query against Google in the brand's market and check whether the exact URL appears. It confirms the page is discoverable, and doubles as proof-of-life for publishers that block the direct check.",
  },
  {
    question: "Which plans include it?",
    answer:
      "PR Coverage Tracker is available on the Scale and Enterprise plans.",
  },
  {
    question: "How much does a check cost?",
    answer:
      "It's metered in credits, with a cost estimate shown before you run it and any unprocessed URLs refunded. A full check of a few hundred placements with Google verification is a few dollars' worth of credits, cheap enough to re-run monthly for month-over-month ROI proof.",
  },
]

export default function PrCoverageTrackerPage() {
  return (
    <>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "PR Coverage Tracker",
            description:
              "Upload earned media coverage URLs and track which placements are still live, indexed in Google, still mention the brand, and cited by AI engines for the brand's prompts.",
            url: `${siteConfig.url}/features/pr-coverage-tracker`,
          }),
          howToSchema({
            name: "How to prove your earned media shows up in AI with PR Coverage Tracker",
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      {/* Hero — pain-led, dark opening act; the real coverage table is the light source */}
      <FeatureHero
        featureName="PR Coverage Tracker"
        hue="amber"
        eyebrow="Earned media in AI search"
        title={
          <>
            You earned the coverage. Can you prove it&apos;s <span className="text-accent-300">still working?</span>
          </>
        }
        subhead={
          <>
            Six months after a campaign, half the links may be dead and you have no idea which placements
            AI engines cite when a buyer asks about your client. Upload your coverage list and get the
            answer: <em>still live</em>, <em>indexed in Google</em>, <em>on-message</em>, and{" "}
            <em>cited by AI</em>, per placement.
          </>
        }
        primaryLabel="See Scale plans"
        primaryHref="/pricing"
        secondaryLabel="How it works"
        secondaryHref="#how"
        microcopy="On Scale & Enterprise plans"
      >
        <ScreenshotFrame
          src="/screenshots/pr-coverage-tracker/coverage-table.png"
          alt="PR Coverage Tracker results: earned media placements with a per-row status — Dead 404, Blocked, Live 200, or Check failed — and a Google index badge (In Google / Not found in Google). A WAF-blocked publisher (ft.com) is confirmed still indexed in Google instead of being marked dead, while a genuine 404 is flagged Dead."
          width={2010}
          height={980}
          priority
          caption="Every placement checked for liveness and Google indexing. A publisher that blocks our crawler (ft.com — “Blocked”) is verified via Google rather than falsely marked dead; a real 404 (top row) is. AI-citation attribution sits alongside, per brand."
        />
      </FeatureHero>

      {/* The blind spot */}
      <PainScenarioSection
        eyebrow="The reporting gap"
        scenario="Your client asks the question every PR retainer eventually faces: &ldquo;What did all this coverage actually do?&rdquo; You can list the placements. What you can&apos;t say, with a spreadsheet and a link checker, is which are still live, which Google still indexes, whether they still mention the brand, or whether any of them show up when someone asks ChatGPT or Perplexity about the brand."
        bridge="PR Coverage Tracker turns that pile of placement URLs into a living scorecard: live-or-dead, indexed-or-not, on-message-or-drifted, and cited-by-AI-or-invisible, for every piece of coverage you earned."
      />

      {/* How it works (HowTo schema source) */}
      <div id="how">
        <HowItWorks3Step heading="From spreadsheet to scorecard, step by step" steps={steps} />
      </div>

      {/* The wedge — honest measurement */}
      <TrustSecurityBlock
        heading="Honest measurement, or it's worthless"
        items={[
          {
            title: "A block is not a dead link",
            body: "Major outlets block automated checks with a WAF. We never report that as dead; it's flagged 'blocked' and confirmed via Google indexing instead, because the page still existing is what matters. A real 404 is marked dead. That distinction is the difference between an honest report and a false alarm to your client.",
          },
          {
            title: "Co-occurrence, not causation",
            body: "We show that AI engines cite a placement for your prompts. We never claim the placement caused the citation. That claim would be dishonest, and it wouldn't survive a smart client's follow-up question.",
          },
          {
            title: "Real citations, not scraped guesses",
            body: "Attribution reads your live Tracker scans, the actual sources AI engines cited across all eight engines. No scraped guesses, no invented numbers.",
          },
          {
            title: "Billable with confidence",
            body: "Every check is metered transparently, with a cost estimate before it runs and unprocessed URLs refunded, so reselling it to a client is clean.",
          },
        ]}
        note="Own-site versus third-party media is split out, so you can show a client exactly which earned placements, not just their own pages, are doing the work in AI answers."
      />

      {/* Act, don't just monitor */}
      <ActVsMonitorWedge
        body="Media monitoring tells you a link exists. PR Coverage Tracker tells you whether it still works: live, indexed, mentioning your client, and cited by the AI engines buyers now ask."
        example="A placement on a major outlet that AI cites for your client's category, graded live and indexed? That's the slide that renews the retainer. A placement that 404'd three months ago? Catch it and replace it before the client does."
        link={{ label: "Pair it with Citation Interceptor for the offsite gaps", href: "/features/citation-interceptor" }}
      />

      {/* Comparison */}
      <section className="border-t border-[var(--surface-warm-border)] bg-[var(--surface-warm)] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            How it compares
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            PR Coverage Tracker vs. the alternatives
          </h2>
          <div className="mt-8">
            <FeatureComparisonTable
              columns={["Spreadsheets & link checks", "Media monitoring", "PR Coverage Tracker"]}
              rows={comparisonRows}
            />
          </div>
        </div>
      </section>

      {/* Light proof — provenance (no fabricated numbers) */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            Built on real data
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Every status comes from a real check, every citation from a real AI answer.
          </h2>
        </div>
        <div className="mt-10">
          <SocialProofBlock provenanceLine="Coverage health and AI-citation attribution are computed from real, live data — your placement URLs and the actual citations across all eight AI engines. Never scraped guesses or invented numbers." />
        </div>
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures
        current="pr-coverage-tracker"
        related={["citation-interceptor", "domain-overview", "analytics", "white-label-reports"]}
      />

      {/* Final CTA — Scale & Enterprise */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Prove your earned media is working.
            </h2>
            <p className="mt-2 text-base text-gray-300">Available on Scale &amp; Enterprise. See which plan fits.</p>
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
