import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseLead } from "@/lib/lead";
import { persistLead } from "@/lib/lead-repository";
import { accessCookie, readAccessCookie, recordSimulatorEvent } from "@/lib/simulator-access";

// Capture de simulation (V1) : trace serveur + webhook optionnel.
// Structure prête pour Notion / HubSpot / Postgres (à brancher en S5).
export async function POST(request: NextRequest) {
  const jar = await cookies();
  const email = readAccessCookie(jar.get(accessCookie.name)?.value);
  if (!email) {
    return NextResponse.json({ error: "Accès au simulateur de groupe requis" }, { status: 401 });
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  // Trace serveur, toujours active (logs Vercel)
  console.log("[AMI Simulation]", JSON.stringify(data));
  await recordGroupSimulatorLead(data);

  // Webhook optionnel dédié (Make/n8n/HubSpot…), non bloquant
  const url = process.env.SIMULATION_WEBHOOK_URL;
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _source: "simulateur", _version: "1.0" }),
      });
      if (!res.ok) console.error("[AMI Simulation] Webhook error:", res.status);
    } catch (err) {
      console.error("[AMI Simulation] Webhook error:", err);
    }
  }

  // Historique d'utilisation du simulateur, rattaché uniquement à un accès
  // déjà vérifié. L'échec de cette trace ne bloque jamais le téléchargement.
  try {
    await recordSimulatorEvent(email, {
      simulation: data,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[AMI Simulation] Access tracking error:", err);
  }

  // TODO S5 : insertion Notion (base "Simulations") + push HubSpot deal.
  return NextResponse.json({ success: true });
}

/**
 * Le simulateur de groupe reste un outil de financement.
 * On n’en garde ici que les coordonnées commerciales du référent,
 * jamais les montants.
 */
async function recordGroupSimulatorLead(data: Record<string, unknown>): Promise<void> {
  const source = typeof data.source === "string" ? data.source : "";
  // Le parcours guidé envoie déjà un lead via /api/lead.
  if (source.includes("parcours guidé")) return;
  const meta = data.meta && typeof data.meta === "object" ? (data.meta as Record<string, unknown>) : {};
  const email = String(meta.email ?? data.email ?? "").trim();
  if (!email.includes("@")) return;
  const referent = String(meta.referent ?? data.referent ?? "").trim();
  const [prenom, ...rest] = referent.split(/\s+/);
  const parsed = parseLead({
    prenom: prenom || "Référent",
    nom: rest.join(" ") || "mobilité",
    email: meta.email ?? data.email,
    telephone: meta.telephone ?? data.telephone,
    etablissement: meta.etablissement ?? data.etablissement,
    role: "referent",
    profil: "Référent mobilité",
    objet: "Simulation de groupe",
    destination: meta.destination ?? data.destination,
    session: meta.dateSouhaitee ?? data.dateSouhaitee,
    tailleGroupe: meta.students != null ? String(meta.students) : undefined,
    message: "Demande issue du simulateur de groupe. Les montants de financement ne sont pas copiés dans le CRM commercial.",
    rgpd: true,
    source: "simulateur de groupe",
    page: "/internal/simulator",
    date: typeof data.date === "string" ? data.date : new Date().toISOString(),
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
  });
  if (!parsed.ok) return;
  await persistLead(parsed.lead);
}
