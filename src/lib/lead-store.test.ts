import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { COMMERCIAL_ADMIN_ROLES, commercialRoleFor, readLeadsCookie, signLeadsCookie } from "./leads-access";
import { leadsToCsv } from "./lead-csv";
import { filterLeads } from "./lead-filters";
import { parseLead } from "./lead";
import { listLeads, recordLeadLocally, updateLeadStatus } from "./lead-store";
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
    expect(stored.leadStatus).toBe("nouveau");
    expect(stored.id).toBeTruthy();
  });

  it("ignore un statut envoyé par le navigateur et filtre le journal local", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "ami-leads-"));
    process.env.LEAD_LOCAL_STORE = path.join(dir, "leads.jsonl");
    const parsed = parseLead({
      prenom: "Inès",
      nom: "Bernard",
      email: "ines@example.com",
      role: "alternant",
      etablissement: "CFA Lumière",
      opco: "AKTO",
      entreprise: "Atelier Nord",
      statutAlternant: "Oui",
      destination: "Séville",
      session: "Séville, 7 au 13 mars 2027",
      utmSource: "linkedin",
      utmCampaign: "global-weeks",
      rgpd: true,
      source: "questionnaire global weeks",
      leadStatus: "inscrit",
      message: `${"détail ".repeat(80)}fin du message.`,
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.lead.leadStatus).toBe("nouveau");
    expect(parsed.lead.message?.endsWith("fin du message.")).toBe(true);
    expect(parsed.lead.utmSource).toBe("linkedin");
    recordLeadLocally(parsed.lead);
    const listed = await listLeads();
    expect(filterLeads(listed, { destination: "Séville", source: "questionnaire global weeks" })).toHaveLength(1);
    expect(filterLeads(listed, { role: "referent" })).toHaveLength(0);
    const updated = await updateLeadStatus(parsed.lead.id, "a_contacter");
    expect(updated?.leadStatus).toBe("a_contacter");
    expect(leadsToCsv(await listLeads())).toContain("ines@example.com");
    expect(leadsToCsv(await listLeads())).toContain("linkedin");
  });

  it("signe un cookie commercial distinct et n’ouvre pas la finance", async () => {
    process.env.LEADS_ADMIN_SECRET = "secret-de-test";
    const token = signLeadsCookie("equipe@amipanorama.com");
    expect(readLeadsCookie(token)).toBe("equipe@amipanorama.com");
    expect(readLeadsCookie(`${token}x`)).toBeNull();
    expect(COMMERCIAL_ADMIN_ROLES).toEqual(["SUPER_ADMIN", "DIRECTION", "OPERATIONS"]);
    expect(COMMERCIAL_ADMIN_ROLES.join(" ")).not.toMatch(/aurum|finance/i);
    delete process.env.LEADS_ADMIN_SECRET;
  });

  it("n’ouvre pas l’essai local sans journal de leads", async () => {
    process.env.LEADS_DEV_ADMIN = "1";
    process.env.LEADS_DEV_EMAILS = "revue@amipanorama.test";
    delete process.env.LEAD_LOCAL_STORE;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(await commercialRoleFor("revue@amipanorama.test")).toBeNull();
    delete process.env.LEADS_DEV_ADMIN;
    delete process.env.LEADS_DEV_EMAILS;
  });
});
