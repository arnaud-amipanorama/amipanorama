import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre programme",
  description:
    "Un programme de mobilité internationale complet : formation professionnelle structurée, visites d'entreprise, encadrement terrain, logistique et accompagnement administratif. Découvrez chaque composante du programme AMI Panorama.",
};

const whyItems = [
  {
    num: "01",
    title: "Attractivité et différenciation",
    accent: "#1E52D0",
    desc: "Les établissements qui intègrent une mobilité internationale dans leur cursus se démarquent dans le recrutement. C'est souvent ce qui fait la différence dans le choix d'une filière par les candidats et leurs familles.",
  },
  {
    num: "02",
    title: "Cohésion de promotion",
    accent: "#E85835",
    desc: "Une semaine à l'étranger crée des liens entre étudiants que plusieurs années de cours ne recréent pas. Ces liens renforcent l'engagement, réduisent l'abandon et construisent un sentiment d'appartenance durable.",
  },
  {
    num: "03",
    title: "Image et positionnement",
    accent: "#1E52D0",
    desc: "Proposer une mobilité internationale signale un standard d'ambition et d'exigence. C'est un investissement dans la perception de qualité de votre formation — et dans la fierté de vos étudiants.",
  },
  {
    num: "04",
    title: "Valeur du parcours étudiant",
    accent: "#E85835",
    desc: "Les apprentis qui vivent une expérience internationale en ressortent avec une vision plus large et une confiance renforcée. Ils valorisent mieux leur formation — et ils en parlent autour d'eux.",
  },
];

const faqItems = [
  {
    q: "À qui s'adressent les programmes AMI Panorama ?",
    a: "Aux CFA, lycées professionnels, écoles supérieures et établissements en alternance souhaitant intégrer une mobilité internationale structurée à leur cursus. Nos programmes s'adressent à des groupes de 10 à 40 étudiants, encadrés par un ou plusieurs référents pédagogiques de l'établissement.",
  },
  {
    q: "Combien de temps dure une mobilité ?",
    a: "Nos programmes standards durent 7 nuits sur place. Nous proposons également des formats étendus de 10 à 14 nuits pour les établissements souhaitant approfondir l'immersion pédagogique et l'expérience culturelle.",
  },
  {
    q: "Que comprend concrètement le programme ?",
    a: "Formation professionnelle (minimum 16 heures, généralement entre 16 et 20 heures selon la destination et le projet), visites d'entreprises sélectionnées pour leur pertinence sectorielle, programme d'activités culturelles, hébergement avec petit-déjeuner, ensemble des transports sur place, assurances complètes et accompagnement administratif de bout en bout.",
  },
  {
    q: "Quel est le rôle de l'établissement pendant le séjour ?",
    a: "L'établissement reste le référent pédagogique du groupe. Son rôle est d'accompagner les étudiants sur le plan éducatif et de valider l'intégration du séjour dans le parcours de formation. Nous prenons en charge tout ce qui relève de la logistique, de l'encadrement terrain et de l'organisation.",
  },
  {
    q: "Comment la mobilité s'intègre-t-elle dans un calendrier de formation ?",
    a: "Nous adaptons les dates, la destination et le contenu en fonction du calendrier de votre établissement et des contraintes de l'alternance. La coordination avec les entreprises d'accueil des apprentis fait partie de notre accompagnement préalable.",
  },
  {
    q: "Proposez-vous un accompagnement administratif ?",
    a: "Oui. L'ingénierie administrative fait partie intégrante de chaque programme : structuration du projet de mobilité, rédaction des conventions, identification des cadres de financement mobilisables selon votre situation et suivi documentaire jusqu'à la clôture du projet.",
  },
  {
    q: "Comment abordez-vous la structuration financière ?",
    a: "Nous accompagnons chaque établissement dans l'identification des dispositifs pertinents selon sa situation — fonds propres, branches professionnelles, collectivités, fonds européens. Nous ne garantissons pas de financement, mais nous structurons le projet pour qu'il soit éligible aux dispositifs existants et coordonnons les démarches.",
  },
  {
    q: "Les programmes sont-ils personnalisables ?",
    a: "Oui. Chaque programme est adapté à la filière, au niveau et au projet de votre groupe. Le contenu de formation, le choix des entreprises visitées, le programme culturel et les dates peuvent être ajustés en concertation avec votre équipe.",
  },
  {
    q: "Qui encadre les étudiants sur place ?",
    a: "Une équipe terrain AMI Panorama est présente et disponible 24h/24 pendant toute la durée du séjour. En parallèle, le ou les référents de l'établissement accompagnent le groupe sur le plan pédagogique.",
  },
  {
    q: "Quel est le niveau d'accompagnement avant, pendant et après ?",
    a: "Avant : coordination complète — programme, logistique, assurances, documents. Pendant : encadrement terrain 24h/24. Après : bilan de séjour, attestations de formation, comptes-rendus de visite et accompagnement pour la clôture administrative du projet.",
  },
];

