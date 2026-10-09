"use client";

import { useEffect, useRef, useState } from "react";
import type { GuidedOutcome } from "@/lib/simulator/guided";
import type { SimulationData } from "../SimulationDocument";
import { invalidContactFields, type ContactField, type GuidedContact } from "./contact";
import { TextField, eur, plural } from "./guided-ui";
import { buildGuidedPdfData } from "./pdf-data";
import styles from "./guided.module.css";

const FIELD_LABELS: Record<ContactField, string> = {
  etablissement: "l’établissement",
  prenom: "le prénom",
  nom: "le nom",
  email: "un e-mail professionnel valide",
  dateSouhaitee: "la date de départ souhaitée",
};

/** Sauvegarde existante des simulations (trace serveur, webhook, historique d'accès). */
async function saveSimulation(data: SimulationData, extra: Record<string, unknown>): Promise<boolean> {
  try {
    const response = await fetch("/api/simulation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "simulateur financement · parcours guidé", ...data, ...extra, date: new Date().toISOString() }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function verificationMessage(outcome: GuidedOutcome, contact: GuidedContact): string {
  const lines = [
    "Demande de vérification d’une simulation guidée.",
    `Destination : ${outcome.destination.label}${outcome.destination.known ? "" : " (non choisie)"}`,
    `Durée : ${outcome.days} jours${outcome.durationAssumed ? " (supposée)" : ""}`,
    `Groupe : ${plural(outcome.participants, "participant", "participants")}, ${plural(outcome.companions, "accompagnateur", "accompagnateurs")}`,
    `OPCO : ${outcome.opcoCards.map((card) => `${card.label} × ${card.count}`).join(", ")}`,
    `Reste à payer estimé : ${eur(outcome.result.racAvg)} par participant (${outcome.confidence.label.toLowerCase()})`,
    `Départ souhaité : ${contact.dateSouhaitee}`,
  ];
  if (contact.commentaire.trim()) lines.push("", contact.commentaire.trim());
  return lines.join("\n");
}

export default function GuidedVerifyForm({ outcome, contact, onContact }: { outcome: GuidedOutcome; contact: GuidedContact; onContact: (contact: GuidedContact) => void }) {
  const [attempted, setAttempted] = useState(false);
  const [rgpd, setRgpd] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [verify, setVerify] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [pdf, setPdf] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [consent, setConsent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const pdfButtonRef = useRef<HTMLButtonElement>(null);

  const invalid = invalidContactFields(contact);
  const bad = (field: ContactField) => attempted && invalid.includes(field);
  const set = (patch: Partial<GuidedContact>) => onContact({ ...contact, ...patch });

  useEffect(() => {
    if (!consentOpen) return;
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setConsentOpen(false); };
    window.addEventListener("keydown", onKey);
    const opener = pdfButtonRef.current;
    return () => { window.removeEventListener("keydown", onKey); opener?.focus(); };
  }, [consentOpen]);

  function checkContact(): boolean {
    setAttempted(true);
    if (invalid.length === 0) { setError(null); return true; }
    setError(`Merci de renseigner ${invalid.map((field) => FIELD_LABELS[field]).join(", ")}.`);
    return false;
  }

  async function requestVerification(event: React.FormEvent) {
    event.preventDefault();
    if (!checkContact()) return;
    if (!rgpd) { setError("Merci de cocher la case de consentement pour que nous puissions vous recontacter."); return; }
    setVerify("sending");
    const data = buildGuidedPdfData(outcome, contact);
    const savedPromise = saveSimulation(data, { verificationRequested: true, telephone: contact.telephone.trim(), commentaire: contact.commentaire.trim() });
    try {
      // Même canal que le formulaire de contact du site : aucun envoi nouveau.
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: contact.prenom,
          nom: contact.nom,
          email: contact.email,
          telephone: contact.telephone,
          etablissement: contact.etablissement,
          objet: "Vérification d’une simulation de financement",
          destination: outcome.destination.label,
          tailleGroupe: String(outcome.participants),
          message: verificationMessage(outcome, contact),
          rgpd: true,
          company: honeypot,
          page: window.location.pathname,
          date: new Date().toISOString(),
          source: "simulateur guidé",
        }),
      });
      await savedPromise;
      if (!response.ok) throw new Error("lead");
      setVerify("sent");
    } catch {
      setVerify("error");
    }
  }

  async function downloadPdf() {
    setConsentOpen(false);
    setPdf("loading");
    const data = buildGuidedPdfData(outcome, contact);
    void saveSimulation(data, {});
    try {
      const [{ pdf: render }, mod] = await Promise.all([import("@react-pdf/renderer"), import("../SimulationDocument")]);
      const blob = await render(<mod.SimulationDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `AMI-Panorama-Simulation-${(contact.etablissement.trim() || "etablissement").replace(/\s+/g, "-")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setPdf("idle");
    } catch (pdfError) {
      console.error(pdfError);
      setPdf("error");
    }
  }

  return (
    <>
      <form className={`${styles.card} ${styles.cta}`} onSubmit={requestVerification} noValidate>
        <h2 className={styles.sectionTitle}>Faire vérifier cette simulation par AMI Panorama</h2>
        <p className={styles.sectionLead} style={{ marginBottom: 6 }}>Notre équipe relit vos réponses, confirme les prix du séjour et vous indique les démarches à engager auprès des OPCO. C’est gratuit et sans engagement.</p>

        <div className={styles.formGrid}>
          <TextField required label="Établissement" value={contact.etablissement} onChange={(v) => set({ etablissement: v })} invalid={bad("etablissement")} autoComplete="organization" />
          <TextField required label="Date de départ souhaitée" value={contact.dateSouhaitee} onChange={(v) => set({ dateSouhaitee: v })} invalid={bad("dateSouhaitee")} hint="Une période suffit : « mars 2027 », par exemple." />
          <TextField required label="Prénom" value={contact.prenom} onChange={(v) => set({ prenom: v })} invalid={bad("prenom")} autoComplete="given-name" />
          <TextField required label="Nom" value={contact.nom} onChange={(v) => set({ nom: v })} invalid={bad("nom")} autoComplete="family-name" />
          <TextField required type="email" label="E-mail professionnel" value={contact.email} onChange={(v) => set({ email: v })} invalid={bad("email")} autoComplete="email" />
          <TextField type="tel" label="Téléphone" value={contact.telephone} onChange={(v) => set({ telephone: v })} autoComplete="tel" />
        </div>
        <TextField multiline label="Commentaire" value={contact.commentaire} onChange={(v) => set({ commentaire: v })} />
        <input tabIndex={-1} aria-hidden="true" autoComplete="off" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} style={{ display: "none" }} />

        <label className={styles.check}>
          <input type="checkbox" checked={rgpd} onChange={(event) => setRgpd(event.target.checked)} />
          <span>J’accepte qu’AMI Panorama utilise ces informations pour me recontacter au sujet de cette simulation. Elles servent uniquement au suivi de ma demande.</span>
        </label>

        <div role="alert" aria-live="assertive">
          {error && <p className={styles.error}><strong>À corriger : </strong>{error}</p>}
          {verify === "error" && <p className={styles.error}>Votre demande n’a pas pu être envoyée. Vérifiez votre connexion et réessayez, ou écrivez-nous directement.</p>}
          {pdf === "error" && <p className={styles.error}>Le PDF n’a pas pu être généré. Réessayez dans un instant.</p>}
        </div>
        <div role="status" aria-live="polite">
          {verify === "sent" && <p className={styles.success}><strong>✓ Demande envoyée.</strong> L’équipe AMI Panorama revient vers vous pour vérifier cette simulation.</p>}
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.primary} disabled={verify === "sending" || verify === "sent"}>
            {verify === "sending" ? "Envoi en cours…" : verify === "sent" ? "Demande envoyée" : "Faire vérifier cette simulation"}
          </button>
          <button ref={pdfButtonRef} type="button" className={styles.ghost} disabled={pdf === "loading"} onClick={() => { if (checkContact()) { setConsent(false); setConsentOpen(true); } }}>
            {pdf === "loading" ? "Génération…" : "Télécharger le PDF"}
          </button>
        </div>
        <p className={styles.fieldHint} style={{ marginTop: 12 }}>Ces informations figurent sur le PDF. Elles sont nécessaires pour le générer.</p>
      </form>

      {consentOpen && (
        <div className={styles.overlay} onClick={() => setConsentOpen(false)}>
          <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="guided-consent-title" className={styles.dialog} onClick={(event) => event.stopPropagation()}>
            <h2 id="guided-consent-title">Avant de télécharger</h2>
            <p>Ce document est une <strong>estimation indicative</strong>, <strong>non contractuelle</strong> et <strong>confidentielle</strong>. Les montants ne constituent pas un engagement : les prises en charge définitives relèvent des OPCO et organismes compétents. AMI Panorama ne garantit aucun financement.</p>
            <label className={styles.check}>
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>J’ai compris qu’il s’agit d’une estimation non contractuelle et confidentielle, qui n’engage pas AMI Panorama.</span>
            </label>
            <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
              <button type="button" className={styles.ghost} onClick={() => setConsentOpen(false)}>Annuler</button>
              <button type="button" className={styles.primary} disabled={!consent} onClick={() => void downloadPdf()}>Confirmer et télécharger</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
