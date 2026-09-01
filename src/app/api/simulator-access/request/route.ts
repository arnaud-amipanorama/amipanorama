import { NextRequest, NextResponse } from "next/server";
import {
  accessCookie,
  createApprovalToken,
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
  const approvalToken = createApprovalToken();
  try {
    const status = await requestSimulatorAccess({
      fullName,
      establishment,
      email,
      phone,
      codeHash: hashVerificationCode(code),
      approvalTokenHash: hashVerificationCode(approvalToken),
    });
    if (internal && status === "approved") {
      const response = NextResponse.json({ ok: true, granted: true });
      response.cookies.set(accessCookie.name, createAccessCookie(email), accessCookie.options);
      return response;
    }

    await Promise.all([
      sendVerificationCode({ email, code, fullName }),
      status === "pending" ? sendAccessRequestNotification({ fullName, establishment, email, phone, approvalToken }) : Promise.resolve(),
    ]);
    return NextResponse.json({ ok: true, granted: false, status });
  } catch (error) {
    console.error("[AMI Simulator Access] request error", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "La demande n’a pas pu être envoyée." }, { status: 400 });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

async function sendVerificationCode({ email, code, fullName }: { email: string; code: string; fullName: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_CONFIRMATION_FROM || process.env.LEAD_NOTIFICATION_FROM;
  if (!key || !from) throw new Error("L’envoi d’e-mail n’est pas configuré.");

  const safeName = escapeHtml(fullName);
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

async function sendAccessRequestNotification({ fullName, establishment, email, phone, approvalToken }: { fullName: string; establishment: string; email: string; phone: string; approvalToken: string }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_NOTIFICATION_FROM || process.env.LEAD_CONFIRMATION_FROM;
  const to = process.env.LEAD_NOTIFICATION_TO;
  if (!key || !from || !to) throw new Error("La notification d’accès n’est pas configurée.");

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.amipanorama.com").replace(/\/$/, "");
  const makeLink = (decision: "approved" | "rejected") => `${siteUrl}/api/simulator-access/decision?token=${encodeURIComponent(approvalToken)}&decision=${decision}`;
  const details = [
    ["Nom", fullName],
    ["Établissement", establishment || "Non renseigné"],
    ["E-mail", email],
    ["Téléphone", phone],
  ].map(([label, value]) => `<tr><td style="padding:7px 16px 7px 0;color:#64748B">${label}</td><td style="padding:7px 0;color:#101B2D;font-weight:600">${escapeHtml(value)}</td></tr>`).join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Nouvelle demande d’accès au simulateur · ${fullName}`,
      html: `<div style="font-family:Arial,sans-serif;color:#101B2D;max-width:580px;margin:auto;padding:32px"><h1 style="font-size:23px;margin:0 0 20px">Nouvelle demande d’accès</h1><table style="border-collapse:collapse;margin-bottom:28px">${details}</table><p style="color:#475569;line-height:1.55">La personne a confirmé son adresse e-mail. Tu peux décider de son accès directement ci-dessous.</p><p style="margin:28px 0"><a href="${makeLink("approved")}" style="display:inline-block;background:#102A56;color:#fff;padding:13px 20px;border-radius:8px;text-decoration:none;font-weight:700;margin-right:10px">Approuver l’accès</a><a href="${makeLink("rejected")}" style="display:inline-block;border:1px solid #CBD5E1;color:#334155;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">Refuser</a></p><p style="color:#64748B;font-size:13px">Ce lien est à usage unique.</p></div>`,
    }),
  });
  if (!response.ok) throw new Error("La notification d’accès n’a pas pu être envoyée.");
}
