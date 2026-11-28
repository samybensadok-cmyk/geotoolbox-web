import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { getAllPosts } from "@/lib/content"
import { siteConfig } from "@/lib/config"
import { DarkPage, kit, Arrow } from "@/components/brand/dark-kit"
import s from "./search.module.css"

export const metadata: Metadata = {
  title: "Search",
  description: "Search GEO Toolbox guides and tools.",
  // Search-results pages should not be indexed (avoids index bloat); the route
  // exists so the WebSite SearchAction has a real, working target.
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}/search` },
}

type Result = {
  type: "Tool" | "Guide"
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
  return [...features, ...posts]
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const { q } = await searchParams
  const query = (Array.isArray(q) ? q[0] ?? "" : q ?? "").trim()
  const needle = query.toLowerCase()
  const results = query
    ? buildCorpus().filter((r) => `${r.title} ${r.description}`.toLowerCase().includes(needle))
    : []

  return (
    <DarkPage className={s.page}>
      <section className={`${s.head} ${kit.heroGlow}`}>
        <div className={kit.wrap}>
          <div className={s.crumbs}>
            <Breadcrumbs tone="dark" trail={[{ name: "Home", href: "/" }, { name: "Search", href: "" }]} />
          </div>
          <h1 className={s.title}>
            Search GEO Toolbox
          </h1>
          <form action="/search" method="get" role="search" className={s.form}>
            <label htmlFor="q" className="sr-only">
              Search guides and tools
            </label>
            <div className={s.field}>
              <svg className={s.icon} aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="6" />
                <path d="m14 14 3 3" strokeLinecap="round" />
              </svg>
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Guides, tools…"
                autoFocus
                className={s.input}
              />
            </div>
          </form>
        </div>
      </section>

      <section className={s.results}>
        <div className={kit.wrap}>
          {query === "" ? (
            <p className={s.note}>
              Type a query above to search across guides and tools.
            </p>
          ) : results.length === 0 ? (
            <p className={s.note}>
              No results for <span className={s.query}>&ldquo;{query}&rdquo;</span>. Try a
              broader term, or browse the{" "}
              <Link href="/blog" className={s.link}>blog</Link>.
            </p>
          ) : (
            <>
              <p className={s.count}>
                {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
              </p>
              <ul className={s.list}>
                {results.map((r) => (
                  <li key={r.url} className={s.item}>
                    <Link
                      href={r.url}
                      className={s.row}
                    >
                      <span className={s.text}>
                        <span className={s.type}>
                          {r.type}
                        </span>
                        <span className={s.name}>
                          {r.title}
                        </span>
                        <span className={s.desc}>
                          {r.description}
                        </span>
                      </span>
                      <span className={s.go}><Arrow /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </DarkPage>
  )
}
