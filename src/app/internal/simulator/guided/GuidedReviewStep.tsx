"use client";

import { OPCO_BY_ID } from "@/lib/simulator/opco-config";
import type { GuidedOutcome, GuidedStepId } from "@/lib/simulator/guided";
import type { GuidedAnswers } from "@/lib/simulator/guided";
import { eur, plural } from "./guided-ui";
import styles from "./guided.module.css";

type Row = { key: string; value: React.ReactNode; sub?: string; edit: GuidedStepId };

export default function GuidedReviewStep({ answers, outcome, onEdit }: { answers: GuidedAnswers; outcome: GuidedOutcome; onEdit: (step: GuidedStepId) => void }) {
  const knownRows = answers.opcoKnowledge === "none" ? [] : answers.opcoRows.filter((row) => row.count > 0);
  const special = outcome.assumptions.filter((assumption) => assumption.toConfirm && !["transport", "programme", "duration", "destination", "unknownOpco"].includes(assumption.id));

  const rows: Row[] = [
    {
      key: outcome.destination.known ? "Destination" : "Zone envisagée",
      value: outcome.destination.label,
      sub: outcome.destination.known ? undefined : "Destination non choisie : les prix utilisés sont provisoires. Le résultat sera un ordre de grandeur, pas un prix.",
      edit: "destination",
    },
    { key: "Durée", value: `${outcome.days} jours`, sub: outcome.durationAssumed ? "Durée supposée, car vous ne la connaissez pas encore." : `Soit ${plural(outcome.nights, "nuit", "nuits")} sur place.`, edit: "duration" },
    { key: "Participants", value: plural(outcome.participants, "participant", "participants"), sub: outcome.smallGroup ? "Groupe de moins de 20 participants : à valider avec l’équipe AMI Panorama." : undefined, edit: "participants" },
    {
      key: "OPCO connus",
      value: knownRows.length ? knownRows.map((row) => `${OPCO_BY_ID[row.id]?.label ?? row.id} : ${row.count}`).join(" · ") : "Aucun pour le moment",
      edit: "opco",
    },
    {
      key: "Participants dont l’OPCO reste inconnu",
      value: plural(outcome.unknownParticipants, "participant", "participants"),
      sub: outcome.unknownParticipants > 0 ? "Une estimation indicative basée sur les barèmes OPCO disponibles leur sera appliquée, signalée comme hypothèse." : undefined,
      edit: "opco",
    },
    { key: "Accompagnateurs", value: plural(outcome.companions, "accompagnateur", "accompagnateurs"), sub: outcome.companions === outcome.recommendedCompanions ? "Nombre recommandé, à titre indicatif." : `Recommandation indicative : ${outcome.recommendedCompanions}.`, edit: "companions" },
    {
      key: "Transport aller-retour",
      value: `${eur(outcome.transport.value)} par participant`,
      sub: outcome.transport.source === "quote" ? "D’après votre devis." : "Estimation : tarif moyen, à remplacer par un devis.",
      edit: "transport",
    },
  ];

  return (
    <>
      <ul className={styles.review}>
        {rows.map((row) => (
          <li key={row.key} className={styles.reviewRow}>
            <div>
              <div className={styles.reviewKey}>{row.key}</div>
              <div className={styles.reviewVal}>{row.value}</div>
              {row.sub && <div className={styles.reviewSub}>{row.sub}</div>}
            </div>
            <button type="button" className={styles.edit} onClick={() => onEdit(row.edit)} aria-label={`Modifier : ${row.key}`}>Modifier</button>
          </li>
        ))}
        <li className={styles.reviewRow}>
          <div>
            <div className={styles.reviewKey}>Coût du programme AMI Panorama utilisé</div>
            <div className={styles.reviewVal}>{eur(outcome.programme.value)} par participant</div>
            <div className={styles.reviewSub}>{outcome.programme.source === "zoneMean" ? "Montant provisoire : moyenne de la zone envisagée, faute de destination." : "Tarif indicatif pour cette destination et cette durée."} Vous pourrez l’ajuster depuis le résultat.</div>
          </div>
          <span />
        </li>
        {special.length > 0 && (
          <li className={styles.reviewRow}>
            <div>
              <div className={styles.reviewKey}>Hypothèses particulières appliquées</div>
              {special.map((assumption) => (
                <div key={assumption.id} className={styles.reviewSub} style={{ color: "var(--muted)", fontSize: 14 }}><strong>{assumption.label} :</strong> {assumption.value}</div>
              ))}
              <div className={styles.reviewSub}>Vous pourrez affiner ces points depuis le résultat.</div>
            </div>
            <span />
          </li>
        )}
      </ul>
      <p className={styles.note}>Le résultat est une estimation indicative et non contractuelle. Aucun financement n’est garanti tant que l’OPCO ne l’a pas validé.</p>
    </>
  );
}
