"use client"

import { useState } from "react"
import type { GenerateResult } from "@/lib/llms-txt-generate"
import { trackEvent } from "@/lib/analytics"
import { ToolArrow } from "./tool-arrow"

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
  "w-full rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--bg)] px-3 py-2 text-[14px] text-[color:var(--white)] outline-none transition-colors placeholder:text-[color:var(--subtle)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--focus-ring)] disabled:bg-[color:var(--surface-2)] disabled:text-[color:var(--subtle)]"

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
    <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
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
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[3px] bg-[color:var(--accent)] px-6 py-2.5 text-[14px] font-semibold text-[color:var(--accent-ink)] transition-colors hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating…" : <>Generate llms.txt<ToolArrow /></>}
          </button>
        </div>

        <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[color:var(--muted)]">
          <input
            type="checkbox"
            checked={full}
            onChange={(e) => setFull(e.target.checked)}
            disabled={loading}
            className="mt-0.5 h-4 w-4 rounded border-[color:var(--line-strong)] text-[color:var(--accent)] focus:ring-[color:var(--accent)]"
          />
          <span>
            Also build <code className="rounded bg-[color:var(--surface-2)] px-1 text-[color:var(--text)]">llms-full.txt</code> with page text.
            Heavier, so it covers fewer pages.
          </span>
        </label>

        <p className="text-[12.5px] leading-relaxed text-[color:var(--muted)]">
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
        <div role="alert" className="mt-5 rounded-[4px] border border-[color:var(--fail-line)] bg-[color:var(--fail-bg)] p-4 text-[14px] leading-relaxed text-[color:var(--fail)]">
          {err}
        </div>
      )}

      {loading && (
        <p className="mt-5 text-[13px] leading-relaxed text-[color:var(--muted)]">
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
              <div key={s.label} className="rounded-[4px] border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3">
                <div className="font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">{s.label}</div>
                <div className="mt-1 text-[18px] font-bold tracking-tight text-[color:var(--white)]">{s.value}</div>
              </div>
            ))}
          </div>

          {result.warnings.length > 0 && (
            <ul className="mt-4 space-y-1.5 rounded-[4px] border border-[color:var(--warn-line)] bg-[color:var(--warn-bg)] p-4">
              {result.warnings.map((w, i) => (
                <li key={i} className="text-[13px] leading-relaxed text-[color:var(--warn)]">
                  {w}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex gap-1 border-b border-[color:var(--line-strong)]" role="tablist" aria-label="Generated output">
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
                  tab === id ? "border-[color:var(--accent)] text-[color:var(--accent)]" : "border-transparent text-[color:var(--muted)] hover:text-[color:var(--white)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "file" && (
            <div id="gen-panel-file" role="tabpanel" aria-labelledby="gen-tab-file">
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={copyOut} className="rounded-[4px] border border-[color:var(--line-strong)] px-3.5 py-2 text-[13px] font-medium text-[color:var(--text)] transition-colors hover:border-[color:var(--line-lime)]">
                  {copied ? "Copied" : "Copy"}
                </button>
                <button type="button" onClick={() => download("llms.txt", result.llmsTxt)} className="rounded-[3px] bg-[color:var(--accent)] px-3.5 py-2 text-[13px] font-semibold text-[color:var(--accent-ink)] transition-colors hover:bg-[color:var(--accent-hover)]">
                  Download llms.txt
                </button>
                {result.llmsFullTxt && (
                  <button type="button" onClick={() => download("llms-full.txt", result.llmsFullTxt!)} className="rounded-[4px] border border-[color:var(--line-strong)] px-3.5 py-2 text-[13px] font-medium text-[color:var(--text)] transition-colors hover:border-[color:var(--line-lime)]">
                    Download llms-full.txt
                  </button>
                )}
              </div>

              <div className="mt-4 rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--code-bg)] p-5">
                <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-[color:var(--text)]">
                  {result.llmsTxt}
                </pre>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-[color:var(--muted)]">
                Save this as <code className="rounded bg-[color:var(--surface-2)] px-1 text-[color:var(--muted)]">llms.txt</code> at your site root
                (<code className="rounded bg-[color:var(--surface-2)] px-1 text-[color:var(--muted)]">/llms.txt</code>). Edit it down first — a
                shorter, sharper index beats a complete one.
              </p>
            </div>
          )}

          {tab === "pages" && (
            <div id="gen-panel-pages" role="tabpanel" aria-labelledby="gen-tab-pages" className="mt-4 overflow-hidden rounded-[4px] border border-[color:var(--line-strong)]">
              <ul className="max-h-[32rem] divide-y divide-[color:var(--line)] overflow-auto">
                {result.pages.map((p) => (
                  <li key={p.url} className="px-4 py-2.5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[color:var(--muted)]">{p.section}</span>
                      <span className="text-[13.5px] font-semibold text-[color:var(--white)]">{p.title}</span>
                    </div>
                    <a href={p.url} target="_blank" rel="noopener noreferrer nofollow" className="break-all font-mono text-[11.5px] text-[color:var(--muted)] hover:text-[color:var(--accent)] hover:underline">
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
