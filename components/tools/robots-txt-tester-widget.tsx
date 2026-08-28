"use client"

import { useState } from "react"
import type { LintFinding } from "@/lib/robots-generate"
import { trackEvent } from "@/lib/analytics"

/**
 * robots.txt tester. Google retired the Search Console tester and the demand
 * didn't move, so this replicates the job: fetch (or paste) a robots.txt, test
 * URLs against it per user-agent, and show WHICH rule decided each verdict.
 */

interface Verdict {
  url: string
  agent: string
  allowed: boolean
  rule?: { type: "allow" | "disallow"; path: string }
}

interface Effective {
  agent: string
  matchedAgents: string[]
  ruleCount: number
  crawlDelay?: number
}

interface Result {
  ok: boolean
  source: "fetched" | "pasted"
  origin?: string
  exists: boolean
  content: string
  sitemaps: string[]
  effective?: Effective[]
  findings: LintFinding[]
  verdicts: Verdict[]
  error?: string
}

const AGENT_CHOICES = [
  "Googlebot",
  "Googlebot-News",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "*",
]

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:bg-gray-50 disabled:text-gray-400"

export function RobotsTxtTesterWidget() {
  const [site, setSite] = useState("")
  const [pasteMode, setPasteMode] = useState(false)
  const [content, setContent] = useState("")
  const [urls, setUrls] = useState("/\n/wp-admin/\n/search?q=test")
  const [agents, setAgents] = useState<string[]>(["Googlebot", "GPTBot"])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [err, setErr] = useState<string | null>(null)

  function toggleAgent(a: string) {
    setAgents((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  async function run(e?: React.FormEvent) {
    e?.preventDefault()
    if (loading) return
    if (!pasteMode && !site.trim()) return
    if (pasteMode && !content.trim()) return
    setLoading(true)
    setErr(null)
    setResult(null)
    try {
      const res = await fetch("/tools/robots-txt-tester/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: site.trim() || undefined,
          content: pasteMode ? content : undefined,
          urls: urls.split(/\r?\n/).map((u) => u.trim()).filter(Boolean),
          agents: agents.length > 0 ? agents : ["Googlebot"],
        }),
      })
      const data: Result = await res.json()
      if (!data.ok) setErr(data.error ?? "Couldn't check that robots.txt.")
      else trackEvent("free_tool_used", { tool: "robots_txt_tester" })
      setResult(data)
    } catch {
      setErr("Network error — the request didn't complete.")
    } finally {
      setLoading(false)
    }
  }

  const byUrl = new Map<string, Verdict[]>()
  for (const v of result?.verdicts ?? []) {
    const arr = byUrl.get(v.url) ?? []
    arr.push(v)
    byUrl.set(v.url, arr)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <form onSubmit={run} className="space-y-4" aria-busy={loading}>
        {!pasteMode ? (
          <div>
            <label htmlFor="robots-site" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
              Site
            </label>
            <input
              id="robots-site"
              type="text"
              inputMode="url"
              className={inputCls}
              value={site}
              onChange={(e) => setSite(e.target.value)}
              disabled={loading}
              placeholder="example.com"
              autoComplete="url"
              spellCheck={false}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="robots-content" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
              robots.txt content
            </label>
            <textarea
              id="robots-content"
              className={`${inputCls} min-h-[9rem] font-mono text-[12.5px]`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              placeholder={"User-agent: *\nDisallow: /wp-admin/"}
              spellCheck={false}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="robots-urls" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
              URLs to test (one per line)
            </label>
            <textarea
              id="robots-urls"
              className={`${inputCls} min-h-[7rem] font-mono text-[12.5px]`}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              disabled={loading}
              spellCheck={false}
            />
            <p className="mt-1 text-[12px] text-gray-500">Paths or full URLs both work.</p>
          </div>
          <div>
            <span className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
              Crawlers
            </span>
            <div className="flex flex-wrap gap-1.5">
              {AGENT_CHOICES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAgent(a)}
                  aria-pressed={agents.includes(a)}
                  className={`rounded-full border px-2.5 py-1 font-mono text-[11.5px] transition-colors ${
                    agents.includes(a)
                      ? "border-accent-500 bg-accent-50 text-accent-800"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading || (pasteMode ? !content.trim() : !site.trim())}
            className="rounded-lg bg-accent-600 px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Checking…" : "Test robots.txt"}
          </button>
          <button
            type="button"
            onClick={() => setPasteMode((p) => !p)}
            className="text-[13px] font-medium text-accent-700 underline-offset-2 hover:underline"
          >
            {pasteMode ? "Fetch from a domain instead" : "Or paste a robots.txt"}
          </button>
        </div>
      </form>

      <p className="sr-only" role="status" aria-live="polite">
        {loading ? "Testing robots.txt." : result?.ok ? `Tested ${result.verdicts.length} URL and crawler combinations.` : ""}
      </p>

      {err && (
        <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] leading-relaxed text-red-800">
          {err}
        </div>
      )}

      {result?.ok && (
        <div className="mt-6 space-y-5">
          {!result.exists && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-[14px] leading-relaxed text-gray-700">
              No robots.txt at <span className="font-mono">{result.origin}</span> — which is valid. Crawlers treat a
              missing file as permission to crawl everything.
            </div>
          )}

          {/* Verdicts — the reason people come here */}
          {byUrl.size > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full border-collapse text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border-b border-gray-200 px-3 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">URL</th>
                    <th className="border-b border-gray-200 px-3 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">Crawler</th>
                    <th className="border-b border-gray-200 px-3 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">Verdict</th>
                    <th className="hidden border-b border-gray-200 px-3 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500 sm:table-cell">Matched rule</th>
                  </tr>
                </thead>
                <tbody>
                  {[...byUrl.entries()].flatMap(([url, vs]) =>
                    vs.map((v, i) => (
                      <tr key={`${url}-${v.agent}`} className="odd:bg-white even:bg-gray-50/50">
                        <td className="border-b border-gray-100 px-3 py-1.5">
                          {i === 0 && <span className="break-all font-mono text-[12.5px] text-gray-700">{url}</span>}
                        </td>
                        <td className="whitespace-nowrap border-b border-gray-100 px-3 py-1.5 font-mono text-[12px] text-gray-600">{v.agent}</td>
                        <td className={`whitespace-nowrap border-b border-gray-100 px-3 py-1.5 text-[12.5px] font-semibold ${v.allowed ? "text-emerald-700" : "text-red-700"}`}>
                          {v.allowed ? "Allowed" : "Blocked"}
                        </td>
                        <td className="hidden border-b border-gray-100 px-3 py-1.5 font-mono text-[11.5px] text-gray-500 sm:table-cell">
                          {v.rule ? `${v.rule.type}: ${v.rule.path}` : "no rule matched"}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Which group applies — the most misunderstood part of the format */}
          {result.effective && result.effective.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">Which rules apply</p>
              <ul className="mt-2 space-y-1">
                {result.effective.map((e) => (
                  <li key={e.agent} className="text-[13px] leading-relaxed text-gray-700">
                    <span className="font-mono text-gray-900">{e.agent}</span>{" "}
                    {e.matchedAgents.length > 0 ? (
                      <>
                        follows the <span className="font-mono">{e.matchedAgents.join(", ")}</span> group ({e.ruleCount} rule
                        {e.ruleCount === 1 ? "" : "s"})
                        {e.crawlDelay !== undefined && <>, crawl-delay {e.crawlDelay}s</>}
                      </>
                    ) : (
                      <>has no matching group, so everything is allowed</>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[12.5px] leading-relaxed text-gray-500">
                A named group <strong>replaces</strong> the <code className="rounded bg-gray-200 px-1">*</code>{" "}group for
                that crawler — the rules aren&apos;t combined. That&apos;s the mistake we see most often.
              </p>
            </div>
          )}

          {/* Lint findings */}
          {result.findings.length > 0 && (
            <ul className="space-y-2">
              {result.findings.map((f, i) => (
                <li key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] font-bold uppercase tracking-widest ${
                        f.severity === "error"
                          ? "bg-red-100 text-red-700"
                          : f.severity === "warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {f.severity}
                    </span>
                    <span className="text-[14px] font-bold tracking-tight text-gray-900">{f.title}</span>
                    {f.line !== undefined && <span className="font-mono text-[12px] text-gray-500">line {f.line}</span>}
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-700">{f.detail}</p>
                </li>
              ))}
            </ul>
          )}

          {result.sitemaps.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-[13px] leading-relaxed text-gray-700">
              <span className="font-semibold text-gray-900">Sitemaps declared: </span>
              {result.sitemaps.map((s, i) => (
                <span key={s} className="break-all font-mono">
                  {i > 0 && ", "}
                  {s}
                </span>
              ))}
            </div>
          )}

          {result.content && (
            <details className="rounded-xl border border-gray-200 bg-white p-4">
              <summary className="cursor-pointer text-[13px] font-semibold text-gray-800">
                The file we tested ({result.content.length.toLocaleString()} bytes)
              </summary>
              <pre className="mt-3 max-h-[24rem] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-950 p-4 font-mono text-[12px] leading-relaxed text-gray-200">
                {result.content}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
