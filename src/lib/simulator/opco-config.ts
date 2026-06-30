// ──────────────────────────────────────────────────────────────
// Simulateur de financement mobilité — CONFIG OPCO (source unique)
// V1 EUROPE. Modifier les montants/règles UNIQUEMENT ici.
// status: "validated" = confirmé ; "to_confirm" = à valider avec Arnaud.
// Seed = logique de l'Excel opérationnel + corrections documentées.
// ──────────────────────────────────────────────────────────────
import type { FundingRule, OpcoConfig } from "./types";

// Famille "au réel" de l'Excel : transport réel + 6 €/nuitée.
// NB : la règle réelle de plusieurs de ces OPCO est plus riche
// (repas 3 €×2/j, assurances, plafond ~1 180 €). À granulariser après validation.
const realTransportPlusNight: FundingRule = {
  type: "composite",
  rules: [
    { type: "transportCoverage", mode: "real" },
    { type: "accommodationAllowance", perNight: 6 },
  ],
};

export const OPCOS: OpcoConfig[] = [
  {
    id: "akto",
    label: "AKTO",
    referentAmount: 500,
    apprenti: { type: "fixed", amount: 1000 },
    status: "to_confirm",
  },
  {
    id: "opco21",
    label: "OPCO 2i",
    referentAmount: 500,
    apprenti: { type: "fixed", amount: 800 },
    status: "to_confirm",
  },
  {
    id: "atlas",
    label: "ATLAS",
    referentAmount: 500,
    status: "validated",
    notes:
      "Barème confirmé par ATLAS (J. Schrader) — contrats signés à partir du 01/04/2026. Jours calendaires. < 15 j : non pris en charge. Mode de contrat : mise à disposition (maintien) ou mise en veille.",
    apprenti: {
      type: "tieredByDays",
      dayBasis: "calendar",
      select: {
        param: "atlasContractMode",
        default: "miseADisposition",
        options: ["miseADisposition", "miseEnVeille"],
      },
      bands: [
        { minDays: 0, maxDays: 14, amounts: { miseADisposition: 0, miseEnVeille: 0 } },
        { minDays: 15, maxDays: 30, amounts: { miseADisposition: 1000, miseEnVeille: 1500 } },
        { minDays: 31, maxDays: null, amounts: { miseADisposition: 1800, miseEnVeille: 2300 } },
      ],
    },
  },
  {
    id: "opcommerce",
    label: "OPCOMMERCE",
    referentAmount: 500,
    apprenti: { type: "fixed", amount: 0 },
    status: "to_confirm",
    notes: "Excel : 0 € apprenti. À confirmer (absence de prise en charge apprenti ?).",
  },
  {
    id: "ep",
    label: "OPCO EP (Entreprises de Proximité)",
    referentAmount: 500,
    status: "to_confirm",
    notes: "Forfait par semaine entamée (jours calendaires). Montant 500 €/semaine à confirmer.",
    apprenti: { type: "weeklyAllowance", perWeek: 500, basis: "daysStarted" },
  },
  {
    id: "afdas",
    label: "AFDAS",
    referentAmount: 400,
    apprenti: { type: "fixed", amount: 1000 },
    status: "to_confirm",
    notes: "Référent à 400 € dans l'Excel (vs 500 € standard) — à confirmer.",
  },
  {
    id: "constructys",
    label: "CONSTRUCTYS",
    referentAmount: 500,
    apprenti: realTransportPlusNight,
    status: "to_confirm",
    notes:
      "Règle réelle plus riche : forfait 500 + jusqu'à ~1 180 € (assurances + 6 €/nuitée + 3 €/repas) + 1 A/R éco. Seed = version simplifiée Excel.",
  },
  {
    id: "ocapiat",
    label: "OCAPIAT",
    referentAmount: 500,
    apprenti: realTransportPlusNight,
    status: "to_confirm",
    notes: "Règle réelle : repas (3 €×2/j) + nuitée (6 €) + transport, avec plafonds. Seed = version simplifiée Excel.",
  },
  {
    id: "opco_mobilites",
    label: "OPCO MOBILITÉS",
    referentAmount: 500,
    apprenti: realTransportPlusNight,
    status: "to_confirm",
  },
  {
    id: "cnfpt",
    label: "CNFPT",
    referentAmount: 0,
    apprenti: { type: "fixed", amount: 0 },
    status: "to_confirm",
    notes: "Aucun financement dans l'Excel.",
  },
  {
    id: "uniformation",
    label: "UNIFORMATION",
    referentAmount: 500,
    apprenti: realTransportPlusNight,
    status: "to_confirm",
  },
  {
    id: "opco_sante",
    label: "OPCO SANTÉ",
    referentAmount: 500,
    apprenti: realTransportPlusNight,
    status: "to_confirm",
    notes: "Prix au réel.",
  },
];

