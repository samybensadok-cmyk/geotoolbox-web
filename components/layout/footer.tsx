import Link from "next/link"
import { siteConfig } from "@/lib/config"

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-secondary">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
                GEO
              </span>
              <span className="text-text-primary">Toolbox</span>
            </Link>
            <p className="mt-3 text-sm text-text-muted leading-relaxed">
              Track your brand&apos;s visibility across AI search engines. Know where you stand.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Product</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/app" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                  GEO Scanner
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Resources</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/feed.xml" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Company</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-surface-border pt-8 text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} GEO Toolbox. Built by StubGroup.
        </div>
      </div>
    </footer>
  )
}
