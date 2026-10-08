import { ArchivePage, archiveMetadata } from "@/components/blog/archive-page"
import { archivePosts } from "@/lib/blog-archive"

export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams({ params: { locale } }: { params: { locale: string } }) {
  return archivePosts(locale).length ? [{ locale }] : []
}

export const generateMetadata = archiveMetadata
export default ArchivePage
