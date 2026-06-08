"use client"

import { useState } from "react"
import Link from "next/link"
import { siteConfig } from "@/lib/config"

/**
 * Free AI Crawler Access Checker — the interactive widget. POSTs the user's URL
 * to the Replit endpoint (api/ai_crawler_check.php, same-origin via the /api/*
 * rewrite, so no CORS — the bug that breaks client-side incumbents) and renders
 * which of 34 known AI crawlers the site's robots.txt allows or blocks for the
 * homepage path, with the exact blocking rule + line for each blocked bot.
 *
 * This is a robots.txt PERMISSION check, never a visibility/citation claim. The
 * named sub-score is "Crawler Access: N/34" — NOT the paid "/100 AI-Readiness".
 */

type BotType = "search" | "training" | "userQuery" | "other"

interface Bot {
  ua: string
  platform: string
  bot_type: BotType
  label: string
  allowed: boolean
  blocked_by: string | null
  note: string | null
}

interface CheckResult {
  success: boolean
  error?: string
  detail?: string
  input?: { url: string; origin: string; host: string }
  summary?: {
    total: number
    allowed: number
    blocked: number
    by_type: Record<BotType, { allowed: number; blocked: number }>
  }
  bots?: Bot[]
  robots?: { present: boolean; fetched_url: string; fetch_status: number }
  sub_score?: { label: string; value: number; max: number }
  ai_impact?: string
}

const EXAMPLES = [
  { label: "nytimes.com", url: "https://www.nytimes.com" },
  { label: "stripe docs", url: "https://docs.stripe.com" },
  { label: "cloudflare", url: "https://developers.cloudflare.com" },
]

const ERROR_COPY: Record<string, string> = {
  invalid_url: "That doesn't look like a valid URL. Try a domain like example.com.",
  host_not_allowed: "We can't reach that host (it may be internal, private, or unresolvable).",
  url_required: "Enter a URL to check.",
  url_too_long: "That URL is too long.",
  fetch_failed: "We couldn't reach that site. Check the domain and try again.",
  rate_limited: "You've run a lot of checks — give it a minute and try again.",
  target_throttled: "That domain has been checked a lot recently — try again shortly.",
  registry_unavailable: "Our crawler registry is briefly unavailable. Try again in a moment.",
  internal_error: "Something went wrong on our end. Try again in a moment.",
}

const TYPE_LABELS: Record<BotType, string> = {
  search: "AI search",
  training: "Model training",
  userQuery: "User-prompted fetch",
  other: "Other",
}

const TYPE_ORDER: BotType[] = ["search", "userQuery", "training", "other"]

function accessTone(allowed: number, total: number): { text: string; ring: string; bg: string } {
  if (total > 0 && allowed === total) return { text: "text-accent-700", ring: "border-accent-200", bg: "bg-accent-50" }
  if (allowed === 0) return { text: "text-red-700", ring: "border-red-200", bg: "bg-red-50" }
  return { text: "text-amber-800", ring: "border-amber-200", bg: "bg-amber-50" }
}

export function AiCrawlerCheckerWidget() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function runCheck(target: string) {
    const value = target.trim()
    if (!value) { setErrorMsg("Enter a URL to check."); return }
    setLoading(true)
    setErrorMsg(null)
    setResult(null)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 45000)
    try {
      const res = await fetch("/api/ai_crawler_check.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
        signal: controller.signal,
      })
      const data: CheckResult = await res.json()
      if (!data.success) {
        setErrorMsg(ERROR_COPY[data.error ?? "internal_error"] ?? "Something went wrong. Try again.")
      } else {
        setResult(data)
      }
    } catch {
      setErrorMsg("The check timed out or the network failed. Try again.")
    } finally {
      clearTimeout(timer)
      setLoading(false)
    }
  }

  function copy(text: string, id: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600)
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={(e) => { e.preventDefault(); runCheck(url) }}
        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <label htmlFor="acc-url" className="sr-only">Site URL</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="acc-url"
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
                Checking…
              </>
            ) : "Check AI crawlers"}
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
          We fetch <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-600">/robots.txt</code> server-side and check it
          against 34 AI crawler user-agents. This is a permission check, not a visibility check. Free, no sign-up.
        </p>
      </form>

      {loading && (
        <p className="mt-4 text-center text-[13px] text-gray-500">Fetching robots.txt and evaluating 34 crawler rules…</p>
      )}

      {errorMsg && !loading && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{errorMsg}</div>
      )}

      {result && !loading && <ResultCard result={result} copy={copy} copied={copied} />}
    </div>
  )
}

