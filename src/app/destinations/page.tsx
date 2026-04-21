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
    color: "#E85D26",
    flag: "🇪🇸",
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
    color: "#2E7FE8",
    flag: "🇨🇦",
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
    color: "#6B5CE7",
    flag: "🇬🇧",
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
    color: "#E8A020",
    flag: "🇲🇦",
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
    color: "#26C4A8",
    flag: "🇺🇸",
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
    color: "#E82656",
    flag: "🇰🇷",
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
      {/* Header */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: 140, paddingBottom: 72 }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 420,
          background: "radial-gradient(ellipse, rgba(107,92,231,0.14) 0%, transparent 68%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label">Destinations</div>
          <h1 style={{ fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 1.08, maxWidth: 680, marginBottom: 24 }}>
            6 destinations.<br />
            <span className="gradient-text">Une expérience unique à chaque fois.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 580, lineHeight: 1.75 }}>
            Chaque destination AMI Panorama est sélectionnée pour sa valeur pédagogique, professionnelle
            et humaine. Le même programme de qualité, adapté à chaque contexte.
          </p>
        </div>
      </section>

      {/* Destination cards */}
      <section style={{ padding: "24px 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {destinations.map(({ city, country, tag, color, flag, headline, desc, highlights, ideal }) => (
            <div key={city} className="hover-row" style={{
              background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 20,
              overflow: "hidden",
            }}>
              {/* Top bar */}
              <div style={{
                padding: "32px 40px 28px",
                borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%",
                    background: color, boxShadow: `0 0 16px ${color}80`, flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                      <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>{city}</h2>
                      <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{flag} {country}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6, fontStyle: "italic" }}>{headline}</p>
                  </div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 500, color: "var(--text-secondary)",
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  borderRadius: 100, padding: "6px 16px", flexShrink: 0,
                }}>{tag}</div>
              </div>

              {/* Body */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
              }} className="dest-body">
                {/* Left */}
                <div style={{ padding: "32px 40px", borderRight: "1px solid var(--border)" }}>
                  <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>{desc}</p>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>
                      Filières recommandées
                    </div>
                    <div style={{ fontSize: 13, color: "var(--accent-light)", fontWeight: 500 }}>{ideal}</div>
                  </div>
                </div>

                {/* Right */}
                <div style={{ padding: "32px 40px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>
                    Au programme
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {highlights.map(h => (
                      <div key={h} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: color, flexShrink: 0, marginTop: 8,
                          boxShadow: `0 0 6px ${color}80`,
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
            <div className="section-label" style={{ justifyContent: "center" }}>Une destination vous attire ?</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.035em", marginBottom: 16, position: "relative" }}>
              Construisons votre programme ensemble.
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.75, position: "relative" }}>
              Indiquez-nous la destination qui vous intéresse, la taille de votre groupe et vos dates.
              Nous vous répondons sous 24h.
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
        @media (max-width: 768px) {
          .dest-body { grid-template-columns: 1fr !important; }
          .dest-body > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </>
  );
}
