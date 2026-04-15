export const siteConfig = {
  name: "GEO Toolbox",
  description: "See how AI engines see your brand. Track visibility across ChatGPT, Perplexity, Gemini, Claude, and more.",
  url: "https://geotoolbox.ai",
  appUrl: "/app",
  author: "Samy Mahmoudi",
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
