"use client";
import { useEffect, useRef, useState } from "react";

export type GalleryItem = { src: string; city: string; flag: string };

const STEP = 236;   // décalage horizontal entre cartes (chevauchement → profondeur)
// Transition longue + ease-in-out premium → la carte accélère, prend le centre, puis ralentit.
// Le mouvement occupe presque tout l'intervalle → sensation de FLUX continu, jamais d'à-coup.
const SMOOTH = "transform 2s cubic-bezier(0.62,0,0.2,1), opacity 1.6s ease, filter 1.6s ease";
const INTERVAL = 2700; // ≈ cadence 2s + court repos

export default function HeroGallery({ items }: { items: GalleryItem[] }) {
  const n = items.length;
  const [active, setActive] = useState(0); // non borné → flux infini dans les deux sens
  const [paused, setPaused] = useState(false);
  const prev = useRef<number[]>([]);

  useEffect(() => {
    if (paused || n <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => a + 1), INTERVAL);
    return () => clearInterval(id);
  }, [paused, n]);

  const circOf = (i: number) => {
    const m = (((i - active) % n) + n) % n; // 0..n-1
    return m > n / 2 ? m - n : m;
  };
  const circs = items.map((_, i) => circOf(i));
  // carte qui « boucle » d'un bord à l'autre → transition coupée (téléportation invisible)
  const wrapped = circs.map((c, i) => prev.current[i] !== undefined && Math.abs(c - prev.current[i]) > 1.5);
  useEffect(() => { prev.current = circs; });

  return (
    <div className="hg" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <button className="hg-arrow hg-prev" onClick={() => setActive((a) => a - 1)} aria-label="Destination précédente">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className="hg-stage">
        {items.map((it, i) => {
          const c = circs[i];
          const ac = Math.abs(c);
          const isActive = c === 0;
          const scale = isActive ? 1.16 : ac === 1 ? 0.82 : ac === 2 ? 0.66 : 0.52;
          const opacity = ac >= 3 ? 0 : isActive ? 1 : ac === 1 ? 0.9 : 0.5;
          // Centre : plus lumineux / contrasté / net. Côtés : reculent (assombris, légèrement flous)
          const filter = isActive
            ? "brightness(1.06) contrast(1.06) saturate(1.06)"
            : ac === 1
            ? "brightness(0.93) saturate(0.97)"
            : "brightness(0.82) saturate(0.94) blur(1.4px)";
          return (
            <button
              key={i}
              className={`hg-card${isActive ? " is-active" : ""}`}
              onClick={() => setActive((a) => a + c)}
              aria-label={it.city}
              tabIndex={ac >= 3 ? -1 : 0}
              style={{
                transform: `translate(calc(-50% + ${c * STEP}px), -50%) scale(${scale})`,
                opacity,
                zIndex: 30 - ac,
                pointerEvents: ac >= 3 ? "none" : "auto",
                transition: wrapped[i] ? "none" : SMOOTH,
                filter,
                backgroundImage: `url('${it.src}')`,
              }}
            >
              <span className="hg-cap" style={{ opacity: isActive ? 1 : 0 }}>
                <span style={{ fontSize: 14 }}>{it.flag}</span> {it.city}
              </span>
            </button>
          );
        })}
      </div>

      <button className="hg-arrow hg-next" onClick={() => setActive((a) => a + 1)} aria-label="Destination suivante">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <style>{`
        .hg { position: relative; width: 100%; height: 360px; }
        .hg-stage { position: absolute; inset: 0; overflow: hidden; }
        .hg-card {
          position: absolute; left: 50%; top: 50%;
          width: 300px; height: 210px; padding: 0; border: none; cursor: pointer;
          border-radius: 18px; background-size: cover; background-position: center;
          transform-origin: center;
          /* ombre diffuse + douce, + fine lumière sur les bords */
          box-shadow:
            0 22px 48px -22px rgba(11,24,41,0.42),
            0 6px 16px rgba(11,24,41,0.10),
            inset 0 1px 0 rgba(255,255,255,0.20),
            inset 0 0 0 1px rgba(255,255,255,0.06);
          will-change: transform, opacity, filter;
        }
        .hg-card::after {
          content: ""; position: absolute; inset: 0; border-radius: 18px;
          background: linear-gradient(to top, rgba(11,24,41,0.46) 0%, rgba(11,24,41,0.03) 48%, transparent 64%);
        }
        .hg-card.is-active {
          box-shadow:
            0 30px 66px -26px rgba(11,24,41,0.52),
            0 10px 26px rgba(11,24,41,0.16),
            inset 0 1px 0 rgba(255,255,255,0.34),
            inset 0 0 0 1px rgba(255,255,255,0.10);
        }
        .hg-cap {
          position: absolute; left: 16px; bottom: 14px; z-index: 1;
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
          color: #fff; text-shadow: 0 1px 12px rgba(0,0,0,0.5); transition: opacity 0.8s ease;
        }
        .hg-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 40;
          width: 44px; height: 44px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.9); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
          border: 1px solid rgba(11,24,41,0.08); color: var(--text-primary);
          box-shadow: 0 6px 22px rgba(11,24,41,0.14);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s ease, opacity 0.3s ease;
          opacity: 0.55;
        }
        .hg:hover .hg-arrow { opacity: 1; }
        .hg-arrow:hover { background: #fff; transform: translateY(-50%) scale(1.07); }
        .hg-prev { left: 4px; }
        .hg-next { right: 4px; }
        @media (max-width: 640px) {
          .hg { height: 280px; }
          .hg-card { width: 232px; height: 164px; }
          .hg-arrow { width: 38px; height: 38px; opacity: 0.9; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hg-card { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
