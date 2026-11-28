"use client"

import { useEffect, useRef, useState } from "react"

import { trackEvent } from "@/lib/analytics"
import f from "./contact-form.module.css"

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

// Dark design (2026-11-28): styles live in contact-form.module.css (the page sits inside <DarkPage>).
const inputClass = f.input
const labelClass = f.label

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
        /* SG_GA4_EVENTS_V1: KEY EVENT. Fired only on a server-confirmed success, so
           spam caught by the honeypot, validation failures and timeouts never count
           as leads. `topic` rides along so lead quality can be split by enquiry type. */
        trackEvent("generate_lead", { method: "contact_form", topic })
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
      <div className={f.done}>
        <div className={f.doneMark}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="m5 10 3.5 3.5L15 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className={f.doneTitle}>Message sent.</h2>
        <p className={f.doneBody}>
          Thanks, {name.split(" ")[0] || "there"}{" "}— we&apos;ve got it and typically reply within one business day. A copy
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
      className={f.form}
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

      <div className={f.row2}>
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name <span className={f.req}>*</span>
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
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email <span className={f.req}>*</span>
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
            className={inputClass}
          />
        </div>
      </div>

      <div className={f.field}>
        <label htmlFor="contact-company" className={labelClass}>
          Company or website <span className={f.optional}>(optional)</span>
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
          className={inputClass}
        />
      </div>

      {/* Topic selector */}
      <fieldset className={f.fieldset} disabled={loading}>
        <legend className={labelClass}>What&apos;s this about?</legend>
        <div className={f.topics} role="radiogroup" aria-label="Topic">
          {TOPICS.map((t) => {
            const active = topic === t.value
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTopic(t.value)}
                className={active ? `${f.topic} ${f.topicOn}` : f.topic}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className={f.field}>
        <div className={f.labelRow}>
          <label htmlFor="contact-message" className={labelClass}>
            Message <span className={f.req}>*</span>
          </label>
          <span className={f.counter}>
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
          className={`${inputClass} ${f.textarea}`}
        />
      </div>

      {errorMsg && (
        <div className={f.error} role="alert">
          {errorMsg}
        </div>
      )}

      <div className={f.actions}>
        <button
          type="submit"
          disabled={loading}
          className={f.submit}
        >
          {loading ? (
            <>
              <svg className={f.spin} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
              </svg>
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>
        <p className={f.note}>
          We reply within one business day. No newsletter signup, no spam.
        </p>
      </div>
    </form>
  )
}
