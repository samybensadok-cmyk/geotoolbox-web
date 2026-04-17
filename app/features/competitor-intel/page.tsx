import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, breadcrumbsSchema } from "@/lib/seo-schema"

export const metadata: Metadata = {
  title: "Competitor Intel: AI visibility tracking for competitors",
  description:
    "Track how competitors gain or lose AI citations across ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews, and Bing Copilot. AI share-of-voice, content gap matrix, and real-time threat alerts when a rival starts outranking you in AI answer engines.",
  openGraph: {
    title: "Competitor Intel: AI visibility tracking for competitors",
    description:
      "Track how competitors gain or lose AI citations across six engines. AI share-of-voice, content gap matrix, and real-time threat alerts when a rival starts outranking you.",
  },
  alternates: { canonical: `${siteConfig.url}/features/competitor-intel` },
}

const competitors = [
  { domain: "ahrefs.com", share: 87, delta: "+4", gaps: 3 },
  { domain: "semrush.com", share: 62, delta: "-3", gaps: 5 },
  { domain: "moz.com", share: 48, delta: "+1", gaps: 8 },
  { domain: "searchenginejournal.com", share: 41, delta: "+6", gaps: 2 },
]

const gapMatrix = [
  { topic: "ai content optimization", you: false, ahrefs: true, semrush: false },
  { topic: "saas content strategy", you: true, ahrefs: true, semrush: true },
  { topic: "brand positioning for ai search", you: false, ahrefs: false, semrush: true },
  { topic: "ai seo tools comparison", you: true, ahrefs: false, semrush: false },
  { topic: "schema markup for llms", you: false, ahrefs: true, semrush: true },
  { topic: "content freshness signals", you: true, ahrefs: true, semrush: false },
]

const faqs = [
  {
    question: "What does Competitor Intel track?",
    answer:
      "How competitor domains' AI citations change over time, which engines cite them, for which keywords, and how their AI visibility trends compare to yours. It's longitudinal tracking across ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews, and Bing Copilot, not a one-shot snapshot.",
  },
  {
    question: "How many competitors can I track?",
    answer:
      "Up to three competitor domains on the current plan, with higher limits planned for upper tiers as they ship. Every tracked competitor gets side-by-side citation tracking across all six AI engines, aggregated for AI visibility trends.",
  },
  {
    question: "How is this different from the competitor comparison in GEO Scan?",
    answer:
      "GEO Scan shows a snapshot for one keyword. Competitor Intel tracks trends across every keyword over time. Scan answers 'who's cited right now?' Intel answers 'who's gaining and losing AI citations month over month?'",
  },
  {
    question: "Can I see which specific pages competitors are getting cited for?",
    answer:
      "Yes. The tool surfaces the exact competitor URLs that AI engines reference most frequently, plus which prompts those URLs win. That maps directly to a content gap list: pages you need to publish or rewrite to compete.",
  },
  {
    question: "How are threat alerts delivered?",
    answer:
      "By email. When a competitor starts gaining citations on a prompt you used to own, an alert fires with a one-sentence analysis of why, so you can react before the citation share compounds.",
  },
  {
    question: "How often does the data update?",
    answer:
      "Data refreshes with each new scan you run. More scans across more keywords builds a richer competitive picture; weekly cadence on core keywords is usually enough to catch meaningful movement early.",
  },
]

const sections = [
  {
    num: "01",
    tag: "AI threat alerts",
    title: "Find out the day it matters",
    body: "Claude-powered analysis runs on every scan. When a competitor starts getting cited for a prompt you used to own, you get an alert with a 1-sentence why.",
  },
  {
    num: "02",
    tag: "Share of voice",
    title: "Who's cited, how often",
    body: "Aggregated across every scan. Rank competitors by citation count, track share-of-voice week over week, and drill into which engines they own.",
  },
  {
    num: "03",
    tag: "Content gap matrix",
    title: "Topics they cover, you don't",
    body: "Side-by-side matrix of topics across you and up to 3 competitors (more on higher tiers). Gaps on your row are your next-action list.",
  },
  {
    num: "04",
    tag: "SERP feature ownership",
    title: "Who wins the rich features",
    body: "Track ownership of AI Overviews, People Also Ask, featured snippets, and knowledge panels across your keyword set. Movement = opportunity.",
  },
  {
    num: "05",
    tag: "Sitemap + Ahrefs diff",
    title: "What they published this week",
    body: "Crawl their sitemap, diff against last scan, cross-reference Ahrefs. The new URLs most likely to trigger citation loss for you.",
  },
  {
    num: "06",
    tag: "Co-cited neighbors",
    title: "The AI citation neighborhood",
    body: "Who else gets cited alongside your top competitors. Useful for backlink targets, guest post pitches, and mapping the authoritative cluster.",
  },
]

