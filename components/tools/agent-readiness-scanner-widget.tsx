"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"

import {
  clampPct,
  isObj,
  num,
  scoreBand,
  topFixes,
  validateCrawlers,
  validateScan,
  type BotType,
  type CheckState,
  type CrawlerData,
  type ScanData,
  type Tone,
} from "@/lib/agent-readiness-scan"
import { trackEvent } from "@/lib/analytics"
import { ToolResultCapture } from "@/components/tools/tool-result-capture"
import tk from "./tools-dark.module.css"
import { ToolArrow } from "./tool-arrow"

/**
 * Agent Readiness Scanner — the public widget for the FULL v2 scan.
 *
 * Two same-origin, form-encoded POSTs fire in parallel (both hairpin to the PHP
 * app through the Vercel rewrites, so the Replit rate limiter keys on the
 * VISITOR IP rather than a single Vercel egress IP):
 *
 *   a) /index.php?action=agent_readiness_scan_v2   slow (30-90s), the /100 scan
 *   b) /api/ai_crawler_check.php                   fast, the 34-bot robots view
 *
 * Both endpoints read PHP $_POST, so bodies are URLSearchParams. A JSON body is
 * NOT supported by the v2 action — the sibling ai-readiness widget's JSON POST
 * must not be copied here.
 *
 * The crawler result renders as soon as it lands so the page is never blank
 * while the long scan runs.
 *
 * Every rendered string is a text node. Nothing from the scanned site reaches
 * an href, a style value, or dangerouslySetInnerHTML.
 */

/* ─────────────────────────── static maps ─────────────────────────── */

const ERROR_COPY: Record<string, string> = {
  invalid_url: "That does not look like a valid URL. Try a domain like example.com.",
  url_required: "Enter a URL to scan.",
  url_too_long: "That URL is too long.",
  host_not_allowed: "We cannot reach that host. It may be internal, private, or unresolvable.",
  ssrf_blocked: "We cannot scan that address. Public http and https URLs only.",
  fetch_failed: "We could not reach that site. Check the domain and try again.",
  robots_unreachable: "We reached the site but its robots.txt returned a server error, so crawler access cannot be read right now.",
  target_throttled: "That domain has been scanned a lot recently. Try again shortly.",
  registry_unavailable: "Our crawler registry is briefly unavailable. Try again in a moment.",
  internal_error: "Something went wrong on our end. Try again in a moment.",
  proxy_error: "The scanner returned an unexpected response. Try again in a moment.",
  malformed: "The scanner returned a result we could not read. Try again in a moment.",
  network: "The network dropped before the result came back. Try again.",
  // The scan's own timeout has a dedicated panel; this covers the crawler call,
  // which would otherwise fall through to the generic internal_error copy.
  timeout: "The crawler check took too long to answer. It may still be completing on our side; try again in a minute.",
}

const STATE_META: Record<CheckState, { label: string; dot: string; chip: string }> = {
  pass: { label: "Pass", dot: "bg-[color:var(--accent)]", chip: "bg-[color:var(--pass-bg)] text-[color:var(--accent)] border-[color:var(--line-lime)]" },
  warn: { label: "Warn", dot: "bg-[color:var(--warn)]", chip: "bg-[color:var(--warn-bg)] text-[color:var(--warn)] border-[color:var(--warn-line)]" },
  fail: { label: "Fix", dot: "bg-[color:var(--fail)]", chip: "bg-[color:var(--fail-bg)] text-[color:var(--fail)] border-[color:var(--fail-line)]" },
  info: { label: "Info", dot: "bg-[color:var(--subtle)]", chip: "bg-[color:var(--surface-2)] text-[color:var(--muted)] border-[color:var(--line-strong)]" },
  not_applicable: { label: "N/A", dot: "bg-[color:var(--subtle)]", chip: "bg-[color:var(--surface-2)] text-[color:var(--muted)] border-[color:var(--line-strong)]" },
  // Deliberately distinct from N/A: the check applies here, we just could not
  // confirm it on this run. Gray-amber reads as "unresolved", not "excused".
  unverifiable: {
    label: "Couldn't verify",
    dot: "bg-[color:var(--subtle)]",
    chip: "bg-[color:var(--surface-2)] text-[color:var(--text)] border-[color:var(--line-strong)]",
  },
}

