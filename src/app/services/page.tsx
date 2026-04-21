import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Conseil & stratégie, financement Erasmus+, coordination terrain, webinaires. AMI Panorama offre un accompagnement complet pour la mobilité internationale des apprentis.",
};

const services = [
  {
    num: "01",
    icon: "◈",
    title: "Conseil & stratégie",
    tagline: "Posez les bonnes bases avant de vous lancer",
    desc: "Chaque projet de mobilité est unique. Nous commençons par comprendre votre contexte : taille de votre structure, profils d'apprentis, contraintes réglementaires et budget disponible. À partir de cette analyse, nous construisons une feuille de route claire et réaliste.",
    items: [
      "Diagnostic de faisabilité et analyse de contexte",
      "Définition des objectifs pédagogiques et opérationnels",
      "Sélection des destinations et des entreprises d'accueil",
      "Plan de communication auprès des apprentis et tuteurs",
    ],
  },
  {
    num: "02",
    icon: "◎",
    title: "Financement Erasmus+",
    tagline: "Accédez aux fonds européens sans la complexité administrative",
    desc: "Les financements Erasmus+ sont accessibles — mais le montage de dossiers décourage souvent les organismes. Nous prenons en charge l'intégralité du processus : de l'éligibilité à la validation finale, en passant par le suivi budgétaire.",
    items: [
      "Vérification de l'éligibilité et stratégie de financement",
      "Rédaction et dépôt des dossiers de candidature",
      "Suivi administratif et reporting auprès de l'agence nationale",
      "Optimisation et gestion des enveloppes budgétaires",
    ],
  },
  {
    num: "03",
    icon: "◉",
    title: "Coordination terrain",
    tagline: "Un interlocuteur dédié à chaque étape du séjour",
    desc: "La réussite d'une mobilité se joue sur le terrain. Notre équipe coordonne l'ensemble de la logistique : du recrutement de l'entreprise d'accueil jusqu'au retour de l'apprenti, en assurant un suivi humain et pédagogique continu.",
    items: [
      "Recherche et sélection des entreprises et tuteurs d'accueil",
      "Organisation du logement, transport et assurances",
      "Suivi pédagogique en cours de séjour (visites, appels, bilans)",
      "Gestion des imprévus et support 24h en cas d'urgence",
    ],
  },
  {
    num: "04",
    icon: "◐",
    title: "Webinaires & formation",
    tagline: "Préparez vos apprentis à réussir leur expérience",
    desc: "Une mobilité réussie se prépare en amont. Nous proposons des sessions de sensibilisation, des modules de préparation culturelle et des outils pratiques pour que chaque apprenti parte informé, motivé et outillé.",
    items: [
      "Webinaires d'information pour les apprentis et leurs familles",
      "Ateliers de préparation interculturelle et linguistique",
      "Kits de préparation (guides, checklist, outils digitaux)",
      "Sessions de restitution et de valorisation à la rentrée",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section style={{ position: "relative", overflow: "hidden", paddingTop: 140, paddingBottom: 80 }}>
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400,
          background: "radial-gradient(ellipse, rgba(107,92,231,0.14) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label">Nos services</div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, maxWidth: 640, marginBottom: 24 }}>
            Un accompagnement<br />
            <span className="gradient-text">pensé pour vous.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.7 }}>
            Quatre pôles de service, une seule promesse : vous permettre de déployer
            des mobilités internationales de qualité, sans vous noyer dans la complexité.
          </p>
        </div>
      </section>

      {/* Services list */}
      <section style={{ padding: "40px 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {services.map(({ num, icon, title, tagline, desc, items }) => (
            <div key={num} className="hover-row service-row" style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              background: "var(--bg-1)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
            }}>
              {/* Left panel */}
              <div style={{
                padding: "40px 32px",
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: "var(--bg-2)",
              }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase" }}>{num}</span>
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: "rgba(107,92,231,0.1)",
                  border: "1px solid rgba(107,92,231,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, color: "var(--accent-light)",
                }}>{icon}</div>
                <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3, marginTop: 4 }}>{title}</h2>
              </div>

              {/* Right panel */}
              <div style={{ padding: "40px 44px" }}>
                <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.02em", color: "var(--accent-light)", marginBottom: 16, textTransform: "uppercase" }}>{tagline}</p>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 28, maxWidth: 640 }}>{desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {items.map((item) => (
                    <div key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 5, height: 5, borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0, marginTop: 7,
                      }} />
                      <span style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
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
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "64px 48px", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "radial-gradient(ellipse at 50% 0%, rgba(107,92,231,0.12) 0%, transparent 60%)",
            }} />
            <div className="section-label" style={{ justifyContent: "center" }}>Discutons de votre projet</div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16, position: "relative" }}>
              Quel service vous correspond ?
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7, position: "relative" }}>
              Décrivez-nous votre situation lors d'un premier échange gratuit. Nous vous orienterons vers la formule la plus adaptée.
            </p>
            <Link href="/contact" className="btn-primary" style={{ position: "relative" }}>
              Prendre contact
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .service-row { grid-template-columns: 1fr !important; }
          .service-row > div:first-child { border-right: none !important; border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </>
  );
}
