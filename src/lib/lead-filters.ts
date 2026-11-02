import type { Lead } from "./lead";

export type LeadFilters = {
  q?: string;
  role?: string;
  status?: string;
  destination?: string;
  source?: string;
};

export function filterLeads(leads: Lead[], filters: LeadFilters): Lead[] {
  const q = filters.q?.trim().toLowerCase();
  return leads.filter((lead) => {
    if (filters.role && lead.role !== filters.role) return false;
    if (filters.status && lead.leadStatus !== filters.status) return false;
    if (filters.destination && lead.destination !== filters.destination) return false;
    if (filters.source && lead.source !== filters.source) return false;
    if (!q) return true;
    const haystack = [lead.prenom, lead.nom, lead.email, lead.telephone, lead.etablissement, lead.entreprise, lead.opco, lead.destination, lead.session, lead.source, lead.utmSource]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
