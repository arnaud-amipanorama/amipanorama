import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AMI Panorama — Mobilité internationale des apprentis, clé en main",
  description:
    "AMI Panorama conçoit des programmes de mobilité internationale sur mesure pour les CFA et les entreprises. 7 nuits, 6 destinations, formation + visites d'entreprise + financement Erasmus+.",
};

/* ─── Photo config ──────────────────────────────────────────────────── */
const HERO_IMG   = "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1800&q=80";
const WORKSHOP   = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80";
const VISIT      = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80";

const destinations = [
  {
    city: "Séville",
    country: "Espagne",
    flag: "🇪🇸",
    tag: "Culture & immersion",
    gradient: "linear-gradient(160deg,#B34820,#E8A020)",
    img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&q=75",
  },
  {
    city: "Montréal",
    country: "Canada",
    flag: "🇨🇦",
    tag: "Bilinguisme & innovation",
    gradient: "linear-gradient(160deg,#0D3B70,#1E52D0)",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=75",
  },
  {
    city: "Londres",
    country: "Royaume-Uni",
    flag: "🇬🇧",
    tag: "Business English",
    gradient: "linear-gradient(160deg,#1A2840,#2E4870)",
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=75",
  },
  {
    city: "Maroc",
    country: "Afrique du Nord",
    flag: "🇲🇦",
    tag: "Masterclasses & digital",
    gradient: "linear-gradient(160deg,#8B3A20,#C85C20)",
    img: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=600&q=75",
  },
  {
    city: "New York",
    country: "États-Unis",
    flag: "🇺🇸",
    tag: "Business & culture",
    gradient: "linear-gradient(160deg,#1A2840,#1E3060)",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=75",
  },
  {
    city: "Séoul",
    country: "Corée du Sud",
    flag: "🇰🇷",
    tag: "Tech & monde asiatique",
    gradient: "linear-gradient(160deg,#0D1E40,#1A3580)",
    img: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=75",
  },
];

const stats = [
  { value: "3 000+", label: "apprentis accompagnés" },
  { value: "100+",   label: "groupes coordonnés" },
  { value: "50",     label: "écoles partenaires" },
  { value: "6",      label: "destinations actives" },
];

