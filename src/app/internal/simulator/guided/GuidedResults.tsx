"use client";

import { useEffect, useRef, useState } from "react";
import type { GuidedAnswers, GuidedOutcome, GuidedStepId } from "@/lib/simulator/guided";
import type { GuidedContact } from "./contact";
import GuidedRefinePanel from "./GuidedRefinePanel";
import GuidedVerifyForm from "./GuidedVerifyForm";
import { Callout, cx, eur, plural } from "./guided-ui";
import styles from "./guided.module.css";

type Props = {
  answers: GuidedAnswers;
  outcome: GuidedOutcome;
  update: (patch: Partial<GuidedAnswers>) => void;
  contact: GuidedContact;
  onContact: (contact: GuidedContact) => void;
  onEdit: (step: GuidedStepId) => void;
  onReview: () => void;
  onRestart: () => void;
  onAdvanced: () => void;
};

const CONFIDENCE_COLOR = { high: "var(--ok)", medium: "var(--warn)", low: "var(--danger)" } as const;

export default function GuidedResults({ answers, outcome, update, contact, onContact, onEdit, onReview, onRestart, onAdvanced }: Props) {
  const { result } = outcome;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const refineRef = useRef<HTMLDivElement>(null);
  const [refineOpen, setRefineOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  const openRefine = () => {
    setRefineOpen(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => refineRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 60);
  };

  return (
    <div className={styles.screen}>
      {/* 1. Résultat principal */}
      <section className={styles.hero} aria-labelledby="guided-result-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Assets/Brand/ami-logo-white.png" alt="AMI Panorama" className={styles.heroLogo} />
        <h1 id="guided-result-title" ref={titleRef} tabIndex={-1} className={cx(styles.heroLabel, styles.title)} style={{ fontSize: 13, letterSpacing: "0.1em", marginBottom: 0 }}>Reste à payer estimé par participant</h1>
        <p className={styles.heroValue}>{eur(result.racAvg)}</p>
        <p className={styles.heroSub}>Après les financements estimés et la répartition prévue pour l’accompagnement.</p>
        <p style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "18px 0 0" }}>
          <span className={cx(styles.badge, outcome.confidence.level === "high" && styles.badgeInfo)}>{outcome.confidence.label}</span>
          {outcome.provisionalNote && <span className={styles.badge}>⚠ Estimation provisoire · destination à choisir</span>}
          <span className={cx(styles.badge, styles.badgeInfo)}>Estimation non contractuelle</span>
        </p>
      </section>

      {outcome.provisionalNote && (
        <Callout tone="warn">
          <p><strong>Estimation provisoire.</strong> {outcome.provisionalNote}</p>
          <p style={{ marginTop: 10 }}><button type="button" className={styles.ghost} onClick={() => onEdit("destination")}>Choisir une destination</button></p>
        </Callout>
      )}

      {/* 2. Résumé du voyage */}
      <section className={styles.section} aria-labelledby="guided-trip">
        <h2 id="guided-trip" className={styles.sectionTitle}>Votre voyage</h2>
        <dl className={styles.facts} style={{ marginTop: 16 }}>
          <div className={styles.fact}><dt>{outcome.destination.known ? "Destination" : "Zone envisagée"}</dt><dd>{outcome.destination.label}{!outcome.destination.known && <span className={styles.factSub}>destination non choisie · hypothèse provisoire</span>}</dd></div>
          <div className={styles.fact}><dt>Durée</dt><dd>{outcome.days} jours{outcome.durationAssumed && <span className={styles.factSub}>durée supposée</span>}</dd></div>
          <div className={styles.fact}><dt>Participants</dt><dd>{outcome.participants}</dd></div>
          <div className={styles.fact}><dt>Accompagnateurs</dt><dd>{outcome.companions}</dd></div>
          <div className={styles.fact}><dt>Coût estimé du séjour par participant</dt><dd>{eur(result.totalCostPerStudent)}<span className={styles.factSub}>programme {eur(outcome.programme.value)} + transport {eur(outcome.transport.value)}{outcome.provisionalNote ? " · montants provisoires" : ""}</span></dd></div>
          <div className={styles.fact}><dt>Coût total du projet</dt><dd>{eur(result.totalCostAll)}<span className={styles.factSub}>pour {plural(outcome.participants, "participant", "participants")}</span></dd></div>
        </dl>
        {outcome.smallGroup && (
          <Callout tone="warn"><p>Votre groupe compte moins de 20 participants. Un séjour indépendant doit alors être validé avec l’équipe AMI Panorama, qui peut aussi proposer un rattachement à un autre groupe.</p></Callout>
        )}
      </section>

      {/* 3. Répartition financière */}
      <section className={styles.section} aria-labelledby="guided-money">
        <h2 id="guided-money" className={styles.sectionTitle}>Comment le projet est financé</h2>
        <p className={styles.sectionLead}>On part du coût du projet, on retire les financements estimés, puis la part du budget versé à l’établissement qui n’est pas réservée à l’accompagnement. Ce qui reste est à payer par les participants.</p>
        <ol className={styles.flow}>
          <li className={styles.flowStep}><span className={styles.flowSign}>Départ</span><p className={styles.flowLabel}>Coût du projet</p><span className={styles.flowValue}>{eur(result.totalCostAll)}</span></li>
          <li className={styles.flowStep}><span className={styles.flowSign}>Moins</span><p className={styles.flowLabel}>Financements OPCO estimés pour les participants</p><span className={styles.flowValue}>{eur(result.apprentiTotal)}</span></li>
          <li className={styles.flowStep}><span className={styles.flowSign}>Moins</span><p className={styles.flowLabel}>Budget référent non réservé à l’accompagnement</p><span className={styles.flowValue}>{eur(result.reinjected)}</span></li>
          <li className={cx(styles.flowStep, styles.flowFinal)}><span className={styles.flowSign}>Égal</span><p className={styles.flowLabel}>Reste à payer par les participants</p><span className={styles.flowValue}>{eur(result.racFinalTotal)}</span></li>
        </ol>
        <dl className={cx(styles.card, styles.lines)}>
          <div className={styles.line} style={{ borderTop: 0, paddingTop: 0 }}><dt>Coût brut total</dt><dd>{eur(result.totalCostAll)}</dd></div>
          <div className={styles.line}><dt>Financements OPCO estimés pour les participants</dt><dd>{eur(result.apprentiTotal)}</dd></div>
          <div className={styles.line}><dt>Budget référent mobilité total<span className={styles.factSub}>versé à l’établissement pour organiser et suivre la mobilité</span></dt><dd>{eur(result.referentTotal)}</dd></div>
          <div className={styles.line}><dt>dont réservé à l’accompagnement et à la coordination</dt><dd>{eur(result.keptTotal)}</dd></div>
          <div className={styles.line}><dt>dont utilisé pour réduire le reste à charge</dt><dd>{eur(result.reinjected)}</dd></div>
          {result.unusedReferent > 0 && <div className={styles.line}><dt>dont non utilisé dans cette simulation<span className={styles.factSub}>le reste à charge est déjà à zéro</span></dt><dd>{eur(result.unusedReferent)}</dd></div>}
          <div className={styles.line}><dt>Reste à charge total</dt><dd>{eur(result.racFinalTotal)}</dd></div>
          <div className={cx(styles.line, styles.lineStrong)} style={{ paddingBottom: 0 }}><dt>Reste à charge moyen par participant</dt><dd>{eur(result.racAvg)}</dd></div>
        </dl>
      </section>

      {/* 4. Budget accompagnateurs */}
      <section className={styles.section} aria-labelledby="guided-companions">
        <h2 id="guided-companions" className={styles.sectionTitle}>Budget prévu pour l’accompagnement</h2>
        <div className={styles.card} style={{ marginTop: 16 }}>
          <dl className={styles.facts}>
            <div className={styles.fact}><dt>Accompagnateurs</dt><dd>{outcome.companions}</dd></div>
            <div className={styles.fact}><dt>Budget total réservé</dt><dd>{eur(outcome.companionBudget)}</dd></div>
            <div className={styles.fact}><dt>Budget indicatif par accompagnateur</dt><dd>{outcome.companions > 0 ? eur(outcome.companionBudgetPerCompanion) : "Sans objet"}</dd></div>
          </dl>
          <p className={styles.opcoText}>Ce budget peut couvrir la préparation du séjour, la coordination, le suivi des participants et les dépenses liées au projet. Il provient du forfait « référent mobilité » que les OPCO versent à l’établissement.</p>
          <p className={styles.opcoText}><strong>Ce forfait n’est pas une marge libre.</strong> Son utilisation doit respecter les conditions de chaque OPCO, et les justificatifs doivent être conservés.</p>
          {outcome.companionBudgetLimited && outcome.companions > 0 && (
            <Callout tone="warn"><p>Le budget souhaité ({eur(outcome.keptPerCompanion)} par accompagnateur) dépasse le budget référent estimé. La simulation réserve donc la totalité de ce budget, soit {eur(outcome.companionBudget)}.</p></Callout>
          )}
          {outcome.companions === 0 && <p className={styles.opcoText}>Sans accompagnateur, tout le budget référent estimé sert à réduire le reste à charge des participants.</p>}
        </div>
      </section>

      {/* 5. Détail par OPCO */}
      <section className={styles.section} aria-labelledby="guided-opco">
        <h2 id="guided-opco" className={styles.sectionTitle}>Le détail, OPCO par OPCO</h2>
        <p className={styles.sectionLead}>L’OPCO est l’organisme qui peut financer une partie de la mobilité d’un alternant. Chaque OPCO a ses propres règles.</p>
        <div className={styles.cards}>
          {outcome.opcoCards.map((card) => (
            <article key={card.id} className={styles.card}>
              <div className={styles.opcoHead}>
                <div>
                  <h3 className={styles.opcoTitle}>{card.label}</h3>
                  <p className={styles.opcoCount}>{plural(card.count, "participant", "participants")}{card.sector ? ` · ${card.sector}` : ""}</p>
                </div>
                {card.toConfirm && <span className={styles.badge}>⚠ À confirmer</span>}
              </div>
              <dl className={styles.lines}>
                <div className={styles.line}><dt>Financement estimé par participant</dt><dd>{eur(card.fundingPerParticipant)}</dd></div>
                <div className={styles.line}><dt>Forfait référent estimé<span className={styles.factSub}>par participant, versé à l’établissement</span></dt><dd>{eur(card.referentPerParticipant)}</dd></div>
                <div className={styles.line}><dt>Reste à charge estimé<span className={styles.factSub}>par participant, avant l’aide issue du budget référent</span></dt><dd>{eur(card.remainingPerParticipant)}</dd></div>
              </dl>
              <p className={styles.opcoText}><strong>Comment ça fonctionne.</strong> {card.how}</p>
              {card.capped && <p className={styles.opcoText}><strong>Montant retenu.</strong> Limité à {eur(card.fundingPerParticipant)} par participant, pour ne pas dépasser le prix estimé du séjour.</p>}
              <p className={styles.opcoText}><strong>{card.toConfirm ? "À confirmer." : "Conditions importantes."}</strong> {card.condition}</p>
              {card.source && <a className={styles.sourceLink} href={card.source.url} target="_blank" rel="noreferrer">Source officielle : {card.source.label}, vérifiée le {card.source.checkedAt} ↗</a>}
            </article>
          ))}
        </div>
        {outcome.opcoCards.some((card) => /mise à disposition|mise en veille/.test(`${card.how} ${card.condition}`)) && (
          <p className={styles.note}><strong>Deux termes utiles.</strong> « Mise à disposition » : l’alternant reste salarié de son entreprise pendant le séjour, ce qui est le cas le plus courant pour un séjour court. « Mise en veille » : son contrat est suspendu pendant le séjour.</p>
        )}
      </section>

      {/* 6. Hypothèses */}
      <section className={styles.section} aria-labelledby="guided-assumptions">
        <h2 id="guided-assumptions" className={styles.sectionTitle}>Hypothèses utilisées</h2>
        <p className={styles.sectionLead}>Voici tout ce que nous avons supposé pour calculer ce résultat. Rien n’est caché : chaque ligne peut être modifiée.</p>
        <div className={cx(styles.card, styles.assumptionsBox)}>
          {outcome.assumptions.map((assumption) => (
            <div key={assumption.id} className={styles.assumption}>
              <div>
                <div className={styles.assumptionLabel}>{assumption.label}{assumption.provisional ? <span className={styles.badge}>⚠ Provisoire</span> : assumption.toConfirm && <span className={styles.badge}>À confirmer</span>}</div>
                <div className={styles.assumptionValue}>{assumption.value}</div>
                {assumption.detail && <div className={styles.assumptionDetail}>{assumption.detail}</div>}
              </div>
              <button type="button" className={styles.edit} aria-label={`Modifier : ${assumption.label}`} onClick={() => (assumption.edit === "refine" ? openRefine() : onEdit(assumption.edit))}>Modifier</button>
            </div>
          ))}
        </div>

        <div ref={refineRef} style={{ scrollMarginTop: 16 }}>
          {outcome.refinements.length > 0 && !refineOpen && (
            <Callout>
              <p><strong>Cette estimation peut être affinée</strong></p>
              {outcome.refinements.map((prompt) => <p key={prompt.opcoId} style={{ marginTop: 6 }}>{prompt.message}</p>)}
              <p style={{ marginTop: 12 }}><button type="button" className={styles.ghost} onClick={openRefine}>Affiner cette estimation</button></p>
            </Callout>
          )}
          {refineOpen && <GuidedRefinePanel answers={answers} outcome={outcome} update={update} />}
        </div>
      </section>

      {/* 7. Niveau de fiabilité */}
      <section className={styles.section} aria-labelledby="guided-confidence">
        <h2 id="guided-confidence" className={styles.sectionTitle}>Niveau de fiabilité</h2>
        <div className={cx(styles.card, styles.confidence)} style={{ marginTop: 16 }}>
          <span aria-hidden="true" className={styles.confDot} style={{ background: CONFIDENCE_COLOR[outcome.confidence.level] }} />
          <div>
            <p className={styles.confLabel}>{outcome.confidence.label}</p>
            <p className={styles.confDesc}>{outcome.confidence.desc}</p>
          </div>
        </div>
      </section>

      {/* 8. Prochaine étape */}
      <section className={styles.section} aria-label="Prochaine étape">
        <GuidedVerifyForm outcome={outcome} contact={contact} onContact={onContact} />
        <div className={styles.actions}>
          <button type="button" className={styles.ghost} onClick={onReview}>Modifier mes réponses</button>
          <button type="button" className={styles.ghost} onClick={onRestart}>Recommencer une simulation</button>
          <button type="button" className={styles.textLink} onClick={onAdvanced}>Ouvrir le simulateur expert</button>
        </div>
        <p className={styles.legal}>
          Les résultats fournis constituent des estimations indicatives, basées sur les informations saisies et sur les règles de financement connues à ce jour. Ils ne sont pas contractuels. Les décisions finales de prise en charge relèvent exclusivement des OPCO et organismes compétents. AMI Panorama ne garantit aucun montant de financement.
        </p>
      </section>
    </div>
  );
}
