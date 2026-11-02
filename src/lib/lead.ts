// ──────────────────────────────────────────────────────────────
// Schéma de lead unique, partagé par le formulaire de contact,
// le ChatWidget et la route API. Source de vérité unique.
// Aucune dépendance externe : validation maison, simple et robuste.
// ──────────────────────────────────────────────────────────────

export const LEAD_ROLES = ["alternant", "referent", "etudiant", "autre"] as const;
export type LeadRole = (typeof LEAD_ROLES)[number];

export const LEAD_STATUSES = ["nouveau", "a_contacter", "en_cours", "relance", "inscrit", "clos"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  nouveau: "Nouveau",
  a_contacter: "À contacter",
  en_cours: "En cours",
  relance: "Relance",
  inscrit: "Inscrit",
  clos: "Clos",
};

export type Lead = {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  etablissement?: string;
  /** Rôle commercial : alternant, référent mobilité, étudiant, autre. */
  role?: LeadRole;
  profil?: string;
  objet?: string;
  opco?: string;
  entreprise?: string;
  statutAlternant?: string;
  destination?: string;
  session?: string;
  tailleGroupe?: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  leadStatus: LeadStatus;
  rgpd: boolean;
  source: string; // ex. "formulaire contact" | "chat site web"
  page?: string;
  date: string; // ISO
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function roleOf(value: string, profil: string): LeadRole | undefined {
  const raw = value.toLowerCase();
  if ((LEAD_ROLES as readonly string[]).includes(raw)) return raw as LeadRole;
  const hint = `${value} ${profil}`.toLowerCase();
  if (hint.includes("référent") || hint.includes("referent") || hint.includes("cfa") || hint.includes("école") || hint.includes("ecole")) return "referent";
  if (hint.includes("étudiant") || hint.includes("etudiant")) return "etudiant";
  if (hint.includes("alternant") || hint.includes("apprenti")) return "alternant";
  return value || profil ? "autre" : undefined;
}

/**
 * Valide + normalise un payload brut en Lead propre.
 * Retourne soit { ok: true, lead } soit { ok: false, errors }.
 */
export function parseLead(
  raw: Record<string, unknown>
): { ok: true; lead: Lead } | { ok: false; errors: string[] } {
  const errors: string[] = [];

  const prenom = str(raw.prenom);
  const nom = str(raw.nom);
  const email = str(raw.email);
  const rgpd = raw.rgpd === true || raw.rgpd === "true" || raw.rgpd === "on";

  if (!prenom) errors.push("Prénom requis");
  if (!nom) errors.push("Nom requis");
  if (!email || !EMAIL_RE.test(email)) errors.push("Email invalide");
  if (!rgpd) errors.push("Consentement requis");

  // Garde-fous longueur (anti-abus léger)
  const message = str(raw.message, 5000);
  if (message.length > 5000) errors.push("Message trop long");

  if (errors.length) return { ok: false, errors };

  const profil = str(raw.profil);
  const role = roleOf(str(raw.role, 40), profil);
  const lead: Lead = {
    id: str(raw.id, 80) || crypto.randomUUID(),
    prenom,
    nom,
    email,
    telephone: str(raw.telephone, 40) || undefined,
    etablissement: str(raw.etablissement) || undefined,
    role,
    profil: profil || undefined,
    objet: str(raw.objet) || undefined,
    opco: str(raw.opco) || undefined,
    entreprise: str(raw.entreprise) || undefined,
    statutAlternant: str(raw.statutAlternant) || undefined,
    destination: str(raw.destination) || undefined,
    session: str(raw.session) || undefined,
    tailleGroupe: str(raw.tailleGroupe, 40) || undefined,
    message: message || undefined,
    utmSource: str(raw.utmSource, 120) || undefined,
    utmMedium: str(raw.utmMedium, 120) || undefined,
    utmCampaign: str(raw.utmCampaign, 160) || undefined,
    utmContent: str(raw.utmContent, 160) || undefined,
    utmTerm: str(raw.utmTerm, 160) || undefined,
    referrer: str(raw.referrer, 500) || undefined,
    leadStatus: "nouveau",
    rgpd: true,
    source: str(raw.source) || "site web",
    page: str(raw.page) || undefined,
    date: str(raw.date, 40) || new Date().toISOString(),
  };

  return { ok: true, lead };
}

/** Corps HTML de l'email de notification interne. */
export function leadToEmailHtml(lead: Lead): string {
  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:6px 14px 6px 0;color:#8A9BB0;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#0B1829;font-size:14px">${escapeHtml(
          value
        )}</td></tr>`
      : "";

  return `<!doctype html><html><body style="margin:0;background:#F8F6F1;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px">
      <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#1B3D88;font-weight:700;margin-bottom:6px">Nouveau lead · AMI Panorama</div>
      <h1 style="font-size:20px;color:#0B1829;margin:0 0 4px">${escapeHtml(lead.prenom)} ${escapeHtml(lead.nom)}</h1>
      <div style="font-size:13px;color:#8A9BB0;margin-bottom:20px">${escapeHtml(lead.source)} · ${new Date(lead.date).toLocaleString("fr-FR")}</div>
      <div style="background:#fff;border:1px solid rgba(11,24,41,0.09);border-radius:12px;padding:20px 22px">
        <table style="width:100%;border-collapse:collapse">
          ${row("Email", lead.email)}
          ${row("Téléphone", lead.telephone)}
          ${row("Établissement", lead.etablissement)}
          ${row("Rôle", lead.role)}
          ${row("Profil", lead.profil)}
          ${row("Statut alternant", lead.statutAlternant)}
          ${row("OPCO", lead.opco)}
          ${row("Entreprise", lead.entreprise)}
          ${row("Objet", lead.objet)}
          ${row("Destination", lead.destination)}
          ${row("Session", lead.session)}
          ${row("Taille du groupe", lead.tailleGroupe)}
          ${row("Source", lead.source)}
          ${row("UTM", [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" · ") || undefined)}
          ${row("Page", lead.page)}
        </table>
        ${
          lead.message
            ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(11,24,41,0.09)"><div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8A9BB0;margin-bottom:8px">Message</div><div style="font-size:14px;color:#0B1829;line-height:1.7;white-space:pre-line">${escapeHtml(
                lead.message
              )}</div></div>`
            : ""
        }
      </div>
      <div style="margin-top:16px;font-size:13px;color:#8A9BB0">Répondre directement à cet email contacte ${escapeHtml(lead.email)}.</div>
    </div>
  </body></html>`;
}

