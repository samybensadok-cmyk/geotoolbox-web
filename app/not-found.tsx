import Link from "next/link"

export default function NotFound() {
  return (
    <div className="bg-white px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          {/* Left: editorial text */}
          <div className="lg:col-span-6">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-700">
              Error 404
            </p>
            <h1 className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-gray-900">
              Lost in AI search.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600">
              This page isn&apos;t cited anywhere we can find. Maybe it moved, maybe it never existed. Here are three places worth a visit instead.
            </p>

            {/* Link cards */}
            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <li>
                <Link
                  href="/app"
                  prefetch={false}
                  className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-lg hover:shadow-gray-900/5"
                >
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700">Run a scan</p>
                  <p className="mt-2 text-[15px] font-semibold text-gray-900">Enter the tool</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-600">Visibility across 6 AI engines in minutes.</p>
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-lg hover:shadow-gray-900/5"
                >
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700">Browse features</p>
                  <p className="mt-2 text-[15px] font-semibold text-gray-900">Seven tools</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-600">Every capability in one place.</p>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-lg hover:shadow-gray-900/5"
                >
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-700">Read the blog</p>
                  <p className="mt-2 text-[15px] font-semibold text-gray-900">GEO research</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-gray-600">How AI search works today.</p>
                </Link>
              </li>
            </ul>

            <div className="mt-10">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-accent-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent-800 hover:shadow-xl hover:shadow-accent-900/25 active:translate-y-[1px]"
              >
                Back to home
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 10h12m0 0-4-4m4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: playful scan-result card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg shadow-gray-900/5 sm:p-8">
              {/* Fake window chrome */}
              <div className="mb-5 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              </div>
              {/* Mock query */}
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-gray-500">Query</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">404: page not found</p>
              {/* Mock results */}
              <div className="mt-6 space-y-2.5">
                {["ChatGPT", "Perplexity", "Gemini", "Claude", "Google AI Overviews", "Bing Copilot"].map((engine) => (
                  <div key={engine} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
                    <p className="text-[13px] font-semibold text-gray-900">{engine}</p>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-500">No citation</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 font-mono text-[11px] text-gray-600">
                0 of 6 engines know this URL. Try a scan on something real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
