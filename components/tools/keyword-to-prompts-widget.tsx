"use client"

import { useState } from "react"

import { trackEvent } from "@/lib/analytics"
import Link from "next/link"
import { ToolResultCapture } from "@/components/tools/tool-result-capture"
import tk from "./tools-dark.module.css"
import { ToolArrow } from "./tool-arrow"

/**
 * Free "Keyword → AI Prompts" generator widget. POSTs to the hardened Replit endpoint
 * (api/kw_to_prompts.php, same-origin via the /api/* rewrite). Turns one keyword into ~15
 * conversational prompts, split by a deterministic engine into "Track these" (brand-surfacing —
 * the ones an AI would answer by recommending named brands) vs "Context" prompts.
 *
 * Identity vs the other 3 tools: those score/check a URL; this GENERATES a prompt deck. The
 * hero is the brand-surfacing split + a 6-intent colour system. Same design tokens throughout.
 */

type Intent = "recommendation" | "comparison" | "transactional" | "validation" | "research" | "howto"

interface PromptRow {
  prompt_text: string
  intent: Intent
  brand_surfacing: boolean
  mentions_seed_brand?: boolean
}

interface GenResult {
  success: boolean
  error?: string
  keyword: string
  brand?: string | null
  country?: string
  head_terms?: string[]
  counts?: { total: number; brand_surfacing: number; context: number; by_intent: Record<string, number> }
  groups?: { track: PromptRow[]; context: PromptRow[] }
  disclaimer?: string
  cta?: string
  cached?: boolean
}

const EXAMPLES = ["standing desk", "best crm for startups", "running shoes for flat feet", "project management software"]

const ERROR_COPY: Record<string, string> = {
  keyword_required: "Enter a keyword or topic to turn into prompts.",
  keyword_invalid: "That doesn't look like a keyword — try something like “standing desk” or “best CRM”.",
  keyword_too_long: "That's a bit long for a seed keyword. Try a shorter topic.",
  rate_limited: "You've generated a lot of prompts — give it a minute and try again.",
  busy: "The generator is busy right now. Try again in a few minutes.",
  upstream_error: "The AI model didn't respond. Try again in a moment.",
  no_prompts: "We couldn't shape clean prompts from that one. Try a more specific topic.",
  unavailable: "The tool is briefly unavailable. Try again shortly.",
  internal_error: "Something went wrong on our end. Try again in a moment.",
}

const INTENT_META: Record<Intent, { label: string; chip: string; bar: string }> = {
  recommendation: { label: "Recommendation", chip: "bg-[color:var(--pass-bg)] text-[color:var(--accent)] border-[color:var(--line-lime)]", bar: "bg-[color:var(--accent)]" },
  comparison:     { label: "Comparison",     chip: "bg-[color:var(--cat-indigo-bg)] text-[color:var(--cat-indigo)] border-[color:var(--cat-indigo-line)]", bar: "bg-[color:var(--cat-indigo)]" },
  transactional:  { label: "Transactional",  chip: "bg-[color:var(--cat-mint-bg)] text-[color:var(--cat-mint)] border-[color:var(--cat-mint-line)]", bar: "bg-[color:var(--cat-mint)]" },
  validation:     { label: "Validation",     chip: "bg-[color:var(--warn-bg)] text-[color:var(--warn)] border-[color:var(--warn-line)]", bar: "bg-[color:var(--warn)]" },
  research:       { label: "Research",       chip: "bg-[color:var(--cat-sky-bg)] text-[color:var(--cat-sky)] border-[color:var(--cat-sky-line)]", bar: "bg-[color:var(--cat-sky)]" },
  howto:          { label: "How-to",         chip: "bg-[color:var(--surface-2)] text-[color:var(--text)] border-[color:var(--line-strong)]", bar: "bg-[color:var(--subtle)]" },
}

const INTENT_ORDER: Intent[] = ["recommendation", "comparison", "transactional", "validation", "research", "howto"]

/**
 * Funnel deep-link: carry the starred (brand-surfacing) prompts into the AI
 * Visibility Tracker. The app's js/ktp_import.js decodes `p`, stashes it to
 * localStorage (surviving the logged-out login bounce), and tracker.js offers a
 * one-click "add to a brand". UTF-8-safe base64url so non-ASCII prompts (other
 * locales) round-trip and the value is URL-clean (no +, /, =).
 */
