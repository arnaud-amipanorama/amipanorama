import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "AMI Panorama accompagne les CFA et les entreprises dans la mobilité internationale des apprentis depuis plus de 10 ans. Basés au Canada, actifs en Europe et dans le monde.",
};

const values = [
  {
    icon: "◈",
    title: "Qualité sans compromis",
    desc: "Chaque hébergement, chaque formateur, chaque entreprise partenaire est sélectionné selon des critères stricts. Rien n'est laissé au hasard dans un programme AMI.",
  },
  {
    icon: "◎",
    title: "Simplicité pour vous",
    desc: "Votre rôle est de vous concentrer sur vos apprentis. Le nôtre est de vous décharger de tout le reste — logistique, administratif, Erasmus+, coordination terrain.",
  },
  {
    icon: "◉",
    title: "Impact sur les apprentis",
    desc: "Une mobilité réussie transforme un parcours. Nous le savons car nos 3 000 alumni nous le disent. C'est cette conviction qui anime chaque programme que nous construisons.",
  },
  {
    icon: "◐",
    title: "Partenariat durable",
    desc: "Nous construisons des relations à long terme avec les CFA et les OPCO. 50 écoles nous font confiance depuis plusieurs années. Ce n'est pas un hasard.",
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
      {/* Header */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: 140, paddingBottom: 72 }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 420,
          background: "radial-gradient(ellipse, rgba(107,92,231,0.14) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label">À propos</div>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1.08, maxWidth: 680, marginBottom: 24 }}>
            Nous ouvrons le monde<br />
            <span className="gradient-text">aux apprentis.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 600, lineHeight: 1.75 }}>
            AMI Panorama conçoit et coordonne des programmes de mobilité internationale
            pour les CFA, les OPCO et les entreprises françaises depuis plus de 10 ans.
            Basée au Canada, notre équipe opère avec un réseau en Europe, en Amérique
            du Nord, en Asie et en Afrique du Nord.
          </p>
        </div>
      </section>

      {/* Numbers */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
            background: "var(--border)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }} className="numbers-grid">
            {numbers.map(({ value, label }) => (
              <div key={label} style={{ padding: "36px 28px", background: "var(--bg-1)", textAlign: "center" }}>
                <div style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, letterSpacing: "-0.045em", color: "var(--accent-light)", lineHeight: 1, marginBottom: 8 }}>{value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission split */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2,
            background: "var(--border)", border: "1px solid var(--border)",
            borderRadius: 20, overflow: "hidden",
          }} className="mission-grid">
            <div style={{ padding: "52px 48px", background: "var(--bg-1)" }}>
              <div className="section-label">Notre mission</div>
              <h2 style={{ fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 24 }}>
                Rendre la mobilité internationale aussi accessible que possible pour chaque apprenti.
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20 }}>
                Trop de CFA renoncent à la mobilité internationale parce qu'elle leur semble trop
                complexe à organiser. Notre rôle est de supprimer cette barrière — en prenant en charge
                tout ce qui est hors du champ pédagogique de nos clients.
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                Le résultat : des groupes qui partent, des apprentis qui reviennent transformés,
                et des organismes qui répètent l'expérience d'année en année.
              </p>
            </div>
            <div style={{ padding: "52px 48px", background: "var(--bg-2)" }}>
              <div className="section-label">Notre modèle</div>
              <h2 style={{ fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 24 }}>
                Pas un voyagiste. Pas une agence. Un opérateur de mobilité professionnelle.
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20 }}>
                Nous ne vendons pas des voyages. Nous construisons des programmes pédagogiques
                à l'international — avec tout ce qu'une mobilité sérieuse implique : formation,
                visites professionnelles, logistique, assurances et financement.
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
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.035em" }}>Ce sur quoi vous pouvez compter.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="values-grid">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: "rgba(107,92,231,0.1)", border: "1px solid rgba(107,92,231,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: "var(--accent-light)", flexShrink: 0,
                }}>{icon}</div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{title}</h3>
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
            background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 20,
            padding: "52px 48px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0, width: 400, height: 300,
              background: "radial-gradient(ellipse at 80% 20%, rgba(107,92,231,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{ fontSize: 44, color: "var(--accent)", opacity: 0.3, lineHeight: 1, marginBottom: 20, fontFamily: "Georgia, serif" }}>&ldquo;</div>
            <blockquote style={{
              fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 500, letterSpacing: "-0.02em",
              lineHeight: 1.55, color: "var(--text-primary)", maxWidth: 640, marginBottom: 28,
            }}>
              Merci pour votre accompagnement. Vous avez été exceptionnels et vous avez rendu notre voyage incroyable.
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: "#fff",
              }}>F</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Florian Riocreux</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Référent Mobilité — ECEMA</div>
              </div>
            </div>
          </div>
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
            <div className="section-label" style={{ justifyContent: "center" }}>Travaillons ensemble</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.035em", marginBottom: 16, position: "relative" }}>
              Votre prochain groupe mérite<br />une vraie mobilité internationale.
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.75, position: "relative" }}>
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
        }
      `}</style>
    </>
  );
}
