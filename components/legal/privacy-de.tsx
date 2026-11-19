// Native German privacy policy (Datenschutzerklärung). Mirrors the EN policy in
// components/legal/privacy-content.tsx section for section (updated 2026-11-19); the note at the top
// states that the EN version prevails on any divergence.
export function PrivacyDe() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Datenschutzerklärung</h1>
      <p className="mt-2 text-sm text-gray-600">Zuletzt aktualisiert: 19. November 2026</p>
      <p className="mt-2 text-xs text-gray-500">
        Diese Übersetzung dient ausschließlich der Information. Bei Abweichungen ist die{" "}
        <a href="/privacy" className="underline">englische Fassung</a> maßgeblich.
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Welche Daten wir erheben</h2>
          <p className="mt-2">
            Wenn Sie sich mit Google anmelden, erhalten wir aus Ihrem Google-Konto Ihren <strong>Namen</strong>, Ihre <strong>E-Mail-Adresse</strong> und Ihr <strong>Profilbild</strong>.
          </p>
          <p className="mt-3">
            Wenn Sie Google Search Console verbinden, greifen wir für die von Ihnen freigegebenen Websites auf die Liste Ihrer GSC-Properties und Ihre <strong>Suchleistungsdaten</strong> (Suchanfragen, Klicks, Impressionen, durchschnittliche Position, Land, Gerät, Seite, Datum) zu, und zwar über den Scope <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">https://www.googleapis.com/auth/webmasters.readonly</code>.
          </p>
          <p className="mt-3">
            Wenn Sie Google Analytics 4 verbinden, greifen wir über den Scope <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">https://www.googleapis.com/auth/analytics.readonly</code> auf die Liste Ihrer GA4-Properties und Ihre <strong>Traffic-Kennzahlen</strong> (Sitzungen, Nutzer, Engagement-Rate, Conversions, Landingpages, Quelldimensionen) zu. Damit ermitteln wir den Traffic, der von KI-Suchmaschinen (ChatGPT, Gemini, Claude, Perplexity, NotebookLM) stammt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Wie wir Ihre Daten verwenden</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Um Sie zu authentifizieren und Ihre Kontoinformationen anzuzeigen</li>
            <li>Um Ihre Daten aus Google Search Console und Google Analytics 4 im GEO-Toolbox-Dashboard anzuzeigen</li>
            <li>Um Berichte zur KI-Sichtbarkeit Ihrer Domains zu erstellen</li>
            <li>Um Ihnen gelegentlich E-Mails zu Funktionen und Angeboten von GEO Toolbox zu senden (siehe unten; Sie können diese E-Mails jederzeit abbestellen)</li>
          </ul>
          <p className="mt-3">
            <strong>Die Nutzung von Google-Nutzerdaten ist strikt auf die oben genannten Zwecke beschränkt.</strong> Wir verwenden Google-Nutzerdaten nicht, um allgemeine KI- oder Machine-Learning-Modelle zu entwickeln, zu verbessern oder zu trainieren. Wir geben Google-Nutzerdaten nicht an Dritte weiter, es sei denn, dies ist für die Bereitstellung oder Verbesserung des Dienstes erforderlich oder gesetzlich vorgeschrieben. Unser Umgang mit Google-Nutzerdaten entspricht der <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-accent-700 underline hover:text-accent-800">Google API Services User Data Policy</a>, einschließlich der Anforderungen zur eingeschränkten Nutzung (Limited Use).
          </p>
          <p className="mt-3">
            <strong>E-Mails zu Produkt und Angeboten.</strong> Wenn Sie ein Konto erstellt oder einen kostenlosen Scan durchgeführt haben, können wir Ihnen gelegentlich E-Mails zu Funktionen und Angeboten von GEO Toolbox senden. Rechtsgrundlage ist unser berechtigtes Interesse, bestehende Nutzer über eine ähnliche Dienstleistung zu informieren. Dafür verwenden wir ausschließlich Ihre E-Mail-Adresse und Ihren Namen, niemals Ihre Search-Console- oder Analytics-Daten. Jede dieser E-Mails enthält einen Link, über den Sie sich mit einem Klick abmelden können, und Sie können jederzeit Widerspruch einlegen, indem Sie auf eine solche E-Mail antworten oder an <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a> schreiben.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Speicherung und Aufbewahrung der Daten</h2>
          <p className="mt-2">
            <strong>Wir speichern Ihre Rohdaten aus Google Search Console oder Google Analytics 4 nicht auf unseren Servern.</strong>{" "}Alle Antworten der GSC- und GA4-API werden bis zu 6 Stunden im localStorage Ihres Browsers zwischengespeichert und danach automatisch gelöscht. Wenn Sie den Browserspeicher leeren, werden sie sofort entfernt.
          </p>
          <p className="mt-3">
            Die serverseitige Speicherung beschränkt sich auf:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Ihre OAuth-Tokens (Access- und Refresh-Token), verschlüsselt gespeichert und aufbewahrt, bis Sie die Verbindung trennen</li>
            <li>Die Kennungen Ihrer verbundenen GSC- und GA4-Properties</li>
            <li>Authentifizierungsprotokolle (Anmeldeversuche, Sitzungscookies) &ndash; werden nach spätestens 7 Tagen Inaktivität automatisch gelöscht</li>
            <li>Den Seitenabruf-Cache (gerendertes HTML, das wir in Ihrem Auftrag zur Analyse abgerufen haben) &ndash; bis zu 24 Stunden vorgehalten und beim nächsten Abruf ersetzt</li>
            <li>Von Ihnen erzeugte Analyseergebnisse (Scan-Berichte, Domain-Übersichten, Agent-Readiness-Prüfungen, Content-Briefs, Zitierfähigkeitsanalysen, Wettbewerber-Radar-Scans, Umwandlungen für KI-taugliche Exporte, Tracking der KI-Sichtbarkeit) &ndash; <strong>werden unbefristet aufbewahrt</strong>, damit Sie und Ihr Team die Entwicklung über die Zeit vergleichen können. Ihr Tarif bestimmt, wie viel von diesem Verlauf im Dashboard sichtbar ist: Niedrigere Tarife zeigen nur einen begrenzten Zeitraum des Scan-Verlaufs (zum Beispiel 180 Tage bei <strong>Starter</strong>), höhere Tarife Ihren vollständigen Verlauf. Ältere Daten außerhalb des Zeitraums Ihres Tarifs werden nicht angezeigt, aber niemals verändert oder gelöscht, solange Ihr Konto aktiv ist.</li>
            <li>Interne Kosten- und Audit-Protokolle zur Überwachung unserer eigenen Infrastruktur, die außer einer pseudonymen Konto-ID keine personenbezogenen Daten enthalten</li>
            <li>Fehler-Telemetrie (anonymisiert, ohne personenbezogene Daten) für bis zu 90 Tage</li>
            <li>Abrechnungs- und Vertragsunterlagen &ndash; Ihre Zustimmung zu den <a href="/terms" className="text-accent-700 underline hover:text-accent-800">AGB</a> (Version, Zeitstempel, IP-Adresse, beim Checkout angegebener Tarif und Preis), Stripe-Kunden- und Abonnementkennungen sowie Kopien der Abrechnungsmitteilungen, die wir Ihnen senden (Bestätigung des Testzeitraums, Erinnerungen, Kündigungsbestätigungen). Sie werden für die Dauer des Kontos plus 5 Jahre aufbewahrt (Verjährungsfrist für vertragliche Ansprüche); Rechnungen werden gemäß französischem Handelsrecht 10 Jahre aufbewahrt. Diese Unterlagen dienen dazu, Abrechnungsfragen und Zahlungsstreitigkeiten zu klären.</li>
          </ul>
          <p className="mt-3">
            <strong>Recht auf Löschung.</strong> Sie können alle Ihre Daten jederzeit löschen, indem Sie Ihr Konto löschen oder eine E-Mail an{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a> senden. Die Löschung des gesamten Kontos führen wir innerhalb von 14 Tagen durch. Wenn Sie eine überwachte Marke aus Ihrem Dashboard entfernen, werden die Marke und ihre Watchlist sofort als gelöscht markiert (Soft Delete).
          </p>
        </section>

        <section>
          <h2 id="subprocessors" className="scroll-mt-24 text-lg font-semibold text-gray-900">4. Weitergabe von Daten</h2>
          <p className="mt-2">
            Wir verkaufen, vermieten oder teilen Ihre personenbezogenen Daten nicht mit Dritten zu Marketingzwecken. Für den Betrieb des Dienstes setzen wir die folgenden Auftragsverarbeiter ein:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Google OAuth: Authentifizierung</li>
            <li>Google Search Console API: Suchleistungsdaten</li>
            <li>Google Analytics Data API: Daten zum KI-Traffic</li>
            <li>Google Analytics 4: aggregierte Nutzungsstatistiken für unsere Website</li>
            <li>Microsoft Clarity: aggregierte Nutzungsstatistiken für unsere Website (Heatmaps und Sitzungsaufzeichnungen, bei denen sensible Texte und Eingaben maskiert werden)</li>
            <li>Stripe: Zahlungsabwicklung (Kartennummern speichern wir selbst niemals)</li>
            <li>Resend: E-Mail-Versand (Verifizierung, Magic Links, Zusammenfassungen sowie gelegentliche E-Mails zu Produkt und Angeboten)</li>
            <li>Vercel: Hosting der Anwendung</li>
            <li>Replit: Hosting der Anwendung (PHP-Backend)</li>
            <li>Neon: Hosting der PostgreSQL-Datenbank</li>
            <li>Sentry: Fehlerüberwachung (es werden keine personenbezogenen Daten übermittelt)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Ihre Rechte</h2>
          <p className="mt-2">Sie können:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Den Zugriff von GEO Toolbox auf Ihr Google-Konto jederzeit unter <a href="https://myaccount.google.com/permissions" className="text-accent-700 underline hover:text-accent-800">https://myaccount.google.com/permissions</a> widerrufen</li>
            <li>GSC oder GA4 im Tab &bdquo;Analytics&ldquo; der App trennen (über den Link &bdquo;disconnect&ldquo; unter dem Badge des verbundenen Kontos)</li>
            <li>Die Löschung aller serverseitigen Daten per E-Mail an <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a> verlangen; wir antworten innerhalb von 14 Tagen</li>
            <li>Lokal zwischengespeicherte Daten löschen, indem Sie Ihren Browserspeicher leeren</li>
          </ul>
          <p className="mt-3">
            Wenn Sie sich im Europäischen Wirtschaftsraum, im Vereinigten Königreich oder in der Schweiz befinden, stehen Ihnen nach der DSGVO (Art. 15&ndash;21) zusätzlich das Recht auf <strong>Auskunft</strong>, <strong>Berichtigung</strong>, <strong>Löschung</strong>, <strong>Einschränkung der Verarbeitung</strong>, <strong>Datenübertragbarkeit</strong> und <strong>Widerspruch</strong> zu sowie das Recht, eine <strong>Einwilligung jederzeit zu widerrufen</strong>, ohne dass die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung berührt wird. Um eines dieser Rechte auszuüben, schreiben Sie an{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>. Außerdem haben Sie das Recht, sich bei Ihrer zuständigen Aufsichtsbehörde zu beschweren &ndash; in Frankreich ist dies die CNIL (<a href="https://www.cnil.fr" className="text-accent-700 underline hover:text-accent-800">cnil.fr</a>), in Deutschland die Datenschutzaufsichtsbehörde Ihres Bundeslandes (<a href="https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html" className="text-accent-700 underline hover:text-accent-800">Übersicht der Landesbehörden</a>).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Cookies und Einwilligung</h2>
          <p className="mt-2">
            Wir verwenden <strong>unbedingt erforderliche Cookies</strong> für die Sitzungsverwaltung, die Sicherheit (CSRF-Schutz) und um Ihre Cookie-Auswahl zu speichern. Diese sind immer aktiv und erfordern keine Einwilligung.
          </p>
          <p className="mt-3">
            Außerdem verwenden wir die nachstehend beschriebenen Analyse-Cookies; soweit das anwendbare Recht eine Einwilligung verlangt &ndash; unter anderem für Besucher aus dem EWR, dem Vereinigten Königreich und der Schweiz —, werden diese Tools erst aktiviert, nachdem Sie im Einwilligungsbanner zugestimmt haben. Gesetzt werden sie von <strong>Google Analytics 4</strong> (aggregierter Traffic, aufgerufene Seiten, Gerätetyp, ungefährer Standort) und <strong>Microsoft Clarity</strong>{" "}(aggregierte Interaktionsmuster, einschließlich Heatmaps und Sitzungsaufzeichnungen, bei denen sensible Texte und Formulareingaben maskiert werden). Keines der beiden Tools wird für Werbung oder seitenübergreifendes Tracking eingesetzt.
          </p>
          <p className="mt-3">
            Wenn Sie uns aus dem EWR, dem Vereinigten Königreich oder der Schweiz besuchen, <strong>werden keine Analyse-Tools aktiviert, bevor Sie</strong> im Einwilligungsbanner <strong>zugestimmt haben</strong>. Sie können mit einem Klick ablehnen (die Ablehnung wird 6 Monate / 180 Tage gespeichert, eine Zustimmung 12 Monate / 365 Tage) und Ihre Auswahl jederzeit ändern: über den Link <strong>Cookie-Einstellungen</strong> in der Fußzeile der Website, über den Link <strong>Cookie settings</strong> auf der Kontoseite (Account) der App oder indem Sie das Cookie <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">sg_consent</code> löschen. Zusätzlich setzen wir ein kurzlebiges Cookie <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">sg_cc</code>, das nur Ihren Ländercode enthält (oder den Wert <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">unknown</code>, wenn er sich nicht ermitteln lässt) und mit dem wir entscheiden, ob das Banner angezeigt werden muss; es enthält keine Kennung.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Internationale Datenübermittlungen</h2>
          <p className="mt-2">
            Wir haben unseren Sitz in der Europäischen Union, und mehrere der in Abschnitt 4 genannten Auftragsverarbeiter (darunter Google, Microsoft, Vercel, Neon, Stripe und Sentry) verarbeiten Daten in den Vereinigten Staaten. Werden personenbezogene Daten von Personen im EWR, im Vereinigten Königreich oder in der Schweiz in die Vereinigten Staaten übermittelt, stützen wir uns auf das <strong>EU&ndash;U.S. Data Privacy Framework</strong> (einschließlich seiner Erweiterungen für das Vereinigte Königreich und die Schweiz), sofern der Anbieter über eine aktive Zertifizierung verfügt, und andernfalls auf die <strong>Standardvertragsklauseln</strong>{" "}der Europäischen Kommission, die in den Auftragsverarbeitungsvertrag des Anbieters aufgenommen sind. Analysedaten (Google Analytics, Microsoft Clarity) werden für Besucher aus dem EWR, dem Vereinigten Königreich und der Schweiz überhaupt erst nach ausdrücklicher Einwilligung verarbeitet (siehe Abschnitt 6).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Kontakt</h2>
          <p className="mt-2">
            Bei Fragen zum Datenschutz oder für Anträge auf Löschung Ihrer Daten schreiben Sie an{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
