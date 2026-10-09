// ──────────────────────────────────────────────────────────────
// Simulation guidée, couche pure au-dessus du moteur.
// Transforme des réponses simples en entrée de `computeSimulation`,
// liste les hypothèses appliquées et qualifie la fiabilité.
// Aucun calcul financier ici : tout montant de financement vient du
// moteur (engine.ts) et de la configuration OPCO (opco-config.ts).
// ──────────────────────────────────────────────────────────────
import { baseTotals, computeSimulation, resolveKeptTotal, type OpcoLine, type SimResult } from "./engine";
import {
  COST_DEFAULTS,
  DESTINATION_TARIFFS,
  LEGACY_OPCOS,
  OPCOS,
  OPCO_BY_ID,
  OPCO_SECTORS,
  SIMULATION_OPCO_BY_ID,
  explainFunding,
  programmeForDestination,
} from "./opco-config";
import {
  COMPANION_BANDS,
  DEFAULT_PARTICIPANTS,
  DEFAULT_REFINEMENTS,
  DEFAULT_UNKNOWN_DURATION_DAYS,
  DEFAULT_UNKNOWN_OPCO_AVERAGE,
  GUIDED_ZONES,
  MAX_DURATION_DAYS,
  MIN_INDEPENDENT_GROUP,
  UNKNOWN_OPCO_ID,
  UNKNOWN_OPCO_LABEL,
  defaultEligibleCosts,
  type GuidedZoneId,
  type UnknownOpcoAverage,
} from "./guided-config";
import type { OpcoConfig, OpcoRow, SimInput, StayParams } from "./types";

// ── État du parcours ──────────────────────────────────────────
export type ContractMode = "miseADisposition" | "miseEnVeille";
export type TrainingLevel = "postBac" | "bacOrBelow";

export interface GuidedRefinements {
  atlasContractMode: ContractMode;
  atlasBeforeApril2026: number;
  aktoContractMode: ContractMode;
  aktoTrainingLevel: TrainingLevel;
  afdasTrainingLevel: TrainingLevel;
  epContractMode: ContractMode;
  opcoMobilitesBefore2026: number;
}

/** État central du parcours guidé. Sérialisable tel quel (localStorage). */
export interface GuidedAnswers {
  destinationKnown: "yes" | "no" | null;
  destination: string | null;
  zone: GuidedZoneId | null;
  /** Jours calendaires. null tant que rien n'est choisi. */
  durationDays: number | null;
  durationUnknown: boolean;
  participants: number;
  opcoKnowledge: "all" | "partial" | "none" | null;
  opcoRows: { id: string; count: number }[];
  /** null = on suit la recommandation liée à la taille du groupe. */
  companions: number | null;
  transportQuote: "yes" | "no" | null;
  transportQuoteMode: "perPerson" | "total";
  transportPerPerson: number | null;
  transportTotal: number | null;
  /** Nombre de billets couverts par le devis global. null = participants + accompagnateurs. */
  transportTotalTickets: number | null;
  /** Remplace le tarif moyen de la destination quand il n'y a pas de devis. */
  transportAverageOverride: number | null;
  /** Remplace le coût programme estimé. */
  programmeOverride: number | null;
  /** Remplace COST_DEFAULTS.keptPerAccompagnant. */
  keptPerCompanionOverride: number | null;
  refinements: GuidedRefinements;
}

export const INITIAL_GUIDED_ANSWERS: GuidedAnswers = {
  destinationKnown: null,
  destination: null,
  zone: null,
  durationDays: null,
  durationUnknown: false,
  participants: DEFAULT_PARTICIPANTS,
  opcoKnowledge: null,
  opcoRows: [],
  companions: null,
  transportQuote: null,
  transportQuoteMode: "perPerson",
  transportPerPerson: null,
  transportTotal: null,
  transportTotalTickets: null,
  transportAverageOverride: null,
  programmeOverride: null,
  keptPerCompanionOverride: null,
  refinements: { ...DEFAULT_REFINEMENTS },
};

export type GuidedStepId = "destination" | "duration" | "participants" | "opco" | "companions" | "transport" | "review";
export const GUIDED_STEPS: GuidedStepId[] = ["destination", "duration", "participants", "opco", "companions", "transport", "review"];

// ── Règles simples du parcours ────────────────────────────────
export function isSmallGroup(participants: number): boolean {
  return participants < MIN_INDEPENDENT_GROUP;
}

export function recommendedCompanions(participants: number): number {
  const band = COMPANION_BANDS.find((b) => b.maxParticipants === null || participants <= b.maxParticipants);
  return band ? band.companions : COMPANION_BANDS[COMPANION_BANDS.length - 1].companions;
}

export function effectiveCompanions(answers: GuidedAnswers): number {
  return answers.companions ?? recommendedCompanions(answers.participants);
}

/** Le moteur raisonne en nuitées : jours calendaires − 1. */
export function daysToNights(days: number): number {
  return Math.max(1, Math.round(days) - 1);
}

export function effectiveDays(answers: GuidedAnswers): number {
  if (answers.durationUnknown || answers.durationDays === null) return DEFAULT_UNKNOWN_DURATION_DAYS;
  return Math.min(MAX_DURATION_DAYS, Math.max(2, Math.round(answers.durationDays)));
}

export function knownOpcoCount(answers: GuidedAnswers): number {
  if (answers.opcoKnowledge === "none" || answers.opcoKnowledge === null) return 0;
  return answers.opcoRows.reduce((sum, row) => sum + Math.max(0, row.count), 0);
}

