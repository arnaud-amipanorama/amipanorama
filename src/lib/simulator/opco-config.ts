// ──────────────────────────────────────────────────────────────
// Simulateur de financement mobilité — CONFIG OPCO (source unique)
// Les montants reflètent les sources listées sous chaque OPCO et leur
// date de contrôle. « À confirmer » = ne pas présenter comme acquis.
// Le moteur ne doit jamais assimiler le prix AMI à une dépense éligible.
// ──────────────────────────────────────────────────────────────
import type { FundingRule, OpcoConfig } from "./types";

const checkedAt = "28/07/2026";
const realMobilityCosts: FundingRule = {
  type: "composite",
  rules: [
    { type: "transportCoverage", mode: "real" },
    { type: "accommodationAllowance", perNight: 6 },
    { type: "mealAllowance", perMeal: 3, mealsPerDay: 2 },
  ],
};

export const OPCOS: OpcoConfig[] = [
  {
    id: "akto", label: "AKTO",
    referent: { type: "tieredByDays", dayBasis: "calendar", select: { param: "aktoTrainingLevel", default: "postBac", options: ["postBac", "bacOrBelow"] }, bands: [{ minDays: 0, maxDays: null, amounts: { postBac: 500, bacOrBelow: 600 } }] },
    apprenti: { type: "tieredByDays", dayBasis: "calendar", select: { param: "aktoFunding", default: "international_miseADisposition", options: ["euro_miseADisposition", "international_miseADisposition", "euro_miseEnVeille", "international_miseEnVeille"] }, bands: [{ minDays: 0, maxDays: null, amounts: { euro_miseADisposition: 1000, international_miseADisposition: 1500, euro_miseEnVeille: 1500, international_miseEnVeille: 2500 } }] },
    status: "validated",
    notes: "Une mobilité par alternant et par contrat ; convention signée et mobilité effective requises.",
    source: { label: "AKTO — mobilité internationale", url: "https://www.akto.fr/akto-soutient-la-mobilite-internationale-des-alternants/", checkedAt },
  },
  {
    id: "opco21", label: "OPCO 2i",
    referent: { type: "fixed", amount: 500 },
    apprenti: { type: "tieredByDays", dayBasis: "calendar", bands: [{ minDays: 0, maxDays: 28, amounts: { default: 800 } }, { minDays: 29, maxDays: null, amounts: { default: 1600 } }] },
    status: "validated",
    notes: "Au réel, plafonné par alternant et contrat ; cas particulier IEG à gérer hors simulateur.",
    source: { label: "OPCO 2i — fiche pratique CFA", url: "https://www.opco2i.fr/la-mobilite-internationale-un-levier-dattractivite-pour-les-formations-industrielles/", checkedAt },
  },
  {
    id: "atlas", label: "ATLAS",
    referent: { type: "fixed", amount: 500 },
    status: "validated",
    notes: "Contrats conclus dès le 01/04/2026. Minimum 15 jours calendaires ; convention de mobilité à transmettre avant le départ.",
    source: { label: "Atlas — mobilité internationale", url: "https://www.opco-atlas.fr/mobilite-europeenne-internationale-alternants.html", checkedAt },
    apprenti: { type: "tieredByDays", dayBasis: "calendar", select: { param: "atlasContractMode", default: "miseADisposition", options: ["miseADisposition", "miseEnVeille"] }, bands: [
      { minDays: 0, maxDays: 14, amounts: { miseADisposition: 0, miseEnVeille: 0 } },
      { minDays: 15, maxDays: 30, amounts: { miseADisposition: 1000, miseEnVeille: 1500 } },
      { minDays: 31, maxDays: null, amounts: { miseADisposition: 1800, miseEnVeille: 2500 } },
    ] },
  },
  {
    id: "opcommerce", label: "OPCOMMERCE",
    referent: { type: "fixed", amount: 500 }, apprenti: { type: "fixed", amount: 0 }, status: "to_confirm",
    notes: "Financement apprenti volontairement neutralisé : barème 2026 spécifique à confirmer avec le conseiller OPCO.",
  },
  {
    id: "ep", label: "OPCO EP (Entreprises de Proximité)",
    referent: { type: "fixed", amount: 500 },
    apprenti: { type: "weeklyAllowance", basis: "daysStarted", select: { param: "epContractMode", default: "miseADisposition", options: ["miseADisposition", "miseEnVeille"] }, perWeek: { miseADisposition: 500, miseEnVeille: 300 }, cap: { miseADisposition: 2000, miseEnVeille: 3000 } },
    status: "validated",
    notes: "Forfait par semaine entamée, appliqué par le moteur selon le mode de convention : 500 €/semaine plafonné 2 000 € (mise à disposition) ; 300 €/semaine plafonné 3 000 € (mise en veille).",
    source: { label: "OPCO EP — fiche mobilité, mars 2026", url: "https://www.opcoep.fr/ressources/centre-ressources/fiche/Fiche-mobilite-europeenne-internationale-opcoep.pdf", checkedAt },
  },
  {
    id: "afdas", label: "AFDAS",
    referent: { type: "fixed", amount: 400 }, apprenti: { type: "fixed", amount: 1000 }, status: "to_confirm",
    notes: "Le montant et les conditions de durée/zone doivent être confirmés sur le barème applicable au contrat avant utilisation commerciale.",
  },
  {
    id: "constructys", label: "CONSTRUCTYS",
    referent: { type: "fixed", amount: 500 }, apprenti: { type: "composite", rules: realMobilityCosts.type === "composite" ? realMobilityCosts.rules : [], cap: 1180 }, status: "validated",
    notes: "Plafond 1 180 € : dépenses exposées par le CFA, programme de formation et convention spécifique requis.",
    source: { label: "Constructys — critères CFA", url: "https://www.constructys.fr/cfa-informations-criteres-de-prise-en-charge-financiere-et-modalites-de-facturation-des-contrats-dapprentissage/", checkedAt },
  },
  {
    id: "ocapiat", label: "OCAPIAT",
    referent: { type: "fixed", amount: 500 }, apprenti: realMobilityCosts, status: "validated",
    notes: "Au réel sur dépenses supportées par le CFA ; un A/R par stagiaire. Prévision à inscrire dans la convention, justificatifs à conserver.",
    source: { label: "OCAPIAT — FAQ organisme", url: "https://capverslalternance.ocapiat.fr/faq-organisme/", checkedAt },
  },
  {
    id: "opco_mobilites", label: "OPCO MOBILITÉS",
    referent: { type: "fixed", amount: 500 },
    apprenti: { type: "realCostCapped", cap: { europe: 1500, international: 2000 }, select: { param: "destinationZone", default: "international", options: ["europe", "international"] } }, status: "validated",
    notes: "Le plafond dépend de la zone : Europe 1 500 € HT, international 2 000 € HT. Le sélecteur de zone est appliqué dans le moteur.",
    source: { label: "OPCO Mobilités — modalités 2026", url: "https://www.opcomobilites.fr/financer-un-contrat-dapprentissage-autres-conventions-collectives-ou-sans-convention-collective-drom/", checkedAt },
  },
  {
    id: "cnfpt", label: "CNFPT",
    referent: { type: "fixed", amount: 0 }, apprenti: { type: "fixed", amount: 0 }, status: "to_confirm",
    notes: "Hors périmètre OPCO : pas de règle de financement modélisée.",
  },
  {
    id: "uniformation", label: "UNIFORMATION",
    referent: { type: "fixed", amount: 500 }, apprenti: realMobilityCosts, status: "validated",
    notes: "Dépenses supportées par le CFA, chiffrées au démarrage et intégrées à la convention initiale.",
    source: { label: "Uniformation — frais annexes 2026", url: "https://www.uniformation.fr/entreprise/financements/frais-annexes-et-couts-pedagogiques", checkedAt },
  },
  {
    id: "opco_sante", label: "OPCO SANTÉ",
    referent: { type: "fixed", amount: 500 }, apprenti: realMobilityCosts, status: "to_confirm",
    notes: "Référent, repas, nuitées et vaccins sont documentés. Le transport doit être confirmé selon la branche/contrat concerné.",
    source: { label: "OPCO Santé — synthèse hors branche", url: "https://www.opco-sante.fr/app/uploads/2025/11/opco0226_synthese-des-prise-en-charge-hors-branche_pdf_site.pdf", checkedAt },
  },
];

