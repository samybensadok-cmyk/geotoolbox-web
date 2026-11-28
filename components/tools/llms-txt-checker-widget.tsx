"use client"

import { useState } from "react"

import { trackEvent } from "@/lib/analytics"
import Link from "next/link"
import { ToolResultCapture } from "@/components/tools/tool-result-capture"
import tk from "./tools-dark.module.css"

/**
 * Free llms.txt checker — the interactive widget. POSTs the user's URL to the
 * Replit endpoint (api/llms_txt_check.php, same-origin via the /api/* rewrite,
 * so no CORS — the bug that breaks client-side incumbents) and renders the
 * server's verdict: spec validity (binary), a 0-100 quality score, and an
 * honest "AI impact: not proven" line. Single-URL checks are free + unmetered.
 */

type Severity = "error" | "broken" | "warning" | "advisory"

interface Issue {
  id: string
  severity: Severity
  title: string
  detail: string
  line: number | null
  fix: string | null
}

interface LinkResult {
  url: string
  status: "ok" | "dead" | "unverified"
  http_code: number
  final_url: string
  note: string
}

interface CheckResult {
  success: boolean
  error?: string
  detail?: string
  input?: { url: string; origin: string; host: string }
  fetch?: {
    http_code: number
    content_type: string
    final_url: string
    redirects: number
    bytes: number
    last_modified: string
  }
  validity?: "valid" | "invalid" | "not_found"
  score?: number | null
  grade?: string
  ai_impact?: string
  buckets?: Record<string, { earned: number; max: number }>
  structure?: Record<string, number | boolean>
  issues?: Issue[]
  links?: {
    summary: { total: number; ok: number; dead: number; unverified: number }
    checked: number
    total_unique: number
    results: LinkResult[]
  }
  robots?: { present: boolean; checked: Record<string, { allowed: boolean; reason: string }> }
  companion?: { llms_full_txt: boolean }
}

const EXAMPLES = [
  { label: "stripe.com", url: "https://docs.stripe.com" },
  { label: "anthropic", url: "https://platform.claude.com" },
  { label: "cloudflare", url: "https://developers.cloudflare.com" },
]

const ERROR_COPY: Record<string, string> = {
  invalid_url: "That doesn't look like a valid URL. Try a domain like example.com.",
  host_not_allowed: "We can't reach that host (it may be internal, private, or unresolvable).",
  url_required: "Enter a URL to check.",
  url_too_long: "That URL is too long.",
  fetch_failed: "We couldn't reach that site. Check the domain and try again.",
  rate_limited: "You've run a lot of checks — give it a minute and try again.",
  internal_error: "Something went wrong on our end. Try again in a moment.",
}

const SEVERITY_META: Record<Severity, { label: string; dot: string; chip: string; text: string }> = {
  error: { label: "Error", dot: "bg-[color:var(--fail)]", chip: "bg-[color:var(--fail-bg)] text-[color:var(--fail)] border-[color:var(--fail-line)]", text: "text-[color:var(--fail)]" },
  broken: { label: "Broken", dot: "bg-[color:var(--warn-strong)]", chip: "bg-[color:var(--warn-strong-bg)] text-[color:var(--warn-strong)] border-[color:var(--warn-strong-line)]", text: "text-[color:var(--warn-strong)]" },
  warning: { label: "Warning", dot: "bg-[color:var(--warn)]", chip: "bg-[color:var(--warn-bg)] text-[color:var(--warn)] border-[color:var(--warn-line)]", text: "text-[color:var(--warn)]" },
  advisory: { label: "Advisory", dot: "bg-[color:var(--subtle)]", chip: "bg-[color:var(--surface-2)] text-[color:var(--muted)] border-[color:var(--line-strong)]", text: "text-[color:var(--muted)]" },
}

function gradeColor(grade?: string): string {
  switch (grade) {
    case "A": return "text-[color:var(--accent)]"
    case "B": return "text-[color:var(--accent)]"
    case "C": return "text-[color:var(--warn)]"
    case "D": return "text-[color:var(--warn-strong)]"
    case "invalid": return "text-[color:var(--fail)]"
    default: return "text-[color:var(--muted)]"
  }
}