/** Reliquat classé automatiquement en « OPCO encore inconnu ». */
export function unknownOpcoCount(answers: GuidedAnswers): number {
  return Math.max(0, answers.participants - knownOpcoCount(answers));
}

export function opcoOverflow(answers: GuidedAnswers): number {
  return Math.max(0, knownOpcoCount(answers) - answers.participants);
}

/** Message d'erreur bloquant pour une étape, ou null si l'on peut continuer. */
export function validateStep(step: GuidedStepId, answers: GuidedAnswers): string | null {
  switch (step) {
    case "destination":
      if (answers.destinationKnown === null) return "Indiquez si vous avez déjà choisi une destination.";
      if (answers.destinationKnown === "yes" && !(answers.destination && answers.destination in DESTINATION_TARIFFS)) return "Choisissez une destination dans la liste.";
      if (answers.destinationKnown === "no" && answers.zone === null) return "Choisissez la zone qui vous intéresse, ou demandez à être conseillé.";
      return null;
    case "duration":
      if (!answers.durationUnknown && answers.durationDays === null) return "Choisissez une durée, ou « Je ne sais pas encore ».";
      return null;
    case "participants":
      if (!Number.isFinite(answers.participants) || answers.participants < 1) return "Indiquez au moins 1 participant.";
      return null;
    case "opco": {
      if (answers.opcoKnowledge === null) return "Indiquez si vous connaissez les OPCO des participants.";
      if (answers.opcoKnowledge === "none") return null;
      const over = opcoOverflow(answers);
      if (over > 0) return `Vous avez renseigné ${knownOpcoCount(answers)} participants pour un groupe de ${answers.participants}. Retirez-en ${over} pour continuer.`;
      if (knownOpcoCount(answers) === 0) return "Ajoutez au moins un OPCO, ou choisissez « Non, pas encore ».";
      return null;
    }
    case "companions":
      return effectiveCompanions(answers) < 0 ? "Le nombre d’accompagnateurs ne peut pas être négatif." : null;
    case "transport":
      if (answers.transportQuote === null) return "Indiquez si vous avez déjà un devis pour le transport.";
      if (answers.transportQuote === "yes") {
        if (answers.transportQuoteMode === "perPerson" && !(answers.transportPerPerson && answers.transportPerPerson > 0)) return "Saisissez le prix aller-retour par participant.";
        if (answers.transportQuoteMode === "total" && !(answers.transportTotal && answers.transportTotal > 0)) return "Saisissez le montant total du devis.";
      }
      return null;
    case "review":
      return null;
  }
}

/** Première étape incomplète, ou null si tout le parcours est valide. */
export function firstInvalidStep(answers: GuidedAnswers): GuidedStepId | null {
  return GUIDED_STEPS.find((step) => validateStep(step, answers) !== null) ?? null;
}