const components = [
  {
    num: "01",
    title: "Formation professionnelle",
    sub: "16 à 20+ heures selon le programme",
    accent: "#1E52D0",
    desc: "Au cœur du programme, une formation structurée — minimum 16 heures, généralement entre 16 et 20 heures — conçue pour ouvrir vos apprentis au monde professionnel international. Panorama socio-économique du pays d'accueil, ateliers de Business English, workshops sectoriels et mises en situation professionnelle.",
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
      "Compte-rendu de visite disponible pour valorisation pédagogique",
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
    desc: "La complexité administrative est souvent ce qui freine un premier projet de mobilité. AMI Panorama vous accompagne sur l'ensemble de cette dimension — structuration, démarches documentaires, identification des dispositifs mobilisables et coordination des étapes clés — en travaillant avec vous à chaque étape.",
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
            réelle. Formation, visites, encadrement, logistique, appui administratif —
            chaque composante est coordonnée par notre équipe. Vous restez le référent pédagogique de votre groupe.
          </p>

          {/* Quick stats strip */}
          <div className="anim-fade-up-4" style={{
            display: "flex", gap: 0, flexWrap: "wrap",
            background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
          }}>
            {([
              ["7 à 14 nuits", "d'hébergement encadré"],
              ["16–20h", "de formation structurée"],
              ["10", "destinations actives"],
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

      {/* Why it matters */}
      <section style={{ padding: "0 24px 72px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="why-grid">
            {/* Left: editorial statement */}
            <div style={{ position: "sticky", top: 100 }}>
              <div className="section-label">Pourquoi ça compte</div>
              <h2 style={{
                fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700,
                letterSpacing: "-0.035em", marginBottom: 40,
              }}>
                Ce que la mobilité change — vraiment.
              </h2>
              <p style={{
                fontSize: "clamp(17px, 2vw, 22px)",
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontWeight: 500, lineHeight: 1.5,
                color: "var(--text-secondary)", marginBottom: 20,
                letterSpacing: "-0.01em",
              }}>
                « Ce n'est pas une semaine supplémentaire dans le calendrier.
                C'est la semaine dont vos apprentis parleront encore dans dix ans. »
              </p>
              <p style={{
                fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 28,
              }}>
                La mobilité ne complète pas une formation. Elle en change la valeur perçue —
                pour les candidats qui choisissent votre filière, pour les apprentis qui la vivent,
                et pour l'établissement qui a su la rendre possible.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                <div style={{ width: 28, height: 1.5, background: "var(--coral)", flexShrink: 0 }} />
                AMI Panorama
              </div>
            </div>
            {/* Right: numbered list, no boxes */}
            <div>
              {whyItems.map(({ num, title, accent, desc }) => (
                <div key={num} style={{
                  display: "flex", gap: 24,
                  padding: "28px 0",
                  borderTop: "1px solid var(--border)",
                }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: accent, flexShrink: 0,
                    minWidth: 28, paddingTop: 2,
                  }}>{num}</div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.02em" }}>{title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>{desc}</p>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)" }} />
            </div>
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

      {/* FAQ */}
      <section style={{ padding: "0 24px 80px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div className="section-label">Questions fréquentes</div>
            <h2 style={{
              fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700,
              letterSpacing: "-0.035em", maxWidth: 520,
            }}>
              Ce que les établissements nous demandent le plus souvent
            </h2>
          </div>
          <div>
            {faqItems.map(({ q, a }, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "2fr 3fr", gap: 48,
                padding: "28px 0",
                borderTop: "1px solid var(--border)",
                alignItems: "start",
              }} className="faq-row">
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.4, color: "var(--text-primary)" }}>{q}</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>{a}</div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} />
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
              vous avec une première proposition adaptée à votre contexte.
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
          .why-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .faq-row { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </>
  );
}
