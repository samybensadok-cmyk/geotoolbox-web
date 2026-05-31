import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getAuthorBySlug, getAllAuthors, getAuthorByName } from "@/lib/authors"
import { getAllPosts } from "@/lib/content"
import { siteConfig } from "@/lib/config"
import { Avatar } from "@/components/ui/avatar"
import { BlogCard } from "@/components/blog/blog-card"
import { Breadcrumbs } from "@/components/features/breadcrumbs"
import { JsonLd } from "@/components/seo/json-ld"
import { authorProfileSchema } from "@/lib/seo-schema"

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) return {}
  return {
    title: `${author.name} — ${author.role}`,
    description: author.bio,
    alternates: { canonical: `${siteConfig.url}/author/${slug}` },
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) notFound()

  const posts = getAllPosts().filter(
    (p) => getAuthorByName(p.author)?.slug === author.slug,
  )
  const firstName = author.name.split(" ")[0]

  return (
    <>
      {/* Author hero */}
      <section className="bg-[var(--surface-warm)] px-6 pt-16 pb-12 sm:pt-20 sm:pb-16">
        <JsonLd data={authorProfileSchema(author)} />
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            trail={[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: author.name, href: "" },
            ]}
          />
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <Avatar name={author.name} src={author.avatar} size={96} className="sm:mt-1" />
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-800">
                Author
              </p>
              <h1 className="mt-2 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold leading-tight tracking-tight text-gray-900">
                {author.name}
              </h1>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14.5px] text-gray-600">
                <span className="font-semibold text-gray-800">{author.role}</span>
                {author.location && (
                  <>
                    <span aria-hidden="true" className="text-gray-400">&middot;</span>
                    <span>{author.location}</span>
                  </>
                )}
              </p>
              <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-gray-700">
                {author.longBio}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {author.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel={l.sameAs === false ? "noopener noreferrer" : "me noopener noreferrer"}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--surface-warm-border)] bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-accent-400 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
                  >
                    {l.label}
                    <svg className="h-3 w-3 text-gray-400" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 9l4-4m0 0H6m3 0v3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles by this author */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[clamp(1.25rem,2.5vw,1.6rem)] font-bold tracking-tight text-gray-900">
            Articles by {firstName}
          </h2>
          <p className="mt-1.5 text-[14.5px] text-gray-500">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
          {posts.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-[15px] text-gray-500">No articles yet.</p>
          )}
        </div>
      </section>
    </>
  )
}
