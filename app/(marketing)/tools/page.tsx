import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { itemListSchema } from "@/lib/seo-schema"
import { tools } from "@/lib/tools"
import { kit, Arrow } from "@/components/brand/dark-kit"
import { ToolsPage, toolsKit as tk } from "@/components/tools/tool-page"

// Spelled out from the registry so the count can't drift when a tool is added — used by
// BOTH the meta description and the on-page subhead, so the two can't desync either.
// This counts FREE tools only: not the 13 paid platform features in
// siteConfig.featureGroups, and not the 8 LLM engines a GEO Scan covers. Those three
// numbers get conflated easily; don't.
const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"]
const TOOL_COUNT = NUMBER_WORDS[tools.length] ?? String(tools.length)

export const metadata: Metadata = {
  title: "Free AI SEO Tools: robots.txt & llms.txt",
  description: `${TOOL_COUNT} free AI SEO tools, no sign-up: test and build robots.txt, generate llms.txt, extract and validate sitemaps, and see which AI crawlers you block.`,
  alternates: { canonical: `${siteConfig.url}/tools` },
}

export default function ToolsIndexPage() {
  return (
    <ToolsPage>
      <JsonLd
        data={itemListSchema(
          tools.map((t) => ({ name: t.name, url: `/tools/${t.slug}` })),
          { name: "GEO Toolbox free tools" },
        )}
      />
      <section className={`${tk.hero} ${tk.dirHero} ${kit.heroGlow}`}>
        <div className={kit.wrap}>
          <Breadcrumbs tone="dark" trail={[{ name: "Home", href: "/" }, { name: "Tools", href: "" }]} />
          <div className={tk.heroHead}>
            <p className={tk.heroLabel}>Free AI SEO tools</p>
            <h1 className={tk.heroTitle}>
              Free AI SEO tools for the agentic web
            </h1>
            <div className={tk.heroRule} aria-hidden="true" />
            <p className={tk.heroLead}>
              {TOOL_COUNT}{" "}free tools, no sign-up, nothing metered. Check whether AI can reach your site, validate the files everyone argues about, pull every URL out of a sitemap, and see the real sub-queries engines fire. Honest readings of what matters and what doesn&apos;t.
            </p>
          </div>
        </div>
      </section>

      <section className={tk.dirSection}>
        <div className={kit.wrap}>
          <ol className={tk.dir}>
            {tools.map((t, i) => (
              <li key={t.slug} className={tk.dirItem}>
                <Link href={`/tools/${t.slug}`} className={tk.dirRow}>
                  <span className={tk.dirNum} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <div className={tk.dirText}>
                    <h2 className={tk.dirName}>{t.name}</h2>
                    <p className={tk.dirDesc}>{t.desc}</p>
                  </div>
                  <span className={tk.dirOpen}>
                    Open tool
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </ToolsPage>
  )
}
