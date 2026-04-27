import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de cookies",
  description: "Politique de cookies du site AMI Panorama — types de cookies utilisés, durée de conservation et gestion des préférences.",
  robots: { index: false, follow: false },
};

const cookieTypes = [
  {
    name: "Cookies strictement nécessaires",
    desc: "Ces cookies sont indispensables au bon fonctionnement du site. Ils permettent la navigation, la sécurité et la mémorisation de vos préférences de session. Ils ne peuvent pas être désactivés sans affecter le fonctionnement du site.",
    examples: "Session utilisateur, préférences de consentement.",
    duration: "Session ou jusqu'à 12 mois.",
    consent: false,
  },
  {
    name: "Cookies de mesure d'audience",
    desc: "Ces cookies nous permettent de mesurer le trafic et d'analyser le comportement des visiteurs sur le site, afin d'améliorer son contenu et ses performances. Les données collectées sont agrégées et anonymisées.",
    examples: "Nombre de visites, pages consultées, durée de session, provenance du trafic.",
    duration: "13 mois maximum.",
    consent: true,
  },
  {
    name: "Cookies de tiers",
    desc: "Certaines fonctionnalités du site peuvent faire appel à des services tiers (polices web, cartes, médias intégrés). Ces tiers sont susceptibles de déposer leurs propres cookies, soumis à leurs propres politiques de confidentialité.",
    examples: "Google Fonts, services d'hébergement vidéo.",
    duration: "Variable selon le service tiers.",
    consent: true,
  },
];

const sections = [
  {
    title: "1. Qu'est-ce qu'un cookie ?",
    paras: [
      "Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de votre visite sur un site web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue préférée ou d'autres paramètres, afin de faciliter votre prochaine visite et de rendre le site plus utile.",
      "Les cookies sont gérés par votre navigateur web et peuvent être lus par le site qui les a déposés à chaque nouvelle visite.",
    ],
  },
  {
    title: "4. Base légale",
    paras: [
      "Conformément aux recommandations de la CNIL et à la directive ePrivacy, les cookies strictement nécessaires au fonctionnement du site ne requièrent pas de consentement préalable.",
      "En revanche, les cookies de mesure d'audience et les cookies tiers ne sont déposés qu'avec votre consentement explicite, recueilli lors de votre première visite sur le site.",
    ],
  },
  {
    title: "5. Gestion et refus des cookies",
    paras: [
      "Vous pouvez gérer vos préférences en matière de cookies à tout moment. Plusieurs options s'offrent à vous :",
      "Via votre navigateur : la plupart des navigateurs vous permettent d'accepter, de refuser ou de supprimer les cookies dans leurs paramètres (rubrique « Vie privée » ou « Cookies »).",
      "Via le bandeau de consentement : lors de votre première visite, un bandeau vous permet d'accepter ou de refuser les cookies non essentiels.",
      "Le refus des cookies de mesure d'audience n'affecte pas votre navigation sur le site, mais peut limiter notre capacité à en améliorer le contenu.",
    ],
  },
  {
    title: "6. Contact",
    paras: [
      "Pour toute question relative à la gestion des cookies ou à la protection de vos données, vous pouvez contacter AMI Panorama à l'adresse suivante : info@amipanorama.com.",
    ],
  },
];

export default function PolitiqueCookiesPage() {
  return (
    <>
      <section style={{
        paddingTop: 140, paddingBottom: 56,
        background: "var(--bg)",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <div className="section-label">Cookies</div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700,
            letterSpacing: "-0.04em", marginBottom: 16,
          }}>
            Politique de cookies
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7 }}>
            Le site amipanorama.com utilise des cookies et technologies similaires.
            Cette page vous explique leur nature, leur finalité et les moyens dont vous
            disposez pour les gérer. Dernière mise à jour : janvier 2025.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Section 1 */}
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }}>
            <div style={{ padding: "36px 40px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 16 }}>
                {sections[0].title}
              </h2>
              {sections[0].paras.map((p, j) => (
                <p key={j} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0, marginBottom: j < sections[0].paras.length - 1 ? 10 : 0 }}>{p}</p>
              ))}
            </div>
          </div>

          {/* Cookie types table */}
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }}>
            <div style={{ padding: "36px 40px 28px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 4 }}>
                2. Types de cookies utilisés sur ce site
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>
                Le tableau ci-dessous détaille les catégories de cookies présents sur le site.
              </p>
            </div>
            {cookieTypes.map(({ name, desc, examples, duration, consent }, i) => (
              <div key={name} style={{
                padding: "24px 40px",
                borderTop: "1px solid var(--border)",
                display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start",
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{name}</h3>
                    <span style={{
                      fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      background: consent ? "rgba(30,82,208,0.08)" : "rgba(30,130,80,0.08)",
                      color: consent ? "var(--blue)" : "#1a7a40",
                      borderRadius: 100, padding: "3px 9px",
                    }}>
                      {consent ? "Consentement requis" : "Nécessaire"}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 8 }}>{desc}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    <strong style={{ color: "var(--text-secondary)" }}>Exemples : </strong>{examples}
                    {"  ·  "}
                    <strong style={{ color: "var(--text-secondary)" }}>Durée : </strong>{duration}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Remaining sections */}
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {sections.slice(1).map(({ title, paras }, i) => (
              <div key={title} style={{
                padding: "36px 40px",
                borderBottom: i < sections.slice(1).length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 16 }}>{title}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {paras.map((p, j) => (
                    <p key={j} style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, margin: 0 }}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/" className="btn-ghost" style={{ fontSize: 13, padding: "9px 20px" }}>
              Retour à l&apos;accueil
            </Link>
            <Link href="/politique-de-confidentialite" className="btn-ghost" style={{ fontSize: 13, padding: "9px 20px" }}>
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
