import { siteConfig } from "./config"
import { getAuthorByName, type Author } from "./authors"

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
  const profile = getAuthorByName(post.author)
  const author = profile
    ? {
        "@type": "Person",
        name: profile.name,
        url: `${siteConfig.url}/author/${profile.slug}`,
        jobTitle: profile.role,
        ...(profile.avatar ? { image: `${siteConfig.url}${profile.avatar}` } : {}),
        knowsAbout: profile.expertise,
        sameAs: profile.links.filter((l) => l.sameAs !== false).map((l) => l.href),
      }
    : { "@type": "Person", name: post.author || siteConfig.author }
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author,
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

/**
 * DefinedTerm schema — glossary entries. Marks each term up as part of the
 * site's DefinedTermSet so AI engines and knowledge panels can parse the
 * definition. Pair with faqPageSchema for AI Overview / PAA pickup.
 */
export function definedTermSchema(t: {
  slug: string
  term: string
  definition: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    url: `${siteConfig.url}/glossary/${t.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `${siteConfig.name} Glossary`,
      url: `${siteConfig.url}/glossary`,
    },
  }
}

/**
 * ProfilePage + Person schema — the /author/[slug] page. Establishes the
 * author as a real entity (sameAs to LinkedIn/Semrush, jobTitle, knowsAbout)
 * so search and AI engines can attribute and trust the content they write.
 */
export function authorProfileSchema(author: Author) {
  const url = `${siteConfig.url}/author/${author.slug}`
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      url,
      jobTitle: author.role,
      description: author.longBio,
      ...(author.avatar ? { image: `${siteConfig.url}${author.avatar}` } : {}),
      ...(author.company
        ? {
            worksFor: {
              "@type": "Organization",
              name: author.company,
              ...(author.companyUrl ? { url: author.companyUrl } : {}),
            },
          }
        : {}),
      ...(author.location
        ? { homeLocation: { "@type": "Place", name: author.location } }
        : {}),
      knowsAbout: author.expertise,
      sameAs: author.links.filter((l) => l.sameAs !== false).map((l) => l.href),
    },
  }
}

/**
 * FAQPage schema — a single "What is {term}?" question/answer. This is the
 * format that most reliably earns AI Overview and People-Also-Ask placement.
 */
export function faqPageSchema(qa: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}
