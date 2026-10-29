import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseLead } from "./lead";
import { recordLeadLocally } from "./lead-store";
import { estimatePublicMobility, estimateSummary } from "./global-weeks/public-estimate";

const previous = process.env.LEAD_LOCAL_STORE;

afterEach(() => {
  if (previous === undefined) delete process.env.LEAD_LOCAL_STORE;
  else process.env.LEAD_LOCAL_STORE = previous;
});

describe("leads Global Weeks", () => {
  it("refuse un envoi sans consentement", () => {
    const parsed = parseLead({ prenom: "Camille", nom: "Martin", email: "camille@example.com", rgpd: false });
    expect(parsed.ok).toBe(false);
  });

  it("enregistre en local le résultat d’estimation quand le consentement est donné", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "ami-leads-"));
    const file = path.join(dir, "leads.jsonl");
    process.env.LEAD_LOCAL_STORE = file;
    const estimate = estimatePublicMobility({
      mode: "individuel",
      status: "alternant",
      destination: "Montréal",
      days: 8,
      opcoId: "akto",
      participants: 1,
    });
    const parsed = parseLead({
      prenom: "Camille",
      nom: "Martin",
      email: "camille@example.com",
      telephone: "0600000000",
      etablissement: "CFA Lumière",
      profil: "Alternant",
      objet: "Simulation Global Weeks",
      destination: "Montréal",
      tailleGroupe: "1",
      message: estimateSummary(estimate),
      rgpd: true,
      source: "simulateur global weeks",
      page: "/global-weeks/simulateur",
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    recordLeadLocally(parsed.lead);
    const stored = JSON.parse(readFileSync(file, "utf8"));
    expect(stored.rgpd).toBe(true);
    expect(stored.email).toBe("camille@example.com");
    expect(stored.message).toContain("Prise en charge indicative : 1709 €");
    expect(stored.message).toContain("Part de financement mobilité : 209 €");
    expect(stored.source).toBe("simulateur global weeks");
  });
});
