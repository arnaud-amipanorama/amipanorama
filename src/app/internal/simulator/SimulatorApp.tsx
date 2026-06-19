"use client";
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { OPCOS, OPCO_BY_ID, programmeCostForNights, COST_DEFAULTS } from "@/lib/simulator/opco-config";
import {
  computeSimulation,
  baseTotals,
  resolveKeptTotal,
  type OptimizationMode,
} from "@/lib/simulator/engine";

// ── Thème sombre (outil interne, distinct du site public) ──
const T = {
  bg: "#07090F",
  panel: "rgba(255,255,255,0.03)",
  panel2: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.09)",
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.55)",
  faint: "rgba(255,255,255,0.38)",
  blue: "#4B76F0",
  teal: "#2DD4BF",
  coral: "#E85835",
  green: "#34D399",
};

const eur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;

type RowState = { id: string; count: number };
type ModeKind = "free" | "maxReduction" | "operationBlanche" | "targetRac";

const MODES: { kind: ModeKind; label: string; desc: string }[] = [
  { kind: "free", label: "Optimisation libre", desc: "Vous fixez le montant conservé par accompagnant." },
  { kind: "maxReduction", label: "RAC étudiant minimal", desc: "Réinjecte tout le financement référent." },
  { kind: "operationBlanche", label: "Opération blanche école", desc: "L'école ne conserve rien : opération nette nulle." },
  { kind: "targetRac", label: "RAC étudiant cible", desc: "Le moteur arbitre pour atteindre un RAC visé." },
];

