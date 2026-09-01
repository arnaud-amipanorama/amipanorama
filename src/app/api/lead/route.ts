import { NextRequest, NextResponse } from "next/server";
import {
  parseLead,
  leadToEmailHtml,
  leadToConfirmationHtml,
  leadToNotionProperties,
  type Lead,
} from "@/lib/lead";
import { sendTransactionalEmail } from "@/lib/transactional-email";

/**
 * Diagnostic de configuration. Ne renvoie que des booléens, jamais une clé,
 * jamais une valeur. Sert à vérifier, depuis n'importe où, quels canaux de
 * notification sont réellement branchés sur l'environnement en cours.
 *   curl https://amipanorama.com/api/lead
 */
export async function GET() {
  return NextResponse.json({
    canaux: {
      emailInterne: Boolean(
        process.env.BREVO_API_KEY &&
          process.env.LEAD_NOTIFICATION_TO &&
          process.env.LEAD_NOTIFICATION_FROM
      ),
      accuseReception: Boolean(
        process.env.BREVO_API_KEY && process.env.LEAD_NOTIFICATION_FROM
      ),
      notion: Boolean(process.env.NOTION_TOKEN && process.env.NOTION_LEADS_DB),
      webhook: Boolean(process.env.WEBHOOK_URL),
    },
  });
}

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

  // Trace serveur, toujours active (visible dans les logs Vercel)
  console.log("[AMI Lead]", JSON.stringify(lead));

  // Les canaux de notification tournent en parallèle, en best-effort :
  // un échec n'empêche jamais la confirmation à l'utilisateur.
  // L'accusé de réception au prospect est volontairement dans le même lot :
  // s'il échoue, la demande est quand même enregistrée côté AMI.
  const results = await Promise.allSettled([
    sendEmail(lead),
    sendConfirmation(lead),
    pushToNotion(lead),
    pushToWebhook(lead),
  ]);

  // Filet de sécurité : si AUCUN canal de persistance n'a fonctionné, le lead
  // n'existe plus que dans cette ligne de log. On la rend repérable pour qu'une
  // alerte Vercel puisse s'y accrocher.
  const [interne, , notion, webhook] = results;
  const persiste = [interne, notion, webhook].some(
    (r) => r.status === "fulfilled" && r.value === "sent"
  );
  if (!persiste) {
    console.error("[AMI Lead] AUCUN_CANAL_OK, lead uniquement en logs :", JSON.stringify(lead));
  }

  return NextResponse.json({ success: true });
}

/** "sent" si le canal a réellement transmis, "skipped" s'il n'est pas configuré. */
type ChannelResult = "sent" | "skipped";

// ── Envoi transactionnel via Brevo (aucune dépendance npm) ──
async function emailSend(
  payload: Record<string, unknown>,
  label: string
): Promise<ChannelResult> {
  const from = typeof payload.from === "string" ? payload.from : "";
  const to = Array.isArray(payload.to) && typeof payload.to[0] === "string" ? payload.to[0] : "";
  const subject = typeof payload.subject === "string" ? payload.subject : "";
  const html = typeof payload.html === "string" ? payload.html : "";
  if (!process.env.BREVO_API_KEY || !from || !to || !subject || !html) return "skipped";
  try {
    await sendTransactionalEmail({ from, to, subject, html, replyTo: typeof payload.reply_to === "string" ? payload.reply_to : undefined });
  } catch (error) {
    console.error(`[AMI Lead] Brevo ${label} error:`, error);
    return "skipped";
  }
  return "sent";
}

// ── Notification interne (vers la boîte AMI) ──
async function sendEmail(lead: Lead): Promise<ChannelResult> {
  const to = process.env.LEAD_NOTIFICATION_TO;
  const from = process.env.LEAD_NOTIFICATION_FROM;
  if (!to || !from) return "skipped"; // non configuré → on saute proprement

  return emailSend(
    {
      from,
      to: [to],
      reply_to: lead.email,
      subject: `Nouveau lead, ${lead.prenom} ${lead.nom}${lead.etablissement ? ` (${lead.etablissement})` : ""}`,
      html: leadToEmailHtml(lead),
    },
    "notification"
  );
}

// ── Accusé de réception (vers le prospect) ──
async function sendConfirmation(lead: Lead): Promise<ChannelResult> {
  const from = process.env.LEAD_CONFIRMATION_FROM || process.env.LEAD_NOTIFICATION_FROM;
  if (!from) return "skipped";

  const replyTo = process.env.LEAD_NOTIFICATION_TO || undefined;
  const bookingUrl =
    process.env.NEXT_PUBLIC_BOOKING_URL || "https://calendar.app.google/sLYXj9s7nDiMwzYu8";

  return emailSend(
    {
      from,
      to: [lead.email],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject: "Votre demande a bien été reçue, AMI Panorama",
      html: leadToConfirmationHtml(lead, bookingUrl),
    },
    "confirmation"
  );
}

// ── Miroir Notion via l'API REST (aucune dépendance npm) ──
async function pushToNotion(lead: Lead): Promise<ChannelResult> {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_LEADS_DB;
  if (!token || !dbId) return "skipped"; // non configuré → on saute proprement

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
    return "skipped";
  }
  return "sent";
}

// ── Webhook générique optionnel (Zapier, Make, Airtable, Google Apps Script…) ──
async function pushToWebhook(lead: Lead): Promise<ChannelResult> {
  const url = process.env.WEBHOOK_URL;
  if (!url) return "skipped";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, _source: lead.source, _version: "2.0" }),
  });
  if (!res.ok) {
    console.error("[AMI Lead] Webhook error:", res.status);
    return "skipped";
  }
  return "sent";
}
