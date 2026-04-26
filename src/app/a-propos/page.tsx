import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "AMI Panorama accompagne les CFA et les entreprises dans la mobilité internationale des apprentis depuis plus de 10 ans. Basés au Canada, actifs en Europe et dans le monde.",
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
    desc: "Votre rôle est de vous concentrer sur vos apprentis et votre pédagogie. Le nôtre est de prendre en charge tout ce qui entoure le séjour — logistique, encadrement terrain, démarches administratives et ingénierie de financement.",
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
  { value: "10+", label: "années d'expérience" },
  { value: "3 000+", label: "apprentis accompagnés" },
  { value: "100+", label: "groupes coordonnés" },
  { value: "50", label: "écoles partenaires" },
];

export default function AProposPage() {
  return (
    <>
      {/* Hero — dark photo section */}
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
        {/* Blue glow */}
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
            letterSpacing: "-0.04em", lineHeight: 1.08, maxWidth: 700, marginBottom: 28,
            color: "#fff",
          }}>
            Nous ouvrons le monde{" "}
            <span style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 500, color: "rgba(232,88,53,0.9)",
            }}>aux apprentis.</span>
          </h1>
          <p className="anim-fade-up-3" style={{
            fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 600, lineHeight: 1.75,
          }}>
            AMI Panorama conçoit et coordonne des programmes de mobilité internationale
            pour les CFA, les écoles et les établissements d'enseignement supérieur
            depuis plus de 10 ans. Basée au Canada, notre équipe opère avec un réseau
            de partenaires en Europe, en Amérique du Nord, en Asie et en Afrique du Nord.
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

      {/* Mission split */}
      <section style={{ padding: "64px 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3,
            borderRadius: 20, overflow: "hidden",
          }} className="mission-grid">
            <div style={{ padding: "52px 48px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16 }}>
              <div className="section-label">Notre mission</div>
              <h2 style={{
                fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: 24,
              }}>
                Rendre la mobilité internationale concrète, structurée et reproductible pour chaque établissement.
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20 }}>
                Trop d'établissements renoncent à la mobilité internationale parce qu'elle leur
                semble trop complexe à mettre en place. Notre rôle est de supprimer cette barrière —
                en prenant en charge tout ce qui est hors du champ pédagogique de nos clients.
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                Le résultat : des groupes qui partent, des apprentis qui reviennent transformés,
                et des établissements qui renouvellent l'expérience d'année en année.
              </p>
            </div>
            <div style={{ padding: "52px 48px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 16 }}>
              <div className="section-label">Notre modèle</div>
              <h2 style={{
                fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.25, marginBottom: 24,
              }}>
                Pas un voyagiste. Pas une agence. Un opérateur de mobilité professionnelle.
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20 }}>
                Nous ne vendons pas des voyages. Nous construisons des programmes de mobilité
                professionnelle — avec tout ce qu'une mobilité sérieuse implique : formation
                structurée, visites d'entreprise, encadrement terrain, logistique, assurances
                et accompagnement administratif complet.
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                Notre ancrage au Canada nous donne une vision nord-américaine qui enrichit
                notre approche — et Montréal est l'une de nos destinations phares.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div className="section-label">Nos engagements</div>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700,
              letterSpacing: "-0.035em",
            }}>Ce sur quoi vous pouvez compter.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3 }} className="values-grid">
            {values.map(({ num, title, accent, desc }) => (
              <div key={title} style={{
                padding: "36px 40px", background: "var(--bg-1)",
                border: "1px solid var(--border)", borderRadius: 16,
                display: "flex", gap: 24, alignItems: "flex-start",
              }} className="hover-card-full">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: accent + "15", border: `1px solid ${accent}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>{num}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.02em" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75 }}>{desc}</p>
                </div>
              </div>
            ))}
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
            {/* Decorative glow */}
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
            {/* Right side stat callout */}
            <div style={{
              position: "relative", textAlign: "center",
              padding: "32px 28px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, flexShrink: 0, minWidth: 160,
            }}>
              <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.05em", color: "#fff", lineHeight: 1 }}>3 000+</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 8, lineHeight: 1.4 }}>apprentis accompagnés</div>
              <div style={{ width: 32, height: 1.5, background: "var(--coral)", margin: "16px auto 0" }} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 10 }}>10 ans d'expérience</div>
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
          .mission-grid { grid-template-columns: 1fr !important; }
          .numbers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .testimonial-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