const TYPE_LABELS: Record<BotType, string> = {
  search: "AI search",
  training: "Model training",
  userQuery: "User-prompted fetch",
  other: "Other",
}

const TYPE_ORDER: BotType[] = ["search", "userQuery", "training", "other"]

const TONE_TEXT: Record<Tone, string> = {
  bad: "text-[color:var(--fail)]",
  mid: "text-[color:var(--warn)]",
  good: "text-[color:var(--accent)]",
}

const TONE_BAR: Record<Tone, string> = {
  bad: "bg-[color:var(--fail)]",
  mid: "bg-[color:var(--warn)]",
  good: "bg-[color:var(--accent)]",
}

const TONE_PANEL: Record<Tone, string> = {
  bad: "border-[color:var(--fail-line)] bg-[color:var(--fail-bg)]",
  mid: "border-[color:var(--warn-line)] bg-[color:var(--warn-bg)]",
  good: "border-[color:var(--line-lime)] bg-[color:var(--pass-bg)]",
}

const LEVEL_STEPS = [0, 1, 2, 3, 4]

const EXAMPLES = [
  { label: "stripe docs", url: "https://docs.stripe.com" },
  { label: "cloudflare", url: "https://developers.cloudflare.com" },
  { label: "nytimes.com", url: "https://www.nytimes.com" },
]

const SCAN_TIMEOUT_MS = 100_000
const CRAWLER_TIMEOUT_MS = 45_000

function stagedCopy(elapsed: number): string {
  if (elapsed < 10) return "Fetching robots.txt, sitemap and the raw HTML."
  if (elapsed < 25) return "Re-fetching the page as six AI crawler user agents, from our server."
  if (elapsed < 45) return "Rendering the page in a real browser, the way a headless agent would."
  if (elapsed < 70) return "Scoring structured data, entity clarity and citability signals."
  return "Still working. Deep scans on large or slow sites can take up to 90 seconds."
}

/* ─────────────────────────── widget ─────────────────────────── */

type Phase = "idle" | "running" | "settled"
type Slot<T> = { status: "pending" | "ok" | "error" | "timeout"; data: T | null; error: string | null }

const PENDING = { status: "pending", data: null, error: null } as const

