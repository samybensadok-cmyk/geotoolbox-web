import Link from "next/link"
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button"
import { tools } from "@/lib/tools"
import { localizeNavHref } from "@/lib/i18n/nav"
import { makeLocalizer } from "@/lib/i18n/siblings"
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup"
import { newsletterCopyFrom } from "@/components/newsletter/copy"

export function Footer({
  nav,
  footer,
  locale = "en",
}: {
  nav?: Record<string, string>
  footer?: Record<string, string>
  locale?: string
}) {
  // Two different jobs. localizeNavHref handles section roots and the 13
  // localized /features/<slug> pages (2026-07-22), and leaves EN-only paths
  // (/about, /tools) alone so they don't 404 under /fr. Content deep links
  // can't be prefixed — FR slugs differ from EN — so they go through the
  // donor-slug sibling map instead. Footer is
  // a server component, so it can read that map; the client Header cannot, which
  // is why it only links to section roots.
  const localizeContent = makeLocalizer(locale)
  const L = (href: string) => localizeContent(localizeNavHref(href, locale))

  const nlCopy = newsletterCopyFrom(footer)

  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Newsletter band — double opt-in; `source` tags the placement so
            per-placement conversion is visible in newsletter_subscribers. */}
        <div className="mb-10 grid gap-5 border-b border-gray-200 pb-10 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div>
            <h4 className="text-[15px] font-bold tracking-tight text-gray-900">{nlCopy.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{nlCopy.description}</p>
          </div>
          <NewsletterSignup source="footer" compact copy={nlCopy} />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div>
            <Link href={L("/")} className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600">
                <span className="text-xs font-bold text-white leading-none">G</span>
              </div>
              <span className="text-[15px] font-bold tracking-tight text-gray-900">GEO Toolbox</span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs">
              {footer?.tagline ?? "Generative engine optimization (GEO) for brands that want to be cited. Track AI visibility across eight engines."}
            </p>
          </div>

          {/* Product */}
          {/* Scan & Analyze */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{footer?.scanAnalyze ?? "Scan & Analyze"}</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href={L("/features/geo-scan")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">GEO Scan</Link></li>
              <li><Link href={L("/features/content-analyzer")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Content Analyzer</Link></li>
              <li><Link href={L("/features/content-studio")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Content Studio</Link></li>
            </ul>
          </div>

          {/* Intelligence & Reporting */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{footer?.intelligence ?? "Intelligence"}</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href={L("/features/domain-overview")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Domain Overview</Link></li>
              <li><Link href={L("/features/competitor-intel")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Competitor Intel</Link></li>
              <li><Link href={L("/features/community")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Community</Link></li>
              <li><Link href={L("/features/analytics")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Analytics</Link></li>
              <li><Link href={L("/features")} className="pt-2 inline-block text-sm font-semibold text-gray-900 hover:text-accent-700 transition-colors">{footer?.allFeatures ?? "All features"} →</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{footer?.tools ?? "Tools"}</h4>
            <ul className="mt-3 space-y-2">
              {tools.map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{t.name}</Link>
                </li>
              ))}
              <li><Link href={L("/tools")} className="pt-2 inline-block text-sm font-semibold text-gray-900 hover:text-accent-700 transition-colors">{footer?.allTools ?? "All tools"} →</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{footer?.resources ?? "Resources"}</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href={L("/blog")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.blog ?? "Blog"}</Link></li>
              <li><Link href={L("/glossary")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.glossary ?? "Glossary"}</Link></li>
              <li><Link href="/feed.xml" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.rssFeed ?? "RSS Feed"}</Link></li>
              <li><Link href={L("/blog/what-is-geo")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.whatIsGeo ?? "What is GEO?"}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{footer?.company ?? "Company"}</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href={L("/pricing")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.pricing ?? "Pricing"}</Link></li>
              {/* EN-only service pages — no L(), same convention as /features/<slug> */}
              <li><Link href="/services/ai-seo-agency" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.dfyService ?? "Done-for-you AI SEO"}</Link></li>
              <li><Link href="/services/generative-engine-optimization" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.geoService ?? "GEO services"}</Link></li>
              <li><Link href="/services/answer-engine-optimization" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.aeoService ?? "AEO services"}</Link></li>
              <li><Link href="/services/ai-automation-agency" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.automationService ?? "AI automation & agents"}</Link></li>
              <li><Link href={L("/about")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.about ?? "About"}</Link></li>
              <li><Link href={L("/contact")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.contact ?? "Contact"}</Link></li>
              <li><Link href={L("/privacy")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.privacyPolicy ?? "Privacy Policy"}</Link></li>
              <li><Link href={L("/terms")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.termsOfService ?? "Terms of Service"}</Link></li>
              <li><Link href={L("/affiliate-disclosure")} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.affiliateDisclosure ?? "Affiliate Disclosure"}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} GEO Toolbox. {footer?.rights ?? "All rights reserved."}
          </p>
          <div className="flex gap-4">
            <Link href={L("/privacy")} className="text-xs text-gray-600 hover:text-gray-900 transition-colors">{footer?.privacy ?? "Privacy"}</Link>
            <Link href={L("/terms")} className="text-xs text-gray-600 hover:text-gray-900 transition-colors">{footer?.terms ?? "Terms"}</Link>
            {/* SG_CONSENT_V1: GDPR withdrawal must be as easy as consent */}
            <CookieSettingsButton label={footer?.cookieSettings ?? (locale === "fr" ? "Param\u00e8tres des cookies" : "Cookie settings")} />
          </div>
        </div>
      </div>
    </footer>
  )
}
