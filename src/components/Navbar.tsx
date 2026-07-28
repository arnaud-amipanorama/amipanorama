"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "/global-weeks", label: "Global Weeks", tag: "Alternants · Cohortes" },
  { href: "/destinations", label: "Destinations", tag: "10 pays" },
  { href: "/notre-programme", label: "Notre programme", tag: "Méthode & inclusions" },
  { href: "/a-propos", label: "À propos", tag: "Notre mission · 2022" },
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
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const transparent = isHomepage && !scrolled && !open;
  const navBg = open ? "transparent" : transparent ? "rgba(248,246,241,0.55)" : "rgba(255,255,255,0.96)";
  const navBorder = open || transparent ? "1px solid transparent" : "1px solid rgba(11,24,41,0.08)";
  const navShadow = open || transparent ? "none" : "0 1px 20px rgba(11,24,41,0.06)";

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 110,
        transition: "background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
        background: navBg, borderBottom: navBorder, boxShadow: navShadow,
        backdropFilter: open ? "none" : "blur(16px)", WebkitBackdropFilter: open ? "none" : "blur(16px)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center" }} aria-label="AMI Panorama — accueil">
              <Image
                src={open ? "/Assets/Brand/ami-logo-white.png" : "/Assets/Brand/ami-logo-black.png"}
                alt="AMI Panorama" width={205} height={100} priority
                style={{ height: 27, width: "auto", objectFit: "contain" }}
              />
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Link href="/rendez-vous" className="nav-cta btn-primary" style={{ padding: "10px 20px", fontSize: 13 }}>
                Prendre rendez-vous
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}
                className="nav-menu-btn" style={{ color: open ? "#fff" : "var(--text-primary)" }}>
                <span className="nav-bars" aria-hidden="true">
                  <span style={{ transform: open ? "translateY(3.5px) rotate(45deg)" : "none" }} />
                  <span style={{ transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none" }} />
                </span>
                <span style={{ minWidth: 38, textAlign: "left" }}>{open ? "Fermer" : "Menu"}</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="nav-overlay-inner">
              <motion.div
                className="nav-eyebrow"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.08, duration: 0.4 }}
              >
                <span>Navigation</span>
                <span className="nav-eyebrow-r">AMI Panorama — Mobilité internationale</span>
              </motion.div>

              <nav className="nav-list">
                {LINKS.map((l, i) => {
                  const active = pathname === l.href;
                  return (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={l.href} className={`nav-row${active ? " is-active" : ""}`}>
                        <span className="nav-idx">0{i + 1}</span>
                        <span className="nav-label">{l.label}</span>
                        <span className="nav-meta">
                          <span className="nav-tag">{l.tag}</span>
                          <span className="nav-arrow" aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                className="nav-foot"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.1 + LINKS.length * 0.07, duration: 0.5 }}
              >
                <Link href="/rendez-vous" className="btn-primary" style={{ padding: "13px 26px" }}>
                  Prendre rendez-vous
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
                <div className="nav-foot-meta">
                  <a href="mailto:info@amipanorama.com">info@amipanorama.com</a>
                  <span className="nav-foot-sep">Montréal · Séville · +8 destinations</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-menu-btn {
          display: inline-flex; align-items: center; gap: 10px; cursor: pointer;
          background: none; border: none; padding: 8px 4px;
          font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
          transition: color 0.3s ease;
        }
        .nav-bars { display: inline-flex; flex-direction: column; gap: 4px; width: 19px; }
        .nav-bars > span {
          display: block; height: 1.6px; width: 100%; background: currentColor; border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }

        /* ── Overlay : sombre, contrasté, "interface conçue" ── */
        .nav-overlay {
          position: fixed; inset: 0; z-index: 100; overflow-y: auto;
          background:
            radial-gradient(120% 90% at 82% -10%, rgba(30,82,208,0.20) 0%, transparent 55%),
            radial-gradient(90% 80% at -10% 110%, rgba(232,88,53,0.12) 0%, transparent 52%),
            #0B1829;
        }
        .nav-overlay-inner {
          max-width: 1120px; width: 100%; margin: 0 auto; min-height: 100%;
          padding: clamp(116px, 15vh, 170px) 32px 48px;
          display: flex; flex-direction: column; justify-content: center;
        }

        /* Eyebrow (méta technique, mono) */
        .nav-eyebrow {
          display: flex; justify-content: space-between; align-items: baseline; gap: 16px;
          font-family: ui-monospace, "SF Mono", SFMono-Regular, Menlo, monospace;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.34);
          padding-bottom: clamp(18px, 3vw, 34px);
        }

        /* Liste à filets pleine largeur */
        .nav-list { border-bottom: 1px solid rgba(255,255,255,0.12); }
        .nav-row {
          display: grid; grid-template-columns: 56px 1fr auto;
          align-items: center; column-gap: 28px;
          padding: clamp(18px, 2.9vw, 32px) 0;
          border-top: 1px solid rgba(255,255,255,0.12);
          text-decoration: none;
          transition: border-color 0.4s ease, padding-left 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-idx {
          font-family: ui-monospace, "SF Mono", SFMono-Regular, Menlo, monospace;
          font-size: 13px; letter-spacing: 0.04em; color: rgba(255,255,255,0.36);
          transition: color 0.3s ease;
        }
        .nav-label {
          font-family: var(--font-sans);
          font-size: clamp(34px, 6.4vw, 78px); font-weight: 600;
          letter-spacing: -0.038em; line-height: 0.96; color: #fff;
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-meta { display: flex; align-items: center; gap: 20px; }
        .nav-tag {
          font-family: ui-monospace, "SF Mono", SFMono-Regular, Menlo, monospace;
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.40); white-space: nowrap; transition: color 0.3s ease;
        }
        .nav-arrow {
          font-size: 24px; line-height: 1; color: var(--coral);
          opacity: 0; transform: translateX(-12px);
          transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1);
        }
        /* Hover : précis, architectural */
        .nav-row:hover { border-top-color: rgba(255,255,255,0.42); padding-left: 14px; }
        .nav-row:hover .nav-idx { color: var(--coral); }
        .nav-row:hover .nav-label { transform: translateX(8px); }
        .nav-row:hover .nav-tag { color: rgba(255,255,255,0.72); }
        .nav-row:hover .nav-arrow { opacity: 1; transform: translateX(0); }
        /* État actif */
        .nav-row.is-active .nav-idx { color: var(--coral); }
        .nav-row.is-active .nav-tag { color: rgba(232,88,53,0.85); }

        /* Footer */
        .nav-foot {
          display: flex; justify-content: space-between; align-items: center; gap: 24px;
          flex-wrap: wrap; margin-top: clamp(30px, 4vw, 56px);
        }
        .nav-foot-meta {
          display: flex; align-items: center; gap: 22px; flex-wrap: wrap;
          font-family: ui-monospace, "SF Mono", SFMono-Regular, Menlo, monospace;
          font-size: 12px; letter-spacing: 0.04em;
        }
        .nav-foot-meta a { color: rgba(255,255,255,0.78); text-decoration: none; transition: color 0.2s ease; }
        .nav-foot-meta a:hover { color: var(--coral); }
        .nav-foot-sep { color: rgba(255,255,255,0.34); text-transform: uppercase; letter-spacing: 0.12em; font-size: 11px; }

        @media (max-width: 640px) {
          .nav-cta { display: none !important; }
          .nav-eyebrow-r { display: none; }
          .nav-meta { display: none; }
          .nav-row { grid-template-columns: 40px 1fr; }
          .nav-foot { flex-direction: column; align-items: flex-start; gap: 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav-row, .nav-label, .nav-arrow { transition: none !important; }
        }
      `}</style>
    </>
  );
}
