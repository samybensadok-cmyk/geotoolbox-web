import Link from "next/link"

export function CTA() {
  return (
    <section className="bg-gray-950 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            See what AI says about your brand
          </h2>
          <p className="mt-4 text-base text-gray-400">
            Run your first scan in under a minute. Free — no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/app"
              className="rounded-full bg-accent-600 px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-500"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
