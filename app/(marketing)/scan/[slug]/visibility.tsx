import Link from "next/link"
import { siteConfig } from "@/lib/config"
import {
  fmtDate,
  validityText,
  ENGINE_META,
  ENGINE_ORDER,
  type LgsPublicV1,
} from "@/lib/lgs-public"

/**
 * Section 3: can an AI engine reach the site at all, plus the honesty tail and
 * the CTA. The crawler and llms.txt blocks both carry the `not_proven` framing
 * verbatim from the contract: a blocked bot is a measured fact, its effect on
 * citations is not. Nothing here may read as a causal claim.
 */

const SEVERITY_TONE: Record<string, string> = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  broken: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  advisory: "border-gray-200 bg-gray-50 text-gray-600",
}

function severityChip(severity: string): string {
  return SEVERITY_TONE[severity.toLowerCase()] ?? SEVERITY_TONE.advisory
}

export function Visibility({ data }: { data: LgsPublicV1 }) {
  const { crawlers, llmstxt, readiness, engines, meta } = data
  const blocked = crawlers.available ? crawlers.bots.filter((b) => !b.allowed).slice(0, 5) : []
  const failing = ENGINE_ORDER.map((key) => ({ key, bucket: engines[key] })).filter(
    (e) => (e.bucket?.failed_calls ?? 0) > 0
  )
  const captured = fmtDate(meta.generated_at)

  return (
    <section className="border-t border-[var(--surface-steel-border)] bg-[var(--surface-steel)] px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Access
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Can AI even see you?
        </h2>

        {readiness.report_state === "access_blocked" && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-rose-700">
              Access blocked
            </p>
            <p className="mt-3 text-[16px] font-semibold leading-relaxed text-rose-900">
              {data.domain} is up for humans, but AI crawlers are being blocked. The answers above
              show what that costs.
            </p>
          </div>
        )}

        {/* Crawler permissions */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
          {crawlers.available ? (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <p className="text-[18px] font-bold tracking-tight text-gray-900">
                  {crawlers.summary.allowed != null && crawlers.summary.total != null
                    ? `${crawlers.summary.allowed} of ${crawlers.summary.total} AI crawlers allowed`
                    : "Crawler permissions not measured"}
                </p>
                <p className="font-mono text-[12px] tabular-nums text-gray-500">
                  {crawlers.sub_score.label}:{" "}
                  {crawlers.sub_score.value != null && crawlers.sub_score.max != null
                    ? `${crawlers.sub_score.value} of ${crawlers.sub_score.max}`
                    : "not measured"}
                </p>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                This is a robots.txt permission parse of your homepage path, not a live fetch per
                bot.{" "}
                {crawlers.robots.present
                  ? "A robots.txt file was found."
                  : "No robots.txt file was found at the site root."}
              </p>

              {blocked.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {blocked.map((bot) => (
                    <li
                      key={`${bot.platform}-${bot.label}`}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" aria-hidden="true" />
                        <span className="text-[14px] font-semibold text-gray-900">{bot.label}</span>
                        <span className="text-[13px] text-gray-500">{bot.platform}</span>
                        <span className="font-mono text-[10px] uppercase tracking-wide text-gray-400">
                          {bot.bot_type}
                        </span>
                      </div>
                      <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-gray-600">
                        {bot.rule
                          ? `Blocked by: ${bot.rule}`
                          : "Blocked, matching rule not captured"}
                        {bot.line != null ? ` (robots.txt line ${bot.line})` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : crawlers.summary.blocked === 0 ? (
                <p className="mt-5 rounded-xl border border-accent-200 bg-accent-50 p-4 text-[13px] leading-relaxed text-accent-900">
                  No crawler in the registry is blocked by your robots.txt.
                </p>
              ) : (
                /* An empty list plus an unmeasured count is not a clean bill of
                   health, so it must not read as one. */
                <p className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-[13px] leading-relaxed text-gray-600">
                  The per-bot breakdown is not available for this scan.
                </p>
              )}

              {crawlers.ai_impact === "not_proven" && (
                <p className="mt-5 border-t border-gray-100 pt-4 text-[12px] leading-relaxed text-gray-500">
                  A blocked crawler is a measured fact; its effect on AI citations is not proven.
                </p>
              )}
            </>
          ) : (
            <p className="text-[14px] leading-relaxed text-gray-600">
              The crawler permission check did not complete for this scan. Nothing is counted
              against the site here, and no conclusion should be drawn either way.
            </p>
          )}
        </div>

        {/* llms.txt */}
        <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            llms.txt
          </p>
          {llmstxt.available ? (
            <>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <dt className="font-mono text-[11px] uppercase tracking-wide text-gray-400">
                    Spec validity
                  </dt>
                  <dd className="mt-1 text-[15px] font-semibold text-gray-900">
                    {validityText(llmstxt.validity)}
                  </dd>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <dt className="font-mono text-[11px] uppercase tracking-wide text-gray-400">
                    Quality score
                  </dt>
                  <dd className="mt-1 text-[15px] font-semibold tabular-nums text-gray-900">
                    {llmstxt.score != null
                      ? `${llmstxt.score} of 100${llmstxt.grade ? ` (grade ${llmstxt.grade})` : ""}`
                      : "N/A (no llms.txt found)"}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-[12px] leading-relaxed text-gray-500">
                Validity and quality are two independent verdicts. A file can be spec valid and
                still thin, or well written and out of spec.
              </p>

              {llmstxt.links_summary && (
                <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
                  Links in the file: {llmstxt.links_summary.ok} of {llmstxt.links_summary.total}{" "}
                  resolved, {llmstxt.links_summary.dead} dead,{" "}
                  {llmstxt.links_summary.unverified} unverified.
                </p>
              )}

              {llmstxt.issues.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {llmstxt.issues.slice(0, 3).map((issue, i) => (
                    <li
                      key={`${i}-${issue.title}`}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severityChip(issue.severity)}`}
                        >
                          {issue.severity}
                        </span>
                        <span className="text-[14px] font-semibold text-gray-900">
                          {issue.title}
                        </span>
                      </div>
                      {issue.fix && (
                        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
                          {issue.fix}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {llmstxt.ai_impact === "not_proven" && (
                <p className="mt-5 border-t border-gray-100 pt-4 text-[12px] leading-relaxed text-gray-500">
                  An llms.txt file is a measured fact; its effect on AI citations is not proven.
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-[14px] leading-relaxed text-gray-600">
              The llms.txt check did not complete for this scan. Nothing is counted against the
              site here; it is not evidence that the file is missing.
            </p>
          )}
        </div>

        {/* Honesty tail */}
        {failing.length > 0 && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Measurements that did not complete
            </p>
            <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-gray-600">
              {failing.map(({ key, bucket }) => (
                <li key={key} className="flex gap-2">
                  <span aria-hidden="true">·</span>
                  <span>
                    {ENGINE_META[key].name}: {bucket?.failed_calls} of {bucket?.dispatched_calls}{" "}
                    calls did not come back. Those are excluded, not counted against you.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-[12px] leading-relaxed text-gray-500">
          Data captured {captured} ({meta.market}). AI answers vary over time.
        </p>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-gray-400">
          {meta.engine_version}
          {readiness.engine ? ` · readiness ${readiness.engine}` : ""}
        </p>
      </div>
    </section>
  )
}

export function ScanCta() {
  return (
    <section className="relative overflow-hidden bg-gray-950 px-6 py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          See this for your own site
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-gray-300">
          Same engines, same prompts, same refusal to dress a gap in the data up as a score. Run it
          yourself, or have us run it and walk you through what to fix first.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={siteConfig.appUrl}
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-gray-950 transition-colors hover:bg-gray-100"
          >
            Run a scan
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/services/ai-seo-agency"
            className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/5"
          >
            Book an AI visibility audit
          </Link>
        </div>
        <p className="mt-4 font-mono text-[11px] text-gray-500">
          See your own AI visibility · 7-day free trial, cancel anytime
        </p>
      </div>
    </section>
  )
}
