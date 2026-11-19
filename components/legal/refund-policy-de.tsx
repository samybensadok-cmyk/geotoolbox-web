// components/legal/refund-policy-de.tsx
// Native German Cancellation & Refund Policy (Kündigungs- und Erstattungsrichtlinie).
// Mirrors components/legal/refund-policy-content.tsx section for section (2026-11-19);
// the note at the top states that the EN version prevails on any divergence.
import { TERMS_UPDATED } from "@/components/legal/terms-content"

const link = "text-accent-700 underline hover:text-accent-800"

export function RefundPolicyDe() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Kündigungs- und Erstattungsrichtlinie</h1>
      <p className="mt-2 text-sm text-gray-600">Zuletzt aktualisiert: {TERMS_UPDATED} · Bestandteil unserer <a href="/de/terms" className={link}>AGB</a> (§5–§8)</p>
      <p className="mt-2 text-xs text-gray-500">
        Diese Übersetzung dient ausschließlich der Information. Bei Abweichungen ist die{" "}
        <a href="/refund-policy" className="underline">englische Fassung</a> maßgeblich, außer soweit eine Übersetzung für Verbraucher nach zwingendem Recht erforderlich ist; dann gilt diese Übersetzung für diese Verbraucher (§21.6 der AGB).
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">So funktionieren Abonnements</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Kostenpflichtige Tarife sind <strong>Abonnements, die sich automatisch verlängern</strong>, monatlich oder jährlich, bis Sie kündigen. Die hinterlegte Karte wird zu Beginn jedes Zeitraums belastet. Jahrestarife werden vollständig im Voraus berechnet.</li>
            <li>Ein <strong>kostenloser Testzeitraum</strong> setzt eine Karte voraus und <strong>wird automatisch umgestellt</strong> auf den von Ihnen gewählten Tarif und Abrechnungszeitraum, und zwar zu dem beim Checkout angezeigten Enddatum des Testzeitraums, sofern Sie nicht vorher kündigen. Wir senden Ihnen eine E-Mail, wenn der Testzeitraum beginnt (mit Betrag und Datum der ersten Belastung), und eine weitere vor der Belastung.</li>
            <li>Die Preise verstehen sich ohne Umsatzsteuer bzw. Sales Tax; diese wird, soweit anwendbar, beim Checkout hinzugerechnet.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">So kündigen Sie</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Melden Sie sich an und öffnen Sie <strong>Account → Manage subscription</strong> (Konto → Abonnement verwalten); dadurch öffnet sich das Stripe-Kundenportal.</li>
            <li>Wählen Sie <strong>Cancel subscription</strong> (Abonnement kündigen) und bestätigen Sie. Sie erhalten eine Bestätigungs-E-Mail mit dem Enddatum.</li>
            <li>Alternativ senden Sie von der E-Mail-Adresse des Kontoinhabers eine E-Mail an <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>, und zwar spätestens am Tag vor dem Verlängerungsdatum (bzw. vor Datum und Uhrzeit des Endes des Testzeitraums), das in Ihrem Konto und in unseren E-Mails angezeigt wird.</li>
          </ol>
          <p className="mt-2">Die Kündigung eines kostenpflichtigen Abonnements wird zum Ende des laufenden Zeitraums wirksam; bis dahin behalten Sie den Zugang. Die Kündigung eines ab dem 27. Oktober 2026 (AGB-Version 2.1) begonnenen kostenlosen Testzeitraums beendet diesen sofort: Der Zugang endet unmittelbar, und es wird nichts berechnet; ein früher begonnener Testzeitraum behält den Zugang bis zu seinem Enddatum. Der Widerruf des Google-Zugriffs oder das Löschen der Cookies der App kündigt ein Abonnement <em>nicht</em>.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Erstattungen</h2>
          <p className="mt-2"><strong>Gebühren werden nicht erstattet.</strong> Wir erstatten nicht:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>einen Testzeitraum, der umgestellt wurde, weil er nicht vor seinem Ende gekündigt wurde (monatlich oder jährlich);</li>
            <li>eine Verlängerung, die nicht vor dem Verlängerungsdatum gekündigt wurde;</li>
            <li>ungenutzte Zeit nach Ihrer Kündigung oder einem Downgrade, ungenutzte Credits, Plätze (Seats), Marken oder Prompts;</li>
            <li>Zeiträume, in denen Sie sich nicht angemeldet oder den Dienst nicht genutzt haben;</li>
            <li>Unzufriedenheit mit Ergebnissen, Rankings oder Zitierungen von KI-Suchmaschinen, die außerhalb unserer Kontrolle liegen.</li>
          </ul>
          <p className="mt-2">Unsere eigenen Abrechnungsfehler (falscher Betrag, doppelte Belastung, Belastung nach einer bestätigten Kündigung) <strong>korrigieren</strong> wir jedoch – bitte teilen Sie uns diese umgehend mit. Wenn <em>wir</em> Ihr Abonnement ohne besonderen Grund (for convenience) kündigen, den Dienst einstellen oder eine Änderung durch Dritte Ihren Tarif wesentlich einschränkt, erstatten wir den ungenutzten Teil des laufenden Zeitraums (AGB §13.3, §18.4, §19). Die gesetzlichen Rechte von Verbrauchern sind unten beschrieben. Wir können außerdem nach unserem alleinigen Ermessen eine Kulanzerstattung gewähren; daraus entsteht keine Verpflichtung.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Wenn Sie eine Belastung für fehlerhaft halten</h2>
          <p className="mt-2">Schreiben Sie zuerst eine E-Mail an <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> – die meisten Anliegen werden innerhalb von zwei Geschäftstagen gelöst. Sie behalten stets das Recht, sich an Ihre Bank zu wenden; bei einer Belastung, die gemäß den AGB erfolgt ist (eine offengelegte Umstellung eines Testzeitraums oder eine Verlängerung), stellen wir der Bank jedoch den Nachweis Ihrer Zustimmung, die Hinweise beim Checkout, die Bestätigungs- und Erinnerungs-E-Mails sowie Ihre Nutzung des Dienstes zur Verfügung; das Konto kann für die Dauer des Streitfalls gesperrt werden, und wenn eine Rückbuchung (Chargeback) gegen eine berechtigte Belastung Erfolg hat, bleibt der Betrag geschuldet (AGB §8.5).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Gesetzliche Rechte von Verbrauchern</h2>
          <p className="mt-2">GEO Toolbox ist ein Werkzeug für Unternehmen, und Sie bestätigen beim Abschluss des Abonnements die geschäftliche Nutzung. Sollten Sie dennoch nach dem zwingenden Recht Ihres Landes (zum Beispiel in der EU oder im Vereinigten Königreich) als <em>Verbraucher</em> gelten, behalten Sie die Rechte, die Ihnen dieses Recht gewährt – einschließlich eines 14-tägigen Widerrufsrechts ab dem Tag Ihres Abonnementabschlusses (auch beim Start eines Testzeitraums), gegen Zahlung eines Betrags, der dem Anteil der bereits erbrachten Leistung entspricht. Siehe <a href="/de/terms#refunds" className={link}>AGB §8.6</a> und das Muster-Widerrufsformular in Anlage B der AGB.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Kontakt</h2>
          <p className="mt-2">Fragen zur Abrechnung und Kündigungen: <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>.</p>
        </section>
      </div>
    </div>
  )
}
