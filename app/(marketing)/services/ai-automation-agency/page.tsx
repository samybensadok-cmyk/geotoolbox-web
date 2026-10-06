import { ServiceExperience } from "@/components/services/service-experience"
import type { Metadata } from "next"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/config"
import { PRIMARY_AUTHOR } from "@/lib/authors"
import { contentCounts } from "@/lib/proof-stats"

// Latest month in the generated GSC series (the current month while partial).


const PAGE_URL = `${siteConfig.url}/services/ai-automation-agency`
// Book-a-call only at launch (operator decision 2026-07-23): every build is
// scoped and quoted per project — no Stripe checkout item on this page.
const CALL_HREF = "https://calendly.com/samy-bensadok/30min-call"

// Single-sourced in lib/proof-stats.ts (shared with the OG image).


export const metadata: Metadata = {
  // Base title 40 chars — template suffix "| GEO Toolbox" keeps total ≤60.
  title: "AI Automation Agency & Agent Development",
  description:
    "Founder-led AI automation agency building custom AI agents, Claude skills and internal tools — with fixed quotes, human approval gates and full ownership.",
  openGraph: {
    title: "The AI Agents That Run This Business — Built For Yours",
    description:
      "Custom AI agents, Claude skills and internal tools for content, lead gen and operations — built by the solo operator whose own agents run geotoolbox.ai. Fixed quotes, human approval gates, full ownership.",
  },
  alternates: { canonical: PAGE_URL },
}

// What I build — the three delivery formats, defined honestly. The buyer
// doesn't need to pick one before the call: the workflow determines the build.
const definitionRows = [
  {
    num: "01",
    title: "Claude skills — a workflow your AI runs the same way every time.",
    body: "A skill packages your process — instructions, references, scripts, quality gates — so Claude executes it reliably instead of improvising from a prompt. My flagship skill runs a 14-phase research-and-QA pipeline that writes this site's blog. Skills fit repeatable knowledge work: research, content, reporting, review.",
  },
  {
    num: "02",
    title: "AI agents & automations — systems that watch, decide and deliver.",
    body: "An agent monitors sources, makes bounded decisions, calls tools and hands you a finished output — a scored lead list, an enriched report, a filed alert — with human approval gates where the stakes require them. Not a chatbot: a worker with a job description and a paper trail.",
  },
  {
    num: "03",
    title: "Custom AI tools — when the workflow needs an interface.",
    body: "Calculators that qualify leads on your site, white-label scanners your agency resells, internal dashboards your team actually opens. Purpose-built, small surface area, shipped into production — not a prototype that dies in a demo.",
  },
]

type Tier = {
  name: string
  price: string
  billing: string
  summary: string
  detail: string
  chip: "One-off" | "Retainer"
  featured?: boolean
}

// All three engagements are book-a-call: builds are priced per project after
// the scoping call, so no dollar figures are shown or invented here.
const tiers: Tier[] = [
  {
    name: "Workflow Blueprint",
    price: "Fixed fee",
    billing: "One-off · quoted on the call",
    summary: "One workflow mapped, a build-or-don't verdict, and a fixed quote for the build.",
    detail:
      "The paid scoping engagement that follows the free intro call: your workflow mapped end to end, the right format chosen (skill, agent, tool — or an honest 'don't build this'), risks and data handling assessed, and a fixed build quote. The blueprint is yours either way.",
    chip: "One-off",
  },
  {
    name: "Pilot Build",
    price: "Fixed quote",
    billing: "One-off · scoped to one workflow",
    summary: "One workflow turned into a working, documented system — in production, not a demo.",
    detail:
      "A single, hard-scoped workflow built into a production system: tested on your real inputs, QA-gated, documented and handed off. Deliberately narrow — the pilot has to earn the next build. Quoted after the Blueprint, or directly from the intro call when the workflow is already well-defined.",
    chip: "One-off",
    featured: true,
  },
  {
    name: "Build & Run",
    price: "Monthly",
    billing: "Retainer · systems I built or audited",
    summary: "I keep your systems running, improving and current as models and APIs move.",
    detail:
      "Monitoring, fixes, prompt and skill refinement, model updates, and a monthly improvement allowance — for systems I built or have audited. Month to month after an initial period we agree on the call.",
    chip: "Retainer",
  },
]

type ClientBuild = {
  label: string
  system: string
  points: string[]
}

// Client builds — named only where cleared. The two agency tool builds are
// white-label arrangements and are never named (operator rule, 2026-07-23); the
// suspension scanner's client is never named (standing rule). Modern Mill is
// cleared to name.
const clientBuilds: ClientBuild[] = [
  {
    label: "Modern Mill · building-materials manufacturer",
    system: "Two lead-capture calculators",
    points: [
      "Product-specific calculators that turn spec-stage visitors into qualified leads on the site.",
      "Scoped, built and shipped as embeddable tools their marketing team runs without a developer.",
    ],
  },
  {
    label: "Google Ads agency · lead generation",
    system: "Suspension-lead monitoring pipeline",
    points: [
      "Watches three public sources for businesses with suspended ad accounts — the agency's exact buyer, at the exact moment of need.",
      "Deduplicates, scores and enriches every lead, then delivers a ranked spreadsheet. Runs on a schedule, not on someone's to-do list.",
    ],
  },
  {
    label: "B2B SEO agency · white-label",
    system: "AI visibility scanner",
    points: [
      "A white-label scan tool the agency runs under its own brand to show clients where they appear — or don't — in AI answers.",
      "Built on the same engine as geotoolbox.ai, packaged for an agency's sales motion.",
    ],
  },
  {
    label: "GTM agency · sales operations",
    system: "Go-to-market workflow tool",
    points: [
      "A custom tool supporting the agency's outbound motion — built to their exact process.",
      "Scoped tight, shipped fast, owned by the client.",
    ],
  },
]

