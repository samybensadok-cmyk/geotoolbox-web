export function HeroMockup() {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white shadow-2xl shadow-gray-300/25 overflow-hidden ring-1 ring-gray-900/5">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-gray-50/80 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-300/60" />
          <div className="h-2 w-2 rounded-full bg-yellow-300/60" />
          <div className="h-2 w-2 rounded-full bg-green-300/60" />
        </div>
        <div className="ml-3 flex-1 rounded-md bg-gray-100/80 px-3 py-1 text-[10px] text-gray-400 font-mono">
          geotoolbox.ai/scan/acme-corp
        </div>
      </div>

      {/* Scanner UI */}
      <div className="p-4 sm:p-5">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-accent-100 flex items-center justify-center">
              <div className="h-2 w-2 rounded-sm bg-accent-600" />
            </div>
            <span className="text-xs font-semibold text-gray-900">acme-corp.com</span>
          </div>
          <span className="text-[10px] text-gray-400">Last scan: 2 min ago</span>
        </div>

        {/* Score + gauge */}
        <div className="flex items-start justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <p className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">Visibility Score</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-gray-900">72</span>
              <span className="text-xs font-medium text-accent-600">/100</span>
            </div>
            <p className="mt-1 text-[10px] text-accent-600 font-medium">+8 from last week</p>
          </div>
          {/* Mini gauge */}
          <div className="flex flex-col items-end gap-1">
            <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-semibold text-accent-700">Good</span>
            <div className="flex gap-0.5 mt-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`h-3 w-1 rounded-full ${i < 7 ? "bg-accent-500" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Engine results */}
        <div className="mt-3 divide-y divide-gray-50">
          {[
            { engine: "ChatGPT", status: "Mentioned", found: true },
            { engine: "Perplexity", status: "Cited with link", found: true },
            { engine: "Gemini", status: "Not found", found: false },
            { engine: "Claude", status: "Mentioned", found: true },
            { engine: "Copilot", status: "Not found", found: false },
            { engine: "Meta AI", status: "Recommended", found: true },
          ].map((row) => (
            <div key={row.engine} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${row.found ? "bg-accent-500" : "bg-gray-300"}`} />
                <span className="text-xs text-gray-700">{row.engine}</span>
              </div>
              <span className={`text-[10px] font-medium ${row.found ? "text-accent-600" : "text-gray-400"}`}>
                {row.status}
              </span>
            </div>
          ))}
        </div>

        {/* Citability */}
        <div className="mt-3 rounded-lg bg-gray-50 p-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-medium tracking-wider text-gray-400 uppercase">Content Citability</span>
            <span className="font-semibold text-gray-700">14/19 signals</span>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-gray-200">
            <div className="h-1 rounded-full bg-accent-500 transition-all" style={{ width: "74%" }} />
          </div>
          <div className="mt-2 flex gap-1.5 flex-wrap">
            {["Schema", "Freshness", "Authority", "Structure"].map((s) => (
              <span key={s} className="rounded bg-accent-50 px-1.5 py-0.5 text-[9px] font-medium text-accent-700">{s}</span>
            ))}
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-400">+10 more</span>
          </div>
        </div>
      </div>
    </div>
  )
}
