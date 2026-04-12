import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-transparent to-transparent dark:from-brand-950/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-brand-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 text-center sm:py-32 lg:py-40">
        <div className="animate-fade-up">
          <Badge variant="outline" className="mb-6">
            Now in Beta
          </Badge>
        </div>

        <h1 className="animate-fade-up mx-auto max-w-4xl text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
          See How AI Engines{" "}
          <span className="bg-gradient-to-r from-brand-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            See Your Brand
          </span>
        </h1>

        <p className="animate-fade-up-delay mx-auto mt-6 max-w-2xl text-lg text-text-secondary leading-relaxed">
          Track your visibility across ChatGPT, Perplexity, Gemini, Claude, and more.
          Know when AI recommends you — and when it doesn&apos;t.
        </p>

        <div className="animate-fade-up-delay-2 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/app" size="lg">
            Try It Free
          </Button>
          <Button href="/blog" variant="outline" size="lg">
            Read the Blog
          </Button>
        </div>
      </div>
    </section>
  )
}
