/**
 * Source unique des destinations publiques.
 * Textes repris des pages déjà en ligne (accueil, /destinations, modale).
 * Aucun prix, aucun programme jour par jour, aucun chiffre inventé.
 *
 * `indexable` : la page /destinations/[slug] existe et entre dans le sitemap.
 * Dubai reste « prochainement » : pas de page, pas d'indexation.
 */

export type DestinationGallery = { src: string; alt: string };

export type Destination = {
  slug: string;
  city: string;
  country: string;
  countryCode: string;
  flag: string;
  tag: string;
  /** Libellé de la carte d'accueil lorsqu'il diffère du catalogue. */
  cardTag?: string;
  headline: string;
  description: string;
  highlights: string[];
  ideal: string;
  facts: string[];
  accent: string;
  gradient: string;
  phare: boolean;
  comingSoon: boolean;
  indexable: boolean;
  /** Photo de la carte d'accueil. */
  cardImage: string;
  cardAlt: string;
  /** Visuel de la page destination et du catalogue. */
  photo: string;
  photoAlt: string;
  gallery: DestinationGallery[];
};

const STOCK = "/Assets/stock/v1";

export const destinations: Destination[] = [
  {
    slug: "montreal",
    city: "Montréal",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    tag: "Destination historique · Amérique du Nord",
    headline: "L'Amérique du Nord, en français.",
    description:
      "Notre destination historique, et la plus maîtrisée. Métropole bilingue et cosmopolite, Montréal est la seule ville nord-américaine où les étudiants francophones peuvent découvrir un modèle économique radicalement différent sans barrière linguistique. Un cadre idéal pour élargir sa vision tout en restant ancré dans sa langue.",
    highlights: [
      "Formation sur le modèle économique et l'environnement professionnel nord-américain",
      "Visites d'entreprises innovantes : tech, commerce, services, secteur créatif",
      "Exploration de la ville et de ses quartiers : Plateau, Vieux-Montréal, Mile End",
      "Rencontres avec des professionnels locaux et une communauté française active",
    ],
    ideal: "Numérique · Gestion · Commerce · Communication",
    facts: [
      "Notre destination historique, la première ouverte et la plus maîtrisée.",
      "Plus grande métropole francophone d'Amérique du Nord.",
      "L'une des plus fortes densités étudiantes du continent.",
    ],
    accent: "#24478F",
    gradient: "linear-gradient(170deg,rgba(8,28,60,0.30),rgba(20,52,140,0.18))",
    phare: true,
    comingSoon: false,
    indexable: true,
    cardImage: "/Assets/groups/montreal-sunset.jpg",
    cardAlt: "Groupe AMI Panorama au belvédère du Mont-Royal, Montréal",
    photo: `${STOCK}/montreal.jpg`,
    photoAlt: "Montréal, Canada",
    gallery: [
      ["/Assets/groups/montreal-group.jpg", "Groupe AMI Panorama à Montréal"],
      ["/Assets/groups/montreal-extra.jpg", "Groupe AMI Panorama à Montréal"],
      ["/Assets/groups/montreal-diner.jpg", "Groupe AMI Panorama à Montréal"],
      ["/Assets/groups/montreal-diploma.jpg", "Remise de certificats d'un groupe AMI Panorama à Montréal"],
      ["/Assets/groups/montreal-night.jpg", "Groupe AMI Panorama à Montréal, de nuit"],
    ].map(([src, alt]) => ({ src, alt })),
  },
  {
    slug: "seville",
    city: "Séville",
    country: "Espagne",
    countryCode: "ES",
    flag: "🇪🇸",
    tag: "Deuxième pilier · Culture & immersion",
    headline: "L'Andalousie comme terrain de formation.",
    description:
      "Notre deuxième pilier. Séville offre un cadre exceptionnel pour une immersion totale : architecture baroque, économie tertiaire dynamique et chaleur humaine qui facilite naturellement l'ouverture interculturelle. Une destination idéale pour les filières orientées vers les services, le tourisme et le commerce.",
    highlights: [
      "Hébergement en centre-ville dans un établissement sélectionné et testé sur place",
      "Formation avec panorama socio-économique de la région andalouse",
      "Visites d'entreprises locales dans les secteurs tertiaire et services",
      "Activités culturelles : flamenco, Cathédrale de Séville, Alcazar",
    ],
    ideal: "Tourisme · Commerce · RH · Services",
    facts: [
      "Notre deuxième pilier, après Montréal.",
      "Capitale de l'Andalousie, économie tournée vers les services et le tourisme.",
      "Patrimoine mondial UNESCO : cathédrale, Alcázar, Giralda.",
    ],
    accent: "#1B3D88",
    gradient: "linear-gradient(170deg,rgba(90,34,10,0.30),rgba(170,76,20,0.18))",
    phare: true,
    comingSoon: false,
    indexable: true,
    cardImage: "/Assets/groups/seville-garden.jpg",
    cardAlt: "Groupe AMI Panorama dans les jardins de l'Alcázar, Séville",
    photo: `${STOCK}/seville.jpg`,
    photoAlt: "Séville, Espagne",
    gallery: [
      ["/Assets/groups/seville-group.jpg", "Groupe AMI Panorama à Séville"],
      ["/Assets/groups/seville-garden.jpg", "Groupe AMI Panorama dans les jardins de Séville"],
      ["/Assets/groups/seville-extra.jpg", "Groupe AMI Panorama à Séville"],
      ["/Assets/groups/seville-extra-2.jpg", "Groupe AMI Panorama à Séville"],
      ["/Assets/groups/seville-boat.jpg", "Groupe AMI Panorama à Séville"],
      ["/Assets/groups/seville-diplomas.jpg", "Remise de certificats d'un groupe AMI Panorama à Séville"],
    ].map(([src, alt]) => ({ src, alt })),
  },
  {
    slug: "new-york",
    city: "New York",
    country: "États-Unis",
    countryCode: "US",
    flag: "🇺🇸",
    tag: "Destination iconique · Business & culture",
    headline: "La ville où l'ambition professionnelle prend une autre dimension.",
    description:
      "New York ne s'explique pas, elle se vit. Aucun autre environnement ne confronte aussi directement les participants à l'intensité d'un marché international. Business English de haut niveau, rencontres avec des professionnels en activité, énergie unique d'une ville qui ne ralentit jamais.",
    highlights: [
      "Business English intensif avec des professeurs et professionnels natifs",
      "Visites d'entreprises dans l'écosystème business new-yorkais",
      "Découverte de la ville : Manhattan, Brooklyn Bridge, musées emblématiques",
      "Rencontres avec des professionnels et expatriés français en activité",
    ],
    ideal: "Commerce international · Finance · Communication · Tourisme",
    facts: [
      "L'un des marchés internationaux les plus intenses au monde.",
      "Centre mondial de la finance, du commerce et de la création.",
      "Business English de haut niveau, en contexte réel.",
    ],
    accent: "#24478F",
    gradient: "linear-gradient(170deg,rgba(10,18,40,0.34),rgba(20,38,80,0.20))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: "/Assets/groups/newyork-pano.jpg",
    cardAlt: "Groupe AMI Panorama à New York",
    photo: `${STOCK}/new-york.jpg`,
    photoAlt: "New York, États-Unis",
    gallery: [
      ["/Assets/groups/newyork-group.jpg", "Groupe AMI Panorama à New York"],
      ["/Assets/groups/newyork-pano.jpg", "Groupe AMI Panorama à New York"],
      ["/Assets/groups/newyork-extra.jpg", "Groupe AMI Panorama à New York"],
      ["/Assets/groups/newyork-students.jpg", "Groupe d'étudiants AMI Panorama à New York"],
      ["/Assets/groups/newyork-dumbo.jpg", "Groupe AMI Panorama à DUMBO, New York"],
      ["/Assets/groups/newyork-bridge.jpg", "Groupe AMI Panorama à New York"],
    ].map(([src, alt]) => ({ src, alt })),
  },
  {
    slug: "londres",
    city: "Londres",
    country: "Royaume-Uni",
    countryCode: "GB",
    flag: "🇬🇧",
    tag: "Business English",
    headline: "La capitale mondiale du Business English.",
    description:
      "Londres reste la référence absolue pour l'apprentissage de l'anglais professionnel en contexte réel. Un séjour à Londres, c'est une immersion totale dans une ville qui concentre une densité unique d'entreprises internationales et où l'anglais professionnel est la langue de travail universelle.",
    highlights: [
      "Formation Business English avec des formateurs professionnels natifs certifiés",
      "Visites d'entreprises et observation du monde du travail londonien",
      "Programme adapté au niveau et à la filière du groupe",
      "Découverte des quartiers emblématiques : City, Canary Wharf, Shoreditch",
    ],
    ideal: "Toutes filières · Progression en anglais professionnel",
    facts: [
      "Référence mondiale pour l'anglais professionnel en contexte réel.",
      "L'un des premiers centres financiers et d'affaires de la planète.",
      "Densité unique d'entreprises et d'institutions internationales.",
    ],
    accent: "#24478F",
    gradient: "linear-gradient(170deg,rgba(10,20,44,0.42),rgba(24,44,88,0.28))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: `${STOCK}/londres.jpg`,
    cardAlt: "Londres, Royaume-Uni",
    photo: `${STOCK}/londres.jpg`,
    photoAlt: "Londres, Royaume-Uni",
    gallery: [
      ["/Assets/groups/london-group.jpg", "Groupe AMI Panorama à Londres"],
      ["/Assets/groups/london-museum.jpg", "Groupe AMI Panorama à Londres"],
      ["/Assets/groups/london-bridge.jpg", "Groupe AMI Panorama à Londres"],
    ].map(([src, alt]) => ({ src, alt })),
  },
  {
    slug: "malte",
    city: "Malte",
    country: "Méditerranée",
    countryCode: "MT",
    flag: "🇲🇹",
    tag: "English immersion",
    headline: "L'anglais en immersion totale, sous le soleil méditerranéen.",
    description:
      "Malte est l'une des rares destinations européennes entièrement anglophones, et l'une des plus accessibles. Son cadre méditerranéen, son histoire millénaire et sa taille humaine en font un environnement idéal pour une progression réelle en anglais professionnel, dans une atmosphère solaire et engageante.",
    highlights: [
      "Cours d'anglais professionnel animés par des formateurs natifs certifiés",
      "Visites culturelles : Valletta (capitale UNESCO), Blue Grotto, Mdina",
      "Visites d'entreprises locales adaptées à la filière du groupe",
      "Programme d'activités conçu pour maximiser l'immersion culturelle et sociale",
    ],
    ideal: "Toutes filières · Progression en anglais professionnel",
    facts: [
      "L'une des rares destinations européennes officiellement anglophones.",
      "Immersion linguistique dans un cadre méditerranéen accessible.",
      "La Valette, capitale classée au patrimoine mondial UNESCO.",
    ],
    accent: "#24478F",
    gradient: "linear-gradient(170deg,rgba(8,28,70,0.42),rgba(18,50,130,0.28))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: "/Assets/destinations/malte.jpg",
    cardAlt: "Malte",
    photo: "/Assets/destinations/malte.jpg",
    photoAlt: "Malte",
    gallery: [
      ["/Assets/groups/malta-group.jpg", "Groupe AMI Panorama à Malte"],
      ["/Assets/groups/malta-students.jpg", "Groupe AMI Panorama à Malte"],
      ["/Assets/groups/malta-main.jpg", "Groupe AMI Panorama à Malte"],
    ].map(([src, alt]) => ({ src, alt })),
  },
  {
    slug: "maroc",
    city: "Maroc",
    country: "Afrique du Nord",
    countryCode: "MA",
    flag: "🇲🇦",
    tag: "Immersion & management interculturel",
    cardTag: "Immersion & interculturel",
    headline: "L'Afrique du Nord, entre tradition et dynamisme contemporain.",
    description:
      "Le Maroc, principalement Marrakech et Casablanca, propose un programme ancré dans les réalités économiques et culturelles du pays. Une destination qui confronte les apprentis à un environnement professionnel différent, entre héritage fort et ambitions de modernisation.",
    highlights: [
      "Formation sur le tissu économique marocain et les échanges franco-marocains",
      "Visites d'entreprises : industrie, services, secteur numérique en développement",
      "Management interculturel et compréhension des codes professionnels locaux",
      "Immersion culturelle : médinas, artisanat, gastronomie, architecture",
    ],
    ideal: "Numérique · Marketing · Commerce · Management",
    facts: [
      "Immersion interculturelle entre héritage et modernisation.",
      "Marrakech et Casablanca : deux visages de l'économie marocaine.",
      "Liens économiques étroits avec la France.",
    ],
    accent: "#D4862A",
    gradient: "linear-gradient(170deg,rgba(80,30,10,0.42),rgba(160,80,20,0.28))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: "/Assets/destinations/Maroc.jpg",
    cardAlt: "Maroc",
    photo: "/Assets/destinations/Maroc.jpg",
    photoAlt: "Maroc",
    gallery: [],
  },
  {
    slug: "berlin",
    city: "Berlin",
    country: "Allemagne",
    countryCode: "DE",
    flag: "🇩🇪",
    tag: "Entrepreneuriat & innovation",
    headline: "L'Europe de l'entrepreneuriat et des idées neuves.",
    description:
      "Berlin pense autrement. Capitale européenne de la scène startup et de l'innovation ouverte, elle offre aux apprentis une immersion dans un écosystème professionnel non conventionnel. Un programme volontairement orienté terrain et rencontres, moins de salle de cours, plus de fondateurs, d'entreprises et d'idées.",
    highlights: [
      "Immersion dans l'écosystème startup et entrepreneurial berlinois",
      "Visites d'entreprises innovantes : tech, digital, créatif, industrie",
      "Rencontres avec des professionnels, fondateurs et acteurs de la scène locale",
      "Programme culturel : East Side Gallery, Checkpoint Charlie, quartiers créatifs",
    ],
    ideal: "Numérique · Innovation · Commerce · Management",
    facts: [
      "Capitale européenne majeure de la scène entrepreneuriale.",
      "Écosystème d'innovation ouvert et non conventionnel.",
      "Forte densité d'entreprises créatives et technologiques.",
    ],
    accent: "#1B3D88",
    gradient: "linear-gradient(170deg,rgba(60,20,10,0.42),rgba(120,50,20,0.28))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: `${STOCK}/berlin.jpg`,
    cardAlt: "Berlin, Allemagne",
    photo: `${STOCK}/berlin.jpg`,
    photoAlt: "Berlin, Allemagne",
    gallery: [["/Assets/groups/berlin-main.jpg", "Groupe AMI Panorama à Berlin"]].map(([src, alt]) => ({ src, alt })),
  },
  {
    slug: "rome",
    city: "Rome",
    country: "Italie",
    countryCode: "IT",
    flag: "🇮🇹",
    tag: "Culture & économie italienne",
    headline: "L'Italie entre grandeur historique et réalité économique.",
    description:
      "Rome offre un cadre de formation unique : une compréhension par l'immersion. Le programme s'appuie sur la richesse culturelle de la Ville éternelle pour ouvrir les apprentis à la réalité économique italienne, ses secteurs d'activité, ses entreprises, ses codes professionnels et son rapport singulier à la qualité.",
    highlights: [
      "Panorama socio-économique de l'Italie et de ses grands secteurs d'activité",
      "Visites d'entreprises locales sélectionnées selon la filière du groupe",
      "Immersion culturelle : Colossée, Forum romain, Vatican, Trastevere",
      "Compréhension des pratiques professionnelles et du tissu économique local",
    ],
    ideal: "Commerce · Tourisme · Services · Gestion",
    facts: [
      "Comprendre l'économie italienne par l'immersion.",
      "Patrimoine exceptionnel : Colisée, Forum romain, Vatican.",
      "Carrefour historique de l'Europe méditerranéenne.",
    ],
    accent: "#D4862A",
    gradient: "linear-gradient(170deg,rgba(90,35,8,0.42),rgba(160,70,18,0.28))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: "/Assets/destinations/Rome.jpg",
    cardAlt: "Rome, Italie",
    photo: "/Assets/destinations/Rome.jpg",
    photoAlt: "Rome, Italie",
    gallery: [
      ["/Assets/groups/rome-group.jpg", "Groupe AMI Panorama à Rome"],
      ["/Assets/groups/rome-diploma.jpg", "Remise de certificats d'un groupe AMI Panorama à Rome"],
      ["/Assets/groups/rome-square.jpg", "Groupe AMI Panorama à Rome"],
    ].map(([src, alt]) => ({ src, alt })),
  },
  {
    slug: "miami",
    city: "Miami",
    country: "États-Unis",
    countryCode: "US",
    flag: "🇺🇸",
    tag: "Business English & ouverture américaine",
    cardTag: "Business English & ouverture US",
    headline: "L'Amérique dans sa version la plus internationale.",
    description:
      "Miami n'est pas New York, et c'est précisément son atout. Carrefour des Amériques, ville internationale par nature, elle offre aux apprentis une lecture concrète du modèle économique américain dans un environnement cosmopolite, accessible et tourné vers l'Atlantique.",
    highlights: [
      "Panorama socio-économique des États-Unis et de la région Miami",
      "Visites de campus américains et d'entreprises locales ou françaises implantées",
      "Business English professionnel avec des intervenants natifs",
      "Exposition aux codes culturels et professionnels nord-américains",
    ],
    ideal: "Commerce international · Finance · Communication · Tourisme",
    facts: [
      "Carrefour économique des Amériques.",
      "Porte d'entrée cosmopolite vers le marché américain.",
      "Business English dans un environnement accessible.",
    ],
    accent: "#24478F",
    gradient: "linear-gradient(170deg,rgba(8,24,55,0.42),rgba(18,44,100,0.28))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: "/Assets/destinations/Miami-unsplash.jpg",
    cardAlt: "Miami, États-Unis",
    photo: "/Assets/destinations/Miami-unsplash.jpg",
    photoAlt: "Miami, États-Unis",
    gallery: [],
  },
  {
    slug: "seoul",
    city: "Séoul",
    country: "Corée du Sud",
    countryCode: "KR",
    flag: "🇰🇷",
    tag: "Tech & monde asiatique",
    headline: "Une fenêtre directe sur l'Asie du XXIe siècle.",
    description:
      "Séoul est l'une des métropoles les plus innovantes de la planète. Un séjour en Corée du Sud expose les apprentis à une culture professionnelle radicalement différente : exigence, culture de l'innovation, technologies de rupture. Un programme pour ceux qui veulent comprendre où se construit l'avenir.",
    highlights: [
      "Observation des pratiques professionnelles dans un environnement tech de pointe",
      "Visites de districts d'innovation, startups et grandes corporations coréennes",
      "Compréhension des codes sociaux et professionnels du monde du travail asiatique",
      "Développement de la capacité d'adaptation interculturelle en contexte réel",
    ],
    ideal: "Numérique · Tech · Industrie · Innovation",
    facts: [
      "L'une des métropoles les plus innovantes au monde.",
      "Culture professionnelle et technologique de rupture.",
      "Fenêtre directe sur l'économie asiatique du XXIe siècle.",
    ],
    accent: "#1B3D88",
    gradient: "linear-gradient(170deg,rgba(6,14,36,0.42),rgba(16,32,80,0.28))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: `${STOCK}/seoul.jpg`,
    cardAlt: "Séoul, Corée du Sud",
    photo: `${STOCK}/seoul.jpg`,
    photoAlt: "Séoul, Corée du Sud",
    gallery: [],
  },
  {
    slug: "bucarest",
    city: "Bucarest",
    country: "Roumanie",
    countryCode: "RO",
    flag: "🇷🇴",
    tag: "Transformation & culture européenne",
    headline: "Une capitale européenne en pleine transformation.",
    description:
      "Bucarest conjugue architecture monumentale, nouvelles industries et énergie entrepreneuriale. Une destination qui permet aux apprentis de comprendre les mutations de l'Europe centrale, au contact d'acteurs économiques et culturels ancrés dans la ville.",
    highlights: [
      "Panorama socio-économique de la Roumanie et de sa capitale",
      "Visites d'entreprises et rencontres dans les secteurs numérique, services et industrie",
      "Découverte du patrimoine : Athénée roumain, centre historique et architecture du XXe siècle",
      "Immersion dans les nouveaux lieux créatifs et entrepreneuriaux de Bucarest",
    ],
    ideal: "Numérique · Commerce · Management · Communication",
    facts: [
      "Une capitale européenne en pleine transformation économique et urbaine.",
      "Un écosystème numérique et entrepreneurial en forte croissance.",
      "Un patrimoine architectural marqué par plusieurs époques de l'histoire roumaine.",
    ],
    accent: "#24478F",
    gradient: "linear-gradient(170deg,rgba(10,28,56,0.34),rgba(25,77,122,0.18))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: `${STOCK}/bucarest.jpg`,
    cardAlt: "Bucarest, Roumanie",
    photo: `${STOCK}/bucarest.jpg`,
    photoAlt: "Bucarest, Roumanie",
    gallery: [],
  },
  {
    slug: "lisbonne",
    city: "Lisbonne",
    country: "Portugal",
    countryCode: "PT",
    flag: "🇵🇹",
    tag: "Innovation & ouverture atlantique",
    headline: "L'Europe atlantique, entre patrimoine et nouveaux usages.",
    description:
      "Lisbonne offre un terrain d'apprentissage particulièrement accessible : une économie ouverte, une scène entrepreneuriale internationale et une culture urbaine forte. Son échelle humaine favorise les rencontres, l'observation et l'immersion professionnelle.",
    highlights: [
      "Panorama de l'économie portugaise et de l'écosystème lisboète",
      "Rencontres professionnelles dans la tech, le tourisme et les industries créatives",
      "Découverte de la ville : Baixa, Alfama, Belém et les rives du Tage",
      "Lecture des transformations urbaines et des nouveaux modèles de services",
    ],
    ideal: "Tourisme · Commerce · Numérique · Communication",
    facts: [
      "Une capitale ouverte sur l'Atlantique et les échanges internationaux.",
      "Un écosystème reconnu pour la tech, les services et les industries créatives.",
      "Une ville à taille humaine où l'immersion professionnelle reste très accessible.",
    ],
    accent: "#D4862A",
    gradient: "linear-gradient(170deg,rgba(34,20,8,0.34),rgba(174,92,22,0.18))",
    phare: false,
    comingSoon: false,
    indexable: true,
    cardImage: `${STOCK}/lisbonne.jpg`,
    cardAlt: "Lisbonne, Portugal",
    photo: `${STOCK}/lisbonne.jpg`,
    photoAlt: "Lisbonne, Portugal",
    gallery: [],
  },
  {
    slug: "dubai",
    city: "Dubai",
    country: "Émirats arabes unis",
    countryCode: "AE",
    flag: "🇦🇪",
    tag: "Prochainement",
    headline: "L'économie du futur, entre tradition et disruption mondiale.",
    description:
      "Un programme orienté vers les modèles économiques émergents du Golfe : innovation, finance internationale, architecture de la disruption. Dubai représente un terrain d'immersion unique pour comprendre comment une ville se réinvente à toute vitesse.",
    highlights: [],
    ideal: "",
    facts: [],
    accent: "#D4862A",
    gradient: "linear-gradient(170deg,rgba(80,40,10,0.42),rgba(160,90,20,0.28))",
    phare: false,
    comingSoon: true,
    indexable: false,
    cardImage: `${STOCK}/dubai.jpg`,
    cardAlt: "Dubai",
    photo: `${STOCK}/dubai.jpg`,
    photoAlt: "Dubai",
    gallery: [],
  },
];

export const activeDestinations = destinations.filter((d) => !d.comingSoon);
export const indexableDestinations = destinations.filter((d) => d.indexable);
export const activeDestinationCount = activeDestinations.length;

export const destinationsHeroImage = `${STOCK}/horizon.jpg`;

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export function destinationPath(d: Pick<Destination, "slug" | "indexable">) {
  return d.indexable ? `/destinations/${d.slug}` : "/destinations";
}

/** Villes citées dans le footer, dans l'ordre déjà publié. */
export const footerDestinationCities = ["Montréal", "New York", "Séville", "Londres", "Maroc", "Séoul"] as const;

export function footerDestinations() {
  return footerDestinationCities.map((city) => destinations.find((d) => d.city === city)).filter((d): d is Destination => Boolean(d));
}
