"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/lib/config"

const DISMISS_KEY = "promoBannerDismissed:LAUNCH20"

const COPY = {
  en: {
    message: (
      <>
        Limited time: <strong>20% off your first payment</strong>, any plan — use code{" "}
        <strong className="font-mono">LAUNCH20</strong> at checkout.
      </>
    ),
    cta: "Get started",
    dismiss: "Dismiss",
  },
  fr: {
    message: (
      <>
        Offre de lancement : <strong>-20&nbsp;% sur votre premier paiement</strong> avec le code{" "}
        <strong className="font-mono">LAUNCH20</strong> — valable sur toutes les formules.
      </>
    ),
    cta: "Commencer",
    dismiss: "Fermer",
  },
} as const

export function PromoBanner({ locale = "en" }: { locale?: string }) {
  const [dismissed, setDismissed] = useState(true)
  const pathname = usePathname()
  const t = locale === "fr" ? COPY.fr : COPY.en

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1")
  }, [])

  // Suppress the sitewide discount banner on service (money) pages — a 20%-off
  // code above a $4,000 offer creates discount ambiguity.
  if (pathname?.startsWith("/services")) return null

  if (dismissed) return null

  return (
    <div className="flex items-center justify-center gap-3 bg-accent-700 px-4 py-2 text-center text-sm text-white">
      <p>
        {t.message}{" "}
        <a href={siteConfig.appSignupUrl} className="underline underline-offset-2">
          {t.cta}
        </a>
      </p>
      <button
        type="button"
        aria-label={t.dismiss}
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
