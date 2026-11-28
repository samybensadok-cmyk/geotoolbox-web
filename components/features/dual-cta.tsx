import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { Arrow, kit as k } from "@/components/brand/dark-kit"
import s from "./fx.module.css"

/**
 * DualCTA — a configurable feature-page CTA band giving both buyer archetypes an
 * on-ramp: a low-friction self-serve primary (→ /app, 7-day free trial) plus an
 * optional artifact secondary ("See a sample report"). Distinct from the
 * homepage-specific components/landing/cta.tsx. Drop at every section break.
 */

export function DualCTA({
  primaryLabel = "Start free trial",
  primaryHref = siteConfig.appSignupUrl,
  secondaryLabel,
  secondaryHref,
  microcopy = "7-day free trial · cancel anytime",
  align = "center",
}: {
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  microcopy?: string
  align?: "center" | "left"
}) {
  return (
    <div className={align === "center" ? s.dualCenter : s.dualLeft}>
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
  )
}
