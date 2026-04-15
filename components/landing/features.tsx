import Link from "next/link"

/* ——— Card 1: Scan — 6 engines with pulsing citation dots ——— */
function ScanVisual() {
  const engines = [
    { name: "ChatGPT", cited: true, delay: 0 },
    { name: "Perplexity", cited: true, delay: 150 },
    { name: "Gemini", cited: false, delay: 0 },
    { name: "Claude", cited: true, delay: 300 },
    { name: "AI Overviews", cited: true, delay: 450 },
    { name: "Bing Copilot", cited: false, delay: 0 },
  ]
  return (
    <div className="flex h-full min-h-[260px] items-center justify-center p-8">
      <div className="grid w-full grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {engines.map((e) => (
          <EngineRow key={e.name} {...e} />
        ))}
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
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-accent-700">
          +8 this week
        </p>
      </div>
    </div>
  )
}

/* ——— Card 3: Analyze — 19 signals, per-signal strength bars ——— */
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
    { visual: <ScanVisual />, tag: "Scan", title: "Every engine, one run", body: "ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot — scanned on a single prompt.", span: "md:col-span-2" },
    { visual: <ScoreVisual />, tag: "Score", title: "A number your team can align on", body: "Visibility 0–100. Track weekly, set alerts, benchmark competitors.", span: "md:col-span-1" },
    { visual: <AnalyzeVisual />, tag: "Analyze", title: "19 signals, per page", body: "Entity clarity, schema, authority, freshness, structure. See what helps AI cite you.", span: "md:col-span-1" },
    { visual: <IntelVisual />, tag: "Intel", title: "Catch the day they beat you", body: "Who gets recommended instead. Co-cited domains, content gaps, real-time alerts.", span: "md:col-span-2" },
  ]

  return (
    <section id="features" className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
            Capabilities
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
            Full-spectrum AI visibility.
          </h2>
          <p className="mt-4 text-base text-gray-600">
            From scanning to strategy — the workflow SEO teams use to own their presence in AI search.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.tag} className={card.span}>
              <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-[0_20px_40px_-20px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_24px_48px_-20px_rgba(15,23,42,0.14)]">
                {card.visual}
              </div>
              <div className="mt-5 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  {card.tag}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-gray-900">
                  {card.title}
                </h3>
                <p className="mt-1 text-[15px] leading-relaxed text-gray-600">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/10 active:translate-y-[1px]"
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
