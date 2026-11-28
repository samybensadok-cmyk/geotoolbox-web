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
import { DarkPage, Index, kit } from "@/components/brand/dark-kit"
import s from "./author.module.css"

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
      <DarkPage className={s.page}>
        {/* Author hero */}
        <section className={`${s.hero} ${kit.heroGlow}`}>
          <JsonLd data={authorProfileSchema(author)} />
          <div className={kit.wrap}>
            <div className={s.crumbs}>
              <Breadcrumbs
                tone="dark"
                trail={[
                  { name: "Home", href: "/" },
                  { name: "Blog", href: "/blog" },
                  { name: author.name, href: "" },
                ]}
              />
            </div>
            <div className={s.profile}>
              <Avatar name={author.name} src={author.avatar} size={128} className={s.avatar} />
              <div className={s.copy}>
                <Index label="Author" />
                <h1 className={s.name}>
                  {author.name}
                </h1>
                <p className={s.meta}>
                  <span className={s.role}>{author.role}</span>
                  {author.location && (
                    <>
                      <span aria-hidden="true" className={s.dot}>&middot;</span>
                      <span>{author.location}</span>
                    </>
                  )}
                </p>
                <p className={s.bio}>
                  {author.longBio}
                </p>
                <div className={s.links}>
                  {author.links.filter((l) => !l.hidden).map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel={l.sameAs === false ? "noopener noreferrer" : "me noopener noreferrer"}
                      className={`${kit.btnOutline} ${s.pill}`}
                    >
                      {l.label}
                      <svg className={s.ext} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M5 9l4-4m0 0H6m3 0v3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles by this author: dark heading; the cards below stay on the light reading ground */}
        <div className={s.listHead}>
          <div className={`${kit.wrap} ${s.listHeadInner}`}>
            <h2 className={s.listTitle}>
              Articles by {firstName}
            </h2>
            <p className={s.listCount}>
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </div>
      </DarkPage>

      <section className={s.reading}>
        <div className={s.readingInner}>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-gray-500">No articles yet.</p>
          )}
        </div>
      </section>
    </>
  )
}
