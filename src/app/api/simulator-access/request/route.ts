import { NextRequest, NextResponse } from "next/server";
import {
  accessCookie,
  createAccessCookie,
  createVerificationCode,
  hashVerificationCode,
  isAmiEmail,
  normalizeEmail,
  requestSimulatorAccess,
} from "@/lib/simulator-access";

export async function POST(request: NextRequest) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Demande invalide." }, { status: 400 });
  }

  if (typeof data.company === "string" && data.company.trim()) return NextResponse.json({ ok: true });

  const fullName = String(data.fullName ?? "").trim();
  const establishment = String(data.establishment ?? "").trim();
  const email = normalizeEmail(String(data.email ?? ""));
  const phone = String(data.phone ?? "").trim();
  if (fullName.length < 2 || phone.length < 6 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Merci de renseigner des coordonnées valides." }, { status: 400 });
  }

  const internal = isAmiEmail(email);
  const code = createVerificationCode();
  try {
    const status = await requestSimulatorAccess({ fullName, establishment, email, phone, codeHash: hashVerificationCode(code) });
    if (internal && status === "approved") {
      const response = NextResponse.json({ ok: true, granted: true });
      response.cookies.set(accessCookie.name, createAccessCookie(email), accessCookie.options);
      return response;
    }

    await sendVerificationCode({ email, code, fullName });
    return NextResponse.json({ ok: true, granted: false, status });
  } catch (error) {
    console.error("[AMI Simulator Access] request error", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "La demande n’a pas pu être envoyée." }, { status: 400 });
  }
}

async function sendVerificationCode({ email, code, fullName }: { email: string; code: string; fullName: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_CONFIRMATION_FROM || process.env.LEAD_NOTIFICATION_FROM;
  if (!key || !from) throw new Error("L’envoi d’e-mail n’est pas configuré.");

  const safeName = fullName.replace(/[&<>"']/g, "");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Votre code d’accès au simulateur AMI Panorama",
      html: `<div style="font-family:Arial,sans-serif;color:#101B2D;max-width:560px;margin:auto;padding:32px"><p>Bonjour ${safeName},</p><p>Voici votre code de vérification pour le simulateur de financement AMI Panorama :</p><p style="font-size:30px;font-weight:700;letter-spacing:0.18em;margin:28px 0">${code}</p><p>Ce code est valable 15 minutes. Après vérification, votre demande d’accès sera examinée par notre équipe.</p><p style="color:#64748B;font-size:13px">Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail.</p></div>`,
    }),
  });
  if (!response.ok) throw new Error("Le code n’a pas pu être envoyé. Réessayez dans un instant.");
}
