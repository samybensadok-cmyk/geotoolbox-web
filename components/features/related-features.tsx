import Link from "next/link"
import { siteConfig } from "@/lib/config"
import { Arrow, kit as k } from "@/components/brand/dark-kit"
import { FxIndex } from "./fx"
import s from "./fx.module.css"

type Slug =
  | "ai-visibility-tracker"
  | "geo-scan"
  | "agent-readiness"
  | "content-analyzer"
  | "content-studio"
  | "domain-overview"
  | "competitor-intel"
  | "analytics"
  | "community"
  | "citation-interceptor"
  | "pr-coverage-tracker"
  | "query-fanout"
  | "ask-geotoolbox"
  | "white-label-reports"

const ALL_FEATURES = siteConfig.featureGroups.flatMap((g) => g.features)

export function RelatedFeatures({
  current,
  related,
  base = "",
  copy,
  descriptions,
}: {
  current: Slug
  related: Slug[]
  /** locale path prefix for hrefs ("" for en, "/fr" for fr) */
  base?: string
  /** localized section copy; EN defaults keep EN byte-identical */
  copy?: { eyebrow?: string; heading?: string; allFeatures?: string; learnMore?: string }
  /** per-slug localized card blurbs; falls back to the EN desc from siteConfig */
  descriptions?: Partial<Record<Slug, string>>
}) {
  const items = related
    .map((slug) => ALL_FEATURES.find((f) => f.slug === slug))
    .filter((f): f is (typeof ALL_FEATURES)[number] => Boolean(f))

  if (items.length === 0) return null

  // Dark kit: an index of rows like the homepage free-tools list (number, name + blurb, arrow).
  return (
    <section className={`${s.sec} ${s.secBand}`}>
      <div className={`${k.wrap} ${s.relSplit}`}>
        <div>
          <FxIndex label={copy?.eyebrow ?? "Keep exploring"} />
          <h2 className={s.title}>{copy?.heading ?? "Related features"}</h2>
          <Link href={`${base}/features`} className={`${k.btnOutline} ${s.relAll}`}>
            {copy?.allFeatures ?? "All features"}
            <Arrow />
          </Link>
        </div>

        <ol className={s.relList}>
          {items.map((f, i) => (
            <li key={f.slug}>
              <Link href={`${base}/features/${f.slug}`} className={s.relRow}>
                <span className={s.relNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={s.relName}>{f.name}</h3>
                  <span className={s.relDesc}>{descriptions?.[f.slug as Slug] ?? f.desc}</span>
                </div>
                <span className={s.relMore}>
                  <span>{copy?.learnMore ?? "Learn more"}</span>
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
