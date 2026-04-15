"use client"

import Link from "next/link"
import { useState } from "react"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 -mx-2 px-2 py-2 rounded-md">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-600">
            <span className="text-xs font-bold text-white leading-none">G</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-gray-900">GEO Toolbox</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900 hover:bg-gray-50"
            >
              {item.label}
            </Link>
          ))}
          <div className="ml-3 flex items-center gap-2">
            <Link
              href={siteConfig.appUrl}
              className="rounded-full border border-gray-200 px-3.5 py-1.5 text-[13px] font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              Log in
            </Link>
            <Link
              href={siteConfig.appUrl}
              className="rounded-full bg-gray-900 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-gray-800"
            >
              Start free
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col items-center justify-center gap-1 md:hidden min-h-[44px] min-w-[44px]"
          aria-label="Toggle menu"
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
          <nav className="flex flex-col gap-3">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Link
                href={siteConfig.appUrl}
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-gray-200 py-3 text-center text-sm font-medium text-gray-600"
              >
                Log in
              </Link>
              <Link
                href={siteConfig.appUrl}
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-gray-900 py-3 text-center text-sm font-medium text-white"
              >
                Start free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
