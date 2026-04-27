import Link from "next/link";
import type { Metadata } from "next";
import AnimateOnView from "@/components/AnimateOnView";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "10 destinations de mobilité professionnelle internationale — Séville, Montréal, Londres, Malte, Berlin, Rome, New York, Miami, Maroc, Séoul. Chaque programme est structuré pour sa valeur pédagogique et professionnelle, adapté à votre filière.",
};

const destinations = [
  {
    city: "Séville",
    country: "Espagne",
    tag: "Culture & immersion",
    flag: "🇪🇸",
    accent: "#E85835",
    photo: "https://images.pexels.com/photos/28989039/pexels-photo-28989039.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
    headline: "L'Andalousie comme terrain de formation.",
    desc: "Séville offre un cadre exceptionnel pour une immersion totale : architecture baroque, économie tertiaire dynamique et chaleur humaine qui facilite naturellement l'ouverture interculturelle. Une destination idéale pour les filières orientées vers les services, le tourisme et le commerce.",
    highlights: [
      "Hébergement en centre-ville dans un établissement sélectionné et testé sur place",
      "Formation avec panorama socio-économique de la région andalouse",
      "Visites d'entreprises locales dans les secteurs tertiaire et services",
      "Activités culturelles : flamenco, Cathédrale de Séville, Alcazar",
    ],
    ideal: "Tourisme · Commerce · RH · Services",
  },
  {
    city: "Montréal",
    country: "Canada",
    tag: "Bilinguisme & Amérique du Nord",
    flag: "🇨🇦",
    accent: "#1E52D0",
    photo: "https://images.unsplash.com/photo-1519178614-68673b201f36?w=900&q=80",
    headline: "L'Amérique du Nord, en français.",
    desc: "Métropole bilingue et cosmopolite, Montréal est la seule ville nord-américaine où les apprentis francophones peuvent découvrir un modèle économique radicalement différent sans barrière linguistique. Un cadre idéal pour élargir sa vision tout en restant ancré dans sa langue.",
    highlights: [
      "Formation sur le modèle économique et l'environnement professionnel nord-américain",
      "Visites d'entreprises innovantes : tech, commerce, services, secteur créatif",
      "Exploration de la ville et de ses quartiers : Plateau, Vieux-Montréal, Mile End",
      "Rencontres avec des professionnels locaux et une communauté française active",
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
    desc: "Londres reste la référence absolue pour l'apprentissage de l'anglais professionnel en contexte réel. Une semaine à Londres, c'est une immersion totale dans une ville qui concentre une densité unique d'entreprises internationales et où l'anglais professionnel est la langue de travail universelle.",
    highlights: [
      "Formation Business English avec des formateurs professionnels natifs certifiés",
      "Visites d'entreprises et observation du monde du travail londonien",
      "Programme adapté au niveau et à la filière du groupe",
      "Découverte des quartiers emblématiques : City, Canary Wharf, Shoreditch",
    ],
    ideal: "Toutes filières · Progression en anglais professionnel",
  },
  {
    city: "Malte",
    country: "Méditerranée",
    tag: "English immersion",
    flag: "🇲🇹",
    accent: "#1E52D0",
    photo: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=900&q=80",
    headline: "L'anglais en immersion totale, sous le soleil méditerranéen.",
    desc: "Malte est l'une des rares destinations européennes entièrement anglophones — et l'une des plus accessibles. Son cadre méditerranéen, son histoire millénaire et sa taille humaine en font un environnement idéal pour une progression réelle en anglais professionnel, dans une atmosphère solaire et engageante.",
    highlights: [
      "Cours d'anglais professionnel animés par des formateurs natifs certifiés",
      "Visites culturelles : Valletta (capitale UNESCO), Blue Grotto, Mdina",
      "Visites d'entreprises locales adaptées à la filière du groupe",
      "Programme d'activités conçu pour maximiser l'immersion culturelle et sociale",
    ],
    ideal: "Toutes filières · Progression en anglais professionnel",
  },
  {
    city: "Maroc",
    country: "Afrique du Nord",
    tag: "Immersion & management interculturel",
    flag: "🇲🇦",
    accent: "#D4862A",
    photo: "https://images.pexels.com/photos/30710069/pexels-photo-30710069.jpeg?auto=compress&cs=tinysrgb&w=900&q=80",
    headline: "L'Afrique du Nord, entre tradition et dynamisme contemporain.",
    desc: "Le Maroc — principalement Marrakech et Casablanca — propose un programme ancré dans les réalités économiques et culturelles du pays. Une destination qui confronte les apprentis à un environnement professionnel différent, entre héritage fort et ambitions de modernisation.",
    highlights: [
      "Formation sur le tissu économique marocain et les échanges franco-marocains",
      "Visites d'entreprises : industrie, services, secteur numérique en développement",
      "Management interculturel et compréhension des codes professionnels locaux",
      "Immersion culturelle : médinas, artisanat, gastronomie, architecture",
    ],
    ideal: "Numérique · Marketing · Commerce · Management",
  },
  {
    city: "Berlin",
    country: "Allemagne",
    tag: "Entrepreneuriat & innovation",
    flag: "🇩🇪",
    accent: "#E85835",
    photo: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=900&q=80",
    headline: "L'Europe de l'entrepreneuriat et des idées neuves.",
    desc: "Berlin pense autrement. Capitale européenne de la scène startup et de l'innovation ouverte, elle offre aux apprentis une immersion dans un écosystème professionnel non conventionnel. Un programme volontairement orienté terrain et rencontres — moins de salle de cours, plus de fondateurs, d'entreprises et d'idées.",
    highlights: [
      "Immersion dans l'écosystème startup et entrepreneurial berlinois",
      "Visites d'entreprises innovantes : tech, digital, créatif, industrie",
      "Rencontres avec des professionnels, fondateurs et acteurs de la scène locale",
      "Programme culturel : East Side Gallery, Checkpoint Charlie, quartiers créatifs",
    ],
    ideal: "Numérique · Innovation · Commerce · Management",
  },
  {
    city: "New York",
    country: "États-Unis",
    tag: "Business & culture",
    flag: "🇺🇸",
    accent: "#1E52D0",
    photo: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=900&q=80",
    headline: "La ville où l'ambition professionnelle prend une autre dimension.",
    desc: "New York ne s'explique pas — elle se vit. Aucun autre environnement ne confronte aussi directement les apprentis à l'intensité d'un marché international. Business English de haut niveau, rencontres avec des professionnels en activité, énergie unique d'une ville qui ne ralentit jamais.",
    highlights: [
      "Business English intensif avec des professeurs et professionnels natifs",
      "Visites d'entreprises dans l'écosystème business new-yorkais",
      "Découverte de la ville : Manhattan, Brooklyn Bridge, musées emblématiques",
      "Rencontres avec des professionnels et expatriés français en activité",
    ],
    ideal: "Commerce international · Finance · Communication · Tourisme",
  },
  {
    city: "Rome",
    country: "Italie",
    tag: "Culture & économie italienne",
    flag: "🇮🇹",
    accent: "#D4862A",
    photo: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=900&q=80",
    headline: "L'Italie entre grandeur historique et réalité économique.",
    desc: "Rome offre un cadre de formation unique : une compréhension par l'immersion. Le programme s'appuie sur la richesse culturelle de la Ville éternelle pour ouvrir les apprentis à la réalité économique italienne — ses secteurs d'activité, ses entreprises, ses codes professionnels et son rapport singulier à la qualité.",
    highlights: [
      "Panorama socio-économique de l'Italie et de ses grands secteurs d'activité",
      "Visites d'entreprises locales sélectionnées selon la filière du groupe",
      "Immersion culturelle : Colossée, Forum romain, Vatican, Trastevere",
      "Compréhension des pratiques professionnelles et du tissu économique local",
    ],
    ideal: "Commerce · Tourisme · Services · Gestion",
  },
  {
    city: "Miami",
    country: "États-Unis",
    tag: "Business English & ouverture américaine",
    flag: "🇺🇸",
    accent: "#1E52D0",
    photo: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=900&q=80",
    headline: "L'Amérique dans sa version la plus internationale.",
    desc: "Miami n'est pas New York — et c'est précisément son atout. Carrefour des Amériques, ville internationale par nature, elle offre aux apprentis une lecture concrète du modèle économique américain dans un environnement cosmopolite, accessible et tourné vers l'Atlantique.",
    highlights: [
      "Panorama socio-économique des États-Unis et de la région Miami",
      "Visites de campus américains et d'entreprises locales ou françaises implantées",
      "Business English professionnel avec des intervenants natifs",
      "Exposition aux codes culturels et professionnels nord-américains",
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
    headline: "Une fenêtre directe sur l'Asie du XXIe siècle.",
    desc: "Séoul est l'une des métropoles les plus innovantes de la planète. Un séjour en Corée du Sud expose les apprentis à une culture professionnelle radicalement différente : exigence, culture de l'innovation, technologies de rupture. Un programme pour ceux qui veulent comprendre où se construit l'avenir.",
    highlights: [
      "Observation des pratiques professionnelles dans un environnement tech de pointe",
      "Visites de districts d'innovation, startups et grandes corporations coréennes",
      "Compréhension des codes sociaux et professionnels du monde du travail asiatique",
      "Développement de la capacité d'adaptation interculturelle en contexte réel",
    ],
    ideal: "Numérique · Tech · Industrie · Innovation",
  },
  {
    city: "Cape Town",
    country: "Afrique du Sud",
    tag: "Prochainement",
    flag: "🇿🇦",
    accent: "#1E52D0",
    photo: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=900&q=80",
    headline: "L'Afrique du Sud, entre entrepreneuriat et paysages d'exception.",
    desc: "Un programme alliant découverte économique, diversité culturelle et paysages d'exception. Le Cap s'impose comme une destination premium pour les apprentis qui souhaitent découvrir le continent africain sous un angle professionnel et ambitieux.",
    highlights: [],
    ideal: "",
    comingSoon: true,
  },
  {
    city: "Dubai",
    country: "Émirats arabes unis",
    tag: "Prochainement",
    flag: "🇦🇪",
    accent: "#D4862A",
    photo: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80",
    headline: "L'économie du futur, entre tradition et disruption mondiale.",
    desc: "Un programme orienté vers les modèles économiques émergents du Golfe : innovation, finance internationale, architecture de la disruption. Dubai représente un terrain d'immersion unique pour comprendre comment une ville se réinvente à toute vitesse.",
    highlights: [],
    ideal: "",
    comingSoon: true,
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
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80')",
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
            10 destinations.{" "}
            <span style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 500, color: "rgba(232,88,53,0.9)",
            }}>Une promesse différente à chaque fois.</span>
          </h1>
          <p className="anim-fade-up-3" style={{
            fontSize: 18, color: "rgba(255,255,255,0.65)",
            maxWidth: 580, lineHeight: 1.75,
          }}>
            Chaque destination est sélectionnée pour sa valeur pédagogique,
            professionnelle et humaine. Le même niveau d'exigence, la même
            structure de programme — adapté au contexte et à la filière de votre groupe.
          </p>

          {/* Flag strip */}
          <div className="anim-fade-up-4" style={{
            display: "flex", gap: 8, marginTop: 48, flexWrap: "wrap",
          }}>
            {destinations.filter(d => !d.comingSoon).map(d => (
              <div key={d.city} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 100, padding: "8px 16px",
                fontSize: 13, color: "rgba(255,255,255,0.7)",
              }}>
                <span>{d.flag}</span> {d.city}
              </div>
            ))}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 100, padding: "8px 16px",
              fontSize: 12, color: "rgba(255,255,255,0.35)",
              fontStyle: "italic",
            }}>
              🇿🇦 🇦🇪 prochainement
            </div>
          </div>
        </div>
      </section>

      {/* Destination cards */}
      <section style={{ padding: "64px 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {destinations.map(({ city, country, tag, flag, accent, photo, headline, desc, highlights, ideal, comingSoon }, i) => (
            <AnimateOnView key={city} delay={i * 0.06}>
            {comingSoon ? (
            /* ── Coming soon card ── */
            <div style={{
              background: "var(--bg-1)", border: "1px solid var(--border)",
              borderRadius: 20, overflow: "hidden",
              display: "grid", gridTemplateColumns: "340px 1fr",
              opacity: 0.75,
            }} className="dest-coming-soon-row">
              <div style={{ position: "relative", minHeight: 240, overflow: "hidden" }}>
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url('${photo}')`,
                  backgroundSize: "cover", backgroundPosition: "center",
                  filter: "grayscale(0.4) brightness(0.6)",
                }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(11,24,41,0.55)" }} />
                <div style={{ position: "absolute", bottom: 28, left: 28 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{flag} {country}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>{city}</div>
                  <div style={{
                    display: "inline-block", marginTop: 10,
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 100, padding: "4px 12px",
                  }}>Prochainement</div>
                </div>
              </div>
              <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{
                  fontSize: 14, fontStyle: "italic", color: "var(--text-muted)",
                  marginBottom: 16, fontFamily: "var(--font-serif)",
                }}>{headline}</p>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8 }}>{desc}</p>
                <div style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
                  Programme en cours de construction — disponible prochainement.
                </div>
              </div>
            </div>
            ) : (
            /* ── Full destination card ── */
            <div className="hover-row" style={{
              background: "var(--bg-1)", border: "1px solid var(--border)",
              borderRadius: 20, overflow: "hidden",
              display: "grid", gridTemplateColumns: "340px 1fr",
            }}>
              {/* Photo side — overflow hidden for zoom effect */}
              <div style={{
                position: "relative",
                minHeight: 280,
                overflow: "hidden",
              }}>
                {/* Background image — separate div for CSS zoom transform */}
                <div className="dest-photo-inner" style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url('${photo}')`,
                  backgroundSize: "cover", backgroundPosition: "center",
                }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(11,24,41,0.38) 0%, rgba(11,24,41,0.10) 100%)",
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
            )}
            </AnimateOnView>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
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
            <div className="section-label-light" style={{ justifyContent: "center" }}>Une destination vous intéresse ?</div>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 500,
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              letterSpacing: "-0.02em", marginBottom: 16, color: "#fff", position: "relative",
            }}>
              Construisons votre programme ensemble.
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.55)",
              maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.75, position: "relative",
            }}>
              Destination envisagée, filière, taille du groupe, dates — partagez votre projet.
              Nous vous revenons rapidement avec une première proposition adaptée à votre filière.
            </p>
            <Link href="/contact" className="btn-primary" style={{ position: "relative" }}>
              Demander un programme
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          </AnimateOnView>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .hover-row { grid-template-columns: 1fr !important; }
          .hover-row > div:first-child { min-height: 220px !important; }
          .dest-coming-soon-row { grid-template-columns: 1fr !important; }
          .dest-coming-soon-row > div:first-child { min-height: 200px !important; }
        }
        @media (max-width: 640px) {
          .hover-row > div:nth-child(2) { grid-template-columns: 1fr !important; }
          .hover-row > div:nth-child(2) > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </>
  );
}
