@AGENTS.md

# GEO Toolbox Website

Marketing site + blog for geotoolbox.ai. Next.js 15 (App Router) + Tailwind v4 + MDX.

## Stack
- **Framework**: Next.js 15 with App Router, React 19
- **Styling**: Tailwind CSS v4 (CSS-first config in globals.css, no tailwind.config)
- **Fonts**: DM Sans (body), DM Mono (code), Instrument Serif (display/logo only)
- **Content**: MDX files in `content/blog/`, loaded via `lib/content.ts`
- **Hosting**: Vercel (auto-deploys on push to main)
- **Repo**: github.com/samybensadok-cmyk/geotoolbox-web

## Architecture
- Vercel rewrites proxy `/app/*` and `/api/*` to Replit PHP app (sg-geo-tool.replit.app)
- Marketing site owns `/`, `/blog/*`, `/feed.xml`, `/sitemap.xml`
- Blog publishing: write MDX → commit → push → auto-deploy

## Design System
- **Colors**: Teal/emerald accent (--color-accent-*), standard Tailwind grays
- **Typography**: DM Sans body, bold sans headings, serif "GEO" logotype only
- **CTAs**: Rounded-full pills, gray-900 primary, border secondary
- **Sections**: Alternating white/dark (gray-950)/gray-50 backgrounds
- **Prose**: Manual typography in @layer components (no @tailwindcss/typography)

## Rules
- No @tailwindcss/typography (incompatible with v4) — prose styles are manual in globals.css
- Tailwind v4 arbitrary values in brackets (e.g. grid-cols-[1fr,2fr]) may not work — use standard utilities
- Instrument Serif loaded as local font from public/fonts/
