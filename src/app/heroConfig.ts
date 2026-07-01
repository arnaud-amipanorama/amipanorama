// ─────────────────────────────────────────────────────────────
//  CONFIG DU HERO — point unique de réglage
//  Pour changer l'image de fond : remplace HERO_IMAGE par le
//  chemin de ton fichier dans public/Assets/Hero/.
//  ⚠️ Casse exacte : dossier "Hero" (H majuscule), nom en
//     minuscules sans espace, ex: /Assets/Hero/mon-image.jpg
//     (Vercel/Linux est sensible à la casse → sinon 404.)
// ─────────────────────────────────────────────────────────────
export const HERO_IMAGE = "/Assets/Hero/sevilla-hero-v2.jpg";

export type HeroPhoto = { src: string; city: string; flag: string };

// Cartes de la gallery (coverflow infini).
// Pour enrichir : ajoute simplement des entrées ici.
// Convention recommandée pour les nouvelles photos :
//   public/Assets/groups/<ville>-<n>.jpg  (minuscules, sans espace, ≤1600px, ~85% qualité)
// La gallery s'adapte automatiquement au nombre d'entrées.
// Note : les fichiers ci-dessous (hors montreal-sunset/night/sign,
// newyork-bridge/dumbo, seville-park/diplomas déjà présents) sont générés par
// scripts/optimize-photos.sh — lancer ce script AVANT de déployer.
export const HERO_PHOTOS: HeroPhoto[] = [
  { src: "/Assets/groups/montreal-sunset.jpg",  city: "Montréal", flag: "🇨🇦" },
  { src: "/Assets/groups/london-bridge.jpg",    city: "Londres",  flag: "🇬🇧" },
  { src: "/Assets/groups/seville-garden.jpg",   city: "Séville",  flag: "🇪🇸" },
  { src: "/Assets/groups/newyork-dumbo.jpg",    city: "New York", flag: "🇺🇸" },
  { src: "/Assets/groups/malta-main.jpg",       city: "Malte",    flag: "🇲🇹" },
  { src: "/Assets/groups/rome-square.jpg",      city: "Rome",     flag: "🇮🇹" },
  { src: "/Assets/groups/montreal-group.jpg",   city: "Montréal", flag: "🇨🇦" },
  { src: "/Assets/groups/london-museum.jpg",    city: "Londres",  flag: "🇬🇧" },
  { src: "/Assets/groups/berlin-main.jpg",      city: "Berlin",   flag: "🇩🇪" },
  { src: "/Assets/groups/seville-boat.jpg",     city: "Séville",  flag: "🇪🇸" },
  { src: "/Assets/groups/newyork-group.jpg",    city: "New York", flag: "🇺🇸" },
  { src: "/Assets/groups/malta-group.jpg",      city: "Malte",    flag: "🇲🇹" },
  { src: "/Assets/groups/montreal-night.jpg",   city: "Montréal", flag: "🇨🇦" },
  { src: "/Assets/groups/rome-group.jpg",       city: "Rome",     flag: "🇮🇹" },
  { src: "/Assets/groups/seville-park.jpg",     city: "Séville",  flag: "🇪🇸" },
  { src: "/Assets/groups/newyork-bridge.jpg",   city: "New York", flag: "🇺🇸" },
];
