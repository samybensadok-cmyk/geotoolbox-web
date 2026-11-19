// components/legal/terms-de.tsx
// Native German Terms of Service (Allgemeine Geschäftsbedingungen). Mirrors the EN Terms in
// components/legal/terms-content.tsx section for section (translated 2026-11-19); the note at the
// top and §21.6 state that the EN version prevails. Heading ids match the EN file.
import {
  TERMS_VERSION,
  TERMS_UPDATED,
  TERMS_EFFECTIVE_NEW,
  TERMS_EFFECTIVE_EXISTING,
} from "@/components/legal/terms-content"

const link = "text-accent-700 underline hover:text-accent-800"

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-lg font-semibold text-gray-900">
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-2 list-disc space-y-1 pl-5">{children}</ul>
}

const TOC: Array<[string, string]> = [
  ["who-we-are", "1. Wer wir sind"],
  ["acceptance", "2. Annahme und geschäftliche Nutzung"],
  ["accounts", "3. Konten"],
  ["service", "4. Der Dienst, Tarife und Credits"],
  ["free-trial", "5. Kostenloser Testzeitraum"],
  ["fees", "6. Gebühren, Abrechnung und automatische Verlängerung"],
  ["cancellation", "7. Kündigung"],
  ["refunds", "8. Erstattungen, gesetzliche Rechte und Zahlungsstreitigkeiten"],
  ["addons", "9. Credit-Pakete, Add-ons und Dienstleistungen"],
  ["data", "10. Ihre Daten, Datenschutz und verbundene Konten"],
  ["ip", "11. Geistiges Eigentum und Lizenz"],
  ["acceptable-use", "12. Zulässige Nutzung"],
  ["third-party", "13. Dienste Dritter und KI-generierte Ausgaben"],
  ["availability", "14. Verfügbarkeit, Änderungen und Beta-Funktionen"],
  ["warranties", "15. Gewährleistungsausschluss"],
  ["liability", "16. Haftungsbeschränkung"],
  ["indemnity", "17. Freistellung"],
  ["term", "18. Laufzeit, Sperrung und Kündigung"],
  ["changes", "19. Änderungen dieser AGB"],
  ["law", "20. Anwendbares Recht und Streitigkeiten"],
  ["general", "21. Allgemeines"],
  ["contact", "22. Kontakt"],
  ["annex-a", "Anlage A — Französische Gesetzestexte (nur für Verbraucher und Nicht-Gewerbetreibende)"],
  ["annex-b", "Anlage B — Muster-Widerrufsformular (nur für Verbraucher)"],
]

