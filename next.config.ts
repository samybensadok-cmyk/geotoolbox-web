import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray ~/package-lock.json otherwise makes Turbopack
  // infer /Users/samou as root, scanning the whole home dir (extra memory + warning).
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
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

export default nextConfig
