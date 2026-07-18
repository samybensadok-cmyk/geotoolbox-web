import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { RobotsTxtTesterWidget } from "@/components/tools/robots-txt-tester-widget"

// Title base ≤46 chars so the "%s | GEO Toolbox" template (+14) lands ≤60.
export const metadata: Metadata = {
  title: "Free robots.txt Tester & Checker",
  description:
    "Free robots.txt checker: test any URL against a site's robots.txt with Google's real matching rules, and see which rule decided each verdict.",
  openGraph: {
    title: "Free robots.txt Tester & Checker: What's Blocked",
    description:
      "Google retired its robots.txt tester. This replaces it: real Googlebot precedence rules, per-crawler verdicts, and the exact matching line. Free.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/robots-txt-tester` },
}

const steps: Step[] = [
  {
    verb: "Fetch",
    title: "A domain, or paste the file",
    body: "Give a domain and we fetch its live robots.txt server-side, or paste a draft you haven't published yet — the second is how you check a change before it costs you traffic.",
  },
  {
    verb: "Test",
    title: "Real URLs against real crawlers",
    body: "List the paths you care about and pick the crawlers: Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, Google-Extended. Every combination gets a verdict.",
  },
  {
    verb: "Understand",
    title: "Which rule decided, and why",
    body: "Each verdict shows the exact line that produced it, and we tell you which group a crawler actually follows — because a named group replaces the * group rather than adding to it, which is the mistake we see most.",
  },
]

const faqs = [
  {
    question: "Google removed the robots.txt tester. Is this the same thing?",
    answer:
      "It does the same job. Google retired the robots.txt tester in Search Console, but the need didn't go anywhere — you still have to know whether a rule blocks a URL before you publish it. This implements the same matching behaviour Googlebot uses: user-agent tokens matched by equality with the documented fallback chain, all groups for the winning token merged, longest matching rule wins, Allow beats Disallow on an exact-length tie, plus wildcard and $ anchor support and percent-encoding normalization. Search Console still has a robots.txt report showing the fetched file and its status; what it no longer has is the interactive URL tester.",
  },
  {
    question: "How do I find and read a site's robots.txt?",
    answer:
      "It's always at the root of the host: example.com/robots.txt, straight in a browser. A file in a subfolder is ignored, and each subdomain has its own — blog.example.com is not covered by the robots.txt on example.com, which is a common blind spot. Reading it is where it gets slippery, because the file doesn't execute top to bottom the way it looks. Find the group whose User-agent names your crawler (or the * group if none does), remembering that a named group replaces the * group rather than adding to it, then merge every group declaring that same token. Within that set the longest matching path wins, not the first — so order genuinely doesn't matter, contrary to a lot of advice. Rather than doing that by hand, paste the domain above with the URLs you care about and the tool shows you the resolved group and the deciding rule for each one.",
  },
  {
    question: "Why does my named crawler ignore the rules in the * group?",
    answer:
      "Because that's the spec, and it surprises nearly everyone. A crawler obeys exactly one user-agent token — the most specific one that names it — and every group declaring that token is merged into the set it follows. If your file has a `User-agent: *` group and a `User-agent: Googlebot` group, Googlebot follows the Googlebot rules and ignores the * group entirely — the two are not combined. So adding `User-agent: Googlebot / Disallow: /private/` while your * group blocks /admin/ means Googlebot can now crawl /admin/. This tool shows which group each crawler actually follows so you can see it happening.",
  },
  {
    question: "What does 'longest match wins' mean in practice?",
    answer:
      "When several rules match a URL, the one with the longest path wins — not the first, and not the last. So `Disallow: /private/` plus `Allow: /private/public-page` means that one page is crawlable, because the Allow path is longer. If two matching rules are exactly the same length, Allow wins. This is why rule order in robots.txt genuinely doesn't matter, which contradicts a lot of advice you'll read.",
  },
  {
    question: "Does robots.txt keep a page out of Google?",
    answer:
      "No, and this is the most expensive misunderstanding in the format. robots.txt controls crawling, not indexing. A blocked URL can still appear in results — usually as a bare link with no description — if Google finds it linked elsewhere. To keep a page out of the index you need a noindex meta tag or X-Robots-Tag header, and the page must be crawlable for Google to see that directive. Blocking a page you also want deindexed is self-defeating: the crawler can't fetch the noindex you added.",
  },
  {
    question: "Should I block GPTBot, ClaudeBot and the other AI crawlers?",
    answer:
      "It depends which one, and the distinction matters more than the decision. Training crawlers (GPTBot, ClaudeBot, CCBot) feed model training — blocking them keeps your content out of training data and won't remove you from any AI answer given today, since those are retrieved live. What you give up is slower-burning: future model generations know less about you natively, which shows when an assistant answers from memory instead of browsing. Google-Extended is the awkward middle case: it governs Gemini training and Gemini grounding, so blocking it can cost you grounded Gemini answers, though it never affects Google Search or AI Overviews ranking. Search crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot) build the indexes those assistants answer from — blocking those removes you from the answers. People routinely block the second kind while meaning to block the first. Our generator labels each crawler by purpose for exactly this reason, and the AI Crawler Checker shows what your current file does across 34 of them.",
  },
  {
    question: "Is a missing robots.txt a problem?",
    answer:
      "No. A 404 on /robots.txt means everything is allowed, which is the correct outcome for most sites. You need the file when you have something specific to keep crawlers out of, or when you want to declare your sitemap. An empty file and no file behave identically.",
  },
  {
    question: "Do you handle Crawl-delay and wildcards?",
    answer:
      "Yes to both. Wildcards (*) and end-anchors ($) are matched with Google's own linear algorithm rather than a regex, so pathological patterns can't hang the tool. Crawl-delay is parsed and reported, with an important caveat: Bing still honours it, Googlebot never has, and Yandex dropped support in 2018 — so on most sites the line does nothing. Google auto-tunes its crawl rate and retired the Search Console crawl-rate setting in January 2024, so if Googlebot is genuinely too aggressive the levers are 429/503 responses or Google's report-a-crawl-problem form.",
  },
]

export default function RobotsTxtTesterPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "robots.txt Tester & Checker",
              description:
                "A free robots.txt checker and tester: fetches any site's robots.txt, tests URLs against it per crawler using Google's real precedence rules, shows the matching rule, and validates the file for costly mistakes.",
              url: `${siteConfig.url}/tools/robots-txt-tester`,
              applicationSubCategory: "robots.txt tester and checker",
            }),
            howToSchema({
              name: "How to test whether robots.txt blocks a URL",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "robots.txt Tester & Checker", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Free robots.txt tool
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Free robots.txt Tester &amp; Checker
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Google retired the robots.txt tester in Search Console. This does the same job: check any URL against a
              live or draft robots.txt, per crawler, with Google&apos;s real precedence rules — and see the exact line
              that decided each verdict. Free, no sign-up.
            </p>
          </div>

          <div className="mt-10">
            <RobotsTxtTesterWidget />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
            The rule everyone gets wrong
          </p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            A named group replaces the <code className="text-[0.85em]">*</code> group
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              A crawler follows <strong className="text-gray-900">exactly one group</strong> — the most specific one
              that names it. The rules aren&apos;t combined. So this file does not do what it looks like it does:
            </p>
            <pre className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 p-5 font-mono text-[12.5px] leading-relaxed text-gray-200">
{`User-agent: *
Disallow: /admin/

User-agent: Googlebot
Disallow: /private/`}
            </pre>
            <p>
              Googlebot follows the second group only, so <code className="rounded bg-gray-100 px-1 text-gray-700">/admin/</code>{" "}
              is now <em>crawlable by Google</em> — the exact opposite of the intent. Every other crawler still respects
              it. To block both, the Googlebot group has to repeat the <code className="rounded bg-gray-100 px-1 text-gray-700">/admin/</code>{" "}
              rule.
            </p>
            <p>
              There&apos;s a second half to this that trips up plugin-heavy sites: if the same user-agent appears in{" "}
              <em>several</em> groups, those groups <strong className="text-gray-900">are</strong> merged. WordPress
              sites often end up with two separate <code className="rounded bg-gray-100 px-1 text-gray-700">User-agent: *</code>{" "}
              blocks because a plugin appended its own, and both sets of rules apply. Tools that read only the first
              block silently under-report what&apos;s blocked.
            </p>
            <p>
              This tester shows you which group each crawler resolves to, and the exact rule behind every verdict, so
              neither case has to be taken on faith.
            </p>
          </div>
        </div>
      </section>

      <HowItWorks3Step heading="From a domain to a per-crawler verdict" steps={steps} />

      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Worth knowing</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            robots.txt controls crawling, not indexing
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            Blocking a URL asks crawlers not to <em>fetch</em> it. It does not remove it from search results. A blocked
            page that&apos;s linked from elsewhere can still be listed — typically as a bare URL with no description,
            because the crawler was never allowed to read the page it&apos;s describing.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            The trap: to deindex a page you need{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700">noindex</code>, and Google has to{" "}
            <em>crawl the page</em> to see it. Blocking the page in robots.txt prevents that. If you want something gone
            from the index, allow crawling and add noindex — then block it later if you like, once it&apos;s dropped.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            And robots.txt is never a security control. It is a public file listing the paths you&apos;d rather people
            didn&apos;t visit, which is closer to a map than a lock.
          </p>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="robots.txt, answered properly" />

      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              Need to write the file, not just test it?
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              The robots.txt generator builds one from presets — WordPress, Shopify, block-admin — with per-crawler AI
              directives labelled by what blocking each one actually costs you. Free.
            </p>
          </div>
          <Link
            href="/tools/robots-txt-generator?utm_source=robots-tester"
            prefetch={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            Generate a robots.txt
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