const included = [
  { icon: "◈", label: "Formation 20h",        sub: "Business English + ateliers sectoriels" },
  { icon: "◎", label: "Visites d'entreprise",  sub: "Immersion professionnelle réelle" },
  { icon: "◉", label: "Activités culturelles", sub: "Programme saisonnier sur mesure" },
  { icon: "◐", label: "Logement 7 nuits",      sub: "Hébergement sécurisé + rooftop" },
  { icon: "◑", label: "Transports inclus",     sub: "Aéroport + navettes quotidiennes" },
  { icon: "◒", label: "Assurances complètes",  sub: "Rapatriement 24h/24 + 200k€" },
  { icon: "◓", label: "Support Erasmus+",      sub: "Dossiers, suivi administratif, reporting" },
];

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO — full-bleed photo + dark navy overlay
      ══════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--navy)",  /* fallback while image loads */
      }}>
        {/* Background photo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          transform: "scale(1.04)",
          transition: "transform 8s ease",
        }} />

        {/* Multi-layer overlay: stronger at bottom for text readability */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, rgba(11,24,41,0.72) 0%, rgba(11,24,41,0.55) 50%, rgba(11,24,41,0.8) 100%)",
        }} />
        {/* Bottom gradient fade into page */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
          background: "linear-gradient(to bottom, transparent, var(--bg))",
        }} />

        {/* Hero content */}
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "140px 24px 120px",
          position: "relative", width: "100%",
        }}>
          {/* Eyebrow badge */}
          <div className="anim-fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: 100, padding: "7px 16px 7px 10px",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "var(--coral)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, color: "#fff", fontWeight: 700,
            }}>✦</div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}>
              Programmes 2025 — Séville · Montréal · Londres · Maroc · New York · Séoul
            </span>
          </div>

          {/* Main headline */}
          <h1 className="anim-fade-up-2" style={{
            fontSize: "clamp(44px, 7vw, 82px)",
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.04,
            color: "#fff",
            maxWidth: 820,
            marginBottom: 8,
          }}>
            La mobilité internationale
          </h1>
          <h1 className="anim-fade-up-2" style={{
            fontSize: "clamp(44px, 7vw, 82px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.04,
            maxWidth: 820,
            marginBottom: 28,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            background: "linear-gradient(130deg, #fff 0%, rgba(232,88,53,0.9) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            des apprentis, clé en main.
          </h1>

          <p className="anim-fade-up-3" style={{
            fontSize: "clamp(16px, 1.8vw, 20px)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.75,
            maxWidth: 560,
            marginBottom: 48,
          }}>
            AMI Panorama conçoit des séjours de 7 nuits sur mesure pour les CFA et
            les entreprises — formation, visites professionnelles, activités culturelles
            et financement Erasmus+, gérés de A à Z.
          </p>

          <div className="anim-fade-up-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
              Demander un programme
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/destinations" className="btn-ghost-light" style={{ fontSize: 15, padding: "14px 32px" }}>
              Voir les destinations
            </Link>
          </div>

          {/* Trust strip */}
          <div className="anim-fade" style={{
            display: "flex", gap: 20, alignItems: "center", marginTop: 56,
            flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ils nous font confiance</span>
            {["ECEMA", "OPCO EP", "Région Île-de-France", "Erasmus+"].map((name, i) => (
              <span key={i} style={{
                fontSize: 12, color: "rgba(255,255,255,0.55)",
                padding: "4px 12px",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 100,
              }}>{name}</span>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          STATS BAR — white section, navy numbers
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 88px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid var(--border)", borderRadius: 16,
            overflow: "hidden", boxShadow: "0 2px 20px rgba(11,24,41,0.06)",
          }} className="stats-grid">
            {stats.map(({ value, label }, i) => (
              <div key={label} style={{
                padding: "36px 28px", background: "var(--bg-1)",
                borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  fontSize: "clamp(30px, 3.5vw, 46px)", fontWeight: 700,
                  letterSpacing: "-0.045em", color: "var(--navy)", lineHeight: 1, marginBottom: 8,
                }}>{value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          DESTINATIONS GRID — photo cards
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
            <div>
              <div className="section-label">6 destinations</div>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 44px)", fontWeight: 700, letterSpacing: "-0.04em", maxWidth: 480 }}>
                Chaque ville est une<br />
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500 }}>expérience à part entière.</span>
              </h2>
            </div>
            <Link href="/destinations" className="btn-ghost">
              Toutes les destinations
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* 6-card grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }} className="dest-grid">
            {destinations.map(({ city, country, flag, tag, gradient, img }) => (
              <Link href="/destinations" key={city} className="dest-card" style={{
                position: "relative",
                display: "block",
                height: 240,
                borderRadius: 16,
                overflow: "hidden",
                textDecoration: "none",
                background: gradient, /* gradient fallback */
              }}>
                {/* Photo background */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 0.6s ease",
                }} className="dest-photo" />
                {/* Gradient overlay for text legibility */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(11,24,41,0.1) 0%, rgba(11,24,41,0.72) 100%)",
                }} />
                {/* Content */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "24px 24px 22px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{flag}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{country}</span>
                  </div>
                  <div style={{ fontSize: "clamp(22px, 2.8vw, 28px)", fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1, marginBottom: 10 }}>{city}</div>
                  <span style={{
                    display: "inline-flex", fontSize: 11, fontWeight: 500,
                    color: "rgba(255,255,255,0.75)",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 100, padding: "4px 12px",
                    backdropFilter: "blur(8px)",
                  }}>{tag}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          PROGRAMME INCLUDED — 2-column editorial
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 96px", background: "var(--bg-1)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
          }} className="prog-editorial">

            {/* Left: photo collage */}
            <div style={{ position: "relative" }}>
              {/* Main image */}
              <div style={{
                borderRadius: 16, overflow: "hidden", height: 420,
                backgroundImage: `url(${WORKSHOP})`,
                backgroundSize: "cover", backgroundPosition: "center",
                boxShadow: "0 16px 48px rgba(11,24,41,0.12)",
              }} />
              {/* Floating card */}
              <div style={{
                position: "absolute", bottom: -20, right: -20,
                background: "var(--navy)", borderRadius: 14, padding: "20px 24px",
                boxShadow: "0 8px 32px rgba(11,24,41,0.2)",
                minWidth: 160,
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>7 nuits</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>tout inclus</div>
              </div>
              {/* Second floating card */}
              <div style={{
                position: "absolute", top: 24, right: -16,
                background: "var(--bg-1)", borderRadius: 12, padding: "14px 18px",
                boxShadow: "0 6px 24px rgba(11,24,41,0.1)",
                border: "1px solid var(--border)",
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--coral)", letterSpacing: "-0.03em", lineHeight: 1 }}>Erasmus+</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>financement inclus</div>
              </div>
            </div>

            {/* Right: content */}
            <div>
              <div className="section-label">Ce qui est inclus</div>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 20 }}>
                Un programme complet.<br />
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500 }}>Zéro coordination de votre côté.</span>
              </h2>
              <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 36, maxWidth: 460 }}>
                De la formation aux assurances, en passant par les visites d'entreprise et le financement Erasmus+, tout est coordonné par notre équipe. Vous vous concentrez sur vos apprentis.
              </p>

              {/* Included items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
                {included.map(({ icon, label, sub }) => (
                  <div key={label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                      background: "var(--bg-2)", border: "1px solid var(--border)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, color: "var(--blue)",
                    }}>{icon}</div>
                    <div style={{ paddingTop: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text-primary)", marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/notre-programme" className="btn-primary">
                  Découvrir le programme
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="/contact" className="btn-ghost">Demander un devis</Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          PROFESSIONAL VISIT PHOTO BAND
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden",
            boxShadow: "0 4px 24px rgba(11,24,41,0.06)",
          }} className="band-grid">
            {/* Left: photo */}
            <div style={{
              height: 360,
              backgroundImage: `url(${VISIT})`,
              backgroundSize: "cover", backgroundPosition: "center",
            }} />
            {/* Right: copy */}
            <div style={{ padding: "52px 48px", background: "var(--navy)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="section-label-light">Visites professionnelles</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.2, marginBottom: 20 }}>
                Vos apprentis ne visitent pas des vitrines.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 32, maxWidth: 400 }}>
                Ils entrent dans les coulisses d'entreprises locales sélectionnées pour leur pertinence sectorielle — échanges directs avec des professionnels, découverte des pratiques de travail internationales.
              </p>
              <Link href="/notre-programme" className="btn-ghost-light" style={{ alignSelf: "flex-start" }}>
                Voir le programme
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          TESTIMONIAL — editorial quote
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 96px", background: "var(--bg-1)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 2fr", gap: 0,
            border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden",
          }} className="quote-grid">
            {/* Left: decorative */}
            <div style={{
              background: "var(--navy-2)",
              padding: "52px 44px",
              display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 20,
            }}>
              <div style={{
                fontSize: 80, lineHeight: 1, color: "var(--coral)", fontFamily: "Georgia, serif",
                opacity: 0.7,
              }}>&ldquo;</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "var(--coral)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "#fff",
                }}>F</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Florian Riocreux</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Référent Mobilité · ECEMA</div>
                </div>
              </div>
            </div>

            {/* Right: quote + context */}
            <div style={{ padding: "52px 52px", background: "var(--bg-1)" }}>
              <div className="section-label" style={{ marginBottom: 20 }}>Témoignage</div>
              <blockquote style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.8vw, 30px)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                lineHeight: 1.5,
                color: "var(--navy)",
                maxWidth: 580,
                marginBottom: 36,
              }}>
                Merci pour votre accompagnement. Vous avez été exceptionnels et vous avez rendu notre voyage incroyable.
              </blockquote>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { v: "3 000+", l: "apprentis accompagnés" },
                  { v: "50",     l: "écoles partenaires" },
                  { v: "98%",    l: "taux de satisfaction" },
                ].map(({ v, l }) => (
                  <div key={l}>
                    <div style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--blue)", lineHeight: 1, marginBottom: 4 }}>{v}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          FINAL CTA — full navy section
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 0", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 96 }}>
          <div style={{
            background: "var(--navy)",
            borderRadius: 24, padding: "80px 64px",
            position: "relative", overflow: "hidden", textAlign: "center",
          }}>
            {/* Decorative glow spots */}
            <div style={{
              position: "absolute", top: "-30%", left: "20%",
              width: 400, height: 400, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(30,82,208,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-20%", right: "15%",
              width: 350, height: 350, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(232,88,53,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />

            <div className="section-label-light" style={{ justifyContent: "center" }}>Passons à l&apos;action</div>
            <h2 style={{
              fontSize: "clamp(30px, 4.5vw, 56px)", fontWeight: 700,
              letterSpacing: "-0.045em", color: "#fff",
              marginBottom: 8, position: "relative", lineHeight: 1.1,
            }}>
              Votre prochain groupe part
            </h2>
            <h2 style={{
              fontSize: "clamp(30px, 4.5vw, 56px)",
              letterSpacing: "-0.02em",
              marginBottom: 24, position: "relative", lineHeight: 1.1,
              fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500,
              background: "linear-gradient(130deg, rgba(255,255,255,0.9), var(--coral))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              dans combien de mois ?
            </h2>
            <p style={{
              fontSize: 17, color: "rgba(255,255,255,0.6)",
              maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.75, position: "relative",
            }}>
              Programme sur mesure, financement Erasmus+ si applicable, coordination
              complète. Premier échange gratuit et sans engagement.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/contact" className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
                Demander un programme
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/destinations" className="btn-ghost-light" style={{ fontSize: 15, padding: "14px 32px" }}>
                Explorer les destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .dest-grid     { grid-template-columns: repeat(2, 1fr) !important; }
          .prog-editorial { grid-template-columns: 1fr !important; }
          .prog-editorial > div:first-child { height: 320px !important; }
          .band-grid     { grid-template-columns: 1fr !important; }
          .band-grid > div:first-child { height: 260px !important; }
          .quote-grid    { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .dest-grid  { grid-template-columns: 1fr !important; }
        }
        /* Dest card photo zoom on hover */
        .dest-card:hover .dest-photo {
          transform: scale(1.06) !important;
        }
      `}</style>
    </>
  );
}
