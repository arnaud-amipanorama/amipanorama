import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Séville, Montréal, Londres, Maroc, New York, Séoul — 6 destinations de mobilité internationale pour vos apprentis. Chaque programme est unique, chaque ville est une expérience.",
};

const destinations = [
  {
    city: "Séville",
    country: "Espagne",
    tag: "Culture & immersion",
    flag: "🇪🇸",
    accent: "#E85835",
    photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    headline: "L'Andalousie comme terrain de formation.",
    desc: "Séville offre un cadre exceptionnel pour une immersion totale : culture riche, économie sociale dynamique et chaleur humaine qui facilite l'ouverture interculturelle. Idéal pour les filières tourisme, commerce, services et RH.",
    highlights: [
      "Hébergement en centre-ville dans un établissement sélectionné",
      "Panorama de l'économie sociale espagnole",
      "Visites d'entreprises locales dans le secteur tertiaire",
      "Activités culturelles : flamenco, Cathédrale, Alcazar",
    ],
    ideal: "Tourisme · Commerce · RH · Services",
  },
  {
    city: "Montréal",
    country: "Canada",
    tag: "Bilinguisme & innovation",
    flag: "🇨🇦",
    accent: "#1E52D0",
    photo: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=900&q=80",
    headline: "L'Amérique du Nord, en français.",
    desc: "Métropole bilingue et cosmopolite, Montréal fusionne les cultures nord-américaine et européenne comme nulle part ailleurs. Environnement idéal pour les apprentis qui souhaitent découvrir un modèle économique différent, sans barrière linguistique.",
    highlights: [
      "Hébergement confortable en centre-ville",
      "Formation sur l'économie nord-américaine",
      "Visites d'entreprises innovantes et startups",
      "Exploration des quartiers, gastronomie, festivals",
    ],
    ideal: "Numérique · Gestion · Commerce · Communication",
  },
  {
    city: "Londres",
    country: "Royaume-Uni",
    tag: "Business English",
    flag: "🇬🇧",
    accent: "#1E52D0",
    photo: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=80",
    headline: "La capitale mondiale du Business English.",
    desc: "Londres reste la référence pour l'apprentissage de l'anglais professionnel dans un contexte réel. Un séjour à Londres, c'est 7 jours d'immersion totale en anglais, dans une ville qui concentre une densité unique d'entreprises internationales.",
    highlights: [
      "Cours intensifs d'anglais avec des formateurs natifs",
      "Visites de sites emblématiques : British Museum, London Eye, Westminster",
      "Programme Business English adapté au niveau du groupe",
      "Expériences de vie à Londres : marchés, quartiers, transports",
    ],
    ideal: "Toutes filières · Amélioration du niveau d'anglais",
  },
  {
    city: "Maroc",
    country: "Afrique du Nord",
    tag: "Masterclasses & digital",
    flag: "🇲🇦",
    accent: "#D4862A",
    photo: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=900&q=80",
    headline: "L'Afrique du Nord, entre tradition et disruption.",
    desc: "Le Maroc, principalement à Marrakech, propose un programme adapté aux ambitions professionnelles les plus contemporaines : masterclasses en IA, marketing digital et management interculturel, dans un cadre chargé d'histoire et d'inspiration.",
    highlights: [
      "Masterclasses : IA, marketing digital, management interculturel",
      "Architecture traditionnelle, artisanat et gastronomie locaux",
      "Programme personnalisable selon le secteur des apprentis",
      "Disponible dans plusieurs grandes villes selon les groupes",
    ],
    ideal: "Numérique · Marketing · Innovation · Management",
  },
  {
    city: "New York",
    country: "États-Unis",
    tag: "Business & culture",
    flag: "🇺🇸",
    accent: "#1E52D0",
    photo: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80",
    headline: "La ville symbole du business mondial.",
    desc: "New York représente l'expérience ultime pour les apprentis qui veulent confronter leurs aspirations professionnelles à la réalité d'un marché international intense. Business English de haut niveau, énergie unique, culture multiple.",
    highlights: [
      "Business English spécialisé avec des professeurs natifs",
      "Immersion dans l'écosystème business new-yorkais",
      "Visites culturelles : Manhattan, Brooklyn, musées emblématiques",
      "Rencontres avec des professionnels et expatriés français",
    ],
    ideal: "Commerce international · Finance · Communication · Tourisme",
  },
  {
    city: "Séoul",
    country: "Corée du Sud",
    tag: "Tech & monde asiatique",
    flag: "🇰🇷",
    accent: "#E85835",
    photo: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=900&q=80",
    headline: "Une fenêtre sur l'Asie du XXIe siècle.",
    desc: "Séoul est l'une des villes les plus innovantes du monde. Un séjour en Corée du Sud offre aux apprentis une vision concrète du monde du travail asiatique : culture de l'innovation, discipline professionnelle, technologies de rupture.",
    highlights: [
      "Apprentissage en classe et observation quotidienne sur le terrain",
      "Visite de districts tech, startups et grandes corporations",
      "Développement de la capacité d'adaptation interculturelle",
      "Culture K-pop, gastronomie et art de vivre coréen",
    ],
    ideal: "Numérique · Tech · Industrie · Innovation",
  },
];

