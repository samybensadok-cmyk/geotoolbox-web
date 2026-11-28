"use client"

import { useMemo, useState } from "react"
import { generateRobotsTxt, lintRobotsTxt, PRESETS, AI_CRAWLERS } from "@/lib/robots-generate"
import { trackEvent } from "@/lib/analytics"

/**
 * robots.txt generator. Runs entirely in the browser — there's no crawl and no
 * API behind it, so there's nothing to meter and nothing to gate.
 *
 * It lints its own output with the same checks the tester page applies to other
 * people's files, so we can't ship a file our own tool would flag.
 */

const inputCls =
  "w-full rounded-[4px] border border-[color:var(--line-strong)] bg-[color:var(--bg)] px-3 py-2 text-[14px] text-[color:var(--white)] outline-none transition-colors placeholder:text-[color:var(--subtle)] focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--focus-ring)]"

function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }))
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

const PURPOSE_LABEL: Record<string, string> = {
  training: "Trains models",
  search: "Powers AI search",
  "user-request": "Fetches on user request",
}

export function RobotsTxtGeneratorWidget() {
  const [presetId, setPresetId] = useState("wordpress")
  const [disallow, setDisallow] = useState("")
  const [sitemap, setSitemap] = useState("")
  const [crawlDelay, setCrawlDelay] = useState("")
  const [blocked, setBlocked] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const output = useMemo(
    () =>
      generateRobotsTxt({
        presetId,
        customDisallow: disallow.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
        customAllow: [],
        sitemaps: sitemap.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
        crawlDelay: crawlDelay.trim() ? Number(crawlDelay) : undefined,
        blockedAiCrawlers: blocked,
      }),
    [presetId, disallow, sitemap, crawlDelay, blocked],
  )

  const findings = useMemo(() => lintRobotsTxt(output), [output])
  const blocking = findings.filter((f) => f.severity === "error")

  function toggle(token: string) {
    setBlocked((prev) => (prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]))
  }

  function copyOut() {
    navigator.clipboard?.writeText(output).then(() => {
      setCopied(true)
      trackEvent("free_tool_used", { tool: "robots_txt_generator" })
      setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Controls */}
      <div className="space-y-5 rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5 sm:p-6">
        <div>
          <label htmlFor="preset" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Start from
          </label>
          <select id="preset" className={inputCls} value={presetId} onChange={(e) => setPresetId(e.target.value)}>
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[color:var(--muted)]">
            {PRESETS.find((p) => p.id === presetId)?.description}
          </p>
        </div>

        <div>
          <label htmlFor="disallow" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Also block these paths (one per line)
          </label>
          <textarea
            id="disallow"
            className={`${inputCls} min-h-[5.5rem] font-mono text-[12.5px]`}
            value={disallow}
            onChange={(e) => setDisallow(e.target.value)}
            placeholder={"/private/\n/tmp/"}
            spellCheck={false}
          />
        </div>

        <div>
          <label htmlFor="sitemap" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Sitemap URL
          </label>
          <input
            id="sitemap"
            className={inputCls}
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
            placeholder="https://example.com/sitemap.xml"
            spellCheck={false}
          />
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[color:var(--muted)]">
            One line, no downside — it&apos;s how any crawler finds your sitemap without you submitting it anywhere.
          </p>
        </div>

        <div>
          <label htmlFor="delay" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Crawl-delay (optional)
          </label>
          <input
            id="delay"
            type="number"
            min={0}
            max={60}
            className={inputCls}
            value={crawlDelay}
            onChange={(e) => setCrawlDelay(e.target.value)}
            placeholder="seconds"
          />
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[color:var(--muted)]">
            <strong>Bing honours this.</strong>{" "}Googlebot never has, and Yandex dropped it in 2018 — so today it&apos;s
            really a Bing setting.
          </p>
        </div>

        <div>
          <span className="mb-2 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            AI crawlers to block
          </span>
          <div className="space-y-1.5">
            {AI_CRAWLERS.map((c) => (
              <label
                key={c.token}
                className="flex cursor-pointer items-start gap-2.5 rounded-[4px] border border-[color:var(--line)] bg-[color:var(--surface-2)] p-2.5 transition-colors hover:border-[color:var(--line-lime)]"
              >
                <input
                  type="checkbox"
                  checked={blocked.includes(c.token)}
                  onChange={() => toggle(c.token)}
                  className="mt-0.5 h-4 w-4 rounded border-[color:var(--line-strong)] text-[color:var(--accent)] focus:ring-[color:var(--accent)]"
                />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-1.5">
                    <span className="font-mono text-[13px] font-semibold text-[color:var(--white)]">{c.token}</span>
                    <span className="text-[11.5px] text-[color:var(--muted)]">{c.operator}</span>
                    <span
                      className={`rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${
                        c.purpose === "training" ? "bg-[color:var(--line-strong)] text-[color:var(--text)]" : "bg-[color:var(--warn-bg-strong)] text-[color:var(--warn)]"
                      }`}
                    >
                      {PURPOSE_LABEL[c.purpose]}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-[color:var(--muted)]">{c.note}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[color:var(--muted)]">
            Blocking a <strong>training</strong> crawler keeps your content out of model training. Blocking a{" "}
            <strong>search</strong>{" "}one removes you from that engine&apos;s answers. They&apos;re different decisions and
            people conflate them constantly.
          </p>
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--code-bg)] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">robots.txt</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyOut}
                className="rounded-[4px] border border-[color:var(--line-strong)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--text)] transition-colors hover:border-[color:var(--line-lime)] hover:text-white"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => {
                  download("robots.txt", output)
                  trackEvent("free_tool_used", { tool: "robots_txt_generator" })
                }}
                className="rounded-[3px] bg-[color:var(--accent)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--accent-ink)] transition-colors hover:bg-[color:var(--accent-hover)]"
              >
                Download
              </button>
            </div>
          </div>
          <pre className="mt-3 max-h-[26rem] flex-1 overflow-auto whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-[color:var(--text)]">
            {output}
          </pre>
          <p className="mt-3 text-[11px] leading-relaxed text-[color:var(--muted)]">
            Save at your site root: <code className="rounded bg-[color:var(--surface-2)] px-1 text-[color:var(--text)]">/robots.txt</code>. It must
            be at the root — a robots.txt in a subfolder is ignored.
          </p>
        </div>

        {/* Self-lint: same checks the tester runs on other people's files */}
        <div className="rounded-[8px] border border-[color:var(--line-strong)] bg-[color:var(--surface)] p-5">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-widest text-[color:var(--muted)]">
            Checked against the same rules as our tester
          </p>
          {blocking.length === 0 && findings.length === 0 && (
            <p className="mt-2 text-[13.5px] leading-relaxed text-[color:var(--accent)]">
              No issues. This file is valid and doesn&apos;t block anything it shouldn&apos;t.
            </p>
          )}
          {findings.length > 0 && (
            <ul className="mt-2 space-y-2">
              {findings.map((f, i) => (
                <li key={i} className="text-[13px] leading-relaxed">
                  <span
                    className={`mr-1.5 rounded-[3px] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest ${
                      f.severity === "error"
                        ? "bg-[color:var(--fail-bg-strong)] text-[color:var(--fail)]"
                        : f.severity === "warning"
                          ? "bg-[color:var(--warn-bg-strong)] text-[color:var(--warn)]"
                          : "bg-[color:var(--surface-2)] text-[color:var(--muted)]"
                    }`}
                  >
                    {f.severity}
                  </span>
                  <span className="font-semibold text-[color:var(--white)]">{f.title}.</span>{" "}
                  <span className="text-[color:var(--text)]">{f.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
