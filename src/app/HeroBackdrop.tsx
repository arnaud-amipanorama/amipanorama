"use client";
import { useEffect, useRef } from "react";

// Fond du hero.
// Desktop : photographie éditoriale en haut à droite, dissoute dans le blanc (animation CSS lente).
// Mobile  : image immersive plein cadre, dissoute en diagonale dans le crème à gauche,
//           avec PARALLAX au scroll + dérive douce (pilotés en JS) → sensation "site moderne".
//
// Le cadrage (zoom / points de focus) vient de HERO_FOCUS dans heroConfig.ts :
// c'est le seul endroit à retoucher quand on change HERO_IMAGE.
export default function HeroBackdrop({
  image,
  focus,
}: {
  image: string;
  focus: { desktop: string; mobile: string };
}) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      if (window.innerWidth <= 760) {
        const t = (now - t0) / 1000;
        const drift = Math.sin(t * 0.26) * 4;                                   // dérive ambiante ±4px
        const par = Math.min(window.scrollY || 0, window.innerHeight) * 0.14;   // parallax au scroll
        el.style.transform = `scale(1.08) translate3d(0, ${(drift + par).toFixed(1)}px, 0)`;
      } else {
        el.style.transform = ""; // desktop : laisse l'animation CSS (hbDrift) piloter
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div
        ref={bgRef}
        aria-hidden="true"
        className="hb-bg"
        style={{
          backgroundImage: `url('${image}')`,
          // Variables consommées par les règles CSS ci-dessous (desktop + mobile).
          ["--hb-pos-desktop" as string]: focus.desktop,
          ["--hb-pos-mobile" as string]: focus.mobile,
        }}
      />
      <div aria-hidden="true" className="hb-scrim" />
      <style>{`
        .hb-bg {
          position: absolute; top: 0; right: 0;
          width: 58%; height: 64%;
          background-size: cover;
          background-position: var(--hb-pos-desktop);
          transform-origin: 75% 25%; will-change: transform;
          filter: saturate(1.03) brightness(1.04);
          -webkit-mask-image: radial-gradient(125% 135% at 100% 4%, #000 24%, rgba(0,0,0,0.5) 50%, transparent 76%);
          mask-image: radial-gradient(125% 135% at 100% 4%, #000 24%, rgba(0,0,0,0.5) 50%, transparent 76%);
          animation: hbDrift 26s ease-in-out infinite;
        }
        .hb-scrim { display: none; }
        @keyframes hbDrift {
          0%, 100% { transform: scale(1.04) translate3d(0, 0, 0); }
          50%      { transform: scale(1.06) translate3d(-7px, 4px, 0); }
        }

        /* ── Mobile : image immersive, dissoute en diagonale dans le crème ── */
        @media (max-width: 760px) {
          .hb-bg {
            inset: 0; width: auto; height: auto;
            background-position: var(--hb-pos-mobile);
            border-radius: 0; box-shadow: none;
            transform-origin: center top;
            -webkit-mask-image: linear-gradient(104deg, transparent 6%, rgba(0,0,0,0.28) 28%, #000 52%);
            mask-image: linear-gradient(104deg, transparent 6%, rgba(0,0,0,0.28) 28%, #000 52%);
            filter: saturate(1.06) contrast(1.02);
            animation: none;
          }
          /* Voile de lisibilité : le masque seul ne suffit pas dès que la photo
             est sombre du côté texte (immeubles, foule). Le scrim garantit le
             contraste du bloc éditorial quelle que soit l'image choisie, et
             s'efface avant la zone basse où vit le sujet (le groupe). */
          .hb-scrim {
            display: block; position: absolute; inset: 0; pointer-events: none;
            background:
              linear-gradient(100deg,
                var(--bg) 0%, rgba(250,248,245,0.94) 34%,
                rgba(250,248,245,0.58) 52%, rgba(250,248,245,0.10) 70%, transparent 82%),
              linear-gradient(to bottom,
                var(--bg) 0%, rgba(250,248,245,0.72) 9%,
                rgba(250,248,245,0.18) 20%, transparent 32%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hb-bg { animation: none; transform: scale(1.03); }
        }
      `}</style>
    </>
  );
}
