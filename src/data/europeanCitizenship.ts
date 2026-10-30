/**
 * Offre « Citoyenneté européenne à Strasbourg ».
 * Source unique pour les textes, le programme et les paramètres encore ajustables.
 * Les champs `null` de `citizenshipPending` ne doivent pas être affichés.
 */

export type CitizenshipLocale = "fr" | "en";

export const citizenshipRoutes = {
  fr: "/citoyennete-europeenne",
  en: "/en/european-citizenship",
} as const;

/** Décisions d’Arnaud, 29/10/2026. Modifier ici pour mettre à jour les deux langues. */
export const citizenshipOffer = {
  days: 6,
  nights: 5,
  schools: 70,
  studentsMoreThan: 5000,
  /** null : aucun montant n’est publié. */
  priceEuros: null as number | null,
  priceMode: "quote-by-group-size" as const,
  contactSubject: "Citoyenneté européenne",
  contactEmail: "info@amipanorama.com",
  destination: "Strasbourg",
} as const;

/**
 * Points encore ouverts. Tant qu’une valeur est null, la page n’en parle pas.
 * Le prix (sur devis) et les chiffres de cette page sont déjà tranchés
 * dans `citizenshipOffer`, pas ici.
 */
export const citizenshipPending = {
  groupSizeMin: null as number | null,
  groupSizeMax: null as number | null,
  phone: null as string | null,
  /** true = vols inclus, false = à la charge de l’école, null = ne pas trancher à l’écran. */
  internationalTravelIncluded: null as boolean | null,
  foundingYear: null as number | null,
  ectsBachelor: null as number | null,
  ectsMaster: null as number | null,
  examFormat: null as string | null,
  /** Langues proposées au-delà de « à définir avec l’établissement ». */
  workingLanguages: null as string[] | null,
  /** Périodes ouvertes, par exemple 2027. */
  openPeriods: null as string[] | null,
} as const;

export const bookingPath = "/rendez-vous";

export function contactHref(): string {
  const params = new URLSearchParams({
    objet: citizenshipOffer.contactSubject,
    destination: citizenshipOffer.destination,
  });
  return `/contact?${params.toString()}`;
}

export function citizenshipHref(pathname: string): string {
  return pathname.startsWith("/en/") ? citizenshipRoutes.en : citizenshipRoutes.fr;
}

type Slot = { label: string; text: string };
type Day = { id: string; name: string; slots: Slot[] };
type Card = { title: string; text: string; meta?: string };
type Labeled = { title: string; text: string };
type FaqItem = { question: string; answer: string };
type LegendItem = { term: string; text: string };

export type CitizenshipCopy = {
  seo: { title: string; description: string; serviceName: string; serviceType: string };
  lang: { navLabel: string; fr: string; en: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    intro: string;
    facts: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    priceNote: string;
  };
  fede: { eyebrow: string; title: string; text: string; note: string };
  why: { eyebrow: string; title: string; lead: string; places: Card[]; availabilityNote: string };
  paths: { eyebrow: string; title: string; lead: string; items: Card[] };
  skills: { eyebrow: string; title: string; note: string; items: string[] };
  week: { eyebrow: string; title: string; lead: string; days: Day[]; legend: LegendItem[]; note: string };
  evidence: { eyebrow: string; title: string; lead: string; items: Labeled[]; examplesLabel: string; examples: string[] };
  included: { eyebrow: string; title: string; lead: string; items: Labeled[] };
  steps: { eyebrow: string; title: string; items: Labeled[] };
  about: { eyebrow: string; title: string; text: string; stats: { value: string; label: string }[] };
  faq: { eyebrow: string; title: string; items: FaqItem[] };
  cta: { eyebrow: string; title: string; text: string; primary: string; secondary: string; emailLabel: string };
  teaser: { eyebrow: string; title: string; text: string; cta: string };
};

