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
import { SitemapExtractorWidget } from "@/components/tools/sitemap-extractor-widget"

// Title base stays ≤46 chars so the "%s | GEO Toolbox" template (+14) lands ≤60.
export const metadata: Metadata = {
  title: "Sitemap URL Extractor & Validator (Free)",
  description:
    "Extract every URL from an XML sitemap, then check and validate it: index files walked, .xml.gz handled, live status codes, robots.txt conflicts flagged. Free.",
  openGraph: {
    title: "Free Sitemap Extractor, Checker & Validator",
    description:
      "Paste a sitemap URL or a bare domain: get every page URL out, then validate the file against the spec and check the URLs still resolve. Free, no sign-up.",
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
    question: "How do I find the sitemap of a website?",
    answer:
      "Enter the bare domain — that's the recommended input, and finding the file is the first thing the tool does. It checks robots.txt first, because a site's Sitemap: directive is its own authoritative answer and can point anywhere, including to a different host. If robots.txt is silent it probes the common locations: /sitemap.xml, /sitemap_index.xml, /wp-sitemap.xml (WordPress core since 5.5), /sitemap-index.xml and a few others. Two things worth knowing: a site: search is not a reliable way to look, since sitemaps are XML files rather than pages and are rarely surfaced that way, and if it's your own site the Search Console Sitemaps report shows what you actually submitted, which is often a different set from what robots.txt advertises.",
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
    question: "Can I use this to validate an XML sitemap?",
    answer:
      "Yes — validation runs automatically on every extraction, so the tool doubles as a sitemap checker. There are two separate things people mean by \"valid\" and it's worth splitting them. The first is whether the XML conforms to the sitemaps.org schema: required <loc>, well-formed dates, priority within 0.0–1.0, a recognized changefreq, under 50,000 URLs and 50MB. The second is whether the sitemap is telling the truth — whether those URLs actually resolve, whether they're on the host you think, and whether robots.txt contradicts them. A sitemap can be perfectly valid XML and still be useless because every URL in it 404s. This checks both, scores the result 0-100 on a published rubric, and shows the affected count with example URLs for each finding.",
  },
  {
    question: "What does the sitemap audit check?",
    answer:
      "Spec conformance and consistency. Invalid or future-dated lastmod values, priority outside 0.0–1.0, invalid changefreq, URLs on a different host than the sitemap (which crawlers ignore unless you've verified cross-submission), plain http:// URLs, URLs over 2,048 characters, files over the 50,000-URL limit, empty sitemaps, and child sitemaps referenced by an index that error or 404. Each finding comes with the affected count and example URLs, plus a 0-100 score on a published rubric: minus 20 per error, minus 7 per warning.",
  },
  {
    question: "How does the robots.txt cross-check work?",
    answer:
      "We fetch the site's robots.txt and parse it with Google's precedence rules: user-agent tokens match by equality with the documented fallback chain (Googlebot-News falls back to Googlebot), all groups declaring the winning token are merged, the longest matching rule wins, Allow beats Disallow on an exact-length tie, and wildcards, $ anchors and percent-encoding are all handled. Then we test every extracted URL against it. Any URL that appears in your sitemap while being disallowed is flagged. That combination is a genuine own-goal: you're asking Google to crawl a page and telling it not to fetch that page, which shows up in Search Console as \"Blocked by robots.txt\" — or, if Google decided to index the URL anyway on the strength of links pointing at it, as the \"Indexed, though blocked by robots.txt\" warning. We also tell you whether your sitemap is declared in robots.txt at all.",
  },
  {
    question: "How do I fix \"Indexed, though blocked by robots.txt\"?",
    answer:
      "That warning means Google indexed a URL it was never allowed to fetch — it saw the address somewhere (usually your sitemap, or a link) but robots.txt told it not to read the page. First decide which outcome you want. If the page should be in the index, remove the Disallow rule that blocks it; this tool names the exact rule, so you know which line to change. If the page should not be in the index, the fix is the opposite of what most people try: unblock it in robots.txt and add a noindex meta tag or X-Robots-Tag header instead, because Google has to be able to crawl the page to see the noindex. Leaving it blocked can keep it stuck there for a long time. Which branch you took decides what happens to your sitemap: if you unblocked the page to keep it indexed, it belongs in the sitemap and nothing more is needed. If you noindexed it, take it out — a URL that is both submitted and disallowed is the contradiction this audit flags.",
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
    <ToolsPage>
      <section className={`${tk.hero} ${kit.heroGlow}`}>
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "Sitemap URL Extractor & Validator",
              description:
                "A free server-side XML sitemap extractor, checker and validator: walks sitemap index files, decompresses .xml.gz, auto-detects the sitemap from a bare domain, validates the file against the sitemaps.org spec, cross-checks robots.txt, runs live HTTP status checks, and exports every URL as CSV, TXT or JSON.",
              url: `${siteConfig.url}/tools/sitemap-extractor`,
              applicationSubCategory: "XML sitemap extractor, checker and validator",
            }),
            howToSchema({
              name: "How to extract all URLs from an XML sitemap",
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
              { name: "Sitemap URL Extractor & Validator", href: "" },
            ]}
          />
          <div className={tk.heroHead}>
            <p className={tk.heroLabel}>
              Free sitemap tool
            </p>
            <h1 className={tk.heroTitle}>
              Free Sitemap URL Extractor &amp; Validator
            </h1>
            <div className={tk.heroRule} aria-hidden="true" />
            <p className={tk.heroLead}>
              Paste an XML sitemap URL — or just a domain — and get every page URL out. Index files are walked to their
              children, <code>.xml.gz</code>{" "}is
              decompressed, and then it does what the others don&apos;t: it doubles as a sitemap checker, validating the
              file against the spec, flagging URLs your own robots.txt blocks, and testing whether the URLs still
              resolve. Free, no sign-up.
            </p>
          </div>

          <div className={`${tk.heroTool} ${tk.mount}`}>
            <SitemapExtractorWidget />
          </div>
        </div>
      </section>

      {/* The differentiator, stated plainly — this is why the tool exists */}
      <section className={`${kit.section} ${kit.sectionBorder}`}>
        <div className={`${kit.wrap} ${tk.split}`}>
          <div className={tk.splitHead}>
            <ToolIndex>
              Why most extractors fail
            </ToolIndex>
            <h2 className={tk.title2}>
              The sitemap index problem
            </h2>
          </div>
          <div className={tk.prose}>
            <div className={tk.stack}>
              <p>
                Any site past a few hundred pages doesn&apos;t publish one sitemap. It publishes a{" "}
                <strong>sitemap index</strong> — a file whose entries are other sitemap files.
                WordPress, Shopify, Yoast and Rank Math all do this by default.
              </p>
              <p>
                Paste that index into most free extractors and you get back a tidy list of{" "}
                <em>five sitemap URLs</em>{" "}instead of your five thousand pages. The tool did what it was told; it just
                didn&apos;t do the job you wanted. You then extract each child by hand and paste the results together.
              </p>
              <p>
                <strong>This one recurses.</strong> It detects an index, fetches every child
                sitemap it points at, follows nesting up to three levels, and merges everything into one list — while
                showing you a per-file breakdown so you can see exactly which sitemap each URL came from and which files
                errored.
              </p>
              <p>
                The same applies to <code>.xml.gz</code>. A gzipped
                sitemap is a compressed <em>file</em>, not a gzip-encoded HTTP response, so browsers and many tools hand
                you binary garbage. We check for the gzip signature and inflate it before parsing.
              </p>
              <p>
                <strong>And then it keeps going.</strong>{" "}Extraction answers &ldquo;what URLs are
                in here.&rdquo; The more useful question is what&apos;s wrong with them — so the same run audits the file
                against the spec, cross-checks robots.txt for URLs you&apos;re submitting and blocking simultaneously, and
                will fire live status checks at the URLs on request. We tested the free extractors ranking for this term in
                July 2026: all of them stop at extraction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks3Step heading="From a domain to a URL list in three steps" steps={steps} />

      {/* Serves the "how do I find a site's sitemap" long-tail — the tool's bare-domain
          auto-detect literally is the answer, so the page should say so. */}
      <section className={`${kit.section} ${kit.sectionBorder}`}>
        <div className={`${kit.wrap} ${tk.split}`}>
          <div className={tk.splitHead}>
            <ToolIndex>
              Finding the file
            </ToolIndex>
            <h2 className={tk.title2}>
              How to find the sitemap of a website
            </h2>
          </div>
          <div className={tk.prose}>
            <div className={tk.stack}>
              <p>
                You don&apos;t need to guess — and you shouldn&apos;t start by trying{" "}
                <code>/sitemap.xml</code>. The authoritative answer is
                in the site&apos;s own <code>robots.txt</code>, which
                can declare any number of <code>Sitemap:</code> lines
                pointing anywhere, including another domain.
              </p>
              <p>The order that actually works, and the order this tool uses:</p>
              <ol>
                <li>
                  Read <code>example.com/robots.txt</code> and take
                  every <code>Sitemap:</code> directive it declares.
                  This is the site telling you directly.
                </li>
                <li>
                  If robots.txt is silent, probe the conventional paths:{" "}
                  <code>/sitemap.xml</code>,{" "}
                  <code>/sitemap_index.xml</code>,{" "}
                  <code>/sitemap-index.xml</code> and{" "}
                  <code>/wp-sitemap.xml</code> — the last one is
                  WordPress core since 5.5 and is the single most commonly missed location.
                </li>
                <li>
                  If you own the site, Search Console&apos;s Sitemaps report lists what you&apos;ve actually submitted,
                  which is often not the same set as what robots.txt advertises.
                </li>
              </ol>
              <p>
                Don&apos;t bother with a <code>site:</code>{" "}search.
                Sitemaps are XML files rather than pages, and they&apos;re rarely surfaced that way, so an empty result
                tells you nothing about whether one exists. Paste the bare domain above and the tool runs steps 1 and 2
                for you, then tells you which method found the file.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Format explainer — serves the informational long-tail around the tool */}
      <section className={`${kit.section} ${kit.sectionBorder} ${kit.band}`}>
        <div className={`${kit.wrap} ${tk.split}`}>
          <div className={tk.splitHead}>
            <ToolIndex>
              The format, briefly
            </ToolIndex>
            <h2 className={tk.title2}>
              What&apos;s actually inside an XML sitemap
            </h2>
          </div>
          <div className={tk.prose}>
            <p>
              A sitemap is an XML file listing the pages a site wants crawlers to know about. Each entry is a{" "}
              <code>&lt;url&gt;</code> block with a required{" "}
              <code>&lt;loc&gt;</code> (the address) and three optional
              hints: <code>&lt;lastmod&gt;</code>,{" "}
              <code>&lt;changefreq&gt;</code> and{" "}
              <code>&lt;priority&gt;</code>. This extractor pulls all
              four into the CSV.
            </p>
            <p>
              Worth knowing: Google has said it ignores{" "}
              <code>changefreq</code> and{" "}
              <code>priority</code> entirely, and treats{" "}
              <code>lastmod</code>{" "}as a signal only when it&apos;s
              demonstrably accurate. If every URL in a sitemap carries today&apos;s date, that&apos;s a CMS writing
              timestamps rather than a site reporting real changes — and it&apos;s a useful thing to spot in the export.
            </p>
            <p>
              A single sitemap file is capped at 50,000 URLs and 50MB uncompressed. Past that, sites split into multiple
              files behind an index. A 200,000-page site is therefore at least five files, and reading only the first one
              gets you a quarter of it.
            </p>
            <p>
              The sitemap and <code>robots.txt</code> are really one
              job: the sitemap says what exists, robots.txt says what may be fetched, and the damage happens where they
              disagree. If this audit flags a conflict, the{" "}
              <Link
                href="/tools/robots-txt-tester?ref=sitemap-extractor"
              >
                robots.txt tester
              </Link>{" "}
              shows which rule is responsible, and the{" "}
              <Link
                href="/tools/robots-txt-generator?ref=sitemap-extractor"
              >
                robots.txt generator
              </Link>{" "}
              will write a corrected file with the{" "}
              <code>Sitemap:</code> line declared properly.
            </p>
          </div>
        </div>
      </section>

      <FeatureFaq compact items={faqs} heading="Sitemap extraction, answered" />

      <section className={tk.close}>
        <div className={kit.wrap}>
          <div className={tk.closeCard}>
            <div>
              <h2 className={tk.closeTitle}>
                You have the URL list. Can AI crawlers actually reach those pages?
              </h2>
              <p className={tk.closeBody}>
                A sitemap only declares what exists. The AI Crawler Checker shows which of 34 AI crawlers — GPTBot,
                ClaudeBot, PerplexityBot — your robots.txt allows or blocks, with the exact line to fix. Free.
              </p>
            </div>
            <Link
              href="/tools/ai-crawler-checker?ref=sitemap-extractor"
              prefetch={false}
              className={kit.btnOutline}
            >
              Check your AI crawler access
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </ToolsPage>
  )
}
