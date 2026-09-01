"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OPCOS, OPCO_BY_ID, SIMULATION_OPCO_BY_ID, LEGACY_OPCOS, COST_DEFAULTS, DESTINATION_TARIFFS, DESTINATION_NAMES, programmeForDestination, OPCO_SECTORS, explainFunding } from "@/lib/simulator/opco-config";
import {
  computeSimulation,
  baseTotals,
  resolveKeptTotal,
  type OptimizationMode,
} from "@/lib/simulator/engine";
import type { SimulationData } from "./SimulationDocument";
import FundingGuide from "./FundingGuide";
import SimulatorOnboarding from "./SimulatorOnboarding";

// ── Thème : noir profond · blanc · gris clair · ORANGE AMI (accent). Bleu = accent graphique. ──
const T = {
  bg: "#0B1018",
  bg2: "#111827",
  panel: "#171E2A",
  panel2: "#202938",
  border: "#3A4659",
  borderStrong: "#53647E",
  white: "#FFFFFF",
  text: "#F8FAFC",
  muted: "#D5DDEA",
  faint: "#AAB7C9",
  orange: "#9DBBFF",
  orangeSoft: "rgba(118,163,255,0.18)",
  blue: "#76A3FF",
  teal: "#5EEAD4",
  green: "#5BE0B5",
  blueFill: "#3E68BE",
};

const eur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;

type RowState = { id: string; count: number };
type ModeKind = "free" | "maxReduction" | "coverSupport" | "targetRac";

const MODES: { kind: ModeKind; label: string; desc: string }[] = [
  { kind: "maxReduction", label: "Priorité aux étudiants", desc: "Utilise le budget disponible pour réduire au maximum ce que les étudiants ont à payer." },
  { kind: "coverSupport", label: "Pour l'accompagnement", desc: "Réserve une part du budget pour coordonner et accompagner le séjour." },
  { kind: "free", label: "Répartition personnalisée", desc: "Vous choisissez le budget à réserver pour l’accompagnement." },
  { kind: "targetRac", label: "Objectif par étudiant", desc: "Vous indiquez le montant maximal à laisser à chaque étudiant." },
];

const BENEFITS = ["Financements OPCO", "Référent mobilité", "Reste à charge étudiant", "Impact établissement"];

