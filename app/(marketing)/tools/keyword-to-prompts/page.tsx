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
    <ToolsPage>
      {/* Hero + the tool */}
      <section className={`${tk.hero} ${kit.heroGlow}`}>
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

        <div className={kit.wrap}>
          <Breadcrumbs
            tone="dark"
            trail={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools" },
              { name: "Keyword → AI Prompts", href: "" },
            ]}
          />
          <div className={tk.heroHead}>
            <p className={tk.heroLabel}>Free AI visibility tool</p>
            <h1 className={tk.heroTitle}>
              Turn a keyword into the prompts your customers ask AI
            </h1>
            <div className={tk.heroRule} aria-hidden="true" />
            <p className={tk.heroLead}>
              SEO gave you keywords. AI visibility runs on prompts, the full conversational questions people actually type
              into ChatGPT, Claude and Perplexity. Paste one keyword, get ~15 prompts across 6 intents, with the
              brand-surfacing ones flagged so you know which to track. Free, no sign-up.
            </p>
          </div>

          <div className={`${tk.heroTool} ${tk.mount}`}>
            <KeywordToPromptsWidget />
          </div>
        </div>
      </section>

      {/* Straight answer */}
      <section className={`${kit.section} ${kit.sectionBorder}`}>
        <div className={`${kit.wrap} ${tk.split}`}>
          <div className={tk.splitHead}>
            <ToolIndex>Straight answer</ToolIndex>
            <h2 className={tk.title2}>
              Keywords aren&apos;t prompts, and that gap is why brands go missing in AI.
            </h2>
          </div>
          <div className={tk.prose}>
            <div className={tk.stack}>
              <p>
                <strong>A keyword is a fragment; a prompt is a question.</strong>{" "}Nobody types
                &quot;standing desk&quot; into ChatGPT. They ask &quot;what&apos;s the best standing desk for a small home office under $300?&quot;
                Longer, conversational, with context baked in. If you only know your keywords, you don&apos;t know what to track.
              </p>
              <p>
                <strong>Not every prompt is worth tracking.</strong>{" "}Only some make an AI answer
                by recommending brands, and those are where you can win or lose visibility. We flag them deterministically, so you
                spend your tracking on the prompts that actually define your brand&apos;s presence.
              </p>
              <p>
                <strong>It&apos;s a bridge, not a black box.</strong> Intent labels are model-inferred and
                we say so; the brand-surfacing flag is a transparent rule. The honest path from the SEO keywords you have to the
                AI prompts you can monitor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <HowItWorks3Step heading="From a keyword to trackable prompts in three steps" steps={steps} />

      {/* Related free tools */}
      <section className={`${kit.section} ${kit.sectionBorder} ${kit.band}`}>
        <div className={`${kit.wrap} ${tk.split}`}>
          <div className={tk.splitHead}>
            <ToolIndex>More free tools</ToolIndex>
            <h2 className={tk.title2}>
              Got the prompts? Make sure AI can actually read you.
            </h2>
          </div>
          <div className={tk.prose}>
            <p>
              Once you know what to track, check the foundations. The{" "}
              <Link href="/tools/ai-readiness">AI-Readiness Score</Link>{" "}
              grades whether AI agents can reach and parse your site, the{" "}
              <Link href="/tools/ai-crawler-checker">AI Crawler Checker</Link>{" "}
              shows which of 34 AI crawlers your robots.txt blocks, and the{" "}
              <Link href="/tools/llms-txt-checker">llms.txt Checker</Link>{" "}
              validates your llms.txt. All free and server-side. New to the idea? Read{" "}
              <Link href="/blog/what-is-ai-visibility">what AI visibility is</Link>.
            </p>
          </div>
        </div>
      </section>

      <FeatureFaq items={faqs} heading="Keywords, prompts and AI visibility — answered" />

      {/* Funnel CTA */}
      <section className={tk.close}>
        <div className={kit.wrap}>
          <div className={tk.closeCard}>
            <div>
              <h2 className={tk.closeTitle}>
                These are the prompts. Now see if you&apos;re in the answers.
              </h2>
              <p className={tk.closeBody}>
                The <Link href="/features/ai-visibility-tracker">AI Visibility Tracker</Link> runs your flagged prompts through 8 AI engines on a schedule, one of 14 features on
                the paid platform, and shows whether your brand is mentioned, cited, or beaten by a competitor.
              </p>
            </div>
            <Link
              href="/app/?page=signup&interval=monthly&ref=tool-keyword-to-prompts"
              prefetch={false}
              className={kit.btnLime}
            >
              Start tracking your prompts
              <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </ToolsPage>
  )
}
