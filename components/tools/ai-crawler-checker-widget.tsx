"use client"

import { useState } from "react"

import { trackEvent } from "@/lib/analytics"
import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { ToolResultCapture } from "@/components/tools/tool-result-capture"
import tk from "./tools-dark.module.css"

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
  robots_unreachable: "We reached that site but its robots.txt returned a server error, so crawler access can't be determined right now. Try again shortly.",
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
  if (total > 0 && allowed === total) return { text: "text-[color:var(--tk-accent,#0f766e)]", ring: "border-[color:var(--tk-line-lime,#99f6e4)]", bg: "bg-[color:var(--tk-pass-bg,#f0fdfa)]" }
  if (allowed === 0) return { text: "text-[color:var(--tk-fail,#bf000f)]", ring: "border-[color:var(--tk-fail-line,#ffcaca)]", bg: "bg-[color:var(--tk-fail-bg,#fef2f2)]" }
  return { text: "text-[color:var(--tk-warn,#953d00)]", ring: "border-[color:var(--tk-warn-line,#fee685)]", bg: "bg-[color:var(--tk-warn-bg,#fffbeb)]" }
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
        // SG_GA4_EVENTS_V1: tracked, NOT a key event — free-tool usage is
        // engagement, not a conversion; counting it would swamp the ROI number.
        trackEvent("free_tool_used", { tool: "ai_crawler_checker" })
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
        className="rounded-[var(--tool-r-card,1rem)] border border-[color:var(--tk-line-strong,#e5e7eb)] bg-[color:var(--tk-surface,#fff)] p-4 shadow-sm sm:p-5"
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
            className="min-w-0 flex-1 rounded-[var(--tool-r-panel,0.75rem)] border border-[color:var(--tk-line-strong,#d1d5db)] bg-[color:var(--tk-bg,#fff)] px-4 py-3 text-[15px] text-[color:var(--tk-white,#111827)] outline-none transition-colors placeholder:text-[color:var(--tk-subtle,#9ca3af)] focus:border-[color:var(--tk-accent,#14b8a6)] focus:ring-2 focus:ring-[color:var(--tk-focus-ring,#99f6e4)] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--tool-r-btn,0.75rem)] bg-[color:var(--tk-accent,#134e4a)] px-6 py-3 text-[15px] font-semibold text-[color:var(--tk-accent-ink,#fff)] transition-all hover:bg-[color:var(--tk-accent-hover,#115e59)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
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
          <span className="text-[12px] text-[color:var(--tk-muted,#9ca3af)]">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.url}
              type="button"
              disabled={loading}
              onClick={() => { setUrl(ex.url); runCheck(ex.url) }}
              className="rounded-[var(--tool-r-btn,9999px)] border border-[color:var(--tk-line-strong,#e5e7eb)] px-3 py-1 font-mono text-[12px] text-[color:var(--tk-muted,#4b5563)] transition-colors hover:border-[color:var(--tk-accent,#5eead4)] hover:text-[color:var(--tk-accent,#0f766e)] disabled:opacity-50"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[color:var(--tk-muted,#9ca3af)]">
          We fetch <code className="rounded bg-[color:var(--tk-surface-2,#f3f4f6)] px-1 py-0.5 text-[color:var(--tk-muted,#4b5563)]">/robots.txt</code> server-side and check it
          against 34 AI crawler user-agents. This is a permission check, not a visibility check. Free, no sign-up.
        </p>
      </form>

      {loading && (
        <p className="mt-4 text-center text-[13px] text-[color:var(--tk-muted,#6b7280)]">Fetching robots.txt and evaluating 34 crawler rules…</p>
      )}

      {errorMsg && !loading && (
        <div className="mt-4 rounded-[var(--tool-r-panel,0.75rem)] border border-[color:var(--tk-fail-line,#ffcaca)] bg-[color:var(--tk-fail-bg,#fef2f2)] px-4 py-3 text-[14px] text-[color:var(--tk-fail,#bf000f)]">{errorMsg}</div>
      )}

      {result && !loading && <ResultCard result={result} copy={copy} copied={copied} />}
      {result && !loading && <ToolResultCapture slug="ai-crawler-checker" what="crawler report" />}
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
      <div className="rounded-[var(--tool-r-card,1rem)] border border-[color:var(--tk-line-strong,#e5e7eb)] bg-[color:var(--tk-surface,#fff)] p-6 sm:p-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--tk-muted,#9ca3af)]">Report for {host}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Named sub-score — Crawler Access N/34 (NOT the paid /100) */}
          <div className={`rounded-[var(--tool-r-panel,0.75rem)] border p-4 ${tone.ring} ${tone.bg}`}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[color:var(--tk-muted,#6b7280)]">Crawler access</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${tone.text}`}>
              {allowedCount}<span className="text-base font-semibold text-[color:var(--tk-muted,#9ca3af)]">/{total}</span>
            </p>
            <p className="mt-1 text-[12px] text-[color:var(--tk-muted,#6b7280)]">AI crawlers allowed by robots.txt</p>
          </div>
          {/* Blocked count */}
          <div className="rounded-[var(--tool-r-panel,0.75rem)] border border-[color:var(--tk-line-strong,#e5e7eb)] bg-[color:var(--tk-surface,#fff)] p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[color:var(--tk-muted,#6b7280)]">Blocked</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${blocked.length > 0 ? "text-[color:var(--tk-fail,#bf000f)]" : "text-[color:var(--tk-muted,#9ca3af)]"}`}>
              {summary?.blocked ?? blocked.length}
            </p>
            <p className="mt-1 text-[12px] text-[color:var(--tk-muted,#6b7280)]">{blocked.length > 0 ? "Disallowed for the homepage" : "None blocked by robots.txt"}</p>
          </div>
          {/* AI impact — the honest line */}
          <div className="rounded-[var(--tool-r-panel,0.75rem)] border border-[color:var(--tk-line-strong,#e2e8f0)] bg-[color:var(--tk-surface-2,#f8fafc)] p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[color:var(--tk-muted,#6b7280)]">What this means</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[color:var(--tk-muted,#45556c)]">Reachability</p>
            <p className="mt-1 text-[12px] text-[color:var(--tk-muted,#6b7280)]">Permission to crawl — not citations or rank</p>
          </div>
        </div>

        {/* robots facts */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-[color:var(--tk-muted,#6b7280)]">
          <span>robots.txt {robotsPresent ? "found" : "not found"}</span>
          <span>· HTTP {result.robots?.fetch_status}</span>
          <span>· checked the homepage path <code className="rounded bg-[color:var(--tk-surface-2,#f3f4f6)] px-1 text-[color:var(--tk-muted,#4b5563)]">/</code></span>
        </div>

        {!robotsPresent && (
          <p className="mt-3 rounded-[var(--tool-r-panel,0.5rem)] border border-[color:var(--tk-line,#f3f4f6)] bg-[color:var(--tk-surface-2,#f9fafb)] px-3 py-2 text-[13px] text-[color:var(--tk-muted,#4b5563)]">
            No robots.txt was found, so all {total}{" "}crawlers are allowed by default. That means nothing is blocked — but also
            that crawler access isn&apos;t explicitly managed.
          </p>
        )}
      </div>

      {/* Blocked bots — surfaced FIRST, red, with the blocking rule */}
      {blocked.length > 0 && (
        <div className="rounded-[var(--tool-r-card,1rem)] border border-[color:var(--tk-fail-line,#ffcaca)] bg-[color:var(--tk-surface,#fff)] p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--tk-fail,#e40014)]">
            {blocked.length} blocked by robots.txt
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--tk-muted,#4b5563)]">
            These AI crawlers are <strong className="text-[color:var(--tk-white,#111827)]">disallowed</strong>{" "}from your homepage. If that&apos;s not
            intentional, the exact line to change is shown for each.
          </p>
          <ul className="mt-4 space-y-2.5">
            {blocked.map((b) => (
              <li key={b.ua} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[var(--tool-r-panel,0.75rem)] border border-[color:var(--tk-fail-line,#ffe2e2)] bg-[color:var(--tk-fail-bg,#fef2f280)] px-4 py-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--tk-fail,#fb2c36)]" aria-hidden="true" />
                <span className="text-[14px] font-semibold text-[color:var(--tk-white,#111827)]">{b.label}</span>
                <span className="text-[12px] text-[color:var(--tk-muted,#6b7280)]">{b.platform} · {TYPE_LABELS[b.bot_type]}</span>
                {b.blocked_by && (
                  <code className="rounded bg-[color:var(--tk-surface,#fff)] px-2 py-0.5 font-mono text-[11px] text-[color:var(--tk-fail,#bf000f)] ring-1 ring-[color:var(--tk-fail-line,#ffcaca)]">{b.blocked_by}</code>
                )}
                {b.note && <span className="text-[11px] italic text-[color:var(--tk-warn,#b75000)]">{b.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* By-type summary */}
      {summary && (
        <div className="rounded-[var(--tool-r-card,1rem)] border border-[color:var(--tk-line-strong,#e5e7eb)] bg-[color:var(--tk-surface,#fff)] p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--tk-muted,#9ca3af)]">Access by crawler purpose</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TYPE_ORDER.map((t) => {
              const row = summary.by_type[t]
              const tot = row ? row.allowed + row.blocked : 0
              if (tot === 0) return null
              return (
                <div key={t} className="rounded-[var(--tool-r-panel,0.75rem)] border border-[color:var(--tk-line,#f3f4f6)] bg-[color:var(--tk-surface-2,#f9fafb99)] p-3">
                  <p className="text-[12px] font-semibold text-[color:var(--tk-text,#374151)]">{TYPE_LABELS[t]}</p>
                  <p className="mt-1 font-mono text-[13px] tabular-nums text-[color:var(--tk-muted,#6b7280)]">
                    <span className="text-[color:var(--tk-accent,#0f766e)]">{row.allowed} allowed</span>
                    {row.blocked > 0 && <span className="text-[color:var(--tk-fail,#e40014)]"> · {row.blocked} blocked</span>}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Allowed bots — collapsed */}
      {allowed.length > 0 && (
        <details className="rounded-[var(--tool-r-card,1rem)] border border-[color:var(--tk-line-strong,#e5e7eb)] bg-[color:var(--tk-surface,#fff)] p-5 sm:p-6">
          <summary className="cursor-pointer font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--tk-muted,#9ca3af)]">
            {allowed.length} allowed by robots.txt — show all
          </summary>
          <div className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {allowed.map((b) => (
              <div key={b.ua} className="flex items-center gap-2.5 text-[13px]">
                <span className="font-mono text-[11px] font-semibold text-[color:var(--tk-accent,#0f766e)]">OK</span>
                <span className="text-[color:var(--tk-text,#374151)]">{b.label}</span>
                <span className="text-[11px] text-[color:var(--tk-muted,#9ca3af)]">{b.platform}</span>
                {b.note && <span className="text-[11px] italic text-[color:var(--tk-warn,#b75000)]" title={b.note}>· may ignore robots</span>}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Honest evidence panel */}
      <div className="rounded-[var(--tool-r-card,1rem)] border border-[color:var(--tk-line-strong,#e2e8f0)] bg-[color:var(--tk-surface-2,#f8fafc)] p-5 text-[13px] leading-relaxed text-[color:var(--tk-text,#314158)]">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--tk-muted,#62748e)]">What this does and doesn&apos;t prove</p>
        <ul className="mt-3 space-y-1.5">
          <li>· <strong className="text-[color:var(--tk-white,#0f172b)]">robots.txt is permission, not a guarantee.</strong> Allowing a crawler doesn&apos;t mean an AI engine cites you — that depends on your content, not your robots file.</li>
          <li>· <strong className="text-[color:var(--tk-white,#0f172b)]">Some bots ignore robots.txt entirely.</strong> A few crawlers may fetch regardless of what robots.txt says; &ldquo;allowed&rdquo; here just means nothing disallows them.</li>
          <li>· <strong className="text-[color:var(--tk-white,#0f172b)]">This checks reachability, not rendering.</strong> robots.txt can permit a bot that a WAF, Cloudflare rule, or 403 still blocks in practice.</li>
        </ul>
      </div>

      {/* Embeddable badge — the link engine */}
      <div className="rounded-[var(--tool-r-card,1rem)] border border-[color:var(--tk-line-strong,#e5e7eb)] bg-[color:var(--tk-surface,#fff)] p-5 sm:p-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--tk-muted,#9ca3af)]">Embed your result</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--tk-muted,#4b5563)]">
          Drop this badge on your site or docs. It re-checks live, so it always reflects your current robots.txt.
        </p>
        <div className="mt-3 flex items-start gap-2">
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-pre rounded-[var(--tool-r-panel,0.5rem)] bg-[color:var(--tk-code-bg,#f9fafb)] px-3 py-2 font-mono text-[11px] leading-relaxed text-[color:var(--tk-text,#374151)] ring-1 ring-[color:var(--tk-line-strong,#e5e7eb)]">{badgeSnippet}</code>
          <button
            type="button"
            onClick={() => copy(badgeSnippet, "badge")}
            className="shrink-0 rounded-[var(--tool-r-panel,0.5rem)] border border-[color:var(--tk-line-strong,#e5e7eb)] px-2.5 py-2 text-[11px] font-medium text-[color:var(--tk-muted,#4b5563)] transition-colors hover:border-[color:var(--tk-accent,#5eead4)] hover:text-[color:var(--tk-accent,#0f766e)]"
          >
            {copied === "badge" ? "Copied" : "Copy"}
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeUrl} alt={`AI crawler access for ${host} — checked by GEO Toolbox`} height={20} className="mt-3 h-5" />
      </div>

      {/* Bridge CTA → Agent Readiness (paid live probe) */}
      <div className={`rounded-[var(--tool-r-card,1rem)] border border-[color:var(--tk-line-strong,#111827)] bg-[color:var(--tk-code-bg,#030712)] p-6 sm:p-7 ${tk.bridgeIn}`}>
        <h3 className="text-lg font-bold tracking-tight text-white">
          robots.txt says these bots <em className="not-italic text-[color:var(--tk-accent,#5eead4)]">may</em> crawl you. Do they actually get through?
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--tk-muted,#d1d5db)]">
          A robots.txt &ldquo;allow&rdquo; is only permission. A WAF, Cloudflare rule, bot-fight mode, or a 403 can still block a
          crawler that robots.txt permits. Agent Readiness live-fetches your site as six AI crawlers and shows what they
          really receive.
        </p>
        <div className="mt-5">
          <Link
            href="/features/agent-readiness?utm_source=ai-crawler-checker"
            className="inline-flex items-center gap-2 rounded-[var(--tool-r-btn,9999px)] bg-[color:var(--tk-accent,#fff)] px-6 py-3 text-[15px] font-semibold text-[color:var(--tk-accent-ink,#030712)] transition-colors hover:bg-[color:var(--tk-accent-hover,#f3f4f6)]"
          >
            Run a free Agent Readiness scan
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
