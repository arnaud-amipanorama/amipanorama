import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { POST } from "@/app/api/simulation/route";
import { cookies } from "next/headers";
import { createAccessCookie } from "@/lib/simulator-access";

const SECRET = "broker-secret-for-tests";

describe("trace de simulation", () => {
  beforeEach(() => {
    process.env.SIMULATOR_PASSWORD = "cookie-secret";
    process.env.SIMULATOR_BROKER_SECRET = SECRET;
    delete process.env.SIMULATION_WEBHOOK_URL;
    vi.mocked(cookies).mockReset();
  });

  it("renvoie succès et joint le secret serveur hors du payload", async () => {
    const email = "ada@amipanorama.com";
    vi.mocked(cookies).mockResolvedValue({ get: () => ({ value: createAccessCookie(email) }) } as never);
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    global.fetch = fetchMock;

    const response = await POST(new NextRequest("https://amipanorama.com/api/simulation", {
      method: "POST",
      body: JSON.stringify({ ecole: "AMI" }),
    }));

    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload).toEqual({ success: true });
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.p_broker_secret).toBe(SECRET);
    expect(body.p_email).toBe(email);
    expect(JSON.stringify(body.p_payload)).not.toContain(SECRET);
    expect(JSON.stringify(payload)).not.toContain(SECRET);
  });

  it("laisse le téléchargement aboutir si l’historique d’accès échoue", async () => {
    vi.mocked(cookies).mockResolvedValue({ get: () => ({ value: createAccessCookie("ada@amipanorama.com") }) } as never);
    global.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ code: "P0001", message: `refusé ${SECRET}` }), { status: 400 }));

    const response = await POST(new NextRequest("https://amipanorama.com/api/simulation", {
      method: "POST",
      body: JSON.stringify({ ecole: "AMI" }),
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ success: true });
    expect(JSON.stringify(payload)).not.toContain(SECRET);
  });
});
