// components/legal/refund-policy-fr.tsx
// Native French Cancellation & Refund Policy body for /fr/refund-policy. Mirrors
// components/legal/refund-policy-content.tsx (EN) section for section; the note at the top
// states the EN version prevails. Must stay consistent with Terms §5–§8.
import { TERMS_UPDATED } from "@/components/legal/terms-content"

const link = "text-accent-700 underline hover:text-accent-800"

export function RefundPolicyFr() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Politique de résiliation et de remboursement</h1>
      <p className="mt-2 text-sm text-gray-600">Dernière mise à jour&nbsp;: {TERMS_UPDATED} · Fait partie de nos <a href="/fr/terms" className={link}>Conditions générales</a> (§5–§8)</p>
      <p className="mt-2 text-xs text-gray-500">
        Cette traduction est fournie pour votre commodité. En cas de divergence, la{" "}
        <a href="/refund-policy" className="underline">version anglaise</a> prévaut, sauf lorsque des dispositions impératives exigent une traduction au bénéfice des consommateurs&nbsp;; dans ce cas, cette traduction s’applique à ces consommateurs (§21.6 des Conditions générales).
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Fonctionnement des abonnements</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Les formules payantes sont des <strong>abonnements reconduits automatiquement</strong>, mensuels ou annuels, jusqu’à ce que vous les résiliiez. La carte enregistrée est débitée au début de chaque période. Les formules annuelles sont facturées en totalité, à l’avance.</li>
            <li>Un <strong>essai gratuit</strong> nécessite une carte et <strong>se convertit automatiquement</strong> en abonnement payant à la formule et selon la périodicité de facturation que vous avez choisies, à la date de fin d’essai indiquée lors du paiement, sauf si vous l’annulez avant cette date. Nous vous envoyons un e-mail au début de l’essai (avec le montant et la date du premier débit), puis un autre avant le débit.</li>
            <li>Les prix s’entendent hors TVA et autres taxes sur les ventes, qui sont ajoutées lors du paiement le cas échéant.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Comment résilier un abonnement ou annuler un essai</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Connectez-vous et ouvrez <strong>Account → Manage subscription</strong> (Compte → Gérer l’abonnement), ce qui ouvre le portail client Stripe.</li>
            <li>Choisissez <strong>Cancel subscription</strong> (Résilier l’abonnement) et confirmez. Vous recevez un e-mail de confirmation indiquant la date de fin.</li>
            <li>Vous pouvez également envoyer un e-mail à <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a> depuis l’adresse du titulaire du compte, au plus tard la veille de la date de renouvellement (ou avant la date et l’heure de fin de l’essai) indiquée dans votre compte et dans nos e-mails.</li>
          </ol>
          <p className="mt-2">La résiliation d’un abonnement payant prend effet à la fin de la période en cours, et vous conservez l’accès jusqu’à cette date. L’annulation d’un essai gratuit commencé à compter du 27&nbsp;octobre 2026 (version 2.1 des Conditions générales) y met fin immédiatement&nbsp;: l’accès cesse aussitôt et rien n’est facturé&nbsp;; un essai antérieur conserve l’accès jusqu’à sa date de fin. Révoquer l’accès Google ou supprimer les cookies de l’application ne résilie <em>pas</em> un abonnement.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Remboursements</h2>
          <p className="mt-2"><strong>Les frais ne sont pas remboursables.</strong> Nous ne remboursons pas&nbsp;:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>un essai converti en abonnement faute d’avoir été annulé avant son terme (mensuel ou annuel)&nbsp;;</li>
            <li>un renouvellement intervenu faute de résiliation avant la date de renouvellement&nbsp;;</li>
            <li>la durée non utilisée après une résiliation ou un passage à une formule inférieure, ni les crédits, sièges (seats), marques ou prompts non utilisés&nbsp;;</li>
            <li>les périodes pendant lesquelles vous ne vous êtes pas connecté et n’avez pas utilisé le Service&nbsp;;</li>
            <li>l’insatisfaction quant aux résultats, classements ou citations des moteurs d’IA, qui échappent à notre contrôle.</li>
          </ul>
          <p className="mt-2">Nous corrigeons <strong>en revanche</strong> nos propres erreurs de facturation (montant erroné, double débit, débit intervenu après confirmation d’une résiliation ou d’une annulation)&nbsp;; merci de nous les signaler sans tarder. Si <em>nous</em> résilions votre abonnement pour convenance, cessons de fournir le Service ou si une modification imputable à un tiers réduit de manière substantielle votre formule, nous remboursons la partie non utilisée de la période en cours (Conditions générales, §13.3, §18.4, §19). Les droits légaux des consommateurs sont décrits ci-dessous. Nous pouvons également accorder un remboursement à titre de geste commercial, à notre seule discrétion&nbsp;; cela ne crée aucune obligation.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Si vous estimez qu’un débit est erroné</h2>
          <p className="mt-2">Écrivez-nous d’abord à <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>&nbsp;: la plupart des problèmes sont résolus sous deux jours ouvrés. Vous conservez toujours le droit de contacter votre banque&nbsp;; toutefois, pour un débit effectué conformément aux Conditions générales (conversion d’essai ou renouvellement dûment annoncés), nous fournirons à la banque la preuve de votre acceptation, les informations affichées lors du paiement, les e-mails de confirmation et de rappel ainsi que votre utilisation du Service&nbsp;; le compte peut être suspendu pendant la durée du litige et, si une rétrofacturation (chargeback) aboutit contre un débit valide, le montant reste dû (Conditions générales, §8.5).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Droits légaux des consommateurs</h2>
          <p className="mt-2">GEO Toolbox est un outil professionnel et vous confirmez un usage professionnel lors de votre souscription. Si vous avez néanmoins la qualité de <em>consommateur</em> au sens des dispositions impératives du droit de votre pays (par exemple dans l’UE ou au Royaume-Uni), vous conservez les droits que cette loi vous accorde, notamment un droit de rétractation de 14&nbsp;jours à compter du jour de votre souscription (y compris le début d’un essai), moyennant le paiement de la part du service déjà fournie. Voir le <a href="/fr/terms#refunds" className={link}>§8.6 des Conditions générales</a> et le modèle de formulaire de rétractation figurant à l’Annexe B des Conditions générales.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
          <p className="mt-2">Questions de facturation et résiliations&nbsp;: <a href="mailto:samy@geotoolbox.ai" className={link}>samy@geotoolbox.ai</a>.</p>
        </section>
      </div>
    </div>
  )
}
