// components/legal/legal-notice-de.tsx
// German Impressum. Translation of the bilingual FR/EN Mentions légales in
// components/legal/legal-notice-content.tsx (LCEN art. 1-1, C. com. R526-27), 2026-11-19.
// Every fact is copied verbatim from that file; French legal designations are kept
// with a German gloss. The note at the top states that the FR/EN version at /legal prevails.
const link = "text-accent-700 underline hover:text-accent-800"

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-3">
      <dt className="font-medium text-gray-900">{k}</dt>
      <dd className="sm:col-span-2">{v}</dd>
    </div>
  )
}

export function LegalNoticeDe() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Impressum</h1>
      <p className="mt-2 text-sm text-gray-600">Zuletzt aktualisiert: 15. August 2026</p>
      <p className="mt-2 text-xs text-gray-500">
        Diese Übersetzung dient ausschließlich der Information. Bei Abweichungen ist die{" "}
        <a href="/legal" className="underline">französische/englische Fassung</a> maßgeblich.
      </p>

      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Herausgeber der Website (éditeur du site)</h2>
          <dl className="mt-2 divide-y divide-gray-200">
            <Row k="Herausgeber" v={<>Samy Ben Sadok, <strong>entrepreneur individuel (EI)</strong> (Einzelunternehmer nach französischem Recht)</>} />
            <Row k="Anschrift" v="1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, Frankreich" />
            <Row k="Telefon" v="+33 6 11 41 21 42" />
            <Row k="E-Mail" v={<a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>} />
            <Row k="Registereintragung (immatriculation)" v="SIREN 827 472 424 — Registre national des entreprises (RNE), activité de conseil (APE 70.22Z) (französisches nationales Unternehmensregister; Beratungstätigkeit)" />
            <Row k="Umsatzsteuer (TVA)" v="TVA non applicable, art. 293 B du CGI (Umsatzsteuer nicht anwendbar gemäß Art. 293 B CGI)" />
            <Row k="Verantwortlich für den Inhalt (directeur de la publication)" v="Samy Ben Sadok" />
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Hosting (hébergeur)</h2>
          <dl className="mt-2 divide-y divide-gray-200">
            <Row k="Website (geotoolbox.ai)" v="Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA — Tel. +1 559 288 7060" />
            <Row k="Anwendung (/app)" v="Replit, Inc., 1001 E Hillsdale Blvd, Suite 400, Foster City, CA 94404, USA — support.replit.com" />
            <Row k="Datenbank" v="Neon, LLC (Databricks, Inc.), 160 Spear Street, Suite 1300, San Francisco, CA 94105, USA — Tel. +1 866 330 0121" />
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Bedingungen, Datenschutz und Schlichtung</h2>
          <p className="mt-2">
            <a href="/de/terms" className={link}>AGB</a> · <a href="/de/refund-policy" className={link}>Kündigungs- und Erstattungsrichtlinie</a> · <a href="/de/privacy" className={link}>Datenschutzerklärung</a>.
          </p>
          <p className="mt-2">
            Der Dienst richtet sich an Unternehmer (professionnels). Gemäß Artikel L612-1 ff. des französischen Code de la consommation kann der Verbraucher bei einer Streitigkeit, die nicht durch eine vorherige schriftliche Beschwerde an samy@geotoolbox.ai beigelegt wurde, kostenlos einen Verbraucherschlichter (médiateur de la consommation) anrufen; der Verbraucherschlichter wird derzeit benannt, und seine Kontaktdaten werden auf dieser Seite veröffentlicht. Die europäische Plattform zur Online-Streitbeilegung (OS-Plattform) hat ihren Betrieb am 20. Juli 2025 eingestellt.
          </p>
        </section>
      </div>
    </div>
  )
}