export const OPCO_BY_ID: Record<string, OpcoConfig> = Object.fromEntries(OPCOS.map((o) => [o.id, o]));

export const COST_DEFAULTS = { programmeBase: 989, programmePerExtraNight: 60, referenceNights: 7, transportDefault: 250, keptPerAccompagnant: 1750 };
export function programmeCostForNights(nights: number): number { return COST_DEFAULTS.programmeBase + Math.max(0, nights - COST_DEFAULTS.referenceNights) * COST_DEFAULTS.programmePerExtraNight; }

export type DestinationTariff = { programme: number; billets: number; zone: "europe" | "international" };
export const DESTINATION_TARIFFS: Record<string, DestinationTariff> = {
  "Montréal": { programme: 1059, billets: 650, zone: "international" }, "Séville": { programme: 989, billets: 250, zone: "europe" },
  "Londres": { programme: 1389, billets: 250, zone: "europe" }, "Rome": { programme: 989, billets: 250, zone: "europe" },
  "New York": { programme: 1489, billets: 600, zone: "international" }, "Miami": { programme: 1389, billets: 600, zone: "international" },
  "Séoul": { programme: 1489, billets: 700, zone: "international" }, "Malte": { programme: 1189, billets: 300, zone: "europe" },
  "Maroc": { programme: 1089, billets: 400, zone: "international" }, "Berlin": { programme: 1389, billets: 200, zone: "europe" },
};
export const DESTINATION_NAMES = Object.keys(DESTINATION_TARIFFS);
export function programmeForDestination(name: string, nights: number): number { const base = DESTINATION_TARIFFS[name]?.programme ?? COST_DEFAULTS.programmeBase; return base + Math.max(0, nights - COST_DEFAULTS.referenceNights) * COST_DEFAULTS.programmePerExtraNight; }

