import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Subscribed",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}/newsletter/confirmed` },
}

export default function NewsletterConfirmedPage() {
  return (
    <section className="bg-[var(--surface-warm,theme(colors.amber.50))] px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-600">
          <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m5 10 3.5 3.5L15 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-5 text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-gray-900">
          You&apos;re subscribed.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
          Thanks for confirming — you&apos;ll hear from us when we publish something worth reading.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-accent-900 px-6 py-3 text-[14.5px] font-semibold text-white transition-all hover:bg-accent-800 active:translate-y-[1px]"
        >
          Read the blog
        </Link>
      </div>
    </section>
  )
}
