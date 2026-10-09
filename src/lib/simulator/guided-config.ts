// ──────────────────────────────────────────────────────────────
// Simulation guidée, HYPOTHÈSES ET VALEURS PAR DÉFAUT (source unique)
// Tout ce que le parcours guidé suppose à la place de l'utilisateur vit
// ici, jamais dans un composant. Les règles et montants OPCO restent
// dans opco-config.ts : ce fichier ne contient aucun barème officiel.
// ──────────────────────────────────────────────────────────────
import { COST_DEFAULTS, DESTINATION_TARIFFS } from "./opco-config";

/** Terme unique employé dans tout le parcours guidé. */
export const PARTICIPANT_WORD = { one: "participant", many: "participants" } as const;

/** En dessous de ce seuil, un séjour indépendant doit être validé avec l'équipe. */
export const MIN_INDEPENDENT_GROUP = 20;
export const DEFAULT_PARTICIPANTS = 20;
export const MAX_PARTICIPANTS = 400;

/** Recommandation indicative, jamais une obligation. */
export const COMPANION_BANDS: { maxParticipants: number | null; companions: number }[] = [
  { maxParticipants: 35, companions: 1 },
  { maxParticipants: 70, companions: 2 },
  { maxParticipants: null, companions: 3 },
];

// ── Durée ─────────────────────────────────────────────────────
/** Durées proposées, en jours calendaires. Le moteur attend des nuitées (jours − 1). */
export const DURATION_CHOICES: { days: number; label: string; orMore?: boolean }[] = [
  { days: 5, label: "5 jours" },
  { days: 7, label: "7 jours" },
  { days: 8, label: "8 jours" },
  { days: 14, label: "14 jours" },
  { days: 15, label: "15 jours ou plus", orMore: true },
];
export const MAX_DURATION_DAYS = 60;
/**
 * Durée supposée quand l'utilisateur ne la connaît pas : le format de
 * référence du tarif programme (COST_DEFAULTS.referenceNights nuitées).
 * Toujours affichée comme une hypothèse modifiable.
 */
export const DEFAULT_UNKNOWN_DURATION_DAYS = COST_DEFAULTS.referenceNights + 1;

// ── Destination non choisie ───────────────────────────────────
export type GuidedZoneId = "europe" | "northAmerica" | "international" | "advice";

/**
 * Regroupement géographique des destinations du catalogue, pour l'écran
 * « Pas encore ». Les tarifs restent lus dans DESTINATION_TARIFFS : on en
 * fait la moyenne, on ne saisit aucun prix ici.
 * `fundingZone` est la zone transmise aux barèmes OPCO. Pour « Je souhaite
 * être conseillé », on retient l'Europe, zone la moins financée : prudence.
 */
export const GUIDED_ZONES: Record<GuidedZoneId, { label: string; short: string; destinations: string[]; fundingZone: "europe" | "international" }> = {
  europe: {
    label: "Europe",
    short: "Europe",
    destinations: Object.keys(DESTINATION_TARIFFS).filter((name) => DESTINATION_TARIFFS[name].zone === "europe"),
    fundingZone: "europe",
  },
  northAmerica: {
    label: "Amérique du Nord",
    short: "Amérique du Nord",
    destinations: ["Montréal", "New York", "Miami"].filter((name) => name in DESTINATION_TARIFFS),
    fundingZone: "international",
  },
  international: {
    label: "International / autre",
    short: "International",
    destinations: Object.keys(DESTINATION_TARIFFS).filter((name) => DESTINATION_TARIFFS[name].zone === "international" && !["Montréal", "New York", "Miami"].includes(name)),
    fundingZone: "international",
  },
  advice: {
    label: "Je souhaite être conseillé",
    short: "À définir avec AMI Panorama",
    destinations: Object.keys(DESTINATION_TARIFFS),
    fundingZone: "europe",
  },
};

