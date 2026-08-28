"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
  CSSProperties,
} from "react";
import { crispConfigured, onCrispAvailability, openCrisp } from "@/lib/crisp";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  from: "bot" | "user";
  text: string;
}

interface LeadData {
  profile: string;
  etablissement: string;
  besoin: string;
  destination: string;
  taille: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  rgpd: boolean;
}

type StepId =
  | "profile"
  | "etablissement"
  | "besoin"
  | "destination"
  | "taille"
  | "coordonnees"
  | "confirmation";

// ─── Configuration des étapes ─────────────────────────────────────────────────

const STEPS: StepId[] = [
  "profile",
  "etablissement",
  "besoin",
  "destination",
  "taille",
  "coordonnees",
  "confirmation",
];

const QUESTIONS: Record<StepId, string> = {
  profile:
    "Bonjour 👋\n\nJe suis là pour vous aider à préparer votre projet de mobilité internationale avec AMI Panorama.\n\nQui êtes-vous ?",
  etablissement: "Quel est le nom de votre établissement ou organisation ?",
  besoin: "Quel est votre besoin principal ?",
  destination: "Quelle destination vous intéresse ?",
  taille: "Quelle est la taille de votre groupe ?",
  coordonnees:
    "Parfait. Pour vous recontacter avec la proposition la plus adaptée à votre contexte, comment vous joindre ?",
  confirmation: "",
};

const OPTIONS: Partial<Record<StepId, string[]>> = {
  profile: [
    "École / CFA / Organisme de formation",
    "Référent mobilité · Responsable pédagogique · Direction",
    "Étudiant · Alternant",
    "Intervenant / Entreprise / Partenaire",
    "Autre",
  ],
  besoin: [
    "Organiser une mobilité pour mes étudiants",
    "En savoir plus sur les destinations",
    "Obtenir un devis ou une proposition",
    "Proposer une collaboration professionnelle",
    "Témoigner ou partager une expérience",
    "Autre demande",
  ],
  // Ordre aligné sur la hiérarchie du site : Montréal et New York d'abord.
  destination: [
    "🇨🇦  Montréal",
    "🇺🇸  New York",
    "🇪🇸  Séville",
    "🇬🇧  Londres",
    "🇲🇹  Malte",
    "🇲🇦  Maroc",
    "Plusieurs destinations",
    "Je ne sais pas encore",
  ],
  taille: [
    "Moins de 10",
    "10 à 20",
    "20 à 40",
    "40 à 80",
    "Plus de 80",
    "Je ne sais pas encore",
  ],
};

// Étapes avec options (choix boutons), sauf etablissement (texte libre) et coordonnees (form)
const CHOICE_STEPS: StepId[] = ["profile", "besoin", "destination", "taille"];

// Mapping step → champ lead
const STEP_TO_FIELD: Partial<Record<StepId, keyof LeadData>> = {
  profile: "profile",
  etablissement: "etablissement",
  besoin: "besoin",
  destination: "destination",
  taille: "taille",
};

// ─── Persistance ──────────────────────────────────────────────────────────────
// On sauvegarde la CONVERSATION et les réponses de qualification, pour qu'un
// visiteur qui ferme le panneau ne reparte pas de zéro. On ne stocke jamais les
// coordonnées personnelles (nom, email, téléphone) : elles sont saisies en une
// fois à la dernière étape et n'ont pas à survivre à la fermeture.
const STORE_KEY = "ami-chat-v1";

type StoredState = {
  stepIndex: number;
  messages: Message[];
  lead: Pick<LeadData, "profile" | "etablissement" | "besoin" | "destination" | "taille">;
};

function readStored(): StoredState | null {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (!Array.isArray(parsed.messages) || typeof parsed.stepIndex !== "number") return null;
    // Une conversation terminée ne se restaure pas : on repart proprement.
    if (parsed.stepIndex >= STEPS.indexOf("confirmation")) return null;
    return parsed;
  } catch {
    return null;
  }
}

