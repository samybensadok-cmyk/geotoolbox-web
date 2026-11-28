import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { StatusPage } from "@/components/misc-dark/status-page"

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}/newsletter/unsubscribed` },
}

export default function NewsletterUnsubscribedPage() {
  return (
    <StatusPage mark="mail" title={<>You&apos;re unsubscribed.</>} action={{ href: "/blog", label: "Back to the blog" }}>
      You won&apos;t get any more emails from the GEO Toolbox newsletter. Changed your mind? You can resubscribe
      anytime from the blog.
    </StatusPage>
  )
}
