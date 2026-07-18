"use client"

import { useState } from "react"
import type { GenerateResult } from "@/lib/llms-txt-generate"
import { trackEvent } from "@/lib/analytics"

/**
 * Crawl-based llms.txt generator. Give it a domain and it builds the file for
 * you — the manual form lives on the checker page for people who'd rather
 * hand-curate.
 */

type Tab = "file" | "pages"

function download(name: string, content: string, type = "text/plain;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement("a")
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    URL.revokeObjectURL(url)
    a.remove()
  }, 0)
}

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200 disabled:bg-gray-50 disabled:text-gray-400"

export function LlmsTxtGeneratorWidget() {
  const [input, setInput] = useState("")
  const [full, setFull] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResult | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("file")
  const [copied, setCopied] = useState(false)

  async function run(e?: React.FormEvent) {
    e?.preventDefault()
    if (!input.trim() || loading) return
    setLoading(true)
    setErr(null)
    setResult(null)
    setTab("file")
    try {
      const res = await fetch("/tools/llms-txt-generator/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input.trim(), includeFullText: full }),
      })
      const data: GenerateResult = await res.json()
      if (!data.ok) setErr(data.error ?? "Couldn't generate a file for that site.")
      else trackEvent("free_tool_used", { tool: "llms_txt_generator" })
      setResult(data)
    } catch {
      setErr("Network error — the request didn't complete.")
    } finally {
      setLoading(false)
    }
  }

  function copyOut() {
    if (!result) return
    navigator.clipboard
      ?.writeText(result.llmsTxt)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      })
      .catch(() => setErr("Couldn't copy — use the download instead."))
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <form onSubmit={run} className="flex flex-col gap-3" aria-busy={loading}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="llms-domain" className="sr-only">
            Your domain
          </label>
          <input
            id="llms-domain"
            type="text"
            inputMode="url"
            className={inputCls}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="example.com"
            autoComplete="url"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-lg bg-accent-600 px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate llms.txt"}
          </button>
        </div>

        <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-gray-600">
          <input
            type="checkbox"
            checked={full}
            onChange={(e) => setFull(e.target.checked)}
            disabled={loading}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
          />
          <span>
            Also build <code className="rounded bg-gray-100 px-1 text-gray-700">llms-full.txt</code> with page text.
            Heavier, so it covers fewer pages.
          </span>
        </label>

        <p className="text-[12.5px] leading-relaxed text-gray-500">
          We read your sitemap, respect your robots.txt, and fetch up to 50 pages for titles and descriptions. Free, no
          sign-up.
        </p>
      </form>

      <p className="sr-only" role="status" aria-live="polite">
        {loading
          ? "Generating your llms.txt, this can take up to a minute."
          : result?.ok
            ? `Generated an llms.txt indexing ${result.pages.length} pages.`
            : ""}
      </p>

      {err && (
        <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] leading-relaxed text-red-800">
          {err}
        </div>
      )}

      {loading && (
        <p className="mt-5 text-[13px] leading-relaxed text-gray-500">
          Reading your sitemap and fetching pages. A large site can take up to a minute.
        </p>
      )}

      {result?.ok && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Pages indexed", value: result.pages.length.toLocaleString() },
              { label: "Pages found", value: result.totalDiscovered.toLocaleString() },
              { label: "Found via", value: result.discovery === "sitemap" ? "sitemap" : "homepage links" },
              { label: "Took", value: `${(result.elapsedMs / 1000).toFixed(1)}s` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <div className="font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">{s.label}</div>
                <div className="mt-1 text-[18px] font-bold tracking-tight text-gray-900">{s.value}</div>
              </div>
            ))}
          </div>

          {result.warnings.length > 0 && (
            <ul className="mt-4 space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              {result.warnings.map((w, i) => (
                <li key={i} className="text-[13px] leading-relaxed text-amber-900">
                  {w}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex gap-1 border-b border-gray-200" role="tablist" aria-label="Generated output">
            {(
              [
                ["file", "The file"],
                ["pages", `Pages (${result.pages.length})`],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                id={`gen-tab-${id}`}
                role="tab"
                aria-selected={tab === id}
                aria-controls={`gen-panel-${id}`}
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
                className={`-mb-px border-b-2 px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  tab === id ? "border-accent-600 text-accent-700" : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "file" && (
            <div id="gen-panel-file" role="tabpanel" aria-labelledby="gen-tab-file">
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={copyOut} className="rounded-lg border border-gray-300 px-3.5 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400">
                  {copied ? "Copied" : "Copy"}
                </button>
                <button type="button" onClick={() => download("llms.txt", result.llmsTxt)} className="rounded-lg bg-accent-600 px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-accent-500">
                  Download llms.txt
                </button>
                {result.llmsFullTxt && (
                  <button type="button" onClick={() => download("llms-full.txt", result.llmsFullTxt!)} className="rounded-lg border border-gray-300 px-3.5 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:border-gray-400">
                    Download llms-full.txt
                  </button>
                )}
              </div>

              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-950 p-5">
                <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-gray-200">
                  {result.llmsTxt}
                </pre>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-gray-500">
                Save this as <code className="rounded bg-gray-100 px-1 text-gray-600">llms.txt</code> at your site root
                (<code className="rounded bg-gray-100 px-1 text-gray-600">/llms.txt</code>). Edit it down first — a
                shorter, sharper index beats a complete one.
              </p>
            </div>
          )}

          {tab === "pages" && (
            <div id="gen-panel-pages" role="tabpanel" aria-labelledby="gen-tab-pages" className="mt-4 overflow-hidden rounded-xl border border-gray-200">
              <ul className="max-h-[32rem] divide-y divide-gray-100 overflow-auto">
                {result.pages.map((p) => (
                  <li key={p.url} className="px-4 py-2.5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">{p.section}</span>
                      <span className="text-[13.5px] font-semibold text-gray-900">{p.title}</span>
                    </div>
                    <a href={p.url} target="_blank" rel="noopener noreferrer nofollow" className="break-all font-mono text-[11.5px] text-gray-500 hover:text-accent-700 hover:underline">
                      {p.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
