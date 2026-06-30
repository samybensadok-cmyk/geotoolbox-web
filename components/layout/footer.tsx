import Link from "next/link"
import { tools } from "@/lib/tools"

export function Footer({ nav, footer }: { nav?: Record<string, string>; footer?: Record<string, string> }) {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
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
              <li><Link href="/features/geo-scan" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">GEO Scan</Link></li>
              <li><Link href="/features/content-analyzer" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Content Analyzer</Link></li>
              <li><Link href="/features/content-studio" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Content Studio</Link></li>
            </ul>
          </div>

          {/* Intelligence & Reporting */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{footer?.intelligence ?? "Intelligence"}</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/features/domain-overview" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Domain Overview</Link></li>
              <li><Link href="/features/competitor-intel" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Competitor Intel</Link></li>
              <li><Link href="/features/community" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Community</Link></li>
              <li><Link href="/features/analytics" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Analytics</Link></li>
              <li><Link href="/features" className="pt-2 inline-block text-sm font-semibold text-gray-900 hover:text-accent-700 transition-colors">{footer?.allFeatures ?? "All features"} →</Link></li>
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
              <li><Link href="/tools" className="pt-2 inline-block text-sm font-semibold text-gray-900 hover:text-accent-700 transition-colors">{footer?.allTools ?? "All tools"} →</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{footer?.resources ?? "Resources"}</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.blog ?? "Blog"}</Link></li>
              <li><Link href="/glossary" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.glossary ?? "Glossary"}</Link></li>
              <li><Link href="/feed.xml" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.rssFeed ?? "RSS Feed"}</Link></li>
              <li><Link href="/blog/what-is-geo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.whatIsGeo ?? "What is GEO?"}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{footer?.company ?? "Company"}</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.pricing ?? "Pricing"}</Link></li>
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.about ?? "About"}</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{nav?.contact ?? "Contact"}</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.privacyPolicy ?? "Privacy Policy"}</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.termsOfService ?? "Terms of Service"}</Link></li>
              <li><Link href="/affiliate-disclosure" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{footer?.affiliateDisclosure ?? "Affiliate Disclosure"}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} GEO Toolbox. {footer?.rights ?? "All rights reserved."}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">{footer?.privacy ?? "Privacy"}</Link>
            <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">{footer?.terms ?? "Terms"}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
