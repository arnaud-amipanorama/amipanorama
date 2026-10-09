import { describe, expect, it } from "vitest";
import { computeSimulation } from "./engine";
import { COST_DEFAULTS, DESTINATION_NAMES, DESTINATION_TARIFFS, OPCOS, programmeForDestination } from "./opco-config";
import { DEFAULT_UNKNOWN_DURATION_DAYS, DEFAULT_UNKNOWN_OPCO_AVERAGE, MIN_INDEPENDENT_GROUP, UNKNOWN_OPCO_ID } from "./guided-config";
import {
  INITIAL_GUIDED_ANSWERS,
  advancedToGuided,
  buildGuidedOutcome,
  daysToNights,
  firstInvalidStep,
  guidedToAdvanced,
  guidedToSimInput,
  isSmallGroup,
  recommendedCompanions,
  resolveTransport,
  reviveGuidedAnswers,
  unknownOpcoCount,
  validateStep,
  type GuidedAnswers,
} from "./guided";

/** Parcours complet et valide : Séville, 8 jours, 24 participants, OPCO connus, pas de devis. */
const complete = (patch: Partial<GuidedAnswers> = {}): GuidedAnswers => ({
  ...INITIAL_GUIDED_ANSWERS,
  destinationKnown: "yes",
  destination: "Séville",
  durationDays: 8,
  participants: 24,
  opcoKnowledge: "all",
  opcoRows: [{ id: "akto", count: 14 }, { id: "afdas", count: 10 }],
  transportQuote: "no",
  ...patch,
});

describe("taille du groupe", () => {
  it("signale un groupe inférieur à 20 participants, sans bloquer", () => {
    expect(isSmallGroup(MIN_INDEPENDENT_GROUP - 1)).toBe(true);
    const answers = complete({ participants: 12, opcoRows: [{ id: "akto", count: 12 }] });
    expect(validateStep("participants", answers)).toBeNull();
    expect(firstInvalidStep(answers)).toBeNull();
    expect(buildGuidedOutcome(answers).smallGroup).toBe(true);
  });

  it("ne signale rien pour un groupe de 20 participants", () => {
    expect(isSmallGroup(20)).toBe(false);
    expect(buildGuidedOutcome(complete({ participants: 20, opcoRows: [{ id: "akto", count: 20 }] })).smallGroup).toBe(false);
  });
});

describe("accompagnateurs recommandés", () => {
  it("1 accompagnateur jusqu’à 35 participants", () => {
    expect([1, 20, 35].map(recommendedCompanions)).toEqual([1, 1, 1]);
  });
  it("2 accompagnateurs de 36 à 70 participants", () => {
    expect([36, 50, 70].map(recommendedCompanions)).toEqual([2, 2, 2]);
  });
  it("3 accompagnateurs au-delà de 70 participants", () => {
    expect([71, 120].map(recommendedCompanions)).toEqual([3, 3]);
  });
  it("la recommandation reste modifiable, y compris à 0", () => {
    expect(buildGuidedOutcome(complete()).companions).toBe(1);
    const none = buildGuidedOutcome(complete({ companions: 0 }));
    expect(none.companions).toBe(0);
    expect(none.result.keptTotal).toBe(0);
    expect(validateStep("companions", complete({ companions: 0 }))).toBeNull();
  });
});

