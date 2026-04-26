import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "L'histoire d'AMI Panorama : deux fondateurs, deux trajectoires, un constat sur le parcours des apprentis. Notre mission, notre modèle et ce qui nous distingue en tant qu'opérateur de mobilité.",
};

const values = [
  {
    num: "01",
    title: "Qualité sans compromis",
    accent: "#1E52D0",
    desc: "Chaque hébergement, chaque formateur, chaque entreprise partenaire est sélectionné selon des critères stricts. Rien n'est laissé au hasard dans un programme AMI.",
  },
  {
    num: "02",
    title: "Simplicité pour vous",
    accent: "#E85835",
    desc: "Votre rôle est de vous concentrer sur vos apprentis et votre pédagogie. Le nôtre est de prendre en charge tout ce qui entoure le séjour — logistique, encadrement terrain, démarches administratives et ingénierie de financement.",
  },
  {
    num: "03",
    title: "Impact sur les apprentis",
    accent: "#1E52D0",
    desc: "Une mobilité réussie transforme un parcours. Nous le savons car nos 3 000 alumni nous le disent. C'est cette conviction qui anime chaque programme que nous construisons.",
  },
  {
    num: "04",
    title: "Partenariat durable",
    accent: "#E85835",
    desc: "Nous construisons des relations à long terme avec les établissements qui nous font confiance. 50 organismes travaillent avec nous depuis plusieurs années — et la majorité repart chaque saison.",
  },
];

const numbers = [
  { value: "2022", label: "fondé à Montréal" },
  { value: "3 000+", label: "apprentis accompagnés" },
  { value: "100+", label: "groupes coordonnés" },
  { value: "50", label: "établissements partenaires" },
];

