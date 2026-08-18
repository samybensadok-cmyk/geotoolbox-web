// ---------------------------------------------------------------------------
// Affiliate link registry — the single source of truth for monetized outbound
// links. MDX articles link to `/go/<slug>`; `app/go/[slug]/route.ts` looks the
// slug up here and 302-redirects to `url`. Swap a partner, fix a dead deep-link,
// or flip a program off in ONE place — never by editing articles.
//
// IMPORTANT — `url` must become the AFFILIATE TRACKING link once the program
// account is approved. Until then it points at the plain homepage and the entry
// is marked `pending: true`: the link still works for the reader, it just earns
// $0 (no tracking) and should not be presented as "tested/recommended" copy that
// implies a commission relationship until the real link is in.
//
// `rel` is always "sponsored nofollow noopener noreferrer" and target=_blank —
// set by the MDX `<a>` override and the route handler. Do not pass equity.
// ---------------------------------------------------------------------------

export type AffiliateCluster =
  | "c1-content"
  | "c2-linkbuilding"
  | "c3-seo-suite"
  | "c4-rank-tracking"
  | "c5-hosting"
  | "c6-entity"
  | "c7-reputation"

export type AffiliateLink = {
  /** Destination. Affiliate tracking URL once approved; plain homepage until then. */
  url: string
  /** Program / brand name — used for click logging and internal reference. */
  program: string
  /** Which content cluster this brand belongs to (see the monetization plan). */
  cluster: AffiliateCluster
  /** True until a real tracking URL is in place (points at homepage, earns nothing). */
  pending?: boolean
  /**
   * Skip appending utm_* query params. Some networks (Impact, PartnerStack,
   * Everflow) use their own deep-link param structure and can break or drop the
   * referral when extra params are added — set this once the real link is in if so.
   */
  noUtm?: boolean
  /**
   * Network's own SubId param name (Impact = "sharedid"). When set, the route
   * appends `<subIdParam>=gtb-<ref>` (from `/go/<slug>?ref=<post-slug>`) for
   * per-article attribution in the network's reporting — works even with noUtm.
   */
  subIdParam?: string
}

