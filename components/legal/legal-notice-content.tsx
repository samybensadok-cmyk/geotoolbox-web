// components/legal/legal-notice-content.tsx
// SG_LEGAL_V2 (2026-08-15): Mentions légales / Legal notice required by the French
// LCEN (art. 1-1 as renumbered by loi SREN n° 2024-449) for a site edited by a
// natural person acting professionally: nom, prénoms, domicile (business
// address), téléphone, SIREN/RCS-RM number if registered, VAT number if liable,
// directeur de la publication, hébergeur (name, address, phone). Also C. com.
// R526-27 "EI" mention. Bilingual FR/EN. Filled 2026-08-15 (annuaire-entreprises + hosts' legal pages); médiateur pending.
const link = "text-accent-700 underline hover:text-accent-800"

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-3">
      <dt className="font-medium text-gray-900">{k}</dt>
      <dd className="sm:col-span-2">{v}</dd>
    </div>
  )
}

export function LegalNoticeContent() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mentions légales · Legal notice</h1>
      <p className="mt-2 text-sm text-gray-600">Dernière mise à jour / last updated: 15 août 2026</p>

      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-gray-600">
        <section lang="fr">
          <h2 className="text-lg font-semibold text-gray-900">Éditeur du site</h2>
          <dl className="mt-2 divide-y divide-gray-200">
            <Row k="Éditeur" v={<>Samy Ben Sadok, <strong>entrepreneur individuel (EI)</strong></>} />
            <Row k="Adresse" v="1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, France" />
            <Row k="Téléphone" v="+33 6 11 41 21 42" />
            <Row k="E-mail" v={<a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>} />
            <Row k="Immatriculation" v="SIREN 827 472 424 — Registre national des entreprises (RNE), activité de conseil (APE 70.22Z)" />
            <Row k="TVA" v="TVA non applicable, art. 293 B du CGI" />
            <Row k="Directeur de la publication" v="Samy Ben Sadok" />
          </dl>
        </section>

        <section lang="fr">
          <h2 className="text-lg font-semibold text-gray-900">Hébergement</h2>
          <dl className="mt-2 divide-y divide-gray-200">
            <Row k="Site vitrine (geotoolbox.ai)" v="Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — tél. +1 559 288 7060" />
            <Row k="Application (/app)" v="Replit, Inc., 1001 E Hillsdale Blvd, Suite 400, Foster City, CA 94404, États-Unis — support.replit.com" />
            <Row k="Base de données" v="Neon, LLC (Databricks, Inc.), 160 Spear Street, Suite 1300, San Francisco, CA 94105, États-Unis — tél. +1 866 330 0121" />
          </dl>
        </section>

        <section lang="fr">
          <h2 className="text-lg font-semibold text-gray-900">Conditions, confidentialité et médiation</h2>
          <p className="mt-2">
            <a href="/terms" className={link}>Conditions générales (Terms of Service)</a> · <a href="/refund-policy" className={link}>Politique d&apos;annulation et de remboursement</a> · <a href="/fr/privacy" className={link}>Politique de confidentialité</a>.
          </p>
          <p className="mt-2">
            Le service s&apos;adresse aux professionnels. Conformément aux articles L612-1 et suivants du Code de la consommation, le consommateur peut recourir gratuitement à un médiateur de la consommation en cas de litige non résolu par une réclamation écrite préalable adressée à samy@geotoolbox.ai ; le médiateur de la consommation est en cours de désignation et ses coordonnées seront publiées sur cette page. La plateforme européenne de règlement en ligne des litiges a cessé son activité le 20 juillet 2025.
          </p>
        </section>

        <section lang="en">
          <h2 className="text-lg font-semibold text-gray-900">English summary</h2>
          <p className="mt-2">
            geotoolbox.ai is published by Samy Ben Sadok, a French sole trader (entrepreneur individuel), SIREN 827 472 424 (RNE), business address 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, France, VAT not applicable (art. 293 B CGI). Publication director: Samy Ben Sadok. Hosting: Vercel Inc. (website), Replit, Inc. (application), Neon, Inc. (database) — USA. Contact: <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>. See our <a href="/terms" className={link}>Terms of Service</a>, <a href="/refund-policy" className={link}>Cancellation &amp; Refund Policy</a> and <a href="/privacy" className={link}>Privacy Policy</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