const faqs = [
  {
    question: "What's the difference between an AI agent, an automation, and a Claude skill?",
    answer:
      "An automation is a fixed pipeline: trigger, steps, output — great until a step needs judgment. An AI agent adds bounded decision-making: it can read, evaluate, choose tools and escalate to a human. A Claude skill is a packaged workflow — instructions, references, scripts and quality gates — that makes Claude run your process the same way every time instead of improvising. Most real builds combine all three, and you don't need to pick the format before we talk: the workflow determines the build.",
  },
  {
    question: "What does an AI automation agency actually do?",
    answer:
      "The honest version: take one expensive, repetitive workflow, decide whether it should be automated at all, then build the smallest system that does it reliably — with test cases, human approval gates and documentation. The dishonest version sells a chatbot demo and a retainer. This page is the honest version, run by one operator whose own systems are public: the blog this site publishes is written by one of them.",
  },
  {
    question: "How much does it cost?",
    answer:
      "The intro call is free; every build after it is quoted as a fixed price — no hourly billing, no open-ended retainer to get a number. Cost tracks the workflow's complexity: integrations, judgment points, and how much QA the stakes demand. The Blueprint stage exists precisely so you get a fixed quote and a build-or-don't verdict before committing to anything bigger.",
  },
  {
    question: "Can't I just use ChatGPT and Zapier myself?",
    answer:
      "For simple, deterministic flows — yes, and I'll tell you so on the call. The gap shows up when a task needs judgment, when an output touches customers or a database, or when 'usually works' isn't good enough. Production systems need test cases, approval gates, error handling and docs. That engineering layer is what you're buying; the API calls are the cheap part.",
  },
  {
    question: "Who owns the code, prompts and data?",
    answer:
      "You do — all of it. Code, skills, prompts, documentation, and every dataset the system produces. Builds run in your accounts wherever practical, so API keys, costs and data stay under your control. If we stop working together, everything keeps running and nothing is held hostage.",
  },
  {
    question: "Will an agent run unsupervised?",
    answer:
      "Only where the stakes allow it. Anything that touches a customer, spends money or writes to a system of record gets a human approval gate by default — you approve, the system executes. Full autonomy is earned per-workflow as trust builds, not promised on a sales call. Anyone selling you a fully autonomous digital employee on day one is selling the demo, not the system.",
  },
  {
    question: "Why you and not a dev shop?",
    answer:
      `Proof of work. I built geotoolbox.ai solo — scan engine, tracker, billing, admin — and the AI systems that run it: a 14-phase skill that has written all ${contentCounts.en + contentCounts.fr} of its published articles, plus the QA pipeline that reviews them. Dev shops show you a portfolio of other people's logos; I can show you the systems, running, on the site you're reading. Scope is deliberately narrow — I take on the builds I can personally lead, with a small senior team on delivery.`,
  },
]

// Service node — no offers[] block: engagements are quoted per project (no
// public prices), and schema Offers without prices validate poorly.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI Automation Agency & Agent Development",
  description:
    "Founder-led AI automation service: custom AI agents, Claude skills and internal AI tools for content, lead generation, sales and agency operations — scoped fixed-quote builds with human approval gates, testing and full client ownership.",
  url: PAGE_URL,
  areaServed: "Worldwide",
  serviceType: [
    "AI Automation",
    "AI Agent Development",
    "Claude Skills Development",
    "Custom AI Tools",
  ],
  provider: {
    "@type": "Person",
    "@id": `${siteConfig.url}/author/${PRIMARY_AUTHOR.slug}#person`,
    name: PRIMARY_AUTHOR.name,
    url: `${siteConfig.url}/author/${PRIMARY_AUTHOR.slug}`,
    jobTitle: PRIMARY_AUTHOR.role,
    ...(PRIMARY_AUTHOR.avatar ? { image: `${siteConfig.url}${PRIMARY_AUTHOR.avatar}` } : {}),
  },
}

export default function AiAutomationAgencyPage() {
  return <>
    <JsonLd data={serviceSchema} />
    <ServiceExperience
      eyebrow="AI automation & agents"
      title="Less repetitive work." accent="A system your team owns."
      description="Custom AI agents, Claude skills and internal tools for your real workflows. Scoped, tested and documented by the founder who built GEO Toolbox." callHref={CALL_HREF}
      offers={tiers} faqs={faqs} context={definitionRows} automation builds={clientBuilds}
      steps={[{"title": "Map one workflow", "body": "Define the inputs, outputs, integrations and approval points. Get a blueprint and a fixed quote.", "output": "Workflow blueprint"}, {"title": "Build and test", "body": "Review a working system on your actual inputs, with quality checks and human approval gates.", "output": "Tested pilot"}, {"title": "Run it with confidence", "body": "Get the code, prompts and operating documentation. Add ongoing support when you need it.", "output": "Documented handoff"}]}
    >

    </ServiceExperience>
  </>
}
