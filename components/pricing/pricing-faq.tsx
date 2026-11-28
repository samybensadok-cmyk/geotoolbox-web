import k from "@/components/brand/dark-kit.module.css"
import st from "./pricing-experience.module.css"

type FAQItem = { question: string; answer: string }

/**
 * Pricing FAQ in the dark kit (2026-11-28). Same content, heading level and FAQPage JSON-LD as the
 * shared FeatureFaq it replaces on /pricing (compact layout, every item collapsed); FeatureFaq itself
 * stays as it is for the other pages that use it.
 */
export function PricingFaq({ items, heading }: { items: FAQItem[]; heading: string }) {
  if (items.length === 0) return null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <section className={`${k.section} ${k.sectionBorder}`}>
      <div className={`${k.wrap} ${st.split}`}>
        <div>
          <p className={k.index}>
            FAQ
          </p>
          <h2 className={st.splitTitle}>
            {heading}
          </h2>
        </div>

        <ul className={`${k.faq} ${st.faqList}`}>
          {items.map((item, i) => (
            <li key={i}>
              <details>
                <summary>
                  <span className={st.faqQ}>
                    <span className={st.faqNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {item.question}
                    </span>
                  </span>
                </summary>
                <div className={st.faqA}>
                  {item.answer}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}
