// ──────────────────────────────────────────────────────────────
// Simulateur de financement mobilité, types du moteur (V1 Europe)
// Moteur "config-driven" : chaque OPCO décrit ses mécanismes de
// financement via des règles composables. Aucune valeur en dur
// dans le moteur, tout vit dans opco-config.ts (DB-ready).
// ──────────────────────────────────────────────────────────────

export type Coverage = "transport" | "hebergement" | "repas" | "assurance";

/** Contexte d'évaluation d'une règle, pour un séjour donné. */
export interface RuleContext {
  nights: number; // nuitées sur place
  calendarDays: number; // jours calendaires (= nuitées + 1 par défaut)
  programmeCost: number; // coût programme AMI / étudiant
  transportCost: number; // billet avion/train / étudiant
  accommodationCost: number; // part hébergement réellement supportée par le CFA
  mealsCost: number; // part restauration réellement supportée par le CFA
  totalCost: number; // programme + transport (reste à charge commercial)
  eligibleMobilityCost: number; // transport + hébergement + repas déclarés au réel
  selections: Record<string, string>; // ex. { atlasContractMode: "miseADisposition" }
}

/** Une règle de financement. Plusieurs mécanismes, combinables via "composite". */
export type FundingRule =
  | { type: "fixed"; amount: number }
  | { type: "realCostCapped"; cap: number | Record<string, number>; covers?: Coverage[]; select?: { param: string; default: string; options: string[] } }
  | { type: "weeklyAllowance"; perWeek: number | Record<string, number>; basis: "daysStarted"; cap?: number | Record<string, number>; select?: { param: string; default: string; options: string[] } }
  | { type: "dailyAllowance"; perDay: number; maxDays?: number }
  | { type: "mealAllowance"; perMeal: number; mealsPerDay: number }
  | { type: "accommodationAllowance"; perNight: number }
  | { type: "transportCoverage"; mode: "real" | "fixed"; amount?: number }
  | {
      type: "tieredByDays";
      dayBasis: "calendar" | "nights";
      // sélecteur optionnel (ex. mode de contrat ATLAS) → plusieurs montants par palier
      select?: { param: string; default: string; options: string[] };
      bands: { minDays: number; maxDays: number | null; amounts: Record<string, number> }[];
    }
  | { type: "composite"; rules: FundingRule[]; cap?: number };

export interface OpcoConfig {
  id: string;
  label: string;
  referent: FundingRule; // financement référent mobilité / contrat
  apprenti: FundingRule; // financement apprenti
  minNights?: number; // condition d'éligibilité éventuelle (sinon 0)
  status: "validated" | "to_confirm";
  notes?: string;
  source?: { label: string; url: string; checkedAt: string };
}

export interface StayParams {
  nights: number;
  programmeCost: number;
  transportCost: number;
  accommodationCost: number;
  mealsCost: number;
}

export interface OpcoRow {
  config: OpcoConfig;
  count: number; // nombre d'apprentis rattachés à cet OPCO
}

export interface SimInput {
  stay: StayParams;
  rows: OpcoRow[];
  keptTotal: number; // somme conservée par l'école (réinjection = référent total − keptTotal)
  selections?: Record<string, string>;
}
