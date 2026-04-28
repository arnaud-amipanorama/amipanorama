import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let data: Record<string, unknown>;

  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  // Validation des champs requis
  if (!data.email || !data.prenom || !data.nom || !data.rgpd) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  // Log structuré — toujours actif
  console.log("[AMI Lead]", JSON.stringify(data, null, 2));

  // Webhook — configurer WEBHOOK_URL dans .env.local pour activer
  // Compatible Zapier, Make, n8n, Supabase Edge Functions, Airtable Automations
  const webhookUrl = process.env.WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const webhookRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          // Champs supplémentaires pour faciliter l'intégration
          _source: "chat_site_web",
          _timestamp: new Date().toISOString(),
          _version: "1.0",
        }),
      });
      if (!webhookRes.ok) {
        console.error("[AMI Lead] Webhook HTTP error:", webhookRes.status);
      }
    } catch (err) {
      // Ne pas bloquer la réponse si le webhook échoue
      console.error("[AMI Lead] Webhook error:", err);
    }
  }

  // TODO: Ajouter un envoi email ici si besoin
  // Options recommandées : Resend (resend.com), Nodemailer + SMTP
  // Exemple avec Resend :
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({ from: "...", to: "info@amipanorama.com", subject: "Nouveau lead", html: ... })

  return NextResponse.json({ success: true });
}
