import Link from "next/link"

export function CTA() {
  return (
    <section className="border-t border-gray-100 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            See what AI says about your brand
          </h2>
          <p className="mt-4 text-base text-gray-500">
            Run your first scan in under a minute. Free — no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/app"
              className="rounded-full bg-gray-900 px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
