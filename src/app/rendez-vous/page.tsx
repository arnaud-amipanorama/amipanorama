import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description:
    "Réservez un échange de 20 minutes avec l'équipe AMI Panorama pour parler de votre projet de mobilité internationale, sans engagement.",
};

// Lien de réservation Google Calendar (lien de partage public).
// Surchargeable par l'environnement ; valeur par défaut = lien fourni par AMI Panorama.
const BOOKING_LINK =
  process.env.NEXT_PUBLIC_BOOKING_URL || "https://calendar.app.google/sLYXj9s7nDiMwzYu8";

// URL d'embed (iframe) OPTIONNELLE : à renseigner uniquement avec l'URL "gv=true"
// fournie par Google Calendar (Partager → Intégrer). Si absente, on affiche un CTA premium.
const EMBED_URL = process.env.NEXT_PUBLIC_BOOKING_EMBED_URL || "";

const reassurance = [
  { t: "20 minutes", d: "Un premier échange court et utile." },
  { t: "Sans engagement", d: "Aucune facturation, aucune obligation." },
  { t: "Avec un humain", d: "Vous parlez directement à notre équipe." },
];

export default function RendezVousPage() {
  return (
    <>
      {/* Header */}
      <section className="page-hero-section" style={{
        position: "relative", overflow: "hidden",
        background: "var(--navy)", paddingTop: 140, paddingBottom: 72,
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: 600, height: 460,
          background: "radial-gradient(ellipse at top right, rgba(36,71,143,0.22) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: "10%", width: 420, height: 320,
          background: "radial-gradient(ellipse, rgba(27,61,136,0.16) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="section-label-light">Prendre rendez-vous</div>
          <h1 style={{
            fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 700,
            letterSpacing: "-0.045em", lineHeight: 1.08, maxWidth: 680, marginBottom: 24, color: "#fff",
          }}>
            Parlons de votre projet,{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500, color: "rgba(27,61,136,0.9)" }}>
              de vive voix.
            </span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 560, lineHeight: 1.75, marginBottom: 36 }}>
            Choisissez un créneau qui vous convient. On comprend votre contexte, filière, groupe,
            objectifs, dates, et on vous propose une première direction concrète.
          </p>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {reassurance.map(({ t, d }) => (
              <div key={t} style={{ maxWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--coral)", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{t}</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, paddingLeft: 14 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section style={{ padding: "56px 24px 96px", background: "var(--bg)" }}>
        <div style={{ maxWidth: EMBED_URL ? 900 : 680, margin: "0 auto" }}>
          {EMBED_URL ? (
            /* Calendrier intégré (si l'URL d'embed gv=true est fournie) */
            <div style={{
              background: "var(--bg-1)", border: "1px solid var(--border)",
              borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(11,24,41,0.08)",
            }}>
              <iframe
                src={EMBED_URL}
                title="Prise de rendez-vous AMI Panorama"
                style={{ width: "100%", height: 720, border: "none", display: "block", background: "var(--bg-1)" }}
                loading="lazy"
              />
            </div>
          ) : (
            /* CTA premium vers le calendrier Google (ouverture dans un nouvel onglet) */
            <div style={{
              background: "var(--bg-1)", border: "1px solid var(--border)",
              borderRadius: 20, padding: "56px 44px", textAlign: "center",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse at 50% 0%, rgba(36,71,143,0.06) 0%, transparent 60%)",
              }} />
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: "0 auto 24px",
                background: "rgba(27,61,136,0.10)", border: "1px solid rgba(27,61,136,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="#1B3D88" strokeWidth="1.6"/>
                  <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="#1B3D88" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12, position: "relative" }}>
                Choisissez votre créneau
              </h2>
              <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.75, position: "relative" }}>
                Vous accédez à notre agenda en temps réel et réservez l&apos;horaire qui vous arrange.
                La confirmation et le lien de visioconférence vous sont envoyés automatiquement.
              </p>
              <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer"
                className="btn-primary" style={{ position: "relative", display: "inline-flex", fontSize: 15, padding: "15px 32px" }}>
                Voir les disponibilités
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          )}

          {/* Alternative écrite */}
          <div style={{
            marginTop: 24, display: "flex", justifyContent: "center",
            alignItems: "center", flexWrap: "wrap", gap: 8,
          }}>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Vous préférez écrire ?{" "}
              <Link href="/contact" style={{ color: "var(--blue)", fontWeight: 500 }}>Formulaire de contact</Link>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