export function AgentReadinessScannerWidget() {
  const [url, setUrl] = useState("")
  const [phase, setPhase] = useState<Phase>("idle")
  const [scan, setScan] = useState<Slot<ScanData>>({ ...PENDING })
  const [crawlers, setCrawlers] = useState<Slot<CrawlerData>>({ ...PENDING })
  const [formError, setFormError] = useState<string | null>(null)
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [nowTs, setNowTs] = useState<number>(() => Date.now())

  const reqIdRef = useRef(0)
  const controllersRef = useRef<AbortController[]>([])

  // One ticker drives both the staged elapsed copy and the 429 cooldown counter.
  useEffect(() => {
    if (phase !== "running" && cooldownUntil === null) return
    const id = setInterval(() => setNowTs(Date.now()), 1000)
    return () => clearInterval(id)
  }, [phase, cooldownUntil])

  useEffect(() => {
    if (cooldownUntil !== null && nowTs >= cooldownUntil) setCooldownUntil(null)
  }, [nowTs, cooldownUntil])

  // Abort anything still in flight if the visitor navigates away mid-scan.
  useEffect(() => () => controllersRef.current.forEach((c) => c.abort()), [])

  const elapsed = startedAt === null ? 0 : Math.max(0, Math.floor((nowTs - startedAt) / 1000))
  const cooldownLeft = cooldownUntil === null ? 0 : Math.max(0, Math.ceil((cooldownUntil - nowTs) / 1000))
  const running = phase === "running"
  const submitDisabled = running || cooldownLeft > 0

  const runScan = useCallback(
    async (target: string) => {
      const value = target.trim()
      if (!value) {
        setFormError(ERROR_COPY.url_required)
        return
      }
      if (running || cooldownLeft > 0) return

      // New run: abandon the previous one and invalidate its responses.
      controllersRef.current.forEach((c) => c.abort())
      const myId = ++reqIdRef.current
      const scanCtl = new AbortController()
      const crawlCtl = new AbortController()
      controllersRef.current = [scanCtl, crawlCtl]

      setFormError(null)
      setScan({ ...PENDING })
      setCrawlers({ ...PENDING })
      setPhase("running")
      setStartedAt(Date.now())
      setNowTs(Date.now())

      const fresh = () => reqIdRef.current === myId

      /** Shared transport: form-encoded POST, JSON parse guarded, 429 branched. */
      async function post(
        path: string,
        ctl: AbortController,
        timeoutMs: number,
      ): Promise<{ ok: true; json: unknown } | { ok: false; code: string; retryAfter?: number }> {
        const timer = setTimeout(() => ctl.abort(), timeoutMs)
        try {
          const res = await fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ url: value }).toString(),
            signal: ctl.signal,
          })
          let json: unknown = null
          let parsed = true
          try {
            json = await res.json()
          } catch {
            parsed = false
          }
          const errCode = isObj(json) && typeof json.error === "string" ? json.error : null

          if (res.status === 429 || errCode === "rate_limited") {
            const header = Number(res.headers.get("Retry-After"))
            const fromBody = isObj(json) ? num(json.retry_after, 0) : 0
            const retryAfter = Number.isFinite(header) && header > 0 ? header : fromBody
            return { ok: false, code: "rate_limited", retryAfter: retryAfter > 0 ? Math.min(retryAfter, 3600) : 60 }
          }
          if (!parsed) return { ok: false, code: "proxy_error" }
          if (errCode) return { ok: false, code: errCode }
          if (!res.ok) return { ok: false, code: "internal_error" }
          return { ok: true, json }
        } catch (e) {
          const aborted = e instanceof DOMException && e.name === "AbortError"
          return { ok: false, code: aborted ? "timeout" : "network" }
        } finally {
          clearTimeout(timer)
        }
      }

      function applyRateLimit(retryAfter: number | undefined) {
        setCooldownUntil(Date.now() + (retryAfter && retryAfter > 0 ? retryAfter : 60) * 1000)
      }

      const crawlerRun = post("/api/ai_crawler_check.php", crawlCtl, CRAWLER_TIMEOUT_MS).then((r) => {
        if (!fresh()) return
        if (!r.ok) {
          if (r.code === "rate_limited") applyRateLimit(r.retryAfter)
          setCrawlers({ status: "error", data: null, error: r.code })
          return
        }
        const data = validateCrawlers(r.json)
        if (!data) {
          setCrawlers({ status: "error", data: null, error: "malformed" })
          return
        }
        setCrawlers({ status: "ok", data, error: null })
      })

      const scanRun = post("/index.php?action=agent_readiness_scan_v2", scanCtl, SCAN_TIMEOUT_MS).then((r) => {
        if (!fresh()) return
        if (!r.ok) {
          if (r.code === "rate_limited") applyRateLimit(r.retryAfter)
          setScan({ status: r.code === "timeout" ? "timeout" : "error", data: null, error: r.code })
          return
        }
        const data = validateScan(r.json)
        if (!data) {
          setScan({ status: "error", data: null, error: "malformed" })
          return
        }
        trackEvent("free_tool_used", { tool: "agent_readiness_scanner" })
        setScan({ status: "ok", data, error: null })
      })

      await Promise.allSettled([crawlerRun, scanRun])
      if (!fresh()) return
      setPhase("settled")
    },
    [running, cooldownLeft],
  )

  const scanData = scan.data
  const crawlerData = crawlers.data
  const showCta =
    (crawlerData !== null && crawlerData.blocked > 0) ||
    (scanData !== null && (scanData.overallScore < 71 || scanData.reportState === "access_blocked"))

  return (
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void runScan(url)
        }}
        className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-4 shadow-sm sm:p-5"
      >
        <label htmlFor="ars-url" className="sr-only">
          Site URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="ars-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourdomain.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={running}
            className="min-w-0 flex-1 rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--bg)] px-4 py-3 text-[15px] text-[color:var(--white)] outline-none transition-colors placeholder:text-[color:var(--subtle)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--focus-ring)] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={submitDisabled}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[3px] bg-[color:var(--accent)] px-6 py-3 text-[15px] font-semibold text-[color:var(--accent-ink)] transition-all hover:bg-[color:var(--accent-hover)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
                Scanning
              </>
            ) : cooldownLeft > 0 ? (
              `Try again in ${cooldownLeft}s`
            ) : (
              <>Run the full scan<ToolArrow /></>
            )}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-[color:var(--muted)]">Try:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.url}
              type="button"
              disabled={submitDisabled}
              onClick={() => {
                setUrl(ex.url)
                void runScan(ex.url)
              }}
              className={`rounded-[3px] border border-[color:var(--line-strong)] px-3 py-1 font-mono text-[12px] text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] disabled:opacity-50 ${tk.chip}`}
            >
              {ex.label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-[color:var(--muted)]">
          The full scan runs server-side and takes 30 to 90 seconds: it fetches your site as six AI crawlers, renders it in a
          real browser, and checks robots against 34 known AI bots. Free, no sign-up.
        </p>
      </form>

      {formError && (
        <div className="mt-4 rounded-[4px] border border-[color:var(--fail-line)] bg-[color:var(--fail-bg)] px-4 py-3 text-[14px] text-[color:var(--fail)]">{formError}</div>
      )}

      {cooldownLeft > 0 && (
        <div className="mt-4 rounded-[4px] border border-[color:var(--warn-line)] bg-[color:var(--warn-bg)] px-4 py-3 text-[14px] text-[color:var(--warn)]">
          <span className="font-semibold">You have hit the free scan limit.</span> The scanner allows a burst of scans per IP so
          one visitor cannot monopolise it. Your URL is still in the box. Try again in {cooldownLeft} seconds.
        </div>
      )}

      {/* Progress: staged copy while the long scan runs. */}
      {running && (
        <div className="mt-4 rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--surface-2)] px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] text-[color:var(--muted)]">{stagedCopy(elapsed)}</p>
            <span className="shrink-0 font-mono text-[12px] tabular-nums text-[color:var(--muted)]">{elapsed}s</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[color:var(--line-strong)]">
            <div
              className="h-full rounded-[3px] bg-[color:var(--accent)] transition-[width] duration-1000 ease-linear"
              style={{ width: `${clampPct((elapsed / 90) * 100)}%` }}
            />
          </div>
          {crawlers.status === "ok" && scan.status === "pending" && (
            <p className="mt-2 text-[12px] text-[color:var(--muted)]">
              Crawler access is below already. The scored report follows when the deep scan finishes.
            </p>
          )}
        </div>
      )}

      {/* Crawler access renders first, as soon as it lands. */}
      {crawlerData && <CrawlerCard data={crawlerData} />}

      {crawlers.status === "error" && (
        <div className="mt-4 rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--surface-2)] px-4 py-3 text-[13px] text-[color:var(--muted)]">
          Crawler access could not be checked: {ERROR_COPY[crawlers.error ?? "internal_error"] ?? ERROR_COPY.internal_error}
        </div>
      )}

      {/* The scored report. */}
      {scanData && <ScanReport data={scanData} />}
      {scanData && <ToolResultCapture slug="agent-readiness-scanner" what="agent readiness report" />}

      {scan.status === "timeout" && (
        <div className="mt-4 rounded-[4px] border border-[color:var(--warn-line)] bg-[color:var(--warn-bg)] px-4 py-3 text-[14px] leading-relaxed text-[color:var(--warn)]">
          <span className="font-semibold">We stopped waiting after 100 seconds.</span> The scan may still be completing on our
          side. Give it a minute before you run it again, so you are not queueing a second scan on top of the first.
        </div>
      )}

      {scan.status === "error" && scan.error !== "rate_limited" && (
        <div className="mt-4 rounded-[4px] border border-[color:var(--fail-line)] bg-[color:var(--fail-bg)] px-4 py-3 text-[14px] text-[color:var(--fail)]">
          {ERROR_COPY[scan.error ?? "internal_error"] ?? ERROR_COPY.internal_error}
        </div>
      )}

      {showCta && phase === "settled" && <MidCta blocked={crawlerData?.blocked ?? 0} />}
    </div>
  )
}

