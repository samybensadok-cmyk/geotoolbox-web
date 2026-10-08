import { archivePath, parseArchivePage } from "./blog-pagination"
import { topicBySlug } from "./blog-topics"

export type ArchiveRedirect = { status: 308; location: string } | { status: 404 }

/** Archive paths only: never intercept an article, thumbnail, or search index. */
export function archiveRedirect(url: URL): ArchiveRedirect | undefined {
  const match = /^\/(?:(en|fr|es|de|nl)\/)?blog(?:\/topic\/([^/]+))?(?:\/page\/([^/]+))?$/.exec(url.pathname)
  if (!match) return
  const [, prefix, topic, rawPage] = match
  const locale = prefix ?? "en"
  const query = url.searchParams
  let page = rawPage === undefined ? 1 : parseArchivePage(rawPage)
  if (page === undefined) return { status: 404 }
  let targetTopic: string | undefined = topic
  const hasLegacy = ["topic", "tag", "page"].some((key) => query.has(key))
  if (query.has("topic")) {
    targetTopic = topicBySlug(query.get("topic") ?? "")?.slug
    page = 1
  } else if (query.has("tag")) {
    targetTopic = undefined
    page = 1
  } else if (query.has("page")) {
    page = parseArchivePage(query.get("page") ?? "")
    if (page === undefined) return { status: 404 }
  }
  const path = archivePath(locale, page, targetTopic)
  if (hasLegacy || path !== url.pathname) {
    const remaining = new URLSearchParams(query)
    for (const key of ["topic", "tag", "page"]) remaining.delete(key)
    return { status: 308, location: path + (remaining.size ? `?${remaining}` : "") }
  }
}
