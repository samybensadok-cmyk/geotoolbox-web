// components/legal/terms-fr.tsx
// Native French Terms (Conditions générales d'utilisation et de vente) body for /fr/terms. Mirrors
// components/legal/terms-content.tsx (EN, version and dates imported below) section for section, with
// identical clause numbers and heading ids. The note at the top says the EN version prevails "dans les
// conditions du §21.6" (translated as §21.6 here): where mandatory law requires a translation for consumers,
// that translation applies to them. Annex A keeps the French statutory text byte-identical to the EN file.
// Annex B follows the statutory "modèle de formulaire de rétractation" (annexe à l'article R221-1 du Code de
// la consommation), with the same fields as the EN form.

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
  ["who-we-are", "1. Qui sommes-nous"],
  ["acceptance", "2. Acceptation et usage professionnel"],
  ["accounts", "3. Comptes"],
  ["service", "4. Le Service, les formules et les crédits"],
  ["free-trial", "5. Essai gratuit"],
  ["fees", "6. Prix, facturation et reconduction automatique"],
  ["cancellation", "7. Résiliation de l’abonnement"],
  ["refunds", "8. Remboursements, droits légaux et contestations de paiement"],
  ["addons", "9. Packs de crédits, options et prestations de services"],
  ["data", "10. Vos données, protection de la vie privée et comptes connectés"],
  ["ip", "11. Propriété intellectuelle et licence"],
  ["acceptable-use", "12. Utilisation acceptable"],
  ["third-party", "13. Services tiers et résultats générés par l’IA"],
  ["availability", "14. Disponibilité, évolutions et fonctionnalités bêta"],
  ["warranties", "15. Exclusion de garanties"],
  ["liability", "16. Limitation de responsabilité"],
  ["indemnity", "17. Garantie et indemnisation"],
  ["term", "18. Durée, suspension et résiliation"],
  ["changes", "19. Modification des présentes Conditions"],
  ["law", "20. Droit applicable et litiges"],
  ["general", "21. Dispositions générales"],
  ["contact", "22. Contact"],
  ["annex-a", "Annexe A — Textes légaux français (consommateurs et non-professionnels uniquement)"],
  ["annex-b", "Annexe B — Modèle de formulaire de rétractation (consommateurs uniquement)"],
]

