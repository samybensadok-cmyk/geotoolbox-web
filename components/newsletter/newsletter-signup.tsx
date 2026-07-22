"use client"

import { useRef, useState } from "react"

/**
 * Newsletter signup. POSTs to api/subscribe.php (same-origin via the /api/*
 * rewrite) — same house pattern as contact-form.tsx: honeypot + min-fill-time
 * spam gate, no CSRF (anonymous public widget). Backend double-opt-ins via an
 * emailed confirm link before the address is considered subscribed.
 *
 * `source` is a free-text attribution tag (e.g. "article:what-is-rag" or
 * "footer") so placement performance is visible before deciding what goes
 * into the reused-article educational campaigns.
 */

// Every user-visible string, defaulted to EN. Callers inside a localized tree
// pass a `copy` override (see components/layout/footer.tsx) — without it the
// widget rendered hardcoded English inside /fr.
export type NewsletterCopy = {
  title: string
  description: string
  placeholder: string
  emailLabel: string
  submit: string
  submitting: string
  done: string
  honeypot: string
  errors: Record<string, string>
}

export const NEWSLETTER_COPY_EN: NewsletterCopy = {
  title: "Get GEO insights in your inbox",
  description: "One email when we publish something worth reading. No spam, unsubscribe anytime.",
  placeholder: "you@company.com",
  emailLabel: "Email address",
  submit: "Subscribe",
  submitting: "Subscribing…",
  done: "Almost there — check your inbox to confirm your subscription.",
  honeypot: "Leave this field empty",
  errors: {
    missing_email: "Enter your email to subscribe.",
    invalid_email: "That email doesn't look right — double-check it.",
    rate_limited: "Too many attempts — give it a minute and try again.",
    spam_detected: "That submission was flagged as spam. Try again, or email samy@geotoolbox.ai.",
    internal_error: "Something went wrong on our end. Try again in a moment.",
    network: "The request timed out or the network failed. Try again.",
  },
}

const inputClass =
  "w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:opacity-60"

export function NewsletterSignup({
  source,
  title,
  description,
  compact = false,
  copy = NEWSLETTER_COPY_EN,
}: {
  source: string
  title?: string
  description?: string
  compact?: boolean
  copy?: NewsletterCopy
}) {
  const t = { ...NEWSLETTER_COPY_EN, ...copy, errors: { ...NEWSLETTER_COPY_EN.errors, ...copy.errors } }
  const heading = title ?? t.title
  const blurb = description ?? t.description
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const honeypotRef = useRef<HTMLInputElement>(null)
  const mountedAt = useRef<number>(Date.now())

  async function submit() {
    setErrorMsg(null)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg(t.errors.invalid_email)
      return
    }

    setLoading(true)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30000)
    try {
      const res = await fetch("/api/subscribe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source,
          hp_field: honeypotRef.current?.value ?? "",
          elapsed_ms: Date.now() - mountedAt.current,
        }),
        signal: controller.signal,
      })
      const data: { success?: boolean; error?: string } = await res.json().catch(() => ({}))
      if (data.success) {
        setDone(true)
      } else {
        setErrorMsg(t.errors[data.error ?? "internal_error"] ?? t.errors.internal_error)
      }
    } catch {
      setErrorMsg(t.errors.network)
    } finally {
      clearTimeout(timer)
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className={compact ? "text-[13px] text-gray-700" : "rounded-2xl border border-accent-200 bg-accent-50 p-6"}>
        {t.done}
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!loading) submit()
      }}
      className={compact ? "" : "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"}
      noValidate
    >
      {!compact && (
        <>
          <h3 className="text-[17px] font-bold tracking-tight text-gray-900">{heading}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600">{blurb}</p>
        </>
      )}

      {/* Honeypot — visually hidden, off the tab order. Real users never fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`newsletter-hp-${source}`}>{t.honeypot}</label>
        <input
          ref={honeypotRef}
          id={`newsletter-hp-${source}`}
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={compact ? "flex flex-col gap-2 sm:flex-row" : "mt-4 flex flex-col gap-2 sm:flex-row"}>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          maxLength={200}
          required
          aria-label={t.emailLabel}
          className={`${inputClass} sm:flex-1`}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent-900 px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-accent-800 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t.submitting : t.submit}
        </button>
      </div>

      {errorMsg && (
        <p className="mt-2.5 text-[13px] text-red-600" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  )
}
