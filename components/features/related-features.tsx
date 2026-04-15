import Link from "next/link"
import { siteConfig } from "@/lib/config"

type Slug =
  | "geo-scan"
  | "content-analyzer"
  | "content-brief"
  | "domain-overview"
  | "competitor-intel"
  | "analytics"
  | "community"

const ALL_FEATURES = siteConfig.featureGroups.flatMap((g) => g.features)

export function RelatedFeatures({ current, related }: { current: Slug; related: Slug[] }) {
  const items = related
    .map((slug) => ALL_FEATURES.find((f) => f.slug === slug))
    .filter((f): f is (typeof ALL_FEATURES)[number] => Boolean(f))

  if (items.length === 0) return null

  return (
    <section className="border-t border-gray-100 bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Keep exploring
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
              Related features
            </h2>
          </div>
          <Link
            href="/features"
            className="hidden shrink-0 text-sm font-semibold text-gray-700 transition-colors hover:text-accent-700 sm:inline-flex items-center gap-1.5"
          >
            All features
            <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <Link
              key={f.slug}
              href={`/features/${f.slug}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-[0_12px_24px_-12px_rgba(15,23,42,0.08)]"
            >
              <h3 className="text-lg font-semibold tracking-tight text-gray-900 group-hover:text-accent-700">
                {f.name}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-gray-600">{f.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-accent-700">
                Learn more
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
