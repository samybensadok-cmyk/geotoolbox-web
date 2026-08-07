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

## Auto-dating meta titles: `$MONTH_YEAR` (added 2026-08-07)

Frontmatter `title:` and `description:` support date tokens, the Yoast
`%%currentmonth%%` idea with a freshness gate. `lib/seo-tokens.ts`, tests in
`scripts/test-seo-tokens.mjs` (`npm run check:tokens`).

- **Tokens:** `$MONTH_YEAR` → "August 2026" / "août 2026" / "agosto de 2026" ·
  `$MONTH` · `$YEAR`. Month names come from `Intl` for the post's own locale, so
  Spanish gets its "de" and French stays lowercase. A token at offset 0 is
  capitalised. Timezone is UTC.
- **Freshness gate — the reason this isn't plain Yoast.** A post resolves to the
  CURRENT month only while it is inside its declared window: `recheckBy:` if
  present, else `updated:` + 60 days. Once that lapses the token pins to the
  `updated:` month, so an abandoned guide keeps saying "July 2026" instead of
  silently promoting itself to "March 2027". Bumping `updated:`/`recheckBy:` is
  what moves the title forward again.
- **Resolved once, in the two loaders in `lib/content.ts`**, so all 13 consumers
  (metadata, OG image, RSS, llms.txt, the `.md` twin, sitemap, search, author
  pages, landing) agree. Never resolve tokens at a call site.
- **Body prose is never touched.** Only `title:` and `description:`. Article
  claims stay explicit and verified.
- **Only put a token on a page whose BODY doesn't hard-code a competing month.**
  A title reading "August 2026" over prose that says "current to July 2026" is
  the freshness lie this gate exists to prevent — audit the body first.
- `export const revalidate = 86400` on `blog/[slug]/page.tsx` is what makes the
  month roll over without a deploy; the blog index is already dynamic
  (`searchParams`). The OG card image cannot revalidate and is frozen until the
  next deploy — see the note in `opengraph-image.tsx`.
- Titles get longer in some months ("September" vs "May"). Check the ~60-char
  SERP budget against the longest month, not the current one. `$YEAR` is the
  fallback when `$MONTH_YEAR` would blow the budget.
- **`npm run check:dates` is the gate.** It fails when a tokened post's body
  makes a blanket currency claim naming a different month, and it prints every
  `{/* date-ok: reason */}` override on each run so exceptions stay auditable.
  Its blind spot is documented in the file header: hard-coded months in H2s,
  `<th>` cells and figcaptions are NOT checked, because those date the data, not
  the article. Fix those by re-verifying the article, never by editing the stamp.
- **Do not bump `updated:` just to add a token.** Tokenising changes how a date
  renders, not what the article claims. Bumping resets the freshness window and
  manufactures the exact signal the gate polices. Only a real content refresh
  moves `updated:`.

## Dev-server / RAM safety (post 2026-06-08 crash — TWO back-to-back OOM crashes, ~80GB on a 16GB Mac)
- **NEVER run `next dev` (or any long-lived watcher: `npm run dev`, `vercel dev`, `tsc --watch`) as a foreground Bash call.** A dev server never returns; its stdout is unbounded; the agent buffers every recompile/error line in memory. While a file is being edited through broken intermediate states, Turbopack loops recompile→error→fast-refresh and the buffer balloons to tens of GB → swap death → hard crash. Origin: blog `page.tsx` redesign — crashed twice, redesign sat uncommitted until recovered.
- **To preview locally** (only if truly needed): run backgrounded with output redirected to a file, then kill it — `npm run dev > /tmp/next-dev.log 2>&1 &` (use `run_in_background`), tail the log file for the port, and `kill` the PID when done. Never leave it running across turns.
- **Preferred verification = the Vercel deploy, not a local server.** This repo auto-deploys on push to `main`; a failed build simply doesn't deploy (current site stays live), so committing + pushing + checking the live URL is zero-risk and avoids the dev-server trap entirely.
- `next build` is acceptable when you must validate locally (it terminates — not a loop), but it's memory-heavy on 16GB; cap it with `NODE_OPTIONS=--max-old-space-size=4096` and prefer it over `next dev`.