export default function SimulatorApp() {
  const [view, setView] = useState<"hero" | "app">("app");
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("ami_simulator_onboarding_seen") !== "true") setShowOnboarding(true);
  }, []);

  const finishOnboarding = () => {
    window.localStorage.setItem("ami_simulator_onboarding_seen", "true");
    setShowOnboarding(false);
    setView("app");
  };

  // Étape 1, le groupe
  const [destination, setDestination] = useState("Montréal");
  const [nights, setNights] = useState(7);
  const [accompagnants, setAccompagnants] = useState(2);

  // Étape 2, répartition OPCO
  const [rows, setRows] = useState<RowState[]>([
    { id: "akto", count: 8 },
    { id: "atlas", count: 4 },
    { id: "afdas", count: 6 },
  ]);

  // Étape 3, paramètres avancés
  const [transport, setTransport] = useState(DESTINATION_TARIFFS["Montréal"].billets);
  const [programme, setProgramme] = useState(programmeForDestination("Montréal", 7));
  const [eligibleAccommodation, setEligibleAccommodation] = useState(7 * 6);
  const [eligibleMeals, setEligibleMeals] = useState(8 * 2 * 3);
  const [eligibleOther, setEligibleOther] = useState(0);
  const [mode, setMode] = useState<ModeKind>("free");
  const [keptPerAccompagnant, setKeptPerAccompagnant] = useState(COST_DEFAULTS.keptPerAccompagnant);
  const [atlasContractMode, setAtlasContractMode] = useState<"miseADisposition" | "miseEnVeille">("miseADisposition");
  const [atlasBeforeApril2026, setAtlasBeforeApril2026] = useState(0);
  const [aktoContractMode, setAktoContractMode] = useState<"miseADisposition" | "miseEnVeille">("miseADisposition");
  const [aktoTrainingLevel, setAktoTrainingLevel] = useState<"postBac" | "bacOrBelow">("postBac");
  const [afdasTrainingLevel, setAfdasTrainingLevel] = useState<"postBac" | "bacOrBelow">("postBac");
  const [epContractMode, setEpContractMode] = useState<"miseADisposition" | "miseEnVeille">("miseADisposition");
  const [opcoMobilitesBefore2026, setOpcoMobilitesBefore2026] = useState(0);
  const [targetRac, setTargetRac] = useState(300);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Coordonnées (pour le document)
  const [ecole, setEcole] = useState("");
  const [referent, setReferent] = useState("");
  const [email, setEmail] = useState("");
  const [dateSouhaitee, setDateSouhaitee] = useState("");
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "err">("idle");
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "err">("idle");

  // Gating du téléchargement PDF + consentement
  const [showConsent, setShowConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [formError, setFormError] = useState(false);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const docFormValid = ecole.trim() !== "" && referent.trim() !== "" && emailValid && dateSouhaitee.trim() !== "";

  const resultsRef = useRef<HTMLDivElement>(null);
  const suggestedProgramme = programmeForDestination(destination, nights);

  // Sélection d'une destination → prix de vente + billet auto (modifiables ensuite)
  const selectDestination = (name: string) => {
    setDestination(name);
    const t = DESTINATION_TARIFFS[name];
    if (t) { setProgramme(programmeForDestination(name, nights)); setTransport(t.billets); }
  };

  const updateNights = (value: number) => {
    setNights(value);
    // Estimation interne basée sur les plafonds : AMI fournit la ventilation réelle si le dossier l'exige.
    setEligibleAccommodation(value * 6);
    setEligibleMeals((value + 1) * 2 * 3);
  };

  const result = useMemo(() => {
    const rowsConfig = rows.flatMap((r) => {
      const config = OPCO_BY_ID[r.id];
      const count = Math.max(0, r.count);
      if (!config) return [];

      if (r.id === "atlas") {
        const beforeChange = Math.min(count, Math.max(0, atlasBeforeApril2026));
        return [
          { config: LEGACY_OPCOS.atlasBeforeApril2026, count: beforeChange },
          { config, count: count - beforeChange },
        ].filter((line) => line.count > 0);
      }

      if (r.id === "opco_mobilites") {
        const beforeChange = Math.min(count, Math.max(0, opcoMobilitesBefore2026));
        return [
          { config: LEGACY_OPCOS.opcoMobilitesBefore2026, count: beforeChange },
          { config, count: count - beforeChange },
        ].filter((line) => line.count > 0);
      }

      return [{ config, count }];
    });
    const stay = { nights, programmeCost: programme, transportCost: transport, accommodationCost: eligibleAccommodation, mealsCost: eligibleMeals, otherMobilityCost: eligibleOther };
    const destinationZone = DESTINATION_TARIFFS[destination]?.zone ?? "international";
    // AKTO appelle cette zone « euro » dans son barème officiel alors que le
    // catalogue des destinations utilise « europe ». On normalise ici pour ne
    // jamais transformer un financement éligible en 0 €.
    const aktoZone = destinationZone === "europe" ? "euro" : destinationZone;
    const selections = { atlasContractMode, epContractMode, aktoTrainingLevel, afdasTrainingLevel, aktoFunding: `${aktoZone}_${aktoContractMode}`, destinationZone };
    const base = baseTotals({ stay, rows: rowsConfig, selections });
    const modeObj: OptimizationMode =
      mode === "free"
        ? { kind: "free", keptPerAccompagnant, accompagnants }
        : mode === "targetRac"
        ? { kind: "targetRac", targetPerStudent: targetRac }
        : mode === "coverSupport"
        ? { kind: "coverSupport", supportBudget: keptPerAccompagnant * accompagnants }
        : { kind: mode };
    const keptTotal = resolveKeptTotal(modeObj, base);
    return computeSimulation({ stay, rows: rowsConfig, keptTotal, selections });
  }, [
    rows,
    destination,
    nights,
    programme,
    transport,
    eligibleAccommodation,
    eligibleMeals,
    eligibleOther,
    atlasContractMode,
    atlasBeforeApril2026,
    aktoContractMode,
    aktoTrainingLevel,
    afdasTrainingLevel,
    epContractMode,
    opcoMobilitesBefore2026,
    mode,
    keptPerAccompagnant,
    accompagnants,
    targetRac,
  ]);

  const totalAlternants = result.totalStudents;
  const destinationZone = DESTINATION_TARIFFS[destination]?.zone ?? "international";
  const hasAtlas = rows.some((r) => r.id === "atlas");
  const hasOpcoMobilites = rows.some((r) => r.id === "opco_mobilites");
  const hasAkto = rows.some((r) => r.id === "akto");
  const hasAfdas = rows.some((r) => r.id === "afdas");
  const hasEp = rows.some((r) => r.id === "ep");
  const available = OPCOS.filter((o) => !rows.some((r) => r.id === o.id));
  const financementsMobilisables = result.apprentiTotal + result.reinjected;
  const toConfirmApprenti = result.perOpco.filter((o) => o.status === "to_confirm").reduce((a, o) => a + o.apprentiTotal, 0);
  const tcShare = result.apprentiTotal > 0 ? toConfirmApprenti / result.apprentiTotal : 0;
  const confidence =
    tcShare < 0.2
      ? { level: "high" as const, label: "Confiance élevée", desc: "Calcul principalement fondé sur des règles OPCO documentées." }
      : tcShare < 0.55
      ? { level: "medium" as const, label: "Confiance modérée", desc: "Certaines hypothèses nécessitent validation." }
      : { level: "low" as const, label: "Validation requise", desc: "Plusieurs financements doivent être confirmés." };
  const confColor = ({ high: T.green, medium: "#E0A52E", low: "#E5484D" } as const)[confidence.level];

  const addRow = () => available.length && setRows((rs) => [...rs, { id: available[0].id, count: 1 }]);
  const removeRow = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));
  const setCount = (id: string, count: number) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, count: Math.max(0, count) } : r)));

  function buildPdfData(): SimulationData {
    return {
      meta: {
        etablissement: ecole || "Établissement",
        referent, email, destination,
        dateSouhaitee, generatedAt: new Date().toLocaleDateString("fr-FR"),
        students: result.totalStudents, days: nights + 1,
      },
      kpis: {
        racAvg: result.racAvg,
        financementsMobilisables,
        montantConserve: result.schoolImpact,
        coutBrut: result.totalCostAll,
        coutParEtudiant: result.totalCostPerStudent,
        apprentiTotal: result.apprentiTotal,
        referentTotal: result.referentTotal,
        reinjected: result.reinjected,
        confidence,
      },
      opco: result.perOpco.map((o) => {
        const explanation = explainFunding(o.id, { calendarDays: nights + 1, destinationZone, aktoContractMode, aktoTrainingLevel, afdasTrainingLevel, atlasContractMode, epContractMode, amount: o.apprentiTheoreticalAmount });
        return { label: o.label, count: o.count, apprenti: o.apprentiAmount, referent: o.referentAmount, how: explanation.how, condition: explanation.condition, toConfirm: o.status === "to_confirm" };
      }),
    };
  }

  async function generatePdf() {
    setPdfState("loading");
    const simulationData = buildPdfData();
    void saveSimulation(simulationData);
    try {
      const [{ pdf }, mod] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./SimulationDocument"),
      ]);
      const blob = await pdf(<mod.SimulationDocument data={simulationData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AMI-Panorama-Simulation-${(ecole || "etablissement").replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setPdfState("idle");
    } catch (e) {
      console.error(e);
      setPdfState("err");
    }
  }

  async function saveSimulation(simulationData = buildPdfData()) {
    setSaved("saving");
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "simulateur financement", ...simulationData, date: new Date().toISOString() }),
      });
      setSaved(res.ok ? "ok" : "err");
    } catch {
      setSaved("err");
    }
  }

  // ════════════════════════ HERO ════════════════════════
  if (view === "hero") {
    return (
      <div style={{ background: T.bg, color: T.text, minHeight: "100svh", fontFamily: "var(--font-manrope, system-ui, sans-serif)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(118,163,255,0.16), transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 40% at 80% 110%, rgba(91,141,239,0.10), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 920, margin: "0 auto", padding: "clamp(64px,12vh,140px) 24px 80px", textAlign: "center" }}>
          <motion.img src="/Assets/Brand/ami-logo-white.png" alt="AMI Panorama"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ height: 38, width: "auto", display: "block", margin: "0 auto 30px" }} />
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "6px 14px", borderRadius: 100, border: `1px solid ${T.border}`, background: T.panel, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.orange, boxShadow: `0 0 10px ${T.orange}` }} />
            <span style={{ fontSize: 11.5, letterSpacing: "0.12em", textTransform: "uppercase", color: T.muted }}>AMI Panorama · Simulateur de financement</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
            style={{ fontSize: "clamp(34px,6vw,68px)", fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1.04, color: T.white, margin: "0 0 22px" }}>
            Découvrez le coût réel<br />de votre mobilité.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }}
            style={{ fontSize: "clamp(16px,2vw,19px)", color: T.muted, maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.6 }}>
            Estimez instantanément les financements OPCO mobilisables, les aides référent mobilité et le reste à charge réel de vos étudiants.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.18 }}
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginBottom: 44 }}>
            {BENEFITS.map((b) => (
              <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 100, background: T.panel, border: `1px solid ${T.border}`, fontSize: 13.5, color: T.text }}>
                <span style={{ color: T.orange, fontWeight: 700 }}>✓</span> {b}
              </span>
            ))}
          </motion.div>
          <motion.button initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.24 }}
            onClick={() => setView("app")} style={primaryBtn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Commencer une simulation →
          </motion.button>
        </div>
      </div>
    );
  }

  // ════════════════════════ APP ════════════════════════
  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100svh", fontFamily: "var(--font-manrope, system-ui, sans-serif)" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 35% at 70% -5%, rgba(118,163,255,0.12), transparent 60%)" }} />
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", padding: "52px 24px 112px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <button onClick={() => setView("hero")} style={{ ...linkBtn, display: "inline-flex", alignItems: "center", gap: 11 }}>
            <img src="/Assets/Brand/ami-logo-white.png" alt="AMI Panorama" style={{ height: 22, width: "auto" }} />
            <span style={{ color: T.faint, textTransform: "none", letterSpacing: 0 }}>· Simulateur</span>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 400px) 1fr", gap: 28, alignItems: "start" }} className="sim-layout">
          {/* ── COLONNE PARAMÈTRES (niveau 3) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div data-sim-tour="group"><Step n={1} title="Le groupe">
              <Field label="Destination" hint="prix auto"><Select value={destination} onChange={selectDestination} options={DESTINATION_NAMES} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Durée (nuitées)" hint={`${nights + 1} jours`}><Stepper value={nights} onChange={updateNights} min={1} /></Field>
                <Field label="Accompagnants"><Stepper value={accompagnants} onChange={setAccompagnants} min={0} /></Field>
              </div>
            </Step></div>

            <div data-sim-tour="opcos"><Step n={2} title="Répartition OPCO" right={<Pill>{totalAlternants} alternants</Pill>}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rows.map((r) => {
                  const cfg = OPCO_BY_ID[r.id];
                  return (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: T.panel, border: `1px solid ${T.border}` }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cfg.label}</div>
                        {cfg.status === "to_confirm" && <div style={{ fontSize: 10.5, color: T.faint, marginTop: 1 }}>règle estimée · à confirmer</div>}
                      </div>
                      <Stepper value={r.count} onChange={(v) => setCount(r.id, v)} min={0} compact />
                      <button onClick={() => removeRow(r.id)} style={iconBtn} title="Retirer">✕</button>
                    </div>
                  );
                })}
                {available.length > 0 && (
                  <select value="" onChange={(e) => e.target.value && setRows((rs) => [...rs, { id: e.target.value, count: 1 }])} style={{ ...selectStyle, marginTop: 2 }}>
                    <option value="" style={{ background: T.bg2 }}>+ Ajouter un OPCO…</option>
                    {available.map((o) => <option key={o.id} value={o.id} style={{ background: T.bg2 }}>{o.label}</option>)}
                  </select>
                )}
              </div>
            </Step></div>

            {/* Étape 3, accordéon */}
            <div data-sim-tour="advanced" style={{ ...panelStyle, overflow: "hidden" }}>
              <button onClick={() => setAdvancedOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer", color: T.text }}>
                <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <StepBadge n={3} />
                  <span style={{ display: "grid", gap: 3, textAlign: "left" }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>Adapter l’estimation</span>
                    <span style={{ fontSize: 11.5, color: T.faint, fontWeight: 400 }}>Facultatif · les montants sont déjà préremplis</span>
                  </span>
                </span>
                <span style={{ color: T.muted, transform: advancedOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
              </button>
              <AnimatePresence initial={false}>
                {advancedOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                    <div style={{ padding: "4px 18px 20px", display: "flex", flexDirection: "column", gap: 16, borderTop: `1px solid ${T.border}` }}>
                      <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, margin: "14px 0 -2px" }}>Modifiez uniquement les informations que vous connaissez. Vous pouvez laisser le reste tel quel.</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                        <Field label="Billet d’avion / étudiant"><NumInput value={transport} onChange={setTransport} suffix="€" /></Field>
                        <Field label="Séjour / étudiant" hint={`suggestion : ${eur(suggestedProgramme)}`}><NumInput value={programme} onChange={setProgramme} suffix="€" /></Field>
                      </div>
                      <Field label="Autres frais justifiables / étudiant" hint="assurance, visa ou protection sociale">
                        <NumInput value={eligibleOther} onChange={setEligibleOther} suffix="€" />
                      </Field>
                      <p style={{ fontSize: 11.5, color: T.faint, lineHeight: 1.5, margin: "-10px 0 0" }}>Pour les OPCO qui remboursent au réel, le simulateur ne retient jamais plus que les dépenses éligibles déclarées et justifiables.</p>
                      {(hasAtlas || hasOpcoMobilites || hasAkto || hasAfdas || hasEp) && <p style={{ fontSize: 12, fontWeight: 600, color: T.text, margin: "2px 0 -6px" }}>Situations particulières liées aux contrats</p>}
                      {hasAtlas && (
                        <>
                          <Field label="ATLAS, mode de contrat">
                            <Toggle value={atlasContractMode} onChange={(v) => setAtlasContractMode(v as "miseADisposition" | "miseEnVeille")}
                              options={[{ v: "miseADisposition", l: "Mise à disposition" }, { v: "miseEnVeille", l: "Mise en veille" }]} />
                          </Field>
                          <Field label="ATLAS, contrats signés avant le 1er avril 2026" hint="barème antérieur">
                            <NumInput value={atlasBeforeApril2026} onChange={(v) => setAtlasBeforeApril2026(Math.min(v, rows.find((r) => r.id === "atlas")?.count ?? 0))} suffix="contrats" />
                          </Field>
                          <p style={{ fontSize: 11.5, color: T.faint, margin: "-8px 0 0", lineHeight: 1.5 }}>Les autres contrats ATLAS suivent les règles depuis le 1er avril 2026, avec un minimum de 15 jours calendaires.</p>
                        </>
                      )}
                      {hasOpcoMobilites && (
                        <>
                          <Field label="OPCO Mobilités, contrats signés avant le 1er janvier 2026" hint="barème antérieur">
                            <NumInput value={opcoMobilitesBefore2026} onChange={(v) => setOpcoMobilitesBefore2026(Math.min(v, rows.find((r) => r.id === "opco_mobilites")?.count ?? 0))} suffix="contrats" />
                          </Field>
                          <p style={{ fontSize: 11.5, color: T.faint, margin: "-8px 0 0", lineHeight: 1.5 }}>Les autres contrats suivent les règles 2026. Les anciens contrats conservent le forfait CFA historique selon la zone.</p>
                        </>
                      )}
                      {hasAkto && (
                        <>
                          <Field label="AKTO, type de convention">
                            <Toggle value={aktoContractMode} onChange={(v) => setAktoContractMode(v as "miseADisposition" | "miseEnVeille")}
                              options={[{ v: "miseADisposition", l: "Mise à disposition" }, { v: "miseEnVeille", l: "Mise en veille" }]} />
                          </Field>
                          <Field label="AKTO, niveau de formation">
                            <Toggle value={aktoTrainingLevel} onChange={(v) => setAktoTrainingLevel(v as "postBac" | "bacOrBelow")}
                              options={[{ v: "postBac", l: "Supérieur au bac" }, { v: "bacOrBelow", l: "Bac ou infra" }]} />
                          </Field>
                        </>
                      )}
                      {hasAfdas && (
                        <Field label="AFDAS, niveau de formation" hint="+10 % sur le forfait référent pour Bac ou infra">
                          <Toggle value={afdasTrainingLevel} onChange={(v) => setAfdasTrainingLevel(v as "postBac" | "bacOrBelow")}
                            options={[{ v: "postBac", l: "Supérieur au bac" }, { v: "bacOrBelow", l: "Bac ou infra" }]} />
                        </Field>
                      )}
                      {hasEp && (
                        <Field label="OPCO EP, type de convention">
                          <Toggle value={epContractMode} onChange={(v) => setEpContractMode(v as "miseADisposition" | "miseEnVeille")}
                            options={[{ v: "miseADisposition", l: "Mise à disposition" }, { v: "miseEnVeille", l: "Mise en veille" }]} />
                        </Field>
                      )}
                      <div>
                        <Label>Comment utiliser le budget de coordination</Label>
                        <p style={{ fontSize: 11.5, color: T.faint, lineHeight: 1.5, margin: "-3px 0 0" }}>Choisissez si ce budget doit rester disponible pour le CFA ou aider davantage les étudiants.</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                          {MODES.map((m) => (
                            <button key={m.kind} onClick={() => setMode(m.kind)} title={m.desc} style={{
                              textAlign: "left", padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                              border: `1px solid ${mode === m.kind ? T.orange : T.border}`,
                              background: mode === m.kind ? T.orangeSoft : T.panel, transition: "all 0.18s",
                            }}>
                              <div style={{ fontSize: 12.5, fontWeight: 600, color: T.text }}>{m.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      {(mode === "free" || mode === "coverSupport") && (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <Label>{mode === "coverSupport" ? "Budget prévu par accompagnant" : "Budget réservé par accompagnant"}</Label>
                            <span style={{ fontSize: 13.5, fontWeight: 700, color: T.orange }}>{eur(keptPerAccompagnant)}</span>
                          </div>
                          <input type="range" min={0} max={3000} step={50} value={keptPerAccompagnant} onChange={(e) => setKeptPerAccompagnant(Number(e.target.value))} style={{ width: "100%", accentColor: T.orange }} />
                          <p style={{ fontSize: 11.5, color: T.faint, marginTop: 8, lineHeight: 1.5 }}>
                            Pour {accompagnants} accompagnant·s, cela représente {eur(keptPerAccompagnant * accompagnants)} pour préparer et suivre le séjour. Le budget restant sert à réduire ce que les étudiants ont à payer.
                          </p>
                        </div>
                      )}
                      {mode === "targetRac" && (
                        <Field label="Montant visé par étudiant"><NumInput value={targetRac} onChange={setTargetRac} suffix="€" /></Field>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Carte « À savoir » */}
            <div style={{ ...panelStyle, background: T.orangeSoft, border: "1px solid rgba(157,187,255,0.40)", padding: 16, display: "flex", gap: 12 }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(157,187,255,0.20)", color: T.orange, fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>i</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>À savoir</div>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, margin: 0 }}>
                  Les résultats fournis constituent des estimations indicatives basées sur les informations saisies et sur les règles de financement actuellement connues. Les décisions finales de prise en charge relèvent exclusivement des OPCO et organismes compétents. AMI Panorama ne garantit aucun montant de financement.
                </p>
              </div>
            </div>
          </div>

          {/* ── COLONNE RÉSULTATS (niveau 1) ── */}
          <div ref={resultsRef} style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 14 }} className="sim-results">
            {/* KPI principal */}
            <motion.div key={Math.round(result.racAvg)} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              data-sim-tour="results"
              style={{ ...panelStyle, background: "linear-gradient(160deg, rgba(118,163,255,0.14), #171E2A 58%)", border: `1px solid ${T.borderStrong}`, padding: "32px 30px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: T.orange }} />
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>Reste à payer par étudiant</div>
              <div style={{ fontSize: "clamp(48px,8vw,84px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, color: T.white, margin: "6px 0 4px" }}>{eur(result.racAvg)}</div>
              <div style={{ fontSize: 14, color: T.muted }}>Après les aides estimées · {result.totalStudents} étudiants · {destination || "Non renseignée"} · {nights + 1} jours</div>
            </motion.div>

            {/* KPI secondaires */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="sim-kpis">
              <Kpi label="Aides OPCO au total" value={eur(result.apprentiTotal + result.referentTotal)} sub="étudiants + accompagnement" accent={T.green} />
              <Kpi label="Aides pour les étudiants" value={eur(result.apprentiTotal)} sub={`${eur(result.financementMoyen)} par étudiant`} accent={T.blue} />
              <Kpi label="Forfaits référent mobilité" value={eur(result.referentTotal)} sub="organisation et accompagnement" accent={T.teal} />
              <Kpi label="Budget CFA pour accompagner" value={result.schoolImpact > 0 ? eur(result.schoolImpact) : "0 €"} sub={result.schoolImpact > 0 ? "accompagnateurs et coordination" : "tout a été réinjecté pour les étudiants"} accent={T.orange} />
            </div>

            {/* Indicateur de fiabilité */}
            <div style={{ ...panelStyle, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: confColor, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{confidence.label}</div>
                <div style={{ fontSize: 11.5, color: T.muted }}>{confidence.desc}</div>
              </div>
              <span style={{ fontSize: 10, color: T.faint }}>À confirmer</span>
            </div>

            {/* Donut */}
            <div style={{ ...panelStyle, padding: 22, display: "grid", gridTemplateColumns: "180px 1fr", gap: 20, alignItems: "center" }} className="sim-donut">
              <Donut total={result.totalCostAll} segments={[
                { label: "Aides OPCO pour les étudiants", value: result.apprentiTotal, color: T.blue },
                { label: "Part utilisée pour les étudiants", value: result.reinjected, color: T.green },
                { label: "À payer par les étudiants", value: Math.max(0, result.racFinalTotal), color: T.orange },
              ]} />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <CardLabel>Comment le séjour est financé</CardLabel>
                {[
                  { label: "Aides OPCO pour les étudiants", value: result.apprentiTotal, color: T.blue },
                  { label: "Part utilisée pour les étudiants", value: result.reinjected, color: T.green },
                  { label: "À payer par les étudiants", value: Math.max(0, result.racFinalTotal), color: T.orange },
                ].map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                    <span style={{ color: T.muted, flex: 1 }}>{s.label}</span>
                    <b style={{ color: T.text }}>{eur(s.value)}</b>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...panelStyle, padding: "18px 20px", background: "rgba(118,163,255,0.12)", borderColor: "rgba(157,187,255,0.35)" }}>
              <CardLabel>En clair</CardLabel>
              <p style={{ fontSize: 13, color: T.text, lineHeight: 1.65, margin: "9px 0 0" }}>
                Le séjour représente {eur(result.totalCostAll)} au total. Les aides directement utilisées pour les étudiants représentent {eur(result.apprentiTotal)} et {eur(result.reinjected)} du budget référent est réinjecté. Après cette répartition, chaque étudiant aurait environ <b>{eur(result.racAvg)}</b> à payer.
              </p>
              <p style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.55, margin: "8px 0 0" }}>
                Les {eur(result.referentTotal)} de forfaits référent mobilité financent le travail du CFA. Dans cette simulation, {eur(result.schoolImpact)} restent disponibles pour les accompagnateurs, la coordination et l’organisation. Ce n’est pas une marge libre et la validation finale des OPCO reste nécessaire.
              </p>
            </div>

            {/* Détail OPCO */}
            <div style={{ ...panelStyle, padding: 22 }}>
              <CardLabel>Comprendre le financement, OPCO par OPCO</CardLabel>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column" }}>
                {result.perOpco.map((o) => {
                  const maxA = Math.max(...result.perOpco.map((x) => x.apprentiAmount), 1);
                  return (
                    <div key={o.id} style={{ padding: "10px 0", borderTop: `1px solid ${T.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                        <span style={{ minWidth: 132, fontWeight: 600 }}>{o.label}</span>
                        <span style={{ color: T.faint, minWidth: 56, fontSize: 12 }}>{o.count} alt.</span>
                        <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 4 }}>
                          <div style={{ width: `${(o.apprentiAmount / maxA) * 100}%`, height: "100%", background: T.blue, borderRadius: 4 }} />
                        </div>
                        <b style={{ minWidth: 66, textAlign: "right" }}>{eur(o.apprentiAmount)}</b>
                      </div>
                      {(() => {
                        const explanation = explainFunding(o.id, { calendarDays: nights + 1, destinationZone, aktoContractMode, aktoTrainingLevel, afdasTrainingLevel, atlasContractMode, epContractMode, amount: o.apprentiTheoreticalAmount });
                        return <div style={{ display: "grid", gap: 5, marginTop: 8, padding: "10px 11px", borderRadius: 9, background: "rgba(255,255,255,0.025)" }}>
                          <p style={{ fontSize: 11.5, color: T.text, lineHeight: 1.55, margin: 0 }}><b>Comment ça fonctionne :</b> {explanation.how}</p>
                          {o.apprentiTheoreticalAmount > o.apprentiAmount && <p style={{ fontSize: 10.5, color: T.orange, lineHeight: 1.5, margin: 0 }}><b>Montant retenu :</b> limité à {eur(o.apprentiAmount)} par étudiant, afin de ne pas dépasser le prix estimé du séjour.</p>}
                          <p style={{ fontSize: 10.5, color: o.status === "to_confirm" ? "#E0A52E" : T.muted, lineHeight: 1.5, margin: 0 }}><b>{o.status === "to_confirm" ? "À confirmer :" : "À prévoir :"}</b> {explanation.condition}</p>
                          <p style={{ fontSize: 10.5, color: T.faint, margin: 0 }}>Référent mobilité : {eur(o.referentAmount)} par alternant, à affecter à la coordination et aux dépenses liées à la mobilité.</p>
                        </div>;
                      })()}
                      {OPCO_SECTORS[o.id.replace(/_before_\d+$/, "")] && <div style={{ fontSize: 10.5, color: T.faint, marginTop: 3, fontStyle: "italic", lineHeight: 1.5 }}>{OPCO_SECTORS[o.id.replace(/_before_\d+$/, "")]}</div>}
                      {SIMULATION_OPCO_BY_ID[o.id]?.source && <a href={SIMULATION_OPCO_BY_ID[o.id].source!.url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 4, fontSize: 10.5, color: T.blue }}>Source vérifiée · {SIMULATION_OPCO_BY_ID[o.id].source!.checkedAt} ↗</a>}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, background: T.panel2, border: `1px solid ${T.border}` }}>
                <p style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.6, margin: 0 }}>
                  <b style={{ color: T.text }}>Comment lire ces montants.</b> Le <b>forfait référent mobilité</b> finance le travail et les dépenses de coordination du CFA ; il ne constitue pas une marge libre. Pour les OPCO au réel, le simulateur applique une estimation selon les plafonds connus. AMI Panorama fournit ensuite la ventilation utile au dossier, lorsque le séjour est défini.
                </p>
                <p style={{ fontSize: 10, color: T.faint, margin: "8px 0 0" }}>Sources officielles consultées le 28/07/2026. Une source et la date de contrôle sont disponibles par ligne.</p>
              </div>
            </div>

            <FundingGuide />

            {/* Document + enregistrement */}
            <div style={{ ...panelStyle, padding: 22 }}>
              <div data-sim-tour="document" style={{ scrollMarginTop: 72, scrollMarginBottom: 380 }}>
                <CardLabel>Générer le document</CardLabel>
                <p style={{ fontSize: 11.5, color: T.faint, margin: "8px 0 12px", lineHeight: 1.5 }}>
                  Ces informations sont nécessaires pour générer le document (champs obligatoires).
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "0 0 14px" }}>
                  <Input value={ecole} onChange={setEcole} placeholder="Nom de l'établissement *" invalid={formError && !ecole.trim()} />
                  <Input value={referent} onChange={setReferent} placeholder="Référent / personne *" invalid={formError && !referent.trim()} />
                  <Input value={email} onChange={setEmail} placeholder="Email *" type="email" invalid={formError && !emailValid} />
                  <Input value={dateSouhaitee} onChange={setDateSouhaitee} placeholder="Période souhaitée *" invalid={formError && !dateSouhaitee.trim()} />
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <button onClick={() => { if (!docFormValid) { setFormError(true); } else { setFormError(false); setConsentChecked(false); setShowConsent(true); } }} disabled={pdfState === "loading"} style={primaryBtn}>
                    {pdfState === "loading" ? "Génération…" : "Télécharger le PDF"}
                  </button>
                  <button onClick={() => void saveSimulation()} disabled={saved === "saving"} style={ghostBtn}>
                    {saved === "saving" ? "…" : saved === "ok" ? "✓ Enregistrée" : "Enregistrer"}
                  </button>
                </div>
              </div>
              {formError && !docFormValid && <p style={{ fontSize: 12, color: "#FF6B6B", marginTop: 10 }}>Merci de renseigner l&apos;établissement, la personne, un email valide et la période souhaitée.</p>}
              {pdfState === "err" && <p style={{ fontSize: 12, color: "#FF6B6B", marginTop: 10 }}>Erreur lors de la génération du PDF.</p>}
              <p style={{ fontSize: 11, color: T.faint, marginTop: 14, lineHeight: 1.5 }}>
                Certaines prises en charge sont estimées selon les règles actuellement utilisées par AMI Panorama et devront être confirmées selon l&apos;OPCO, la durée et les justificatifs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pop-up de consentement avant téléchargement ── */}
      <AnimatePresence>
        {showConsent && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={() => setShowConsent(false)}
            style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0,0,0,0.62)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.98 }} transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 460, background: T.bg2, border: `1px solid ${T.borderStrong}`, borderRadius: 16, padding: 26 }}
            >
              <img src="/Assets/Brand/ami-logo-white.png" alt="AMI Panorama" style={{ height: 20, width: "auto", marginBottom: 16, display: "block" }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.white, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Avant de télécharger</h3>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, margin: "0 0 16px" }}>
                Ce document est une <b style={{ color: T.text }}>estimation indicative</b>, <b style={{ color: T.text }}>non contractuelle</b> et <b style={{ color: T.text }}>confidentielle</b>. Les montants ne constituent pas un engagement : les prises en charge définitives relèvent des OPCO et organismes compétents. AMI Panorama ne garantit aucun financement.
              </p>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginBottom: 18 }}>
                <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} style={{ marginTop: 2, width: 16, height: 16, accentColor: T.orange, flexShrink: 0, cursor: "pointer" }} />
                <span style={{ fontSize: 12.5, color: T.text, lineHeight: 1.55 }}>J&apos;ai compris qu&apos;il s&apos;agit d&apos;une estimation non contractuelle et confidentielle, qui n&apos;engage pas AMI Panorama.</span>
              </label>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={() => setShowConsent(false)} style={ghostBtn}>Annuler</button>
                <button onClick={() => { setShowConsent(false); generatePdf(); }} disabled={!consentChecked}
                  style={{ ...primaryBtn, opacity: consentChecked ? 1 : 0.5, cursor: consentChecked ? "pointer" : "not-allowed" }}>
                  Confirmer et télécharger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {showOnboarding && <SimulatorOnboarding onStepChange={(step) => { if (step === 3) setAdvancedOpen(true); }} onComplete={finishOnboarding} />}

      <style>{`
        @media (max-width: 880px) {
          .sim-layout { grid-template-columns: 1fr !important; }
          .sim-results { position: static !important; }
        }
        @media (max-width: 520px) {
          .sim-kpis { grid-template-columns: 1fr !important; }
          .sim-donut { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Sous-composants ──
function Step({ n, title, right, children }: { n: number; title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ ...panelStyle, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StepBadge n={n} />
          <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
        </div>
        {right}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}
function StepBadge({ n }: { n: number }) {
  return <span style={{ width: 24, height: 24, borderRadius: 7, background: T.orangeSoft, border: "1px solid rgba(157,187,255,0.42)", color: T.orange, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{n}</span>;
}
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <Label>{label}</Label>
        {hint && <span style={{ fontSize: 11, color: T.faint }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: T.muted }}>{children}</span>;
}
function Pill({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 12, fontWeight: 600, color: T.text, background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 100, padding: "4px 11px" }}>{children}</span>;
}
function Input({ value, onChange, placeholder, invalid, type }: { value: string; onChange: (v: string) => void; placeholder?: string; invalid?: boolean; type?: string }) {
  return <input type={type || "text"} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, ...(invalid ? { borderColor: "#FF6B6B" } : {}) }} />;
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
      {options.map((o) => <option key={o} value={o} style={{ background: T.bg2 }}>{o}</option>)}
    </select>
  );
}
function NumInput({ value, onChange, suffix }: { value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div style={{ position: "relative" }}>
      <input type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} style={inputStyle} />
      {suffix && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: T.faint }}>{suffix}</span>}
    </div>
  );
}
function Stepper({ value, onChange, min = 0, compact }: { value: number; onChange: (v: number) => void; min?: number; compact?: boolean }) {
  const btn: React.CSSProperties = { width: compact ? 30 : 38, height: compact ? 30 : 40, border: `1px solid ${T.border}`, background: T.panel2, color: T.text, borderRadius: 8, cursor: "pointer", fontSize: 16, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" };
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} style={btn}>−</button>
      <span style={{ minWidth: compact ? 26 : 34, textAlign: "center", fontSize: 15, fontWeight: 700 }}>{value}</span>
      <button onClick={() => onChange(value + 1)} style={btn}>+</button>
    </div>
  );
}
function Toggle({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div style={{ display: "inline-flex", background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 3 }}>
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{ border: "none", cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, background: value === o.v ? T.blueFill : "transparent", color: value === o.v ? "#fff" : T.muted, transition: "all 0.18s" }}>{o.l}</button>
      ))}
    </div>
  );
}
function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{ ...panelStyle, padding: 16 }}>
      <CardLabel>{label}</CardLabel>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 6, color: accent || T.white }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.faint, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
function CardLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.faint }}>{children}</div>;
}
function Donut({ segments, total }: { segments: { label: string; value: number; color: string }[]; total: number }) {
  const r = 64, sw = 20, C = 2 * Math.PI * r;
  const sum = Math.max(total, segments.reduce((s, x) => s + Math.max(0, x.value), 0), 1);
  let offset = 0;
  return (
    <svg viewBox="0 0 160 160" style={{ width: "100%", maxWidth: 180, margin: "0 auto", display: "block" }}>
      <g transform="rotate(-90 80 80)">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
        {segments.map((s, i) => {
          const len = (Math.max(0, s.value) / sum) * C;
          const el = <circle key={i} cx="80" cy="80" r={r} fill="none" stroke={s.color} strokeWidth={sw} strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} />;
          offset += len;
          return el;
        })}
      </g>
      <text x="80" y="76" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">{eur(total)}</text>
      <text x="80" y="92" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="8.5">coût brut</text>
    </svg>
  );
}
function Waterfall({ steps }: { steps: { label: string; value: number; kind: "total" | "down" | "final" }[] }) {
  const max = Math.max(...steps.map((s) => Math.abs(s.value)), 1);
  const colors: Record<string, string> = { total: "rgba(255,255,255,0.30)", down: T.blue, final: T.orange };
  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 9 }}>
      {steps.map((s) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5 }}>
          <span style={{ minWidth: 162, color: T.muted }}>{s.label}</span>
          <div style={{ flex: 1, height: 12 }}>
            <div style={{ width: `${(Math.abs(s.value) / max) * 100}%`, height: "100%", background: colors[s.kind], borderRadius: 4 }} />
          </div>
          <b style={{ minWidth: 78, textAlign: "right", color: s.kind === "final" ? T.orange : T.text }}>{eur(Math.abs(s.value))}</b>
        </div>
      ))}
    </div>
  );
}

// ── styles ──
const panelStyle: React.CSSProperties = { background: T.panel, border: `1px solid ${T.border}`, borderRadius: 16 };
const inputStyle: React.CSSProperties = { width: "100%", background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "11px 13px", fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit" };
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };
const primaryBtn: React.CSSProperties = { border: "none", borderRadius: 10, cursor: "pointer", padding: "13px 22px", fontSize: 14, fontWeight: 600, color: "#fff", background: T.blueFill };
const ghostBtn: React.CSSProperties = { border: `1px solid ${T.borderStrong}`, borderRadius: 10, cursor: "pointer", padding: "13px 18px", fontSize: 14, fontWeight: 500, color: T.text, background: "transparent" };
const linkBtn: React.CSSProperties = { border: "none", background: "transparent", color: T.muted, cursor: "pointer", fontSize: 12.5, letterSpacing: "0.06em", textTransform: "uppercase" };
const iconBtn: React.CSSProperties = { border: `1px solid ${T.border}`, borderRadius: 8, cursor: "pointer", width: 30, height: 30, color: T.faint, background: "transparent", fontSize: 12, flexShrink: 0 };
