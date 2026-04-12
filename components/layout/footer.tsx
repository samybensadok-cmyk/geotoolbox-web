import Link from "next/link"
import { siteConfig } from "@/lib/config"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-lg tracking-tight text-gray-900">GEO</span>
          <span className="text-[13px] font-medium text-gray-400">Toolbox</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-5">
          {[
            { label: "Features", href: "/#features" },
            { label: "Blog", href: "/blog" },
            { label: "Scanner", href: "/app" },
            { label: "RSS", href: "/feed.xml" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] text-gray-400 transition-colors hover:text-gray-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} GEO Toolbox
        </p>
      </div>
    </footer>
  )
}
