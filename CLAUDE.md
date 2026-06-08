@AGENTS.md

# GEO Toolbox Website

Marketing site + blog for geotoolbox.ai. Next.js 15 (App Router) + Tailwind v4 + MDX.

## Stack
- **Framework**: Next.js 15 with App Router, React 19
- **Styling**: Tailwind CSS v4 (CSS-first config in globals.css, no tailwind.config)
- **Fonts**: DM Sans (body + logo), DM Mono (code)
- **Content**: MDX files in `content/blog/`, loaded via `lib/content.ts`
- **Hosting**: Vercel (auto-deploys on push to main)
- **Repo**: github.com/samybensadok-cmyk/geotoolbox-web

## Architecture
- Vercel rewrites proxy `/app/*` and `/api/*` to Replit PHP app (sg-geo-tool.replit.app)
- Marketing site owns `/`, `/blog/*`, `/feed.xml`, `/sitemap.xml`
- Blog publishing: write MDX → commit → push → auto-deploy

## Design System
- **Colors**: Teal/emerald accent (--color-accent-*), standard Tailwind grays
- **Typography**: DM Sans body, bold sans headings, bold sans "GEO Toolbox" logotype with teal icon mark
- **CTAs**: Rounded-full pills, gray-900 primary, border secondary
- **Sections**: Alternating white/dark (gray-950)/gray-50 backgrounds
- **Prose**: Manual typography in @layer components (no @tailwindcss/typography)

## Rules
- No @tailwindcss/typography (incompatible with v4) — prose styles are manual in globals.css
- Tailwind v4 arbitrary values in brackets (e.g. grid-cols-[1fr,2fr]) may not work — use standard utilities
- Logo: teal rounded-lg icon mark (white "G") + bold sans "GEO Toolbox" wordmark — no serif fonts

## Dev-server / RAM safety (post 2026-06-08 crash — TWO back-to-back OOM crashes, ~80GB on a 16GB Mac)
- **NEVER run `next dev` (or any long-lived watcher: `npm run dev`, `vercel dev`, `tsc --watch`) as a foreground Bash call.** A dev server never returns; its stdout is unbounded; the agent buffers every recompile/error line in memory. While a file is being edited through broken intermediate states, Turbopack loops recompile→error→fast-refresh and the buffer balloons to tens of GB → swap death → hard crash. Origin: blog `page.tsx` redesign — crashed twice, redesign sat uncommitted until recovered.
- **To preview locally** (only if truly needed): run backgrounded with output redirected to a file, then kill it — `npm run dev > /tmp/next-dev.log 2>&1 &` (use `run_in_background`), tail the log file for the port, and `kill` the PID when done. Never leave it running across turns.
- **Preferred verification = the Vercel deploy, not a local server.** This repo auto-deploys on push to `main`; a failed build simply doesn't deploy (current site stays live), so committing + pushing + checking the live URL is zero-risk and avoids the dev-server trap entirely.
- `next build` is acceptable when you must validate locally (it terminates — not a loop), but it's memory-heavy on 16GB; cap it with `NODE_OPTIONS=--max-old-space-size=4096` and prefer it over `next dev`.
