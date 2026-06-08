"use client"

import { useState } from "react"
import Link from "next/link"
import { siteConfig } from "@/lib/config"

/**
 * Free AI-Readiness Score widget. POSTs to the hardened Replit endpoint
 * (api/ai_readiness.php, same-origin via the /api/* rewrite). Renders a composite
 * built from 5 SSRF-safe checks that are a fixed subset of the 28-check paid
 * rubric — shown explicitly as a PARTIAL ("5 of 28 checks"), never the paid /100.
 */

type Status = "pass" | "warn" | "fail" | "na"

interface Check {
  id: string
  label: string
  category: string
  tier?: "core" | "emerging"
  status: Status
  points: number
  max_points: number
  evidence: string
  free: boolean
}

interface ReadinessResult {
  success: boolean
  error?: string
  detail?: string
  input?: { url: string; origin: string; host: string }
  composite?: { points_awarded: number; points_possible: number; pct: number; grade: string; basis?: string }
  emerging?: { points_awarded: number; points_possible: number; checks: number }
  coverage?: { free_checks: number; total_checks: number; free_points: number; total_points: number; core_checks?: number; emerging_checks?: number }
  checks?: Check[]
  robots?: { present: boolean; fetch_status: number }
  ai_impact?: string
  percentile?: { better_than_pct: number; sample_size: number }
}

const EXAMPLES = [
  { label: "stripe docs", url: "https://docs.stripe.com" },
  { label: "cloudflare", url: "https://developers.cloudflare.com" },
  { label: "nytimes.com", url: "https://www.nytimes.com" },
]

const ERROR_COPY: Record<string, string> = {
  invalid_url: "That doesn't look like a valid URL. Try a domain like example.com.",
  host_not_allowed: "We can't reach that host (it may be internal, private, or unresolvable).",
  url_required: "Enter a URL to check.",
  url_too_long: "That URL is too long.",
  fetch_failed: "We couldn't reach that site. Check the domain and try again.",
  rate_limited: "You've run a lot of checks — give it a minute and try again.",
  target_throttled: "That domain has been checked a lot recently — try again shortly.",
  internal_error: "Something went wrong on our end. Try again in a moment.",
}

