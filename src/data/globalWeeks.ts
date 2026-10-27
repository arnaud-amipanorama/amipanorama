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
 * Remplacer les quatre libellés par de vraies semaines uniquement après
 * validation de l'édition (destination, transport, capacité et conditions).
 */
export const globalWeeksAvailability = [
  { id: "window-1", label: "Fenêtre 1", detail: "Dates à annoncer" },
  { id: "window-2", label: "Fenêtre 2", detail: "Dates à annoncer" },
  { id: "window-3", label: "Fenêtre 3", detail: "Dates à annoncer" },
  { id: "window-4", label: "Fenêtre 4", detail: "Dates à annoncer" },
] as const;

/**
 * Message financement de la landing. Aucun montant, plafond ou dispositif
 * qui n'est pas déjà affirmé sur cette page : l'accord reste conditionnel.
 */
export const globalWeeksFunding = {
  badge: "Ton séjour peut être financé",
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
      title: "Ton CFA et ton employeur valident",
      text: "Ils sont associés au dossier et à la convention de mobilité. Sans leur accord, la place n’est pas confirmée.",
    },
    {
      title: "Le financement se confirme, ou pas",
      text: "L’accord, le montant et le délai dépendent de ton dossier, de ton OPCO, de ton CFA, de ton employeur et des règles applicables.",
    },
  ],
  roles: [
    {
      title: "Qui peut financer",
      points: [
        "Ton OPCO, selon les règles liées à ton employeur",
        "Ton CFA et ton référent mobilité, associés au dossier",
        "Ton employeur, informé et impliqué dans la validation",
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
        "Te guider étape par étape, sans le jargon",
        "Préparer un kit pour ton référent mobilité",
        "T’expliquer les modalités de ton dossier, y compris si des frais sont à avancer",
        "Centraliser les informations utiles avant le départ",
      ],
    },
  ],
  note: "AMI Panorama t’accompagne dans les démarches, mais ne garantit ni accord, ni montant, ni délai. Ta place est confirmée lorsque le groupe est maintenu, que le dossier est complet, que les validations sont obtenues et que le financement ou le paiement applicable est sécurisé.",
} as const;

export const globalWeeksFaq = [
  {
    question: "Est-ce que c’est financé ?",
    answer:
      "Un financement peut exister, mais il n’est pas automatique. Il dépend de ta situation, de ton CFA, de ton employeur, de l’OPCO concerné et des règles applicables. AMI guide les démarches et vérifie avec toi, sans garantir ni l’accord ni le montant.",
  },
  {
    question: "Qui peut financer mon séjour ?",
    answer:
      "Ton OPCO, ton CFA et ton employeur peuvent être impliqués. L’OPCO est en général lié à ton employeur. Le montage exact dépend de ton dossier : on le vérifie avec toi, selon ton OPCO et ton employeur. AMI ne garantit pas la prise en charge.",
  },
  {
    question: "Qu’est-ce qu’AMI fait pour le financement ?",
    answer:
      "AMI te guide, prépare un kit pour ton référent mobilité et t’explique les modalités applicables à ton dossier, y compris si des frais sont à avancer. L’accord, le montant et le délai restent dépendants de ton CFA, de ton employeur, de l’OPCO et des règles applicables.",
  },
  {
    question: "Global Weeks, c’est quoi exactement ?",
    answer:
      "C’est une mobilité internationale organisée par AMI Panorama qui permet à des alternants de rejoindre une semaine de programme avec d’autres étudiants issus de différents établissements.",
  },
  {
    question: "Est-ce que je peux partir si mon école ne propose pas de voyage ?",
    answer:
      "C’est précisément l’objectif du dispositif, sous réserve de validation de ton CFA, de ton employeur et de ton dossier.",
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
      "Oui. Le CFA et le référent mobilité doivent être associés au dossier et à la convention de mobilité.",
  },
  {
    question: "Est-ce que mon employeur doit être d’accord ?",
    answer:
      "Oui. L’employeur doit être informé et peut être impliqué dans la validation et les signatures selon le dossier.",
  },
  {
    question: "Comment savoir quel est mon OPCO ?",
    answer:
      "L’OPCO est généralement lié à ton employeur. Demande à ton service RH, ton manager ou ton référent mobilité. Tu peux commencer ta candidature même si tu ne le connais pas encore.",
  },
  {
    question: "Est-ce que je dois avancer des frais ?",
    answer:
      "Cela dépend du montage financier et de l’édition. Nous expliquerons clairement les modalités applicables à ton dossier : rien n’est supposé ou promis à l’avance.",
  },
  {
    question: "Est-ce que le vol est inclus ?",
    answer:
      "Cela dépendra de chaque édition. L’offre indiquera toujours ce qui est inclus, ce qui est exclu, qui réserve et si un remboursement éventuel est possible.",
  },
  {
    question: "Quand ma place est-elle confirmée ?",
    answer:
      "Lorsque le groupe est maintenu, que le dossier est complet, que les validations nécessaires sont obtenues et que le financement ou le paiement applicable est sécurisé.",
  },
  {
    question: "Que se passe-t-il si mon dossier n’est pas validé ?",
    answer:
      "Ta place n’est pas confirmée. Selon les possibilités, nous pouvons t’orienter vers une autre date, une liste d’attente ou un prochain format.",
  },
  {
    question: "Est-ce que je dois déjà avoir un passeport ou une pièce d’identité ?",
    answer:
      "Il faut pouvoir répondre aux formalités de la destination. AMI donne les informations utiles, mais chaque participant reste responsable de ses documents de voyage.",
  },
  {
    question: "Est-ce que je peux choisir ma destination ?",
    answer:
      "Oui, le questionnaire recueille tes préférences. Les destinations effectivement ouvertes dépendent des éditions proposées.",
  },
  {
    question: "Puis-je venir avec un ami ?",
    answer:
      "Chacun doit déposer son propre dossier. Tu pourras signaler cette préférence à l’équipe, sans qu’elle constitue une garantie.",
  },
];
