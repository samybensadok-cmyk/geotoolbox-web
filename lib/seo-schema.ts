import { siteConfig } from "./config"
import { getAuthorByName, PRIMARY_AUTHOR, type Author } from "./authors"

/**
 * PostalAddress node for the Organization — omitted entirely unless siteConfig
 * carries a real locality/country pair. A half-filled PostalAddress (a country
 * with no locality, say) is worse than none: validators flag it and agents that
 * read it for a contact answer get a dead end. See the `address` comment in
 * lib/config.ts for the operator switch.
 */
export function postalAddressSchema() {
  const a = siteConfig.address
  const filled = Object.entries(a).filter(([, v]) => Boolean(v && v.trim()))
  if (!a.addressCountry?.trim() || !a.addressLocality?.trim()) return null
  return { "@type": "PostalAddress", ...Object.fromEntries(filled) }
}

/**
 * ContactPoint node for the Organization — the machine-readable "how to reach a
 * human" record. Agent-readiness scanners look for contactType + a reachable
 * channel on the Organization node itself, not only on /contact.
 */
export function organizationContactPoint() {
  return {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: siteConfig.contactEmail,
    url: `${siteConfig.url}/contact`,
    availableLanguage: ["English", "French", "Spanish"],
    areaServed: "Worldwide",
  }
}

/**
 * Organization schema — homepage identity card for AI / knowledge panels.
 */
export function organizationSchema() {
  const founder = PRIMARY_AUTHOR
  const address = postalAddressSchema()
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: ["GeoToolBox", "geotoolbox.ai", "GEO Toolbox AI"],
    // Entity disambiguation. "GEO Toolbox" is a heavily contested string: an
    // unqualified search for it returns geocaching toolboxes, GIS/geospatial
    // toolkits, MATLAB's Mapping Toolbox and geodetic software — none of them
    // us. disambiguatingDescription exists precisely for this case and gives an
    // engine one sentence to separate the entities.
    disambiguatingDescription:
      "GEO Toolbox (geotoolbox.ai) is a generative engine optimization (GEO) analytics platform that measures brand visibility and citations in AI answer engines. It is unrelated to geocaching toolboxes, GIS and geospatial toolkits, and geodetic or GPS software that share the 'geo toolbox' name.",
    knowsAbout: [
      "Generative engine optimization",
      "AI search visibility",
      "AI citation tracking",
      "Answer engine optimization",
      "Large language model search",
      "Agent readiness",
      "Search engine optimization",
    ],
    url: siteConfig.url,
    logo: `${siteConfig.url}/opengraph-image`,
    description: siteConfig.description,
    foundingDate: "2026-04",
    email: siteConfig.contactEmail,
    contactPoint: [organizationContactPoint()],
    ...(address ? { address } : {}),
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
    // SG_PRICING_V2.1: Free is retired — feature pages describe capabilities of
    // a paid product ($99–$999 self-serve range), so the schema must not assert
    // a $0 offer that no longer exists.
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "99",
      highPrice: "999",
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
  updated?: string
  author?: string
  image?: string
  inLanguage?: string
  url?: string
}) {
  const pageUrl = post.url ?? `${siteConfig.url}/blog/${post.slug}`
  // Must mirror the URL Next's metadata-image convention actually serves:
  // <pageUrl>/opengraph-image/og — the `/og` segment comes from
  // generateImageMetadata in [slug]/opengraph-image.tsx, and pageUrl carries
  // the locale prefix for fr/es. The bare `/blog/<slug>/opengraph-image`
  // shape 404s on every locale.
  const fallbackImage = `${pageUrl}/opengraph-image/og`
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
    dateModified: post.updated ?? post.date,
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
    ...(post.inLanguage ? { inLanguage: post.inLanguage } : {}),
    // Voice/AI-assistant extraction anchor (same pattern as Abondance/BDM):
    // the headline + the hero summary paragraph.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable-summary"],
    },
  }
}

/**
 * Review schema — product-review posts (e.g. /blog/semrush-review). Drives
 * review-star rich results on the SERP. Emitted alongside Article schema when
 * a post carries a `review:` frontmatter block. itemReviewed is a third-party
 * SoftwareApplication (never our own product — self-serving reviews are
 * ineligible for the snippet per Google's guidelines).
 */
export function reviewSchema(post: {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  author?: string
  url?: string
  review: {
    itemName: string
    itemUrl?: string
    rating: number
    lowPrice?: number
    highPrice?: number
  }
}) {
  const pageUrl = post.url ?? `${siteConfig.url}/blog/${post.slug}`
  const profile = getAuthorByName(post.author)
  const author = profile
    ? {
        "@type": "Person",
        "@id": `${siteConfig.url}/author/${profile.slug}#person`,
        name: profile.name,
        url: `${siteConfig.url}/author/${profile.slug}`,
      }
    : { "@type": "Person", name: post.author || siteConfig.author }
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "@id": `${pageUrl}#review`,
    name: post.title,
    reviewBody: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: post.review.itemName,
      operatingSystem: "Web",
      applicationCategory: "BusinessApplication",
      ...(post.review.itemUrl ? { url: post.review.itemUrl } : {}),
      ...(post.review.lowPrice != null && post.review.highPrice != null
        ? {
            offers: {
              "@type": "AggregateOffer",
              lowPrice: String(post.review.lowPrice),
              highPrice: String(post.review.highPrice),
              priceCurrency: "USD",
            },
          }
        : {}),
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(post.review.rating),
      bestRating: "5",
      worstRating: "1",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
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
  // Locale of the page emitting the schema; non-en locales prefix the URLs
  // (/fr/glossary/...) so the self-referential url matches the page. Optional
  // so EN callers stay byte-identical.
  locale?: string
  setName?: string
}) {
  const prefix = t.locale && t.locale !== "en" ? `/${t.locale}` : ""
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    url: `${siteConfig.url}${prefix}/glossary/${t.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: t.setName ?? `${siteConfig.name} Glossary`,
      url: `${siteConfig.url}${prefix}/glossary`,
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
export function faqPageSchema(qa: Array<{ question: string; answer: string }>, inLanguage?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(inLanguage ? { inLanguage } : {}),
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
 * ContactPage schema — the /contact page. Points at the Organization node and
 * exposes a ContactPoint so AI engines / knowledge panels can surface how to
 * reach us.
 */
export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${siteConfig.name}`,
    url: `${siteConfig.url}/contact`,
    description: `Get in touch with the ${siteConfig.name} team about sales, support, partnerships, or general questions.`,
    mainEntity: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      email: "samy@geotoolbox.ai",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "samy@geotoolbox.ai",
        url: `${siteConfig.url}/contact`,
        availableLanguage: ["English"],
      },
    },
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
