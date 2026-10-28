"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  fundingExamplePhrase,
  globalWeeksAvailability,
  globalWeeksConsentText,
  globalWeeksEditions,
  globalWeeksFaq,
  globalWeeksFunding,
} from "@/data/globalWeeks";
import { PUBLIC_SIMULATOR_PATH } from "@/lib/global-weeks/public-path";
import styles from "./global-weeks.module.css";

type Availability = "yes" | "maybe" | "no" | "";

type FormState = {
  alternance: string;
  niveau: string;
  classeMobility: string;
  previousMobility: string;
  opcoKnown: string;
  opco: string;
  destination: string;
  availabilities: Record<string, Availability>;
  agreement: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  school: string;
  city: string;
  employer: string;
  mobilityContact: string;
  consent: boolean;
  company: string;
};

const initialForm: FormState = {
  alternance: "",
  niveau: "",
  classeMobility: "",
  previousMobility: "",
  opcoKnown: "",
  opco: "",
  destination: "",
  availabilities: Object.fromEntries(globalWeeksAvailability.map((item) => [item.id, ""])),
  agreement: "",
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  school: "",
  city: "",
  employer: "",
  mobilityContact: "",
  consent: false,
  company: "",
};

const heroImageCommon = { alt: "", sizes: "(max-width: 700px) 100vw, 44vw" };
const { props: { srcSet: heroDesktopSrcSet } } = getImageProps({
  ...heroImageCommon,
  width: 1600,
  height: 1200,
  quality: 75,
  src: "/Assets/groups/seville-group.jpg",
});
const { props: { srcSet: heroMobileSrcSet, ...heroMobileImageProps } } = getImageProps({
  ...heroImageCommon,
  width: 1400,
  height: 1750,
  quality: 70,
  src: "/Assets/groups/newyork-bridge.jpg",
});