const BUCKET_LABELS: Record<string, string> = {
  core_validity: "Core validity",
  link_health: "Link health",
  summary_sections: "Summary & sections",
  curation_size: "Curation & size",
  companion_polish: "Companion & polish",
}

export function LlmsTxtCheckerWidget() {
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
    const timer = setTimeout(() => controller.abort(), 70000)
    try {
      const res = await fetch("/api/llms_txt_check.php", {
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
        trackEvent("free_tool_used", { tool: "llms_txt_checker" })
        setResult(data)
      }
    } catch {
      setErrorMsg("The check timed out or the network failed. Try again.")
    } finally {
      clearTimeout(timer)
      setLoading(false)
    }
  }

  function copyFix(text: string, id: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600)
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); runCheck(url) }}
        className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-4 shadow-sm sm:p-5"
      >
        <label htmlFor="llms-url" className="sr-only">Site URL</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="llms-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourdomain.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
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
                Checking…
              </>
            ) : "Check llms.txt"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-[color:var(--muted)]">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.url}
              type="button"
              disabled={loading}
              onClick={() => { setUrl(ex.url); runCheck(ex.url) }}
              className="rounded-[3px] border border-[color:var(--line-strong)] px-3 py-1 font-mono text-[12px] text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] disabled:opacity-50"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[color:var(--muted)]">
          We fetch <code className="rounded bg-[color:var(--surface-2)] px-1 py-0.5 text-[color:var(--muted)]">/llms.txt</code> server-side, validate it against the
          spec, and check that every linked URL resolves. Free, no sign-up.
        </p>
      </form>

      {loading && (
        <p className="mt-4 text-center text-[13px] text-[color:var(--muted)]">
          Fetching the file and resolving its links — this can take up to a minute for large files.
        </p>
      )}

      {errorMsg && !loading && (
        <div className="mt-4 rounded-[4px] border border-[color:var(--fail-line)] bg-[color:var(--fail-bg)] px-4 py-3 text-[14px] text-[color:var(--fail)]">
          {errorMsg}
        </div>
      )}

      {result && !loading && <ResultCard result={result} copyFix={copyFix} copied={copied} />}
      {result && !loading && <ToolResultCapture slug="llms-txt-checker" what="llms.txt report" />}
    </div>
  )
}

