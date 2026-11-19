import { describe, expect, it } from "vitest";
import { fundingExamplePhrase, globalWeeksFundingExample } from "@/data/globalWeeks";
import { REFERENT_MOBILITY_NOTE, estimatePublicMobility, estimateSummary } from "./public-estimate";

const base = {
  destination: "Montréal",
  days: 8,
  opcoId: "akto",
  participants: 1,
} as const;

const coveredWording = /pris en charge|prend en charge|prise en charge/i;

describe("simulateur public", () => {
  it("estime un alternant seul avec son OPCO, sans le budget référent mobilité", () => {
    const estimate = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant" });
    expect(estimate.participants).toBe(1);
    expect(estimate.stayEuros).toBe(1059 + 650);
    expect(estimate.apprenticeEuros).toBe(1500);
    expect(estimate.fundingEuros).toBe(1500);
    // Avant : 209 € du forfait référent (500 €) complétaient le financement jusqu’à 1 709 € et ramenaient le reste à charge à 0 €.
    expect(estimate.remainderEuros).toBe(209);
    expect(estimate.stayEuros).toBe((estimate.fundingEuros ?? 0) + estimate.remainderEuros);
    expect(estimate.title).toContain("éligible aux financements OPCO");
    expect(estimate.text).toContain("D’après nos informations");
    expect(estimate.text).toContain("209");
    expect(estimate.text).not.toContain("financement mobilité");
    expect(estimate.text).not.toMatch(coveredWording);
    expect(`${estimate.title} ${estimate.text}`).not.toMatch(/garant|vérifi|pas automatique|sans garantir/i);
    expect(estimate.referentNote).toBe(REFERENT_MOBILITY_NOTE);
    expect(estimate.watchNote).toContain("nos informations");
    expect(estimate.watchNote).toContain("OPCO");
  });

  it("aligne Montréal, 8 jours, OPCO non identifié, sur l’exemple du site", () => {
    const estimate = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant", opcoId: null });
    expect(estimate.stayEuros).toBe(1709);
    expect(estimate.apprenticeEuros).toBe(770);
    expect(estimate.fundingEuros).toBe(770);
    // Avant : 490 € de forfait référent étaient retranchés, pour un reste à charge de 449 € et un financement affiché de 1 260 €.
    expect(estimate.remainderEuros).toBe(939);
    expect(estimate.remainderEuros).toBe(globalWeeksFundingExample.remainingEuros);
    expect(estimate.stayEuros).toBe((estimate.apprenticeEuros ?? 0) + estimate.remainderEuros);
    expect(estimate.text).toContain("939");
    expect(estimate.text).not.toContain("940");
    expect(estimate.text).not.toContain("financement mobilité");
    expect(fundingExamplePhrase()).toBe("environ 940 € pour Montréal, hébergement avec petits-déjeuners");
  });

  it("décrit le budget référent mobilité hors calcul", () => {
    const estimate = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant", opcoId: null });
    expect(estimate.referentNote).toContain("D’après nos informations");
    expect(estimate.referentNote).toContain("jusqu’à 500 €");
    expect(estimate.referentNote).toContain("n’est pas inclus dans ce calcul");
    expect(estimate.referentNote).toContain("peut éventuellement");
    expect(estimate.referentNote).toContain("Renseigne-toi auprès d’elle");
    expect(estimate.referentNote).not.toMatch(coveredWording);
    expect(estimate.referentNote).not.toMatch(/vérifi/i);
    expect(estimate.referentNote?.toLowerCase()).not.toContain("auprès de ton opco");
    expect(estimate.referentNote?.toLowerCase()).not.toContain("auprès de votre opco");
    expect(estimate.referentNote).not.toMatch(/versera|t’accordera/i);
    expect(estimateSummary(estimate)).toContain(REFERENT_MOBILITY_NOTE);
    expect(estimateSummary(estimate)).not.toContain("Part de financement mobilité");
    expect(estimateSummary(estimate)).not.toMatch(coveredWording);
  });

  it("ne présente pas une aide OPCO comme acquise pour un étudiant", () => {
    const estimate = estimatePublicMobility({ ...base, mode: "individuel", status: "etudiant", opcoId: null });
    expect(estimate.fundingEuros).toBeNull();
    expect(estimate.referentNote).toBeNull();
    expect(estimate.remainderEuros).toBe(estimate.stayEuros);
    expect(estimate.text).toContain(fundingExamplePhrase());
    expect(estimate.text).toContain("AMI Panorama monte le dossier avec toi");
    expect(estimateSummary(estimate)).not.toContain("500 €");
  });

  it("estime un groupe sans réinjecter le budget référent dans le reste à charge", () => {
    const estimate = estimatePublicMobility({ ...base, mode: "groupe", status: "alternant", participants: 12 });
    expect(estimate.participants).toBe(12);
    expect(estimate.apprenticeEuros).toBe(1500);
    expect(estimate.fundingEuros).toBe(1500);
    expect(estimate.remainderEuros).toBe(209);
    expect(estimate.text).toContain("par personne");
    const summary = estimateSummary(estimate);
    expect(summary).toContain("de groupe");
    expect(summary).toContain("AKTO");
    expect(summary).toContain("12");
    expect(summary).toContain("Financement indicatif : 1500 €");
    expect(summary).toContain("Reste à charge indicatif : 209 €");
    expect(globalWeeksFundingExample.remainingEuros).toBe(939);
    expect(globalWeeksFundingExample.editorialRemainingEuros).toBe(940);
    expect(fundingExamplePhrase()).not.toContain("939");
  });

  it("calcule le reste à charge des autres destinations sans le forfait référent", () => {
    const cases = [
      ["Séville", 1239, 470, 769],
      ["Londres", 1639, 470, 1169],
      ["New York", 2089, 745, 1344],
      ["Rome", 1239, 470, 769],
      ["Miami", 1989, 745, 1244],
      ["Malte", 1489, 495, 994],
      ["Maroc", 1489, 643, 846],
      ["Berlin", 1589, 445, 1144],
      ["Séoul", 2189, 795, 1394],
    ] as const;
    for (const [destination, stay, apprentice, remainder] of cases) {
      const estimate = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant", destination, opcoId: null });
      expect(estimate.stayEuros).toBe(stay);
      expect(estimate.apprenticeEuros).toBe(apprentice);
      expect(estimate.fundingEuros).toBe(apprentice);
      expect(estimate.remainderEuros).toBe(remainder);
      expect(estimate.remainderEuros).toBe(stay - apprentice);
    }
  });

  it("ne fige pas Montréal sur 8 jours quand la durée change", () => {
    const week = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant", opcoId: null, days: 7 });
    const twoWeeks = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant", opcoId: null, days: 14 });
    expect(week.apprenticeEuros).toBe(714);
    expect(week.remainderEuros).toBe(995);
    expect(twoWeeks.apprenticeEuros).toBe(805);
    expect(twoWeeks.remainderEuros).toBe(1264);
    expect(week.remainderEuros).toBe((week.stayEuros) - (week.apprenticeEuros ?? 0));
    expect(twoWeeks.remainderEuros).toBe(twoWeeks.stayEuros - (twoWeeks.apprenticeEuros ?? 0));
  });
});
