"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const DISMISS_KEY = "promoBannerDismissed:FOUNDING30"

const COPY = {
  en: {
    message: (
      <>
        Founding offer: <strong>30% off for your first 12 months</strong>, any plan — only{" "}
        <strong>20 spots available</strong>. Use code <strong className="font-mono">FOUNDING30</strong> at checkout.
      </>
    ),
    cta: "See plans",
    dismiss: "Dismiss",
  },
  fr: {
    message: (
      <>
        Offre fondateurs : <strong>-30&nbsp;% pendant 12&nbsp;mois</strong> sur toutes les formules —{" "}
        <strong>réservée aux 20 premiers</strong>. Code <strong className="font-mono">FOUNDING30</strong> au paiement.
      </>
    ),
    cta: "Voir les offres",
    dismiss: "Fermer",
  },
  es: {
    message: (
      <>
        Oferta fundadores: <strong>30&nbsp;% de descuento durante 12 meses</strong> en cualquier plan —{" "}
        <strong>solo 20 plazas</strong>. Usa el código <strong className="font-mono">FOUNDING30</strong> al pagar.
      </>
    ),
    cta: "Ver planes",
    dismiss: "Cerrar",
  },
} as const

export function PromoBanner({ locale = "en" }: { locale?: string }) {
  const [dismissed, setDismissed] = useState(true)
  const pathname = usePathname()
  const t = COPY[locale as keyof typeof COPY] ?? COPY.en

  useEffect(() => {
    localStorage.removeItem("promoBannerDismissed:LAUNCH20")
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1")
  }, [])

  // Suppress the sitewide discount banner on service (money) pages — a
  // sitewide discount code above a $4,000 offer creates discount ambiguity.
  if (pathname?.startsWith("/services")) return null

  if (dismissed) return null

  return (
    <div className="flex items-center justify-center gap-3 bg-accent-700 px-4 py-2 text-center text-sm text-white">
      <p>
        {t.message}{" "}
        <a href={locale === "en" ? "/pricing" : `/${locale}/pricing`} className="underline underline-offset-2">
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
