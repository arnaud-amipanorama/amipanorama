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
    expect(estimate.fundingEuros).toBe(1500);
    expect(estimate.stayEuros).toBe(1059 + 650);
    expect(estimate.remainderEuros).toBe(estimate.stayEuros - 1500);
    expect(estimate.title).toContain("majorité des cas");
    expect(estimate.text).toContain("D’après nos informations");
    expect(`${estimate.title} ${estimate.text}`).not.toMatch(/garant|vérifi/i);
    expect(estimate.watchNote).toContain("veille");
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
    expect(estimate.fundingEuros).toBe(1500);
    expect(estimate.text).toContain("par personne");
    const summary = estimateSummary(estimate);
    expect(summary).toContain("de groupe");
    expect(summary).toContain("AKTO");
    expect(summary).toContain("12");
    expect(globalWeeksFundingExample.remainingEuros).toBe(400);
  });
});
