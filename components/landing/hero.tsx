import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { HeroMockup } from "./hero-mockup"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-24">
      {/* Subtle dotted-grid backdrop — mirrors the final CTA's grid pattern
          in light mode. Adds texture / editorial-technical tone without
          competing with the mockup. Strictly decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(15 23 42 / 1) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Text column — left, spans 6 on desktop */}
          <div className="lg:col-span-6">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-800">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-600" />
                </span>
                <span className="font-semibold">Free while in beta</span>
                <span aria-hidden="true" className="text-accent-400">&middot;</span>
                <span>no signup required</span>
              </span>
            </div>

            <h1 className="stagger-1 mt-6 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              See what AI search says about your brand.
            </h1>

            <p className="stagger-2 mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              One scan shows exactly how ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, and Bing Copilot describe your brand. The measurement layer for generative engine optimization and AI search visibility.
            </p>

            <div className="stagger-2 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={siteConfig.appUrl} prefetch={false}
                className="rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
              >
                Try it for free
              </Link>
              <Link
                href="/#how-it-works"
                className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
              >
                See how it works
              </Link>
            </div>

            <p className="stagger-3 mt-4 text-xs text-gray-600">
              First scan in under two minutes &middot; runs anonymously
            </p>

            {/* Engines strip — merged in from deleted Engines section.
                Visual anchors which engines we scan without consuming a whole
                section of scroll. */}
            <div className="stagger-3 mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-5 text-[11px] font-mono font-semibold uppercase tracking-widest text-gray-500">
              <span className="text-gray-600">Works with</span>
              <span className="text-gray-700">ChatGPT</span>
              <span className="text-gray-300" aria-hidden="true">&middot;</span>
              <span className="text-gray-700">Perplexity</span>
              <span className="text-gray-300" aria-hidden="true">&middot;</span>
              <span className="text-gray-700">Gemini</span>
              <span className="text-gray-300" aria-hidden="true">&middot;</span>
              <span className="text-gray-700">Claude</span>
              <span className="text-gray-300" aria-hidden="true">&middot;</span>
              <span className="text-gray-700">AI Overviews</span>
              <span className="text-gray-300" aria-hidden="true">&middot;</span>
              <span className="text-gray-700">Bing Copilot</span>
            </div>
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
