"use client";

// Fond du hero : image full-bleed + voiles + dérive d'ambiance très lente.
// Pas de parallax souris (volontairement) — la vie passe par la typographie.
// L'image est passée en prop pour rester facile à remplacer (cf. heroConfig.ts).
export default function HeroBackdrop({ image }: { image: string }) {
  return (
    <>
      <div aria-hidden="true" className="hb-bg" style={{ backgroundImage: `url('${image}')` }} />
      <div aria-hidden="true" className="hb-wash" />
      <div aria-hidden="true" className="hb-veil-left" />
      <div aria-hidden="true" className="hb-veil-bottom" />
      <style>{`
        .hb-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: 76% center;
          transform-origin: center; will-change: transform;
          filter: saturate(1.04) brightness(1.03);
          transform: scale(1.03);
          animation: hbDrift 24s ease-in-out infinite;
        }
        /* Wash crème global très léger : adoucit l'image et la rend moins dominante */
        .hb-wash {
          position: absolute; inset: 0; pointer-events: none;
          background: rgba(248,246,241,0.12);
        }
        /* Dérive organique : scale léger + translations X/Y douces, jamais un simple zoom */
        @keyframes hbDrift {
          0%   { transform: scale(1.03) translate3d(0px, 0px, 0); }
          35%  { transform: scale(1.045) translate3d(-6px, -4px, 0); }
          70%  { transform: scale(1.04) translate3d(5px, -7px, 0); }
          100% { transform: scale(1.03) translate3d(0px, 0px, 0); }
        }
        /* Voile gauche : grande toile beige chaude, très progressive — l'image
           ne réapparaît que sur la droite, derrière/après le bloc texte */
        .hb-veil-left {
          position: absolute; inset: 0;
          background: linear-gradient(93deg,
            var(--bg) 0%, var(--bg) 32%,
            rgba(248,246,241,0.96) 44%, rgba(248,246,241,0.74) 54%,
            rgba(248,246,241,0.44) 64%, rgba(248,246,241,0.18) 74%,
            rgba(248,246,241,0.06) 82%, transparent 92%);
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
          .hb-bg { animation: none; transform: scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hb-bg { animation: none; transform: scale(1.03); }
        }
      `}</style>
    </>
  );
}
