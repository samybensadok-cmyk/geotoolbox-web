export type ArchiveShape = "main" | "topic"

export function pageCapacity(page: number, shape: ArchiveShape): number {
  return shape === "main" && page === 1 ? 13 : 12
}

export function pageCount(count: number, shape: ArchiveShape): number {
  if (count <= 0) return 0
  return 1 + Math.ceil(Math.max(0, count - pageCapacity(1, shape)) / 12)
}

/** Accept decimal integers only; callers redirect leading zeros to this form. */
export function parseArchivePage(value: string): number | undefined {
  const normalized = value.replace(/^0+/, "")
  if (!/^[1-9][0-9]*$/.test(normalized)) return undefined
  const page = Number(normalized)
  return Number.isSafeInteger(page) ? page : undefined
}

export function paginate<T>(items: readonly T[], page: number, shape: ArchiveShape): T[] {
  if (!Number.isInteger(page) || page < 1 || page > pageCount(items.length, shape)) return []
  const offset = page === 1 ? 0 : pageCapacity(1, shape) + (page - 2) * 12
  return items.slice(offset, offset + pageCapacity(page, shape))
}

export function paginationParams(count: number, shape: ArchiveShape) {
  return Array.from({ length: Math.max(0, pageCount(count, shape) - 1) }, (_, i) => ({ pageNumber: String(i + 2) }))
}

export function archivePath(locale: string, page = 1, topic?: string): string {
  const base = `${locale === "en" ? "" : `/${locale}`}/blog${topic ? `/topic/${topic}` : ""}`
  return page === 1 ? base : `${base}/page/${page}`
}

export function pagerItems(current: number, total: number): Array<number | "ellipsis"> {
  const pages = Array.from(new Set([1, total, ...Array.from({ length: 5 }, (_, i) => current + i - 2)]))
    .filter((page) => page >= 1 && page <= total).sort((a, b) => a - b)
  return pages.flatMap((page, i): Array<number | "ellipsis"> =>
    i && page - pages[i - 1] > 1 ? ["ellipsis", page] : [page])
}
