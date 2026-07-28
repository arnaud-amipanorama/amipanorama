"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const steps = [
  { number: "01", title: "Définissez votre groupe", text: "Choisissez la destination, le nombre de nuitées et le nombre d’accompagnants prévus." },
  { number: "02", title: "Répartissez vos alternants", text: "Ajoutez les OPCO représentés dans votre groupe, puis renseignez le nombre d’alternants pour chacun." },
  { number: "03", title: "Saisissez les coûts du séjour", text: "Renseignez le prix moyen du billet et le coût du séjour convenu avec AMI Panorama. Ces deux montants restent modifiables." },
  { number: "04", title: "Choisissez votre stratégie", text: "Ouvrez les paramètres avancés, vérifiez les conditions utiles à votre groupe et choisissez comment affecter le forfait référent mobilité à vos frais d’accompagnement." },
  { number: "05", title: "Lisez le résultat", text: "Le tableau distingue le coût brut, les financements estimés, le budget référent affecté et le reste à charge. Les montants restent indicatifs jusqu’à validation des dossiers." },
  { number: "06", title: "Générez votre synthèse", text: "Renseignez les informations de l’établissement en bas de page pour créer un document PDF clair à partager et à préparer avec AMI Panorama." },
];

export default function SimulatorOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const last = step === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
        style={{ position: "fixed", inset: 0, zIndex: 2000, display: "grid", placeItems: "center", padding: 20, background: "rgba(4,4,7,0.82)", backdropFilter: "blur(10px)" }}>
        <motion.section initial={{ opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.32 }}
          role="dialog" aria-modal="true" aria-labelledby="sim-onboarding-title"
          style={{ width: "min(100%, 560px)", padding: "clamp(26px,5vw,48px)", borderRadius: 20, background: "#101015", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 28px 100px rgba(0,0,0,0.6)", color: "#F4F5F7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 46 }}>
            <span style={{ color: "#E85835", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em" }}>PRISE EN MAIN</span>
            <span style={{ color: "#A2A8B4", fontSize: 12 }}>{step + 1} / {steps.length}</span>
          </div>
          <motion.div key={current.number} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
            <div style={{ color: "#E85835", fontSize: "clamp(42px,8vw,66px)", fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 0.9 }}>{current.number}</div>
            <h1 id="sim-onboarding-title" style={{ margin: "20px 0 12px", fontSize: "clamp(25px,5vw,38px)", lineHeight: 1.08, letterSpacing: "-0.04em" }}>{current.title}</h1>
            <p style={{ margin: 0, maxWidth: 430, color: "#A2A8B4", fontSize: 15, lineHeight: 1.65 }}>{current.text}</p>
          </motion.div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "40px 0 26px" }}>
            {steps.map((item, index) => <span key={item.number} style={{ display: "block", height: 4, flex: 1, borderRadius: 20, background: index <= step ? "#E85835" : "rgba(255,255,255,0.13)", transition: "background 0.2s" }} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}
              style={{ border: 0, background: "transparent", color: step === 0 ? "#555966" : "#A2A8B4", cursor: step === 0 ? "not-allowed" : "pointer", fontSize: 14, padding: "12px 0" }}>← Précédent</button>
            <button type="button" onClick={() => last ? onComplete() : setStep((value) => value + 1)}
              style={{ border: 0, borderRadius: 10, background: "#E85835", color: "#fff", cursor: "pointer", padding: "13px 18px", fontSize: 14, fontWeight: 700 }}>{last ? "Ouvrir le simulateur →" : "Suivant →"}</button>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
