import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { siteConfig } from "@/lib/config"

// SG_CONSENT_V1 legal closure (2026-07-28) — French privacy policy for the FR
// funnel (CNIL expects consent/privacy information in the visitor's language).
// Reached ONLY as /fr/privacy: the middleware matcher routes /fr/:path* through
// next-intl into this [locale] tree; bare /privacy (one segment, outside the
// middleware matcher) resolves only to the (marketing)/privacy EN page, so the
// two routes cannot collide. locale="en" here 404s defensively rather than
// duplicating the EN page. Content mirrors the EN policy section-for-section;
// the note at the top states the EN version prevails on any divergence.

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (locale !== "fr") return {}
  return {
    title: "Politique de confidentialité",
    description: "Comment GEO Toolbox collecte, utilise et protège vos données.",
    alternates: {
      canonical: `${siteConfig.url}/fr/privacy`,
      languages: {
        en: `${siteConfig.url}/privacy`,
        fr: `${siteConfig.url}/fr/privacy`,
        "x-default": `${siteConfig.url}/privacy`,
      },
    },
  }
}

export default async function PrivacyPageFr({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== "fr") notFound()
  setRequestLocale(locale)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-gray-600">Dernière mise à jour : 15 août 2026</p>
      <p className="mt-2 text-xs text-gray-500">
        Cette traduction est fournie à titre de commodité. En cas de divergence, la{" "}
        <a href="/privacy" className="underline">version anglaise</a> prévaut.
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Les données que nous collectons</h2>
          <p className="mt-2">
            Lorsque vous vous connectez avec Google, nous recevons votre <strong>nom</strong>, votre <strong>adresse e-mail</strong> et votre <strong>photo de profil</strong> depuis votre compte Google.
          </p>
          <p className="mt-3">
            Si vous connectez Google Search Console, nous accédons à la liste de vos propriétés GSC et à vos <strong>données de performance de recherche</strong> (requêtes, clics, impressions, position moyenne, pays, appareil, page, date) pour les sites que vous autorisez, via le scope <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">https://www.googleapis.com/auth/webmasters.readonly</code>.
          </p>
          <p className="mt-3">
            Si vous connectez Google Analytics 4, nous accédons à la liste de vos propriétés GA4 et à vos <strong>métriques de trafic</strong> (sessions, utilisateurs, taux d&rsquo;engagement, conversions, pages d&rsquo;atterrissage, sources) via le scope <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">https://www.googleapis.com/auth/analytics.readonly</code>. Nous les utilisons pour identifier le trafic issu des moteurs de recherche IA (ChatGPT, Gemini, Claude, Perplexity, NotebookLM).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Comment nous utilisons vos données</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Pour vous authentifier et afficher les informations de votre compte</li>
            <li>Pour afficher vos données Google Search Console et Google Analytics 4 dans le tableau de bord GEO Toolbox</li>
            <li>Pour générer des rapports de visibilité IA pour vos domaines</li>
          </ul>
          <p className="mt-3">
            <strong>L&rsquo;utilisation des données utilisateur Google est strictement limitée aux finalités listées ci-dessus.</strong> Nous n&rsquo;utilisons pas les données utilisateur Google pour développer, améliorer ou entraîner des modèles d&rsquo;IA ou d&rsquo;apprentissage automatique généralisés. Nous ne transférons pas les données utilisateur Google à des tiers, sauf lorsque cela est nécessaire pour fournir ou améliorer le Service, ou lorsque la loi l&rsquo;exige. Notre traitement des données utilisateur Google est conforme à la <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-accent-700 underline hover:text-accent-800">Google API Services User Data Policy</a>, y compris ses exigences d&rsquo;utilisation limitée (Limited Use).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Stockage et conservation des données</h2>
          <p className="mt-2">
            <strong>Nous ne stockons pas vos données brutes Google Search Console ou Google Analytics 4 sur nos serveurs.</strong> Toutes les réponses des API GSC et GA4 sont mises en cache dans le localStorage de votre navigateur pendant 6 heures au maximum, puis automatiquement effacées. Vider le stockage de votre navigateur les supprime immédiatement.
          </p>
          <p className="mt-3">Le stockage côté serveur se limite à :</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Vos jetons OAuth (accès et rafraîchissement), chiffrés au repos, conservés jusqu&rsquo;à ce que vous déconnectiez l&rsquo;intégration concernée ou révoquiez l&rsquo;accès Google</li>
            <li>Les identifiants de vos propriétés GSC et GA4 connectées</li>
            <li>Les journaux d&rsquo;authentification (tentatives de connexion, cookies de session) — purgés automatiquement sous 7 jours d&rsquo;inactivité</li>
            <li>Le cache de récupération de pages (HTML rendu que nous récupérons pour analyse en votre nom) — conservé jusqu&rsquo;à 24 heures, puis remplacé à la récupération suivante</li>
            <li>Les résultats d&rsquo;analyse que vous générez (rapports de scan, aperçus de domaine, vérifications agent-readiness, briefs de contenu, analyses de citabilité, scans concurrents, exports AI-ready, suivi de visibilité IA) — <strong>conservés sans limite de durée</strong> afin que vous et votre équipe puissiez comparer les performances dans le temps. Votre forfait détermine la fenêtre d&rsquo;historique visible dans le tableau de bord (par exemple 180 jours pour <strong>Starter</strong>) : les formules inférieures affichent une fenêtre limitée, tandis que les formules supérieures affichent l&rsquo;intégralité de votre historique. Les données plus anciennes ne sont pas affichées mais ne sont ni modifiées ni supprimées tant que votre compte est actif.</li>
            <li>Des journaux internes de coûts et d&rsquo;audit pour la supervision de notre infrastructure, sans donnée personnelle au-delà d&rsquo;un identifiant de compte pseudonymisé</li>
            <li>La télémétrie d&rsquo;erreurs (anonymisée, sans donnée personnelle) pendant 90 jours au maximum</li>
            <li>Données de facturation et de contrat &mdash; votre acceptation des <a href="/terms" className="text-accent-700 underline hover:text-accent-800">Conditions générales</a> (version, horodatage, adresse IP, formule et prix affichés au paiement), identifiants client/abonnement Stripe, et copies des communications de facturation que nous vous envoyons (confirmation d&apos;essai, rappels, confirmations de résiliation). Conservées pendant la durée du compte plus 5 ans (prescription contractuelle) ; les factures sont conservées 10 ans conformément au Code de commerce. Ces données servent à traiter les questions de facturation et les litiges de paiement.</li>
          </ul>
          <p className="mt-3">
            <strong>Droit à l&rsquo;effacement.</strong> Vous pouvez supprimer l&rsquo;ensemble de vos données à tout moment en supprimant votre compte ou en écrivant à{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>. Nous traitons la suppression complète du compte sous 14 jours. Retirer une marque suivie de votre tableau de bord la supprime immédiatement (suppression logique), ainsi que sa liste de suivi.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Partage des données</h2>
          <p className="mt-2">
            Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers à des fins marketing. Nous faisons appel aux sous-traitants suivants pour exploiter le Service :
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Google OAuth : authentification</li>
            <li>API Google Search Console : données de performance de recherche</li>
            <li>API Google Analytics Data : données de trafic IA</li>
            <li>Google Analytics 4 : statistiques d&rsquo;usage agrégées de notre site</li>
            <li>Microsoft Clarity : statistiques d&rsquo;usage agrégées de notre site (cartes de chaleur et relecture de session avec masquage des textes sensibles et des champs)</li>
            <li>Stripe : traitement des paiements (nous ne stockons jamais les numéros de carte)</li>
            <li>Resend : envoi d&rsquo;e-mails transactionnels (vérification, liens magiques, récapitulatifs)</li>
            <li>Vercel : hébergement de l&rsquo;application</li>
            <li>Replit : hébergement de l&rsquo;application (backend PHP)</li>
            <li>Neon : hébergement de la base de données PostgreSQL</li>
            <li>Sentry : supervision des erreurs (aucune donnée personnelle transmise)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Vos droits</h2>
          <p className="mt-2">Vous pouvez :</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Révoquer à tout moment l&rsquo;accès de GEO Toolbox à votre compte Google sur <a href="https://myaccount.google.com/permissions" className="text-accent-700 underline hover:text-accent-800">https://myaccount.google.com/permissions</a></li>
            <li>Déconnecter GSC ou GA4 depuis l&rsquo;onglet Analytics de l&rsquo;application (lien « disconnect » sous le badge du compte connecté)</li>
            <li>Demander la suppression de toutes les données côté serveur en écrivant à <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a> ; nous répondons sous 14 jours</li>
            <li>Effacer les données mises en cache localement en vidant le stockage de votre navigateur</li>
          </ul>
          <p className="mt-3">
            Si vous vous trouvez dans l&rsquo;Espace économique européen, au Royaume-Uni ou en Suisse, vous disposez en outre des droits d&rsquo;<strong>accès</strong>, de <strong>rectification</strong>, d&rsquo;<strong>effacement</strong>, de <strong>limitation du traitement</strong>, de <strong>portabilité</strong> et d&rsquo;<strong>opposition</strong> prévus par le RGPD (articles 15 à 21), ainsi que du droit de <strong>retirer votre consentement à tout moment</strong>, sans que cela affecte la licéité du traitement antérieur. Pour exercer ces droits, écrivez à{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>. Vous avez également le droit d&rsquo;introduire une réclamation auprès de votre autorité de contrôle — en France, la CNIL (<a href="https://www.cnil.fr" className="text-accent-700 underline hover:text-accent-800">cnil.fr</a>).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Cookies et consentement</h2>
          <p className="mt-2">
            Nous utilisons des <strong>cookies strictement nécessaires</strong> pour la gestion de session, la sécurité (protection CSRF) et la mémorisation de votre choix en matière de cookies. Ils sont toujours actifs et ne requièrent pas de consentement.
          </p>
          <p className="mt-3">
            Nous utilisons également les cookies de mesure d&rsquo;audience décrits ci-dessous ; lorsque la réglementation applicable exige votre consentement — notamment pour les visiteurs de l&rsquo;EEE, du Royaume-Uni et de la Suisse — ces outils ne sont activés qu&rsquo;après votre acceptation du bandeau. Ils sont déposés par <strong>Google Analytics 4</strong> (trafic agrégé, pages vues, type d&rsquo;appareil, localisation approximative) et <strong>Microsoft Clarity</strong>{" "}(schémas d&rsquo;interaction agrégés, y compris cartes de chaleur et relectures de session masquant les textes sensibles et les champs de formulaire). Aucun de ces outils n&rsquo;est utilisé à des fins publicitaires ni de suivi inter-sites.
          </p>
          <p className="mt-3">
            Si vous nous rendez visite depuis l&rsquo;EEE, le Royaume-Uni ou la Suisse, <strong>aucun outil de mesure d&rsquo;audience ne s&rsquo;exécute avant votre acceptation</strong> du bandeau de consentement. Vous pouvez refuser en un clic (choix mémorisé 6 mois / 180 jours ; l&rsquo;acceptation est mémorisée 12 mois / 365 jours) et changer d&rsquo;avis à tout moment via le lien <strong>Paramètres des cookies</strong> en pied de page du site, le lien <strong>Cookie settings</strong> de la page Compte de l&rsquo;application, ou en supprimant le cookie <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">sg_consent</code>. Nous déposons aussi un cookie de courte durée <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">sg_cc</code> contenant uniquement votre code pays (ou la valeur <code className="px-1 py-0.5 rounded bg-gray-100 text-[13px]">unknown</code>{" "}s&rsquo;il ne peut être déterminé), servant à déterminer si le bandeau s&rsquo;applique ; il ne contient aucun identifiant.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Transferts internationaux de données</h2>
          <p className="mt-2">
            Nous sommes établis dans l&rsquo;Union européenne, et plusieurs des sous-traitants listés à la section 4 (dont Google, Microsoft, Vercel, Neon, Stripe et Sentry) traitent des données aux États-Unis. Lorsque des données personnelles de résidents de l&rsquo;EEE, du Royaume-Uni ou de la Suisse sont transférées vers les États-Unis, nous nous appuyons sur le <strong>cadre de protection des données UE&ndash;États-Unis</strong> (EU&ndash;U.S. Data Privacy Framework, et ses extensions britannique et suisse) lorsque le prestataire dispose d&rsquo;une certification active, et sur les <strong>clauses contractuelles types</strong>{" "}de la Commission européenne intégrées à l&rsquo;accord de traitement des données du prestataire dans les autres cas. Les données de mesure d&rsquo;audience (Google Analytics, Microsoft Clarity) ne sont traitées, pour les visiteurs de l&rsquo;EEE, du Royaume-Uni et de la Suisse, qu&rsquo;après consentement explicite (voir la section 6).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Contact</h2>
          <p className="mt-2">
            Pour toute question relative à la confidentialité ou demande de suppression de données, écrivez à{" "}
            <a href="mailto:samy@geotoolbox.ai" className="text-accent-700 underline hover:text-accent-800">samy@geotoolbox.ai</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