function ResultCard({
  result,
  copy,
  copied,
}: {
  result: CheckResult
  copy: (text: string, id: string) => void
  copied: string | null
}) {
  const host = result.input?.host ?? ""
  const summary = result.summary
  const bots = result.bots ?? []
  const blocked = bots.filter((b) => !b.allowed)
  const allowed = bots.filter((b) => b.allowed)
  const total = summary?.total ?? bots.length
  const allowedCount = summary?.allowed ?? allowed.length
  const tone = accessTone(allowedCount, total)
  const robotsPresent = result.robots?.present ?? false

  // Badge snippet (the link engine). Points at production regardless of env.
  const badgeUrl = `${siteConfig.url}/tools/ai-crawler-checker/badge?host=${encodeURIComponent(host)}`
  const badgeHref = `${siteConfig.url}/tools/ai-crawler-checker?utm_source=badge&host=${encodeURIComponent(host)}`
  const badgeSnippet = `<a href="${badgeHref}"><img src="${badgeUrl}" alt="AI crawler access for ${host} — checked by GEO Toolbox" height="20"></a>`

  return (
    <div className="mt-6 space-y-5">
      {/* Verdict header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">Report for {host}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Named sub-score — Crawler Access N/34 (NOT the paid /100) */}
          <div className={`rounded-xl border p-4 ${tone.ring} ${tone.bg}`}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">Crawler access</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${tone.text}`}>
              {allowedCount}<span className="text-base font-semibold text-gray-400">/{total}</span>
            </p>
            <p className="mt-1 text-[12px] text-gray-500">AI crawlers allowed by robots.txt</p>
          </div>
          {/* Blocked count */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">Blocked</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${blocked.length > 0 ? "text-red-700" : "text-gray-400"}`}>
              {summary?.blocked ?? blocked.length}
            </p>
            <p className="mt-1 text-[12px] text-gray-500">{blocked.length > 0 ? "Disallowed for the homepage" : "None blocked by robots.txt"}</p>
          </div>
          {/* AI impact — the honest line */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">What this means</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-600">Reachability</p>
            <p className="mt-1 text-[12px] text-gray-500">Permission to crawl — not citations or rank</p>
          </div>
        </div>

        {/* robots facts */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-gray-500">
          <span>robots.txt {robotsPresent ? "found" : "not found"}</span>
          <span>· HTTP {result.robots?.fetch_status}</span>
          <span>· checked the homepage path <code className="rounded bg-gray-100 px-1 text-gray-600">/</code></span>
        </div>

        {!robotsPresent && (
          <p className="mt-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-[13px] text-gray-600">
            No robots.txt was found, so all {total} crawlers are allowed by default. That means nothing is blocked — but also
            that crawler access isn&apos;t explicitly managed.
          </p>
        )}
      </div>

      {/* Blocked bots — surfaced FIRST, red, with the blocking rule */}
      {blocked.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-white p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-red-600">
            {blocked.length} blocked by robots.txt
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
            These AI crawlers are <strong className="text-gray-900">disallowed</strong> from your homepage. If that&apos;s not
            intentional, the exact line to change is shown for each.
          </p>
          <ul className="mt-4 space-y-2.5">
            {blocked.map((b) => (
              <li key={b.ua} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-red-100 bg-red-50/50 px-4 py-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
                <span className="text-[14px] font-semibold text-gray-900">{b.label}</span>
                <span className="text-[12px] text-gray-500">{b.platform} · {TYPE_LABELS[b.bot_type]}</span>
                {b.blocked_by && (
                  <code className="rounded bg-white px-2 py-0.5 font-mono text-[11px] text-red-700 ring-1 ring-red-200">{b.blocked_by}</code>
                )}
                {b.note && <span className="text-[11px] italic text-amber-700">{b.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* By-type summary */}
      {summary && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">Access by crawler purpose</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TYPE_ORDER.map((t) => {
              const row = summary.by_type[t]
              const tot = row ? row.allowed + row.blocked : 0
              if (tot === 0) return null
              return (
                <div key={t} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                  <p className="text-[12px] font-semibold text-gray-700">{TYPE_LABELS[t]}</p>
                  <p className="mt-1 font-mono text-[13px] tabular-nums text-gray-500">
                    <span className="text-accent-700">{row.allowed} allowed</span>
                    {row.blocked > 0 && <span className="text-red-600"> · {row.blocked} blocked</span>}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Allowed bots — collapsed */}
      {allowed.length > 0 && (
        <details className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <summary className="cursor-pointer font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {allowed.length} allowed by robots.txt — show all
          </summary>
          <div className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {allowed.map((b) => (
              <div key={b.ua} className="flex items-center gap-2.5 text-[13px]">
                <span className="font-mono text-[11px] font-semibold text-accent-700">OK</span>
                <span className="text-gray-700">{b.label}</span>
                <span className="text-[11px] text-gray-400">{b.platform}</span>
                {b.note && <span className="text-[11px] italic text-amber-700" title={b.note}>· may ignore robots</span>}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Honest evidence panel */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-[13px] leading-relaxed text-slate-700">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">What this does and doesn&apos;t prove</p>
        <ul className="mt-3 space-y-1.5">
          <li>· <strong className="text-slate-900">robots.txt is permission, not a guarantee.</strong> Allowing a crawler doesn&apos;t mean an AI engine cites you — that depends on your content, not your robots file.</li>
          <li>· <strong className="text-slate-900">Some bots ignore robots.txt entirely.</strong> A few crawlers may fetch regardless of what robots.txt says; &ldquo;allowed&rdquo; here just means nothing disallows them.</li>
          <li>· <strong className="text-slate-900">This checks reachability, not rendering.</strong> robots.txt can permit a bot that a WAF, Cloudflare rule, or 403 still blocks in practice.</li>
        </ul>
      </div>

      {/* Embeddable badge — the link engine */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">Embed your result</p>
        <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
          Drop this badge on your site or docs. It re-checks live, so it always reflects your current robots.txt.
        </p>
        <div className="mt-3 flex items-start gap-2">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre rounded-lg bg-gray-50 px-3 py-2 font-mono text-[11px] leading-relaxed text-gray-700 ring-1 ring-gray-200">{badgeSnippet}</code>
          <button
            type="button"
            onClick={() => copy(badgeSnippet, "badge")}
            className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-2 text-[11px] font-medium text-gray-600 transition-colors hover:border-accent-300 hover:text-accent-700"
          >
            {copied === "badge" ? "Copied" : "Copy"}
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeUrl} alt={`AI crawler access for ${host} — checked by GEO Toolbox`} height={20} className="mt-3 h-5" />
      </div>

      {/* Bridge CTA → Agent Readiness (paid live probe) */}
      <div className="rounded-2xl border border-gray-900 bg-gray-950 p-6 sm:p-7">
        <h3 className="text-lg font-bold tracking-tight text-white">
          robots.txt says these bots <em className="not-italic text-accent-300">may</em> crawl you. Do they actually get through?
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-300">
          A robots.txt &ldquo;allow&rdquo; is only permission. A WAF, Cloudflare rule, bot-fight mode, or a 403 can still block a
          crawler that robots.txt permits. Agent Readiness live-fetches your site as each crawler and shows what they really
          receive — across 34 AI bots.
        </p>
        <div className="mt-5">
          <Link
            href="/features/agent-readiness?utm_source=ai-crawler-checker"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-gray-100"
          >
            Run a free Agent Readiness scan
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