const fr: CitizenshipCopy = {
  seo: {
    title: "Citoyenneté européenne à Strasbourg : séjour pédagogique pour écoles FEDE",
    description:
      "Une semaine à Strasbourg au cœur des institutions européennes pour faire vivre le module Culture et citoyenneté européennes. Programme et devis sur mesure.",
    serviceName: "Citoyenneté européenne à Strasbourg",
    serviceType: "Séjour pédagogique pour les écoles du réseau FEDE",
  },
  lang: { navLabel: "Langue", fr: "Français", en: "English" },
  hero: {
    eyebrow: "Écoles du réseau FEDE",
    title: "Une immersion au cœur des institutions européennes",
    subtitle: "Une semaine à Strasbourg pour donner vie à l’enseignement de la culture et de la citoyenneté européennes.",
    intro:
      "6 jours, 5 nuits, au contact du Parlement européen, du Conseil de l’Europe et de la frontière franco-allemande. Des cours et des ateliers, alignés sur le module « Culture et citoyenneté européennes ». Un programme clé en main, construit avec votre établissement.",
    facts: ["6 jours", "5 nuits", "Cours et ateliers"],
    ctaPrimary: "Recevoir un programme et un devis",
    ctaSecondary: "Prendre rendez-vous",
    priceNote: "Tarif sur devis selon la taille du groupe.",
  },
  fede: {
    eyebrow: "Pour les écoles du réseau FEDE",
    title: "Faire vivre le module là où l’Europe se construit",
    text: "Tous les diplômes européens de la FEDE comprennent le module commun « Culture et citoyenneté européennes ». Cours, visites d’institutions, enquêtes de terrain et projet collectif : vos étudiants passent de la théorie à la réalité institutionnelle. La semaine couvre le module « Culture et citoyenneté européennes » à travers des cours, des ateliers et des visites, pour les parcours Foundation Degree, Bachelor européen et Mastère européen. Le programme, l’évaluation et la reconnaissance dans le cursus sont définis avec votre établissement avant le départ.",
    note: "Le séjour est conçu pour s’aligner sur le module. Il ne remplace pas l’examen FEDE : la validation reste celle de votre établissement et de la FEDE.",
  },
  why: {
    eyebrow: "Pourquoi Strasbourg",
    title: "L’Europe grandeur nature",
    lead: "Carrefour entre la France et l’Allemagne, Strasbourg incarne l’esprit européen : diversité, dialogue et ouverture.",
    places: [
      {
        title: "Parlement européen",
        text: "Comprendre la prise de décision démocratique. Visite guidée sur réservation.",
      },
      {
        title: "Conseil de l’Europe",
        text: "Droits de l’homme et démocratie, au Palais de l’Europe.",
      },
      {
        title: "Strasbourg et Kehl",
        text: "La coopération transfrontalière au quotidien, du quartier européen au Jardin des Deux Rives.",
      },
      {
        title: "Cour européenne des droits de\u00A0l’homme\u00A0(CEDH)",
        text: "La protection des droits fondamentaux. Visite guidée sur réservation.",
      },
    ],
    availabilityNote: "Toutes les visites sont soumises aux disponibilités des institutions.",
  },
  paths: {
    eyebrow: "Trois parcours",
    title: "Alignés sur le niveau de vos étudiants",
    lead: "Votre établissement valide le programme et l’évaluation.",
    items: [
      {
        title: "Années 1 et 2",
        meta: "Foundation Degree · Bachelor européen",
        text: "Citoyenneté européenne, institutions et démocratie.",
      },
      {
        title: "Année 3",
        meta: "Bachelor européen",
        text: "Citoyenneté européenne, management interculturel et ressources humaines.",
      },
      {
        title: "Mastère européen",
        text: "Les entreprises et la transition écologique.",
      },
    ],
  },
  skills: {
    eyebrow: "Compétences",
    title: "Ce que vos étudiants sauront faire",
    note: "Ces objectifs s’inspirent du Cadre de référence des compétences pour une culture de la démocratie du Conseil de l’Europe.",
    items: [
      "Distinguer les responsabilités de l’Union européenne et celles du Conseil de l’Europe.",
      "Analyser un cas lié aux droits, à l’inclusion ou à l’intégrité.",
      "Utiliser des sources fiables et défendre une argumentation.",
      "Collaborer au-delà des frontières culturelles et des différences de points de vue.",
      "Concevoir une action citoyenne réaliste.",
    ],
  },
  week: {
    eyebrow: "Programme",
    title: "Une semaine type",
    lead: "Institutions européennes, découverte de Strasbourg et ateliers. Le détail s’ajuste avec vous.",
    days: [
      {
        id: "mon",
        name: "Lundi",
        slots: [
          { label: "Matin", text: "Arrivée à Strasbourg, transfert et installation." },
          { label: "Après-midi", text: "Découverte de la Grande-Île, inscrite au patrimoine mondial de l’UNESCO." },
        ],
      },
      {
        id: "tue",
        name: "Mardi",
        slots: [
          { label: "Matin", text: "Cours « L’Europe et ses institutions »." },
          { label: "Après-midi", text: "Visite d’entreprise, puis visite guidée du Parlement européen, sur réservation." },
        ],
      },
      {
        id: "wed",
        name: "Mercredi",
        slots: [
          { label: "Matin", text: "Cours « Kehl et la vie au-delà des frontières », coopération interculturelle." },
          { label: "Après-midi", text: "Balade au Jardin des Deux Rives, entre la France et l’Allemagne." },
        ],
      },
      {
        id: "thu",
        name: "Jeudi",
        slots: [
          { label: "Matin", text: "Visite d’entreprise." },
          { label: "Après-midi", text: "Découverte culturelle de la ville." },
        ],
      },
      {
        id: "fri",
        name: "Vendredi",
        slots: [
          { label: "Matin", text: "Enquête de terrain dans le quartier européen." },
          { label: "Après-midi", text: "Restitution des projets." },
        ],
      },
      {
        id: "sat",
        name: "Samedi",
        slots: [{ label: "Matin", text: "Départ : transfert vers l’aéroport ou la gare." }],
      },
    ],
    legend: [
      {
        term: "Inclus",
        text: "Les cours et les ateliers, l’hébergement, les petits-déjeuners, les déjeuners les jours de formation, les transferts locaux et les visites indiquées comme incluses.",
      },
      {
        term: "Optionnel",
        text: "Soirées et activités culturelles indiquées comme suggestions, adaptées au groupe.",
      },
      {
        term: "Payant",
        text: "Billets d’entrée lorsqu’une activité suggérée en prévoit. Ils sont alors signalés dans le programme.",
      },
    ],
    note: "Programme indicatif, adapté selon les disponibilités des institutions et des intervenants. Dîner de bienvenue, temps d’échange et temps libre complètent la semaine.",
  },
  evidence: {
    eyebrow: "Évaluation",
    title: "Des preuves concrètes pour votre établissement",
    lead: "Objectifs et cadre d’évaluation convenus avec vous avant le départ.",
    items: [
      {
        title: "Portfolio individuel",
        text: "Notes de terrain, carte institutionnelle, analyse de sources et réflexion personnelle.",
      },
      {
        title: "Projet d’équipe",
        text: "Une proposition documentée, une présentation et un plan d’action concret.",
      },
    ],
    examplesLabel: "Exemples de projets",
    examples: [
      "Une charte pour un recrutement équitable",
      "Une expérience plus accessible pour les visiteurs",
      "Une brève procédure de vérification de l’intégrité",
      "Une source d’information européenne fiable",
    ],
  },
  included: {
    eyebrow: "Inclusions",
    title: "Ce que le séjour comprend",
    lead: "Tarif sur devis selon la taille du groupe.",
    items: [
      {
        title: "Formation",
        text: "Des cours et des ateliers, alignés sur le module « Culture et citoyenneté européennes » des diplômes FEDE (Foundation Degree, Bachelor européen et Mastère européen).",
      },
      {
        title: "Visites d’entreprises",
        text: "Des rencontres avec des professionnels, au fil de la semaine.",
      },
      {
        title: "Hébergement",
        text: "5 nuits dans un cadre sûr et convivial.",
      },
      {
        title: "Repas",
        text: "Petit-déjeuner chaque matin et déjeuner les jours de formation.",
      },
      {
        title: "Transports sur place",
        text: "Transfert entre l’aéroport ou la gare et l’hébergement, et pass de transports en commun.",
      },
      {
        title: "Vie de groupe",
        text: "Découverte de Strasbourg, dîner de bienvenue et temps d’échange adaptés au groupe.",
      },
      {
        title: "Assurance",
        text: "Assurance voyage complète, dont le rapatriement 24h/24 et 200 k€.",
      },
      {
        title: "Accompagnement",
        text: "Suivi administratif et encadrement terrain 24h/24 pendant le séjour. L’équipe AMI Panorama est là avant, pendant et après.",
      },
    ],
  },
  steps: {
    eyebrow: "Comment ça marche",
    title: "Quatre étapes, un seul interlocuteur",
    items: [
      {
        title: "Vous nous contactez",
        text: "Formation, niveau, taille du groupe, dates et langue de travail.",
      },
      {
        title: "Nous proposons",
        text: "Un programme et un devis sur mesure.",
      },
      {
        title: "Nous coordonnons",
        text: "Institutions, formation, hébergement, transports, assurance et documents.",
      },
      {
        title: "Le groupe part",
        text: "Vous restez le référent pédagogique. Notre équipe s’occupe du reste.",
      },
    ],
  },
  about: {
    eyebrow: "AMI Panorama",
    title: "Une solution clé en main pour les établissements",
    text: "Nous coordonnons la logistique et adaptons le programme à votre calendrier et à votre groupe.",
    stats: [
      { value: "70", label: "écoles partenaires" },
      { value: "5 000+", label: "étudiants accompagnés" },
    ],
  },
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Ce que les directions nous demandent",
    items: [
      {
        question: "Le séjour valide-t-il le module FEDE ?",
        answer:
          "Le programme couvre le module « Culture et citoyenneté européennes » à travers des cours, des ateliers et des visites. La validation et l’examen relèvent de votre établissement et de la FEDE. Nous définissons ensemble les livrables et l’évaluation avant le départ.",
      },
      {
        question: "Pour quels parcours ?",
        answer:
          "Le module est commun aux diplômes européens de la FEDE. La semaine se décline pour le Foundation Degree, le Bachelor européen et le Mastère européen, selon le niveau du groupe.",
      },
      {
        question: "Quelle taille de groupe ?",
        answer: "La taille du groupe se définit avec votre établissement. Le tarif est établi sur devis selon cette taille.",
      },
      {
        question: "Dans quelle langue de travail ?",
        answer: "La langue de travail est choisie avec votre établissement. Indiquez-la dans votre demande, avec les dates souhaitées.",
      },
      {
        question: "Quel budget ?",
        answer: "Tarif sur devis selon la taille du groupe. Nous préparons un programme et un devis après un premier échange.",
      },
      {
        question: "La Cour européenne des droits de l’homme est-elle au programme ?",
        answer: "Oui. La visite figure au programme, comme les autres visites d’institutions, et se fait sur réservation.",
      },
      {
        question: "Quels documents prévoir ?",
        answer: "Une pièce d’identité physique valide, carte nationale d’identité ou passeport, est obligatoire pour entrer au Parlement européen.",
      },
    ],
  },
  cta: {
    eyebrow: "Prochaine étape",
    title: "Votre prochaine semaine européenne.",
    text: "Indiquez-nous le type de formation, la taille du groupe, les dates souhaitées et la langue de travail. Nous vous proposerons un programme et un devis sur mesure.",
    primary: "Demander mon programme",
    secondary: "Prendre rendez-vous",
    emailLabel: "Écrire à",
  },
  teaser: {
    eyebrow: "Citoyenneté européenne · Strasbourg",
    title: "Le module de citoyenneté européenne, vécu à Strasbourg.",
    text: "Pour les écoles du réseau FEDE : une semaine au contact des institutions européennes, avec des cours et des ateliers alignés sur le module « Culture et citoyenneté européennes ». Tarif sur devis selon la taille du groupe.",
    cta: "Découvrir la semaine",
  },
};

