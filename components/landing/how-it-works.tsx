export function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Enter your domain",
      body: "Type your website URL. No signup required to run your first scan.",
    },
    {
      num: "2",
      title: "We scan 7 AI engines",
      body: "Our system queries ChatGPT, Perplexity, Gemini, Claude, Copilot, Meta AI, and Grok about your brand.",
    },
    {
      num: "3",
      title: "Get your visibility report",
      body: "See your score, engine-by-engine results, citability analysis, and competitor benchmarks — in 30 seconds.",
    },
  ]

  return (
    <section className="bg-gray-50 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-wider text-accent-600 uppercase">How it works</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold tracking-tight text-gray-900">
            From URL to insights in 30 seconds
          </h2>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                {step.num}
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
