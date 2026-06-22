"use client";
import { useEffect, useRef } from "react";

export type RailPhoto = { src: string; city: string; flag: string };

export default function PhotoRail({ photos }: { photos: RailPhoto[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Respecter prefers-reduced-motion : pas de défilement ni de magnify, simple scroll manuel.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      track.style.animation = "none";
      container.style.overflowX = "auto";
      return;
    }

    const items = Array.from(track.children) as HTMLElement[];
    let raf = 0;
    const tick = () => {
      const cRect = container.getBoundingClientRect();
      const cx = cRect.left + cRect.width / 2;
      const half = cRect.width / 2 || 1;
      for (const it of items) {
        const r = it.getBoundingClientRect();
        const center = r.left + r.width / 2;
        const norm = Math.min(Math.abs(center - cx) / half, 1);
        // courbe douce (easeOutQuad) pour un magnify élégant, non linéaire
        const eased = 1 - (1 - norm) * (1 - norm);
        const scale = 1.07 - eased * 0.15; // centre ~1.07 → bords ~0.92
        const op = 1 - eased * 0.32; // centre 1 → bords ~0.68
        it.style.transform = `scale(${scale.toFixed(3)})`;
        it.style.opacity = op.toFixed(3);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [photos]);

  const doubled = [...photos, ...photos];

  return (
    <div ref={containerRef} className="prail">
      <div className="prail-fade prail-fade-l" />
      <div className="prail-fade prail-fade-r" />
      <div ref={trackRef} className="prail-track">
        {doubled.map((p, i) => (
          <div key={i} className="prail-item" style={{ backgroundImage: `url('${p.src}')` }}>
            <span className="prail-cap"><span className="prail-flag">{p.flag}</span>{p.city}</span>
          </div>
        ))}
      </div>

      <style>{`
        .prail { position: relative; height: 264px; overflow: hidden; }
        .prail-track {
          display: flex; align-items: center; gap: 18px; height: 100%;
          width: max-content; padding: 0 9px;
          animation: prailScroll 75s linear infinite;
          will-change: transform;
        }
        .prail:hover .prail-track { animation-play-state: paused; }
        .prail-item {
          position: relative; flex-shrink: 0;
          width: 300px; height: 208px; border-radius: 16px;
          background-size: cover; background-position: center;
          transform-origin: center center; will-change: transform, opacity;
          box-shadow: 0 14px 36px rgba(11,24,41,0.16);
        }
        .prail-item::after {
          content: ""; position: absolute; inset: 0; border-radius: 16px;
          background: linear-gradient(to top, rgba(11,24,41,0.52) 0%, rgba(11,24,41,0.05) 42%, transparent 60%);
        }
        .prail-cap {
          position: absolute; left: 16px; bottom: 14px; z-index: 1;
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
          color: #fff; text-shadow: 0 1px 10px rgba(0,0,0,0.45);
        }
        .prail-flag { font-size: 14px; letter-spacing: 0; }
        @keyframes prailScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .prail-fade { position: absolute; top: 0; bottom: 0; width: 90px; z-index: 2; pointer-events: none; }
        .prail-fade-l { left: 0; background: linear-gradient(to right, var(--bg), transparent); }
        .prail-fade-r { right: 0; background: linear-gradient(to left, var(--bg), transparent); }
        @media (max-width: 640px) {
          .prail { height: 212px; }
          .prail-item { width: 240px; height: 164px; }
          .prail-fade { width: 48px; }
        }
      `}</style>
    </div>
  );
}
