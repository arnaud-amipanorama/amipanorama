"use client";
import { useEffect, useRef } from "react";

export type GalleryItem = { src: string; city: string; flag: string };

// ── Paramètres centralisés (durée, amplitude, physique) ────────────────────
const STEP_DESKTOP = 240;     // px entre deux cartes
const STEP_MOBILE = 172;
const SPEED_DESKTOP = 0.40;   // "pas" par seconde au point le plus rapide
const SPEED_MOBILE = 0.30;    // plus lent sur mobile
const SLOW = 0.16;            // vitesse minimale au centre (≠ 0 → ne s'arrête JAMAIS)
const HOVER_SLOW = 0.18;      // au survol : ralentit encore, sans figer

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function HeroGallery({ items }: { items: GalleryItem[] }) {
  const n = items.length;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const capRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const phase = useRef(0);         // position continue (en "pas"), jamais figée
  const targetHover = useRef(1);   // 1 normal, HOVER_SLOW au survol
  const curHover = useRef(1);

  useEffect(() => {
    if (n === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let step = STEP_DESKTOP;
    let speed = SPEED_DESKTOP;
    const setMetrics = () => {
      const m = window.innerWidth <= 640;
      step = m ? STEP_MOBILE : STEP_DESKTOP;
      speed = m ? SPEED_MOBILE : SPEED_DESKTOP;
    };
    setMetrics();
    window.addEventListener("resize", setMetrics, { passive: true });

    // Place chaque carte selon sa distance circulaire au centre flottant.
    // Hiérarchie GAUSSIENNE : tout (scale/opacity/blur/lumière) évolue en continu,
    // changement quasi imperceptible, pas d'effet "coverflow".
    const render = () => {
      const center = phase.current;
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        let d = i - center;
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
        const ad = Math.abs(d);
        const g = Math.exp(-0.55 * ad * ad); // cloche douce centrée

        const scale = 0.70 + 0.42 * g;                  // centre ≈1.12 → décroît en douceur
        const opacity = clamp(Math.exp(-0.32 * ad * ad), 0, 1);
        const blur = clamp((ad - 0.8) * 0.85, 0, 3);
        const bri = 0.88 + 0.16 * g;
        const sat = 0.93 + 0.09 * g;

        el.style.transform = `translate3d(calc(-50% + ${(d * step).toFixed(2)}px), -50%, 0) scale(${scale.toFixed(3)})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = `brightness(${bri.toFixed(3)}) saturate(${sat.toFixed(3)})${blur ? ` blur(${blur.toFixed(2)}px)` : ""}`;
        el.style.zIndex = String(200 - Math.round(ad * 10));

        const cap = capRefs.current[i];
        if (cap) cap.style.opacity = (ad < 0.6 ? 1 - ad / 0.6 : 0).toFixed(3);
      }
    };

    if (reduce) {
      phase.current = 0;
      render();
      window.removeEventListener("resize", setMetrics);
      return;
    }

    let raf = 0;
    let last: number | null = null;
    const loop = (ts: number) => {
      if (last == null) last = ts;
      let dt = (ts - last) / 1000;
      last = ts;
      if (dt > 0.05) dt = 0.05; // onglet inactif → pas de saut

      // Vitesse modulée : minimale (SLOW) quand une carte est au centre, maximale entre deux.
      // sin(π·frac) ne s'annule qu'aux centres, mais on garde un plancher SLOW → glisse toujours.
      const frac = phase.current - Math.floor(phase.current);
      const vFactor = SLOW + (1 - SLOW) * Math.sin(Math.PI * frac);

      curHover.current += (targetHover.current - curHover.current) * Math.min(1, dt * 3);
      phase.current += dt * speed * vFactor * curHover.current;
      if (phase.current >= n) phase.current -= n;

      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setMetrics);
    };
  }, [n]);

  return (
    <div
      className="hg"
      onMouseEnter={() => { targetHover.current = HOVER_SLOW; }}
      onMouseLeave={() => { targetHover.current = 1; }}
    >
      <div className="hg-stage">
        {items.map((it, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="hg-card"
            style={{ backgroundImage: `url('${it.src}')` }}
            aria-hidden="true"
          >
            <span ref={(el) => { capRefs.current[i] = el; }} className="hg-cap" style={{ opacity: 0 }}>
              <span style={{ fontSize: 14 }}>{it.flag}</span> {it.city}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .hg { position: relative; width: 100%; height: 360px; }
        .hg-stage { position: absolute; inset: 0; overflow: hidden; }
        .hg-card {
          position: absolute; left: 50%; top: 50%;
          width: 300px; height: 210px;
          border-radius: 18px; background-size: cover; background-position: center;
          transform-origin: center;
          box-shadow:
            0 24px 50px -22px rgba(11,24,41,0.40),
            0 6px 16px rgba(11,24,41,0.10),
            inset 0 1px 0 rgba(255,255,255,0.20),
            inset 0 0 0 1px rgba(255,255,255,0.06);
          will-change: transform, opacity, filter;
        }
        .hg-card::after {
          content: ""; position: absolute; inset: 0; border-radius: 18px;
          background: linear-gradient(to top, rgba(11,24,41,0.46) 0%, rgba(11,24,41,0.03) 48%, transparent 64%);
        }
        .hg-cap {
          position: absolute; left: 16px; bottom: 14px; z-index: 1;
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase;
          color: #fff; text-shadow: 0 1px 12px rgba(0,0,0,0.5);
        }
        @media (max-width: 640px) {
          .hg { height: 250px; }
          .hg-card { width: 236px; height: 166px; }
        }
      `}</style>
    </div>
  );
}
