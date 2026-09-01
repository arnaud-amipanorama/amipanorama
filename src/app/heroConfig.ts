// ═══════════════════════════════════════════════════════════════════════════
//  CONFIG DU HERO, le SEUL fichier à toucher pour changer l'image d'accueil.
//
//  ▶ POUR CHANGER LA PHOTO : modifier la valeur de HERO_PRESET_ACTIF ci-dessous.
//    C'est tout. Aucun composant à éditer, aucun cadrage à re-régler à la main.
//
//  ▶ POUR AJOUTER UNE NOUVELLE PHOTO :
//    1. Déposer le fichier dans public/Assets/groups/ ou public/Assets/Hero/
//       (nom en minuscules, sans espace, ≤ 2000 px de large, ~85 % de qualité).
//       ⚠️ Vercel/Linux est sensible à la casse : "Hero" ≠ "hero" → 404 en prod.
//    2. Ajouter une entrée dans HERO_PRESETS avec son cadrage.
//    3. Pointer HERO_PRESET_ACTIF dessus.
//
//  ▶ COMMENT RÉGLER LE CADRAGE (champ `focus`) :
//    Le hero affiche l'image dans un panneau haut-droite sur desktop, et en
//    plein cadre sur mobile ; un masque efface le coin bas-gauche (côté texte).
//    `focus` = background-position, donc "50% 62%" signifie « centré
//    horizontalement, cadré assez bas verticalement ». Monter le 2ᵉ chiffre
//    remonte le sujet dans le cadre. Régler desktop et mobile séparément :
//    les deux cadres n'ont pas du tout le même format.
// ═══════════════════════════════════════════════════════════════════════════

export type HeroPreset = {
  src: string;
  /** background-position par contexte, voir explication ci-dessus. */
  focus: { desktop: string; mobile: string };
  /** Note interne : ce que montre la photo, et les réserves éventuelles. */
  note: string;
};

export const HERO_PRESETS = {
  "montreal-sunset": {
    src: "/Assets/groups/montreal-sunset.jpg",
    focus: { desktop: "50% 58%", mobile: "52% 46%" },
    note: "Groupe au belvédère du Mont-Royal, skyline de Montréal au coucher de soleil. Destination historique et principale.",
  },
  "montreal-night": {
    src: "/Assets/groups/montreal-night.jpg",
    focus: { desktop: "50% 55%", mobile: "52% 45%" },
    note: "Groupe au Mont-Royal de nuit, Montréal illuminée. Plus sombre : vérifier le contraste du texte du hero.",
  },
  "seville-garden": {
    src: "/Assets/groups/seville-garden.jpg",
    focus: { desktop: "50% 60%", mobile: "50% 50%" },
    note: "Grand groupe dans les jardins de l'Alcázar. Deuxième pilier européen.",
  },
  "newyork-dumbo": {
    src: "/Assets/groups/newyork-dumbo.jpg",
    focus: { desktop: "50% 62%", mobile: "50% 44%" },
    note: "Groupe à DUMBO, Manhattan Bridge dans l'axe. ⚠️ PROVISOIRE, à remplacer : la tenue d'un participant ne correspond pas à l'image souhaitée pour AMI Panorama.",
  },
  "newyork-students": {
    src: "/Assets/groups/newyork-students.jpg",
    focus: { desktop: "50% 55%", mobile: "50% 45%" },
    note: "Groupe d'étudiants à New York, alternative à DUMBO.",
  },
} satisfies Record<string, HeroPreset>;

// ▶▶ LE SEUL RÉGLAGE À CHANGER ◀◀
export const HERO_PRESET_ACTIF: keyof typeof HERO_PRESETS = "montreal-sunset";

const preset = HERO_PRESETS[HERO_PRESET_ACTIF];
export const HERO_IMAGE = preset.src;
export const HERO_FOCUS = preset.focus;

export type HeroPhoto = { src: string; city: string; flag: string };

// ═══════════════════════════════════════════════════════════════════════════
//  DÉFILÉ DE PHOTOS DU HERO (coverflow infini)
//
//  ÉQUILIBRE ÉDITORIAL VOULU, ne pas modifier sans arbitrage :
//    Montréal 4  → destination historique et principale, reste dominante
//    Séville  3  → deuxième pilier, doit rester clairement visible
//    New York 3  → destination iconique, mise en lumière pour sa force
//                  d'attraction, mais jamais au-dessus des deux piliers
//    Londres/Malte/Rome 2, Berlin/Cape Town 1 → reflètent la diversité de l'offre
//
//  L'ordre d'ouverture (Montréal → Séville → New York) rejoue cette
//  hiérarchie dès les premières cartes visibles.
//  La gallery s'adapte automatiquement au nombre d'entrées.
// ═══════════════════════════════════════════════════════════════════════════
export const HERO_PHOTOS: HeroPhoto[] = [
  { src: "/Assets/groups/montreal-sunset.jpg",  city: "Montréal", flag: "🇨🇦" },
  { src: "/Assets/groups/seville-group.jpg",    city: "Séville",  flag: "🇪🇸" },
  { src: "/Assets/groups/newyork-pano.jpg",     city: "New York", flag: "🇺🇸" },
  { src: "/Assets/groups/montreal-group.jpg",   city: "Montréal", flag: "🇨🇦" },
  { src: "/Assets/groups/london-bridge.jpg",    city: "Londres",  flag: "🇬🇧" },
  { src: "/Assets/groups/seville-boat.jpg",     city: "Séville",  flag: "🇪🇸" },
  { src: "/Assets/groups/newyork-students.jpg", city: "New York", flag: "🇺🇸" },
  { src: "/Assets/groups/montreal-night.jpg",   city: "Montréal", flag: "🇨🇦" },
  { src: "/Assets/groups/malta-main.jpg",       city: "Malte",    flag: "🇲🇹" },
  { src: "/Assets/groups/seville-park.jpg",     city: "Séville",  flag: "🇪🇸" },
  { src: "/Assets/groups/rome-square.jpg",      city: "Rome",     flag: "🇮🇹" },
  { src: "/Assets/groups/montreal-sign.jpg",    city: "Montréal", flag: "🇨🇦" },
  { src: "/Assets/groups/newyork-bridge.jpg",   city: "New York", flag: "🇺🇸" },
  { src: "/Assets/groups/london-museum.jpg",    city: "Londres",  flag: "🇬🇧" },
  { src: "/Assets/groups/berlin-main.jpg",      city: "Berlin",   flag: "🇩🇪" },
  { src: "/Assets/groups/malta-group.jpg",      city: "Malte",    flag: "🇲🇹" },
  { src: "/Assets/groups/rome-group.jpg",       city: "Rome",     flag: "🇮🇹" },
  { src: "/Assets/destinations/cape-town/bo-kaap.jpg", city: "Cape Town", flag: "🇿🇦" },
];
