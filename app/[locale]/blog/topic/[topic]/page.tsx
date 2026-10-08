import { contentLocales } from "@/i18n/routing"
import { ArchivePage, archiveMetadata } from "@/components/blog/archive-page"
import { liveTopicParams } from "@/lib/blog-archive"

export const revalidate = 86400
export const dynamicParams = false

// Enumerate the locale here, never from the parent's params: a locale with no live
// hub would return [] and leave the whole route with no prerendered paths.
export function generateStaticParams() {
  return contentLocales.flatMap((locale) => liveTopicParams(locale).map((params) => ({ locale, ...params })))
}

export const generateMetadata = archiveMetadata
export default ArchivePage
