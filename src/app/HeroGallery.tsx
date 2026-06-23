"use client";
import { useEffect, useState } from "react";

export type GalleryItem = { src: string; city: string; flag: string };

const STEP = 232; // décalage horizontal entre cartes (chevauchement → profondeur)

export default function HeroGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState(Math.floor(items.length / 2));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 4800);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const go = (dir: number) => setActive((a) => (a + dir + items.length) % items.length);

  return (
    <div
      className="hg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button className="hg-arrow hg-prev" onClick={() => go(-1)} aria-label="Destination précédente">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className="hg-stage">
        {items.map((it, i) => {
          const d = i - active;
          const ad = Math.abs(d);
          const isActive = d === 0;
          const scale = isActive ? 1.16 : ad === 1 ? 0.8 : 0.64;
          const opacity = ad >= 3 ? 0 : isActive ? 1 : ad === 1 ? 0.92 : 0.5;
          return (
            <button
              key={i}
              className={`hg-card${isActive ? " is-active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={it.city}
              tabIndex={ad >= 3 ? -1 : 0}
              style={{
                transform: `translate(calc(-50% + ${d * STEP}px), -50%) scale(${scale})`,
                opacity,
                zIndex: 30 - ad,
                pointerEvents: ad >= 3 ? "none" : "auto",
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

      <button className="hg-arrow hg-next" onClick={() => go(1)} aria-label="Destination suivante">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <style>{`
        .hg { position: relative; width: 100%; height: 300px; }
        .hg-stage { position: absolute; inset: 0; overflow: hidden; }
        .hg-card {
          position: absolute; left: 50%; top: 50%;
          width: 280px; height: 208px; padding: 0; border: none; cursor: pointer;
          border-radius: 16px; background-size: cover; background-position: center;
          transform-origin: center; transition: transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.55s ease;
          box-shadow: 0 18px 40px rgba(11,24,41,0.18);
          will-change: transform, opacity;
        }
        .hg-card::after {
          content: ""; position: absolute; inset: 0; border-radius: 16px;
          background: linear-gradient(to top, rgba(11,24,41,0.5) 0%, rgba(11,24,41,0.04) 46%, transparent 62%);
        }
        .hg-card.is-active {
          box-shadow: 0 0 0 6px #fff, 0 34px 70px rgba(11,24,41,0.30);
        }
        .hg-cap {
          position: absolute; left: 16px; bottom: 14px; z-index: 1;
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
          color: #fff; text-shadow: 0 1px 10px rgba(0,0,0,0.45); transition: opacity 0.4s ease;
        }
        .hg-arrow {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 40;
          width: 44px; height: 44px; border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.92); -webkit-backdrop-filter: blur(8px); backdrop-filter: blur(8px);
          border: 1px solid rgba(11,24,41,0.08); color: var(--text-primary);
          box-shadow: 0 6px 20px rgba(11,24,41,0.14); transition: transform 0.2s ease, background 0.2s ease;
        }
        .hg-arrow:hover { background: #fff; transform: translateY(-50%) scale(1.06); }
        .hg-prev { left: 4px; }
        .hg-next { right: 4px; }
        @media (max-width: 640px) {
          .hg { height: 240px; }
          .hg-card { width: 230px; height: 168px; }
          .hg-arrow { width: 38px; height: 38px; }
        }
      `}</style>
    </div>
  );
}
