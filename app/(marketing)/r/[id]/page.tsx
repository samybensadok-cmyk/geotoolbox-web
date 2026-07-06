import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { siteConfig } from "@/lib/config"

/**
 * Public shareable AI-Readiness report  (/r/<id>, Phase B.2 — the share/growth loop).
 *
 * Reads a stored report from api/ai_readiness_report.php (created via the widget's
 * "Share this result", which re-runs the scan server-side so the score is authentic).
 * Read-only render + a CTA to run your own. noindex — these are user-generated, we
 * don't want thousands in the index. The OG card lives in opengraph-image.tsx.
 */

export const dynamic = "force-dynamic"

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

interface ReportEnvelope {
  input?: { url: string; origin: string; host: string }
  composite?: { points_awarded: number; points_possible: number; pct: number; grade: string }
  emerging?: { points_awarded: number; points_possible: number; checks: number }
  coverage?: { free_checks: number; total_checks: number }
  checks?: Check[]
  percentile?: { better_than_pct: number; sample_size: number }
}

interface ReportRecord {
  success: boolean
  id?: string
  host?: string
  url?: string
  score_pct?: number
  grade?: string
  created_at?: string
  report?: ReportEnvelope
}

async function getReport(id: string): Promise<ReportRecord | null> {
  try {
    const res = await fetch(`${siteConfig.url}/api/ai_readiness_report.php?id=${encodeURIComponent(id)}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = (await res.json()) as ReportRecord
    if (!data?.success || !data?.report?.composite) return null
    return data
  } catch {
    return null
  }
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

function fmtDate(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso.replace(" ", "T") + (iso.includes("Z") || iso.includes("+") ? "" : "Z"))
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const data = await getReport(id)
  const host = data?.host ?? "This site"
  const pct = data?.report?.composite?.pct
  const title = pct != null
    ? `${host} scores ${pct}% on AI-Readiness — GEO Toolbox`
    : "AI-Readiness report — GEO Toolbox"
  return {
    title,
    description: `See how ${host} scores on the foundational checks AI agents need to reach, crawl, and parse a site. Run your own free AI-Readiness score.`,
    robots: { index: false, follow: true },
    alternates: { canonical: `${siteConfig.url}/r/${id}` },
    openGraph: {
      title,
      description: `How ${host} scores on the foundations AI agents need. Free, server-side, honest about what it proves.`,
    },
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

export default async function SharedReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getReport(id)
  if (!data || !data.report?.composite) notFound()

  const report = data.report
  const c = report.composite!
  const cov = report.coverage
  const checks = report.checks ?? []
  const coreChecks = checks.filter((ck) => (ck.tier ?? "core") !== "emerging")
  const emergingChecks = checks.filter((ck) => (ck.tier ?? "core") === "emerging")
  const em = report.emerging
  const host = data.host ?? report.input?.host ?? ""
  const scanned = fmtDate(data.created_at)

  return (
    <section className="bg-[var(--surface-steel)] px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Shared AI-Readiness report
        </p>

        {/* Verdict header */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
          <p className="font-mono text-[12px] font-semibold text-gray-500">{host}</p>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={`text-5xl font-bold tracking-tight tabular-nums ${gradeColor(c.grade)}`}>
                {c.pct}<span className="text-2xl text-gray-400">%</span>
              </p>
              <p className="mt-1 text-[13px] text-gray-500">{c.points_awarded} of {c.points_possible} core points · grade {c.grade}</p>
              {report.percentile && (
                <p className="mt-1 text-[12px] text-gray-500">
                  Better than <span className="font-semibold text-gray-700">{report.percentile.better_than_pct}%</span> of {report.percentile.sample_size.toLocaleString()} sites scanned
                </p>
              )}
            </div>
            {cov && (
              <div className="rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-[13px] text-accent-900 sm:max-w-[16rem]">
                <span className="font-semibold">Free score · {cov.free_checks} of {cov.total_checks} checks.</span>{" "}
                This covers the foundations. The full Agent Readiness scan runs all {cov.total_checks}.
              </div>
            )}
          </div>
          {scanned && <p className="mt-4 text-[12px] text-gray-400">Scanned {scanned}</p>}
        </div>

        {/* Core checks */}
        {coreChecks.length > 0 && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Core checks <span className="text-gray-300">· the score</span>
            </p>
            <ul className="mt-4 space-y-3">
              {coreChecks.map((ck) => <CheckLi key={ck.id} ck={ck} />)}
            </ul>
          </div>
        )}

        {/* Emerging signals */}
        {emergingChecks.length > 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Emerging signals <span className="text-slate-400">· bonus, not in the score</span>
              </p>
              {em && (
                <span className="font-mono text-[11px] tabular-nums text-slate-500">{em.points_awarded} of {em.points_possible || 20} bonus earned</span>
              )}
            </div>
            <ul className="mt-4 space-y-3">
              {emergingChecks.map((ck) => <CheckLi key={ck.id} ck={ck} />)}
            </ul>
          </div>
        )}

        {/* Honest evidence panel */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-[13px] leading-relaxed text-slate-700">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-slate-500">What this score is — and isn&apos;t</p>
          <ul className="mt-3 space-y-1.5">
            <li>· <strong className="text-slate-900">These are infrastructure signals</strong> — whether AI agents can reach, crawl, and parse a site. Table stakes, not a guarantee of citations.</li>
            <li>· <strong className="text-slate-900">It&apos;s a partial.</strong> 5 of 28 checks. A high free score doesn&apos;t mean the other 23 (rendering, structured data, MCP, commerce, visual) pass.</li>
            <li>· <strong className="text-slate-900">No score buys visibility.</strong> Getting cited depends on content and authority. This fixes the plumbing so a site isn&apos;t invisible by accident.</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-5 rounded-2xl border border-gray-900 bg-gray-950 p-6 sm:p-7">
          <h2 className="text-lg font-bold tracking-tight text-white">Score your own site free</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-gray-300">
            Run the same 5 foundational checks on any domain — server-side, no sign-up. Or run the full Agent Readiness scan for all 28.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/tools/ai-readiness?utm_source=share"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-gray-100"
            >
              Get my free score
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link
              href="/features/agent-readiness?utm_source=share"
              className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/5"
            >
              Full Agent Readiness scan
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
