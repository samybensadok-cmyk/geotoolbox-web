import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { itemListSchema } from "@/lib/seo-schema"
import { tools } from "@/lib/tools"

export const metadata: Metadata = {
  title: "Free AI SEO Tools: llms.txt & AI Crawler",
  description:
    "Eight free AI SEO tools, no sign-up: test and build robots.txt, generate llms.txt, extract sitemap URLs, see which AI crawlers you block, score AI readiness.",
  alternates: { canonical: `${siteConfig.url}/tools` },
}

export default function ToolsIndexPage() {
  return (
    <>
      <JsonLd
        data={itemListSchema(
          tools.map((t) => ({ name: t.name, url: `/tools/${t.slug}` })),
          { name: "GEO Toolbox free tools" },
        )}
      />
      <section className="bg-[var(--surface-steel)] px-6 pt-16 pb-12 sm:pt-20">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Tools", href: "" }]} />
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Free AI SEO tools</p>
            <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Free AI SEO tools for the agentic web
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Eight tools, no sign-up, nothing metered. Check whether AI can reach your site, validate the files everyone argues about, pull every URL out of a sitemap, and see the real sub-queries engines fire. Honest readings of what matters and what doesn&apos;t.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {tools.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-accent-300"
            >
              <h2 className="text-lg font-bold tracking-tight text-gray-900 group-hover:text-accent-700">{t.name}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{t.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-700">
                Open tool
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