function ResultCard({
  result,
  copyFix,
  copied,
}: {
  result: CheckResult
  copyFix: (text: string, id: string) => void
  copied: string | null
}) {
  const validity = result.validity
  const issues = result.issues ?? []
  const host = result.input?.host ?? ""

  // Not found — friendly, point to the generator.
  if (validity === "not_found") {
    return (
      <div className="mt-6 rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-[3px] bg-[color:var(--surface-2)] text-[color:var(--muted)]">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[color:var(--white)]">No llms.txt found on {host}</h3>
            <p className="text-[14px] text-[color:var(--muted)]">Nothing at <code className="rounded bg-[color:var(--surface-2)] px-1 text-[color:var(--muted)]">{result.input?.url}</code>. That&apos;s fine — it&apos;s optional, and most sites don&apos;t have one yet.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="#generator" className="inline-flex items-center gap-2 rounded-[3px] bg-[color:var(--accent)] px-5 py-2.5 text-[14px] font-semibold text-[color:var(--accent-ink)] transition-colors hover:bg-[color:var(--accent-hover)]">
            Generate an llms.txt ↓
          </Link>
          <AgentReadinessLink subtle />
        </div>
      </div>
    )
  }

  const isInvalid = validity === "invalid"
  const score = result.score
  const links = result.links?.summary
  const order: Severity[] = ["error", "broken", "warning", "advisory"]
  const grouped = order
    .map((sev) => ({ sev, items: issues.filter((i) => i.severity === sev) }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="mt-6 space-y-5">
      {/* Verdict header — three clearly separated signals */}
      <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-6 sm:p-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
          Report for {host}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Spec validity */}
          <div className={`rounded-[4px] border p-4 ${isInvalid ? "border-[color:var(--fail-line)] bg-[color:var(--fail-bg)]" : "border-[color:var(--line-lime)] bg-[color:var(--pass-bg)]"}`}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">Spec validity</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight ${isInvalid ? "text-[color:var(--fail)]" : "text-[color:var(--accent)]"}`}>
              {isInvalid ? "Invalid" : "Valid"}
            </p>
            <p className="mt-1 text-[12px] text-[color:var(--muted)]">{isInvalid ? "Fix the errors below first" : "Conforms to the llms.txt spec"}</p>
          </div>
          {/* Quality score */}
          <div className="rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">Quality score</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${gradeColor(result.grade)}`}>
              {score == null ? "—" : `${score}`}<span className="text-base font-semibold text-[color:var(--muted)]">/100</span>
              {result.grade && result.grade !== "invalid" && <span className="ml-2 text-base">{result.grade}</span>}
            </p>
            <p className="mt-1 text-[12px] text-[color:var(--muted)]">{isInvalid ? "Capped — validity errors present" : "Implementation quality"}</p>
          </div>
          {/* AI impact — the honest line */}
          <div className="rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--surface-2)] p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">AI impact</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-[color:var(--muted)]">Not&nbsp;proven</p>
            <p className="mt-1 text-[12px] text-[color:var(--muted)]">No AI engine confirms it uses llms.txt</p>
          </div>
        </div>

        {/* fetch facts */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-[color:var(--muted)]">
          <span>HTTP {result.fetch?.http_code}</span>
          {result.fetch?.content_type && <span>· {result.fetch.content_type.split(";")[0]}</span>}
          {typeof result.fetch?.bytes === "number" && <span>· {(result.fetch.bytes / 1024).toFixed(1)} KB</span>}
          {links && <span>· {links.ok}/{links.total} links resolve{links.dead > 0 ? `, ${links.dead} dead` : ""}</span>}
          {result.companion && <span>· llms-full.txt {result.companion.llms_full_txt ? "present" : "absent"}</span>}
        </div>
      </div>

      {/* Score rubric (transparent) */}
      {result.buckets && score != null && (
        <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">How this score is calculated</p>
          <div className="mt-3 space-y-2.5">
            {Object.entries(result.buckets).map(([key, b]) => {
              const pct = b.max > 0 ? Math.round((b.earned / b.max) * 100) : 0
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-[13px] text-[color:var(--muted)]">{BUCKET_LABELS[key] ?? key}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--surface-2)]">
                    <div className="h-full rounded-[3px] bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-14 shrink-0 text-right font-mono text-[12px] tabular-nums text-[color:var(--muted)]">{b.earned}/{b.max}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Issues */}
      {grouped.length > 0 ? (
        <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            {issues.length} finding{issues.length > 1 ? "s" : ""}
          </p>
          <ul className="mt-4 space-y-3">
            {grouped.flatMap((g) =>
              g.items.map((issue, idx) => {
                const meta = SEVERITY_META[issue.severity]
                return (
                  <li key={`${issue.id}-${idx}`} className="rounded-[4px] border border-[color:var(--line)] bg-[color:var(--surface-2)] p-4">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-[3px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.chip}`}>{meta.label}</span>
                          <span className="text-[15px] font-semibold text-[color:var(--white)]">{issue.title}</span>
                          {issue.line != null && <span className="font-mono text-[11px] text-[color:var(--muted)]">line {issue.line}</span>}
                        </div>
                        {issue.detail && <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--muted)]">{issue.detail}</p>}
                        {issue.fix && (
                          <div className="mt-2 flex items-start gap-2">
                            <code className="min-w-0 flex-1 break-words rounded-[4px] bg-[color:var(--surface)] px-3 py-2 text-[12px] leading-relaxed text-[color:var(--text)] ring-1 ring-[color:var(--line-strong)]">{issue.fix}</code>
                            <button
                              type="button"
                              onClick={() => copyFix(issue.fix as string, `${issue.id}-${idx}`)}
                              className="shrink-0 rounded-[4px] border border-[color:var(--line-strong)] px-2.5 py-2 text-[11px] font-medium text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
                            >
                              {copied === `${issue.id}-${idx}` ? "Copied" : "Copy"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                )
              }),
            )}
          </ul>
        </div>
      ) : (
        <div className="rounded-[8px] border border-[color:var(--line-lime)] bg-[color:var(--pass-bg)] p-5 text-[14px] text-[color:var(--accent)]">
          Clean — no issues found. This is a well-formed llms.txt.
        </div>
      )}

      {/* Link table */}
      {result.links && result.links.results.length > 0 && (
        <details className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
          <summary className="cursor-pointer font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Linked URLs — {links?.ok}/{result.links.checked} resolve
            {result.links.total_unique > result.links.checked ? ` (first ${result.links.checked} of ${result.links.total_unique})` : ""}
          </summary>
          <div className="mt-4 space-y-1.5">
            {result.links.results.map((l, i) => (
              <div key={i} className="flex items-center gap-3 text-[12px]">
                <span className={`w-16 shrink-0 font-mono font-semibold ${l.status === "ok" ? "text-[color:var(--accent)]" : l.status === "dead" ? "text-[color:var(--fail)]" : "text-[color:var(--muted)]"}`}>
                  {l.status === "ok" ? "OK" : l.status === "dead" ? "DEAD" : "—"}
                </span>
                <span className="min-w-0 flex-1 truncate text-[color:var(--muted)]" title={l.url}>{l.url}</span>
                {l.note && <span className="shrink-0 text-[color:var(--muted)]">{l.note}</span>}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Robots */}
      {result.robots && Object.keys(result.robots.checked).length > 0 && (
        <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 text-[13px] text-[color:var(--muted)]">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">robots.txt</span>
          <span className="ml-3">
            {Object.entries(result.robots.checked).map(([ua, c], i) => (
              <span key={ua}>
                {i > 0 && <span className="text-[color:var(--muted)]"> · </span>}
                {ua}: <span className={c.allowed ? "text-[color:var(--accent)]" : "text-[color:var(--fail)]"}>{c.allowed ? "allowed" : "blocked"}</span>
              </span>
            ))}
          </span>
        </div>
      )}

      {/* Funnel CTA → Agent Readiness */}
      <div className={`rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--code-bg)] p-6 sm:p-7 ${tk.bridgeIn}`}>
        <h3 className="text-lg font-bold tracking-tight text-white">
          A valid llms.txt only means agents <em className="not-italic text-[color:var(--accent)]">can</em> read one optional file.
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--muted)]">
          It doesn&apos;t tell you whether AI crawlers can actually reach and render your <strong className="text-white">whole site</strong> —
          or whether any AI engine cites you. Agent Readiness runs 28 checks, live-fetches your site as six AI crawlers and shows what an agent really sees.
        </p>
        <div className="mt-5">
          <AgentReadinessLink />
        </div>
      </div>
    </div>
  )
}

function AgentReadinessLink({ subtle = false }: { subtle?: boolean }) {
  if (subtle) {
    return (
      <Link
        href="/features/agent-readiness?utm_source=llms-checker"
        className="inline-flex items-center gap-2 rounded-[3px] border border-[color:var(--line-strong)] px-5 py-2.5 text-[14px] font-medium text-[color:var(--text)] transition-colors hover:border-[color:var(--line-lime)] hover:text-[color:var(--white)]"
      >
        Check full agent readiness
      </Link>
    )
  }
  return (
    <Link
      href="/features/agent-readiness?utm_source=llms-checker"
      className="inline-flex items-center gap-2 rounded-[3px] bg-[color:var(--accent)] px-6 py-3 text-[15px] font-semibold text-[color:var(--accent-ink)] transition-colors hover:bg-[color:var(--accent-hover)]"
    >
      Run a free Agent Readiness scan
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Link>
  )
}
