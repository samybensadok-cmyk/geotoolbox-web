"use client"

import { useDeferredValue, useMemo, useRef, useState } from "react"
import type { ExtractResult } from "@/lib/sitemap-extract"
import type { AuditResult } from "@/lib/sitemap-audit"
import { trackEvent } from "@/lib/analytics"

/**
 * Sitemap URL extractor + auditor. Paste a sitemap URL, a bare domain, or the
 * file itself; get every page URL out, plus what's wrong with the sitemap and
 * whether the URLs still resolve.
 */

type Sort = "sitemap" | "alpha" | "lastmod"
type Tab = "urls" | "issues" | "structure"

interface Payload extends ExtractResult {
  audit: AuditResult | null
}

interface UrlStatus {
  url: string
  status: number | null
  redirectedTo?: string
  hops: number
  error?: string
  ms: number
}

const STATUS_BATCH = 50

function toCsv(rows: ExtractResult["urls"], statuses: Map<string, UrlStatus>): string {
  const esc = (v: string | number | undefined) => {
    const s = v === undefined ? "" : String(v)
    // RFC 4180: quote when the value contains a comma, quote, or newline.
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const anyStatus = statuses.size > 0
  const head = ["url", "lastmod", "changefreq", "priority", "source_sitemap"]
  if (anyStatus) head.push("http_status", "redirected_to")
  const body = rows.map((r) => {
    const cells: (string | number | undefined)[] = [r.loc, r.lastmod, r.changefreq, r.priority, r.source]
    if (anyStatus) {
      const s = statuses.get(r.loc)
      cells.push(s?.status ?? s?.error ?? "", s?.redirectedTo ?? "")
    }
    return cells.map(esc).join(",")
  })
  return [head.join(","), ...body].join("\n")
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement("a")
  a.href = url
  a.download = name
  // Append before clicking and revoke on the next tick: the click-to-download
  // handoff is async, and revoking immediately can cancel the download outright
  // (Firefox in particular).
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    URL.revokeObjectURL(url)
    a.remove()
  }, 0)
}

function hostOf(u: string): string {
  try {
    return new URL(u).hostname.replace(/^www\./, "")
  } catch {
    return "sitemap"
  }
}

function statusTone(s: UrlStatus | undefined): string {
  if (!s) return "text-gray-400"
  if (s.status === null) return "text-red-600"
  if (s.status >= 200 && s.status < 300) return "text-emerald-600"
  if (s.status >= 300 && s.status < 400) return "text-amber-600"
  return "text-red-600"
}

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:bg-gray-50 disabled:text-gray-400"

