import { NextRequest, NextResponse } from "next/server";
import {
  parseLead,
  leadToEmailHtml,
  leadToNotionProperties,
  type Lead,
} from "@/lib/lead";

export async function POST(request: NextRequest) {
  let raw: Record<string, unknown>;

  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  // ── Anti-spam : honeypot. Un bot remplit ce champ caché ; un humain non. ──
  // On répond 200 pour ne pas signaler au bot que sa soumission a été rejetée.
  if (typeof raw.company === "string" && raw.company.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  // ── Validation serveur via le schéma unique ──
  const parsed = parseLead(raw);
  if (!parsed.ok) {
    return NextResponse.json(
      { error: "Champs invalides", details: parsed.errors },
      { status: 400 }
    );
  }
  const lead = parsed.lead;

  // Trace serveur — toujours active (visible dans les logs Vercel)
  console.log("[AMI Lead]", JSON.stringify(lead));

  // Les canaux de notification tournent en parallèle, en best-effort :
  // un échec n'empêche jamais la confirmation à l'utilisateur.
  await Promise.allSettled([sendEmail(lead), pushToNotion(lead), pushToWebhook(lead)]);

  return NextResponse.json({ success: true });
}

// ── Email via l'API REST de Resend (aucune dépendance npm) ──
async function sendEmail(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_TO;
  const from = process.env.LEAD_NOTIFICATION_FROM;
  if (!key || !to || !from) return; // non configuré → on saute proprement

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `Nouveau lead — ${lead.prenom} ${lead.nom}${lead.etablissement ? ` (${lead.etablissement})` : ""}`,
      html: leadToEmailHtml(lead),
    }),
  });
  if (!res.ok) {
    console.error("[AMI Lead] Resend error:", res.status, await res.text().catch(() => ""));
  }
}

// ── Miroir Notion via l'API REST (aucune dépendance npm) ──
async function pushToNotion(lead: Lead) {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_LEADS_DB;
  if (!token || !dbId) return; // non configuré → on saute proprement

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: leadToNotionProperties(lead),
    }),
  });
  if (!res.ok) {
    console.error("[AMI Lead] Notion error:", res.status, await res.text().catch(() => ""));
  }
}

// ── Webhook générique optionnel (Zapier, Make, Airtable…) ──
async function pushToWebhook(lead: Lead) {
  const url = process.env.WEBHOOK_URL;
  if (!url) return;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, _source: lead.source, _version: "2.0" }),
  });
  if (!res.ok) {
    console.error("[AMI Lead] Webhook error:", res.status);
  }
}