// ── Destination, transport, programme ─────────────────────────
function mean(values: number[]): number {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

export interface ResolvedDestination {
  known: boolean;
  /** Libellé affiché : nom de la destination, ou zone envisagée. */
  label: string;
  fundingZone: "europe" | "international";
  /** Destinations du catalogue servant de base aux moyennes quand la destination n'est pas choisie. */
  basis: string[];
}

export function resolveDestination(answers: GuidedAnswers): ResolvedDestination {
  if (answers.destinationKnown === "yes" && answers.destination && answers.destination in DESTINATION_TARIFFS) {
    return { known: true, label: answers.destination, fundingZone: DESTINATION_TARIFFS[answers.destination].zone, basis: [answers.destination] };
  }
  const zone = GUIDED_ZONES[answers.zone ?? "advice"];
  return { known: false, label: zone.short, fundingZone: zone.fundingZone, basis: zone.destinations };
}

export interface ResolvedAmount {
  value: number;
  source: "quote" | "catalogue" | "zoneMean" | "override";
}

/** Prix du transport aller-retour par participant. */
export function resolveTransport(answers: GuidedAnswers): ResolvedAmount {
  if (answers.transportQuote === "yes") {
    if (answers.transportQuoteMode === "total" && answers.transportTotal && answers.transportTotal > 0) {
      const tickets = Math.max(1, answers.transportTotalTickets ?? answers.participants + effectiveCompanions(answers));
      return { value: Math.round(answers.transportTotal / tickets), source: "quote" };
    }
    if (answers.transportQuoteMode === "perPerson" && answers.transportPerPerson && answers.transportPerPerson > 0) {
      return { value: Math.round(answers.transportPerPerson), source: "quote" };
    }
  }
  if (answers.transportAverageOverride !== null && answers.transportAverageOverride >= 0) {
    return { value: Math.round(answers.transportAverageOverride), source: "override" };
  }
  return averageTransport(answers);
}

/** Tarif moyen lu dans DESTINATION_TARIFFS (ou moyenne de la zone envisagée). */
export function averageTransport(answers: GuidedAnswers): ResolvedAmount {
  const destination = resolveDestination(answers);
  if (destination.known) return { value: DESTINATION_TARIFFS[destination.label].billets, source: "catalogue" };
  return { value: Math.round(mean(destination.basis.map((name) => DESTINATION_TARIFFS[name].billets))), source: "zoneMean" };
}

/** Coût du programme AMI par participant, pour la durée retenue. */
export function resolveProgramme(answers: GuidedAnswers): ResolvedAmount {
  if (answers.programmeOverride !== null && answers.programmeOverride >= 0) return { value: Math.round(answers.programmeOverride), source: "override" };
  return suggestedProgramme(answers);
}

export function suggestedProgramme(answers: GuidedAnswers): ResolvedAmount {
  const destination = resolveDestination(answers);
  const nights = daysToNights(effectiveDays(answers));
  if (destination.known) return { value: programmeForDestination(destination.label, nights), source: "catalogue" };
  return { value: Math.round(mean(destination.basis.map((name) => programmeForDestination(name, nights)))), source: "zoneMean" };
}

// ── OPCO inconnus ─────────────────────────────────────────────
export interface ResolvedUnknownAverage {
  funding: number;
  referent: number;
  source: UnknownOpcoAverage["source"];
  validatedByAmi: boolean;
  /** OPCO dont les barèmes entrent dans la moyenne (vide si la moyenne est observée). */
  basis: string[];
}

/**
 * Estimation indicative, basée sur les barèmes OPCO disponibles, pour un participant sans OPCO connu.
 * Point d'extension : passer un autre `average` (par exemple calculé à
 * partir des départs réels) remplace la valeur par défaut sans toucher
 * au reste du parcours.
 */
export function resolveUnknownOpcoAverage(
  stay: StayParams,
  selections: Record<string, string>,
  average: UnknownOpcoAverage = DEFAULT_UNKNOWN_OPCO_AVERAGE,
): ResolvedUnknownAverage {
  if (average.source === "observed" && average.fundingPerParticipant !== null && average.referentPerParticipant !== null) {
    return { funding: average.fundingPerParticipant, referent: average.referentPerParticipant, source: "observed", validatedByAmi: average.validatedByAmi, basis: [] };
  }
  const validated = OPCOS.filter((config) => config.status === "validated");
  const sample = computeSimulation({ stay, rows: validated.map((config) => ({ config, count: 1 })), keptTotal: 0, selections });
  const count = Math.max(1, validated.length);
  return {
    funding: Math.round(sample.apprentiTotal / count),
    referent: Math.round(sample.referentTotal / count),
    source: "opcoRulesMean",
    validatedByAmi: average.validatedByAmi,
    basis: validated.map((config) => config.label),
  };
}

function unknownOpcoConfig(average: ResolvedUnknownAverage): OpcoConfig {
  return {
    id: UNKNOWN_OPCO_ID,
    label: UNKNOWN_OPCO_LABEL,
    referent: { type: "fixed", amount: average.referent },
    apprenti: { type: "fixed", amount: average.funding },
    status: "to_confirm",
    notes: "Ligne interne à la simulation guidée : estimation indicative basée sur les barèmes OPCO disponibles, à remplacer par l’OPCO réel.",
  };
}

// ── Conversion vers le moteur ─────────────────────────────────
export interface GuidedEngineInput {
  input: SimInput;
  selections: Record<string, string>;
  unknownAverage: ResolvedUnknownAverage | null;
}

/**
 * Réponses guidées → entrée de `computeSimulation`.
 * Fonction pure : mêmes règles de construction que le mode avancé
 * (lignes historiques ATLAS / OPCO Mobilités, zone AKTO, budget réservé
 * par accompagnateur).
 */
export function guidedToSimInput(answers: GuidedAnswers, average: UnknownOpcoAverage = DEFAULT_UNKNOWN_OPCO_AVERAGE): GuidedEngineInput {
  const nights = daysToNights(effectiveDays(answers));
  const eligible = defaultEligibleCosts(nights);
  const stay: StayParams = {
    nights,
    programmeCost: resolveProgramme(answers).value,
    transportCost: resolveTransport(answers).value,
    accommodationCost: eligible.accommodation,
    mealsCost: eligible.meals,
    otherMobilityCost: eligible.other,
  };

  const destinationZone = resolveDestination(answers).fundingZone;
  const r = answers.refinements;
  // AKTO nomme « euro » la zone que le catalogue appelle « europe ».
  const aktoZone = destinationZone === "europe" ? "euro" : destinationZone;
  const selections: Record<string, string> = {
    atlasContractMode: r.atlasContractMode,
    epContractMode: r.epContractMode,
    aktoTrainingLevel: r.aktoTrainingLevel,
    afdasTrainingLevel: r.afdasTrainingLevel,
    aktoFunding: `${aktoZone}_${r.aktoContractMode}`,
    destinationZone,
  };

  const knownRows = answers.opcoKnowledge === "none" || answers.opcoKnowledge === null ? [] : answers.opcoRows;
  const rows: OpcoRow[] = knownRows.flatMap((row) => {
    const config = OPCO_BY_ID[row.id];
    const count = Math.max(0, Math.round(row.count));
    if (!config || count === 0) return [];
    if (row.id === "atlas") {
      const before = Math.min(count, Math.max(0, r.atlasBeforeApril2026));
      return [{ config: LEGACY_OPCOS.atlasBeforeApril2026 as OpcoConfig, count: before }, { config, count: count - before }].filter((line) => line.count > 0);
    }
    if (row.id === "opco_mobilites") {
      const before = Math.min(count, Math.max(0, r.opcoMobilitesBefore2026));
      return [{ config: LEGACY_OPCOS.opcoMobilitesBefore2026 as OpcoConfig, count: before }, { config, count: count - before }].filter((line) => line.count > 0);
    }
    return [{ config, count }];
  });

  const unknown = unknownOpcoCount(answers);
  let unknownAverage: ResolvedUnknownAverage | null = null;
  if (unknown > 0) {
    unknownAverage = resolveUnknownOpcoAverage(stay, selections, average);
    rows.push({ config: unknownOpcoConfig(unknownAverage), count: unknown });
  }

  const keptPerCompanion = answers.keptPerCompanionOverride ?? COST_DEFAULTS.keptPerAccompagnant;
  const keptTotal = resolveKeptTotal(
    { kind: "free", keptPerAccompagnant: keptPerCompanion, accompagnants: effectiveCompanions(answers) },
    baseTotals({ stay, rows, selections }),
  );

  return { input: { stay, rows, keptTotal, selections }, selections, unknownAverage };
}

// ── Lecture du résultat ───────────────────────────────────────
export type ConfidenceLevel = "high" | "medium" | "low";
export interface GuidedConfidence {
  level: ConfidenceLevel;
  label: string;
  /** Une phrase qui explique le niveau, lisible telle quelle. */
  desc: string;
}

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  high: "Estimation assez précise",
  medium: "Estimation à affiner",
  low: "Validation nécessaire",
};

