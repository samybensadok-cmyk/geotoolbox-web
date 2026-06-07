import { siteConfig } from "./config"
import { getAuthorByName, PRIMARY_AUTHOR, type Author } from "./authors"

/**
 * Organization schema — homepage identity card for AI / knowledge panels.
 */
export function organizationSchema() {
  const founder = PRIMARY_AUTHOR
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/opengraph-image`,
    description: siteConfig.description,
    foundingDate: "2026-04",
    sameAs: Object.values(siteConfig.links),
    founder: {
      "@type": "Person",
      "@id": `${siteConfig.url}/author/${founder.slug}#person`,
      name: founder.name,
      url: `${siteConfig.url}/author/${founder.slug}`,
      jobTitle: founder.role,
      sameAs: founder.links.filter((l) => l.sameAs !== false).map((l) => l.href),
    },
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
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
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
        "@id": `${siteConfig.url}/author/${profile.slug}#person`,
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
      "@id": `${siteConfig.url}/author/${author.slug}#person`,
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

/**
 * AboutPage schema — /about. Anchors the canonical Organization entity (same
 * @id as the homepage Organization) so AI engines and knowledge panels resolve
 * GEO Toolbox to one entity. Emit alongside organizationSchema() on /about.
 */
export function aboutPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${siteConfig.name}`,
    url: `${siteConfig.url}/about`,
    description: siteConfig.description,
    mainEntity: { "@id": `${siteConfig.url}/#organization` },
  }
}

/**
 * ItemList schema — ordered collections (the /features hub, "best tools"
 * listicles). Pass items in display order; position is 1-based.
 */
export function itemListSchema(
  items: Array<{ name: string; url: string }>,
  opts: { name?: string } = {},
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    ...(opts.name ? { name: opts.name } : {}),
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url.startsWith("http") ? it.url : `${siteConfig.url}${it.url}`,
    })),
  }
}

/**
 * HowTo schema — the "How it works" 3-step sections on feature pages (the one
 * remaining structured-data gap; FAQPage + SoftwareApplication are already
 * emitted elsewhere). Single source of truth: the page passes the SAME steps
 * array to both the HowItWorks3Step component (visible) and this helper (JSON-LD).
 */
export function howToSchema({
  name,
  steps,
}: {
  name: string
  steps: Array<{ name: string; text: string }>
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}
