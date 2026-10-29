import Link from "next/link";
import EuStars from "./EuStars";
import SetDocumentLang from "./SetDocumentLang";
import styles from "./european-citizenship.module.css";
import {
  bookingPath,
  citizenshipCopy,
  citizenshipOffer,
  citizenshipRoutes,
  contactHref,
  type CitizenshipLocale,
} from "@/data/europeanCitizenship";

const contactUrl = contactHref();

export default function EuropeanCitizenshipPage({ locale }: { locale: CitizenshipLocale }) {
  const copy = citizenshipCopy(locale);
  const htmlLang = locale === "fr" ? "fr" : "en";

  return (
    <article lang={htmlLang} className={styles.page}>
      <SetDocumentLang lang={htmlLang} />

      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <EuStars className={styles.stars} />
          <div className={styles.heroCopy}>
            <LanguageSwitch locale={locale} label={copy.lang.navLabel} />
            <p className={styles.eyebrow}>{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title}</h1>
            <p className={styles.subtitle}>{copy.hero.subtitle}</p>
            <p className={styles.intro}>{copy.hero.intro}</p>
            <ul className={styles.facts}>
              {copy.hero.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <div className={styles.ctaRow}>
              <Link className={styles.btnYellow} href={contactUrl}>
                {copy.hero.ctaPrimary}
                <Arrow />
              </Link>
              <Link className={styles.btnOnBlue} href={bookingPath}>
                {copy.hero.ctaSecondary}
              </Link>
            </div>
            <p className={styles.priceNote}>{copy.hero.priceNote}</p>
          </div>
        </div>
        <div className={styles.heroRule} aria-hidden="true" />
      </header>

      <section className={styles.band} aria-labelledby="fede-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.fede.eyebrow}</p>
          <h2 id="fede-title" className={styles.h2}>{copy.fede.title}</h2>
          <p className={styles.lead}>{copy.fede.text}</p>
          <p className={styles.note}>{copy.fede.note}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="why-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.why.eyebrow}</p>
          <h2 id="why-title" className={styles.h2}>{copy.why.title}</h2>
          <p className={styles.lead}>{copy.why.lead}</p>
          <div className={styles.placeGrid}>
            {copy.why.places.map((place) => (
              <article key={place.title} className={styles.card}>
                {place.meta ? <p className={styles.badge}>{place.meta}</p> : null}
                <h3>{place.title}</h3>
                <p>{place.text}</p>
              </article>
            ))}
          </div>
          <p className={styles.footnote}>{copy.why.footnote}</p>
        </div>
      </section>

      <section className={styles.sectionAlt} aria-labelledby="paths-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.paths.eyebrow}</p>
          <h2 id="paths-title" className={styles.h2}>{copy.paths.title}</h2>
          <p className={styles.lead}>{copy.paths.lead}</p>
          <div className={styles.pathGrid}>
            {copy.paths.items.map((item) => (
              <article key={item.title} className={styles.path}>
                {item.meta ? <p className={styles.meta}>{item.meta}</p> : null}
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="skills-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.skills.eyebrow}</p>
          <h2 id="skills-title" className={styles.h2}>{copy.skills.title}</h2>
          <ol className={styles.skills}>
            {copy.skills.items.map((item, index) => (
              <li key={item}>
                <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <p className={styles.note}>{copy.skills.note}</p>
        </div>
      </section>

      <section className={styles.sectionAlt} aria-labelledby="week-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.week.eyebrow}</p>
          <h2 id="week-title" className={styles.h2}>{copy.week.title}</h2>
          <p className={styles.lead}>{copy.week.lead}</p>
          <div className={styles.days}>
            {copy.week.days.map((day) => (
              <article key={day.id} className={styles.day} aria-labelledby={`day-${day.id}`}>
                <h3 id={`day-${day.id}`} className={styles.dayName}>{day.name}</h3>
                {day.slots.map((slot) => (
                  <div key={slot.label} className={styles.slot}>
                    <span className={styles.slotLabel}>{slot.label}</span>
                    <p>{slot.text}</p>
                  </div>
                ))}
              </article>
            ))}
          </div>
          <dl className={styles.legend}>
            {copy.week.legend.map((item) => (
              <div key={item.term}>
                <dt>{item.term}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.note}>{copy.week.note}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="evidence-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.evidence.eyebrow}</p>
          <h2 id="evidence-title" className={styles.h2}>{copy.evidence.title}</h2>
          <p className={styles.lead}>{copy.evidence.lead}</p>
          <div className={styles.evidenceGrid}>
            {copy.evidence.items.map((item) => (
              <article key={item.title} className={styles.evidenceCard}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <h3 className={styles.examplesLabel}>{copy.evidence.examplesLabel}</h3>
          <ul className={styles.examples}>
            {copy.evidence.examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.sectionAlt} aria-labelledby="included-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.included.eyebrow}</p>
          <h2 id="included-title" className={styles.h2}>{copy.included.title}</h2>
          <p className={styles.lead}>{copy.included.lead}</p>
          <div className={styles.includes}>
            {copy.included.items.map((item) => (
              <article key={item.title} className={styles.include}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="steps-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.steps.eyebrow}</p>
          <h2 id="steps-title" className={styles.h2}>{copy.steps.title}</h2>
          <div className={styles.stepGrid}>
            {copy.steps.items.map((item, index) => (
              <article key={item.title} className={styles.step}>
                <span className={styles.stepIndex}>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.band} aria-labelledby="about-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.about.eyebrow}</p>
          <h2 id="about-title" className={styles.h2}>{copy.about.title}</h2>
          <p className={styles.lead}>{copy.about.text}</p>
          <div className={styles.stats}>
            {copy.about.stats.map((stat) => (
              <p key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="faq-title">
        <div className={styles.wrap}>
          <p className={`section-label ${styles.label}`}>{copy.faq.eyebrow}</p>
          <h2 id="faq-title" className={styles.h2}>{copy.faq.title}</h2>
          <div className={styles.faq}>
            {copy.faq.items.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.final} aria-labelledby="cta-title">
        <div className={styles.wrap}>
          <p className={styles.eyebrow}>{copy.cta.eyebrow}</p>
          <h2 id="cta-title">{copy.cta.title}</h2>
          <p className={styles.finalLead}>{copy.cta.text}</p>
          <div className={styles.ctaRow}>
            <Link className={styles.btnYellow} href={contactUrl}>
              {copy.cta.primary}
              <Arrow />
            </Link>
            <Link className={styles.btnOnBlue} href={bookingPath}>
              {copy.cta.secondary}
            </Link>
          </div>
          <p className={styles.priceNote}>{copy.hero.priceNote}</p>
          <p className={styles.email}>
            {copy.cta.emailLabel}{" "}
            <a href={`mailto:${citizenshipOffer.contactEmail}`}>{citizenshipOffer.contactEmail}</a>
          </p>
          <div className={styles.finalLang}>
            <LanguageSwitch locale={locale} label={copy.lang.navLabel} />
          </div>
        </div>
      </section>
    </article>
  );
}

function LanguageSwitch({ locale, label }: { locale: CitizenshipLocale; label: string }) {
  return (
    <nav className={styles.lang} aria-label={label}>
      <Link href={citizenshipRoutes.fr} hrefLang="fr" lang="fr" aria-label="Français" aria-current={locale === "fr" ? "page" : undefined}>
        FR
      </Link>
      <Link href={citizenshipRoutes.en} hrefLang="en" lang="en" aria-label="English" aria-current={locale === "en" ? "page" : undefined}>
        EN
      </Link>
    </nav>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