const STATUS_META: Record<Status, { label: string; dot: string; chip: string }> = {
  pass: { label: "Pass", dot: "bg-accent-500", chip: "bg-accent-50 text-accent-700 border-accent-200" },
  warn: { label: "Warn", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-800 border-amber-200" },
  fail: { label: "Fix", dot: "bg-red-500", chip: "bg-red-50 text-red-700 border-red-200" },
  na: { label: "N/A", dot: "bg-slate-400", chip: "bg-slate-50 text-slate-600 border-slate-200" },
}

function gradeColor(grade?: string): string {
  switch (grade) {
    case "A": return "text-accent-700"
    case "B": return "text-accent-600"
    case "C": return "text-amber-700"
    case "D": return "text-orange-700"
    default: return "text-red-700"
  }
}

function CheckLi({ ck }: { ck: Check }) {
  const meta = STATUS_META[ck.status]
  return (
    <li className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.chip}`}>{meta.label}</span>
            <span className="text-[15px] font-semibold text-gray-900">{ck.label}</span>
            <span className="font-mono text-[11px] tabular-nums text-gray-400">{ck.points}/{ck.max_points}</span>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{ck.evidence}</p>
        </div>
      </div>
    </li>
  )
}

export function AiReadinessWidget() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReadinessResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function runCheck(target: string) {
    const value = target.trim()
    if (!value) { setErrorMsg("Enter a URL to check."); return }
    setLoading(true); setErrorMsg(null); setResult(null)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 45000)
    try {
      const res = await fetch("/api/ai_readiness.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
        signal: controller.signal,
      })
      const data: ReadinessResult = await res.json()
      if (!data.success) setErrorMsg(ERROR_COPY[data.error ?? "internal_error"] ?? "Something went wrong. Try again.")
      else setResult(data)
    } catch {
      setErrorMsg("The check timed out or the network failed. Try again.")
    } finally {
      clearTimeout(timer); setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={(e) => { e.preventDefault(); runCheck(url) }}
        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <label htmlFor="air-url" className="sr-only">Site URL</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="air-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourdomain.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="min-w-0 flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-900 px-6 py-3 text-[15px] font-semibold text-white transition-all hover:bg-accent-800 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
                Scoring…
              </>
            ) : "Get my score"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-gray-400">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.url}
              type="button"
              disabled={loading}
              onClick={() => { setUrl(ex.url); runCheck(ex.url) }}
              className="rounded-full border border-gray-200 px-3 py-1 font-mono text-[12px] text-gray-600 transition-colors hover:border-accent-300 hover:text-accent-700 disabled:opacity-50"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-gray-400">
          We run 5 foundational checks server-side (robots, AI-crawler access, content signals, sitemap, markdown). Free, no sign-up.
        </p>
      </form>

      {loading && <p className="mt-4 text-center text-[13px] text-gray-500">Fetching robots.txt + sitemap and scoring 5 checks…</p>}

      {errorMsg && !loading && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{errorMsg}</div>
      )}

      {result && !loading && <ResultCard result={result} copied={copied} setCopied={setCopied} />}
    </div>
  )
}

function ResultCard({ result, copied, setCopied }: { result: ReadinessResult; copied: boolean; setCopied: (b: boolean) => void }) {
  const host = result.input?.host ?? ""
  const c = result.composite
  const cov = result.coverage
  const checks = result.checks ?? []
  if (!c || !cov) return null
  const coreChecks = checks.filter((ck) => (ck.tier ?? "core") !== "emerging")
  const emergingChecks = checks.filter((ck) => (ck.tier ?? "core") === "emerging")
  const em = result.emerging

  const badgeUrl = `${siteConfig.url}/tools/ai-readiness/badge?host=${encodeURIComponent(host)}`
  const badgeHref = `${siteConfig.url}/tools/ai-readiness?utm_source=badge&host=${encodeURIComponent(host)}`
  const badgeSnippet = `<a href="${badgeHref}"><img src="${badgeUrl}" alt="AI-Readiness score for ${host} — by GEO Toolbox" height="20"></a>`

  function copy() {
    navigator.clipboard?.writeText(badgeSnippet).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) })
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Verdict header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">AI-Readiness for {host}</p>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-end gap-4">
            <div>
              <p className={`text-5xl font-bold tracking-tight tabular-nums ${gradeColor(c.grade)}`}>
                {c.pct}<span className="text-2xl text-gray-400">%</span>
              </p>
              <p className="mt-1 text-[13px] text-gray-500">{c.points_awarded} of {c.points_possible} core points · grade {c.grade}</p>
              {result.percentile && (
                <p className="mt-1 text-[12px] text-gray-500">
                  Better than <span className="font-semibold text-gray-700">{result.percentile.better_than_pct}%</span> of {result.percentile.sample_size.toLocaleString()} sites scanned
                </p>
              )}
            </div>
          </div>
          {/* Honest partial framing */}
          <div className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-[13px] text-accent-900 sm:max-w-[16rem]">
            <span className="font-semibold">Free score · {cov.free_checks} of {cov.total_checks} checks.</span>{" "}
            This covers the foundations. The full Agent Readiness scan runs all {cov.total_checks}.
          </div>
        </div>

        {/* Coverage bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-[12px] text-gray-500">
            <span>{cov.free_checks} of {cov.total_checks} readiness checks run</span>
            <span>{cov.total_checks - cov.free_checks} more in the full scan</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-accent-500" style={{ width: `${Math.round((cov.free_checks / cov.total_checks) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Core checks — these make up the score */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Core checks <span className="text-gray-300">· your score</span>
        </p>
        <ul className="mt-4 space-y-3">
          {coreChecks.map((ck) => <CheckLi key={ck.id} ck={ck} />)}
        </ul>
      </div>

      {/* Emerging signals — bonus / upside, NOT counted in the score */}
      {emergingChecks.length > 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">
              Emerging signals <span className="text-slate-400">· bonus, not in your score</span>
            </p>
            {em && (
              <span className="font-mono text-[11px] tabular-nums text-slate-500">{em.points_awarded} of {em.points_possible || 20} bonus earned</span>
            )}
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-slate-600">
            Almost no site implements these yet, so they don&apos;t count against your score — but adopting them is cheap future-proofing as more AI clients start to use them.
          </p>
          <ul className="mt-4 space-y-3">
            {emergingChecks.map((ck) => <CheckLi key={ck.id} ck={ck} />)}
          </ul>
        </div>
      )}

      {/* Honest evidence panel */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-[13px] leading-relaxed text-slate-700">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">What this score is — and isn&apos;t</p>
        <ul className="mt-3 space-y-1.5">
          <li>· <strong className="text-slate-900">These are infrastructure signals</strong> — whether AI agents can reach, crawl, and parse your site. They&apos;re table stakes, not a guarantee of citations.</li>
          <li>· <strong className="text-slate-900">It&apos;s a partial.</strong> 5 of our 28 checks. A high free score doesn&apos;t mean the other 23 (rendering, structured data, MCP, commerce, visual) pass.</li>
          <li>· <strong className="text-slate-900">No score buys visibility.</strong> Getting cited depends on your content and authority. This fixes the plumbing so you&apos;re not invisible by accident.</li>
        </ul>
      </div>

      {/* Shareable report */}
      <ShareCard origin={result.input?.origin ?? ""} />

      {/* Embeddable badge */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">Embed your score</p>
        <p className="mt-2 text-[13px] leading-relaxed text-gray-600">It re-checks live, so it always reflects your current score.</p>
        <div className="mt-3 flex items-start gap-2">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre rounded-lg bg-gray-50 px-3 py-2 font-mono text-[11px] leading-relaxed text-gray-700 ring-1 ring-gray-200">{badgeSnippet}</code>
          <button type="button" onClick={copy} className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-2 text-[11px] font-medium text-gray-600 transition-colors hover:border-accent-300 hover:text-accent-700">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeUrl} alt={`AI-Readiness score for ${host}`} height={20} className="mt-3 h-5" />
      </div>

      {/* Funnel CTA */}
      <div className="rounded-2xl border border-gray-900 bg-gray-950 p-6 sm:p-7">
        <h3 className="text-lg font-bold tracking-tight text-white">
          You&apos;ve scored {cov.free_checks} of {cov.total_checks} checks. See the other {cov.total_checks - cov.free_checks}.
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-300">
          The full Agent Readiness scan live-fetches your site as 34 AI crawlers and adds rendering, structured-data, MCP,
          commerce and visual checks — the parts a robots.txt can&apos;t tell you.
        </p>
        <div className="mt-5">
          <Link
            href="/features/agent-readiness?utm_source=ai-readiness"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-gray-100"
          >
            Run the full Agent Readiness scan
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

/**
 * "Share this result" — POSTs the scanned origin to api/ai_readiness_share.php, which
 * RE-RUNS the scan server-side (authentic, non-spoofable) and persists it under a
 * non-guessable id, then surfaces a public geotoolbox.ai/r/<id> link + copy.
 */
function ShareCard({ origin }: { origin: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [id, setId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const shareUrl = id ? `${siteConfig.url}/r/${id}` : ""

  async function createShare() {
    if (!origin) return
    setState("loading")
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 45000)
    try {
      const res = await fetch("/api/ai_readiness_share.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: origin }),
        signal: controller.signal,
      })
      const data = await res.json()
      if (data?.success && data?.id) { setId(data.id); setState("done") }
      else setState("error")
    } catch {
      setState("error")
    } finally {
      clearTimeout(timer)
    }
  }

  function copy() {
    if (!shareUrl) return
    navigator.clipboard?.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) })
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">Share this result</p>
      <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
        Creates a public report page anyone can open. It re-checks live on save, so the score it shows is always real — not a number you can edit.
      </p>

      {state !== "done" && (
        <div className="mt-3">
          <button
            type="button"
            onClick={createShare}
            disabled={state === "loading" || !origin}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-[14px] font-semibold text-gray-800 transition-colors hover:border-accent-300 hover:text-accent-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === "loading" ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
                Creating link…
              </>
            ) : "Create a share link"}
          </button>
          {state === "error" && (
            <p className="mt-2 text-[13px] text-red-600">Couldn&apos;t create the link. Try again in a moment.</p>
          )}
        </div>
      )}

      {state === "done" && id && (
        <div className="mt-3 flex items-start gap-2">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre rounded-lg bg-gray-50 px-3 py-2 font-mono text-[12px] leading-relaxed text-gray-700 ring-1 ring-gray-200">{shareUrl}</code>
          <button type="button" onClick={copy} className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-2 text-[11px] font-medium text-gray-600 transition-colors hover:border-accent-300 hover:text-accent-700">
            {copied ? "Copied" : "Copy"}
          </button>
          <a href={shareUrl} target="_blank" rel="noreferrer" className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-2 text-[11px] font-medium text-gray-600 transition-colors hover:border-accent-300 hover:text-accent-700">
            Open
          </a>
        </div>
      )}
    </div>
  )
}
