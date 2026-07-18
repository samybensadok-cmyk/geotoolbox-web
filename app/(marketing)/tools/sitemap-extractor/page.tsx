import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { SitemapExtractorWidget } from "@/components/tools/sitemap-extractor-widget"

// Title base stays ≤46 chars so the "%s | GEO Toolbox" template (+14) lands ≤60.
export const metadata: Metadata = {
  title: "Free Sitemap URL Extractor (XML → CSV)",
  description:
    "Extract every URL from any XML sitemap, then audit it: index files walked, .xml.gz handled, live status codes, robots.txt conflicts flagged. CSV, TXT, JSON. Free.",
  openGraph: {
    title: "Free Sitemap URL Extractor: XML Sitemap to CSV",
    description:
      "Paste a sitemap URL or a domain and get every page URL out — index files walked, gzip handled, exports never gated. Free, no sign-up.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/sitemap-extractor` },
}

const steps: Step[] = [
  {
    verb: "Paste",
    title: "A sitemap URL, or just a domain",
    body: "Give it example.com/sitemap.xml directly, or just example.com. From a bare domain we read robots.txt for the site's own Sitemap: declaration first, then probe the common paths including WordPress's wp-sitemap.xml.",
  },
  {
    verb: "Walk",
    title: "Index files, nested sitemaps, gzip",
    body: "Most sites publish a sitemap index pointing at child sitemaps, not one flat file. We follow every child up to three levels deep and decompress .xml.gz automatically, so you get the whole set rather than a list of other sitemaps.",
  },
  {
    verb: "Audit",
    title: "What's wrong with it, and what still resolves",
    body: "Then the part other extractors skip. We check the sitemap against the spec and cross-reference robots.txt — flagging URLs you're asking Google to crawl and blocking at the same time, malformed lastmod values, off-host URLs and unreachable child files — and you can fire live HTTP status checks at the URLs themselves. Filter, sort, then export to CSV, TXT or JSON with no sign-up and no email wall.",
  },
]

const faqs = [
  {
    question: "How do I extract all URLs from an XML sitemap?",
    answer:
      "Paste the sitemap URL into the tool above and it returns every <loc> it finds, including URLs inside nested child sitemaps. You can also paste a bare domain — it will locate the sitemap for you. Then copy the list or export it as CSV, TXT or JSON. Nothing is gated behind a sign-up.",
  },
  {
    question: "What if the site uses a sitemap index instead of one file?",
    answer:
      "That's the normal case on any site above a few hundred pages, and it's where most extractors quietly fail — they hand you a list of child sitemap URLs instead of the actual pages. This tool detects a <sitemapindex>, fetches every child sitemap it points to (up to 200 files, three levels deep), and merges the results, showing you a per-file breakdown of where each URL came from.",
  },
  {
    question: "Does it handle gzipped .xml.gz sitemaps?",
    answer:
      "Yes. A .xml.gz sitemap is a gzipped file rather than a gzip-encoded HTTP response, so browsers and many tools won't read it. We detect the gzip signature and decompress it server-side before parsing.",
  },
  {
    question: "I don't know the sitemap URL. Can I just enter the domain?",
    answer:
      "Yes, and that's the recommended input. We check robots.txt first, because a site's Sitemap: directive is its own authoritative answer. If robots.txt is silent we probe the common locations: /sitemap.xml, /sitemap_index.xml, /wp-sitemap.xml (WordPress core since 5.5), /sitemap-index.xml and a few others.",
  },
  {
    question: "Is there a limit on how many URLs it extracts?",
    answer:
      "It reads up to 50,000 unique URLs in total, across up to 200 sitemap files. Worth being precise: the sitemaps.org spec caps a single file at 50,000, so a very large multi-file index can legally exceed our total — we tell you when we truncate rather than quietly returning a short list. There's also a 45-second wall-clock budget, which on a very large index is the limit you'll actually hit first — when it fires we return what we have and say the results are partial. The on-screen table shows the first 1,000 for browser performance; the exports contain everything extracted, and follow your filter if one is active.",
  },
  {
    question: "What can I use the extracted URL list for?",
    answer:
      "Most people arrive here mid-migration, bulk-checking status codes on the old URL set. The other common one is diffing a sitemap against what Search Console says is actually indexed — the gap between those two lists is usually where the problem is. The CSV keeps lastmod, so you can also sort by what genuinely changed most recently.",
  },
  {
    question: "What does the sitemap audit check?",
    answer:
      "Spec conformance and consistency. Invalid or future-dated lastmod values, priority outside 0.0–1.0, invalid changefreq, URLs on a different host than the sitemap (which crawlers ignore unless you've verified cross-submission), plain http:// URLs, URLs over 2,048 characters, files over the 50,000-URL limit, empty sitemaps, and child sitemaps referenced by an index that error or 404. Each finding comes with the affected count and example URLs, plus a 0-100 score on a published rubric: minus 20 per error, minus 7 per warning.",
  },
  {
    question: "How does the robots.txt cross-check work?",
    answer:
      "We fetch the site's robots.txt and parse it with Google's precedence rules: user-agent tokens match by equality with the documented fallback chain (Googlebot-News falls back to Googlebot), all groups declaring the winning token are merged, the longest matching rule wins, Allow beats Disallow on an exact-length tie, and wildcards, $ anchors and percent-encoding are all handled. Then we test every extracted URL against it. Any URL that appears in your sitemap while being disallowed is flagged. That combination is a genuine own-goal: you're asking Google to crawl a page and telling it not to fetch that page, which shows up in Search Console as \"Indexed, though blocked by robots.txt\" or as a silent skip. We also tell you whether your sitemap is declared in robots.txt at all.",
  },
  {
    question: "Can it check whether the URLs still work?",
    answer:
      "Yes, and as far as we can tell no other free sitemap extractor does. After extracting, you can run live HTTP status checks against the URLs — HEAD requests first, falling back to a ranged GET for servers that reject HEAD, following redirects and reporting the final destination and hop count. It runs in batches of 50 so a single request stays within a sensible time budget; keep clicking to work through a larger set. Status codes and redirect targets are included in the CSV and JSON exports.",
  },
  {
    question: "A site is blocking your fetcher. Can I still use the tool?",
    answer:
      "Yes. Some publishers' bot protection refuses any unfamiliar user agent — we see 403s from a number of major news sites — and when that happens we say so plainly rather than pretending the sitemap is broken. Switch to paste mode and drop the XML in directly, or upload the file (up to 4MB, which is the request-body ceiling we can accept), and everything downstream works the same: parsing, de-duplication, the audit and the exports. The one limit is that a pasted sitemap index can't be walked, since we'd have to fetch the children we were just blocked from.",
  },
  {
    question: "Does an XML sitemap affect whether AI engines cite my site?",
    answer:
      "Only indirectly. A sitemap helps crawlers discover pages; it is not a ranking or citation signal, and no AI provider documents it as one. What matters more for AI visibility is whether those pages are reachable and readable by AI crawlers at all — which is a robots.txt and rendering question, not a sitemap one. Our AI Crawler Checker covers that side.",
  },
]

export default function SitemapExtractorPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "Sitemap URL Extractor",
              description:
                "A free server-side XML sitemap URL extractor: walks sitemap index files, decompresses .xml.gz, auto-detects the sitemap from a bare domain, and exports every URL as CSV, TXT or JSON.",
              url: `${siteConfig.url}/tools/sitemap-extractor`,
              applicationSubCategory: "XML sitemap URL extractor",
            }),
            howToSchema({
              name: "How to extract all URLs from an XML sitemap",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "Sitemap URL Extractor", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Free sitemap tool
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Free Sitemap URL Extractor
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Paste an XML sitemap URL — or just a domain — and get every page URL out. Index files are walked to their
              children, <code className="rounded bg-gray-200/70 px-1 text-[0.9em] text-gray-700">.xml.gz</code> is
              decompressed, and then it does what the others don&apos;t: audits the sitemap against the spec, flags URLs
              your own robots.txt blocks, and checks whether the URLs still resolve. Free, no sign-up.
            </p>
          </div>

          <div className="mt-10">
            <SitemapExtractorWidget />
          </div>
        </div>
      </section>

      {/* The differentiator, stated plainly — this is why the tool exists */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            Why most extractors fail
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            The sitemap index problem
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              Any site past a few hundred pages doesn&apos;t publish one sitemap. It publishes a{" "}
              <strong className="text-gray-900">sitemap index</strong> — a file whose entries are other sitemap files.
              WordPress, Shopify, Yoast and Rank Math all do this by default.
            </p>
            <p>
              Paste that index into most free extractors and you get back a tidy list of{" "}
              <em>five sitemap URLs</em> instead of your five thousand pages. The tool did what it was told; it just
              didn&apos;t do the job you wanted. You then extract each child by hand and paste the results together.
            </p>
            <p>
              <strong className="text-gray-900">This one recurses.</strong> It detects an index, fetches every child
              sitemap it points at, follows nesting up to three levels, and merges everything into one list — while
              showing you a per-file breakdown so you can see exactly which sitemap each URL came from and which files
              errored.
            </p>
            <p>
              The same applies to <code className="rounded bg-gray-100 px-1 text-gray-700">.xml.gz</code>. A gzipped
              sitemap is a compressed <em>file</em>, not a gzip-encoded HTTP response, so browsers and many tools hand
              you binary garbage. We check for the gzip signature and inflate it before parsing.
            </p>
            <p>
              <strong className="text-gray-900">And then it keeps going.</strong> Extraction answers &ldquo;what URLs are
              in here.&rdquo; The more useful question is what&apos;s wrong with them — so the same run audits the file
              against the spec, cross-checks robots.txt for URLs you&apos;re submitting and blocking simultaneously, and
              will fire live status checks at the URLs on request. We tested the free extractors ranking for this term in
              July 2026: all of them stop at extraction.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks3Step heading="From a domain to a URL list in three steps" steps={steps} />

      {/* Format explainer — serves the informational long-tail around the tool */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            The format, briefly
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            What&apos;s actually inside an XML sitemap
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            A sitemap is an XML file listing the pages a site wants crawlers to know about. Each entry is a{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">&lt;url&gt;</code> block with a required{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">&lt;loc&gt;</code> (the address) and three optional
            hints: <code className="rounded bg-gray-200 px-1 text-gray-700">&lt;lastmod&gt;</code>,{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">&lt;changefreq&gt;</code> and{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">&lt;priority&gt;</code>. This extractor pulls all
            four into the CSV.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            Worth knowing: Google has said it ignores{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">changefreq</code> and{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">priority</code> entirely, and treats{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">lastmod</code> as a signal only when it&apos;s
            demonstrably accurate. If every URL in a sitemap carries today&apos;s date, that&apos;s a CMS writing
            timestamps rather than a site reporting real changes — and it&apos;s a useful thing to spot in the export.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            A single sitemap file is capped at 50,000 URLs and 50MB uncompressed. Past that, sites split into multiple
            files behind an index. A 200,000-page site is therefore at least five files, and reading only the first one
            gets you a quarter of it.
          </p>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="Sitemap extraction, answered" />

      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              You have the URL list. Can AI crawlers actually reach those pages?
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              A sitemap only declares what exists. The AI Crawler Checker shows which of 34 AI crawlers — GPTBot,
              ClaudeBot, PerplexityBot — your robots.txt allows or blocks, with the exact line to fix. Free.
            </p>
          </div>
          <Link
            href="/tools/ai-crawler-checker?utm_source=sitemap-extractor"
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
