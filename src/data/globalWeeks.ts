export type GlobalWeekEdition = {
  id: "seville" | "montreal" | "londres" | "new-york";
  city: string;
  country: string;
  flag: string;
  angle: string;
  status: "Liste d’intérêt";
  image: string;
};

/**
 * Point de configuration unique de la landing page Global Weeks.
 * Les dates, capacités, prestations et tarifs ne sont volontairement pas
 * renseignés ici tant qu'une édition n'est pas contractualisée et validée.
 */
export const globalWeeksEditions: GlobalWeekEdition[] = [
  {
    id: "seville",
    city: "Séville",
    country: "Espagne",
    flag: "🇪🇸",
    angle: "Culture, services et immersion collective",
    status: "Liste d’intérêt",
    image: "/Assets/groups/seville-garden.jpg",
  },
  {
    id: "montreal",
    city: "Montréal",
    country: "Canada",
    flag: "🇨🇦",
    angle: "Ouverture nord-américaine et rencontres professionnelles",
    status: "Liste d’intérêt",
    image: "/Assets/groups/montreal-sunset.jpg",
  },
  {
    id: "londres",
    city: "Londres",
    country: "Royaume-Uni",
    flag: "🇬🇧",
    angle: "Business English et environnement international",
    status: "Liste d’intérêt",
    image: "/Assets/groups/london-bridge.jpg",
  },
  {
    id: "new-york",
    city: "New York",
    country: "États-Unis",
    flag: "🇺🇸",
    angle: "Business, culture et énergie collective",
    status: "Liste d’intérêt",
    image: "/Assets/groups/newyork-pano.jpg",
  },
];

/**
 * Préférences de période, tant qu'aucune édition n'a de dates contractualisées.
 * Remplacer par de vraies semaines uniquement après validation
 * (destination, transport, capacité et conditions).
 */
export const globalWeeksAvailability = [
  { id: "spring", label: "Printemps", detail: "Mars à juin" },
  { id: "summer", label: "Été", detail: "Juillet et août" },
  { id: "autumn", label: "Automne", detail: "Septembre à novembre" },
  { id: "flexible", label: "Je suis flexible", detail: "Selon les éditions ouvertes" },
] as const;

/**
 * Exemple cité sur le site. Il est le reste à charge du simulateur individuel
 * pour Montréal, 8 jours, OPCO non identifié, après la part de financement
 * mobilité déjà calculée par le moteur (companions = 0). Le test du simulateur
 * public refuse un écart avec ce chiffre.
 */
export const globalWeeksFundingExample = {
  remainingEuros: 449,
  city: "Montréal",
  stay: "hébergement avec petits-déjeuners",
} as const;

export function fundingExamplePhrase(): string {
  const amount = new Intl.NumberFormat("fr-FR").format(globalWeeksFundingExample.remainingEuros);
  return `environ ${amount} € pour ${globalWeeksFundingExample.city}, ${globalWeeksFundingExample.stay}`;
}

/** Mention discrète, sans encadré. Une seule fois sur la page Global Weeks, et sous le résultat du simulateur public. */
export const fundingWatchNote =
  "Montants indicatifs d’après nos informations. Les référentiels publics figurent aussi sur les sites des OPCO.";

export const globalWeeksConsentText =
  "J’accepte qu’AMI Panorama enregistre mes coordonnées et les informations de mon projet (statut, école ou CFA, employeur, OPCO, destination et, le cas échéant, le résultat de l’estimation) pour étudier ma demande et me recontacter. Je peux écrire à info@amipanorama.com pour y accéder ou demander leur effacement.";

/**
 * Message financement de la landing.
 */
export const globalWeeksFunding = {
  badge: "Dans la majorité des cas, ton séjour est financé",
  steps: [
    {
      title: "Tu dis que tu veux partir",
      text: "Le questionnaire ne réserve pas une place. Tu peux le remplir même si tu ne connais pas encore ton OPCO.",
    },
    {
      title: "On identifie qui peut aider",
      text: "L’OPCO est en général lié à ton employeur. Demande à tes RH, ton manager ou ton référent mobilité. Si tu ne le sais pas encore, on avance quand même avec toi.",
    },
    {
      title: "Ton CFA et ton employeur avancent avec toi",
      text: "Ils sont associés au dossier et à la convention de mobilité. AMI prépare les éléments avec toi.",
    },
    {
      title: "AMI monte le dossier avec toi",
      text: `Dans la majorité des cas, ton séjour est financé. Il peut rester un reste à charge, par exemple ${fundingExamplePhrase()}.`,
    },
  ],
  roles: [
    {
      title: "Qui peut financer",
      points: [
        "Ton OPCO, dans la majorité des cas",
        "Ton CFA et ton référent mobilité, associés au dossier",
        "Ton employeur, qui peut compléter le reste à charge",
      ],
    },
    {
      title: "Ce que tu fais",
      points: [
        "Répondre au questionnaire d’intérêt",
        "Échanger avec ton CFA ou ton référent mobilité",
        "En parler à ton employeur",
        "Compléter le dossier et les formalités de voyage",
      ],
    },
    {
      title: "Ce qu’AMI fait pour toi",
      points: [
        "Monter le dossier avec toi, sans le jargon",
        "Préparer un kit pour ton référent mobilité",
        "T’expliquer le reste à charge éventuel",
        "Centraliser les informations utiles avant le départ",
      ],
    },
  ],
  note: fundingWatchNote,
} as const;

