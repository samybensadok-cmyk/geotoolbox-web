"use client"

import { useRef, useState, type ReactNode } from "react"
import { archivePath } from "@/lib/blog-pagination"
import { localePath } from "@/lib/i18n/paths"
import styles from "./archive.module.css"

export type SearchPost = { slug: string; title: string; description: string; topicSlug: string; topicLabel: string }
export type SearchLabels = { searchLabel: string; searchPlaceholder: string; loading: string; error: string; retry: string; clear: string; empty: string; results: string }

export function BlogResults({ locale, topic, labels, filters, children }: {
  locale: string; topic?: string; labels: SearchLabels; filters: ReactNode; children: ReactNode
}) {
  const [query, setQuery] = useState("")
  const [posts, setPosts] = useState<SearchPost[] | null>(null)
  const [state, setState] = useState<"idle" | "loading" | "error" | "ready">("idle")
  const pending = useRef(false)
  const input = useRef<HTMLInputElement>(null)
  async function load() {
    if (posts || pending.current) return
    pending.current = true
    setState("loading")
    try {
      const response = await fetch(`${archivePath(locale)}/search-index`)
      if (!response.ok) throw new Error("Search index unavailable")
      const data: SearchPost[] = await response.json()
      setPosts(data)
      setState("ready")
    } catch {
      setState("error")
    } finally {
      pending.current = false
    }
  }
  const normalized = query.trim().toLocaleLowerCase(locale)
  const searching = Boolean(normalized)
  const results = (posts ?? []).filter((post) => (!topic || post.topicSlug === topic) &&
    `${post.title} ${post.description} ${post.topicLabel}`.toLocaleLowerCase(locale).includes(normalized))
  return <>
    <div className={styles.toolbar}>
      {filters}
      <div className={styles.search}>
        <input ref={input} type="search" aria-label={labels.searchLabel} placeholder={labels.searchPlaceholder} value={query}
          onFocus={() => void load()} onChange={(event) => { setQuery(event.target.value); void load() }} />
        {query && <button type="button" className={styles.clear} aria-label={labels.clear} onClick={() => { setQuery(""); input.current?.focus() }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 3l8 8m0-8l-8 8" strokeLinecap="round" /></svg>
        </button>}
      </div>
    </div>
    <div role="status" aria-live="polite">
      {state === "loading" && <p className={styles.status}>{labels.loading}</p>}
      {state === "error" && <p className={styles.status}>{labels.error} <button type="button" onClick={() => void load()}>{labels.retry}</button></p>}
      {searching && state === "ready" && results.length === 0 && <p className={styles.status}>{labels.empty}</p>}
    </div>
    {searching && state === "ready" ? <section aria-label={labels.results}>
      <h2 className={styles.resultsTitle}>{labels.results} ({results.length})</h2>
      <ul className={styles.results}>{results.map((post) => <li key={post.slug}>
        <a href={localePath("blog", post.slug, locale)}><span className={styles.topic}>{post.topicLabel}</span><h3>{post.title}</h3><p>{post.description}</p></a>
      </li>)}</ul>
    </section> : children}
  </>
}
