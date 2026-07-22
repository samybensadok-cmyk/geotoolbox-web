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
import { DualCTA } from "@/components/features/dual-cta"
import { ScoreLegend } from "@/components/features/score-legend"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { AiEngineLogoGrid } from "@/components/features/ai-engine-logo-grid"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "AI Content Optimization: Grade Any URL",
  description:
    "Why isn't AI citing your page? Get an A-F citability grade, a live per-engine cited/not-cited check, and every signal benchmarked against pages AI cites.",
  openGraph: {
    title: "AI Content Optimization: Grade Any URL's Citability",
    description:
      "Paste a URL. Get a Citability and an AI Readability grade, a live per-engine cited / not-cited check, every signal benchmarked against the pages AI actually cites, and the exact fixes.",
  },
  alternates: { canonical: `${siteConfig.url}/features/content-analyzer` },
}

const steps: Step[] = [
  {
    verb: "Paste",
    title: "Any URL + your keyword",
    body: "Drop in your page, a competitor's, a PDP or a blog post, plus the keyword you want to be cited for. It handles static HTML, server-rendered, and client-rendered React.",
  },
  {
    verb: "Analyze",
    title: "Two scores, checked live",
    body: "It fetches the page as each AI bot, diffs the JS vs no-JS render, and checks live which of six AI engines cite it. Then it pulls the pages those engines do cite and benchmarks yours against them, signal by signal.",
  },
  {
    verb: "Fix",
    title: "A prioritized punch list",
    body: "You get a Citability and an AI Readability grade, the HIGH-impact actions with the gap quantified, and a one-click content brief to rewrite against. Hit Rerun to watch the grade move.",
  },
]

// The real two-module model the analyzer outputs — shown in full to replace the
// old 10-of-19 mock. Citability = content signals benchmarked vs the pages AI
// cites; AI Readability = whether a crawler can reach and render the page.
const citabilitySignals = [
  { name: "Answer capsules", gloss: "Short, link-free answers right under a question heading — the snippet AI lifts verbatim." },
  { name: "Question headings", gloss: "H2/H3s phrased as the questions buyers actually ask an AI engine." },
  { name: "Structured lists", gloss: "Numbered and bulleted lists AI can extract as steps or options." },
  { name: "Statistics with sources", gloss: "Quantified claims with a named source AI can trust and repeat." },
  { name: "Named source attributions", gloss: "“According to [org]…” attributions AI treats as authority." },
  { name: "Inline citations", gloss: "Outbound links to primary sources that signal a researched page." },
  { name: "Data tables", gloss: "Comparison and spec tables AI parses into structured answers." },
  { name: "Expert quotes", gloss: "First-hand expert voice and blockquotes AI weighs as experience." },
  { name: "H2 coverage & word count", gloss: "Topic breadth and depth, measured against the cited pages — not a vanity number, a gap." },
  { name: "Stats front-loaded", gloss: "How much of your evidence lands in the first 30% — the zone AI reads first." },
  { name: "Reading grade & clarity", gloss: "Plain-language scoring; dense prose is harder for AI to quote cleanly." },
  { name: "Freshness & author", gloss: "Visible date, days since update, and a named author — all E-E-A-T signals." },
]

const readabilitySignals = [
  { name: "AI bot access", gloss: "robots.txt checked against the major AI crawlers — and the source line of any block." },
  { name: "JS vs no-JS parity", gloss: "We render with and without JavaScript and diff the word counts; 69% of AI crawlers don't run JS." },
  { name: "JSON-LD structured data", gloss: "Whether schema is present, well-formed, and type-correct." },
  { name: "H1 & heading structure", gloss: "An AI engine uses your H1 and headings to understand the page's topic." },
  { name: "Title & meta description", gloss: "Present, sensible length, and descriptive of the actual content." },
  { name: "Image alt + real src", gloss: "Alt-text coverage, plus images that load from a real src — not lazy-JS an agent never sees." },
  { name: "Render-blocking & Core Web Vitals", gloss: "Blocking scripts, LCP, CLS and TTI on the rendered page." },
  { name: "Open Graph & internal links", gloss: "OG tags, and how many internal links survive without JavaScript." },
  { name: "Framework & host detection", gloss: "WordPress, the CDN, and the plugins in play — so the fix targets the right layer." },
]