// ─── Composant ────────────────────────────────────────────────────────────────

const EMPTY_LEAD: LeadData = {
  profile: "",
  etablissement: "",
  besoin: "",
  destination: "",
  taille: "",
  prenom: "",
  nom: "",
  email: "",
  telephone: "",
  message: "",
  rgpd: false,
};

/** Durée de « frappe » du bot, proportionnelle à la longueur du message. */
function typingDelay(text: string): number {
  return Math.min(1100, Math.max(450, text.length * 9));
}

export default function ChatWidget() {
  // Conversation éventuellement laissée en cours dans cet onglet. Lue une seule
  // fois, à l'initialisation : le panneau est fermé au premier rendu (serveur
  // comme client), donc rien de ce qui en découle n'est affiché à l'hydratation.
  const [restored] = useState<StoredState | null>(() =>
    typeof window === "undefined" ? null : readStored()
  );

  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(Boolean(restored));
  const [stepIndex, setStepIndex] = useState(restored?.stepIndex ?? 0);
  const [messages, setMessages] = useState<Message[]>(restored?.messages ?? []);
  const [typing, setTyping] = useState(false);
  const [lead, setLead] = useState<LeadData>(
    restored ? { ...EMPTY_LEAD, ...restored.lead } : EMPTY_LEAD
  );
  const [textInput, setTextInput] = useState(
    restored && STEPS[restored.stepIndex] === "etablissement"
      ? restored.lead.etablissement
      : ""
  );
  const [coords, setCoords] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    message: "",
    rgpd: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Disponibilité réelle d'un opérateur Crisp. `null` = inconnue : on n'annonce
  // alors jamais « en ligne », on affiche un délai de réponse honnête.
  const [agentAvailable, setAgentAvailable] = useState<boolean | null>(null);

  const threadRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const typingTimer = useRef<number | null>(null);

  const currentStep = STEPS[stepIndex];

  // ── Sauvegarde ──
  useEffect(() => {
    if (!hasOpened) return;
    const payload: StoredState = {
      stepIndex,
      messages,
      lead: {
        profile: lead.profile,
        etablissement: lead.etablissement,
        besoin: lead.besoin,
        destination: lead.destination,
        taille: lead.taille,
      },
    };
    try {
      if (stepIndex >= STEPS.indexOf("confirmation")) sessionStorage.removeItem(STORE_KEY);
      else sessionStorage.setItem(STORE_KEY, JSON.stringify(payload));
    } catch {
      /* quota plein ou stockage bloqué : la persistance est un confort, pas un prérequis */
    }
  }, [hasOpened, stepIndex, messages, lead]);

  // ── Disponibilité opérateur (uniquement si Crisp est branché) ──
  useEffect(() => {
    if (!crispConfigured) return;
    return onCrispAvailability(setAgentAvailable);
  }, []);

  // ── Nettoyage du minuteur de frappe ──
  useEffect(() => () => {
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
  }, []);

  // Scroll thread to bottom on new message
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, typing, isOpen]);

  // Focus text input when on etablissement step
  useEffect(() => {
    if (currentStep === "etablissement" && isOpen && !typing) {
      const t = window.setTimeout(() => textRef.current?.focus(), 80);
      return () => window.clearTimeout(t);
    }
  }, [currentStep, isOpen, typing]);

  const closeWidget = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus();
  }, []);

  // ── Échap ferme le panneau, Tab reste piégé à l'intérieur ──
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeWidget();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeWidget]);

  // ── Focus dans le panneau à l'ouverture ──
  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => panelRef.current?.focus(), 60);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  /** Pousse un message du bot après un court délai de « frappe ». */
  function botReply(text: string) {
    setTyping(true);
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text }]);
      setTyping(false);
      typingTimer.current = null;
    }, typingDelay(text));
  }

  function openWidget() {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      setMessages([{ from: "bot", text: QUESTIONS.profile }]);
    }
  }

  // Avancer d'une étape après un choix ou une saisie
  function advance(value: string, field: keyof LeadData) {
    setLead((l) => ({ ...l, [field]: value }));

    const nextIndex = stepIndex + 1;
    const nextStep = STEPS[nextIndex];

    setMessages((m) => [...m, { from: "user", text: value }]);
    setStepIndex(nextIndex);
    setTextInput("");

    if (nextStep && nextStep !== "confirmation") botReply(QUESTIONS[nextStep]);
  }

  function handleChoice(option: string) {
    const field = STEP_TO_FIELD[currentStep];
    if (field) advance(option, field);
  }

  function handleTextSubmit() {
    const val = textInput.trim();
    if (!val) return;
    advance(val, "etablissement");
  }

  function handleBack() {
    if (stepIndex <= 0) return;

    // Une réponse du bot peut être encore « en cours de frappe » : on l'annule.
    if (typingTimer.current) {
      window.clearTimeout(typingTimer.current);
      typingTimer.current = null;
    }
    setTyping(false);

    const prevIndex = stepIndex - 1;
    const prevStep = STEPS[prevIndex];

    // On retire la dernière question du bot (si elle a déjà été postée) puis la
    // réponse de l'utilisateur, sans jamais supposer que les deux existent.
    setMessages((prev) => {
      const next = [...prev];
      if (next.length && next[next.length - 1].from === "bot") next.pop();
      if (next.length && next[next.length - 1].from === "user") next.pop();
      return next;
    });
    setStepIndex(prevIndex);

    // Restaurer la valeur précédente si on revient à etablissement
    if (prevStep === "etablissement") {
      setTextInput(lead.etablissement);
    }
  }

  /** Passe la main à un humain (Crisp), en emportant le contexte déjà collecté. */
  function handleTalkToHuman() {
    const resume = [
      lead.profile && `Profil : ${lead.profile}`,
      lead.etablissement && `Établissement : ${lead.etablissement}`,
      lead.besoin && `Besoin : ${lead.besoin}`,
      lead.destination && `Destination : ${lead.destination}`,
      lead.taille && `Groupe : ${lead.taille}`,
    ]
      .filter(Boolean)
      .join("\n");

    openCrisp({
      email: coords.email || undefined,
      nickname: [coords.prenom, coords.nom].filter(Boolean).join(" ") || undefined,
      message: resume ? `${resume}\n\n` : undefined,
    });
    setIsOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!coords.prenom || !coords.nom || !coords.email) return;
    if (!coords.rgpd) {
      setSubmitError("Veuillez accepter la politique de confidentialité pour continuer.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const payload = {
      ...lead,
      prenom: coords.prenom,
      nom: coords.nom,
      email: coords.email,
      telephone: coords.telephone,
      message: coords.message,
      rgpd: coords.rgpd,
      page: window.location.pathname,
      date: new Date().toISOString(),
      source: "chat site web",
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setStepIndex(STEPS.indexOf("confirmation"));
    } catch {
      setSubmitError(
        "Une erreur est survenue. Veuillez réessayer ou nous écrire à info@amipanorama.com."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const progressSteps = STEPS.filter((s) => s !== "confirmation");
  // Statut : « en ligne » n'est affiché que si Crisp confirme qu'un opérateur
  // est réellement joignable. Sinon on annonce un délai, pas une présence.
  const online = agentAvailable === true;

  return (
    <>
      {/* ── Bulle flottante ─────────────────────────────────────── */}
      <button
        ref={launcherRef}
        onClick={() => (isOpen ? closeWidget() : openWidget())}
        aria-label="Parler de mon projet de mobilité"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="ami-chat-launcher"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow =
            "0 8px 32px rgba(11,24,41,0.35), 0 2px 8px rgba(11,24,41,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 4px 24px rgba(11,24,41,0.30), 0 1px 6px rgba(11,24,41,0.15)";
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <path
            d="M3 3h16a1 1 0 011 1v10a1 1 0 01-1 1H7l-4 4V4a1 1 0 011-1z"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        {!isOpen && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--coral)",
              border: "2px solid #fff",
            }}
          />
        )}
      </button>

      {/* ── Panneau chat ────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Préparer mon projet de mobilité avec AMI Panorama"
          tabIndex={-1}
          className="ami-chat-panel"
        >
          {/* En-tête */}
          <div
            style={{
              background: "var(--navy)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                aria-hidden="true"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                }}
              >
                🌍
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  AMI Panorama
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.45)",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {online && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#4ade80",
                        display: "inline-block",
                      }}
                    />
                  )}
                  {online
                    ? "Un conseiller est en ligne"
                    : "Réponse sous 24 h ouvrées"}
                </div>
              </div>
            </div>
            <button
              onClick={closeWidget}
              aria-label="Fermer le chat"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 6,
                color: "rgba(255,255,255,0.45)",
                display: "flex",
                alignItems: "center",
                borderRadius: 8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2 2l10 10M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Fil de conversation */}
          <div
            ref={threadRef}
            aria-live="polite"
            aria-atomic="false"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "18px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minHeight: 0,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.from === "bot" ? "flex-start" : "flex-end",
                }}
              >
                <div
                  style={{
                    maxWidth: "88%",
                    background:
                      msg.from === "bot" ? "var(--bg-2)" : "var(--navy)",
                    color:
                      msg.from === "bot" ? "var(--text-secondary)" : "#fff",
                    padding: "10px 14px",
                    borderRadius:
                      msg.from === "bot"
                        ? "4px 14px 14px 14px"
                        : "14px 4px 14px 14px",
                    fontSize: 13,
                    lineHeight: 1.7,
                    whiteSpace: "pre-line",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  className="ami-typing"
                  aria-label="AMI Panorama est en train d'écrire"
                  style={{
                    background: "var(--bg-2)",
                    padding: "12px 14px",
                    borderRadius: "4px 14px 14px 14px",
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  <span /> <span /> <span />
                </div>
              </div>
            )}
          </div>

          {/* Zone de saisie / étape courante */}
          <div
            style={{
              padding: "10px 14px 14px",
              flexShrink: 0,
              borderTop: "1px solid var(--border)",
              background: "var(--bg-1)",
            }}
          >
            {/* Barre de progression */}
            {currentStep !== "confirmation" && (
              <div
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={progressSteps.length}
                aria-valuenow={Math.min(stepIndex + 1, progressSteps.length)}
                aria-label="Progression"
                style={{
                  display: "flex",
                  gap: 3,
                  marginBottom: 10,
                }}
              >
                {progressSteps.map((s, i) => (
                  <div
                    key={s}
                    style={{
                      height: 3,
                      borderRadius: 2,
                      flex: 1,
                      background:
                        i < stepIndex
                          ? "var(--blue)"
                          : i === stepIndex
                          ? "rgba(30,82,208,0.35)"
                          : "var(--border)",
                      transition: "background 0.3s",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pendant que le bot « écrit », on n'affiche pas encore les réponses
                possibles : sinon l'utilisateur répond à une question non posée. */}
            {typing ? null : (
              <>
                {/* Boutons de choix */}
                {CHOICE_STEPS.includes(currentStep) && OPTIONS[currentStep] && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {OPTIONS[currentStep]!.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleChoice(option)}
                        style={choiceBtn}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--navy)";
                          e.currentTarget.style.color = "#fff";
                          e.currentTarget.style.borderColor = "var(--navy)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--bg)";
                          e.currentTarget.style.color = "var(--text-primary)";
                          e.currentTarget.style.borderColor = "var(--border)";
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Champ texte libre, établissement */}
                {currentStep === "etablissement" && (
                  <div style={{ display: "flex", gap: 7 }}>
                    <input
                      ref={textRef}
                      type="text"
                      aria-label="Nom de votre établissement ou organisation"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                      placeholder="Ex : ECEMA, CFA Normandie, Financia…"
                      style={{ ...inputBase, flex: 1 }}
                    />
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim()}
                      style={{
                        background: textInput.trim()
                          ? "var(--navy)"
                          : "var(--border)",
                        border: "none",
                        borderRadius: 10,
                        padding: "0 14px",
                        cursor: textInput.trim() ? "pointer" : "default",
                        color: "#fff",
                        fontSize: 16,
                        transition: "background 0.15s",
                        flexShrink: 0,
                      }}
                      aria-label="Envoyer"
                    >
                      →
                    </button>
                  </div>
                )}

                {/* Formulaire coordonnées */}
                {currentStep === "coordonnees" && (
                  <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: 7 }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 7,
                      }}
                    >
                      <input
                        type="text"
                        aria-label="Prénom"
                        placeholder="Prénom *"
                        autoComplete="given-name"
                        value={coords.prenom}
                        onChange={(e) =>
                          setCoords((c) => ({ ...c, prenom: e.target.value }))
                        }
                        required
                        style={inputBase}
                      />
                      <input
                        type="text"
                        aria-label="Nom"
                        placeholder="Nom *"
                        autoComplete="family-name"
                        value={coords.nom}
                        onChange={(e) =>
                          setCoords((c) => ({ ...c, nom: e.target.value }))
                        }
                        required
                        style={inputBase}
                      />
                    </div>
                    <input
                      type="email"
                      aria-label="Email professionnel"
                      placeholder="Email professionnel *"
                      autoComplete="email"
                      value={coords.email}
                      onChange={(e) =>
                        setCoords((c) => ({ ...c, email: e.target.value }))
                      }
                      required
                      style={inputBase}
                    />
                    <input
                      type="tel"
                      aria-label="Téléphone (facultatif)"
                      placeholder="Téléphone (facultatif)"
                      autoComplete="tel"
                      value={coords.telephone}
                      onChange={(e) =>
                        setCoords((c) => ({ ...c, telephone: e.target.value }))
                      }
                      style={inputBase}
                    />
                    <textarea
                      aria-label="Message ou précisions (facultatif)"
                      placeholder="Message ou précisions (facultatif)"
                      value={coords.message}
                      onChange={(e) =>
                        setCoords((c) => ({ ...c, message: e.target.value }))
                      }
                      rows={2}
                      style={{ ...inputBase, resize: "none" }}
                    />
                    <label
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={coords.rgpd}
                        onChange={(e) =>
                          setCoords((c) => ({ ...c, rgpd: e.target.checked }))
                        }
                        style={{ marginTop: 2, flexShrink: 0, accentColor: "var(--blue)" }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-secondary)",
                          lineHeight: 1.55,
                        }}
                      >
                        J&apos;accepte qu&apos;AMI Panorama me recontacte au sujet de ma
                        demande, conformément à sa{" "}
                        <a
                          href="/politique-de-confidentialite"
                          target="_blank"
                          style={{ color: "var(--blue)", textDecoration: "none" }}
                        >
                          politique de confidentialité
                        </a>
                        .
                      </span>
                    </label>
                    {submitError && (
                      <p
                        role="alert"
                        style={{
                          fontSize: 11,
                          color: "var(--coral)",
                          margin: 0,
                          lineHeight: 1.5,
                        }}
                      >
                        {submitError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting || !coords.rgpd}
                      style={{
                        background: "var(--navy)",
                        border: "none",
                        borderRadius: 10,
                        padding: "11px 0",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#fff",
                        cursor:
                          submitting || !coords.rgpd ? "not-allowed" : "pointer",
                        opacity: submitting || !coords.rgpd ? 0.5 : 1,
                        fontFamily: "inherit",
                        transition: "opacity 0.2s",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {submitting ? "Envoi en cours…" : "Envoyer ma demande →"}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Confirmation */}
            {currentStep === "confirmation" && (
              <div
                style={{
                  textAlign: "center",
                  padding: "12px 8px 8px",
                }}
              >
                <div aria-hidden="true" style={{ fontSize: 28, marginBottom: 10 }}>
                  ✅
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                    margin: "0 0 16px",
                  }}
                >
                  Merci, votre demande a bien été transmise à l&apos;équipe AMI
                  Panorama. Vous allez recevoir un email de confirmation, et nous
                  reviendrons vers vous rapidement.
                </p>
                <button
                  onClick={closeWidget}
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "9px 22px",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Fermer
                </button>
              </div>
            )}

            {/* Pied : retour + passage à un humain */}
            {currentStep !== "confirmation" && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                {stepIndex > 0 ? (
                  <button onClick={handleBack} style={subtleBtn}>
                    ← Revenir
                  </button>
                ) : (
                  <span />
                )}
                {crispConfigured && (
                  <button
                    onClick={handleTalkToHuman}
                    style={{ ...subtleBtn, color: "var(--blue)", fontWeight: 600 }}
                  >
                    {online ? "Parler à un conseiller →" : "Laisser un message →"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .ami-chat-launcher {
          position: fixed;
          right: 28px;
          bottom: calc(28px + env(safe-area-inset-bottom, 0px));
          z-index: 9000;
          width: 56px; height: 56px;
          border-radius: 50%;
          background: var(--navy);
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 24px rgba(11,24,41,0.30), 0 1px 6px rgba(11,24,41,0.15);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .ami-chat-panel {
          position: fixed;
          right: 28px;
          bottom: calc(96px + env(safe-area-inset-bottom, 0px));
          z-index: 9001;
          width: min(400px, calc(100vw - 32px));
          max-height: min(620px, calc(100dvh - 140px));
          display: flex; flex-direction: column;
          background: var(--bg-1);
          border: 1px solid var(--border);
          border-radius: 20px;
          box-shadow: 0 12px 60px rgba(11,24,41,0.22), 0 2px 12px rgba(11,24,41,0.10);
          overflow: hidden;
          outline: none;
          animation: chatSlideIn 0.22s ease;
        }
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        /* Indicateur de frappe */
        .ami-typing > span {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--text-muted); display: inline-block;
          animation: amiTyping 1.1s ease-in-out infinite;
        }
        .ami-typing > span:nth-child(2) { animation-delay: 0.18s; }
        .ami-typing > span:nth-child(3) { animation-delay: 0.36s; }
        @keyframes amiTyping {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30%           { opacity: 1;   transform: translateY(-3px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ami-chat-panel { animation: none; }
          .ami-typing > span { animation: none; opacity: 0.55; }
        }
        /* Sur petit écran, le panneau prend toute la largeur disponible et
           laisse la bulle accessible sous lui. */
        @media (max-width: 480px) {
          .ami-chat-launcher { right: 18px; bottom: calc(18px + env(safe-area-inset-bottom, 0px)); }
          .ami-chat-panel {
            right: 12px; left: 12px;
            width: auto;
            bottom: calc(84px + env(safe-area-inset-bottom, 0px));
            max-height: calc(100dvh - 120px);
          }
        }
      `}</style>
    </>
  );
}

// ─── Styles réutilisables ─────────────────────────────────────────────────────

const choiceBtn: CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "9px 13px",
  fontSize: 12.5,
  color: "var(--text-primary)",
  cursor: "pointer",
  textAlign: "left",
  transition: "background 0.14s, color 0.14s, border-color 0.14s",
  fontFamily: "inherit",
  lineHeight: 1.4,
};

const subtleBtn: CSSProperties = {
  background: "none",
  border: "none",
  padding: "2px 0",
  fontSize: 11,
  color: "var(--text-secondary)",
  cursor: "pointer",
  fontFamily: "inherit",
  textAlign: "left",
  letterSpacing: "0.01em",
};

const inputBase: CSSProperties = {
  padding: "9px 12px",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 12.5,
  fontFamily: "inherit",
  background: "var(--bg)",
  color: "var(--text-primary)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
