"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--navy)",
      padding: "64px 24px 36px",
      position: "relative", zIndex: 10,
    }}>
      {/* Subtle top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 24, right: 24, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(30,82,208,0.5), rgba(232,88,53,0.4), transparent)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}
          className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <Image
                src="/Assets/AMI Panorama Logo Signature.png"
                alt="AMI Panorama"
                width={140}
                height={42}
                style={{
                  height: 38,
                  width: "auto",
                  filter: "brightness(0) invert(1)",
                  opacity: 0.85,
                  objectFit: "contain",
                }}
              />
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: 240 }}>
              Programmes de mobilité internationale clé en main pour les CFA et les entreprises françaises.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {[
                { label: "Instagram", href: "https://instagram.com/ami.panorama" },
                { label: "LinkedIn", href: "https://linkedin.com" },
                { label: "WhatsApp", href: "https://wa.me" },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="footer-link"
                  style={{
                    fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.45)",
                    padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
                  }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 18 }}>Navigation</p>
            {([
              ["Accueil", "/"],
              ["Notre programme", "/notre-programme"],
              ["Destinations", "/destinations"],
              ["À propos", "/a-propos"],
              ["Contact", "/contact"],
            ] as [string, string][]).map(([label, href]) => (
              <div key={href} style={{ marginBottom: 11 }}>
                <Link href={href} className="footer-link" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                  {label}
                </Link>
              </div>
            ))}
          </div>

          {/* Destinations */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 18 }}>Destinations</p>
            {[
              { label: "Séville", flag: "🇪🇸" },
              { label: "Montréal", flag: "🇨🇦" },
              { label: "Londres", flag: "🇬🇧" },
              { label: "Maroc", flag: "🇲🇦" },
              { label: "New York", flag: "🇺🇸" },
              { label: "Séoul", flag: "🇰🇷" },
            ].map(({ label, flag }) => (
              <div key={label} style={{ marginBottom: 11 }}>
                <Link href="/destinations" className="footer-link" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{flag}</span>{label}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 18 }}>Contact</p>
            <Link href="/contact" className="btn-primary" style={{ padding: "11px 20px", fontSize: 13, marginBottom: 20, display: "inline-flex" }}>
              Demander un programme
            </Link>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>info@amipanorama.com</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Canada · Timezone EST</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Réponse sous 24h ouvrables</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} AMI Panorama. Tous droits réservés.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Mentions légales", "Confidentialité", "Politique de cookies"].map(l => (
              <span key={l} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
