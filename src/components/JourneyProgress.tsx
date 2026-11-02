import styles from "./journey-progress.module.css";

type JourneyProgressProps = {
  step: number;
  total: number;
  done?: boolean;
};

/**
 * Mini récit du questionnaire : le voyageur est devant la porte,
 * sort, prend l’avion, puis atterrit. Décoratif : la progression
 * réelle reste le texte « Étape x sur y ».
 */
export default function JourneyProgress({ step, total, done = false }: JourneyProgressProps) {
  const progress = done ? 1 : Math.min(1, Math.max(0, (step - 1) / Math.max(1, total)));
  const stage = done ? "landed" : step <= 1 ? "door" : step === 2 ? "depart" : "flight";

  return (
    <div
      className={styles.scene}
      data-stage={stage}
      style={{ ["--p" as string]: String(progress) }}
      aria-hidden="true"
    >
      <svg className={styles.svg} viewBox="0 0 640 120" fill="none">
        <rect className={styles.sky} x="0" y="0" width="640" height="86" rx="16" />
        <path className={styles.ground} d="M0 86h640" />
        <g className={styles.house}>
          <path d="M28 86V48l22-16 22 16v38" />
          <path className={styles.door} d="M42 86V62h14v24" />
        </g>
        <g className={styles.walker}>
          <circle cx="0" cy="58" r="6" />
          <path d="M0 66v14M-6 86l6-8 6 8M-7 72h14" />
          <path className={styles.pack} d="M6 68c6 0 8 4 8 8v6H6" />
        </g>
        <g className={styles.plane}>
          <path d="M0 0l28 2-10 6 8 1-16 7-6-5 4-4-12-1 4-6Z" />
        </g>
        <g className={styles.runway}>
          <path d="M500 90h110" />
          <path d="M512 86v8M536 86v8M560 86v8M584 86v8" />
        </g>
        <g className={styles.touchdown}>
          <circle cx="596" cy="70" r="10" />
          <path d="M591 70l3.2 3.2L602 65" />
        </g>
      </svg>
    </div>
  );
}
