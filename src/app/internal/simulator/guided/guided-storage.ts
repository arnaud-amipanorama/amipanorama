import { useSyncExternalStore } from "react";
import { GUIDED_STORAGE_KEY } from "@/lib/simulator/guided-config";
import { GUIDED_STEPS, INITIAL_GUIDED_ANSWERS, reviveGuidedAnswers, type GuidedAnswers, type GuidedStepId } from "@/lib/simulator/guided";

export type GuidedScreen = "intro" | GuidedStepId | "results";
export type GuidedSession = { answers: GuidedAnswers; screen: GuidedScreen };

const INITIAL_SESSION: GuidedSession = { answers: INITIAL_GUIDED_ANSWERS, screen: "intro" };
const SCREENS: GuidedScreen[] = ["intro", ...GUIDED_STEPS, "results"];

// Petit magasin externe : l'état vit hors de React pour être relu depuis
// localStorage après l'hydratation, sans setState dans un effet.
let session: GuidedSession | null = null;
const listeners = new Set<() => void>();

function read(): GuidedSession {
  if (session) return session;
  session = INITIAL_SESSION;
  try {
    const raw = window.localStorage.getItem(GUIDED_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { answers?: unknown; screen?: unknown };
      session = {
        answers: reviveGuidedAnswers(parsed.answers),
        screen: SCREENS.includes(parsed.screen as GuidedScreen) ? (parsed.screen as GuidedScreen) : "intro",
      };
    }
  } catch {
    // Stockage indisponible ou contenu illisible : on repart d'une simulation vide.
  }
  return session;
}

function write(next: GuidedSession) {
  session = next;
  try {
    window.localStorage.setItem(GUIDED_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Navigation privée ou quota : la simulation reste utilisable, sans reprise après rechargement.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export const guidedSession = {
  setAnswers: (answers: GuidedAnswers) => write({ ...read(), answers }),
  setScreen: (screen: GuidedScreen) => write({ ...read(), screen }),
  /** Efface les réponses enregistrées dans le navigateur. */
  clear: () => {
    session = INITIAL_SESSION;
    try { window.localStorage.removeItem(GUIDED_STORAGE_KEY); } catch { /* rien à effacer */ }
    listeners.forEach((listener) => listener());
  },
};

/** Session guidée persistée. `hydrated` est faux pendant le rendu serveur et l'hydratation. */
export function useGuidedSession(): GuidedSession & { hydrated: boolean } {
  const current = useSyncExternalStore(subscribe, read, () => INITIAL_SESSION);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  return { ...current, hydrated };
}
