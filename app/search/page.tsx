import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { getAllPosts, getAllGlossaryTerms } from "@/lib/content"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Search",
  description: "Search GEO Toolbox guides, glossary terms, and tools.",
  // Search-results pages should not be indexed (avoids index bloat); the route
  // exists so the WebSite SearchAction has a real, working target.
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}/search` },
}

type Result = {
  type: "Tool" | "Guide" | "Glossary"
  title: string
  description: string
  url: string
}

function buildCorpus(): Result[] {
  const features: Result[] = siteConfig.featureGroups
    .flatMap((g) => g.features)
    .map((f) => ({ type: "Tool", title: f.name, description: f.desc, url: `/features/${f.slug}` }))
  const posts: Result[] = getAllPosts().map((p) => ({
    type: "Guide",
    title: p.title,
    description: p.description,
    url: `/blog/${p.slug}`,
  }))
  const glossary: Result[] = getAllGlossaryTerms().map((t) => ({
    type: "Glossary",
    title: t.term,
    description: t.definition,
    url: `/glossary/${t.slug}`,
  }))
  return [...features, ...posts, ...glossary]
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = "" } = await searchParams
  const query = q.trim()
  const needle = query.toLowerCase()
  const results = query
    ? buildCorpus().filter((r) => `${r.title} ${r.description}`.toLowerCase().includes(needle))
    : []

  return (
    <>
      <section className="bg-[var(--surface-steel,theme(colors.slate.50))] px-6 pt-14 pb-12 sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Search", href: "" }]} />
          <h1 className="mt-3 text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-gray-900">
            Search GEO Toolbox
          </h1>
          <form action="/search" method="get" role="search" className="mt-6">
            <label htmlFor="q" className="sr-only">
              Search guides, glossary, and tools
            </label>
            <div className="flex items-center gap-3 rounded-full border border-gray-300 bg-white px-5 py-3 transition-colors focus-within:border-accent-500">
              <svg className="h-5 w-5 shrink-0 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="6" />
                <path d="m14 14 3 3" strokeLinecap="round" />
              </svg>
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Guides, glossary terms, tools…"
                autoFocus
                className="w-full bg-transparent text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </form>
        </div>
      </section>

      <section className="bg-white px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {query === "" ? (
            <p className="text-[15px] text-gray-600">
              Type a query above to search across guides, glossary terms, and tools.
            </p>
          ) : results.length === 0 ? (
            <p className="text-[15px] text-gray-600">
              No results for <span className="font-semibold text-gray-900">&ldquo;{query}&rdquo;</span>. Try a
              broader term, or browse the{" "}
              <Link href="/blog" className="font-semibold text-accent-700 underline">blog</Link> or{" "}
              <Link href="/glossary" className="font-semibold text-accent-700 underline">glossary</Link>.
            </p>
          ) : (
            <>
              <p className="mb-6 text-[13px] text-gray-500">
                {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
              </p>
              <ul className="space-y-3">
                {results.map((r) => (
                  <li key={r.url}>
                    <Link
                      href={r.url}
                      className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 hover:bg-gray-50"
                    >
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700">
                        {r.type}
                      </span>
                      <span className="mt-1 block text-[16px] font-semibold leading-snug tracking-tight text-gray-900 group-hover:text-accent-700">
                        {r.title}
                      </span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-gray-600">
                        {r.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  )
}
