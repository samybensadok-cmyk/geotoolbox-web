import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"

export const metadata: Metadata = {
  title: "Content Analyzer — page-level AI citability audit",
  description:
    "Grade any URL A–F for AI citability. 19 signals: schema, bot access, X-Robots, freshness, structure, entity clarity. Know exactly what to fix so AI starts citing your content.",
}

const signals = [
  { name: "Entity clarity", strength: 5, group: "Clarity" },
  { name: "Schema markup", strength: 3, group: "Clarity" },
  { name: "Structure", strength: 5, group: "Clarity" },
  { name: "Heading hierarchy", strength: 4, group: "Clarity" },
  { name: "Freshness", strength: 2, group: "Authority" },
  { name: "Author byline", strength: 3, group: "Authority" },
  { name: "External citations", strength: 4, group: "Authority" },
  { name: "Bot access (all)", strength: 5, group: "Access" },
  { name: "JS vs no-JS parity", strength: 3, group: "Access" },
  { name: "X-Robots-Tag", strength: 5, group: "Access" },
]

const botTable = [
  { bot: "GPTBot (OpenAI)", access: "Allowed", ok: true },
  { bot: "ClaudeBot (Anthropic)", access: "Allowed", ok: true },
  { bot: "PerplexityBot", access: "Allowed", ok: true },
  { bot: "Google-Extended", access: "Blocked", ok: false },
  { bot: "CCBot (CommonCrawl)", access: "Allowed", ok: true },
  { bot: "Amazonbot", access: "Allowed", ok: true },
]

const steps = [
  {
    num: "01",
    verb: "Paste",
    title: "Any URL",
    body: "Your page, a competitor's page, a PDP, a blog post. We handle static HTML, SSR, and client-rendered React.",
    output: "https://stubgroup.com/ai-seo",
  },
  {
    num: "02",
    verb: "Analyze",
    title: "19 signals across 3 categories",
    body: "Clarity, Authority, Access. We fetch the page as each major AI bot, diff JS vs no-JS output, parse schema, and check X-Robots-Tag headers.",
    output: "Clarity 4.2 · Authority 3.1 · Access 4.8",
  },
  {
    num: "03",
    verb: "Fix",
    title: "A concrete punch list",
    body: "Per-signal grade with the exact code change or meta tag needed. Rerun the analyzer to confirm the fix shipped.",
    output: "B+ · 7 fixes prioritized",
  },
]

const outcomes = [
  {
    tag: "Multi-bot",
    title: "Every AI crawler checked",
    body: "GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot. If one bot is blocked, we tell you where — robots.txt, X-Robots-Tag, or CDN firewall.",
  },
  {
    tag: "JS parity",
    title: "What AI actually sees",
    body: "Some AI engines render JS, most don't. We fetch with and without JS execution and flag any content that's only visible to renderers.",
  },
  {
    tag: "A–F grade",
    title: "Shareable output",
    body: "Every analysis produces an A–F score plus per-signal breakdown. Clean enough to send to a developer, detailed enough to debug.",
  },
  {
    tag: "Schema validation",
    title: "Structured data that helps",
    body: "Not just 'has schema yes/no'. We check the schema type matches the content, required fields are present, and the markup is AI-legible.",
  },
]

export default function ContentAnalyzerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs featureName="Content Analyzer" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Content Analyzer
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                Why isn&apos;t AI citing your content?
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Grade any page A–F. 19 signals across clarity, authority, and access. Know exactly what to fix so AI starts citing your pages instead of your competitors&apos;.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" className="rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]">
                  Analyze a page
                </Link>
                <Link href="#signals" className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
                  See the 19 signals
                </Link>
              </div>
            </div>

            {/* Grade card visual */}
            <div className="lg:col-span-6" aria-hidden="true">
              <div className="relative rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-[12px] text-gray-500">stubgroup.com/ai-seo</p>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-gray-600">Citability grade</p>
                    <p className="mt-1 font-mono text-[80px] font-bold leading-none tracking-tight text-accent-700">B+</p>
                  </div>
                  <div className="shrink-0">
                    <div className="flex flex-col gap-2">
                      <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700">
                        Clarity <span className="text-accent-700">4.2</span>
                      </div>
                      <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700">
                        Authority <span className="text-accent-700">3.1</span>
                      </div>
                      <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700">
                        Access <span className="text-accent-700">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">Bot access</p>
                    <span className="font-mono text-[10px] text-gray-500">sample</span>
                  </div>
                  <div className="space-y-1.5">
                    {botTable.map((b) => (
                      <div key={b.bot} className="flex items-center justify-between py-1.5">
                        <span className="text-[13px] text-gray-700">{b.bot}</span>
                        <span className={`font-mono text-[11px] font-semibold ${b.ok ? "text-accent-700" : "text-red-600"}`}>
                          {b.access}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">How it works</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                From URL to punch list in under 60 seconds.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              No wait, no crawl scheduling. Paste a URL, get a grade and the exact fixes. Rerun anytime to verify the change shipped.
            </p>
          </div>

          <ol className="mt-14 divide-y divide-gray-200">
            {steps.map((s) => (
              <li key={s.num} className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:py-10">
                <div className="flex items-center gap-4 md:block">
                  <span className="font-mono text-4xl font-bold tabular-nums text-accent-700 md:text-5xl">{s.num}</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 md:hidden">{s.verb}</span>
                </div>
                <div>
                  <p className="hidden text-xs font-semibold uppercase tracking-widest text-gray-500 md:block">{s.verb}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">{s.body}</p>
                </div>
                <div className="md:text-right">
                  <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-[12px] text-gray-700">
                    <svg className="h-3 w-3 text-accent-600" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6h6m0 0L6 3m3 3L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{s.output}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Signals breakdown */}
      <section id="signals" className="bg-gray-50 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">The 19 signals</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                Three categories. Everything AI cares about.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Every signal maps to a concrete technical or editorial change. No fluff metrics, no AI-era buzzwords — just checks that correlate with getting cited.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-[2rem] border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {signals.map((s) => {
                const dotColor =
                  s.strength >= 4 ? "bg-accent-600"
                  : s.strength >= 3 ? "bg-amber-500"
                  : "bg-red-400"
                const gradeLabel =
                  s.strength >= 4 ? { text: "Strong", color: "text-accent-700" }
                  : s.strength >= 3 ? { text: "Mixed", color: "text-amber-700" }
                  : { text: "Weak", color: "text-red-600" }
                return (
                  <li key={s.name} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-6 py-4 md:px-8">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500 w-20">
                      {s.group}
                    </span>
                    <span className="text-[15px] font-medium text-gray-900">{s.name}</span>
                    <span className={`font-mono text-[11px] font-semibold ${gradeLabel.color}`}>
                      {gradeLabel.text}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`h-2 w-2 rounded-full ${i < s.strength ? dotColor : "bg-gray-200"}`} />
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          <p className="mt-4 text-xs text-gray-600">
            Sample scoring shown. Real results show per-signal evidence, source line, and the exact fix.
          </p>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">What makes it different</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
              Not another &ldquo;SEO score&rdquo;.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
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

      <RelatedFeatures current="content-analyzer" related={["content-brief", "geo-scan", "domain-overview"]} />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Grade your first page.
            </h2>
            <p className="mt-2 text-base text-gray-300">Free while in beta. No credit card. Results in under a minute.</p>
          </div>
          <Link href="/app" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
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
