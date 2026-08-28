// ──────────────────────────────────────────────────────────────
// Crisp, chat humain, utilisé en SECOURS du widget de qualification.
//
// Principe : le parcours par défaut reste le ChatWidget maison (il qualifie le
// lead et l'envoie dans Notion / Resend). Crisp n'est là que pour le visiteur
// qui veut parler à quelqu'un tout de suite. Son lanceur natif est donc masqué :
// c'est le widget qui décide quand ouvrir la conversation.
//
// Tant que NEXT_PUBLIC_CRISP_WEBSITE_ID est vide, tout ce module est inerte.
// ──────────────────────────────────────────────────────────────

type CrispQueue = unknown[][] & { is?: (question: string) => boolean };
type CrispWindow = Window & { $crisp?: CrispQueue; CRISP_WEBSITE_ID?: string };

export const CRISP_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || "";
export const crispConfigured = Boolean(CRISP_ID);

function crispWindow(): CrispWindow | null {
  return typeof window === "undefined" ? null : (window as CrispWindow);
}

/** Injecte le client Crisp, lanceur natif masqué. Idempotent. */
export function loadCrisp(): void {
  const w = crispWindow();
  if (!w || !CRISP_ID || w.$crisp) return;

  w.$crisp = [] as CrispQueue;
  w.CRISP_WEBSITE_ID = CRISP_ID;
  // Empilé avant le chargement : Crisp rejoue la file au démarrage.
  w.$crisp.push(["do", "chat:hide"]);

  const script = document.createElement("script");
  script.src = "https://client.crisp.chat/l.js";
  script.async = true;
  document.head.appendChild(script);
}

/**
 * Ouvre la conversation humaine, en pré-remplissant ce que le visiteur a déjà
 * saisi dans le widget, pour qu'il n'ait pas à se répéter.
 */
export function openCrisp(prefill?: {
  email?: string;
  nickname?: string;
  message?: string;
}): void {
  const w = crispWindow();
  if (!w?.$crisp) return;

  if (prefill?.email) w.$crisp.push(["set", "user:email", [prefill.email]]);
  if (prefill?.nickname) w.$crisp.push(["set", "user:nickname", [prefill.nickname]]);
  if (prefill?.message) w.$crisp.push(["set", "message:text", [prefill.message]]);

  w.$crisp.push(["do", "chat:show"]);
  w.$crisp.push(["do", "chat:open"]);
}

/**
 * S'abonne à la disponibilité réelle des opérateurs.
 * C'est la seule source honnête pour afficher « En ligne » : sans Crisp, on ne
 * sait pas si quelqu'un est là, et on n'affiche donc pas cette pastille.
 * Retourne une fonction de désabonnement.
 */
export function onCrispAvailability(callback: (available: boolean) => void): () => void {
  const w = crispWindow();
  if (!w || !CRISP_ID) return () => {};

  let cancelled = false;
  const emit = (value: boolean) => {
    if (!cancelled) callback(value);
  };

  // Le client peut mettre un moment à s'initialiser : on interroge dès qu'il
  // expose `is`, puis on suit les changements de disponibilité.
  const poll = window.setInterval(() => {
    const q = w.$crisp;
    if (typeof q?.is !== "function") return;
    window.clearInterval(poll);
    emit(q.is("website:available") === true);
    q.push([
      "on",
      "website:availability:changed",
      (available: boolean) => emit(available === true),
    ]);
  }, 400);

  // Au-delà de 15 s sans client chargé, on abandonne : on restera sur le
  // statut honnête « réponse sous 24 h ouvrées ».
  const giveUp = window.setTimeout(() => window.clearInterval(poll), 15_000);

  return () => {
    cancelled = true;
    window.clearInterval(poll);
    window.clearTimeout(giveUp);
  };
}
