"use client";

import { useEffect, useRef } from "react";
import styles from "./guided.module.css";

type Props = {
  /** Position dans le parcours, à partir de 1. */
  index: number;
  total: number;
  title: string;
  help?: string;
  error?: string | null;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  children: React.ReactNode;
};

/**
 * Gabarit d'une question : progression, titre, aide, contenu, erreur, navigation.
 * À chaque changement d'étape, le focus est placé sur le titre et la page remonte.
 */
export default function GuidedSimulatorStep({ index, total, title, help, error, onBack, onContinue, continueLabel = "Continuer", children }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    titleRef.current?.focus({ preventScroll: true });
  }, [title]);

  const percent = Math.round((index / total) * 100);

  return (
    <form
      className={styles.screen}
      noValidate
      onSubmit={(event) => { event.preventDefault(); onContinue(); }}
    >
      <div className={styles.progressRow}>
        <span>Étape {index} sur {total}</span>
        <span aria-hidden="true">{percent} %</span>
      </div>
      <div className={styles.progressTrack} role="progressbar" aria-label="Progression de la simulation" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index} aria-valuetext={`Étape ${index} sur ${total}`}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>

      <h1 ref={titleRef} tabIndex={-1} className={styles.title}>{title}</h1>
      {help && <p className={styles.help}>{help}</p>}

      {children}

      {/* Région toujours présente : une erreur qui apparaît est annoncée par les lecteurs d'écran. */}
      <div role="alert" aria-live="assertive">
        {error && <p className={styles.error}><strong>À corriger : </strong>{error}</p>}
      </div>

      <div className={styles.nav}>
        <button type="button" className={styles.back} onClick={onBack}>← Retour</button>
        <button type="submit" className={styles.primary}>{continueLabel} →</button>
      </div>
    </form>
  );
}
