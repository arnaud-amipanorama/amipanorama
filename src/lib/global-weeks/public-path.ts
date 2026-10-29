/** Adresse publique du simulateur simplifié. Sans accès fichier, importable côté navigateur. */
export const PUBLIC_SIMULATOR_PATH = "/global-weeks/simulateur";
export const PUBLIC_SIMULATOR_LABEL = "amipanorama.com/global-weeks/simulateur";
export const PUBLIC_SIMULATOR_URL = `https://${PUBLIC_SIMULATOR_LABEL}`;

/** Simulateur de groupe des référents mobilité. La page demande l'accès tant que le cookie n'est pas valide. */
export const GROUP_SIMULATOR_PATH = "/internal/simulator";
export const GROUP_SIMULATOR_REQUEST_PATH = `${GROUP_SIMULATOR_PATH}?depuis=groupe`;
