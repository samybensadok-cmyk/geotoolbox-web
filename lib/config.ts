export const siteConfig = {
  name: "GEO Toolbox",
  description: "Generative engine optimization (GEO) measured across seven AI engines. Track AI search visibility on ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Bing Copilot, and Grok.",
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
        { slug: "geo-scan", name: "GEO Scan", desc: "6-engine AI visibility scan" },
        { slug: "agent-readiness", name: "Agent Readiness", desc: "Site-level AI agent + crawler readiness scan" },
      ],
    },
    {
      group: "Analysis",
      features: [
        { slug: "content-analyzer", name: "Content Analyzer", desc: "Grade any page A–F" },
        { slug: "content-brief", name: "Content Brief & Draft", desc: "Brief, draft, and score" },
      ],
    },
    {
      group: "Intelligence",
      features: [
        { slug: "domain-overview", name: "Domain Overview", desc: "Your AI visibility command center" },
        { slug: "competitor-intel", name: "Competitor Intel", desc: "Track rivals over time" },
        { slug: "community", name: "Community", desc: "Reddit + forum citations" },
      ],
    },
    {
      group: "Reporting",
      features: [
        { slug: "analytics", name: "Analytics", desc: "GSC + GA4 for AI attribution" },
      ],
    },
  ],
}
