"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const isHomepage = pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // On homepage + not scrolled → frosted light bar over light hero
  // When scrolled (or other pages) → solid white bar
  const transparent = isHomepage && !scrolled;

  const navBg      = transparent ? "rgba(248,246,241,0.72)" : "rgba(255,255,255,0.97)";
  const navBorder  = transparent ? "1px solid rgba(11,24,41,0.06)" : "1px solid rgba(11,24,41,0.08)";
  const navShadow  = transparent ? "none" : "0 1px 20px rgba(11,24,41,0.06)";
  const linkColor   = "var(--text-secondary)";
  const activeColor = "var(--text-primary)";

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "all 0.35s ease",
      background: navBg,
      borderBottom: navBorder,
      boxShadow: navShadow,
      backdropFilter: "blur(16px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/Assets/AMI%20PANORAMA%20Logo%20Black.png"
              alt="AMI Panorama"
              width={160}
              height={48}
              priority
              style={{ height: 32, width: "auto", objectFit: "contain" }}
            />
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden-mobile">
            {links.map(l => {
              const isActive = pathname === l.href;
              return (
                <Link key={l.href} href={l.href} style={{
                  fontSize: 13,
                  color: isActive ? activeColor : linkColor,
                  padding: "7px 15px",
                  borderRadius: 7,
                  fontWeight: isActive ? 500 : 400,
                  position: "relative",
                  transition: "color 0.25s ease",
                }}>
                  <AnimatePresence>
                    {isActive && !transparent && (
                      <motion.div
                        layoutId="nav-active-pill"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                        style={{
                          position: "absolute", inset: 0,
                          background: "rgba(11,24,41,0.05)",
                          borderRadius: 7,
                          zIndex: 0,
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <span style={{ position: "relative", zIndex: 1 }}>{l.label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA + mobile burger */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/contact"
              className="hidden-mobile btn-primary"
              style={{ padding: "9px 20px", fontSize: 13 }}
            >
              Demander un programme
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button
              className="show-mobile"
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: 7,
                color: "var(--text-primary)",
                padding: "6px 11px",
                cursor: "pointer",
                fontSize: 14, lineHeight: 1,
                transition: "all 0.2s",
              }}
              aria-label="Menu"
            >{menuOpen ? "✕" : "☰"}</button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{
          background: "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
          padding: "20px 24px 28px",
        }}>
          {links.map(l => (
            <div key={l.href} style={{ marginBottom: 4 }}>
              <Link href={l.href} style={{
                display: "block", padding: "11px 14px", borderRadius: 8,
                fontSize: 15, color: pathname === l.href ? "var(--navy)" : "var(--text-secondary)",
                fontWeight: pathname === l.href ? 600 : 400,
                background: pathname === l.href ? "var(--bg-2)" : "transparent",
              }}>{l.label}</Link>
            </div>
          ))}
          <Link href="/contact" className="btn-primary" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
            Demander un programme
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 901px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
