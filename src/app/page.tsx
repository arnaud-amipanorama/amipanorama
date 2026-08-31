import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import AnimateOnView from "@/components/AnimateOnView";
import HeroGallery from "./HeroGallery";
import HeroBackdrop from "./HeroBackdrop";
import { HERO_IMAGE, HERO_FOCUS, HERO_PHOTOS } from "./heroConfig";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Séjours à l'international pour les CFA et les écoles",
  description:
    "AMI Panorama organise des séjours à l'international pour les étudiants. Formation, hébergement, activités et accompagnement sont inclus.",
};

const destinations: {
  city: string; country: string; flag: string; tag: string;
  gradient: string; img: string; phare?: boolean;
}[] = [
  // HIÉRARCHIE, ne pas réordonner sans arbitrage éditorial :
  //   1. Montréal = destination historique et principale  → carte phare
  //   2. Séville  = deuxième pilier, grande dest. européenne → carte phare
  //   3. New York = destination iconique et aspirationnelle → 1re carte secondaire,
  //      volontairement mise en lumière (vraie photo de groupe) MAIS sans badge
  //      "phare" : elle fait rêver, elle n'est pas l'un des deux piliers.
  //
  // Les cartes phares portent de VRAIES photos de groupe : à ce format, la preuve
  // terrain vaut mieux qu'un visuel de banque d'images. Les autres cartes restent
  // city-led (visuel de ville), cf. DestinationExplorer.
  {
    city: "Montréal",
    country: "Canada",
    flag: "🇨🇦",
    tag: "Destination historique · Amérique du Nord",
    phare: true,
    gradient: "linear-gradient(170deg,rgba(8,28,60,0.30),rgba(20,52,140,0.18))",
    img: "/Assets/groups/montreal-sunset.jpg",
  },
  {
    city: "Séville",
    country: "Espagne",
    flag: "🇪🇸",
    tag: "Deuxième pilier · Culture & immersion",
    phare: true,
    gradient: "linear-gradient(170deg,rgba(90,34,10,0.30),rgba(170,76,20,0.18))",
    img: "/Assets/groups/seville-garden.jpg",
  },
  {
    city: "New York",
    country: "États-Unis",
    flag: "🇺🇸",
    tag: "Destination iconique · Business & culture",
    gradient: "linear-gradient(170deg,rgba(10,18,40,0.34),rgba(20,38,80,0.20))",
    img: "/Assets/groups/newyork-pano.jpg",
  },
  {
    city: "Londres",
    country: "Royaume-Uni",
    flag: "🇬🇧",
    tag: "Business English",
    gradient: "linear-gradient(170deg,rgba(10,20,44,0.42),rgba(24,44,88,0.28))",
    img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  },
  {
    city: "Malte",
    country: "Méditerranée",
    flag: "🇲🇹",
    tag: "English immersion",
    gradient: "linear-gradient(170deg,rgba(8,28,70,0.42),rgba(18,50,130,0.28))",
    img: "/Assets/destinations/Malte Destination.png",
  },
  {
    city: "Maroc",
    country: "Afrique du Nord",
    flag: "🇲🇦",
    tag: "Immersion & interculturel",
    gradient: "linear-gradient(170deg,rgba(80,30,10,0.42),rgba(160,80,20,0.28))",
    img: "/Assets/destinations/Maroc.jpg",
  },
  {
    city: "Berlin",
    country: "Allemagne",
    flag: "🇩🇪",
    tag: "Entrepreneuriat & innovation",
    gradient: "linear-gradient(170deg,rgba(60,20,10,0.42),rgba(120,50,20,0.28))",
    img: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80",
  },
  {
    city: "Rome",
    country: "Italie",
    flag: "🇮🇹",
    tag: "Culture & économie italienne",
    gradient: "linear-gradient(170deg,rgba(90,35,8,0.42),rgba(160,70,18,0.28))",
    img: "/Assets/destinations/Rome.jpg",
  },
  {
    city: "Miami",
    country: "États-Unis",
    flag: "🇺🇸",
    tag: "Business English & ouverture US",
    gradient: "linear-gradient(170deg,rgba(8,24,55,0.42),rgba(18,44,100,0.28))",
    img: "/Assets/destinations/Miami-unsplash.jpg",
  },
  {
    city: "Séoul",
    country: "Corée du Sud",
    flag: "🇰🇷",
    tag: "Tech & monde asiatique",
    gradient: "linear-gradient(170deg,rgba(6,14,36,0.42),rgba(16,32,80,0.28))",
    img: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80",
  },
];