export function TermsFr() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Conditions générales d’utilisation et de vente</h1>
      <p className="mt-2 text-sm text-gray-600">
        Version {TERMS_VERSION} · Dernière mise à jour : {TERMS_UPDATED} · En vigueur pour les nouveaux clients le {TERMS_EFFECTIVE_NEW} et pour les clients existants le {TERMS_EFFECTIVE_EXISTING}
      </p>
      <p className="mt-2 text-xs text-gray-500">
        Cette traduction est fournie pour votre commodité. En cas de divergence, la{" "}
        <a href="/terms" className="underline">version anglaise</a> prévaut, dans les conditions du §21.6.
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-semibold text-gray-900">Résumé en langage clair (les Conditions complètes ci-dessous prévalent)</p>
        <UL>
          <li>GEO Toolbox est un outil professionnel. En vous abonnant, vous confirmez agir à des fins professionnelles.</li>
          <li>Les formules payantes sont des <strong>abonnements reconduits automatiquement</strong> (chaque mois ou chaque année) jusqu’à votre résiliation.</li>
          <li>Un essai gratuit nécessite une carte et <strong>se convertit automatiquement en abonnement payant à son terme</strong>, sauf si vous l’annulez avant. Le montant et la date du premier débit (pour une formule annuelle, le prix annuel total) sont indiqués lors du paiement et dans votre e-mail de confirmation, et nous vous envoyons également un e-mail avant le débit. L’annulation d’un essai commencé à compter du 27 octobre 2026 met fin immédiatement à cet essai et à votre accès.</li>
          <li>Vous pouvez résilier à tout moment depuis <strong>Account → Manage subscription</strong> (Compte → Gérer l’abonnement). La résiliation d’un abonnement payant prend effet à la fin de la période en cours ; vous conservez l’accès jusque-là.</li>
          <li><strong>Les frais ne sont pas remboursables</strong> — y compris lorsqu’un essai est converti parce que vous ne l’avez pas annulé à temps, et pour le temps ou les crédits non utilisés — sauf lorsque la loi vous confère un droit que nous ne pouvons pas exclure (voir §8).</li>
        </UL>
      </div>

      <nav aria-label="Sommaire" className="mt-8 text-sm">
        <p className="font-semibold text-gray-900">Sommaire</p>
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
          <H2 id="who-we-are">1. Qui sommes-nous</H2>
          <P>
            GEO Toolbox (« <strong>GEO Toolbox</strong> », « <strong>nous</strong> ») est exploité par <strong>Samy Ben Sadok</strong>, entrepreneur individuel (EI), immatriculé en France sous le numéro SIREN 827 472 424 (Registre national des entreprises), dont l’adresse professionnelle est 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, France. TVA : non applicable — article 293 B du Code général des impôts (franchise en base) ; les prix sont donc facturés sans TVA française jusqu’à nouvel ordre. Mentions légales complètes :{" "}
            <a href="/fr/legal" className={link}>geotoolbox.ai/fr/legal</a>. Contact :{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>.
          </P>
          <P>
            Les présentes conditions générales d’utilisation et de vente (les « <strong>Conditions</strong> ») constituent un contrat juridiquement contraignant entre vous (la personne physique ou morale qui utilise le Service, « <strong>vous</strong> », le « <strong>Client</strong> ») et nous. Elles intègrent notre{" "}
            <a href="/fr/privacy" className={link}>Politique de confidentialité</a> et notre{" "}
            <a href="/fr/refund-policy" className={link}>Politique de résiliation et de remboursement</a>, ainsi que le détail des formules affiché sur la{" "}
            <a href="/fr/pricing" className={link}>page des tarifs</a> et lors du paiement au moment de votre abonnement (ensemble, le « <strong>Contrat</strong> »).
          </P>
        </section>

        <section>
          <H2 id="acceptance">2. Acceptation et usage professionnel</H2>
          <P>
            <strong>2.1 Acceptation.</strong>{" "}Vous acceptez les présentes Conditions en créant un compte, en cochant la case d’acceptation lors de l’inscription ou du paiement, en cliquant sur un bouton qui y fait référence, ou en utilisant le Service. Si vous ne les acceptez pas, n’utilisez pas le Service. Si vous acceptez pour le compte d’une société ou d’une autre entité, vous confirmez avoir le pouvoir de l’engager, et « vous » désigne alors cette entité.
          </P>
          <P>
            <strong>2.2 Usage professionnel uniquement.</strong> Le Service est un outil professionnel destiné aux professionnels du marketing, aux consultants SEO/GEO, aux agences et aux entreprises. <strong>Vous confirmez que vous obtenez et utilisez le Service dans le cadre de votre activité commerciale, industrielle, artisanale ou libérale, et non à des fins personnelles, familiales ou domestiques.</strong> Nous nous fondons sur cette déclaration. Si vous avez néanmoins la qualité de consommateur au sens des dispositions impératives du droit de votre pays de résidence, les §8.6 et §20.4 vous sont applicables.
          </P>
          <P>
            <strong>2.3 Âge.</strong> Vous devez être âgé d’au moins 18 ans.
          </P>
        </section>

        <section>
          <H2 id="accounts">3. Comptes</H2>
          <P>
            <strong>3.1</strong> Vous pouvez vous connecter avec une adresse e-mail et un mot de passe, un lien magique (magic link) ou Google OAuth. Vous êtes responsable de toute activité réalisée sous votre compte (sauf si elle résulte d’un manquement de notre part) et de la confidentialité de vos identifiants. Informez-nous immédiatement à{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> si vous soupçonnez un accès non autorisé.
          </P>
          <P>
            <strong>3.2 Sièges d’équipe.</strong> Lorsque votre formule inclut des sièges d’équipe (team seats), vous pouvez inviter des membres. Vous êtes responsable du respect des présentes Conditions par ces membres. Seul le titulaire du compte peut modifier la facturation, résilier ou supprimer le compte.
          </P>
          <P>
            <strong>3.3 Exactitude.</strong> Veillez à ce que les informations de votre compte et de facturation soient exactes, notamment le nom de votre entreprise, votre adresse de facturation et, le cas échéant, votre numéro de TVA.
          </P>
        </section>

        <section>
          <H2 id="service">4. Le Service, les formules et les crédits</H2>
          <P>
            <strong>4.1</strong> Le Service fournit des analyses de visibilité dans la recherche par IA : le suivi de la manière dont une marque apparaît dans les moteurs d’IA (par exemple ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews et AI Mode, Bing Copilot, Grok), ainsi que des analyses (scans), des rapports et des outils de contenu associés, tels que décrits sur notre site au moment de votre commande.
          </P>
          <P>
            <strong>4.2 Formules.</strong> Chaque formule donne droit aux fonctionnalités et aux limites indiquées sur la page des tarifs et lors du paiement (par exemple nombre de marques, de prompts, de moteurs, de sièges, durée de l’historique). Nous pouvons améliorer ou adapter le Service ; les réductions substantielles d’une formule que vous avez payée ne prennent effet qu’à compter de votre prochain renouvellement, après notification conformément au §19.
          </P>
          <P>
            <strong>4.3 Crédits.</strong> L’utilisation est décomptée en crédits. Chaque formule octroie une dotation mensuelle de crédits, attribuée au début de chaque mois de service (y compris pour les formules annuelles), ou à un niveau réduit pendant un essai comme indiqué au §5. <strong>Les crédits non utilisés ne sont pas reportés, n’ont aucune valeur monétaire et ne sont pas remboursables.</strong> La pondération des crédits par moteur et par outil est publiée dans l’application et peut évoluer ; les modifications s’appliquent pour l’avenir.
          </P>
          <P>
            <strong>4.4 Usage raisonnable.</strong> Les limites des formules sont appliquées techniquement. Nous pouvons limiter (throttling) ou suspendre une utilisation abusive, automatisée au-delà de l’usage prévu, ou qui menace la stabilité ou la structure de coûts du Service, après notification lorsque cela est possible.
          </P>
        </section>

        <section>
          <H2 id="free-trial">5. Essai gratuit</H2>
          <P>
            <strong>5.1 En quoi il consiste.</strong> Lorsqu’il est proposé (actuellement sur certaines formules, comme indiqué sur la page des tarifs), un essai gratuit vous donne accès à la formule que vous avez choisie pendant la période d’essai indiquée lors du paiement (actuellement <strong>7 jours</strong>). Pour les essais commencés sous la version 2.1 ou une version ultérieure, l’annulation de l’essai met fin immédiatement à celui-ci et à l’accès qu’il procure (§5.4). Un moyen de paiement valide est requis pour commencer un essai. Les comptes en essai peuvent fonctionner avec des limites réduites (par exemple une fraction des crédits de la formule, un nombre maximal de marques plus faible, pas de rapports en marque blanche) ; la formule complète est débloquée lorsque l’essai est converti.
          </P>
          <P>
            <strong>5.2 Conversion automatique — à lire attentivement.</strong> <strong>Sauf si vous annulez avant la fin de l’essai, votre essai se convertit automatiquement en abonnement payant à la formule et selon la périodicité de facturation (mensuelle ou annuelle) que vous avez choisies, et le moyen de paiement enregistré est débité, à la date de fin de l’essai, du montant indiqué lors du paiement.</strong> Le montant exact, la devise et la date du premier débit sont affichés lors du paiement avant que vous ne confirmiez, et sont rappelés dans l’e-mail de confirmation que nous envoyons au début de l’essai. L’abonnement est ensuite reconduit automatiquement conformément au §6.
          </P>
          <P>
            <strong>5.3 Rappels.</strong> Nous envoyons l’e-mail de confirmation de l’essai lors de l’inscription à celui-ci (indiquant le montant et la date du premier débit ainsi que la manière d’annuler) — cet e-mail constitue l’information relative au débit à venir — et, en outre, des e-mails de rappel avant le premier débit, à l’adresse associée à votre compte. Les rappels sont envoyés à titre de courtoisie et pour respecter les règles des réseaux de cartes ; <strong>la non-réception d’un rappel (par exemple en raison d’un filtre anti-spam ou d’une adresse erronée) n’affecte pas la conversion automatique et ne vous ouvre pas droit à un remboursement</strong>. Veillez à maintenir votre adresse e-mail à jour.
          </P>
          <P>
            <strong>5.4 Comment annuler un essai.</strong> Vous pouvez annuler à tout moment avant la fin de l’essai depuis <strong>Account → Manage subscription</strong> (Compte → Gérer l’abonnement ; portail client Stripe), ou en écrivant à{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>{" "}depuis l’adresse du titulaire du compte, avant la date et l’heure de fin de l’essai indiquées dans votre compte et dans l’e-mail de confirmation. Un essai annulé avant sa fin n’est jamais facturé. <strong>Pour les essais commencés sous la version 2.1 ou une version ultérieure des présentes Conditions (à compter du 27 octobre 2026), l’annulation d’un essai y met fin immédiatement :</strong> l’accès à la formule d’essai cesse aussitôt et votre compte passe à la formule gratuite. Un essai commencé antérieurement conserve son accès jusqu’à sa date de fin. Les essais étant limités à un par client (§5.6), un nouvel abonnement souscrit ultérieurement est facturé dès son début. L’annulation est confirmée par e-mail.
          </P>
          <P>
            <strong>5.5 Pas de remboursement en cas d’annulation omise.</strong> Les conditions de conversion étant communiquées lors du paiement et confirmées par e-mail lors de l’inscription à l’essai, <strong>un débit résultant du fait que vous n’avez pas annulé avant la fin de l’essai est un débit valable et n’est pas remboursable</strong> (sous la seule réserve du §8.6) ; les rappels supplémentaires visés au §5.3 n’y changent rien. Cela s’applique de la même manière aux abonnements mensuels et annuels.
          </P>
          <P>
            <strong>5.6 Un essai par client.</strong> Les essais sont limités à un par personne, par société et par moyen de paiement, et ne sont pas proposés lors d’un passage à une formule supérieure ni lors d’un réabonnement. Nous pouvons refuser, raccourcir ou interrompre de manière anticipée un essai, refuser l’abonnement, fermer les comptes en double ou retirer l’offre d’essai, lorsque nous détectons un abus d’essai (par exemple plusieurs comptes ou moyens de paiement) ou à tout moment moyennant notification.
          </P>
        </section>

        <section>
          <H2 id="fees">6. Prix, facturation et reconduction automatique</H2>
          <P>
            <strong>6.1 Les abonnements sont reconduits automatiquement.</strong> Les formules payantes sont vendues sous forme d’abonnements récurrents. <strong>Votre abonnement est reconduit automatiquement (reconduction tacite) à la fin de chaque période de facturation (mensuelle ou annuelle, selon votre choix) pour une nouvelle période de même durée, et le moyen de paiement enregistré est débité, au début de chaque période, du prix alors en vigueur pour votre formule, jusqu’à votre résiliation</strong> conformément au §7. Les formules annuelles sont facturées en totalité, d’avance, pour l’année. Pour les abonnements annuels, nous envoyons par e-mail un rappel de renouvellement environ cinq semaines (33 à 39 jours) avant la date de renouvellement, indiquant le montant et la date du renouvellement ainsi que la manière de résilier.
          </P>
          <P>
            <strong>6.2 Paiement.</strong> Les paiements sont traités par Stripe. En fournissant un moyen de paiement, vous nous autorisez (par l’intermédiaire de Stripe) à débiter l’ensemble des frais dus au titre du Contrat, y compris les frais de renouvellement, les taxes applicables et les packs de crédits ou options que vous commandez. Les factures et les reçus sont envoyés par e-mail et disponibles dans le portail client.
          </P>
          <P>
            <strong>6.3 Prix, devise et taxes.</strong> Les prix sont ceux affichés lors du paiement dans la devise choisie (USD ou EUR). <strong>Les frais s’entendent hors TVA, taxe sur les ventes et taxes similaires</strong>, qui sont ajoutées lors du paiement le cas échéant en fonction de votre adresse de facturation ; si vous fournissez un numéro de TVA valide, l’autoliquidation peut s’appliquer. Vous êtes redevable de tous impôts, droits ou frais bancaires autres que les impôts assis sur nos revenus.
          </P>
          <P>
            <strong>6.4 Modification des prix.</strong> Nous pouvons modifier nos prix. Les hausses de prix ne s’appliquent à votre abonnement qu’à compter du premier renouvellement intervenant après un préavis d’au moins <strong>30 jours</strong> par e-mail. Si vous ne les acceptez pas, résiliez avant le renouvellement ; le fait de continuer après la date d’effet vaut acceptation du nouveau prix.
          </P>
          <P>
            <strong>6.5 Échecs de paiement.</strong> Si un débit échoue, nous pouvons (par l’intermédiaire de Stripe) le présenter à nouveau et vous inviter par e-mail à mettre à jour votre moyen de paiement. Nous pouvons suspendre le compte ou le faire passer à une formule inférieure tant qu’un paiement reste impayé, et le résilier si l’incident de paiement n’est pas régularisé dans un délai raisonnable. Vous restez redevable des frais de la période. Tout retard de paiement d’un client professionnel donne lieu à des pénalités de retard au taux de trois fois le taux d’intérêt légal français, ainsi qu’à une indemnité forfaitaire pour frais de recouvrement de 40 € par facture (Code de commerce, articles L441-10 et D441-5).
          </P>
          <P>
            <strong>6.6 Passage à une formule supérieure ou inférieure.</strong> Le passage à une formule supérieure prend effet immédiatement et fait l’objet d’un calcul au prorata par Stripe. Le passage à une formule inférieure prend effet au renouvellement suivant ; la différence n’est pas remboursée.
          </P>
          <P>
            <strong>6.7 Promotions.</strong> Les codes promotionnels et les prix promotionnels s’appliquent pendant la durée indiquée, puis le prix standard affiché lors du paiement s’applique de nouveau.
          </P>
        </section>

        <section>
          <H2 id="cancellation">7. Résiliation de l’abonnement</H2>
          <P>
            <strong>7.1 Résiliation à tout moment, en ligne.</strong> Vous pouvez résilier votre abonnement à tout moment depuis <strong>Account → Manage subscription</strong> (Compte → Gérer l’abonnement), qui ouvre le portail client Stripe (« Cancel subscription »), ou en écrivant à{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>{" "}depuis l’adresse du titulaire du compte. Nous confirmons chaque résiliation par e-mail, en indiquant la date à laquelle l’abonnement prend fin.
          </P>
          <P>
            <strong>7.2 Effet.</strong> La résiliation met fin aux renouvellements futurs. <strong>Pour un abonnement payant, elle prend effet à la fin de la période de facturation en cours</strong> et vous conservez l’accès jusque-là. <strong>L’annulation d’un essai gratuit commencé sous la version 2.1 ou une version ultérieure y met fin immédiatement</strong> : l’accès à la formule d’essai cesse aussitôt et aucun montant n’est débité (§5.4) ; un essai commencé antérieurement conserve son accès jusqu’à sa date de fin. <strong>Aucun remboursement au prorata ou partiel n’est accordé pour le reste d’une période déjà payée</strong>, y compris les périodes annuelles, sous réserve du §8.6.
          </P>
          <P>
            <strong>7.3 Date limite.</strong> Pour éviter le débit d’un renouvellement, résiliez au plus tard la veille de la date de renouvellement indiquée dans votre compte et dans nos e-mails (les débits interviennent à l’heure anniversaire de votre abonnement initial, en UTC). Une résiliation effectuée après un débit s’applique à la période suivante.
          </P>
          <P>
            <strong>7.4 La suppression de votre compte</strong> résilie tout abonnement actif avec effet à la fin de la période en cours, et entraîne la suppression des données conformément à notre Politique de confidentialité. La suppression d’un compte n’ouvre pas, à elle seule, droit à un remboursement. La révocation de l’accès Google OAuth ou la désinstallation d’intégrations ne résilie <em>pas</em> un abonnement — utilisez le §7.1.
          </P>
        </section>

        <section>
          <H2 id="refunds">8. Remboursements, droits légaux et contestations de paiement</H2>
          <P>
            <strong>8.1 Les frais ne sont pas remboursables.</strong> Sauf disposition expresse du présent §8, <strong>les frais afférents à une période de facturation commencée sont dus en totalité et ne sont pas remboursables</strong>. En particulier, aucun remboursement ni avoir n’est accordé pour : (a) un essai converti parce que vous ne l’avez pas annulé avant sa fin (§5.5) ; (b) un renouvellement automatique intervenu faute de résiliation à temps de votre part (§7.3), y compris les renouvellements annuels ; (c) le temps non utilisé d’une période de facturation après une résiliation ou un passage à une formule inférieure ; (d) les crédits, sièges, marques ou prompts non utilisés ; (e) les périodes pendant lesquelles vous n’avez pas utilisé le Service ; (f) les fonctionnalités que vous n’avez pas utilisées ou qui ont évolué ; (g) une insatisfaction quant aux résultats, aux classements ou aux réponses des moteurs d’IA, qui échappent à notre contrôle (§13).
          </P>
          <P>
            <strong>8.2 Erreur de notre part.</strong> Si nous vous avons débité à tort (montant erroné, double débit, débit intervenu après confirmation d’une résiliation ou d’une annulation), nous corrigerons l’erreur et vous rembourserons la différence — merci de nous en informer rapidement (idéalement dans un délai de 60 jours) afin que nous puissions retrouver le paiement.
          </P>
          <P>
            <strong>8.3 Geste commercial.</strong> Nous pouvons, à notre seule discrétion et sans y être tenus, accorder un remboursement ou un avoir à titre de geste commercial. Le faire une fois ne nous oblige pas à le refaire et ne modifie pas les présentes Conditions.
          </P>
          <P>
            <strong>8.4 Modalités et délai de remboursement.</strong> Tout remboursement est effectué sur le moyen de paiement d’origine par l’intermédiaire de Stripe, normalement dans un délai de 14 jours à compter de notre décision.
          </P>
          <P>
            <strong>8.5 Contactez-nous avant de contester un débit.</strong> Si vous pensez qu’un débit est erroné, contactez-nous d’abord à{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> — la plupart des problèmes sont résolus en deux jours ouvrés. Aucune disposition des présentes Conditions ne limite votre droit de contester un paiement auprès de l’émetteur de votre carte ou de votre banque. Toutefois, si une rétrofacturation (chargeback) est ouverte à l’encontre d’un débit effectué conformément aux présentes Conditions (par exemple la conversion d’un essai ou un renouvellement dûment annoncés), nous soumettrons les preuves de votre acceptation des présentes Conditions, les informations affichées lors du paiement, les e-mails de confirmation et de rappel ainsi que votre utilisation du Service ; tant que la contestation est en cours, nous pouvons suspendre le compte. Si une rétrofacturation aboutit à l’encontre d’un débit valablement effectué au titre des présentes Conditions, le montant nous reste dû ; si une rétrofacturation est demandée sans fondement de bonne foi, nous pouvons résilier le compte pour manquement.
          </P>
          <P>
            <strong>8.6 Droits légaux des consommateurs.</strong> Le Service est destiné à un usage professionnel (§2.2). Si, malgré cela, vous êtes un <em>consommateur</em> au sens des dispositions impératives du droit de votre pays de résidence (notamment la directive européenne relative aux droits des consommateurs, le Code de la consommation français ou les UK Consumer Contracts Regulations 2013), aucune disposition des présentes Conditions ne limite les droits auxquels il ne peut être dérogé par contrat. Dans ce cas : (a) vous disposez d’un droit de rétractation du Contrat dans un délai de 14 jours à compter du jour de votre abonnement (y compris le jour où commence un essai gratuit), sans avoir à motiver votre décision, par une déclaration claire adressée à{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> (vous pouvez utiliser le modèle de formulaire figurant à l’Annexe B) ; (b) lors de l’inscription et du paiement, vous avez <strong>expressément demandé que nous commencions l’exécution pendant le délai de rétractation et reconnu</strong> que, si vous vous rétractez, vous devez payer un montant proportionnel au service fourni jusqu’à ce que vous nous ayez informés de votre rétractation, et que vous perdez votre droit de rétractation une fois le service pleinement exécuté ; (c) les remboursements dus au titre du présent §8.6 sont effectués dans un délai de 14 jours à compter de votre notification ; (d) les dispositions françaises relatives à la reconduction tacite et à la résiliation en ligne reproduites à l’Annexe A s’appliquent aux consommateurs et aux non-professionnels tels qu’ils y sont définis. Les clients professionnels ne disposent d’aucun droit de rétractation.
          </P>
        </section>

        <section>
          <H2 id="addons">9. Packs de crédits, options et prestations de services</H2>
          <P>
            <strong>9.1</strong> Les packs de crédits et les options sont des achats ponctuels, non remboursables, et sont consommés conformément au §4.3 ; les crédits des packs expirent comme indiqué lors de l’achat.
          </P>
          <P>
            <strong>9.2</strong> Les prestations réalisées pour votre compte (par exemple contenus, audits, services GEO/AEO) sont régies par la description, le prix et les conditions de livraison affichés au moment de la commande et, le cas échéant, par un cahier des charges (statement of work) distinct. Le travail commençant dès la commande, les frais de prestation ne sont plus remboursables une fois le travail commencé, sauf en cas de défaut de livraison de notre part.
          </P>
        </section>

        <section>
          <H2 id="data">10. Vos données, protection de la vie privée et comptes connectés</H2>
          <P>
            <strong>10.1</strong> Les traitements de données personnelles que nous effectuons sont décrits dans la{" "}
            <a href="/fr/privacy" className={link}>Politique de confidentialité</a>. Lorsque nous traitons des données personnelles pour votre compte (par exemple dans les rapports que vous générez), nous agissons en qualité de sous-traitant ; nos conditions de traitement des données (art. 28 du RGPD) et la liste à jour de nos sous-traitants ultérieurs sont disponibles sur{" "}
            <a href="/fr/privacy#subprocessors" className={link}>geotoolbox.ai/fr/privacy</a> et, sur demande, sous forme signée.
          </P>
          <P>
            <strong>10.2 Vos données.</strong> Vous conservez tous les droits sur les données, marques, prompts et contenus que vous soumettez (les « <strong>Données Client</strong> »). Vous nous concédez une licence non exclusive pour héberger, traiter et afficher les Données Client afin de fournir, de sécuriser et d’améliorer le Service. Nous pouvons utiliser des données d’utilisation agrégées et dé-identifiées (par exemple des statistiques de citations par moteur) qui ne permettent pas de vous identifier, ni d’identifier vos clients.
          </P>
          <P>
            <strong>10.3 Comptes connectés.</strong> Si vous connectez Google Search Console ou Google Analytics, vous autorisez un accès en lecture seule dans la limite des autorisations (scopes) affichées lors de la connexion et garantissez être en droit de l’accorder. Vous pouvez les déconnecter à tout moment.
          </P>
          <P>
            <strong>10.4 Conservation et export.</strong> Les résultats d’analyse sont conservés comme décrit dans la Politique de confidentialité. Après la fin du Contrat, vous pouvez exporter vos données pendant 30 jours, après quoi nous pouvons les supprimer (les documents de facturation sont conservés conformément aux obligations légales).
          </P>
          <P>
            <strong>10.5 Confidentialité.</strong>{" "}Chaque partie préserve la confidentialité des informations non publiques de l’autre partie et ne les utilise que pour exécuter le Contrat, pendant sa durée et trois ans après, à l’exception des informations qui sont ou deviennent publiques sans manquement, qui étaient déjà légitimement connues de la partie destinataire ou développées de manière indépendante par celle-ci, ou dont la divulgation est exigée par la loi (avec notification préalable lorsque celle-ci est permise).
          </P>
        </section>

        <section>
          <H2 id="ip">11. Propriété intellectuelle et licence</H2>
          <P>
            <strong>11.1</strong>{" "}Le Service, ses logiciels, sa méthodologie, ses systèmes de notation (scoring), ses bases de données, ses designs et ses contenus nous appartiennent ou appartiennent à nos concédants et sont protégés par les lois relatives à la propriété intellectuelle. Nous vous concédons une licence limitée, non exclusive et non transférable (révocable uniquement dans les conditions du §18) d’accès et d’utilisation du Service, ainsi que d’utilisation des rapports et résultats que vous générez pour votre propre activité ou celle de vos clients, pendant la durée du Contrat et dans les limites de votre formule.
          </P>
          <P>
            <strong>11.2 Les rapports en marque blanche</strong> (lorsqu’ils sont inclus dans votre formule) peuvent être présentés sous votre marque à vos clients ; vous demeurez responsable de leur utilisation et de toute affirmation que vous formulez sur leur fondement.
          </P>
          <P>
            <strong>11.3 Les retours (feedback)</strong> que vous nous communiquez peuvent être librement utilisés par nous, sans obligation de notre part.
          </P>
          <P>
            <strong>11.4 Marques.</strong>{" "}« GEO Toolbox » et nos logos sont nos marques. Les marques de tiers (y compris les noms de moteurs d’IA) appartiennent à leurs titulaires et ne sont utilisées qu’à des fins d’identification ; nous ne leur sommes pas affiliés et ils ne nous cautionnent pas.
          </P>
        </section>

        <section>
          <H2 id="acceptable-use">12. Utilisation acceptable</H2>
          <P>Vous vous engagez à ne pas, et à ne pas permettre à des tiers de :</P>
          <UL>
            <li>utiliser le Service de manière illicite, ou en violation des droits de tiers ou des conditions de tout service connecté ou moteur d’IA ;</li>
            <li>tenter d’accéder sans autorisation au Service, à d’autres comptes ou à notre infrastructure, ou en sonder, scanner ou tester la vulnérabilité sans notre accord écrit ;</li>
            <li>entraver ou perturber le Service, ou contourner les limites des formules, le décompte des crédits, les limites de débit (rate limits) ou les contrôles de sécurité ;</li>
            <li>aspirer (scraping), explorer (crawling) ou extraire en masse le Service ou ses données autrement que par les fonctionnalités que nous fournissons, ou recourir à des moyens automatisés au-delà de l’usage prévu ;</li>
            <li>revendre, sous-licencier ou louer le Service, partager des identifiants d’accès à celui-ci ou le proposer en tant que bureau de services (service bureau), ou redistribuer nos données ou rapports autrement que dans les conditions permises par le §11 ;</li>
            <li>procéder à l’ingénierie inverse du Service ou le copier, ou développer un produit concurrent en utilisant l’accès à celui-ci ;</li>
            <li>téléverser du code malveillant, ou soumettre des contenus illicites, diffamatoires ou contrefaisants ;</li>
            <li>fournir de fausses informations sur votre identité, créer plusieurs comptes pour obtenir des essais ou des crédits à répétition, ou utiliser un moyen de paiement que vous n’êtes pas autorisé à utiliser.</li>
          </UL>
        </section>

        <section>
          <H2 id="third-party">13. Services tiers et résultats générés par l’IA</H2>
          <P>
            <strong>13.1</strong> Le Service interroge et analyse des moteurs d’IA et des fournisseurs de données tiers. Leur disponibilité, leur comportement, leurs résultats et leurs conditions évoluent fréquemment et échappent à notre contrôle. <strong>Les réponses des moteurs d’IA sont non déterministes</strong> : les résultats varient selon les exécutions, les régions, les comptes et les dates. Nous ne garantissons pas qu’un moteur vous mentionnera ou vous citera, que les scores ou estimations de visibilité sont exacts ou complets, ni qu’une recommandation produira un résultat particulier.
          </P>
          <P>
            <strong>13.2</strong> Les résultats (scores, rapports, briefs, contenus générés, recommandations) sont des outils d’information destinés à des professionnels, et non des conseils professionnels, juridiques, financiers ou marketing. Il vous appartient d’examiner les résultats avant de vous y fier ou de les publier.
          </P>
          <P>
            <strong>13.3</strong> Si un fournisseur tiers retire ou restreint l’accès, nous pouvons remplacer, modifier ou supprimer la fonctionnalité concernée, immédiatement lorsque le fournisseur ne laisse aucune alternative ; si cela réduit de manière substantielle une formule payante, vous pouvez résilier et nous remboursons la partie non utilisée de la période en cours (§18.4).
          </P>
        </section>

        <section>
          <H2 id="availability">14. Disponibilité, évolutions et fonctionnalités bêta</H2>
          <P>
            <strong>14.1</strong> Nous visons une haute disponibilité mais ne garantissons pas un fonctionnement ininterrompu ou exempt d’erreurs. La maintenance, les mises à jour et les pannes de tiers peuvent entraîner des interruptions. Les crédits ne sont pas consommés pour les analyses (scans) qui échouent de notre fait.
          </P>
          <P>
            <strong>14.2</strong> Les fonctionnalités signalées comme bêta, préversion (preview), expérimentales ou de nature similaire sont fournies en l’état, peuvent être modifiées ou retirées sans préavis et sont exclues de tout engagement de disponibilité.
          </P>
        </section>

        <section>
          <H2 id="warranties">15. Exclusion de garanties</H2>
          <P>
            Dans toute la mesure permise par la loi, le Service est fourni <strong>« en l’état » et « selon disponibilité »</strong>, sans garantie d’aucune sorte, expresse ou implicite, notamment de qualité marchande, d’adéquation à un usage particulier, d’exactitude, d’absence de contrefaçon, ni que le Service répondra à vos besoins ou permettra d’atteindre un quelconque résultat. Aucune disposition des présentes Conditions n’exclut les garanties ou droits qui ne peuvent être exclus en vertu de la loi applicable.
          </P>
        </section>

        <section>
          <H2 id="liability">16. Limitation de responsabilité</H2>
          <P>
            <strong>16.1 Exclusions.</strong> Dans toute la mesure permise par la loi, nous ne sommes pas responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs, ni des pertes de bénéfices, de chiffre d’affaires, d’activité, de clientèle, de données ou d’économies escomptées, ni des décisions prises sur la base des résultats (§13), quelle qu’en soit la cause.
          </P>
          <P>
            <strong>16.2 Plafond.</strong> Notre responsabilité totale cumulée découlant du Contrat ou en lien avec celui-ci, sur toute période de 12 mois, est limitée <strong>aux frais que vous nous avez versés pour le Service au cours des 12 mois précédant le fait générateur de la réclamation</strong> (ou à 100 € si vous n’avez rien payé).
          </P>
          <P>
            <strong>16.3 Exceptions.</strong> Aucune disposition ne limite la responsabilité en cas de décès ou de dommage corporel causé par une négligence, en cas de fraude ou de faute intentionnelle (dol), en cas de faute lourde dans la mesure où elle ne peut être limitée en droit français, ni aucune autre responsabilité qui ne peut être limitée par la loi. Si vous êtes un consommateur, les §16.1 et 16.2 ne vous sont pas applicables et notre responsabilité est régie par les dispositions légales impératives.
          </P>
        </section>

        <section>
          <H2 id="indemnity">17. Garantie et indemnisation</H2>
          <P>
            Si vous êtes un client professionnel, vous assurerez notre défense et nous garantirez contre les réclamations de tiers, ainsi que les frais y afférents (y compris des honoraires d’avocat raisonnables), découlant de vos Données Client, de votre utilisation du Service en violation du Contrat ou de la loi, de vos rapports en marque blanche, ou des affirmations que vous faites à vos clients sur la base des résultats — à condition que nous vous notifiions rapidement la réclamation, que nous vous laissions la direction de la défense et de toute transaction (aucune transaction comportant une reconnaissance de faute de notre part sans notre accord), et que nous coopérions raisonnablement, à vos frais.
          </P>
        </section>

        <section>
          <H2 id="term">18. Durée, suspension et résiliation</H2>
          <P>
            <strong>18.1 Durée.</strong> Le Contrat prend effet lors de la création de votre compte et se poursuit jusqu’à sa résiliation. Les abonnements courent par périodes successives conformément au §6.1.
          </P>
          <P>
            <strong>18.2 Suspension.</strong> Nous pouvons suspendre l’accès, en tout ou partie, après notification lorsque cela est possible, si : un paiement est en retard ; nous avons des motifs raisonnables de croire à un risque de sécurité, à un abus ou à un manquement au §12 ; la loi ou un fournisseur tiers l’exige ; ou une rétrofacturation est en cours (§8.5).
          </P>
          <P>
            <strong>18.3 Résiliation pour manquement.</strong> Chaque partie peut résilier le Contrat si l’autre partie commet un manquement substantiel et n’y remédie pas dans les 15 jours suivant une notification (immédiatement en cas de manquement au §12 ou de défaut de paiement persistant après relance). En cas de résiliation pour manquement de votre part, les frais de la période en cours restent dus et ne sont pas remboursés.
          </P>
          <P>
            <strong>18.4 Résiliation par nous pour convenance ou arrêt du Service.</strong>{" "}Nous pouvons résilier le Contrat ou cesser de fournir le Service moyennant un préavis d’au moins 30 jours par e-mail. Dans ce cas, nous rembourserons les frais payés d’avance pour la partie non utilisée de votre période alors en cours.
          </P>
          <P>
            <strong>18.5 Effets.</strong> À la résiliation, votre licence prend fin ; le §10.4 régit l’export et la suppression des données ; les §§8, 10.5, 11, 15 à 17, 20 et 21 survivent à la fin du Contrat.
          </P>
        </section>

        <section>
          <H2 id="changes">19. Modification des présentes Conditions</H2>
          <P>
            Nous pouvons mettre à jour les présentes Conditions à mesure que le Service et la loi évoluent. La version en vigueur, son numéro et sa date figurent toujours en haut de cette page, et les versions antérieures sont disponibles sur demande. Pour les <strong>modifications substantielles</strong> qui réduisent vos droits, nous vous donnerons un préavis d’au moins <strong>30 jours</strong> par e-mail ou dans l’application avant leur entrée en vigueur pour les clients existants ; vous pouvez résilier avant la date d’effet si vous ne les acceptez pas, et nous rembourserons dans ce cas les frais payés d’avance pour la période postérieure à la résiliation. Les modifications non substantielles (clarifications, nouvelles fonctionnalités, références juridiques) s’appliquent dès leur publication. La poursuite de l’utilisation après la date d’effet vaut acceptation.
          </P>
        </section>

        <section>
          <H2 id="law">20. Droit applicable et litiges</H2>
          <P>
            <strong>20.1 Droit applicable.</strong> Le Contrat est régi par le droit français, à l’exclusion de ses règles de conflit de lois et de la Convention des Nations unies sur les contrats de vente internationale de marchandises.
          </P>
          <p className="mt-2 rounded border border-gray-300 bg-white p-3 font-semibold uppercase tracking-wide text-gray-900">
            20.2 Tribunal compétent (clients professionnels). Tout litige né du Contrat ou en lien avec celui-ci qui n’est pas résolu à l’amiable dans les 30 jours suivant une notification écrite sera soumis à la compétence exclusive des tribunaux compétents de Paris, France, y compris en cas de procédure impliquant plusieurs parties, nonobstant toute autre clause attributive de juridiction. Rien n’empêche l’une ou l’autre partie de solliciter à tout moment des mesures urgentes ou provisoires. Pour les clients établis en France, la présente clause ne s’applique que dans la mesure permise par le Code de procédure civile (article 48) ; à défaut, la juridiction compétente est déterminée conformément à ce code.
          </p>
          <P>
            <strong>20.3 Contactez-nous d’abord.</strong> Veuillez nous contacter avant d’engager toute procédure ; nous résolvons presque tous les problèmes par e-mail.
          </P>
          <P>
            <strong>20.4 Consommateurs.</strong> Si vous êtes un consommateur, le §20.2 ne s’applique pas : vous bénéficiez des règles impératives de protection des consommateurs de votre pays de résidence et pouvez saisir les tribunaux de ce pays. Les consommateurs français peuvent également recourir gratuitement à la médiation de la consommation (Code de la consommation, articles L612-1 et suivants) après nous avoir préalablement contactés par écrit ; le médiateur de la consommation est en cours de désignation et sera indiqué ici et sur <a href="/fr/legal" className={link}>geotoolbox.ai/fr/legal</a>. La plateforme européenne de règlement en ligne des litiges a été supprimée le 20 juillet 2025.
          </P>
        </section>

        <section>
          <H2 id="general">21. Dispositions générales</H2>
          <P><strong>21.1 Intégralité de l’accord.</strong> Le Contrat constitue l’intégralité de l’accord entre nous sur son objet et remplace les conditions antérieures ; si vous avez signé avec nous un contrat écrit distinct, celui-ci prévaut sur les présentes Conditions en cas de contradiction.</P>
          <P><strong>21.2 Cession.</strong> Vous ne pouvez pas céder le Contrat sans notre accord. Nous pouvons le céder à un successeur de notre activité, moyennant notification.</P>
          <P><strong>21.3 Force majeure.</strong> Aucune partie n’est responsable d’un retard ou d’une défaillance causé par des événements échappant à son contrôle raisonnable (notamment les pannes de plateformes tierces, les défaillances de réseau et les actes des autorités), à l’exception des obligations de paiement.</P>
          <P><strong>21.4 Divisibilité ; renonciation.</strong> Si une disposition est jugée inapplicable, elle est limitée dans la mesure minimale nécessaire et le reste demeure en vigueur. Le fait de ne pas se prévaloir d’une disposition ne vaut pas renonciation.</P>
          <P><strong>21.5 Notifications.</strong> Nous pouvons vous adresser des notifications par e-mail à l’adresse de votre compte ou dans l’application ; nos notifications sont réputées reçues le jour ouvré suivant leur envoi. Vous nous adressez vos notifications à <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> ; vos notifications (y compris les résiliations et les annulations) prennent effet lorsqu’elles parviennent à notre serveur de messagerie.</P>
          <P><strong>21.6 Langue.</strong> Les présentes Conditions sont rédigées en anglais. Les traductions sont fournies pour votre commodité ; lorsqu’une traduction est exigée par des dispositions impératives au bénéfice des consommateurs, cette traduction s’applique à ces consommateurs, et à défaut, la version anglaise prévaut.</P>
          <P><strong>21.7 Délai pour agir ; sanctions.</strong> Pour les clients professionnels, toute action découlant du Contrat doit être engagée dans un délai d’un an à compter du fait qui lui a donné naissance. Vous déclarez ne pas faire l’objet de sanctions ou de restrictions à l’exportation qui nous interdiraient de vous fournir le Service.</P>
          <P><strong>21.8 Enregistrements.</strong> Nous conservons une trace de votre acceptation des présentes Conditions (version, horodatage, adresse IP, formule et prix communiqué) et des communications relatives à la facturation, et pouvons l’utiliser comme preuve.</P>
        </section>

        <section>
          <H2 id="contact">22. Contact</H2>
          <P>
            Questions relatives aux présentes Conditions, à la facturation ou à la résiliation :{" "}
            <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>. Mentions légales :{" "}
            <a href="/fr/legal" className={link}>geotoolbox.ai/fr/legal</a>.
          </P>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <H2 id="annex-a">Annexe A — Textes légaux français (consommateurs et non-professionnels uniquement)</H2>
          <P>
            Les articles suivants du Code de la consommation sont reproduits intégralement, comme l’exige l’article L215-4 de ce code. Ils ne s’appliquent qu’aux contrats conclus avec des consommateurs et des non-professionnels au sens du droit français (une personne physique agissant à des fins qui n’entrent pas dans le cadre de son activité commerciale, industrielle, artisanale ou libérale ; ou une personne morale qui n’agit pas à des fins professionnelles). Ils ne s’appliquent pas aux clients professionnels (§2.2). Texte en vigueur au 15 août 2026 (source : legifrance.gouv.fr).
          </P>
          <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
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
          <H2 id="annex-b">Annexe B — Modèle de formulaire de rétractation (consommateurs uniquement)</H2>
          <P>Veuillez compléter et renvoyer le présent formulaire uniquement si vous êtes un consommateur et souhaitez vous rétracter du contrat (§8.6).</P>
          <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <p>À l’attention de Samy Ben Sadok (GEO Toolbox), 1 esplanade de Chantilly, 93330 Neuilly-sur-Marne, France — samy@geotoolbox.ai :</p>
            <p className="mt-2">Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat pour la prestation de services ci-dessous : abonnement GEO Toolbox, formule ______________</p>
            <p className="mt-2">Commandé le (*) / reçu le (*) : ______________</p>
            <p className="mt-2">Nom du (des) consommateur(s) : ______________</p>
            <p className="mt-2">Adresse du (des) consommateur(s) : ______________</p>
            <p className="mt-2">E-mail du compte : ______________</p>
            <p className="mt-2">Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) : ______________</p>
            <p className="mt-2">Date : ______________</p>
            <p className="mt-2 text-gray-500">(*) Rayez la mention inutile.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
