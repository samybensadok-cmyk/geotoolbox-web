import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { RobotsTxtGeneratorWidget } from "@/components/tools/robots-txt-generator-widget"

// Title base ≤46 chars so the "%s | GEO Toolbox" template (+14) lands ≤60.
export const metadata: Metadata = {
  title: "Free robots.txt Generator (AI Crawlers)",
  description:
    "Build a robots.txt from presets for WordPress, Shopify and more — with per-crawler AI directives for GPTBot, ClaudeBot and PerplexityBot. Free, no sign-up.",
  openGraph: {
    title: "Free robots.txt Generator with AI Crawler Controls",
    description:
      "Presets, custom paths, sitemap declaration, and AI crawler rules labelled by what blocking each one actually costs you. Validated as you type. Free.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/robots-txt-generator` },
}

const steps: Step[] = [
  {
    verb: "Pick",
    title: "A preset that matches your stack",
    body: "WordPress keeps /wp-admin/ out while allowing admin-ajax.php, which themes and plugins need. Shopify blocks cart, checkout and account flows. Or start from allow-everything and add your own paths.",
  },
  {
    verb: "Decide",
    title: "About the AI crawlers, deliberately",
    body: "Each one is labelled by what it does: training crawlers feed model training, search crawlers build the indexes AI assistants answer from. Blocking the second kind removes you from the answers, which is almost never what people mean to do.",
  },
  {
    verb: "Ship",
    title: "A file that passes our own tester",
    body: "The output is validated as you type against the same checks our robots.txt tester runs on other people's files — including the own-goals like blocking your own CSS or the sitemap you just declared. Copy or download, save at your site root.",
  },
]

const faqs = [
  {
    question: "Where does robots.txt go?",
    answer:
      "At the root of the host: https://example.com/robots.txt. It must be at the root — a file in a subfolder is ignored entirely. Each subdomain needs its own, so blog.example.com is not covered by the robots.txt on example.com, and http and https are technically separate origins too.",
  },
  {
    question: "Should I block GPTBot, ClaudeBot and the rest?",
    answer:
      "Decide per crawler, because they do different jobs and the labels here reflect that. Training crawlers — GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, meta-externalagent, Applebot-Extended — feed model training; blocking them keeps your content out of training data and costs you nothing in visibility. Search and user-request crawlers — OAI-SearchBot, Claude-SearchBot, PerplexityBot, ChatGPT-User, Claude-User — fetch pages to answer questions; blocking those removes you from those answers. The common mistake is blocking a search crawler while meaning to block training. One specific point worth internalizing: blocking GPTBot does NOT remove you from ChatGPT's search results, and blocking Google-Extended does NOT affect Google Search or AI Overviews ranking, though it does also govern Gemini grounding, so it isn't entirely free.",
  },
  {
    question: "Why does the WordPress preset allow admin-ajax.php?",
    answer:
      "Because that's what WordPress core does, and for good reason. Plenty of themes and plugins route front-end functionality through /wp-admin/admin-ajax.php, so blocking the whole of /wp-admin/ without that exception can stop Google from rendering parts of your pages properly. Since the longest matching rule wins, the more specific Allow beats the broader Disallow — no ordering tricks needed.",
  },
  {
    question: "Does robots.txt stop a page being indexed?",
    answer:
      "No. It controls crawling, not indexing, and conflating the two is the most expensive robots.txt mistake there is. A blocked URL can still show up in results as a bare link if it's referenced elsewhere. To keep a page out of the index, use a noindex meta tag or X-Robots-Tag header — and note the page must stay crawlable for Google to see that directive. Blocking a page in robots.txt actively prevents the noindex from working.",
  },
  {
    question: "What about Crawl-delay?",
    answer:
      "Bing still honours it. Googlebot never has, and Yandex dropped support in 2018 — so its real audience today is Bing. Google auto-tunes its crawl rate and retired the Search Console crawl-rate setting in January 2024; if Googlebot is genuinely too aggressive, serve 429/503 responses or use Google's report-a-crawl-problem form. We keep the field because it still works for Bing, and flag the caveat rather than letting you believe it does more.",
  },
  {
    question: "Should I add the Sitemap line?",
    answer:
      "Yes, essentially always. It's one line and it's how any crawler — not just the ones you've submitted to — discovers your sitemap. There's no downside and it's the single easiest thing on this page to get right. If you don't know your sitemap URL, our sitemap extractor will find it from a bare domain.",
  },
  {
    question: "Is this really free?",
    answer:
      "Yes, and there's nothing to meter — the generator runs entirely in your browser. No crawl, no API call, no sign-up, no email wall. The validation happens client-side too, using the same rule engine as our tester.",
  },
]

export default function RobotsTxtGeneratorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "robots.txt Generator",
              description:
                "A free robots.txt generator with presets for WordPress and Shopify, custom disallow paths, sitemap declaration, crawl-delay, and per-crawler AI directives for GPTBot, ClaudeBot, PerplexityBot and Google-Extended.",
              url: `${siteConfig.url}/tools/robots-txt-generator`,
              applicationSubCategory: "robots.txt generator",
            }),
            howToSchema({
              name: "How to create a robots.txt file",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "robots.txt Generator", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Free robots.txt tool
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Free robots.txt Generator
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Start from a preset, add your paths, declare your sitemap — and decide about the AI crawlers with each one
              labelled by what blocking it actually costs you. Validated as you type against the same checks our tester
              runs. Free, no sign-up, nothing metered.
            </p>
          </div>

          <div className="mt-10">
            <RobotsTxtGeneratorWidget />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            The decision this page exists for
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            &ldquo;Should I block the AI bots?&rdquo; is two different questions
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              Most robots.txt generators were written before this mattered and still offer a list of search engines from
              2015. The live question in 2026 is about AI crawlers — and the reason it goes wrong so often is that
              people treat them as one category when they&apos;re two.
            </p>
            <p>
              <strong className="text-gray-900">Training crawlers</strong> — GPTBot, ClaudeBot, CCBot —
              collect content to train models. Blocking them keeps you out of training data and costs you nothing in
              visibility, because they aren&apos;t what answers a user&apos;s question. Google-Extended is the awkward
              middle case: it governs Gemini training <em>and</em> grounding in Gemini Apps, so blocking it can cost
              you grounded Gemini answers even though it never touches Google Search ranking.
            </p>
            <p>
              <strong className="text-gray-900">Search crawlers</strong> — OAI-SearchBot, Claude-SearchBot,
              PerplexityBot — build the indexes those assistants actually search when someone asks a question. Block
              these and you disappear from the answers.
            </p>
            <p>
              The costly version of this mistake is copying a &ldquo;block AI bots&rdquo; snippet that lumps both
              together, and quietly removing yourself from ChatGPT and Perplexity results while believing you only opted
              out of training. Two specifics worth remembering:{" "}
              <strong className="text-gray-900">blocking GPTBot does not remove you from ChatGPT search</strong>, and{" "}
              <strong className="text-gray-900">blocking Google-Extended does not affect Google Search or AI Overviews</strong>.
            </p>
            <p>
              That&apos;s why every crawler in the picker is labelled by purpose. You may well want to block training
              and keep search — that&apos;s a perfectly coherent position, and it&apos;s hard to express if your tool
              won&apos;t tell you which is which.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks3Step heading="From a preset to a publishable file" steps={steps} />

      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">The format</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            What the directives actually mean
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            A robots.txt is groups of rules. Each group starts with one or more{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">User-agent:</code> lines naming the crawlers it
            applies to, followed by <code className="rounded bg-gray-200 px-1 text-gray-700">Allow:</code> and{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">Disallow:</code> paths.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 p-5 font-mono text-[12.5px] leading-relaxed text-gray-200">
{`User-agent: *
Allow: /wp-admin/admin-ajax.php
Disallow: /wp-admin/

User-agent: GPTBot
Disallow: /

Sitemap: https://example.com/sitemap.xml`}
          </pre>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            Three things that surprise people. <strong className="text-gray-900">Order doesn&apos;t matter</strong> —
            the longest matching path wins, with Allow breaking an exact-length tie, which is why the admin-ajax Allow
            above beats the broader Disallow. <strong className="text-gray-900">An empty Disallow means allow
            everything</strong>, not block everything. And a{" "}
            <strong className="text-gray-900">named group replaces the <code className="text-[0.9em]">*</code> group</strong>{" "}
            for that crawler rather than adding to it — so GPTBot above follows only its own rule.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            Once you&apos;ve published,{" "}
            <Link href="/tools/robots-txt-tester" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              test it against real URLs
            </Link>{" "}
            — and if you need the sitemap URL for that last line, the{" "}
            <Link href="/tools/sitemap-extractor" className="font-semibold text-accent-700 underline-offset-2 hover:underline">
              sitemap extractor
            </Link>{" "}
            finds it from a bare domain.
          </p>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="robots.txt, answered properly" />

      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Which AI crawlers does your current file already block?
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              The AI Crawler Checker reads your live robots.txt and reports across 34 AI crawlers — including the ones
              you didn&apos;t mean to block. Free.
            </p>
          </div>
          <Link
            href="/tools/ai-crawler-checker?utm_source=robots-generator"
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