function b64urlEncodeJson(obj: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(obj))
  let bin = ""
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function trackerImportHref(prompts: PromptRow[], keyword: string): string {
  const base = "/app?page=tracker&utm_source=keyword-to-prompts"
  try {
    const payload = prompts.slice(0, 25).map((p) => ({ t: p.prompt_text, i: p.intent, b: !!p.mentions_seed_brand }))
    if (!payload.length) return base
    const p = b64urlEncodeJson({ v: 1, kw: keyword.slice(0, 200), prompts: payload })
    if (p.length > 3500) return base // URL-length safety; app falls back to a generic landing
    return `/app?page=tracker&import=ktp&p=${p}&utm_source=keyword-to-prompts`
  } catch {
    return base
  }
}

export function KeywordToPromptsWidget() {
  const [keyword, setKeyword] = useState("")
  const [brand, setBrand] = useState("")
  const [showBrand, setShowBrand] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function generate(seed: string) {
    const value = seed.trim()
    if (!value) { setErrorMsg("Enter a keyword or topic to turn into prompts."); return }
    setLoading(true); setErrorMsg(null); setResult(null)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 60000)
    try {
      const res = await fetch("/api/kw_to_prompts.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: value, brand: brand.trim() || undefined }),
        signal: controller.signal,
      })
      const ct = res.headers.get("content-type") ?? ""
      const data: GenResult | null = ct.includes("application/json") ? await res.json().catch(() => null) : null
      if (!data) {
        setErrorMsg(
          res.status === 429 ? ERROR_COPY.rate_limited
          : res.status >= 500 ? "The generator hit a snag on our end. Try again in a moment."
          : "Something went wrong. Try again.",
        )
      } else if (!data.success) {
        setErrorMsg(ERROR_COPY[data.error ?? "internal_error"] ?? "Something went wrong. Try again.")
      } else {
        // SG_GA4_EVENTS_V1: tracked, NOT a key event — free-tool usage is
        // engagement, not a conversion; counting it would swamp the ROI number.
        trackEvent("free_tool_used", { tool: "keyword_to_prompts" })
        setResult(data)
      }
    } catch {
      setErrorMsg("The generator timed out or the network failed. Try again.")
    } finally {
      clearTimeout(timer); setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={(e) => { e.preventDefault(); generate(keyword) }}
        className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-4 shadow-sm sm:p-5"
      >
        <label htmlFor="ktp-keyword" className="sr-only">Keyword or topic</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="ktp-keyword"
            type="text"
            autoComplete="off"
            placeholder="standing desk"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={loading}
            maxLength={120}
            className="min-w-0 flex-1 rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--bg)] px-4 py-3 text-[15px] text-[color:var(--white)] outline-none transition-colors placeholder:text-[color:var(--subtle)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--focus-ring)] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[3px] bg-[color:var(--accent)] px-6 py-3 text-[15px] font-semibold text-[color:var(--accent-ink)] transition-all hover:bg-[color:var(--accent-hover)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
                Generating…
              </>
            ) : <>Generate prompts<ToolArrow /></>}
          </button>
        </div>

        {/* Optional brand — collapsed by default so the main UI stays one input */}
        {showBrand ? (
          <div className="mt-3">
            <label htmlFor="ktp-brand" className="mb-1 block text-[12px] font-medium text-[color:var(--muted)]">
              Your brand or domain <span className="font-normal text-[color:var(--muted)]">— we keep it out of the unbranded prompts so tracking stays honest</span>
            </label>
            <input
              id="ktp-brand"
              type="text"
              autoComplete="off"
              placeholder="yourbrand.com"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              disabled={loading}
              maxLength={80}
              className="w-full rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--bg)] px-4 py-2.5 text-[14px] text-[color:var(--white)] outline-none transition-colors placeholder:text-[color:var(--subtle)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--focus-ring)] disabled:opacity-60"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowBrand(true)}
            disabled={loading}
            className="mt-3 text-[12.5px] font-medium text-[color:var(--accent)] underline-offset-2 hover:underline disabled:opacity-50"
          >
            + Tracking a brand? Add it to keep it out of the prompts
          </button>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-[color:var(--muted)]">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              disabled={loading}
              onClick={() => { setKeyword(ex); generate(ex) }}
              className={`rounded-[3px] border border-[color:var(--line-strong)] px-3 py-1 font-mono text-[12px] text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] disabled:opacity-50 ${tk.chip}`}
            >
              {ex}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[color:var(--muted)]">
          One AI call shapes ~15 conversational prompts across 6 intents, then flags the ones that surface brands. Free, no sign-up.
        </p>
      </form>

      {loading && (
        <p className="mt-4 text-center text-[13px] text-[color:var(--muted)]">Writing prompts across all 6 intents and flagging the brand-surfacing ones…</p>
      )}

      {errorMsg && !loading && (
        <div className="mt-4 rounded-[4px] border border-[color:var(--fail-line)] bg-[color:var(--fail-bg)] px-4 py-3 text-[14px] text-[color:var(--fail)]">{errorMsg}</div>
      )}

      {result && !loading && <ResultDeck result={result} />}
      {result && !loading && <ToolResultCapture slug="keyword-to-prompts" what="prompt set" />}
    </div>
  )
}

