import { describe, expect, it } from "vitest";
import { fundingExamplePhrase, globalWeeksFundingExample } from "@/data/globalWeeks";
import { estimatePublicMobility, estimateSummary } from "./public-estimate";

const base = {
  destination: "Montréal",
  days: 8,
  opcoId: "akto",
  participants: 1,
} as const;

describe("simulateur public", () => {
  it("estime un alternant seul avec son OPCO", () => {
    const estimate = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant" });
    expect(estimate.participants).toBe(1);
    expect(estimate.stayEuros).toBe(1059 + 650);
    expect(estimate.apprenticeEuros).toBe(1500);
    expect(estimate.referentEuros).toBe(209);
    expect(estimate.fundingEuros).toBe(1709);
    expect(estimate.remainderEuros).toBe(0);
    expect(estimate.stayEuros).toBe((estimate.fundingEuros ?? 0) + estimate.remainderEuros);
    expect(estimate.title).toContain("majorité des cas");
    expect(estimate.text).toContain("D’après nos informations");
    expect(estimate.text).toContain("financement mobilité");
    expect(`${estimate.title} ${estimate.text}`).not.toMatch(/garant|vérifi|pas automatique|sans garantir/i);
    expect(estimate.watchNote).toContain("nos informations");
    expect(estimate.watchNote).toContain("OPCO");
  });

  it("aligne Montréal, 8 jours, OPCO non identifié, sur l’exemple du site", () => {
    const estimate = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant", opcoId: null });
    expect(estimate.stayEuros).toBe(1709);
    expect(estimate.apprenticeEuros).toBe(770);
    expect(estimate.referentEuros).toBe(490);
    expect(estimate.remainderEuros).toBe(449);
    expect(estimate.remainderEuros).toBe(globalWeeksFundingExample.remainingEuros);
    expect(estimate.stayEuros).toBe((estimate.apprenticeEuros ?? 0) + (estimate.referentEuros ?? 0) + estimate.remainderEuros);
    expect(estimate.text).toContain("financement mobilité");
    expect(estimate.text).toContain("449");
    expect(estimate.text).not.toContain("450");
    expect(fundingExamplePhrase()).toBe("environ 450 € pour Montréal, hébergement avec petits-déjeuners");
  });

  it("ne présente pas une aide OPCO comme acquise pour un étudiant", () => {
    const estimate = estimatePublicMobility({ ...base, mode: "individuel", status: "etudiant", opcoId: null });
    expect(estimate.fundingEuros).toBeNull();
    expect(estimate.remainderEuros).toBe(estimate.stayEuros);
    expect(estimate.text).toContain(fundingExamplePhrase());
    expect(estimate.text).toContain("AMI monte le dossier avec toi");
  });

  it("estime un groupe et résume le lead", () => {
    const estimate = estimatePublicMobility({ ...base, mode: "groupe", status: "alternant", participants: 12 });
    expect(estimate.participants).toBe(12);
    expect(estimate.apprenticeEuros).toBe(1500);
    expect(estimate.referentEuros).toBe(209);
    expect(estimate.fundingEuros).toBe(1709);
    expect(estimate.remainderEuros).toBe(0);
    expect(estimate.text).toContain("par personne");
    const summary = estimateSummary(estimate);
    expect(summary).toContain("de groupe");
    expect(summary).toContain("AKTO");
    expect(summary).toContain("12");
    expect(globalWeeksFundingExample.remainingEuros).toBe(449);
    expect(globalWeeksFundingExample.editorialRemainingEuros).toBe(450);
    expect(fundingExamplePhrase()).not.toContain("449");
  });

  it("réduit le reste à charge des autres destinations avec la même part de financement mobilité", () => {
    const cases = [
      ["Séville", 1239, 470, 490, 279],
      ["Londres", 1639, 470, 490, 679],
      ["New York", 2089, 745, 490, 854],
      ["Rome", 1239, 470, 490, 279],
      ["Miami", 1989, 745, 490, 754],
      ["Malte", 1489, 495, 490, 504],
      ["Maroc", 1489, 643, 490, 356],
      ["Berlin", 1589, 445, 490, 654],
      ["Séoul", 2189, 795, 490, 904],
    ] as const;
    for (const [destination, stay, apprentice, referent, remainder] of cases) {
      const estimate = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant", destination, opcoId: null });
      expect(estimate.stayEuros).toBe(stay);
      expect(estimate.apprenticeEuros).toBe(apprentice);
      expect(estimate.referentEuros).toBe(referent);
      expect(estimate.remainderEuros).toBe(remainder);
      expect(estimate.remainderEuros).toBe(stay - apprentice - referent);
    }
  });

  it("ne fige pas Montréal sur 8 jours quand la durée change", () => {
    const week = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant", opcoId: null, days: 7 });
    const twoWeeks = estimatePublicMobility({ ...base, mode: "individuel", status: "alternant", opcoId: null, days: 14 });
    expect(week.remainderEuros).toBe(505);
    expect(twoWeeks.remainderEuros).toBe(774);
  });
});