describe("répartition par OPCO", () => {
  it("bloque quand la somme des OPCO dépasse le nombre de participants", () => {
    const answers = complete({ participants: 20 });
    expect(validateStep("opco", answers)).toMatch(/24 participants pour un groupe de 20/);
    expect(firstInvalidStep(answers)).toBe("opco");
  });

  it("classe le reliquat en « OPCO encore inconnu » sans créer d’OPCO officiel", () => {
    const answers = complete({ participants: 30, opcoKnowledge: "partial" });
    expect(validateStep("opco", answers)).toBeNull();
    expect(unknownOpcoCount(answers)).toBe(6);
    const { input } = guidedToSimInput(answers);
    const unknown = input.rows.find((row) => row.config.id === UNKNOWN_OPCO_ID);
    expect(unknown?.count).toBe(6);
    expect(unknown?.config.status).toBe("to_confirm");
    expect(OPCOS.some((opco) => opco.id === UNKNOWN_OPCO_ID)).toBe(false);
    expect(input.rows.reduce((sum, row) => sum + row.count, 0)).toBe(30);
  });

  it("sans aucun OPCO connu, applique l’estimation indicative à tout le groupe et baisse la fiabilité", () => {
    const outcome = buildGuidedOutcome(complete({ opcoKnowledge: "none" }));
    expect(outcome.unknownParticipants).toBe(24);
    expect(outcome.input.rows.map((row) => row.config.id)).toEqual([UNKNOWN_OPCO_ID]);
    expect(outcome.unknownAverage?.source).toBe(DEFAULT_UNKNOWN_OPCO_AVERAGE.source);
    expect(outcome.unknownAverage?.validatedByAmi).toBe(false);
    expect(outcome.confidence.level).not.toBe("high");
    expect(outcome.assumptions.find((a) => a.id === "unknownAverage")?.toConfirm).toBe(true);
  });

  it("la moyenne provient des barèmes validés du moteur, pas d’un montant saisi", () => {
    const answers = complete({ opcoKnowledge: "none" });
    const { input, unknownAverage } = guidedToSimInput(answers);
    const validated = OPCOS.filter((opco) => opco.status === "validated");
    const sample = computeSimulation({ stay: input.stay, rows: validated.map((config) => ({ config, count: 1 })), keptTotal: 0, selections: input.selections });
    expect(unknownAverage?.funding).toBe(Math.round(sample.apprentiTotal / validated.length));
    expect(unknownAverage?.referent).toBe(Math.round(sample.referentTotal / validated.length));
  });

  it("accepte une moyenne observée fournie plus tard", () => {
    const { unknownAverage } = guidedToSimInput(complete({ opcoKnowledge: "none" }), { source: "observed", fundingPerParticipant: 640, referentPerParticipant: 480, validatedByAmi: true });
    expect(unknownAverage).toMatchObject({ funding: 640, referent: 480, source: "observed", validatedByAmi: true });
  });
});

describe("transport", () => {
  it("utilise le devis par participant quand il est connu", () => {
    const answers = complete({ transportQuote: "yes", transportPerPerson: 312 });
    expect(resolveTransport(answers)).toEqual({ value: 312, source: "quote" });
    expect(guidedToSimInput(answers).input.stay.transportCost).toBe(312);
  });

  it("convertit un devis global en prix par participant", () => {
    // 24 participants + 1 accompagnateur recommandé = 25 billets.
    const answers = complete({ transportQuote: "yes", transportQuoteMode: "total", transportTotal: 7500 });
    expect(resolveTransport(answers)).toEqual({ value: 300, source: "quote" });
    expect(resolveTransport({ ...answers, transportTotalTickets: 30 }).value).toBe(250);
  });

  it("reprend le tarif moyen de la destination dans la configuration", () => {
    for (const name of DESTINATION_NAMES) {
      expect(resolveTransport(complete({ destination: name })), name).toEqual({ value: DESTINATION_TARIFFS[name].billets, source: "catalogue" });
    }
  });

  it("le tarif moyen reste modifiable", () => {
    expect(resolveTransport(complete({ transportAverageOverride: 180 }))).toEqual({ value: 180, source: "override" });
  });

  it("exige un montant quand un devis est annoncé", () => {
    expect(validateStep("transport", complete({ transportQuote: "yes" }))).toMatch(/par participant/);
  });
});

