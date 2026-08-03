import { EngineMark } from "@/components/landing/engine-marks"
import {
  cellState,
  competitorHosts,
  indexResults,
  pullQuotes,
  safeUrl,
  strengths,
  urlHost,
  weaknesses,
  CELL_TEXT,
  ENGINE_META,
  ENGINE_ORDER,
  type CellState,
  type LgsCheck,
  type LgsCheckState,
  type LgsEngineKey,
  type LgsPublicV1,
} from "@/lib/lgs-public"

/**
 * Section 2: what the readiness engine found, prompt by prompt, plus the hosts
 * that were cited instead. The grid distinguishes "we asked and you were not
 * there" from "we could not ask", which is the whole point of contract rule 4.
 */

const DOT: Record<CellState, string> = {
  hit: "bg-accent-500",
  miss: "bg-rose-400",
  degraded: "bg-amber-400",
  no_aio: "bg-gray-300",
  unmeasured: "bg-gray-300",
}

const CELL_TEXT_TONE: Record<CellState, string> = {
  hit: "text-accent-800",
  miss: "text-rose-700",
  degraded: "text-amber-800",
  no_aio: "text-gray-500",
  unmeasured: "text-gray-400",
}

/* Closed map over all seven check states, with a fallback for anything the
   engine adds later. `blocked` reads as a failure, because it is one. */
const CHECK_DOT: Record<LgsCheckState, string> = {
  pass: "bg-accent-500",
  warn: "bg-amber-400",
  fail: "bg-rose-400",
  blocked: "bg-rose-500",
  info: "bg-gray-300",
  not_applicable: "bg-gray-300",
  unverifiable: "bg-gray-300",
}

function CheckItem({ check, showFix }: { check: LgsCheck; showFix: boolean }) {
  const dot = CHECK_DOT[check.state] ?? "bg-gray-300"
  return (
    <li className="flex gap-3">
      <span className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-gray-900">
          {check.label}
          {check.state === "blocked" && (
            <span className="ml-2 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 align-middle font-mono text-[10px] font-semibold uppercase tracking-wide text-rose-700">
              blocked
            </span>
          )}
        </p>
        {check.evidence && (
          <p className="mt-0.5 text-[13px] leading-relaxed text-gray-600">{check.evidence}</p>
        )}
        {showFix && check.fix && (
          <p className="mt-1 text-[13px] leading-relaxed text-gray-700">
            <span className="font-semibold">Do this:</span> {check.fix}
          </p>
        )}
      </div>
    </li>
  )
}

