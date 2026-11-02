import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "./lead";

/**
 * Journal des leads commerciaux.
 * - Fichier local si LEAD_LOCAL_STORE est défini (essais, tests, admin local).
 * - Table Supabase `commercial_leads` (migration 20261102160000, déjà appliquée)
 *   uniquement si LEADS_DB_READ ou LEADS_DB_WRITE vaut 1. Les drapeaux restent
 *   éteints tant que la service role n’est pas posée sur Vercel. Ne pas relancer
 *   la migration.
 * Les e-mails, Notion et le webhook restent gérés par la route /api/lead.
 */

type RemoteConfig = { url: string; key: string };

function localFile(): string | null {
  const file = process.env.LEAD_LOCAL_STORE?.trim();
  return file || null;
}

function remote(): RemoteConfig | null {
  if (process.env.LEADS_DB_WRITE !== "1" && process.env.LEADS_DB_READ !== "1") return null;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) return null;
  const url = (process.env.SUPABASE_URL || "https://zknulgrqwdnwsqmmqdvt.supabase.co").replace(/\/$/, "");
  return { url, key };
}

function canWriteRemote(): boolean {
  return process.env.LEADS_DB_WRITE === "1" && remote() !== null;
}

function canReadRemote(): boolean {
  return process.env.LEADS_DB_READ === "1" && remote() !== null;
}

export function leadStoreMode(): "supabase" | "local" | "none" {
  if (canReadRemote() || canWriteRemote()) return "supabase";
  if (localFile()) return "local";
  return "none";
}

function readLocal(): Lead[] {
  const file = localFile();
  if (!file) return [];
  try {
    const raw = readFileSync(file, "utf8");
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Lead);
  } catch {
    return [];
  }
}

function writeLocal(leads: Lead[]): void {
  const file = localFile();
  if (!file) return;
  mkdirSync(path.dirname(/*turbopackIgnore: true*/ file), { recursive: true });
  const body = leads.map((lead) => JSON.stringify(lead)).join("\n");
  writeFileSync(file, body ? `${body}\n` : "", "utf8");
}

export function recordLeadLocally(lead: Lead): void {
  const file = localFile();
  if (!file) return;
  mkdirSync(path.dirname(/*turbopackIgnore: true*/ file), { recursive: true });
  appendFileSync(file, `${JSON.stringify(lead)}\n`, "utf8");
}

function toRow(lead: Lead): Record<string, unknown> {
  return {
    id: lead.id,
    received_at: lead.date,
    prenom: lead.prenom,
    nom: lead.nom,
    email: lead.email,
    telephone: lead.telephone ?? null,
    role: lead.role ?? null,
    etablissement: lead.etablissement ?? null,
    opco: lead.opco ?? null,
    entreprise: lead.entreprise ?? null,
    statut_alternant: lead.statutAlternant ?? null,
    destination: lead.destination ?? null,
    session_souhaitee: lead.session ?? null,
    profil: lead.profil ?? null,
    objet: lead.objet ?? null,
    source: lead.source,
    page: lead.page ?? null,
    utm_source: lead.utmSource ?? null,
    utm_medium: lead.utmMedium ?? null,
    utm_campaign: lead.utmCampaign ?? null,
    utm_content: lead.utmContent ?? null,
    utm_term: lead.utmTerm ?? null,
    referrer: lead.referrer ?? null,
    message: lead.message ?? null,
    lead_status: lead.leadStatus,
    rgpd: lead.rgpd,
    raw: lead,
  };
}

function fromRow(row: Record<string, unknown>): Lead {
  const raw = row.raw && typeof row.raw === "object" ? (row.raw as Partial<Lead>) : {};
  return {
    id: String(row.id ?? raw.id ?? ""),
    prenom: String(row.prenom ?? raw.prenom ?? ""),
    nom: String(row.nom ?? raw.nom ?? ""),
    email: String(row.email ?? raw.email ?? ""),
    telephone: (row.telephone as string | null) ?? raw.telephone,
    etablissement: (row.etablissement as string | null) ?? raw.etablissement,
    role: ((row.role as Lead["role"]) ?? raw.role) || undefined,
    profil: (row.profil as string | null) ?? raw.profil,
    objet: (row.objet as string | null) ?? raw.objet,
    opco: (row.opco as string | null) ?? raw.opco,
    entreprise: (row.entreprise as string | null) ?? raw.entreprise,
    statutAlternant: (row.statut_alternant as string | null) ?? raw.statutAlternant,
    destination: (row.destination as string | null) ?? raw.destination,
    session: (row.session_souhaitee as string | null) ?? raw.session,
    tailleGroupe: raw.tailleGroupe,
    message: (row.message as string | null) ?? raw.message,
    utmSource: (row.utm_source as string | null) ?? raw.utmSource,
    utmMedium: (row.utm_medium as string | null) ?? raw.utmMedium,
    utmCampaign: (row.utm_campaign as string | null) ?? raw.utmCampaign,
    utmContent: (row.utm_content as string | null) ?? raw.utmContent,
    utmTerm: (row.utm_term as string | null) ?? raw.utmTerm,
    referrer: (row.referrer as string | null) ?? raw.referrer,
    leadStatus: (LEAD_STATUSES as readonly string[]).includes(String(row.lead_status))
      ? (row.lead_status as LeadStatus)
      : raw.leadStatus ?? "nouveau",
    rgpd: row.rgpd === true || raw.rgpd === true,
    source: String(row.source ?? raw.source ?? "site web"),
    page: (row.page as string | null) ?? raw.page,
    date: String(row.received_at ?? raw.date ?? new Date().toISOString()),
  };
}

async function insertRemote(lead: Lead): Promise<void> {
  const config = remote();
  if (!config || !canWriteRemote()) return;
  const response = await fetch(`${config.url}/rest/v1/commercial_leads`, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(toRow(lead)),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "Le lead n’a pas pu être enregistré.");
  }
}

/** Enregistre un lead déjà validé. N’interrompt pas l’appelant si le stockage échoue. */
export async function persistLead(lead: Lead): Promise<void> {
  recordLeadLocally(lead);
  if (!canWriteRemote()) return;
  try {
    await insertRemote(lead);
  } catch (error) {
    console.error("[AMI Lead] stockage commercial indisponible :", error);
  }
}

export async function listLeads(): Promise<Lead[]> {
  if (canReadRemote()) {
    const config = remote();
    if (!config) return [];
    const response = await fetch(`${config.url}/rest/v1/commercial_leads?select=*&order=received_at.desc&limit=500`, {
      headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
      cache: "no-store",
    });
    if (!response.ok) return readLocal();
    const rows = (await response.json()) as Record<string, unknown>[];
    return rows.map(fromRow);
  }
  return readLocal().sort((a, b) => b.date.localeCompare(a.date));
}

export async function getLead(id: string): Promise<Lead | null> {
  const leads = await listLeads();
  return leads.find((lead) => lead.id === id) ?? null;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) return null;
  if (canWriteRemote()) {
    const config = remote();
    if (!config) return null;
    const response = await fetch(`${config.url}/rest/v1/commercial_leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ lead_status: status }),
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as Record<string, unknown>[];
    return rows[0] ? fromRow(rows[0]) : null;
  }
  const leads = readLocal();
  const index = leads.findIndex((lead) => lead.id === id);
  if (index < 0) return null;
  leads[index] = { ...leads[index], leadStatus: status };
  writeLocal(leads);
  return leads[index];
}
