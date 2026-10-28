import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import type { Lead } from "./lead";

/**
 * Journal local, uniquement si LEAD_LOCAL_STORE pointe vers un fichier.
 * Sert aux essais et aux tests. La production reste sur les canaux déjà
 * branchés (e-mail, Notion, webhook). Aucune écriture Supabase.
 */
export function recordLeadLocally(lead: Lead): void {
  const file = process.env.LEAD_LOCAL_STORE?.trim();
  if (!file) return;
  mkdirSync(path.dirname(file), { recursive: true });
  appendFileSync(file, `${JSON.stringify(lead)}\n`, "utf8");
}
