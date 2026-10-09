"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import { localizeNavHref } from "@/lib/i18n/nav"
import { currencyParam } from "@/lib/i18n/currency"
import headerStyles from "./header.module.css"

export function Header({ nav, locale = "en" }: { nav?: Record<string, string>; locale?: string }) {
  // Keeps chrome links inside the visitor's locale. A no-op on `en`, and a
  // no-op for paths with no localized route (they stay on their EN page rather
  // than 404ing under /fr) — see lib/i18n/nav.ts.
  const L = (href: string) => localizeNavHref(href, locale)
  const pathname = usePathname()
  // next-intl rewrites the default homepage internally to /en. Treat both
  // forms identically so its prerendered and hydrated header agree.
  const isHomepage = pathname === `/${locale}` || (locale === "en" && pathname === "/")
  // SG_SIGNUP_STREAMLINE (2026-09-30): the header CTA is the "Start free trial" door — the one-screen
  // signup (website + account, Plus preselected) that goes straight to checkout, with the first
  // AI-visibility scan running meanwhile. The no-card free score stays reachable from the banner and
  // the homepage micro-link. `ref` is read into signup provenance (cta_ref), so every slot is attributable.
  // No plan= here: the server defaults to Plus, and an explicit plan param marks a REAL choice
  // (signup provenance `plan_explicit`). Pricing cards still pass their own plan.
  const startHref = `${siteConfig.appSignupUrl}&ref=${isHomepage ? "home-header" : "nav-header"}${currencyParam(locale)}`
  const startLabel = nav?.startFree ?? "Start free trial"
  const trackStart = () => { if (isHomepage) trackEvent("app_cta_click", { placement: "home_header", cta_target: startHref, locale, design_version: "home_v3" }) }

  const [mobileOpen, setMobileOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false)
  const featuresRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close desktop dropdowns on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setFeaturesOpen(false); setMobileOpen(false) }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!featuresOpen) return
    const onClick = (e: MouseEvent) => {
      if (featuresOpen && featuresRef.current && !featuresRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false)
      }
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [featuresOpen])

  const openFeatures = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setFeaturesOpen(true)
  }
  const scheduleCloseFeatures = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setFeaturesOpen(false), 150)
  }

  return (
    <header data-homepage={isHomepage || undefined} className={cn("sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md", isHomepage && headerStyles.homepage)}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href={L("/")} className="flex items-center gap-2 -mx-2 px-2 py-2 rounded-md">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600">
            <span className="text-xs font-bold text-white leading-none">G</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-gray-900">GEO Toolbox</span>
        </Link>

        {/* Desktop Nav.
            Horizontal padding tightens between md and lg on purpose. The nav
            first appears at md (768px) and the spacing was tuned to the ENGLISH
            labels, which fit with ~32px to spare. Longer locales did not: at
            exactly 768px (iPad portrait) the header pushed the page into
            horizontal scroll — fr by 34px, de by 27px, es by 4px, measured on
            the built output. lg: restores the original spacing.
            VERIFIED after the fix, on a cold browser cache (a stale stylesheet
            silently reproduces the pre-fix numbers, so the check first probes
            that `px-2 lg:px-3` resolves to 12px at >=1024 and 8px below):
            768px is now 0 overflow in every locale, headroom en +48 / de +32 /
            es +32 / fr +30. 375-1280px all clean.
            Do not collapse these back to a single px value without re-measuring
            all four locales at 768px. */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Features mega menu */}
          <div
            ref={featuresRef}
            className="relative"
            onMouseEnter={openFeatures}
            onMouseLeave={scheduleCloseFeatures}
          >
            <button
              type="button"
              onClick={event => event.detail === 0 ? setFeaturesOpen(!featuresOpen) : openFeatures()}
              aria-expanded={featuresOpen}
              aria-haspopup="true"
              className="flex min-h-[40px] items-center gap-1 rounded-md px-2 lg:px-3 text-[13px] font-medium text-gray-700 transition-colors hover:text-gray-900 hover:bg-gray-50"
            >
              {nav?.features ?? "Features"}
              <svg
                className={cn("h-3 w-3 transition-transform duration-200", featuresOpen && "rotate-180")}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m3 5 3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {featuresOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 animate-fade-up" style={{ animationDuration: "0.18s" }}>
                <div className="w-[640px] rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)]">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                    {siteConfig.featureGroups.map((group) => (
                      <div key={group.group}>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                          {group.group}
                        </p>
                        <ul className="mt-2 space-y-0.5">
                          {group.features.map((f) => (
                            <li key={f.slug}>
                              <Link
                                href={L(`/features/${f.slug}`)}
                                onClick={() => setFeaturesOpen(false)}
                                className="group -mx-2 flex flex-col rounded-lg px-2 py-1.5 hover:bg-gray-50"
                              >
                                <span className="text-sm font-semibold text-gray-900 group-hover:text-accent-700">
                                  {f.name}
                                </span>
                                <span className="text-[12px] text-gray-600">{f.desc}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <Link
                      href={L("/features")}
                      onClick={() => setFeaturesOpen(false)}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 hover:text-accent-800"
                    >
                      {nav?.seeAllFeatures ?? "See all features"}
                      <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href={L("/pricing")}
            className="flex min-h-[40px] items-center rounded-md px-2 lg:px-3 text-[13px] font-medium text-gray-700 transition-colors hover:text-gray-900 hover:bg-gray-50"
          >
            {nav?.pricing ?? "Pricing"}
          </Link>

          <Link
            href={L("/services/ai-seo-agency")}
            className="flex min-h-[40px] items-center rounded-md px-2 lg:px-3 text-[13px] font-medium text-gray-700 transition-colors hover:text-gray-900 hover:bg-gray-50"
          >
            {nav?.services ?? "Services"}
          </Link>

          <Link
            href={L("/blog")}
            className="flex min-h-[40px] items-center rounded-md px-2 lg:px-3 text-[13px] font-medium text-gray-700 transition-colors hover:text-gray-900 hover:bg-gray-50"
          >
            {nav?.blog ?? "Blog"}
          </Link>

          <Link
            href={L("/search")}
            aria-label={nav?.search ?? "Search"}
            className="flex min-h-[40px] items-center rounded-md px-3 text-gray-600 transition-colors hover:text-gray-900 hover:bg-gray-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="6" />
              <path d="m14 14 3 3" strokeLinecap="round" />
            </svg>
          </Link>

          <div className="ml-1 lg:ml-3 flex items-center gap-2">
            <Link
              href={siteConfig.appLoginUrl}
              prefetch={false}
              className="flex min-h-[40px] items-center rounded-full border border-gray-200 px-3 lg:px-3.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
            >
              {nav?.login ?? "Log in"}
            </Link>
            {/* Primary CTA: "Start free trial" → the one-screen trial signup (card required,
                $0 today). The no-card free score is reachable from the scan banner. */}
            <Link
              href={startHref}
              prefetch={false}
              onClick={trackStart}
              className="flex min-h-[40px] items-center rounded-full bg-accent-900 px-3 lg:px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-800"
            >
              {startLabel}
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col items-center justify-center gap-1 md:hidden min-h-[44px] min-w-[44px]"
          aria-label={nav?.toggleMenu ?? "Toggle menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
        >
          <span className={cn("h-px w-4 bg-gray-900 transition-all duration-200", mobileOpen && "translate-y-[5px] rotate-45")} />
          <span className={cn("h-px w-4 bg-gray-900 transition-all duration-200", mobileOpen && "opacity-0")} />
          <span className={cn("h-px w-4 bg-gray-900 transition-all duration-200", mobileOpen && "-translate-y-[5px] -rotate-45")} />
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-nav-panel" className="border-t border-gray-100 bg-white px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-1">
            {/* Features group */}
            <button
              type="button"
              onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
              className="flex items-center justify-between rounded-lg px-2 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50"
              aria-expanded={mobileFeaturesOpen}
            >
              {nav?.features ?? "Features"}
              <svg
                className={cn("h-4 w-4 transition-transform duration-200", mobileFeaturesOpen && "rotate-180")}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {mobileFeaturesOpen && (
              <div className="mb-2 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                {siteConfig.featureGroups.map((group) => (
                  <div key={group.group}>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                      {group.group}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {group.features.map((f) => (
                        <li key={f.slug}>
                          <Link
                            href={L(`/features/${f.slug}`)}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-md py-1.5 text-sm font-medium text-gray-800 hover:text-accent-700"
                          >
                            {f.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link
                  href={L("/features")}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700"
                >
                  {nav?.seeAllFeatures ?? "See all features"} →
                </Link>
              </div>
            )}

            <Link
              href={L("/pricing")}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              {nav?.pricing ?? "Pricing"}
            </Link>

            <Link
              href={L("/services/ai-seo-agency")}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              {nav?.services ?? "Services"}
            </Link>

            <Link
              href={L("/blog")}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              {nav?.blog ?? "Blog"}
            </Link>

            <Link
              href={L("/search")}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              {nav?.search ?? "Search"}
            </Link>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={siteConfig.appLoginUrl}
                prefetch={false}
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-gray-200 py-3 text-center text-sm font-medium text-gray-700"
              >
                {nav?.login ?? "Log in"}
              </Link>
              <Link
                href={startHref}
                prefetch={false}
                onClick={() => { trackStart(); setMobileOpen(false) }}
                className="rounded-full bg-accent-900 py-3 text-center text-sm font-medium text-white"
              >
                {startLabel}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
