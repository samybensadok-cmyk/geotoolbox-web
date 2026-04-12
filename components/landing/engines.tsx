const engines = [
  "ChatGPT", "Perplexity", "Gemini", "Claude", "Copilot", "Meta AI", "Grok",
]

export function Engines() {
  return (
    <section className="border-y border-gray-100 px-6 py-8">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider shrink-0">
          Scans 7 AI engines
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {engines.map((name) => (
            <span key={name} className="text-sm font-medium text-gray-400">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
