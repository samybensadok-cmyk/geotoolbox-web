"use client"

import { useState } from "react"
import Link from "next/link"

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
  error: { label: "Error", dot: "bg-red-500", chip: "bg-red-50 text-red-700 border-red-200", text: "text-red-700" },
  broken: { label: "Broken", dot: "bg-orange-500", chip: "bg-orange-50 text-orange-700 border-orange-200", text: "text-orange-700" },
  warning: { label: "Warning", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-800 border-amber-200", text: "text-amber-800" },
  advisory: { label: "Advisory", dot: "bg-slate-400", chip: "bg-slate-50 text-slate-600 border-slate-200", text: "text-slate-600" },
}

function gradeColor(grade?: string): string {
  switch (grade) {
    case "A": return "text-accent-700"
    case "B": return "text-accent-600"
    case "C": return "text-amber-700"
    case "D": return "text-orange-700"
    case "invalid": return "text-red-700"
    default: return "text-slate-500"
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
        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
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
            ) : "Check llms.txt"}
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
          We fetch <code className="rounded bg-gray-100 px-1 py-0.5 text-gray-600">/llms.txt</code> server-side, validate it against the
          spec, and check that every linked URL resolves. Free, no sign-up.
        </p>
      </form>

      {loading && (
        <p className="mt-4 text-center text-[13px] text-gray-500">
          Fetching the file and resolving its links — this can take up to a minute for large files.
        </p>
      )}

      {errorMsg && !loading && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {errorMsg}
        </div>
      )}

      {result && !loading && <ResultCard result={result} copyFix={copyFix} copied={copied} />}
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
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-gray-900">No llms.txt found on {host}</h3>
            <p className="text-[14px] text-gray-500">Nothing at <code className="rounded bg-gray-100 px-1 text-gray-600">{result.input?.url}</code>. That&apos;s fine — it&apos;s optional, and most sites don&apos;t have one yet.</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="#generator" className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-800">
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
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Report for {host}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Spec validity */}
          <div className={`rounded-xl border p-4 ${isInvalid ? "border-red-200 bg-red-50" : "border-accent-200 bg-accent-50"}`}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">Spec validity</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight ${isInvalid ? "text-red-700" : "text-accent-700"}`}>
              {isInvalid ? "Invalid" : "Valid"}
            </p>
            <p className="mt-1 text-[12px] text-gray-500">{isInvalid ? "Fix the errors below first" : "Conforms to the llms.txt spec"}</p>
          </div>
          {/* Quality score */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">Quality score</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight tabular-nums ${gradeColor(result.grade)}`}>
              {score == null ? "—" : `${score}`}<span className="text-base font-semibold text-gray-400">/100</span>
              {result.grade && result.grade !== "invalid" && <span className="ml-2 text-base">{result.grade}</span>}
            </p>
            <p className="mt-1 text-[12px] text-gray-500">{isInvalid ? "Capped — validity errors present" : "Implementation quality"}</p>
          </div>
          {/* AI impact — the honest line */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">AI impact</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-600">Not&nbsp;proven</p>
            <p className="mt-1 text-[12px] text-gray-500">No AI engine confirms it uses llms.txt</p>
          </div>
        </div>

        {/* fetch facts */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-gray-500">
          <span>HTTP {result.fetch?.http_code}</span>
          {result.fetch?.content_type && <span>· {result.fetch.content_type.split(";")[0]}</span>}
          {typeof result.fetch?.bytes === "number" && <span>· {(result.fetch.bytes / 1024).toFixed(1)} KB</span>}
          {links && <span>· {links.ok}/{links.total} links resolve{links.dead > 0 ? `, ${links.dead} dead` : ""}</span>}
          {result.companion && <span>· llms-full.txt {result.companion.llms_full_txt ? "present" : "absent"}</span>}
        </div>
      </div>

      {/* Score rubric (transparent) */}
      {result.buckets && score != null && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">How this score is calculated</p>
          <div className="mt-3 space-y-2.5">
            {Object.entries(result.buckets).map(([key, b]) => {
              const pct = b.max > 0 ? Math.round((b.earned / b.max) * 100) : 0
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-[13px] text-gray-600">{BUCKET_LABELS[key] ?? key}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-14 shrink-0 text-right font-mono text-[12px] tabular-nums text-gray-500">{b.earned}/{b.max}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Issues */}
      {grouped.length > 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {issues.length} finding{issues.length > 1 ? "s" : ""}
          </p>
          <ul className="mt-4 space-y-3">
            {grouped.flatMap((g) =>
              g.items.map((issue, idx) => {
                const meta = SEVERITY_META[issue.severity]
                return (
                  <li key={`${issue.id}-${idx}`} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.chip}`}>{meta.label}</span>
                          <span className="text-[15px] font-semibold text-gray-900">{issue.title}</span>
                          {issue.line != null && <span className="font-mono text-[11px] text-gray-400">line {issue.line}</span>}
                        </div>
                        {issue.detail && <p className="mt-1 text-[13px] leading-relaxed text-gray-600">{issue.detail}</p>}
                        {issue.fix && (
                          <div className="mt-2 flex items-start gap-2">
                            <code className="min-w-0 flex-1 break-words rounded-lg bg-white px-3 py-2 text-[12px] leading-relaxed text-gray-700 ring-1 ring-gray-200">{issue.fix}</code>
                            <button
                              type="button"
                              onClick={() => copyFix(issue.fix as string, `${issue.id}-${idx}`)}
                              className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-2 text-[11px] font-medium text-gray-600 transition-colors hover:border-accent-300 hover:text-accent-700"
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
        <div className="rounded-2xl border border-accent-200 bg-accent-50 p-5 text-[14px] text-accent-800">
          Clean — no issues found. This is a well-formed llms.txt.
        </div>
      )}

      {/* Link table */}
      {result.links && result.links.results.length > 0 && (
        <details className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <summary className="cursor-pointer font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            Linked URLs — {links?.ok}/{result.links.checked} resolve
            {result.links.total_unique > result.links.checked ? ` (first ${result.links.checked} of ${result.links.total_unique})` : ""}
          </summary>
          <div className="mt-4 space-y-1.5">
            {result.links.results.map((l, i) => (
              <div key={i} className="flex items-center gap-3 text-[12px]">
                <span className={`w-16 shrink-0 font-mono font-semibold ${l.status === "ok" ? "text-accent-700" : l.status === "dead" ? "text-red-600" : "text-slate-400"}`}>
                  {l.status === "ok" ? "OK" : l.status === "dead" ? "DEAD" : "—"}
                </span>
                <span className="min-w-0 flex-1 truncate text-gray-600" title={l.url}>{l.url}</span>
                {l.note && <span className="shrink-0 text-gray-400">{l.note}</span>}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Robots */}
      {result.robots && Object.keys(result.robots.checked).length > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-[13px] text-gray-600">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">robots.txt</span>
          <span className="ml-3">
            {Object.entries(result.robots.checked).map(([ua, c], i) => (
              <span key={ua}>
                {i > 0 && <span className="text-gray-300"> · </span>}
                {ua}: <span className={c.allowed ? "text-accent-700" : "text-red-600"}>{c.allowed ? "allowed" : "blocked"}</span>
              </span>
            ))}
          </span>
        </div>
      )}

      {/* Funnel CTA → Agent Readiness */}
      <div className="rounded-2xl border border-gray-900 bg-gray-950 p-6 sm:p-7">
        <h3 className="text-lg font-bold tracking-tight text-white">
          A valid llms.txt only means agents <em className="not-italic text-accent-300">can</em> read one optional file.
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-gray-300">
          It doesn&apos;t tell you whether AI crawlers can actually reach and render your <strong className="text-white">whole site</strong> —
          or whether any AI engine cites you. Agent Readiness runs 28 checks across 34 AI crawlers and shows what an agent really sees.
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
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-[14px] font-medium text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900"
      >
        Check full agent readiness
      </Link>
    )
  }
  return (
    <Link
      href="/features/agent-readiness?utm_source=llms-checker"
      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-gray-100"
    >
      Run a free Agent Readiness scan
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </Link>
  )
}
