// ─────────────────────────────────────────────────────────────────────────
//  TÉMOIGNAGES — source unique (affichés sur l'accueil)
//
//  Règle : UNIQUEMENT des témoignages RÉELS (posts/commentaires LinkedIn qui
//  mentionnent AMI Panorama). Citations = extraits fidèles, jamais inventés.
//  Pour en ajouter : copie une nouvelle entrée ci-dessous (quote = extrait,
//  name = personne/établissement, school = rôle · organisation, dest, flag).
//  kind : "participant" (étudiant·e), "referent" (resp. pédagogique / référent),
//  "ecole" (page officielle d'établissement).
// ─────────────────────────────────────────────────────────────────────────

export type Testimonial = {
  quote: string;
  name: string;
  school: string;
  dest: string;
  flag: string;
  kind?: "participant" | "referent" | "ecole";
};

export const testimonials: Testimonial[] = [
  // ── Participants ───────────────────────────────────────────────────────
  {
    quote: "Un immense merci à AMI Panorama pour cette organisation parfaite, ainsi qu'aux accompagnateurs qui nous ont guidées tout au long de cette aventure. Cette expérience reste gravée et me donne plus que jamais envie de continuer à me développer à l'international.",
    name: "Juline Fichant",
    school: "Marketing & Communication · PRO BTP Groupe",
    dest: "Montréal",
    flag: "🇨🇦",
    kind: "participant",
  },
  {
    quote: "Un grand merci à AMI Panorama pour l'organisation de cette expérience, ainsi qu'aux accompagnateurs qui nous ont guidés tout au long du séjour. Cette aventure restera un souvenir marquant et une étape importante dans mon parcours.",
    name: "Pauline Baudouin",
    school: "Bachelor Marketing & Com. Digitale · AFIPE",
    dest: "Montréal",
    flag: "🇨🇦",
    kind: "participant",
  },
  {
    quote: "Merci à l'équipe d'AMI Panorama et à ses accompagnateurs sur place pour leur accueil et leur accompagnement exceptionnels. Ce séjour m'a permis d'obtenir une certification sur le panorama économique en Amérique du Nord. Une expérience marquante, tant sur le plan humain que professionnel.",
    name: "Carla Americo",
    school: "Master Ingénierie Patrimoniale · ESA",
    dest: "Montréal",
    flag: "🇨🇦",
    kind: "participant",
  },
  {
    quote: "Je remercie Groupe Alternance Colmar et AMI Panorama pour cette opportunité incroyable qui nous a permis de vivre une semaine de mobilité internationale à Montréal. Une semaine enrichissante qui m'a vraiment marqué.",
    name: "Chloé Veltin",
    school: "Alternante · Groupe Alternance Colmar",
    dest: "Montréal",
    flag: "🇨🇦",
    kind: "participant",
  },
  {
    quote: "Merci à AMI Panorama pour l'accompagnement, et plus particulièrement à son équipe sur place qui s'est démenée toute la semaine pour nous faire découvrir New York. Nous repartons tous avec des souvenirs plein la tête et une meilleure compréhension du monde de la finance outre-Atlantique.",
    name: "Lentz Gauthier",
    school: "Assistant comptable · CCI Campus Alsace",
    dest: "New York",
    flag: "🇺🇸",
    kind: "participant",
  },
  {
    quote: "Une mobilité organisée par l'Institut Européen de Formation et AMI Panorama : une véritable immersion dans un environnement entrepreneurial et culturel inspirant. Elle m'a permis de développer de nouvelles compétences et d'élargir ma vision du monde professionnel.",
    name: "Line Kempf",
    school: "Bachelor RH · Institut Européen de Formation",
    dest: "Séville",
    flag: "🇪🇸",
    kind: "participant",
  },
  {
    quote: "Une expérience incroyable, qui nous a ouvert les yeux aux nouvelles cultures et architectures, permis de faire de nouvelles rencontres et de très belles activités. On ne peut que garder de très beaux souvenirs de ce voyage à Séville. Merci AMI Panorama et les accompagnateurs !",
    name: "Aya Hazzaz",
    school: "Étudiante · ECEMA",
    dest: "Séville",
    flag: "🇪🇸",
    kind: "participant",
  },
  {
    quote: "Certaines expériences laissent une empreinte indélébile sur notre parcours professionnel, et mon séjour au Canada en fait partie.",
    name: "Ambre Spechier",
    school: "Étudiante · My Business School",
    dest: "Montréal",
    flag: "🇨🇦",
    kind: "participant",
  },
  {
    quote: "Grâce à AMI Panorama et l'Institut Européen de Formation, j'ai eu la chance de me rendre à Montréal. Je ne qualifierais pas ce séjour de vacances : même là-bas, nous avons continué à travailler, pris de nouveaux contacts et avancé sur nos projets. Nous avons su joindre l'utile à l'agréable en explorant la ville.",
    name: "Hugo Zenner",
    school: "Étudiant · Institut Européen de Formation",
    dest: "Montréal",
    flag: "🇨🇦",
    kind: "participant",
  },
  {
    quote: "Cette expérience canadienne m'a permis de renforcer mes compétences et de découvrir une nouvelle culture professionnelle.",
    name: "Anissa Guermoudi",
    school: "Ancienne participante · Toronto",
    dest: "Canada",
    flag: "🇨🇦",
    kind: "participant",
  },

  // ── Référents & responsables pédagogiques ──────────────────────────────
  {
    quote: "Merci aux équipes d'AMI Panorama pour leur accompagnement. Cette mobilité est une expérience riche, autant culturelle que professionnelle, qui s'inscrit pleinement dans le parcours international de nos étudiants en double diplôme.",
    name: "Laure Breda",
    school: "Responsable Formations Internationales & Référente Mobilité · ESA",
    dest: "Montréal",
    flag: "🇨🇦",
    kind: "referent",
  },
  {
    quote: "Un séjour qui a fait son effet WAOUW de bout en bout : des étoiles plein les yeux, de beaux moments de partage et de découverte. Merci à AMI Panorama pour l'accompagnement tout au long de cette mobilité à New York.",
    name: "Dalila Besseghir-Rahal",
    school: "Responsable pédagogique filière comptable · CCI Campus Alsace",
    dest: "New York",
    flag: "🇺🇸",
    kind: "referent",
  },
  {
    quote: "Une semaine d'immersion intensive en anglais, co-organisée avec notre partenaire AMI Panorama. Merci pour la qualité de cet accompagnement — un format qui incarne ce que nous défendons : former des managers ouverts sur le monde.",
    name: "Nathalie Clair",
    school: "Responsable Pédagogique · Sully Business School",
    dest: "Londres",
    flag: "🇬🇧",
    kind: "referent",
  },
  {
    quote: "Clap de fin pour notre séjour à Séville avec 41 étudiants : une expérience riche en découvertes, en échanges et en souvenirs. Merci à AMI Panorama — une véritable ouverture sur le monde pour nos étudiants.",
    name: "Cindy Cailloux",
    school: "Référente Pédagogique · ESMP / ECORIS",
    dest: "Séville",
    flag: "🇪🇸",
    kind: "referent",
  },

  // ── Établissements partenaires ─────────────────────────────────────────
  {
    quote: "Nos étudiants ont vécu une semaine à Londres entre cours d'anglais professionnel et visites d'entreprises. Merci à notre partenaire AMI Panorama pour la qualité de cette organisation : les participants ont obtenu leur certificat à l'issue du séjour.",
    name: "Sully Business School",
    school: "Établissement partenaire",
    dest: "Londres",
    flag: "🇬🇧",
    kind: "ecole",
  },
  {
    quote: "Une immersion internationale au cœur de New York pour nos étudiants DSCG. Grâce au programme organisé par AMI Panorama, ils ont exploré les lieux emblématiques de la ville et rencontré des professionnels — une expérience aussi enrichissante qu'inoubliable.",
    name: "CCI Campus Alsace",
    school: "Établissement partenaire",
    dest: "New York",
    flag: "🇺🇸",
    kind: "ecole",
  },
  {
    quote: "Une semaine intense à Séville pour nos étudiants : découvertes culturelles, rencontres avec des entrepreneurs, visite d'un incubateur de startups et cours en anglais. Un grand merci à AMI Panorama et son équipe pour l'organisation !",
    name: "Campus Eductive Bordeaux",
    school: "Établissement partenaire",
    dest: "Séville",
    flag: "🇪🇸",
    kind: "ecole",
  },
  {
    quote: "L'aventure montréalaise se poursuit pour nos étudiants : immersion culturelle et découverte de l'écosystème professionnel. Une étape qui permet à nos talents d'élargir leurs horizons dans un environnement multiculturel.",
    name: "ESA — École Supérieure d'Assurances",
    school: "Établissement partenaire",
    dest: "Montréal",
    flag: "🇨🇦",
    kind: "ecole",
  },
];
