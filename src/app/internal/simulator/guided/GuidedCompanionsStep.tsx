"use client";

import { COST_DEFAULTS } from "@/lib/simulator/opco-config";
import { effectiveCompanions, recommendedCompanions } from "@/lib/simulator/guided";
import { Callout, NumberStepper, eur, plural } from "./guided-ui";
import styles from "./guided.module.css";
import type { GuidedStepProps } from "./step-props";

export default function GuidedCompanionsStep({ answers, update }: GuidedStepProps) {
  const recommended = recommendedCompanions(answers.participants);
  const companions = effectiveCompanions(answers);
  const kept = answers.keptPerCompanionOverride ?? COST_DEFAULTS.keptPerAccompagnant;
  return (
    <>
      <NumberStepper big hideLabel label="Nombre d’accompagnateurs" value={companions} min={0} max={20} onChange={(value) => update({ companions: value })} />
      <p className={styles.note}>
        Pour {plural(answers.participants, "participant", "participants")}, nous recommandons {plural(recommended, "accompagnateur", "accompagnateurs")}.
        {companions !== recommended && <> <button type="button" className={styles.edit} onClick={() => update({ companions: null })}>Revenir à la recommandation</button></>}
      </p>
      <Callout>
        <p>Cette recommandation est indicative. Le nombre définitif dépend de l’âge des participants, du projet pédagogique et des règles de votre établissement.</p>
      </Callout>
      <p className={styles.note}>
        {companions > 0
          ? `La simulation réserve jusqu’à ${eur(kept)} par accompagnateur pour préparer, coordonner et suivre le séjour, dans la limite du budget versé à l’établissement pour cela.`
          : "Sans accompagnateur, aucun budget d’accompagnement n’est réservé dans la simulation."}
      </p>
    </>
  );
}
