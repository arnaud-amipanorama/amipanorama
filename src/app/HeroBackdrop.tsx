"use client";

// Fond du hero : image full-bleed + voiles + dérive d'ambiance très lente.
// Pas de parallax souris (volontairement) — la vie passe par la typographie.
// L'image est passée en prop pour rester facile à remplacer (cf. heroConfig.ts).
export default function HeroBackdrop({ image }: { image: string }) {
  return (
    <>
      <div aria-hidden="true" className="hb-bg" style={{ backgroundImage: `url('${image}')` }} />
      <div aria-hidden="true" className="hb-veil-left" />
      <div aria-hidden="true" className="hb-veil-bottom" />
      <style>{`
        .hb-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center center;
          transform-origin: center; will-change: transform;
          filter: saturate(1.06) contrast(1.03);
          animation: hbDrift 28s ease-in-out infinite;
        }
        @keyframes hbDrift {
          0%, 100% { transform: scale(1.06) translate(0, 0); }
          50%      { transform: scale(1.10) translate(-1.1%, -0.7%); }
        }
        .hb-veil-left {
          position: absolute; inset: 0;
          background: linear-gradient(96deg,
            var(--bg) 0%, var(--bg) 8%,
            rgba(248,246,241,0.82) 22%, rgba(248,246,241,0.44) 36%,
            rgba(248,246,241,0.14) 47%, transparent 57%);
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
          .hb-bg { animation: none; transform: scale(1.06); }
        }
      `}</style>
    </>
  );
}