export const OPCO_BY_ID: Record<string, OpcoConfig> = Object.fromEntries(
  OPCOS.map((o) => [o.id, o])
);

// Hypothèses de coût par défaut (issues de l'Excel ; éditables côté UI).
export const COST_DEFAULTS = {
  programmeBase: 989, // coût programme AMI pour le format de référence 7 nuits
  programmePerExtraNight: 60, // + €/nuit au-delà de 7
  referenceNights: 7,
  transportDefault: 250, // billet avion/train estimé
  keptPerAccompagnant: 1750, // somme conservée par accompagnant (slider, 0–3000)
};

export function programmeCostForNights(nights: number): number {
  return (
    COST_DEFAULTS.programmeBase +
    Math.max(0, nights - COST_DEFAULTS.referenceNights) * COST_DEFAULTS.programmePerExtraNight
  );
}

// ──────────────────────────────────────────────────────────────
// Tarifs par destination — sélection auto du prix de vente (programme)
// et du billet estimé. Restent modifiables manuellement côté UI.
// `programme` = prix de vente AMI / étudiant (format de référence 8j/7n).
// `billets`   = coût transport (billet) estimé / étudiant.
// ──────────────────────────────────────────────────────────────
export type DestinationTariff = { programme: number; billets: number };
export const DESTINATION_TARIFFS: Record<string, DestinationTariff> = {
  "Montréal": { programme: 1059, billets: 650 },
  "Séville":  { programme: 989,  billets: 250 },
  "Londres":  { programme: 1389, billets: 250 },
  "Rome":     { programme: 989,  billets: 250 },
  "New York": { programme: 1489, billets: 600 },
  "Miami":    { programme: 1389, billets: 600 },
  "Séoul":    { programme: 1489, billets: 700 },
  "Malte":    { programme: 1189, billets: 300 },
  "Maroc":    { programme: 1089, billets: 400 },
  "Berlin":   { programme: 1389, billets: 200 },
};
export const DESTINATION_NAMES = Object.keys(DESTINATION_TARIFFS);

// Prix de vente conseillé pour une destination + nuitées (au-delà de 7 nuits : +€/nuit).
export function programmeForDestination(name: string, nights: number): number {
  const base = DESTINATION_TARIFFS[name]?.programme ?? COST_DEFAULTS.programmeBase;
  return base + Math.max(0, nights - COST_DEFAULTS.referenceNights) * COST_DEFAULTS.programmePerExtraNight;
}

// Contexte sectoriel des OPCO (faits publics stables) — pour expliquer chaque ligne.
// Les montants/règles de mobilité restent ceux du moteur (estimations, à confirmer).
export const OPCO_SECTORS: Record<string, string> = {
  akto: "Services à forte intensité de main-d'œuvre (propreté, sécurité, restauration, intérim). Soutient activement la mobilité internationale des alternants.",
  opco21: "Industrie (interindustriel). Frais annexes de mobilité pris en charge selon barème.",
  atlas: "Assurance, banque, finance et conseil. Barème mobilité confirmé selon la durée et le mode de contrat.",
  opcommerce: "Commerce et distribution.",
  ep: "Entreprises de proximité (artisanat, professions libérales, services). Forfait référent + frais éligibles (transport, hébergement, repas, assurance).",
  afdas: "Culture, médias, communication, loisirs et sport.",
  constructys: "Bâtiment et travaux publics. Prise en charge au réel (transport, hébergement, repas) avec plafond.",
  ocapiat: "Agriculture, agroalimentaire et pêche. Frais réels (repas, nuitées, transport) plafonnés.",
  opco_mobilites: "Transport, logistique, services de l'automobile et tourisme.",
  cnfpt: "Fonction publique territoriale.",
  uniformation: "Cohésion sociale (associatif, sport, ESS, aide à domicile).",
  opco_sante: "Secteur sanitaire, social et médico-social privé.",
};