/* ---------------------------------------------------------------- result -- */

function IntentBadge({ intent }: { intent: Intent }) {
  const meta = INTENT_META[intent] ?? INTENT_META.research
  return (
    <span className={`rounded-[3px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.chip}`}>
      {meta.label}
    </span>
  )
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle")
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable")
      await navigator.clipboard.writeText(text)
      setState("ok")
    } catch {
      setState("err")
    } finally {
      setTimeout(() => setState("idle"), 1600)
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="shrink-0 rounded-[4px] border border-[color:var(--line-strong)] px-2.5 py-1.5 text-[11px] font-medium text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
    >
      {state === "ok" ? "Copied" : state === "err" ? "Copy failed" : label}
    </button>
  )
}

function PromptCard({ p, starred }: { p: PromptRow; starred: boolean }) {
  return (
    <li className="group flex items-start gap-3 rounded-[4px] border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3.5 transition-colors hover:border-[color:var(--line-lime)]">
      {starred && (
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.95 2.6.95-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      )}
      <div className="min-w-0 flex-1">
        {starred && <span className="sr-only">Brand-surfacing prompt. </span>}
        <p className="text-[14.5px] leading-relaxed text-[color:var(--white)]">{p.prompt_text}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <IntentBadge intent={p.intent} />
          {p.mentions_seed_brand && (
            <span className="rounded-[3px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--muted)]">Branded</span>
          )}
        </div>
      </div>
      <CopyButton text={p.prompt_text} />
    </li>
  )
}

