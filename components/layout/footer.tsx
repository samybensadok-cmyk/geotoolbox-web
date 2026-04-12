import Link from "next/link"
import { siteConfig } from "@/lib/config"

const footerLinks = [
  { label: "Scanner", href: "/app" },
  { label: "Features", href: "/#features" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "RSS", href: "/feed.xml" },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-lg text-slate-900">GEO</span>
          <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">Toolbox</span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-slate-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} GEO Toolbox
        </p>
      </div>
    </footer>
  )
}
