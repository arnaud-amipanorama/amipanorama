type TransactionalEmail = {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

function parseAddress(value: string) {
  const match = value.match(/^\s*(.*?)\s*<([^<>\s]+@[^<>\s]+)>\s*$/);
  return match ? { name: match[1].trim() || "AMI Panorama", email: match[2] } : { name: "AMI Panorama", email: value.trim() };
}

export async function sendTransactionalEmail({ from, to, subject, html, replyTo }: TransactionalEmail) {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error("L’envoi d’e-mail n’est pas encore configuré.");

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: parseAddress(from),
      to: [{ email: to }],
      ...(replyTo ? { replyTo: parseAddress(replyTo) } : {}),
      subject,
      htmlContent: html,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "L’e-mail n’a pas pu être envoyé.");
  }
}
