"use client";

import { useState, useRef, useEffect, FormEvent, CSSProperties } from "react";

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
    "Parfait. Pour vous recontacter avec la proposition la plus adaptée à votre contexte — comment vous joindre ?",
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
  destination: [
    "🇨🇦  Montréal",
    "🇪🇸  Séville",
    "🇺🇸  New York",
    "🇬🇧  Londres",
    "🇲🇦  Maroc",
    "🇯🇵  Japon",
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

// Étapes avec options (choix boutons) — sauf etablissement (texte libre) et coordonnees (form)
const CHOICE_STEPS: StepId[] = ["profile", "besoin", "destination", "taille"];

// Mapping step → champ lead
const STEP_TO_FIELD: Partial<Record<StepId, keyof LeadData>> = {
  profile: "profile",
  etablissement: "etablissement",
  besoin: "besoin",
  destination: "destination",
  taille: "taille",
};

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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lead, setLead] = useState<LeadData>(EMPTY_LEAD);
  const [textInput, setTextInput] = useState("");
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

  const threadRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLInputElement>(null);

  const currentStep = STEPS[stepIndex];

  // Scroll thread to bottom on new message
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Focus text input when on etablissement step
  useEffect(() => {
    if (currentStep === "etablissement" && isOpen) {
      setTimeout(() => textRef.current?.focus(), 80);
    }
  }, [currentStep, isOpen]);

  function openWidget() {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      setMessages([{ from: "bot", text: QUESTIONS.profile }]);
    }
  }

  // Avancer d'une étape après un choix ou une saisie
  function advance(value: string, field: keyof LeadData) {
    const newLead = { ...lead, [field]: value };
    setLead(newLead);

    const nextIndex = stepIndex + 1;
    const nextStep = STEPS[nextIndex];

    const newMessages: Message[] = [
      ...messages,
      { from: "user", text: value },
      ...(nextStep && nextStep !== "confirmation"
        ? [{ from: "bot" as const, text: QUESTIONS[nextStep] }]
        : []),
    ];

    setMessages(newMessages);
    setStepIndex(nextIndex);
    setTextInput("");
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
    const prevIndex = stepIndex - 1;
    const prevStep = STEPS[prevIndex];

    // Retirer les 2 derniers messages (réponse user + question bot actuelle)
    setMessages((prev) => prev.slice(0, prev.length - 2));
    setStepIndex(prevIndex);

    // Restaurer la valeur précédente si on revient à etablissement
    if (prevStep === "etablissement") {
      setTextInput(lead.etablissement);
    }
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

  return (
    <>
      {/* ── Bulle flottante ─────────────────────────────────────── */}
      <button
        onClick={openWidget}
        aria-label="Parler de mon projet de mobilité"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9000,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--navy)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            "0 4px 24px rgba(11,24,41,0.30), 0 1px 6px rgba(11,24,41,0.15)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
        }}
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
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M3 3h16a1 1 0 011 1v10a1 1 0 01-1 1H7l-4 4V4a1 1 0 011-1z"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        {!isOpen && (
          <span
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
          style={{
            position: "fixed",
            bottom: 96,
            right: 28,
            zIndex: 9001,
            width: "min(400px, calc(100vw - 32px))",
            maxHeight: "min(620px, calc(100vh - 120px))",
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-1)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            boxShadow:
              "0 12px 60px rgba(11,24,41,0.22), 0 2px 12px rgba(11,24,41,0.10)",
            overflow: "hidden",
            animation: "chatSlideIn 0.22s ease",
          }}
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
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#4ade80",
                      display: "inline-block",
                    }}
                  />
                  En ligne · Répond rapidement
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
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
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

            {/* Champ texte libre — établissement */}
            {currentStep === "etablissement" && (
              <div style={{ display: "flex", gap: 7 }}>
                <input
                  ref={textRef}
                  type="text"
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
                    placeholder="Prénom *"
                    value={coords.prenom}
                    onChange={(e) =>
                      setCoords((c) => ({ ...c, prenom: e.target.value }))
                    }
                    required
                    style={inputBase}
                  />
                  <input
                    type="text"
                    placeholder="Nom *"
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
                  placeholder="Email professionnel *"
                  value={coords.email}
                  onChange={(e) =>
                    setCoords((c) => ({ ...c, email: e.target.value }))
                  }
                  required
                  style={inputBase}
                />
                <input
                  type="tel"
                  placeholder="Téléphone (facultatif)"
                  value={coords.telephone}
                  onChange={(e) =>
                    setCoords((c) => ({ ...c, telephone: e.target.value }))
                  }
                  style={inputBase}
                />
                <textarea
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
                      color: "var(--text-muted)",
                      lineHeight: 1.55,
                    }}
                  >
                    J'accepte qu'AMI Panorama me recontacte au sujet de ma
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

            {/* Confirmation */}
            {currentStep === "confirmation" && (
              <div
                style={{
                  textAlign: "center",
                  padding: "12px 8px 8px",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 10 }}>✅</div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                    margin: "0 0 16px",
                  }}
                >
                  Merci, votre demande a bien été transmise à l'équipe AMI
                  Panorama. Nous reviendrons vers vous rapidement avec les
                  informations les plus pertinentes selon votre profil.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "9px 22px",
                    fontSize: 12,
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Fermer
                </button>
              </div>
            )}

            {/* Bouton retour */}
            {stepIndex > 0 && currentStep !== "confirmation" && (
              <button
                onClick={handleBack}
                style={{
                  marginTop: 8,
                  background: "none",
                  border: "none",
                  padding: "2px 0",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  letterSpacing: "0.01em",
                }}
              >
                ← Revenir
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @media (max-width: 480px) {
          /* Sur mobile, le panneau s'étend sur toute la largeur */
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