/**
 * Accusé de réception envoyé AU PROSPECT.
 * Objectif : confirmer que la demande est bien arrivée, rappeler ce qui a été
 * transmis, et donner la prochaine étape (le lien de réservation). Sans cet
 * email, un référent qui remplit le formulaire n'a aucune trace de sa démarche.
 */
export function leadToConfirmationHtml(lead: Lead, bookingUrl: string): string {
  const recap = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:5px 14px 5px 0;color:#8A9BB0;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:5px 0;color:#0B1829;font-size:14px">${escapeHtml(
          value
        )}</td></tr>`
      : "";

  return `<!doctype html><html lang="fr"><body style="margin:0;background:#F8F6F1;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px">
      <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#1B3D88;font-weight:700;margin-bottom:18px">AMI Panorama</div>

      <h1 style="font-size:22px;line-height:1.3;color:#0B1829;margin:0 0 16px">Bonjour ${escapeHtml(lead.prenom)}, votre demande est bien arrivée.</h1>

      <p style="font-size:15px;line-height:1.75;color:#4A5870;margin:0 0 24px">
        Merci de nous avoir contactés. Notre équipe revient vers vous rapidement
        avec un premier cadrage adapté à votre contexte, destination, filière,
        dates et format du séjour.
      </p>

      <div style="background:#fff;border:1px solid rgba(11,24,41,0.09);border-radius:12px;padding:20px 22px;margin-bottom:24px">
        <div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8A9BB0;margin-bottom:12px">Ce que nous avons reçu</div>
        <table style="width:100%;border-collapse:collapse">
          ${recap("Établissement", lead.etablissement)}
          ${recap("Objet", lead.objet)}
          ${recap("Destination", lead.destination)}
          ${recap("Taille du groupe", lead.tailleGroupe)}
        </table>
      </div>

      <p style="font-size:15px;line-height:1.75;color:#4A5870;margin:0 0 20px">
        Vous préférez en parler de vive voix ? Réservez un créneau de 20 minutes,
        sans engagement.
      </p>

      <a href="${escapeHtml(bookingUrl)}" style="display:inline-block;background:#1B3D88;color:#fff;text-decoration:none;font-size:15px;font-weight:bold;padding:14px 28px;border-radius:8px">Réserver un échange</a>

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(11,24,41,0.09);font-size:13px;line-height:1.7;color:#8A9BB0">
        AMI Panorama, opérateur de mobilité internationale pour les CFA et les établissements de formation.<br />
        Une question d'ici là ? Répondez simplement à cet email.
      </div>
    </div>
  </body></html>`;
}

/** Propriétés Notion (noms = colonnes de la base Leads). */
export function leadToNotionProperties(lead: Lead): Record<string, unknown> {
  const text = (v?: string) =>
    v ? { rich_text: [{ text: { content: v.slice(0, 1900) } }] } : { rich_text: [] };
  const select = (v?: string) => (v ? { select: { name: v.slice(0, 100) } } : { select: null });

  return {
    Nom: { title: [{ text: { content: `${lead.prenom} ${lead.nom}`.trim() } }] },
    Email: { email: lead.email },
    "Téléphone": lead.telephone ? { phone_number: lead.telephone } : { phone_number: null },
    "Établissement": text(lead.etablissement),
    Profil: select(lead.profil),
    Objet: select(lead.objet),
    Destination: select(lead.destination),
    "Taille du groupe": text(lead.tailleGroupe),
    Message: text(lead.message),
    Source: select(lead.source),
    Statut: { select: { name: "Nouveau" } },
    "Consentement RGPD": { checkbox: lead.rgpd },
    "Reçu le": { date: { start: lead.date } },
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