export interface GuidedAssumption {
  id: string;
  label: string;
  value: string;
  detail?: string;
  /** Étape du parcours où la réponse se modifie, ou "refine" pour le panneau d'affinage. */
  edit: GuidedStepId | "refine";
  /** true = donnée absente ou supposée, à confirmer avant de s'engager. */
  toConfirm: boolean;
  /** true = valeur de remplacement utilisée faute de destination ; elle changera dès que la destination sera choisie. */
  provisional?: boolean;
}

export interface GuidedRefinementPrompt {
  opcoId: "atlas" | "akto" | "afdas" | "ep" | "opco_mobilites";
  opcoLabel: string;
  message: string;
}

export interface GuidedOpcoCard {
  id: string;
  label: string;
  count: number;
  sector?: string;
  fundingPerParticipant: number;
  referentPerParticipant: number;
  /** Reste à charge par participant avant toute aide complémentaire issue du budget référent. */
  remainingPerParticipant: number;
  how: string;
  condition: string;
  capped: boolean;
  toConfirm: boolean;
  isUnknown: boolean;
  source?: { label: string; url: string; checkedAt: string };
}

export interface GuidedOutcome {
  input: SimInput;
  result: SimResult;
  destination: ResolvedDestination;
  days: number;
  nights: number;
  durationAssumed: boolean;
  participants: number;
  knownParticipants: number;
  unknownParticipants: number;
  companions: number;
  recommendedCompanions: number;
  smallGroup: boolean;
  transport: ResolvedAmount;
  programme: ResolvedAmount;
  keptPerCompanion: number;
  /** Budget réellement réservé à l'accompagnement (jamais plus que le budget référent total). */
  companionBudget: number;
  companionBudgetPerCompanion: number;
  /** Le budget souhaité dépasse le budget référent disponible. */
  companionBudgetLimited: boolean;
  unknownAverage: ResolvedUnknownAverage | null;
  opcoCards: GuidedOpcoCard[];
  assumptions: GuidedAssumption[];
  refinements: GuidedRefinementPrompt[];
  confidence: GuidedConfidence;
  /** Avertissement à afficher en tête du résultat quand la destination n'est pas choisie, sinon null. */
  provisionalNote: string | null;
}

const eur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;
const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;
const MODE_LABEL: Record<ContractMode, string> = {
  miseADisposition: "l’alternant reste salarié de son entreprise pendant le séjour",
  miseEnVeille: "le contrat est suspendu pendant le séjour",
};
const LEVEL_LABEL: Record<TrainingLevel, string> = { postBac: "formation supérieure au bac", bacOrBelow: "formation de niveau bac ou inférieur" };

function hasOpco(answers: GuidedAnswers, id: string): boolean {
  return answers.opcoKnowledge !== "none" && answers.opcoKnowledge !== null && answers.opcoRows.some((row) => row.id === id && row.count > 0);
}

/** Questions d'affinage utiles, uniquement pour les OPCO réellement sélectionnés. */
export function listRefinements(answers: GuidedAnswers): GuidedRefinementPrompt[] {
  const days = effectiveDays(answers);
  const prompts: GuidedRefinementPrompt[] = [];
  if (hasOpco(answers, "atlas")) {
    prompts.push({
      opcoId: "atlas",
      opcoLabel: OPCO_BY_ID.atlas.label,
      message: days < 15
        ? "Certains participants dépendent d’ATLAS. Pour un séjour de moins de 15 jours, ATLAS ne finance pas le séjour des participants dont le contrat a été signé depuis le 1er avril 2026. La durée et la date de signature des contrats peuvent donc modifier la prise en charge."
        : "Certains participants dépendent d’ATLAS. La durée du séjour, le type de convention et la date de signature des contrats peuvent modifier la prise en charge.",
    });
  }
  if (hasOpco(answers, "akto")) prompts.push({ opcoId: "akto", opcoLabel: OPCO_BY_ID.akto.label, message: "Certains participants dépendent d’AKTO. Le type de convention et le niveau de formation peuvent modifier la prise en charge." });
  if (hasOpco(answers, "afdas")) prompts.push({ opcoId: "afdas", opcoLabel: OPCO_BY_ID.afdas.label, message: "Certains participants dépendent de l’AFDAS. Le niveau de formation modifie le forfait versé à l’établissement." });
  if (hasOpco(answers, "ep")) prompts.push({ opcoId: "ep", opcoLabel: OPCO_BY_ID.ep.label, message: "Certains participants dépendent de l’OPCO EP. Le type de convention modifie le montant par semaine et son plafond." });
  if (hasOpco(answers, "opco_mobilites")) prompts.push({ opcoId: "opco_mobilites", opcoLabel: OPCO_BY_ID.opco_mobilites.label, message: "Certains participants dépendent de l’OPCO Mobilités. Les contrats signés avant le 1er janvier 2026 suivent un autre barème." });
  return prompts;
}

