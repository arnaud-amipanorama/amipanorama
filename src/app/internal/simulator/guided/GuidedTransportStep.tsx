"use client";

import { averageTransport, effectiveCompanions, resolveDestination, resolveTransport } from "@/lib/simulator/guided";
import { Callout, ChoiceButton, MoneyField, NumberStepper, eur } from "./guided-ui";
import styles from "./guided.module.css";
import type { GuidedStepProps } from "./step-props";

export default function GuidedTransportStep({ answers, update }: GuidedStepProps) {
  const destination = resolveDestination(answers);
  const average = averageTransport(answers).value;
  const used = resolveTransport(answers).value;
  const tickets = answers.transportTotalTickets ?? answers.participants + effectiveCompanions(answers);
  const total = answers.transportQuoteMode === "total";

  return (
    <>
      <div className={styles.choices} role="group" aria-label="Avez-vous déjà un devis pour le transport aller-retour ?">
        <ChoiceButton selected={answers.transportQuote === "yes"} onSelect={() => update({ transportQuote: "yes" })}>Oui</ChoiceButton>
        <ChoiceButton selected={answers.transportQuote === "no"} onSelect={() => update({ transportQuote: "no" })}>Non</ChoiceButton>
      </div>

      {answers.transportQuote === "yes" && !total && (
        <>
          <MoneyField
            label="Prix aller-retour par participant"
            hint="Saisissez le montant pour une seule personne, et non le montant total du groupe."
            value={answers.transportPerPerson}
            onChange={(value) => update({ transportPerPerson: value })}
          />
          <p className={styles.note}>
            <button type="button" className={styles.edit} onClick={() => update({ transportQuoteMode: "total" })}>Je n’ai qu’un devis global pour tout le groupe</button>
          </p>
        </>
      )}

      {answers.transportQuote === "yes" && total && (
        <>
          <MoneyField label="Montant total du devis" hint="Le montant aller-retour pour l’ensemble du groupe." value={answers.transportTotal} onChange={(value) => update({ transportTotal: value })} />
          <div className={styles.field}>
            <NumberStepper label="Nombre de billets compris dans ce devis" value={tickets} min={1} max={500} onChange={(value) => update({ transportTotalTickets: value })} />
            <span className={styles.fieldHint}>Par défaut : les participants et les accompagnateurs.</span>
          </div>
          {answers.transportTotal !== null && answers.transportTotal > 0 && (
            <Callout>
              <p>Cela représente <strong>{eur(used)} aller-retour par participant</strong> ({eur(answers.transportTotal)} ÷ {tickets} billets).</p>
            </Callout>
          )}
          <p className={styles.note}>
            <button type="button" className={styles.edit} onClick={() => update({ transportQuoteMode: "perPerson" })}>Saisir plutôt un prix par participant</button>
          </p>
        </>
      )}

      {answers.transportQuote === "no" && (
        <>
          <Callout>
            <p>Nous utilisons un tarif moyen aller-retour de <strong>{eur(used)} par participant</strong>. Vous pourrez le remplacer dès que vous aurez reçu un devis.</p>
            {!destination.known && <p style={{ marginTop: 8 }}>Comme la destination n’est pas encore choisie, ce tarif est la moyenne de nos destinations dans la zone envisagée.</p>}
          </Callout>
          <MoneyField
            label="Tarif moyen aller-retour utilisé, par participant"
            hint={answers.transportAverageOverride !== null && answers.transportAverageOverride !== average ? `Tarif moyen AMI Panorama : ${eur(average)}.` : "Vous pouvez ajuster ce montant si vous avez déjà une idée du prix."}
            value={answers.transportAverageOverride ?? average}
            onChange={(value) => update({ transportAverageOverride: value === null || value === average ? null : value })}
          />
        </>
      )}
    </>
  );
}
