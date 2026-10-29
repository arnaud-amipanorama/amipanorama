type EuStarsProps = {
  className?: string;
};

/** Cercle de douze étoiles, rappel du drapeau européen. Décoratif. */
export default function EuStars({ className }: EuStarsProps) {
  const stars = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index * 30 - 90) * Math.PI) / 180;
    const orbit = 34;
    return {
      cx: 50 + orbit * Math.cos(angle),
      cy: 50 + orbit * Math.sin(angle),
    };
  });

  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      {stars.map((star) => (
        <polygon key={`${star.cx.toFixed(2)}-${star.cy.toFixed(2)}`} fill="#FFCC00" points={starPoints(star.cx, star.cy, 5.2, 2.05)} />
      ))}
    </svg>
  );
}

function starPoints(cx: number, cy: number, outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + i * (Math.PI / 5);
    pts.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(" ");
}
