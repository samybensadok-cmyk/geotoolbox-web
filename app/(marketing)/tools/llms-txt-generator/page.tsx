import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { LlmsTxtGeneratorWidget } from "@/components/tools/llms-txt-generator-widget"

// Title base ≤46 chars so the "%s | GEO Toolbox" template (+14) lands ≤60.
export const metadata: Metadata = {
  title: "Free llms.txt Generator (No Sign-Up)",
  description:
    "Generate a spec-correct llms.txt from your domain. Reads your sitemap, respects robots.txt, indexes up to 50 pages, and builds llms-full.txt too. Free.",
  openGraph: {
    title: "Free llms.txt Generator: Build It From Your Domain",
    description:
      "Paste a domain and get a curated, spec-correct llms.txt — no typing every link by hand. Plus llms-full.txt. Free, no sign-up.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/llms-txt-generator` },
}

const steps: Step[] = [
  {
    verb: "Paste",
    title: "Just your domain",
    body: "No need to know where anything lives. We read your robots.txt, find your sitemap, and use it as the source of what your site considers important — falling back to a homepage link harvest if there's no sitemap.",
  },
  {
    verb: "Curate",
    title: "The pages worth pointing at",
    body: "We fetch up to 50 pages for their real titles and descriptions, skip the pages an AI index has no business listing (login, cart, tag archives, pagination), drop localized duplicates, and spread the selection across sections instead of letting one blog fill the file.",
  },
  {
    verb: "Publish",
    title: "A file you can edit and ship",
    body: "You get a spec-correct llms.txt to copy or download, optionally with a companion llms-full.txt containing page text. Edit it down before publishing — a short, sharp index beats a complete one.",
  },
]

const faqs = [
  {
    question: "What is an llms.txt file?",
    answer:
      "A plain-markdown file at your site root (yourdomain.com/llms.txt) that gives AI systems a curated index of your most useful pages. The spec is small: one H1 with your site name (the only required part), an optional one-line \"> summary\", then \"## Section\" headers listing links as - [Page](url): note. A companion /llms-full.txt can hold full page text.",
  },
  {
    question: "Does llms.txt actually help me get cited by AI?",
    answer:
      "There's no evidence that it does, and we'd rather say so than sell you something. Google's docs say you don't need any AI-specific file to appear in AI features, and John Mueller said in June 2025 that \"no AI system currently uses llms.txt\" — an informal comment rather than documented policy, but nobody has since documented the opposite. What it is: a recognized convention that some IDE assistants and custom agents read, and Chrome's Lighthouse 13.3 ships an agentic-browsing audit that validates its format. Treat it as cheap hygiene, not a growth lever. If you want the thing that genuinely affects whether AI can use your site, that's crawler access and rendering — our AI Crawler Checker covers it.",
  },
  {
    question: "How does this differ from typing the file by hand?",
    answer:
      "Speed and accuracy on the boring part. Hand-writing means finding every URL, copying titles, and keeping it current. This reads your sitemap, pulls the real titles and meta descriptions from the live pages, and groups them into sections automatically. The curation judgment is still yours — that's why the output is editable text rather than something we publish for you. If you'd rather build it link by link, the manual builder on the checker page does exactly that.",
  },
  {
    question: "Why did it leave out some of my pages?",
    answer:
      "By design, and it tells you what it dropped. llms.txt is meant to be a curated index, not a sitemap dump, so we cap at 50 pages and spread them across sections rather than letting one section dominate. We also skip pages that don't belong in an AI index — login and account flows, carts and checkouts, tag and category archives, pagination stubs — and skip localized duplicates like /fr/ and /de/, since they're translations of pages already listed. Anything a site disallows in robots.txt is skipped too.",
  },
  {
    question: "Do you respect robots.txt when fetching my pages?",
    answer:
      "Yes, and it would be indefensible not to — we also publish a tool that audits crawler access. We parse your robots.txt with Google's precedence rules and skip any URL it disallows, then report how many we skipped. Our fetcher identifies itself as GeoToolboxLlmsTxtGenerator with a link back to this page.",
  },
  {
    question: "What is llms-full.txt, and should I publish one?",
    answer:
      "It's the companion file holding actual page text rather than just links, so an agent can read your content without fetching every page. Tick the box and we'll build one, at a lower page count since it's much heavier. Whether to publish it is a judgment call: it's useful for documentation sites where you want assistants working from your real text, and mostly pointless for a marketing site whose pages are already fast to fetch.",
  },
  {
    question: "Is there a page limit, and is it really free?",
    answer:
      "50 pages for llms.txt, 20 for llms-full.txt, and there's a 45-second time budget on very large sites. Free with no sign-up and no email wall. There's no LLM or paid API behind this — it's your sitemap plus some page fetches — so there's nothing for us to meter.",
  },
]

export default function LlmsTxtGeneratorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "llms.txt Generator",
              description:
                "A free llms.txt generator: reads a site's sitemap, respects robots.txt, fetches page titles and descriptions, and builds a spec-correct llms.txt plus an optional llms-full.txt.",
              url: `${siteConfig.url}/tools/llms-txt-generator`,
              applicationSubCategory: "llms.txt generator",
            }),
            howToSchema({
              name: "How to generate an llms.txt file for your website",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "llms.txt Generator", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Free llms.txt tool
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Free llms.txt Generator
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Paste your domain and get a spec-correct llms.txt built from your own sitemap — real titles, real
              descriptions, grouped into sections, with the pages that don&apos;t belong in an AI index left out. Free, no
              sign-up, and honest about what llms.txt does and doesn&apos;t do.
            </p>
          </div>

          <div className="mt-10">
            <LlmsTxtGeneratorWidget />
          </div>
        </div>
      </section>

      {/* The honesty panel — the credibility wedge, and the thing competitors won't say */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Straight answer</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Read this before you spend an afternoon on llms.txt
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">It is not a ranking or citation signal.</strong> Google&apos;s Search
              Central docs say you don&apos;t need to create any AI-specific file or markup to appear in AI features, and
              Googlers have said llms.txt specifically isn&apos;t used — John Mueller, June 2025:{" "}
              <em>&quot;FWIW no AI system currently uses llms.txt.&quot;</em> Worth being precise: that&apos;s an informal
              comment, not a documented policy, and Google&apos;s official pages never name the file. Either way, anyone
              selling it as a shortcut to getting cited is guessing.
            </p>
            <p>
              <strong className="text-gray-900">It is a real convention with real readers.</strong> Chrome&apos;s
              Lighthouse 13.3 added an agentic-browsing audit that validates your llms.txt&apos;s format — it wants an H1
              and at least one markdown link, and fails the audit outright if the file returns a 5xx. Not having one at
              all is marked not-applicable rather than failed. Some IDE assistants and custom agents read it too.
            </p>
            <p>
              There&apos;s a genuine tension there worth noticing: Search says you don&apos;t need the file, while
              Chrome ships an audit that grades it.
            </p>
            <p>
              <strong className="text-gray-900">So: cheap hygiene, not a growth lever.</strong> A clean, curated file
              with working links costs you ten minutes and can&apos;t hurt. That&apos;s the honest case for it, and it&apos;s
              why this tool is free and takes one input — spending an afternoon hand-writing one would be the actual
              mistake.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks3Step heading="From a domain to a publishable file in three steps" steps={steps} />

      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">The format</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            What a good llms.txt looks like
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            One H1 with your site name (the only part the spec requires), an optional one-line summary as a blockquote,
            then section headers with curated links:
          </p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 p-5 font-mono text-[12.5px] leading-relaxed text-gray-200">
{`# Acme Docs

> Everything you need to build on Acme.

## Getting started

- [Quickstart](https://acme.com/docs/quickstart): Ship your first integration in ten minutes.
- [Authentication](https://acme.com/docs/auth): API keys, OAuth, and rotation.

## Reference

- [API reference](https://acme.com/docs/api): Every endpoint, with examples.`}
          </pre>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            The most common mistake is treating it as a second sitemap. It isn&apos;t one — a 4,000-link llms.txt is
            worse than a 30-link one, because the whole value is in having chosen. That&apos;s why this generator caps
            what it indexes and hands you editable text rather than publishing for you.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            For the full background, adoption data and whether it&apos;s worth your time, read{" "}
            <Link href="/blog/llms-txt" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              llms.txt: what it is and whether it&apos;s actually worth it
            </Link>. When you&apos;ve published,{" "}
            <Link href="/tools/llms-txt-checker" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              validate it with the llms.txt checker
            </Link>{" "}
            — it resolves every link and scores the result.
          </p>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="llms.txt, answered honestly" />

      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              llms.txt is one optional file. Can AI agents reach the rest of your site?
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              The AI Crawler Checker shows which of 34 AI crawlers — GPTBot, ClaudeBot, PerplexityBot — your robots.txt
              allows or blocks, with the exact line to fix. That one actually moves the needle. Free.
            </p>
          </div>
          <Link
            href="/tools/ai-crawler-checker?utm_source=llms-generator"
            prefetch={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            Check your AI crawler access
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