describe("transfert vers computeSimulation", () => {
  it("convertit les jours calendaires en nuitées", () => {
    expect([5, 7, 8, 14, 15].map(daysToNights)).toEqual([4, 6, 7, 13, 14]);
  });

  it("produit l’entrée attendue par le moteur", () => {
    const { input } = guidedToSimInput(complete());
    expect(input.stay).toEqual({
      nights: 7,
      programmeCost: programmeForDestination("Séville", 7),
      transportCost: DESTINATION_TARIFFS["Séville"].billets,
      accommodationCost: 42,
      mealsCost: 48,
      otherMobilityCost: 0,
    });
    expect(input.rows.map((row) => [row.config.id, row.count])).toEqual([["akto", 14], ["afdas", 10]]);
    expect(input.selections).toMatchObject({ destinationZone: "europe", aktoFunding: "euro_miseADisposition", atlasContractMode: "miseADisposition" });
  });

  it("réserve le budget par accompagnateur prévu par la configuration", () => {
    const outcome = buildGuidedOutcome(complete());
    expect(outcome.input.keptTotal).toBe(COST_DEFAULTS.keptPerAccompagnant * 1);
    expect(outcome.companionBudget).toBe(COST_DEFAULTS.keptPerAccompagnant);
    expect(outcome.companionBudgetLimited).toBe(false);
  });

  it("donne exactement le résultat du moteur appelé directement", () => {
    const outcome = buildGuidedOutcome(complete());
    expect(outcome.result).toEqual(computeSimulation(outcome.input));
    // AKTO Europe, alternant resté salarié : 1 000 € ; AFDAS Europe : 1 000 €.
    expect(outcome.result.apprentiTotal).toBe(24 * 1000);
    // Forfait référent : AKTO 500 € ; AFDAS 400 € pour un séjour de moins de 28 jours.
    expect(outcome.result.referentTotal).toBe(14 * 500 + 10 * 400);
    // Reste à charge avant aide : 24 × (1 239 − 1 000) = 5 736 €. Le budget référent
    // disponible (11 000 − 1 750) le couvre : le moteur n'en utilise que 5 736 €.
    expect(outcome.result.reinjected).toBe(5736);
    expect(outcome.result.unusedReferent).toBe(11000 - 1750 - 5736);
    expect(outcome.result.racAvg).toBe(0);
    expect(outcome.result.totalCostAll).toBe(24 * (989 + 250));
  });

  it("isole les contrats historiques ATLAS comme le mode avancé", () => {
    const answers = complete({ opcoRows: [{ id: "atlas", count: 24 }], refinements: { ...INITIAL_GUIDED_ANSWERS.refinements, atlasBeforeApril2026: 5 } });
    expect(guidedToSimInput(answers).input.rows.map((row) => [row.config.id, row.count])).toEqual([["atlas_before_202604", 5], ["atlas", 19]]);
  });
});

describe("résultat avec plusieurs OPCO", () => {
  const outcome = buildGuidedOutcome(complete({ participants: 40, opcoKnowledge: "partial", opcoRows: [{ id: "akto", count: 12 }, { id: "atlas", count: 8 }, { id: "opco_sante", count: 10 }] }));

  it("produit une carte par OPCO, plus la ligne des OPCO inconnus", () => {
    expect(outcome.opcoCards.map((card) => [card.id, card.count])).toEqual([["akto", 12], ["atlas", 8], ["opco_sante", 10], [UNKNOWN_OPCO_ID, 10]]);
    expect(outcome.result.totalStudents).toBe(40);
    expect(outcome.companions).toBe(2);
  });

  it("explique chaque financement, cite la source et marque les règles à confirmer", () => {
    const [akto, atlas, sante, unknown] = outcome.opcoCards;
    expect(akto.how).toContain("AKTO");
    expect(akto.source?.url).toMatch(/^https:\/\/www\.akto\.fr/);
    expect(akto.toConfirm).toBe(false);
    // 8 jours : ATLAS ne finance pas le participant en dessous de 15 jours.
    expect(atlas.fundingPerParticipant).toBe(0);
    expect(sante.toConfirm).toBe(true);
    expect(unknown.toConfirm).toBe(true);
    expect(unknown.source).toBeUndefined();
    expect(unknown.condition).toContain("pas une prise en charge garantie");
  });

  it("ne propose d’affiner que les OPCO sélectionnés", () => {
    expect(outcome.refinements.map((prompt) => prompt.opcoId)).toEqual(["atlas", "akto"]);
    expect(outcome.refinements[0].message).toContain("15 jours");
  });
});

