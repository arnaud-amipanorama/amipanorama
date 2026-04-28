import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "L'histoire d'AMI Panorama — un constat sur l'accès inégal à la mobilité internationale selon les filières, et la mission construite pour y répondre.",
};

const values = [
  {
    num: "01",
    title: "Qualité sans compromis",
    accent: "#1E52D0",
    desc: "Chaque hébergement, chaque formateur, chaque entreprise partenaire est sélectionné selon des critères stricts. Rien n'est laissé au hasard dans un programme AMI.",
  },
  {
    num: "02",
    title: "Simplicité pour vous",
    accent: "#E85835",
    desc: "Votre rôle est de rester le référent pédagogique de votre groupe. Le nôtre est d'organiser ce qui entoure le séjour — logistique, encadrement terrain, démarches administratives et structuration du projet de financement.",
  },
  {
    num: "03",
    title: "Impact sur les apprentis",
    accent: "#1E52D0",
    desc: "Une mobilité réussie transforme un parcours. Nous le savons car nos 3 000 alumni nous le disent. C'est cette conviction qui anime chaque programme que nous construisons.",
  },
  {
    num: "04",
    title: "Partenariat durable",
    accent: "#E85835",
    desc: "Nous construisons des relations à long terme avec les établissements qui nous font confiance. 50 organismes travaillent avec nous depuis plusieurs années — et la majorité repart chaque saison.",
  },
];

const numbers = [
  { value: "2022", label: "fondé à Montréal" },
  { value: "3 000+", label: "apprentis accompagnés" },
  { value: "100+", label: "groupes coordonnés" },
  { value: "50", label: "établissements partenaires" },
];