function buildOpcoCards(result: SimResult, answers: GuidedAnswers, days: number, zone: "europe" | "international", average: ResolvedUnknownAverage | null): GuidedOpcoCard[] {
  const r = answers.refinements;
  return result.perOpco.map((line: OpcoLine) => {
    const isUnknown = line.id === UNKNOWN_OPCO_ID;
    const explanation = isUnknown
      ? {
          how: average?.source === "observed"
            ? `Pour ces participants, nous utilisons une moyenne observée sur les départs AMI Panorama : ${eur(line.apprentiTheoreticalAmount)} par participant.`
            : `Pour ces participants, nous utilisons une estimation indicative basée sur les barèmes OPCO disponibles : ${eur(line.apprentiTheoreticalAmount)} par participant pour ce séjour. Elle ne provient pas de départs réels.`,
          condition: "Ce montant n’est pas une prise en charge garantie. Il sera remplacé par le calcul exact dès que l’OPCO de chaque participant sera connu.",
        }
      : explainFunding(line.id, {
          calendarDays: days,
          destinationZone: zone,
          aktoContractMode: r.aktoContractMode,
          aktoTrainingLevel: r.aktoTrainingLevel,
          afdasTrainingLevel: r.afdasTrainingLevel,
          atlasContractMode: r.atlasContractMode,
          epContractMode: r.epContractMode,
          amount: line.apprentiTheoreticalAmount,
        });
    return {
      id: line.id,
      label: line.label,
      count: line.count,
      sector: OPCO_SECTORS[line.id.replace(/_before_\d+$/, "")],
      fundingPerParticipant: line.apprentiAmount,
      referentPerParticipant: line.referentAmount,
      remainingPerParticipant: line.racStudent,
      how: explanation.how,
      condition: explanation.condition,
      capped: line.apprentiTheoreticalAmount > line.apprentiAmount,
      toConfirm: line.status === "to_confirm",
      isUnknown,
      source: SIMULATION_OPCO_BY_ID[line.id]?.source,
    };
  });
}

function buildAssumptions(answers: GuidedAnswers, ctx: Pick<GuidedOutcome, "destination" | "days" | "durationAssumed" | "transport" | "programme" | "unknownParticipants" | "unknownAverage" | "companions" | "recommendedCompanions" | "keptPerCompanion" | "participants">): GuidedAssumption[] {
  const list: GuidedAssumption[] = [];
  const r = answers.refinements;

  if (!ctx.destination.known) {
    list.push({
      id: "destination",
      label: "Destination non choisie",
      value: `${ctx.destination.label} (hypothèse provisoire)`,
      detail: `Les prix utilisés sont provisoires : c’est la moyenne de nos destinations (${ctx.destination.basis.join(", ")}). Ils seront remplacés dès que la destination sera choisie. AMI Panorama pourra vous en recommander une et établir un prix.`,
      edit: "destination",
      toConfirm: true,
      provisional: true,
    });
    if (answers.zone === "advice") {
      list.push({ id: "fundingZone", label: "Zone retenue pour les financements", value: "Europe (hypothèse provisoire)", detail: "Sans destination, nous retenons provisoirement la zone la moins financée par les OPCO, par prudence.", edit: "destination", toConfirm: true, provisional: true });
    }
  }

  if (ctx.durationAssumed) {
    list.push({ id: "duration", label: "Durée supposée", value: `${ctx.days} jours`, detail: "Vous n’avez pas encore fixé la durée. Certaines prises en charge dépendent du nombre de jours calendaires.", edit: "duration", toConfirm: true });
  }

  list.push(ctx.transport.source === "quote"
    ? { id: "transport", label: "Transport aller-retour", value: `${eur(ctx.transport.value)} par participant`, detail: "Montant issu de votre devis.", edit: "transport", toConfirm: false }
    : {
        id: "transport",
        label: ctx.transport.source === "zoneMean" ? "Tarif provisoire du transport aller-retour" : "Tarif moyen du transport aller-retour",
        value: `${eur(ctx.transport.value)} par participant`,
        detail: ctx.transport.source === "override"
          ? "Tarif moyen que vous avez ajusté. À remplacer par le devis dès réception."
          : ctx.transport.source === "zoneMean"
            ? "Moyenne des tarifs de la zone envisagée, faute de destination. Ce montant changera dès que la destination sera choisie."
            : "Tarif moyen pour cette destination, à remplacer par le devis dès réception.",
        edit: "transport",
        toConfirm: true,
        provisional: ctx.transport.source === "zoneMean",
      });

  list.push({
    id: "programme",
    label: ctx.programme.source === "zoneMean" ? "Coût provisoire du programme AMI Panorama" : "Coût du programme AMI Panorama",
    value: `${eur(ctx.programme.value)} par participant`,
    detail: ctx.programme.source === "override"
      ? "Montant que vous avez saisi."
      : ctx.programme.source === "zoneMean"
        ? "Moyenne des programmes de la zone envisagée, faute de destination. Ce montant changera dès que la destination sera choisie."
        : "Tarif indicatif pour cette durée. Le prix définitif dépend de la période, du nombre de participants et des prestations retenues.",
    edit: "refine",
    toConfirm: ctx.programme.source !== "override",
    provisional: ctx.programme.source === "zoneMean",
  });

  if (ctx.unknownParticipants > 0 && ctx.unknownAverage) {
    list.push({
      id: "unknownOpco",
      label: "OPCO encore inconnu",
      value: plural(ctx.unknownParticipants, "participant", "participants"),
      detail: "Leur OPCO n’est pas renseigné : la prise en charge de ces participants reste à établir.",
      edit: "opco",
      toConfirm: true,
    });
    list.push({
      id: "unknownAverage",
      label: ctx.unknownAverage.source === "observed" ? "Moyenne observée sur les départs réels" : "Estimation indicative basée sur les barèmes OPCO disponibles",
      value: `${eur(ctx.unknownAverage.funding)} par participant`,
      detail: ctx.unknownAverage.source === "observed"
        ? "Moyenne observée sur les départs AMI Panorama. Ce n’est pas une prise en charge garantie."
        : `Moyenne simple des barèmes de ${ctx.unknownAverage.basis.length} OPCO, calculée pour ce séjour. Elle ne provient pas de départs réels et n’est pas une prise en charge garantie.`,
      edit: "opco",
      toConfirm: true,
    });
  }

  list.push({
    id: "companionBudget",
    label: "Budget réservé par accompagnateur",
    value: ctx.companions > 0 ? eur(ctx.keptPerCompanion) : "Aucun accompagnateur",
    detail: ctx.companions === ctx.recommendedCompanions
      ? `Nombre d’accompagnateurs recommandé pour ${ctx.participants} participants. Indicatif, à adapter à votre projet.`
      : `Vous avez retenu ${plural(ctx.companions, "accompagnateur", "accompagnateurs")} (recommandation indicative : ${ctx.recommendedCompanions}).`,
    edit: "refine",
    toConfirm: false,
  });

  const conventions: string[] = [];
  if (hasOpco(answers, "atlas")) conventions.push(`ATLAS : ${MODE_LABEL[r.atlasContractMode]}${r.atlasBeforeApril2026 > 0 ? `, dont ${plural(r.atlasBeforeApril2026, "contrat signé", "contrats signés")} avant le 1er avril 2026` : ", contrats signés depuis le 1er avril 2026"}`);
  if (hasOpco(answers, "akto")) conventions.push(`AKTO : ${MODE_LABEL[r.aktoContractMode]}, ${LEVEL_LABEL[r.aktoTrainingLevel]}`);
  if (hasOpco(answers, "afdas")) conventions.push(`AFDAS : ${LEVEL_LABEL[r.afdasTrainingLevel]}`);
  if (hasOpco(answers, "ep")) conventions.push(`OPCO EP : ${MODE_LABEL[r.epContractMode]}`);
  if (hasOpco(answers, "opco_mobilites")) conventions.push(`OPCO Mobilités : ${r.opcoMobilitesBefore2026 > 0 ? `${plural(r.opcoMobilitesBefore2026, "contrat signé", "contrats signés")} avant le 1er janvier 2026` : "contrats signés depuis le 1er janvier 2026"}`);
  if (conventions.length) {
    list.push({ id: "conventions", label: "Situation des contrats supposée", value: conventions.join(" · "), detail: "Ces paramètres dépendent de chaque contrat et restent à confirmer.", edit: "refine", toConfirm: true });
  }

  const realCost = (answers.opcoKnowledge === "none" ? [] : answers.opcoRows).filter((row) => row.count > 0 && ["opco21", "constructys", "ocapiat", "opco_mobilites", "uniformation", "opco_sante"].includes(row.id));
  if (realCost.length) {
    list.push({
      id: "realCosts",
      label: "Frais remboursés sur justificatifs",
      value: realCost.map((row) => OPCO_BY_ID[row.id]?.label ?? row.id).join(", "),
      detail: "Ces OPCO remboursent des dépenses réellement payées par l’établissement. Nous retenons le transport et une part prudente d’hébergement et de repas ; la ventilation exacte sera fournie avec le devis.",
      edit: "refine",
      toConfirm: true,
    });
  }

  return list;
}

