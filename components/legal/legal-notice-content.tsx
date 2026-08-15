// components/legal/legal-notice-content.tsx
// SG_LEGAL_V2 (2026-08-15): Mentions légales / Legal notice required by the French
// LCEN (art. 1-1 as renumbered by loi SREN n° 2024-449) for a site edited by a
// natural person acting professionally: nom, prénoms, domicile (business
// address), téléphone, SIREN/RCS-RM number if registered, VAT number if liable,
// directeur de la publication, hébergeur (name, address, phone). Also C. com.
// R526-27 "EI" mention. Bilingual FR/EN. Fill every [[OPERATOR: …]] before publish.
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
            <Row k="Adresse" v="[[OPERATOR: adresse professionnelle déclarée]]" />
            <Row k="Téléphone" v="[[OPERATOR: numéro de téléphone]]" />
            <Row k="E-mail" v={<a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>} />
            <Row k="Immatriculation" v="[[OPERATOR: SIREN — et mention « RCS Paris » ou « RNE » selon le registre]]" />
            <Row k="TVA" v="[[OPERATOR: numéro de TVA intracommunautaire, ou « TVA non applicable, art. 293 B du CGI »]]" />
            <Row k="Directeur de la publication" v="Samy Ben Sadok" />
          </dl>
        </section>

        <section lang="fr">
          <h2 className="text-lg font-semibold text-gray-900">Hébergement</h2>
          <dl className="mt-2 divide-y divide-gray-200">
            <Row k="Site vitrine (geotoolbox.ai)" v="Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis — [[OPERATOR: vérifier adresse et téléphone sur vercel.com/legal]]" />
            <Row k="Application (/app)" v="Replit, Inc., [[OPERATOR: adresse et téléphone — replit.com/site/terms]], États-Unis" />
            <Row k="Base de données" v="Neon, Inc., [[OPERATOR: adresse — neon.com/legal]], États-Unis" />
          </dl>
        </section>

        <section lang="fr">
          <h2 className="text-lg font-semibold text-gray-900">Conditions, confidentialité et médiation</h2>
          <p className="mt-2">
            <a href="/terms" className={link}>Conditions générales (Terms of Service)</a> · <a href="/refund-policy" className={link}>Politique d&apos;annulation et de remboursement</a> · <a href="/fr/privacy" className={link}>Politique de confidentialité</a>.
          </p>
          <p className="mt-2">
            Le service s&apos;adresse aux professionnels. Conformément aux articles L612-1 et suivants du Code de la consommation, le consommateur peut recourir gratuitement à un médiateur de la consommation en cas de litige non résolu par une réclamation écrite préalable : [[OPERATOR: nom, adresse postale et site internet du médiateur désigné]]. La plateforme européenne de règlement en ligne des litiges a cessé son activité le 20 juillet 2025.
          </p>
        </section>

        <section lang="en">
          <h2 className="text-lg font-semibold text-gray-900">English summary</h2>
          <p className="mt-2">
            geotoolbox.ai is published by Samy Ben Sadok, a French sole trader (entrepreneur individuel), registration no. [[OPERATOR: SIREN]], business address [[OPERATOR: address]], VAT [[OPERATOR: VAT no. / not applicable]]. Publication director: Samy Ben Sadok. Hosting: Vercel Inc. (website), Replit, Inc. (application), Neon, Inc. (database) — USA. Contact: <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>. See our <a href="/terms" className={link}>Terms of Service</a>, <a href="/refund-policy" className={link}>Cancellation &amp; Refund Policy</a> and <a href="/privacy" className={link}>Privacy Policy</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
