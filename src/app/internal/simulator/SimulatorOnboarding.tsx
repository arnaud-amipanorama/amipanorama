"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  { number: "01", target: "group", title: "Définissez votre groupe", text: "Commencez ici : choisissez la destination, le nombre de nuitées et le nombre d’accompagnants prévus." },
  { number: "02", target: "opcos", title: "Répartissez vos alternants", text: "Ajoutez les OPCO représentés dans votre groupe, puis indiquez le nombre d’alternants pour chacun." },
  { number: "03", target: "advanced", title: "Saisissez les coûts du séjour", text: "Ouvrez les paramètres avancés : renseignez le prix moyen du billet et le coût du séjour convenu avec AMI Panorama." },
  { number: "04", target: "advanced", title: "Choisissez votre stratégie", text: "Vérifiez les conditions utiles à votre groupe, puis choisissez comment affecter le forfait référent mobilité à vos frais d’accompagnement." },
  { number: "05", target: "results", title: "Lisez le résultat", text: "Cette colonne synthétise le coût brut, les financements estimés, le budget référent affecté et le reste à charge. Les montants restent indicatifs jusqu’à validation des dossiers." },
  { number: "06", target: "document", title: "Générez votre synthèse", text: "Terminez ici : renseignez les informations de l’établissement pour créer un document PDF clair à partager et à préparer avec AMI Panorama." },
];

type Spotlight = { top: number; left: number; width: number; height: number };

export default function SimulatorOnboarding({ onComplete, onStepChange }: { onComplete: () => void; onStepChange: (step: number) => void }) {
  const [step, setStep] = useState(0);
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const current = steps[step];
  const last = step === steps.length - 1;
  const goToStep = (next: number) => { onStepChange(next); setStep(next); };

  useEffect(() => {
    const target = document.querySelector<HTMLElement>(`[data-sim-tour="${current.target}"]`);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    const placeSpotlight = () => {
      const rect = target.getBoundingClientRect();
      const pad = 10;
      const width = Math.min(window.innerWidth - 16, rect.width + pad * 2);
      const height = Math.min(window.innerHeight - 16, rect.height + pad * 2);
      setSpotlight({ top: Math.max(8, Math.min(rect.top - pad, window.innerHeight - height - 8)), left: Math.max(8, Math.min(rect.left - pad, window.innerWidth - width - 8)), width, height });
    };
    const timer = window.setTimeout(placeSpotlight, 360);
    window.addEventListener("resize", placeSpotlight);
    return () => { window.clearTimeout(timer); window.removeEventListener("resize", placeSpotlight); };
  }, [current.target, step]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, pointerEvents: "none" }}>
      {spotlight ? <>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: spotlight.top, background: "rgba(4,4,7,0.64)", backdropFilter: "blur(5px)" }} />
        <div style={{ position: "fixed", top: spotlight.top, left: 0, width: spotlight.left, height: spotlight.height, background: "rgba(4,4,7,0.64)", backdropFilter: "blur(5px)" }} />
        <div style={{ position: "fixed", top: spotlight.top, left: spotlight.left + spotlight.width, right: 0, height: spotlight.height, background: "rgba(4,4,7,0.64)", backdropFilter: "blur(5px)" }} />
        <div style={{ position: "fixed", top: spotlight.top + spotlight.height, left: 0, right: 0, bottom: 0, background: "rgba(4,4,7,0.64)", backdropFilter: "blur(5px)" }} />
      </> : <div style={{ position: "absolute", inset: 0, background: "rgba(4,4,7,0.64)", backdropFilter: "blur(5px)" }} />}
      {spotlight && <motion.div initial={false} animate={spotlight} transition={{ type: "spring", stiffness: 280, damping: 30 }}
        style={{ position: "fixed", borderRadius: 17, border: "2px solid #2547C7", boxShadow: "0 0 0 6px rgba(37,71,199,0.18), 0 0 32px rgba(37,71,199,0.42)", pointerEvents: "none" }} />}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}
        role="dialog" aria-modal="true" aria-labelledby="sim-onboarding-title"
        style={{ position: "fixed", pointerEvents: "auto", right: "clamp(16px, 4vw, 42px)", bottom: "clamp(16px, 4vw, 42px)", width: "min(calc(100% - 32px), 430px)", padding: "24px", borderRadius: 18, background: "#101015", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 24px 80px rgba(0,0,0,0.55)", color: "#F4F5F7" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ color: "#2547C7", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.14em" }}>PRISE EN MAIN GUIDÉE</span>
          <span style={{ color: "#A2A8B4", fontSize: 12 }}>{step + 1} / {steps.length}</span>
        </div>
        <motion.div key={current.number} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}>
          <div style={{ color: "#2547C7", fontSize: 29, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>{current.number}</div>
          <h1 id="sim-onboarding-title" style={{ margin: "11px 0 7px", fontSize: 23, lineHeight: 1.1, letterSpacing: "-0.035em" }}>{current.title}</h1>
          <p style={{ margin: 0, color: "#A2A8B4", fontSize: 13.5, lineHeight: 1.58 }}>{current.text}</p>
        </motion.div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, margin: "22px 0 17px" }}>
          {steps.map((item, index) => <span key={item.number} style={{ display: "block", height: 3, flex: 1, borderRadius: 20, background: index <= step ? "#2547C7" : "rgba(255,255,255,0.13)", transition: "background 0.2s" }} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <button type="button" onClick={() => goToStep(Math.max(0, step - 1))} disabled={step === 0}
            style={{ border: 0, background: "transparent", color: step === 0 ? "#555966" : "#A2A8B4", cursor: step === 0 ? "not-allowed" : "pointer", fontSize: 13, padding: "10px 0" }}>← Précédent</button>
          <button type="button" onClick={() => last ? onComplete() : goToStep(step + 1)}
            style={{ border: 0, borderRadius: 9, background: "#2547C7", color: "#fff", cursor: "pointer", padding: "11px 15px", fontSize: 13, fontWeight: 700 }}>{last ? "Ouvrir le simulateur →" : "Voir l’étape suivante →"}</button>
        </div>
      </motion.section>
    </div>
  );
}
