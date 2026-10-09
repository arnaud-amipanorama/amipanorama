"use client";

import { DEFAULT_UNKNOWN_DURATION_DAYS, DURATION_CHOICES, MAX_DURATION_DAYS } from "@/lib/simulator/guided-config";
import { Callout, ChoiceButton, NumberStepper } from "./guided-ui";
import styles from "./guided.module.css";
import type { GuidedStepProps } from "./step-props";

export default function GuidedDurationStep({ answers, update }: GuidedStepProps) {
  const orMore = DURATION_CHOICES.find((choice) => choice.orMore);
  const isOrMore = !answers.durationUnknown && orMore !== undefined && answers.durationDays !== null && answers.durationDays >= orMore.days;
  return (
    <>
      <div className={`${styles.choices} ${styles.choicesCompact}`} role="group" aria-label="Durée du séjour">
        {DURATION_CHOICES.map((choice) => (
          <ChoiceButton
            key={choice.days}
            selected={choice.orMore ? isOrMore : !answers.durationUnknown && answers.durationDays === choice.days}
            onSelect={() => update({ durationDays: choice.days, durationUnknown: false })}
          >
            {choice.label}
          </ChoiceButton>
        ))}
        <ChoiceButton selected={answers.durationUnknown} onSelect={() => update({ durationUnknown: true, durationDays: null })}>Je ne sais pas encore</ChoiceButton>
      </div>

      {isOrMore && orMore && (
        <div style={{ marginTop: 22 }}>
          <NumberStepper label="Nombre exact de jours" value={answers.durationDays ?? orMore.days} min={orMore.days} max={MAX_DURATION_DAYS} onChange={(days) => update({ durationDays: days })} unit="jours" />
        </div>
      )}

      {answers.durationUnknown && (
        <Callout tone="warn">
          <p><strong>Hypothèse utilisée : {DEFAULT_UNKNOWN_DURATION_DAYS} jours.</strong> C’est notre format de séjour le plus courant. Cette hypothèse sera rappelée dans le résultat et vous pourrez la modifier à tout moment.</p>
        </Callout>
      )}

      <p className={styles.note}>Certaines prises en charge dépendent du nombre de jours calendaires.</p>
    </>
  );
}
