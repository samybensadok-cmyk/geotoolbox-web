import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-1.5">
              <span className="font-display text-xl tracking-tight text-gray-900">GEO</span>
              <span className="text-[13px] font-medium text-gray-400">Toolbox</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-xs">
              AI search analytics for brands that want to be found. Track your visibility across 7 AI engines.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Product</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/app" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Brand Scanner</Link></li>
              <li><Link href="/#features" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Features</Link></li>
              <li><Link href="/app" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Resources</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Blog</Link></li>
              <li><Link href="/feed.xml" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">RSS Feed</Link></li>
              <li><Link href="/blog/what-is-geo" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">What is GEO?</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Company</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">About</Link></li>
              <li><a href="mailto:hello@geotoolbox.ai" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} GEO Toolbox. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/about" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="/about" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
