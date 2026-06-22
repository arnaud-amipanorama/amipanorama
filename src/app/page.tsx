import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import AnimateOnView from "@/components/AnimateOnView";
import PhotoRail from "./PhotoRail";

export const metadata: Metadata = {
  title: "AMI Panorama — Opérateur de mobilité internationale pour les CFA et les établissements",
  description:
    "AMI Panorama conçoit des programmes de mobilité internationale structurés pour les CFA, les écoles et les établissements d'enseignement supérieur. Formation professionnelle, visites d'entreprise, encadrement terrain et accompagnement administratif de A à Z.",
};

const destinations: {
  city: string; country: string; flag: string; tag: string;
  gradient: string; img: string; phare?: boolean;
}[] = [
  {
    city: "Montréal",
    country: "Canada",
    flag: "🇨🇦",
    tag: "Destination historique · Amérique du Nord",
    phare: true,
    gradient: "linear-gradient(170deg,rgba(8,28,60,0.42),rgba(20,52,140,0.28))",
    img: "https://images.unsplash.com/photo-1519178614-68673b201f36?w=800&q=80",
  },
  {
    city: "Séville",
    country: "Espagne",
    flag: "🇪🇸",
    tag: "Deuxième pilier · Culture & immersion",
    phare: true,
    gradient: "linear-gradient(170deg,rgba(100,30,10,0.42),rgba(180,80,20,0.28))",
    img: "https://images.pexels.com/photos/28989039/pexels-photo-28989039.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
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
    city: "New York",
    country: "États-Unis",
    flag: "🇺🇸",
    tag: "Business & culture",
    gradient: "linear-gradient(170deg,rgba(10,18,40,0.42),rgba(20,38,80,0.28))",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
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

const stats = [
  { value: "3 000+", label: "participants accompagnés" },
  { value: "100+",   label: "groupes coordonnés" },
  { value: "50",     label: "écoles partenaires" },
  { value: "10",     label: "destinations actives" },
];

const railPhotos = [
  { src: "/Assets/groups/montreal-sunset.jpg",  city: "Montréal", flag: "🇨🇦" },
  { src: "/Assets/groups/newyork-dumbo.jpg",    city: "New York", flag: "🇺🇸" },
  { src: "/Assets/groups/seville-park.jpg",     city: "Séville",  flag: "🇪🇸" },
  { src: "/Assets/groups/montreal-night.jpg",   city: "Montréal", flag: "🇨🇦" },
  { src: "/Assets/groups/newyork-bridge.jpg",   city: "New York", flag: "🇺🇸" },
  { src: "/Assets/groups/seville-diplomas.jpg", city: "Séville",  flag: "🇪🇸" },
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
  "ESA",
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

const testimonials = [
  // ── Real testimonials ──
  {
    quote: "Retour du Canada : Certaines expériences laissent une empreinte indélébile sur notre parcours professionnel et mon séjour au Canada en fait partie !",
    name: "Ambre Spechier",
    school: "My Business School",
    dest: "Montréal",
    flag: "🇨🇦",
  },
  {
    quote: "Grâce à AMI Panorama et l'Institut Européen de Formation, j'ai eu la chance de me rendre à Montréal. Je ne qualifierais pas ce séjour de vacances, car même là-bas, nous avons continué à travailler.\nNous avons pris de nouveaux contacts et passé plusieurs heures à rédiger nos BP. Cependant, nous avons su joindre l'utile à l'agréable, en explorant bars, restaurants, gyms et parcs.",
    name: "Hugo Zenner",
    school: "Institut Européen de Formation",
    dest: "Montréal",
    flag: "🇨🇦",
  },
  {
    quote: "Une expérience incroyable, qui nous a ouvert les yeux aux nouvelles cultures et architectures. Qui nous a aussi permis de faire des nouvelles rencontres et des très belles activités. Finalement on ne peut que garder des très beaux souvenirs de ce voyage à Séville.\n\nMerci Ami Panorama et les accompagnateurs pour ce beau voyage !",
    name: "Aya Hazzaz",
    school: "ECEMA",
    dest: "Séville",
    flag: "🇪🇸",
  },
  {
    quote: "Cette expérience canadienne m'a permis de renforcer mes compétences et de découvrir une nouvelle culture professionnelle.",
    name: "Anissa Guermoudi",
    school: "Ancienne participante · Toronto",
    dest: "Canada",
    flag: "🇨🇦",
  },
  // NOTE: emplacements prêts pour de vrais témoignages supplémentaires fournis par AMI Panorama.
];

const included = [
  { num: "01", label: "Formation 15–82h",       sub: "Business English + ateliers sectoriels" },
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
          background: "rgba(232,88,53,0.92)", borderRadius: 100,
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
          HERO — cinematic split layout
          Dark navy + animated orbs + real group photos
      ══════════════════════════════════════════════ */}
      <section className="hero-section" style={{
        position: "relative",
        minHeight: "min(84svh, 760px)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "var(--bg)",
      }}>
        {/* ── Hero content: image-led (texte gauche + image réelle droite) ── */}
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "108px 24px 64px",
          position: "relative", width: "100%",
          display: "grid", gridTemplateColumns: "1.02fr 1.1fr",
          alignItems: "center", gap: 56,
        }} className="hero-grid">

          {/* Left: text */}
          <div className="hero-text-col">
            <div className="anim-fade-up" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 14px", borderRadius: 100,
              border: "1px solid var(--border)", background: "var(--bg-1)",
              boxShadow: "0 1px 3px rgba(11,24,41,0.04)", marginBottom: 26,
            }}>
              <span style={{ fontSize: 13 }}>🌍</span>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text-secondary)" }}>Plus de 3 000 étudiants accompagnés</span>
            </div>

            <h1 className="anim-fade-up-2" style={{
              fontSize: "clamp(32px, 4.3vw, 56px)", fontWeight: 800,
              letterSpacing: "-0.04em", lineHeight: 1.06,
              color: "var(--text-primary)", marginBottom: 22,
            }}>
              Ouvrir le monde<br />
              à celles et ceux qui<br />
              <span className="hero-gradient-anim" style={{
                color: "transparent",
                background: "linear-gradient(120deg, #0B1829 0%, #E85835 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>le construiront demain.</span>
            </h1>

            <p className="anim-fade-up-3" style={{
              fontSize: "clamp(15px, 1.35vw, 17px)", color: "var(--text-secondary)",
              lineHeight: 1.65, maxWidth: 480, marginBottom: 14,
            }}>
              AMI Panorama conçoit des programmes de mobilité internationale pour les
              CFA et les établissements d&apos;enseignement supérieur.
            </p>

            <p className="anim-fade-up-3" style={{
              fontSize: "clamp(13px, 1.15vw, 14.5px)", color: "var(--text-muted)",
              lineHeight: 1.65, maxWidth: 480, marginBottom: 30,
            }}>
              Formation, hébergement, logistique, accompagnement administratif et
              ingénierie financière : nous concevons, organisons et sécurisons vos
              mobilités de bout en bout.
            </p>

            <div className="anim-fade-up-4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/rendez-vous" className="btn-primary">
                Réserver un échange
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link href="/destinations" className="btn-ghost">Découvrir les destinations</Link>
            </div>
          </div>

          {/* Right: real hero image */}
          <div className="hero-img-col anim-fade-up-3" aria-hidden="true">
            <div className="hero-img" style={{ backgroundImage: "url('/Assets/hero/sevilla-hero.jpg')" }} />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PHOTO RAIL — ouverture (continuité du hero)
      ══════════════════════════════════════════════ */}
      <section style={{ background: "var(--bg)", padding: "8px 0 52px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", marginBottom: 16 }}>
          <div className="section-label">Sur le terrain · promotions réelles</div>
        </div>
        <PhotoRail photos={railPhotos} />
      </section>

      {/* ══════════════════════════════════════════════
          TRUST BAND
      ══════════════════════════════════════════════ */}
      <section style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg)",
        overflow: "hidden",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", gap: 0,
          height: 52,
        }}>
          {/* Label */}
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--text-muted)",
            flexShrink: 0, paddingRight: 20,
          }}>
            Ils nous font confiance
          </span>
          <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />
          {/* Scrolling names */}
          <div style={{ flex: 1, overflow: "hidden", position: "relative", margin: "0 4px" }}>
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
          <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />
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
      <section style={{ background: "var(--bg-1)", borderBottom: "1px solid var(--border)" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        }} className="stats-bar">
          {stats.map(({ value, label }, i, arr) => (
            <AnimateOnView key={label} delay={i * 0.07} className="stats-cell" style={{
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
          PROGRAMME — real photo + included list
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
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.04em" }}>15–82h</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>de formation selon le format</div>
              </div>
              {/* Encadrement badge */}
              <div className="prog-float-badge" style={{
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
          HOW IT WORKS — process steps (no photo needed)
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
                  { num: "2", title: "Nous proposons", desc: "Proposition adaptée à votre filière et à vos dates — destination, hébergement, planning indicatif." },
                  { num: "3", title: "Nous coordonnons", desc: "Logistique, formations, visites professionnelles, assurances et appui administratif — nous structurons chaque étape avec vous." },
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
          STUDENT TESTIMONIALS — animated vertical scroll
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
            {/* Column 1 — real testimonials — scrolls slower */}
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
            {/* Column 2 — additional testimonials — scrolls faster */}
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
              Partagez votre projet.<br />Nous vous répondons rapidement.
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 480,
              margin: "0 auto 44px", lineHeight: 1.75, position: "relative",
            }}>
              Partagez votre projet avec nous — destination envisagée, filière, dates,
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
        /* Hero grain texture */
        .hero-grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        /* Hero glow orbs — slow, large, organic */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(110px);
        }
        .hero-orb-1 {
          width: 820px; height: 720px;
          background: radial-gradient(ellipse, rgba(30,82,208,0.07) 0%, transparent 70%);
          bottom: -180px; left: -120px;
          animation: orbFloat1 36s ease-in-out infinite;
        }
        .hero-orb-2 {
          width: 640px; height: 580px;
          background: radial-gradient(ellipse, rgba(232,88,53,0.06) 0%, transparent 70%);
          top: -80px; right: -80px;
          animation: orbFloat2 44s ease-in-out infinite;
        }
        .hero-orb-3 {
          width: 400px; height: 380px;
          background: radial-gradient(ellipse, rgba(30,82,208,0.05) 0%, transparent 70%);
          top: 38%; left: 48%;
          animation: orbFloat3 26s ease-in-out infinite;
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(60px, -50px) scale(1.06); }
          66%       { transform: translate(-30px, 35px) scale(0.96); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-55px, 40px) scale(1.08); }
          70%       { transform: translate(40px, -25px) scale(0.94); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -50%) scale(1.3); opacity: 0.75; }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* Hero layout (image-led : texte + image) */
        .hero-grid { grid-template-columns: 1.02fr 1.1fr !important; gap: 56px !important; }
        .hero-text-col { padding-right: 0; }
        .hero-img-col { position: relative; }
        .hero-img {
          width: 100%; height: clamp(420px, 56vh, 560px);
          border-radius: 22px; background-size: cover; background-position: center;
          box-shadow: 0 30px 70px rgba(11,24,41,0.18), 0 8px 22px rgba(11,24,41,0.08);
        }
        .hero-gradient-anim {
          background-size: 220% 220% !important;
          animation: heroGradient 11s ease-in-out infinite;
        }
        @keyframes heroGradient {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        /* Voile de lisibilité du hero image */
        .hero-veil {
          background: linear-gradient(100deg,
            var(--bg) 0%, var(--bg) 20%,
            rgba(248,246,241,0.86) 36%, rgba(248,246,241,0.30) 52%, transparent 66%);
        }
        @media (max-width: 760px) {
          .hero-veil {
            background: linear-gradient(to top,
              var(--bg) 0%, rgba(248,246,241,0.74) 40%, rgba(248,246,241,0.12) 74%);
          }
          .hero-grid { align-items: flex-end !important; }
        }
        /* Hero dashboard mockup (legacy, inutilisé) */
        .hero-dash-col { position: relative; display: flex; align-items: center; justify-content: center; min-height: 460px; }
        .hero-dash {
          position: relative; z-index: 2; width: 100%; max-width: 416px;
          background: rgba(255,255,255,0.72); -webkit-backdrop-filter: blur(18px); backdrop-filter: blur(18px);
          border: 1px solid rgba(11,24,41,0.08); border-radius: 20px; padding: 20px;
          box-shadow: 0 30px 70px rgba(11,24,41,0.16), 0 6px 18px rgba(11,24,41,0.06);
        }
        .hero-dash-glow {
          position: absolute; inset: -30px; z-index: 1; pointer-events: none; filter: blur(8px);
          background:
            radial-gradient(closest-side, rgba(59,104,214,0.16), transparent 70%),
            radial-gradient(closest-side, rgba(20,184,166,0.14), transparent 70%);
          background-repeat: no-repeat; background-size: 62% 62%, 55% 55%;
          background-position: 25% 25%, 80% 80%;
        }
        .hero-float {
          position: absolute; z-index: 3; display: inline-flex; align-items: center; gap: 9px;
          background: rgba(255,255,255,0.9); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
          border: 1px solid rgba(11,24,41,0.07); border-radius: 12px; padding: 10px 13px;
          box-shadow: 0 12px 30px rgba(11,24,41,0.12);
          font-size: 12.5px; font-weight: 500; color: var(--text-primary); white-space: nowrap;
        }
        .hero-float-1 { top: 4%; right: -2%; animation: heroFloatA 7s ease-in-out infinite; }
        .hero-float-2 { bottom: 16%; left: -6%; animation: heroFloatB 8.5s ease-in-out infinite; }
        .hero-float-3 { bottom: -2%; right: 8%; animation: heroFloatA 9s ease-in-out infinite 0.6s; }
        @keyframes heroFloatA { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes heroFloatB { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }

        /* Floating photo cards */
        .hero-photo-col {
          position: relative;
          width: 420px;
          height: 520px;
          flex-shrink: 0;
          pointer-events: none;
        }
        .hero-photo {
          position: absolute;
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid rgba(11,24,41,0.10);
          box-shadow: 0 24px 64px rgba(11,24,41,0.18), 0 4px 16px rgba(11,24,41,0.08);
        }
        .hero-photo-secondary {
          width: 240px; height: 300px;
          top: 0; left: 0;
          animation:
            heroPhotoReveal 1.1s cubic-bezier(0.2,0,0,1) both 0.3s,
            heroFloat2 8s ease-in-out infinite 1.4s;
          z-index: 1;
        }
        .hero-photo-primary {
          width: 310px; height: 400px;
          bottom: 0; right: 0;
          animation:
            heroPhotoReveal 1.1s cubic-bezier(0.2,0,0,1) both 0.65s,
            heroFloat1 10s ease-in-out infinite 1.75s;
          z-index: 2;
        }
        .hero-photo-label {
          position: absolute;
          bottom: 14px; left: 14px;
          font-size: 11px; font-weight: 500;
          color: var(--text-primary);
          letter-spacing: 0.04em;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(11,24,41,0.10);
          border-radius: 100px;
          padding: 5px 12px;
        }
        .hero-stat-pill {
          position: absolute;
          bottom: -20px; left: -10px;
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(11,24,41,0.10);
          border-radius: 100px;
          padding: 9px 16px;
          animation: heroPhotoReveal 1.1s cubic-bezier(0.2,0,0,1) both 1s;
          z-index: 3;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(11,24,41,0.10);
        }

        @keyframes heroPhotoReveal {
          from { opacity: 0; transform: translateY(28px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes heroFloat1 {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes heroFloat2 {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }

        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-photo-col { display: none !important; }
          .hero-text-col { padding-right: 0 !important; }
          .hero-float { display: none !important; }
          .hero-dash-col { min-height: auto !important; }
          .hero-dash { transform: none !important; }
          .hero-img { height: 300px !important; }
        }

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

        /* ── Animated testimonials — vertical infinite scroll ── */
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
          .hero-section          { padding-top: 96px !important; padding-bottom: 40px !important; }
          .hero-cta-group        { gap: 28px !important; margin-bottom: 40px !important; }
          .trust-trailing        { display: none !important; }
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
          .dest-grid             { grid-auto-rows: 200px !important; }
          .prog-photo-outer      { margin-bottom: 24px; }
        }
      `}</style>
    </>
  );
}
