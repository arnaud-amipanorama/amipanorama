import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from "@/lib/lead";
import { getLead } from "@/lib/lead-repository";
import { currentLeadsEmail, setLeadStatus } from "../actions";
import styles from "../leads.module.css";

export const metadata: Metadata = {
  title: "Fiche lead",
  robots: { index: false, follow: false, nocache: true },
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const email = await currentLeadsEmail();
  if (!email) redirect("/internal/leads");
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const fields: [string, string | undefined][] = [
    ["E-mail", lead.email],
    ["Téléphone", lead.telephone],
    ["Rôle", lead.role],
    ["Profil", lead.profil],
    ["École ou CFA", lead.etablissement],
    ["Entreprise", lead.entreprise],
    ["OPCO", lead.opco],
    ["Statut alternant", lead.statutAlternant],
    ["Destination", lead.destination],
    ["Session", lead.session],
    ["Taille du groupe", lead.tailleGroupe],
    ["Source", lead.source],
    ["UTM", [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" · ") || undefined],
    ["Page", lead.page],
    ["Referrer", lead.referrer],
    ["Reçu le", new Date(lead.date).toLocaleString("fr-FR")],
  ];

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <Link className={styles.back} href="/internal/leads">← Tous les leads</Link>
        <div className={styles.top}>
          <div>
            <div className={styles.eyebrow}>{LEAD_STATUS_LABELS[lead.leadStatus]}</div>
            <h1>{lead.prenom} {lead.nom}</h1>
          </div>
        </div>
        <section className={styles.card}>
          <div className={styles.grid}>
            {fields.map(([label, value]) => (
              <div key={label}><span>{label}</span><strong>{value || "—"}</strong></div>
            ))}
          </div>
          {lead.message && <p className={styles.message}>{lead.message}</p>}
          <form className={styles.status} action={setLeadStatus}>
            <input type="hidden" name="id" value={lead.id} />
            <label>
              Statut du lead
              <select name="status" defaultValue={lead.leadStatus} aria-label="Statut du lead">
                {LEAD_STATUSES.map((status) => <option key={status} value={status}>{LEAD_STATUS_LABELS[status]}</option>)}
              </select>
            </label>
            <button type="submit">Enregistrer</button>
          </form>
        </section>
      </div>
    </div>
  );
}