export default function SimulatorApp() {
  // Section 1 — contexte
  const [ecole, setEcole] = useState("");
  const [referent, setReferent] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [destination, setDestination] = useState("Montréal");
  const [dateSouhaitee, setDateSouhaitee] = useState("");
  const [nights, setNights] = useState(7);
  const [accompagnants, setAccompagnants] = useState(2);
  const [transport, setTransport] = useState(COST_DEFAULTS.transportDefault);
  const [programme, setProgramme] = useState(programmeCostForNights(7));

  // Section 2 — répartition OPCO
  const [rows, setRows] = useState<RowState[]>([
    { id: "akto", count: 8 },
    { id: "atlas", count: 4 },
  ]);

  // Section 3 — hypothèses
  const [mode, setMode] = useState<ModeKind>("free");
  const [keptPerAccompagnant, setKeptPerAccompagnant] = useState(COST_DEFAULTS.keptPerAccompagnant);
  const [atlasContractMode, setAtlasContractMode] = useState<"miseADisposition" | "miseEnVeille">("miseADisposition");
  const [targetRac, setTargetRac] = useState(300);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "err">("idle");

  const resultsRef = useRef<HTMLDivElement>(null);

  const suggestedProgramme = programmeCostForNights(nights);

  // ── Calcul (live) ──
  const result = useMemo(() => {
    const rowsConfig = rows
      .filter((r) => OPCO_BY_ID[r.id])
      .map((r) => ({ config: OPCO_BY_ID[r.id], count: Math.max(0, r.count) }));
    const stay = { nights, programmeCost: programme, transportCost: transport };
    const selections = { atlasContractMode };
    const base = baseTotals({ stay, rows: rowsConfig, selections });
    const modeObj: OptimizationMode =
      mode === "free"
        ? { kind: "free", keptPerAccompagnant, accompagnants }
        : mode === "targetRac"
        ? { kind: "targetRac", targetPerStudent: targetRac }
        : { kind: mode };
    const keptTotal = resolveKeptTotal(modeObj, base);
    return computeSimulation({ stay, rows: rowsConfig, keptTotal, selections });
  }, [rows, nights, programme, transport, atlasContractMode, mode, keptPerAccompagnant, accompagnants, targetRac]);

  const totalAlternants = rows.reduce((s, r) => s + Math.max(0, r.count), 0);
  const hasAtlas = rows.some((r) => r.id === "atlas");
  const available = OPCOS.filter((o) => !rows.some((r) => r.id === o.id));

  const addRow = () => {
    if (available.length) setRows((rs) => [...rs, { id: available[0].id, count: 1 }]);
  };
  const removeRow = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));
  const updateRow = (id: string, patch: Partial<RowState>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  async function saveSimulation() {
    setSaved("saving");
    const payload = {
      source: "simulateur financement",
      ecole, referent, email, telephone, destination, dateSouhaitee,
      nights, accompagnants, transport, programme,
      opco: rows, atlasContractMode, mode, keptPerAccompagnant, targetRac,
      result: {
        totalStudents: result.totalStudents,
        totalCostAll: result.totalCostAll,
        apprentiTotal: result.apprentiTotal,
        referentTotal: result.referentTotal,
        reinjected: result.reinjected,
        racAvg: result.racAvg,
        schoolImpact: result.schoolImpact,
      },
      date: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSaved(res.ok ? "ok" : "err");
    } catch {
      setSaved("err");
    }
  }

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100svh", fontFamily: "var(--font-manrope, system-ui, sans-serif)" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 50% -5%, rgba(75,118,240,0.14), transparent 60%)" }} />
      <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto", padding: "48px 24px 96px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.blue, boxShadow: "0 0 12px rgba(75,118,240,0.8)" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.faint }}>AMI Panorama · Internal</span>
        </div>
        <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, letterSpacing: "-0.04em", margin: "0 0 6px" }}>Simulateur de financement mobilité</h1>
        <p style={{ color: T.muted, fontSize: 15, maxWidth: 620, margin: "0 0 40px", lineHeight: 1.6 }}>
          Estimez le coût d&apos;une mobilité, les financements OPCO mobilisables et le reste à charge réel des étudiants — en quelques secondes.
        </p>

        {/* SECTION 1 */}
        <Section n="01" title="Informations générales">
          <Grid>
            <Field label="Nom de l'école"><Input value={ecole} onChange={setEcole} placeholder="Ex. CFA Excellence" /></Field>
            <Field label="Référent mobilité"><Input value={referent} onChange={setReferent} placeholder="Prénom Nom" /></Field>
            <Field label="Email"><Input value={email} onChange={setEmail} placeholder="referent@ecole.fr" /></Field>
            <Field label="Téléphone"><Input value={telephone} onChange={setTelephone} placeholder="Optionnel" /></Field>
            <Field label="Destination"><Input value={destination} onChange={setDestination} placeholder="Montréal" /></Field>
            <Field label="Date souhaitée"><Input value={dateSouhaitee} onChange={setDateSouhaitee} placeholder="Ex. Mars 2026" /></Field>
            <Field label="Nuitées sur place" hint={`${nights + 1} jours calendaires`}><NumInput value={nights} onChange={(v) => setNights(v)} /></Field>
            <Field label="Nombre d'accompagnants"><NumInput value={accompagnants} onChange={setAccompagnants} /></Field>
            <Field label="Prix moyen billet (avion/train)"><NumInput value={transport} onChange={setTransport} suffix="€" /></Field>
            <Field label="Coût programme / étudiant" hint={`suggéré : ${eur(suggestedProgramme)}`}>
              <NumInput value={programme} onChange={setProgramme} suffix="€" />
            </Field>
          </Grid>
        </Section>

        {/* SECTION 2 */}
        <Section n="02" title="Répartition OPCO" right={<span style={{ fontSize: 13, color: T.muted }}>Total : <b style={{ color: T.text }}>{totalAlternants}</b> alternants</span>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rows.map((r) => {
              const cfg = OPCO_BY_ID[r.id];
              return (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 40px", gap: 10, alignItems: "center" }}>
                  <select value={r.id} onChange={(e) => updateRow(r.id, { id: e.target.value })} style={selectStyle}>
                    {OPCOS.map((o) => (
                      <option key={o.id} value={o.id} disabled={o.id !== r.id && rows.some((x) => x.id === o.id)} style={{ background: "#12141C" }}>
                        {o.label}{o.status === "to_confirm" ? " · à confirmer" : ""}
                      </option>
                    ))}
                  </select>
                  <input type="number" min={0} value={r.count}
                    onChange={(e) => updateRow(r.id, { count: Number(e.target.value) || 0 })} style={{ ...inputStyle, textAlign: "center" }} />
                  <button onClick={() => removeRow(r.id)} title="Retirer" style={iconBtn}>✕</button>
                  {cfg?.status === "to_confirm" && <span style={{ gridColumn: "1 / -1", fontSize: 11, color: T.faint, marginTop: -2 }}>⚠︎ Règle estimée — à confirmer selon l&apos;OPCO, la durée et les justificatifs.</span>}
                </div>
              );
            })}
            <button onClick={addRow} disabled={!available.length} style={{ ...ghostBtn, alignSelf: "flex-start", marginTop: 4 }}>+ Ajouter un OPCO</button>
          </div>
        </Section>

        {/* SECTION 3 */}
        <Section n="03" title="Hypothèses financières">
          {hasAtlas && (
            <Field label="ATLAS — mode de contrat">
              <Toggle
                value={atlasContractMode}
                onChange={(v) => setAtlasContractMode(v as "miseADisposition" | "miseEnVeille")}
                options={[{ v: "miseADisposition", l: "Mise à disposition" }, { v: "miseEnVeille", l: "Mise en veille" }]}
              />
            </Field>
          )}
          <div style={{ marginTop: 18 }}>
            <Label>Mode d&apos;optimisation</Label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 8 }}>
              {MODES.map((m) => (
                <button key={m.kind} onClick={() => setMode(m.kind)} style={{
                  textAlign: "left", padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                  border: `1px solid ${mode === m.kind ? T.blue : T.border}`,
                  background: mode === m.kind ? "rgba(75,118,240,0.12)" : T.panel,
                  transition: "all 0.18s",
                }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 3, lineHeight: 1.4 }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {mode === "free" && (
            <div style={{ marginTop: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Label>Montant conservé par accompagnant</Label>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.blue }}>{eur(keptPerAccompagnant)}</span>
              </div>
              <input type="range" min={0} max={3000} step={50} value={keptPerAccompagnant}
                onChange={(e) => setKeptPerAccompagnant(Number(e.target.value))} style={{ width: "100%", accentColor: T.blue }} />
              <p style={{ fontSize: 12, color: T.faint, marginTop: 10, lineHeight: 1.6 }}>
                Une partie des financements référent mobilité peut être conservée pour couvrir l&apos;accompagnement et la coordination ({accompagnants} accompagnant·s → {eur(keptPerAccompagnant * accompagnants)} conservés). Le reste est réinjecté pour réduire le reste à charge des étudiants.
              </p>
            </div>
          )}
          {mode === "targetRac" && (
            <div style={{ marginTop: 22 }}>
              <Field label="Reste à charge étudiant cible"><NumInput value={targetRac} onChange={setTargetRac} suffix="€" /></Field>
            </div>
          )}

          <button onClick={scrollToResults} style={{ ...primaryBtn, marginTop: 24 }}>Calculer ma simulation →</button>
        </Section>

        {/* RESULTS */}
        <div ref={resultsRef} style={{ paddingTop: 8 }}>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, letterSpacing: "-0.035em", margin: "40px 0 6px" }}>Résultat de votre simulation</h2>
            <p style={{ color: T.muted, fontSize: 14, margin: "0 0 24px" }}>{result.totalStudents} étudiants · {nights + 1} jours · {destination || "—"}</p>

            {/* KPI hero */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14, marginBottom: 14 }} className="sim-hero">
              <Card accent={T.coral} big>
                <CardLabel>Reste à charge moyen / étudiant</CardLabel>
                <div style={{ fontSize: "clamp(36px,6vw,56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>{eur(result.racAvg)}</div>
                <div style={{ fontSize: 12.5, color: T.muted, marginTop: 8 }}>après financements OPCO et réinjection</div>
              </Card>
              <Card accent={result.schoolImpact >= 0 ? T.green : T.coral}>
                <CardLabel>Impact école</CardLabel>
                <div style={{ fontSize: "clamp(24px,4vw,34px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
                  {result.schoolImpact >= 0 ? "+ " : "− "}{eur(Math.abs(result.schoolImpact))}
                </div>
                <div style={{ fontSize: 12.5, color: T.muted, marginTop: 8 }}>{result.schoolImpact >= 0 ? "conservé par l'école (coordination)" : "reste à charge école"}</div>
              </Card>
            </div>

            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
              <MiniCard label="Coût total mobilité" value={eur(result.totalCostAll)} sub={`${eur(result.totalCostPerStudent)} / étudiant`} />
              <MiniCard label="Financements OPCO apprentis" value={eur(result.apprentiTotal)} sub={`${eur(result.financementMoyen)} / étudiant`} color={T.blue} />
              <MiniCard label="Financements référent mobilité" value={eur(result.referentTotal)} sub="prise en charge contrat" color={T.teal} />
              <MiniCard label="Montants réinjectés" value={eur(result.reinjected)} sub="pour réduire le RAC" color={T.green} />
            </div>

            {/* Donut composition */}
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "center", ...panelStyle, padding: 24, marginBottom: 14 }} className="sim-donut">
              <Donut
                segments={[
                  { label: "Financements apprentis", value: result.apprentiTotal, color: T.blue },
                  { label: "Référent réinjecté", value: result.reinjected, color: T.green },
                  { label: "Reste à charge étudiant", value: Math.max(0, result.racFinalTotal), color: T.coral },
                ]}
                total={result.totalCostAll}
              />
              <div>
                <CardLabel>Décomposition du coût total</CardLabel>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Financements apprentis", value: result.apprentiTotal, color: T.blue },
                    { label: "Référent réinjecté", value: result.reinjected, color: T.green },
                    { label: "Reste à charge étudiant", value: Math.max(0, result.racFinalTotal), color: T.coral },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                      <span style={{ color: T.muted, flex: 1 }}>{s.label}</span>
                      <b>{eur(s.value)}</b>
                      <span style={{ color: T.faint, width: 44, textAlign: "right" }}>{result.totalCostAll ? Math.round((s.value / result.totalCostAll) * 100) : 0}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Waterfall */}
            <div style={{ ...panelStyle, padding: 24, marginBottom: 14 }}>
              <CardLabel>Du coût initial au reste à charge</CardLabel>
              <Waterfall
                steps={[
                  { label: "Coût total", value: result.totalCostAll, kind: "total" },
                  { label: "− Financements apprentis", value: -result.apprentiTotal, kind: "down" },
                  { label: "− Réinjection référent", value: -result.reinjected, kind: "down" },
                  { label: "RAC étudiant", value: Math.max(0, result.racFinalTotal), kind: "final" },
                ]}
              />
            </div>

            {/* Per-OPCO breakdown + traces */}
            <div style={{ ...panelStyle, padding: 24, marginBottom: 20 }}>
              <CardLabel>Détail par OPCO — « pourquoi ce montant ? »</CardLabel>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {result.perOpco.map((o) => {
                  const maxA = Math.max(...result.perOpco.map((x) => x.apprentiAmount), 1);
                  return (
                    <div key={o.id} style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
                        <span style={{ minWidth: 150, fontWeight: 600 }}>{o.label}</span>
                        <span style={{ color: T.faint, minWidth: 78 }}>{o.count} apprenti·s</span>
                        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${(o.apprentiAmount / maxA) * 100}%`, height: "100%", background: T.blue, borderRadius: 4 }} />
                        </div>
                        <b style={{ minWidth: 78, textAlign: "right" }}>{eur(o.apprentiAmount)}</b>
                      </div>
                      <div style={{ fontSize: 11.5, color: T.faint, marginTop: 5, paddingLeft: 2 }}>
                        Apprenti : {o.apprentiTrace} · Référent : {eur(o.referentAmount)}/contrat
                        {o.status === "to_confirm" && " · ⚠︎ à confirmer"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={() => window.print()} style={primaryBtn}>Générer le PDF</button>
              <button onClick={saveSimulation} disabled={saved === "saving"} style={ghostBtn}>
                {saved === "saving" ? "Enregistrement…" : saved === "ok" ? "✓ Simulation enregistrée" : "Enregistrer la simulation"}
              </button>
              {saved === "err" && <span style={{ fontSize: 12.5, color: "#FF6B6B" }}>Échec de l&apos;enregistrement (réessayez).</span>}
            </div>

            {/* Disclaimer */}
            <p style={{ fontSize: 11.5, color: T.faint, marginTop: 24, lineHeight: 1.6, maxWidth: 720 }}>
              Certaines prises en charge sont estimées selon les règles actuellement utilisées par AMI Panorama et devront être confirmées selon l&apos;OPCO, la durée et les justificatifs. Simulation indicative, non contractuelle, susceptible d&apos;évoluer selon les règles OPCO en vigueur.
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .sim-hero { grid-template-columns: 1fr !important; }
          .sim-donut { grid-template-columns: 1fr !important; }
        }
        @media print {
          body { background: #fff !important; }
        }
      `}</style>
    </div>
  );
}

// ── Sous-composants UI ──
function Section({ n, title, right, children }: { n: string; title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ ...panelStyle, padding: 24, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.faint, letterSpacing: "0.1em" }}>{n}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>{children}</div>;
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
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={inputStyle} />;
}
function NumInput({ value, onChange, suffix }: { value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div style={{ position: "relative" }}>
      <input type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} style={inputStyle} />
      {suffix && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: T.faint }}>{suffix}</span>}
    </div>
  );
}
function Toggle({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div style={{ display: "inline-flex", background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 3 }}>
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{
          border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: value === o.v ? T.blue : "transparent", color: value === o.v ? "#fff" : T.muted, transition: "all 0.18s",
        }}>{o.l}</button>
      ))}
    </div>
  );
}
function Card({ children, accent, big }: { children: React.ReactNode; accent: string; big?: boolean }) {
  return (
    <div style={{ ...panelStyle, padding: big ? 28 : 22, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: accent }} />
      {children}
    </div>
  );
}
function MiniCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ ...panelStyle, padding: 18 }}>
      <CardLabel>{label}</CardLabel>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 6, color: color || T.text }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.faint, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
function CardLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: T.faint }}>{children}</div>;
}

function Donut({ segments, total }: { segments: { label: string; value: number; color: string }[]; total: number }) {
  const r = 70, sw = 22, C = 2 * Math.PI * r;
  const sum = Math.max(total, segments.reduce((s, x) => s + Math.max(0, x.value), 0), 1);
  let offset = 0;
  return (
    <svg viewBox="0 0 180 180" style={{ width: "100%", maxWidth: 220, margin: "0 auto", display: "block" }}>
      <g transform="rotate(-90 90 90)">
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
        {segments.map((s, i) => {
          const frac = Math.max(0, s.value) / sum;
          const len = frac * C;
          const el = (
            <motion.circle key={i} cx="90" cy="90" r={r} fill="none" stroke={s.color} strokeWidth={sw}
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} strokeLinecap="butt"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.1 }} />
          );
          offset += len;
          return el;
        })}
      </g>
      <text x="90" y="84" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">{eur(total)}</text>
      <text x="90" y="102" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="9">coût total</text>
    </svg>
  );
}

function Waterfall({ steps }: { steps: { label: string; value: number; kind: "total" | "down" | "final" }[] }) {
  const max = Math.max(...steps.map((s) => Math.abs(s.value)), 1);
  const colors = { total: "rgba(255,255,255,0.35)", down: "#4B76F0", final: "#E85835" };
  return (
    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((s) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13 }}>
          <span style={{ minWidth: 180, color: T.muted }}>{s.label}</span>
          <div style={{ flex: 1, height: 14, position: "relative" }}>
            <div style={{ width: `${(Math.abs(s.value) / max) * 100}%`, height: "100%", background: colors[s.kind], borderRadius: 4 }} />
          </div>
          <b style={{ minWidth: 90, textAlign: "right", color: s.kind === "final" ? "#E85835" : T.text }}>{eur(Math.abs(s.value))}</b>
        </div>
      ))}
    </div>
  );
}

// ── styles ──
const panelStyle: React.CSSProperties = { background: T.panel, border: `1px solid ${T.border}`, borderRadius: 18 };
const inputStyle: React.CSSProperties = {
  width: "100%", background: T.panel2, border: `1px solid ${T.border}`, borderRadius: 10,
  padding: "11px 13px", fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer", appearance: "none" };
const primaryBtn: React.CSSProperties = {
  border: "none", borderRadius: 10, cursor: "pointer", padding: "13px 24px",
  fontSize: 14, fontWeight: 600, color: "#fff", background: T.blue,
};
const ghostBtn: React.CSSProperties = {
  border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer", padding: "13px 20px",
  fontSize: 14, fontWeight: 500, color: T.text, background: "transparent",
};
const iconBtn: React.CSSProperties = {
  border: `1px solid ${T.border}`, borderRadius: 8, cursor: "pointer", height: 42,
  color: T.muted, background: "transparent", fontSize: 13,
};
