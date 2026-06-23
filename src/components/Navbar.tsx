"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { href: "/destinations", label: "Destinations", desc: "Dix destinations, une même exigence pédagogique." },
  { href: "/notre-programme", label: "Notre programme", desc: "Comment nous concevons, organisons et sécurisons chaque mobilité." },
  { href: "/a-propos", label: "À propos", desc: "Ouvrir l'international à tous les parcours, depuis 2022." },
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
              <Image src="/Assets/Brand/ami-logo-black.png" alt="AMI Panorama" width={205} height={100} priority style={{ height: 27, width: "auto", objectFit: "contain" }} />
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Link href="/rendez-vous" className="nav-cta btn-primary" style={{ padding: "10px 20px", fontSize: 13 }}>
                Prendre rendez-vous
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <button onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open} className="nav-menu-btn">
                <span className="nav-bars" aria-hidden="true">
                  <span style={{ transform: open ? "translateY(3.5px) rotate(45deg)" : "none" }} />
                  <span style={{ transform: open ? "translateY(-3.5px) rotate(-45deg)" : "none" }} />
                </span>
                <span style={{ minWidth: 34, textAlign: "left" }}>{open ? "Fermer" : "Menu"}</span>
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
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="nav-overlay-inner">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.06 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={l.href} className="nav-link">
                    <span className="nav-num">0{i + 1}</span>
                    <span className="nav-label">{l.label}</span>
                    <span className="nav-desc">{l.desc}</span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.06 + LINKS.length * 0.07, duration: 0.5 }}
                className="nav-overlay-foot"
              >
                <Link href="/rendez-vous" className="btn-primary" style={{ padding: "13px 26px" }}>
                  Prendre rendez-vous
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
                <a href="mailto:contact@amipanorama.com" className="nav-mail">contact@amipanorama.com</a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-menu-btn {
          display: inline-flex; align-items: center; gap: 10px; cursor: pointer;
          background: none; border: none; padding: 8px 4px;
          font-size: 14px; font-weight: 500; color: var(--text-primary);
        }
        .nav-bars { display: inline-flex; flex-direction: column; gap: 4px; width: 20px; }
        .nav-bars > span {
          display: block; height: 1.6px; width: 100%; background: currentColor; border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(248,246,241,0.94);
          backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
          display: flex; align-items: center;
        }
        .nav-overlay-inner { max-width: 1100px; width: 100%; margin: 0 auto; padding: 96px 24px 40px; }
        .nav-link {
          display: flex; align-items: baseline; gap: 22px;
          padding: 22px 0; border-bottom: 1px solid rgba(11,24,41,0.09);
          text-decoration: none;
        }
        .nav-num { font-size: 13px; font-weight: 600; color: var(--coral); width: 30px; flex-shrink: 0; }
        .nav-label {
          font-family: var(--font-serif), Georgia, serif;
          font-size: clamp(30px, 5.2vw, 58px); font-weight: 600; letter-spacing: -0.02em; line-height: 1;
          color: var(--text-primary); transition: color 0.28s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-desc {
          margin-left: auto; max-width: 280px; text-align: right;
          font-size: 14px; line-height: 1.5; color: var(--text-muted);
        }
        .nav-link:hover .nav-label { color: var(--coral); transform: translateX(10px); }
        .nav-overlay-foot { display: flex; align-items: center; gap: 24px; margin-top: 40px; flex-wrap: wrap; }
        .nav-mail { font-size: 14px; color: var(--text-secondary); text-decoration: none; }
        .nav-mail:hover { color: var(--coral); }
        @media (max-width: 640px) {
          .nav-cta { display: none !important; }
          .nav-desc { display: none; }
          .nav-link { padding: 18px 0; }
        }
      `}</style>
    </>
  );
}
