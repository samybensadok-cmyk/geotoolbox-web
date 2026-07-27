import type { ReactNode } from "react"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { Breadcrumbs } from "./breadcrumbs"

/**
 * FeatureHero — the dark opening act for feature detail pages, matching the
 * homepage Hero v2: gray-950 ground, dotted grid, ambient aurora, and the
 * product visual as the single bright object ("the product is the light
 * source"). Each feature keeps its identity through the aurora hue — the same
 * color family its old pastel surface used, now as a glow on dark instead of
 * a tinted ground.
 */

export type AuroraHue =
  | "teal"   // GEO Scan (mint → teal glow)
  | "amber"  // Content Studio / Ask / PR / White-Label (warm cream → amber)
  | "lilac"  // Content Analyzer / Citation Interceptor
  | "steel"  // Domain Overview / Agent Readiness
  | "blush"  // Competitor Intel
  | "iris"   // Query Fan-Out
  | "peach"  // Community
  | "cool"   // Analytics

const AURORA: Record<AuroraHue, { main: string; aura: string }> = {
  teal:  { main: "rgba(20, 184, 166, 0.14)",  aura: "rgba(45, 212, 191, 0.16)" },
  amber: { main: "rgba(245, 158, 11, 0.11)",  aura: "rgba(251, 191, 36, 0.13)" },
  lilac: { main: "rgba(168, 85, 247, 0.12)",  aura: "rgba(192, 132, 252, 0.14)" },
  steel: { main: "rgba(148, 163, 184, 0.13)", aura: "rgba(148, 163, 184, 0.15)" },
  blush: { main: "rgba(244, 63, 94, 0.10)",   aura: "rgba(251, 113, 133, 0.12)" },
  iris:  { main: "rgba(99, 102, 241, 0.13)",  aura: "rgba(129, 140, 248, 0.15)" },
  peach: { main: "rgba(251, 146, 60, 0.10)",  aura: "rgba(253, 186, 116, 0.12)" },
  cool:  { main: "rgba(56, 189, 248, 0.12)",  aura: "rgba(125, 211, 252, 0.14)" },
}

export function FeatureHero({
  featureName,
  hue = "teal",
  eyebrow,
  title,
  subhead,
  proof,
  primaryLabel = "Start free trial",
  primaryHref = siteConfig.appSignupUrl,
  secondaryLabel,
  secondaryHref,
  microcopy = "7-day free trial · cancel anytime",
  base = "",
  breadcrumbLabels,
  children,
}: {
  /** breadcrumb leaf (Features > X) */
  featureName: string
  /** ambient glow color — the feature's old surface hue, translated to dark */
  hue?: AuroraHue
  eyebrow: string
  /** H1 content — accent spans should use text-accent-300 on this ground */
  title: ReactNode
  subhead: ReactNode
  /** optional mono proof microline under the subhead */
  proof?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  microcopy?: ReactNode
  /** locale path prefix for the breadcrumb trail ("" for en, "/fr" for fr) */
  base?: string
  /** localized breadcrumb names; EN defaults keep EN byte-identical */
  breadcrumbLabels?: { home?: string; features?: string }
  /** right visual column — a ScreenshotFrame or mockup card (the light source) */
  children?: ReactNode
}) {
  const { main, aura } = AURORA[hue]
  return (
    <section className="relative overflow-hidden bg-gray-950 px-6 pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pb-24">
      {/* Ambient depth — feature-hued aurora top-right + faint cool glow left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            `radial-gradient(ellipse 720px 520px at 85% 8%, ${main}, transparent 70%)`,
            "radial-gradient(ellipse 640px 440px at 8% 30%, rgba(56, 189, 248, 0.05), transparent 70%)",
          ].join(","),
        }}
      />

      {/* Dotted grid — light dots on dark, denser toward the bottom. */}
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
        <Breadcrumbs featureName={featureName} tone="dark" base={base} labels={breadcrumbLabels} />

        <div
          className={`grid grid-cols-1 items-center gap-12 lg:gap-14 ${
            children ? "lg:grid-cols-12" : ""
          }`}
        >
          {/* Text column */}
          <div className={`animate-fade-up ${children ? "lg:col-span-6" : "max-w-3xl"}`}>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-300">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-bold leading-[1.06] tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-300">{subhead}</p>
            {proof && <p className="mt-3 font-mono text-[12px] text-gray-400">{proof}</p>}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={primaryHref}
                prefetch={false}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 hover:shadow-xl hover:shadow-black/40 active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              >
                {primaryLabel}
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              {secondaryLabel && secondaryHref && (
                <Link
                  href={secondaryHref}
                  className="rounded-full border border-gray-700 px-6 py-3.5 text-[15px] font-medium text-gray-300 transition-colors duration-200 hover:border-gray-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
                >
                  {secondaryLabel}
                </Link>
              )}
            </div>
            {microcopy && <p className="mt-3 text-[13px] text-gray-400">{microcopy}</p>}
          </div>

          {/* Visual column — the light object on the dark ground */}
          {children && (
            <div className="animate-fade-up stagger-2 lg:col-span-6">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-10 rounded-[3rem] opacity-80"
                  style={{
                    background: `radial-gradient(ellipse 70% 55% at 50% 45%, ${aura}, transparent 70%)`,
                    filter: "blur(18px)",
                  }}
                />
                <div className="relative">{children}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
