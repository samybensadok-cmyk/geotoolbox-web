import Link from "next/link"
import { siteConfig } from "@/lib/config"

export function Breadcrumbs({ featureName }: { featureName: string }) {
  const items = [
    { name: "Home", url: siteConfig.url + "/" },
    { name: "Features", url: siteConfig.url + "/features" },
    { name: featureName, url: "" },
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
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
          <li>
            <Link href="/" className="font-medium text-gray-600 hover:text-accent-700">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">/</li>
          <li>
            <Link href="/features" className="font-medium text-gray-600 hover:text-accent-700">
              Features
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">/</li>
          <li aria-current="page" className="font-semibold text-gray-900">
            {featureName}
          </li>
        </ol>
      </nav>
    </>
  )
}