const outcomes = [
  {
    tag: "Benchmarked",
    title: "Graded against what's already winning",
    body: "We don't grade you against a generic ideal. Content Analyzer pulls the pages AI actually cites for your keyword and shows you, signal by signal, where you lead and where you trail — so the fix list is grounded in what's already getting picked up, not a checklist.",
  },
  {
    tag: "Per-engine, live",
    title: "Which engines cite it — checked, not guessed",
    body: "ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews and Grok, queried live. You see exactly which cite the page today and which don't, so you know whether you have a content problem or an access problem before you touch a thing.",
  },
  {
    tag: "Access + content",
    title: "The block and the writing, in one pass",
    body: "A blocked GPTBot or a JS-only page keeps you out no matter how good the prose is. Content Analyzer checks robots.txt, the AI bots, JS-render parity, schema and H1 in the same run as the content signals — and names the source of any block so you loop in the right developer.",
  },
  {
    tag: "Gap → draft",
    title: "Ends in a brief, not a to-do",
    body: "Every analysis closes with a prioritized action list and a one-click content brief built from the exact gaps it found, so the next thing you do is write against the fixes, not stare at a score.",
  },
  {
    tag: "Re-runnable",
    title: "Prove the fix shipped",
    body: "Every analysis is stored. Ship a change, hit Rerun, and the grade moves — an audit trail you can hand a developer, a client, or your CMO.",
  },
  {
    tag: "Exportable",
    title: "A report you can attach to a proposal",
    body: "Download the full grade, the per-engine cited-by, the signal benchmark and the readability matrix as a PDF. Clean enough to send to a client, detailed enough to hand to a developer.",
  },
]

const faqs = [
  {
    question: "What does the Citability Score actually measure?",
    answer:
      "It's a grade from A to F (backed by a 0–100 score) for how likely an AI engine is to cite the page. It rolls up the on-page signals AI engines reward — answer capsules, question headings, structured lists, sourced statistics, data tables, freshness — and benchmarks each one against the pages those engines actually cite for your keyword. Alongside it, a separate AI Readability grade covers whether a crawler can even reach and render the page. Two scores, because being citable and being readable are two different problems.",
  },
  {
    question: "Will fixing these signals actually get me cited by ChatGPT and Perplexity?",
    answer:
      "There's no guarantee — AI citation is probabilistic. But the benchmark isn't a generic ideal: it's measured against the pages those engines are already citing for your exact keyword, so closing the gaps moves you toward what's demonstrably winning. And because Content Analyzer checks each engine live, you can ship a fix, hit Rerun, and watch whether a 'not cited' flips to 'cited' — instead of guessing.",
  },
  {
    question: "How is this different from a Lighthouse or SEO audit?",
    answer:
      "Lighthouse grades performance and technical SEO for Google and human visitors. Content Analyzer grades AI citability — answer engine optimization (AEO): it fetches your page as the AI bots, diffs the JS vs no-JS render the way a non-JS crawler sees it, and benchmarks your content signals against the pages AI cites. Different question, different output — a green Lighthouse score tells you nothing about whether ChatGPT can read or will cite you.",
  },
  {
    question: "What's the difference between Content Analyzer and GEO Scan?",
    answer:
      "GEO Scan asks whether AI engines currently cite your brand for a keyword — a live visibility check across a prompt set. Content Analyzer zooms into a single URL to explain why that page is or isn't citable and hand you the fix. Use Scan to measure where you stand, Analyzer to fix the page that's falling short.",
  },
  {
    question: "Does it check whether AI bots can actually crawl my page?",
    answer:
      "Yes — and that's a separate check from the per-engine citation result. The AI Readability module is an AI crawler checker and a robots-txt-for-AI audit built into every page grade: it probes your page against the major AI bot user agents — GPTBot, ClaudeBot, PerplexityBot, Google-Extended and CCBot — and reports which are blocked and where the block lives: robots.txt, an X-Robots-Tag header, an llms.txt directive, or a CDN firewall rule. It also diffs the JS and no-JS render, because most AI crawlers don't execute JavaScript.",
  },
  {
    question: "Does it need access to my analytics or account data?",
    answer:
      "No. Content Analyzer only fetches publicly accessible URLs — the same way an AI crawler would. It never needs your analytics, your CMS, or your account data to grade a page.",
  },
  {
    question: "Can I export the analysis as a report?",
    answer:
      "Yes. Every analysis downloads as a PDF with the full grade, the per-engine cited / not-cited result, the signal benchmark, the AI-readability matrix and the prioritized fixes. Clean enough to attach to a proposal, detailed enough to debug.",
  },
  {
    question: "What does Content Analyzer cost?",
    answer:
      "Nothing extra. It's included on every plan, Free included. Create a free account, no card, and grade your first page today.",
  },
]

