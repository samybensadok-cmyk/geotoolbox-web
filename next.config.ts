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
              '</home.md>; rel="alternate"; type="text/markdown", ' +
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
    ]
  },
}

export default withNextIntl(nextConfig)
