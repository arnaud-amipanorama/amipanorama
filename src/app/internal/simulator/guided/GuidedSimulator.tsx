"use client";

import { useMemo, useState } from "react";
import { GUIDED_STEPS, buildGuidedOutcome, firstInvalidStep, validateStep, type GuidedAnswers, type GuidedStepId } from "@/lib/simulator/guided";
import type { GuidedContact } from "./contact";
import GuidedCompanionsStep from "./GuidedCompanionsStep";
import GuidedDestinationStep from "./GuidedDestinationStep";
import GuidedDurationStep from "./GuidedDurationStep";
import GuidedOpcoStep from "./GuidedOpcoStep";
import GuidedParticipantsStep from "./GuidedParticipantsStep";
import GuidedResults from "./GuidedResults";
import GuidedReviewStep from "./GuidedReviewStep";
import GuidedSimulatorIntro from "./GuidedSimulatorIntro";
import GuidedSimulatorStep from "./GuidedSimulatorStep";
import GuidedTransportStep from "./GuidedTransportStep";
import type { GuidedScreen } from "./guided-storage";
import styles from "./guided.module.css";

const STEP_COPY: Record<GuidedStepId, { title: string; help?: string }> = {
  destination: { title: "Avez-vous déjà choisi votre destination ?" },
  duration: { title: "Combien de temps souhaitez-vous partir ?" },
  participants: { title: "Combien de participants partiront en voyage ?" },
  opco: { title: "Connaissez-vous les OPCO des participants ?", help: "L’OPCO est l’organisme qui peut financer une partie de la mobilité d’un alternant. Si vous ne les connaissez pas encore, ce n’est pas bloquant." },
  companions: { title: "Combien d’accompagnateurs participeront au voyage ?" },
  transport: { title: "Avez-vous déjà un devis pour le transport aller-retour ?" },
  review: { title: "Vérifiez vos réponses", help: "Un dernier coup d’œil avant le calcul. Chaque ligne peut être modifiée." },
};

type Props = {
  answers: GuidedAnswers;
  screen: GuidedScreen;
  onAnswers: (answers: GuidedAnswers) => void;
  onScreen: (screen: GuidedScreen) => void;
  onReset: () => void;
  contact: GuidedContact;
  onContact: (contact: GuidedContact) => void;
  onAdvanced: () => void;
};

export default function GuidedSimulator({ answers, screen, onAnswers, onScreen, onReset, contact, onContact, onAdvanced }: Props) {
  // Erreur affichée seulement après une tentative de continuer, pour ne pas gronder avant la réponse.
  const [attempted, setAttempted] = useState<GuidedStepId | null>(null);
  // Étape ouverte depuis le récapitulatif ou le résultat : « Continuer » y ramène directement.
  const [returnTo, setReturnTo] = useState<"review" | "results" | null>(null);

  const update = (patch: Partial<GuidedAnswers>) => onAnswers({ ...answers, ...patch });
  const outcome = useMemo(() => buildGuidedOutcome(answers), [answers]);

  // Un résultat ne s'affiche jamais sur des réponses incomplètes (ex. état restauré après rechargement).
  const blocking = firstInvalidStep(answers);
  const current: GuidedScreen = screen === "results" && blocking ? blocking : screen;

  const go = (next: GuidedScreen) => { setAttempted(null); onScreen(next); };
  const restart = () => { setReturnTo(null); setAttempted(null); onReset(); };
  const edit = (step: GuidedStepId, from: "review" | "results") => { setReturnTo(from); go(step); };

  const wide = current === "results";
  let content: React.ReactNode;

  if (current === "intro") {
    const started = answers.destinationKnown !== null;
    content = <GuidedSimulatorIntro canResume={started} onStart={() => { if (started) onReset(); go("destination"); }} onResume={() => go(blocking ?? "review")} />;
  } else if (current === "results") {
    content = (
      <GuidedResults
        answers={answers}
        outcome={outcome}
        update={update}
        contact={contact}
        onContact={onContact}
        onEdit={(step) => edit(step, "results")}
        onReview={() => go("review")}
        onRestart={restart}
        onAdvanced={onAdvanced}
      />
    );
  } else {
    const step = current;
    const index = GUIDED_STEPS.indexOf(step);
    const error = validateStep(step, answers);
    const onContinue = () => {
      if (error) { setAttempted(step); return; }
      if (step === "review") { setReturnTo(null); go("results"); return; }
      if (returnTo) {
        const target = returnTo;
        setReturnTo(null);
        // Une modification peut invalider une autre étape (ex. moins de participants que d'OPCO renseignés).
        go(firstInvalidStep(answers) ?? target);
        return;
      }
      go(GUIDED_STEPS[index + 1]);
    };
    const onBack = () => {
      if (returnTo && !error) { const target = returnTo; setReturnTo(null); go(target); return; }
      setReturnTo(null);
      go(index === 0 ? "intro" : GUIDED_STEPS[index - 1]);
    };
    content = (
      <GuidedSimulatorStep
        index={index + 1}
        total={GUIDED_STEPS.length}
        title={STEP_COPY[step].title}
        help={STEP_COPY[step].help}
        error={attempted === step ? error : null}
        onBack={onBack}
        onContinue={onContinue}
        continueLabel={step === "review" ? "Voir mon estimation" : returnTo ? "Valider" : "Continuer"}
      >
        {step === "destination" && <GuidedDestinationStep answers={answers} update={update} />}
        {step === "duration" && <GuidedDurationStep answers={answers} update={update} />}
        {step === "participants" && <GuidedParticipantsStep answers={answers} update={update} />}
        {step === "opco" && <GuidedOpcoStep answers={answers} update={update} />}
        {step === "companions" && <GuidedCompanionsStep answers={answers} update={update} />}
        {step === "transport" && <GuidedTransportStep answers={answers} update={update} />}
        {step === "review" && <GuidedReviewStep answers={answers} outcome={outcome} onEdit={(target) => edit(target, "review")} />}
      </GuidedSimulatorStep>
    );
  }

  return (
    <div className={styles.root}>
      <div aria-hidden="true" className={styles.glow} />
      <div className={`${styles.shell} ${wide ? styles.shellWide : ""}`}>
        {current !== "intro" && (
          <header className={styles.topbar}>
            <span className={styles.brandTag}>AMI Panorama · Simulation guidée</span>
            <div>
              {current !== "results" && <button type="button" className={styles.textLink} onClick={restart}>Effacer et recommencer</button>}
            </div>
          </header>
        )}
        <main key={current}>{content}</main>
        {current !== "results" && (
          <p style={{ textAlign: "center", marginTop: 40 }}>
            <button type="button" className={styles.textLink} onClick={onAdvanced}>Vous connaissez déjà vos paramètres ? Passer à la simulation avancée</button>
          </p>
        )}
      </div>
    </div>
  );
}
