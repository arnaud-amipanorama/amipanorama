/** Coordonnées saisies dans le parcours guidé. Gardées en mémoire uniquement, jamais dans localStorage. */
export type GuidedContact = {
  etablissement: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  dateSouhaitee: string;
  commentaire: string;
};

export const EMPTY_CONTACT: GuidedContact = { etablissement: "", prenom: "", nom: "", email: "", telephone: "", dateSouhaitee: "", commentaire: "" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactField = "etablissement" | "prenom" | "nom" | "email" | "dateSouhaitee";

/** Champs obligatoires manquants ou invalides, dans l'ordre du formulaire. */
export function invalidContactFields(contact: GuidedContact): ContactField[] {
  const invalid: ContactField[] = [];
  if (!contact.etablissement.trim()) invalid.push("etablissement");
  if (!contact.prenom.trim()) invalid.push("prenom");
  if (!contact.nom.trim()) invalid.push("nom");
  if (!EMAIL_RE.test(contact.email.trim())) invalid.push("email");
  if (!contact.dateSouhaitee.trim()) invalid.push("dateSouhaitee");
  return invalid;
}
