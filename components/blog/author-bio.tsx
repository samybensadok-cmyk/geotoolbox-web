import Link from "next/link"
import { Avatar } from "@/components/ui/avatar"
import type { Author } from "@/lib/authors"

/**
 * In-article author bio card. Rendered at the foot of every blog post, the
 * way Ahrefs / Semrush surface author E-E-A-T. Avatar, name (links to the
 * author page), role, short bio, and external profile links.
 */
export function AuthorBio({ author }: { author: Author }) {
  return (
    <aside className="mt-14 rounded-2xl border border-[var(--surface-warm-border)] bg-[var(--surface-warm)] p-6 sm:p-8">
      <p className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-800">
        Written by
      </p>
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        <Link href={`/author/${author.slug}`} className="shrink-0" aria-label={author.name}>
          <Avatar name={author.name} src={author.avatar} size={64} />
        </Link>
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <Link
              href={`/author/${author.slug}`}
              className="text-[17px] font-bold tracking-tight text-gray-900 hover:text-accent-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              {author.name}
            </Link>
            <span className="text-[13.5px] text-gray-500">{author.role}</span>
          </div>
          <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-gray-700">
            {author.bio}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            <Link
              href={`/author/${author.slug}`}
              className="inline-flex items-center gap-1.5 font-semibold text-accent-700 hover:text-accent-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
            >
              More articles
              <svg className="h-3 w-3" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7h6m0 0L7 4m3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            {author.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel={l.sameAs === false ? "noopener noreferrer" : "me noopener noreferrer"}
                className="font-medium text-gray-500 transition-colors hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
