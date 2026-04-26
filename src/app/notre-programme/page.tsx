import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre programme",
  description:
    "Un programme de mobilité internationale complet : formation professionnelle structurée, visites d'entreprise, encadrement terrain, logistique et accompagnement administratif. Découvrez chaque composante du programme AMI Panorama.",
};

const components = [
  {
    num: "01",
    title: "Formation professionnelle",
    sub: "20 heures modulaires",
    accent: "#1E52D0",
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
    title: "Visites d'entreprise",
    sub: "Immersion professionnelle réelle",
    accent: "#E85835",
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
    title: "Activités culturelles",
    sub: "Programme saisonnier sur mesure",
    accent: "#1E52D0",
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
    title: "Logement 7 nuits",
    sub: "Hébergement sécurisé et confortable",
    accent: "#E85835",
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
    title: "Transports inclus",
    sub: "Zéro logistique de déplacement",
    accent: "#1E52D0",
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
    title: "Assurances complètes",
    sub: "Couverture totale pendant le séjour",
    accent: "#E85835",
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
    title: "Ingénierie administrative & financière",
    sub: "Accompagnement de A à Z",
    accent: "#1E52D0",
    desc: "La complexité administrative est souvent ce qui dissuade les établissements de se lancer. AMI Panorama prend en charge l'intégralité de l'ingénierie de projet — structuration, démarches documentaires, identification des dispositifs mobilisables et coordination des étapes clés — pour que vous n'ayez qu'à valider.",
    details: [
      "Structuration du projet de mobilité et calendrier réglementaire",
      "Identification des cadres de financement mobilisables selon votre situation",
      "Rédaction des conventions de mobilité et documents requis",
      "Suivi documentaire et coordination jusqu'à la clôture du projet",
    ],
  },
];

export default function NotreProgrammePage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        position: "relative", paddingTop: 160, paddingBottom: 80,
        background: "var(--bg)", overflow: "hidden",
      }}>
        {/* Decorative blue glow top-right */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 600, height: 500,
          background: "radial-gradient(ellipse at top right, rgba(30,82,208,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label anim-fade-up">Notre programme</div>
          <h1 className="anim-fade-up-2" style={{
            fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700,
            letterSpacing: "-0.04em", lineHeight: 1.08, maxWidth: 720, marginBottom: 24,
          }}>
            Un programme structuré.{" "}
            <span className="gradient-text">Coordonné de bout en bout.</span>
          </h1>
          <p className="anim-fade-up-3" style={{
            fontSize: 18, color: "var(--text-secondary)", maxWidth: 620, lineHeight: 1.75, marginBottom: 48,
          }}>
            Chaque programme AMI Panorama est un séjour immersif et professionnel,
            pensé pour que vos apprentis vivent une expérience formative et humaine
            réelle. Formation, visites, encadrement, logistique, démarches administratives —
            tout est inclus. Vous vous concentrez sur votre groupe.
          </p>

          {/* Quick stats strip */}
          <div className="anim-fade-up-4" style={{
            display: "flex", gap: 0, flexWrap: "wrap",
            background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
          }}>
            {([
              ["7 à 14 nuits", "d'hébergement encadré"],
              ["20h", "de formation structurée"],
              ["6", "destinations actives"],
              ["Appui admin.", "inclus dans chaque programme"],
            ] as [string, string][]).map(([v, l], i, arr) => (
              <div key={v} style={{
                padding: "22px 32px", flex: 1, minWidth: 140,
                borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700,
                  letterSpacing: "-0.03em", color: "var(--blue)", lineHeight: 1, marginBottom: 5,
                }}>{v}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo editorial break */}
      <section style={{
        position: "relative", height: 340, overflow: "hidden",
        backgroundImage: "url('/formation-seville.jpg')",
        backgroundSize: "cover", backgroundPosition: "center 40%",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(11,24,41,0.75) 0%, rgba(11,24,41,0.3) 60%, rgba(11,24,41,0.5) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%",
        }}>
          <div style={{ maxWidth: 560 }}>
            <p style={{
              fontSize: "clamp(20px, 2.8vw, 32px)",
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 500, color: "#fff", lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}>
              « Vos apprentis ne visitent pas des vitrines — ils entrent dans les coulisses
              d'entreprises qui façonnent leur secteur. »
            </p>
            <div style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              AMI Panorama — Philosophie du programme
            </div>
          </div>
        </div>
      </section>

      {/* Programme components */}
      <section style={{ padding: "64px 24px 80px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div className="section-label">Les composantes du programme</div>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700,
              letterSpacing: "-0.035em", maxWidth: 560,
            }}>
              Ce qui est inclus dans chaque programme AMI Panorama
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {components.map(({ num, title, sub, accent, desc, details }) => (
              <div key={num} className="hover-row" style={{
                display: "grid", gridTemplateColumns: "200px 1fr",
                background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16,
                overflow: "hidden",
              }}>
                {/* Left panel */}
                <div style={{
                  padding: "36px 28px", background: "var(--bg-2)",
                  borderRight: "1px solid var(--border)",
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                    color: "var(--text-muted)", textTransform: "uppercase",
                  }}>{num}</span>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: accent + "18",
                    border: `1px solid ${accent}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />
                  </div>
                  <h2 style={{
                    fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em",
                    lineHeight: 1.3, marginTop: 4, color: "var(--text-primary)",
                  }}>{title}</h2>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>{sub}</span>
                </div>

                {/* Right panel */}
                <div style={{ padding: "36px 44px" }}>
                  <p style={{
                    fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8,
                    marginBottom: 24, maxWidth: 640,
                  }}>{desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {details.map(d => (
                      <div key={d} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: accent, flexShrink: 0, marginTop: 8,
                        }} />
                        <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "var(--navy)", borderRadius: 20,
            padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-60px", left: "25%",
              width: 450, height: 300,
              background: "radial-gradient(ellipse, rgba(30,82,208,0.3) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-40px", right: "20%",
              width: 350, height: 250,
              background: "radial-gradient(ellipse, rgba(232,88,53,0.22) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div className="section-label-light" style={{ justifyContent: "center" }}>Construisons votre programme</div>
            <h2 style={{
              fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 500,
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              letterSpacing: "-0.02em", marginBottom: 16, color: "#fff", position: "relative",
            }}>
              Parlez-nous de votre groupe et de votre projet.
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.55)",
              maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.75, position: "relative",
            }}>
              Filière, destination envisagée, dates, taille du groupe. Nous revenons vers
              vous avec une proposition sur mesure — sous 24 heures ouvrables.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/contact" className="btn-primary">
                Demander un programme
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/destinations" className="btn-ghost-light">Choisir une destination</Link>
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
