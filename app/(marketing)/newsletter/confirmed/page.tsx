import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { StatusPage } from "@/components/misc-dark/status-page"

export const metadata: Metadata = {
  title: "Subscribed",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}/newsletter/confirmed` },
}

export default function NewsletterConfirmedPage() {
  return (
    <StatusPage mark="check" title={<>You&apos;re subscribed.</>} action={{ href: "/blog", label: "Read the blog" }}>
      Thanks for confirming — you&apos;ll hear from us when we publish something worth reading.
    </StatusPage>
  )
}
