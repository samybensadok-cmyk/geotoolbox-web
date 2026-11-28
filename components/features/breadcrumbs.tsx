import Link from "next/link"
import { siteConfig } from "@/lib/config"
import s from "./crumbs.module.css"

type Crumb = { name: string; href: string }

export function Breadcrumbs({
  featureName,
  trail,
  tone = "light",
  base = "",
  labels,
}: {
  featureName?: string
  trail?: Crumb[]
  /** "dark" = no bottom gap (the dark feature hero spaces the trail itself); colors inherit either way */
  tone?: "light" | "dark"
  /** locale path prefix for the default trail's hrefs ("" for en, "/fr" for fr) */
  base?: string
  /** localized names for the default trail; EN defaults keep EN byte-identical */
  labels?: { home?: string; features?: string }
}) {
  // Support both the legacy featureName API (Features > X) and an arbitrary trail
  const crumbs: Crumb[] = trail
    ? trail
    : [
        { name: labels?.home ?? "Home", href: base || "/" },
        { name: labels?.features ?? "Features", href: `${base}/features` },
        { name: featureName ?? "", href: "" },
      ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: siteConfig.url + c.href } : {}),
    })),
  }

  // One trail for both grounds: colors come from the inherited text color (crumbs.module.css), so it
  // reads on light pages and inside <DarkPage>. `tone` only sets the spacing: the dark feature hero
  // spaces the trail itself, the default keeps the 32px gap below it.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={tone === "dark" ? s.crumbs : `${s.crumbs} ${s.crumbsSpaced}`}>
        <ol className={s.crumbList}>
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1
            return (
              <li key={`${c.name}-${i}`} className={s.crumbItem}>
                {i > 0 && (
                  <span aria-hidden="true" className={s.crumbSep}>
                    /
                  </span>
                )}
                {isLast || !c.href ? (
                  <span aria-current={isLast ? "page" : undefined} className={s.crumbHere}>
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.href} className={s.crumbLink}>
                    {c.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
