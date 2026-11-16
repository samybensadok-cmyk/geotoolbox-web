"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"
import { PLANS } from "@/lib/plans"
import { BF, bfEndLabel, bfLocale, bfPhase, formatBfCountdown, isBfRush } from "@/lib/black-friday"
import { useCountdown } from "@/components/promo/use-countdown"
import type { SaleLocale } from "@/lib/sale"
import { isEuroLocale } from "@/lib/i18n/currency"

/**
 * SG_BF2026_EXIT_V1 (2026-11-16) — desktop exit-intent popup for the Black Friday SaaS offer. Same mechanics as
 * components/layout/exit-intent-popup.tsx (FOUNDING30): arms after 8 s, fires once on the mouse leaving through the
 * top of the viewport, fine-pointer devices only, Esc/backdrop/✕/"no thanks" = permanent dismiss under a campaign
 * key, focus trap. Hidden on /pricing (already selling), /app (in product) and /services (own Black Friday offer).
 * No code: the backend applies the discount at checkout, so the CTA is a plain link to /pricing (annual preselected).
 */
const DISMISS_KEY = `bfExitDismissed:${BF.campaign}:v1`
const SHOWN_KEY = `bfExitShown:${BF.campaign}:v1`
const ARM_DELAY_MS = 8_000

const STARTER = PLANS.find((p) => p.id === "starter")
const YR = STARTER?.priceYearly ?? 948
const LIST_MO = Math.round((YR / 12) * 100) / 100 // 79
const BF_MO = Math.round(((YR * (100 - BF.annualPercentOff)) / 100 / 12) * 100) / 100 // 47.40

