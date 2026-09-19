"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { trackEvent } from "@/lib/analytics"

/** Uses the existing consent-gated analytics helper. Clicks are not conversions. */
export function HomeAction({ href, placement, locale, className, children }: {
  href: string; placement: string; locale: string; className?: string; children: ReactNode
}) {
  return <Link href={href} prefetch={false} className={className}
    onClick={() => trackEvent("app_cta_click", { placement, cta_target: href, locale, design_version: "home_v3" })}>
    {children}
  </Link>
}
