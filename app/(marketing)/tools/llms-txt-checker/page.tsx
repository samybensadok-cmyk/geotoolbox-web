import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { kit, Arrow } from "@/components/brand/dark-kit"
import { ToolsPage, ToolIndex, toolsKit as tk } from "@/components/tools/tool-page"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { LlmsTxtCheckerWidget } from "@/components/tools/llms-txt-checker-widget"
import { LlmsTxtGenerator } from "@/components/tools/llms-txt-generator"

export const metadata: Metadata = {
  title: "Free llms.txt Checker & Validator",
  description:
    "Validate any llms.txt against the spec: every link resolved, a transparent 0-100 score, copy-paste fixes. Free, no sign-up.",
  openGraph: {
    title: "Free llms.txt Checker: Validate and Score Your File",
    description:
      "Validate any llms.txt against the spec, resolve every link, and score it on a published rubric. Free. Honest about what llms.txt actually does.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/llms-txt-checker` },
}

const steps: Step[] = [
  {
    verb: "Give",
    title: "A domain, or your site details",
    body: "Check mode fetches /llms.txt at any site's root, server-side. Generator mode takes your site name, a one-line summary, and your key links.",
  },
  {
    verb: "Validate",
    title: "Spec, links, and robots",
    body: "We parse the file against the llms.txt spec, resolve every linked URL to confirm it actually loads, and cross-check robots.txt for the own-goal of blocking your own index.",
  },
  {
    verb: "Fix",
    title: "A score and the exact fixes",
    body: "Spec validity, a 0-100 quality score on a published rubric, and a copy-paste fix for every issue. Or a clean generated file, ready to upload.",
  },
]

const faqs = [
  {
    question: "What is an llms.txt file?",
    answer:
      "A plain-markdown file at your site root (yourdomain.com/llms.txt) that gives AI systems a curated index of your most useful pages. The spec is small: one H1 with your site name (required), an optional one-line \"> summary\", then \"## Section\" headers listing links as - [Page](url): note. A companion /llms-full.txt can hold full page text. Keep it a lean index, not a sitemap dump.",
  },
  {
    question: "Does llms.txt help my site get cited by AI?",
    answer:
      "No evidence says so. Google states it isn't used for Search or AI Overviews, and no major AI provider confirms reading it as a signal. Treat it as cheap hygiene for the agents that do read it (some IDE assistants and custom tools), not a visibility lever. Be suspicious of anyone claiming otherwise.",
  },
  {
    question: "Is the summary blockquote required?",
    answer:
      "No. Only the H1 is required by the spec. We flag a missing blockquote as a suggestion, not an error. Validators that fail you for it are misreading the spec.",
  },
  {
    question: "How is llms.txt different from robots.txt?",
    answer:
      "Opposite jobs. robots.txt tells crawlers what they may not fetch; llms.txt suggests what's most worth reading. They interact in one important way: robots.txt can accidentally block your llms.txt or the pages it links, which quietly defeats the point. The checker verifies that pairing.",
  },
  {
    question: "What does the 0-100 quality score measure?",
    answer:
      "Implementation quality, not AI visibility. It is a transparent, published rubric: core validity (30), link health, how many linked URLs actually resolve (30), summary and sections (15), curation and size (15), and companion files and polish (10). Any spec error caps the score at 40. A missing file scores N/A, not zero. We show the full breakdown so the number is never a black box.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. The generator and single-URL checks are free with no sign-up. There's no LLM or paid API behind a basic check, so there's nothing to meter.",
  },
]

export default function LlmsTxtCheckerPage() {
  return (
    <ToolsPage>
      {/* Hero + the tool */}
      <section className={`${tk.hero} ${kit.heroGlow}`}>
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "llms.txt Checker & Validator",
              description:
                "A free server-side llms.txt validator: checks a site's /llms.txt against the spec, resolves every linked URL, scores implementation quality 0-100, and generates a spec-correct file.",
              url: `${siteConfig.url}/tools/llms-txt-checker`,
              applicationSubCategory: "llms.txt validator and generator",
            }),
            howToSchema({
              name: "How to check and validate an llms.txt file",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className={kit.wrap}>
          <Breadcrumbs
            tone="dark"
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "llms.txt Checker", href: "" },
            ]}
          />
          <div className={tk.heroHead}>
            <p className={tk.heroLabel}>
              Free llms.txt tool
            </p>
            <h1 className={tk.heroTitle}>
              Free llms.txt Checker
            </h1>
            <div className={tk.heroRule} aria-hidden="true" />
            <p className={tk.heroLead}>
              Build a spec-correct llms.txt from your site name, summary and links, then check it properly: we fetch any
              /llms.txt server-side, validate it against the spec, resolve every linked URL to confirm it loads, and score it
              0-100 on a published rubric with a copy-paste fix for every issue. Free, no sign-up, and honest about what
              llms.txt does and doesn&apos;t do.
            </p>
          </div>

          <div className={`${tk.heroTool} ${tk.mount}`}>
            <LlmsTxtCheckerWidget />
          </div>
        </div>
      </section>

      {/* Honest evidence panel — the credibility wedge */}
      <section className={`${kit.section} ${kit.sectionBorder}`}>
        <div className={`${kit.wrap} ${tk.split}`}>
          <div className={tk.splitHead}>
            <ToolIndex>Straight answer</ToolIndex>
            <h2 className={tk.title2}>
              What llms.txt actually does, and what it doesn&apos;t.
            </h2>
          </div>
          <div className={tk.prose}>
            <div className={tk.stack}>
              <p>
                <strong>It is not a ranking or citation signal.</strong>{" "}Google has stated llms.txt
                is not used for Search or AI Overviews, and no major AI provider confirms using it. Google&apos;s John Mueller:
                <em> &quot;no AI system currently uses llms.txt.&quot;</em> Anyone selling it as a ranking or citation shortcut is guessing.
              </p>
              <p>
                <strong>It is a recognized convention.</strong>{" "}Google&apos;s Chrome Lighthouse (v13.3)
                added an &quot;Agentic browsing&quot; audit that checks your llms.txt loads without a server error. Some IDE
                assistants and custom agents read it when pointed at your docs.
              </p>
              <p>
                <strong>So treat it as cheap hygiene, not a growth lever.</strong>{" "}A clean, curated
                llms.txt with working links costs little and can&apos;t hurt. This checker grades exactly that, technical hygiene,
                and is built to never overstate the payoff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (HowTo schema source) */}
      <HowItWorks3Step heading="From a URL to a scored report in three steps" steps={steps} />

      {/* What goes in an llms.txt — short explainer, links out to the article */}
      <section className={`${kit.section} ${kit.sectionBorder} ${kit.band}`}>
        <div className={`${kit.wrap} ${tk.split}`}>
          <div className={tk.splitHead}>
            <ToolIndex>The format, briefly</ToolIndex>
            <h2 className={tk.title2}>
              What goes in an llms.txt file
            </h2>
          </div>
          <div className={tk.prose}>
            <p>
              It&apos;s a plain-markdown file at your site root. The spec is small: <strong>one H1</strong> with your site name
              (the only required part), an optional <code>&gt; summary</code> line,
              then <code>## Section</code> headers listing curated links as
              <code> - [Page](https://url): note</code>, pointing to the pages
              most useful to an LLM. A companion <code>/llms-full.txt</code> can
              hold the full text. Keep it a lean index, not a sitemap dump.
            </p>
            <p>
              For the full background, adoption data, real examples, and whether it&apos;s worth your time, read our guide:{" "}
              <Link href="/blog/llms-txt">
                llms.txt: what it is and whether it&apos;s actually worth it
              </Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Generator */}
      <section id="generator" className={`${kit.section} ${kit.sectionBorder} scroll-mt-20`}>
        <div className={kit.wrap}>
          <div className={tk.split}>
            <div className={tk.splitHead}>
              <ToolIndex>Generator</ToolIndex>
              <h2 className={tk.title2}>
                Generate a spec-correct llms.txt
              </h2>
            </div>
            <div className={tk.prose}>
              <p>
                Name your site, add a summary, and list your key sections and links. It builds a valid file you can copy or
                download, then check it above. No crawl, no AI, nothing metered.
              </p>
              <p>
                Don&apos;t want to type every link?{" "}
                <Link
                  href="/tools/llms-txt-generator"
                >
                  The llms.txt generator builds one from your domain
                </Link>{" "}
                — it reads your sitemap and pulls real titles and descriptions automatically.
              </p>
            </div>
          </div>
          <div className={`${tk.mount} ${tk.mountSection}`}>
            <LlmsTxtGenerator />
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="llms.txt, answered honestly" />

      {/* Funnel CTA → Agent Readiness */}
      <section className={tk.close}>
        <div className={kit.wrap}>
          <div className={tk.closeCard}>
            <div>
              <h2 className={tk.closeTitle}>
                llms.txt is one optional file. Can AI agents reach the rest of your site?
              </h2>
              <p className={tk.closeBody}>
                Agent Readiness live-fetches any URL as six AI crawlers, renders the page like a headless agent, and shows what&apos;s
                actually blocking you. Free.
              </p>
            </div>
            <Link
              href="/features/agent-readiness?ref=llms-checker"
              prefetch={false}
              className={kit.btnLime}
            >
              Run a free Agent Readiness scan
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </ToolsPage>
  )
}
