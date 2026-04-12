"use client"

import Link from "next/link"
import { useState } from "react"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-cream/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-xl text-slate-900">GEO</span>
          <span className="text-sm font-medium tracking-wide text-slate-400 uppercase">Toolbox</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={siteConfig.appUrl}
            className="text-sm font-medium text-accent-700 hover:text-accent-800 transition-colors"
          >
            Launch Scanner
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden p-1"
          aria-label="Toggle menu"
        >
          <span className={cn("h-px w-5 bg-slate-900 transition-all duration-200", mobileOpen && "translate-y-[7px] rotate-45")} />
          <span className={cn("h-px w-5 bg-slate-900 transition-all duration-200", mobileOpen && "opacity-0")} />
          <span className={cn("h-px w-5 bg-slate-900 transition-all duration-200", mobileOpen && "-translate-y-[7px] -rotate-45")} />
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-cream px-6 py-6 md:hidden">
          <nav className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-base text-slate-600 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={siteConfig.appUrl}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-accent-700"
            >
              Launch Scanner
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
