import type { ReactNode } from "react"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { Arrow, Index, kit as k } from "@/components/brand/dark-kit"
import { geist } from "@/components/landing/v3/geist"
import { Breadcrumbs } from "./breadcrumbs"
import s from "./fx.module.css"

/**
 * FeatureHero: the opening act of every feature detail page, on the dark kit (2026-11-28). One H1
 * (the accent span renders as the kit's lime highlight), a mono index label, a lime + outline CTA
 * pair, and the product visual on the right. The visual box is `data-zoomable`: the site lightbox
 * clones it outside <DarkPage>, so the box carries the kit tokens and the feature skin itself.
 */

export type AuroraHue =
  | "teal"   // GEO Scan
  | "amber"  // Content Studio / Ask / PR / White-Label
  | "lilac"  // Content Analyzer / Citation Interceptor
  | "steel"  // Domain Overview / Agent Readiness
  | "blush"  // Competitor Intel
  | "iris"   // Query Fan-Out
  | "peach"  // Community
  | "cool"   // Analytics

export function FeatureHero({
  featureName,
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
  /** kept for API compatibility; the dark kit uses one lime glow for every feature */
  hue?: AuroraHue
  eyebrow: string
  /** H1 content; a `text-accent-300` span renders as the lime highlight */
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
  /** right visual column: a ScreenshotFrame or mockup card */
  children?: ReactNode
}) {
  return (
    <section className={`${k.heroGlow} ${s.hero}`}>
      <div className={k.wrap}>
        <Breadcrumbs featureName={featureName} tone="dark" base={base} labels={breadcrumbLabels} />

        <div className={children ? s.heroSplit : s.heroSolo}>
          <div>
            <Index label={eyebrow} />
            <h1 className={s.heroTitle}>{title}</h1>
            <p className={s.heroLead}>{subhead}</p>
            {proof && <p className={s.proof}>{proof}</p>}

            <div className={s.ctas}>
              <Link href={primaryHref} prefetch={false} className={k.btnLime}>
                {primaryLabel}
                <Arrow />
              </Link>
              {secondaryLabel && secondaryHref && (
                <Link href={secondaryHref} className={k.btnOutline}>
                  {secondaryLabel}
                </Link>
              )}
            </div>
            {microcopy && <p className={s.micro}>{microcopy}</p>}
          </div>

          {children && (
            <div className={s.heroVisual}>
              {/* data-zoomable: the site-wide ImageLightbox clones this DOM mockup into a scaled overlay
                  on click (vector-crisp zoom). */}
              <div className={`${k.page} ${geist.variable} ${s.skin} ${s.zoomBox}`} data-zoomable="" data-dark-page="">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
