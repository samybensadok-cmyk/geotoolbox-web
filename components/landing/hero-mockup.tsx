export function HeroMockup() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
        </div>
        <div className="ml-2 flex-1 rounded bg-gray-100 px-3 py-1 text-[11px] text-gray-400 font-mono">
          geotoolbox.ai/scan
        </div>
      </div>

      {/* Scanner UI mockup */}
      <div className="p-5 sm:p-6">
        {/* Score header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-wider text-gray-400 uppercase">Visibility Score</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-gray-900">72</span>
              <span className="text-sm font-medium text-accent-600">/100</span>
            </div>
          </div>
          <div className="rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-medium text-accent-700">
            Good
          </div>
        </div>

        {/* Engine results */}
        <div className="mt-5 space-y-2.5">
          {[
            { engine: "ChatGPT", status: "Mentioned", color: "bg-accent-500" },
            { engine: "Perplexity", status: "Cited", color: "bg-accent-500" },
            { engine: "Gemini", status: "Not found", color: "bg-gray-300" },
            { engine: "Claude", status: "Mentioned", color: "bg-accent-500" },
            { engine: "Copilot", status: "Not found", color: "bg-gray-300" },
          ].map((row) => (
            <div key={row.engine} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`h-1.5 w-1.5 rounded-full ${row.color}`} />
                <span className="text-sm text-gray-700">{row.engine}</span>
              </div>
              <span className={`text-xs font-medium ${row.color === "bg-accent-500" ? "text-accent-600" : "text-gray-400"}`}>
                {row.status}
              </span>
            </div>
          ))}
        </div>

        {/* Citability bar */}
        <div className="mt-5 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium tracking-wider text-gray-400 uppercase">Citability</span>
            <span className="font-medium text-gray-600">14/19 signals</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
            <div className="h-1.5 rounded-full bg-accent-500" style={{ width: "74%" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
