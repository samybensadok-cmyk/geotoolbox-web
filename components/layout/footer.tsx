import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600">
                <span className="text-xs font-bold text-white leading-none">G</span>
              </div>
              <span className="text-[15px] font-bold tracking-tight text-gray-900">GEO Toolbox</span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs">
              AI search analytics for brands that want to be found. Track your visibility across 7 AI engines.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Product</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/app" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Brand Scanner</Link></li>
              <li><Link href="/#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</Link></li>
              <li><Link href="/app" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Resources</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Blog</Link></li>
              <li><Link href="/feed.xml" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">RSS Feed</Link></li>
              <li><Link href="/blog/what-is-geo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">What is GEO?</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Company</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
              <li><a href="mailto:hello@geotoolbox.ai" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} GEO Toolbox. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
