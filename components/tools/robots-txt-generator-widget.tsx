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
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200"

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
      <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div>
          <label htmlFor="preset" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
            Start from
          </label>
          <select id="preset" className={inputCls} value={presetId} onChange={(e) => setPresetId(e.target.value)}>
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-500">
            {PRESETS.find((p) => p.id === presetId)?.description}
          </p>
        </div>

        <div>
          <label htmlFor="disallow" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
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
          <label htmlFor="sitemap" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
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
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-500">
            One line, no downside — it&apos;s how any crawler finds your sitemap without you submitting it anywhere.
          </p>
        </div>

        <div>
          <label htmlFor="delay" className="mb-1 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
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
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-gray-500">
            <strong>Bing honours this.</strong> Googlebot never has, and Yandex dropped it in 2018 — so today it&apos;s
            really a Bing setting.
          </p>
        </div>

        <div>
          <span className="mb-2 block font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
            AI crawlers to block
          </span>
          <div className="space-y-1.5">
            {AI_CRAWLERS.map((c) => (
              <label
                key={c.token}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50/60 p-2.5 transition-colors hover:border-gray-200"
              >
                <input
                  type="checkbox"
                  checked={blocked.includes(c.token)}
                  onChange={() => toggle(c.token)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-1.5">
                    <span className="font-mono text-[13px] font-semibold text-gray-900">{c.token}</span>
                    <span className="text-[11.5px] text-gray-500">{c.operator}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${
                        c.purpose === "training" ? "bg-gray-200 text-gray-700" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {PURPOSE_LABEL[c.purpose]}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-relaxed text-gray-600">{c.note}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-gray-500">
            Blocking a <strong>training</strong> crawler keeps your content out of model training. Blocking a{" "}
            <strong>search</strong> one removes you from that engine&apos;s answers. They&apos;re different decisions and
            people conflate them constantly.
          </p>
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-gray-950 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">robots.txt</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyOut}
                className="rounded-lg border border-gray-700 px-3 py-1.5 text-[12px] font-medium text-gray-200 transition-colors hover:border-gray-500 hover:text-white"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => {
                  download("robots.txt", output)
                  trackEvent("free_tool_used", { tool: "robots_txt_generator" })
                }}
                className="rounded-lg bg-accent-600 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-accent-500"
              >
                Download
              </button>
            </div>
          </div>
          <pre className="mt-3 max-h-[26rem] flex-1 overflow-auto whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-gray-200">
            {output}
          </pre>
          <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
            Save at your site root: <code className="rounded bg-gray-800 px-1 text-gray-300">/robots.txt</code>. It must
            be at the root — a robots.txt in a subfolder is ignored.
          </p>
        </div>

        {/* Self-lint: same checks the tester runs on other people's files */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="font-mono text-[10.5px] font-semibold uppercase tracking-widest text-gray-500">
            Checked against the same rules as our tester
          </p>
          {blocking.length === 0 && findings.length === 0 && (
            <p className="mt-2 text-[13.5px] leading-relaxed text-emerald-800">
              No issues. This file is valid and doesn&apos;t block anything it shouldn&apos;t.
            </p>
          )}
          {findings.length > 0 && (
            <ul className="mt-2 space-y-2">
              {findings.map((f, i) => (
                <li key={i} className="text-[13px] leading-relaxed">
                  <span
                    className={`mr-1.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest ${
                      f.severity === "error"
                        ? "bg-red-100 text-red-700"
                        : f.severity === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {f.severity}
                  </span>
                  <span className="font-semibold text-gray-900">{f.title}.</span>{" "}
                  <span className="text-gray-700">{f.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
