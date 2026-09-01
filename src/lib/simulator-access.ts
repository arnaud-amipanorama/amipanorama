import { createHash, createHmac, randomInt, timingSafeEqual } from "crypto";

const SUPABASE_URL = "https://zknulgrqwdnwsqmmqdvt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_4s1b8dxr2LQVMtfkJ50csA_4EmwyEMP";
const COOKIE = "ami_simulator_access";
const COOKIE_MAX_AGE = 60 * 60 * 2;

type RpcRow = Record<string, unknown>;

export type AccessStatus = "pending" | "approved" | "rejected";

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isAmiEmail(email: string): boolean {
  return normalizeEmail(email).endsWith("@amipanorama.com");
}

export function createVerificationCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashVerificationCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function accessSecret(): string | null {
  return process.env.SIMULATOR_PASSWORD ?? null;
}

export function createAccessCookie(email: string): string {
  const secret = accessSecret();
  if (!secret) throw new Error("SIMULATOR_PASSWORD manquante");
  const issuedAt = Math.floor(Date.now() / 1000);
  const subject = `${normalizeEmail(email)}.${issuedAt}`;
  const signature = createHmac("sha256", secret).update(subject).digest("base64url");
  return `${Buffer.from(normalizeEmail(email)).toString("base64url")}.${issuedAt}.${signature}`;
}

export function readAccessCookie(value: string | undefined): string | null {
  const secret = accessSecret();
  if (!value || !secret) return null;
  const [encodedEmail, issuedAt, signature] = value.split(".");
  if (!encodedEmail || !issuedAt || !signature || !/^\d+$/.test(issuedAt)) return null;
  if (Math.floor(Date.now() / 1000) - Number(issuedAt) > COOKIE_MAX_AGE) return null;

  let email: string;
  try {
    email = Buffer.from(encodedEmail, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = createHmac("sha256", secret).update(`${email}.${issuedAt}`).digest("base64url");
  if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  return email;
}

export const accessCookie = {
  name: COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: true,
    path: "/internal",
    maxAge: COOKIE_MAX_AGE,
  },
};

async function rpc<T extends RpcRow>(name: string, body: Record<string, unknown>): Promise<T[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "La demande n’a pas pu être enregistrée.");
  }
  return response.json() as Promise<T[]>;
}

export async function requestSimulatorAccess(input: {
  fullName: string;
  establishment: string;
  email: string;
  phone: string;
  codeHash: string;
}): Promise<AccessStatus> {
  const rows = await rpc<{ status: AccessStatus }>("ami_simulator_request_access", {
    p_full_name: input.fullName,
    p_establishment: input.establishment,
    p_email: normalizeEmail(input.email),
    p_phone: input.phone,
    p_code_hash: input.codeHash,
  });
  if (!rows[0]?.status) throw new Error("Réponse de vérification invalide.");
  return rows[0].status;
}

export async function verifySimulatorAccess(email: string, code: string): Promise<{ status: AccessStatus; granted: boolean }> {
  const rows = await rpc<{ status: AccessStatus; granted: boolean }>("ami_simulator_verify_access", {
    p_email: normalizeEmail(email),
    p_code_hash: hashVerificationCode(code),
  });
  if (!rows[0]) throw new Error("Réponse de vérification invalide.");
  return rows[0];
}

export async function recordSimulatorEvent(email: string, payload: Record<string, unknown>): Promise<void> {
  await rpc("ami_simulator_record_event", {
    p_email: normalizeEmail(email),
    p_event_type: "simulation_saved",
    p_payload: payload,
  });
}
