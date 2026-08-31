import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre programme",
  description:
    "Un programme de mobilité internationale complet : formation professionnelle structurée, visites d'entreprise, encadrement terrain, logistique et accompagnement administratif. Découvrez chaque composante du programme AMI Panorama.",
};

const whyItems = [
  {
    num: "01",
    title: "Attractivité et différenciation",
    accent: "#24478F",
    desc: "Les établissements qui intègrent une mobilité internationale dans leur cursus se démarquent dans le recrutement. C'est souvent ce qui fait la différence dans le choix d'une filière par les candidats et leurs familles.",
  },
  {
    num: "02",
    title: "Cohésion de promotion",
    accent: "#1B3D88",
    desc: "Un séjour à l'étranger crée des liens entre étudiants que plusieurs années de cours ne recréent pas. Ces liens renforcent l'engagement, réduisent l'abandon et construisent un sentiment d'appartenance durable.",
  },
  {
    num: "03",
    title: "Image et positionnement",
    accent: "#24478F",
    desc: "Proposer une mobilité internationale signale un standard d'ambition et d'exigence. C'est un investissement dans la perception de qualité de votre formation, et dans la fierté de vos étudiants.",
  },
  {
    num: "04",
    title: "Valeur du parcours étudiant",
    accent: "#1B3D88",
    desc: "Les participants qui vivent une expérience internationale en ressortent avec une vision plus large et une confiance renforcée. Ils valorisent mieux leur formation, et ils en parlent autour d'eux.",
  },
];

const faqItems = [
  {
    q: "À qui s'adressent les programmes AMI Panorama ?",
    a: "Aux CFA, lycées professionnels, écoles supérieures et établissements en alternance souhaitant intégrer une mobilité internationale structurée à leur cursus. Nos programmes s'adressent à des groupes de 10 à 40 étudiants, encadrés par un ou plusieurs référents pédagogiques de l'établissement.",
  },
  {
    q: "Combien de temps dure une mobilité ?",
    a: "Notre format de référence reste le séjour de 8 jours / 7 nuits. Selon votre projet, nous proposons des formats plus courts ou plus longs, de 4 à 5 jours jusqu'à 31 jours, avec une expertise particulière sur les séjours d'une semaine, de deux semaines et d'un mois. La durée se définit avec vous, selon les objectifs pédagogiques, le profil du groupe et la destination.",
  },
  {
    q: "Que comprend concrètement le programme ?",
    a: "Formation professionnelle (de 15h à 82h selon le format, la destination et les objectifs pédagogiques), visites d'entreprises sélectionnées pour leur pertinence sectorielle, programme d'activités culturelles, hébergement avec petit-déjeuner, ensemble des transports sur place, assurances complètes et accompagnement administratif de bout en bout.",
  },
  {
    q: "Quel est le rôle de l'établissement pendant le séjour ?",
    a: "L'établissement reste le référent pédagogique du groupe. Son rôle est d'accompagner les étudiants sur le plan éducatif et de valider l'intégration du séjour dans le parcours de formation. Nous prenons en charge tout ce qui relève de la logistique, de l'encadrement terrain et de l'organisation.",
  },
  {
    q: "Comment la mobilité s'intègre-t-elle dans un calendrier de formation ?",
    a: "Nous adaptons les dates, la destination et le contenu en fonction du calendrier de votre établissement et des contraintes de l'alternance. La coordination avec les entreprises d'accueil des apprentis fait partie de notre accompagnement préalable.",
  },
  {
    q: "Proposez-vous un accompagnement administratif ?",
    a: "Oui. L'ingénierie administrative fait partie intégrante de chaque programme : structuration du projet de mobilité, rédaction des conventions, identification des cadres de financement mobilisables selon votre situation et suivi documentaire jusqu'à la clôture du projet.",
  },
  {
    q: "Comment abordez-vous la structuration financière ?",
    a: "Nous accompagnons chaque établissement dans l'identification des dispositifs pertinents selon sa situation, fonds propres, branches professionnelles, collectivités, fonds européens. Nous ne garantissons pas de financement, mais nous structurons le projet pour qu'il soit éligible aux dispositifs existants et coordonnons les démarches.",
  },
  {
    q: "Les programmes sont-ils personnalisables ?",
    a: "Oui. Chaque programme est adapté à la filière, au niveau et au projet de votre groupe. Le contenu de formation, le choix des entreprises visitées, le programme culturel et les dates peuvent être ajustés en concertation avec votre équipe.",
  },
  {
    q: "Qui encadre les étudiants sur place ?",
    a: "Une équipe terrain AMI Panorama est présente et disponible 24h/24 pendant toute la durée du séjour. En parallèle, le ou les référents de l'établissement accompagnent le groupe sur le plan pédagogique.",
  },
  {
    q: "Quel est le niveau d'accompagnement avant, pendant et après ?",
    a: "Avant : coordination complète, programme, logistique, assurances, documents. Pendant : encadrement terrain 24h/24. Après : bilan de séjour, attestations de formation, comptes-rendus de visite et accompagnement pour la clôture administrative du projet.",
  },
];