export function TermsDe() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Allgemeine Geschäftsbedingungen</h1>
      <p className="mt-2 text-sm text-gray-600">
        Version {TERMS_VERSION} · Zuletzt aktualisiert: {TERMS_UPDATED} · Gültig für Neukunden ab {TERMS_EFFECTIVE_NEW} und für Bestandskunden ab {TERMS_EFFECTIVE_EXISTING}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Diese Übersetzung dient ausschließlich der Information. Bei Abweichungen ist nach Maßgabe von §21.6 die{" "}
        <a href="/terms" className="underline">englische Fassung</a> maßgeblich.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-semibold text-gray-900">Zusammenfassung in einfacher Sprache (maßgeblich sind die vollständigen AGB unten)</p>
        <UL>
          <li>GEO Toolbox ist ein Werkzeug für Unternehmen. Mit dem Abschluss eines Abonnements bestätigen Sie, dass Sie zu geschäftlichen Zwecken handeln.</li>
          <li>Kostenpflichtige Tarife sind <strong>Abonnements, die sich automatisch verlängern</strong> (monatlich oder jährlich), bis Sie kündigen.</li>
          <li>Ein kostenloser Testzeitraum setzt eine Karte voraus und <strong>geht an seinem Ende automatisch in ein kostenpflichtiges Abonnement über</strong>, sofern Sie nicht vorher kündigen. Betrag und Datum der ersten Abbuchung (bei einem Jahrestarif die volle Jahresgebühr) werden beim Checkout und in Ihrer Bestätigungs-E-Mail angezeigt, und wir informieren Sie außerdem vor der Abbuchung per E-Mail. Wenn Sie einen ab dem 27. Oktober 2026 begonnenen Testzeitraum kündigen, endet dieser und damit Ihr Zugang sofort.</li>
          <li>Sie können jederzeit über <strong>Account → Manage subscription</strong> (Konto → Abonnement verwalten) kündigen. Die Kündigung wird zum Ende des laufenden Zeitraums wirksam; bis dahin behalten Sie Ihren Zugang.</li>
          <li><strong>Gebühren werden nicht erstattet</strong> — auch dann nicht, wenn ein Testzeitraum in ein Abonnement übergeht, weil Sie nicht rechtzeitig gekündigt haben, und auch nicht für ungenutzte Zeit oder Credits —, es sei denn, das Gesetz räumt Ihnen ein Recht ein, das wir nicht ausschließen können (siehe §8).</li>
        </UL>
      </div>

      <nav aria-label="Inhaltsverzeichnis" className="mt-8 text-sm">
        <p className="font-semibold text-gray-900">Inhalt</p>
        <ol className="mt-2 grid gap-1 sm:grid-cols-2">
          {TOC.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="text-gray-600 hover:text-gray-900">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <H2 id="who-we-are">1. Wer wir sind</H2>
          <P>
            GEO Toolbox („<strong>GEO Toolbox</strong>“, „<strong>wir</strong>“, „<strong>uns</strong>“) wird betrieben von <strong>Samy Ben Sadok</strong>, Einzelunternehmer (entrepreneur individuel — EI), eingetragen in Frankreich unter der SIREN 827 472 424 (Registre national des entreprises), Geschäftsadresse 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, Frankreich. Umsatzsteuer: nicht anwendbar — article 293 B des französischen Code général des impôts (franchise en base); die Preise werden daher bis auf Weiteres ohne französische Umsatzsteuer berechnet. Vollständiges Impressum:{" "}
            <a href="/de/legal" className={link}>geotoolbox.ai/legal</a>. Kontakt:{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>.
          </P>
          <P>
            Diese Allgemeinen Geschäftsbedingungen (die „<strong>AGB</strong>“) bilden eine verbindliche Vereinbarung zwischen Ihnen (der Person oder Organisation, die den Dienst nutzt, „<strong>Sie</strong>“, der „<strong>Kunde</strong>“) und uns. Sie schließen unsere{" "}
            <a href="/de/privacy" className={link}>Datenschutzerklärung</a> und unsere{" "}
            <a href="/de/refund-policy" className={link}>Kündigungs- und Erstattungsrichtlinie</a> ein sowie die Tarifangaben, die zum Zeitpunkt Ihres Abonnementabschlusses auf der{" "}
            <a href="/de/pricing" className={link}>Preisseite</a> und beim Checkout angezeigt werden (zusammen der „<strong>Vertrag</strong>“).
          </P>
        </section>

        <section>
          <H2 id="acceptance">2. Annahme und geschäftliche Nutzung</H2>
          <P>
            <strong>2.1 Annahme.</strong>{" "}Sie nehmen diese AGB an, indem Sie ein Konto erstellen, bei der Registrierung oder beim Checkout das Zustimmungskästchen anklicken, auf eine Schaltfläche klicken, die auf sie verweist, oder den Dienst nutzen. Wenn Sie nicht einverstanden sind, nutzen Sie den Dienst nicht. Wenn Sie die AGB im Namen eines Unternehmens oder einer anderen Organisation annehmen, bestätigen Sie, dass Sie befugt sind, diese zu verpflichten, und „Sie“ bezeichnet dann diese Organisation.
          </P>
          <P>
            <strong>2.2 Ausschließlich geschäftliche Nutzung.</strong> Der Dienst ist ein professionelles Werkzeug für Marketer, SEO-/GEO-Berater, Agenturen und Unternehmen. <strong>Sie bestätigen, dass Sie den Dienst zu Zwecken Ihrer gewerblichen, geschäftlichen, handwerklichen oder beruflichen Tätigkeit beziehen und nutzen und nicht für persönliche, familiäre oder häusliche Zwecke.</strong> Wir verlassen uns auf diese Zusicherung. Sollten Sie nach dem zwingenden Recht Ihres Wohnsitzlandes dennoch als Verbraucher gelten, gelten für Sie §8.6 und §20.4.
          </P>
          <P>
            <strong>2.3 Alter.</strong> Sie müssen mindestens 18 Jahre alt sein.
          </P>
        </section>

        <section>
          <H2 id="accounts">3. Konten</H2>
          <P>
            <strong>3.1</strong> Sie können sich mit einer E-Mail-Adresse und einem Passwort, einem Magic Link oder über Google OAuth anmelden. Sie sind für alle Aktivitäten unter Ihrem Konto verantwortlich (sofern sie nicht auf einer Pflichtverletzung unsererseits beruhen) sowie dafür, Ihre Zugangsdaten vertraulich zu halten. Informieren Sie uns unverzüglich unter{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>, wenn Sie einen unbefugten Zugriff vermuten.
          </P>
          <P>
            <strong>3.2 Team-Plätze.</strong> Wenn Ihr Tarif Team-Plätze (Seats) umfasst, können Sie Mitglieder einladen. Sie sind dafür verantwortlich, dass diese die AGB einhalten. Nur der Kontoinhaber kann die Abrechnung ändern, kündigen oder das Konto löschen.
          </P>
          <P>
            <strong>3.3 Richtigkeit der Angaben.</strong> Halten Sie Ihre Konto- und Rechnungsdaten richtig, einschließlich Ihres Firmennamens, Ihrer Rechnungsanschrift und gegebenenfalls Ihrer USt-IdNr.
          </P>
        </section>

        <section>
          <H2 id="service">4. Der Dienst, Tarife und Credits</H2>
          <P>
            <strong>4.1</strong> Der Dienst bietet Analysen zur Sichtbarkeit in der KI-Suche: Er verfolgt, wie eine Marke in KI-Suchmaschinen erscheint (zum Beispiel ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews und AI Mode, Bing Copilot, Grok), und umfasst zugehörige Scans, Berichte und Content-Werkzeuge, wie zum Zeitpunkt Ihrer Bestellung auf unserer Website beschrieben.
          </P>
          <P>
            <strong>4.2 Tarife.</strong> Jeder Tarif gewährt die Funktionen und Limits, die auf der Preisseite und beim Checkout angegeben sind (zum Beispiel Marken, Prompts, Suchmaschinen, Plätze, Verlaufszeitraum). Wir können den Dienst verbessern oder anpassen; wesentliche Einschränkungen eines von Ihnen bezahlten Tarifs werden erst ab Ihrer nächsten Verlängerung wirksam, mit Ankündigung gemäß §19.
          </P>
          <P>
            <strong>4.3 Credits.</strong> Die Nutzung wird in Credits abgerechnet. Jeder Tarif gewährt ein monatliches Credit-Kontingent, das zu Beginn jedes Leistungsmonats gutgeschrieben wird (auch bei Jahrestarifen), bzw. während eines Testzeitraums in reduziertem Umfang wie in §5 beschrieben. <strong>Nicht genutzte Credits werden nicht übertragen, haben keinen Geldwert und werden nicht erstattet.</strong> Die Credit-Gewichtungen je Suchmaschine und Werkzeug werden in der App veröffentlicht und können sich ändern; Änderungen gelten nur für die Zukunft.
          </P>
          <P>
            <strong>4.4 Angemessene Nutzung (Fair Use).</strong> Tariflimits werden technisch durchgesetzt. Wir können eine Nutzung drosseln oder aussetzen, die missbräuchlich ist, über den vorgesehenen Gebrauch hinaus automatisiert erfolgt oder die Stabilität oder Kostengrundlage des Dienstes gefährdet, soweit praktikabel nach vorheriger Mitteilung.
          </P>
        </section>

        <section>
          <H2 id="free-trial">5. Kostenloser Testzeitraum</H2>
          <P>
            <strong>5.1 Was er umfasst.</strong> Soweit angeboten (derzeit bei ausgewählten Tarifen, wie auf der Preisseite angegeben), gewährt Ihnen ein kostenloser Testzeitraum Zugang zu dem von Ihnen gewählten Tarif für die beim Checkout angegebene Testdauer (derzeit <strong>7 Tage</strong>) oder, bei Testzeiträumen, die unter Version 2.1 oder später begonnen wurden, bis Sie ihn kündigen (§5.4). Zum Starten eines Testzeitraums ist ein gültiges Zahlungsmittel erforderlich. Testkonten können mit reduzierten Limits laufen (zum Beispiel einem Bruchteil der Credits des Tarifs, einer niedrigeren Höchstzahl an Marken, ohne White-Label-Berichte); der volle Tarif wird freigeschaltet, wenn der Testzeitraum in ein Abonnement übergeht.
          </P>
          <P>
            <strong>5.2 Automatische Umwandlung — bitte sorgfältig lesen.</strong> <strong>Sofern Sie nicht vor Ende des Testzeitraums kündigen, wird Ihr Testzeitraum automatisch in ein kostenpflichtiges Abonnement für den von Ihnen gewählten Tarif und das gewählte Abrechnungsintervall (monatlich oder jährlich) umgewandelt, und das hinterlegte Zahlungsmittel wird am Enddatum des Testzeitraums mit dem beim Checkout angezeigten Betrag belastet.</strong> Der genaue Betrag, die Währung und das Datum der ersten Abbuchung werden beim Checkout vor Ihrer Bestätigung angezeigt und in der Bestätigungs-E-Mail wiederholt, die wir zu Beginn des Testzeitraums senden. Das Abonnement verlängert sich anschließend automatisch gemäß §6.
          </P>
          <P>
            <strong>5.3 Erinnerungen.</strong> Wir senden die Bestätigungs-E-Mail zum Testzeitraum bei der Anmeldung (mit Betrag und Datum der ersten Abbuchung sowie Hinweisen zur Kündigung) — dies ist die Mitteilung über die bevorstehende Abbuchung — und zusätzlich Erinnerungs-E-Mails vor der ersten Abbuchung an die in Ihrem Konto hinterlegte Adresse. Erinnerungen werden als Service und zur Einhaltung der Regeln der Kartennetzwerke versandt; <strong>der Nichterhalt einer Erinnerung (zum Beispiel wegen eines Spamfilters oder einer falschen Adresse) berührt die automatische Umwandlung nicht und begründet keinen Anspruch auf Erstattung</strong>. Halten Sie Ihre E-Mail-Adresse aktuell.
          </P>
          <P>
            <strong>5.4 So kündigen Sie einen Testzeitraum.</strong> Kündigen Sie jederzeit vor Ende des Testzeitraums über <strong>Account → Manage subscription</strong> (Stripe-Kundenportal) oder per E-Mail an{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>{" "}von der Adresse des Kontoinhabers aus, und zwar vor dem Enddatum und der Enduhrzeit des Testzeitraums, die in Ihrem Konto und in der Bestätigungs-E-Mail angegeben sind. Ein vor seinem Ende gekündigter Testzeitraum wird niemals berechnet. <strong>Bei Testzeiträumen, die unter Version 2.1 oder später dieser AGB begonnen wurden (ab dem 27. Oktober 2026), beendet die Kündigung den Testzeitraum sofort:</strong> Der Zugang zum Testtarif endet umgehend, und Ihr Konto wechselt in den kostenlosen Tarif. Ein früher begonnener Testzeitraum behält seinen Zugang bis zu seinem Enddatum. Da Testzeiträume auf einen pro Kunde begrenzt sind (§5.6), wird ein späteres erneutes Abonnement von Beginn an berechnet. Die Kündigung wird per E-Mail bestätigt.
          </P>
          <P>
            <strong>5.5 Keine Erstattung bei versäumter Kündigung.</strong> Da die Umwandlungsbedingungen beim Checkout offengelegt und bei der Anmeldung per E-Mail bestätigt werden, <strong>ist eine Abbuchung, die darauf beruht, dass Sie nicht vor Ende des Testzeitraums gekündigt haben, eine berechtigte Abbuchung und wird nicht erstattet</strong> (vorbehaltlich allein §8.6); die zusätzlichen Erinnerungen nach §5.3 ändern daran nichts. Dies gilt gleichermaßen für monatliche und jährliche Abonnements.
          </P>
          <P>
            <strong>5.6 Ein Testzeitraum pro Kunde.</strong> Testzeiträume sind auf einen pro Person, Unternehmen und Zahlungsmittel begrenzt und stehen bei Upgrades oder erneuten Abonnements nicht zur Verfügung. Wir können einen Testzeitraum ablehnen, verkürzen oder vorzeitig beenden, das Abonnement ablehnen, doppelte Konten schließen oder das Testangebot zurückziehen, wenn wir einen Missbrauch von Testzeiträumen feststellen (zum Beispiel mehrere Konten oder Zahlungsmittel), oder jederzeit nach vorheriger Mitteilung.
          </P>
        </section>

        <section>
          <H2 id="fees">6. Gebühren, Abrechnung und automatische Verlängerung</H2>
          <P>
            <strong>6.1 Abonnements verlängern sich automatisch.</strong> Kostenpflichtige Tarife werden als wiederkehrende Abonnements verkauft. <strong>Ihr Abonnement verlängert sich am Ende jedes Abrechnungszeitraums (monatlich oder jährlich, je nach Auswahl) automatisch um einen weiteren Zeitraum gleicher Länge, und das hinterlegte Zahlungsmittel wird zu Beginn jedes Zeitraums mit der dann geltenden Gebühr für Ihren Tarif belastet, bis Sie kündigen</strong> (§7). Jahrestarife werden vollständig im Voraus für das Jahr berechnet. Bei Jahresabonnements senden wir etwa fünf Wochen (33–39 Tage) vor dem Verlängerungsdatum eine Erinnerung per E-Mail mit dem Verlängerungsbetrag, dem Datum und Hinweisen zur Kündigung.
          </P>
          <P>
            <strong>6.2 Zahlung.</strong> Zahlungen werden von Stripe abgewickelt. Indem Sie ein Zahlungsmittel angeben, ermächtigen Sie uns (über Stripe), alle nach dem Vertrag fälligen Gebühren zu belasten, einschließlich Verlängerungsgebühren, anfallender Steuern sowie von Ihnen bestellter Credit-Pakete oder Add-ons. Rechnungen und Quittungen werden per E-Mail ausgestellt und sind im Kundenportal abrufbar.
          </P>
          <P>
            <strong>6.3 Preise, Währung und Steuern.</strong> Es gelten die beim Checkout in der gewählten Währung (USD oder EUR) angezeigten Preise. <strong>Die Gebühren verstehen sich ohne Umsatzsteuer, Sales Tax und ähnliche Steuern</strong>, die gegebenenfalls beim Checkout anhand Ihrer Rechnungsanschrift hinzugerechnet werden; wenn Sie eine gültige USt-IdNr. angeben, kann das Reverse-Charge-Verfahren (Steuerschuldnerschaft des Leistungsempfängers) gelten. Sie tragen alle Steuern, Abgaben oder Bankgebühren mit Ausnahme der Steuern auf unser Einkommen.
          </P>
          <P>
            <strong>6.4 Preisänderungen.</strong> Wir können unsere Preise ändern. Preiserhöhungen gelten für Ihr Abonnement erst ab Ihrer nächsten Verlängerung, nachdem wir sie Ihnen mindestens <strong>30 Tage</strong> im Voraus per E-Mail angekündigt haben. Wenn Sie nicht einverstanden sind, kündigen Sie vor der Verlängerung; die Weiternutzung nach dem Wirksamkeitsdatum gilt als Annahme des neuen Preises.
          </P>
          <P>
            <strong>6.5 Fehlgeschlagene Zahlungen.</strong> Schlägt eine Abbuchung fehl, können wir (über Stripe) sie erneut versuchen und Sie per E-Mail auffordern, Ihr Zahlungsmittel zu aktualisieren. Solange eine Zahlung aussteht, können wir das Konto sperren oder herabstufen, und wir können es kündigen, wenn der Zahlungsausfall nicht innerhalb einer angemessenen Frist behoben wird. Sie schulden die Gebühren für den Zeitraum weiterhin. Überfällige Beträge von Geschäftskunden werden mit dem Dreifachen des französischen gesetzlichen Zinssatzes verzinst, zuzüglich einer pauschalen Beitreibungsentschädigung von 40 € je Rechnung (Code de commerce L441-10 und D441-5).
          </P>
          <P>
            <strong>6.6 Upgrades und Downgrades.</strong> Upgrades werden sofort wirksam und von Stripe anteilig berechnet. Downgrades werden zur nächsten Verlängerung wirksam; die Differenz wird nicht erstattet.
          </P>
          <P>
            <strong>6.7 Aktionen.</strong> Gutscheine und Aktionspreise gelten für den angegebenen Zeitraum; danach gilt wieder der beim Checkout angezeigte Standardpreis.
          </P>
        </section>

        <section>
          <H2 id="cancellation">7. Kündigung</H2>
          <P>
            <strong>7.1 Jederzeit online kündigen.</strong> Sie können Ihr Abonnement jederzeit über <strong>Account → Manage subscription</strong> kündigen, wodurch sich das Stripe-Kundenportal öffnet („Cancel subscription“, Abonnement kündigen), oder per E-Mail an{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>{" "}von der Adresse des Kontoinhabers aus. Wir bestätigen jede Kündigung per E-Mail unter Angabe des Datums, an dem das Abonnement endet.
          </P>
          <P>
            <strong>7.2 Wirkung.</strong> Die Kündigung beendet künftige Verlängerungen. <strong>Sie wird zum Ende des laufenden Abrechnungszeitraums wirksam</strong> (bzw. zum Ende des Testzeitraums, falls Sie sich in einem Testzeitraum befinden), und Sie behalten bis dahin Ihren Zugang. <strong>Für den Rest eines bereits bezahlten Zeitraums erfolgt keine anteilige oder teilweise Erstattung</strong>, auch nicht bei Jahreszeiträumen, vorbehaltlich §8.6.
          </P>
          <P>
            <strong>7.3 Stichtag.</strong> Um eine Verlängerungsabbuchung zu vermeiden, kündigen Sie spätestens am Tag vor dem Verlängerungsdatum, das in Ihrem Konto und in unseren E-Mails angegeben ist (Abbuchungen erfolgen jeweils zu der Uhrzeit, zu der Ihr ursprüngliches Abonnement abgeschlossen wurde, in UTC). Eine nach einer Abbuchung erklärte Kündigung gilt für den folgenden Zeitraum.
          </P>
          <P>
            <strong>7.4 Die Löschung Ihres Kontos</strong> kündigt ein aktives Abonnement mit Wirkung zum Ende des laufenden Zeitraums und löst die Löschung der Daten gemäß unserer Datenschutzerklärung aus. Die Löschung eines Kontos begründet für sich genommen keinen Anspruch auf Erstattung. Der Widerruf des Google-OAuth-Zugriffs oder die Deinstallation von Integrationen kündigt ein Abonnement <em>nicht</em> — nutzen Sie §7.1.
          </P>
        </section>

        <section>
          <H2 id="refunds">8. Erstattungen, gesetzliche Rechte und Zahlungsstreitigkeiten</H2>
          <P>
            <strong>8.1 Gebühren sind nicht erstattungsfähig.</strong> Soweit in diesem §8 nicht ausdrücklich anders angegeben, <strong>sind Gebühren für einen begonnenen Abrechnungszeitraum in voller Höhe fällig und werden nicht erstattet</strong>. Insbesondere erfolgt keine Erstattung oder Gutschrift für: (a) einen Testzeitraum, der in ein Abonnement übergegangen ist, weil Sie nicht vor seinem Ende gekündigt haben (§5.5); (b) eine automatische Verlängerung, die Sie nicht rechtzeitig gekündigt haben (§7.3), einschließlich jährlicher Verlängerungen; (c) ungenutzte Zeit in einem Abrechnungszeitraum nach Ihrer Kündigung oder einem Downgrade; (d) ungenutzte Credits, Plätze, Marken oder Prompts; (e) Zeiträume, in denen Sie den Dienst nicht genutzt haben; (f) Funktionen, die Sie nicht genutzt haben oder die sich geändert haben; (g) Unzufriedenheit mit Ergebnissen, Rankings oder Ausgaben von KI-Suchmaschinen, die außerhalb unseres Einflussbereichs liegen (§13).
          </P>
          <P>
            <strong>8.2 Unser eigener Fehler.</strong> Wenn wir Sie fehlerhaft belastet haben (falscher Betrag, doppelte Abbuchung, Abbuchung nach einer bestätigten Kündigung), korrigieren wir dies und erstatten die Differenz — bitte informieren Sie uns umgehend (möglichst innerhalb von 60 Tagen), damit wir die Zahlung nachverfolgen können.
          </P>
          <P>
            <strong>8.3 Kulanz.</strong> Wir können nach unserem alleinigen Ermessen und ohne Verpflichtung eine Erstattung oder Gutschrift aus Kulanz gewähren. Dies verpflichtet uns nicht, es erneut zu tun, und ändert diese AGB nicht.
          </P>
          <P>
            <strong>8.4 Art und Zeitpunkt der Erstattung.</strong> Erstattungen erfolgen über Stripe auf das ursprüngliche Zahlungsmittel, in der Regel innerhalb von 14 Tagen nach unserer Entscheidung.
          </P>
          <P>
            <strong>8.5 Kontaktieren Sie uns, bevor Sie eine Abbuchung beanstanden.</strong> Wenn Sie eine Abbuchung für falsch halten, wenden Sie sich zuerst an uns unter{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> — die meisten Anliegen werden innerhalb von zwei Werktagen geklärt. Nichts in diesen AGB schränkt Ihr Recht ein, eine Abbuchung bei Ihrem Kartenaussteller oder Ihrer Bank zu beanstanden. Wird jedoch eine Rückbuchung (Chargeback) gegen eine Abbuchung eingeleitet, die im Einklang mit diesen AGB vorgenommen wurde (zum Beispiel eine ordnungsgemäß offengelegte Umwandlung eines Testzeitraums oder Verlängerung), legen wir die Nachweise Ihrer Annahme dieser AGB, die Angaben beim Checkout, die Bestätigungs- und Erinnerungs-E-Mails sowie Ihre Nutzung des Dienstes vor; solange die Beanstandung offen ist, können wir das Konto sperren. Hat eine Rückbuchung gegen eine nach diesen AGB wirksam vorgenommene Abbuchung Erfolg, bleibt der Betrag uns gegenüber geschuldet; wird eine Rückbuchung ohne einen in gutem Glauben angenommenen Grund veranlasst, können wir das Konto wegen Vertragsverletzung kündigen.
          </P>
          <P>
            <strong>8.6 Gesetzliche Rechte von Verbrauchern.</strong> Der Dienst ist für die geschäftliche Nutzung bestimmt (§2.2). Sind Sie dennoch nach dem zwingenden Recht Ihres Wohnsitzlandes <em>Verbraucher</em> (insbesondere im Sinne der EU-Verbraucherrechterichtlinie, des französischen Code de la consommation oder der britischen Consumer Contracts Regulations 2013), schränkt nichts in diesen AGB Rechte ein, die vertraglich nicht ausgeschlossen werden können. In diesem Fall gilt: (a) Sie haben das Recht, den Vertrag binnen 14 Tagen ab dem Tag Ihres Abonnementabschlusses (einschließlich des Tages, an dem ein kostenloser Testzeitraum beginnt) ohne Angabe von Gründen durch eine eindeutige Erklärung gegenüber{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> zu widerrufen (Widerrufsrecht; Sie können das Muster-Widerrufsformular in Anlage B verwenden); (b) Sie haben bei der Registrierung und beim Checkout <strong>ausdrücklich verlangt, dass wir mit der Ausführung der Leistung während der Widerrufsfrist beginnen, und zur Kenntnis genommen</strong>, dass Sie im Falle eines Widerrufs einen Betrag zu zahlen haben, der dem Anteil der bis zu Ihrer Mitteilung über den Widerruf erbrachten Leistung entspricht, und dass Sie Ihr Widerrufsrecht verlieren, sobald die Leistung vollständig erbracht ist; (c) nach diesem §8.6 geschuldete Erstattungen erfolgen innerhalb von 14 Tagen nach Ihrer Mitteilung; (d) die in Anlage A wiedergegebenen französischen Vorschriften zur stillschweigenden Verlängerung und zur Online-Kündigung gelten für Verbraucher und Nicht-Gewerbetreibende (non-professionnels) im dort definierten Sinne. Geschäftskunden steht kein Widerrufsrecht zu.
          </P>
        </section>

        <section>
          <H2 id="addons">9. Credit-Pakete, Add-ons und Dienstleistungen</H2>
          <P>
            <strong>9.1</strong> Credit-Pakete und Add-ons sind Einmalkäufe, nicht erstattungsfähig und werden gemäß §4.3 verbraucht; Credits aus Paketen verfallen wie beim Kauf angegeben.
          </P>
          <P>
            <strong>9.2</strong> Done-for-you-Dienstleistungen (zum Beispiel Content, Audits, GEO-/AEO-Dienstleistungen) unterliegen der Beschreibung, dem Preis und den Lieferbedingungen, die zum Zeitpunkt der Bestellung angezeigt werden, sowie gegebenenfalls einer gesonderten Leistungsbeschreibung (Statement of Work). Da die Arbeit mit der Bestellung beginnt, werden Gebühren für Dienstleistungen nach Beginn der Arbeit nicht erstattet, außer wenn wir nicht liefern.
          </P>
        </section>

        <section>
          <H2 id="data">10. Ihre Daten, Datenschutz und verbundene Konten</H2>
          <P>
            <strong>10.1</strong> Unsere Verarbeitung personenbezogener Daten ist in der{" "}
            <a href="/de/privacy" className={link}>Datenschutzerklärung</a> beschrieben. Soweit wir personenbezogene Daten in Ihrem Auftrag verarbeiten (zum Beispiel in von Ihnen erstellten Berichten), handeln wir als Ihr Auftragsverarbeiter; unsere Bedingungen zur Auftragsverarbeitung (Art. 28 DSGVO) und die aktuelle Liste der Unterauftragsverarbeiter sind unter{" "}
            <a href="/de/privacy#subprocessors" className={link}>geotoolbox.ai/privacy</a> und auf Anfrage in unterzeichneter Form erhältlich.
          </P>
          <P>
            <strong>10.2 Ihre Daten.</strong> Sie behalten alle Rechte an den Daten, Marken, Prompts und Inhalten, die Sie übermitteln („<strong>Kundendaten</strong>“). Sie räumen uns eine nicht-exklusive Lizenz ein, Kundendaten zu hosten, zu verarbeiten und anzuzeigen, um den Dienst bereitzustellen, abzusichern und zu verbessern. Wir dürfen aggregierte, de-identifizierte Nutzungsdaten verwenden (zum Beispiel Zitierstatistiken auf Ebene der Suchmaschinen), die weder Sie noch Ihre Kunden identifizieren.
          </P>
          <P>
            <strong>10.3 Verbundene Konten.</strong> Wenn Sie Google Search Console oder Google Analytics verbinden, gestatten Sie einen reinen Lesezugriff im Rahmen der bei der Verbindung angezeigten Scopes und sichern zu, dass Sie zur Erteilung dieses Zugriffs berechtigt sind. Sie können die Verbindung jederzeit trennen.
          </P>
          <P>
            <strong>10.4 Aufbewahrung und Export.</strong> Analyseergebnisse werden wie in der Datenschutzerklärung beschrieben aufbewahrt. Nach Vertragsbeendigung können Sie Ihre Daten 30 Tage lang exportieren; danach können wir sie löschen (Abrechnungsunterlagen werden aufbewahrt, soweit gesetzlich vorgeschrieben).
          </P>
          <P>
            <strong>10.5 Vertraulichkeit.</strong>{" "}Jede Partei behandelt die nicht öffentlichen Informationen der anderen Partei vertraulich und verwendet sie nur zur Erfüllung des Vertrags, und zwar während der Vertragslaufzeit und drei Jahre darüber hinaus; ausgenommen sind Informationen, die ohne Vertragsverletzung öffentlich sind oder werden, der empfangenden Partei bereits rechtmäßig bekannt waren oder von ihr unabhängig entwickelt wurden oder aufgrund gesetzlicher Vorschriften offengelegt werden müssen (soweit zulässig nach vorheriger Mitteilung).
          </P>
        </section>

        <section>
          <H2 id="ip">11. Geistiges Eigentum und Lizenz</H2>
          <P>
            <strong>11.1</strong>{" "}Der Dienst, seine Software, Methodik, Bewertungsverfahren (Scoring), Datenbanken, Designs und Inhalte stehen in unserem Eigentum oder im Eigentum unserer Lizenzgeber und sind durch Gesetze zum Schutz des geistigen Eigentums geschützt. Wir gewähren Ihnen eine beschränkte, nicht-exklusive, nicht übertragbare Lizenz (die nur gemäß §18 widerruflich ist), während der Vertragslaufzeit und im Rahmen Ihrer Tariflimits auf den Dienst zuzugreifen, ihn zu nutzen und die von Ihnen erstellten Berichte und Ausgaben für Ihr eigenes Geschäft oder das Geschäft Ihrer Kunden zu verwenden.
          </P>
          <P>
            <strong>11.2 White-Label-Berichte</strong> (sofern in Ihrem Tarif enthalten) dürfen Ihren Kunden unter Ihrer Marke präsentiert werden; Sie bleiben für deren Verwendung und für alle Aussagen verantwortlich, die Sie auf ihrer Grundlage treffen.
          </P>
          <P>
            <strong>11.3 Feedback,</strong> das Sie uns geben, dürfen wir ohne Verpflichtung frei verwenden.
          </P>
          <P>
            <strong>11.4 Marken.</strong>{" "}„GEO Toolbox“ und unsere Logos sind unsere Marken. Marken Dritter (einschließlich der Namen von KI-Suchmaschinen) gehören ihren Inhabern und werden nur zu Identifikationszwecken verwendet; wir sind weder mit ihnen verbunden noch von ihnen empfohlen oder unterstützt.
          </P>
        </section>

        <section>
          <H2 id="acceptable-use">12. Zulässige Nutzung</H2>
          <P>Sie verpflichten sich, Folgendes weder selbst zu tun noch anderen zu gestatten:</P>
          <UL>
            <li>den Dienst rechtswidrig oder unter Verletzung von Rechten Dritter oder der Bedingungen eines verbundenen Dienstes oder einer KI-Suchmaschine zu nutzen;</li>
            <li>einen unbefugten Zugriff auf den Dienst, andere Konten oder unsere Infrastruktur zu versuchen oder den Dienst ohne unsere schriftliche Zustimmung zu sondieren, zu scannen oder auf Schwachstellen zu testen;</li>
            <li>den Dienst zu beeinträchtigen oder zu stören oder Tariflimits, die Credit-Abrechnung, Ratenbegrenzungen oder Sicherheitskontrollen zu umgehen;</li>
            <li>den Dienst oder seine Daten auf anderem Wege als über die von uns bereitgestellten Funktionen zu scrapen, zu crawlen oder massenhaft zu extrahieren oder automatisierte Mittel über den vorgesehenen Gebrauch hinaus einzusetzen;</li>
            <li>den Dienst weiterzuverkaufen, unterzulizenzieren, zu vermieten, Zugangsdaten dafür zu teilen oder ihn als Servicebüro (Service Bureau) anzubieten oder unsere Daten oder Berichte anders als nach §11 gestattet weiterzuverbreiten;</li>
            <li>den Dienst zurückzuentwickeln (Reverse Engineering) oder zu kopieren oder unter Nutzung des Zugangs ein Konkurrenzprodukt zu entwickeln;</li>
            <li>Schadcode hochzuladen oder Inhalte zu übermitteln, die rechtswidrig, ehrverletzend oder rechtsverletzend sind;</li>
            <li>über Ihre Identität zu täuschen, mehrere Konten zu erstellen, um wiederholt Testzeiträume oder Credits zu erhalten, oder ein Zahlungsmittel zu verwenden, zu dessen Nutzung Sie nicht berechtigt sind.</li>
          </UL>
        </section>

        <section>
          <H2 id="third-party">13. Dienste Dritter und KI-generierte Ausgaben</H2>
          <P>
            <strong>13.1</strong> Der Dienst fragt KI-Suchmaschinen und Datenanbieter Dritter ab und analysiert sie. Deren Verfügbarkeit, Verhalten, Ausgaben und Bedingungen ändern sich häufig und liegen außerhalb unseres Einflussbereichs. <strong>Antworten von KI-Suchmaschinen sind nicht deterministisch</strong>: Die Ergebnisse unterscheiden sich je nach Durchlauf, Region, Konto und Datum. Wir garantieren nicht, dass eine Suchmaschine Sie erwähnt oder zitiert, dass Sichtbarkeitswerte oder Schätzungen zutreffend oder vollständig sind oder dass eine Empfehlung zu einem bestimmten Ergebnis führt.
          </P>
          <P>
            <strong>13.2</strong> Ausgaben (Scores, Berichte, Briefings, generierte Inhalte, Empfehlungen) sind Informationswerkzeuge für Fachleute und keine fachliche, rechtliche, finanzielle oder Marketingberatung. Sie sind dafür verantwortlich, Ausgaben zu prüfen, bevor Sie sich auf sie verlassen oder sie veröffentlichen.
          </P>
          <P>
            <strong>13.3</strong> Wenn ein Drittanbieter den Zugang entzieht oder einschränkt, können wir die betroffene Funktion ersetzen, ändern oder entfernen, und zwar sofort, wenn der Anbieter keine Alternative lässt; schränkt dies einen kostenpflichtigen Tarif wesentlich ein, können Sie kündigen, und wir erstatten den ungenutzten Teil des laufenden Zeitraums (§18.4).
          </P>
        </section>

        <section>
          <H2 id="availability">14. Verfügbarkeit, Änderungen und Beta-Funktionen</H2>
          <P>
            <strong>14.1</strong> Wir streben eine hohe Verfügbarkeit an, garantieren aber keinen unterbrechungs- oder fehlerfreien Betrieb. Wartung, Updates und Ausfälle bei Dritten können zu Unterbrechungen führen. Für Scans, die auf unserer Seite fehlschlagen, werden keine Credits verbraucht.
          </P>
          <P>
            <strong>14.2</strong> Funktionen, die als Beta, Vorschau, experimentell oder ähnlich gekennzeichnet sind, werden ohne Gewähr („as is“) bereitgestellt, können ohne Ankündigung geändert oder eingestellt werden und sind von jeder Verfügbarkeitszusage ausgenommen.
          </P>
        </section>

        <section>
          <H2 id="warranties">15. Gewährleistungsausschluss</H2>
          <P>
            Soweit gesetzlich zulässig, wird der Dienst <strong>„wie besehen“ („as is“) und „wie verfügbar“ („as available“)</strong> bereitgestellt, ohne ausdrückliche oder stillschweigende Gewährleistungen jeglicher Art, einschließlich der Gewährleistung der Marktgängigkeit, der Eignung für einen bestimmten Zweck, der Richtigkeit, der Nichtverletzung von Rechten Dritter oder dafür, dass der Dienst Ihre Anforderungen erfüllt oder ein bestimmtes Ergebnis erzielt. Nichts in diesen AGB schließt Gewährleistungen oder Rechte aus, die nach anwendbarem Recht nicht ausgeschlossen werden können.
          </P>
        </section>

        <section>
          <H2 id="liability">16. Haftungsbeschränkung</H2>
          <P>
            <strong>16.1 Ausschlüsse.</strong> Soweit gesetzlich zulässig, haften wir nicht für mittelbare Schäden, Neben-, besondere oder Folgeschäden oder Strafschadensersatz (punitive damages), nicht für entgangenen Gewinn, Umsatzeinbußen, Geschäftsverluste, Verlust an Goodwill, Datenverlust oder entgangene erwartete Einsparungen und nicht für Entscheidungen, die auf der Grundlage von Ausgaben getroffen werden (§13), gleich aus welchem Rechtsgrund.
          </P>
          <P>
            <strong>16.2 Haftungshöchstbetrag.</strong> Unsere gesamte Haftung aus oder im Zusammenhang mit dem Vertrag ist in jedem Zeitraum von 12 Monaten begrenzt auf <strong>die Gebühren, die Sie uns in den 12 Monaten vor dem anspruchsbegründenden Ereignis für den Dienst gezahlt haben</strong> (oder 100 €, wenn Sie nichts gezahlt haben).
          </P>
          <P>
            <strong>16.3 Ausnahmen.</strong> Nichts beschränkt die Haftung für fahrlässig verursachte Tötung oder Körperverletzung, für Betrug oder vorsätzliches Fehlverhalten (dol), für grobe Fahrlässigkeit (faute lourde), soweit diese Haftung nach französischem Recht nicht beschränkt werden kann, oder für jede sonstige Haftung, die gesetzlich nicht beschränkt werden kann. Wenn Sie Verbraucher sind, gelten §16.1–16.2 nicht für Sie, und unsere Haftung richtet sich nach zwingendem Recht.
          </P>
        </section>

        <section>
          <H2 id="indemnity">17. Freistellung</H2>
          <P>
            Wenn Sie Geschäftskunde sind, verteidigen Sie uns gegen Ansprüche Dritter und stellen uns von diesen Ansprüchen und den damit verbundenen Kosten (einschließlich angemessener Anwaltskosten) frei, die sich aus Ihren Kundendaten, aus Ihrer Nutzung des Dienstes unter Verstoß gegen den Vertrag oder gegen geltendes Recht, aus Ihren White-Label-Berichten oder aus Aussagen ergeben, die Sie gegenüber Ihren Kunden auf der Grundlage der Ausgaben treffen — vorausgesetzt, wir informieren Sie umgehend über den Anspruch, überlassen Ihnen die Führung der Verteidigung und des Vergleichs (kein Vergleich, der ein Verschulden unsererseits anerkennt, ohne unsere Zustimmung) und wirken auf Ihre Kosten in angemessenem Umfang mit.
          </P>
        </section>

        <section>
          <H2 id="term">18. Laufzeit, Sperrung und Kündigung</H2>
          <P>
            <strong>18.1 Laufzeit.</strong> Der Vertrag beginnt mit der Erstellung Ihres Kontos und läuft bis zu seiner Beendigung. Abonnements laufen für aufeinanderfolgende Zeiträume gemäß §6.1.
          </P>
          <P>
            <strong>18.2 Sperrung.</strong> Wir können den Zugang ganz oder teilweise sperren, soweit praktikabel nach vorheriger Mitteilung, wenn: eine Zahlung überfällig ist; wir begründet annehmen, dass ein Sicherheitsrisiko, Missbrauch oder ein Verstoß gegen §12 vorliegt; dies gesetzlich oder von einem Drittanbieter verlangt wird; oder eine Rückbuchung anhängig ist (§8.5).
          </P>
          <P>
            <strong>18.3 Kündigung wegen Vertragsverletzung.</strong> Jede Partei kann den Vertrag kündigen, wenn die andere Partei ihn wesentlich verletzt und die Verletzung nicht innerhalb von 15 Tagen nach Mitteilung behebt (fristlos bei Verstößen gegen §12 oder bei Nichtzahlung, die nach einer Erinnerung fortbesteht). Bei einer Kündigung wegen einer Vertragsverletzung Ihrerseits bleiben die Gebühren für den laufenden Zeitraum fällig und werden nicht erstattet.
          </P>
          <P>
            <strong>18.4 Ordentliche Kündigung durch uns oder Einstellung des Dienstes.</strong>{" "}Wir können den Vertrag kündigen oder den Dienst einstellen, jeweils mit einer Frist von mindestens 30 Tagen per E-Mail. In diesem Fall erstatten wir die im Voraus gezahlten Gebühren für den ungenutzten Teil Ihres dann laufenden Zeitraums.
          </P>
          <P>
            <strong>18.5 Wirkung.</strong> Mit der Beendigung endet Ihre Lizenz; für Datenexport und -löschung gilt §10.4; §§8, 10.5, 11, 15–17, 20 und 21 gelten über die Beendigung hinaus fort.
          </P>
        </section>

        <section>
          <H2 id="changes">19. Änderungen dieser AGB</H2>
          <P>
            Wir können diese AGB anpassen, wenn sich der Dienst und die Rechtslage weiterentwickeln. Die aktuelle Fassung, ihre Nummer und ihr Datum sind stets oben auf dieser Seite angegeben; frühere Fassungen sind auf Anfrage erhältlich. Bei <strong>wesentlichen Änderungen</strong>, die Ihre Rechte einschränken, informieren wir Bestandskunden mindestens <strong>30 Tage</strong> vor deren Wirksamwerden per E-Mail oder in der App; sind Sie nicht einverstanden, können Sie vor dem Wirksamkeitsdatum kündigen, und wir erstatten Ihnen in diesem Fall im Voraus gezahlte Gebühren für den Zeitraum nach der Kündigung. Nicht wesentliche Änderungen (Klarstellungen, neue Funktionen, rechtliche Verweise) gelten ab ihrer Veröffentlichung. Die weitere Nutzung nach dem Wirksamkeitsdatum gilt als Annahme.
          </P>
        </section>

        <section>
          <H2 id="law">20. Anwendbares Recht und Streitigkeiten</H2>
          <P>
            <strong>20.1 Anwendbares Recht.</strong> Der Vertrag unterliegt französischem Recht unter Ausschluss seiner Kollisionsnormen und des UN-Übereinkommens über Verträge über den internationalen Warenkauf (CISG).
          </P>
          <p className="mt-2 rounded border border-gray-300 bg-white p-3 font-semibold uppercase tracking-wide text-gray-900">
            20.2 Gerichtsstand (Geschäftskunden). Alle Streitigkeiten aus oder im Zusammenhang mit dem Vertrag, die nicht innerhalb von 30 Tagen nach schriftlicher Mitteilung gütlich beigelegt werden, unterliegen der ausschließlichen Zuständigkeit der zuständigen Gerichte in Paris, Frankreich, auch bei Verfahren mit mehreren Beteiligten und ungeachtet anderer Gerichtsstandsklauseln. Nichts hindert eine Partei daran, jederzeit Eilrechtsschutz oder einstweiligen Rechtsschutz zu beantragen. Für in Frankreich niedergelassene Kunden gilt diese Klausel nur, soweit der französische Code de procédure civile (Artikel 48) dies zulässt; andernfalls ist das nach diesem Gesetzbuch zuständige Gericht zuständig.
          </p>
          <P>
            <strong>20.3 Sprechen Sie uns zuerst an.</strong> Bitte kontaktieren Sie uns, bevor Sie ein Verfahren einleiten; fast alle Anliegen klären wir per E-Mail.
          </P>
          <P>
            <strong>20.4 Verbraucher.</strong> Wenn Sie Verbraucher sind, gilt §20.2 nicht: Sie genießen den Schutz der zwingenden Verbraucherschutzvorschriften Ihres Wohnsitzlandes und können vor den Gerichten dieses Landes klagen. Verbraucher in Frankreich können außerdem die kostenlose Verbraucherschlichtung (Code de la consommation L612-1 ff.) in Anspruch nehmen, nachdem sie sich zunächst schriftlich an uns gewandt haben; der médiateur de la consommation wird derzeit benannt und wird hier sowie unter <a href="/de/legal" className={link}>geotoolbox.ai/legal</a> genannt. Die EU-Plattform zur Online-Streitbeilegung wurde am 20. Juli 2025 eingestellt.
          </P>
        </section>

        <section>
          <H2 id="general">21. Allgemeines</H2>
          <P><strong>21.1 Gesamte Vereinbarung.</strong> Der Vertrag stellt die gesamte Vereinbarung zwischen uns über seinen Gegenstand dar und ersetzt frühere Bedingungen; haben Sie mit uns eine gesonderte schriftliche Vereinbarung unterzeichnet, geht diese im Fall eines Widerspruchs diesen AGB vor.</P>
          <P><strong>21.2 Übertragung.</strong> Sie dürfen den Vertrag nicht ohne unsere Zustimmung übertragen. Wir dürfen ihn nach Mitteilung auf einen Nachfolger unseres Geschäftsbetriebs übertragen.</P>
          <P><strong>21.3 Höhere Gewalt.</strong> Keine Partei haftet für Verzögerungen oder Nichterfüllung aufgrund von Ereignissen, die außerhalb ihrer zumutbaren Kontrolle liegen (einschließlich Ausfällen von Plattformen Dritter, Netzwerkstörungen und Maßnahmen von Behörden); ausgenommen sind Zahlungspflichten.</P>
          <P><strong>21.4 Salvatorische Klausel; Verzicht.</strong> Wird eine Bestimmung für nicht durchsetzbar erklärt, wird sie auf das erforderliche Mindestmaß beschränkt, und die übrigen Bestimmungen bleiben in Kraft. Die Nichtdurchsetzung eines Rechts stellt keinen Verzicht dar.</P>
          <P><strong>21.5 Mitteilungen.</strong> Wir können Sie per E-Mail an Ihre Kontoadresse oder in der App benachrichtigen; unsere Mitteilungen gelten am Werktag nach dem Versand als zugegangen. Sie benachrichtigen uns unter <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>; Ihre Mitteilungen (einschließlich Kündigungen) werden wirksam, sobald sie unseren Mailserver erreichen.</P>
          <P><strong>21.6 Sprache.</strong> Diese AGB sind in englischer Sprache verfasst. Übersetzungen werden zur Erleichterung bereitgestellt; soweit eine Übersetzung für Verbraucher nach zwingendem Recht erforderlich ist, gilt diese Übersetzung für diese Verbraucher, andernfalls ist die englische Fassung maßgeblich.</P>
          <P><strong>21.7 Anspruchsfrist; Sanktionen.</strong> Für Geschäftskunden gilt: Ansprüche aus dem Vertrag müssen innerhalb eines Jahres nach dem anspruchsbegründenden Ereignis geltend gemacht werden. Sie sichern zu, dass Sie keinen Sanktionen oder Ausfuhrbeschränkungen unterliegen, die es uns verbieten würden, den Dienst für Sie zu erbringen.</P>
          <P><strong>21.8 Aufzeichnungen.</strong> Wir speichern einen Nachweis Ihrer Annahme dieser AGB (Version, Zeitstempel, IP-Adresse, Tarif und offengelegter Preis) sowie der Abrechnungskommunikation und können ihn als Beweismittel verwenden.</P>
        </section>

        <section>
          <H2 id="contact">22. Kontakt</H2>
          <P>
            Fragen zu diesen AGB, zur Abrechnung oder zur Kündigung:{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>. Impressum:{" "}
            <a href="/de/legal" className={link}>geotoolbox.ai/legal</a>.
          </P>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <H2 id="annex-a">Anlage A — Französische Gesetzestexte (nur für Verbraucher und Nicht-Gewerbetreibende)</H2>
          <P>
            Die folgenden Artikel des französischen Code de la consommation werden gemäß Artikel L215-4 dieses Gesetzbuchs vollständig wiedergegeben. Sie gelten nur für Verträge mit Verbrauchern und Nicht-Gewerbetreibenden (non-professionnels) im Sinne des französischen Rechts (eine natürliche Person, die zu Zwecken handelt, die außerhalb ihrer gewerblichen, geschäftlichen, handwerklichen oder beruflichen Tätigkeit liegen; oder eine juristische Person, die nicht zu beruflichen Zwecken handelt). Sie gelten nicht für Geschäftskunden (§2.2). Wortlaut in der am 15. August 2026 geltenden Fassung (Quelle: legifrance.gouv.fr).
          </P>
          <P>Die Artikel werden im französischen Originalwortlaut wiedergegeben.</P>
          <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm" lang="fr">
            <p><strong>Article L215-1</strong> — Pour les contrats de prestations de services conclus pour une durée déterminée avec une clause de reconduction tacite, le professionnel prestataire de services informe le consommateur par écrit, par lettre nominative ou courrier électronique dédiés, au plus tôt trois mois et au plus tard un mois avant le terme de la période autorisant le rejet de la reconduction, de la possibilité de ne pas reconduire le contrat qu&apos;il a conclu avec une clause de reconduction tacite. Cette information, délivrée dans des termes clairs et compréhensibles, mentionne, dans un encadré apparent, la date limite de non-reconduction.<br />
            Lorsque cette information ne lui a pas été adressée conformément aux dispositions du premier alinéa, le consommateur peut mettre gratuitement un terme au contrat, à tout moment à compter de la date de reconduction.<br />
            Les avances effectuées après la dernière date de reconduction ou, s&apos;agissant des contrats à durée indéterminée, après la date de transformation du contrat initial à durée déterminée, sont dans ce cas remboursées dans un délai de trente jours à compter de la date de résiliation, déduction faite des sommes correspondant, jusqu&apos;à celle-ci, à l&apos;exécution du contrat.<br />
            Les dispositions du présent article s&apos;appliquent sans préjudice de celles qui soumettent légalement certains contrats à des règles particulières en ce qui concerne l&apos;information du consommateur.<br />
            Par exception au premier alinéa du présent article, pour les contrats de fourniture de service de télévision au sens de l&apos;article 2 de la loi n° 86-1067 du 30 septembre 1986 relative à la liberté de communication et pour les contrats de fourniture de services de médias audiovisuels à la demande, le consommateur peut mettre gratuitement un terme au contrat, à tout moment à compter de la première reconduction, dès lors qu&apos;il change de domicile ou que son foyer fiscal évolue.</p>
            <p><strong>Article L215-1-1</strong> — Lorsqu&apos;un contrat a été conclu par voie électronique ou a été conclu par un autre moyen et que le professionnel, au jour de la résiliation par le consommateur, offre au consommateur la possibilité de conclure des contrats par voie électronique, la résiliation est rendue possible selon cette modalité. A cet effet, le professionnel met à la disposition du consommateur une fonctionnalité gratuite permettant d&apos;accomplir, par voie électronique, la notification et les démarches nécessaires à la résiliation du contrat. Lorsque le consommateur notifie la résiliation du contrat, le professionnel lui confirme la réception de la notification et l&apos;informe, sur un support durable et dans des délais raisonnables, de la date à laquelle le contrat prend fin et des effets de la résiliation.</p>
            <p><strong>Article L215-2</strong> — Les dispositions du présent chapitre, à l&apos;exception de l&apos;article L. 215-1-1, ne sont pas applicables aux exploitants des services d&apos;eau potable et d&apos;assainissement.</p>
            <p><strong>Article L215-3</strong> — Les dispositions du présent chapitre sont également applicables aux contrats conclus entre des professionnels et des non-professionnels.</p>
            <p><strong>Article L241-3</strong> — Lorsque le professionnel n&apos;a pas procédé au remboursement dans les conditions prévues à l&apos;article L. 215-1, les sommes dues sont productives d&apos;intérêts au taux légal.</p>
          </div>
        </section>

        <section>
          <H2 id="annex-b">Anlage B — Muster-Widerrufsformular (nur für Verbraucher)</H2>
          <P>Füllen Sie dieses Formular nur dann aus und senden Sie es zurück, wenn Sie Verbraucher sind und den Vertrag widerrufen wollen (§8.6).</P>
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <p>An: Samy Ben Sadok (GEO Toolbox), 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, Frankreich — samy@geotoolbox.ai</p>
            <p className="mt-2">Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: GEO-Toolbox-Abonnement, Tarif ______________</p>
            <p className="mt-2">Bestellt am (*)/erhalten am (*): ______________</p>
            <p className="mt-2">Name des/der Verbraucher(s): ______________</p>
            <p className="mt-2">Anschrift des/der Verbraucher(s): ______________</p>
            <p className="mt-2">E-Mail-Adresse des Kontos: ______________</p>
            <p className="mt-2">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): ______________</p>
            <p className="mt-2">Datum: ______________</p>
            <p className="mt-2 text-gray-500">(*) Unzutreffendes streichen.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
