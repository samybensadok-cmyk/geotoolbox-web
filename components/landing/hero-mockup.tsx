export function HeroMockup() {
  return (
    <div className="rounded-xl border border-gray-200/60 bg-white shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] overflow-hidden ring-1 ring-gray-900/5">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-gray-50/80 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/50" />
        </div>
        <div className="ml-3 flex-1 rounded-md bg-gray-100/80 px-3 py-1 text-[11px] text-gray-400 font-mono">
          geotoolbox.ai/scan/acme-corp
        </div>
      </div>

      {/* Dashboard layout — sidebar + main */}
      <div className="flex min-h-[280px] sm:min-h-[380px]">
        {/* Sidebar */}
        <div className="hidden w-44 shrink-0 border-r border-gray-100 bg-gray-50/50 p-3 sm:block">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-5 rounded bg-accent-600 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">G</span>
            </div>
            <span className="text-[11px] font-semibold text-gray-800">GEO Toolbox</span>
          </div>
          {[
            { label: "Dashboard", active: false },
            { label: "Brand Scan", active: true },
            { label: "Competitors", active: false },
            { label: "Content", active: false },
            { label: "Analytics", active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-md px-2.5 py-1.5 text-[11px] mb-0.5 ${
                item.active
                  ? "bg-accent-50 text-accent-700 font-medium"
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 p-3 sm:p-5">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">acme-corp.com</span>
              <span className="rounded bg-green-50 px-1.5 py-0.5 text-[9px] font-semibold text-green-600">Live</span>
            </div>
            <span className="text-[10px] text-gray-400">Last scan: 2 min ago</span>
          </div>

          {/* Score cards row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">Visibility</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">72</span>
                <span className="text-[10px] text-accent-600 font-semibold">/100</span>
              </div>
              <p className="mt-0.5 text-[9px] text-accent-600">+8 this week</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">Engines found</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">4</span>
                <span className="text-[10px] text-gray-400">/7</span>
              </div>
              <p className="mt-0.5 text-[9px] text-gray-400">57% coverage</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider">Citability</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">14</span>
                <span className="text-[10px] text-gray-400">/19</span>
              </div>
              <p className="mt-0.5 text-[9px] text-accent-600">Strong</p>
            </div>
          </div>

          {/* Engine results table */}
          <div className="rounded-lg border border-gray-100">
            <div className="flex items-center justify-between bg-gray-50/80 px-3 py-2 border-b border-gray-100">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Engine</span>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</span>
            </div>
            {[
              { engine: "ChatGPT", status: "Mentioned", found: true },
              { engine: "Perplexity", status: "Cited with link", found: true },
              { engine: "Gemini", status: "Not found", found: false },
              { engine: "Claude", status: "Mentioned", found: true },
              { engine: "Copilot", status: "Not found", found: false },
              { engine: "Meta AI", status: "Recommended", found: true },
              { engine: "Grok", status: "Not found", found: false },
            ].map((row, i) => (
              <div key={row.engine} className={`flex items-center justify-between px-3 py-2 ${i < 6 ? "border-b border-gray-50" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${row.found ? "bg-accent-500" : "bg-gray-300"}`} />
                  <span className="text-[11px] text-gray-700">{row.engine}</span>
                </div>
                <span className={`text-[10px] font-medium ${row.found ? "text-accent-600" : "text-gray-400"}`}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
