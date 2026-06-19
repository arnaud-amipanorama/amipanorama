/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, View, Text, StyleSheet, Svg, Path, Rect } from "@react-pdf/renderer";

export interface SimulationData {
  meta: {
    etablissement: string;
    referent: string;
    email: string;
    destination: string;
    dateSouhaitee: string;
    generatedAt: string;
    students: number;
    days: number;
  };
  kpis: {
    racAvg: number;
    financementsMobilisables: number;
    montantConserve: number;
    coutBrut: number;
    coutParEtudiant: number;
    apprentiTotal: number;
    referentTotal: number;
    reinjected: number;
  };
  opco: { label: string; count: number; apprenti: number; referent: number; trace: string; toConfirm: boolean }[];
}

const C = {
  ink: "#0B0B12",
  paper: "#FFFFFF",
  gray: "#6B7280",
  light: "#9AA0AA",
  line: "#E6E7EB",
  soft: "#F6F6F8",
  orange: "#E85835",
  blue: "#3B68D6",
  green: "#1FA97A",
};

const eur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: C.ink, paddingTop: 54, paddingBottom: 56, paddingHorizontal: 54, lineHeight: 1.5 },
  cover: { fontFamily: "Helvetica", color: "#FFFFFF", backgroundColor: C.ink, padding: 54, height: "100%", justifyContent: "space-between" },
  wordmark: { fontSize: 15, fontFamily: "Helvetica-Bold", letterSpacing: 3, color: "#FFFFFF" },
  bar: { width: 38, height: 3, backgroundColor: C.orange, marginTop: 10 },
  coverTitle: { fontSize: 30, fontFamily: "Helvetica-Bold", letterSpacing: -1, lineHeight: 1.15 },
  coverSub: { fontSize: 11, color: "#A2A8B4", marginTop: 12 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.14)", paddingTop: 10, marginTop: 10 },
  metaK: { fontSize: 9, color: "#8A90A0" },
  metaV: { fontSize: 11, color: "#FFFFFF", fontFamily: "Helvetica-Bold" },
  badge: { alignSelf: "flex-start", fontSize: 8.5, letterSpacing: 1.5, color: C.orange, borderWidth: 1, borderColor: C.orange, borderRadius: 4, paddingVertical: 4, paddingHorizontal: 9 },
  eyebrow: { fontSize: 9, letterSpacing: 1.5, color: C.orange, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
  h2: { fontSize: 20, fontFamily: "Helvetica-Bold", letterSpacing: -0.5, marginTop: 6, marginBottom: 18 },
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  kpiCard: { width: "50%", paddingHorizontal: 6, marginBottom: 12 },
  kpiInner: { borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 16 },
  kpiLabel: { fontSize: 8.5, letterSpacing: 0.8, color: C.gray, textTransform: "uppercase" },
  kpiValue: { fontSize: 26, fontFamily: "Helvetica-Bold", letterSpacing: -1, marginTop: 6 },
  kpiSub: { fontSize: 9, color: C.light, marginTop: 3 },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 2, marginRight: 8 },
  rowLine: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: C.line, paddingVertical: 8 },
  footer: { position: "absolute", bottom: 26, left: 54, right: 54, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: C.light },
  legalP: { fontSize: 10, color: "#333", marginBottom: 9, lineHeight: 1.6 },
});

function Footer({ p }: { p: string }) {
  return (
    <View style={s.footer} fixed>
      <Text>AMI Panorama — Simulation financière mobilité internationale</Text>
      <Text>{p} · Confidentiel</Text>
    </View>
  );
}

