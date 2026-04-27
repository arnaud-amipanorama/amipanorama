import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité d'AMI Panorama — traitement des données personnelles, droits des utilisateurs, RGPD.",
  robots: { index: false, follow: false },
};

const sections = [
  {
    title: "1. Responsable du traitement",
    paras: [
      "Le responsable du traitement des données personnelles collectées via le site amipanorama.com est :",
      "AMI PANORAMA — SAS, 2 rue Wimpheling, 67000 Strasbourg, France",
      "Contact : info@amipanorama.com",
    ],
  },
  {
    title: "2. Données collectées",
    paras: [
      "Dans le cadre de l'utilisation du site et de ses formulaires de contact, AMI Panorama est susceptible de collecter les données suivantes :",
      "– Nom, prénom et qualité (directeur pédagogique, référent mobilité, etc.),",
      "– Coordonnées professionnelles : adresse e-mail, numéro de téléphone,",
      "– Nom de l'établissement, type de formation, effectif envisagé, destination ou dates souhaitées,",
      "– Données de navigation (adresse IP, pages consultées, durée de visite) via des outils d'analyse d'audience.",
      "Aucune donnée sensible au sens de l'article 9 du RGPD n'est collectée.",
    ],
  },
  {
    title: "3. Finalités et base légale du traitement",
    paras: [
      "Les données collectées sont traitées pour les finalités suivantes :",
      "– Répondre aux demandes de renseignements et de programmes (base légale : intérêt légitime ou exécution de mesures précontractuelles),",
      "– Établir et suivre les relations contractuelles avec les établissements partenaires (base légale : exécution du contrat),",
      "– Améliorer le site et analyser son audience de manière agrégée (base légale : intérêt légitime),",
      "– Respecter les obligations légales applicables à l'activité (base légale : obligation légale).",
    ],
  },
  {
    title: "4. Durée de conservation",
    paras: [
      "Les données à caractère personnel sont conservées pour la durée strictement nécessaire aux finalités pour lesquelles elles ont été collectées :",
      "– Données de prospection et de contact : 3 ans à compter du dernier contact,",
      "– Données contractuelles : 10 ans à compter de la fin du contrat, conformément aux obligations légales en matière comptable et commerciale,",
      "– Données de navigation : 13 mois maximum.",
    ],
  },
  {
    title: "5. Destinataires des données",
    paras: [
      "Les données collectées sont destinées à l'usage interne d'AMI Panorama.",
      "Elles peuvent être transmises à des prestataires techniques (hébergement, outils de communication) agissant en qualité de sous-traitants, dans le strict cadre des finalités définies ci-dessus et sur la base de contrats garantissant un niveau de protection équivalent.",
      "Aucune donnée n'est vendue, louée ou cédée à des tiers à des fins commerciales.",
    ],
  },
  {
    title: "6. Droits des personnes concernées",
    paras: [
      "Conformément au RGPD et à la loi « Informatique et Libertés », vous disposez des droits suivants sur vos données personnelles :",
      "– Droit d'accès : obtenir la confirmation du traitement de vos données et en recevoir une copie,",
      "– Droit de rectification : corriger des données inexactes ou incomplètes,",
      "– Droit à l'effacement : demander la suppression de vos données dans les cas prévus par la loi,",
      "– Droit à la limitation : restreindre le traitement dans certains cas,",
      "– Droit d'opposition : vous opposer à un traitement fondé sur l'intérêt légitime,",
      "– Droit à la portabilité : recevoir vos données dans un format structuré et lisible par machine.",
      "Ces droits peuvent être exercés en contactant AMI Panorama à l'adresse : info@amipanorama.com.",
      "En cas de réponse insatisfaisante, vous disposez du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).",
    ],
  },
  {
    title: "7. Sécurité",
    paras: [
      "AMI Panorama met en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation.",
    ],
  },
  {
    title: "8. Cookies",
    paras: [
      "Pour des informations détaillées sur les cookies utilisés par ce site, leur finalité et leur gestion, consultez notre Politique de cookies.",
    ],
  },
  {
    title: "9. Modifications",
    paras: [
      "La présente politique de confidentialité peut être mise à jour pour refléter des évolutions légales ou techniques. La version en vigueur est celle publiée sur le site à la date de votre visite. Dernière mise à jour : janvier 2025.",
    ],
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <section style={{
        paddingTop: 140, paddingBottom: 56,
        background: "var(--bg)",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <div className="section-label">Protection des données</div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700,
            letterSpacing: "-0.04em", marginBottom: 16,
          }}>
            Politique de confidentialité
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
            AMI Panorama s'engage à protéger la vie privée des utilisateurs de son site
            et à traiter leurs données personnelles dans le respect du Règlement général
            sur la protection des données (RGPD — Règlement UE 2016/679) et de la loi
            française « Informatique et Libertés ».
          </p>
        </div>
      </section>

      <section style={{ padding: "0 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {sections.map(({ title, paras }, i) => (
              <div key={title} style={{
                padding: "36px 40px",
                borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <h2 style={{
                  fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em",
                  marginBottom: 16, color: "var(--text-primary)",
                }}>{title}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {paras.map((p, j) => (
                    <p key={j} style={{
                      fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0,
                      paddingLeft: p.startsWith("–") ? 12 : 0,
                    }}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/" className="btn-ghost" style={{ fontSize: 13, padding: "9px 20px" }}>
              Retour à l&apos;accueil
            </Link>
            <Link href="/politique-cookies" className="btn-ghost" style={{ fontSize: 13, padding: "9px 20px" }}>
              Politique de cookies
            </Link>
            <Link href="/mentions-legales" className="btn-ghost" style={{ fontSize: 13, padding: "9px 20px" }}>
              Mentions légales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