export function SitemapExtractorWidget() {
  const [input, setInput] = useState("")
  const [pasteMode, setPasteMode] = useState(false)
  const [xml, setXml] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Payload | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("urls")
  const [include, setInclude] = useState("")
  const [exclude, setExclude] = useState("")
  const [sort, setSort] = useState<Sort>("sitemap")
  const [copied, setCopied] = useState(false)
  const [statuses, setStatuses] = useState<Map<string, UrlStatus>>(new Map())
  const [checking, setChecking] = useState(false)
  // Separate from `err`: a failed status batch must not render in the extraction
  // error panel, which sits above the results and offers "paste the file instead".
  const [statusErr, setStatusErr] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function run(e?: React.FormEvent) {
    e?.preventDefault()
    if (loading) return
    if (pasteMode ? !xml.trim() : !input.trim()) return
    setLoading(true)
    setErr(null)
    setResult(null)
    setInclude("")
    setExclude("")
    setStatuses(new Map())
    setTab("urls")
    try {
      const res = await fetch("/tools/sitemap-extractor/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pasteMode ? { xml, url: input.trim() } : { url: input.trim() }),
      })
      const data: Payload = await res.json()
      if (!data.ok) setErr(data.error ?? "Couldn't read that sitemap.")
      else trackEvent("free_tool_used", { tool: "sitemap_extractor" })
      setResult(data)
    } catch {
      setErr("Network error — the request didn't complete.")
    } finally {
      setLoading(false)
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    // Reset the input value so re-picking the SAME file fires onChange again —
    // the likely case is the user edited it and wants to retry.
    e.target.value = ""
    if (!f) return
    if (f.size > 4 * 1024 * 1024) {
      setErr("That file is larger than the 4MB paste limit. Use the URL field so we can fetch and stream it instead.")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setXml(String(reader.result ?? ""))
      setPasteMode(true)
      if (!input.trim()) setInput(f.name)
    }
    reader.readAsText(f)
  }

  const deferredInclude = useDeferredValue(include)
  const deferredExclude = useDeferredValue(exclude)

  const rows = useMemo(() => {
    if (!result?.urls) return []
    const inc = deferredInclude.trim().toLowerCase()
    const exc = deferredExclude.trim().toLowerCase()
    let out = result.urls
    if (inc) out = out.filter((u) => u.loc.toLowerCase().includes(inc))
    if (exc) out = out.filter((u) => !u.loc.toLowerCase().includes(exc))
    out = [...out]
    if (sort === "alpha") out.sort((a, b) => a.loc.localeCompare(b.loc))
    if (sort === "lastmod") out.sort((a, b) => (b.lastmod ?? "").localeCompare(a.lastmod ?? ""))
    return out
  }, [result, deferredInclude, deferredExclude, sort])

  const unchecked = useMemo(() => rows.filter((r) => !statuses.has(r.loc)), [rows, statuses])

  async function checkStatuses() {
    if (checking || unchecked.length === 0) return
    setChecking(true)
    setStatusErr(null)
    try {
      const batch = unchecked.slice(0, STATUS_BATCH).map((r) => r.loc)
      const res = await fetch("/tools/sitemap-extractor/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: batch }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatuses((prev) => {
          const next = new Map(prev)
          for (const s of data.results as UrlStatus[]) next.set(s.url, s)
          return next
        })
      } else {
        setStatusErr(data.error ?? "Status check failed.")
      }
    } catch {
      setStatusErr("Status check didn't complete.")
    } finally {
      setChecking(false)
    }
  }

  function copyUrls() {
    navigator.clipboard
      ?.writeText(rows.map((r) => r.loc).join("\n"))
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      })
      .catch(() => setStatusErr("Couldn't copy to the clipboard — use a download instead."))
  }

  const stem = result ? hostOf(result.resolvedFrom) : "sitemap"
  const audit = result?.audit
  const errorCount = audit?.issues.filter((i) => i.severity === "error").length ?? 0
  const filtered = Boolean(deferredInclude.trim() || deferredExclude.trim())

  const statusSummary = useMemo(() => {
    const vals = [...statuses.values()]
    return {
      ok: vals.filter((v) => v.status !== null && v.status >= 200 && v.status < 300).length,
      redirect: vals.filter((v) => v.status !== null && v.status >= 300 && v.status < 400).length,
      broken: vals.filter((v) => v.status === null || v.status >= 400).length,
    }
  }, [statuses])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <form onSubmit={run} className="flex flex-col gap-3" aria-busy={loading}>
        {!pasteMode ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="sitemap-input" className="sr-only">
              Sitemap URL or domain
            </label>
            <input
              id="sitemap-input"
              type="text"
              inputMode="url"
              className={inputCls}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="example.com  or  https://example.com/sitemap_index.xml"
              autoComplete="url"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-lg bg-accent-600 px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Extracting…" : "Extract URLs"}
            </button>
          </div>
        ) : (
          <>
            <label htmlFor="sitemap-xml" className="sr-only">
              Sitemap XML content
            </label>
            <textarea
              id="sitemap-xml"
              className={`${inputCls} min-h-[9rem] font-mono text-[12.5px]`}
              value={xml}
              onChange={(e) => setXml(e.target.value)}
              disabled={loading}
              placeholder="Paste the contents of your sitemap.xml here…"
              spellCheck={false}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={loading || !xml.trim()}
                className="rounded-lg bg-accent-600 px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Parsing…" : "Parse sitemap"}
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400"
              >
                Upload a file
              </button>
              <input ref={fileRef} type="file" accept=".xml,.txt,text/xml,text/plain" onChange={onFile} className="hidden" />
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] leading-relaxed text-gray-500">
          {!pasteMode ? (
            <>
              <span>
                Bare domain works — we read robots.txt, then probe the common paths (including{" "}
                <code className="rounded bg-gray-100 px-1 text-gray-600">wp-sitemap.xml</code>). Index files are
                walked and <code className="rounded bg-gray-100 px-1 text-gray-600">.xml.gz</code> is decompressed.
              </span>
              <button
                type="button"
                onClick={() => setPasteMode(true)}
                className="font-medium text-accent-700 underline-offset-2 hover:underline"
              >
                Or paste / upload the file
              </button>
            </>
          ) : (
            <>
              <span>Useful when a site&apos;s bot protection blocks our fetcher.</span>
              <button
                type="button"
                onClick={() => setPasteMode(false)}
                className="font-medium text-accent-700 underline-offset-2 hover:underline"
              >
                Back to fetching by URL
              </button>
            </>
          )}
        </div>
      </form>

      <p className="sr-only" role="status" aria-live="polite">
        {loading
          ? "Extracting URLs, this can take up to a minute on a large sitemap index."
          : result?.ok
            ? `Extracted ${result.urls.length} unique URLs from ${result.sitemaps.length} sitemap files.`
            : ""}
      </p>

      {err && (
        <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] leading-relaxed text-red-800">
          {err}
          {!pasteMode && /blocked our request|403/.test(err) && (
            <>
              {" "}
              <button
                type="button"
                onClick={() => setPasteMode(true)}
                className="font-semibold underline underline-offset-2"
              >
                Paste the file instead
              </button>
              .
            </>
          )}
        </div>
      )}

      {loading && (
        <p className="mt-5 text-[13px] leading-relaxed text-gray-500">
          Walking the sitemap. A large index with many child files can take up to a minute.
        </p>
      )}

      {result && result.ok && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { label: "Unique URLs", value: result.urls.length.toLocaleString() },
              { label: "Entries read", value: result.rawCount.toLocaleString() },
              { label: "Sitemap files", value: String(result.sitemaps.length) },
              {
                label: "Found via",
                value:
                  result.discovery === "robots.txt" ? "robots.txt" : result.discovery === "probed" ? "path probe" : "direct",
              },
              { label: "Health", value: audit ? (audit.complete ? `${audit.score}/100` : `${audit.score}/100*`) : "—" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <div className="font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">{s.label}</div>
                <div className="mt-1 text-[18px] font-bold tracking-tight text-gray-900">{s.value}</div>
              </div>
            ))}
          </div>

          <p className="mt-3 break-all text-[12.5px] text-gray-500">
            Read from <span className="font-mono text-gray-700">{result.resolvedFrom}</span>
          </p>

          {result.warnings.length > 0 && (
            <ul className="mt-4 space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              {result.warnings.map((w, i) => (
                <li key={i} className="text-[13px] leading-relaxed text-amber-900">
                  {w}
                </li>
              ))}
            </ul>
          )}

          {/* Tabs */}
          <div
            className="mt-5 flex gap-1 border-b border-gray-200"
            role="tablist"
            aria-label="Extraction results"
            onKeyDown={(e) => {
              // APG roving-tab pattern: arrows move between tabs, Home/End jump.
              const order: Tab[] = ["urls", "issues", "structure"]
              const i = order.indexOf(tab)
              let next: Tab | null = null
              if (e.key === "ArrowRight") next = order[(i + 1) % order.length]
              else if (e.key === "ArrowLeft") next = order[(i - 1 + order.length) % order.length]
              else if (e.key === "Home") next = order[0]
              else if (e.key === "End") next = order[order.length - 1]
              if (next) {
                e.preventDefault()
                setTab(next)
                document.getElementById(`tab-${next}`)?.focus()
              }
            }}
          >
            {(
              [
                ["urls", `URLs (${rows.length.toLocaleString()})`],
                ["issues", `Issues${audit ? ` (${audit.issues.length})` : ""}`],
                ["structure", `Structure (${result.sitemaps.length})`],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                id={`tab-${id}`}
                role="tab"
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
                className={`-mb-px border-b-2 px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  tab === id
                    ? "border-accent-600 text-accent-700"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
                {id === "issues" && errorCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10.5px] font-bold text-red-700">
                    {errorCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {tab === "urls" && (
            <div id="panel-urls" role="tabpanel" aria-labelledby="tab-urls">
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="f-include" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
                    Include
                  </label>
                  <input id="f-include" className={inputCls} value={include} onChange={(e) => setInclude(e.target.value)} placeholder="/blog/" />
                </div>
                <div>
                  <label htmlFor="f-exclude" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
                    Exclude
                  </label>
                  <input id="f-exclude" className={inputCls} value={exclude} onChange={(e) => setExclude(e.target.value)} placeholder="/tag/" />
                </div>
                <div>
                  <label htmlFor="f-sort" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
                    Sort
                  </label>
                  <select id="f-sort" className={inputCls} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                    <option value="sitemap">Sitemap order</option>
                    <option value="alpha">A → Z</option>
                    <option value="lastmod">Newest lastmod</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" onClick={copyUrls} className="rounded-lg border border-gray-300 px-3.5 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400">
                  {copied ? "Copied" : `Copy ${rows.length.toLocaleString()}`}
                </button>
                <button type="button" onClick={() => download(`${stem}-sitemap-urls.csv`, toCsv(rows, statuses), "text/csv;charset=utf-8")} className="rounded-lg border border-gray-300 px-3.5 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400">
                  CSV
                </button>
                <button type="button" onClick={() => download(`${stem}-sitemap-urls.txt`, rows.map((r) => r.loc).join("\n"), "text/plain;charset=utf-8")} className="rounded-lg border border-gray-300 px-3.5 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400">
                  TXT
                </button>
                <button type="button" onClick={() => download(`${stem}-sitemap-urls.json`, JSON.stringify(rows.map((r) => ({ ...r, status: statuses.get(r.loc)?.status ?? null })), null, 2), "application/json")} className="rounded-lg border border-gray-300 px-3.5 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400">
                  JSON
                </button>
                <button
                  type="button"
                  onClick={checkStatuses}
                  disabled={checking || unchecked.length === 0}
                  className="rounded-lg bg-gray-900 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {checking
                    ? "Checking…"
                    : statuses.size === 0
                      ? `Check status of first ${Math.min(STATUS_BATCH, rows.length)}`
                      : unchecked.length > 0
                        ? `Check next ${Math.min(STATUS_BATCH, unchecked.length)}`
                        : "All checked"}
                </button>
              </div>

              {filtered && (
                <p className="mt-2 text-[12.5px] text-gray-500">
                  Filters are active — exports contain the {rows.length.toLocaleString()} matching URLs, not all{" "}
                  {result.urls.length.toLocaleString()}.
                </p>
              )}

              {statusErr && (
                <p role="alert" className="mt-2 text-[12.5px] font-medium text-red-700">
                  {statusErr}
                </p>
              )}

              {statuses.size > 0 && (
                <div className="mt-3 flex flex-wrap gap-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-[13px]">
                  <span className="font-semibold text-gray-700">{statuses.size.toLocaleString()} checked:</span>
                  <span className="text-emerald-700">{statusSummary.ok} OK</span>
                  <span className="text-amber-700">{statusSummary.redirect} redirect</span>
                  <span className="text-red-700">{statusSummary.broken} broken</span>
                </div>
              )}

              <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
                <div className="max-h-[32rem] overflow-auto">
                  <table className="w-full border-collapse text-left">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th className="border-b border-gray-200 px-3 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">URL</th>
                        <th className="w-16 border-b border-gray-200 px-3 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">Status</th>
                        <th className="hidden border-b border-gray-200 px-3 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500 sm:table-cell">Last modified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 1000).map((r) => {
                        const s = statuses.get(r.loc)
                        return (
                          <tr key={r.loc} className="odd:bg-white even:bg-gray-50/50">
                            <td className="border-b border-gray-100 px-3 py-1.5">
                              <a href={r.loc} target="_blank" rel="noopener noreferrer nofollow" className="break-all font-mono text-[12.5px] text-gray-700 hover:text-accent-700 hover:underline">
                                {r.loc}
                              </a>
                              {s?.redirectedTo && (
                                <div className="break-all font-mono text-[11.5px] text-amber-700">→ {s.redirectedTo}</div>
                              )}
                            </td>
                            <td className={`whitespace-nowrap border-b border-gray-100 px-3 py-1.5 font-mono text-[12px] font-semibold ${statusTone(s)}`}>
                              {s ? (s.status ?? "ERR") : "—"}
                            </td>
                            <td className="hidden whitespace-nowrap border-b border-gray-100 px-3 py-1.5 font-mono text-[12px] text-gray-500 sm:table-cell">
                              {r.lastmod?.slice(0, 10) ?? "—"}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                {rows.length > 1000 && (
                  <p className="border-t border-gray-200 bg-gray-50 px-3 py-2 text-[12.5px] text-gray-600">
                    Showing the first 1,000 of {rows.length.toLocaleString()}. Every one is in the exports.
                  </p>
                )}
                {rows.length === 0 && <p className="px-3 py-6 text-center text-[13px] text-gray-500">No URLs match those filters.</p>}
              </div>
            </div>
          )}

          {tab === "issues" && (
            <div id="panel-issues" role="tabpanel" aria-labelledby="tab-issues" className="mt-5">
              {!audit ? (
                <p className="text-[14px] text-gray-600">The audit didn&apos;t run for this sitemap.</p>
              ) : audit.issues.length === 0 ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-[14px] leading-relaxed text-emerald-900">
                  No issues found. Every URL is on-host, the lastmod values parse, and nothing in the sitemap is blocked by
                  robots.txt.
                </div>
              ) : (
                <ul className="space-y-3">
                  {audit.issues.map((iss) => (
                    <li key={iss.id} className="rounded-xl border border-gray-200 bg-white p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] font-bold uppercase tracking-widest ${
                            iss.severity === "error"
                              ? "bg-red-100 text-red-700"
                              : iss.severity === "warning"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {iss.severity}
                        </span>
                        <span className="text-[14px] font-bold tracking-tight text-gray-900">{iss.title}</span>
                        <span className="text-[12.5px] text-gray-500">{iss.count.toLocaleString()} affected</span>
                      </div>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-gray-700">{iss.detail}</p>
                      {iss.samples.length > 0 && (
                        <ul className="mt-2 space-y-0.5">
                          {iss.samples.map((s, i) => (
                            <li key={i} className="break-all font-mono text-[11.5px] text-gray-500">
                              {s}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {audit && !audit.complete && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-[13px] leading-relaxed text-amber-900">
                  <span className="font-semibold">The score is marked with an asterisk because this audit is incomplete:</span>{" "}
                  {audit.incompleteReasons.join("; ")}. Treat it as a floor, not a verdict — a check that couldn&apos;t run
                  can&apos;t find anything wrong.
                </div>
              )}

              {audit?.robots && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-[13px] leading-relaxed text-gray-700">
                  <span className="font-semibold text-gray-900">robots.txt: </span>
                  {audit.robots.checked ? (
                    <>
                      read, {audit.robots.declaredSitemaps.length} sitemap
                      {audit.robots.declaredSitemaps.length === 1 ? "" : "s"} declared,{" "}
                      {audit.robots.blockedCount.toLocaleString()} of the extracted URLs blocked to Googlebot.
                    </>
                  ) : (
                    audit.robots.error ?? "not checked."
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "structure" && (
            <div id="panel-structure" role="tabpanel" aria-labelledby="tab-structure" className="mt-5 overflow-hidden rounded-xl border border-gray-200">
              <ul className="divide-y divide-gray-100">
                {result.sitemaps.map((s, i) => (
                  <li key={i} className={`flex flex-wrap items-baseline justify-between gap-2 px-4 py-2.5 ${s.kind === "index" ? "bg-gray-50" : ""}`}>
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {s.kind === "index" ? "index" : s.kind === "text" ? "text" : "urls"}
                      </span>
                      <span className={`break-all font-mono text-[12.5px] ${s.kind === "index" ? "text-gray-800" : "text-gray-600"}`}>
                        {s.kind === "index" ? s.url : <>&nbsp;&nbsp;└─ {s.url}</>}
                      </span>
                    </span>
                    <span className={s.error ? "shrink-0 text-[12.5px] font-medium text-red-600" : "shrink-0 text-[12.5px] text-gray-500"}>
                      {s.error ? s.error : `${s.count.toLocaleString()} ${s.kind === "index" ? "children" : "URLs"}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {result && !result.ok && result.sitemaps.length > 0 && (
        <ul className="mt-4 space-y-1.5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          {result.sitemaps.map((s, i) => (
            <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 text-[12.5px]">
              <span className="break-all font-mono text-gray-600">{s.url}</span>
              <span className="shrink-0 font-medium text-red-600">{s.error}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