// Donut (arcs stroke) ---------------------------------------------------------
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function arc(cx: number, cy: number, r: number, start: number, end: number) {
  const e = polar(cx, cy, r, end);
  const st = polar(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${st.x} ${st.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}
function Donut({ segments }: { segments: { value: number; color: string }[] }) {
  const total = Math.max(segments.reduce((a, b) => a + Math.max(0, b.value), 0), 1);
  let acc = 0;
  return (
    <Svg width={150} height={150} viewBox="0 0 160 160">
      <Path d={arc(80, 80, 60, 0.001, 359.999)} stroke={C.soft} strokeWidth={22} fill="none" />
      {segments.map((seg, i) => {
        const a0 = (acc / total) * 360;
        acc += Math.max(0, seg.value);
        const a1 = (acc / total) * 360;
        if (a1 - a0 < 0.5) return null;
        return <Path key={i} d={arc(80, 80, 60, a0, Math.min(a1, 359.99))} stroke={seg.color} strokeWidth={22} fill="none" />;
      })}
    </Svg>
  );
}

export function SimulationDocument({ data }: { data: SimulationData }) {
  const { meta, kpis, opco } = data;
  const racFinalTotal = Math.max(0, kpis.coutBrut - kpis.financementsMobilisables);
  const comp = [
    { label: "Financements apprentis", value: kpis.apprentiTotal, color: C.blue },
    { label: "Réinjectés pour réduire le reste à charge", value: kpis.reinjected, color: C.green },
    { label: "Reste à charge étudiant", value: racFinalTotal, color: C.orange },
  ];
  const wfMax = Math.max(kpis.coutBrut, 1);
  const wf = [
    { label: "Coût brut", value: kpis.coutBrut, color: "#C9CCD3" },
    { label: "− Financements apprentis", value: kpis.apprentiTotal, color: C.blue },
    { label: "− Réinjection référent", value: kpis.reinjected, color: C.green },
    { label: "Reste à charge étudiant", value: racFinalTotal, color: C.orange },
  ];

  return (
    <Document title={`AMI Panorama — Simulation ${meta.etablissement}`} author="AMI Panorama">
      {/* PAGE 1 — COUVERTURE */}
      <Page size="A4" style={s.cover}>
        <View>
          <Text style={s.wordmark}>AMI PANORAMA</Text>
          <View style={s.bar} />
        </View>
        <View>
          <Text style={[s.coverTitle, { color: "#FFFFFF" }]}>Simulation financière</Text>
          <Text style={[s.coverTitle, { color: C.orange }]}>Mobilité internationale</Text>
          <Text style={s.coverSub}>Document de conseil préparé pour {meta.etablissement}.</Text>
        </View>
        <View>
          <View style={s.metaRow}><Text style={s.metaK}>Établissement</Text><Text style={s.metaV}>{meta.etablissement}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Destination</Text><Text style={s.metaV}>{meta.destination || "—"}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Format</Text><Text style={s.metaV}>{meta.students} étudiants · {meta.days} jours</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Date souhaitée</Text><Text style={s.metaV}>{meta.dateSouhaitee || "—"}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Généré le</Text><Text style={s.metaV}>{meta.generatedAt}</Text></View>
          <View style={{ marginTop: 22 }}><Text style={s.badge}>CONFIDENTIEL</Text></View>
        </View>
      </Page>

      {/* PAGE 2 — RÉSUMÉ EXÉCUTIF */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Résumé exécutif</Text>
        <Text style={s.h2}>L&apos;essentiel en un coup d&apos;œil</Text>
        <View style={s.kpiGrid}>
          <View style={s.kpiCard}><View style={[s.kpiInner, { backgroundColor: C.ink }]}>
            <Text style={[s.kpiLabel, { color: "#A2A8B4" }]}>Reste à charge moyen étudiant</Text>
            <Text style={[s.kpiValue, { color: "#FFFFFF" }]}>{eur(kpis.racAvg)}</Text>
            <Text style={[s.kpiSub, { color: "#8A90A0" }]}>après financements et réinjection</Text>
          </View></View>
          <View style={s.kpiCard}><View style={s.kpiInner}>
            <Text style={s.kpiLabel}>Financements mobilisables</Text>
            <Text style={[s.kpiValue, { color: C.green }]}>{eur(kpis.financementsMobilisables)}</Text>
            <Text style={s.kpiSub}>OPCO apprentis + réinjection</Text>
          </View></View>
          <View style={s.kpiCard}><View style={s.kpiInner}>
            <Text style={s.kpiLabel}>{kpis.montantConserve >= 0 ? "Montant conservé par l'établissement" : "Reste à charge établissement"}</Text>
            <Text style={[s.kpiValue, { color: kpis.montantConserve >= 0 ? C.ink : C.orange }]}>{kpis.montantConserve >= 0 ? "+ " : "− "}{eur(Math.abs(kpis.montantConserve))}</Text>
            <Text style={s.kpiSub}>financements référent conservés</Text>
          </View></View>
          <View style={s.kpiCard}><View style={s.kpiInner}>
            <Text style={s.kpiLabel}>Coût brut total</Text>
            <Text style={[s.kpiValue, { color: C.ink }]}>{eur(kpis.coutBrut)}</Text>
            <Text style={s.kpiSub}>{eur(kpis.coutParEtudiant)} / étudiant</Text>
          </View></View>
        </View>
        <Footer p="02" />
      </Page>

      {/* PAGE 3 — ANALYSE FINANCIÈRE */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Analyse financière</Text>
        <Text style={s.h2}>Décomposition du coût</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Donut segments={comp} />
          <View style={{ flex: 1, paddingLeft: 24 }}>
            {comp.map((c) => (
              <View key={c.label} style={s.legendRow}>
                <View style={[s.dot, { backgroundColor: c.color }]} />
                <Text style={{ flex: 1, color: C.gray }}>{c.label}</Text>
                <Text style={{ fontFamily: "Helvetica-Bold" }}>{eur(c.value)}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[s.eyebrow, { marginTop: 30 }]}>Du coût brut au reste à charge</Text>
        <View style={{ marginTop: 14 }}>
          {wf.map((w) => (
            <View key={w.label} style={{ flexDirection: "row", alignItems: "center", marginBottom: 9 }}>
              <Text style={{ width: 180, color: C.gray }}>{w.label}</Text>
              <View style={{ flex: 1, height: 12, justifyContent: "center" }}>
                <View style={{ width: `${(Math.abs(w.value) / wfMax) * 100}%`, height: 12, backgroundColor: w.color, borderRadius: 3 }} />
              </View>
              <Text style={{ width: 80, textAlign: "right", fontFamily: "Helvetica-Bold", color: w.color === C.orange ? C.orange : C.ink }}>{eur(Math.abs(w.value))}</Text>
            </View>
          ))}
        </View>
        <Footer p="03" />
      </Page>

      {/* PAGE 4 — DÉTAIL OPCO */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Détail par OPCO</Text>
        <Text style={s.h2}>Hypothèses de prise en charge</Text>
        <View style={{ flexDirection: "row", paddingBottom: 6 }}>
          <Text style={{ width: "32%", fontSize: 8.5, color: C.gray, textTransform: "uppercase" }}>OPCO</Text>
          <Text style={{ width: "12%", fontSize: 8.5, color: C.gray, textTransform: "uppercase" }}>Alt.</Text>
          <Text style={{ width: "20%", fontSize: 8.5, color: C.gray, textTransform: "uppercase" }}>Apprenti</Text>
          <Text style={{ width: "16%", fontSize: 8.5, color: C.gray, textTransform: "uppercase" }}>Référent</Text>
          <Text style={{ width: "20%", fontSize: 8.5, color: C.gray, textTransform: "uppercase", textAlign: "right" }}>Total</Text>
        </View>
        {opco.map((o, i) => (
          <View key={i} style={s.rowLine} wrap={false}>
            <View style={{ width: "32%" }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10 }}>{o.label}{o.toConfirm ? " *" : ""}</Text>
              <Text style={{ fontSize: 7.5, color: C.light, marginTop: 2 }}>{o.trace}</Text>
            </View>
            <Text style={{ width: "12%" }}>{o.count}</Text>
            <Text style={{ width: "20%" }}>{eur(o.apprenti)}/étud.</Text>
            <Text style={{ width: "16%" }}>{eur(o.referent)}</Text>
            <Text style={{ width: "20%", textAlign: "right", fontFamily: "Helvetica-Bold" }}>{eur(o.apprenti * o.count)}</Text>
          </View>
        ))}
        <Text style={{ fontSize: 8, color: C.light, marginTop: 14 }}>* Règle estimée selon les pratiques AMI Panorama, à confirmer selon l&apos;OPCO, la durée et les justificatifs.</Text>
        <Footer p="04" />
      </Page>

      {/* PAGE 5 — MENTIONS */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>Mentions importantes</Text>
        <Text style={s.h2}>Confidentialité et limites de la simulation</Text>
        <Text style={s.legalP}>Cette simulation a été préparée exclusivement pour l&apos;établissement concerné. Elle est strictement confidentielle et ne peut être diffusée sans l&apos;accord préalable d&apos;AMI Panorama.</Text>
        <Text style={s.legalP}>Les montants présentés constituent des estimations fondées sur les informations communiquées et sur les règles de financement connues à la date de génération du document. Les prises en charge définitives relèvent exclusivement des OPCO et organismes compétents.</Text>
        <Text style={s.legalP}>AMI Panorama agit comme accompagnateur et facilitateur de mobilité internationale. AMI Panorama ne fournit pas de conseil financier, fiscal ou juridique.</Text>
        <Text style={s.legalP}>AMI Panorama ne garantit aucun montant de financement et ne peut être tenu responsable d&apos;une décision prise uniquement sur la base de cette simulation.</Text>
        <Text style={s.legalP}>Chaque établissement demeure responsable de réaliser ses propres vérifications, analyses et démarches de validation avant toute décision.</Text>
        <View style={{ marginTop: 24 }}><Text style={s.badge}>CONFIDENTIEL</Text></View>
        <Footer p="05" />
      </Page>
    </Document>
  );
}
