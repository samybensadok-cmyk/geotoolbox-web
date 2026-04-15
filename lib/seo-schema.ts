import { siteConfig } from "./config"

/**
 * Organization schema — homepage identity card for AI / knowledge panels.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/opengraph-image`,
    description: siteConfig.description,
    sameAs: Object.values(siteConfig.links),
  }
}

/**
 * WebSite schema — pairs with Organization on the homepage.
 * Adds a sitelinks search box for Google SERPs.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}

/**
 * SoftwareApplication schema — feature pages describe a distinct product unit.
 * Marks them up as SaaS tools AI engines can parse.
 */
export function softwareApplicationSchema({
  name,
  description,
  url,
  applicationCategory = "BusinessApplication",
  applicationSubCategory,
}: {
  name: string
  description: string
  url: string
  applicationCategory?: string
  applicationSubCategory?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    ...(applicationSubCategory ? { applicationSubCategory } : {}),
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }
}

/**
 * Article schema — blog posts. Required fields: headline, datePublished, author, publisher.
 */
export function articleSchema(post: {
  slug: string
  title: string
  description: string
  date: string
  author?: string
  image?: string
}) {
  const pageUrl = `${siteConfig.url}/blog/${post.slug}`
  const fallbackImage = `${siteConfig.url}/blog/${post.slug}/opengraph-image`
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author || siteConfig.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/opengraph-image`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    image: [post.image || fallbackImage],
  }
}

/**
 * BreadcrumbList schema — drives breadcrumb rich results in SERP.
 * Pass the visible trail: [{ name: "Home", url: "/" }, { name: "Features", url: "/features" }, ...]
 */
export function breadcrumbsSchema(trail: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  }
}
