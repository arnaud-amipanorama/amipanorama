import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";

const SUPABASE_URL = "https://zknulgrqwdnwsqmmqdvt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_4s1b8dxr2LQVMtfkJ50csA_4EmwyEMP";
const COOKIE = "ami_simulator_access";
const COOKIE_MAX_AGE = 60 * 60 * 2;

type RpcRow = Record<string, unknown>;

export type AccessStatus = "pending" | "approved" | "rejected";

export type SimulatorAccessResult = {
  status: AccessStatus;
  /** Vrai quand la base ne connaît pas encore `p_broker_secret`. */
  legacySignature: boolean;
};

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isAmiEmail(email: string): boolean {
  return normalizeEmail(email).endsWith("@amipanorama.com");
}

export function createVerificationCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function createApprovalToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashVerificationCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function accessSecret(): string | null {
  return process.env.SIMULATOR_PASSWORD ?? null;
}

function brokerSecret(): string | null {
  const value = process.env.SIMULATOR_BROKER_SECRET?.trim();
  return value ? value : null;
}

function redactSecrets(value: string): string {
  const secret = brokerSecret();
  if (!secret || !value.includes(secret)) return value;
  return value.split(secret).join("[redacted]");
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

type PgRestBody = { code?: string; message?: string };

function parsePgRest(body: string): PgRestBody {
  try {
    const parsed = JSON.parse(body) as PgRestBody;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return { message: body };
  }
}

/** La fonction visée n’existe pas encore (migration non appliquée) ou plus (ancienne signature retirée). */
export function isUnknownRpcSignature(status: number, body: string): boolean {
  const parsed = parsePgRest(body);
  if (parsed.code === "PGRST202" || parsed.code === "42883") return true;
  const message = `${parsed.message ?? ""}\n${body}`;
  return status === 404 && /could not find the function|does not exist/i.test(message);
}

const PUBLIC_RPC_MESSAGES = [
  "Adresse e-mail invalide",
  "Coordonnées incomplètes",
  "Veuillez patienter une minute avant de demander un nouveau code",
  "Code invalide ou expiré",
  "Trop de tentatives. Demandez un nouveau code.",
  "Lien invalide ou déjà utilisé",
  "Ce lien n’est plus valide.",
  "Décision invalide",
  "Type d’événement non autorisé",
  "Accès non autorisé",
];

function publicRpcMessage(status: number, body: string): string {
  const message = redactSecrets(parsePgRest(body).message?.trim() ?? "");
  if (PUBLIC_RPC_MESSAGES.some((entry) => message.startsWith(entry))) return message;
  if (status === 404 || isUnknownRpcSignature(status, body)) {
    return "Le service d’accès au simulateur est momentanément indisponible.";
  }
  return "La demande n’a pas pu être enregistrée.";
}

class RpcCallError extends Error {
  constructor(message: string, readonly status: number, readonly body: string) {
    super(message);
    this.name = "RpcCallError";
  }
}

async function rpcOnce<T extends RpcRow>(name: string, body: Record<string, unknown>): Promise<T[]> {
  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch (error) {
    console.error(`[AMI Simulator Access] rpc ${name} network`, error instanceof Error ? error.message : "fetch failed");
    throw new Error("La demande n’a pas pu être enregistrée.");
  }

  const detail = await response.text().catch(() => "");
  if (!response.ok) {
    const parsed = parsePgRest(detail);
    console.error(`[AMI Simulator Access] rpc ${name} failed`, response.status, parsed.code ?? "", redactSecrets(parsed.message ?? ""));
    throw new RpcCallError(publicRpcMessage(response.status, detail), response.status, redactSecrets(detail));
  }
  if (response.status === 204 || !detail.trim()) return [];
  try {
    const parsed = JSON.parse(detail) as T[] | T | null;
    if (parsed == null) return [];
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    throw new Error("Réponse de vérification invalide.");
  }
}

async function rpc<T extends RpcRow>(name: string, body: Record<string, unknown>): Promise<T[]> {
  try {
    return await rpcOnce<T>(name, body);
  } catch (error) {
    if (error instanceof RpcCallError) throw new Error(error.message);
    throw error;
  }
}

/**
 * Envoie `p_broker_secret` quand la variable serveur est posée.
 * Si la base n’a pas encore cette signature, rappelle sans le secret.
 * Un secret refusé ne retombe jamais sur l’ancienne fonction.
 */
async function rpcWithBroker<T extends RpcRow>(name: string, body: Record<string, unknown>): Promise<{ rows: T[]; legacySignature: boolean }> {
  const secret = brokerSecret();
  if (!secret) {
    try {
      return { rows: await rpcOnce<T>(name, body), legacySignature: true };
    } catch (error) {
      if (error instanceof RpcCallError && isUnknownRpcSignature(error.status, error.body)) {
        throw new Error("Le service d’accès au simulateur n’est pas configuré. Réessayez plus tard.");
      }
      if (error instanceof RpcCallError) throw new Error(error.message);
      throw error;
    }
  }

  try {
    return { rows: await rpcOnce<T>(name, { ...body, p_broker_secret: secret }), legacySignature: false };
  } catch (error) {
    if (error instanceof RpcCallError && isUnknownRpcSignature(error.status, error.body)) {
      try {
        return { rows: await rpcOnce<T>(name, body), legacySignature: true };
      } catch (retryError) {
        if (retryError instanceof RpcCallError) throw new Error(retryError.message);
        throw retryError;
      }
    }
    if (error instanceof RpcCallError) throw new Error(error.message);
    throw error;
  }
}

export function planSimulatorAccessDelivery(input: {
  internal: boolean;
  status: AccessStatus;
  legacySignature: boolean;
}): { grantCookie: boolean; sendVerificationCode: boolean; sendManualApproval: boolean } {
  // L’ancienne fonction approuve @amipanorama.com sans enregistrer de code :
  // le cookie est alors le seul moyen d’entrer. Dès que la nouvelle signature
  // répond, plus aucun cookie immédiat, même si le statut renvoyé est approved.
  const legacyAmiGrant = input.legacySignature && input.internal && input.status === "approved";
  return {
    grantCookie: legacyAmiGrant,
    sendVerificationCode: !legacyAmiGrant,
    sendManualApproval: !input.internal && input.status === "pending",
  };
}

export function accessRequestMessage(internal: boolean, status: AccessStatus): string {
  if (status === "rejected") {
    return "Cette demande d’accès a été refusée. Écrivez à l’équipe AMI Panorama si vous pensez qu’il s’agit d’une erreur.";
  }
  if (internal) {
    return "Un code à 6 chiffres vient d’être envoyé à votre adresse e-mail. Saisissez-le pour ouvrir le simulateur.";
  }
  return "Un code à 6 chiffres vient d’être envoyé à votre adresse e-mail. Après vérification, votre demande sera examinée par notre équipe.";
}

export function accessPendingMessage(status: AccessStatus): string {
  if (status === "rejected") {
    return "Cette demande d’accès a été refusée. Écrivez à l’équipe AMI Panorama si vous pensez qu’il s’agit d’une erreur.";
  }
  return "Votre adresse e-mail est confirmée. L’accès au simulateur est en attente de validation par l’équipe AMI Panorama.";
}

export function verificationEmailParagraph(internal: boolean, status: AccessStatus): string {
  if (status === "rejected") {
    return "Ce code est valable 15 minutes. L’accès à cette adresse a été refusé : il ne débloquera pas le simulateur.";
  }
  if (internal) return "Ce code est valable 15 minutes. Saisissez-le pour ouvrir le simulateur.";
  return "Ce code est valable 15 minutes. Après vérification, votre demande d’accès sera examinée par notre équipe.";
}

export async function requestSimulatorAccess(input: {
  fullName: string;
  establishment: string;
  email: string;
  phone: string;
  codeHash: string;
  approvalTokenHash: string;
}): Promise<SimulatorAccessResult> {
  const { rows, legacySignature } = await rpcWithBroker<{ status: AccessStatus }>("ami_simulator_request_access", {
    p_full_name: input.fullName,
    p_establishment: input.establishment,
    p_email: normalizeEmail(input.email),
    p_phone: input.phone,
    p_code_hash: input.codeHash,
    p_approval_token_hash: input.approvalTokenHash,
  });
  if (!rows[0]?.status) throw new Error("Réponse de vérification invalide.");
  return { status: rows[0].status, legacySignature };
}

export async function decideSimulatorAccess(token: string, decision: "approved" | "rejected"): Promise<{ email: string; full_name: string; status: AccessStatus }> {
  const rows = await rpc<{ email: string; full_name: string; status: AccessStatus }>("ami_simulator_decide_access", {
    p_token_hash: hashVerificationCode(token),
    p_decision: decision,
  });
  if (!rows[0]) throw new Error("Ce lien n’est plus valide.");
  return rows[0];
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
  await rpcWithBroker("ami_simulator_record_event", {
    p_email: normalizeEmail(email),
    p_event_type: "simulation_saved",
    p_payload: payload,
  });
}