const IconUsers = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const IconGroups = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.6" /><rect x="14" y="3" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></svg>
);
const IconSchool = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c0 1.2 2.7 2.6 6 2.6s6-1.4 6-2.6v-5" /></svg>
);
const IconGlobe = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></svg>
);

const stats = [
  { value: "3 000+", label: "participants accompagnés", icon: IconUsers },
  { value: "100+",   label: "groupes coordonnés",       icon: IconGroups },
  { value: "50",     label: "écoles partenaires",       icon: IconSchool },
  { value: "10",     label: "destinations actives",     icon: IconGlobe },
];

const partnerNames = [
  "CCI Grand Est",
  "Collège de Paris",
  "Groupe Alternance",
  "IFPASS",
  "HOMNEO Business School",
  "My Business School",
  "Sully Business School",
  "Institut Européen de Formation",
  "Financia",
  "École Supérieure d'Assurances",
  "CMA Normandie",
  "ESMP",
  "Médéric",
  "IMC Nancy",
  "ESCM",
  "ESMG",
  "ESGM",
  "CCI Vaucluse",
  "Les Charmilles",
];

const included = [
  { num: "01", label: "Formation de 15 à 82 h", sub: "Business English et ateliers sectoriels" },
  { num: "02", label: "Visites d'entreprise",  sub: "Immersion professionnelle réelle" },
  { num: "03", label: "Activités culturelles", sub: "Programme saisonnier sur mesure" },
  { num: "04", label: "Hébergement encadré",   sub: "Logement sécurisé, testé sur place" },
  { num: "05", label: "Transports inclus",     sub: "Aéroport + navettes quotidiennes" },
  { num: "06", label: "Assurances complètes",  sub: "Rapatriement 24h/24 + 200 k€" },
  { num: "07", label: "Ingénierie administrative", sub: "Structuration, dispositifs, suivi documentaire" },
];

