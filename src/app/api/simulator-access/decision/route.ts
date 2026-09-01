import { NextRequest, NextResponse } from "next/server";
import { decideSimulatorAccess } from "@/lib/simulator-access";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const decision = request.nextUrl.searchParams.get("decision");
  if (!token || (decision !== "approved" && decision !== "rejected")) {
    return page("Lien invalide", "Ce lien ne permet pas de traiter cette demande.", 400);
  }

  try {
    const result = await decideSimulatorAccess(token, decision);
    if (result.status === "approved") void sendDecisionEmail(result.email, result.full_name);
    return page(
      result.status === "approved" ? "Accès approuvé" : "Accès refusé",
      result.status === "approved"
        ? `${escapeHtml(result.full_name)} vient de recevoir un e-mail lui indiquant que le simulateur est accessible.`
        : `La demande de ${escapeHtml(result.full_name)} a été refusée.`,
    );
  } catch (error) {
    console.error("[AMI Simulator Access] decision error", error);
    return page("Lien expiré", "Cette demande a déjà été traitée ou ce lien n’est plus valide.", 410);
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function page(title: string, message: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · AMI Panorama</title></head><body style="margin:0;background:#F7F8FA;color:#101B2D;font-family:Arial,sans-serif"><main style="max-width:600px;margin:12vh auto;padding:48px 32px;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(16,27,45,.09)"><p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#385D9D;font-weight:700">AMI Panorama</p><h1 style="font-size:32px;margin:12px 0 18px">${title}</h1><p style="font-size:17px;line-height:1.6;color:#475569">${message}</p></main></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } },
  );
}

async function sendDecisionEmail(email: string, fullName: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_CONFIRMATION_FROM || process.env.LEAD_NOTIFICATION_FROM;
  if (!key || !from) return;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.amipanorama.com").replace(/\/$/, "");
  const safeName = fullName.replace(/[&<>'"]/g, "");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Votre accès au simulateur AMI Panorama est approuvé",
      html: `<div style="font-family:Arial,sans-serif;color:#101B2D;max-width:560px;margin:auto;padding:32px"><p>Bonjour ${safeName},</p><p>Votre demande d’accès au simulateur de financement AMI Panorama a été approuvée.</p><p style="margin:28px 0"><a href="${siteUrl}/internal/simulator" style="display:inline-block;background:#102A56;color:#fff;padding:13px 20px;border-radius:8px;text-decoration:none;font-weight:700">Ouvrir le simulateur</a></p><p style="color:#64748B;font-size:13px">À l’ouverture, saisissez votre adresse e-mail et le code reçu pour accéder à votre espace.</p></div>`,
    }),
  });
  if (!response.ok) console.error("[AMI Simulator Access] decision email error", response.status);
}
