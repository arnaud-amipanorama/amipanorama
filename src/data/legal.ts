/**
 * Source unique des informations légales.
 *
 * Règle : un champ `confirmed: false` est une piste interne, pas un fait.
 * Il ne doit apparaître ni dans les pages, ni dans le footer, ni dans le JSON-LD.
 * Arnaud confirme, puis on passe `confirmed` à true. Rien d'autre ne change.
 */

export const SITE_URL = "https://amipanorama.com";

export const company = {
  name: "AMI PANORAMA",
  brand: "AMI Panorama",
  legalForm: "Société par actions simplifiée (SAS)",
  capital: "5 000 €",
  street: "2 rue Wimpheling",
  postalCode: "67000",
  city: "Strasbourg",
  country: "France",
  rcs: "RCS Strasbourg, n° 978 133 528",
  siren: "978133528",
  sirenDisplay: "978 133 528",
  siret: "978 133 528 00015",
  ape: "79.12Z",
  apeLabel: "activités des voyagistes",
  vat: "FR52 978 133 528",
  email: "info@amipanorama.com",
} as const;

export const host = {
  name: "Vercel Inc.",
  address: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
} as const;

/**
 * Déjà publié sous la forme « Directeur général », sans nom de personne.
 * TODO Arnaud : confirmer le nom. Ne pas le publier avant.
 */
export const publicationDirector = {
  publishedLabel: "Directeur général",
  name: null as string | null,
  confirmed: false,
  todo: "Confirmer le nom du directeur de la publication.",
};

/**
 * TODO Arnaud : piste interne non validée.
 * Immatriculation évoquée IM067230007, échéance indiquée au 07/11/2026,
 * renouvellement non confirmé. Ne pas publier le numéro ni un badge.
 */
export const atoutFrance = {
  registration: "IM067230007",
  confirmed: false,
  expiresOn: "2026-11-07",
  renewalConfirmed: false,
  todo: "Confirmer le numéro Atout France et son renouvellement avant toute publication.",
};

/** TODO Arnaud : piste interne non validée (Accelerant via Arcus). */
export const financialGuarantee = {
  label: "Accelerant via Arcus",
  confirmed: false,
  todo: "Confirmer le garant financier avant toute publication.",
};

/**
 * TODO Arnaud : piste interne non validée (Hiscox).
 * Échéance indiquée au 07/11/2026, renouvellement non confirmé.
 */
export const rcPro = {
  insurer: "Hiscox",
  confirmed: false,
  expiresOn: "2026-11-07",
  renewalConfirmed: false,
  todo: "Confirmer l'assureur RC Pro et son renouvellement avant toute publication.",
};

/** TODO Arnaud : aucun téléphone public n'est confirmé. Ne pas en inventer. */
export const publicPhone = {
  value: null as string | null,
  confirmed: false,
  todo: "Confirmer un numéro de téléphone public, ou décider qu'il n'y en a pas.",
};

export function postalAddressLine() {
  return `${company.street}, ${company.postalCode} ${company.city}`;
}
