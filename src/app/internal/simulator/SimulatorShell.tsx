"use client";

import { useState } from "react";
import { advancedToGuided, guidedToAdvanced, resolveDestination, unknownOpcoCount, type AdvancedSnapshot } from "@/lib/simulator/guided";
import SimulatorApp, { type SimulatorContact } from "./SimulatorApp";
import GuidedSimulator from "./guided/GuidedSimulator";
import { EMPTY_CONTACT, type GuidedContact } from "./guided/contact";
import { guidedSession, useGuidedSession } from "./guided/guided-storage";

/**
 * Deux modes au-dessus du même moteur : « Simulation guidée » (par défaut)
 * et « Simulation avancée » (interface détaillée d'origine). Le passage de
 * l'un à l'autre convertit l'état au lieu de le réinitialiser.
 */
export default function SimulatorShell() {
  const { answers, screen, hydrated } = useGuidedSession();
  const [mode, setMode] = useState<"guided" | "advanced">("guided");
  const [advanced, setAdvanced] = useState<AdvancedSnapshot | null>(null);
  const [contact, setContact] = useState<GuidedContact>(EMPTY_CONTACT);

  // Tant que l'état enregistré n'est pas relu, on n'affiche rien : pas d'écran d'accueil qui clignote.
  if (!hydrated) return <div style={{ minHeight: "100svh", background: "#0B1018" }} />;

  if (mode === "advanced" && advanced) {
    const unknown = answers.opcoKnowledge === null ? 0 : unknownOpcoCount(answers);
    const notices = [
      unknown > 0 ? `${unknown} participant${unknown > 1 ? "s" : ""} sans OPCO connu ${unknown > 1 ? "ne figurent" : "ne figure"} pas dans ce mode, qui ne calcule que les OPCO renseignés. Ils seront conservés à votre retour dans la simulation guidée.` : null,
      answers.destinationKnown === "no" ? `Destination non choisie : « ${advanced.destination} » sert ici d’exemple pour la zone ${resolveDestination(answers).label}. Les montants repris sont ceux de la simulation guidée.` : null,
    ].filter(Boolean);
    const advancedContact: SimulatorContact = { ecole: contact.etablissement, referent: `${contact.prenom} ${contact.nom}`.trim(), email: contact.email, dateSouhaitee: contact.dateSouhaitee };
    return (
      <SimulatorApp
        initial={advanced}
        initialContact={advancedContact}
        notice={notices.length ? notices.join(" ") : null}
        onSwitchToGuided={(snapshot, next) => {
          setAdvanced(snapshot);
          guidedSession.setAnswers(advancedToGuided(snapshot, answers));
          if (next.referent !== advancedContact.referent || next.ecole !== advancedContact.ecole || next.email !== advancedContact.email || next.dateSouhaitee !== advancedContact.dateSouhaitee) {
            const [prenom, ...rest] = next.referent.trim().split(/\s+/);
            setContact({ ...contact, etablissement: next.ecole, prenom: prenom ?? "", nom: rest.join(" "), email: next.email, dateSouhaitee: next.dateSouhaitee });
          }
          setMode("guided");
        }}
      />
    );
  }

  return (
    <GuidedSimulator
      answers={answers}
      screen={screen}
      onAnswers={guidedSession.setAnswers}
      onScreen={guidedSession.setScreen}
      onReset={() => { guidedSession.clear(); setAdvanced(null); }}
      contact={contact}
      onContact={setContact}
      onAdvanced={() => { setAdvanced(guidedToAdvanced(answers, advanced)); setMode("advanced"); }}
    />
  );
}