export default function DestinationsPage() {
  return (
    <>
      {/* Hero header */}
      <section style={{
        position: "relative", paddingTop: 160, paddingBottom: 80,
        background: "var(--navy)", overflow: "hidden",
      }}>
        {/* Background photo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=80')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.18,
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(11,24,41,0.3) 0%, var(--navy) 100%)",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label-light anim-fade-up">Destinations</div>
          <h1 className="anim-fade-up-2" style={{
            fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700,
            letterSpacing: "-0.04em", lineHeight: 1.08, maxWidth: 720, marginBottom: 24,
            color: "#fff",
          }}>
            6 destinations.{" "}
            <span style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 500, color: "rgba(232,88,53,0.9)",
            }}>Une expérience unique à chaque fois.</span>
          </h1>
          <p className="anim-fade-up-3" style={{
            fontSize: 18, color: "rgba(255,255,255,0.65)",
            maxWidth: 560, lineHeight: 1.75,
          }}>
            Chaque destination est sélectionnée pour sa valeur pédagogique,
            professionnelle et humaine — avec le même programme de qualité,
            adapté à chaque contexte.
          </p>

          {/* Flag strip */}
          <div className="anim-fade-up-4" style={{
            display: "flex", gap: 8, marginTop: 48, flexWrap: "wrap",
          }}>
            {destinations.map(d => (
              <div key={d.city} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 100, padding: "8px 16px",
                fontSize: 13, color: "rgba(255,255,255,0.7)",
              }}>
                <span>{d.flag}</span> {d.city}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destination cards */}
      <section style={{ padding: "64px 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {destinations.map(({ city, country, tag, flag, accent, photo, headline, desc, highlights, ideal }, i) => (
            <div key={city} className="hover-row" style={{
              background: "var(--bg-1)", border: "1px solid var(--border)",
              borderRadius: 20, overflow: "hidden",
              display: "grid", gridTemplateColumns: "340px 1fr",
            }}>
              {/* Photo side */}
              <div style={{
                position: "relative",
                backgroundImage: `url('${photo}')`,
                backgroundSize: "cover", backgroundPosition: "center",
                minHeight: 280,
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(11,24,41,0.55) 0%, rgba(11,24,41,0.2) 100%)",
                }} />
                {/* City label over photo */}
                <div style={{ position: "absolute", bottom: 28, left: 28 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
                    {flag} {country}
                  </div>
                  <div style={{
                    fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em",
                    color: "#fff", lineHeight: 1,
                  }}>{city}</div>
                  <div style={{
                    display: "inline-block", marginTop: 10,
                    fontSize: 11, fontWeight: 500,
                    color: "#fff", background: accent + "cc",
                    borderRadius: 100, padding: "4px 12px",
                  }}>{tag}</div>
                </div>
                {/* Index */}
                <div style={{
                  position: "absolute", top: 20, right: 20,
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.35)",
                }}>0{i + 1}</div>
              </div>

              {/* Content side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {/* Description */}
                <div style={{ padding: "36px 32px", borderRight: "1px solid var(--border)" }}>
                  <p style={{
                    fontSize: 14, fontStyle: "italic", color: "var(--text-secondary)",
                    marginBottom: 16, fontFamily: "var(--font-serif)",
                  }}>{headline}</p>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>{desc}</p>
                  <div>
                    <div style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                      textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8,
                    }}>Filières recommandées</div>
                    <div style={{ fontSize: 13, color: accent, fontWeight: 500 }}>{ideal}</div>
                  </div>
                </div>

                {/* Highlights */}
                <div style={{ padding: "36px 32px" }}>
                  <div style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20,
                  }}>Au programme</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {highlights.map(h => (
                      <div key={h} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: accent, flexShrink: 0, marginTop: 7,
                        }} />
                        <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "var(--navy)", borderRadius: 20,
            padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            {/* Glow blobs */}
            <div style={{
              position: "absolute", top: "-60px", left: "20%",
              width: 400, height: 300,
              background: "radial-gradient(ellipse, rgba(30,82,208,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-40px", right: "20%",
              width: 300, height: 250,
              background: "radial-gradient(ellipse, rgba(232,88,53,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div className="section-label-light" style={{ justifyContent: "center" }}>Une destination vous attire ?</div>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 500,
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              letterSpacing: "-0.02em", marginBottom: 16, color: "#fff", position: "relative",
            }}>
              Construisons votre programme ensemble.
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.55)",
              maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.75, position: "relative",
            }}>
              Indiquez-nous la destination qui vous intéresse, la taille de votre groupe et vos dates.
              Nous vous répondons sous 24h ouvrables.
            </p>
            <Link href="/contact" className="btn-primary" style={{ position: "relative" }}>
              Demander un programme
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .dest-full-card { grid-template-columns: 1fr !important; }
          .dest-full-card > div:first-child { min-height: 200px !important; }
        }
        @media (max-width: 640px) {
          .dest-content-grid { grid-template-columns: 1fr !important; }
          .dest-content-grid > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </>
  );
}
