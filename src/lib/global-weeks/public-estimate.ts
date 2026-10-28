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
  /** null pour un étudiant : les aides modélisées accompagnent l'alternance. */
  fundingEuros: number | null;
  remainderEuros: number;
  title: string;
  text: string;
  watchNote: string;
};

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
  const fundingEuros = student ? null : outcome.result.financementMoyen;
  const remainderEuros = student
    ? stayEuros
    : outcome.result.perOpco.reduce((sum, line) => sum + line.racStudent * line.count, 0) / Math.max(1, outcome.result.totalStudents);
  const opcoLabel = student
    ? null
    : input.opcoId
      ? PUBLIC_OPCOS.find((opco) => opco.id === input.opcoId)?.label ?? null
      : "Pas encore identifié";
  const perPerson = input.mode === "groupe" ? " par personne" : "";
  const title = student ? "Ton séjour se prépare avec AMI." : "Dans la majorité des cas, ton séjour est financé.";
  const text = student
    ? `D’après nos informations, les aides les plus courantes accompagnent l’alternance. Pour ton séjour à ${input.destination}, le prix indicatif est de ${euros(stayEuros)}. Un reste à charge peut subsister, par exemple ${fundingExamplePhrase()}. AMI monte le dossier avec toi.`
    : `D’après nos informations, une prise en charge d’environ ${euros(fundingEuros ?? 0)}${perPerson} peut exister pour ${input.destination}. Il peut rester un reste à charge d’environ ${euros(remainderEuros)}${perPerson}. AMI monte le dossier avec toi.`;

  return {
    mode: input.mode,
    status: input.status,
    destination: input.destination,
    days: input.days,
    participants,
    opcoLabel,
    stayEuros,
    fundingEuros,
    remainderEuros,
    title,
    text,
    watchNote: fundingWatchNote,
  };
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
    `Prise en charge indicative : ${estimate.fundingEuros === null ? "non calculée (étudiant)" : `${Math.round(estimate.fundingEuros)} €`}`,
    `Reste à charge indicatif : ${Math.round(estimate.remainderEuros)} €`,
    estimate.text,
  ];
  return lines.join("\n");
}
