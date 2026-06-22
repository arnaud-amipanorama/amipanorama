"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/notre-programme", label: "Notre programme" },
  { href: "/a-propos", label: "À propos" },
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

  const transparent = isHomepage && !scrolled;
  const navBg = transparent ? "rgba(248,246,241,0.72)" : "rgba(255,255,255,0.97)";
  const navBorder = transparent ? "1px solid rgba(11,24,41,0.06)" : "1px solid rgba(11,24,41,0.08)";
  const navShadow = transparent ? "none" : "0 1px 20px rgba(11,24,41,0.06)";

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      transition: "background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
      background: navBg, borderBottom: navBorder, boxShadow: navShadow,
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Image src="/Assets/Brand/ami-logo-black.png" alt="AMI Panorama" width={205} height={100} priority style={{ height: 26, width: "auto", objectFit: "contain" }} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link key={l.href} href={l.href} style={{
                  position: "relative", fontSize: 13.5, padding: "8px 14px", borderRadius: 8,
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  fontWeight: active ? 600 : 400, transition: "color 0.2s ease",
                }}>{l.label}</Link>
              );
            })}
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/rendez-vous" className="hidden-mobile btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>
              Prendre rendez-vous
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <button className="show-mobile" onClick={() => setOpen((o) => !o)} aria-label="Menu" style={{
              background: "none", border: "1px solid var(--border)", borderRadius: 8,
              color: "var(--text-primary)", padding: "7px 11px", cursor: "pointer", fontSize: 14, lineHeight: 1,
            }}>{open ? "✕" : "☰"}</button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
            style={{ overflow: "hidden", background: "rgba(255,255,255,0.99)", borderTop: "1px solid var(--border)" }}>
            <div style={{ padding: "16px 24px 24px" }}>
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} style={{
                  display: "block", padding: "12px 12px", borderRadius: 8, fontSize: 15,
                  color: pathname === l.href ? "var(--navy)" : "var(--text-secondary)",
                  fontWeight: pathname === l.href ? 600 : 400,
                  background: pathname === l.href ? "var(--bg-2)" : "transparent",
                }}>{l.label}</Link>
              ))}
              <Link href="/rendez-vous" className="btn-primary" style={{ marginTop: 14, width: "100%", justifyContent: "center" }}>Prendre rendez-vous</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) { .hidden-mobile { display: none !important; } .show-mobile { display: inline-flex !important; } }
        @media (min-width: 901px) { .show-mobile { display: none !important; } }
      `}</style>
    </header>
  );
}
