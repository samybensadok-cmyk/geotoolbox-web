import styles from "@/components/tools/tool-experience.module.css"
import { toolPageCopy } from "@/lib/tool-page-copy"
import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { itemListSchema } from "@/lib/seo-schema"
import { tools } from "@/lib/tools"

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
    <>
      <JsonLd
        data={itemListSchema(
          tools.map((t) => ({ name: t.name, url: `/tools/${t.slug}` })),
          { name: "GEO Toolbox free tools" },
        )}
      />
      <section className={styles.hero}>
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs tone="dark" trail={[{ name: "Home", href: "/" }, { name: "Free tools", href: "" }]} />
          <div className={styles.intro}>
            <div>
              <p className={styles.eyebrow}>{TOOL_COUNT} free AI SEO tools</p>
              <h1>Find the gaps.<br />Make your next move.</h1>
              <p className={styles.description}>Check AI access, explore buyer questions or build the files your site needs. Pick a tool and get straight to the result.</p>
              <p className={styles.reassurance}>No account needed · No email gate</p>
            </div>
            <aside className={styles.outputs} aria-label="Where to start">
              <p>NOT SURE WHERE TO START?</p>
              <Link href="/tools/agent-readiness-scanner" className="text-lg font-semibold hover:underline">Can AI agents use your site? ↗</Link>
              <p className="mt-3 !normal-case !tracking-normal">Start with the Agent Readiness Scanner.</p>
            </aside>
          </div>
          <nav className={styles.categories} aria-label="Tool categories">
            <a href="#check">Check your site ↓</a><a href="#research">Research AI questions ↓</a><a href="#build">Build & validate files ↓</a>
          </nav>
        </div>
      </section>
      <section className={styles.hub} aria-label="Free tool directory">
        <div className={styles.hubInner}>
          {[
            { id: "check", title: "Check your site", desc: "Find access problems before you work on visibility.", slugs: ["agent-readiness-scanner", "ai-readiness", "ai-crawler-checker", "robots-txt-tester"] },
            { id: "research", title: "Research AI questions", desc: "Explore what to ask and which prompts to track.", slugs: ["keyword-to-prompts", "query-fanout"] },
            { id: "build", title: "Build & validate files", desc: "Create, inspect and export your technical SEO files.", slugs: ["robots-txt-generator", "sitemap-extractor", "llms-txt-generator", "llms-txt-checker"] },
          ].map(group => <div key={group.id} id={group.id} className={styles.group}>
            <h2>{group.title}</h2><p>{group.desc}</p>
            <div className={styles.cards}>{group.slugs.map(slug => {
              const tool = toolPageCopy[slug]
              return <Link key={slug} href={`/tools/${slug}`} className={styles.card}>
                <h3>{tool.name}</h3><p>{tool.description}</p><span>Open free tool ↗</span>
              </Link>
            })}</div>
          </div>)}
        </div>
      </section>
    </>
  )
}
