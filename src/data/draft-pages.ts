/**
 * Pages prévues, NON PUBLIÉES.
 *
 * `publish` reste false tant que le contenu validé par Arnaud n'est pas rédigé.
 * Les routes répondent 404, sont en noindex, et n'entrent pas dans le sitemap.
 * Ne rien inventer (prix, barèmes, programmes, avis, numéros).
 */

export type DraftSection = {
  heading: string;
  /** null = contenu manquant, la section ne s'affiche pas. */
  body: string | null;
};

export type DraftPage = {
  slug: "financement" | "cfa" | "ecoles" | "entreprises" | "references" | "faq";
  path: string;
  title: string;
  publish: boolean;
  /** Ce qu'Arnaud doit fournir avant d'ouvrir la page. */
  expectedFromArnaud: string[];
  sections: DraftSection[];
};

export const draftPages: DraftPage[] = [
  {
    slug: "financement",
    path: "/financement",
    title: "Financement",
    publish: false,
    expectedFromArnaud: [
      "Expliquer le rôle d'AMI Panorama sur l'ingénierie financière, uniquement avec des formulations déjà validées (OPCO, forfait référent mobilité, Erasmus+, conventions).",
      "Ne pas recopier les barèmes du simulateur interne.",
      "TODO source à revalider avant toute phrase publique : la configuration interne du simulateur, contrôlée le 01/09/2026, cite https://www.opco-atlas.fr/mobilite-europeenne-internationale-alternants.html et indique qu'Opco Atlas, pour les contrats conclus à partir du 01/04/2026, ne finance l'apprenti qu'à partir de 15 jours calendaires. Ne pas l'affirmer sur le site tant qu'Arnaud n'a pas revu cette source datée.",
    ],
    sections: [
      { heading: "Ce que prend en charge l'établissement", body: null },
      { heading: "Dispositifs mobilisables", body: null },
      { heading: "Ce qu'AMI Panorama prépare avec vous", body: null },
    ],
  },
  {
    slug: "cfa",
    path: "/cfa",
    title: "CFA",
    publish: false,
    expectedFromArnaud: [
      "Page destinée aux CFA : promesse, déroulé avec le référent pédagogique, ce qui est déjà dit sur l'accueil et Notre programme.",
      "Pas de nouveau chiffre (taux de prise en charge, volumes, délais) sans source.",
    ],
    sections: [
      { heading: "Mobilité internationale pour un CFA", body: null },
      { heading: "Le rôle du référent pédagogique", body: null },
      { heading: "Comment démarrer", body: null },
    ],
  },
  {
    slug: "ecoles",
    path: "/ecoles",
    title: "Écoles",
    publish: false,
    expectedFromArnaud: [
      "Page destinée aux écoles et à l'enseignement supérieur.",
      "On peut réutiliser les établissements déjà nommés sur le site, pas en ajouter.",
    ],
    sections: [
      { heading: "Une mobilité intégrée au cursus", body: null },
      { heading: "Établissements déjà accompagnés", body: null },
    ],
  },
  {
    slug: "entreprises",
    path: "/entreprises",
    title: "Entreprises",
    publish: false,
    expectedFromArnaud: [
      "L'accueil mentionne les entreprises, sans décrire d'offre dédiée.",
      "Arnaud doit dire ce qui est réellement proposé (accueil de groupes, séminaires, autre) avant publication.",
    ],
    sections: [
      { heading: "Ce que nous proposons aux entreprises", body: null },
      { heading: "Accueillir un groupe", body: null },
    ],
  },
  {
    slug: "references",
    path: "/references",
    title: "Références",
    publish: false,
    expectedFromArnaud: [
      "La matière existe déjà : noms du bandeau d'accueil et témoignages réels de src/data/testimonials.ts.",
      "Arnaud valide le choix des références publiées et les autorisations avant d'ouvrir la page.",
    ],
    sections: [
      { heading: "Établissements", body: null },
      { heading: "Paroles de référents et de participants", body: null },
    ],
  },
  {
    slug: "faq",
    path: "/faq",
    title: "Questions fréquentes",
    publish: false,
    expectedFromArnaud: [
      "Les questions déjà publiées vivent sur /notre-programme (src/data/programme.ts).",
      "Une page FAQ autonome n'ouvre que lorsque Arnaud a validé les questions supplémentaires. Ne pas y déplacer les questions existantes tant que ce n'est pas décidé.",
    ],
    sections: [{ heading: "Questions", body: null }],
  },
];

export function getDraftPage(slug: string) {
  return draftPages.find((page) => page.slug === slug);
}