function buildConfidence(result: SimResult, ctx: { destinationKnown: boolean; durationAssumed: boolean; unknownParticipants: number; participants: number; transportQuoted: boolean }): GuidedConfidence {
  // Logique existante du mode avancé : part des financements issue de règles « à confirmer ».
  const toConfirm = result.perOpco.filter((line) => line.status === "to_confirm").reduce((sum, line) => sum + line.apprentiTotal, 0);
  const share = result.apprentiTotal > 0 ? toConfirm / result.apprentiTotal : 0;
  let level: ConfidenceLevel = share < 0.2 ? "high" : share < 0.55 ? "medium" : "low";

  const reasons: string[] = [];
  if (ctx.unknownParticipants === ctx.participants) reasons.push("aucun OPCO n’est encore renseigné");
  else if (ctx.unknownParticipants > 0) reasons.push(`l’OPCO de ${plural(ctx.unknownParticipants, "participant", "participants")} reste inconnu`);
  if (!ctx.destinationKnown) reasons.push("la destination n’est pas choisie");
  if (ctx.durationAssumed) reasons.push("la durée est supposée");

  // Une donnée absente ne peut jamais donner une estimation « assez précise ».
  if (reasons.length && level === "high") level = "medium";
  if (ctx.unknownParticipants === ctx.participants && !ctx.destinationKnown) level = "low";
  if (!reasons.length && share >= 0.2) reasons.push("une partie des financements repose sur des règles à confirmer auprès de l’OPCO");

  const desc = reasons.length
    ? `${reasons.join(", ").replace(/^./, (c) => c.toUpperCase())}.`
    : ctx.transportQuoted
      ? "Destination, durée et OPCO sont renseignés, et le transport repose sur votre devis."
      : "Destination, durée et OPCO sont renseignés. Le transport repose encore sur un tarif moyen.";
  return { level, label: CONFIDENCE_LABELS[level], desc };
}