// FR/DE display and bill EUR at the same numeric amounts (lib/i18n/currency.ts); EN/ES are USD.
const money = (n: number, loc: SaleLocale) => {
  if (isEuroLocale(loc)) return `${n.toLocaleString(loc === "fr" ? "fr-FR" : "de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\u00a0€`
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

type Copy = { eyebrow: string; headline: string; body: (bf: string, list: string) => string; monthly: string; rush: string; cta: string; secondary: string; endsIn: string; ends: (d: string) => string; close: string }
const COPY: Record<SaleLocale, Copy> = {
  en: {
    eyebrow: "Black Friday",
    headline: "Wait — take 40% off your first year",
    body: (bf, list) => `Starter for ${bf}/mo billed annually instead of ${list}. Every plan, applied automatically at checkout — no code.`,
    monthly: "Prefer monthly? 30% off your first 3 months.",
    rush: "Annual plans bought now also get a free GEO audit + strategy call.",
    cta: "Claim 40% off",
    secondary: "No thanks, I'll pay full price later",
    endsIn: "Ends in",
    ends: (d) => `Ends ${d}, 11:59 PM PT · new subscriptions`,
    close: "Close",
  },
  fr: {
    eyebrow: "Black Friday",
    headline: "Attendez : −40 % sur votre première année",
    body: (bf, list) => `Starter à ${bf}/mois facturé à l’année au lieu de ${list}. Toutes les formules, appliqué automatiquement au paiement, sans code.`,
    monthly: "Plutôt en mensuel ? −30 % sur vos 3 premiers mois.",
    rush: "Les formules annuelles souscrites maintenant incluent aussi un audit GEO et un appel stratégie offerts.",
    cta: "Profiter de −40 %",
    secondary: "Non merci, je paierai plein tarif",
    endsIn: "Fin dans",
    ends: (d) => `Fin le ${d} à 23 h 59 (heure du Pacifique) · nouveaux abonnements`,
    close: "Fermer",
  },
  es: {
    eyebrow: "Black Friday",
    headline: "Espera: 40 % de descuento en tu primer año",
    body: (bf, list) => `Starter por ${bf}/mes facturado anualmente en lugar de ${list}. Todos los planes, aplicado automáticamente al pagar, sin código.`,
    monthly: "¿Prefieres mensual? 30 % de descuento en tus 3 primeros meses.",
    rush: "Los planes anuales contratados ahora incluyen además una auditoría GEO y una llamada de estrategia gratis.",
    cta: "Quiero el 40 %",
    secondary: "No, gracias, pagaré el precio completo",
    endsIn: "Termina en",
    ends: (d) => `Termina el ${d} a las 23:59 (hora del Pacífico) · nuevas suscripciones`,
    close: "Cerrar",
  },
  de: {
    eyebrow: "Black Friday",
    headline: "Moment: 40 % Rabatt auf dein erstes Jahr",
    body: (bf, list) => `Starter für ${bf}/Monat bei jährlicher Zahlung statt ${list}. Jeder Tarif, beim Bezahlen automatisch abgezogen, ohne Code.`,
    monthly: "Lieber monatlich? 30 % Rabatt auf deine ersten 3 Monate.",
    rush: "Jahrestarife, die du jetzt abschließt, enthalten zusätzlich ein kostenloses GEO-Audit und ein Strategiegespräch.",
    cta: "40 % sichern",
    secondary: "Nein danke, ich zahle später den vollen Preis",
    endsIn: "Endet in",
    ends: (d) => `Endet am ${d} um 23:59 Uhr (Pazifikzeit) · neue Abos`,
    close: "Schließen",
  },
}

function isSuppressedPath(pathname: string | null): boolean {
  if (!pathname) return false
  return pathname.startsWith("/app") || /^\/(?:(?:fr|es|de)\/)?(?:pricing|services)(?:\/|$)/.test(pathname)
}

export function BlackFridayExitPopup({ locale = "en" }: { locale?: string }) {
  const [open, setOpen] = useState(false)
  const [armed, setArmed] = useState(false)
  const pathname = usePathname()
  const loc = bfLocale(locale)
  const t = COPY[loc]
  const dialogRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const msLeft = useCountdown(open ? Math.floor(Date.parse(BF.endIso) / 1000) : null)

  const suppressed = isSuppressedPath(pathname)
  const suppressedRef = useRef(suppressed)
  useEffect(() => {
    suppressedRef.current = suppressed
    if (suppressed) setArmed(false)
  }, [suppressed])

  useEffect(() => {
    if (suppressed || bfPhase() !== "live") return
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1" || sessionStorage.getItem(SHOWN_KEY) === "1") return
    } catch {
      /* ignore */
    }
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const id = window.setTimeout(() => setArmed(true), ARM_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [suppressed])

  useEffect(() => {
    if (!armed) return
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || e.relatedTarget !== null || suppressedRef.current || bfPhase() !== "live") return
      setOpen(true)
      setArmed(false)
      try {
        sessionStorage.setItem(SHOWN_KEY, "1")
      } catch {
        /* ignore */
      }
    }
    document.addEventListener("mouseleave", onMouseLeave)
    return () => document.removeEventListener("mouseleave", onMouseLeave)
  }, [armed])

  useEffect(() => {
    if (!open) return
    trackEvent("promo_exit_view", { promo_code: BF.campaign, locale: loc, page_path: pathname })
    const previouslyFocused = document.activeElement as HTMLElement | null
    ctaRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return dismiss()
      if (e.key !== "Tab" || !dialogRef.current) return
      const f = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (!f.length) return
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus() }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus() }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      /* ignore */
    }
    trackEvent("promo_exit_dismiss", { promo_code: BF.campaign, locale: loc, page_path: pathname })
    setOpen(false)
  }

  if (!open) return null
  const pricingPath = loc === "en" ? "/pricing" : `/${loc}/pricing`

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/70 px-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) dismiss() }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="bf-exit-headline" className="relative w-full max-w-md animate-fade-up overflow-hidden rounded-3xl bg-neutral-950 text-white shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)]">
        <button type="button" aria-label={t.close} onClick={dismiss} className="absolute right-4 top-4 rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300">✕</button>
        <div className="p-7 sm:p-8">
          <span className="rounded-sm bg-yellow-400 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-neutral-950">{t.eyebrow}</span>
          <h2 id="bf-exit-headline" className="mt-4 text-[1.65rem] font-extrabold leading-tight tracking-tight">{t.headline}</h2>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="text-[2.4rem] font-extrabold leading-none text-yellow-300">{money(BF_MO, loc)}</span>
            <span className="text-sm text-white/60">/{loc === "en" ? "mo" : loc === "fr" ? "mois" : loc === "es" ? "mes" : "Monat"}</span>
            <s className="text-lg text-white/40 decoration-red-500 decoration-2">{money(LIST_MO, loc)}</s>
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-white/80">{t.body(money(BF_MO, loc), money(LIST_MO, loc))}</p>
          <p className="mt-2 text-[13.5px] text-white/70">{t.monthly}</p>
          {isBfRush() && <p className="mt-2 text-[13.5px] font-semibold text-yellow-200">{t.rush}</p>}
          {msLeft !== null && msLeft > 0 && (
            <p className="mt-4 font-mono text-[13px] tabular-nums text-white/70">{t.endsIn} <b className="text-white">{formatBfCountdown(msLeft, loc)}</b></p>
          )}
          <a
            ref={ctaRef}
            href={`${pricingPath}?interval=annual`}
            onClick={() => trackEvent("promo_exit_click", { promo_code: BF.campaign, locale: loc, page_path: pathname })}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-[15px] font-extrabold text-neutral-950 transition-colors hover:bg-yellow-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            {t.cta} <span aria-hidden="true">→</span>
          </a>
          <button type="button" onClick={dismiss} className="mt-3 w-full text-center text-[12.5px] text-white/50 underline-offset-2 hover:text-white/80 hover:underline">{t.secondary}</button>
          <p className="mt-4 text-center text-[11.5px] text-white/40">{t.ends(bfEndLabel(loc))}</p>
        </div>
      </div>
    </div>
  )
}
