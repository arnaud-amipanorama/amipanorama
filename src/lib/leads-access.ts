import { createHmac, timingSafeEqual } from "crypto";

/**
 * Accès au CRM commercial.
 * Rôles internes existants (public.user_roles) : SUPER_ADMIN, DIRECTION, OPERATIONS.
 * Le module finance `aurum` n’ouvre pas les leads. Le cookie du simulateur
 * de groupe non plus : un référent mobilité ne voit pas les autres demandes.
 */
export const COMMERCIAL_ADMIN_ROLES = ["SUPER_ADMIN", "DIRECTION", "OPERATIONS"] as const;

export const leadsCookie = {
  name: "ami_leads_staff",
  maxAge: 60 * 60 * 8,
};

function secret(): string | null {
  return process.env.LEADS_ADMIN_SECRET?.trim() || process.env.SIMULATOR_PASSWORD?.trim() || null;
}

export function signLeadsCookie(email: string): string {
  const key = secret();
  if (!key) throw new Error("Secret d’accès leads manquant");
  const issuedAt = Math.floor(Date.now() / 1000);
  const normalized = email.trim().toLowerCase();
  const payload = `leads.${normalized}.${issuedAt}`;
  const signature = createHmac("sha256", key).update(payload).digest("base64url");
  return `${Buffer.from(normalized).toString("base64url")}.${issuedAt}.${signature}`;
}

export function readLeadsCookie(value: string | undefined): string | null {
  const key = secret();
  if (!value || !key) return null;
  const [encodedEmail, issuedAt, signature] = value.split(".");
  if (!encodedEmail || !issuedAt || !signature || !/^\d+$/.test(issuedAt)) return null;
  if (Math.floor(Date.now() / 1000) - Number(issuedAt) > leadsCookie.maxAge) return null;
  let email: string;
  try {
    email = Buffer.from(encodedEmail, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = createHmac("sha256", key).update(`leads.${email}.${issuedAt}`).digest("base64url");
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  return email;
}

type StaffRow = { email?: string; is_active?: boolean; user_roles?: { role?: string }[] };

/**
 * Vérifie le rôle commercial côté serveur.
 * Aucune session Supabase Auth : l’e-mail saisi est comparé à public.users.email,
 * puis aux rôles de public.user_roles, via la service role (le Data API public
 * n’a aucun droit). Le hint de clé étrangère est obligatoire : user_roles
 * pointe deux fois vers users (user_id et created_by).
 * L’essai local (LEADS_DEV_ADMIN + LEAD_LOCAL_STORE) ne doit pas être activé sur Vercel.
 */
export async function commercialRoleFor(email: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return null;

  const devEmails = (process.env.LEADS_DEV_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  // Essai local uniquement : les deux variables doivent être posées ensemble.
  // Ne pas les définir sur Vercel. Sans fichier local, ce passage est fermé.
  const localTrial = process.env.LEADS_DEV_ADMIN === "1" && Boolean(process.env.LEAD_LOCAL_STORE?.trim());
  if (localTrial && devEmails.includes(normalized)) return "OPERATIONS";

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!key) return null;
  const url = (process.env.SUPABASE_URL || "https://zknulgrqwdnwsqmmqdvt.supabase.co").replace(/\/$/, "");
  const response = await fetch(
    `${url}/rest/v1/users?select=email,is_active,user_roles!user_roles_user_id_fkey(role)&email=eq.${encodeURIComponent(normalized)}&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
  );
  if (!response.ok) return null;
  const rows = (await response.json()) as StaffRow[];
  const row = rows[0];
  if (!row?.is_active) return null;
  const roles = (row.user_roles ?? []).map((item) => item.role).filter((role): role is string => Boolean(role));
  return roles.find((role) => (COMMERCIAL_ADMIN_ROLES as readonly string[]).includes(role)) ?? null;
}
