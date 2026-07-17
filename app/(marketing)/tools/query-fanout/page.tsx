import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { QueryFanoutWidget } from "@/components/tools/query-fanout-widget"

export const metadata: Metadata = {
  title: "Query Fan-Out Tool: See AI Sub-Queries",
  description:
    "Run a real query fan-out on your own Gemini key and see the sub-queries AI fires for your topic, clustered by intent. Free, keys stay in your browser.",
  openGraph: {
    title: "Query Fan-Out Tool: See What AI Really Searches (Free)",
    description:
      "Bring your own Gemini key and watch an engine fan a topic into its real sub-queries, live, in your browser, with a cross-engine divergence map. Free, no sign-up, keys stay local.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/query-fanout` },
}

const steps: Step[] = [
  {
    verb: "Add",
    title: "Your own API key",
    body: "Paste a free Google AI Studio (Gemini) key, and optionally a Perplexity key for a second engine. Keys stay in your browser; requests go straight to Google and Perplexity, never to a GEO Toolbox server.",
  },
  {
    verb: "Run",
    title: "A real fan-out, live",
    body: "Enter a topic. We read the actual sub-queries the engine fired while answering: Gemini's grounded searches, Perplexity's related questions. Real engine output, not an LLM guessing.",
  },
  {
    verb: "Read",
    title: "Queries, intents, divergence",
    body: "Every query tagged Fired or Related, clustered into intents. With two engines you also get the divergence map: the intents both chase versus the whitespace only one explores.",
  },
]

const faqs = [
  {
    question: "What is query fan-out?",
    answer:
      "The step where an AI engine expands your question into multiple narrower sub-queries, searches those, and synthesizes the answer from the results. Google's AI Mode, Gemini, and Perplexity all do it. It matters because citations are won at the sub-query level: answer one sub-question well and you can get cited for a topic you'd never rank for as a head keyword.",
  },
  {
    question: "Do you see or store my API key?",
    answer:
      "No. The key lives in your browser for the session and requests go straight to Google's (and Perplexity's) official endpoints. Nothing is proxied through or logged by our servers, and reloading the page clears it.",
  },
  {
    question: "Why only Gemini and Perplexity?",
    answer:
      "CORS, browser security. Those two APIs allow direct calls from a browser; OpenAI's doesn't, so a genuinely serverless free demo can't include ChatGPT. The in-app version runs four engines from our servers, on our keys, and adds search volume, page-coverage checks, and the citation landscape.",
  },
  {
    question: "Is this the same as the paid AI Query Fan-Out feature?",
    answer:
      "Same core idea, a slice of the depth. The free demo shows the real fan-out and the two-engine divergence map. The in-app feature adds more engines, real search volume, a check of how well a given URL already covers each intent, who AI currently cites for those queries, and a ranked content worklist.",
  },
  {
    question: "I ran it and got no queries. Why?",
    answer:
      "Gemini only fans a topic out when it decides to ground its answer in a web search. Very broad or very personal prompts get answered from the model directly, with no sub-queries to show. Try a more commercial, search-like topic and you'll see the fan-out.",
  },
]

export default function QueryFanoutToolPage() {
  return (
    <>
      {/* Hero + the tool */}
      <section className="relative overflow-hidden bg-[var(--surface-iris)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "AI Query Fan-Out (free BYOK demo)",
              description:
                "A free, browser-based tool that runs a real AI query fan-out on your own Gemini key — showing the actual sub-queries an engine fans out for a topic, clustered into intents with a cross-engine divergence map.",
              url: `${siteConfig.url}/tools/query-fanout`,
              applicationSubCategory: "AI query fan-out and generative engine optimization research",
            }),
            howToSchema({
              name: "How to run a free AI query fan-out with your own key",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "AI Query Fan-Out", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Free BYOK demo
            </p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Watch AI fan your topic into its real questions.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              AI engines don&apos;t search your keyword. They explode it into a spray of sharper sub-queries, search those,
              and synthesize the answer. This free query fan-out tool shows you the actual sub-queries, live, on your own
              Gemini key. Your key never touches our servers.
            </p>
          </div>

          <div className="mt-10">
            <QueryFanoutWidget />
          </div>
        </div>
      </section>

      {/* Straight answer */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Straight answer</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            The hidden sub-queries decide whether you get cited.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">An engine rarely searches your exact words.</strong> Ask it a question and it
              quietly expands that into a set of sharper sub-questions, searches those, and synthesizes the answer. Those
              hidden sub-questions, the fan-out, are what actually decide which pages get cited.
            </p>
            <p>
              <strong className="text-gray-900">This shows you the real ones.</strong> Not an LLM imagining what people might
              ask, but the genuine queries Gemini grounded its answer in, pulled live from its own grounding metadata, plus
              Perplexity&apos;s related questions if you add a key.
            </p>
            <p>
              <strong className="text-gray-900">It runs on your keys, in your browser.</strong> No account, no server round-trip,
              nothing stored. The honest way to see the layer every keyword tool is blind to.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks3Step heading="A real fan-out in three steps" steps={steps} />

      {/* Related free tools */}
      <section className="border-t border-[var(--surface-iris-border)] bg-[var(--surface-iris)] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">More free tools</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Got the questions? Make sure AI can read your answers.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            Turn the fan-out into trackable prompts with{" "}
            <Link href="/tools/keyword-to-prompts" className="font-semibold text-accent-700 underline-offset-2 hover:underline">Keyword → AI Prompts</Link>, then check the foundations: the{" "}
            <Link href="/tools/ai-readiness" className="font-semibold text-accent-700 underline-offset-2 hover:underline">AI-Readiness Score</Link>{" "}
            grades whether AI agents can reach and parse your site, and the{" "}
            <Link href="/tools/ai-crawler-checker" className="font-semibold text-accent-700 underline-offset-2 hover:underline">AI Crawler Checker</Link>{" "}
            shows which of 34 AI crawlers your robots.txt blocks. New to the idea? Read{" "}
            <Link href="/blog/what-is-ai-visibility" className="font-semibold text-accent-700 underline-offset-2 hover:underline">what AI visibility is</Link>.
          </p>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="Fan-out, keys and privacy — answered" />

      {/* Funnel CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              The full fan-out: four engines, volume, coverage, citations.
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              The in-app AI Query Fan-Out adds ChatGPT and Grok, real search volume, your page&apos;s coverage of each intent,
              the citation landscape, and a ranked content worklist, on our keys.
            </p>
          </div>
          <Link
            href="/features/query-fanout"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            See the full feature
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
