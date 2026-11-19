// components/legal/legal-notice-es.tsx
// Native Spanish (Spain) "Aviso legal" body for /es/legal. Mirrors the bilingual FR/EN
// components/legal/legal-notice-content.tsx (Mentions légales required by the French LCEN);
// French legal designations are kept with a Spanish gloss and every fact is verbatim.
// The note at the top states the French/English version at /legal prevails.
const link = "text-accent-700 underline hover:text-accent-800"

function Row({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-3">
      <dt className="font-medium text-gray-900">{k}</dt>
      <dd className="sm:col-span-2">{v}</dd>
    </div>
  )
}

export function LegalNoticeEs() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Aviso legal</h1>
      <p className="mt-2 text-sm text-gray-600">Última actualización: 15 de agosto de 2026</p>
      <p className="mt-2 text-xs text-gray-500">
        Esta traducción se facilita únicamente a título informativo. En caso de divergencia, prevalece la{" "}
        <a href="/legal" className="underline">versión en francés e inglés</a> (<i lang="fr">mentions légales</i> exigidas por la ley francesa LCEN).
      </p>

      <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Editor del sitio</h2>
          <dl className="mt-2 divide-y divide-gray-200">
            <Row k="Editor" v={<>Samy Ben Sadok, <strong lang="fr">entrepreneur individuel (EI)</strong> (empresario individual según el Derecho francés)</>} />
            <Row k="Dirección" v="1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, Francia" />
            <Row k="Teléfono" v="+33 6 11 41 21 42" />
            <Row k="Correo electrónico" v={<a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>} />
            <Row k="Inscripción" v={<>SIREN 827 472 424 — <span lang="fr">Registre national des entreprises (RNE)</span> (Registro nacional de empresas de Francia), actividad de consultoría (APE 70.22Z)</>} />
            <Row k="IVA" v={<><span lang="fr">TVA non applicable, art. 293 B du CGI</span> (IVA no aplicable, art. 293 B del Código General de Impuestos francés)</>} />
            <Row k={<><span lang="fr">Directeur de la publication</span> (director de la publicación)</>} v="Samy Ben Sadok" />
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Alojamiento (<span lang="fr">hébergeur</span>)</h2>
          <dl className="mt-2 divide-y divide-gray-200">
            <Row k="Sitio web (geotoolbox.ai)" v="Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Estados Unidos — tel. +1 559 288 7060" />
            <Row k="Aplicación (/app)" v="Replit, Inc., 1001 E Hillsdale Blvd, Suite 400, Foster City, CA 94404, Estados Unidos — support.replit.com" />
            <Row k="Base de datos" v="Neon, LLC (Databricks, Inc.), 160 Spear Street, Suite 1300, San Francisco, CA 94105, Estados Unidos — tel. +1 866 330 0121" />
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Condiciones, privacidad y mediación</h2>
          <p className="mt-2">
            <a href="/es/terms" className={link}>Términos del servicio (Terms of Service)</a> · <a href="/es/refund-policy" className={link}>Política de cancelación y reembolso</a> · <a href="/es/privacy" className={link}>Política de privacidad</a>.
          </p>
          <p className="mt-2">
            El servicio está dirigido a profesionales. De conformidad con los artículos L612-1 y siguientes del <span lang="fr">Code de la consommation</span> (Código de Consumo francés), el consumidor puede recurrir gratuitamente a un mediador de consumo en caso de un litigio no resuelto mediante una reclamación previa por escrito dirigida a samy@geotoolbox.ai; el mediador de consumo está en proceso de designación y sus datos de contacto se publicarán en esta página. La plataforma europea de resolución de litigios en línea cesó su actividad el 20 de julio de 2025.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Resumen</h2>
          <p className="mt-2">
            geotoolbox.ai es editado por Samy Ben Sadok, empresario individual francés (<i lang="fr">entrepreneur individuel</i>), SIREN 827 472 424 (RNE), con domicilio profesional en 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, Francia, IVA no aplicable (art. 293 B CGI). Director de la publicación: Samy Ben Sadok. Alojamiento: Vercel Inc. (sitio web), Replit, Inc. (aplicación), Neon, LLC (Databricks, Inc.) (base de datos), en EE. UU. Contacto: <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>. Consulte nuestros <a href="/es/terms" className={link}>Términos del servicio</a>, nuestra <a href="/es/refund-policy" className={link}>Política de cancelación y reembolso</a> y nuestra <a href="/es/privacy" className={link}>Política de privacidad</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
