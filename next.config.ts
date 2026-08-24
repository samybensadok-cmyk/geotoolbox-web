import type { NextConfig } from "next"
import path from "path"
import createNextIntlPlugin from "next-intl/plugin"

// Wires the next-intl request config (i18n/request.ts) into the build.
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray ~/package-lock.json otherwise makes Turbopack
  // infer /Users/samou as root, scanning the whole home dir (extra memory + warning).
  turbopack: {
    root: path.join(__dirname),
  },
  async headers() {
    return [
      {
        // Agent-readiness surface on the homepage (RFC 8288 Link relations +
        // honest content negotiation): / serves markdown when the client sends
        // Accept: text/markdown (middleware rewrite to /home.md), so caches
        // MUST key on Accept — without Vary here the edge could serve the
        // cached HTML variant to an agent or vice versa.
        source: "/",
        headers: [
          { key: "Vary", value: "Accept" },
          {
            key: "Link",
            value:
              '</llms.txt>; rel="alternate"; type="text/plain"; title="llms.txt", ' +
              '</llms-full.txt>; rel="alternate"; type="text/plain"; title="llms-full.txt", ' +
              '</llms-blog.txt>; rel="alternate"; type="text/plain"; title="Complete article index", ' +
              '</llms-glossary.txt>; rel="alternate"; type="text/plain"; title="Complete glossary index", ' +
              '</home.md>; rel="alternate"; type="text/markdown", ' +
              // rel="help", not rel="alternate": /agents.md is site-level guidance
              // (when to use us, how to call us), NOT an alternate representation
              // of the homepage. Advertising it as an alternate would be a lie an
              // agent could act on.
              '</agents.md>; rel="help"; type="text/markdown"; title="Agent instructions", ' +
              '</sitemap.xml>; rel="sitemap"; type="application/xml", ' +
              '</feed.xml>; rel="alternate"; type="application/rss+xml"',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // NOTE: www.geotoolbox.ai → geotoolbox.ai (308) is handled at the Vercel
      // domain layer (Settings → Domains), not here.
      { source: "/login",  destination: "/app?page=login",  permanent: true },
      { source: "/signup", destination: "/app?page=signup", permanent: true },
      { source: "/features/content-brief", destination: "/features/content-studio", permanent: true },
      // ES: retargeted geo-seo → que-es-geo (better head term "que es geo", KD16/1,060). 2026-08-13.
      { source: "/es/blog/geo-seo", destination: "/es/blog/que-es-geo", permanent: true },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/app",
        destination: "https://sg-geo-tool.replit.app/",
      },
      {
        source: "/app/:path*",
        destination: "https://sg-geo-tool.replit.app/app/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://sg-geo-tool.replit.app/api/:path*",
      },
      {
        source: "/index.php",
        destination: "https://sg-geo-tool.replit.app/index.php",
      },
      {
        source: "/router.php",
        destination: "https://sg-geo-tool.replit.app/router.php",
      },
      {
        source: "/assets.php",
        destination: "https://sg-geo-tool.replit.app/assets.php",
      },
      // W2 distribution: brand-domain canonical URLs for public agent-readiness share pages
      // + badges (backlink/SEO value accrues to geotoolbox.ai, not the replit.app origin).
      // The target endpoints are dark behind SG_FEATURE_AR_SHARE until GA, so this is safe to
      // ship early; it 404s until the flag is on.
      {
        source: "/agent-readiness/r/:token",
        destination: "https://sg-geo-tool.replit.app/index.php?action=ar_share&token=:token",
      },
      {
        source: "/agent-readiness/badge/:token",
        destination: "https://sg-geo-tool.replit.app/index.php?action=ar_badge&token=:token",
      },
    ]
  },
}

export default withNextIntl(nextConfig)
