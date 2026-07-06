import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}/newsletter/unsubscribed` },
}

export default function NewsletterUnsubscribedPage() {
  return (
    <section className="bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-gray-900">
          You&apos;re unsubscribed.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
          You won&apos;t get any more emails from the GEO Toolbox newsletter. Changed your mind? You can resubscribe
          anytime from the blog.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-6 py-3 text-[14.5px] font-semibold text-gray-900 transition-colors hover:border-accent-300 hover:text-accent-700"
        >
          Back to the blog
        </Link>
      </div>
    </section>
  )
}
