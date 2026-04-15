const engines = [
  "ChatGPT", "Perplexity", "Gemini", "Claude", "Copilot", "Meta AI", "Grok",
]

export function Engines() {
  return (
    <section className="border-y border-gray-100 px-6 py-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6">
        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest shrink-0">
          Scans 7 engines
        </span>
        <div className="h-4 w-px bg-gray-200 hidden sm:block" />
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {engines.map((name) => (
            <span key={name} className="text-[13px] font-semibold text-gray-700">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
