// Author registry. Blog posts carry a free-text `author` frontmatter string;
// this maps it to a structured profile used for the byline, the in-article
// bio card, the /author/[slug] page, and Person/author JSON-LD.

export type Author = {
  slug: string
  name: string
  role: string
  company?: string
  companyUrl?: string
  location?: string
  // Short bio for the in-article byline card (1-2 sentences).
  bio: string
  // Longer bio for the dedicated author page.
  longBio: string
  // Optional headshot at /public{avatar}. Falls back to an initials monogram.
  avatar?: string
  // Topics for Person.knowsAbout (E-E-A-T signal).
  expertise: string[]
  // External profiles for Person.sameAs and the visible social links.
  links: { label: string; href: string }[]
}

export const authors: Record<string, Author> = {
  "samy-ben-sadok": {
    slug: "samy-ben-sadok",
    name: "Samy Ben Sadok",
    role: "Founder, GEO Toolbox",
    company: "GEO Toolbox",
    companyUrl: "https://geotoolbox.ai",
    location: "Barcelona, Spain",
    bio: "Founder of GEO Toolbox and an SEO and growth strategist with over a decade of experience across 150+ projects, many in competitive niches like crypto and CBD.",
    longBio:
      "Samy Ben Sadok is the founder of GEO Toolbox and an SEO and growth strategist with over a decade of experience, having led more than 150 projects across some of the most competitive industries, including crypto and CBD. Based in Barcelona, he writes GEO Toolbox's research on generative engine optimization and getting brands cited in AI search engines like ChatGPT, Perplexity, and Google AI Overviews.",
    // avatar: "/authors/samy-ben-sadok.jpg", // drop a headshot here and uncomment
    expertise: [
      "Search Engine Optimization",
      "Generative Engine Optimization",
      "AI Search",
      "Growth Marketing",
      "Technical SEO",
    ],
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/samy-ben-sadok-senior-seo/" },
      { label: "Semrush", href: "https://www.semrush.com/blog/user/171920913/" },
    ],
  },
}

// Resolve a frontmatter author string (e.g. "Samy BEN SADOK") to a profile.
// Matching is case-insensitive and ignores extra whitespace.
export function getAuthorByName(name: string | undefined): Author | undefined {
  if (!name) return undefined
  const norm = name.trim().toLowerCase().replace(/\s+/g, " ")
  return Object.values(authors).find(
    (a) => a.name.toLowerCase() === norm || a.slug === norm.replace(/\s+/g, "-"),
  )
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors[slug]
}

export function getAllAuthors(): Author[] {
  return Object.values(authors)
}

// The site's default/primary author, used as a fallback.
export const PRIMARY_AUTHOR = authors["samy-ben-sadok"]
