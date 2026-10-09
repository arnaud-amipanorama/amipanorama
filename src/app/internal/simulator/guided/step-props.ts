import type { GuidedAnswers } from "@/lib/simulator/guided";

/** Contrat commun des écrans de question : lire les réponses, en modifier une partie. */
export type GuidedStepProps = {
  answers: GuidedAnswers;
  update: (patch: Partial<GuidedAnswers>) => void;
};
