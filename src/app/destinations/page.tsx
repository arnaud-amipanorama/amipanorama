import Link from "next/link";
import Image from "next/image";
import AnimateOnView from "@/components/AnimateOnView";
import DestinationExplorer from "./DestinationExplorer";
import { activeDestinationCount, destinations, destinationsHeroImage } from "@/data/destinations";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Destinations",
  description: `${activeDestinationCount} destinations de mobilité professionnelle internationale, de Montréal à Lisbonne. Chaque programme est structuré pour sa valeur pédagogique et professionnelle, adapté à votre filière.`,
  path: "/destinations",
});

export default function DestinationsPage() {
  return (
    <>
      <section className="page-hero-section" style={{
        position: "relative", paddingTop: 160, paddingBottom: 80,
        background: "var(--navy)", overflow: "hidden",
      }}>
        <Image
          src={destinationsHeroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center", opacity: 0.18 }}
        />
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
            {activeDestinationCount} destinations.{" "}
            <span style={{
              fontFamily: "var(--font-serif)", fontStyle: "italic",
              fontWeight: 500, color: "var(--blue-on-dark)",
            }}>Une même exigence.</span>
          </h1>
          <p className="anim-fade-up-3" style={{
            fontSize: 18, color: "rgba(255,255,255,0.78)",
            maxWidth: 580, lineHeight: 1.75,
          }}>
            Chaque destination est sélectionnée pour sa valeur pédagogique,
            professionnelle et humaine. Le même niveau d&apos;exigence, la même
            structure de programme, adapté au contexte et à la filière de votre groupe.
          </p>

          <div className="anim-fade-up-4" style={{ display: "flex", gap: 8, marginTop: 48, flexWrap: "wrap" }}>
            {destinations.filter((d) => !d.comingSoon).map((d) => (
              <Link key={d.slug} href={`/destinations/${d.slug}`} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 100, padding: "8px 16px",
                fontSize: 13, color: "rgba(255,255,255,0.78)",
              }}>
                <span>{d.flag}</span> {d.city}
              </Link>
            ))}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 100, padding: "8px 16px",
              fontSize: 12, color: "rgba(255,255,255,0.7)",
              fontStyle: "italic",
            }}>
              🇦🇪 prochainement
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 24px 96px", background: "var(--bg)" }}>
        <DestinationExplorer destinations={destinations} />
      </section>

      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <AnimateOnView>
            <div style={{
              background: "var(--navy)", borderRadius: 20,
              padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-60px", left: "20%",
                width: 400, height: 300,
                background: "radial-gradient(ellipse, rgba(36,71,143,0.25) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              <div style={{
                position: "absolute", bottom: "-40px", right: "20%",
                width: 300, height: 250,
                background: "radial-gradient(ellipse, rgba(27,61,136,0.2) 0%, transparent 70%)",
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
                fontSize: 16, color: "rgba(255,255,255,0.72)",
                maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.75, position: "relative",
              }}>
                Destination envisagée, filière, taille du groupe, dates, partagez votre projet.
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
