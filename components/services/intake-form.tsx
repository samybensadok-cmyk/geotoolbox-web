"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import k from "@/components/brand/dark-kit.module.css"
import f from "./intake-form.module.css"

/**
 * IntakeForm — post-payment intake for /services purchases. Reads the Stripe
 * session_id from the query, verifies via the app handler that it maps to a
 * paid order, then collects everything needed to start the audit. Posts JSON to
 * /app/?action=service_intake (same-origin via the Vercel → Replit rewrite).
 * Dark-kit look (2026-11-28): the intake page wraps this in <DarkPage>.
 */

const ENDPOINT = "/app/?action=service_intake"
const MAX_PROMPTS = 25
const MAX_COMPETITORS = 15

type Verify =
  | { state: "loading" }
  | { state: "error"; message: string }
  | { state: "nosession" }
  | { state: "done" } // already submitted
  | { state: "form"; item: string; email: string }

type Competitor = { name: string; domain: string }

const ITEM_LABELS: Record<string, string> = {
  sprint: "30-Day AI Visibility Sprint",
  article: "Flagship Citable Article",
  cluster_sprint: "Content Cluster Sprint",
}
const itemLabel = (item: string) => ITEM_LABELS[item] ?? "AI Search Visibility Report"

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
      setVerify(sessionId === "" ? { state: "nosession" } : { state: "error", message: "This link is missing a valid order reference." })
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
    return <Shell><p className={f.muted}>Loading your order…</p></Shell>
  }
  if (verify.state === "nosession") {
    return (
      <Shell>
        <h1 className={f.titleSm}>This page opens after checkout</h1>
        <p className={f.body}>
          It opens automatically right after you pay. If you paid and closed the page before filling it in,{" "}
          <a href="/contact" className={f.link}>contact us</a> and we&apos;ll send you the form. Looking for done-for-you help?{" "}
          <a href="/services/ai-seo-agency" className={f.link}>See the services</a>.
        </p>
      </Shell>
    )
  }
  if (verify.state === "error") {
    return (
      <Shell>
        <h1 className={f.titleSm}>We hit a snag</h1>
        <p className={f.body}>{verify.message}</p>
        <p className={f.body}>
          Your payment is safe. Email me at{" "}
          <a href="mailto:samy.bensadok@gmail.com" className={f.link}>
            samy.bensadok@gmail.com
          </a>{" "}
          or via <a href="/contact" className={f.link}>the contact page</a>{" "}and I&apos;ll get you started.
        </p>
      </Shell>
    )
  }
  if (verify.state === "done" || submitted) {
    return (
      <Shell>
        <div className={`${k.stampChip} ${f.chip}`}>
          All set
        </div>
        <h1 className={f.title}>
          Thank you — I have everything I need.
        </h1>
        <p className={f.body}>
          Your details are in. I&apos;ll review them and email you within 1 business day from{" "}
          <span className={f.em}>samy.bensadok@gmail.com</span> to kick things off — no
          more back-and-forth needed to start. — Samy
        </p>
        <a
          href="/blog"
          className={`${k.btnOutline} ${f.after}`}
        >
          Read the GEO playbook while you wait
        </a>
      </Shell>
    )
  }

  // ---- form ----
  return (
    <Shell wide>
      <div className={`${k.stampChip} ${f.chip}`}>
        Payment received
      </div>
      <h1 className={f.title}>
        Let&apos;s get your {itemLabel(verify.item)} started.
      </h1>
      <p className={`${f.body} ${f.lead}`}>
        Fill this in and I have everything to begin — no back-and-forth. Only your website is required; the
        prompts and competitors are optional (I research these anyway, but if you already know them, that
        sharpens the work).
      </p>

      <form onSubmit={submit} className={f.form}>
        {/* Website + brand */}
        <Section title="Your business">
          <Field label="Website domain" required>
            <input
              type="text" required value={domain} onChange={(e) => setDomain(e.target.value)}
              maxLength={255} placeholder="example.com" className={inputCls}
            />
          </Field>
          <div className={f.pair}>
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
          <div className={f.list}>
            {prompts.map((p, i) => (
              <div key={i} className={f.row}>
                <span className={f.rowNum}>{i + 1}.</span>
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
          <div className={f.list}>
            {competitors.map((c, i) => (
              <div key={i} className={f.row}>
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
          <label className={f.check}>
            <input type="checkbox" checked={gscAccess} onChange={(e) => setGscAccess(e.target.checked)} className={f.checkbox} />
            <span className={f.checkText}>
              I can grant read access to Google Search Console for my domain (sharpens the baseline — I&apos;ll send instructions).
            </span>
          </label>
          <Field label="Anything else I should know?" hint="deadlines, existing content, constraints">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={4000} placeholder="optional" className={`${inputCls} ${f.textarea}`} />
          </Field>
        </Section>

        {/* Contact */}
        <Section title="Best contact">
          <div className={f.pair}>
            <Field label="Your name">
              <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} maxLength={200} placeholder="who I'll be working with" className={inputCls} />
            </Field>
            <Field label="Email">
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} maxLength={320} placeholder="you@example.com" className={inputCls} />
            </Field>
          </div>
        </Section>

        {submitError && (
          <div role="alert" className={f.alert}>
            {submitError}
          </div>
        )}

        <div className={f.submitRow}>
          <button
            type="submit" disabled={submitting || domain.trim() === ""}
            className={`${k.btnLime} ${f.submit}`}
          >
            {submitting ? "Saving…" : "Submit and start my audit"}
          </button>
          <span className={f.submitNote}>Only the website is required — you can leave the rest for me to research.</span>
        </div>
      </form>
    </Shell>
  )
}

const inputCls = `${k.input} ${f.input}`
const addBtnCls = f.addBtn
const removeBtnCls = f.removeBtn

function Shell({ children, wide }: { children: ReactNode; wide?: boolean }) {
  return (
    <section className={f.shell}>
      <div className={wide ? `${f.inner} ${f.wide}` : f.inner}>{children}</div>
    </section>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className={f.fieldset}>
      <legend className={f.legend}>{title}</legend>
      {hint && <p className={f.hint}>{hint}</p>}
      <div className={f.stack}>{children}</div>
    </fieldset>
  )
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) {
  return (
    <label className={f.field}>
      <span className={f.label}>
        {label}{required && <span className={f.req}> *</span>}
        {hint && <span className={f.labelHint}>{hint}</span>}
      </span>
      {children}
    </label>
  )
}