const programPillars = [
  {
    label: "Apprendre",
    title: "Une formation qui sort de la salle.",
    desc: "Cours, Business English et ateliers sectoriels se construisent autour de votre groupe, de sa filière et de la destination.",
    detail: "De 15 à 82 heures selon le format.",
    image: "/Assets/program/visite-conference.jpg",
  },
  {
    label: "Découvrir",
    title: "Des entreprises, pas des vitrines.",
    desc: "Vos participants rencontrent des professionnels et voient comment leur secteur prend vie ailleurs.",
    detail: "Des visites choisies pour leur pertinence.",
    image: "/Assets/program/visite-startup.jpg",
  },
  {
    label: "Vivre",
    title: "Une ville à vivre, ensemble.",
    desc: "La culture, les rencontres et les temps partagés donnent une vraie profondeur au séjour.",
    detail: "Un programme adapté à la saison et au groupe.",
    image: "/Assets/program/visite-eleves.jpg",
  },
  {
    label: "Être accompagné",
    title: "Vous vous concentrez sur le groupe.",
    desc: "Hébergement, transports, assurances et coordination sont préparés et suivis par notre équipe.",
    detail: "Présence terrain pendant tout le séjour.",
    image: "/Assets/program/visite-pro.jpg",
  },
];

export default function NotreProgrammePage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero-section" style={{
        position: "relative", paddingTop: 160, paddingBottom: 80,
        background: "var(--bg)", overflow: "hidden",
      }}>
        {/* Decorative blue glow top-right */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 600, height: 500,
          background: "radial-gradient(ellipse at top right, rgba(36,71,143,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label anim-fade-up">Notre programme</div>
          <h1 className="anim-fade-up-2" style={{
            fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700,
            letterSpacing: "-0.04em", lineHeight: 1.08, maxWidth: 720, marginBottom: 24,
          }}>
            Un programme structuré.{" "}
            <span className="gradient-text">Coordonné de bout en bout.</span>
          </h1>
          <p className="anim-fade-up-3" style={{
            fontSize: 18, color: "var(--text-secondary)", maxWidth: 620, lineHeight: 1.75, marginBottom: 48,
          }}>
            Chaque programme AMI Panorama est un séjour immersif et professionnel,
            pensé pour que vos participants vivent une expérience formative et humaine
            réelle. Formation, visites, encadrement, logistique, appui administratif,
            chaque composante est coordonnée par notre équipe. Vous restez le référent pédagogique de votre groupe.
          </p>

          {/* Quick stats strip */}
          <div className="anim-fade-up-4" style={{
            display: "flex", gap: 0, flexWrap: "wrap",
            background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
          }}>
            {([
              ["8 j / 7 nuits", "format de référence, de 4 à 5 j jusqu'à 31 j"],
              ["15 → 82h", "de formation selon le format"],
              ["10", "destinations actives"],
              ["Appui admin.", "inclus dans chaque programme"],
            ] as [string, string][]).map(([v, l], i, arr) => (
              <div key={v} style={{
                padding: "22px 32px", flex: 1, minWidth: 140,
                borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 700,
                  letterSpacing: "-0.03em", color: "var(--blue)", lineHeight: 1, marginBottom: 5,
                }}>{v}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section style={{ padding: "0 24px 72px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="why-grid">
            {/* Left: editorial statement */}
            <div style={{ position: "sticky", top: 100 }}>
              <div className="section-label">Pourquoi ça compte</div>
              <h2 style={{
                fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700,
                letterSpacing: "-0.035em", marginBottom: 40,
              }}>
                Ce que la mobilité change, vraiment.
              </h2>
              <p style={{
                fontSize: "clamp(17px, 2vw, 22px)",
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                fontWeight: 500, lineHeight: 1.5,
                color: "var(--text-secondary)", marginBottom: 20,
                letterSpacing: "-0.01em",
              }}>
                « Ce n'est pas une semaine supplémentaire dans le calendrier.
                C'est la semaine dont vos participants parleront encore dans dix ans. »
              </p>
              <p style={{
                fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, marginBottom: 28,
              }}>
                La mobilité ne complète pas une formation. Elle en change la valeur perçue,
                pour les candidats qui choisissent votre filière, pour les apprentis qui la vivent,
                et pour l'établissement qui a su la rendre possible.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)" }}>
                <div style={{ width: 28, height: 1.5, background: "var(--coral)", flexShrink: 0 }} />
                AMI Panorama
              </div>
            </div>
            {/* Right: numbered list, no boxes */}
            <div>
              {whyItems.map(({ num, title, accent, desc }) => (
                <div key={num} style={{
                  display: "flex", gap: 24,
                  padding: "28px 0",
                  borderTop: "1px solid var(--border)",
                }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: accent, flexShrink: 0,
                    minWidth: 28, paddingTop: 2,
                  }}>{num}</div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.02em" }}>{title}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>{desc}</p>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid var(--border)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Photo editorial break */}
      <section style={{
        position: "relative", height: 340, overflow: "hidden",
        // La citation parle de "coulisses d'entreprises" : le visuel doit montrer
        // une vraie visite pro, pas une rue. Cadrage à droite car le texte occupe
        // la moitié gauche sous le dégradé sombre.
        backgroundImage: "url('/Assets/program/visite-startup.jpg')",
        backgroundSize: "cover", backgroundPosition: "72% 42%",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(11,24,41,0.75) 0%, rgba(11,24,41,0.3) 60%, rgba(11,24,41,0.5) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center",
          maxWidth: 1200, margin: "0 auto", padding: "0 24px", width: "100%",
        }}>
          <div style={{ maxWidth: 560 }}>
            <p style={{
              fontSize: "clamp(20px, 2.8vw, 32px)",
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 500, color: "#fff", lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}>
              « Vos apprentis ne visitent pas des vitrines, ils entrent dans les coulisses
              d'entreprises qui façonnent leur secteur. »
            </p>
            <div style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
              AMI Panorama, Philosophie du programme
            </div>
          </div>
        </div>
      </section>

      {/* Programme components */}
      <section style={{ padding: "64px 24px 80px", background: "var(--bg)" }}>
        <div className="reveal" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div className="section-label">Une semaine AMI</div>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700,
              letterSpacing: "-0.035em", maxWidth: 560,
            }}>
              Apprendre, découvrir, vivre. Le reste est déjà organisé.
            </h2>
          </div>

          <div className="programme-pillars">
            {programPillars.map(({ label, title, desc, detail, image }) => (
              <article key={label} className="programme-pillar">
                <div className="programme-pillar-photo" style={{ backgroundImage: `url('${image}')` }} />
                <div className="programme-pillar-copy">
                  <div className="programme-pillar-label">{label}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <span>{detail}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Visites professionnelles, photos réelles (générées par scripts/optimize-photos.sh) */}
      <section style={{ padding: "0 24px 80px", background: "var(--bg)" }}>
        <div className="reveal" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <div className="section-label">Sur le terrain</div>
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700,
              letterSpacing: "-0.035em", maxWidth: 600,
            }}>
              Les visites professionnelles, en images
            </h2>
          </div>
          <div className="vp-grid">
            {[
              { src: "/Assets/program/visite-eleves.jpg", cap: "Visite d'entreprise" },
              { src: "/Assets/program/visite-startup.jpg", cap: "Rencontre en entreprise" },
              { src: "/Assets/program/visite-conference.jpg", cap: "Conférence professionnelle" },
              { src: "/Assets/program/visite-pro.jpg", cap: "Échanges sur le terrain" },
              { src: "/Assets/program/visite-startup-2.jpg", cap: "Écosystème startup" },
            ].map((p) => (
              <div key={p.src} className="vp-photo" style={{ backgroundImage: `url('${p.src}')` }}>
                <span className="vp-cap">{p.cap}</span>
              </div>
            ))}
          </div>
        </div>
      <style>{`
        .programme-pillars { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .programme-pillar {
          display: grid; grid-template-columns: 42% 1fr; min-height: 276px; overflow: hidden;
          background: var(--bg-1); border: 1px solid var(--border); border-radius: 18px;
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }
        .programme-pillar:hover { transform: translateY(-3px); border-color: var(--border-hover); box-shadow: 0 18px 38px rgba(11,24,41,.10); }
        .programme-pillar-photo { background-size: cover; background-position: center; min-height: 100%; }
        .programme-pillar-copy { display: flex; flex-direction: column; align-items: flex-start; padding: 30px 28px; }
        .programme-pillar-label { color: var(--blue); font-size: 11px; font-weight: 700; letter-spacing: .11em; text-transform: uppercase; margin-bottom: 20px; }
        .programme-pillar h3 { font-size: clamp(20px, 2vw, 28px); line-height: 1.08; letter-spacing: -.04em; margin-bottom: 14px; }
        .programme-pillar p { color: var(--text-secondary); font-size: 14px; line-height: 1.7; margin-bottom: auto; }
        .programme-pillar span { color: var(--text-muted); font-size: 12px; line-height: 1.5; margin-top: 22px; }
        .vp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
          .vp-photo {
            position: relative; aspect-ratio: 4 / 3; border-radius: 14px; overflow: hidden;
            background-size: cover; background-position: center;
            box-shadow: 0 10px 30px rgba(11,24,41,0.10);
          }
          .vp-photo::after { content: ""; position: absolute; inset: 0;
            background: linear-gradient(to top, rgba(11,24,41,0.55), transparent 55%); }
          .vp-cap {
            position: absolute; left: 14px; bottom: 12px; z-index: 1; color: #fff;
            font-size: 11px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
            text-shadow: 0 1px 8px rgba(0,0,0,0.5);
          }
        `}</style>
      </section>

      {/* Données structurées FAQ (SEO + IA) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* FAQ */}
      <section style={{ padding: "0 24px 80px", background: "var(--bg)" }}>
        <div className="reveal" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div className="section-label">Questions fréquentes</div>
            <h2 style={{
              fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700,
              letterSpacing: "-0.035em", maxWidth: 520,
            }}>
              Ce que les établissements nous demandent le plus souvent
            </h2>
          </div>
          <div>
            {faqItems.map(({ q, a }, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "2fr 3fr", gap: 48,
                padding: "28px 0",
                borderTop: "1px solid var(--border)",
                alignItems: "start",
              }} className="faq-row">
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.4, color: "var(--text-primary)" }}>{q}</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>{a}</div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 24px 96px" }}>
        <div className="reveal" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "var(--navy)", borderRadius: 20,
            padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-60px", left: "25%",
              width: 450, height: 300,
              background: "radial-gradient(ellipse, rgba(36,71,143,0.3) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: "-40px", right: "20%",
              width: 350, height: 250,
              background: "radial-gradient(ellipse, rgba(27,61,136,0.22) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div className="section-label-light" style={{ justifyContent: "center" }}>Construisons votre programme</div>
            <h2 style={{
              fontSize: "clamp(24px, 3.5vw, 44px)", fontWeight: 500,
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              letterSpacing: "-0.02em", marginBottom: 16, color: "#fff", position: "relative",
            }}>
              Parlez-nous de votre groupe et de votre projet.
            </h2>
            <p style={{
              fontSize: 16, color: "rgba(255,255,255,0.55)",
              maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.75, position: "relative",
            }}>
              Filière, destination envisagée, dates, taille du groupe. Nous revenons vers
              vous avec une première proposition adaptée à votre contexte.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/contact" className="btn-primary">
                Demander un programme
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/destinations" className="btn-ghost-light">Choisir une destination</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .programme-pillars { grid-template-columns: 1fr; }
          .programme-pillar { grid-template-columns: 38% 1fr; min-height: 230px; }
          .programme-pillar-copy { padding: 24px 20px; }
          .programme-pillar-label { margin-bottom: 14px; }
          .why-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .faq-row { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </>
  );
}