const milestones = [
  {
    year: "2022",
    title: "Fondation",
    desc: "AMI Panorama naît avec une ambition claire : concevoir des programmes de mobilité internationale pensés pour les réalités de l'apprentissage, avec une approche plus structurée, plus professionnalisante et plus collective.",
  },
  {
    year: "2023",
    title: "Premiers départs à Montréal",
    desc: "Les premiers groupes partent à Montréal. 4 groupes issus de 3 écoles, environ 126 participants. Cette première phase valide le modèle et confirme la pertinence du projet.",
  },
  {
    year: "2024",
    title: "Montée en puissance et ouverture de Séville",
    desc: "Montréal continue de croître fortement et Séville devient le deuxième grand pilier du programme. Une forte accélération, avec environ 800 participants accompagnés sur l'année.",
  },
  {
    year: "2025",
    title: "Accélération et diversification",
    desc: "Ouverture et consolidation de nouvelles destinations — Londres, Berlin, New York, Maroc. Environ 2 000 participants accompagnés sur l'année.",
  },
  {
    year: "2026",
    title: "Changement d'échelle",
    desc: "AMI Panorama dépasse les 3 000 participants accompagnés sur l'année et continue d'élargir son portefeuille de destinations avec une présence renforcée auprès des établissements partenaires.",
  },
];

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        position: "relative", paddingTop: 160, paddingBottom: 96,
        background: "var(--navy)", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/formation-seville.jpg')",
          backgroundSize: "cover", backgroundPosition: "center 30%",
          opacity: 0.15,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(11,24,41,0.2) 0%, var(--navy) 100%)",
        }} />
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 600, height: 500,
          background: "radial-gradient(ellipse at top right, rgba(30,82,208,0.2) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label-light anim-fade-up">À propos</div>
          <h1 className="anim-fade-up-2" style={{
            fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700,
            letterSpacing: "-0.04em", lineHeight: 1.08, maxWidth: 780, marginBottom: 28,
            color: "#fff",
          }}>
            La mobilité internationale{" "}
            <span style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 500, color: "rgba(232,88,53,0.9)",
            }}>ne devrait pas dépendre de la filière.</span>
          </h1>
          <p className="anim-fade-up-3" style={{
            fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 600, lineHeight: 1.75,
          }}>
            AMI Panorama est née d'une observation simple : dans le parcours d'un étudiant,
            certaines expériences — collectives, internationales, mémorables — ne sont pas
            accessibles de la même façon selon la filière choisie. Nous existons pour changer ça.
          </p>
        </div>
      </section>

      {/* Numbers bar */}
      <section style={{ padding: "0 24px", position: "relative", zIndex: 2, marginTop: -1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
            background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden",
            boxShadow: "0 8px 40px rgba(11,24,41,0.12)",
          }} className="numbers-grid">
            {numbers.map(({ value, label }, i, arr) => (
              <div key={label} style={{
                padding: "36px 28px", textAlign: "center",
                borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
                  letterSpacing: "-0.045em", color: "var(--blue)", lineHeight: 1, marginBottom: 8,
                }}>{value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The gap we bridge — moved up to establish context first */}
      <section style={{ padding: "72px 24px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <div className="section-label">Ce que nous cherchons à corriger</div>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3,
          }} className="gap-grid">
            <div style={{ padding: "44px 44px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", marginBottom: 16 }}>Grandes écoles · Universités</div>
              <h3 style={{
                fontSize: "clamp(16px, 2vw, 21px)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.3, marginBottom: 20,
              }}>
                Cohésion de promotion. Réseaux actifs. Mémoires collectives.
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>
                Dans les grandes écoles et les campus traditionnels, les étudiants bénéficient
                d'une vie collective structurée : voyages de promotion, séjours internationaux,
                associations, cohortes soudées, réseaux alumni actifs. Ces expériences ne sont
                pas accessoires — elles construisent une identité, des liens durables et un fort
                attachement à l'établissement. Elles contribuent directement à son attractivité.
              </p>
            </div>
            <div style={{
              padding: "44px 44px", background: "var(--navy)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at top right, rgba(232,88,53,0.14) 0%, transparent 65%)",
                pointerEvents: "none",
              }} />
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(232,88,53,0.8)", marginBottom: 16, position: "relative" }}>CFA · Formations en alternance</div>
              <h3 style={{
                fontSize: "clamp(16px, 2vw, 21px)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.3, marginBottom: 20,
                color: "#fff", position: "relative",
              }}>
                Un parcours exigeant. Mais souvent moins de ces expériences collectives.
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.60)", lineHeight: 1.85, position: "relative" }}>
                Les apprentis vivent un parcours intensément professionnel et formateur. Mais ils
                ont moins accès, structurellement, aux expériences qui marquent durablement une
                formation : l'international collectif, les souvenirs partagés hors contexte
                professionnel, les moments qui lient une promotion. AMI Panorama existe pour que
                cette dimension soit accessible à eux aussi — sans renoncer à l'exigence
                pédagogique qui les caractérise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company story — rewritten around company history, not founder biographies */}
      <section style={{ padding: "72px 24px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">Notre histoire</div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64,
          }} className="story-grid">
            {/* Left: why AMI exists */}
            <div>
              <h2 style={{
                fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 28,
              }}>
                D&apos;un constat,{" "}
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500 }}>
                  une mission.
                </span>
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 18 }}>
                En France, l'accès à la mobilité internationale collective reste structurellement
                inégal selon les filières. Les grandes écoles et les universités disposent d'une
                infrastructure bien établie pour les voyages de groupe et les cohortes soudées.
                La formation en apprentissage — plus exigeante professionnellement, plus contrainte
                administrativement — en bénéficie beaucoup moins.
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 18 }}>
                Cette inégalité n'est pas une fatalité. Elle est le résultat d'un manque
                d'infrastructure dédiée. Organiser une mobilité pour des apprentis demande une
                expertise spécifique : cadres réglementaires, financements disponibles, contraintes
                du calendrier en alternance, documentation pédagogique. AMI Panorama a été créé
                pour apporter cette expertise.
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85 }}>
                Depuis 2022, nous construisons des programmes qui permettent à des groupes
                d'apprentis de vivre des expériences collectives et internationales de la même
                qualité que celles proposées dans les cursus traditionnels — sans que l'établissement
                ait à porter seul la complexité que cela représente.
              </p>
            </div>

            {/* Right: company timeline */}
            <div>
              {milestones.map(({ year, title, desc }, i) => (
                <div key={year} style={{
                  paddingBottom: i < milestones.length - 1 ? 28 : 0,
                  marginBottom: i < milestones.length - 1 ? 28 : 0,
                  borderBottom: i < milestones.length - 1 ? "1px solid var(--border)" : "none",
                  display: "grid", gridTemplateColumns: "80px 1fr", gap: 20, alignItems: "start",
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                    textTransform: "uppercase", color: "var(--blue)", paddingTop: 3, lineHeight: 1.3,
                  }}>{year}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{title}</div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Real photo */}
      <section style={{ padding: "56px 24px 56px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            height: "clamp(280px, 38vw, 480px)",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "url('/Assets/Groupe Seville .jpg')",
              backgroundSize: "cover", backgroundPosition: "center 30%",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to right, rgba(11,24,41,0.72) 0%, rgba(11,24,41,0.10) 55%, transparent 100%)",
            }} />
            <div style={{ position: "absolute", bottom: 36, left: 40 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 10,
              }}>Séville · Programme 2024</div>
              <p style={{
                fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 500,
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                color: "#fff", lineHeight: 1.3, maxWidth: 420,
              }}>
                Ce que ça ressemble,<br />quand ça fonctionne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div className="section-label">Nos engagements</div>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700,
              letterSpacing: "-0.035em",
            }}>Ce sur quoi vous pouvez compter.</h2>
          </div>
          <div>
            {values.map(({ num, title, accent, desc }) => (
              <div key={title} style={{
                display: "grid",
                gridTemplateColumns: "72px 1fr 2fr",
                gap: 48,
                padding: "36px 0",
                borderTop: "1px solid var(--border)",
                alignItems: "start",
              }} className="values-row">
                <div style={{
                  fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700,
                  letterSpacing: "-0.06em", color: accent,
                  lineHeight: 1, paddingTop: 4,
                }}>{num}</div>
                <h3 style={{
                  fontSize: "clamp(15px, 1.6vw, 18px)", fontWeight: 600,
                  letterSpacing: "-0.025em", lineHeight: 1.3,
                  paddingTop: 6,
                }}>{title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>{desc}</p>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} />
          </div>
        </div>
      </section>

      {/* Founders — compact, secondary layer */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">Les fondateurs</div>
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "40px 44px",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center",
          }} className="founders-card">
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, margin: 0 }}>
              AMI Panorama a été fondé par Arnaud et Samuel, portés par des trajectoires
              complémentaires. L'un ancré dans l'enseignement supérieur international,
              l'autre dans la formation professionnelle, ils ont construit AMI Panorama
              sur la conviction que les apprentis méritent des expériences collectives
              et internationales aussi structurées et mémorables que celles proposées
              dans les cursus traditionnels.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Arnaud</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Université de Montréal · Harvard</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Samuel</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Formation professionnelle · Alternance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "var(--navy)", borderRadius: 20,
            padding: "60px 56px", position: "relative", overflow: "hidden",
            display: "grid", gridTemplateColumns: "1fr auto",
            gap: 48, alignItems: "center",
          }} className="testimonial-grid">
            <div style={{
              position: "absolute", top: "-80px", left: "0",
              width: 500, height: 400,
              background: "radial-gradient(ellipse at left, rgba(30,82,208,0.25) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{
                fontSize: 60, lineHeight: 0.8, marginBottom: 24,
                fontFamily: "Georgia, serif", color: "rgba(232,88,53,0.5)",
              }}>&ldquo;</div>
              <blockquote style={{
                fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 500,
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                letterSpacing: "-0.01em", lineHeight: 1.55, color: "#fff", marginBottom: 32,
              }}>
                Merci pour votre accompagnement. Vous avez été exceptionnels
                et vous avez rendu notre voyage incroyable.
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", background: "var(--blue)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "#fff",
                }}>F</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Florian Riocreux</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Référent Mobilité — ECEMA</div>
                </div>
              </div>
            </div>
            <div style={{
              position: "relative", textAlign: "center",
              padding: "32px 28px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, flexShrink: 0, minWidth: 160,
            }}>
              <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.05em", color: "#fff", lineHeight: 1 }}>3 000+</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 8, lineHeight: 1.4 }}>apprentis accompagnés</div>
              <div style={{ width: 32, height: 1.5, background: "var(--coral)", margin: "16px auto 0" }} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 10 }}>10 ans d&apos;expérience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "64px 48px", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse at 50% 0%, rgba(30,82,208,0.07) 0%, transparent 60%)",
            }} />
            <div className="section-label" style={{ justifyContent: "center" }}>Travaillons ensemble</div>
            <h2 style={{
              fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700,
              letterSpacing: "-0.035em", marginBottom: 16, position: "relative",
            }}>
              Votre prochain groupe mérite<br />une vraie mobilité internationale.
            </h2>
            <p style={{
              fontSize: 15, color: "var(--text-secondary)",
              maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.75, position: "relative",
            }}>
              Parlez-nous de votre projet. Premier échange gratuit et sans engagement.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/contact" className="btn-primary">
                Demander un programme
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/notre-programme" className="btn-ghost">Voir le programme</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .story-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .gap-grid { grid-template-columns: 1fr !important; }
          .numbers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .values-row { grid-template-columns: 48px 1fr !important; gap: 20px !important; }
          .values-row > p { grid-column: 1 / -1 !important; padding-left: 68px; }
          .testimonial-grid { grid-template-columns: 1fr !important; }
          .founders-card { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
    </>
  );
}
