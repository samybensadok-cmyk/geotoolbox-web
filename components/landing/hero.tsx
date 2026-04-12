import Link from "next/link"
import { HeroMockup } from "./hero-mockup"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-14 pb-0 sm:pt-20 lg:pt-24">
      {/* Subtle gradient blob */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-accent-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 left-1/4 h-[400px] w-[400px] rounded-full bg-accent-50/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Hero text */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-up mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              Now in beta
            </span>
          </div>

          <h1 className="stagger-1 text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.08] tracking-tight text-gray-900">
            See what AI search
            <br />
            <span className="text-gray-300">says about your brand</span>
          </h1>

          <p className="stagger-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-500 sm:text-[17px]">
            Track your visibility across ChatGPT, Perplexity, Gemini, Claude, and 3 more AI engines. One scan, every answer.
          </p>

          {/* CTAs — bigger, bolder */}
          <div className="stagger-2 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="rounded-full bg-gray-900 px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/10"
            >
              Start free trial
            </Link>
            <Link
              href="/#features"
              className="rounded-full border border-gray-200 px-7 py-3.5 text-[15px] font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              See how it works
            </Link>
          </div>

          <p className="stagger-3 mt-3.5 text-xs text-gray-400">
            No credit card required &middot; Results in 30 seconds
          </p>
        </div>

        {/* Product mockup — large, prominent */}
        <div className="stagger-3 relative mx-auto mt-14 max-w-4xl">
          <div className="absolute -inset-6 rounded-2xl bg-gradient-to-b from-accent-100/20 via-accent-50/10 to-transparent blur-2xl" />
          <div className="relative">
            <HeroMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
