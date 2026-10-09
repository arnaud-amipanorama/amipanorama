"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { advancedToGuided, expertInitialSnapshot, resolveDestination, simulatorUrl, unknownOpcoCount, type AdvancedSnapshot, type SimulatorMode } from "@/lib/simulator/guided";
import SimulatorApp, { type SimulatorContact } from "./SimulatorApp";
import SimulatorChooser from "./SimulatorChooser";
import GuidedSimulator from "./guided/GuidedSimulator";
import { EMPTY_CONTACT, type GuidedContact } from "./guided/contact";
import { guidedSession, useGuidedSession } from "./guided/guided-storage";

/**
 * Deux simulateurs au-dessus du même moteur : le « Simulateur guidé » et le
 * « Simulateur expert » (l'interface détaillée, inchangée). Le mode vient de
 * l'URL (`?mode=guided` / `?mode=expert`) ; sans mode, on affiche le choix.
 * Passer de l'un à l'autre convertit l'état au lieu de le réinitialiser.
 */
export default function SimulatorShell({ mode }: { mode: SimulatorMode | null }) {
  const router = useRouter();
  const { answers, screen, hydrated } = useGuidedSession();
  // Dernier état du simulateur expert, pour le retrouver en y revenant.
  const [expert, setExpert] = useState<AdvancedSnapshot | null>(null);
  const [contact, setContact] = useState<GuidedContact>(EMPTY_CONTACT);
  const go = (next: SimulatorMode | null) => router.push(simulatorUrl(next));

  // Tant que l'état enregistré n'est pas relu, on n'affiche rien : pas d'écran qui clignote.
  if (!hydrated) return <div style={{ minHeight: "100svh", background: "#0B1018" }} />;

  if (mode === "expert") {
    const initial = expertInitialSnapshot(answers, expert);
    const unknown = answers.opcoKnowledge === null ? 0 : unknownOpcoCount(answers);
    const notices = [
      unknown > 0 ? `${unknown} participant${unknown > 1 ? "s" : ""} sans OPCO connu ${unknown > 1 ? "ne figurent" : "ne figure"} pas ici : le simulateur expert ne calcule que les OPCO renseignés. Ils seront conservés à votre retour dans le simulateur guidé.` : null,
      initial && answers.destinationKnown === "no" ? `Destination non choisie : « ${initial.destination} » sert ici d’exemple pour la zone ${resolveDestination(answers).label}. Les montants repris sont ceux du simulateur guidé.` : null,
    ].filter(Boolean);
    const expertContact: SimulatorContact = { ecole: contact.etablissement, referent: `${contact.prenom} ${contact.nom}`.trim(), email: contact.email, dateSouhaitee: contact.dateSouhaitee };
    return (
      <SimulatorApp
        initial={initial}
        initialContact={expertContact}
        notice={notices.length ? notices.join(" ") : null}
        onChangeSimulator={(snapshot, next, changed) => {
          setExpert(snapshot);
          // Les valeurs d'exemple de l'expert ne deviennent pas des réponses du parcours guidé :
          // seules de vraies modifications y sont reportées.
          if (changed) guidedSession.setAnswers(advancedToGuided(snapshot, answers));
          if (next.referent !== expertContact.referent || next.ecole !== expertContact.ecole || next.email !== expertContact.email || next.dateSouhaitee !== expertContact.dateSouhaitee) {
            const [prenom, ...rest] = next.referent.trim().split(/\s+/);
            setContact({ ...contact, etablissement: next.ecole, prenom: prenom ?? "", nom: rest.join(" "), email: next.email, dateSouhaitee: next.dateSouhaitee });
          }
          go(null);
        }}
      />
    );
  }

  if (mode === "guided") {
    return (
      <GuidedSimulator
        answers={answers}
        screen={screen}
        onAnswers={guidedSession.setAnswers}
        onScreen={guidedSession.setScreen}
        onReset={() => guidedSession.clear()}
        contact={contact}
        onContact={setContact}
        onExpert={() => go("expert")}
        onChangeSimulator={() => go(null)}
      />
    );
  }

  return <SimulatorChooser />;
}