export default function CompetitorIntelPage() {
  return (
    <>
      {/* Hero — blush atmosphere (vigilance / threat-feed feel) */}
      <section className="relative overflow-hidden bg-[var(--surface-blush)] px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
      <JsonLd data={[
        softwareApplicationSchema({
          name: "Competitor Intel",
          description: "Track new content published by competitors. Detect new pages, lost rankings, publishing velocity, and AI threat alerts across six engines.",
          url: `${siteConfig.url}/features/competitor-intel`,
        }),
        breadcrumbsSchema([
          { name: "Home", url: "/" },
          { name: "Features", url: "/features" },
          { name: "Competitor Intel", url: "/features/competitor-intel" },
        ]),
      ]} />

        <div className="mx-auto max-w-7xl">
          <Breadcrumbs featureName="Competitor Intel" />

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Competitor Intel
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                Know the day they outrank you.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                Track how competitors gain or lose AI citations. Content gap matrix, SERP feature ownership, and real-time threat alerts so you find out the moment a rival starts beating you in AI search.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" prefetch={false} className="rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]">
                  Try it for free
                </Link>
                <Link href="#inside" className="rounded-full border border-gray-200 px-6 py-3.5 text-[15px] font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900">
                  What's inside
                </Link>
              </div>
            </div>

            {/* Competitor tracking visual — threat-feed first, SoV rail as compact context */}
            <div className="lg:col-span-6" aria-hidden="true">
              <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-7 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
                {/* Live feed header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                    </span>
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-800">
                      AI threat feed &middot; live
                    </span>
                  </div>
                  <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-red-700">
                    3 new today
                  </span>
                </div>

                {/* Primary threat — largest visual weight, shows the why + suggested action */}
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-red-700">
                      2h ago &middot; citation surge
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-red-700">+3</span>
                  </div>
                  <p className="mt-2 text-[14px] font-semibold leading-snug text-red-950">
                    <span className="font-mono">searchenginejournal.com</span>
                    <span className="font-normal text-red-900"> won </span>
                    <span className="italic">&ldquo;ai content optimization&rdquo;</span>
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-red-800">
                    <span className="font-semibold">Why:</span> Published a 4,000-word guide six days ago. Now cited above yours on Perplexity and Claude.
                  </p>
                  <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] font-semibold text-red-700">
                    Open full report
                    <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h6m0 0L6 3m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </p>
                </div>

                {/* Secondary threat — tighter, signals "there's a feed of these" */}
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-amber-700">
                      1d ago &middot; competitor moved
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-amber-700">+1</span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-amber-950">
                    <span className="font-mono font-semibold">ahrefs.com</span>
                    <span className="text-amber-900"> picked up a citation on </span>
                    <span className="italic">&ldquo;best seo tool&rdquo;</span>
                  </p>
                </div>

                {/* Compact SoV rail — context, not the hero */}
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                      Share of voice &middot; 30 days
                    </p>
                    <p className="font-mono text-[10px] text-gray-400">4 / 5 tracked</p>
                  </div>
                  <div className="space-y-2">
                    {competitors.map((c) => {
                      const positive = c.delta.startsWith("+")
                      return (
                        <div key={c.domain} className="flex items-center gap-3">
                          <span className="w-44 shrink-0 truncate font-mono text-[12px] font-medium text-gray-800">{c.domain}</span>
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div className="h-full rounded-full bg-accent-500" style={{ width: `${c.share}%` }} />
                          </div>
                          <span className="w-9 shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums text-gray-900">{c.share}%</span>
                          <span className={`w-6 shrink-0 text-right font-mono text-[10px] font-semibold ${positive ? "text-accent-700" : "text-red-600"}`}>{c.delta}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gap matrix section */}
      <section className="bg-gray-50 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">Content gap matrix</p>
              <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
                The topics they own. You don't.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-600">
              A literal spreadsheet of who gets cited where. Topics across rows, competitors across columns, a check for every site AI currently cites. Every gap on your row is a page you need to publish or rewrite.
            </p>
          </div>

          {/* Legend — explains the symbols before the reader has to guess */}
          <div className="mt-8 flex flex-wrap items-center gap-5 text-[13px] text-gray-600">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-500">
                <svg className="h-3 w-3 text-white" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              Cited in AI responses
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 bg-gray-100">
                <svg className="h-2.5 w-2.5 text-gray-500" viewBox="0 0 12 12" fill="none">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              Absent &mdash; a gap to close
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">Topic</th>
                    <th className="px-4 py-4 text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">You</th>
                    <th className="px-4 py-4 text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">ahrefs.com</th>
                    <th className="px-4 py-4 text-center font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">semrush.com</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {gapMatrix.map((row) => (
                    <tr key={row.topic}>
                      <td className="px-6 py-4 font-mono text-[13px] text-gray-900">{row.topic}</td>
                      <td className="px-4 py-4 text-center">
                        <Cell present={row.you} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Cell present={row.ahrefs} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Cell present={row.semrush} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inline CTA at point of peak intent */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-gray-500">Example data &mdash; your matrix is generated from your scans.</p>
            <Link
              href="/app"
              prefetch={false}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700 hover:text-accent-900"
            >
              Scan your domain to see your gap
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section id="inside" className="bg-white px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">What's inside</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
              Six views of the competitive field.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {sections.map((s) => (
              <div key={s.tag} className="relative pl-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 font-mono text-[22px] font-bold tabular-nums leading-none text-gray-300"
                >
                  {s.num}
                </span>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
                  {s.tag}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} />

      <RelatedFeatures current="competitor-intel" related={["domain-overview", "geo-scan", "community"]} />

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Track your first competitor.
            </h2>
            <p className="mt-2 text-base text-gray-300">Free while in beta. No credit card.</p>
          </div>
          <Link href="/app" prefetch={false} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]">
            Try it for free
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}

function Cell({ present }: { present: boolean }) {
  return present ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-500">
      <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 14 14" fill="none">
        <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-gray-100">
      <svg className="h-3 w-3 text-gray-500" viewBox="0 0 12 12" fill="none">
        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  )
}