export const globalWeeksFaq = [
  {
    question: "Est-ce que c’est financé ?",
    answer:
      `Oui. Dans la majorité des cas, ton séjour est financé. Il peut rester un reste à charge, par exemple ${fundingExamplePhrase()}. AMI monte le dossier avec toi.`,
  },
  {
    question: "Qui peut financer mon séjour ?",
    answer:
      `Ton OPCO, ton CFA et ton employeur. Dans la majorité des cas, le séjour est financé. Il peut rester un reste à charge, par exemple ${fundingExamplePhrase()}. AMI monte le dossier avec toi.`,
  },
  {
    question: "Qu’est-ce qu’AMI fait pour le financement ?",
    answer:
      `AMI monte le dossier avec toi et prépare le kit pour ton référent mobilité. Dans la majorité des cas, ton séjour est financé. Il peut rester un reste à charge, par exemple ${fundingExamplePhrase()}.`,
  },
  {
    question: "Global Weeks, c’est quoi exactement ?",
    answer:
      "C’est une mobilité internationale organisée par AMI Panorama qui permet à des alternants de rejoindre une semaine de programme avec d’autres étudiants issus de différents établissements.",
  },
  {
    question: "Est-ce que je peux partir si mon école ne propose pas de voyage ?",
    answer:
      "Oui, c’est précisément l’objectif. Tu candidates individuellement, puis tu rejoins une cohorte. AMI monte le dossier avec toi, avec ton CFA et ton employeur.",
  },
  {
    question: "Est-ce que je pars seul(e) ?",
    answer:
      "Tu candidates individuellement, mais tu rejoins une cohorte d’alternants. Tu n’es pas isolé(e) pendant l’expérience.",
  },
  {
    question: "Est-ce que c’est un voyage touristique ?",
    answer:
      "Non. Le séjour repose sur un programme pédagogique et professionnel : formation, découverte d’écosystèmes, visites et activités collectives.",
  },
  {
    question: "Est-ce que mon CFA doit être au courant ?",
    answer:
      "Oui. Le CFA et le référent mobilité avancent le dossier avec toi, notamment pour la convention de mobilité.",
  },
  {
    question: "Est-ce que mon employeur doit être d’accord ?",
    answer:
      "Oui. L’employeur est informé et peut compléter un reste à charge. AMI prépare les éléments du dossier avec toi.",
  },
  {
    question: "Comment savoir quel est mon OPCO ?",
    answer:
      "L’OPCO est généralement lié à ton employeur. Demande à ton service RH, ton manager ou ton référent mobilité. Tu peux commencer ta candidature même si tu ne le connais pas encore.",
  },
  {
    question: "Est-ce que je dois avancer des frais ?",
    answer:
      `Un reste à charge peut subsister, par exemple ${fundingExamplePhrase()}. AMI t’explique le montage avant le départ.`,
  },
  {
    question: "Est-ce que le vol est inclus ?",
    answer:
      "Cela dépend de l’édition. L’offre indique ce qui est inclus, ce qui est à part, et qui réserve le transport.",
  },
  {
    question: "Quand ma place est-elle confirmée ?",
    answer:
      "Quand le groupe est maintenu et que ton dossier est prêt. AMI monte le financement avec toi.",
  },
  {
    question: "Que se passe-t-il si mon dossier n’est pas validé ?",
    answer:
      "On regarde avec toi une autre date, une liste d’attente ou un prochain format.",
  },
  {
    question: "Est-ce que je dois déjà avoir un passeport ou une pièce d’identité ?",
    answer:
      "Il faut pouvoir répondre aux formalités de la destination. AMI donne les informations utiles, et chaque participant prépare ses documents de voyage.",
  },
  {
    question: "Est-ce que je peux choisir ma destination ?",
    answer:
      "Oui, le questionnaire recueille tes préférences. Les destinations effectivement ouvertes dépendent des éditions proposées.",
  },
  {
    question: "Puis-je venir avec un ami ?",
    answer:
      "Chacun dépose son propre dossier. Tu peux signaler cette préférence à l’équipe.",
  },
];

