/* Only the first engine has `pinging: true` — a single live pulse reads as
   "currently scanning" without competing with the Scan Signal animation
   further down the page. Others show static dots. */
const engines = [
  { name: "ChatGPT",      status: "Cited",       variant: "cited",   pinging: true },
  { name: "Perplexity",   status: "Cited",       variant: "cited",   pinging: false },
  { name: "Gemini",       status: "Not found",   variant: "missing", pinging: false },
  { name: "Claude",       status: "Mentioned",   variant: "cited",   pinging: false },
  { name: "AI Overviews", status: "Recommended", variant: "cited",   pinging: false },
  { name: "Bing Copilot", status: "Not found",   variant: "missing", pinging: false },
]

export function HeroMockup() {
  return (
    <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
      {/* "Live" pill — tiny identity tell that this is a real product, not a static screenshot */}
      <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-accent-700 shadow-sm backdrop-blur">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-500" />
        </span>
        Live
      </span>

      {/* Query row */}
      <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 pr-24 font-mono text-[13px] text-gray-700">
        <svg className="h-4 w-4 shrink-0 text-accent-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 3.5 3.5" strokeLinecap="round" />
        </svg>
        <span className="truncate">best CRM software for small business</span>
      </div>

      {/* Engine response rows */}
      <div className="mt-5 divide-y divide-gray-100">
        {engines.map((e) => (
          <div key={e.name} className="flex items-center justify-between py-2.5">
            <span className="text-sm font-medium text-gray-800">{e.name}</span>
            <div className="flex items-center gap-2.5">
              {e.variant === "cited" ? (
                <span className="relative inline-flex h-2 w-2">
                  {e.pinging && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-60" />
                  )}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full border border-gray-300" />
              )}
              <span
                className={
                  e.variant === "cited"
                    ? "text-xs font-semibold text-accent-700 tabular-nums"
                    : "text-xs text-gray-500 tabular-nums"
                }
              >
                {e.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer score bar */}
      <div className="mt-5 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">
          Visibility
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold tabular-nums text-gray-900">57</span>
          <span className="font-mono text-xs text-gray-500">/100</span>
          <span className="ml-3 font-mono text-[11px] text-gray-500">6 engines &middot; 2.3s</span>
        </div>
      </div>
    </div>
  )
}
