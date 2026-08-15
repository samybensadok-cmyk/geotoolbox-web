"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { localePath } from "@/lib/i18n/paths"

export type LitePost = {
  slug: string
  title: string
  description: string
  date: string
  readingTime: number
  topicLabel: string
}

// Client component — no NextIntlClientProvider is mounted in this app (see
// components/layout/promo-banner.tsx for the same constraint/convention), so
// `useTranslations` isn't available here. A self-contained locale-keyed
// record, matching that file's pattern, is the fix.
const UI = {
  en: {
    searchPlaceholder: "Search articles...",
    searchAria: "Search articles",
    clearSearchAria: "Clear search",
    clearSearch: "Clear search",
    noArticlesMatch: (q: string) => (
      <>
        No articles match <span className="font-semibold text-gray-900">&ldquo;{q}&rdquo;</span>
      </>
    ),
    inTopic: (label: string) => <> in {label}</>,
    resultsFor: (q: string) => <>Results for &ldquo;{q}&rdquo;</>,
    found: (n: number) => `${n} found`,
    latest: "Latest",
    readTheArticle: "Read the article",
    read: "Read",
    minRead: (n: number) => `${n} min read`,
    min: (n: number) => `${n} min`,
    moreArticles: "More articles",
    articlesIn: (label: string) => `${label} articles`,
    total: (n: number) => `${n} total`,
  },
  fr: {
    searchPlaceholder: "Rechercher des articles...",
    searchAria: "Rechercher des articles",
    clearSearchAria: "Effacer la recherche",
    clearSearch: "Effacer la recherche",
    noArticlesMatch: (q: string) => (
      <>
        Aucun article ne correspond à <span className="font-semibold text-gray-900">&laquo;&nbsp;{q}&nbsp;&raquo;</span>
      </>
    ),
    inTopic: (label: string) => <> dans {label}</>,
    resultsFor: (q: string) => <>Résultats pour &laquo;&nbsp;{q}&nbsp;&raquo;</>,
    found: (n: number) => (n === 1 ? "1 résultat" : `${n} résultats`),
    latest: "À la une",
    readTheArticle: "Lire l’article",
    read: "Lire",
    minRead: (n: number) => `${n} min de lecture`,
    min: (n: number) => `${n} min`,
    moreArticles: "Plus d’articles",
    articlesIn: (label: string) => `Articles ${label}`,
    total: (n: number) => (n === 1 ? "1 au total" : `${n} au total`),
  },
  es: {
    searchPlaceholder: "Buscar artículos...",
    searchAria: "Buscar artículos",
    clearSearchAria: "Borrar búsqueda",
    clearSearch: "Borrar búsqueda",
    noArticlesMatch: (q: string) => (
      <>
        Ningún artículo coincide con <span className="font-semibold text-gray-900">&laquo;{q}&raquo;</span>
      </>
    ),
    inTopic: (label: string) => <> en {label}</>,
    resultsFor: (q: string) => <>Resultados de &laquo;{q}&raquo;</>,
    found: (n: number) => (n === 1 ? "1 resultado" : `${n} resultados`),
    latest: "Lo último",
    readTheArticle: "Leer el artículo",
    read: "Leer",
    minRead: (n: number) => `${n} min de lectura`,
    min: (n: number) => `${n} min`,
    moreArticles: "Más artículos",
    articlesIn: (label: string) => `Artículos de ${label}`,
    total: (n: number) => (n === 1 ? "1 en total" : `${n} en total`),
  },
} as const

function uiFor(locale: string) {
  return UI[locale as keyof typeof UI] ?? UI.en
}

