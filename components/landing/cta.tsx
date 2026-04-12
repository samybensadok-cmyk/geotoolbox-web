import Link from "next/link"

export function CTA() {
  return (
    <section className="bg-gray-950 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold tracking-tight text-white">
            Your competitors are already being recommended by AI.
            <span className="text-gray-500"> Are you?</span>
          </h2>
          <p className="mt-5 text-base text-gray-400">
            Run your first scan in under a minute. See your visibility score, competitor benchmarks, and citability analysis.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/app"
              className="rounded-full bg-accent-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-500 hover:shadow-lg hover:shadow-accent-600/20"
            >
              Start free trial
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-white"
            >
              Read the research &rarr;
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-600">
            Free forever for basic scans &middot; No credit card required
          </p>
        </div>
      </div>
    </section>
  )
}
