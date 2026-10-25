import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/transactional-email", () => ({
  sendTransactionalEmail: vi.fn(async () => undefined),
}));

import { POST as requestAccess } from "@/app/api/simulator-access/request/route";
import { POST as verifyAccess } from "@/app/api/simulator-access/verify/route";
import { sendTransactionalEmail } from "@/lib/transactional-email";
import {
  accessPendingMessage,
  accessRequestMessage,
  isAmiEmail,
  isUnknownRpcSignature,
  planSimulatorAccessDelivery,
  recordSimulatorEvent,
  requestSimulatorAccess,
} from "@/lib/simulator-access";

const SECRET = "broker-secret-for-tests";
const SUPABASE = "https://zknulgrqwdnwsqmmqdvt.supabase.co/rest/v1/rpc/";
const ORIGINAL_FETCH = global.fetch;
const ENV_KEYS = ["SIMULATOR_BROKER_SECRET", "SIMULATOR_PASSWORD", "LEAD_CONFIRMATION_FROM", "LEAD_NOTIFICATION_TO"] as const;
const ORIGINAL_ENV = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]])) as Record<(typeof ENV_KEYS)[number], string | undefined>;

function restoreEnv() {
  for (const key of ENV_KEYS) {
    const value = ORIGINAL_ENV[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function post(path: string, body: unknown) {
  return new NextRequest(`https://amipanorama.com${path}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function callsOf(fetchMock: ReturnType<typeof vi.fn>): { url: string; body: Record<string, unknown> }[] {
  return fetchMock.mock.calls.map(([url, init]) => ({
    url: String(url),
    body: JSON.parse(String((init as RequestInit | undefined)?.body ?? "{}")) as Record<string, unknown>,
  }));
}

describe("adresses AMI", () => {
  it("reconnaît uniquement le suffixe @amipanorama.com", () => {
    expect(isAmiEmail("  Equipe@AmiPanorama.com ")).toBe(true);
    expect(isAmiEmail("visiteur@ecole.fr")).toBe(false);
    expect(isAmiEmail("ami@amipanorama.com.evil")).toBe(false);
  });
});

describe("plan de délivrance", () => {
  it("garde le cookie immédiat seulement pour une adresse AMI sur l’ancienne signature", () => {
    expect(planSimulatorAccessDelivery({ internal: true, status: "approved", legacySignature: true })).toEqual({
      grantCookie: true,
      sendVerificationCode: false,
      sendManualApproval: false,
    });
  });

  it("retire le cookie et l’e-mail d’approbation manuelle pour une adresse AMI sur la nouvelle signature", () => {
    expect(planSimulatorAccessDelivery({ internal: true, status: "pending", legacySignature: false })).toEqual({
      grantCookie: false,
      sendVerificationCode: true,
      sendManualApproval: false,
    });
    expect(planSimulatorAccessDelivery({ internal: true, status: "approved", legacySignature: false }).grantCookie).toBe(false);
  });

  it("laisse le visiteur en vérification, avec notification seulement si la demande est en attente", () => {
    expect(planSimulatorAccessDelivery({ internal: false, status: "pending", legacySignature: false })).toEqual({
      grantCookie: false,
      sendVerificationCode: true,
      sendManualApproval: true,
    });
    expect(planSimulatorAccessDelivery({ internal: false, status: "approved", legacySignature: true }).sendManualApproval).toBe(false);
  });
});

describe("messages d’accès", () => {
  it("explique l’attente et le refus en français", () => {
    expect(accessPendingMessage("pending")).toMatch(/en attente de validation/);
    expect(accessPendingMessage("rejected")).toMatch(/refusée/);
    expect(accessRequestMessage(true, "pending")).toMatch(/ouvrir le simulateur/);
    expect(accessRequestMessage(false, "pending")).toMatch(/examinée par notre équipe/);
    expect(accessRequestMessage(false, "rejected")).toMatch(/refusée/);
  });
});

describe("signature RPC", () => {
  it("détecte une fonction absente du cache PostgREST", () => {
    const body = JSON.stringify({
      code: "PGRST202",
      message: "Could not find the function public.ami_simulator_request_access in the schema cache",
    });
    expect(isUnknownRpcSignature(404, body)).toBe(true);
    expect(isUnknownRpcSignature(400, JSON.stringify({ code: "P0001", message: "Secret courtier invalide" }))).toBe(false);
  });
});

describe("appels Supabase", () => {
  beforeEach(() => {
    process.env.SIMULATOR_BROKER_SECRET = SECRET;
    process.env.SIMULATOR_PASSWORD = "cookie-secret";
  });

  afterEach(() => {
    restoreEnv();
    global.fetch = ORIGINAL_FETCH;
    vi.clearAllMocks();
  });

  it("envoie p_broker_secret puis retombe sur l’ancienne signature sans le secret", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse(404, { code: "PGRST202", message: "Could not find the function" }))
      .mockResolvedValueOnce(jsonResponse(200, [{ status: "approved" }]));
    global.fetch = fetchMock;

    const result = await requestSimulatorAccess({
      fullName: "Ada Lovelace",
      establishment: "AMI",
      email: "Ada@AmiPanorama.com",
      phone: "0600000000",
      codeHash: "abc",
      approvalTokenHash: "def",
    });

    expect(result).toEqual({ status: "approved", legacySignature: true });
    const calls = callsOf(fetchMock);
    expect(calls).toHaveLength(2);
    expect(calls[0]?.url).toBe(`${SUPABASE}ami_simulator_request_access`);
    expect(calls[0]?.body.p_broker_secret).toBe(SECRET);
    expect(calls[0]?.body.p_email).toBe("ada@amipanorama.com");
    expect(calls[1]?.body).not.toHaveProperty("p_broker_secret");
    expect(JSON.stringify(calls[1]?.body)).not.toContain(SECRET);
  });

  it("ne retombe pas sur l’ancienne signature si le secret est refusé", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(400, { code: "P0001", message: `refusé ${SECRET}` }));
    global.fetch = fetchMock;

    const error = await requestSimulatorAccess({
      fullName: "Ada Lovelace",
      establishment: "AMI",
      email: "ada@amipanorama.com",
      phone: "0600000000",
      codeHash: "abc",
      approvalTokenHash: "def",
    }).catch((caught: unknown) => caught);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toMatch(/n’a pas pu être enregistrée/);
    expect((error as Error).message).not.toContain(SECRET);
  });

  it("utilise l’ancienne signature quand le secret n’est pas configuré", async () => {
    delete process.env.SIMULATOR_BROKER_SECRET;
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, [{ status: "pending" }]));
    global.fetch = fetchMock;

    const result = await requestSimulatorAccess({
      fullName: "Camille Martin",
      establishment: "Lycée",
      email: "camille@ecole.fr",
      phone: "0600000000",
      codeHash: "abc",
      approvalTokenHash: "def",
    });

    expect(result.legacySignature).toBe(true);
    expect(callsOf(fetchMock)[0]?.body).not.toHaveProperty("p_broker_secret");
  });

  it("explique que le service n’est pas configuré si la nouvelle signature est exigée sans secret", async () => {
    delete process.env.SIMULATOR_BROKER_SECRET;
    global.fetch = vi.fn().mockResolvedValue(jsonResponse(404, { code: "PGRST202", message: "Could not find the function" }));

    await expect(requestSimulatorAccess({
      fullName: "Camille Martin",
      establishment: "Lycée",
      email: "camille@ecole.fr",
      phone: "0600000000",
      codeHash: "abc",
      approvalTokenHash: "def",
    })).rejects.toThrow(/n’est pas configuré/);
  });

  it("enregistre une simulation avec le secret à côté du payload, pas dedans", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    global.fetch = fetchMock;

    await recordSimulatorEvent("Camille@Ecole.fr", { simulation: { ecole: "Lycée" } });

    const call = callsOf(fetchMock)[0];
    expect(call?.url).toBe(`${SUPABASE}ami_simulator_record_event`);
    expect(call?.body.p_broker_secret).toBe(SECRET);
    expect(call?.body.p_email).toBe("camille@ecole.fr");
    expect(call?.body.p_payload).toEqual({ simulation: { ecole: "Lycée" } });
    expect(JSON.stringify(call?.body.p_payload)).not.toContain(SECRET);
  });
});

describe("parcours HTTP", () => {
  beforeEach(() => {
    process.env.SIMULATOR_BROKER_SECRET = SECRET;
    process.env.SIMULATOR_PASSWORD = "cookie-secret";
    process.env.LEAD_CONFIRMATION_FROM = "AMI Panorama <contact@amipanorama.com>";
    process.env.LEAD_NOTIFICATION_TO = "equipe@amipanorama.com";
    vi.mocked(sendTransactionalEmail).mockClear();
  });

  afterEach(() => {
    restoreEnv();
    global.fetch = ORIGINAL_FETCH;
  });

  it("ouvre encore la session AMI tant que la base a l’ancienne signature", async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce(jsonResponse(404, { code: "PGRST202", message: "Could not find the function" }))
      .mockResolvedValueOnce(jsonResponse(200, [{ status: "approved" }]));

    const response = await requestAccess(post("/api/simulator-access/request", {
      fullName: "Ada Lovelace", establishment: "AMI", email: "ada@amipanorama.com", phone: "0600000000",
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, granted: true });
    expect(response.cookies.get("ami_simulator_access")?.value).toBeTruthy();
    expect(JSON.stringify(payload)).not.toContain(SECRET);
    expect(sendTransactionalEmail).not.toHaveBeenCalled();
  });

  it("n’envoie ni cookie ni e-mail d’approbation pour une adresse AMI une fois la migration active", async () => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse(200, [{ status: "pending" }]));

    const response = await requestAccess(post("/api/simulator-access/request", {
      fullName: "Ada Lovelace", establishment: "AMI", email: "ada@amipanorama.com", phone: "0600000000",
    }));
    const payload = await response.json();

    expect(payload.granted).toBe(false);
    expect(payload.status).toBe("pending");
    expect(payload.message).toMatch(/ouvrir le simulateur/);
    expect(response.cookies.get("ami_simulator_access")).toBeUndefined();
    expect(sendTransactionalEmail).toHaveBeenCalledTimes(1);
    expect(vi.mocked(sendTransactionalEmail).mock.calls[0]?.[0]).toMatchObject({
      to: "ada@amipanorama.com",
    });
    expect(vi.mocked(sendTransactionalEmail).mock.calls[0]?.[0].html).toMatch(/ouvrir le simulateur/);
    expect(vi.mocked(sendTransactionalEmail).mock.calls[0]?.[0].html).not.toMatch(/Approuver l’accès/);
    expect(JSON.stringify(payload)).not.toContain(SECRET);
  });

  it("conserve le code et l’e-mail d’approbation pour un visiteur en attente", async () => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse(200, [{ status: "pending" }]));

    const response = await requestAccess(post("/api/simulator-access/request", {
      fullName: "Camille Martin", establishment: "Lycée", email: "camille@ecole.fr", phone: "0600000000",
    }));
    const payload = await response.json();

    expect(payload.granted).toBe(false);
    expect(payload.message).toMatch(/en attente|examinée/);
    expect(response.cookies.get("ami_simulator_access")).toBeUndefined();
    const recipients = vi.mocked(sendTransactionalEmail).mock.calls.map((call) => call[0].to);
    expect(recipients).toEqual(["camille@ecole.fr", "equipe@amipanorama.com"]);
  });

  it("affiche un message d’attente en français sans ouvrir le simulateur", async () => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse(200, [{ status: "pending", granted: false }]));

    const response = await verifyAccess(post("/api/simulator-access/verify", {
      email: "camille@ecole.fr", code: "123456",
    }));
    const payload = await response.json();

    expect(payload).toMatchObject({
      ok: true,
      granted: false,
      status: "pending",
    });
    expect(payload.message).toMatch(/en attente de validation/);
    expect(response.cookies.get("ami_simulator_access")).toBeUndefined();
  });

  it("ouvre le simulateur quand le code est accepté", async () => {
    global.fetch = vi.fn().mockResolvedValue(jsonResponse(200, [{ status: "approved", granted: true }]));

    const response = await verifyAccess(post("/api/simulator-access/verify", {
      email: "ada@amipanorama.com", code: "123456",
    }));
    const payload = await response.json();

    expect(payload).toEqual({ ok: true, granted: true, status: "approved" });
    expect(response.cookies.get("ami_simulator_access")?.value).toBeTruthy();
  });
});