const citedEngines = ["chatgpt", "perplexity", "gemini", "claude", "aio", "grok"] as const

export default function ContentAnalyzerPage() {
  return (
    <>
      {/* SoftwareApplication + HowTo schema */}
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "Content Analyzer",
            description:
              "An AI citability checker: grade any URL with a Citability and an AI Readability score, a live per-engine cited / not-cited check, and every on-page signal benchmarked against the pages AI actually cites.",
            url: `${siteConfig.url}/features/content-analyzer`,
            applicationSubCategory: "AI citability checker",
          }),
          howToSchema({
            name: "How to check whether AI will cite your page",
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      {/* Hero — pain-led, dark opening act; the real two-score analyzer result is the light source */}
      <FeatureHero
        featureName="Content Analyzer"
        hue="lilac"
        eyebrow="Content Analyzer"
        title={
          <>
            Why isn&apos;t AI <span className="text-accent-300">citing your content?</span>
          </>
        }
        subhead="AI content optimization without diagnosis is guesswork. Paste any URL and get two grades: Citability for the writing, AI Readability for the access. Plus a live check of which AI engines cite the page today, and every on-page signal benchmarked against the pages AI actually cites for your keyword. Then the exact fixes. On every plan, including Free."
        primaryLabel="Get my citability report"
        primaryHref="/app"
        secondaryLabel="See the signals it checks"
        secondaryHref="#signals"
        microcopy="Live AI-bot fetches + real engine checks, no card required"
      >
        {/* The real two-score analyzer result */}
        <ScreenshotFrame
          src="/screenshots/content-analyzer/citability-result.png"
          alt="A real Content Analyzer result: a Citability Score of A (95/100) and an AI Readability Score of A (90/100), a live per-engine line showing the page cited by Google AI Overview, Perplexity, Claude and Gemini and not cited by Grok and ChatGPT, and three prioritized HIGH-impact actions."
          width={2108}
          height={1134}
          priority
          caption="A real analysis of a StubGroup guide targeting ‘google ads for lawyers’: two grades, a live per-engine cited / not-cited check across six AI engines, and the prioritized fixes — no fabricated mockup."
        />
        {/* Score legend + benchmark note — preserved from the original hero left column */}
        <div className="mt-6">
          <ScoreLegend variant="A-F" />
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-gray-400">
            Each score is a letter grade backed by a 0&ndash;100 number, benchmarked against the pages AI
            actually cite for your keyword &mdash; the guide above scores 95 (Citability) and 90 (AI Readability).
          </p>
        </div>
      </FeatureHero>

      {/* The cost of being uncited */}
      <PainScenarioSection
        eyebrow="The blind spot"
        scenario="You published a thorough guide. It ranks page one, it reads well, your team is proud of it. Then a buyer asks ChatGPT for the best option and it cites a thinner competitor instead &mdash; because that page front-loads its stats and yours buries them, or because Google-Extended is blocked in a robots.txt line nobody remembers adding. There&apos;s no error to catch. You just aren&apos;t in the answer."
        bridge="Two things decide it: whether a crawler can read the page &mdash; 69% of AI crawlers never run your JavaScript, so a client-side-only page can be blank before a word is read &mdash; and whether your content gives an engine more to cite than the pages it already trusts. Content Analyzer checks both: it fetches your URL the way each engine does, checks live which ones already cite it, and benchmarks every signal against the pages they cite instead."
      />

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading="From URL to punch list in minutes" steps={steps} />

      {/* Who it's for — persona self-select (numbered editorial grid, anti-card) */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {[
              { who: "In-house SEO", job: "Find the exact signal keeping a page that ranks out of the AI answer." },
              { who: "Agency", job: "Grade a client's page, export the PDF, and attach the proof to the proposal." },
              { who: "Content lead", job: "Turn the gap into a brief your writer can execute the same day." },
            ].map((p, i) => (
              <div key={p.who} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold leading-none tabular-nums text-accent-500"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{p.who}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{p.job}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it checks — the real two-module model, shown in full */}
      <section id="signals" className="border-t border-[var(--surface-lilac-border)] bg-[var(--surface-lilac)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Two scores, every signal shown
            </p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Citability is the writing. Readability is the access.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              A page can be perfectly written and still invisible to AI because a crawler can&apos;t reach it &mdash;
              or perfectly reachable and never cited because the content gives an engine nothing to lift.
              Content Analyzer grades both, and every signal below is in the report.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
            {/* Citability */}
            <div className="border-t-2 border-accent-200 pt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-gray-900">Citability signals</h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  vs the pages AI cites
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                Benchmarked against the AI-cited pages for your keyword &mdash; each shown as ahead, on par, or behind.
              </p>
              <ul className="mt-5 space-y-3">
                {citabilitySignals.map((s) => (
                  <li key={s.name} className="flex items-start gap-2.5">
                    <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M3 7.5l2.5 2.5L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[14px] leading-snug text-gray-700">
                      <span className="font-semibold text-gray-900">{s.name}</span>
                      <span className="text-gray-500"> &mdash; {s.gloss}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-gray-100 pt-4 text-[13px] leading-relaxed text-gray-500">
                Plus the editorial chips AI weighs: reading grade, clear-language %, stats front-loaded %,
                original data, visible date, named author, FAQ content, and days since the last update.
              </p>
            </div>

            {/* AI Readability */}
            <div className="border-t-2 border-accent-200 pt-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-gray-900">AI Readability checks</h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  can a crawler read it
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                What an AI agent receives when it fetches the page &mdash; access, render parity, and structure. To
                clear access blocks across your whole site first, run{" "}
                <Link href="/features/agent-readiness" className="font-semibold text-accent-700 hover:text-accent-800">
                  Agent Readiness
                </Link>
                .
              </p>
              <ul className="mt-5 space-y-3">
                {readabilitySignals.map((s) => (
                  <li key={s.name} className="flex items-start gap-2.5">
                    <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-accent-600" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M3 7.5l2.5 2.5L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[14px] leading-snug text-gray-700">
                      <span className="font-semibold text-gray-900">{s.name}</span>
                      <span className="text-gray-500"> &mdash; {s.gloss}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The benchmark table screenshot */}
          <div className="mx-auto mt-12 max-w-4xl">
            <ScreenshotFrame
              src="/screenshots/content-analyzer/signal-breakdown.png"
              alt="The signal breakdown table: each content signal shown for your page versus the average of the AI-cited pages, with the gap labeled — e.g. structured lists 3 vs a cited-page average of 11.3 (8.3 behind), statistics with sources 60 vs 39 (21 ahead), word count 3,528 vs 2,414.5."
              width={1219}
              height={1440}
              caption="The benchmark, not an abstraction: every signal scored against the AI-cited pages for the keyword, with the gap quantified so you know exactly what to change."
            />
          </div>
        </div>
      </section>

      {/* CTA repeat at the section break */}
      <section className="border-t border-gray-100 bg-white px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <DualCTA
            primaryLabel="Get my citability report"
            primaryHref="/app"
            microcopy="Live AI-bot fetches + real engine checks, no card required"
          />
        </div>
      </section>

      {/* Per-engine, live — the differentiator */}
      <section className="border-t border-[var(--surface-lilac-border)] bg-[var(--surface-lilac)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            It doesn&apos;t infer. It checks.
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Which AI engines cite the page &mdash; live, per engine.
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-600">
            Most tools estimate AI visibility from training-data patterns. Content Analyzer queries each engine
            live and tells you, for this URL, exactly who cites it and who doesn&apos;t &mdash; so you know whether to
            fix the content, clear an access block, or both. Pair it with{" "}
            <Link href="/features/geo-scan" className="font-semibold text-accent-700 hover:text-accent-800">
              GEO Scan
            </Link>{" "}
            to see whether AI engines cite you for a whole keyword set.
          </p>
          <div className="mt-10">
            <AiEngineLogoGrid
              engines={[...citedEngines]}
              label="Checked live for every analysis — cited or not cited, per engine"
            />
          </div>
        </div>
      </section>

      {/* Act, don't just monitor */}
      <ActVsMonitorWedge
        headline="Most AI-visibility tools show you the gap and stop."
        emphasis="Content Analyzer runs the fix."
        body="A domain-level dashboard tells you your share of voice is down. It can't tell you which line on which page to change. Content Analyzer ends every run with a prioritized, per-signal action list — the exact change, header, or section to add — and a one-click brief built from those gaps."
        example="See &lsquo;Structured lists: 3 vs a cited-page average of 11&rsquo;? That becomes a HIGH action with the target count, then a content brief you can write straight against — and a Rerun to confirm the grade moved."
        link={{ label: "Turn the fixes into a citation-ready draft in Content Studio", href: "/features/content-studio" }}
      />

      {/* Outcomes */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">What makes it different</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              Not another &ldquo;SEO score.&rdquo;
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {outcomes.map((o) => (
              <div key={o.tag}>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{o.tag}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{o.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t border-[var(--surface-lilac-border)] bg-[var(--surface-lilac)] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Where it fits</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
              A performance score and a visibility dashboard answer different questions.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-600">
              Content Analyzer works at the page level. To see every cited and uncited page across your whole
              domain, pair it with{" "}
              <Link href="/features/domain-overview" className="font-semibold text-accent-700 hover:text-accent-800">
                Domain Overview
              </Link>
              .
            </p>
          </div>
          <div className="mt-10">
            <FeatureComparisonTable
              columns={["Lighthouse / PageSpeed", "Profound / Otterly / Peec", "Content Analyzer"]}
              rows={[
                { label: "Audits one URL's on-page signals", cells: ["SEO/perf only", false, true] },
                { label: "Checks AI-bot access + JS-render parity", cells: [false, false, true] },
                { label: "Live per-engine cited / not cited for the page", cells: [false, "Domain-level", true] },
                { label: "Benchmarks signals vs the pages AI cites", cells: [false, false, true] },
                { label: "Exact per-signal fix list", cells: [false, false, true] },
                { label: "Generates a content brief to close the gap", cells: [false, false, true] },
              ]}
              caption="Lighthouse grades performance for Google and humans; domain-level monitors like Profound and Otterly track your whole site's share of voice over time. Only Content Analyzer audits a single URL the way AI reads it, benchmarks it against the pages AI cites, and hands you the fix."
            />
          </div>
        </div>
      </section>

      {/* Light proof — real run, real provenance, no fabricated counters */}
      <section className="border-t border-gray-100 bg-white px-6 py-12">
        <SocialProofBlock
          miniCase={{
            result:
              "Already cited by Google AI Overview, Perplexity, Claude and Gemini — Content Analyzer flagged the one gap (3 structured lists vs an 11.3 cited-page average) keeping the page out of ChatGPT and Grok.",
            attribution: "A real run · a StubGroup guide targeting ‘google ads for lawyers’",
          }}
          engines={[...citedEngines]}
          provenanceLine="Every grade comes from a live fetch of your real URL — the page rendered in a headless browser and probed as the AI crawlers, then benchmarked against the pages those engines actually cite. No cached guesses, no training-data inference."
        />
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures current="content-analyzer" related={["geo-scan", "content-studio", "agent-readiness"]} />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Grade your first page.
            </h2>
            <p className="mt-2 text-base text-gray-300">Results in minutes.</p>
          </div>
          <Link href="/app" prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
            Analyze a page
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
