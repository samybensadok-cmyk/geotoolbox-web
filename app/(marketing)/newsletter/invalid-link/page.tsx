import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { StatusPage } from "@/components/misc-dark/status-page"

export const metadata: Metadata = {
  title: "Link no longer valid",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}/newsletter/invalid-link` },
}

export default function NewsletterInvalidLinkPage() {
  return (
    <StatusPage mark="link" title={<>That link isn&apos;t valid.</>} action={{ href: "/blog", label: "Go to the blog" }}>
      It may have already been used, or the link was copied incorrectly. You can subscribe again from any article
      on the blog.
    </StatusPage>
  )
}