/* ─────────────────────────── crawler card ─────────────────────────── */

function CrawlerCard({ data }: { data: CrawlerData }) {
  const blocked = data.bots.filter((b) => !b.allowed)
  const allowed = data.bots.filter((b) => b.allowed)
  const clean = data.blocked === 0
  const tone: Tone = clean ? "good" : data.allowed === 0 ? "bad" : "mid"

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">Crawler access</p>
          <span className="font-mono text-[11px] text-[color:var(--muted)]">robots.txt {data.robotsPresent === false ? "not found" : "checked"}</span>
        </div>
        <p className={`mt-2 text-3xl font-bold tracking-tight tabular-nums ${TONE_TEXT[tone]}`}>
          {data.allowed}
          <span className="text-lg font-semibold text-[color:var(--muted)]">/{data.total}</span>
        </p>
        <p className="mt-1 text-[13px] text-[color:var(--muted)]">
          {clean
            ? "AI crawlers allowed by robots.txt. Nothing is blocked at the robots layer."
            : `AI crawlers allowed by robots.txt. ${data.blocked} are disallowed for your homepage.`}
        </p>

        {blocked.length > 0 && (
          <ul className="mt-4 space-y-2.5">
            {blocked.map((b) => (
              <li
                key={b.ua}
                className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[4px] border border-[color:var(--fail-line)] bg-[color:var(--fail-bg)] px-4 py-2.5"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--fail)]" aria-hidden="true" />
                <span className="text-[14px] font-semibold text-[color:var(--white)]">{b.label}</span>
                <span className="text-[12px] text-[color:var(--muted)]">
                  {b.platform} · {TYPE_LABELS[b.botType]}
                </span>
                {b.blockedBy && (
                  <code className="rounded bg-[color:var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[color:var(--fail)] ring-1 ring-[color:var(--fail-line)]">
                    {b.blockedBy}
                  </code>
                )}
                {b.note && <span className="text-[11px] italic text-[color:var(--warn)]">{b.note}</span>}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TYPE_ORDER.map((t) => {
            const row = data.byType[t]
            if (!row || row.allowed + row.blocked === 0) return null
            return (
              <div key={t} className="rounded-[4px] border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3">
                <p className="text-[12px] font-semibold text-[color:var(--text)]">{TYPE_LABELS[t]}</p>
                <p className="mt-1 font-mono text-[13px] tabular-nums text-[color:var(--muted)]">
                  <span className="text-[color:var(--accent)]">{row.allowed} allowed</span>
                  {row.blocked > 0 && <span className="text-[color:var(--fail)]"> · {row.blocked} blocked</span>}
                </p>
              </div>
            )
          })}
        </div>

        {allowed.length > 0 && (
          <details className="mt-4 rounded-[4px] border border-[color:var(--line)] bg-[color:var(--surface-2)] p-4">
            <summary className="cursor-pointer font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
              {allowed.length} allowed by robots.txt, show all
            </summary>
            <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {allowed.map((b) => (
                <div key={b.ua} className="flex items-center gap-2.5 text-[13px]">
                  <span className="font-mono text-[11px] font-semibold text-[color:var(--accent)]">OK</span>
                  <span className="text-[color:var(--text)]">{b.label}</span>
                  <span className="text-[11px] text-[color:var(--muted)]">{b.platform}</span>
                  {b.note && <span className="text-[11px] italic text-[color:var(--warn)]">· may ignore robots</span>}
                </div>
              ))}
            </div>
          </details>
        )}

        <p className="mt-4 text-[12px] leading-relaxed text-[color:var(--muted)]">
          robots.txt is permission, not proof. A crawler it allows can still be stopped by a WAF or a 403, which is why the
          scored report below fetches your page as each crawler for real.{" "}
          <Link href="/tools/ai-crawler-checker" className="font-semibold text-[color:var(--accent)] underline-offset-2 hover:underline">
            See the full 34-bot breakdown
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────── scored report ─────────────────────────── */

function ScanReport({ data }: { data: ScanData }) {
  const rateable = data.grade !== "NR" && data.reportState !== "access_blocked"
  const band = scoreBand(data.overallScore)
  const lowConfidence = data.reportState === "low_confidence" || data.confidence === "low"

  const fixes = topFixes(data.checks, 3)

  const crawlerCheck = data.checks.find((c) => c.id === "ai_crawler_access") ?? null
  const advancedChips = data.advanced.slice(0, 8)

  return (
    <div className="mt-6 space-y-5">
      {data.reportState === "access_blocked" && (
        <div className="rounded-[8px] border border-[color:var(--fail-line)] bg-[color:var(--fail-bg)] p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--fail)]">Access blocked</p>
          <h3 className="mt-2 text-lg font-bold tracking-tight text-[color:var(--white)]">
            Your site blocked our scanner, so it very likely blocks AI crawlers too.
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--text)]">
            We could not fetch enough of the site to score it honestly, so we are not going to invent a number. A bot-protection
            rule, a WAF, or a 403 on non-browser user agents is the usual cause. Fix the access layer first, then re-run this
            scan.
          </p>
        </div>
      )}

      {/* Hero: the readiness level is the headline, the score supports it. */}
      <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-6 sm:p-7">
        {data.readinessLevel !== null && data.readinessLevelName && (
          <>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--accent)]">Agent readiness level</p>
            <h3 className="mt-2 text-[clamp(1.4rem,3vw,2rem)] font-bold leading-tight tracking-tight text-[color:var(--white)]">
              Level {data.readinessLevel} of 4 · {data.readinessLevelName}
            </h3>
            <ol className="mt-4 flex items-center gap-1.5" aria-label={`Readiness level ${data.readinessLevel} of 4`}>
              {LEVEL_STEPS.map((step) => {
                const reached = data.readinessLevel !== null && step <= data.readinessLevel
                return (
                  <li key={step} className="flex flex-1 flex-col items-center gap-1.5">
                    <span
                      className={`h-1.5 w-full rounded-full ${reached ? "bg-[color:var(--accent)]" : "bg-[color:var(--line-strong)]"}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        step === data.readinessLevel ? "font-bold text-[color:var(--accent)]" : "text-[color:var(--muted)]"
                      }`}
                    >
                      {step}
                    </span>
                  </li>
                )
              })}
            </ol>
            {(data.readinessLevelCapped || !data.readinessLevelReliable) && (
              <p className="mt-3 rounded-[4px] border border-[color:var(--warn-line)] bg-[color:var(--warn-bg)] px-3 py-2 text-[12.5px] leading-relaxed text-[color:var(--warn)]">
                {data.readinessLevelCapped
                  ? "This level is capped: a failing prerequisite holds it below what the rest of your signals would earn."
                  : "Treat this level as provisional. Part of the scan could not be verified on this run."}
              </p>
            )}
            {data.nextLevelLines.length > 0 && (
              <div className="mt-4 rounded-[4px] border border-[color:var(--line)] bg-[color:var(--surface-2)] px-4 py-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">Next level</p>
                <ul className="mt-2 space-y-1.5">
                  {data.nextLevelLines.map((line, i) => (
                    <li key={i} className="text-[13px] leading-relaxed text-[color:var(--text)]">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="my-6 h-px bg-[color:var(--line-strong)]" />
          </>
        )}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">Readiness score</p>
            {rateable ? (
              <>
                <p className={`mt-2 text-5xl font-bold tracking-tight tabular-nums ${TONE_TEXT[band.tone]}`}>
                  {data.overallScore}
                  <span className="text-2xl text-[color:var(--muted)]">/100</span>
                </p>
                <p className="mt-1 text-[13px] text-[color:var(--muted)]">
                  Grade {data.grade} · {band.label}
                  {data.scoredCheckCount > 0 && <> · {data.scoredCheckCount} scored checks</>}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--muted)]">Not rateable</p>
                <p className="mt-1 max-w-md text-[13px] leading-relaxed text-[color:var(--muted)]">
                  Too little of the site could be verified to publish a score. That is a real finding, not a zero: an unscoreable
                  site is usually one AI crawlers cannot read either.
                </p>
              </>
            )}
          </div>
          {rateable && (
            <div className={`rounded-[4px] border px-4 py-3 text-[13px] sm:max-w-[16rem] ${TONE_PANEL[band.tone]}`}>
              <span className="font-semibold">{band.label}.</span> Bands are the same ones the paid tracker uses, so this number
              is comparable to your scans there.
            </div>
          )}
        </div>

        {rateable && lowConfidence && (
          <p className="mt-4 rounded-[4px] border border-[color:var(--warn-line)] bg-[color:var(--warn-bg)] px-3 py-2 text-[12.5px] leading-relaxed text-[color:var(--warn)]">
            Low confidence: only {clampPct(data.coverageRatio * 100)}% of the applicable checks could be verified on this run, so
            read the score as indicative and re-run it later.
          </p>
        )}
      </div>

      {/* Pillars */}
      {data.pillars.length > 0 && (
        <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">Where the points came from</p>
          <ul className="mt-4 space-y-3.5">
            {data.pillars.map((p) => {
              const pct = p.max > 0 ? clampPct((p.score / p.max) * 100) : 0
              const tone: Tone = pct >= 80 ? "good" : pct >= 50 ? "mid" : "bad"
              return (
                <li key={p.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[14px] font-semibold text-[color:var(--white)]">{p.label}</span>
                    <span className="font-mono text-[12px] tabular-nums text-[color:var(--muted)]">
                      {p.score}/{p.max}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[color:var(--surface-2)]">
                    <div className={`h-full rounded-[3px] ${TONE_BAR[tone]}`} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Live-probe evidence */}
      {crawlerCheck && (
        <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-[3px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                STATE_META[crawlerCheck.state].chip
              }`}
            >
              {STATE_META[crawlerCheck.state].label}
            </span>
            <span className="text-[15px] font-semibold text-[color:var(--white)]">{crawlerCheck.label}</span>
            <span className="font-mono text-[11px] text-[color:var(--muted)]">live probe</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--muted)]">{crawlerCheck.evidence}</p>
          {crawlerCheck.why && <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--muted)]">{crawlerCheck.why}</p>}
          <p className="mt-2 text-[12px] leading-relaxed text-[color:var(--muted)]">
            This is an actual request sent from our server with each bot user agent, so it catches WAF and 403 blocks that a
            robots.txt reading cannot see.
          </p>
        </div>
      )}

      {/* Top fixes */}
      {fixes.length > 0 ? (
        <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Fix these first
          </p>
          <ul className="mt-4 space-y-3">
            {fixes.map((c) => (
              <li key={c.id} className="rounded-[4px] border border-[color:var(--line)] bg-[color:var(--surface-2)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-[3px] border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      STATE_META[c.state].chip
                    }`}
                  >
                    {STATE_META[c.state].label}
                  </span>
                  <span className="text-[15px] font-semibold text-[color:var(--white)]">{c.label}</span>
                  <span className="font-mono text-[11px] tabular-nums text-[color:var(--muted)]">{c.weight} pts</span>
                </div>
                {c.evidence && <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--muted)]">{c.evidence}</p>}
                <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--white)]">
                  <span className="font-semibold">Fix:</span> {c.fix}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        rateable && (
          <div className="rounded-[8px] border border-[color:var(--line-lime)] bg-[color:var(--pass-bg)] p-5 text-[13px] leading-relaxed text-[color:var(--accent)] sm:p-6">
            Nothing failed or warned with a fix attached. The plumbing is not what is holding this site back, which means any
            visibility gap is a content and authority problem.
          </div>
        )
      )}

      {/* Advanced, unscored */}
      {advancedChips.length > 0 && (
        <div className="rounded-[8px] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-2)] p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Agent surfaces <span className="text-[color:var(--muted)]">· detected, not scored</span>
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[color:var(--muted)]">
            Emerging conventions that let agents call you rather than just read you. Almost no site implements them yet, so they
            never move your score.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {advancedChips.map((a) => (
              <li
                key={a.id}
                className={`rounded-[3px] border px-3 py-1 text-[12px] ${STATE_META[a.state].chip}`}
                title={a.evidence}
              >
                <span className="font-semibold">{a.label}</span>
                <span className="opacity-70"> · {STATE_META[a.state].label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Honesty panel */}
      <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface-2)] p-5 text-[13px] leading-relaxed text-[color:var(--text)]">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
          What this proves, and what it does not
        </p>
        <ul className="mt-3 space-y-1.5">
          <li>
            · <strong className="text-[color:var(--white)]">It measures readability, not citations.</strong> A perfect score says agents can
            read you. Whether they quote you is a content and authority question.
          </li>
          <li>
            · <strong className="text-[color:var(--white)]">It is a point-in-time result.</strong> Robots rules, WAF rules and rendering all
            change. Re-run it after any infrastructure change.
          </li>
          <li>
            · <strong className="text-[color:var(--white)]">The probe comes from our IP.</strong> Sites that allowlist crawlers by IP rather
            than user agent may behave differently for the real bots.
          </li>
        </ul>
      </div>
    </div>
  )
}

/* ─────────────────────────── contextual CTA ─────────────────────────── */

function MidCta({ blocked }: { blocked: number }) {
  return (
    <div className={`mt-5 rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--code-bg)] p-6 sm:p-7 ${tk.bridgeIn}`}>
      <h3 className="text-lg font-bold tracking-tight text-white">
        {blocked > 0
          ? `${blocked} AI crawlers cannot read your site. See what AI actually says about you.`
          : "You have gaps agents can feel. See what AI actually says about you."}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--muted)]">
        This scan tells you whether AI can read your site. It cannot tell you whether ChatGPT, Perplexity, Gemini, Claude, AI
        Overviews or Bing mention you when a buyer asks. That takes running the prompts.
      </p>
      <div className="mt-5">
        <Link
          href="/services/ai-seo-agency?utm_source=agent-readiness-scanner"
          prefetch={false}
          className="inline-flex items-center gap-2 rounded-[3px] bg-[color:var(--accent)] px-6 py-3 text-[15px] font-semibold text-[color:var(--accent-ink)] transition-colors hover:bg-[color:var(--accent-hover)]"
        >
          Get your AI Visibility Snapshot
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
