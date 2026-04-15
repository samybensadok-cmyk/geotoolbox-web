import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Community — Reddit + forum citations AI engines use",
  description:
    "See which Reddit and forum threads AI cites when answering queries in your space. Catch misinformation, find subreddits worth engaging, build a community participation plan.",
}

const threads = [
  {
    sub: "r/SEO",
    title: "Is Ahrefs worth it in 2026?",
    engines: ["ChatGPT", "Perplexity"],
    sentiment: "Mixed",
    risk: false,
  },
  {
    sub: "r/marketing",
    title: "Best AI SEO tools comparison",
    engines: ["ChatGPT", "Claude", "Perplexity"],
    sentiment: "Positive",
    risk: false,
  },
  {
    sub: "r/TechSEO",
    title: "Schema markup no longer matters?",
    engines: ["Gemini"],
    sentiment: "Negative",
    risk: true,
  },
  {
    sub: "r/bigSEO",
    title: "How to track AI citations",
    engines: ["Perplexity"],
    sentiment: "Mixed",
    risk: false,
  },
]

const outcomes = [
  {
    tag: "Thread-level citations",
    title: "Which forums AI actually reads",
    body: "Every Reddit and forum URL that AI engines cite in your topic space. Ranked by citation frequency across scans.",
  },
  {
    tag: "Misinformation risk",
    title: "Find the bad takes first",
    body: "Threads with negative sentiment about your brand (or category) that AI is amplifying. Flagged so you can respond, correct, or engage before it compounds.",
  },
  {
    tag: "Subreddit map",
    title: "Where to actually show up",
    body: "Top subreddits AI cites in your space, ranked by volume. Your organic community participation playbook, starting with the highest-signal communities.",
  },
  {
    tag: "Action plan",
    title: "Engagement that moves the needle",
    body: "Specific threads worth a reply, specific subreddits worth sustained participation, specific FAQ-shaped questions AI engines keep answering without citing you.",
  },
]

export default function CommunityPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white px-6 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <Link href="/features" className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-accent-700">
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 7H4m0 0 3-3m-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All features
          </Link>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">
                Community
              </p>
              <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
                The Reddit threads AI quotes back to your customers.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
                AI engines cite forums constantly. See exactly which threads they use in your space — plus the misinformation risks and subreddits worth engaging.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/app" className="rounded-full bg-gray-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-900/10 active:translate-y-[1px]">
                  See your community map
                </Link>
              </div>
            </div>

            {/* Community visual */}
            <div className="lg:col-span-6" aria-hidden="true">
              <div className="relative rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-600">
                    AI-cited threads
                  </span>
                  <span className="rounded-full bg-accent-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent-700">
                    4 tracked
                  </span>
                </div>
                <ul className="mt-3 divide-y divide-gray-100">
                  {threads.map((t) => (
                    <li key={t.title} className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-accent-700">{t.sub}</span>
                        {t.risk && (
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-amber-800">
                            Risk
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] font-medium text-gray-900">{t.title}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
                          <span>Cited by {t.engines.join(", ")}</span>
                        </div>
                        <span
                          className={`font-mono font-semibold ${
                            t.sentiment === "Positive"
                              ? "text-accent-700"
                              : t.sentiment === "Negative"
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {t.sentiment}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-gray-50 px-6 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-700">What you get</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-gray-900">
              The unruly half of AI citations.
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

      {/* CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Map your community citations.
            </h2>
            <p className="mt-2 text-base text-gray-300">Free while in beta. Runs on every scan.</p>
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
