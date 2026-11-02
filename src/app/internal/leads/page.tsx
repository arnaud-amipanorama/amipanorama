import type { Metadata } from "next";
import Link from "next/link";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/lead";
import { filterLeads } from "@/lib/lead-filters";
import { leadStoreMode, listLeads } from "@/lib/lead-repository";
import { currentLeadsEmail, signOutLeads } from "./actions";
import LoginForm from "./LoginForm";
import styles from "./leads.module.css";

export const metadata: Metadata = {
  title: "Leads commerciaux",
  robots: { index: false, follow: false, nocache: true },
};

type Search = { q?: string; role?: string; status?: string; destination?: string; source?: string };

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const email = await currentLeadsEmail();
  const params = await searchParams;
  const filters = {
    q: first(params.q),
    role: first(params.role),
    status: first(params.status),
    destination: first(params.destination),
    source: first(params.source),
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={styles.top}>
          <div>
            <div className={styles.eyebrow}>AMI Panorama · commercial</div>
            <h1>Leads</h1>
            <p className={styles.note}>Questionnaires, simulateur et contact. Les montants de financement ne sont pas dans cette liste.</p>
          </div>
          {email && (
            <div className={styles.actions}>
              <span>{email}</span>
              <form action={signOutLeads}><button className={styles.ghost} type="submit">Sortir</button></form>
            </div>
          )}
        </div>
        {email ? <LeadList filters={filters} /> : <Locked />}
      </div>
    </div>
  );
}

function Locked() {
  return (
    <section className={styles.card}>
      <h2>Accès réservé à l’équipe commerciale</h2>
      <p className={styles.note}>Les rôles SUPER_ADMIN, DIRECTION et OPERATIONS peuvent ouvrir cette page. Un accès au simulateur de groupe ne suffit pas.</p>
      <LoginForm />
    </section>
  );
}

async function LeadList({ filters }: { filters: { q: string; role: string; status: string; destination: string; source: string } }) {
  const leads = await listLeads();
  const visible = filterLeads(leads, filters);
  const destinations = [...new Set(leads.map((lead) => lead.destination).filter(Boolean))] as string[];
  const sources = [...new Set(leads.map((lead) => lead.source).filter(Boolean))];
  const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
  const mode = leadStoreMode();

  return (
    <>
      <form className={styles.filters}>
        <input name="q" defaultValue={filters.q} placeholder="Nom, e-mail, école, OPCO…" aria-label="Recherche" />
        <select name="role" defaultValue={filters.role} aria-label="Rôle">
          <option value="">Tous les rôles</option>
          <option value="alternant">Alternant</option>
          <option value="referent">Référent</option>
          <option value="etudiant">Étudiant</option>
          <option value="autre">Autre</option>
        </select>
        <select name="status" defaultValue={filters.status} aria-label="Statut">
          <option value="">Tous les statuts</option>
          {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select name="destination" defaultValue={filters.destination} aria-label="Destination">
          <option value="">Toutes les destinations</option>
          {destinations.map((destination) => <option key={destination}>{destination}</option>)}
        </select>
        <select name="source" defaultValue={filters.source} aria-label="Source">
          <option value="">Toutes les sources</option>
          {sources.map((source) => <option key={source}>{source}</option>)}
        </select>
        <button type="submit">Filtrer</button>
      </form>
      <div className={styles.actions} style={{ marginBottom: 14 }}>
        <Link href={`/api/internal/leads/export?${query.toString()}`}>Exporter le CSV</Link>
        <span className={styles.note}>{visible.length} lead{visible.length > 1 ? "s" : ""} · stockage {mode === "none" ? "non branché" : mode}</span>
      </div>
      <div className={styles.tableWrap}>
        {visible.length === 0 ? (
          <p className={styles.empty}>
            {mode === "none"
              ? "Aucun journal local n’est configuré, et la table commercial_leads n’est pas encore activée. Les formulaires continuent d’envoyer les e-mails, Notion et le webhook."
              : "Aucun lead ne correspond à ces filtres."}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Reçu</th><th>Contact</th><th>Rôle</th><th>École / entreprise</th><th>Projet</th><th>Source</th><th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((lead) => (
                <tr key={lead.id}>
                  <td>{new Date(lead.date).toLocaleString("fr-FR")}</td>
                  <td><Link href={`/internal/leads/${lead.id}`}>{lead.prenom} {lead.nom}</Link><br />{lead.email}</td>
                  <td>{lead.role ?? "—"}</td>
                  <td>{lead.etablissement ?? "—"}{lead.entreprise ? <><br />{lead.entreprise}</> : null}</td>
                  <td>{lead.destination ?? "—"}{lead.session ? <><br />{lead.session}</> : null}</td>
                  <td>{lead.source}{lead.utmSource ? <><br />{lead.utmSource}</> : null}</td>
                  <td>{LEAD_STATUS_LABELS[lead.leadStatus as LeadStatus] ?? lead.leadStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
