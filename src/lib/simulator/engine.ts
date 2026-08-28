// ──────────────────────────────────────────────────────────────
// Simulateur de financement mobilité, moteur de calcul (pur)
// Aucune dépendance, aucune valeur métier en dur : tout vient de
// la config OPCO. Chaque montant est accompagné d'une "trace"
// pour alimenter les explications « Pourquoi ce montant ? ».
// ──────────────────────────────────────────────────────────────
import type {
  FundingRule,
  OpcoConfig,
  RuleContext,
  SimInput,
} from "./types";

export interface RuleResult {
  amount: number;
  trace: string;
}

export function evaluateRule(rule: FundingRule, ctx: RuleContext): RuleResult {
  switch (rule.type) {
    case "fixed":
      return { amount: rule.amount, trace: `Forfait fixe : ${eur(rule.amount)}` };

    case "realCostCapped": {
      const variant = rule.select ? ctx.selections[rule.select.param] ?? rule.select.default : "default";
      const cap = typeof rule.cap === "number" ? rule.cap : rule.cap[variant] ?? rule.cap.default ?? 0;
      const a = Math.min(cap, ctx.eligibleMobilityCost);
      return { amount: a, trace: `Au réel plafonné : min(${eur(cap)} ; dépenses éligibles ${eur(ctx.eligibleMobilityCost)}) = ${eur(a)}` };
    }

    case "weeklyAllowance": {
      const weeks = Math.ceil(ctx.calendarDays / 7); // semaine entamée
      const variant = rule.select ? ctx.selections[rule.select.param] ?? rule.select.default : "default";
      const perWeek = typeof rule.perWeek === "number" ? rule.perWeek : rule.perWeek[variant] ?? rule.perWeek.default ?? 0;
      const cap = rule.cap === undefined ? undefined : typeof rule.cap === "number" ? rule.cap : rule.cap[variant] ?? rule.cap.default ?? 0;
      const raw = weeks * perWeek;
      const a = cap === undefined ? raw : Math.min(raw, cap);
      return { amount: a, trace: `${weeks} semaine(s) entamée(s) × ${eur(perWeek)}${cap !== undefined ? `, plafond ${eur(cap)}` : ""} = ${eur(a)} (${ctx.calendarDays} j)` };
    }

    case "dailyAllowance": {
      const days = rule.maxDays ? Math.min(ctx.calendarDays, rule.maxDays) : ctx.calendarDays;
      const a = days * rule.perDay;
      return { amount: a, trace: `${days} j × ${eur(rule.perDay)} = ${eur(a)}` };
    }

    case "mealAllowance": {
      const ceiling = ctx.calendarDays * rule.mealsPerDay * rule.perMeal;
      const a = Math.min(ceiling, ctx.mealsCost);
      return { amount: a, trace: `Repas : min(${eur(ceiling)} ; dépenses déclarées ${eur(ctx.mealsCost)}) = ${eur(a)}` };
    }

    case "accommodationAllowance": {
      const ceiling = ctx.nights * rule.perNight;
      const a = Math.min(ceiling, ctx.accommodationCost);
      return { amount: a, trace: `Hébergement : min(${eur(ceiling)} ; dépenses déclarées ${eur(ctx.accommodationCost)}) = ${eur(a)}` };
    }

    case "transportCoverage": {
      const a = rule.mode === "real" ? ctx.transportCost : rule.amount ?? 0;
      return { amount: a, trace: rule.mode === "real" ? `Transport au réel : ${eur(a)}` : `Transport forfait : ${eur(a)}` };
    }

    case "tieredByDays": {
      const d = rule.dayBasis === "nights" ? ctx.nights : ctx.calendarDays;
      const band = rule.bands.find((b) => d >= b.minDays && (b.maxDays === null || d <= b.maxDays));
      const variant = rule.select ? ctx.selections[rule.select.param] ?? rule.select.default : "default";
      const a = band ? band.amounts[variant] ?? band.amounts["default"] ?? 0 : 0;
      const label = band ? `de ${band.minDays} à ${band.maxDays ?? "∞"} jours` : "hors barème";
      const basis = rule.dayBasis === "nights" ? "nuits" : "jours calendaires";
      return { amount: a, trace: `Barème ${basis} (${d} j) → ${label}${rule.select ? ` · ${variant}` : ""} = ${eur(a)}` };
    }

    case "composite": {
      const parts = rule.rules.map((r) => evaluateRule(r, ctx));
      let sum = parts.reduce((s, p) => s + p.amount, 0);
      let capNote = "";
      if (rule.cap !== undefined && sum > rule.cap) {
        sum = rule.cap;
        capNote = ` → plafonné à ${eur(rule.cap)}`;
      }
      return { amount: sum, trace: parts.map((p) => p.trace).join(" + ") + capNote };
    }
  }
}

/** Financement apprenti pour un OPCO, en tenant compte d'une éventuelle condition d'éligibilité. */
export function apprentiFunding(cfg: OpcoConfig, ctx: RuleContext): RuleResult {
  if (cfg.minNights !== undefined && ctx.nights < cfg.minNights) {
    return { amount: 0, trace: `Non éligible (séjour < ${cfg.minNights} nuits)` };
  }
  return evaluateRule(cfg.apprenti, ctx);
}

