"use client";

import { COST_DEFAULTS } from "@/lib/simulator/opco-config";
import { suggestedProgramme, type ContractMode, type GuidedAnswers, type GuidedOutcome, type GuidedRefinements, type TrainingLevel } from "@/lib/simulator/guided";
import { MoneyField, NumberStepper, ToggleGroup, eur } from "./guided-ui";
import styles from "./guided.module.css";

const CONVENTION: { value: ContractMode; label: string }[] = [
  { value: "miseADisposition", label: "L’alternant reste salarié de son entreprise" },
  { value: "miseEnVeille", label: "Son contrat est suspendu pendant le séjour" },
];
const CONVENTION_HINT = "Pour un séjour court, l’alternant reste le plus souvent salarié de son entreprise française. En cas de doute, gardez ce choix.";
const LEVEL: { value: TrainingLevel; label: string }[] = [
  { value: "postBac", label: "Supérieur au bac" },
  { value: "bacOrBelow", label: "Bac ou niveau inférieur" },
];

/** Paramètres qui peuvent changer le résultat, limités aux OPCO réellement sélectionnés. */
export default function GuidedRefinePanel({ answers, outcome, update }: { answers: GuidedAnswers; outcome: GuidedOutcome; update: (patch: Partial<GuidedAnswers>) => void }) {
  const r = answers.refinements;
  const set = (patch: Partial<GuidedRefinements>) => update({ refinements: { ...r, ...patch } });
  const has = (id: string) => outcome.refinements.some((prompt) => prompt.opcoId === id);
  const countOf = (id: string) => answers.opcoRows.find((row) => row.id === id)?.count ?? 0;
  const suggested = suggestedProgramme(answers).value;

  return (
    <div className={styles.card} style={{ marginTop: 16 }}>
      <h3 className={styles.opcoTitle}>Affiner cette estimation</h3>
      <p className={styles.opcoText} style={{ marginTop: 6 }}>Modifiez uniquement ce que vous connaissez. Le résultat se met à jour immédiatement.</p>

      <MoneyField
        label="Coût du programme AMI Panorama, par participant"
        hint={`Tarif indicatif pour cette durée : ${eur(suggested)}. Remplacez-le par le montant de votre devis si vous en avez un.`}
        value={answers.programmeOverride ?? suggested}
        onChange={(value) => update({ programmeOverride: value === null || value === suggested ? null : value })}
      />

      {outcome.companions > 0 && (
        <MoneyField
          label="Budget réservé par accompagnateur"
          hint={`Valeur habituelle : ${eur(COST_DEFAULTS.keptPerAccompagnant)}. Ce budget sert à préparer, coordonner et suivre le séjour. Ce qui n’est pas réservé réduit le reste à charge des participants.`}
          value={answers.keptPerCompanionOverride ?? COST_DEFAULTS.keptPerAccompagnant}
          onChange={(value) => update({ keptPerCompanionOverride: value === null || value === COST_DEFAULTS.keptPerAccompagnant ? null : value })}
        />
      )}

      {has("atlas") && (
        <>
          <ToggleGroup legend="ATLAS : situation des participants pendant le séjour" hint={CONVENTION_HINT} value={r.atlasContractMode} onChange={(value) => set({ atlasContractMode: value })} options={CONVENTION} />
          <div className={styles.field}>
            <NumberStepper label="ATLAS : combien de contrats ont été signés avant le 1er avril 2026 ?" value={Math.min(r.atlasBeforeApril2026, countOf("atlas"))} min={0} max={countOf("atlas")} onChange={(value) => set({ atlasBeforeApril2026: value })} />
            <span className={styles.fieldHint}>Ces contrats suivent l’ancien barème, sans durée minimale. Les autres exigent un séjour d’au moins 15 jours.</span>
          </div>
        </>
      )}

      {has("akto") && (
        <>
          <ToggleGroup legend="AKTO : situation des participants pendant le séjour" hint={CONVENTION_HINT} value={r.aktoContractMode} onChange={(value) => set({ aktoContractMode: value })} options={CONVENTION} />
          <ToggleGroup legend="AKTO : niveau de la formation préparée" value={r.aktoTrainingLevel} onChange={(value) => set({ aktoTrainingLevel: value })} options={LEVEL} />
        </>
      )}

      {has("afdas") && (
        <ToggleGroup legend="AFDAS : niveau de la formation préparée" hint="Le forfait versé à l’établissement est majoré pour le niveau bac ou inférieur." value={r.afdasTrainingLevel} onChange={(value) => set({ afdasTrainingLevel: value })} options={LEVEL} />
      )}

      {has("ep") && (
        <ToggleGroup legend="OPCO EP : situation des participants pendant le séjour" hint={CONVENTION_HINT} value={r.epContractMode} onChange={(value) => set({ epContractMode: value })} options={CONVENTION} />
      )}

      {has("opco_mobilites") && (
        <div className={styles.field}>
          <NumberStepper label="OPCO Mobilités : combien de contrats ont été signés avant le 1er janvier 2026 ?" value={Math.min(r.opcoMobilitesBefore2026, countOf("opco_mobilites"))} min={0} max={countOf("opco_mobilites")} onChange={(value) => set({ opcoMobilitesBefore2026: value })} />
          <span className={styles.fieldHint}>Ces contrats suivent l’ancien barème.</span>
        </div>
      )}
    </div>
  );
}
