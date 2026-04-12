import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24 px-6">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-600 via-purple-600 to-blue-600" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Start tracking your AI visibility
        </h2>
        <p className="mt-4 text-lg text-white/80">
          See what AI engines say about your brand — before your competitors do.
        </p>
        <div className="mt-8">
          <Button
            href="/app"
            size="lg"
            className="bg-white text-brand-700 hover:bg-white/90 hover:shadow-white/25"
          >
            Try GEO Toolbox Free
          </Button>
        </div>
      </div>
    </section>
  )
}
