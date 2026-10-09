"use client";

import Image from "next/image";
import { DESTINATION_NAMES, DESTINATION_TARIFFS } from "@/lib/simulator/opco-config";
import { DESTINATION_PHOTOS, GUIDED_ZONES, type GuidedZoneId } from "@/lib/simulator/guided-config";
import { Callout, ChoiceButton, cx } from "./guided-ui";
import styles from "./guided.module.css";
import type { GuidedStepProps } from "./step-props";

const ZONE_HINTS: Record<GuidedZoneId, string> = {
  europe: GUIDED_ZONES.europe.destinations.join(", "),
  northAmerica: GUIDED_ZONES.northAmerica.destinations.join(", "),
  international: GUIDED_ZONES.international.destinations.join(", "),
  advice: "AMI Panorama vous recommandera une destination adaptée à votre projet.",
};

export default function GuidedDestinationStep({ answers, update }: GuidedStepProps) {
  return (
    <>
      <div className={styles.choices} role="group" aria-label="Avez-vous déjà choisi votre destination ?">
        <ChoiceButton selected={answers.destinationKnown === "yes"} onSelect={() => update({ destinationKnown: "yes" })}>Oui</ChoiceButton>
        <ChoiceButton selected={answers.destinationKnown === "no"} onSelect={() => update({ destinationKnown: "no" })}>Pas encore</ChoiceButton>
      </div>

      {answers.destinationKnown === "yes" && (
        <>
          <h2 className={styles.subTitle} id="guided-destinations">Quelle destination ?</h2>
          <div className={styles.destGrid} role="group" aria-labelledby="guided-destinations">
            {DESTINATION_NAMES.map((name) => {
              const selected = answers.destination === name;
              const photo = DESTINATION_PHOTOS[name];
              return (
                <button key={name} type="button" aria-pressed={selected} onClick={() => update({ destination: name })} className={cx(styles.destCard, selected && styles.destCardOn)}>
                  {photo && <Image src={photo} alt="" fill sizes="(max-width: 520px) 50vw, 190px" className={styles.destPhoto} />}
                  <span aria-hidden="true" className={styles.destShade} />
                  {selected && <span className={styles.destCheck}>✓ Choisie</span>}
                  <span className={styles.destName}>{name}</span>
                </button>
              );
            })}
          </div>
          {answers.destination && DESTINATION_TARIFFS[answers.destination] && (
            <p className={styles.note}>Destination retenue : {answers.destination}.</p>
          )}
        </>
      )}

      {answers.destinationKnown === "no" && (
        <>
          <h2 className={styles.subTitle} id="guided-zones">Quelle zone vous intéresse ?</h2>
          <div className={styles.choices} role="group" aria-labelledby="guided-zones">
            {(Object.keys(GUIDED_ZONES) as GuidedZoneId[]).map((id) => (
              <ChoiceButton key={id} selected={answers.zone === id} onSelect={() => update({ zone: id })} hint={ZONE_HINTS[id]}>{GUIDED_ZONES[id].label}</ChoiceButton>
            ))}
          </div>
          <Callout>
            <p><strong>Vous obtiendrez une estimation provisoire, pas un prix.</strong> Sans destination précise, nous utilisons provisoirement la moyenne de nos destinations dans la zone choisie. Le résultat changera dès que la destination sera connue. AMI Panorama pourra vous en recommander une et établir un prix.</p>
          </Callout>
        </>
      )}
    </>
  );
}
