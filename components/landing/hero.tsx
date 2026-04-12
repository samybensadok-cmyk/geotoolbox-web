import Link from "next/link"
import { HeroMockup } from "./hero-mockup"

export function Hero() {
  return (
    <section className="px-6 pt-14 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-10 md:grid-cols-5 md:gap-12">
          {/* Left — copy */}
          <div className="md:col-span-3">
            <div className="animate-fade-up mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                Now in beta
              </span>
            </div>

            <h1 className="stagger-1 text-[clamp(1.875rem,4vw,2.75rem)] font-bold leading-[1.15] tracking-tight text-gray-900">
              AI search analytics{" "}
              <span className="text-gray-400">for brands that want to be found</span>
            </h1>

            <p className="stagger-2 mt-4 max-w-md text-[15px] leading-relaxed text-gray-500">
              See what ChatGPT, Perplexity, Gemini, and 4 more AI engines say about your brand. Visibility score, citability analysis, competitor benchmarks.
            </p>

            {/* CTAs + trust */}
            <div className="stagger-2 mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/app"
                className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Start free trial
              </Link>
              <Link
                href="/#features"
                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
              >
                See features
              </Link>
            </div>

            <p className="stagger-3 mt-3 text-xs text-gray-400">
              No credit card required &middot; Results in 30 seconds
            </p>

            {/* Engine row */}
            <div className="stagger-3 mt-8 flex items-center gap-3 border-t border-gray-100 pt-5">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Scans</span>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {["ChatGPT", "Perplexity", "Gemini", "Claude", "Copilot", "Meta AI", "Grok"].map((name) => (
                  <span key={name} className="text-[12px] text-gray-500">{name}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — mockup */}
          <div className="stagger-3 md:col-span-2">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