/** Réponses guidées → résultat complet prêt à afficher. */
export function buildGuidedOutcome(answers: GuidedAnswers, average: UnknownOpcoAverage = DEFAULT_UNKNOWN_OPCO_AVERAGE): GuidedOutcome {
  const { input, unknownAverage } = guidedToSimInput(answers, average);
  const result = computeSimulation(input);
  const destination = resolveDestination(answers);
  const days = effectiveDays(answers);
  const durationAssumed = answers.durationUnknown || answers.durationDays === null;
  const companions = effectiveCompanions(answers);
  const keptPerCompanion = answers.keptPerCompanionOverride ?? COST_DEFAULTS.keptPerAccompagnant;
  const transport = resolveTransport(answers);
  const programme = resolveProgramme(answers);
  const unknownParticipants = unknownOpcoCount(answers);
  const base = {
    destination,
    days,
    durationAssumed,
    transport,
    programme,
    unknownParticipants,
    unknownAverage,
    companions,
    recommendedCompanions: recommendedCompanions(answers.participants),
    keptPerCompanion,
    participants: answers.participants,
  };

  return {
    ...base,
    input,
    result,
    nights: input.stay.nights,
    knownParticipants: answers.participants - unknownParticipants,
    smallGroup: isSmallGroup(answers.participants),
    companionBudget: result.keptTotal,
    companionBudgetPerCompanion: companions > 0 ? result.keptTotal / companions : 0,
    companionBudgetLimited: result.keptTotal < keptPerCompanion * companions,
    opcoCards: buildOpcoCards(result, answers, days, destination.fundingZone, unknownAverage),
    assumptions: buildAssumptions(answers, base),
    refinements: listRefinements(answers),
    confidence: buildConfidence(result, { destinationKnown: destination.known, durationAssumed, unknownParticipants, participants: answers.participants, transportQuoted: transport.source === "quote" }),
    provisionalNote: destination.known
      ? null
      : `Vous n’avez pas encore choisi de destination. Le coût du programme (${eur(programme.value)}) ${transport.source === "zoneMean" ? `et le tarif du transport (${eur(transport.value)}) sont des moyennes provisoires` : "est une moyenne provisoire"} de nos destinations pour « ${destination.label} ». Ce résultat est un ordre de grandeur, pas un prix. Il changera dès que la destination sera choisie.`,
  };
}

// ── Passage guidé ⇄ avancé ────────────────────────────────────
export type AdvancedModeKind = "free" | "maxReduction" | "coverSupport" | "targetRac";

/** État complet du mode avancé (SimulatorApp), pour passer d'un mode à l'autre sans rien perdre. */
export interface AdvancedSnapshot {
  destination: string;
  nights: number;
  accompagnants: number;
  rows: { id: string; count: number }[];
  transport: number;
  programme: number;
  eligibleAccommodation: number;
  eligibleMeals: number;
  eligibleOther: number;
  mode: AdvancedModeKind;
  keptPerAccompagnant: number;
  atlasContractMode: ContractMode;
  atlasBeforeApril2026: number;
  aktoContractMode: ContractMode;
  aktoTrainingLevel: TrainingLevel;
  afdasTrainingLevel: TrainingLevel;
  epContractMode: ContractMode;
  opcoMobilitesBefore2026: number;
  targetRac: number;
}

/**
 * Réponses guidées → état du mode avancé.
 * `previous` conserve les réglages propres au mode avancé (stratégie de
 * répartition, autres frais justifiables) d'un passage précédent.
 * Le mode avancé ne sait pas représenter un OPCO inconnu : ces participants
 * n'y figurent pas, et `advancedToGuided` les restitue au retour.
 */
export function guidedToAdvanced(answers: GuidedAnswers, previous?: AdvancedSnapshot | null): AdvancedSnapshot {
  const nights = daysToNights(effectiveDays(answers));
  const destination = resolveDestination(answers);
  const eligible = defaultEligibleCosts(nights);
  const sameNights = previous?.nights === nights;
  return {
    destination: destination.known ? destination.label : destination.basis[0] ?? Object.keys(DESTINATION_TARIFFS)[0],
    nights,
    accompagnants: effectiveCompanions(answers),
    rows: (answers.opcoKnowledge === "none" || answers.opcoKnowledge === null ? [] : answers.opcoRows).filter((row) => row.id in OPCO_BY_ID).map((row) => ({ id: row.id, count: Math.max(0, row.count) })),
    transport: resolveTransport(answers).value,
    programme: resolveProgramme(answers).value,
    eligibleAccommodation: sameNights && previous ? previous.eligibleAccommodation : eligible.accommodation,
    eligibleMeals: sameNights && previous ? previous.eligibleMeals : eligible.meals,
    eligibleOther: previous?.eligibleOther ?? eligible.other,
    mode: previous?.mode ?? "free",
    keptPerAccompagnant: answers.keptPerCompanionOverride ?? COST_DEFAULTS.keptPerAccompagnant,
    targetRac: previous?.targetRac ?? 300,
    ...answers.refinements,
  };
}

/**
 * État du mode avancé → réponses guidées, en repartant des réponses
 * `previous` pour ne perdre ni les participants sans OPCO connu, ni les
 * choix « je ne sais pas encore » que le mode avancé n'a pas modifiés.
 */
