"use client"

import Link from "next/link"
import { useState } from "react"
import { siteConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo — serif GEO as brand mark */}
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-xl tracking-tight text-gray-900">GEO</span>
          <span className="text-[13px] font-medium text-gray-400">Toolbox</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={siteConfig.appUrl}
            className="rounded-full bg-gray-900 px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-gray-800"
          >
            Start free
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1 md:hidden p-1"
          aria-label="Toggle menu"
        >
          <span className={cn("h-px w-4 bg-gray-900 transition-all duration-200", mobileOpen && "translate-y-[5px] rotate-45")} />
          <span className={cn("h-px w-4 bg-gray-900 transition-all duration-200", mobileOpen && "opacity-0")} />
          <span className={cn("h-px w-4 bg-gray-900 transition-all duration-200", mobileOpen && "-translate-y-[5px] -rotate-45")} />
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-5 md:hidden">
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
            <Link
              href={siteConfig.appUrl}
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white"
            >
              Start free
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
