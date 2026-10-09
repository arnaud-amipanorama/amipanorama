"use client";

import Link from "next/link";
import { simulatorUrl } from "@/lib/simulator/guided";
import styles from "./guided/guided.module.css";

/** Écran d'entrée après l'accès : choix entre les deux simulateurs. */
export default function SimulatorChooser() {
  return (
    <div className={styles.root}>
      <div aria-hidden="true" className={styles.glow} />
      <div className={`${styles.shell} ${styles.shellWide}`}>
        <main className={`${styles.screen} ${styles.chooser}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Assets/Brand/ami-logo-white.png" alt="AMI Panorama" className={styles.chooserLogo} />
          <p className={styles.eyebrow}>Simulateur de financement</p>
          <h1 className={`${styles.title} ${styles.introTitle}`}>Quel simulateur <span style={{ whiteSpace: "nowrap" }}>souhaitez-vous</span> utiliser ?</h1>
          <p className={styles.help}>Les deux reposent sur les mêmes règles de calcul. Vous pourrez passer de l’un à l’autre à tout moment.</p>

          <div className={styles.chooserGrid}>
            <article className={`${styles.chooserCard} ${styles.chooserCardMain}`}>
              <span className={`${styles.badge} ${styles.badgeInfo}`}>★ Recommandé</span>
              <h2 className={styles.chooserTitle}>Simulateur guidé</h2>
              <p className={styles.chooserSub}>Pour obtenir facilement une première estimation</p>
              <p className={styles.chooserText}>Un parcours simple, question par question, accessible sans connaissance des OPCO.</p>
              <Link href={simulatorUrl("guided")} className={styles.primary}>Commencer →</Link>
            </article>

            <article className={styles.chooserCard}>
              <h2 className={styles.chooserTitle}>Simulateur expert</h2>
              <p className={styles.chooserSub}>Pour construire une simulation détaillée</p>
              <p className={styles.chooserText}>Retrouvez tous les réglages OPCO, les hypothèses financières et les paramètres avancés.</p>
              <Link href={simulatorUrl("expert")} className={styles.ghost}>Ouvrir le simulateur expert →</Link>
            </article>
          </div>

          <p className={styles.legal} style={{ textAlign: "center" }}>Les résultats sont des estimations indicatives et non contractuelles. AMI Panorama ne garantit aucun montant de financement.</p>
        </main>
      </div>
    </div>
  );
}
