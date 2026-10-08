import { contentLocales } from "@/i18n/routing"
import { ArchivePage, archiveMetadata } from "@/components/blog/archive-page"
import { liveTopicParams, archivePageParams } from "@/lib/blog-archive"

export const revalidate = 86400
export const dynamicParams = false

// See ../../../page/[pageNumber]/page.tsx for why the locale is enumerated here.
export function generateStaticParams() {
  return contentLocales.flatMap((locale) => liveTopicParams(locale).flatMap(({ topic }) =>
    archivePageParams(locale, topic).map(({ pageNumber }) => ({ locale, topic, pageNumber }))))
}

export const generateMetadata = archiveMetadata
export default ArchivePage
