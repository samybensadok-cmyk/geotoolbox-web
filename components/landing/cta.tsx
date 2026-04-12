import Link from "next/link"

export function CTA() {
  return (
    <section className="border-t border-slate-200 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] text-slate-900">
          Stop guessing what AI<br className="hidden sm:block" /> says about your brand
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-slate-500">
          Run your first scan in under a minute. See your visibility score, competitor benchmarks, and citability analysis — free.
        </p>
        <div className="mt-10">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-slate-900 text-cream px-8 py-3.5 text-sm font-medium transition-colors hover:bg-slate-800"
          >
            Scan your brand now
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