export function advancedToGuided(snapshot: AdvancedSnapshot, previous: GuidedAnswers = INITIAL_GUIDED_ANSWERS): GuidedAnswers {
  const exported = guidedToAdvanced(previous);
  const rows = snapshot.rows.filter((row) => row.count > 0);
  const known = rows.reduce((sum, row) => sum + row.count, 0);
  // Tant qu'aucun OPCO n'était renseigné, la taille du groupe reste celle du parcours guidé.
  const participants = previous.opcoKnowledge === null || previous.opcoKnowledge === "none"
    ? Math.max(previous.participants, known)
    : Math.max(1, known + unknownOpcoCount(previous));
  const destinationChanged = snapshot.destination !== exported.destination;
  const nightsChanged = snapshot.nights !== exported.nights;
  const next: GuidedAnswers = {
    ...previous,
    destinationKnown: destinationChanged || previous.destinationKnown === "yes" ? "yes" : previous.destinationKnown,
    destination: destinationChanged || previous.destinationKnown === "yes" ? snapshot.destination : previous.destination,
    durationDays: nightsChanged ? snapshot.nights + 1 : previous.durationDays,
    durationUnknown: nightsChanged ? false : previous.durationUnknown,
    participants,
    // « Non, pas encore » garde en réserve une éventuelle répartition déjà saisie.
    opcoRows: rows.length === 0 && previous.opcoKnowledge === "none" ? previous.opcoRows : rows,
    opcoKnowledge: rows.length === 0 ? (previous.opcoKnowledge === null ? null : "none") : participants > known ? "partial" : "all",
    companions: snapshot.accompagnants === exported.accompagnants && previous.companions === null ? null : snapshot.accompagnants,
    keptPerCompanionOverride: snapshot.keptPerAccompagnant === COST_DEFAULTS.keptPerAccompagnant ? null : snapshot.keptPerAccompagnant,
    refinements: {
      atlasContractMode: snapshot.atlasContractMode,
      atlasBeforeApril2026: snapshot.atlasBeforeApril2026,
      aktoContractMode: snapshot.aktoContractMode,
      aktoTrainingLevel: snapshot.aktoTrainingLevel,
      afdasTrainingLevel: snapshot.afdasTrainingLevel,
      epContractMode: snapshot.epContractMode,
      opcoMobilitesBefore2026: snapshot.opcoMobilitesBefore2026,
    },
  };
  // Transport : un montant modifié en mode avancé devient un prix saisi par participant.
  if (snapshot.transport !== exported.transport) {
    next.transportQuote = "yes";
    next.transportQuoteMode = "perPerson";
    next.transportPerPerson = snapshot.transport;
  }
  // Programme : on ne garde un montant imposé que s'il s'écarte du tarif suggéré.
  next.programmeOverride = null;
  next.programmeOverride = snapshot.programme === suggestedProgramme(next).value ? null : snapshot.programme;
  return next;
}

/** Lecture tolérante d'un état sauvegardé : toute donnée douteuse retombe sur la valeur initiale. */
export function reviveGuidedAnswers(raw: unknown): GuidedAnswers {
  if (!raw || typeof raw !== "object") return INITIAL_GUIDED_ANSWERS;
  const data = raw as Partial<GuidedAnswers>;
  const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null);
  const oneOf = <T extends string>(v: unknown, options: readonly T[]): T | null => (options.includes(v as T) ? (v as T) : null);
  const refinements = (data.refinements ?? {}) as Partial<GuidedRefinements>;
  return {
    destinationKnown: oneOf(data.destinationKnown, ["yes", "no"] as const),
    destination: typeof data.destination === "string" && data.destination in DESTINATION_TARIFFS ? data.destination : null,
    zone: oneOf(data.zone, Object.keys(GUIDED_ZONES) as GuidedZoneId[]),
    durationDays: num(data.durationDays),
    durationUnknown: data.durationUnknown === true,
    participants: Math.max(1, Math.round(num(data.participants) ?? DEFAULT_PARTICIPANTS)),
    opcoKnowledge: oneOf(data.opcoKnowledge, ["all", "partial", "none"] as const),
    opcoRows: Array.isArray(data.opcoRows)
      ? data.opcoRows.filter((row): row is { id: string; count: number } => !!row && typeof row.id === "string" && row.id in OPCO_BY_ID && num(row.count) !== null).map((row) => ({ id: row.id, count: Math.round(row.count) }))
      : [],
    companions: num(data.companions),
    transportQuote: oneOf(data.transportQuote, ["yes", "no"] as const),
    transportQuoteMode: oneOf(data.transportQuoteMode, ["perPerson", "total"] as const) ?? "perPerson",
    transportPerPerson: num(data.transportPerPerson),
    transportTotal: num(data.transportTotal),
    transportTotalTickets: num(data.transportTotalTickets),
    transportAverageOverride: num(data.transportAverageOverride),
    programmeOverride: num(data.programmeOverride),
    keptPerCompanionOverride: num(data.keptPerCompanionOverride),
    refinements: {
      atlasContractMode: oneOf(refinements.atlasContractMode, ["miseADisposition", "miseEnVeille"] as const) ?? DEFAULT_REFINEMENTS.atlasContractMode,
      atlasBeforeApril2026: num(refinements.atlasBeforeApril2026) ?? 0,
      aktoContractMode: oneOf(refinements.aktoContractMode, ["miseADisposition", "miseEnVeille"] as const) ?? DEFAULT_REFINEMENTS.aktoContractMode,
      aktoTrainingLevel: oneOf(refinements.aktoTrainingLevel, ["postBac", "bacOrBelow"] as const) ?? DEFAULT_REFINEMENTS.aktoTrainingLevel,
      afdasTrainingLevel: oneOf(refinements.afdasTrainingLevel, ["postBac", "bacOrBelow"] as const) ?? DEFAULT_REFINEMENTS.afdasTrainingLevel,
      epContractMode: oneOf(refinements.epContractMode, ["miseADisposition", "miseEnVeille"] as const) ?? DEFAULT_REFINEMENTS.epContractMode,
      opcoMobilitesBefore2026: num(refinements.opcoMobilitesBefore2026) ?? 0,
    },
  };
}
