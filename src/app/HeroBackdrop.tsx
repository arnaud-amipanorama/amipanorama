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

        /* ── Mobile : SPLIT éditorial — image = colonne DROITE pleine hauteur ── */
        @media (max-width: 760px) {
          .hb-bg {
            top: 0; right: 0; bottom: 0; left: auto;
            width: 46%; height: 100%;
            background-position: 58% 20%;   /* sommet complet de la Giralda + étudiants en bas */
            -webkit-mask-image: none; mask-image: none;
            filter: saturate(1.05) brightness(1.02);
            animation: none; transform: none;
          }
          /* Fondu HORIZONTAL sur le bord gauche de l'image → transition douce vers la zone texte */
          .hb-scrim {
            display: block; position: absolute; inset: 0; pointer-events: none;
            background: linear-gradient(to right,
              #FAF8F5 0%, #FAF8F5 44%,
              rgba(250,248,245,0.70) 52%,
              rgba(250,248,245,0.22) 60%,
              transparent 66%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hb-bg { animation: none; }
        }
      `}</style>
    </>
  );
}