export const OPCO_SECTORS: Record<string, string> = {
  akto: "Services à forte intensité de main-d'œuvre (propreté, sécurité, restauration, intérim).", opco21: "Industrie (interindustriel).", atlas: "Assurance, banque, finance et conseil.", opcommerce: "Commerce et distribution.", ep: "Entreprises de proximité.", afdas: "Culture, médias, communication, loisirs et sport.", constructys: "Bâtiment et travaux publics.", ocapiat: "Agriculture, agroalimentaire et pêche.", opco_mobilites: "Transport, logistique, automobile et tourisme.", cnfpt: "Fonction publique territoriale.", uniformation: "Cohésion sociale, associatif et ESS.", opco_sante: "Sanitaire, social et médico-social privé.",
};

export type FundingExplanationInput = {
  calendarDays: number;
  destinationZone: "europe" | "international";
  aktoContractMode: "miseADisposition" | "miseEnVeille";
  aktoTrainingLevel: "postBac" | "bacOrBelow";
  atlasContractMode: "miseADisposition" | "miseEnVeille";
  epContractMode: "miseADisposition" | "miseEnVeille";
  amount: number;
};

/** Texte destiné au CFA : jamais de formule interne ou de code de moteur. */
export function explainFunding(id: string, input: FundingExplanationInput): { how: string; condition: string } {
  const euro = input.destinationZone === "europe";
  const modeLabel = input.aktoContractMode === "miseADisposition" ? "mise à disposition" : "mise en veille";
  const atlasModeLabel = input.atlasContractMode === "miseADisposition" ? "mise à disposition" : "mise en veille";
  const epModeLabel = input.epContractMode === "miseADisposition" ? "mise à disposition" : "mise en veille";
  const amount = `${Math.round(input.amount).toLocaleString("fr-FR")} €`;

  switch (id) {
    case "akto":
      return { how: `AKTO prévoit un forfait de ${amount} par alternant pour cette destination et une convention de ${modeLabel}.`, condition: `À vérifier : convention signée, mobilité effectivement réalisée et une mobilité maximum par alternant/contrat. Le forfait référent est de ${input.aktoTrainingLevel === "bacOrBelow" ? "600" : "500"} € par alternant.` };
    case "opco21":
      return { how: `OPCO 2i peut rembourser les frais de mobilité du CFA, dans la limite estimée de ${amount} par alternant.`, condition: input.calendarDays <= 28 ? "Ce plafond concerne les mobilités de 28 jours ou moins. Les dépenses et justificatifs restent déterminants." : "Ce plafond concerne les mobilités de 29 jours ou plus. Les dépenses et justificatifs restent déterminants." };
    case "atlas":
      if (input.calendarDays < 15) return { how: "ATLAS ne prévoit pas de financement apprenti pour ce format : la mobilité doit durer au minimum 15 jours calendaires.", condition: "Le forfait référent mobilité de 500 € par alternant reste à traiter selon le dossier. Une convention signée est nécessaire avant le départ." };
      return { how: `ATLAS prévoit un forfait de ${amount} par alternant pour une mobilité de ${input.calendarDays} jours en ${atlasModeLabel}.`, condition: "Le contrat doit relever des règles applicables depuis le 1er avril 2026 ; convention de mobilité et justificatifs à conserver." };
    case "opcommerce":
      return { how: "Aucun financement apprenti n’est retenu dans cette simulation.", condition: "Le barème applicable doit être confirmé avec le conseiller OPCOMMERCE avant de compter sur une prise en charge." };
    case "ep":
      return { how: `OPCO EP fonctionne par forfait hebdomadaire : l’estimation est de ${amount} par alternant pour une ${epModeLabel}.`, condition: `Toute semaine commencée compte. Le plafond dépend de la convention : 2 000 € en mise à disposition, 3 000 € en mise en veille.` };
    case "afdas":
      return { how: `Une estimation provisoire de ${amount} par alternant est affichée.`, condition: "Ne la présentez pas comme acquise : le barème AFDAS, la destination, la durée et le dossier doivent être confirmés avant toute décision." };
    case "constructys":
      return { how: `Constructys rembourse les dépenses de mobilité réellement supportées par le CFA, jusqu’à ${amount} par alternant dans cette simulation.`, condition: "Le plafond est de 1 180 € et couvre notamment le voyage, l’hébergement et les repas, sous réserve d’un programme de formation et d’une convention spécifique." };
    case "ocapiat":
      return { how: `OCAPIAT rembourse les dépenses réellement supportées par le CFA ; l’estimation affichée est de ${amount} par alternant.`, condition: "Prévoir les dépenses dans la convention, conserver les factures et vérifier le transport autorisé. Le forfait référent est de 500 € par alternant." };
    case "opco_mobilites":
      return { how: `OPCO Mobilités rembourse les frais de transport, d’hébergement et de restauration supportés par le CFA, jusqu’à ${amount} par alternant.`, condition: `Plafond appliqué : ${euro ? "1 500 € HT en Europe" : "2 000 € HT à l’international"}. Une mobilité par alternant et par contrat ; convention signée requise.` };
    case "cnfpt":
      return { how: "Aucun financement n’est calculé : le CNFPT n’est pas un OPCO dans ce simulateur.", condition: "Le projet doit être étudié via les dispositifs propres à la fonction publique territoriale." };
    case "uniformation":
      return { how: `Uniformation peut prendre en charge les frais réellement supportés par le CFA ; l’estimation affichée est de ${amount} par alternant.`, condition: "Les dépenses doivent être chiffrées dès le départ et intégrées à la convention de formation. Le forfait référent est de 500 € par contrat." };
    case "opco_sante":
      return { how: `Une estimation de ${amount} par alternant est affichée selon les plafonds de repas et de nuitées connus.`, condition: "Le transport et le barème précis dépendent de la branche et du contrat : validation avec OPCO Santé indispensable avant de compter ce montant." };
    default:
      return { how: `Estimation affichée : ${amount} par alternant.`, condition: "Les modalités de prise en charge doivent être confirmées avec l’OPCO." };
  }
}
