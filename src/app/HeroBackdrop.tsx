"use client";

// Fond du hero — direction éditoriale.
// L'image n'est plus un fond plein : c'est une PHOTOGRAPHIE placée en haut à droite,
// qui se dissout très progressivement dans le blanc (mask radial diffus) et s'arrête
// visuellement au niveau du carousel. Beaucoup de respiration, image non dominante.
// Image passée en prop (cf. heroConfig.ts). Mobile : bande haute dédiée.
export default function HeroBackdrop({ image }: { image: string }) {
  return (
    <>
      <div aria-hidden="true" className="hb-bg" style={{ backgroundImage: `url('${image}')` }} />
      <style>{`
        .hb-bg {
          position: absolute; top: 0; right: 0;
          width: 58%; height: 64%;
          background-size: cover;
          background-position: 62% 16%;   /* remonte la Giralda + plus de ciel */
          transform-origin: 75% 25%; will-change: transform;
          filter: saturate(1.03) brightness(1.04);
          /* fondu TRÈS diffus : opaque en haut à droite, dissous vers le bas/gauche → "sort du blanc" */
          -webkit-mask-image: radial-gradient(125% 135% at 100% 4%, #000 24%, rgba(0,0,0,0.5) 50%, transparent 76%);
          mask-image: radial-gradient(125% 135% at 100% 4%, #000 24%, rgba(0,0,0,0.5) 50%, transparent 76%);
          animation: hbDrift 26s ease-in-out infinite;
        }
        /* dérive extrêmement légère */
        @keyframes hbDrift {
          0%, 100% { transform: scale(1.04) translate3d(0, 0, 0); }
          50%      { transform: scale(1.06) translate3d(-7px, 4px, 0); }
        }
        /* ── Mobile : bande photographique en haut, dissoute vers le blanc ── */
        @media (max-width: 760px) {
          /* Mobile : vraie bannière photo en haut, nette, avec un fondu doux vers le bas.
             Le texte remonte sous elle (cf. .hero-inner) → pas de grand vide. */
          .hb-bg {
            top: 0; left: 0; right: 0; width: auto; height: 46vh;
            background-position: 50% 32%;
            -webkit-mask-image: linear-gradient(to bottom, #000 66%, rgba(0,0,0,0.5) 84%, transparent 100%);
            mask-image: linear-gradient(to bottom, #000 66%, rgba(0,0,0,0.5) 84%, transparent 100%);
            animation: none; transform: scale(1.04);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hb-bg { animation: none; transform: scale(1.04); }
        }
      `}</style>
    </>
  );
}
