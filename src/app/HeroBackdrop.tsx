"use client";
import { useEffect, useRef } from "react";

// Fond du hero : image Séville full-bleed + voiles + parallax très léger réactif à la souris.
export default function HeroBackdrop() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0, targetY = 0, x = 0, y = 0, raf = 0;
    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 16;  // amplitude ~8px
      targetY = (e.clientY / window.innerHeight - 0.5) * 12;
    };
    const loop = () => {
      x += (targetX - x) * 0.06; // easing → mouvement fluide, jamais brusque
      y += (targetY - y) * 0.06;
      el.style.transform = `scale(1.08) translate(${(-x).toFixed(2)}px, ${(-y).toFixed(2)}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={bgRef} aria-hidden="true" className="hb-bg" />
      <div aria-hidden="true" className="hb-veil-left" />
      <div aria-hidden="true" className="hb-veil-bottom" />
      <style>{`
        .hb-bg {
          position: absolute; inset: 0;
          background-image: url('/Assets/hero/sevilla-hero.jpg');
          background-size: cover; background-position: center center;
          transform: scale(1.08); transform-origin: center;
          will-change: transform; filter: saturate(1.08) contrast(1.04);
        }
        .hb-veil-left {
          position: absolute; inset: 0;
          background: linear-gradient(94deg,
            var(--bg) 0%, var(--bg) 10%,
            rgba(248,246,241,0.72) 26%, rgba(248,246,241,0.20) 42%, transparent 54%);
        }
        .hb-veil-bottom {
          position: absolute; left: 0; right: 0; bottom: 0; height: 28%;
          background: linear-gradient(to top, var(--bg) 0%, transparent 100%);
        }
        @media (max-width: 760px) {
          .hb-veil-left {
            background: linear-gradient(to bottom,
              var(--bg) 0%, rgba(248,246,241,0.66) 26%, rgba(248,246,241,0.06) 56%, transparent 76%);
          }
          .hb-bg { transform: scale(1.04) !important; }
        }
      `}</style>
    </>
  );
}
