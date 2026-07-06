import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Link no longer valid",
  robots: { index: false, follow: true },
  alternates: { canonical: `${siteConfig.url}/newsletter/invalid-link` },
}

export default function NewsletterInvalidLinkPage() {
  return (
    <section className="bg-white px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-gray-900">
          That link isn&apos;t valid.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
          It may have already been used, or the link was copied incorrectly. You can subscribe again from any article
          on the blog.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-accent-900 px-6 py-3 text-[14.5px] font-semibold text-white transition-all hover:bg-accent-800 active:translate-y-[1px]"
        >
          Go to the blog
        </Link>
      </div>
    </section>
  )
}
