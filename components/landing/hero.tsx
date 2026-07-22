import Link from "next/link"
import { getTranslations, getLocale } from "next-intl/server"
import { siteConfig } from "@/lib/config"
import { HeroMockup } from "./hero-mockup"
import { EngineMark, type EngineId } from "./engine-marks"

const HERO_ENGINES: { id: EngineId; label: string }[] = [
  { id: "chatgpt",    label: "ChatGPT" },
  { id: "gemini",     label: "Gemini" },
  { id: "perplexity", label: "Perplexity" },
  { id: "claude",     label: "Claude" },
  { id: "aio",        label: "AI Overviews" },
  { id: "aimode",     label: "AI Mode" },
  { id: "copilot",    label: "Bing Copilot" },
  { id: "grok",       label: "Grok" },
]

/**
 * Hero v2 — dark opening act. The page now opens on the same command-center
 * ink the Problem/ScanSignal sections live on, with the light product card as
 * the single bright object ("the product is the light source"). The H1 cycles
 * through all eight engine names via the CSS-only .engine-rotator in
 * globals.css — every name stays in the DOM (SEO/AI-readable), sighted users
 * see one at a time, screen readers get a static sr-only phrase instead.
 */
export async function Hero() {
  const t = await getTranslations("home.hero")
  const locale = await getLocale()
  const base = locale === "en" ? "" : `/${locale}`
  return (
    <section className="relative overflow-hidden bg-gray-950 px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 lg:pt-24">
      {/* Ambient depth — teal aurora top-right + faint cool glow left, tuned
          for the dark ground. Pure decorative; zero runtime cost. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 720px 520px at 85% 8%, rgba(20, 184, 166, 0.14), transparent 70%)",
            "radial-gradient(ellipse 640px 440px at 8% 30%, rgba(56, 189, 248, 0.06), transparent 70%)",
          ].join(","),
        }}
      />

      {/* Dotted grid — light dots on dark, denser toward the bottom so the
          composition feels grounded. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 1) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)",
          opacity: 0.07,
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Text column — left, spans 6 on desktop */}
          <div className="lg:col-span-6">
            {/* Trust microline — positions the product for audience */}
            <p className="animate-fade-up font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {t("trust")}
            </p>

            <div className="animate-fade-up mt-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-800/60 bg-accent-950/40 px-3 py-1 text-xs font-medium text-accent-200">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-400" />
                </span>
                <span className="font-semibold">{t("badgeFree")}</span>
                <span aria-hidden="true" className="text-accent-600">&middot;</span>
                <span>{t("badgeCredits")}</span>
              </span>
            </div>

            <h1 className="stagger-1 mt-6 text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.06] tracking-tight text-white">
              {t("h1Lead")}{" "}
              {/* Static phrase for assistive tech; the cycling list is visual-only. */}
              <span className="sr-only">{t("h1Sr")}</span>
              <span aria-hidden="true" className="engine-rotator inline-grid align-bottom text-accent-300">
                {HERO_ENGINES.map((e) => (
                  <span
                    key={e.id}
                    className="[grid-area:1/1] inline-flex items-center gap-3 whitespace-nowrap"
                  >
                    <EngineMark engine={e.id} className="h-[0.7em] w-[0.7em] shrink-0" />
                    {e.label}
                  </span>
                ))}
              </span>
            </h1>

            <p className="stagger-2 mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
              {t("subhead")}
            </p>
            <p className="stagger-2 mt-3 font-mono text-[12px] text-gray-400">
              {t("proof")}
            </p>

            <div className="stagger-2 mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={siteConfig.appUrl} prefetch={false}
                className="rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 hover:shadow-xl hover:shadow-black/40 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href={`${base}/#how-it-works`}
                className="rounded-full border border-gray-700 px-6 py-3.5 text-[15px] font-medium text-gray-300 transition-colors duration-200 hover:border-gray-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <p className="stagger-3 mt-4 text-xs text-gray-400">
              {t("underCta")}
            </p>

            {/* Engines strip — mark + name pairs, dimmed on dark. */}
            <div className="stagger-3 mt-8 border-t border-gray-800 pt-5">
              <span className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {t("worksWith")}
              </span>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
                {HERO_ENGINES.map((e) => (
                  <li
                    key={e.id}
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-400"
                  >
                    <EngineMark engine={e.id} className="h-3.5 w-3.5 text-gray-500" />
                    {e.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual column — the light product card is the one bright object
              on the dark ground. */}
          <div className="stagger-3 lg:col-span-6" aria-hidden="true">
            <div className="relative lg:-mr-6 xl:-mr-12">
              {/* Teal aura behind the card — ambient light on dark. */}
              <div
                aria-hidden="true"
                className="absolute -inset-10 rounded-[3rem] opacity-80"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(45, 212, 191, 0.16), transparent 70%)",
                  filter: "blur(18px)",
                }}
              />
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
