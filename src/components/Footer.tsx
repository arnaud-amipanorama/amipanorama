"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "var(--bg-1)",
      padding: "48px 24px 32px",
      position: "relative", zIndex: 10,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}
          className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
              }}>A</div>
              <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em" }}>AMI Panorama</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 220 }}>
              Nous ouvrons le monde aux apprentis — une mobilité à la fois.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>Navigation</p>
            {([["Accueil", "/"], ["Notre programme", "/notre-programme"], ["Destinations", "/destinations"], ["À propos", "/a-propos"]] as [string, string][]).map(([label, href]) => (
              <div key={href} style={{ marginBottom: 10 }}>
                <Link href={href} className="footer-link" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {label}
                </Link>
              </div>
            ))}
          </div>

          {/* Destinations */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>Destinations</p>
            {["Séville", "Montréal", "Londres", "Maroc", "New York", "Séoul"].map(s => (
              <div key={s} style={{ marginBottom: 10 }}>
                <Link href="/destinations" className="footer-link" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {s}
                </Link>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 16 }}>Contact</p>
            <Link href="/contact" className="btn-primary" style={{ padding: "10px 18px", fontSize: 13, marginBottom: 16, display: "inline-flex" }}>
              Demander un programme
            </Link>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>info@amipanorama.com</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Canada · Timezone EST</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} AMI Panorama. Tous droits réservés.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Mentions légales", "Confidentialité", "Politique de cookies"].map(l => (
              <span key={l} style={{ fontSize: 12, color: "var(--text-muted)" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