export default function AProposPage() {
  return (
    <>
      {/* Hero — dark photo section */}
      <section style={{
        position: "relative", paddingTop: 160, paddingBottom: 96,
        background: "var(--navy)", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/formation-seville.jpg')",
          backgroundSize: "cover", backgroundPosition: "center 30%",
          opacity: 0.15,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(11,24,41,0.2) 0%, var(--navy) 100%)",
        }} />
        {/* Blue glow */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 600, height: 500,
          background: "radial-gradient(ellipse at top right, rgba(30,82,208,0.2) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label-light anim-fade-up">À propos</div>
          <h1 className="anim-fade-up-2" style={{
            fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 700,
            letterSpacing: "-0.04em", lineHeight: 1.08, maxWidth: 740, marginBottom: 28,
            color: "#fff",
          }}>
            Nés du contraste{" "}
            <span style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 500, color: "rgba(232,88,53,0.9)",
            }}>entre deux mondes.</span>
          </h1>
          <p className="anim-fade-up-3" style={{
            fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 600, lineHeight: 1.75,
          }}>
            AMI Panorama est née d'une observation simple : dans le parcours d'un étudiant,
            certaines expériences — collectives, internationales, mémorables — ne sont pas
            accessibles de la même façon selon la filière choisie. Nous existons pour changer ça.
          </p>
        </div>
      </section>

      {/* Numbers bar */}
      <section style={{ padding: "0 24px", position: "relative", zIndex: 2, marginTop: -1 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
            background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden",
            boxShadow: "0 8px 40px rgba(11,24,41,0.12)",
          }} className="numbers-grid">
            {numbers.map(({ value, label }, i, arr) => (
              <div key={label} style={{
                padding: "36px 28px", textAlign: "center",
                borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700,
                  letterSpacing: "-0.045em", color: "var(--blue)", lineHeight: 1, marginBottom: 8,
                }}>{value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding story */}
      <section style={{ padding: "72px 24px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">Notre histoire</div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64,
          }} className="founder-grid">
            <div>
              <h2 style={{
                fontSize: "clamp(22px, 2.8vw, 32px)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 28,
              }}>
                Deux trajectoires,{" "}
                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500 }}>
                  une conviction.
                </span>
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 18 }}>
                Arnaud a fait une grande partie de ses études à l'international — notamment à
                l'Université de Montréal et à Harvard. Il a vécu ce que les étudiants des grandes
                écoles et des campus anglophones connaissent : des cohortes soudées, des réseaux
                qui durent toute une vie, des séjours internationaux qui forgent une identité
                collective. Des souvenirs qui restent.
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85 }}>
                Samuel venait d'un autre horizon — celui de la formation professionnelle et de
                l'apprentissage. Un monde exigeant, formateur, qui donne aux étudiants une avance
                réelle sur le marché du travail. Mais dans lequel certaines expériences manquent
                structurellement : l'international collectif, la vie de groupe hors cadre
                professionnel, les moments qui lient une promotion durablement.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 18 }}>
                Tous deux ont beaucoup voyagé ensemble. Et à chaque voyage, la même conviction
                s'est renforcée : le voyage crée certains des liens les plus durables d'un parcours
                de formation. Pas simplement des souvenirs — des transformations professionnelles
                et humaines qui durent.
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 18 }}>
                De cette conviction est née une question : pourquoi cette expérience serait-elle
                réservée à certains parcours ? Et si on la construisait intentionnellement, pour
                ceux qui en bénéficient le moins ?
              </p>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 32 }}>
                AMI Panorama a été fondé en 2022. En 2023, le premier groupe quittait Paris pour
                Montréal. Depuis, d'autres établissements nous ont rejoints, d'autres destinations
                ont ouvert — et la conviction initiale s'est confirmée séjour après séjour.
              </p>
              <div style={{ paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 40 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 5 }}>Arnaud</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Université de Montréal · Harvard</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 5 }}>Samuel</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Formation professionnelle · Alternance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The gap we bridge */}
      <section style={{ padding: "56px 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <div className="section-label">Ce que nous cherchons à corriger</div>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3,
          }} className="gap-grid">
            <div style={{ padding: "44px 44px", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)", marginBottom: 16 }}>Grandes écoles · Universités</div>
              <h3 style={{
                fontSize: "clamp(16px, 2vw, 21px)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.3, marginBottom: 20,
              }}>
                Cohésion de promotion. Réseaux actifs. Mémoires collectives.
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>
                Dans les grandes écoles et les campus traditionnels, les étudiants bénéficient
                d'une vie collective structurée : voyages de promotion, séjours internationaux,
                associations, cohortes soudées, réseaux alumni actifs. Ces expériences ne sont
                pas accessoires — elles construisent une identité, des liens durables et un fort
                attachement à l'établissement. Elles contribuent directement à son attractivité.
              </p>
            </div>
            <div style={{
              padding: "44px 44px", background: "var(--navy)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at top right, rgba(232,88,53,0.14) 0%, transparent 65%)",
                pointerEvents: "none",
              }} />
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(232,88,53,0.8)", marginBottom: 16, position: "relative" }}>CFA · Formations en alternance</div>
              <h3 style={{
                fontSize: "clamp(16px, 2vw, 21px)", fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1.3, marginBottom: 20,
                color: "#fff", position: "relative",
              }}>
                Un parcours exigeant. Mais souvent moins de ces expériences collectives.
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.60)", lineHeight: 1.85, position: "relative" }}>
                Les apprentis vivent un parcours intensément professionnel et formateur. Mais ils
                ont moins accès, structurellement, aux expériences qui marquent durablement une
                formation : l'international collectif, les souvenirs partagés hors contexte
                professionnel, les moments qui lient une promotion. AMI Panorama existe pour que
                cette dimension soit accessible à eux aussi — sans renoncer à l'exigence
                pédagogique qui les caractérise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <div className="section-label">Nos engagements</div>
            <h2 style={{
              fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700,
              letterSpacing: "-0.035em",
            }}>Ce sur quoi vous pouvez compter.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3 }} className="values-grid">
            {values.map(({ num, title, accent, desc }) => (
              <div key={title} style={{
                padding: "36px 40px", background: "var(--bg-1)",
                border: "1px solid var(--border)", borderRadius: 16,
                display: "flex", gap: 24, alignItems: "flex-start",
              }} className="hover-card-full">
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: accent + "15", border: `1px solid ${accent}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>{num}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.02em" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.75 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ padding: "0 24px 72px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            background: "var(--navy)", borderRadius: 20,
            padding: "60px 56px", position: "relative", overflow: "hidden",
            display: "grid", gridTemplateColumns: "1fr auto",
            gap: 48, alignItems: "center",
          }} className="testimonial-grid">
            {/* Decorative glow */}
            <div style={{
              position: "absolute", top: "-80px", left: "0",
              width: 500, height: 400,
              background: "radial-gradient(ellipse at left, rgba(30,82,208,0.25) 0%, transparent 65%)",
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{
                fontSize: 60, lineHeight: 0.8, marginBottom: 24,
                fontFamily: "Georgia, serif", color: "rgba(232,88,53,0.5)",
              }}>&ldquo;</div>
              <blockquote style={{
                fontSize: "clamp(17px, 2.2vw, 22px)", fontWeight: 500,
                fontFamily: "var(--font-serif)", fontStyle: "italic",
                letterSpacing: "-0.01em", lineHeight: 1.55, color: "#fff", marginBottom: 32,
              }}>
                Merci pour votre accompagnement. Vous avez été exceptionnels
                et vous avez rendu notre voyage incroyable.
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", background: "var(--blue)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "#fff",
                }}>F</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Florian Riocreux</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Référent Mobilité — ECEMA</div>
                </div>
              </div>
            </div>
            {/* Right side stat callout */}
            <div style={{
              position: "relative", textAlign: "center",
              padding: "32px 28px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, flexShrink: 0, minWidth: 160,
            }}>
              <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.05em", color: "#fff", lineHeight: 1 }}>3 000+</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 8, lineHeight: 1.4 }}>apprentis accompagnés</div>
              <div style={{ width: 32, height: 1.5, background: "var(--coral)", margin: "16px auto 0" }} />
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 10 }}>10 ans d'expérience</div>
            </div>
          </div>
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
              background: "radial-gradient(ellipse at 50% 0%, rgba(30,82,208,0.07) 0%, transparent 60%)",
            }} />
            <div className="section-label" style={{ justifyContent: "center" }}>Travaillons ensemble</div>
            <h2 style={{
              fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700,
              letterSpacing: "-0.035em", marginBottom: 16, position: "relative",
            }}>
              Votre prochain groupe mérite<br />une vraie mobilité internationale.
            </h2>
            <p style={{
              fontSize: 15, color: "var(--text-secondary)",
              maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.75, position: "relative",
            }}>
              Parlez-nous de votre projet. Premier échange gratuit et sans engagement.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              <Link href="/contact" className="btn-primary">
                Demander un programme
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/notre-programme" className="btn-ghost">Voir le programme</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .founder-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .gap-grid { grid-template-columns: 1fr !important; }
          .numbers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .testimonial-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
