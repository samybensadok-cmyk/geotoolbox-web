import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { HeroMockup } from "./hero-mockup"
import { EngineMark, type EngineId } from "./engine-marks"

const HERO_ENGINES: { id: EngineId; label: string }[] = [
  { id: "chatgpt",    label: "ChatGPT" },
  { id: "perplexity", label: "Perplexity" },
  { id: "gemini",     label: "Gemini" },
  { id: "claude",     label: "Claude" },
  { id: "aio",        label: "AI Overviews" },
  { id: "copilot",    label: "Bing Copilot" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-24">
      {/* Ambient depth — two low-opacity radial glows layered behind the
          dotted grid. Peach top-left adds warmth, teal top-right ties to
          the accent + the card aura. Pure decorative; zero runtime cost. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 640px 440px at 12% 18%, rgba(253, 248, 243, 0.65), transparent 70%)",
            "radial-gradient(ellipse 720px 520px at 85% 10%, rgba(204, 251, 241, 0.55), transparent 72%)",
          ].join(","),
        }}
      />

      {/* Dotted grid — now with a subtle vertical gradient so it feels like
          ground (denser toward the bottom, fading toward top). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(15 23 42 / 1) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.9) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.9) 100%)",
          opacity: 0.06,
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Text column — left, spans 6 on desktop */}
          <div className="lg:col-span-6">
            {/* Trust microline — positions the product for audience */}
            <p className="animate-fade-up text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Made by an SEO agency, for SEO teams
            </p>

            <div className="animate-fade-up mt-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-medium text-accent-800">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-600" />
                </span>
                <span className="font-semibold">Free while in beta</span>
                <span aria-hidden="true" className="text-accent-400">&middot;</span>
                <span>1,000 credits/month</span>
              </span>
            </div>

            <h1 className="stagger-1 mt-6 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              See what{" "}
              <span className="relative inline-block text-accent-700">
                AI search
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 -bottom-0.5 h-[2px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(45,212,191,0.55), transparent)",
                  }}
                />
              </span>{" "}
              says about your brand.
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
              First scan in under two minutes &middot; no credit card
            </p>

            {/* Engines strip — mark + name pairs. Monochrome inline SVG
                per engine gives visual variety no competitor has in this
                category. Marks use currentColor so they tint with text. */}
            <div className="stagger-3 mt-8 border-t border-gray-100 pt-5">
              <span className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-500 mb-3">
                Works with
              </span>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                {HERO_ENGINES.map((e) => (
                  <li
                    key={e.id}
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-700"
                  >
                    <EngineMark engine={e.id} className="h-3.5 w-3.5 text-gray-600" />
                    {e.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual column — right, spans 6 on desktop */}
          <div className="stagger-3 lg:col-span-6" aria-hidden="true">
            <div className="relative lg:-mr-6 xl:-mr-12">
              {/* Soft teal aura behind the card — reads as ambient light,
                  not a blob. Layered under the existing gray ground shadow. */}
              <div
                aria-hidden="true"
                className="absolute -inset-10 rounded-[3rem] opacity-70"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(94, 234, 212, 0.18), transparent 70%)",
                  filter: "blur(16px)",
                }}
              />
              {/* Existing ground shadow (keeps card weight grounded) */}
              <div className="absolute -bottom-6 left-8 right-8 h-8 rounded-full bg-gray-900/8 blur-xl" />
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
