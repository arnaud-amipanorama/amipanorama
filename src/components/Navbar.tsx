"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/notre-programme", label: "Notre programme" },
  { href: "/destinations", label: "Destinations" },
  { href: "/a-propos", label: "À propos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.3s ease",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        background: scrolled ? "rgba(8,8,8,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em",
            }}>A</div>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              AMI Panorama
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden-mobile">
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                fontSize: 13,
                color: pathname === l.href ? "var(--text-primary)" : "var(--text-secondary)",
                padding: "6px 14px",
                borderRadius: 6,
                transition: "color 0.15s",
                background: pathname === l.href ? "rgba(255,255,255,0.05)" : "transparent",
                fontWeight: pathname === l.href ? 500 : 400,
              }}
                onMouseEnter={e => { if (pathname !== l.href) e.currentTarget.style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { if (pathname !== l.href) e.currentTarget.style.color = "var(--text-secondary)"; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* CTA + mobile burger */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/contact" className="btn-primary hidden-mobile" style={{ padding: "8px 18px", fontSize: 13 }}>
              Demander un programme
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button
              className="show-mobile"
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: "none", border: "1px solid var(--border)", borderRadius: 7,
                color: "var(--text-primary)", padding: "6px 10px", cursor: "pointer",
                fontSize: 13, lineHeight: 1,
              }}
              aria-label="Menu"
            >{menuOpen ? "✕" : "☰"}</button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          background: "rgba(8,8,8,0.97)", backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
          padding: "20px 24px 28px",
        }}>
          {links.map(l => (
            <div key={l.href} style={{ marginBottom: 4 }}>
              <Link href={l.href} style={{
                display: "block", padding: "10px 12px", borderRadius: 8,
                fontSize: 15, color: pathname === l.href ? "var(--text-primary)" : "var(--text-secondary)",
                background: pathname === l.href ? "rgba(255,255,255,0.05)" : "transparent",
              }}>{l.label}</Link>
            </div>
          ))}
          <Link href="/contact" className="btn-primary" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
            Demander un programme
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
