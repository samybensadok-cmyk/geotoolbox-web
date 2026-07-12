import Link from "next/link"

/* ——— Card 1: Scan — 8 engines with pulsing citation dots ——— */
function ScanVisual() {
  const engines = [
    { name: "ChatGPT", cited: true, delay: 0 },
    { name: "Perplexity", cited: true, delay: 150 },
    { name: "Gemini", cited: false, delay: 0 },
    { name: "Claude", cited: true, delay: 300 },
    { name: "AI Overviews", cited: true, delay: 450 },
    { name: "AI Mode", cited: true, delay: 525 },
    { name: "Bing Copilot", cited: false, delay: 0 },
    { name: "Grok", cited: true, delay: 600 },
  ]
  return (
    <div className="flex h-full min-h-[260px] flex-col justify-between p-8">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <span className="truncate font-mono text-[12px] text-gray-600">&ldquo;best CRM software for small business&rdquo;</span>
        <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700">live</span>
      </div>
      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {engines.map((e) => (
          <EngineRow key={e.name} {...e} />
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 font-mono text-[11px]">
        <span className="text-gray-500">
          cited <span className="font-semibold text-accent-700">6 / 8</span> engines
        </span>
        <span className="text-gray-500">
          visibility <span className="font-semibold text-accent-700">71</span>
          <span className="text-gray-400">/100</span>
        </span>
      </div>
    </div>
  )
}

function EngineRow({ name, cited, delay }: { name: string; cited: boolean; delay: number }) {
  return (
    <div className="flex items-center gap-2.5">
      {cited ? (
        <span className="relative inline-flex h-2 w-2 shrink-0">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60"
            style={{ animationDelay: `${delay}ms` }}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
        </span>
      ) : (
        <span className="inline-flex h-2 w-2 shrink-0 rounded-full border border-gray-300" />
      )}
      <span className={`text-sm font-medium ${cited ? "text-gray-900" : "text-gray-500"}`}>
        {name}
      </span>
    </div>
  )
}

/* ——— Card 2: Score — big number + sparkline ——— */
function ScoreVisual() {
  const trend = [32, 48, 41, 55, 60, 64, 72]
  const max = Math.max(...trend)
  return (
    <div className="flex h-full min-h-[260px] flex-col justify-between p-8">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[64px] font-bold leading-none tracking-tight tabular-nums text-accent-700">
          72
        </span>
        <span className="font-mono text-base text-gray-500">/100</span>
      </div>
      <div className="mt-8">
        <div className="flex h-16 items-end gap-1.5">
          {trend.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-accent-500/80"
              style={{
                height: `${(v / max) * 100}%`,
                opacity: i === trend.length - 1 ? 1 : 0.4 + (i / trend.length) * 0.4,
              }}
            />
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
          +8 this week
        </p>
      </div>
    </div>
  )
}

/* ——— Card 3: Analyze — per-signal strength bars ——— */
function AnalyzeVisual() {
  const signals = [
    { label: "Entity clarity", strength: 5 },
    { label: "Schema markup", strength: 3 },
    { label: "Authority", strength: 4 },
    { label: "Freshness", strength: 2 },
    { label: "Structure", strength: 5 },
  ]
  return (
    <div className="flex h-full min-h-[260px] flex-col justify-center gap-3 p-8">
      {signals.map((s) => (
        <div key={s.label} className="flex items-center gap-4">
          <span className="flex-1 text-[13px] font-medium text-gray-700">{s.label}</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  i < s.strength ? "bg-accent-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ——— Card 4: Intel — competitor rows ——— */
function IntelVisual() {
  const rows = [
    { prompt: "best seo audit tool", you: true, comp: "ahrefs.com", compCited: true },
    { prompt: "rank tracking software", you: false, comp: "semrush.com", compCited: true },
    { prompt: "backlink checker", you: true, comp: "ahrefs.com", compCited: true },
  ]
  return (
    <div className="flex h-full min-h-[260px] flex-col justify-center gap-3 p-8">
      {rows.map((r) => (
        <div key={r.prompt} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="truncate font-mono text-[12px] text-gray-600">{r.prompt}</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <StatusDot cited={r.you} />
              <span className="text-[13px] font-medium text-gray-900">you</span>
            </div>
            <span className="text-[11px] text-gray-500">vs</span>
            <div className="flex items-center gap-2">
              <StatusDot cited={r.compCited} />
              <span className="text-[13px] font-medium text-gray-700">{r.comp}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusDot({ cited }: { cited: boolean }) {
  return cited ? (
    <span className="h-2 w-2 rounded-full bg-accent-500" />
  ) : (
    <span className="h-2 w-2 rounded-full border border-gray-300" />
  )
}

/* ——— Section ——— */
export function Features() {
  const cards = [
    { visual: <ScanVisual />, tag: "Scan", title: "See where AI cites you — and where it doesn't", body: "GEO Scan runs one prompt across all eight engines; Query Fan-Out captures the dozens of sub-questions they really ask. Your domain, your competitors, every citation.", span: "md:col-span-2" },
    { visual: <ScoreVisual />, tag: "Track", title: "One score, week over week", body: "Domain Overview rolls every scan into a single 0–100 visibility score, with GSC + GA4 attribution — so you catch drift before it costs you traffic.", span: "md:col-span-1" },
    { visual: <AnalyzeVisual />, tag: "Analyze & act", title: "Find why a page isn't cited — then fix it", body: "Content Analyzer grades any URL across 21 citability signals; Content Studio briefs and writes the fix. Turn a Not-found into a citation.", span: "md:col-span-1" },
    { visual: <IntelVisual />, tag: "Own the gap", title: "Win the prompts competitors are taking", body: "Competitor Intel tracks who's cited instead of you; Citation Interceptor and Community surface the offsite threads AI quotes — so you show up where the answer is formed.", span: "md:col-span-2" },
  ]

  return (
    <section id="features" className="bg-accent-50/40 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            The workflow
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
            See it. Fix it. Own it.
          </h2>
          <p className="mt-4 text-base text-gray-600">
            13 tools across one workflow — from the first scan to the published fix that wins the citation.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.tag} className={card.span}>
              <div
                aria-hidden="true"
                className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_24px_48px_-20px_rgba(15,23,42,0.14)]"
              >
                {card.visual}
              </div>
              <div className="mt-5 px-1">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  {card.tag}
                </p>
                <h3 className="mt-2 text-[22px] font-bold leading-tight tracking-tight text-gray-900 md:text-[24px]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The full 13 — substantiate the breadth a borderless index, not cards */}
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-9 border-t border-gray-100 pt-12 sm:grid-cols-4">
          {[
            { stage: "Scan", tools: [["GEO Scan", "geo-scan"], ["Query Fan-Out", "query-fanout"], ["Agent Readiness", "agent-readiness"]] },
            { stage: "Analyze", tools: [["Content Analyzer", "content-analyzer"], ["Content Studio", "content-studio"]] },
            { stage: "Intelligence", tools: [["Domain Overview", "domain-overview"], ["Competitor Intel", "competitor-intel"], ["Citation Interceptor", "citation-interceptor"], ["Community", "community"], ["Ask GeoToolBox", "ask-geotoolbox"]] },
            { stage: "Report", tools: [["Analytics", "analytics"], ["PR Coverage Tracker", "pr-coverage-tracker"], ["White-Label Reports", "white-label-reports"]] },
          ].map((g) => (
            <div key={g.stage}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700">
                {g.stage}
              </p>
              <ul className="mt-3 space-y-2">
                {g.tools.map(([name, slug]) => (
                  <li key={slug}>
                    <Link
                      href={`/features/${slug}`}
                      className="text-[14px] font-medium text-gray-700 transition-colors hover:text-accent-700"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-lg text-[15px] leading-relaxed text-gray-600">
            13 tools across scan, analyze, act, and track.{" "}
            <Link href="/features" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              Explore all 13&nbsp;→
            </Link>
          </p>
          <Link
            href="/app" prefetch={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]"
          >
            Run your first scan
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