const opcos = [
  "AFDAS",
  "AKTO",
  "Atlas",
  "Constructys",
  "OCAPIAT",
  "OPCO 2i",
  "OPCO des Entreprises de Proximité",
  "OPCO Mobilités",
  "OPCO Santé",
  "Je ne le trouve pas / je ne sais pas",
];

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M2 7.5h11M8 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 4.2 4.2L19.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Icon({ name }: { name: "spark" | "book" | "users" | "route" | "shield" | "briefcase" }) {
  const paths = {
    spark: <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" />,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" /><path d="M4 18h16" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-1.2A4.8 4.8 0 0 1 8.3 14h1.4a4.8 4.8 0 0 1 4.8 4.8V20" /><path d="M16 5.5a3 3 0 0 1 0 5.6M19 20v-1.2a4.8 4.8 0 0 0-2.6-4.3" /></>,
    route: <><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="6" r="2.2" /><path d="M8 17c2.5-1.2 1.4-5.4 4-6.7 1.6-.8 2.7-.1 4.1-2.4" /></>,
    shield: <><path d="M12 3 20 6v5.6c0 4.8-3.3 7.8-8 9.4-4.7-1.6-8-4.6-8-9.4V6l8-3Z" /><path d="m8.6 12.1 2.2 2.2 4.7-4.7" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18M10 12v2h4v-2" /></>,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function track(event: string, detail: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("ami:global-weeks", { detail: { event, ...detail } }));
  const dataLayer = (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer;
  dataLayer?.push({ event: `global_weeks_${event}`, ...detail });
}

export default function GlobalWeeksExperience() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [kitOpen, setKitOpen] = useState(false);

  const outcome = useMemo<"A" | "B" | "C">(() => {
    if (form.alternance !== "Oui") return "C";
    if (form.classeMobility === "Oui" || form.previousMobility === "Oui" || form.agreement === "more") return "B";
    return "A";
  }, [form.agreement, form.alternance, form.classeMobility, form.previousMobility]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const updateAvailability = (id: string, value: Availability) =>
    setForm((current) => ({ ...current, availabilities: { ...current.availabilities, [id]: value } }));

  const scrollToEligibility = () => {
    document.getElementById("eligibilite")?.scrollIntoView({ behavior: "smooth", block: "start" });
    track("cta_eligibility_click");
  };

  const stepIsValid = (value: number) => {
    if (value === 1) return Boolean(form.alternance && form.niveau && form.classeMobility && form.previousMobility);
    if (value === 2) return Boolean(
      form.opcoKnown &&
      form.destination &&
      form.agreement &&
      Object.values(form.availabilities).some(Boolean) &&
      (form.opcoKnown !== "Oui" || form.opco),
    );
    return Boolean(form.prenom && form.nom && form.email && form.school && form.employer && form.consent);
  };

  const nextStep = () => {
    if (!stepIsValid(step)) {
      setError("Réponds aux questions indiquées avant de continuer.");
      return;
    }
    setError("");
    setStep((current) => Math.min(current + 1, 3));
    track("questionnaire_step_complete", { step });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stepIsValid(3)) {
      setError("Complète tes coordonnées et ton consentement pour continuer.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const availability = globalWeeksAvailability
        .map((item) => `${item.label} : ${form.availabilities[item.id] || "non renseigné"}`)
        .join(" · ");
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: form.prenom,
          nom: form.nom,
          email: form.email,
          telephone: form.telephone,
          etablissement: form.school,
          profil: "Alternant",
          objet: "Demande de programme",
          destination: form.destination,
          message: [
            "GLOBAL WEEKS, manifestation d’intérêt (pas une inscription définitive).",
            `Alternance : ${form.alternance}; niveau : ${form.niveau}; mobilité collective cette année : ${form.classeMobility}; mobilité précédente : ${form.previousMobility}.`,
            `OPCO connu : ${form.opcoKnown}; OPCO : ${form.opco || "non renseigné"}.`,
            `Disponibilités : ${availability}.`,
            `Accord dossier CFA/employeur : ${form.agreement}.`,
            `Ville : ${form.city || "non renseignée"}; employeur : ${form.employer}; référent mobilité : ${form.mobilityContact || "non renseigné"}.`,
          ].join("\n"),
          rgpd: form.consent,
          company: form.company,
          page: "/global-weeks",
          date: new Date().toISOString(),
          source: "formulaire contact",
        }),
      });
      if (!response.ok) throw new Error("submit");
      setCompleted(true);
      track("questionnaire_complete", { destination: form.destination, outcome, mobility_contact: Boolean(form.mobilityContact) });
    } catch {
      setError("Une erreur est survenue. Réessaie, ou écris-nous à info@amipanorama.com.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="global-weeks-title">
        <div className={styles.heroMap} aria-hidden="true">
          <span className={styles.mapDotOne} /><span className={styles.mapDotTwo} /><span className={styles.mapRoute} />
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroPhotoMain}>
            <picture>
              <source media="(max-width: 700px)" srcSet={heroMobileSrcSet} />
              <source media="(min-width: 701px)" srcSet={heroDesktopSrcSet} />
              <img {...heroMobileImageProps} alt="" className={styles.heroShot} />
            </picture>
          </div>
          <div className={styles.heroPhotoSmall}><Image src="/Assets/groups/montreal-sunset.jpg" alt="" fill sizes="(max-width: 760px) 38vw, 18vw" /></div>
          <div className={styles.heroStamp}>AMI<br />PANORAMA</div>
          <div className={styles.heroCoordinates}>45°30′N&nbsp;&nbsp;·&nbsp;&nbsp;37°23′N</div>
        </div>
        <div className={styles.wrap}>
          <div className={styles.heroContent}>
            <div className={`${styles.eyebrow} ${styles.eyebrowLight}`}>Global Weeks by AMI Panorama</div>
            <p className={styles.fundingBadge}>{globalWeeksFunding.badge}</p>
            <h1 id="global-weeks-title">Ton école ne propose pas de mobilité internationale&nbsp;? <em>Pars quand même.</em></h1>
            <p className={styles.heroLead}><strong>Dans la majorité des cas, ton séjour est financé.</strong> Rejoins une semaine avec d’autres alternants. Il peut rester un reste à charge, par exemple {fundingExamplePhrase()}. AMI monte le dossier avec toi.</p>
            <div className={styles.heroActions}>
              <button type="button" className="btn-primary" onClick={scrollToEligibility}>Vérifier mon éligibilité <ArrowIcon /></button>
              <a className="btn-ghost-light" href="#financement">Comprendre le financement <ArrowIcon /></a>
            </div>
            <p className={styles.heroTrust}>Candidature individuelle <span>·</span> Séjour financé dans la majorité des cas <span>·</span> Dossier avec ton CFA et ton employeur</p>
          </div>
        </div>
      </section>

      <nav className={styles.subnav} aria-label="Navigation Global Weeks">
        <div className={styles.subnavInner}>
          <a href="#financement">Financement</a><a href="#experience">L’expérience</a><a href="#editions">Destinations</a><a href="#comment-ca-marche">Comment ça marche</a><a href="#dossier">Ton dossier</a><a href={PUBLIC_SIMULATOR_PATH}>Simulateur</a><a href="#faq">FAQ</a>
          <button type="button" onClick={scrollToEligibility}>Vérifier mon éligibilité <ArrowIcon /></button>
        </div>
      </nav>

      <FundingSection onEligibility={scrollToEligibility} />

      <section className={styles.reassurance} aria-label="Les engagements Global Weeks">
        <div className={styles.wrap}>
          <div className={styles.reassuranceGrid}>
            {[
              ["spark", "Pensé pour les alternants", "Un départ individuel, une vraie cohorte."],
              ["book", "Une mobilité pédagogique encadrée", "Programme, cadre et accompagnement sur place."],
              ["users", "Des groupes multi-écoles", "Des rencontres au-delà de ta promotion."],
              ["route", "Un dossier guidé", "Avec ton référent mobilité et ton employeur."],
            ].map(([icon, title, text]) => <div className={styles.reassuranceItem} key={title}><Icon name={icon as "spark"} /><div><strong>{title}</strong><span>{text}</span></div></div>)}
          </div>
        </div>
      </section>

      <section id="experience" className={styles.experience}>
        <div className={styles.wrap}>
          <div className={styles.sectionIntro}>
            <div className="section-label">L’expérience Global Weeks</div>
            <h2>Une semaine qui peut <em>changer ton parcours.</em></h2>
            <p>Ce n’est pas une parenthèse touristique. C’est une expérience internationale conçue pour te faire apprendre, rencontrer et revenir avec une histoire professionnelle qui t’appartient.</p>
          </div>
          <div className={styles.experienceGrid}>
            <article className={styles.experienceFeature}>
              <Image src="/Assets/groups/newyork-pano.jpg" alt="Un groupe AMI Panorama à New York" fill sizes="(max-width: 760px) 100vw, 52vw" />
              <div><span>Une cohorte, plusieurs horizons</span><strong>Partir ensemble. Voir plus loin.</strong></div>
            </article>
            <div className={styles.pillarList}>
              {[
                ["01", "Apprendre dans un autre contexte", "Sortir du cadre habituel pour observer, questionner et prendre confiance."],
                ["02", "Découvrir un écosystème professionnel", "Relier ce que tu étudies à d’autres pratiques, métiers et environnements."],
                ["03", "Rencontrer une nouvelle cohorte", "Croiser des alternants, formations, secteurs et entreprises différents."],
                ["04", "Revenir avec quelque chose à raconter", "Une expérience valorisable, des souvenirs et un réseau qui restent."],
              ].map(([number, title, text]) => <article key={number} className={styles.pillar}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
            </div>
          </div>
        </div>
      </section>

      <section id="editions" className={styles.editions}>
        <div className={styles.wrap}>
          <div className={styles.sectionSplit}>
            <div><div className="section-label">Les éditions à venir</div><h2>Où est-ce que <em>tu te projettes&nbsp;?</em></h2></div>
            <p>Les premières Global Weeks seront ouvertes progressivement. Dis-nous quelle destination te donne le plus envie : cela nous aide à construire les prochaines cohortes.</p>
          </div>
          <div className={styles.editionGrid}>
            {globalWeeksEditions.map((edition) => (
              <article className={styles.editionCard} key={edition.id}>
                <Image src={edition.image} alt={`Des étudiants AMI Panorama à ${edition.city}`} fill sizes="(max-width: 640px) 82vw, (max-width: 1000px) 42vw, 25vw" />
                <div className={styles.editionShade} />
                <div className={styles.editionStatus}>{edition.status}</div>
                <div className={styles.editionContent}><span>{edition.flag} {edition.country}</span><h3>{edition.city}</h3><p>{edition.angle}</p><button type="button" onClick={() => { update("destination", edition.city); scrollToEligibility(); }}>Je suis intéressé(e) <ArrowIcon /></button></div>
              </article>
            ))}
          </div>
          <p className={styles.editionNote}>Aucune date, place, prestation ou modalité de transport n’est annoncée ici tant qu’une édition n’est pas ouverte et confirmée.</p>
        </div>
      </section>

      <section id="comment-ca-marche" className={styles.how}>
        <div className={styles.wrap}>
          <div className={styles.sectionIntro}><div className="section-label">Comment ça marche</div><h2>Simple devant. <em>Rigoureux derrière.</em></h2><p>Tu n’as pas besoin de maîtriser toute l’administration avant de te lancer. Tu as simplement besoin de savoir ce qui se passe ensuite.</p></div>
          <ol className={styles.steps}>
            {[
              "Tu choisis l’édition qui t’intéresse",
              "Tu réponds au questionnaire d’éligibilité",
              "Tu reçois ton kit à envoyer à ton référent mobilité",
              "Ton CFA, ton employeur et ton dossier sont validés",
              "Ta place est confirmée, puis tu pars avec ta cohorte",
            ].map((text, index) => <li key={text}><span>0{index + 1}</span><p>{text}</p></li>)}
          </ol>
          <div className={styles.howNote}><Icon name="shield" /><p><strong>À retenir :</strong> remplir le questionnaire ne réserve pas automatiquement une place. Il prépare ton dossier. Dans la majorité des cas, ton séjour est financé. AMI monte le dossier avec toi.</p></div>
        </div>
      </section>

      <section id="dossier" className={styles.dossier}>
        <div className={styles.wrap}>
          <div className={styles.dossierGrid}>
            <div className={styles.dossierCopy}><div className={styles.eyebrow}>Le dossier, sans le stress</div><h2>On te guide. Tu ne dois pas tout <em>comprendre seul.</em></h2><p>Une Global Week se prépare avec ton CFA, ton employeur et les bons documents. AMI rend le parcours clair, étape par étape, y compris pour le financement.</p><ul>{["Une convention de mobilité qui cadre le séjour", "Une charte d’engagement étudiant", "Le dossier avancé avec le CFA et l’employeur", "Un séjour financé dans la majorité des cas, avec parfois un reste à charge", "Les formalités de voyage selon la destination"].map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul></div>
            <aside className={styles.dossierPanel}><div className={styles.dossierPanelIcon}><Icon name="route" /></div><h3>Le rôle d’AMI</h3><p>Nous fournissons un parcours clair, préparons un kit pour ton référent, centralisons les informations utiles et t’accompagnons avant le départ.</p><div className={styles.transparent}><strong>Bon à savoir</strong><p>Dans la majorité des cas, ton séjour est financé. Il peut rester un reste à charge, par exemple {fundingExamplePhrase()}. AMI monte le dossier avec toi.</p></div></aside>
          </div>
        </div>
      </section>

      <section className={styles.referrer}>
        <div className={styles.wrap}><div className={styles.referrerGrid}><div><div className={styles.eyebrow}>Pour ton référent mobilité</div><h2>Tu n’as pas besoin de le convaincre <em>tout seul.</em></h2><p>Une demande structurée, un contexte clair et un interlocuteur AMI : le kit référent est pensé pour faciliter la discussion, pas pour la lui déléguer.</p><div className={styles.kitActions}><button className="btn-ghost-light" type="button" onClick={() => { setKitOpen(true); track("kit_referrer_open"); }}>Voir les téléchargements <ArrowIcon /></button><Link className="btn-ghost-light" href={PUBLIC_SIMULATOR_PATH}>Estimer mon séjour <ArrowIcon /></Link></div></div><div className={styles.kitPreview}><span>GLOBAL WEEKS</span><h3>Kit référent mobilité</h3><ul><li><CheckIcon />Résumé du séjour et objectifs pédagogiques</li><li><CheckIcon />Rôle attendu de l’établissement</li><li><CheckIcon />Contacts AMI et check-list de documents</li><li><CheckIcon />Lien vers le simulateur public</li></ul><KitDownloads /></div></div></div>
      </section>

      <section className={styles.eligibilityHint}>
        <div className={styles.wrap}><div className={styles.sectionIntro}><div className="section-label">Une première lecture</div><h2>Tu es peut-être éligible si…</h2></div><div className={styles.hintGrid}>{["tu es actuellement en alternance", "tu as envie de vivre une mobilité internationale", "tu veux un séjour financé dans la majorité des cas", "tu peux échanger avec ton CFA ou ton référent mobilité", "ton employeur peut avancer le projet avec toi", "une édition correspond à tes disponibilités"].map((item) => <div key={item}><CheckIcon /><span>{item}</span></div>)}</div><p>Cette liste t’aide à savoir si le projet te correspond. AMI monte le dossier avec toi.</p></div>
      </section>

      <section id="eligibilite" className={styles.questionnaire} aria-labelledby="eligibility-title">
        <div className={styles.wrap}><div className={styles.questionnaireShell}>
          <div className={styles.questionnaireIntro}><div className={styles.eyebrow}>Candidature / manifestation d’intérêt</div><h2 id="eligibility-title">Vérifier mon <em>éligibilité.</em></h2><p>Ce questionnaire ne t’inscrit pas à une Global Week. Il nous aide à comprendre ton projet. Dans la majorité des cas, le séjour est financé, et AMI monte le dossier avec toi.</p><div className={styles.progress}><span style={{ width: `${completed ? 100 : (step / 3) * 100}%` }} /></div><p className={styles.progressLabel}>{completed ? "Demande transmise" : `Étape ${step} sur 3`}</p></div>
          <div className={styles.questionnaireBody}>
            {completed ? <Outcome outcome={outcome} form={form} onKit={() => setKitOpen(true)} /> : (
              <form onSubmit={submit} noValidate>
                {step === 1 && <StepOne form={form} update={update} />}
                {step === 2 && <StepTwo form={form} update={update} updateAvailability={updateAvailability} />}
                {step === 3 && <StepThree form={form} update={update} />}
                {error && <p className={styles.formError} role="alert">{error}</p>}
                <div className={styles.formActions}>{step > 1 && <button type="button" className={styles.backButton} onClick={() => { setError(""); setStep((current) => current - 1); }}>Retour</button>}{step < 3 ? <button type="button" className="btn-primary" onClick={nextStep}>Continuer <ArrowIcon /></button> : <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Envoi en cours…" : "Voir la suite de mon projet"} {!submitting && <ArrowIcon />}</button>}</div>
              </form>
            )}
          </div>
        </div></div>
      </section>

      <section id="faq" className={styles.faq}>
        <div className={styles.wrap}><div className={styles.sectionSplit}><div><div className="section-label">Les questions qu’on se pose</div><h2>Tout comprendre, <em>sans jargon.</em></h2></div><p>Une réponse manque ? Tu peux démarrer le questionnaire sans avoir tout résolu : c’est justement fait pour t’orienter.</p></div><div className={styles.faqList}>{globalWeeksFaq.map((item, index) => <article className={styles.faqItem} key={item.question}><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq((current) => current === index ? null : index)}><span>{item.question}</span><i>{openFaq === index ? "−" : "+"}</i></button>{openFaq === index && <p>{item.answer}</p>}</article>)}</div></div>
      </section>

      <section className={styles.finalCta}><div className={styles.wrap}><div><div className={styles.eyebrow}>Global Weeks by AMI Panorama</div><h2>Ton projet international peut <em>commencer aujourd’hui.</em></h2><p>Tu n’as pas besoin d’avoir toutes les réponses. Dis-nous où tu aimerais partir : AMI monte le dossier avec toi. Dans la majorité des cas, le séjour est financé.</p><div className={styles.finalActions}><button type="button" className="btn-primary" onClick={scrollToEligibility}>Vérifier mon éligibilité <ArrowIcon /></button><button type="button" className="btn-ghost-light" onClick={() => setKitOpen(true)}>Parler de Global Weeks à mon référent <ArrowIcon /></button></div></div></div></section>

      <button className={styles.mobileSticky} type="button" onClick={scrollToEligibility}><span>Vérifier mon éligibilité</span><small>le séjour est financé dans la majorité des cas</small></button>

      {kitOpen && <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setKitOpen(false)}><section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="kit-title" onMouseDown={(event) => event.stopPropagation()}><button className={styles.modalClose} type="button" aria-label="Fermer" onClick={() => setKitOpen(false)}>×</button><div className={styles.eyebrow}>Kit référent mobilité</div><h2 id="kit-title">Un dossier conçu pour <em>faire gagner du temps.</em></h2><p>Le PDF, le PowerPoint et le flyer sont prêts à transmettre. Après l’envoi du formulaire, le PDF reprend le prénom et le nom saisis.</p><KitDownloads personal={completed ? form : null} /><button type="button" className="btn-primary" onClick={() => { setKitOpen(false); scrollToEligibility(); }}>Commencer par mon projet <ArrowIcon /></button></section></div>}
    </main>
  );
}

function FundingSection({ onEligibility }: { onEligibility: () => void }) {
  const roleIcons = ["users", "briefcase", "route"] as const;

  return (
    <section id="financement" className={styles.funding} aria-labelledby="financement-title">
      <div className={styles.wrap}>
        <div className={styles.sectionIntro}>
          <div className="section-label">Le financement</div>
          <h2 id="financement-title">Comment ton séjour <em>est financé.</em></h2>
          <p>Tu n’as pas à maîtriser les aides avant de te lancer. Dans la majorité des cas, ton séjour est financé. AMI monte le dossier avec toi.</p>
        </div>
        <ol className={styles.fundingSteps}>
          {globalWeeksFunding.steps.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className={styles.fundingRoles}>
          {globalWeeksFunding.roles.map((role, index) => (
            <article className={styles.fundingRole} key={role.title}>
              <div className={styles.fundingRoleIcon}><Icon name={roleIcons[index]} /></div>
              <h3>{role.title}</h3>
              <ul>
                {role.points.map((point) => (
                  <li key={point}><CheckIcon />{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className={styles.fundingHint}>{globalWeeksFunding.note}</p>
        <div className={styles.fundingActions}>
          <button type="button" className="btn-primary" onClick={onEligibility}>Vérifier mon éligibilité <ArrowIcon /></button>
          <p>AMI monte le dossier avec toi. Tu peux aussi estimer ton séjour.</p>
          <Link href={PUBLIC_SIMULATOR_PATH}>Ouvrir le simulateur</Link>
        </div>
      </div>
    </section>
  );
}

function Choice({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return <button type="button" className={`${styles.choice}${checked ? ` ${styles.choiceActive}` : ""}`} aria-pressed={checked} onClick={onChange}><span>{label}</span><i>{checked && <CheckIcon />}</i></button>;
}

function StepOne({ form, update }: { form: FormState; update: <K extends keyof FormState>(key: K, value: FormState[K]) => void }) {
  return <div className={styles.formStep}><div className={styles.stepTitle}><span>01</span><div><h3>Ton contexte</h3><p>Quelques repères pour comprendre où en est ton projet.</p></div></div><fieldset><legend>Es-tu actuellement en alternance ?</legend><div className={styles.choiceGrid}>{["Oui", "Non", "Je ne sais pas"].map((value) => <Choice key={value} label={value} checked={form.alternance === value} onChange={() => update("alternance", value)} />)}</div></fieldset><fieldset><legend>Quel est ton niveau de formation ?</legend><div className={styles.choiceGrid}>{["Bac +1", "Bac +2 / BTS", "Bachelor", "Master", "Autre"].map((value) => <Choice key={value} label={value} checked={form.niveau === value} onChange={() => update("niveau", value)} />)}</div></fieldset><fieldset><legend>Ton école ou ton CFA organise-t-il déjà une mobilité internationale pour ta classe cette année ?</legend><div className={styles.choiceGrid}>{["Oui", "Non", "Je ne sais pas"].map((value) => <Choice key={value} label={value} checked={form.classeMobility === value} onChange={() => update("classeMobility", value)} />)}</div></fieldset><fieldset><legend>As-tu déjà bénéficié d’une mobilité internationale dans ton parcours ?</legend><div className={styles.choiceGrid}>{["Oui", "Non", "Je ne sais pas"].map((value) => <Choice key={value} label={value} checked={form.previousMobility === value} onChange={() => update("previousMobility", value)} />)}</div></fieldset></div>;
}

function StepTwo({ form, update, updateAvailability }: { form: FormState; update: <K extends keyof FormState>(key: K, value: FormState[K]) => void; updateAvailability: (id: string, value: Availability) => void }) {
  return <div className={styles.formStep}><div className={styles.stepTitle}><span>02</span><div><h3>Ton envie de départ</h3><p>Tu nous donnes une préférence, jamais une réservation.</p></div></div><fieldset><legend>Connais-tu ton OPCO ?</legend><div className={styles.choiceGrid}>{["Oui", "Non", "Je ne sais pas"].map((value) => <Choice key={value} label={value} checked={form.opcoKnown === value} onChange={() => update("opcoKnown", value)} />)}</div>{form.opcoKnown && <label className={styles.fieldLabel}>Quel OPCO est lié à ton employeur ?<select value={form.opco} onChange={(event) => update("opco", event.target.value)}><option value="">Sélectionne une réponse</option>{opcos.map((opco) => <option key={opco}>{opco}</option>)}</select><small>L’OPCO est généralement lié à l’employeur. Tu peux demander à tes RH, ton manager ou ton référent mobilité.</small></label>}</fieldset><fieldset><legend>Quelle destination t’intéresse le plus ?</legend><div className={styles.choiceGrid}>{[...globalWeeksEditions.map((item) => item.city), "Je suis ouvert(e)"].map((value) => <Choice key={value} label={value} checked={form.destination === value} onChange={() => update("destination", value)} />)}</div></fieldset><fieldset><legend>Quelles semaines te conviendraient ?</legend><p className={styles.fieldHelp}>Les dates exactes seront annoncées par édition. Indique simplement ce qui te conviendrait le mieux.</p><div className={styles.availabilityList}>{globalWeeksAvailability.map((item) => <div key={item.id} className={styles.availabilityRow}><div><strong>{item.label}</strong><span>{item.detail}</span></div><div>{([ ["yes", "Oui"], ["maybe", "Possible"], ["no", "Impossible"] ] as const).map(([value, label]) => <button type="button" key={value} className={form.availabilities[item.id] === value ? styles.availabilityActive : ""} aria-pressed={form.availabilities[item.id] === value} onClick={() => updateAvailability(item.id, value)}>{label}</button>)}</div></div>)}</div></fieldset><fieldset><legend>Es-tu d’accord pour suivre un dossier avec ton CFA et ton employeur ?</legend><div className={styles.choiceStack}><Choice label="Oui, je veux avancer : AMI monte le dossier avec moi." checked={form.agreement === "yes"} onChange={() => update("agreement", "yes")} /><Choice label="Je préfère en savoir plus." checked={form.agreement === "more"} onChange={() => update("agreement", "more")} /></div></fieldset></div>;
}

function StepThree({ form, update }: { form: FormState; update: <K extends keyof FormState>(key: K, value: FormState[K]) => void }) {
  return <div className={styles.formStep}><div className={styles.stepTitle}><span>03</span><div><h3>Pour te recontacter</h3><p>Nous utilisons ces informations uniquement pour étudier ta demande et te guider.</p></div></div><div className={styles.fieldsTwo}><label className={styles.fieldLabel}>Prénom *<input value={form.prenom} onChange={(event) => update("prenom", event.target.value)} autoComplete="given-name" /></label><label className={styles.fieldLabel}>Nom *<input value={form.nom} onChange={(event) => update("nom", event.target.value)} autoComplete="family-name" /></label></div><div className={styles.fieldsTwo}><label className={styles.fieldLabel}>Email *<input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" /></label><label className={styles.fieldLabel}>Téléphone<input type="tel" value={form.telephone} onChange={(event) => update("telephone", event.target.value)} autoComplete="tel" /></label></div><div className={styles.fieldsTwo}><label className={styles.fieldLabel}>CFA / école *<input value={form.school} onChange={(event) => update("school", event.target.value)} autoComplete="organization" /></label><label className={styles.fieldLabel}>Ville<input value={form.city} onChange={(event) => update("city", event.target.value)} autoComplete="address-level2" /></label></div><label className={styles.fieldLabel}>Employeur *<input value={form.employer} onChange={(event) => update("employer", event.target.value)} autoComplete="organization" /></label><label className={styles.fieldLabel}>Nom ou email de ton référent mobilité <span>si tu le connais</span><input value={form.mobilityContact} onChange={(event) => update("mobilityContact", event.target.value)} /></label><label className={styles.consent}><input type="checkbox" checked={form.consent} onChange={(event) => update("consent", event.target.checked)} /><span>{globalWeeksConsentText} <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>.</span></label><label className={styles.honeypot} aria-hidden="true">Entreprise<input tabIndex={-1} autoComplete="off" value={form.company} onChange={(event) => update("company", event.target.value)} /></label></div>;
}

function Outcome({ outcome, form, onKit }: { outcome: "A" | "B" | "C"; form: FormState; onKit: () => void }) {
  const name = form.prenom;
  const content = {
    A: { title: "Ton projet peut avancer.", text: `Dans la majorité des cas, ton séjour est financé. Il peut rester un reste à charge, par exemple ${fundingExamplePhrase()}. AMI monte le dossier avec toi.` },
    B: { title: "On prépare la suite avec ton référent.", text: "Disponibilités, mobilité déjà prévue ou parcours : AMI monte le dossier avec toi et avec ton référent mobilité." },
    C: { title: "On garde le contact pour une autre édition.", text: "Si une autre date ou un autre format s’ouvre, nous pourrons te recontacter. Le kit reste disponible pour en parler." },
  }[outcome];
  return <div className={styles.outcome}><div className={styles.outcomeIcon}><CheckIcon /></div><div className={styles.eyebrow}>Manifestation d’intérêt transmise</div><h3>{name ? `${name}, ${content.title.charAt(0).toLowerCase()}${content.title.slice(1)}` : content.title}</h3><p>{content.text}</p><KitDownloads personal={form} prominent /><button type="button" className={styles.backButton} onClick={onKit}>Voir aussi le flyer et le PowerPoint</button><small>Ta demande est bien enregistrée. La place se confirme quand le groupe est maintenu et que le dossier est prêt.</small></div>;
}

function KitDownloads({ personal, prominent = false }: { personal?: FormState | null; prominent?: boolean }) {
  const [note, setNote] = useState("");

  const saveBlob = async (response: Response, filename: string) => {
    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { error?: string } | null;
      throw new Error(payload?.error || "téléchargement");
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const download = async (doc: "kit" | "flyer" | "pptx") => {
    setNote("");
    try {
      if (doc === "kit" && personal?.prenom && personal.nom) {
        const response = await fetch("/global-weeks/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prenom: personal.prenom,
            nom: personal.nom,
            etablissement: personal.school,
            employeur: personal.employer,
            opco: personal.opco,
          }),
        });
        await saveBlob(response, "kit-referent-global-weeks.pdf");
        return;
      }
      const response = await fetch(`/global-weeks/documents?doc=${doc}`);
      if (doc === "pptx" && response.status === 404) {
        setNote("Le PowerPoint (18 Mo) n’est pas encore en ligne. Le PDF et le flyer sont disponibles.");
        return;
      }
      const names = { kit: "kit-referent-global-weeks.pdf", flyer: "flyer-referent-global-weeks.pdf", pptx: "kit-referent-global-weeks.pptx" };
      await saveBlob(response, names[doc]);
    } catch {
      setNote("Le téléchargement n’a pas abouti. Réessaie dans un instant.");
    }
  };

  return (
    <div className={prominent ? styles.outcomeDownloads : styles.kitDownloads}>
      <button type="button" className={prominent ? "btn-primary" : styles.downloadLink} onClick={() => download("kit")}>{personal?.prenom ? "Kit PDF personnalisé" : "Kit PDF"}</button>
      <button type="button" className={styles.downloadLink} onClick={() => download("pptx")}>Kit PowerPoint</button>
      <button type="button" className={styles.downloadLink} onClick={() => download("flyer")}>Flyer PDF</button>
      {note && <p className={styles.downloadNote}>{note}</p>}
    </div>
  );
}
