import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AMI Panorama — Mobilité internationale des apprentis, clé en main",
  description:
    "AMI Panorama conçoit des programmes de mobilité internationale sur mesure pour les CFA et les entreprises. 7 nuits, 6 destinations, formation + visites + activités culturelles. Financement Erasmus+ inclus.",
};

const stats = [
  { value: "3 000+", label: "apprentis accompagnés" },
  { value: "100+", label: "groupes coordonnés" },
  { value: "50", label: "écoles partenaires" },
  { value: "6", label: "destinations actives" },
];

const destinations = [
  { city: "Séville", country: "Espagne", tag: "Culture & immersion", color: "#E85D26" },
  { city: "Montréal", country: "Canada", tag: "Bilinguisme & innovation", color: "#2E7FE8" },
  { city: "Londres", country: "Royaume-Uni", tag: "Business English", color: "#6B5CE7" },
  { city: "Maroc", country: "Afrique du Nord", tag: "Masterclasses & digital", color: "#E8A020" },
  { city: "New York", country: "États-Unis", tag: "Business & culture", color: "#26C4A8" },
  { city: "Séoul", country: "Corée du Sud", tag: "Tech & monde asiatique", color: "#E82656" },
];

const included = [
  { icon: "◈", label: "Formation professionnelle", sub: "20h modulaires, Business English, ateliers sectoriels" },
  { icon: "◎", label: "Visites d'entreprise", sub: "Échanges avec des professionnels locaux et coulisses sectorielles" },
  { icon: "◉", label: "Activités culturelles", sub: "Programme saisonnier, sites iconiques, immersion locale" },
  { icon: "◐", label: "Logement 7 nuits", sub: "Hébergement sécurisé, rooftop, espaces de vie communs" },
  { icon: "◑", label: "Transports inclus", sub: "Transferts aéroport + navettes quotidiennes aller-retour" },
  { icon: "◒", label: "Assurances complètes", sub: "Rapatriement 24h/24, hospitalisation jusqu'à 200 000 €" },
  { icon: "◓", label: "Support Erasmus+", sub: "Montage de dossiers, suivi administratif et financier" },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: 152, paddingBottom: 112 }}>
        <div style={{
          position: "absolute", top: "-5%", left: "50%", transform: "translateX(-50%)",
          width: 800, height: 560,
          background: "radial-gradient(ellipse, rgba(107,92,231,0.16) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28,
            background: "rgba(107,92,231,0.08)", border: "1px solid rgba(107,92,231,0.2)",
            borderRadius: 100, padding: "6px 14px 6px 8px",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff",
            }}>✦</div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--accent-light)", letterSpacing: "0.04em" }}>
              Programmes 2025 — 6 destinations disponibles
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(42px, 6.5vw, 76px)",
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.05,
            marginBottom: 28,
            maxWidth: 820,
          }}>
            La mobilité internationale<br />
            <span className="gradient-text">des apprentis, clé en main.</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 1.8vw, 19px)",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            maxWidth: 560,
            marginBottom: 48,
          }}>
            AMI Panorama conçoit des séjours de 7 nuits sur mesure pour les CFA et les entreprises —
            formation, visites professionnelles, activités culturelles et financement Erasmus+ gérés
            de A à Z.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">
              Demander un programme
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/destinations" className="btn-ghost">Voir les destinations</Link>
          </div>

          {/* Trust strip */}
          <div style={{ display: "flex", gap: 24, alignItems: "center", marginTop: 52, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Ils nous font confiance :</span>
            {["ECEMA", "OPCO EP", "Région Île-de-France", "Erasmus+", "50 CFAs partenaires"].map((name, i) => (
              <span key={i} style={{
                fontSize: 12, color: "var(--text-secondary)",
                padding: "4px 12px", border: "1px solid var(--border)", borderRadius: 100,
              }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ padding: "0 24px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
            background: "var(--border)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }} className="stats-grid">
            {stats.map(({ value, label }) => (
              <div key={label} style={{ padding: "36px 28px", background: "var(--bg-1)" }}>
                <div style={{
                  fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 700,
                  letterSpacing: "-0.045em", color: "var(--accent-light)", lineHeight: 1, marginBottom: 8,
                }}>{value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section style={{ padding: "0 24px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 20 }}>
            <div>
              <div className="section-label">Ce qui est inclus</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.035em", maxWidth: 520 }}>
                Un programme complet.<br />Zéro coordination de votre côté.
              </h2>
            </div>
            <Link href="/notre-programme" className="btn-ghost" style={{ flexShrink: 0 }}>
              Détail du programme
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
            background: "var(--border)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }} className="included-grid">
            {included.map(({ icon, label, sub }) => (
              <div key={label} className="hover-bg" style={{
                padding: "32px 28px", background: "var(--bg-1)",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: "rgba(107,92,231,0.1)", border: "1px solid rgba(107,92,231,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, color: "var(--accent-light)", marginBottom: 16,
                }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>{sub}</div>
              </div>
            ))}
            {/* Last cell — CTA */}
            <div style={{
              padding: "32px 28px", background: "rgba(107,92,231,0.06)",
              display: "flex", flexDirection: "column", justifyContent: "center", gap: 12,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent-light)", lineHeight: 1.4 }}>
                Tout compris.<br />Vous vous concentrez sur vos apprentis.
              </div>
              <Link href="/contact" className="btn-primary" style={{ fontSize: 12, padding: "9px 16px" }}>
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Destinations preview ── */}
      <section style={{ padding: "0 24px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
            <div>
              <div className="section-label">Destinations</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.035em" }}>
                6 destinations.<br />Un programme unique à chaque fois.
              </h2>
            </div>
            <Link href="/destinations" className="btn-ghost" style={{ flexShrink: 0 }}>
              Toutes les destinations
            </Link>
          </div>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
          }} className="dest-grid">
            {destinations.map(({ city, country, tag, color }) => (
              <Link href="/destinations" key={city} className="dest-card" style={{
                display: "block",
                background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 14,
                padding: "32px 28px", textDecoration: "none",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: color, marginBottom: 20,
                  boxShadow: `0 0 12px ${color}80`,
                }} />
                <div style={{ fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>{city}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>{country}</div>
                <div style={{
                  display: "inline-flex", fontSize: 11, fontWeight: 500,
                  color: "var(--text-secondary)", background: "var(--bg-3)",
                  border: "1px solid var(--border)", borderRadius: 100, padding: "4px 12px",
                }}>{tag}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section style={{ padding: "0 24px 88px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "56px 52px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, right: 0, width: 400, height: 400,
              background: "radial-gradient(ellipse at 80% 20%, rgba(107,92,231,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              fontSize: 48, color: "var(--accent)", opacity: 0.3,
              lineHeight: 1, marginBottom: 24, fontFamily: "Georgia, serif",
            }}>&ldquo;</div>
            <blockquote style={{
              fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 500,
              letterSpacing: "-0.02em", lineHeight: 1.5,
              color: "var(--text-primary)", maxWidth: 680, marginBottom: 32,
              fontStyle: "normal",
            }}>
              Merci pour votre accompagnement. Vous avez été exceptionnels et vous avez
              rendu notre voyage incroyable.
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "var(--accent)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff",
              }}>F</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Florian Riocreux</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Référent Mobilité — ECEMA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: "0 24px 104px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "72px 52px",
            position: "relative", overflow: "hidden", textAlign: "center",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse at 50% 0%, rgba(107,92,231,0.14) 0%, transparent 60%)",
            }} />
            <div className="section-label" style={{ justifyContent: "center" }}>Passons à l&apos;action</div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 700, letterSpacing: "-0.04em",
              marginBottom: 18, position: "relative",
            }}>
              Votre prochain groupe part<br />
              <span className="gradient-text">dans combien de mois ?</span>
            </h2>
            <p style={{
              fontSize: 16, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto 40px",
              lineHeight: 1.75, position: "relative",
            }}>
              Parlez-nous de votre projet. Nous vous construisons un programme sur mesure,
              avec financement Erasmus+ si applicable. Premier échange gratuit.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/contact" className="btn-primary">
                Demander un programme
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/notre-programme" className="btn-ghost">Voir ce qui est inclus</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .dest-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .included-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dest-grid { grid-template-columns: 1fr !important; }
          .included-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
