import Link from "next/link"

export function Hero() {
  return (
    <section className="relative px-6 pt-20 pb-28 sm:pt-28 sm:pb-36 lg:pt-36 lg:pb-44">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="animate-fade-up text-sm font-medium tracking-widest text-accent-600 uppercase">
            Generative Engine Optimization
          </p>

          {/* Headline — serif for authority */}
          <h1 className="animate-fade-up-delay-1 mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.08] text-slate-900">
            AI search is your
            <br />
            biggest blind spot
          </h1>

          {/* Subhead */}
          <p className="animate-fade-up-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
            ChatGPT, Perplexity, and Gemini are answering questions about your brand right now.
            You have no idea what they&apos;re saying. We fix that.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-delay-3 mt-10 flex items-center gap-6">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 bg-slate-900 text-cream px-6 py-3 text-sm font-medium transition-colors hover:bg-slate-800"
            >
              Scan your brand
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/blog"
              className="text-sm text-slate-500 underline underline-offset-4 decoration-slate-300 hover:text-slate-900 hover:decoration-slate-500 transition-colors"
            >
              Read the research
            </Link>
          </div>
        </div>

        {/* Metric strip — social proof, data-forward */}
        <div className="animate-fade-up-delay-3 mt-20 flex flex-wrap gap-x-12 gap-y-4 border-t border-slate-200 pt-8">
          {[
            { value: "7", label: "AI engines scanned" },
            { value: "830+", label: "brand scans run" },
            { value: "19", label: "citability signals" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="font-display text-3xl text-slate-900">{stat.value}</span>
              <span className="text-sm text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
