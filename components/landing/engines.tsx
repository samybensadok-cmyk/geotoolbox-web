const engines = [
  "ChatGPT", "Perplexity", "Gemini", "Claude", "AI Overviews", "Bing Copilot",
]

export function Engines() {
  return (
    <section className="border-y border-gray-100 bg-gray-50/60 px-6 py-7">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="relative inline-flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-600" />
          </span>
          <span className="text-[12px] font-semibold uppercase tracking-widest text-gray-700">
            Every engine that matters
          </span>
        </div>
        <div className="h-4 w-px bg-gray-200 hidden sm:block" />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
          {engines.map((name) => (
            <span
              key={name}
              className="font-mono text-[13px] font-semibold tracking-tight text-gray-800"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