const en: CitizenshipCopy = {
  seo: {
    title: "European Citizenship Week in Strasbourg for FEDE Schools",
    description:
      "One week in Strasbourg at the heart of the European institutions, aligned with the European Culture and Citizenship module. Tailored programme and quote.",
    serviceName: "European Citizenship Week in Strasbourg",
    serviceType: "Study week for FEDE network schools",
  },
  lang: { navLabel: "Language", fr: "Français", en: "English" },
  hero: {
    eyebrow: "FEDE network schools",
    title: "A Deep Dive into the Heart of the European Institutions",
    subtitle: "One week in Strasbourg to bring the teaching of European Culture and Citizenship to life.",
    intro:
      "6 days, 5 nights, close to the European Parliament, the Council of Europe and the French-German border. Classes and workshops, aligned with the FEDE “European Culture and Citizenship” module. A turnkey programme, shaped with your school.",
    facts: ["6 days", "5 nights", "Classes and workshops"],
    ctaPrimary: "Get a programme and quote",
    ctaSecondary: "Book a call",
    priceNote: "Quote based on group size.",
  },
  fede: {
    eyebrow: "For FEDE network schools",
    title: "Bring the module to life where Europe is built",
    text: "Every FEDE European degree includes the shared “European Culture and Citizenship” module. Classes, institutional visits, field enquiries and a team project take your students from theory to the institutions themselves. The week covers the “European Culture and Citizenship” module through classes, workshops and visits, for Foundation Degree, European Bachelor’s and European Master’s pathways. Syllabus, assessment and recognition are agreed with your school before departure.",
    note: "The week is designed to align with the module. It does not replace the FEDE examination: validation remains with your school and with FEDE.",
  },
  why: {
    eyebrow: "Why Strasbourg",
    title: "Europe up close",
    lead: "At the crossroads of France and Germany, Strasbourg embodies the European spirit: diversity, dialogue and openness.",
    places: [
      {
        title: "European Parliament",
        text: "Democratic decision-making. Guided tour, reservation required.",
      },
      {
        title: "Council of Europe",
        text: "Human rights and democracy, at the Palais de l’Europe.",
      },
      {
        title: "Strasbourg and Kehl",
        text: "Everyday cross-border cooperation, from the European district to the Jardin des Deux Rives.",
      },
      {
        title: "European Court of Human\u00A0Rights\u00A0(ECHR)",
        text: "The protection of fundamental rights. Guided tour, reservation required.",
      },
    ],
    availabilityNote: "All visits are subject to the institutions’ availability.",
  },
  paths: {
    eyebrow: "Three pathways",
    title: "Matched to your students’ level",
    lead: "Your school confirms the syllabus, assessment and recognition.",
    items: [
      {
        title: "Years 1 and 2",
        meta: "Foundation Degree · European Bachelor’s",
        text: "European citizenship, institutions and democracy.",
      },
      {
        title: "Year 3",
        meta: "European Bachelor’s",
        text: "European citizenship, intercultural management and human resources.",
      },
      {
        title: "European Master’s",
        text: "Businesses and the ecological transition.",
      },
    ],
  },
  skills: {
    eyebrow: "Skills",
    title: "What students will be able to do",
    note: "These objectives draw on the Council of Europe’s Reference Framework of Competences for Democratic Culture.",
    items: [
      "Distinguish EU and Council of Europe responsibilities.",
      "Analyse a rights, inclusion or integrity case.",
      "Use reliable sources and defend an argument.",
      "Cooperate across cultures and perspectives.",
      "Design a realistic citizenship action.",
    ],
  },
  week: {
    eyebrow: "Programme",
    title: "A typical week",
    lead: "European institutions, discovering Strasbourg, and workshops. The detail is shaped with you.",
    days: [
      {
        id: "mon",
        name: "Monday",
        slots: [
          { label: "Morning", text: "Arrival in Strasbourg, transfer and check-in." },
          { label: "Afternoon", text: "Exploring the UNESCO-listed Grande-Île." },
        ],
      },
      {
        id: "tue",
        name: "Tuesday",
        slots: [
          { label: "Morning", text: "Class: Europe and its institutions." },
          { label: "Afternoon", text: "Business visit, then a guided tour of the European Parliament, reservation required." },
        ],
      },
      {
        id: "wed",
        name: "Wednesday",
        slots: [
          { label: "Morning", text: "Class: Kehl and life across the border, intercultural cooperation." },
          { label: "Afternoon", text: "A walk through the Jardin des Deux Rives, between France and Germany." },
        ],
      },
      {
        id: "thu",
        name: "Thursday",
        slots: [
          { label: "Morning", text: "Business visit." },
          { label: "Afternoon", text: "Cultural discovery of the city." },
        ],
      },
      {
        id: "fri",
        name: "Friday",
        slots: [
          { label: "Morning", text: "Field enquiry in the European district." },
          { label: "Afternoon", text: "Project presentations." },
        ],
      },
      {
        id: "sat",
        name: "Saturday",
        slots: [{ label: "Morning", text: "Departure: transfer to the airport or the station." }],
      },
    ],
    legend: [
      {
        term: "Included",
        text: "Classes and workshops, housing, breakfasts, lunches on training days, local transfers and visits marked as included.",
      },
      {
        term: "Optional",
        text: "Evenings and cultural activities marked as suggestions, adapted to the group.",
      },
      {
        term: "Paid",
        text: "Entry tickets when a suggested activity requires them. They are then marked in the programme.",
      },
    ],
    note: "Indicative programme, adapted to the availability of institutions and speakers. A welcome dinner, time to talk and free time complete the week.",
  },
  evidence: {
    eyebrow: "Assessment",
    title: "Evidence your school can recognise",
    lead: "Clear deliverables and an assessment framework agreed before departure.",
    items: [
      {
        title: "Individual portfolio",
        text: "Field notes, an institutional map, source analysis and a personal reflection.",
      },
      {
        title: "Team project",
        text: "A documented proposal, a presentation and a practical action plan.",
      },
    ],
    examplesLabel: "Examples of projects",
    examples: [
      "A fair recruitment charter",
      "A more accessible visitor experience",
      "A short integrity-check procedure",
      "A reliable European information resource",
    ],
  },
  included: {
    eyebrow: "What’s included",
    title: "What the week covers",
    lead: "Quote based on group size.",
    items: [
      {
        title: "Training",
        text: "Classes and workshops, aligned with the FEDE “European Culture and Citizenship” module (Foundation Degree, European Bachelor’s and European Master’s).",
      },
      {
        title: "Business visits",
        text: "Meetings with professionals during the week.",
      },
      {
        title: "Housing",
        text: "5 nights in a safe, welcoming setting.",
      },
      {
        title: "Meals",
        text: "Breakfast every morning and lunch on training days.",
      },
      {
        title: "Local transport",
        text: "Transfer between the airport or station and the accommodation, plus a public transport pass.",
      },
      {
        title: "Group life",
        text: "Time in Strasbourg, a welcome dinner and conversations adapted to the group.",
      },
      {
        title: "Insurance",
        text: "Comprehensive travel insurance, including 24/7 repatriation assistance and 200 k€ of cover.",
      },
      {
        title: "Support",
        text: "Administrative follow-up, and on-site supervision around the clock during the stay. The AMI Panorama team is there before, during and after.",
      },
    ],
  },
  steps: {
    eyebrow: "How it works",
    title: "Four steps, one team",
    items: [
      {
        title: "You get in touch",
        text: "Course, level, group size, dates and working language.",
      },
      {
        title: "We propose",
        text: "A tailored programme and quotation.",
      },
      {
        title: "We coordinate",
        text: "Institutions, training, housing, transport, insurance and paperwork.",
      },
      {
        title: "Your group travels",
        text: "You remain the academic lead. Our team handles the rest.",
      },
    ],
  },
  about: {
    eyebrow: "AMI Panorama",
    title: "A turnkey solution for schools",
    text: "We coordinate the logistics and adapt the programme to your calendar and your group.",
    stats: [
      { value: "70", label: "partner schools" },
      { value: "5,000+", label: "students supported" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "What school leaders ask us",
    items: [
      {
        question: "Does the week validate the FEDE module?",
        answer:
          "The programme covers the “European Culture and Citizenship” module through classes, workshops and visits. Validation and examinations remain with your school and with FEDE. We agree deliverables and assessment together before departure.",
      },
      {
        question: "Which pathways does it cover?",
        answer:
          "The module is shared across FEDE European degrees. The week is shaped for Foundation Degree, European Bachelor’s and European Master’s groups, according to the level of the students.",
      },
      {
        question: "How large is the group?",
        answer: "Group size is agreed with your school. The quote is prepared according to that size.",
      },
      {
        question: "Which working language?",
        answer: "The working language is agreed with your school. Tell us when you enquire, together with your preferred dates.",
      },
      {
        question: "What does it cost?",
        answer: "Quote based on group size. We prepare a programme and a quotation after a first conversation.",
      },
      {
        question: "Is the European Court of Human Rights on the programme?",
        answer: "Yes. The visit is on the programme, like the other institutional visits, and it requires a reservation.",
      },
      {
        question: "Which documents are required?",
        answer: "A valid physical ID card or passport is required to enter the European Parliament.",
      },
    ],
  },
  cta: {
    eyebrow: "Next step",
    title: "Your next European mobility week.",
    text: "Share your course, group size, preferred dates and working language. We will prepare a tailored programme and quotation.",
    primary: "Request my programme",
    secondary: "Book a call",
    emailLabel: "Email",
  },
  teaser: {
    eyebrow: "European citizenship · Strasbourg",
    title: "The European citizenship module, lived in Strasbourg.",
    text: "For FEDE network schools: one week with the European institutions, with classes and workshops aligned with the European Culture and Citizenship module. Quote based on group size.",
    cta: "Discover the week",
  },
};

const copies = { fr, en } as const;

export function citizenshipCopy(locale: CitizenshipLocale): CitizenshipCopy {
  return copies[locale];
}

export function collectCopyStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectCopyStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(collectCopyStrings);
  return [];
}

export function citizenshipJsonLd(locale: CitizenshipLocale) {
  const copy = citizenshipCopy(locale);
  const path = citizenshipRoutes[locale];
  const url = `https://amipanorama.com${path}`;
  const inLanguage = locale === "fr" ? "fr-FR" : "en-GB";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: copy.seo.title,
        description: copy.seo.description,
        inLanguage,
        isPartOf: { "@id": "https://amipanorama.com/#website" },
        about: { "@id": `${url}#service` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: copy.seo.serviceName,
        serviceType: copy.seo.serviceType,
        provider: { "@id": "https://amipanorama.com/#organization" },
        url,
        description: copy.seo.description,
        areaServed: { "@type": "City", name: "Strasbourg" },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        inLanguage,
        mainEntity: copy.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
