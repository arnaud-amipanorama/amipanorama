import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site AMI Panorama — informations légales, hébergeur, propriété intellectuelle et données personnelles.",
  robots: { index: false, follow: false },
};

const sections = [
  {
    title: "1. Informations légales de la société",
    content: [
      "Dénomination sociale : AMI PANORAMA",
      "Forme juridique : Société par actions simplifiée (SAS)",
      "Capital social : 5 000 €",
      "Siège social : 2 rue Wimpheling, 67000 Strasbourg, France",
      "Immatriculation : RCS Strasbourg – n° 978 133 528",
      "SIRET : 978 133 528 00015",
      "Code APE/NAF : 79.12Z – Activités des voyagistes",
      "Numéro de TVA intracommunautaire : FR52 978 133 528",
      "Directeur de la publication : Directeur général",
      "Contact : info@amipanorama.com",
    ],
    type: "list" as const,
  },
  {
    title: "2. Hébergeur du site",
    content: [
      "Le présent site est hébergé par :",
      "Wix Online Platforms Limited",
      "1 Grant's Row, Dublin 2, D02HX96, Ireland",
    ],
    type: "paragraphs" as const,
  },
  {
    title: "3. Propriété intellectuelle",
    content: [
      "L'intégralité du contenu présent sur le site (textes, images, graphismes, logo, vidéos, icônes, structure générale) est protégée par le droit d'auteur et les droits de propriété intellectuelle.",
      "Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit, est interdite, sauf autorisation expresse et écrite d'AMI Panorama.",
      "Toute exploitation non autorisée du site ou de son contenu engage la responsabilité de l'utilisateur et est susceptible de constituer une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.",
    ],
    type: "paragraphs" as const,
  },
  {
    title: "4. Données personnelles et cookies",
    content: [
      "Conformément au Règlement général sur la protection des données (RGPD – Règlement UE 2016/679) et à la loi « Informatique et Libertés » modifiée, AMI Panorama s'engage à assurer la protection, la confidentialité et la sécurité des données personnelles de ses utilisateurs.",
      "Les données collectées sur le site sont utilisées uniquement dans le cadre des services proposés.",
      "Les utilisateurs disposent d'un droit d'accès, de rectification, de suppression et d'opposition relatif à leurs données. Ces droits peuvent être exercés à l'adresse de contact indiquée ci-dessus.",
      "Le site peut utiliser des cookies destinés à faciliter la navigation et mesurer l'audience. L'utilisateur conserve la possibilité de refuser l'installation de cookies en configurant son navigateur.",
    ],
    type: "paragraphs" as const,
  },
  {
    title: "5. Responsabilité",
    content: [
      "AMI Panorama met tout en œuvre pour assurer l'exactitude et la mise à jour des informations publiées. Toutefois, l'éditeur ne saurait être tenu responsable :",
      "– des erreurs ou omissions dans le contenu,",
      "– d'éventuelles interruptions ou dysfonctionnements du site,",
      "– de tout dommage direct ou indirect résultant de l'utilisation du site ou de l'impossibilité d'y accéder.",
      "Les utilisateurs du site s'engagent à accéder au site avec un matériel récent, ne contenant pas de virus, et avec un navigateur mis à jour.",
    ],
    type: "paragraphs" as const,
  },
  {
    title: "6. Liens hypertextes",
    content: [
      "Le site peut contenir des liens vers d'autres sites. AMI Panorama décline toute responsabilité quant au contenu de ces sites tiers et ne pourra être tenu responsable de dommages directs ou indirects consécutifs à leur accès.",
    ],
    type: "paragraphs" as const,
  },
  {
    title: "7. Droit applicable et attribution de juridiction",
    content: [
      "Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, la compétence expresse est attribuée aux tribunaux compétents de Strasbourg.",
    ],
    type: "paragraphs" as const,
  },
];

export default function MentionsLegalesPage() {
  return (
    <>
      <section style={{
        paddingTop: 140, paddingBottom: 56,
        background: "var(--bg)",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <div className="section-label">Informations légales</div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700,
            letterSpacing: "-0.04em", marginBottom: 16,
          }}>
            Mentions légales
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
            Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance
            dans l'économie numérique (LCEN), il est précisé aux utilisateurs du site internet
            AMI Panorama l'identité des différents intervenants dans le cadre de sa réalisation
            et de son suivi.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {sections.map(({ title, content, type }, i) => (
              <div key={title} style={{
                padding: "36px 40px",
                borderBottom: i < sections.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <h2 style={{
                  fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em",
                  marginBottom: 16, color: "var(--text-primary)",
                }}>{title}</h2>
                {type === "list" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {content.map((line, j) => (
                      <div key={j} style={{ display: "flex", gap: 10 }}>
                        <div style={{
                          width: 4, height: 4, borderRadius: "50%",
                          background: "var(--blue)", flexShrink: 0, marginTop: 9,
                        }} />
                        <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>{line}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {content.map((para, j) => (
                      <p key={j} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/" className="btn-ghost" style={{ fontSize: 13, padding: "9px 20px" }}>
              Retour à l&apos;accueil
            </Link>
            <Link href="/politique-de-confidentialite" className="btn-ghost" style={{ fontSize: 13, padding: "9px 20px" }}>
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