export default function HomePage() {
  const renderDestCard = ({ city, country, flag, tag, gradient, img, phare }: (typeof destinations)[number]) => (
    <Link key={city} href="/destinations" className="dest-card" style={{
      position: "relative", borderRadius: 16, overflow: "hidden",
      display: "block", textDecoration: "none",
    }}>
      <div className="dest-card-bg" style={{
        position: "absolute", inset: 0,
        backgroundImage: `${gradient}, url('${img}')`,
        backgroundSize: "cover, cover",
        backgroundPosition: "center",
      }} />
      <div className="dest-card-overlay" style={{
        position: "absolute", inset: 0,
        background: "rgba(11,24,41,0.0)",
        transition: "background 0.35s ease",
      }} />
      {phare && (
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 2,
          fontSize: 9, fontWeight: 600, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "#fff",
          background: "rgba(27,61,136,0.92)", borderRadius: 100,
          padding: "4px 10px",
        }}>Destination phare</div>
      )}
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
  );

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO, cinematic split layout
          Dark navy + animated orbs + real group photos
      ══════════════════════════════════════════════ */}
      <section className="hero-section" style={{
        position: "relative", overflow: "hidden", background: "var(--bg)",
      }}>
        {/* Image full-bleed + voiles + dérive d'ambiance (client) */}
        <HeroBackdrop image={HERO_IMAGE} focus={HERO_FOCUS} />

        {/* Contenu : texte (haut) + cartes flottantes (bas), une seule scène */}
        <div className="hero-inner" style={{
          position: "relative", maxWidth: 1200, margin: "0 auto", width: "100%",
          minHeight: "min(90svh, 880px)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "134px 24px 34px",
        }}>
          <div className="hero-text-col" style={{ maxWidth: 560 }}>
            <h1 className="anim-fade-up" style={{
              fontSize: "clamp(34px, 5vw, 66px)", fontWeight: 800,
              letterSpacing: "-0.045em", lineHeight: 1.02,
              color: "var(--text-primary)", marginBottom: 22,
            }}>
              <span className="hero-breath">
                Des séjours à l&apos;étranger<br />
                pour faire grandir<br />
                <span className="hero-gradient-anim" style={{
                  color: "transparent",
                  background: "linear-gradient(120deg, #0B1829 0%, #1B3D88 100%)",
                  WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>vos étudiants.</span>
              </span>
            </h1>

            <p className="anim-fade-up-3" style={{
              fontSize: "clamp(15px, 1.35vw, 17px)", color: "var(--text-secondary)",
              lineHeight: 1.6, maxWidth: 460, marginBottom: 12,
            }}>
              Pour les CFA et les écoles.
            </p>

            <div className="anim-fade-up-4 hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/rendez-vous" className="btn-primary">
                Réserver un échange
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link href="/destinations" className="btn-ghost">
                Découvrir les destinations
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
          </div>

          {/* Cartes destinations en coverflow, profondeur par ombre diffuse, sans plateau géométrique */}
          <div className="anim-fade-up-4 hero-gallery-wrap" style={{ position: "relative", marginTop: 28 }}>
            <div aria-hidden="true" style={{
              position: "absolute", left: "50%", bottom: 8, transform: "translateX(-50%)",
              width: "min(860px, 94%)", height: 140,
              background: "radial-gradient(58% 62% at 50% 64%, rgba(11,24,41,0.13) 0%, rgba(11,24,41,0.05) 44%, transparent 72%)",
              filter: "blur(28px)", pointerEvents: "none",
            }} />
            <HeroGallery items={HERO_PHOTOS} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TRUST BAND
      ══════════════════════════════════════════════ */}
      <section style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        overflow: "hidden",
      }}>
        <div className="trust-inner" style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", gap: 0,
          height: 52,
        }}>
          {/* Label */}
          <span className="trust-label" style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--text-muted)",
            flexShrink: 0, paddingRight: 20,
          }}>
            Ils nous font confiance
          </span>
          <div className="trust-divider" style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />
          {/* Scrolling names */}
          <div className="trust-marquee-wrap" style={{ flex: 1, overflow: "hidden", position: "relative", margin: "0 4px" }}>
            {/* Fade masks */}
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 48,
              background: "linear-gradient(to right, var(--bg), transparent)",
              zIndex: 1, pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: 48,
              background: "linear-gradient(to left, var(--bg), transparent)",
              zIndex: 1, pointerEvents: "none",
            }} />
            <div className="trust-marquee" style={{ display: "flex", width: "max-content" }}>
              {[...partnerNames, ...partnerNames].map((name, i) => (
                <span key={i} style={{
                  fontSize: 12, fontWeight: 500, color: "var(--text-secondary)",
                  padding: "0 22px", whiteSpace: "nowrap",
                  borderRight: "1px solid var(--border)",
                  lineHeight: "52px",
                }}>
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="trust-divider" style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />
          {/* Trailing note */}
          <span style={{
            fontSize: 11, fontWeight: 400, color: "var(--text-muted)",
            flexShrink: 0, paddingLeft: 20,
            fontStyle: "italic", whiteSpace: "nowrap",
          }} className="trust-trailing">
            et d&apos;autres établissements partenaires
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════ */}
      <section className="stats-section" style={{ background: "var(--bg)", padding: "clamp(36px,7vw,64px) 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {stats.map(({ value, label, icon }, i) => (
              <AnimateOnView key={label} delay={i * 0.06} className="stat-card" style={{
                background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 22,
                padding: "30px 26px", boxShadow: "0 12px 34px rgba(11,24,41,0.05)",
                display: "flex", flexDirection: "column", gap: 16,
              }}>
                <span style={{ color: "var(--coral)", display: "inline-flex" }}>{icon}</span>
                <div style={{
                  fontSize: "clamp(30px, 5vw, 44px)", fontWeight: 700,
                  letterSpacing: "-0.05em", color: "var(--text-primary)", lineHeight: 1,
                }}>{value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>{label}</div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROGRAMME, real photo + included list
      ══════════════════════════════════════════════ */}
      <section className="prog-section" style={{ padding: "96px 24px", background: "var(--bg)" }}>
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
                  src="/Assets/program/visite-conference.jpg"
                  alt="Conférence professionnelle suivie par un groupe AMI Panorama lors d'une visite d'entreprise"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center 45%" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay tint */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(11,24,41,0.08)",
                }} />
              </div>
              {/* Floating card */}
              <div className="prog-float-card" style={{
                position: "absolute", bottom: -20, right: -20,
                background: "var(--navy)", borderRadius: 14,
                padding: "18px 22px", minWidth: 180,
                boxShadow: "0 8px 40px rgba(11,24,41,0.28)",
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6,
                }}>Formation réelle</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em" }}>15 à 82 h</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>de formation selon le format</div>
              </div>
              {/* Encadrement badge */}
              <div className="prog-float-badge" style={{
                position: "absolute", top: -16, left: -16,
                background: "var(--coral)", borderRadius: 10,
                padding: "12px 18px",
                boxShadow: "0 4px 20px rgba(27,61,136,0.35)",
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
                AMI Panorama coordonne chaque dimension du programme pour que
                vos participants vivent une expérience internationale structurée et
                professionnalisante. Vous restez le référent pédagogique de votre groupe.
                Nous prenons en charge la logistique, l'encadrement terrain et l'appui administratif.
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
          DESTINATIONS PREVIEW GRID
      ══════════════════════════════════════════════ */}
      <section className="dest-section" style={{ padding: "0 24px 80px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-end",
              marginBottom: 40, flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <div className="section-label">10 destinations</div>
                <h2 style={{
                  fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700,
                  letterSpacing: "-0.04em", maxWidth: 480,
                }}>
                  Une sélection de destinations pour croiser<br />cultures, langues et mondes professionnels.
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
            {/* Rangée mise en avant : les deux destinations phares */}
            <div className="dest-grid-phares" style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridAutoRows: "300px",
              gap: 12,
              marginBottom: 12,
            }}>
              {destinations.filter((d) => d.phare).map(renderDestCard)}
            </div>
            {/* Les autres destinations */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridAutoRows: "240px",
              gap: 12,
            }} className="dest-grid">
              {destinations.filter((d) => !d.phare).map(renderDestCard)}
            </div>
          </AnimateOnView>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS, process steps (no photo needed)
      ══════════════════════════════════════════════ */}
      <section className="process-section" style={{ padding: "0 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
            <div className="process-inner-card" style={{
              background: "var(--bg-2)", border: "1px solid var(--border)",
              borderRadius: 20, padding: "56px 48px",
            }}>
              <div style={{ marginBottom: 48, textAlign: "center" }}>
                <div className="section-label" style={{ justifyContent: "center" }}>Notre méthode</div>
                <h2 style={{
                  fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700,
                  letterSpacing: "-0.035em",
                }}>
                  Simple pour vous, complet pour vos groupes.
                </h2>
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24,
              }} className="process-grid">
                {[
                  { num: "1", title: "Vous nous contactez", desc: "Premier échange pour comprendre votre groupe, votre filière, vos dates." },
                  { num: "2", title: "Nous proposons", desc: "Proposition adaptée à votre filière et à vos dates, destination, hébergement, planning indicatif." },
                  { num: "3", title: "Nous coordonnons", desc: "Logistique, formations, visites professionnelles, assurances et appui administratif, nous structurons chaque étape avec vous." },
                  { num: "4", title: "Le groupe part", desc: "Vous accompagnez votre groupe sur le plan pédagogique. Notre équipe terrain assure l'encadrement et la coordination sur place." },
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
                        background: "rgba(36,71,143,0.12)", border: "1px solid rgba(36,71,143,0.2)",
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
          STUDENT TESTIMONIALS, animated vertical scroll
      ══════════════════════════════════════════════ */}
      <section className="testi-section" style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
            <div style={{ marginBottom: 40 }}>
              <div className="section-label">Ce qu&apos;ils en retiennent</div>
              <h2 style={{
                fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700,
                letterSpacing: "-0.035em",
              }}>
                La parole aux participants.
              </h2>
            </div>
          </AnimateOnView>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="testi-grid">
            {/* Column 1, real testimonials, scrolls slower */}
            <div className="testi-track">
              <div className="testi-col-1" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[...testimonials, ...testimonials].map(({ quote, name, school, dest, flag }, i) => (
                  <div key={i} className="testi-card">
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85, whiteSpace: "pre-line", marginBottom: 20 }}>{quote}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)",
                      }}>{name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 1 }}>{name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{school}</div>
                      </div>
                      <div style={{
                        fontSize: 11, color: "var(--text-muted)", background: "var(--bg-2)",
                        borderRadius: 100, padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0,
                      }}>{flag} {dest}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Column 2, additional testimonials, scrolls faster */}
            <div className="testi-track">
              <div className="testi-col-2" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[...testimonials.slice(2), ...testimonials.slice(0, 2), ...testimonials.slice(2), ...testimonials.slice(0, 2)].map(({ quote, name, school, dest, flag }, i) => (
                  <div key={i} className="testi-card">
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85, whiteSpace: "pre-line", marginBottom: 20 }}>{quote}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: "var(--navy)", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)",
                      }}>{name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 1 }}>{name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{school}</div>
                      </div>
                      <div style={{
                        fontSize: 11, color: "var(--text-muted)", background: "var(--bg-2)",
                        borderRadius: 100, padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0,
                      }}>{flag} {dest}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIAL
      ══════════════════════════════════════════════ */}
      <section className="testi-feature-section" style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
          <div style={{
            background: "var(--navy)", borderRadius: 20, overflow: "hidden",
            display: "grid", gridTemplateColumns: "1fr 380px",
          }} className="testimonial-grid">
            <div className="testi-feature-inner" style={{ padding: "60px 56px", position: "relative" }}>
              <div style={{
                position: "absolute", top: 0, left: 0, width: 500, height: "100%",
                background: "radial-gradient(ellipse at left, rgba(36,71,143,0.18) 0%, transparent 65%)",
                pointerEvents: "none",
              }} />
              <div style={{
                fontSize: 56, lineHeight: 0.8, marginBottom: 28,
                fontFamily: "Georgia, serif", color: "rgba(27,61,136,0.4)",
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
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Référent Mobilité, ECEMA</div>
                </div>
              </div>
            </div>
            {/* Right stat panel */}
            <div className="testi-stat-panel" style={{
              background: "rgba(255,255,255,0.04)", borderLeft: "1px solid rgba(255,255,255,0.08)",
              padding: "60px 40px", display: "flex", flexDirection: "column",
              justifyContent: "center", gap: 32,
            }}>
              {[
                { value: "3 000+", label: "participants accompagnés" },
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
      <section className="cta-section" style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
          <div className="cta-inner" style={{
            background: "var(--navy)", borderRadius: 20,
            padding: "80px 48px", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Glows */}
            <div style={{
              position: "absolute", top: "-80px", left: "10%",
              width: 500, height: 380,
              background: "radial-gradient(ellipse, rgba(36,71,143,0.3) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-60px", right: "10%",
              width: 380, height: 300,
              background: "radial-gradient(ellipse, rgba(27,61,136,0.22) 0%, transparent 65%)",
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
              Partagez votre projet.<br />Nous vous répondons rapidement.
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 480,
              margin: "0 auto 44px", lineHeight: 1.75, position: "relative",
            }}>
              Partagez votre projet avec nous, destination envisagée, filière, dates,
              taille du groupe. Nous revenons vers vous avec une première proposition adaptée.
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
              <Link href="/rendez-vous" className="btn-ghost-light">Réserver un échange</Link>
            </div>
          </div>
          </AnimateOnView>
        </div>
      </section>

      {/* ══ Hero & animation styles ══ */}
      <style>{`
        .hero-text-col { padding-right: 0; }

        @media (max-width: 760px) {
          /* Hero mobile = SPLIT éditorial : texte à gauche (~56%), photo à droite.
             Le voile de lisibilité est géré par HeroBackdrop (.hb-scrim). */
          .hero-inner { min-height: 100svh !important; padding: 88px 22px 26px !important; justify-content: flex-start !important; }
          .hero-text-col { max-width: 56% !important; }
          .hero-eyebrow { display: block !important; width: calc(100vw - 44px) !important; max-width: none !important; margin-bottom: 16px !important; }
          .hero-eyebrow-dash { display: none !important; }
          .hero-eyebrow-txt { font-size: 11px !important; letter-spacing: 0.1em !important; line-height: 1.4 !important; }
          .hero-text-col h1 { font-size: 32px !important; line-height: 1.06 !important; letter-spacing: -0.035em !important; margin-bottom: 16px !important; }
          .hero-ctas { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
          .hero-gallery-wrap { display: none !important; }
          .hero-op-line { display: none !important; }
        }
        .hero-gradient-anim {
          background-size: 220% 220% !important;
          animation: heroGradient 13s ease-in-out infinite;
        }
        @keyframes heroGradient {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        /* Respiration unifiée : tout le bloc texte (CTA inclus) bouge ENSEMBLE,
           translation verticale quasi imperceptible, même philosophie que le fond et le carousel */
        .hero-breath { display: inline-block; }
        .hero-text-col {
          animation: heroTextBreath 7s ease-in-out infinite;
          will-change: transform, opacity;
        }
        @keyframes heroTextBreath {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 1; }
          50%      { transform: translate3d(0, -3px, 0); opacity: 0.985; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-text-col, .hero-gradient-anim { animation: none !important; }
        }
        /* ⚠️ Bloc supprimé : maquette "dashboard", cartes photo flottantes et
           voiles .hero-veil / .hero-grid / .hero-img. Ces règles n'étaient plus
           rattachées à aucun élément du JSX depuis la refonte du hero
           (art-direction image pleine + carousel). Vérifié classe par classe.
           Si tu réintroduis une de ces mises en page, repars de l'historique git. */
        /* --- ancien bloc legacy retiré ici --- */

        /* Trust marquee */
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .trust-marquee {
          animation: marquee 32s linear infinite;
          will-change: transform;
        }
        .trust-marquee:hover {
          animation-play-state: paused;
        }

        /* ── Photo rail (vraies promotions) ── */
        .photo-rail { position: relative; overflow: hidden; }
        .photo-rail-track {
          display: flex; gap: 14px; width: max-content;
          animation: railScroll 64s linear infinite;
          will-change: transform;
        }
        .photo-rail:hover .photo-rail-track { animation-play-state: paused; }
        .photo-rail-item {
          position: relative; flex-shrink: 0;
          width: 320px; height: 224px; border-radius: 16px;
          background-size: cover; background-position: center;
          box-shadow: 0 10px 30px rgba(11,24,41,0.12);
        }
        .photo-rail-item::after {
          content: ""; position: absolute; inset: 0; border-radius: 16px;
          background: linear-gradient(to top, rgba(11,24,41,0.55) 0%, transparent 46%);
        }
        .photo-rail-cap {
          position: absolute; bottom: 12px; left: 12px; z-index: 1;
          font-size: 12px; font-weight: 500; color: #fff;
          background: rgba(11,24,41,0.42);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 100px; padding: 4px 11px;
          -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px);
        }
        @keyframes railScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .photo-rail-fade { position: absolute; top: 0; bottom: 0; width: 72px; z-index: 2; pointer-events: none; }
        .photo-rail-fade-l { left: 0; background: linear-gradient(to right, var(--bg), transparent); }
        .photo-rail-fade-r { right: 0; background: linear-gradient(to left, var(--bg), transparent); }
        @media (max-width: 640px) {
          .photo-rail-item { width: 240px; height: 168px; }
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
          .testi-grid { grid-template-columns: 1fr !important; }
          .testi-grid > div:nth-child(2) { display: none !important; }
          .testi-track { height: 480px !important; }
        }
        @media (max-width: 540px) {
          .dest-grid { grid-template-columns: 1fr !important; }
          .dest-grid-phares { grid-template-columns: 1fr !important; grid-auto-rows: 220px !important; }
          .stats-bar { grid-template-columns: repeat(2,1fr) !important; }
          .process-grid { grid-template-columns: 1fr !important; }
        }

        /* ── Animated testimonials, vertical infinite scroll ── */
        @keyframes testiScrollUp {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        .testi-track {
          overflow: hidden;
          height: 540px;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
        }
        .testi-card {
          background: var(--bg-1);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px 24px;
        }
        .testi-col-1 {
          animation: testiScrollUp 38s linear infinite;
          will-change: transform;
        }
        .testi-col-2 {
          animation: testiScrollUp 48s linear infinite;
          will-change: transform;
        }
        .testi-grid:hover .testi-col-1,
        .testi-grid:hover .testi-col-2 {
          animation-play-state: paused;
        }

        /* ─── Mobile layout (≤640px) ─── */
        @media (max-width: 640px) {
          .hero-section          { padding: 0 !important; }
          .hero-cta-group        { gap: 28px !important; margin-bottom: 40px !important; }
          .trust-trailing        { display: none !important; }
          /* Bandeau écoles empilé : label sur sa ligne, puis le défilé pleine largeur */
          .trust-inner           { flex-direction: column !important; align-items: stretch !important; height: auto !important; gap: 10px !important; padding-top: 16px !important; padding-bottom: 8px !important; }
          .trust-divider         { display: none !important; }
          .trust-label           { padding-right: 0 !important; }
          .trust-marquee-wrap    { flex: none !important; width: 100% !important; margin: 0 !important; }
          .stats-cell            { padding: 24px 16px !important; }
          .prog-section          { padding-top: 56px !important; padding-bottom: 56px !important; }
          .prog-float-card       { display: none !important; }
          .prog-float-badge      { display: none !important; }
          .dest-section          { padding-bottom: 48px !important; }
          .process-section       { padding-bottom: 48px !important; }
          .process-inner-card    { padding: 36px 24px !important; }
          .testi-section         { padding-bottom: 48px !important; }
          .testi-track           { height: 360px !important; }
          .testi-feature-section { padding-bottom: 52px !important; }
          .testi-feature-inner   { padding: 36px 24px !important; }
          .testi-stat-panel      { padding: 32px 24px !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.08) !important; }
          .cta-section           { padding-bottom: 52px !important; }
          .cta-inner             { padding: 44px 24px !important; }
          .prog-photo-outer      { margin-bottom: 24px; }

          /* ═══ Refonte mobile premium ═══ */
          /* Stats en 4 cartes Apple (2×2) */
          .stats-grid  { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .stat-card   { padding: 24px 20px !important; border-radius: 20px !important; gap: 12px !important; }
          .stats-section { padding: 44px 20px 48px !important; }
          /* Destinations : cartes plein écran en scroll horizontal, aperçu de la suivante */
          .dest-grid-phares, .dest-grid {
            display: flex !important; grid-template-columns: none !important; grid-auto-rows: unset !important;
            overflow-x: auto; scroll-snap-type: x mandatory; gap: 14px !important;
            margin: 0 -24px !important; padding: 4px 24px 14px !important;
            -webkit-overflow-scrolling: touch; scrollbar-width: none;
          }
          .dest-grid-phares::-webkit-scrollbar, .dest-grid::-webkit-scrollbar { display: none; }
          .dest-grid-phares > a, .dest-grid > a {
            min-width: 80vw !important; height: 340px !important;
            scroll-snap-align: center; border-radius: 26px !important;
          }
          .dest-grid-phares { margin-bottom: 4px !important; }
        }
      `}</style>
    </>
  );
}