/** Visuels déjà présents dans /public. Aucune ressource externe. */
export const DESTINATION_PHOTOS: Record<string, string> = {
  "Montréal": "/Assets/groups/montreal-sunset.jpg",
  "Séville": "/Assets/groups/seville-park.jpg",
  "Londres": "/Assets/groups/london-bridge.jpg",
  "Rome": "/Assets/groups/rome-square.jpg",
  "New York": "/Assets/groups/newyork-pano.jpg",
  "Miami": "/Assets/destinations/Miami-unsplash.jpg",
  "Malte": "/Assets/groups/malta-main.jpg",
  "Maroc": "/Assets/destinations/Maroc.jpg",
  "Berlin": "/Assets/groups/berlin-main.jpg",
};

// ── OPCO encore inconnus ──────────────────────────────────────
/**
 * Estimation appliquée aux participants dont l'OPCO n'est pas connu. Affichée sous le nom
 * « estimation indicative basée sur les barèmes OPCO disponibles » : ne jamais la présenter comme une
 * « moyenne AMI Panorama », ce qui laisserait croire qu'elle provient des départs réels.
 *
 * ⚠️ À VALIDER PAR L'ÉQUIPE AMI PANORAMA.
 * Aucune moyenne historique validée n'existe dans le projet à ce jour.
 * Tant que `source` vaut "opcoRulesMean", aucun montant n'est saisi ici :
 * l'estimation est la moyenne simple, calculée par le moteur pour le séjour
 * simulé, des barèmes des OPCO au statut « validated » de opco-config.ts.
 * Ce n'est PAS une moyenne observée sur des départs réels.
 *
 * Pour brancher la moyenne observée sur les départs AMI Panorama :
 *   1. passer `source` à "observed" ;
 *   2. renseigner `fundingPerParticipant` et `referentPerParticipant` ;
 *   3. passer `validatedByAmi` à true une fois la valeur relue.
 * Ou fournir un autre objet à `resolveUnknownOpcoAverage` (guided.ts), par
 * exemple calculé à partir d'une base de départs réels.
 */
export type UnknownOpcoAverage = {
  source: "opcoRulesMean" | "observed";
  /** Financement moyen par participant, en euros. Ignoré si source = "opcoRulesMean". */
  fundingPerParticipant: number | null;
  /** Forfait référent moyen par participant, en euros. Ignoré si source = "opcoRulesMean". */
  referentPerParticipant: number | null;
  validatedByAmi: boolean;
};

export const DEFAULT_UNKNOWN_OPCO_AVERAGE: UnknownOpcoAverage = {
  source: "opcoRulesMean",
  fundingPerParticipant: null,
  referentPerParticipant: null,
  validatedByAmi: false,
};

/** Identifiant interne de la ligne « OPCO encore inconnu ». N'existe pas dans OPCOS. */
export const UNKNOWN_OPCO_ID = "unknown_opco";
export const UNKNOWN_OPCO_LABEL = "OPCO encore inconnu";

// ── Valeurs prudentes reprises du mode avancé ─────────────────
/** Mêmes valeurs initiales que SimulatorApp : le premier résultat guidé ne s'en écarte pas. */
export const DEFAULT_REFINEMENTS = {
  atlasContractMode: "miseADisposition",
  atlasBeforeApril2026: 0,
  aktoContractMode: "miseADisposition",
  aktoTrainingLevel: "postBac",
  afdasTrainingLevel: "postBac",
  epContractMode: "miseADisposition",
  opcoMobilitesBefore2026: 0,
} as const;

/**
 * Part hébergement et repas retenue pour les OPCO qui remboursent au réel.
 * Identique à l'estimation interne du mode avancé (plafonds de 6 € par nuit
 * et de 3 € par repas, deux repas par jour).
 */
export function defaultEligibleCosts(nights: number): { accommodation: number; meals: number; other: number } {
  return { accommodation: nights * 6, meals: (nights + 1) * 2 * 3, other: 0 };
}

export const GUIDED_STORAGE_KEY = "ami_simulator_guided_v1";
