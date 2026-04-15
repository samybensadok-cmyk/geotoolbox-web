import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"

export const metadata: Metadata = {
  title: "Content Brief & Draft — AI-ready content workflow",
  description:
    "Brief any keyword, draft the article, grade the result. Outline, entities, facts coverage, SERP gap analysis, and citability scoring — all in one workflow.",
}

const briefSections = [
  { label: "Framework", value: "Pillar + cluster", cited: true },
  { label: "Entities", value: "18 required, 12 covered", cited: true },
  { label: "Facts coverage", value: "7 of 9 competitor facts", cited: false },
  { label: "SERP gaps", value: "3 topics missing from top 10", cited: true },
]

const steps = [
  {
    num: "01",
    verb: "Brief",
    title: "A target keyword",
    body: "We pull the live SERP, extract winning entities and facts, and build a framework-aware outline (pillar, cluster, comparison, FAQ).",
    output: "best project management software",
  },
  {
    num: "02",
    verb: "Draft",
    title: "The article, in-line",
    body: "Write inside the tool — headings pre-filled, entity checklist pinned, inline citation suggestions. Or paste an existing draft to score it.",
    output: "Draft + entity coverage checklist",
  },
  {
    num: "03",
    verb: "Grade",
    title: "Structure + AI readiness",
    body: "Dual scoring: Structure (how well the draft matches the brief) and AI Readiness (how likely AI engines are to cite it, 0–100).",
    output: "Structure 91 · AI Readiness 78",
  },
]

const outcomes = [
  {
    tag: "Dual scoring",
    title: "Structure and AI readiness",
    body: "Most brief tools score structure only. We score both: how well your draft follows the brief AND how citable it is for AI engines — using the same 19-signal model as Content Analyzer.",
  },
  {
    tag: "Facts coverage",
    title: "What competitors say, you don't",
    body: "We extract the concrete facts and data points competitors use in their top-ranked pieces. Your draft gets flagged when a high-value fact is missing.",
  },
  {
    tag: "SERP gap matrix",
    title: "Topics no one's covered",
    body: "Side-by-side the top 10 results. Highlights sub-topics the SERP universally misses — the fastest path to differentiated positioning.",
  },
  {
    tag: "Export anywhere",
    title: "PDF, XLSX, or in-line draft",
    body: "Send the brief to a freelancer, pull the data into a sheet, or publish the draft directly. No lock-in, no proprietary formats.",
  },
]

export default function ContentBriefPage() {
  return (
    <>
      {/* Hero — cream/editorial atmosphere */}
      <section className="relative overflow-hidden bg-[var(--surface-warm)] px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
        {/* Editorial ruled lines — subtle paper texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #8a7a4c 31px, #8a7a4c 32px)",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <Breadcrumbs featureName="Content Brief & Draft" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Content Brief &amp; Draft
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                Brief it. Draft it. Ship something AI will cite.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Generate the brief, write the draft, grade the result — all in one tool. Framework, entities, facts coverage, and citability scoring, built for the AI-search era.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" className="rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]">
                  Generate a brief
                </Link>
                <Link href="#how" className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
                  See the workflow
                </Link>
              </div>
            </div>

            {/* Brief visual — notebook card treatment */}
            <div className="lg:col-span-6" aria-hidden="true">
              <div className="relative rounded-[2rem] border border-[var(--surface-warm-border)] bg-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(137,120,70,0.18)]">
                {/* Left-edge ruling — notebook spine */}
                <div className="absolute left-4 top-6 bottom-6 w-px bg-amber-200/60" />
                <div className="absolute left-5 top-6 bottom-6 w-px bg-amber-200/40" />

                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="font-mono text-[13px] font-semibold text-gray-900">best project management software</span>
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-700">Pillar</span>
                </div>

                <div className="mt-5 divide-y divide-gray-100">
                  {briefSections.map((s) => (
                    <div key={s.label} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">{s.label}</span>
                      <span className={`text-[13px] font-medium tabular-nums ${s.cited ? "text-gray-900" : "text-amber-700"}`}>
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Structure</p>
                    <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-gray-900">91</p>
                  </div>
                  <div className="rounded-xl border border-accent-200 bg-accent-50 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-accent-700">AI readiness</p>
                    <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-accent-800">78</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-[var(--surface-warm)] px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">How it works</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                One tool. Brief, draft, grade.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              Most brief tools stop at the outline. We keep going — you can draft the article inline, score it against the brief, and iterate until both structure and AI readiness clear your threshold.
            </p>
          </div>

          <ol className="mt-14 divide-y divide-gray-200">
            {steps.map((s) => (
              <li key={s.num} className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:py-10">
                <div className="flex items-center gap-4 md:block">
                  <span className="font-mono text-4xl font-bold tabular-nums text-accent-700 md:text-5xl">{s.num}</span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 md:hidden">{s.verb}</span>
                </div>
                <div>
                  <p className="hidden text-xs font-semibold uppercase tracking-widest text-gray-500 md:block">{s.verb}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-gray-600">{s.body}</p>
                </div>
                <div className="md:text-right">
                  <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-[12px] text-gray-700">
                    <svg className="h-3 w-3 text-accent-600" viewBox="0 0 12 12" fill="none">
                      <path d="M3 6h6m0 0L6 3m3 3L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{s.output}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-gray-50 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">What makes it different</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
              Built for AI-era briefs.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {outcomes.map((o) => (
              <div key={o.tag}>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">{o.tag}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{o.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedFeatures current="content-brief" related={["content-analyzer", "geo-scan", "domain-overview"]} />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Generate your first brief.
            </h2>
            <p className="mt-2 text-base text-gray-300">Free while in beta. No credit card.</p>
          </div>
          <Link href="/app" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
            Start free trial
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
