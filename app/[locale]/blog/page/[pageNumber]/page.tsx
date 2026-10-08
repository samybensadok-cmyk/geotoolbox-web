import { contentLocales } from "@/i18n/routing"
import { ArchivePage, archiveMetadata } from "@/components/blog/archive-page"
import { archivePageParams } from "@/lib/blog-archive"

export const revalidate = 86400
export const dynamicParams = false

// Enumerate the locale here instead of reading it from the parent's params: a
// locale with no extra pages (an empty list) otherwise leaves the whole route
// with no prerendered paths.
export function generateStaticParams() {
  return contentLocales.flatMap((locale) => archivePageParams(locale).map((params) => ({ locale, ...params })))
}

export const generateMetadata = archiveMetadata
export default ArchivePage
