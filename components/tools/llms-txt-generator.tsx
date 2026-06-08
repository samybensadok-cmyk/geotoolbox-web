"use client"

import { useMemo, useState } from "react"

/**
 * Lite llms.txt generator — a pure form. You name the site, add a one-line
 * summary, and list sections of links; it emits a spec-correct llms.txt with
 * live preview, copy, and download. No crawl, no LLM, no server call — $0.
 * (Auto-generate-from-URL is a separate, heavier feature gated behind sign-up.)
 */

interface LinkRow { name: string; url: string; note: string }
interface Section { title: string; links: LinkRow[] }

const STARTER: { name: string; summary: string; sections: Section[] } = {
  name: "",
  summary: "",
  sections: [
    { title: "Docs", links: [{ name: "", url: "", note: "" }] },
  ],
}

// The spec wants absolute https:// URLs. Auto-prepend https:// to a bare host or
// path (e.g. "acme.com/docs") so the generated file doesn't trip our own
// validator's "relative URL" warning. Leave real schemes, anchors, root-relative
// paths, and mailto/tel untouched.
function normUrl(raw: string): string {
  const u = raw.trim()
  if (!u) return "https://example.com"
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(u) || /^(mailto:|tel:|#|\/)/i.test(u)) return u
  return `https://${u}`
}

function buildFile(name: string, summary: string, sections: Section[]): string {
  const lines: string[] = []
  lines.push(`# ${name.trim() || "Your Site Name"}`)
  lines.push("")
  if (summary.trim()) { lines.push(`> ${summary.trim()}`); lines.push("") }
  for (const section of sections) {
    const rows = section.links.filter((l) => l.name.trim() || l.url.trim())
    if (!section.title.trim() && rows.length === 0) continue
    lines.push(`## ${section.title.trim() || "Section"}`)
    lines.push("")
    for (const l of rows) {
      const nm = l.name.trim() || "Link"
      const url = normUrl(l.url)
      lines.push(l.note.trim() ? `- [${nm}](${url}): ${l.note.trim()}` : `- [${nm}](${url})`)
    }
    lines.push("")
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n"
}

export function LlmsTxtGenerator() {
  const [name, setName] = useState(STARTER.name)
  const [summary, setSummary] = useState(STARTER.summary)
  const [sections, setSections] = useState<Section[]>(STARTER.sections)
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => buildFile(name, summary, sections), [name, summary, sections])

  function updateSection(si: number, patch: Partial<Section>) {
    setSections((prev) => prev.map((s, i) => (i === si ? { ...s, ...patch } : s)))
  }
  function updateLink(si: number, li: number, patch: Partial<LinkRow>) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, links: s.links.map((l, j) => (j === li ? { ...l, ...patch } : l)) } : s,
      ),
    )
  }
  function addLink(si: number) {
    setSections((prev) => prev.map((s, i) => (i === si ? { ...s, links: [...s.links, { name: "", url: "", note: "" }] } : s)))
  }
  function removeLink(si: number, li: number) {
    setSections((prev) => prev.map((s, i) => (i === si ? { ...s, links: s.links.filter((_, j) => j !== li) } : s)))
  }
  function addSection() {
    setSections((prev) => [...prev, { title: "", links: [{ name: "", url: "", note: "" }] }])
  }
  function removeSection(si: number) {
    setSections((prev) => prev.filter((_, i) => i !== si))
  }

  function copyOut() {
    navigator.clipboard?.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }
  function downloadOut() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = "llms.txt"
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const inputCls =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[14px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-200"

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">Site / project name (H1)</label>
            <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Docs" />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">One-line summary (optional)</label>
            <input className={inputCls} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Everything you need to build on Acme." />
          </div>

          {sections.map((section, si) => (
            <div key={si} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] text-gray-400">##</span>
                <input
                  className={inputCls}
                  value={section.title}
                  onChange={(e) => updateSection(si, { title: e.target.value })}
                  placeholder="Section name (e.g. Docs)"
                />
                {sections.length > 1 && (
                  <button type="button" onClick={() => removeSection(si)} aria-label="Remove section" className="shrink-0 rounded-lg border border-gray-200 px-2 py-2 text-gray-400 transition-colors hover:border-red-300 hover:text-red-600">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6h8" strokeLinecap="round" /></svg>
                  </button>
                )}
              </div>
              <div className="mt-3 space-y-2">
                {section.links.map((link, li) => (
                  <div key={li} className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-white p-2.5 sm:flex-row">
                    <input className={inputCls} value={link.name} onChange={(e) => updateLink(si, li, { name: e.target.value })} placeholder="Link title" />
                    <input className={inputCls} value={link.url} onChange={(e) => updateLink(si, li, { url: e.target.value })} placeholder="https://…" />
                    <input className={inputCls} value={link.note} onChange={(e) => updateLink(si, li, { note: e.target.value })} placeholder="note (optional)" />
                    {section.links.length > 1 && (
                      <button type="button" onClick={() => removeLink(si, li)} aria-label="Remove link" className="shrink-0 rounded-lg border border-gray-200 px-2 text-gray-400 transition-colors hover:border-red-300 hover:text-red-600">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6h8" strokeLinecap="round" /></svg>
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addLink(si)} className="text-[12px] font-medium text-accent-700 hover:text-accent-800">+ Add link</button>
              </div>
            </div>
          ))}

          <button type="button" onClick={addSection} className="w-full rounded-xl border border-dashed border-gray-300 py-2.5 text-[13px] font-medium text-gray-500 transition-colors hover:border-accent-400 hover:text-accent-700">
            + Add section
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col rounded-2xl border border-gray-200 bg-gray-950 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-400">llms.txt preview</span>
          <div className="flex gap-2">
            <button type="button" onClick={copyOut} className="rounded-lg border border-gray-700 px-3 py-1.5 text-[12px] font-medium text-gray-200 transition-colors hover:border-gray-500 hover:text-white">
              {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" onClick={downloadOut} className="rounded-lg bg-accent-600 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-accent-500">
              Download
            </button>
          </div>
        </div>
        <pre className="mt-3 max-h-[28rem] flex-1 overflow-auto whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-gray-200">{output}</pre>
        <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
          Save this as <code className="rounded bg-gray-800 px-1 text-gray-300">llms.txt</code> at your site root
          (<code className="rounded bg-gray-800 px-1 text-gray-300">/llms.txt</code>), then check it above.
        </p>
      </div>
    </div>
  )
}
