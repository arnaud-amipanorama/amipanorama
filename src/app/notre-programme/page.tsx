import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre programme",
  description:
    "7 nuits, 20h de formation, visites d'entreprise, activités culturelles, logement, transports et assurances. Découvrez le programme AMI Panorama dans le détail.",
};

const components = [
  {
    num: "01",
    icon: "◈",
    title: "Formation professionnelle",
    sub: "20 heures modulaires",
    desc: "Au cœur du programme, une formation de 20 heures conçue pour ouvrir vos apprentis au monde professionnel international. Panorama socio-économique du pays d'accueil, ateliers de Business English, workshops sectoriels et mises en situation professionnelle.",
    details: [
      "Cours animés par des formateurs locaux et professionnels du secteur",
      "Contenu personnalisable selon le secteur d'activité de vos apprentis",
      "Business English pour les profils non-anglophones",
      "Attestation de formation remise à chaque participant",
    ],
  },
  {
    num: "02",
    icon: "◎",
    title: "Visites d'entreprise",
    sub: "Immersion professionnelle réelle",
    desc: "Vos apprentis ne visitent pas des vitrines — ils entrent dans les coulisses d'entreprises locales sélectionnées pour leur pertinence sectorielle. Échanges avec des professionnels, découverte des pratiques de travail locales, comparaison avec le marché français.",
    details: [
      "Sélection d'entreprises alignées avec les filières de votre CFA",
      "Format : visite + échanges + questions/réponses",
      "Secteurs couverts : tech, industrie, services, tourisme, commerce",
      "Compte-rendu de visite fourni pour valorisation pédagogique",
    ],
  },
  {
    num: "03",
    icon: "◉",
    title: "Activités culturelles",
    sub: "Programme saisonnier sur mesure",
    desc: "La mobilité internationale se vit aussi en dehors des salles de formation. Notre programme d'activités culturelles est conçu pour maximiser l'immersion : sites historiques, expériences locales authentiques et moments de vie partagée qui restent gravés.",
    details: [
      "Programme adapté à la saison et aux conditions météorologiques",
      "Sites iconiques : cathédrales, musées, quartiers historiques",
      "Expériences locales : gastronomie, artisanat, spectacles",
      "Temps libres encadrés pour favoriser l'autonomie",
    ],
  },
  {
    num: "04",
    icon: "◐",
    title: "Logement 7 nuits",
    sub: "Hébergement sécurisé et confortable",
    desc: "Nous sélectionnons des établissements qui combinent confort, sécurité et cadre propice à la vie de groupe. Chaque hébergement est testé et validé par notre équipe terrain avant d'être intégré à nos programmes.",
    details: [
      "Petits-déjeuners complets inclus chaque matin",
      "Espaces de vie communs pour favoriser la cohésion du groupe",
      "Rooftop et espaces de détente selon les destinations",
      "Accueil 24h/24 et assistance sur place",
    ],
  },
  {
    num: "05",
    icon: "◑",
    title: "Transports inclus",
    sub: "Zéro logistique de déplacement",
    desc: "De l'arrivée à l'aéroport jusqu'au retour, tous les transports sont coordonnés par notre équipe. Vos apprentis n'ont pas à gérer les trajets — ils se concentrent sur l'expérience.",
    details: [
      "Transferts aéroport aller et retour organisés",
      "Navettes quotidiennes aller-retour vers le lieu de formation",
      "Transport pour toutes les visites d'entreprise et activités",
      "Coordination des transports en cas d'imprévus",
    ],
  },
  {
    num: "06",
    icon: "◒",
    title: "Assurances complètes",
    sub: "Couverture totale pendant le séjour",
    desc: "La sécurité de vos apprentis est une priorité absolue. Notre couverture assurance est parmi les plus complètes du marché, avec une assistance rapatriement disponible 24h/24.",
    details: [
      "Assistance-rapatriement disponible 24h/24, 7j/7",
      "Hospitalisation et soins médicaux couverts jusqu'à 200 000 €",
      "Bagages couverts jusqu'à 2 000 €",
      "Responsabilité civile et annulation incluses",
    ],
  },
  {
    num: "07",
    icon: "◓",
    title: "Support administratif & Erasmus+",
    sub: "Financement géré de bout en bout",
    desc: "C'est souvent ce qui freine les CFA : la complexité administrative. Nous prenons en charge l'intégralité du dossier Erasmus+ — de la vérification de l'éligibilité jusqu'au reporting final — pour que vous n'ayez qu'à valider.",
    details: [
      "Vérification d'éligibilité et stratégie de financement",
      "Rédaction et dépôt du dossier auprès de l'agence nationale",
      "Conventions de mobilité et documents réglementaires",
      "Suivi budgétaire et reporting de fin de projet",
    ],
  },
];

export default function NotreProgrammePage() {
  return (
    <>
      {/* Header */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: 140, paddingBottom: 72 }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 420,
          background: "radial-gradient(ellipse, rgba(107,92,231,0.14) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label">Notre programme</div>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1.08, maxWidth: 700, marginBottom: 24 }}>
            7 nuits.<br />
            <span className="gradient-text">Tout compris.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 600, lineHeight: 1.75, marginBottom: 40 }}>
            Chaque programme AMI Panorama est un séjour immersif complet, pensé pour que
            vos apprentis vivent une expérience professionnelle et humaine transformatrice.
            Vous gérez la pédagogie. Nous gérons tout le reste.
          </p>

          {/* Quick stats bar */}
          <div style={{
            display: "flex", gap: 0, flexWrap: "wrap",
            background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
          }}>
            {([
              ["7 nuits", "d'hébergement"],
              ["20h", "de formation"],
              ["6", "destinations"],
              ["Erasmus+", "financement inclus"],
            ] as [string, string][]).map(([v, l], i, arr) => (
              <div key={v} style={{
                padding: "20px 28px", flex: 1, minWidth: 130,
                borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--accent-light)", lineHeight: 1, marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme components */}
      <section style={{ padding: "24px 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {components.map(({ num, icon, title, sub, desc, details }) => (
            <div key={num} className="hover-row" style={{
              display: "grid", gridTemplateColumns: "180px 1fr",
              background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16,
              overflow: "hidden",
            }}>
              {/* Left */}
              <div style={{
                padding: "36px 28px", background: "var(--bg-2)",
                borderRight: "1px solid var(--border)",
                display: "flex", flexDirection: "column", gap: 10,
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" }}>{num}</span>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(107,92,231,0.1)", border: "1px solid rgba(107,92,231,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: "var(--accent-light)",
                }}>{icon}</div>
                <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3, marginTop: 4 }}>{title}</h2>
                <span style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{sub}</span>
              </div>

              {/* Right */}
              <div style={{ padding: "36px 44px" }}>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24, maxWidth: 640 }}>{desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {details.map(d => (
                    <div key={d} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 20,
            padding: "64px 48px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse at 50% 0%, rgba(107,92,231,0.12) 0%, transparent 60%)",
            }} />
            <div className="section-label" style={{ justifyContent: "center" }}>Construisons votre programme</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.035em", marginBottom: 16, position: "relative" }}>
              Quel groupe souhaitez-vous envoyer ?
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.75, position: "relative" }}>
              Chaque programme est adapté à votre filière, vos dates et vos contraintes.
              Parlez-nous de votre projet en moins de 5 minutes.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/contact" className="btn-primary">
                Demander un programme
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/destinations" className="btn-ghost">Choisir une destination</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .hover-row { grid-template-columns: 1fr !important; }
          .hover-row > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </>
  );
}
