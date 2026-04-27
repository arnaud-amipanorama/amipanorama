import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales",
  description: "Conditions générales de vente et de prestation de services d'AMI Panorama.",
  robots: { index: false, follow: false },
};

const articles = [
  {
    title: "Article 1 — Objet et parties",
    paras: [
      "Les présentes conditions générales (ci-après « CGV ») régissent les relations contractuelles entre la société AMI PANORAMA, SAS au capital de 5 000 €, immatriculée au RCS de Strasbourg sous le n° 978 133 528, dont le siège social est situé au 2 rue Wimpheling, 67000 Strasbourg (ci-après « AMI Panorama »), et tout établissement d'enseignement, CFA, lycée professionnel ou organisme de formation (ci-après « l'Établissement ») souhaitant bénéficier de ses services de conception et d'organisation de programmes de mobilité internationale.",
      "Toute commande passée auprès d'AMI Panorama implique l'acceptation sans réserve des présentes CGV.",
    ],
  },
  {
    title: "Article 2 — Formation du contrat",
    paras: [
      "Toute commande est formalisée par un devis établi par AMI Panorama, accepté et signé par l'Établissement, accompagné du versement d'un acompte dans les conditions définies à l'article 3.",
      "Le contrat est réputé conclu à réception par AMI Panorama du devis signé et de l'acompte correspondant. Aucune réservation n'est confirmée avant réception de ces deux éléments.",
    ],
  },
  {
    title: "Article 3 — Tarifs et modalités de paiement",
    paras: [
      "Les prix sont indiqués en euros toutes taxes comprises (TTC). Ils incluent les prestations expressément mentionnées au devis.",
      "Un acompte de 30 % du montant total est dû à la réservation. Le solde est exigible au plus tard 30 jours avant la date de départ.",
      "AMI Panorama se réserve le droit d'ajuster ses tarifs en cas de variation significative et documentée des coûts de transport, des taux de change ou des taxes applicables. L'Établissement en sera informé dans les meilleurs délais.",
      "Tout retard de paiement entraîne de plein droit l'application d'intérêts de retard au taux légal en vigueur, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 €.",
    ],
  },
  {
    title: "Article 4 — Modification et annulation par l'Établissement",
    paras: [
      "Toute demande de modification (effectifs, dates, destination) doit être formulée par écrit. AMI Panorama fera ses meilleurs efforts pour y répondre favorablement, sous réserve de disponibilité et de faisabilité, et pourra facturer des frais de modification selon les conditions en vigueur.",
      "En cas d'annulation par l'Établissement, les conditions suivantes s'appliquent :",
      "– Plus de 60 jours avant le départ : retenue de l'acompte versé.",
      "– Entre 30 et 60 jours avant le départ : facturation de 50 % du montant total TTC.",
      "– Moins de 30 jours avant le départ : facturation de 100 % du montant total TTC.",
      "Ces conditions s'entendent hors cas de force majeure dûment documenté.",
    ],
  },
  {
    title: "Article 5 — Modification ou annulation par AMI Panorama",
    paras: [
      "En cas de modification substantielle d'un élément essentiel du programme (destination, dates, hébergement principal), AMI Panorama en informera l'Établissement dans les meilleurs délais et lui proposera soit une alternative équivalente, soit le remboursement des sommes versées.",
      "En cas d'annulation du programme par AMI Panorama pour des raisons indépendantes de sa volonté (force majeure, nombre de participants insuffisant, restrictions d'accès au territoire), les sommes versées seront intégralement remboursées, sans autre indemnité.",
    ],
  },
  {
    title: "Article 6 — Obligations d'AMI Panorama",
    paras: [
      "AMI Panorama s'engage à :",
      "– organiser le programme conformément aux prestations décrites au devis accepté,",
      "– assurer la présence d'une équipe terrain pendant toute la durée du séjour,",
      "– disposer de toutes les garanties, licences et assurances requises par la réglementation applicable,",
      "– informer l'Établissement de tout changement significatif affectant le programme.",
      "AMI Panorama est soumis à une obligation de moyens dans la mise en œuvre des prestations.",
    ],
  },
  {
    title: "Article 7 — Obligations de l'Établissement",
    paras: [
      "L'Établissement s'engage à :",
      "– fournir la liste définitive des participants et toutes les informations nécessaires dans les délais convenus,",
      "– désigner un référent pédagogique qui accompagnera le groupe pendant le séjour,",
      "– s'assurer que chaque participant dispose des documents d'identité valides requis,",
      "– informer AMI Panorama de tout participant présentant des besoins particuliers (médicaux, alimentaires, etc.) avant la confirmation du programme.",
    ],
  },
  {
    title: "Article 8 — Responsabilité",
    paras: [
      "La responsabilité d'AMI Panorama ne peut être engagée en cas de force majeure, de faute imputable à l'Établissement ou aux participants, ou de fait d'un tiers étranger à la fourniture des prestations.",
      "AMI Panorama ne saurait être tenu responsable des dommages indirects ou immatériels, quelle qu'en soit la nature.",
    ],
  },
  {
    title: "Article 9 — Assurances",
    paras: [
      "AMI Panorama dispose d'une assurance responsabilité civile professionnelle couvrant son activité d'organisateur de voyages.",
      "Une assurance assistance-rapatriement et responsabilité civile est incluse dans le tarif de chaque programme pour l'ensemble des participants. Les conditions de couverture sont disponibles sur demande.",
    ],
  },
  {
    title: "Article 10 — Protection des données personnelles",
    paras: [
      "Les données collectées dans le cadre de l'exécution du contrat sont traitées conformément à la Politique de confidentialité d'AMI Panorama, disponible sur le site amipanorama.com. L'Établissement s'assure que les participants ont été informés du traitement de leurs données à caractère personnel dans ce cadre.",
    ],
  },
  {
    title: "Article 11 — Droit applicable et litiges",
    paras: [
      "Les présentes CGV sont soumises au droit français.",
      "En cas de litige relatif à l'interprétation ou à l'exécution du contrat, les parties s'engagent à rechercher en priorité une solution amiable. À défaut d'accord dans un délai de 30 jours, les tribunaux compétents de Strasbourg seront seuls compétents.",
    ],
  },
];

export default function ConditionsGeneralesPage() {
  return (
    <>
      <section style={{
        paddingTop: 140, paddingBottom: 56,
        background: "var(--bg)",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <div className="section-label">Contractuel</div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700,
            letterSpacing: "-0.04em", marginBottom: 16,
          }}>
            Conditions générales
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
            Conditions générales de vente et de prestation de services applicables aux programmes
            de mobilité internationale conçus et organisés par AMI Panorama.
            Dernière mise à jour : janvier 2025.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {articles.map(({ title, paras }, i) => (
              <div key={title} style={{
                padding: "36px 40px",
                borderBottom: i < articles.length - 1 ? "1px solid var(--border)" : "none",
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
            <Link href="/mentions-legales" className="btn-ghost" style={{ fontSize: 13, padding: "9px 20px" }}>
              Mentions légales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
