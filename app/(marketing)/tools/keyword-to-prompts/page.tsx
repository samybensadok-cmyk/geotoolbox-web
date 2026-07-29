import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { FeatureFaq } from "@/components/features/feature-faq"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { KeywordToPromptsWidget } from "@/components/tools/keyword-to-prompts-widget"

export const metadata: Metadata = {
  title: "Keyword to AI Prompts Generator (Free)",
  description:
    "Turn any keyword into ~15 conversational AI prompts across 6 intents, with brand-surfacing prompts flagged for tracking. Free, no sign-up.",
  openGraph: {
    title: "Keyword to AI Prompts Generator: Free AI Visibility Tool",
    description:
      "Paste a keyword, get ~15 AI prompts across 6 intents, and see which ones make AI recommend brands. The honest bridge from SEO keywords to trackable AI prompts. Free.",
  },
  alternates: { canonical: `${siteConfig.url}/tools/keyword-to-prompts` },
}

const steps: Step[] = [
  {
    verb: "Give",
    title: "A keyword or topic",
    body: "Enter what your customers actually search for: \"standing desk\", \"best CRM for startups\", \"running shoes for flat feet\". Optionally add your brand to keep it out of the unbranded prompts.",
  },
  {
    verb: "Generate",
    title: "~15 prompts across 6 intents",
    body: "We write the conversational questions real people ask AI (recommendation, comparison, how-to, research, validation, transactional), not keyword fragments. Each carries a real persona or constraint.",
  },
  {
    verb: "Track",
    title: "The ones that surface brands",
    body: "Every prompt is flagged: would an AI answer it by recommending named brands? Those are the ones worth tracking, because that's where visibility is winnable.",
  },
]

const faqs = [
  {
    question: "What's the difference between a keyword and an AI prompt?",
    answer:
      "A keyword is a 2-4 word fragment built for a search box. A prompt is a full question built for a conversation, longer, with a persona and constraints (\"for a small team\", \"under $300\", \"for flat feet\"). AI engines answer prompts, so measuring your AI visibility against keywords measures the wrong thing.",
  },
  {
    question: "Which of the generated prompts should I track?",
    answer:
      "The flagged ones, the prompts an AI answers by recommending or comparing named brands. Those are the answers you can appear in. Definitional and how-to prompts mostly return brand-free explanations; useful for content planning, not for visibility tracking.",
  },
  {
    question: "How accurate are the intent labels?",
    answer:
      "The six intent labels are inferred by the AI model, so treat them as a strong hint, not gospel. The brand-surfacing flag is different: a deterministic rule, consistent every time. The paid AI Visibility Tracker validates intent against real search-intent data and ranks prompts by estimated AI-search demand.",
  },
  {
    question: "How is this different from a generic AI prompt generator?",
    answer:
      "Generic generators produce text. This one is built for AI visibility: six visibility-relevant intents, your own brand excluded from unbranded prompts so tracking stays honest, and a deterministic brand-surfacing flag that separates trackable prompts from context. It exists to feed a tracker, not to write your prompts for you.",
  },
  {
    question: "Is it free?",
    answer:
      "Generating prompts is free, no sign-up. You only create an account if you want to run the prompts through the AI engines over time in the AI Visibility Tracker.",
  },
]

