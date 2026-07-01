"use client";

// Fond du hero.
// Desktop : photographie éditoriale en haut à droite, dissoute dans le blanc.
// Mobile  : image PLEIN CADRE (100vh), texte intégré par-dessus. Le voile blanc
//           n'est présent qu'EN HAUT (derrière le texte) → la Giralda et les
//           étudiants restent parfaitement visibles en bas. Une seule composition.
export default function HeroBackdrop({ image }: { image: string }) {
  return (
    <>
      <div aria-hidden="true" className="hb-bg" style={{ backgroundImage: `url('${image}')` }} />
      <div aria-hidden="true" className="hb-scrim" />
      <style>{`
        .hb-bg {
          position: absolute; top: 0; right: 0;
          width: 58%; height: 64%;
          background-size: cover; background-position: 62% 16%;
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

        /* ── Mobile : image IMMERSIVE plein cadre, dissoute en DIAGONALE dans le crème à gauche ── */
        @media (max-width: 760px) {
          .hb-bg {
            inset: 0; width: auto; height: auto;
            background-position: 52% 24%;   /* Giralda entière (haut-droite) + étudiants + rue */
            border-radius: 0; box-shadow: none;
            -webkit-mask-image: linear-gradient(102deg, transparent 22%, rgba(0,0,0,0.38) 44%, #000 60%);
            mask-image: linear-gradient(102deg, transparent 22%, rgba(0,0,0,0.38) 44%, #000 60%);
            filter: saturate(1.06) contrast(1.02);
            animation: none; transform: none;
          }
          .hb-scrim { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hb-bg { animation: none; }
        }
      `}</style>
    </>
  );
}
