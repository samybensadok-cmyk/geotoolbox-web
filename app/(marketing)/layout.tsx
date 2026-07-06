import enMessages from "@/messages/en.json"
import { RootShell } from "@/components/layout/root-shell"
import { rootMetadata } from "@/lib/root-metadata"

export const metadata = rootMetadata

// ROOT LAYOUT #1 — the EN-only marketing/tool/legal tree (route group name is
// invisible to URLs). It hardcodes lang="en-US" and loads en messages via a
// STATIC import — it never calls getLocale()/getMessages(), so it reads nothing
// from the request and every page under it prerenders STATICALLY + edge-caches.
// That is the fix for the homepage's dynamic-SSR + `no-store` LCP tax. The
// per-locale tree has its own root layout at app/[locale]/layout.tsx.
export default function MarketingRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nav = enMessages.nav as Record<string, string>
  const common = enMessages.common as Record<string, string>
  const footer = enMessages.footer as Record<string, string>
  return (
    <RootShell lang="en-US" nav={nav} common={common} footer={footer}>
      {children}
    </RootShell>
  )
}
