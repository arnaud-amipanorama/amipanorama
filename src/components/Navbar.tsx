"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ENTRIES = [
  { href: "/", label: "Accueil", desc: "Vision d'ensemble" },
  { href: "/notre-programme", label: "Notre programme", desc: "Ce que nous concevons" },
  { href: "/destinations", label: "Destinations", desc: "Contextes, formats, objectifs" },
  { href: "/a-propos", label: "À propos", desc: "Notre méthode et notre histoire" },
  { href: "/contact", label: "Contact", desc: "Échanger sur votre projet" },
  { href: "/rendez-vous", label: "Rendez-vous", desc: "Réserver un premier échange" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHomepage = pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);

  const transparent = isHomepage && !scrolled && !open;
  const navBg = transparent ? "rgba(248,246,241,0.72)" : "rgba(255,255,255,0.97)";
  const navBorder = transparent ? "1px solid rgba(11,24,41,0.06)" : "1px solid rgba(11,24,41,0.08)";
  const navShadow = transparent ? "none" : "0 1px 20px rgba(11,24,41,0.06)";

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      transition: "background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
      background: open ? "transparent" : navBg,
      borderBottom: open ? "1px solid transparent" : navBorder,
      boxShadow: open ? "none" : navShadow,
      backdropFilter: open ? "none" : "blur(16px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}>
            <Image src="/Assets/Brand/ami-logo-black.png" alt="AMI Panorama" width={205} height={100} priority style={{ height: 26, width: "auto", objectFit: "contain" }} />
          </Link>

          {/* Right cluster */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
            <Link href="/contact" className="hidden-mobile btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>
              Demander un programme
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <button onClick={() => setOpen((o) => !o)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} style={{
              display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
              background: "none", border: "none", padding: "6px 2px",
              fontSize: 13, fontWeight: 500, letterSpacing: "0.02em", color: "var(--text-primary)",
            }}>
              <span style={{ position: "relative", width: 18, height: 10, display: "inline-block" }}>
                <span style={{ position: "absolute", left: 0, right: 0, top: open ? 4 : 0, height: 1.5, background: "currentColor", transform: open ? "rotate(45deg)" : "none", transition: "all 0.28s ease" }} />
                <span style={{ position: "absolute", left: 0, right: 0, bottom: open ? 4 : 0, height: 1.5, background: "currentColor", transform: open ? "rotate(-45deg)" : "none", transition: "all 0.28s ease" }} />
              </span>
              {open ? "Fermer" : "Menu"}
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}
            style={{
              position: "fixed", inset: 0, zIndex: -1,
              background: "rgba(248,246,241,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              display: "flex", flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, maxWidth: 1200, width: "100%", margin: "0 auto", padding: "100px 24px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <motion.div
                initial="hidden" animate="show"
                variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
              >
                {ENTRIES.map((e) => {
                  const active = pathname === e.href;
                  return (
                    <motion.div key={e.href}
                      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                    >
                      <Link href={e.href} className="nav-overlay-row" style={{
                        display: "block", padding: "18px 0",
                        borderTop: "1px solid rgba(11,24,41,0.10)",
                      }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
                          <span className="nav-overlay-label" style={{
                            fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, letterSpacing: "-0.035em",
                            lineHeight: 1, color: active ? "var(--coral)" : "var(--text-primary)",
                          }}>{e.label}</span>
                          <span style={{ fontSize: 13.5, color: "var(--text-muted)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>{e.desc}</span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <a href="mailto:info@amipanorama.com" style={{ fontSize: 13, color: "var(--text-muted)" }}>info@amipanorama.com</a>
                <Link href="/contact" className="btn-primary">Demander un programme</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-overlay-row .nav-overlay-label { transition: color 0.2s ease, transform 0.25s ease; display: inline-block; }
        .nav-overlay-row:hover .nav-overlay-label { color: var(--coral); transform: translateX(8px); }
        @media (max-width: 640px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}
