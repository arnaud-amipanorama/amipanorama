import type { GuidedOutcome } from "@/lib/simulator/guided";
import type { SimulationData } from "../SimulationDocument";
import type { GuidedContact } from "./contact";

/** Résultat guidé → données du document PDF. Le PDF ne montre rien d'autre que la synthèse à l'écran. */
export function buildGuidedPdfData(outcome: GuidedOutcome, contact: GuidedContact, generatedAt: Date = new Date()): SimulationData {
  const { result } = outcome;
  return {
    meta: {
      etablissement: contact.etablissement.trim() || "Établissement",
      referent: `${contact.prenom} ${contact.nom}`.trim(),
      email: contact.email.trim(),
      destination: outcome.destination.label,
      destinationNote: outcome.destination.known ? undefined : "destination non choisie, estimation provisoire",
      provisionalNote: outcome.provisionalNote ?? undefined,
      dateSouhaitee: contact.dateSouhaitee.trim(),
      generatedAt: generatedAt.toLocaleDateString("fr-FR"),
      students: result.totalStudents,
      days: outcome.days,
      durationNote: outcome.durationAssumed ? "durée supposée" : undefined,
      companions: outcome.companions,
    },
    kpis: {
      racAvg: result.racAvg,
      financementsMobilisables: result.apprentiTotal + result.reinjected,
      montantConserve: result.keptTotal,
      coutBrut: result.totalCostAll,
      coutParEtudiant: result.totalCostPerStudent,
      apprentiTotal: result.apprentiTotal,
      referentTotal: result.referentTotal,
      reinjected: result.reinjected,
      racFinalTotal: result.racFinalTotal,
      confidence: outcome.confidence,
    },
    opco: outcome.opcoCards.map((card) => ({
      label: card.label,
      count: card.count,
      apprenti: card.fundingPerParticipant,
      referent: card.referentPerParticipant,
      how: card.how,
      condition: card.condition,
      toConfirm: card.toConfirm,
      remaining: card.remainingPerParticipant,
      source: card.source,
    })),
    assumptions: outcome.assumptions.map(({ label, value, detail, toConfirm, provisional }) => ({ label, value, detail, toConfirm, provisional })),
  };
}
