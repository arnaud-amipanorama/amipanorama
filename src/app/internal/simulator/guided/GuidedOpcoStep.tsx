"use client";

import { useId, useState } from "react";
import { OPCOS, OPCO_BY_ID, OPCO_SECTORS } from "@/lib/simulator/opco-config";
import { knownOpcoCount, opcoOverflow, unknownOpcoCount } from "@/lib/simulator/guided";
import { Callout, ChoiceButton, NumberStepper, cx, plural } from "./guided-ui";
import styles from "./guided.module.css";
import type { GuidedStepProps } from "./step-props";

export default function GuidedOpcoStep({ answers, update }: GuidedStepProps) {
  const selectId = useId();
  const rows = answers.opcoRows;
  const available = OPCOS.filter((opco) => !rows.some((row) => row.id === opco.id));
  const [pending, setPending] = useState("");
  const candidate = available.some((opco) => opco.id === pending) ? pending : available[0]?.id ?? "";

  const known = knownOpcoCount(answers);
  const over = opcoOverflow(answers);
  const unknown = unknownOpcoCount(answers);
  const listing = answers.opcoKnowledge === "all" || answers.opcoKnowledge === "partial";

  const setCount = (id: string, count: number) => update({ opcoRows: rows.map((row) => (row.id === id ? { ...row, count } : row)) });
  const remove = (id: string) => update({ opcoRows: rows.filter((row) => row.id !== id) });
  const add = () => {
    if (!candidate) return;
    // Premier OPCO : on propose tout le groupe. Ensuite : ce qu'il reste à répartir.
    update({ opcoRows: [...rows, { id: candidate, count: Math.max(1, answers.participants - known) }] });
    setPending("");
  };

  return (
    <>
      <div className={styles.choices} role="group" aria-label="Connaissez-vous les OPCO des participants ?">
        <ChoiceButton selected={answers.opcoKnowledge === "all"} onSelect={() => update({ opcoKnowledge: "all" })}>Oui, je les connais</ChoiceButton>
        <ChoiceButton selected={answers.opcoKnowledge === "partial"} onSelect={() => update({ opcoKnowledge: "partial" })}>J’en connais seulement une partie</ChoiceButton>
        <ChoiceButton selected={answers.opcoKnowledge === "none"} onSelect={() => update({ opcoKnowledge: "none" })}>Non, pas encore</ChoiceButton>
      </div>

      {listing && (
        <>
          <h2 className={styles.subTitle}>Combien de participants par OPCO ?</h2>

          {rows.map((row) => {
            const config = OPCO_BY_ID[row.id];
            if (!config) return null;
            return (
              <div key={row.id} className={styles.opcoRow}>
                <div>
                  <div className={styles.opcoName}>{config.label}</div>
                  {OPCO_SECTORS[row.id] && <div className={styles.opcoSector}>{OPCO_SECTORS[row.id]}</div>}
                </div>
                <NumberStepper hideLabel label={`Nombre de participants, ${config.label}`} value={row.count} min={0} max={999} onChange={(count) => setCount(row.id, count)} />
                <button type="button" className={styles.removeBtn} onClick={() => remove(row.id)} aria-label={`Retirer ${config.label}`}>Retirer</button>
              </div>
            );
          })}

          {available.length > 0 && (
            <div className={styles.field}>
              <label htmlFor={selectId} className={styles.label}>{rows.length ? "Ajouter un autre OPCO" : "Choisir un OPCO"}</label>
              <select id={selectId} className={styles.select} value={candidate} onChange={(event) => setPending(event.target.value)}>
                {available.map((opco) => (
                  <option key={opco.id} value={opco.id}>{opco.label}{OPCO_SECTORS[opco.id] ? `, ${OPCO_SECTORS[opco.id].replace(/\.$/, "")}` : ""}</option>
                ))}
              </select>
              <div>
                <button type="button" className={styles.ghost} onClick={add}>+ {rows.length ? "Ajouter cet OPCO" : "Ajouter"}</button>
              </div>
            </div>
          )}

          <p className={cx(styles.counter, over > 0 && styles.counterOver)} role="status" aria-live="polite">
            {over > 0 ? "⚠ " : ""}{known} {known > 1 ? "participants renseignés" : "participant renseigné"} sur {answers.participants}
            {over > 0 && ` : ${over} de trop`}
          </p>

          {over === 0 && unknown > 0 && rows.length > 0 && (
            <Callout>
              <p>Il reste {plural(unknown, "participant", "participants")} sans OPCO. Ce n’est pas bloquant : nous les classons dans « OPCO encore inconnu » et utilisons pour eux une estimation indicative basée sur les barèmes OPCO disponibles, clairement signalée dans le résultat.</p>
            </Callout>
          )}
        </>
      )}

      {answers.opcoKnowledge === "none" && (
        <Callout tone="warn">
          <p>Nous utiliserons une estimation indicative basée sur les barèmes OPCO disponibles. Le résultat sera moins précis qu’avec la répartition exacte des OPCO, mais il vous donnera un premier ordre de grandeur.</p>
          <p style={{ marginTop: 8 }}>Cette estimation ne provient pas de départs réels et n’est pas une prise en charge garantie. Elle sera indiquée comme hypothèse dans votre résultat.</p>
        </Callout>
      )}
    </>
  );
}
