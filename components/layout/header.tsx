"use client"

import Link from "next/link"
import { useState } from "react"
import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border/50 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
            GEO
          </span>
          <span className="text-text-primary">Toolbox</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[15px] font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button href={siteConfig.appUrl} size="sm">
            Try It Free
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "h-0.5 w-5 bg-text-primary transition-all duration-200",
              mobileOpen && "translate-y-2 rotate-45"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-5 bg-text-primary transition-all duration-200",
              mobileOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "h-0.5 w-5 bg-text-primary transition-all duration-200",
              mobileOpen && "-translate-y-2 -rotate-45"
            )}
          />
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-surface-border bg-surface px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-text-secondary hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
            <Button href={siteConfig.appUrl} size="md" className="mt-2 w-full">
              Try It Free
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