export function WinLose({ data }: { data: LgsPublicV1 }) {
  const { readiness, prompts, results, engines } = data
  const wins = readiness.available ? strengths(readiness.checks) : []
  const losses = readiness.available ? weaknesses(readiness.checks) : []
  /* A degraded readiness run still returns checks. Saying so beats letting a
     partial list read as a complete one. */
  const lowConfidence =
    readiness.available &&
    (readiness.report_state === "low_confidence" ||
      (readiness.coverage_ratio != null && readiness.coverage_ratio < 0.6))
  const byKey = indexResults(results, prompts)
  const rivals = competitorHosts(engines, data.domain)
  const quotes = pullQuotes(results)

  return (
    <section className="bg-white px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Where you win, where you lose
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          What the engines found on {data.domain}
        </h2>

        {readiness.available ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                Where you win
              </p>
              {wins.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {wins.map((c) => (
                    <CheckItem key={c.id} check={c} showFix={false} />
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-[13px] leading-relaxed text-gray-600">
                  No readiness check passed cleanly on this scan, so there is nothing to
                  highlight here yet.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-rose-700">
                Where you lose
              </p>
              {losses.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {losses.map((c) => (
                    <CheckItem key={c.id} check={c} showFix={true} />
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-[13px] leading-relaxed text-gray-600">
                  No major weaknesses found in the readiness checks.
                </p>
              )}
            </div>
          </div>
        ) : null}

        {lowConfidence && (
          <p className="mt-3 text-[12px] leading-relaxed text-gray-500">
            The readiness scan could only verify part of this site, so treat the two lists above as
            partial rather than exhaustive.
          </p>
        )}

        {!readiness.available && (
          <p className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6 text-[14px] leading-relaxed text-gray-600">
            The site readiness check did not complete for this scan, so there is no strengths and
            weaknesses breakdown. Nothing here is counted against the site. The engine results
            below were measured separately and stand on their own.
          </p>
        )}

        {/* Prompt by prompt */}
        {prompts.length > 0 && (
          <div className="mt-10">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Prompt by prompt
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th
                      scope="col"
                      className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400"
                    >
                      Prompt
                    </th>
                    {ENGINE_ORDER.map((key) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <EngineMark
                            engine={ENGINE_META[key].mark}
                            className="h-3.5 w-3.5 text-gray-400"
                          />
                          {ENGINE_META[key].name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prompts.map((prompt, i) => (
                    <tr key={`${i}-${prompt}`} className="border-b border-gray-100 last:border-b-0">
                      <td className="max-w-[280px] px-4 py-3 align-top text-[13px] leading-relaxed text-gray-800">
                        {prompt}
                      </td>
                      {ENGINE_ORDER.map((key) => {
                        const state = cellState(byKey.get(`${key}#${i}`), key)
                        return (
                          <td key={key} className="px-4 py-3 align-top">
                            <span className="inline-flex items-start gap-2">
                              <span
                                className={`mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full ${DOT[state]}`}
                                aria-hidden="true"
                              />
                              <span className={`text-[13px] leading-relaxed ${CELL_TEXT_TONE[state]}`}>
                                {CELL_TEXT[state]}
                              </span>
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-gray-500">
              A cell reading &ldquo;couldn&rsquo;t measure&rdquo; means the call to that engine did
              not come back. It is not evidence that you were absent.
            </p>
          </div>
        )}

        {/* Cited instead */}
        {rivals.length > 0 && (
          <div className="mt-10">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              Who the engines cited instead
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-gray-600">
              Hosts named in the answers to your prompts, with your own domain removed.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {rivals.map((host) => (
                <li
                  key={host}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-[12px] text-gray-700"
                >
                  {host}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Verbatim */}
        {quotes.length > 0 && (
          <div className="mt-10">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              In the AI&rsquo;s own words
            </p>
            <div className="mt-4 space-y-4">
              {quotes.map((row) => {
                const meta = ENGINE_META[row.engine as LgsEngineKey]
                /* Nothing becomes an href until safeUrl has parsed it. */
                const seenHref = new Set<string>()
                const citations: { href: string; label: string }[] = []
                for (const raw of row.citations) {
                  const href = safeUrl(raw)
                  const label = urlHost(raw)
                  if (!href || !label || seenHref.has(href) || citations.length >= 5) continue
                  seenHref.add(href)
                  citations.push({ href, label })
                }
                return (
                  <figure
                    key={row.key}
                    className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 pl-7"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-[3px] bg-accent-600"
                    />
                    <blockquote className="text-[15px] italic leading-relaxed text-gray-800">
                      {row.excerpt}
                    </blockquote>
                    <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-gray-500">
                      — {meta ? meta.name : row.engine}, answering &ldquo;{row.prompt}&rdquo;
                    </figcaption>
                    {citations.length > 0 && (
                      <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-gray-500">
                        <span className="font-mono uppercase tracking-wide text-gray-400">
                          Cited
                        </span>
                        {citations.map((c) => (
                          <a
                            key={c.href}
                            href={c.href}
                            rel="nofollow noopener noreferrer"
                            target="_blank"
                            className="text-accent-700 underline-offset-4 hover:underline"
                          >
                            {c.label}
                          </a>
                        ))}
                      </p>
                    )}
                  </figure>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