export interface OpcoLine {
  id: string;
  label: string;
  count: number;
  status: OpcoConfig["status"];
  apprentiAmount: number;
  apprentiTrace: string;
  referentAmount: number;
  racStudent: number;
  apprentiTotal: number;
  referentTotal: number;
  racTotal: number;
}

export interface SimResult {
  totalCostPerStudent: number;
  totalCostAll: number;
  totalStudents: number;
  perOpco: OpcoLine[];
  apprentiTotal: number; // financements OPCO apprentis
  referentTotal: number; // financements référent mobilité
  keptTotal: number; // conservé par l'école
  reinjected: number; // réinjecté pour réduire le RAC
  unusedReferent: number; // reliquat référent non affecté au RAC dans cette simulation
  racBeforeTotal: number; // RAC total avant réinjection
  racFinalTotal: number; // RAC total final
  racAvg: number; // KPI : RAC moyen / étudiant
  financementMoyen: number; // financement apprenti moyen / étudiant
  schoolImpact: number; // > 0 = excédent conservé ; < 0 = à charge école
}

export function computeSimulation(input: SimInput): SimResult {
  const { stay, rows } = input;
  const totalCost = stay.programmeCost + stay.transportCost;
  const ctx: RuleContext = {
    nights: stay.nights,
    calendarDays: stay.nights + 1,
    programmeCost: stay.programmeCost,
    transportCost: stay.transportCost,
    accommodationCost: stay.accommodationCost,
    mealsCost: stay.mealsCost,
    totalCost,
    eligibleMobilityCost: stay.transportCost + stay.accommodationCost + stay.mealsCost,
    selections: input.selections ?? {},
  };

  const perOpco: OpcoLine[] = rows.map(({ config, count }) => {
    const f = apprentiFunding(config, ctx);
    const referent = evaluateRule(config.referent, ctx).amount;
    const racStudent = totalCost - f.amount;
    return {
      id: config.id,
      label: config.label,
      count,
      status: config.status,
      apprentiAmount: f.amount,
      apprentiTrace: f.trace,
      referentAmount: referent,
      racStudent,
      apprentiTotal: f.amount * count,
      referentTotal: referent * count,
      racTotal: racStudent * count,
    };
  });

  const totalStudents = rows.reduce((s, r) => s + r.count, 0);
  const apprentiTotal = perOpco.reduce((s, o) => s + o.apprentiTotal, 0);
  const referentTotal = perOpco.reduce((s, o) => s + o.referentTotal, 0);
  const racBeforeTotal = perOpco.reduce((s, o) => s + o.racTotal, 0);

  // L'école ne peut pas conserver plus que le total référent perçu.
  const keptTotal = Math.max(0, Math.min(input.keptTotal, referentTotal));
  const plannedReinjection = referentTotal - keptTotal;
  const reinjected = Math.min(plannedReinjection, racBeforeTotal);
  const unusedReferent = plannedReinjection - reinjected;
  const racFinalTotal = Math.max(0, racBeforeTotal - reinjected);
  const racAvg = totalStudents ? racFinalTotal / totalStudents : 0;
  const financementMoyen = totalStudents ? apprentiTotal / totalStudents : 0;

  return {
    totalCostPerStudent: totalCost,
    totalCostAll: totalCost * totalStudents,
    totalStudents,
    perOpco,
    apprentiTotal,
    referentTotal,
    keptTotal,
    reinjected,
    unusedReferent,
    racBeforeTotal,
    racFinalTotal,
    racAvg,
    financementMoyen,
    schoolImpact: keptTotal,
  };
}

// ── Modes d'optimisation : déterminent le montant conservé par l'école ──
export type OptimizationMode =
  | { kind: "free"; keptPerAccompagnant: number; accompagnants: number }
  | { kind: "maxReduction" }
  | { kind: "coverSupport"; supportBudget: number }
  | { kind: "targetRac"; targetPerStudent: number };

export interface BaseTotals {
  referentTotal: number;
  racBeforeTotal: number;
  totalStudents: number;
}

/** Totaux indépendants du montant conservé (référent + RAC avant réinjection). */
export function baseTotals(input: Omit<SimInput, "keptTotal">): BaseTotals {
  const r = computeSimulation({ ...input, keptTotal: 0 });
  return {
    referentTotal: r.referentTotal,
    racBeforeTotal: r.racBeforeTotal,
    totalStudents: r.totalStudents,
  };
}

/** Montant conservé par l'école selon le mode choisi. */
export function resolveKeptTotal(mode: OptimizationMode, b: BaseTotals): number {
  switch (mode.kind) {
    case "free":
      return Math.max(0, mode.keptPerAccompagnant * mode.accompagnants);
    case "maxReduction":
      return 0; // réinjecte tout le référent → RAC étudiant minimal
    case "coverSupport":
      return Math.max(0, Math.min(b.referentTotal, mode.supportBudget));
    case "targetRac": {
      const reinjectNeeded = b.racBeforeTotal - mode.targetPerStudent * b.totalStudents;
      const kept = b.referentTotal - reinjectNeeded;
      return Math.max(0, Math.min(b.referentTotal, kept));
    }
  }
}

function eur(n: number): string {
  return `${Math.round(n).toLocaleString("fr-FR")} €`;
}