function Arrow() {
  return (
    <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PostCard({ post, locale }: { post: LitePost; locale: string }) {
  const ui = uiFor(locale)
  return (
    <Link
      href={localePath("blog", post.slug, locale)}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-300 hover:shadow-[0_8px_30px_-12px_rgba(13,148,136,0.25)]"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700">
          {post.topicLabel}
        </span>
        <span className="font-mono text-[10px] text-gray-400">{ui.minRead(post.readingTime)}</span>
      </div>
      <h3 className="mt-3.5 line-clamp-2 text-[1.0625rem] font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-accent-700">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-gray-600">
        {post.description}
      </p>
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3.5">
        <time className="font-mono text-[10.5px] text-gray-500" dateTime={post.date}>
          {formatDate(post.date, locale)}
        </time>
        <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-semibold text-accent-700 opacity-0 transition-opacity group-hover:opacity-100">
          {ui.read} <Arrow />
        </span>
      </div>
    </Link>
  )
}

export function BlogResults({
  posts,
  activeLabel,
  locale,
}: {
  posts: LitePost[]
  activeLabel?: string
  locale: string
}) {
  const ui = uiFor(locale)
  const [q, setQ] = useState("")
  const query = q.trim().toLowerCase()
  const searching = query.length > 0

  const filtered = useMemo(() => {
    if (!searching) return posts
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.topicLabel.toLowerCase().includes(query),
    )
  }, [posts, query, searching])

  const featured = filtered[0]
  const sideList = filtered.slice(1, 4)
  const grid = filtered.slice(4)
  const hasSide = sideList.length > 0

  return (
    <>
      {/* Search */}
      <div className="mb-8 flex justify-center sm:justify-start">
        <div className="relative w-full max-w-md">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 3 3" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={ui.searchPlaceholder}
            aria-label={ui.searchAria}
            className="w-full rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/20"
          />
          {searching && (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label={ui.clearSearchAria}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:text-gray-700"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3.5 3.5l7 7m0-7l-7 7" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center">
          <p className="text-gray-600">
            {ui.noArticlesMatch(q.trim())}
            {activeLabel ? ui.inTopic(activeLabel) : null}.
          </p>
          <button
            type="button"
            onClick={() => setQ("")}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 hover:text-accent-800"
          >
            {ui.clearSearch} <Arrow />
          </button>
        </div>
      ) : searching ? (
        /* Searching: flat results grid */
        <>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              {ui.resultsFor(q.trim())}
            </h2>
            <span className="h-px flex-1 bg-gray-200" />
            <span className="font-mono text-[11px] text-gray-400">{ui.found(filtered.length)}</span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </>
      ) : (
        /* Default / topic view: featured command block + grid */
        <>
          <div
            className={`animate-fade-up grid grid-cols-1 overflow-hidden rounded-3xl bg-[var(--surface-ink)] shadow-[0_24px_60px_-30px_rgba(11,18,32,0.55)] ${
              hasSide ? "lg:grid-cols-[1.6fr_1fr]" : "lg:grid-cols-1"
            }`}
          >
            <Link
              href={localePath("blog", featured.slug, locale)}
              className="group flex flex-col justify-between gap-10 p-8 sm:p-10 lg:p-12"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                    {ui.latest}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
                    {featured.topicLabel}
                  </span>
                </div>
                <h2 className="mt-6 max-w-2xl text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.12] tracking-tight text-white transition-colors group-hover:text-accent-200">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-gray-300 line-clamp-3">
                  {featured.description}
                </p>
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px] text-gray-400">
                <span className="inline-flex items-center gap-1.5 font-semibold text-accent-300">
                  {ui.readTheArticle} <Arrow />
                </span>
                <span className="hidden h-px flex-1 bg-white/10 sm:block" />
                <time dateTime={featured.date}>{formatDate(featured.date, locale)}</time>
                <span>·</span>
                <span>{ui.min(featured.readingTime)}</span>
              </div>
            </Link>

            {hasSide && (
              <div className="flex flex-col divide-y divide-white/10 border-t border-white/10 lg:border-l lg:border-t-0">
                {sideList.map((post) => (
                  <Link
                    key={post.slug}
                    href={localePath("blog", post.slug, locale)}
                    className="group flex flex-1 flex-col justify-center p-6 transition-colors hover:bg-white/[0.04] sm:p-7"
                  >
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                      <span className="text-accent-300/90">{post.topicLabel}</span>
                      <span>·</span>
                      <span>{ui.min(post.readingTime)}</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug text-gray-100 transition-colors group-hover:text-accent-200">
                      {post.title}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {grid.length > 0 && (
            <>
              <div className="mt-14 mb-6 flex items-center gap-4">
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                  {activeLabel ? ui.articlesIn(activeLabel) : ui.moreArticles}
                </h2>
                <span className="h-px flex-1 bg-gray-200" />
                <span className="font-mono text-[11px] text-gray-400">{ui.total(filtered.length)}</span>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((post) => (
                  <PostCard key={post.slug} post={post} locale={locale} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
