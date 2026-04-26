import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import AnimateOnView from "@/components/AnimateOnView";

export const metadata: Metadata = {
  title: "AMI Panorama — Opérateur de mobilité internationale pour les CFA et les établissements",
  description:
    "AMI Panorama conçoit des programmes de mobilité internationale structurés pour les CFA, les écoles et les établissements d'enseignement supérieur. Formation professionnelle, visites d'entreprise, encadrement terrain et accompagnement administratif de A à Z.",
};

const destinations = [
  {
    city: "Séville",
    country: "Espagne",
    flag: "🇪🇸",
    tag: "Culture & immersion",
    gradient: "linear-gradient(170deg,rgba(100,30,10,0.68),rgba(180,80,20,0.55))",
    img: "https://images.pexels.com/photos/3408354/pexels-photo-3408354.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    city: "Montréal",
    country: "Canada",
    flag: "🇨🇦",
    tag: "Bilinguisme & innovation",
    gradient: "linear-gradient(170deg,rgba(8,28,60,0.68),rgba(20,52,140,0.55))",
    img: "https://images.pexels.com/photos/3584819/pexels-photo-3584819.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    city: "Londres",
    country: "Royaume-Uni",
    flag: "🇬🇧",
    tag: "Business English",
    gradient: "linear-gradient(170deg,rgba(10,20,44,0.68),rgba(24,44,88,0.55))",
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Maroc",
    country: "Afrique du Nord",
    flag: "🇲🇦",
    tag: "Masterclasses & digital",
    gradient: "linear-gradient(170deg,rgba(80,30,10,0.68),rgba(160,80,20,0.55))",
    img: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
  {
    city: "New York",
    country: "États-Unis",
    flag: "🇺🇸",
    tag: "Business & culture",
    gradient: "linear-gradient(170deg,rgba(10,18,40,0.68),rgba(20,38,80,0.55))",
    img: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80",
  },
  {
    city: "Séoul",
    country: "Corée du Sud",
    flag: "🇰🇷",
    tag: "Tech & monde asiatique",
    gradient: "linear-gradient(170deg,rgba(6,14,36,0.68),rgba(16,32,80,0.55))",
    img: "https://images.pexels.com/photos/3714896/pexels-photo-3714896.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
  },
];

const stats = [
  { value: "3 000+", label: "apprentis accompagnés" },
  { value: "100+",   label: "groupes coordonnés" },
  { value: "50",     label: "écoles partenaires" },
  { value: "6",      label: "destinations actives" },
];

const included = [
  { num: "01", label: "Formation 20h",        sub: "Business English + ateliers sectoriels" },
  { num: "02", label: "Visites d'entreprise",  sub: "Immersion professionnelle réelle" },
  { num: "03", label: "Activités culturelles", sub: "Programme saisonnier sur mesure" },
  { num: "04", label: "Logement 7 nuits",      sub: "Hébergement sécurisé + rooftop" },
  { num: "05", label: "Transports inclus",     sub: "Aéroport + navettes quotidiennes" },
  { num: "06", label: "Assurances complètes",  sub: "Rapatriement 24h/24 + 200 k€" },
  { num: "07", label: "Ingénierie administrative", sub: "Structuration, dispositifs, suivi documentaire" },
];

export default function HomePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO — art-directed, no photo
          Premium atmospheric layout: dark navy +
          animated glow orbs + subtle world meridian
          grid + editorial typography
      ══════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--navy)",
      }}>
        {/* ── Atmospheric glow orbs ── */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* ── World meridian grid (SVG, very subtle) ── */}
        <svg
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            opacity: 0.05, pointerEvents: "none",
          }}
          viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        >
          {/* Latitude lines */}
          {[100, 220, 340, 460, 580, 700, 820].map(y => (
            <line key={y} x1="0" y1={y} x2="1440" y2={y}
              stroke="rgba(255,255,255,0.9)" strokeWidth="0.7" />
          ))}
          {/* Longitude curves — vertical meridians as paths */}
          {[120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200, 1320].map(x => (
            <path key={x}
              d={`M${x} 0 C${x - 40} 450 ${x + 40} 450 ${x} 900`}
              fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.7"
            />
          ))}
          {/* Central equator ellipse */}
          <ellipse cx="720" cy="450" rx="680" ry="160"
            fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.9" />
          {/* Great circle diagonal */}
          <path d="M200 0 C500 250 940 650 1240 900"
            fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.7" />
          <path d="M1240 0 C940 250 500 650 200 900"
            fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="0.7" />
        </svg>

        {/* ── Hero content ── */}
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px",
          position: "relative", width: "100%",
        }}>
          {/* Eyebrow */}
          <div className="anim-fade-up" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            marginBottom: 36,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "var(--coral)", boxShadow: "0 0 12px rgba(232,88,53,0.6)",
              animation: "heroPulse 2.5s ease infinite",
            }} />
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
            }}>Opérateur de mobilité professionnelle · Depuis 2014</span>
          </div>

          {/* Main headline */}
          <h1 style={{ marginBottom: 28 }}>
            <span className="anim-fade-up-2" style={{
              display: "block",
              fontSize: "clamp(52px, 8vw, 104px)",
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.0,
              color: "#fff",
            }}>
              Ouvrir le monde
            </span>
            <span className="anim-fade-up-3" style={{
              display: "block",
              fontSize: "clamp(52px, 8vw, 104px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "transparent",
              WebkitTextStroke: "0px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(232,88,53,0.85) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              paddingBottom: 4,
            }}>
              aux apprentis.
            </span>
          </h1>

          {/* Description + CTAs */}
          <div className="anim-fade-up-4" style={{
            display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start",
            marginBottom: 64,
          }}>
            <p style={{
              fontSize: "clamp(15px, 1.6vw, 18px)",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.75, maxWidth: 460,
            }}>
              AMI Panorama conçoit des programmes de mobilité internationale
              pour les CFA et les établissements d'enseignement supérieur —
              formation structurée, visites professionnelles, encadrement terrain
              et accompagnement administratif de A à Z.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", paddingTop: 4 }}>
              <Link href="/contact" className="btn-primary">
                Demander un programme
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/destinations" className="btn-ghost-light">
                Voir les destinations
              </Link>
            </div>
          </div>

          {/* Destination chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {destinations.map(({ city, flag }, i) => (
              <Link key={city} href="/destinations" style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "7px 14px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 100,
                fontSize: 12, color: "rgba(255,255,255,0.55)",
                transition: "all 0.2s",
                animation: `fadeInUp 0.6s ${0.6 + i * 0.08}s ease both`,
              }}>
                <span style={{ fontSize: 13 }}>{flag}</span>
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          opacity: 0.3,
          animation: "fadeIn 1.5s 1.5s ease both",
        }}>
          <div style={{
            width: 1, height: 48, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6))",
            animation: "heroPulse 2s ease infinite",
          }} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg-1)", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        }} className="stats-bar">
          {stats.map(({ value, label }, i, arr) => (
            <AnimateOnView key={label} delay={i * 0.07} style={{
              padding: "32px 28px", textAlign: "center",
              borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700,
                letterSpacing: "-0.05em", color: "var(--text-primary)", lineHeight: 1, marginBottom: 6,
              }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.01em" }}>{label}</div>
            </AnimateOnView>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DESTINATIONS PREVIEW GRID
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "80px 24px 0", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-end",
              marginBottom: 40, flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <div className="section-label">6 destinations</div>
                <h2 style={{
                  fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
                  letterSpacing: "-0.04em", maxWidth: 480,
                }}>
                  Le monde,<br />à portée de groupe.
                </h2>
              </div>
              <Link href="/destinations" style={{
                fontSize: 13, color: "var(--blue)", fontWeight: 500,
                display: "flex", alignItems: "center", gap: 6,
              }} className="dest-link-hover">
                Voir toutes les destinations
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </AnimateOnView>

          <AnimateOnView delay={0.1}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "240px 240px",
              gap: 12,
            }} className="dest-grid">
              {destinations.map(({ city, country, flag, tag, gradient, img }) => (
                <Link key={city} href="/destinations" className="dest-card" style={{
                  position: "relative", borderRadius: 16, overflow: "hidden",
                  display: "block", textDecoration: "none",
                }}>
                  {/* Background image — isolated div so we can zoom it independently */}
                  <div className="dest-card-bg" style={{
                    position: "absolute", inset: 0,
                    backgroundImage: `${gradient}, url('${img}')`,
                    backgroundSize: "cover, cover",
                    backgroundPosition: "center",
                  }} />
                  {/* Hover overlay */}
                  <div className="dest-card-overlay" style={{
                    position: "absolute", inset: 0,
                    background: "rgba(11,24,41,0.0)",
                    transition: "background 0.35s ease",
                  }} />
                  {/* Content */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "20px 20px 20px",
                    background: "linear-gradient(to top, rgba(11,24,41,0.82) 0%, transparent 100%)",
                  }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>{tag}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{flag}</span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>{city}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginLeft: 2 }}>{country}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROGRAMME — real photo + included list
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "96px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
          }} className="prog-grid">
            {/* Photo side */}
            <div style={{ position: "relative" }}>
              <div style={{
                borderRadius: 20, overflow: "hidden",
                aspectRatio: "4/3",
                position: "relative",
              }}>
                <Image
                  src="/formation-seville.jpg"
                  alt="Session de formation professionnelle AMI Panorama à Séville"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center 30%" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay tint */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(11,24,41,0.08)",
                }} />
              </div>
              {/* Floating card */}
              <div style={{
                position: "absolute", bottom: -20, right: -20,
                background: "var(--navy)", borderRadius: 14,
                padding: "18px 22px", minWidth: 180,
                boxShadow: "0 8px 40px rgba(11,24,41,0.28)",
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6,
                }}>Formation réelle</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em" }}>20h</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>de contenu professionnel</div>
              </div>
              {/* Encadrement badge */}
              <div style={{
                position: "absolute", top: -16, left: -16,
                background: "var(--coral)", borderRadius: 10,
                padding: "12px 18px",
                boxShadow: "0 4px 20px rgba(232,88,53,0.35)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>Encadrement</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>24h / 7j</div>
              </div>
            </div>

            {/* Content side */}
            <div>
              <div className="section-label">Ce qui est inclus</div>
              <h2 style={{
                fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700,
                letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 16,
              }}>
                Un programme complet.<br />
                <span className="gradient-text">Coordonné de bout en bout.</span>
              </h2>
              <p style={{
                fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 36,
              }}>
                AMI Panorama prend en charge l'intégralité de l'organisation pour que
                vos apprentis vivent une expérience internationale structurée et
                professionnalisante. Vous vous concentrez sur la pédagogie.
                Nous gérons tout le reste.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 40 }}>
                {included.map(({ num, label, sub }) => (
                  <div key={num} style={{
                    display: "flex", gap: 16, alignItems: "flex-start",
                    padding: "13px 0", borderBottom: "1px solid var(--border)",
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                      color: "var(--text-muted)", flexShrink: 0, paddingTop: 3, minWidth: 22,
                    }}>{num}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{label}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>
                    </div>
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: "var(--blue)", flexShrink: 0, marginTop: 8,
                    }} />
                  </div>
                ))}
              </div>
              <Link href="/notre-programme" className="btn-primary">
                Voir le programme complet
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
          </AnimateOnView>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS — process steps (no photo needed)
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
            <div style={{
              background: "var(--bg-2)", border: "1px solid var(--border)",
              borderRadius: 20, padding: "56px 48px",
            }}>
              <div style={{ marginBottom: 48, textAlign: "center" }}>
                <div className="section-label" style={{ justifyContent: "center" }}>Notre méthode</div>
                <h2 style={{
                  fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700,
                  letterSpacing: "-0.035em",
                }}>
                  Simple pour vous, complet pour vos apprentis.
                </h2>
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24,
              }} className="process-grid">
                {[
                  { num: "1", title: "Vous nous contactez", desc: "Premier échange pour comprendre votre groupe, votre filière, vos dates." },
                  { num: "2", title: "Nous proposons", desc: "Programme sur mesure en 24h — destination, hébergement, planning complet." },
                  { num: "3", title: "Nous coordonnons", desc: "Logistique, formations, visites professionnelles, assurances et démarches administratives — tout est pris en charge." },
                  { num: "4", title: "Vos apprentis partent", desc: "Vous accompagnez. Nous assurons tout sur place. Tout est prévu." },
                ].map(({ num, title, desc }) => (
                  <div key={num} style={{ position: "relative" }}>
                    {/* Connector line toward next step */}
                    {num !== "4" && (
                      <div className="process-connector" />
                    )}
                    <div style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                      color: "var(--blue)", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "rgba(30,82,208,0.12)", border: "1px solid rgba(30,82,208,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700, color: "var(--blue)",
                        position: "relative", zIndex: 1,
                      }}>{num}</div>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>{title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIAL
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
          <div style={{
            background: "var(--navy)", borderRadius: 20, overflow: "hidden",
            display: "grid", gridTemplateColumns: "1fr 380px",
          }} className="testimonial-grid">
            <div style={{ padding: "60px 56px", position: "relative" }}>
              <div style={{
                position: "absolute", top: 0, left: 0, width: 500, height: "100%",
                background: "radial-gradient(ellipse at left, rgba(30,82,208,0.18) 0%, transparent 65%)",
                pointerEvents: "none",
              }} />
              <div style={{
                fontSize: 56, lineHeight: 0.8, marginBottom: 28,
                fontFamily: "Georgia, serif", color: "rgba(232,88,53,0.4)",
                position: "relative",
              }}>&ldquo;</div>
              <blockquote style={{
                fontSize: "clamp(16px, 2vw, 22px)", fontWeight: 500,
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                letterSpacing: "-0.01em", lineHeight: 1.6,
                color: "#fff", maxWidth: 520, marginBottom: 36, position: "relative",
              }}>
                Merci pour votre accompagnement. Vous avez été exceptionnels
                et vous avez rendu notre voyage incroyable.
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "var(--blue)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "#fff",
                }}>F</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Florian Riocreux</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Référent Mobilité — ECEMA</div>
                </div>
              </div>
            </div>
            {/* Right stat panel */}
            <div style={{
              background: "rgba(255,255,255,0.04)", borderLeft: "1px solid rgba(255,255,255,0.08)",
              padding: "60px 40px", display: "flex", flexDirection: "column",
              justifyContent: "center", gap: 32,
            }}>
              {[
                { value: "3 000+", label: "apprentis depuis 10 ans" },
                { value: "96 %", label: "de satisfaction déclarée" },
                { value: "50", label: "CFA partenaires actifs" },
              ].map(({ value, label }) => (
                <div key={value}>
                  <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.05em", color: "#fff", lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 5 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          </AnimateOnView>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
          <div style={{
            background: "var(--navy)", borderRadius: 20,
            padding: "80px 48px", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Glows */}
            <div style={{
              position: "absolute", top: "-80px", left: "10%",
              width: 500, height: 380,
              background: "radial-gradient(ellipse, rgba(30,82,208,0.3) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-60px", right: "10%",
              width: 380, height: 300,
              background: "radial-gradient(ellipse, rgba(232,88,53,0.22) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <div className="section-label-light" style={{ justifyContent: "center" }}>
              Construisons votre programme
            </div>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 500,
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              letterSpacing: "-0.025em", lineHeight: 1.2,
              color: "#fff", maxWidth: 640, margin: "0 auto 20px", position: "relative",
            }}>
              Une proposition sur mesure,<br />sous 24 heures ouvrables.
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 480,
              margin: "0 auto 44px", lineHeight: 1.75, position: "relative",
            }}>
              Partagez votre projet avec nous — destination envisagée, filière, dates,
              taille du groupe. Nous revenons vers vous avec une proposition complète.
            </p>
            <div style={{
              display: "flex", gap: 14, justifyContent: "center",
              flexWrap: "wrap", position: "relative",
            }}>
              <Link href="/contact" className="btn-primary">
                Demander un programme
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/destinations" className="btn-ghost-light">Explorer les destinations</Link>
            </div>
          </div>
          </AnimateOnView>
        </div>
      </section>

      {/* ══ Hero & animation styles ══ */}
      <style>{`
        /* Hero glow orbs */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .hero-orb-1 {
          width: 600px; height: 500px;
          background: radial-gradient(ellipse, rgba(30,82,208,0.22) 0%, transparent 70%);
          bottom: -100px; left: -80px;
          animation: orbFloat1 18s ease-in-out infinite;
        }
        .hero-orb-2 {
          width: 480px; height: 420px;
          background: radial-gradient(ellipse, rgba(232,88,53,0.16) 0%, transparent 70%);
          top: -60px; right: -60px;
          animation: orbFloat2 22s ease-in-out infinite;
        }
        .hero-orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(ellipse, rgba(75,118,240,0.12) 0%, transparent 70%);
          top: 40%; left: 50%;
          animation: orbFloat3 14s ease-in-out infinite;
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(80px, -60px) scale(1.08); }
          66%       { transform: translate(-40px, 40px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-70px, 50px) scale(1.1); }
          70%       { transform: translate(50px, -30px) scale(0.92); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -50%) scale(1.4); opacity: 0.7; }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* Destination cards */
        .dest-card {
          transition: transform 0.32s ease, box-shadow 0.32s ease;
        }
        .dest-card:hover {
          transform: translateY(-5px) scale(1.01) !important;
          box-shadow: 0 20px 48px rgba(11,24,41,0.28) !important;
        }
        .dest-card:hover .dest-card-overlay {
          background: rgba(11,24,41,0.18) !important;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .dest-grid { grid-template-columns: repeat(2,1fr) !important; grid-template-rows: auto !important; }
          .prog-grid { grid-template-columns: 1fr !important; }
          .stats-bar { grid-template-columns: repeat(2,1fr) !important; }
          .testimonial-grid { grid-template-columns: 1fr !important; }
          .process-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .dest-grid { grid-template-columns: 1fr !important; }
          .stats-bar { grid-template-columns: repeat(2,1fr) !important; }
          .process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
