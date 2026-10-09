"use client";

import { useEffect, useRef } from "react";
import styles from "./guided.module.css";

const REASSURANCE = [
  "Environ 3 minutes",
  "Aucune connaissance des OPCO nécessaire",
  "Résultat immédiatement disponible",
  "Estimation gratuite et non contractuelle",
];

export default function GuidedSimulatorIntro({ onStart, canResume, onResume }: { onStart: () => void; canResume: boolean; onResume: () => void }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { titleRef.current?.focus({ preventScroll: true }); }, []);

  return (
    <div className={`${styles.screen} ${styles.intro}`}>
      <p className={styles.eyebrow}>AMI Panorama · Simulation guidée</p>
      <h1 ref={titleRef} tabIndex={-1} className={`${styles.title} ${styles.introTitle}`}>Estimez le budget de votre voyage étudiant</h1>
      <p className={styles.help}>Répondez à quelques questions simples. Nous estimons ensuite le coût du séjour, les financements possibles et le reste à payer par participant.</p>
      <ul className={styles.reassure}>
        {REASSURANCE.map((item) => (
          <li key={item}><span aria-hidden="true" className={styles.tick}>✓</span>{item}</li>
        ))}
      </ul>
      <button type="button" className={styles.primary} onClick={canResume ? onResume : onStart}>
        {canResume ? "Reprendre ma simulation" : "Commencer ma simulation"} →
      </button>
      {canResume && (
        <p className={styles.note}>
          <button type="button" className={styles.edit} onClick={onStart}>Recommencer depuis le début</button>
        </p>
      )}
    </div>
  );
}
