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
  // External profiles. Rendered as visible links unless `hidden` is set.
  // Those with `sameAs !== false` are also emitted in Person.sameAs (use false
  // for brand/team channels that are not the person's own identity profile).
  // `hidden: true` keeps a profile in Person.sameAs (an E-E-A-T signal for
  // search/AI engines) without surfacing it as a visible UI link.
  links: { label: string; href: string; sameAs?: boolean; hidden?: boolean }[]
}

export const authors: Record<string, Author> = {
  "samy-ben-sadok": {
    slug: "samy-ben-sadok",
    name: "Samy Ben Sadok",
    role: "Founder, GEO Toolbox",
    company: "GEO Toolbox",
    companyUrl: "https://geotoolbox.ai",
    location: "Barcelona, Spain",
    bio: "I'm the founder of GEO Toolbox, host of the Collaborator.pro podcast, and an SEO and growth strategist with over a decade of experience across 150+ projects in competitive niches like crypto and CBD.",
    longBio:
      "I'm Samy Ben Sadok, founder of GEO Toolbox and an SEO and growth strategist with over a decade of experience, having led more than 150 projects across some of the most competitive industries, including crypto and CBD. Based in Barcelona, I host the Collaborator.pro podcast and write GEO Toolbox's research on generative engine optimization and getting brands cited in AI search engines like ChatGPT, Perplexity, and Google AI Overviews.",
    avatar: "/authors/samy-ben-sadok.jpg",
    expertise: [
      "Search Engine Optimization",
      "Generative Engine Optimization",
      "AI Search",
      "Growth Marketing",
      "Technical SEO",
    ],
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/samy-ben-sadok-senior-seo/" },
      { label: "Hire me", href: "https://en.malt.fr/profile/samybensadok" },
      // Kept in Person.sameAs for E-E-A-T, but not shown as a visible link.
      { label: "Semrush", href: "https://www.semrush.com/blog/user/171920913/", hidden: true },
      // Brand/team channel he hosts — shown as a link, kept out of Person.sameAs.
      { label: "YouTube", href: "https://www.youtube.com/@Collaborator-pro", sameAs: false },
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
