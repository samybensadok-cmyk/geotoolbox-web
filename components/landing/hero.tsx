import Link from "next/link"
import { HeroMockup } from "./hero-mockup"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-24">
      {/* Editorial rule line — anchors asymmetric layout */}
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Text column — left, spans 6 on desktop */}
          <div className="lg:col-span-6">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-600" />
                </span>
                Now in beta
              </span>
            </div>

            <h1 className="stagger-1 mt-6 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              See what AI search says about your brand.
            </h1>

            <p className="stagger-2 mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              One scan, every answer across ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot.
            </p>

            <div className="stagger-2 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/app" prefetch={false}
                className="rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]"
              >
                Start free trial
              </Link>
              <Link
                href="/#features"
                className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
              >
                See how it works
              </Link>
            </div>

            <p className="stagger-3 mt-4 text-xs text-gray-600">
              No credit card &middot; Results in minutes
            </p>
          </div>

          {/* Visual column — right, spans 6 on desktop */}
          <div className="stagger-3 lg:col-span-6" aria-hidden="true">
            <div className="relative lg:-mr-6 xl:-mr-12">
              {/* Soft editorial shadow anchor, not a blob */}
              <div className="absolute -bottom-6 left-8 right-8 h-8 rounded-full bg-gray-900/5 blur-xl" />
              <div className="relative">
                <HeroMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
