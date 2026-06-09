"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Contact form. POSTs to the hardened Replit endpoint (api/contact.php,
 * same-origin via the /api/* rewrite). The backend rate-limits by client IP,
 * checks the honeypot + min-fill-time, then emails samy@geotoolbox.ai and logs
 * the message. Anonymous/public — no CSRF token (matches the free-tool widgets).
 */

const TOPICS = [
  { value: "sales", label: "Sales" },
  { value: "enterprise", label: "Enterprise" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
  { value: "general", label: "General" },
] as const

type Topic = (typeof TOPICS)[number]["value"]

const ERROR_COPY: Record<string, string> = {
  missing_fields: "Please add your name, email, and a message.",
  invalid_email: "That email doesn't look right — double-check it.",
  message_too_short: "Add a little more detail so we can actually help.",
  message_too_long: "That message is too long — please trim it a bit.",
  name_too_long: "That name is too long.",
  rate_limited: "You've sent a few messages already — give it a minute and try again.",
  spam_detected: "Your message was flagged as spam. Email samy@geotoolbox.ai directly and we'll sort it out.",
  internal_error: "Something went wrong on our end. Email samy@geotoolbox.ai and we'll pick it up.",
}

const MAX_MESSAGE = 4000

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:opacity-60"

const labelClass = "block text-[13px] font-semibold text-gray-700"

export function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [topic, setTopic] = useState<Topic>("general")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // Anti-spam: honeypot (bots fill hidden fields) + min fill time.
  const honeypotRef = useRef<HTMLInputElement>(null)
  const mountedAt = useRef<number>(Date.now())

  // Deep-link preselect: /contact?topic=enterprise (etc.) preselects the matching
  // topic so CTAs like the pricing "Talk to sales" land on the right category.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("topic")
    if (t && TOPICS.some((x) => x.value === t)) setTopic(t as Topic)
  }, [])

  async function submit() {
    setErrorMsg(null)
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg(ERROR_COPY.missing_fields)
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg(ERROR_COPY.invalid_email)
      return
    }
    if (message.trim().length < 10) {
      setErrorMsg(ERROR_COPY.message_too_short)
      return
    }

    setLoading(true)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 30000)
    try {
      const res = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          topic,
          message: message.trim(),
          hp_field: honeypotRef.current?.value ?? "",
          elapsed_ms: Date.now() - mountedAt.current,
        }),
        signal: controller.signal,
      })
      const data: { success?: boolean; error?: string } = await res.json().catch(() => ({}))
      if (data.success) {
        setDone(true)
      } else {
        setErrorMsg(ERROR_COPY[data.error ?? "internal_error"] ?? ERROR_COPY.internal_error)
      }
    } catch {
      setErrorMsg("The request timed out or the network failed. Try again, or email samy@geotoolbox.ai.")
    } finally {
      clearTimeout(timer)
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-accent-200 bg-accent-50 p-7 sm:p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-600">
          <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m5 10 3.5 3.5L15 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-gray-900">Message sent.</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-gray-700">
          Thanks, {name.split(" ")[0] || "there"} — we&apos;ve got it and typically reply within one business day. A copy
          of your message is on its way to {email}.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!loading) submit()
      }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"
      noValidate
    >
      {/* Honeypot — visually hidden, off the tab order. Real users never fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company-url">Leave this field empty</label>
        <input
          ref={honeypotRef}
          id="contact-company-url"
          name="company_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name <span className="text-accent-600">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            maxLength={120}
            required
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email <span className="text-accent-600">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="jane@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            maxLength={200}
            required
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-company" className={labelClass}>
          Company or website <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          id="contact-company"
          type="text"
          autoComplete="organization"
          placeholder="company.com"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          disabled={loading}
          maxLength={200}
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      {/* Topic selector */}
      <fieldset className="mt-5" disabled={loading}>
        <legend className={labelClass}>What&apos;s this about?</legend>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Topic">
          {TOPICS.map((t) => {
            const active = topic === t.value
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTopic(t.value)}
                className={
                  "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors " +
                  (active
                    ? "border-accent-600 bg-accent-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-accent-300 hover:text-accent-700")
                }
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <label htmlFor="contact-message" className={labelClass}>
            Message <span className="text-accent-600">*</span>
          </label>
          <span className="font-mono text-[11px] tabular-nums text-gray-400">
            {message.length}/{MAX_MESSAGE}
          </span>
        </div>
        <textarea
          id="contact-message"
          rows={6}
          placeholder="Tell us what you're trying to do, and we'll point you in the right direction."
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
          disabled={loading}
          required
          className={`mt-1.5 resize-y ${inputClass}`}
        />
      </div>

      {errorMsg && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-accent-800 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
              </svg>
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>
        <p className="text-[12px] leading-relaxed text-gray-400">
          We reply within one business day. No newsletter signup, no spam.
        </p>
      </div>
    </form>
  )
}
