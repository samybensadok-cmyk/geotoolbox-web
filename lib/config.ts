export const siteConfig = {
  name: "GEO Toolbox",
  description: "Generative engine optimization (GEO) measured across eight AI engines. Track AI search visibility on ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Google AI Mode, Bing Copilot, and Grok.",
  url: "https://geotoolbox.ai",
  appUrl: "/app/",
  appLoginUrl: "/app/?page=login",
  appSignupUrl: "/app/?page=signup",
  author: "Samy Ben Sadok",
  links: {
    twitter: "https://twitter.com/geotoolbox",
    github: "https://github.com/samybensadok-cmyk/geotoolbox-web",
  },
  nav: [
    { label: "Features", href: "/features" },
    { label: "Blog", href: "/blog" },
  ],
  featureGroups: [
    {
      group: "Scanning",
      features: [
        { slug: "geo-scan", name: "GEO Scan", desc: "7-engine AI visibility scan" },
        { slug: "agent-readiness", name: "Agent Readiness", desc: "Site-level AI agent + crawler readiness scan" },
        { slug: "query-fanout", name: "Query Fan-Out", desc: "The real questions AI fans out for a topic" },
      ],
    },
    {
      group: "Analysis",
      features: [
        { slug: "content-analyzer", name: "Content Analyzer", desc: "Grade any page A–F" },
        { slug: "content-studio", name: "Content Studio", desc: "Brief, write, and score an article" },
      ],
    },
    {
      group: "Intelligence",
      features: [
        { slug: "domain-overview", name: "Domain Overview", desc: "Your AI visibility command center" },
        { slug: "competitor-intel", name: "Competitor Intel", desc: "Track rivals over time" },
        { slug: "community", name: "Community", desc: "Reddit + forum citations" },
        { slug: "citation-interceptor", name: "Citation Interceptor", desc: "Where AI cites others, not you" },
        { slug: "ask-geotoolbox", name: "Ask GeoToolBox", desc: "Chat with an AI analyst over your own data" },
      ],
    },
    {
      group: "Reporting",
      features: [
        { slug: "analytics", name: "Analytics", desc: "GSC + GA4 for AI attribution" },
        { slug: "pr-coverage-tracker", name: "PR Coverage Tracker", desc: "Prove earned media shows up in AI" },
        { slug: "white-label-reports", name: "White-Label Reports", desc: "Client-ready reports under your brand" },
      ],
    },
  ],
}
