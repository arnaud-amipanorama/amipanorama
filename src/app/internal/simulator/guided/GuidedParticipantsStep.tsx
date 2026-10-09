"use client";

import { MAX_PARTICIPANTS, MIN_INDEPENDENT_GROUP } from "@/lib/simulator/guided-config";
import { isSmallGroup } from "@/lib/simulator/guided";
import { Callout, NumberStepper } from "./guided-ui";
import styles from "./guided.module.css";
import type { GuidedStepProps } from "./step-props";

export default function GuidedParticipantsStep({ answers, update }: GuidedStepProps) {
  return (
    <>
      <NumberStepper big hideLabel label="Nombre de participants" value={answers.participants} min={1} max={MAX_PARTICIPANTS} onChange={(participants) => update({ participants })} />
      <p className={styles.note}>Une estimation suffit à ce stade.</p>

      {isSmallGroup(answers.participants) && (
        <Callout tone="warn">
          <p>Les séjours indépendants AMI Panorama sont généralement organisés à partir de {MIN_INDEPENDENT_GROUP} participants. Pour un groupe plus petit, un rattachement à un voyage organisé avec une autre école peut être envisagé. Cette possibilité doit être validée en amont avec l’équipe AMI Panorama.</p>
          <p style={{ marginTop: 8 }}>Vous pouvez tout de même continuer votre simulation.</p>
        </Callout>
      )}
    </>
  );
}
