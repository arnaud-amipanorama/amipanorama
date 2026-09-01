import { NextRequest, NextResponse } from "next/server";
import { accessCookie, createAccessCookie, normalizeEmail, verifySimulatorAccess } from "@/lib/simulator-access";

export async function POST(request: NextRequest) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Demande invalide." }, { status: 400 });
  }

  const email = normalizeEmail(String(data.email ?? ""));
  const code = String(data.code ?? "").replace(/\s/g, "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Saisissez l’e-mail utilisé et le code à 6 chiffres." }, { status: 400 });
  }

  try {
    const result = await verifySimulatorAccess(email, code);
    const response = NextResponse.json({ ok: true, granted: result.granted, status: result.status });
    if (result.granted) response.cookies.set(accessCookie.name, createAccessCookie(email), accessCookie.options);
    return response;
  } catch (error) {
    console.error("[AMI Simulator Access] verify error", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Code invalide ou expiré." }, { status: 400 });
  }
}
