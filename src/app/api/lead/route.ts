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

// ──────────────────────────────────────────────────────────────
// DIAGNOSTIC TEMPORAIRE — GET /api/lead
// But : voir en prod pourquoi les leads n'arrivent pas dans Notion,
// sans exposer de secret. Accès aux tests live protégé par ?key=<NOTION_LEADS_DB>.
// À SUPPRIMER une fois le problème résolu.
// ──────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_LEADS_DB;

  // Présence des variables (booléens uniquement, aucun secret révélé)
  const env = {
    NOTION_TOKEN: token ? "présent" : "ABSENT",
    NOTION_LEADS_DB: dbId ? "présent" : "ABSENT",
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "présent" : "absent (normal pour l'instant)",
    NEXT_PUBLIC_BOOKING_URL: process.env.NEXT_PUBLIC_BOOKING_URL ? "présent" : "absent (défaut codé utilisé)",
  };

  const url = new URL(request.url);
  const authorized = !!dbId && url.searchParams.get("key") === dbId;

  if (!authorized) {
    return NextResponse.json({
      ok: true,
      route: "nouvelle route Phase 1 active",
      env,
      note: "Pour les tests Notion live, ajoutez ?key=<valeur de NOTION_LEADS_DB> à l'URL.",
    });
  }

  // Test 1 — le token peut-il LIRE la base ? (valide token + id + connexion)
  let dbRetrieve = "non exécuté";
  if (token && dbId) {
    try {
      const r = await fetch(`https://api.notion.com/v1/databases/${dbId}`, {
        headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28" },
      });
      dbRetrieve = r.ok
        ? "OK — le token a bien accès à la base"
        : `ERREUR ${r.status} — ${(await r.text()).slice(0, 300)}`;
    } catch (e) {
      dbRetrieve = `EXCEPTION — ${String(e).slice(0, 200)}`;
    }
  }

  // Test 2 — insertion réelle (uniquement avec ?test=1) : reproduit EXACTEMENT
  // ce que fait la route, pour révéler un éventuel souci de mapping/propriétés.
  let testInsert = "non exécuté (ajouter &test=1 pour créer une ligne de test à supprimer)";
  if (url.searchParams.get("test") === "1" && token && dbId) {
    const parsed = parseLead({
      prenom: "Diagnostic", nom: "Test", email: "diagnostic@amipanorama.com",
      rgpd: true, source: "formulaire contact", objet: "Demande de programme",
      destination: "Montréal", message: "Ligne de test /api/lead?test=1 — à supprimer",
      date: new Date().toISOString(),
    });
    if (parsed.ok) {
      try {
        const r = await fetch("https://api.notion.com/v1/pages", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
          body: JSON.stringify({
            parent: { database_id: dbId },
            properties: leadToNotionProperties(parsed.lead),
          }),
        });
        testInsert = r.ok
          ? "OK — ligne de test créée dans Notion (pense à la supprimer)"
          : `ERREUR ${r.status} — ${(await r.text()).slice(0, 500)}`;
      } catch (e) {
        testInsert = `EXCEPTION — ${String(e).slice(0, 200)}`;
      }
    }
  }

  return NextResponse.json({ env, dbRetrieve, testInsert });
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
