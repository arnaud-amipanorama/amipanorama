export type GlobalWeekEdition = {
  id: "seville" | "montreal" | "londres" | "new-york";
  city: string;
  country: string;
  flag: string;
  angle: string;
  status: string;
  image: string;
};

/** Phrase de financement reprise sur les pages publiques. */
export const FUNDING_PROMISE = "Dans la majorité des cas, ton voyage sera financé.";

/**
 * Point de configuration unique de la landing page Global Weeks.
 * Les sessions datées sont dans `globalWeeksSessions`.
 */
export const globalWeeksEditions: GlobalWeekEdition[] = [
  {
    id: "seville",
    city: "Séville",
    country: "Espagne",
    flag: "🇪🇸",
    angle: "Culture, services et immersion collective",
    status: "Sessions ouvertes",
    image: "/Assets/groups/seville-garden.jpg",
  },
  {
    id: "montreal",
    city: "Montréal",
    country: "Canada",
    flag: "🇨🇦",
    angle: "Ouverture nord-américaine et rencontres professionnelles",
    status: "Sessions ouvertes",
    image: "/Assets/groups/montreal-sunset.jpg",
  },
  {
    id: "londres",
    city: "Londres",
    country: "Royaume-Uni",
    flag: "🇬🇧",
    angle: "Business English et environnement international",
    status: "Sessions ouvertes",
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
 * Sessions publiques annoncées le 28 octobre 2026.
 * L’année 2027 est déduite : à la date du post, mars, mai, juin et le 3 octobre
 * 2026 étaient déjà passés. Le brouillon « Séville du 3 au 10 octobre » n’est pas retenu.
 */
export const globalWeeksSessions = [
  { id: "seville-mars", editionId: "seville", city: "Séville", label: "7 au 13 mars", year: 2027, start: "2027-03-07", end: "2027-03-13", days: 7 },
  { id: "seville-octobre", editionId: "seville", city: "Séville", label: "3 au 9 octobre", year: 2027, start: "2027-10-03", end: "2027-10-09", days: 7 },
  { id: "montreal-mai-1", editionId: "montreal", city: "Montréal", label: "2 au 9 mai", year: 2027, start: "2027-05-02", end: "2027-05-09", days: 8 },
  { id: "montreal-mai-2", editionId: "montreal", city: "Montréal", label: "9 au 16 mai", year: 2027, start: "2027-05-09", end: "2027-05-16", days: 8 },
  { id: "londres-juin", editionId: "londres", city: "Londres", label: "6 au 12 juin", year: 2027, start: "2027-06-06", end: "2027-06-12", days: 7 },
] as const;

export type GlobalWeekSession = (typeof globalWeeksSessions)[number];

export const FLEXIBLE_SESSION = { id: "flexible", label: "Je suis flexible", detail: "Selon les sessions ouvertes" } as const;

export function sessionsForCity(city: string): GlobalWeekSession[] {
  return globalWeeksSessions.filter((session) => session.city === city);
}

/** Durée du format public le plus proche des sessions annoncées. Montréal : 8 jours. Séville et Londres : 7 jours. */
export function publicSessionDays(city: string): number {
  const sessions = sessionsForCity(city);
  if (sessions.length === 0) return 8;
  return sessions[0].days;
}

export function sessionLabel(id: string): string {
  if (id === FLEXIBLE_SESSION.id) return FLEXIBLE_SESSION.label;
  const session = globalWeeksSessions.find((item) => item.id === id);
  return session ? `${session.city}, ${session.label} ${session.year}` : id;
}

/**
 * Exemple Montréal. `remainingEuros` est le résultat exact du simulateur
 * individuel (8 jours, OPCO non identifié). Les textes du site citent
 * l'arrondi éditorial, « environ 450 € ». Le simulateur continue d'afficher 449 €.
 */
export const globalWeeksFundingExample = {
  remainingEuros: 449,
  editorialRemainingEuros: 450,
  city: "Montréal",
  stay: "logement et petits-déjeuners",
} as const;

export function fundingExamplePhrase(): string {
  const amount = new Intl.NumberFormat("fr-FR").format(globalWeeksFundingExample.editorialRemainingEuros);
  return `environ ${amount} € pour ${globalWeeksFundingExample.city}, logement et petits-déjeuners`;
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
  badge: FUNDING_PROMISE,
  steps: [
    {
      title: "Tu dis que tu veux partir",
      text: "Le questionnaire ne réserve pas une place. Tu peux le remplir même si tu ne connais pas encore ton OPCO.",
    },
    {
      title: "On identifie qui peut aider",
      text: "L’OPCO est en général lié à ton employeur, d’après nos infos. Demande à tes RH, ton manager ou ton référent mobilité. Si tu ne le sais pas encore, on avance quand même avec toi.",
    },
    {
      title: "Ton CFA et ton employeur avancent avec toi",
      text: "Ils sont associés au dossier et à la convention de mobilité. AMI prépare les éléments avec toi.",
    },
    {
      title: "AMI monte le dossier avec toi",
      text: `${FUNDING_PROMISE} Il peut rester un reste à charge, par exemple ${fundingExamplePhrase()}.`,
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
      `Oui. ${FUNDING_PROMISE} Il peut rester un reste à charge, par exemple ${fundingExamplePhrase()}. AMI monte le dossier avec toi.`,
  },
  {
    question: "Qui peut financer mon séjour ?",
    answer:
      `Ton OPCO, d’après nos infos, ton CFA et ton employeur. ${FUNDING_PROMISE} Il peut rester un reste à charge, par exemple ${fundingExamplePhrase()}. AMI monte le dossier avec toi.`,
  },
  {
    question: "Qu’est-ce qu’AMI fait pour le financement ?",
    answer:
      `AMI monte le dossier avec toi et prépare le kit pour ton référent mobilité. ${FUNDING_PROMISE} Il peut rester un reste à charge, par exemple ${fundingExamplePhrase()}.`,
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
      "L’OPCO est généralement lié à ton employeur, d’après nos infos. Demande à ton service RH, ton manager ou ton référent mobilité. Tu peux commencer ta candidature même si tu ne le connais pas encore.",
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

