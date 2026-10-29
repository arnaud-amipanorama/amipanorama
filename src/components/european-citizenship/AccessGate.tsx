import Link from "next/link";
import { unlockEuropeanCitizenship } from "@/app/citoyennete-europeenne/actions";
import { citizenshipCopy, citizenshipRoutes, type CitizenshipLocale } from "@/data/europeanCitizenship";
import EuStars from "./EuStars";
import SetDocumentLang from "./SetDocumentLang";
import styles from "./european-citizenship.module.css";

export default function AccessGate({ locale, denied }: { locale: CitizenshipLocale; denied: boolean }) {
  const copy = citizenshipCopy(locale);
  const htmlLang = locale === "fr" ? "fr" : "en";

  return (
    <section lang={htmlLang} className={styles.gate} aria-labelledby="access-title">
      <SetDocumentLang lang={htmlLang} />
      <EuStars className={styles.gateStars} />
      <div className={styles.gateCard}>
        <nav className={styles.lang} aria-label={copy.lang.navLabel}>
          <Link href={citizenshipRoutes.fr} hrefLang="fr" lang="fr" aria-label="Français" aria-current={locale === "fr" ? "page" : undefined}>
            FR
          </Link>
          <Link href={citizenshipRoutes.en} hrefLang="en" lang="en" aria-label="English" aria-current={locale === "en" ? "page" : undefined}>
            EN
          </Link>
        </nav>
        <p className={styles.eyebrow}>{copy.gate.eyebrow}</p>
        <h1 id="access-title">{copy.gate.title}</h1>
        <p className={styles.gateText}>{copy.gate.text}</p>
        <form action={unlockEuropeanCitizenship} className={styles.gateForm}>
          <input type="hidden" name="locale" value={locale} />
          <label htmlFor="european-citizenship-password">{copy.gate.label}</label>
          <input
            id="european-citizenship-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
          />
          {denied ? <p className={styles.gateError} role="alert">{copy.gate.error}</p> : null}
          <button type="submit" className={styles.btnYellow}>
            {copy.gate.submit}
          </button>
        </form>
        <p className={styles.gateNote}>{copy.gate.note}</p>
      </div>
    </section>
  );
}
