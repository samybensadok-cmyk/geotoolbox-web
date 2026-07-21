"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"

/**
 * IntakeForm — post-payment intake for /services purchases. Reads the Stripe
 * session_id from the query, verifies via the app handler that it maps to a
 * paid order, then collects everything needed to start the audit. Posts JSON to
 * /app/?action=service_intake (same-origin via the Vercel → Replit rewrite).
 */

const ENDPOINT = "/app/?action=service_intake"
const MAX_PROMPTS = 25
const MAX_COMPETITORS = 15

type Verify =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "done" } // already submitted
  | { state: "form"; item: string; email: string }

type Competitor = { name: string; domain: string }

const itemLabel = (item: string) =>
  item === "sprint" ? "30-Day AI Visibility Sprint" : "AI Search Visibility Report"

export function IntakeForm() {
  const params = useSearchParams()
  const sessionId = params.get("session_id") ?? ""

  const [verify, setVerify] = useState<Verify>({ state: "loading" })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // form state
  const [domain, setDomain] = useState("")
  const [brandName, setBrandName] = useState("")
  const [brandAliases, setBrandAliases] = useState("")
  const [market, setMarket] = useState("")
  const [audience, setAudience] = useState("")
  const [goal, setGoal] = useState("")
  const [gscAccess, setGscAccess] = useState(false)
  const [notes, setNotes] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [prompts, setPrompts] = useState<string[]>(["", "", ""])
  const [competitors, setCompetitors] = useState<Competitor[]>([
    { name: "", domain: "" },
    { name: "", domain: "" },
  ])

  useEffect(() => {
    if (!sessionId.startsWith("cs_")) {
      setVerify({ state: "error", message: "This link is missing a valid order reference." })
      return
    }
    let active = true
    fetch(`${ENDPOINT}&session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!active) return
        if (d?.ok && d?.expired) {
          setVerify({ state: "error", message: "This intake link has expired. Email me and I'll pick it up from your order." })
          return
        }
        if (!d?.ok || !d?.allowed) {
          setVerify({ state: "error", message: "We couldn't find a paid order for this link." })
          return
        }
        if (d.already_submitted) {
          setVerify({ state: "done" })
          return
        }
        if (d.email) setContactEmail(d.email)
        setVerify({ state: "form", item: d.item ?? "report", email: d.email ?? "" })
      })
      .catch(() => {
        if (active) setVerify({ state: "error", message: "Something went wrong loading your order." })
      })
    return () => {
      active = false
    }
  }, [sessionId])

  const setPromptAt = (i: number, v: string) =>
    setPrompts((p) => p.map((x, idx) => (idx === i ? v : x)))
  const addPrompt = () => setPrompts((p) => (p.length < MAX_PROMPTS ? [...p, ""] : p))
  const removePrompt = (i: number) => setPrompts((p) => p.filter((_, idx) => idx !== i))

  const setCompAt = (i: number, key: keyof Competitor, v: string) =>
    setCompetitors((c) => c.map((x, idx) => (idx === i ? { ...x, [key]: v } : x)))
  const addComp = () =>
    setCompetitors((c) => (c.length < MAX_COMPETITORS ? [...c, { name: "", domain: "" }] : c))
  const removeComp = (i: number) => setCompetitors((c) => c.filter((_, idx) => idx !== i))

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (domain.trim() === "" || submitting) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const payload = {
        session_id: sessionId,
        domain: domain.trim(),
        brand_name: brandName.trim(),
        brand_aliases: brandAliases.trim(),
        market: market.trim(),
        audience: audience.trim(),
        goal: goal.trim(),
        gsc_access: gscAccess,
        notes: notes.trim(),
        contact_name: contactName.trim(),
        contact_email: contactEmail.trim(),
        prompts: prompts.map((p) => p.trim()).filter(Boolean).slice(0, MAX_PROMPTS),
        competitors: competitors
          .map((c) => ({ name: c.name.trim(), domain: c.domain.trim() }))
          .filter((c) => c.name || c.domain)
          .slice(0, MAX_COMPETITORS),
      }
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const d = await r.json().catch(() => null)
      if (d?.ok) setSubmitted(true)
      else if (d?.error === "link_expired")
        setSubmitError("This intake link has expired. Email me at samy.bensadok@gmail.com and I'll pick it up from your order.")
      else
        setSubmitError("We couldn't save your intake — your details are still here, please try again. If it keeps failing, email samy.bensadok@gmail.com.")
    } catch {
      // Keep the form and everything typed; surface an inline, retryable error.
      setSubmitError("Network error — your details are still here. Check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // ---- states ----
  if (verify.state === "loading") {
    return <Shell><p className="text-gray-500">Loading your order…</p></Shell>
  }
  if (verify.state === "error") {
    return (
      <Shell>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">We hit a snag</h1>
        <p className="mt-3 text-gray-600">{verify.message}</p>
        <p className="mt-4 text-[15px] text-gray-600">
          Your payment is safe. Email me at{" "}
          <a href="mailto:samy.bensadok@gmail.com" className="font-medium text-accent-700 underline">
            samy.bensadok@gmail.com
          </a>{" "}
          or via <a href="/contact" className="font-medium text-accent-700 underline">the contact page</a> and I&apos;ll get you started.
        </p>
      </Shell>
    )
  }
  if (verify.state === "done" || submitted) {
    return (
      <Shell>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
          All set
        </div>
        <h1 className="mt-4 text-[clamp(1.6rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
          Thank you — I have everything I need.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
          Your details are in. I&apos;ll review them and email you within 1 business day from{" "}
          <span className="font-medium text-gray-800">samy.bensadok@gmail.com</span> to kick things off — no
          more back-and-forth needed to start. — Samy
        </p>
        <a
          href="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-3 text-[14px] font-semibold text-gray-800 transition-colors hover:border-gray-400"
        >
          Read the GEO playbook while you wait
        </a>
      </Shell>
    )
  }

  // ---- form ----
  return (
    <Shell wide>
      <div className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
        Payment received
      </div>
      <h1 className="mt-4 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight tracking-tight text-gray-900">
        Let&apos;s get your {itemLabel(verify.item)} started.
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-600">
        Fill this in and I have everything to begin — no back-and-forth. Only your website is required; the
        prompts and competitors are optional (I research these anyway, but if you already know them, that
        sharpens the work).
      </p>

      <form onSubmit={submit} className="mt-10 space-y-8">
        {/* Website + brand */}
        <Section title="Your business">
          <Field label="Website domain" required>
            <input
              type="text" required value={domain} onChange={(e) => setDomain(e.target.value)}
              maxLength={255} placeholder="example.com" className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Brand / company name">
              <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} maxLength={200} placeholder="How you're known" className={inputCls} />
            </Field>
            <Field label="Other names / aliases" hint="acronyms, product names, misspellings">
              <input type="text" value={brandAliases} onChange={(e) => setBrandAliases(e.target.value)} maxLength={500} placeholder="comma-separated" className={inputCls} />
            </Field>
          </div>
          <Field label="What you sell, and to whom" hint="one line is fine">
            <input type="text" value={market} onChange={(e) => setMarket(e.target.value)} maxLength={1000} placeholder="e.g. project-management software for construction teams" className={inputCls} />
          </Field>
          <Field label="Target customer / ICP">
            <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)} maxLength={1000} placeholder="who you're trying to reach" className={inputCls} />
          </Field>
        </Section>

        {/* Prompts */}
        <Section title="Prompts to analyze" hint={`the buyer-intent questions your customers ask AI — up to ${MAX_PROMPTS}, optional`}>
          <div className="space-y-2">
            {prompts.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 shrink-0 font-mono text-[12px] text-gray-400">{i + 1}.</span>
                <input
                  type="text" value={p} onChange={(e) => setPromptAt(i, e.target.value)}
                  maxLength={300} aria-label={`Prompt ${i + 1}`}
                  placeholder={i === 0 ? "e.g. best project management tool for construction" : "another question a buyer would ask"}
                  className={inputCls}
                />
                {prompts.length > 1 && (
                  <button type="button" onClick={() => removePrompt(i)} className={removeBtnCls} aria-label={`Remove prompt ${i + 1}`}>×</button>
                )}
              </div>
            ))}
          </div>
          {prompts.length < MAX_PROMPTS && (
            <button type="button" onClick={addPrompt} className={addBtnCls}>+ Add prompt ({prompts.length}/{MAX_PROMPTS})</button>
          )}
        </Section>

        {/* Competitors */}
        <Section title="Competitors" hint={`who you're up against in AI answers — up to ${MAX_COMPETITORS}, optional`}>
          <div className="space-y-2">
            {competitors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="text" value={c.name} onChange={(e) => setCompAt(i, "name", e.target.value)} maxLength={200} aria-label={`Competitor ${i + 1} name`} placeholder="Competitor name" className={inputCls} />
                <input type="text" value={c.domain} onChange={(e) => setCompAt(i, "domain", e.target.value)} maxLength={255} aria-label={`Competitor ${i + 1} domain`} placeholder="domain.com" className={inputCls} />
                {competitors.length > 1 && (
                  <button type="button" onClick={() => removeComp(i)} className={removeBtnCls} aria-label={`Remove competitor ${i + 1}`}>×</button>
                )}
              </div>
            ))}
          </div>
          {competitors.length < MAX_COMPETITORS && (
            <button type="button" onClick={addComp} className={addBtnCls}>+ Add competitor ({competitors.length}/{MAX_COMPETITORS})</button>
          )}
        </Section>

        {/* Goal + access + notes */}
        <Section title="Goals & access">
          <Field label="What does success look like?" hint="e.g. get cited in ChatGPT for our category; beat a specific competitor in AI Overviews">
            <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} maxLength={1000} placeholder="your primary goal" className={inputCls} />
          </Field>
          <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <input type="checkbox" checked={gscAccess} onChange={(e) => setGscAccess(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-700 focus:ring-accent-600" />
            <span className="text-[14px] leading-snug text-gray-700">
              I can grant read access to Google Search Console for my domain (sharpens the baseline — I&apos;ll send instructions).
            </span>
          </label>
          <Field label="Anything else I should know?" hint="deadlines, existing content, constraints">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={4000} placeholder="optional" className={inputCls} />
          </Field>
        </Section>

        {/* Contact */}
        <Section title="Best contact">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Your name">
              <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} maxLength={200} placeholder="who I'll be working with" className={inputCls} />
            </Field>
            <Field label="Email">
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} maxLength={320} placeholder="you@example.com" className={inputCls} />
            </Field>
          </div>
        </Section>

        {submitError && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] leading-snug text-red-800">
            {submitError}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit" disabled={submitting || domain.trim() === ""}
            className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Submit and start my audit"}
          </button>
          <span className="text-[13px] text-gray-500">Only the website is required — you can leave the rest for me to research.</span>
        </div>
      </form>
    </Shell>
  )
}

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
const addBtnCls =
  "mt-3 inline-flex items-center rounded-full border border-gray-300 px-4 py-2 font-mono text-[12px] font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
const removeBtnCls =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"

function Shell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <section className="bg-white px-6 py-16 sm:py-20">
      <div className={wide ? "mx-auto max-w-3xl" : "mx-auto max-w-2xl"}>{children}</div>
    </section>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-gray-200 p-6">
      <legend className="px-2 text-[13px] font-bold uppercase tracking-widest text-accent-700">{title}</legend>
      {hint && <p className="mb-4 text-[13px] text-gray-500">{hint}</p>}
      <div className="space-y-4">{children}</div>
    </fieldset>
  )
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-gray-800">
        {label}{required && <span className="text-accent-700"> *</span>}
        {hint && <span className="ml-2 font-normal text-gray-400">{hint}</span>}
      </span>
      {children}
    </label>
  )
}
