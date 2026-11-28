import Link from "next/link"
import enMessages from "@/messages/en.json"
import { RootShell } from "@/components/layout/root-shell"
import { markdown404Body, recoveryLinks } from "@/lib/agent-404"
import { siteConfig } from "@/lib/config"
import { DarkPage, kit, Arrow } from "@/components/brand/dark-kit"
import n from "./not-found.module.css"

// This is the TRUE top-level not-found.tsx, outside both root layouts
// ((marketing) and [locale] — see the comment in app/(marketing)/layout.tsx).
// Neither route group wraps it, so without its own RootShell it renders with
// Next's bare default <html><body> and NO globals.css import (unstyled 404).
// It fires for genuinely unmatched top-level segments, so English + the
// standard site chrome is the right default (same choice (marketing) makes).
export default function NotFound() {
  const nav = enMessages.nav as Record<string, string>
  const common = enMessages.common as Record<string, string>
  const footer = enMessages.footer as Record<string, string>
  return (
    <RootShell lang="en-US" nav={nav} common={common} footer={footer}>
      <NotFoundContent />
    </RootShell>
  )
}

function NotFoundContent() {
  return (
    <DarkPage className={n.page}>
      <div className={`${n.main} ${kit.heroGlow}`}>
        <div className={kit.wrap}>
          <div className={n.grid}>
            {/* Left: editorial text */}
            <div>
              <p className={n.eyebrow}>
                Error 404
              </p>
              <h1 className={n.title}>
                Lost in AI search.
              </h1>
              <p className={n.lead}>
                This page isn&apos;t cited anywhere we can find. Maybe it moved, maybe it never existed. Here are three places worth a visit instead.
              </p>

              {/* Link cards */}
              <ul className={n.cards}>
                <li>
                  <Link
                    href="/app"
                    prefetch={false}
                    className={`${n.card} ${kit.sweep}`}
                  >
                    <p className={n.cardLabel}>Run a scan</p>
                    <p className={n.cardTitle}>Enter the tool</p>
                    <p className={n.cardText}>Visibility across 8 AI engines in minutes.</p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features"
                    className={`${n.card} ${kit.sweep}`}
                  >
                    <p className={n.cardLabel}>Browse features</p>
                    <p className={n.cardTitle}>14 features</p>
                    <p className={n.cardText}>Every capability in one place.</p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className={`${n.card} ${kit.sweep}`}
                  >
                    <p className={n.cardLabel}>Read the blog</p>
                    <p className={n.cardTitle}>GEO research</p>
                    <p className={n.cardText}>How AI search works today.</p>
                  </Link>
                </li>
              </ul>

              <div className={n.home}>
                <Link
                  href="/"
                  className={kit.btnLime}
                >
                  Back to home
                  <Arrow />
                </Link>
              </div>
            </div>

            {/* Right: playful scan-result card */}
            <div>
              <div className={n.window}>
                {/* Fake window chrome */}
                <div className={n.chrome}>
                  <span className={n.chromeDot} />
                  <span className={n.chromeDot} />
                  <span className={n.chromeDot} />
                </div>
                <div className={n.windowBody}>
                  {/* Mock query */}
                  <p className={n.queryLabel}>Query</p>
                  <p className={n.queryText}>404: page not found</p>
                  {/* Mock results */}
                  <div className={n.engines}>
                    {["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI Overviews", "Google AI Mode", "Bing Copilot", "Grok"].map((engine) => (
                      <div key={engine} className={n.engine}>
                        <p className={n.engineName}>{engine}</p>
                        <span className={n.engineState}>No citation</span>
                      </div>
                    ))}
                  </div>
                  <p className={n.windowFoot}>
                    0 of 8 engines know this URL. Try a scan on something real.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Agent recovery block.
              An agent that hits a 404 has no cheap way to re-plan: the status code
              alone says "not here" but not "here is where things are". This renders
              the SAME markdown body that /404.md and the .md twin 404s return, so a
              text extraction of this page yields a usable recovery document rather
              than a dead end. Humans get a readable list; the <pre> keeps the
              markdown link syntax intact for anything parsing the text. */}
          <div className={n.agents}>
            <p className={n.agentsLabel}>
              For agents and crawlers
            </p>
            <p className={n.agentsText}>
              This is a real HTTP 404, not an app shell — the page is genuinely absent. The same
              recovery document is served as markdown at{" "}
              <a href="/404.md" className={n.mdLink}>
                /404.md
              </a>
              .
            </p>
            <div className={n.agentsGrid}>
              <ul className={n.recovery}>
                {recoveryLinks.map((l) => (
                  <li key={l.href} className={n.recoveryItem}>
                    {/* Plain <a>, not next/link: half of these are route handlers
                        (/sitemap.xml, /llms.txt, /agents.md), which the client
                        router cannot navigate to. */}
                    <a
                      href={l.href}
                      className={n.recoveryLink}
                    >
                      {l.href}
                    </a>{" "}
                    — {l.what}
                  </li>
                ))}
              </ul>
              <pre className={n.pre}>
{markdown404Body()}
              </pre>
            </div>
            <p className={n.contact}>
              Contact: {siteConfig.contactEmail}
            </p>
          </div>
        </div>
      </div>
    </DarkPage>
  )
}