describe("hypothèses affichées", () => {
  it("liste le tarif de transport moyen et le coût programme comme hypothèses à confirmer", () => {
    const byId = Object.fromEntries(buildGuidedOutcome(complete()).assumptions.map((a) => [a.id, a]));
    expect(byId.transport).toMatchObject({ value: "250 € par participant", toConfirm: true, edit: "transport" });
    expect(byId.programme).toMatchObject({ toConfirm: true, edit: "refine" });
    expect(byId.conventions.value).toContain("AKTO");
    expect(byId.duration).toBeUndefined();
    expect(byId.unknownOpco).toBeUndefined();
  });

  it("un devis de transport n’est plus une hypothèse à confirmer", () => {
    const transport = buildGuidedOutcome(complete({ transportQuote: "yes", transportPerPerson: 300 })).assumptions.find((a) => a.id === "transport");
    expect(transport?.toConfirm).toBe(false);
  });

  it("ne masque jamais une durée ou une destination supposée", () => {
    const outcome = buildGuidedOutcome(complete({ destinationKnown: "no", destination: null, zone: "advice", durationDays: null, durationUnknown: true, opcoKnowledge: "none" }));
    const ids = outcome.assumptions.map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining(["destination", "fundingZone", "duration", "unknownOpco", "unknownAverage"]));
    expect(outcome.days).toBe(DEFAULT_UNKNOWN_DURATION_DAYS);
    expect(outcome.durationAssumed).toBe(true);
    expect(outcome.destination.known).toBe(false);
    expect(outcome.input.selections?.destinationZone).toBe("europe");
    expect(outcome.confidence).toMatchObject({ level: "low", label: "Validation nécessaire" });
  });

  it("nomme l’estimation des OPCO inconnus sans laisser croire à des départs réels", () => {
    const outcome = buildGuidedOutcome(complete({ opcoKnowledge: "none" }));
    const average = outcome.assumptions.find((a) => a.id === "unknownAverage");
    expect(average?.label).toBe("Estimation indicative basée sur les barèmes OPCO disponibles");
    expect(average?.detail).toContain("ne provient pas de départs réels");
    const text = JSON.stringify([outcome.assumptions, outcome.opcoCards]);
    expect(text).not.toMatch(/moyenne AMI/i);
    expect(text).not.toMatch(/moyenne observée/i);
  });

  it("affiche comme provisoires les prix d’une destination non choisie", () => {
    const outcome = buildGuidedOutcome(complete({ destinationKnown: "no", destination: null, zone: "europe" }));
    expect(outcome.provisionalNote).toContain("moyennes provisoires");
    expect(outcome.provisionalNote).toContain("pas un prix");
    const provisional = outcome.assumptions.filter((a) => a.provisional).map((a) => a.id);
    expect(provisional).toEqual(["destination", "transport", "programme"]);
    // Les hypothèses elles-mêmes ne changent pas : moyenne des destinations de la zone.
    expect(outcome.transport).toEqual({ value: 250, source: "zoneMean" });
    // Un devis de transport n'est pas provisoire, même sans destination.
    const quoted = buildGuidedOutcome(complete({ destinationKnown: "no", destination: null, zone: "europe", transportQuote: "yes", transportPerPerson: 300 }));
    expect(quoted.assumptions.filter((a) => a.provisional).map((a) => a.id)).toEqual(["destination", "programme"]);
    expect(quoted.provisionalNote).toContain("est une moyenne provisoire");
  });

  it("n’affiche rien de provisoire quand la destination est choisie", () => {
    const outcome = buildGuidedOutcome(complete());
    expect(outcome.provisionalNote).toBeNull();
    expect(outcome.assumptions.some((a) => a.provisional)).toBe(false);
  });

  it("qualifie la fiabilité avec des mots simples", () => {
    expect(buildGuidedOutcome(complete()).confidence.label).toBe("Estimation assez précise");
    expect(buildGuidedOutcome(complete({ participants: 30, opcoKnowledge: "partial" })).confidence.label).toBe("Estimation à affiner");
  });
});

