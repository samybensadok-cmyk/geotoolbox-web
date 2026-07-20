"use client"

import { useEffect, useState } from "react"
import { siteConfig } from "@/lib/config"

const DISMISS_KEY = "promoBannerDismissed:LAUNCH20"

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1")
  }, [])

  if (dismissed) return null

  return (
    <div className="flex items-center justify-center gap-3 bg-accent-600 px-4 py-2 text-center text-sm text-white">
      <p>
        Limited time: <strong>20% off your first payment</strong>, any plan — use code{" "}
        <strong className="font-mono">LAUNCH20</strong> at checkout.{" "}
        <a href={siteConfig.appSignupUrl} className="underline underline-offset-2">
          Get started
        </a>
      </p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1")
          setDismissed(true)
        }}
        className="shrink-0 text-white/80 hover:text-white"
      >
        ✕
      </button>
    </div>
  )
}
