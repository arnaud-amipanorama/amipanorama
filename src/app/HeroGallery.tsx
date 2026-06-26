"use client";
import { useEffect, useRef } from "react";

export type GalleryItem = { src: string; city: string; flag: string };

// ── Paramètres centralisés (durée, amplitude, easing) ──────────────────────
const STEP_DESKTOP = 236;    // px entre deux cartes
const STEP_MOBILE = 168;
const STEP_MS_DESKTOP = 2600; // temps pour qu'une carte cède le centre à la suivante
const STEP_MS_MOBILE = 3400;  // plus lent sur mobile
const HOVER_SLOW = 0.12;      // au survol : ralentit fortement (ne fige jamais)

// easeInOutCubic → mouvement lent quand une carte est au centre, rapide entre deux
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function HeroGallery({ items }: { items: GalleryItem[] }) {
  const n = items.length;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const capRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const phase = useRef(0);          // position continue (en "pas")
  const targetSpeed = useRef(1);    // 1 = normal, HOVER_SLOW au survol
  const curSpeed = useRef(1);

  useEffect(() => {
    if (n === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let step = STEP_DESKTOP;
    let stepMs = STEP_MS_DESKTOP;
    const setMetrics = () => {
      const m = window.innerWidth <= 640;
      step = m ? STEP_MOBILE : STEP_DESKTOP;
      stepMs = m ? STEP_MS_MOBILE : STEP_MS_DESKTOP;
    };
    setMetrics();
    window.addEventListener("resize", setMetrics, { passive: true });

    // Positionne chaque carte selon sa distance (flottante) au centre
    const render = () => {
      const p = phase.current;
      const fl = Math.floor(p);
      const center = fl + easeInOut(p - fl); // ralentit près des positions entières
      for (let i = 0; i < n; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        let d = i - center;
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;       // distance circulaire signée → boucle infinie
        const ad = Math.abs(d);

        // échelle / opacité / flou continus (hiérarchie : centre net & grand)
        let scale: number;
        if (ad <= 1) scale = 1.16 - 0.34 * ad;
        else if (ad <= 2) scale = 0.82 - 0.16 * (ad - 1);
        else scale = Math.max(0.5, 0.66 - 0.16 * (ad - 2));

        let opacity: number;
        if (ad <= 1) opacity = 1 - 0.08 * ad;
        else if (ad <= 2) opacity = 0.92 - 0.42 * (ad - 1);
        else opacity = clamp(0.5 - 0.5 * (ad - 2), 0, 0.5);

        const blur = ad > 1.5 ? clamp((ad - 1.5) * 1.6, 0, 2.4) : 0;
        const bri = 1.06 - clamp(ad, 0, 1) * 0.16;
        const sat = 1.05 - clamp(ad, 0, 1) * 0.1;

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
      if (dt > 0.05) dt = 0.05; // évite un saut si l'onglet a été inactif
      curSpeed.current += (targetSpeed.current - curSpeed.current) * Math.min(1, dt * 4);
      phase.current += dt * (1000 / stepMs) * curSpeed.current;
      if (phase.current >= n) phase.current -= n; // wrap (anti-dérive float)
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
      onMouseEnter={() => { targetSpeed.current = HOVER_SLOW; }}
      onMouseLeave={() => { targetSpeed.current = 1; }}
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
          /* ombre diffuse + fine lumière sur les bords */
          box-shadow:
            0 24px 50px -22px rgba(11,24,41,0.42),
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
          .hg { height: 268px; }
          .hg-card { width: 232px; height: 164px; }
        }
      `}</style>
    </div>
  );
}
