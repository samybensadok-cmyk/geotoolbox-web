import type { Metadata } from "next"
import Link from "next/link"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { FeatureHero } from "@/components/features/feature-hero"
import { RelatedFeatures } from "@/components/features/related-features"
import { FeatureFaq } from "@/components/features/feature-faq"
import { ScreenshotFrame } from "@/components/features/screenshot-frame"
import { PainScenarioSection } from "@/components/features/pain-scenario"
import { HowItWorks3Step, type Step } from "@/components/features/how-it-works"
import { ActVsMonitorWedge } from "@/components/features/act-vs-monitor"
import { FeatureComparisonTable } from "@/components/features/feature-comparison-table"
import { TrustSecurityBlock } from "@/components/features/trust-security"
import { siteConfig } from "@/lib/config"
import { JsonLd } from "@/components/seo/json-ld"
import { softwareApplicationSchema, howToSchema } from "@/lib/seo-schema"
import { marketingAlternatesFor } from "@/lib/i18n/siblings"
import { kit as k, Arrow } from "@/components/brand/dark-kit"
import { FeaturePage, FxSection, FxHead, FeatureCloseCta, HeroAccent } from "@/components/features/fx"

// Localized Ask GeoToolBox feature page: en at /features/ask-geotoolbox, fr at
// /fr/features/ask-geotoolbox. Relocated from
// app/(marketing)/features/ask-geotoolbox. ALL display copy lives in the
// `featurePages.ask-geotoolbox` message namespace (shared strings in
// `featurePages.common`); structural data — hue, screenshot files/dimensions,
// cell booleans — stays here. Product, tier and engine names are never
// translated; the plan-gating CTA points to the base-prefixed /pricing.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "featurePages.ask-geotoolbox.meta" })
  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: { title: t("ogTitle"), description: t("ogDescription") },
    alternates: marketingAlternatesFor("/features/ask-geotoolbox", locale),
  }
}

type TrustItem = { title: string; body: string }
type CompRow = { label: string; cells: (boolean | string)[] }
type Faq = { question: string; answer: string }

export default async function AskGeoToolBoxPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("featurePages.ask-geotoolbox")
  const c = await getTranslations("featurePages.common")
  const base = locale === routing.defaultLocale ? "" : `/${locale}`
  const urlBase = `${siteConfig.url}${base}`

  const steps = t.raw("how.steps") as Step[]
  const trustItems = t.raw("trust.items") as TrustItem[]
  const comparisonColumns = t.raw("comparison.columns") as string[]
  const comparisonRows = t.raw("comparison.rows") as CompRow[]
  const faqs = t.raw("faqs") as Faq[]
  const cardDescriptions = c.raw("cardDescriptions") as Record<string, string>
  const breadcrumbLabels = { home: c("breadcrumbHome"), features: c("breadcrumbFeatures") }

  return (
    <FeaturePage>
      <JsonLd
        data={[
          softwareApplicationSchema({
            name: "Ask GeoToolBox",
            description: t("schema.appDescription"),
            url: `${urlBase}/features/ask-geotoolbox`,
          }),
          howToSchema({
            name: t("schema.howToName"),
            steps: steps.map((s) => ({ name: s.title, text: s.body })),
          }),
        ]}
      />

      <FeatureHero
        featureName="Ask GeoToolBox"
        hue="amber"
        base={base}
        breadcrumbLabels={breadcrumbLabels}
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.h1Lead")} <HeroAccent text={t("hero.h1Accent")} />
            {t("hero.h1Tail")}
          </>
        }
        subhead={t("hero.subhead")}
        primaryLabel={t("hero.primaryLabel")}
        primaryHref={`${base}/pricing`}
        secondaryLabel={t("hero.secondaryLabel")}
        secondaryHref="#how"
        microcopy={t("hero.microcopy")}
      >
        <ScreenshotFrame
          src="/screenshots/ask-geotoolbox/chat.png"
          alt={t("hero.screenshotAlt")}
          width={1750}
          height={1360}
          priority
          caption={t("hero.screenshotCaption")}
        />
      </FeatureHero>

      <PainScenarioSection
        eyebrow={t("pain.eyebrow")}
        scenario={t("pain.scenario")}
        bridge={t("pain.bridge")}
      />

      <div id="how">
        <HowItWorks3Step heading={t("how.heading")} steps={steps} />
      </div>

      <TrustSecurityBlock heading={t("trust.heading")} items={trustItems} />

      <ActVsMonitorWedge
        eyebrow={c("wedge.eyebrow")}
        headline={c("wedge.headline")}
        emphasis={c("wedge.emphasis")}
        body={t("wedge.body")}
        example={t("wedge.example")}
        link={{ label: t("wedge.linkLabel"), href: `${base}/features/domain-overview` }}
      />

      {/* Comparison */}
      <FxSection band narrow>
        <FxHead eyebrow={t("comparison.eyebrow")} title={t("comparison.h2")} />
        <FeatureComparisonTable
          columns={comparisonColumns}
          rows={comparisonRows}
          yesLabel={c("comparison.yes")}
          noLabel={c("comparison.no")}
        />
      </FxSection>

      <FeatureFaq items={faqs} heading={c("faqHeading")} />

      <RelatedFeatures
        current="ask-geotoolbox"
        related={["domain-overview", "competitor-intel", "analytics"]}
        base={base}
        copy={c.raw("related") as { eyebrow: string; heading: string; allFeatures: string; learnMore: string }}
        descriptions={cardDescriptions}
      />

      {/* Final CTA */}
      <FeatureCloseCta title={t("finalCta.h2")} sub={t("finalCta.sub")}>
        <Link href={`${base}/pricing`} prefetch={false} className={k.btnLime}>
          {t("finalCta.button")}
          <Arrow />
        </Link>
      </FeatureCloseCta>
    </FeaturePage>
  )
}