function ResultDeck({ result }: { result: GenResult }) {
  const [showContext, setShowContext] = useState(true)
  const c = result.counts
  const g = result.groups
  if (!c || !g) return null

  const track = g.track ?? []
  const context = g.context ?? []
  const trackText = track.map((p) => p.prompt_text).join("\n")
  const denom = Math.max(c.total || 0, track.length + context.length, 1)

  function downloadCsv() {
    const rows: string[][] = [["prompt", "intent", "brand_surfacing", "group"]]
    track.forEach((p) => rows.push([p.prompt_text, p.intent, "yes", "track"]))
    context.forEach((p) => rows.push([p.prompt_text, p.intent, "no", "context"]))
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-prompts-${(result.keyword || "keyword").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const intentEntries = INTENT_ORDER.filter((i) => (c.by_intent?.[i] ?? 0) > 0)

  return (
    <div className="mt-6 space-y-5">
      {/* Hero summary — the brand-surfacing split is the whole point */}
      <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-6 sm:p-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
          {c.total} AI prompts for “{result.keyword}”
        </p>
        <div className="mt-4 flex items-start gap-4">
          <svg className="mt-1 h-8 w-8 shrink-0 text-[color:var(--accent)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.95 2.6.95-5.5-4-3.9 5.53-.8L10 1.5z" />
          </svg>
          <div>
            <p className="text-[clamp(1.25rem,2.6vw,1.6rem)] font-bold leading-tight tracking-tight text-[color:var(--white)]">
              <span className="text-[color:var(--accent)] tabular-nums">{c.brand_surfacing} of {c.total}</span> are likely to make AI recommend brands.
            </p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[color:var(--muted)]">
              Those are the ones worth tracking — where an AI answer would list named brands, so your visibility is winnable.
              The other {c.context} explain the topic (good context, less brand-defining).
            </p>
          </div>
        </div>

        {/* Intent distribution */}
        <div className="mt-5">
          <div className="flex h-2 overflow-hidden rounded-full bg-[color:var(--surface-2)]">
            {intentEntries.map((i) => (
              <div key={i} className={INTENT_META[i].bar} style={{ width: `${((c.by_intent[i] ?? 0) / denom) * 100}%` }} aria-hidden="true" />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
            {intentEntries.map((i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-[11.5px] text-[color:var(--muted)]">
                <span className={`h-2 w-2 rounded-full ${INTENT_META[i].bar}`} aria-hidden="true" />
                {INTENT_META[i].label} <span className="tabular-nums text-[color:var(--muted)]">{c.by_intent[i]}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Track these — brand-surfacing */}
      {track.length > 0 && (
        <div className="rounded-[8px] border border-[color:var(--line-lime)] bg-[color:var(--surface)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[color:var(--accent)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1l-4.95 2.6.95-5.5-4-3.9 5.53-.8L10 1.5z" />
              </svg>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--accent)]">
                Track these · {track.length} brand-surfacing
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CopyButton text={trackText} label="Copy all" />
              <button type="button" onClick={downloadCsv} className="shrink-0 rounded-[4px] border border-[color:var(--line-strong)] px-2.5 py-1.5 text-[11px] font-medium text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]">
                CSV
              </button>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5">
            {track.map((p, i) => <PromptCard key={`t-${i}-${p.prompt_text}`} p={p} starred />)}
          </ul>
        </div>
      )}

      {/* Context prompts — collapsible */}
      {context.length > 0 && (
        <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
          <button
            type="button"
            onClick={() => setShowContext((s) => !s)}
            className="flex w-full items-center justify-between gap-3 text-left"
            aria-expanded={showContext}
            aria-controls="ktp-context-list"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
              Context prompts · {context.length}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-[color:var(--muted)]">
              {showContext ? "Hide" : "Show"}
              <svg className={`h-3.5 w-3.5 transition-transform ${showContext ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
          {showContext && (
            <ul id="ktp-context-list" className="mt-4 space-y-2.5">
              {context.map((p, i) => <PromptCard key={`c-${i}-${p.prompt_text}`} p={p} starred={false} />)}
            </ul>
          )}
        </div>
      )}

      {/* Honest framing */}
      <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface-2)] p-5 text-[13px] leading-relaxed text-[color:var(--text)]">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">How to read this</p>
        <ul className="mt-3 space-y-1.5">
          <li>· <strong className="text-[color:var(--white)]">Intent labels are model-inferred;</strong> the brand-surfacing star is a deterministic rule — a prompt that asks an AI to pick or compare named options.</li>
          <li>· <strong className="text-[color:var(--white)]">Track the starred ones first.</strong> They&apos;re where your brand can show up or get beaten. Definitional prompts rarely name brands.</li>
          <li>· <strong className="text-[color:var(--white)]">Prompts are how AI search works.</strong> People don&apos;t type keywords into ChatGPT — they ask questions like these. Tracking them tells you if you&apos;re in the answer.</li>
        </ul>
      </div>

      {/* Funnel CTA */}
      <div className={`rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--code-bg)] p-6 sm:p-7 ${tk.bridgeIn}`}>
        <h3 className="text-lg font-bold tracking-tight text-white">
          Now see if your brand actually shows up.
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--muted)]">
          {track.length > 0
            ? `Track ${track.length === 1 ? "this prompt" : `these ${track.length} brand-surfacing prompts`} in the AI Visibility Tracker to see whether AI recommends you — and who it recommends instead.`
            : "Add these prompts to the AI Visibility Tracker to see whether AI mentions you — and who it recommends instead."}
        </p>
        <div className="mt-5">
          <Link
            href={trackerImportHref(track.length > 0 ? track : context, result.keyword)}
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-[3px] bg-[color:var(--accent)] px-6 py-3 text-[15px] font-semibold text-[color:var(--accent-ink)] transition-colors hover:bg-[color:var(--accent-hover)]"
          >
            Track these prompts free
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
