import { fundingExamplePhrase, fundingWatchNote } from "@/data/globalWeeks";
import { OPCOS } from "@/lib/simulator/opco-config";
import {
  INITIAL_GUIDED_ANSWERS,
  buildGuidedOutcome,
  type GuidedAnswers,
} from "@/lib/simulator/guided";

export const PUBLIC_DURATION_DAYS = [7, 8, 14] as const;
export const DEFAULT_PUBLIC_DURATION_DAYS = 8;

export const PUBLIC_OPCOS = OPCOS.filter((opco) => opco.id !== "cnfpt").map((opco) => ({
  id: opco.id,
  label: opco.label,
}));

export type MobilityMode = "individuel" | "groupe";
export type PublicStatus = "alternant" | "etudiant";

export type PublicEstimateInput = {
  mode: MobilityMode;
  status: PublicStatus;
  destination: string;
  days: number;
  /** null = OPCO pas encore identifié. Ignoré pour un étudiant. */
  opcoId: string | null;
  participants: number;
};

export type PublicEstimate = {
  mode: MobilityMode;
  status: PublicStatus;
  destination: string;
  days: number;
  participants: number;
  opcoLabel: string | null;
  stayEuros: number;
  /** Financement apprenti retenu pour le calcul. null pour un étudiant. */
  apprenticeEuros: number | null;
  /** Montant de financement affiché, égal au financement apprenti. null pour un étudiant. */
  fundingEuros: number | null;
  remainderEuros: number;
  /**
   * Mention informative affichée à côté du résultat, hors financement et hors reste à charge.
   * null pour un étudiant : ce budget concerne l’alternance.
   */
  referentNote: string | null;
  title: string;
  text: string;
  watchNote: string;
};

/** Mention hors calcul. Le budget est versé à l’école ou au CFA, pas à l’apprenti. */
export const REFERENT_MOBILITY_NOTE =
  "D’après nos informations, l’OPCO peut aussi verser à l’école ou au CFA un budget dédié au référent mobilité, jusqu’à 500 €. Ce montant n’est pas destiné à l’apprenti et n’est pas inclus dans ce calcul, mais ton école peut éventuellement t’aider avec une partie de cette somme. Renseigne-toi auprès d’elle.";

function euros(value: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(value))} €`;
}

function answersFor(input: PublicEstimateInput): GuidedAnswers {
  const participants = input.mode === "individuel" ? 1 : Math.max(2, Math.round(input.participants));
  const knownOpco = input.status === "alternant" && input.opcoId && PUBLIC_OPCOS.some((opco) => opco.id === input.opcoId);
  return {
    ...INITIAL_GUIDED_ANSWERS,
    destinationKnown: "yes",
    destination: input.destination,
    durationDays: input.days,
    durationUnknown: false,
    participants,
    opcoKnowledge: knownOpco ? "all" : "none",
    opcoRows: knownOpco ? [{ id: input.opcoId as string, count: participants }] : [],
    companions: input.mode === "individuel" ? 0 : null,
    transportQuote: "no",
  };
}

export function estimatePublicMobility(input: PublicEstimateInput): PublicEstimate {
  const outcome = buildGuidedOutcome(answersFor(input));
  const participants = outcome.participants;
  const stayEuros = outcome.result.totalCostPerStudent;
  const student = input.status === "etudiant";
  // Le forfait référent mobilité est un budget versé à l’école ou au CFA.
  // Le financement et le reste à charge de l’apprenti ne retiennent que l’aide apprenti.
  const apprenticeEuros = student ? null : Math.round(outcome.result.financementMoyen);
  const fundingEuros = apprenticeEuros;
  const remainderEuros = student || fundingEuros === null ? stayEuros : Math.max(0, stayEuros - fundingEuros);
  const opcoLabel = student
    ? null
    : input.opcoId
      ? PUBLIC_OPCOS.find((opco) => opco.id === input.opcoId)?.label ?? null
      : "Pas encore identifié";
  const perPerson = input.mode === "groupe" ? " par personne" : "";
  const title = student ? "Ton séjour se prépare avec AMI Panorama." : "Ton séjour est éligible aux financements OPCO.";
  const text = student
    ? `D’après nos informations, les aides les plus courantes accompagnent l’alternance. Pour ton séjour à ${input.destination}, le prix indicatif est de ${euros(stayEuros)}. Un reste à charge peut subsister, par exemple ${fundingExamplePhrase()}. AMI Panorama monte le dossier avec toi.`
    : alternantText(input.destination, fundingEuros ?? 0, remainderEuros, perPerson);

  return {
    mode: input.mode,
    status: input.status,
    destination: input.destination,
    days: input.days,
    participants,
    opcoLabel,
    stayEuros,
    apprenticeEuros,
    fundingEuros,
    remainderEuros,
    referentNote: student ? null : REFERENT_MOBILITY_NOTE,
    title,
    text,
    watchNote: fundingWatchNote,
  };
}

function alternantText(destination: string, funding: number, remainder: number, perPerson: string): string {
  const remainderSentence = remainder > 0
    ? ` Il peut rester un reste à charge d’environ ${euros(remainder)}${perPerson}.`
    : " Dans cette estimation, il ne reste pas de reste à charge.";
  return `D’après nos informations, le financement indicatif est d’environ ${euros(funding)}${perPerson} pour ${destination}.${remainderSentence} AMI Panorama monte le dossier avec toi.`;
}

export function estimateSummary(estimate: PublicEstimate): string {
  const lines = [
    "SIMULATEUR GLOBAL WEEKS",
    `Mobilité : ${estimate.mode === "individuel" ? "individuelle" : "de groupe"}`,
    `Statut : ${estimate.status === "alternant" ? "Alternant" : "Étudiant"}`,
    `Destination : ${estimate.destination}`,
    `Durée : ${estimate.days} jours`,
    `Personnes : ${estimate.participants}`,
    `OPCO : ${estimate.opcoLabel ?? "non concerné (étudiant)"}`,
    `Prix indicatif du séjour : ${Math.round(estimate.stayEuros)} €`,
    `Financement apprenti : ${estimate.apprenticeEuros === null ? "non calculé (étudiant)" : `${Math.round(estimate.apprenticeEuros)} €`}`,
    `Financement indicatif : ${estimate.fundingEuros === null ? "non calculé (étudiant)" : `${Math.round(estimate.fundingEuros)} €`}`,
    `Reste à charge indicatif : ${Math.round(estimate.remainderEuros)} €`,
    estimate.text,
  ];
  if (estimate.referentNote) lines.push(estimate.referentNote);
  return lines.join("\n");
}
