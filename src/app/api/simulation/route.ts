import { NextRequest, NextResponse } from "next/server";

// Capture de simulation (V1) : trace serveur + webhook optionnel.
// Structure prête pour Notion / HubSpot / Postgres (à brancher en S5).
export async function POST(request: NextRequest) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  // Trace serveur, toujours active (logs Vercel)
  console.log("[AMI Simulation]", JSON.stringify(data));

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

  // TODO S5 : insertion Notion (base "Simulations") + push HubSpot deal.
  return NextResponse.json({ success: true });
}
