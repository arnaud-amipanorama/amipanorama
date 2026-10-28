"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { globalWeeksConsentText, globalWeeksEditions } from "@/data/globalWeeks";
import {
  DEFAULT_PUBLIC_DURATION_DAYS,
  PUBLIC_DURATION_DAYS,
  PUBLIC_OPCOS,
  estimatePublicMobility,
  estimateSummary,
  type MobilityMode,
  type PublicEstimate,
  type PublicStatus,
} from "@/lib/global-weeks/public-estimate";
import styles from "./simulator.module.css";

type Step = "mode" | "who" | "size" | "destination" | "duration" | "opco" | "result";

const euro = (value: number) => `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(value))} €`;

export default function PublicSimulator() {
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<MobilityMode | "">("");
  const [status, setStatus] = useState<PublicStatus | "">("");
  const [participants, setParticipants] = useState(15);
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState<number>(DEFAULT_PUBLIC_DURATION_DAYS);
  const [opcoId, setOpcoId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [contact, setContact] = useState({ prenom: "", nom: "", email: "", telephone: "", school: "", employer: "", consent: false, company: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const estimate: PublicEstimate | null = useMemo(() => {
    if (!mode || !destination) return null;
    if (mode === "individuel" && !status) return null;
    return estimatePublicMobility({
      mode,
      status: mode === "groupe" ? "alternant" : status || "alternant",
      destination,
      days,
      opcoId: mode === "individuel" && status === "etudiant" ? null : opcoId,
      participants: mode === "individuel" ? 1 : participants,
    });
  }, [days, destination, mode, opcoId, participants, status]);

  const go = (next: Step) => { setError(""); setStep(next); };

  const afterMode = (value: MobilityMode) => {
    setMode(value);
    go(value === "individuel" ? "who" : "size");
  };

  const afterWho = (value: PublicStatus) => {
    setStatus(value);
    go("destination");
  };

  const afterDestination = (city: string) => {
    setDestination(city);
    go("duration");
  };

  const afterDuration = () => {
    if (mode === "individuel" && status === "etudiant") go("result");
    else go("opco");
  };

  const submitLead = async (event: FormEvent) => {
    event.preventDefault();
    if (!estimate) return;
    if (!contact.prenom || !contact.nom || !contact.email || !contact.school || !contact.consent) {
      setError("Indique ton prénom, ton nom, ton e-mail, ton école ou CFA, et coche le consentement.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: contact.prenom,
          nom: contact.nom,
          email: contact.email,
          telephone: contact.telephone,
          etablissement: contact.school,
          profil: mode === "groupe" ? "Groupe" : status === "etudiant" ? "Étudiant" : "Alternant",
          objet: "Simulation Global Weeks",
          destination,
          tailleGroupe: String(estimate.participants),
          message: [
            estimateSummary(estimate),
            `École / CFA : ${contact.school}`,
            `Employeur : ${contact.employer || "non renseigné"}`,
          ].join("\n"),
          rgpd: contact.consent,
          company: contact.company,
          source: "simulateur global weeks",
          page: "/global-weeks/simulateur",
          date: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("lead");
      setSent(true);
    } catch {
      setError("L’enregistrement n’a pas abouti. Réessaie, ou écris à info@amipanorama.com.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <Link className={styles.back} href="/global-weeks">← Global Weeks</Link>
        <section className={styles.card}>
          <div className={styles.eyebrow}>Simulateur simplifié</div>
          {step === "mode" && (
            <>
              <h1 className={styles.title}>Mobilité individuelle ou mobilité de groupe ?</h1>
              <p className={styles.lead}>Une première estimation, d’après nos informations. Tu peux la faire pour toi, ou pour un groupe.</p>
              <div className={styles.choices}>
                <button type="button" className={styles.choice} onClick={() => afterMode("individuel")}>Mobilité individuelle<small>Tu estimes ton séjour. Dans la majorité des cas, il est financé.</small></button>
                <button type="button" className={styles.choice} onClick={() => afterMode("groupe")}>Mobilité de groupe<small>Tu estimes un départ à plusieurs.</small></button>
              </div>
            </>
          )}

          {step === "who" && (
            <>
              <h1 className={styles.title}>Tu pars en tant qu’alternant ou étudiant ?</h1>
              <div className={styles.choices}>
                <button type="button" className={styles.choice} onClick={() => afterWho("alternant")}>Alternant<small>Les aides les plus courantes accompagnent l’alternance.</small></button>
                <button type="button" className={styles.choice} onClick={() => afterWho("etudiant")}>Étudiant<small>AMI monte le dossier avec toi, sur le prix indicatif du séjour.</small></button>
              </div>
              <div className={styles.actions}><button type="button" className={styles.ghost} onClick={() => go("mode")}>Retour</button></div>
            </>
          )}

          {step === "size" && (
            <>
              <h1 className={styles.title}>Combien de personnes partent ?</h1>
              <label className={styles.field}>Nombre de participants
                <input type="number" min={2} max={200} value={participants} onChange={(event) => setParticipants(Number(event.target.value))} />
              </label>
              <div className={styles.actions}>
                <button type="button" className={styles.ghost} onClick={() => go("mode")}>Retour</button>
                <button type="button" className="btn-primary" onClick={() => { if (participants >= 2 && participants <= 200) go("destination"); else setError("Indique entre 2 et 200 personnes."); }}>Continuer</button>
              </div>
              {error && <p className={styles.error}>{error}</p>}
            </>
          )}

          {step === "destination" && (
            <>
              <h1 className={styles.title}>Quelle destination t’intéresse ?</h1>
              <div className={styles.grid}>
                {globalWeeksEditions.map((edition) => (
                  <button type="button" key={edition.id} className={`${styles.choice}${destination === edition.city ? ` ${styles.choiceOn}` : ""}`} onClick={() => afterDestination(edition.city)}>{edition.city}<small>{edition.country}</small></button>
                ))}
              </div>
              <div className={styles.actions}><button type="button" className={styles.ghost} onClick={() => go(mode === "groupe" ? "size" : "who")}>Retour</button></div>
            </>
          )}

          {step === "duration" && (
            <>
              <h1 className={styles.title}>Combien de temps ?</h1>
              <div className={styles.choices}>
                {PUBLIC_DURATION_DAYS.map((value) => (
                  <button type="button" key={value} className={`${styles.choice}${days === value ? ` ${styles.choiceOn}` : ""}`} onClick={() => setDays(value)}>{value} jours{value === 8 && <small>Le format le plus courant d’une Global Week.</small>}</button>
                ))}
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.ghost} onClick={() => go("destination")}>Retour</button>
                <button type="button" className="btn-primary" onClick={afterDuration}>Voir l’estimation</button>
              </div>
            </>
          )}

          {step === "opco" && (
            <>
              <h1 className={styles.title}>Quel OPCO ?</h1>
              <p className={styles.lead}>Si tu ne le sais pas encore, on avance avec une estimation d’après nos informations.</p>
              <div className={styles.choices}>
                <button type="button" className={`${styles.choice}${opcoId === null ? ` ${styles.choiceOn}` : ""}`} onClick={() => setOpcoId(null)}>Je ne le sais pas encore</button>
                {PUBLIC_OPCOS.map((opco) => (
                  <button type="button" key={opco.id} className={`${styles.choice}${opcoId === opco.id ? ` ${styles.choiceOn}` : ""}`} onClick={() => setOpcoId(opco.id)}>{opco.label}</button>
                ))}
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.ghost} onClick={() => go("duration")}>Retour</button>
                <button type="button" className="btn-primary" onClick={() => go("result")}>Voir l’estimation</button>
              </div>
            </>
          )}

          {step === "result" && estimate && (
            <div className={styles.result}>
              <h1 className={styles.title}>{estimate.title}</h1>
              <p className={styles.lead}>{estimate.text}</p>
              <div className={styles.figures}>
                <div><span>Prix indicatif du séjour</span><b>{euro(estimate.stayEuros)}</b></div>
                <div><span>Prise en charge indicative</span><b>{estimate.fundingEuros === null ? "Aides d’alternance" : euro(estimate.fundingEuros)}</b></div>
                <div><span>Reste à charge indicatif</span><b>{euro(estimate.remainderEuros)}</b></div>
              </div>
              <p className={styles.watch}>{estimate.watchNote}</p>
              {sent ? (
                <p className={styles.success}>C’est enregistré. AMI revient vers toi pour la suite du dossier.</p>
              ) : (
                <form onSubmit={submitLead}>
                  <div className={styles.grid}>
                    <label className={styles.field}>Prénom *<input value={contact.prenom} onChange={(event) => setContact({ ...contact, prenom: event.target.value })} autoComplete="given-name" /></label>
                    <label className={styles.field}>Nom *<input value={contact.nom} onChange={(event) => setContact({ ...contact, nom: event.target.value })} autoComplete="family-name" /></label>
                  </div>
                  <div className={styles.grid}>
                    <label className={styles.field}>E-mail *<input type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} autoComplete="email" /></label>
                    <label className={styles.field}>Téléphone<input value={contact.telephone} onChange={(event) => setContact({ ...contact, telephone: event.target.value })} autoComplete="tel" /></label>
                  </div>
                  <label className={styles.field}>École ou CFA *<input value={contact.school} onChange={(event) => setContact({ ...contact, school: event.target.value })} /></label>
                  <label className={styles.field}>Employeur<input value={contact.employer} onChange={(event) => setContact({ ...contact, employer: event.target.value })} /></label>
                  <label className={styles.consent}><input type="checkbox" checked={contact.consent} onChange={(event) => setContact({ ...contact, consent: event.target.checked })} /><span>{globalWeeksConsentText} <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>.</span></label>
                  <label className={styles.honeypot} aria-hidden="true">Entreprise<input tabIndex={-1} autoComplete="off" value={contact.company} onChange={(event) => setContact({ ...contact, company: event.target.value })} /></label>
                  {error && <p className={styles.error} role="alert">{error}</p>}
                  <div className={styles.actions}>
                    <button type="button" className={styles.ghost} onClick={() => go(mode === "individuel" && status === "etudiant" ? "duration" : "opco")}>Retour</button>
                    <button type="submit" className="btn-primary" disabled={sending}>{sending ? "Envoi…" : "Enregistrer mon estimation"}</button>
                  </div>
                </form>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
