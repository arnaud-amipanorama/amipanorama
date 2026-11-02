import type { Lead } from "./lead";

const COLUMNS: [string, (lead: Lead) => string | undefined][] = [
  ["Date", (lead) => lead.date],
  ["Statut", (lead) => lead.leadStatus],
  ["Prénom", (lead) => lead.prenom],
  ["Nom", (lead) => lead.nom],
  ["Email", (lead) => lead.email],
  ["Téléphone", (lead) => lead.telephone],
  ["Rôle", (lead) => lead.role],
  ["École ou CFA", (lead) => lead.etablissement],
  ["OPCO", (lead) => lead.opco],
  ["Entreprise", (lead) => lead.entreprise],
  ["Statut alternant", (lead) => lead.statutAlternant],
  ["Destination", (lead) => lead.destination],
  ["Session", (lead) => lead.session],
  ["Source", (lead) => lead.source],
  ["UTM source", (lead) => lead.utmSource],
  ["UTM medium", (lead) => lead.utmMedium],
  ["UTM campaign", (lead) => lead.utmCampaign],
  ["Page", (lead) => lead.page],
  ["Message", (lead) => lead.message],
];

function cell(value: string | undefined): string {
  const text = value ?? "";
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function leadsToCsv(leads: Lead[]): string {
  const header = COLUMNS.map(([label]) => cell(label)).join(",");
  const rows = leads.map((lead) => COLUMNS.map(([, read]) => cell(read(lead))).join(","));
  return `\uFEFF${[header, ...rows].join("\n")}\n`;
}
