import Link from "next/link"
import { siteConfig } from "@/lib/config"

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
  /** "dark" renders the trail for a gray-950 ground (dark feature heroes) */
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-[13px]">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1
            return (
              <li key={`${c.name}-${i}`} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className={tone === "dark" ? "text-gray-600" : "text-gray-300"}>
                    /
                  </span>
                )}
                {isLast || !c.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={tone === "dark" ? "font-semibold text-white" : "font-semibold text-gray-900"}
                  >
                    {c.name}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className={
                      tone === "dark"
                        ? "font-medium text-gray-400 hover:text-white"
                        : "font-medium text-gray-600 hover:text-accent-700"
                    }
                  >
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
