export const siteConfig = {
  name: "GEO Toolbox",
  description: "Generative engine optimization (GEO) measured across eight AI engines. Track AI search visibility on ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews, Google AI Mode, Bing Copilot, and Grok.",
  url: "https://geotoolbox.ai",
  appUrl: "/app/",
  appLoginUrl: "/app/?page=login",
  // SG_SIGNUP_INTERVAL_DEFAULT (2026-08-20): interval is EXPLICIT here on purpose.
  // A signup with no interval is normalised server-side to ANNUAL
  // (inc/auth_session.php sg_signup_normalize_plan), so a bare link sent buyers
  // straight into a $948 Stripe Checkout seconds after clicking "Start free trial".
  // Entry points that cannot express a billing choice must say monthly.
  appSignupUrl: "/app/?page=signup&interval=monthly",
  author: "Samy Ben Sadok",
  // Machine-readable contact + postal identity for the homepage Organization
  // JSON-LD. Agent-readiness scanners (Ora / Is Agentic `org-schema-completeness`)
  // look for BOTH a contactPoint and a PostalAddress on the Organization node
  // before they treat the business identity as verifiable.
  contactEmail: "samy@geotoolbox.ai",
  // Operator decision 2026-08-24 (revised, same day): publish CITY + COUNTRY only.
  // No street address, no postal code — those stay empty deliberately, and
  // postalAddressSchema() emits only the keys that are filled.
  //
  // This discloses nothing new: /author/samy-ben-sadok already states "Barcelona,
  // Spain" publicly. It is what takes `org-schema-completeness` to full credit,
  // because that check wants a contactPoint AND a PostalAddress on the same node.
  //
  // If you ever add a street address, add postalCode with it — a street with no
  // postal code is the half-filled shape postalAddressSchema() exists to prevent.
  address: {
    addressLocality: "Barcelona",
    addressRegion: "",
    postalCode: "",
    streetAddress: "",
    addressCountry: "ES",
  } as {
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    streetAddress?: string
    addressCountry?: string
  },
  // ORGANIZATION-level profiles only. These are emitted verbatim as
  // `sameAs` on the homepage Organization JSON-LD, which is an ASSERTION OF
  // IDENTITY: "the entity at this URL is us". Never add a profile here that has
  // not been opened and confirmed to be ours.
  //
  // 2026-08-24 — `twitter: "https://twitter.com/geotoolbox"` was REMOVED. That
  // handle is not ours: @Geotoolbox on X is a Brazilian geology-equipment
  // retailer (bio "equipamentos para geólogos", links geotoolbox.com.br, joined
  // November 2013, 0 posts). Publishing it as sameAs told every AI engine that
  // GEO Toolbox and that company are one entity — actively feeding the brand
  // confusion we are trying to resolve, since "geo toolbox" already resolves to
  // geocaching/GIS/geodetics meanings in search. Restore a handle here only
  // after claiming one we control.
  //
  // The FOUNDER's profiles (LinkedIn, Malt, Semrush) are not Organization
  // identity — they live on the Person node via lib/authors.ts.
  links: {
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
        { slug: "ai-visibility-tracker", name: "AI Visibility Tracker", desc: "Scheduled AI-citation tracking in 29 markets" },
        { slug: "geo-scan", name: "GEO Scan", desc: "8-engine AI visibility scan" },
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
