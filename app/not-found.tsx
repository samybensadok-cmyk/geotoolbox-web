import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <p className="text-xs font-semibold tracking-wider text-accent-600 uppercase">404</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
        Page not found
      </h1>
      <p className="mt-2 text-base text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Go home
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
        >
          Read the blog
        </Link>
      </div>
    </div>
  )
}