export default function KeywordToPromptsPage() {
  return (
    <>
      {/* Hero + the tool */}
      <section className="relative overflow-hidden bg-[var(--surface-steel)] px-6 pt-16 pb-16 sm:pt-20 sm:pb-20">
        <JsonLd
          data={[
            softwareApplicationSchema({
              name: "Keyword to AI Prompts Generator",
              description:
                "A free tool that turns one keyword into ~15 conversational AI prompts across six intents and flags which ones surface brand recommendations — the bridge from SEO keywords to trackable AI-visibility prompts.",
              url: `${siteConfig.url}/tools/keyword-to-prompts`,
              applicationSubCategory: "AI prompt generator and GEO prompt research",
            }),
            howToSchema({
              name: "How to turn a keyword into trackable AI prompts",
              steps: steps.map((s) => ({ name: s.title, text: s.body })),
            }),
          ]}
        />

        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "Keyword → AI Prompts", href: "" },
            ]}
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Free AI visibility tool</p>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Turn a keyword into the prompts your customers ask AI
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              SEO gave you keywords. AI visibility runs on prompts, the full conversational questions people actually type
              into ChatGPT, Claude and Perplexity. Paste one keyword, get ~15 prompts across 6 intents, with the
              brand-surfacing ones flagged so you know which to track. Free, no sign-up.
            </p>
          </div>

          <div className="mt-10">
            <KeywordToPromptsWidget />
          </div>
        </div>
      </section>

      {/* Straight answer */}
      <section className="border-t border-gray-100 bg-white px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">Straight answer</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Keywords aren&apos;t prompts, and that gap is why brands go missing in AI.
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-gray-700">
            <p>
              <strong className="text-gray-900">A keyword is a fragment; a prompt is a question.</strong> Nobody types
              &quot;standing desk&quot; into ChatGPT. They ask &quot;what&apos;s the best standing desk for a small home office under $300?&quot;
              Longer, conversational, with context baked in. If you only know your keywords, you don&apos;t know what to track.
            </p>
            <p>
              <strong className="text-gray-900">Not every prompt is worth tracking.</strong> Only some make an AI answer
              by recommending brands, and those are where you can win or lose visibility. We flag them deterministically, so you
              spend your tracking on the prompts that actually define your brand&apos;s presence.
            </p>
            <p>
              <strong className="text-gray-900">It&apos;s a bridge, not a black box.</strong> Intent labels are model-inferred and
              we say so; the brand-surfacing flag is a transparent rule. The honest path from the SEO keywords you have to the
              AI prompts you can monitor.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks3Step heading="From a keyword to trackable prompts in three steps" steps={steps} />

      {/* Related free tools */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">More free tools</p>
          <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-gray-900">
            Got the prompts? Make sure AI can actually read you.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
            Once you know what to track, check the foundations. The{" "}
            <Link href="/tools/ai-readiness" className="font-semibold text-accent-700 underline-offset-2 hover:underline">AI-Readiness Score</Link>{" "}
            grades whether AI agents can reach and parse your site, the{" "}
            <Link href="/tools/ai-crawler-checker" className="font-semibold text-accent-700 underline-offset-2 hover:underline">AI Crawler Checker</Link>{" "}
            shows which of 34 AI crawlers your robots.txt blocks, and the{" "}
            <Link href="/tools/llms-txt-checker" className="font-semibold text-accent-700 underline-offset-2 hover:underline">llms.txt Checker</Link>{" "}
            validates your llms.txt. All free and server-side. New to the idea? Read{" "}
            <Link href="/blog/what-is-ai-visibility" className="font-semibold text-accent-700 underline-offset-2 hover:underline">what AI visibility is</Link>.
          </p>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="Keywords, prompts and AI visibility — answered" />

      {/* Funnel CTA */}
      <section className="bg-gray-950 px-6 py-20 sm:py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white">
              These are the prompts. Now see if you&apos;re in the answers.
            </h2>
            <p className="mt-2 max-w-xl text-base text-gray-300">
              The <Link href="/features/ai-visibility-tracker" className="underline decoration-gray-500 underline-offset-2 hover:text-white">AI Visibility Tracker</Link> runs your flagged prompts through 8 AI engines on a schedule, one of 14 features on
              the paid platform, and shows whether your brand is mentioned, cited, or beaten by a competitor.
            </p>
          </div>
          <Link
            href="/app?utm_source=keyword-to-prompts"
            prefetch={false}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-gray-950 transition-all duration-200 hover:bg-gray-100 active:translate-y-[1px]"
          >
            Start tracking your prompts
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
