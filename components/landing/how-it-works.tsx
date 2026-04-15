export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Enter your domain",
      body: "Type your website URL. No signup, no credit card. Your first scan is free.",
    },
    {
      num: "02",
      title: "We query 7 AI engines",
      body: "Our system asks ChatGPT, Perplexity, Gemini, Claude, Copilot, Google AI Overviews, and Grok about your brand in real time.",
    },
    {
      num: "03",
      title: "Get your visibility report",
      body: "Visibility score, engine-by-engine results, citability analysis, and competitor benchmarks — in under 2 minutes.",
    },
  ]

  return (
    <section className="bg-gray-50 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-xs font-semibold tracking-wider text-accent-600 uppercase">How it works</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold tracking-tight text-gray-900">
            From URL to insights in minutes
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.num} className="relative rounded-xl bg-white border border-gray-100 p-6">
              {/* Connector line */}
              {i < 2 && (
                <div className="absolute top-1/2 -right-3 hidden h-px w-6 bg-gray-200 sm:block" />
              )}
              <span className="font-mono text-xs font-bold text-accent-600">{step.num}</span>
              <h3 className="mt-3 text-base font-semibold text-gray-900">
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