describe("passage du mode guidé au mode avancé", () => {
  it("transmet toutes les réponses au mode avancé", () => {
    const answers = complete({ companions: 3, transportQuote: "yes", transportPerPerson: 290, refinements: { ...INITIAL_GUIDED_ANSWERS.refinements, aktoContractMode: "miseEnVeille" } });
    expect(guidedToAdvanced(answers)).toMatchObject({
      destination: "Séville",
      nights: 7,
      accompagnants: 3,
      rows: [{ id: "akto", count: 14 }, { id: "afdas", count: 10 }],
      transport: 290,
      programme: programmeForDestination("Séville", 7),
      mode: "free",
      keptPerAccompagnant: COST_DEFAULTS.keptPerAccompagnant,
      aktoContractMode: "miseEnVeille",
    });
  });

  it("donne le même résultat dans les deux modes", () => {
    const answers = complete();
    const snapshot = guidedToAdvanced(answers);
    expect(buildGuidedOutcome(advancedToGuided(snapshot, answers)).result).toEqual(buildGuidedOutcome(answers).result);
  });

  it("un aller-retour sans modification ne change aucune réponse", () => {
    for (const answers of [
      complete(),
      complete({ participants: 30, opcoKnowledge: "partial" }),
      complete({ opcoKnowledge: "none" }),
      complete({ destinationKnown: "no", destination: null, zone: "northAmerica", durationDays: null, durationUnknown: true }),
      complete({ transportQuote: "yes", transportQuoteMode: "total", transportTotal: 7500 }),
    ]) {
      expect(advancedToGuided(guidedToAdvanced(answers), answers)).toEqual(answers);
    }
  });

  it("conserve les participants sans OPCO connu et reprend les changements faits en mode avancé", () => {
    const answers = complete({ participants: 30, opcoKnowledge: "partial" });
    const snapshot = guidedToAdvanced(answers);
    const back = advancedToGuided({ ...snapshot, nights: 14, accompagnants: 2, rows: [...snapshot.rows, { id: "ep", count: 3 }], transport: 199 }, answers);
    expect(back.participants).toBe(33);
    expect(unknownOpcoCount(back)).toBe(6);
    expect(back).toMatchObject({ durationDays: 15, durationUnknown: false, companions: 2, transportQuote: "yes", transportPerPerson: 199 });
    expect(back.opcoRows).toContainEqual({ id: "ep", count: 3 });
  });
});

describe("reprise après rechargement", () => {
  it("restitue un état sauvegardé à l’identique", () => {
    const answers = complete({ participants: 30, opcoKnowledge: "partial", companions: 2 });
    expect(reviveGuidedAnswers(JSON.parse(JSON.stringify(answers)))).toEqual(answers);
  });

  it("écarte les données illisibles ou inconnues", () => {
    expect(reviveGuidedAnswers(null)).toEqual(INITIAL_GUIDED_ANSWERS);
    const revived = reviveGuidedAnswers({ destination: "Atlantide", participants: -4, opcoRows: [{ id: "inconnu", count: 3 }, { id: "akto", count: 2 }], zone: "mars" });
    expect(revived).toMatchObject({ destination: null, zone: null, participants: INITIAL_GUIDED_ANSWERS.participants, opcoRows: [{ id: "akto", count: 2 }] });
  });
});
