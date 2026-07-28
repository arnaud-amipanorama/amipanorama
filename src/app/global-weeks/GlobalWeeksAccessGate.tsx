import Image from "next/image";
import { unlockGlobalWeeks } from "./actions";
import styles from "./access-gate.module.css";

export default function GlobalWeeksAccessGate({ denied }: { denied: boolean }) {
  return (
    <main className={styles.page}>
      <div className={styles.visual} aria-hidden="true">
        <Image src="/Assets/groups/seville-garden.jpg" alt="" fill priority sizes="100vw" />
      </div>
      <section className={styles.card} aria-labelledby="access-title">
        <div className={styles.eyebrow}>AMI Panorama · Accès privé</div>
        <h1 id="access-title">Global Weeks est encore <em>en préparation.</em></h1>
        <p>Cette page n’est pas encore annoncée publiquement. Saisis le mot de passe pour accéder à l’aperçu.</p>
        <form action={unlockGlobalWeeks}>
          <label htmlFor="global-weeks-password">Mot de passe</label>
          <input id="global-weeks-password" name="password" type="password" autoComplete="current-password" required autoFocus />
          {denied && <p className={styles.error} role="alert">Mot de passe incorrect.</p>}
          <button type="submit">Accéder à l’aperçu <span aria-hidden="true">→</span></button>
        </form>
        <small>L’accès est temporaire et réservé à l’équipe AMI Panorama.</small>
      </section>
    </main>
  );
}
