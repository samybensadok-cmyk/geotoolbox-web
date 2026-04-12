import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
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