// All entries seeded `pending` — replace `url` with the network tracking link as
// each account is approved, then remove `pending`. Homepages are the safe fallback.
export const AFFILIATE_LINKS: Record<string, AffiliateLink> = {
  // --- C1 · Content optimization / AI writing ------------------------------
  surfer: { url: "https://get.surferseo.com/geotoolbox", program: "Surfer SEO", cluster: "c1-content" },
  "surfer-editor": { url: "https://get.surferseo.com/geotoolbox2", program: "Surfer SEO (Content Editor)", cluster: "c1-content" },
  frase: { url: "https://www.frase.io/", program: "Frase", cluster: "c1-content", pending: true },
  scalenut: { url: "https://scalenut.com/?fpr=samy10", program: "Scalenut", cluster: "c1-content" },
  neuronwriter: { url: "https://app.neuronwriter.com/ar/ce76bd1e456723f7e0ddca82479539ab", program: "NeuronWriter", cluster: "c1-content" },
  copyai: { url: "https://www.copy.ai/", program: "Copy.ai", cluster: "c1-content", pending: true },
  writesonic: { url: "https://writesonic.com/", program: "Writesonic", cluster: "c1-content", pending: true },

  // --- C2 · Link building / digital PR / outreach --------------------------
  collaborator: { url: "https://collaborator.pro/signup?ref=VJPwz8", program: "Collaborator.pro", cluster: "c2-linkbuilding" },
  snov: { url: "https://snov.io?fp_ref=samy17", program: "Snov.io", cluster: "c2-linkbuilding" },
  hunter: { url: "https://hunter.io/", program: "Hunter.io", cluster: "c2-linkbuilding", pending: true },
  instantly: { url: "https://instantly.ai/", program: "Instantly.ai", cluster: "c2-linkbuilding", pending: true },
  adsy: { url: "https://ref.adsy.com/?ref=referral&ref_type=direct&ref_id=fmenyt1rplcdgiwt&ref_item=3", program: "Adsy", cluster: "c2-linkbuilding" },
  getfluence: { url: "https://www.getfluence.com/", program: "Getfluence", cluster: "c2-linkbuilding", pending: true },
  postaga: { url: "https://postaga.com/", program: "Postaga", cluster: "c2-linkbuilding", pending: true },
  smartlead: { url: "https://www.smartlead.ai/", program: "Smartlead", cluster: "c2-linkbuilding", pending: true },
  lemlist: { url: "https://www.lemlist.com/", program: "lemlist", cluster: "c2-linkbuilding", pending: true },
  brand24: { url: "https://brand24.com/", program: "Brand24", cluster: "c2-linkbuilding", pending: true },
  prowly: { url: "https://prowly.com/", program: "Prowly", cluster: "c2-linkbuilding", pending: true },

  // --- C3 · SEO suites / research ------------------------------------------
  // Semrush (Impact, partner 7438816 / program 13053). Base ad 3082487 with a
  // deep-link `u=` per product LP (deeplinking is supported on this ad); the route
  // appends `?sharedid=gtb-<ref>` for per-article attribution. Swap in exact
  // per-product ad IDs later if cleaner asset-level reporting is wanted.
  semrush: { url: "https://semrush.sjv.io/c/7438816/3082487/13053?u=https%3A%2F%2Fwww.semrush.com%2Fsignup%2F", program: "Semrush (all-in-one)", cluster: "c3-seo-suite", noUtm: true, subIdParam: "sharedid" },
  "semrush-seo": { url: "https://semrush.sjv.io/c/7438816/3082487/13053?u=https%3A%2F%2Fwww.semrush.com%2Fseo%2F", program: "Semrush SEO Toolkit", cluster: "c3-seo-suite", noUtm: true, subIdParam: "sharedid" },
  "semrush-one": { url: "https://semrush.sjv.io/c/7438816/3082487/13053?u=https%3A%2F%2Fwww.semrush.com%2Fpricing%2F", program: "Semrush One (bundles pricing)", cluster: "c3-seo-suite", noUtm: true, subIdParam: "sharedid" },
  "semrush-content": { url: "https://semrush.sjv.io/c/7438816/3082487/13053?u=https%3A%2F%2Fwww.semrush.com%2Ffeatures%2Fcontent-marketing%2F", program: "Semrush Content Toolkit", cluster: "c1-content", noUtm: true, subIdParam: "sharedid" },
  "semrush-ai": { url: "https://semrush.sjv.io/c/7438816/3082487/13053?u=https%3A%2F%2Fwww.semrush.com%2Flp%2Fai-toolkit%2Fen%2F", program: "Semrush AI Visibility Toolkit", cluster: "c3-seo-suite", noUtm: true, subIdParam: "sharedid" },
  spyfu: { url: "https://www.spyfu.com/", program: "SpyFu", cluster: "c3-seo-suite", pending: true },
  seranking: { url: "https://seranking.com/?ga=5177285&source=link", program: "SE Ranking", cluster: "c3-seo-suite", noUtm: true },
  mangools: { url: "https://mangools.com/plans-and-pricing#a5c67fb19feebf86deb273724", program: "Mangools", cluster: "c3-seo-suite", noUtm: true },
  serpstat: { url: "https://serpstat.com/", program: "Serpstat", cluster: "c3-seo-suite", pending: true },

  // --- C4 · Rank tracking --------------------------------------------------
  accuranker: { url: "https://www.accuranker.com/", program: "AccuRanker", cluster: "c4-rank-tracking", pending: true },
  wincher: { url: "https://www.wincher.com/", program: "Wincher", cluster: "c4-rank-tracking", pending: true },
  seopowersuite: { url: "https://www.link-assistant.com/", program: "SEO PowerSuite", cluster: "c4-rank-tracking", pending: true },

  // --- C5 · Hosting / performance ------------------------------------------
  kinsta: { url: "https://kinsta.com/?kaid=NULDDEDMWHUX", program: "Kinsta", cluster: "c5-hosting" },
  cloudways: { url: "https://www.cloudways.com/", program: "Cloudways", cluster: "c5-hosting", pending: true },
  wpengine: { url: "https://wpengine.com/", program: "WP Engine", cluster: "c5-hosting", pending: true },
  rocket: { url: "https://rocket.net/", program: "Rocket.net", cluster: "c5-hosting", pending: true },
  hostinger: { url: "https://www.hostinger.com/", program: "Hostinger", cluster: "c5-hosting", pending: true },
  siteground: { url: "https://www.siteground.com/", program: "SiteGround", cluster: "c5-hosting", pending: true },

  // --- C6 · Entity / semantic SEO (GEO-native) -----------------------------
  inlinks: { url: "https://inlinks.com/", program: "InLinks", cluster: "c6-entity", pending: true },
  wordlift: { url: "https://wordlift.io/", program: "WordLift", cluster: "c6-entity", pending: true },
  schemaapp: { url: "https://www.schemaapp.com/", program: "Schema App", cluster: "c6-entity", pending: true },
  linkwhisper: { url: "https://linkwhisper.com/", program: "Link Whisper", cluster: "c6-entity", pending: true },
  marketmuse: { url: "https://www.marketmuse.com/", program: "MarketMuse", cluster: "c6-entity", pending: true },
}

/** Resolve a slug (case-insensitive) to its affiliate link, or undefined. */
export function getAffiliateLink(slug: string): AffiliateLink | undefined {
  return AFFILIATE_LINKS[slug.toLowerCase()]
}
