import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

export type ConfidenceLevel = "high" | "medium" | "low";

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
    /** Nombre d'accompagnateurs prévus. */
    companions?: number;
    /** Précision affichée sous la destination (ex. destination non choisie). */
    destinationNote?: string;
    /** Précision affichée à côté de la durée (ex. durée supposée). */
    durationNote?: string;
    /** Avertissement affiché en tête du résumé quand l'estimation est provisoire (ex. destination non choisie). */
    provisionalNote?: string;
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
    /** Reste à charge total après répartition. Absent : recalculé à partir des autres montants. */
    racFinalTotal?: number;
    confidence: { level: ConfidenceLevel; label: string; desc: string };
  };
  opco: {
    label: string; count: number; apprenti: number; referent: number; how: string; condition: string; toConfirm: boolean;
    /** Reste à charge par participant avant la part du budget référent redistribuée. */
    remaining?: number;
    source?: { label: string; url: string; checkedAt: string };
  }[];
  /** Hypothèses appliquées par la simulation. `toConfirm` = donnée inconnue ou supposée. */
  assumptions?: { label: string; value: string; detail?: string; toConfirm: boolean; provisional?: boolean }[];
}

const C = {
  ink: "#0B0B12",
  gray: "#6B7280",
  light: "#9AA0AA",
  line: "#E6E7EB",
  soft: "#F6F6F8",
  orange: "#76A3FF",
  blue: "#3B68D6",
  green: "#1FA97A",
  amber: "#E0A52E",
  red: "#E5484D",
};
const CONF: Record<ConfidenceLevel, string> = { high: C.green, medium: C.amber, low: C.red };

// Format monétaire SANS espace insécable étroite (non supportée par Helvetica → évite les glyphes parasites).
function eur(n: number): string {
  const sign = n < 0 ? "− " : "";
  const v = Math.round(Math.abs(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${v} €`;
}

/** Helvetica n'a pas d'espace insécable (fine ou non) : sans ce remplacement, « 1 000 € » s'imprime « 1/000 € ». */
function clean(text: string): string {
  // Deuxième correction : après « € », Helvetica avale l'espace suivant (« 250 €par participant »).
  // Un second espace rétablit l'écart normal.
  return text.replace(/[\u202f\u00a0]/g, " ").replace(/€ (?=\S)/g, "€  ");
}

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: C.ink, paddingTop: 44, paddingBottom: 60, paddingHorizontal: 50, lineHeight: 1.5 },
  cover: { fontFamily: "Helvetica", color: "#FFFFFF", backgroundColor: C.ink, paddingVertical: 54, paddingHorizontal: 50, height: "100%", justifyContent: "space-between" },
  coverLogo: { width: 168, height: 82, objectFit: "contain" },
  hdrLogo: { width: 96, height: 47, objectFit: "contain", marginBottom: 18 },
  bar: { width: 38, height: 3, backgroundColor: C.orange, marginTop: 14 },
  coverTitle: { fontSize: 28, fontFamily: "Helvetica-Bold", letterSpacing: -1, lineHeight: 1.18 },
  coverSub: { fontSize: 11, color: "#A2A8B4", marginTop: 12 },
  discBox: { borderWidth: 1, borderColor: "rgba(255,255,255,0.22)", borderRadius: 8, padding: 16, marginTop: 22 },
  discKicker: { fontSize: 8.5, letterSpacing: 1.6, fontFamily: "Helvetica-Bold", color: C.orange },
  discText: { fontSize: 8.5, color: "#C4C8D2", marginTop: 8, lineHeight: 1.55 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.14)", paddingTop: 9, marginTop: 9 },
  metaK: { fontSize: 9, color: "#8A90A0" },
  metaV: { fontSize: 10.5, color: "#FFFFFF", fontFamily: "Helvetica-Bold", maxWidth: 320, textAlign: "right" },
  eyebrow: { fontSize: 9, letterSpacing: 1.5, color: C.orange, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
  h2: { fontSize: 19, fontFamily: "Helvetica-Bold", letterSpacing: -0.5, marginTop: 6, marginBottom: 16 },
  intro: { fontSize: 10.5, color: C.gray, marginBottom: 18, lineHeight: 1.6 },
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  kpiCard: { width: "50%", paddingHorizontal: 6, marginBottom: 12 },
  kpiInner: { borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 18, height: 116 },
  kpiLabel: { fontSize: 8.5, letterSpacing: 0.6, color: C.gray, textTransform: "uppercase" },
  kpiValue: { fontSize: 23, fontFamily: "Helvetica-Bold", letterSpacing: -0.8, marginTop: 10 },
  kpiSub: { fontSize: 8.5, color: C.light, marginTop: 12 },
  confCard: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 14, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 7 },
  sw: { width: 8, height: 8, borderRadius: 2, marginRight: 8 },
  wfRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  wfLabel: { width: 170, color: C.gray, fontSize: 9.5 },
  wfVal: { width: 95, textAlign: "right", fontFamily: "Helvetica-Bold" },
  th: { fontSize: 8, color: C.gray, textTransform: "uppercase", letterSpacing: 0.4 },
  row: { flexDirection: "row", alignItems: "flex-start", borderTopWidth: 1, borderTopColor: C.line, paddingVertical: 9 },
  footer: { position: "absolute", top: 804, left: 50, right: 190, fontSize: 8, color: C.light },
  footerPage: { position: "absolute", top: 804, right: 50, width: 130, textAlign: "right", fontSize: 8, color: C.light },
  legalP: { fontSize: 10, color: "#3A3A40", marginBottom: 10, lineHeight: 1.65 },
  bullet: { flexDirection: "row", marginBottom: 7 },
  badge: { alignSelf: "flex-start", fontSize: 8.5, letterSpacing: 1.5, color: C.orange, borderWidth: 1, borderColor: C.orange, borderRadius: 4, paddingVertical: 4, paddingHorizontal: 9 },
  // Page pédagogique
  infoCard: { borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 16, marginBottom: 12 },
  infoHead: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoTitle: { fontSize: 11.5, fontFamily: "Helvetica-Bold", color: C.ink },
  infoBody: { fontSize: 9.5, color: "#3A3A40", lineHeight: 1.62 },
  infoStrong: { fontFamily: "Helvetica-Bold", color: C.ink },
  opcoCard: { borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 14, marginBottom: 11 },
  opcoKicker: { fontSize: 8, color: C.gray, textTransform: "uppercase", letterSpacing: 0.7 },
  opcoValue: { fontFamily: "Helvetica-Bold", fontSize: 18, color: C.blue, marginTop: 4 },
  // Barres de composition (remplace l'ancien donut)
  compRow: { marginBottom: 14 },
  compTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  compTrack: { height: 10, backgroundColor: C.soft, borderRadius: 3 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 11 },
  stepNumber: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.orange, color: "#FFFFFF", fontFamily: "Helvetica-Bold", fontSize: 10, textAlign: "center", paddingTop: 5, marginRight: 11 },
  stepTitle: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: C.ink },
  stepText: { fontSize: 9, color: C.gray, lineHeight: 1.5, marginTop: 2 },
  paymentCard: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 9, padding: 13 },
  paymentValue: { fontFamily: "Helvetica-Bold", fontSize: 18, color: C.blue },
  paymentLabel: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: C.ink, marginTop: 4 },
  paymentText: { fontSize: 8.5, color: C.gray, lineHeight: 1.45, marginTop: 4 },
});

function Footer() {
  // Le numéro de page est ancré par `top` : avec l'interligne défini sur la page, @react-pdf 4.5
  // n'imprime pas un texte dynamique (`render`) ancré par `bottom`.
  return (
    <>
      <Text style={s.footer} fixed>AMI Panorama, Simulation financière mobilité internationale · Estimation non contractuelle</Text>
      <Text style={s.footerPage} fixed render={({ pageNumber, totalPages }) => `${String(pageNumber).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")} · Confidentiel`} />
    </>
  );
}

export function SimulationDocument({ data }: { data: SimulationData }) {
  const { meta, kpis, opco } = data;

  // URLs absolues même origine (robuste pour @react-pdf en navigateur)
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const LOGO_WHITE = `${origin}/Assets/Brand/ami-logo-white.png`;
  const LOGO_BLACK = `${origin}/Assets/Brand/ami-logo-black.png`;

  const racFinalTotal = kpis.racFinalTotal ?? Math.max(0, kpis.coutBrut - kpis.financementsMobilisables);
  const comp = [
    { label: "Financements OPCO estimés pour les participants", value: kpis.apprentiTotal, color: C.blue },
    { label: "Part du budget référent utilisée pour réduire le reste à charge", value: kpis.reinjected, color: C.green },
    { label: "Reste à charge des participants", value: racFinalTotal, color: C.orange },
  ];
  const compTotal = Math.max(comp.reduce((a, b) => a + Math.max(0, b.value), 0), 1);
  const wfMax = Math.max(kpis.coutBrut, 1);
  const wf = [
    { label: "Coût brut du projet", value: kpis.coutBrut, color: "#C9CCD3", sign: "", final: false },
    { label: "Financements OPCO estimés", value: kpis.apprentiTotal, color: C.blue, sign: "− ", final: false },
    { label: "Budget référent redistribué", value: kpis.reinjected, color: C.green, sign: "− ", final: false },
    { label: "Reste à charge total", value: racFinalTotal, color: C.orange, sign: "= ", final: true },
  ];
  const assumptions = data.assumptions ?? [];
  const unknowns = assumptions.filter((a) => a.toConfirm);
  const sources = opco.flatMap((o) => (o.source ? [o.source] : [])).filter((src, i, all) => all.findIndex((x) => x.url === src.url) === i);
  const companions = meta.companions;
  const format = `${meta.students} participant${meta.students > 1 ? "s" : ""} · ${meta.days} jours${meta.durationNote ? ` (${meta.durationNote})` : ""}${companions !== undefined ? ` · ${companions} accompagnateur${companions > 1 ? "s" : ""}` : ""}`;

  return (
    <Document title={`AMI Panorama, Simulation ${meta.etablissement}`} author="AMI Panorama">
      {/* PAGE 1, COUVERTURE */}
      <Page size="A4" style={s.cover}>
        <View>
          <Image src={LOGO_WHITE} style={s.coverLogo} />
          <View style={s.bar} />
        </View>
        <View>
          <Text style={s.coverTitle}>Simulation financière</Text>
          <Text style={[s.coverTitle, { color: C.orange }]}>Mobilité internationale</Text>
          <Text style={s.coverSub}>Document de conseil préparé pour {meta.etablissement}.</Text>
          <View style={s.discBox}>
            <Text style={s.discKicker}>CONFIDENTIEL · ESTIMATION · NON CONTRACTUEL</Text>
            <Text style={s.discText}>
              Cette simulation constitue une estimation préparée par AMI Panorama à partir des informations communiquées et des règles de financement connues à la date de génération. Les montants présentés sont indicatifs et demeurent soumis à validation par les OPCO et organismes compétents. Aucun financement n’est garanti.
            </Text>
          </View>
        </View>
        <View>
          <View style={s.metaRow}><Text style={s.metaK}>Établissement</Text><Text style={s.metaV}>{meta.etablissement}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Destination</Text><Text style={s.metaV}>{meta.destination || "Non renseignée"}{meta.destinationNote ? ` (${meta.destinationNote})` : ""}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Format</Text><Text style={s.metaV}>{format}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Date souhaitée</Text><Text style={s.metaV}>{meta.dateSouhaitee || "Non renseignée"}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Généré le</Text><Text style={s.metaV}>{meta.generatedAt}</Text></View>
        </View>
      </Page>

      {/* PAGE 2, RÉSUMÉ EXÉCUTIF */}
      <Page size="A4" style={s.page}>
        <Image src={LOGO_BLACK} style={s.hdrLogo} />
        <Text style={s.eyebrow}>Résumé exécutif</Text>
        <Text style={s.h2}>L&apos;essentiel en un coup d&apos;œil</Text>
        {meta.provisionalNote && (
          <View style={{ marginBottom: 14, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: C.amber, backgroundColor: "#FFF6E8" }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: C.amber, letterSpacing: 0.8 }}>ESTIMATION PROVISOIRE</Text>
            <Text style={{ fontSize: 9.5, color: "#3A3A40", lineHeight: 1.55, marginTop: 4 }}>{clean(meta.provisionalNote)}</Text>
          </View>
        )}
        <View style={s.kpiGrid}>
          <View style={s.kpiCard}><View style={[s.kpiInner, { backgroundColor: C.ink, borderColor: C.ink }]}>
            <Text style={[s.kpiLabel, { color: "#A2A8B4" }]}>Reste à payer estimé par participant</Text>
            <Text style={[s.kpiValue, { color: "#FFFFFF" }]}>{eur(kpis.racAvg)}</Text>
            <Text style={[s.kpiSub, { color: "#8A90A0" }]}>après les financements estimés et le budget d’accompagnement</Text>
          </View></View>
          <View style={s.kpiCard}><View style={s.kpiInner}>
            <Text style={s.kpiLabel}>Financements OPCO estimés</Text>
            <Text style={[s.kpiValue, { color: C.green }]}>{eur(kpis.apprentiTotal)}</Text>
            <Text style={s.kpiSub}>pour les participants, sous réserve d’accord</Text>
          </View></View>
          <View style={s.kpiCard}><View style={s.kpiInner}>
            <Text style={s.kpiLabel}>Forfaits référent mobilité</Text>
            <Text style={[s.kpiValue, { color: C.ink }]}>{eur(kpis.referentTotal)}</Text>
            <Text style={s.kpiSub}>organisation et accompagnement par l’établissement</Text>
          </View></View>
          <View style={s.kpiCard}><View style={s.kpiInner}>
            <Text style={s.kpiLabel}>Budget réservé à l’accompagnement</Text>
            <Text style={[s.kpiValue, { color: kpis.montantConserve >= 0 ? C.ink : C.orange }]}>{eur(kpis.montantConserve)}</Text>
            <Text style={s.kpiSub}>{kpis.montantConserve > 0 ? clean(`accompagnateurs et coordination${companions ? ` · ${eur(kpis.montantConserve / companions)} par accompagnateur` : ""}`) : "tout le budget référent réduit le reste à charge"}</Text>
          </View></View>
        </View>

        <View style={s.confCard}>
          <View style={[s.dot, { backgroundColor: CONF[kpis.confidence.level] }]} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{kpis.confidence.label}</Text>
            <Text style={{ fontSize: 9, color: C.gray, marginTop: 2 }}>{clean(kpis.confidence.desc)}</Text>
          </View>
          <Text style={{ fontSize: 8, color: C.light }}>Niveau de fiabilité</Text>
        </View>
        <View style={{ marginTop: 14, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 4 }}>
          {[
            ["Coût estimé du séjour par participant", eur(kpis.coutParEtudiant)],
            ["Coût brut total du projet", eur(kpis.coutBrut)],
            ["Part du budget référent utilisée pour réduire le reste à charge", eur(kpis.reinjected)],
            ["Reste à charge total", eur(racFinalTotal)],
          ].map(([label, value], i) => (
            <View key={label} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 7, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
              <Text style={{ fontSize: 9.5, color: C.gray, flex: 1, paddingRight: 10 }}>{label}</Text>
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>{value}</Text>
            </View>
          ))}
        </View>
        <Footer />
      </Page>

      {/* PAGE 3, COMPRENDRE LA MOBILITÉ ET SES FINANCEMENTS */}
      <Page size="A4" style={s.page}>
        <Image src={LOGO_BLACK} style={s.hdrLogo} />
        <Text style={s.eyebrow}>Comprendre</Text>
        <Text style={s.h2}>La mobilité et ses financements</Text>
        <Text style={s.intro}>
          La mobilité internationale peut ouvrir droit à des financements, mais aucun montant n&apos;est automatique. Cette simulation aide à préparer un dossier : elle sépare ce qui peut financer les alternants de ce qui accompagne le travail du CFA.
        </Text>

        <View style={s.infoCard}>
          <View style={s.infoHead}>
            <View style={[s.sw, { backgroundColor: C.green, width: 10, height: 10, borderRadius: 3 }]} />
            <Text style={s.infoTitle}>Prise en charge du référent mobilité</Text>
          </View>
          <Text style={s.infoBody}>Montant alloué par l&apos;OPCO au CFA (Centre de Formation d&apos;Apprentis) pour accompagner la mise en œuvre des mobilités étudiantes. Il peut financer l&apos;organisation, la coordination, le suivi, la préparation des participants et les dépenses liées au projet.</Text>
          <Text style={[s.infoBody, { marginTop: 6 }]}><Text style={s.infoStrong}>À retenir. </Text>Son affectation doit respecter les conditions de l&apos;OPCO et les justificatifs à conserver. Il ne constitue pas une marge libre.</Text>
        </View>

        <View style={s.infoCard}>
          <View style={s.infoHead}>
            <View style={[s.sw, { backgroundColor: C.blue, width: 10, height: 10, borderRadius: 3 }]} />
            <Text style={s.infoTitle}>Prise en charge de l&apos;apprenti·e</Text>
          </View>
          <Text style={s.infoBody}>Montant pris en charge par l&apos;OPCO pour chaque apprenti·e dans le cadre d&apos;une mobilité à l&apos;étranger. Cette aide peut couvrir tout ou partie du transport, de l&apos;hébergement, de l&apos;assurance et de la restauration. Elle est généralement versée au CFA, qui l&apos;utilise pour organiser la mobilité ou la redistribue.</Text>
          <Text style={[s.infoBody, { marginTop: 6 }]}><Text style={s.infoStrong}>Objectif. </Text>Réduire le reste à charge de l&apos;apprenti·e et faciliter son départ à l&apos;international.</Text>
        </View>

        <View style={s.infoCard}>
          <View style={s.infoHead}>
            <View style={[s.sw, { backgroundColor: C.orange, width: 10, height: 10, borderRadius: 3 }]} />
            <Text style={s.infoTitle}>Réinjection et reste à charge</Text>
          </View>
          <Text style={s.infoBody}>
            Dans cette simulation, le CFA peut affecter une part du budget référent à la réduction du reste à charge, sans dépasser le coût restant. Les financements utilisés pour les participants sont également plafonnés au prix estimé du séjour. Le <Text style={s.infoStrong}>reste à charge moyen par participant</Text> correspond au coût estimé après les financements modélisés. Il demeure conditionnel à l&apos;accord de l&apos;OPCO et à la validation du dossier.
          </Text>
        </View>

        <Footer />
      </Page>

      {/* PAGE 4, PARCOURS DE CONFIRMATION */}
      <Page size="A4" style={s.page}>
        <Image src={LOGO_BLACK} style={s.hdrLogo} />
        <Text style={s.eyebrow}>Passer de l&apos;estimation au départ</Text>
        <Text style={s.h2}>Les 5 étapes de votre projet</Text>
        <Text style={s.intro}>Un parcours simple pour fiabiliser le budget, réserver le séjour et finaliser le dossier de mobilité.</Text>
        {[
          ["Identifier les OPCO", "Renseignez la répartition du groupe dans le simulateur pour obtenir une première estimation des financements."],
          ["Demander les devis de transport", "Confirmez le coût réel du transport afin d’affiner le budget du séjour."],
          ["Choisir les dates", "Validez le devis et bloquez les dates du groupe avec AMI Panorama."],
          ["Finaliser le dossier", "Faites signer les conventions de mobilité et réunissez les documents demandés."],
          ["Confirmer le départ", "Une fois les conventions et les documents signés, le groupe est prêt à partir."],
        ].map(([title, text], index) => (
          <View key={title} style={s.stepRow} wrap={false}>
            <Text style={s.stepNumber}>{index + 1}</Text>
            <View style={{ flex: 1, paddingTop: 1 }}>
              <Text style={s.stepTitle}>{title}</Text>
              <Text style={s.stepText}>{text}</Text>
            </View>
          </View>
        ))}

        <Text style={[s.eyebrow, { marginTop: 13, marginBottom: 10 }]}>Un règlement progressif et flexible</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={s.paymentCard} wrap={false}>
            <Text style={s.paymentValue}>10 %</Text>
            <Text style={s.paymentLabel}>Pour bloquer les dates</Text>
            <Text style={s.paymentText}>Premier acompte demandé après la sélection du devis et des dates.</Text>
          </View>
          <View style={s.paymentCard} wrap={false}>
            <Text style={s.paymentValue}>50 %</Text>
            <Text style={s.paymentLabel}>À 45 jours du départ</Text>
            <Text style={s.paymentText}>Deuxième acompte. Les conditions d&apos;annulation s&apos;appliquent à partir de cette échéance.</Text>
          </View>
        </View>
        <View style={[s.infoCard, { backgroundColor: C.soft, marginTop: 12, marginBottom: 0, padding: 12 }]} wrap={false}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5 }}>Ajustement des groupes</Text>
          <Text style={[s.infoBody, { fontSize: 8.7, marginTop: 4 }]}>Avant J-45, les annulations de groupes restent possibles. Toute variation d&apos;effectif supérieure à 20 % doit être signalée avant cette date et sera étudiée au cas par cas. Selon le calendrier des financements, les règlements peuvent intervenir plus tôt. AMI Panorama propose des délais de paiement flexibles.</Text>
        </View>
        <Footer />
      </Page>

      {/* PAGE 5, ANALYSE FINANCIÈRE (barres, sans pie chart) */}
      <Page size="A4" style={s.page}>
        <Image src={LOGO_BLACK} style={s.hdrLogo} />
        <Text style={s.eyebrow}>Analyse financière</Text>
        <Text style={s.h2}>Décomposition du coût</Text>
        <View style={{ marginTop: 4 }}>
          {comp.map((c) => {
            const pct = Math.max(2, (Math.max(0, c.value) / compTotal) * 100);
            return (
              <View key={c.label} style={s.compRow}>
                <View style={s.compTop}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={[s.sw, { backgroundColor: c.color }]} />
                    <Text style={{ color: C.gray, fontSize: 9.5 }}>{c.label}</Text>
                  </View>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>{eur(c.value)}</Text>
                </View>
                <View style={s.compTrack}>
                  <View style={{ width: `${pct}%`, height: 10, backgroundColor: c.color, borderRadius: 3 }} />
                </View>
              </View>
            );
          })}
        </View>

        <Text style={[s.eyebrow, { marginTop: 26 }]}>Du coût brut au reste à charge</Text>
        <View style={{ marginTop: 16 }}>
          {wf.map((w) => (
            <View key={w.label} style={s.wfRow}>
              <Text style={s.wfLabel}>{w.sign}{w.label}</Text>
              <View style={{ flex: 1, height: 12, justifyContent: "center" }}>
                <View style={{ width: `${Math.max(2, (Math.abs(w.value) / wfMax) * 100)}%`, height: 12, backgroundColor: w.color, borderRadius: 3 }} />
              </View>
              <Text style={[s.wfVal, { color: w.final ? C.orange : C.ink }]}>{eur(w.value)}</Text>
            </View>
          ))}
        </View>
        <Footer />
      </Page>

      {/* OPCO EXPLIQUÉS : les cartes se répartissent seules sur autant de pages que nécessaire */}
      {opco.length > 0 && (
        <Page size="A4" style={s.page}>
          <Image src={LOGO_BLACK} style={s.hdrLogo} fixed />
          <Text style={s.eyebrow}>OPCO par OPCO</Text>
          <Text style={s.h2}>Comprendre chaque financement</Text>
          <Text style={s.intro}>Chaque bloc explique simplement ce qui est estimé, la façon dont l&apos;OPCO peut intervenir et le point à vérifier avant de compter ce financement.</Text>
          {opco.map((o, i) => (
            <View key={i} style={s.opcoCard} wrap={false}>
              <View>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 12 }}>{o.label}</Text>
                <Text style={{ fontSize: 8.5, color: C.gray, marginTop: 3 }}>{o.count} participant{o.count > 1 ? "s" : ""} concerné{o.count > 1 ? "s" : ""}</Text>
              </View>
              <View style={{ marginTop: 9, borderWidth: 1, borderColor: C.line, borderRadius: 7 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7, paddingHorizontal: 9 }}>
                  <Text style={s.opcoKicker}>Financement estimé du participant</Text>
                  <Text style={[s.opcoValue, { fontSize: 13, marginTop: 0 }]}>{clean(`${eur(o.apprenti)} / participant`)}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7, paddingHorizontal: 9, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: "#F0FDF9" }}>
                  <Text style={s.opcoKicker}>Forfait référent mobilité estimé</Text>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 13, color: C.green }}>{clean(`${eur(o.referent)} / participant`)}</Text>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>Comment cela fonctionne</Text>
                <Text style={[s.infoBody, { fontSize: 9, marginTop: 3 }]}>{clean(o.how)}</Text>
              </View>
              <View style={{ marginTop: 8, padding: 9, borderRadius: 7, backgroundColor: o.toConfirm ? "#FFF6E8" : C.soft }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: o.toConfirm ? C.amber : C.gray }}>{o.toConfirm ? "À CONFIRMER AVANT DE COMPTER CE MONTANT" : "À PRÉVOIR DANS LE DOSSIER"}</Text>
                <Text style={{ fontSize: 8.7, color: "#3A3A40", lineHeight: 1.55, marginTop: 3 }}>{clean(o.condition)}</Text>
              </View>
              {o.remaining !== undefined && <Text style={{ fontSize: 8.7, color: "#3A3A40", marginTop: 8 }}>{clean(`Reste à charge estimé : ${eur(o.remaining)} par participant, avant la part du budget référent redistribuée par l’établissement.`)}</Text>}
              <Text style={{ fontSize: 8.5, color: C.gray, marginTop: 6 }}>Le forfait référent mobilité est destiné à la coordination et aux dépenses liées au projet. Il ne constitue pas une marge libre.</Text>
              {o.source && <Text style={{ fontSize: 8, color: C.light, marginTop: 5 }}>Source : {o.source.label}, vérifiée le {o.source.checkedAt}</Text>}
            </View>
          ))}
          <Footer />
        </Page>
      )}

      {/* HYPOTHÈSES, DONNÉES À CONFIRMER ET SOURCES */}
      {(assumptions.length > 0 || sources.length > 0) && (
        <Page size="A4" style={s.page}>
          <Image src={LOGO_BLACK} style={s.hdrLogo} fixed />
          <Text style={s.eyebrow}>Hypothèses utilisées</Text>
          <Text style={s.h2}>Sur quoi repose cette estimation</Text>
          <Text style={s.intro}>Chaque ligne ci-dessous est une hypothèse de travail, pas une donnée acquise. Les lignes marquées « à confirmer » correspondent à des informations inconnues ou supposées au moment de la simulation.</Text>
          {assumptions.map((a, i) => (
            <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", borderTopWidth: 1, borderTopColor: C.line, paddingVertical: 8 }} wrap={false}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9.5 }}>{clean(a.label)}</Text>
                {a.detail && <Text style={{ fontSize: 8.5, color: C.gray, lineHeight: 1.5, marginTop: 2 }}>{clean(a.detail)}</Text>}
              </View>
              <View style={{ width: 190, alignItems: "flex-end" }}>
                <Text style={{ fontSize: 9.5, textAlign: "right" }}>{clean(a.value)}</Text>
                {(a.toConfirm || a.provisional) && <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.amber, marginTop: 3, letterSpacing: 0.6 }}>{a.provisional ? "PROVISOIRE" : "À CONFIRMER"}</Text>}
              </View>
            </View>
          ))}
          {unknowns.length > 0 && (
            <View style={{ marginTop: 14, padding: 12, borderRadius: 8, backgroundColor: "#FFF6E8" }} wrap={false}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: C.amber }}>DONNÉES INCONNUES OU À CONFIRMER</Text>
              <Text style={{ fontSize: 9, color: "#3A3A40", lineHeight: 1.55, marginTop: 4 }}>{clean(unknowns.map((a) => a.label).join(" · "))}. Le résultat changera lorsque ces informations seront connues.</Text>
            </View>
          )}
          {sources.length > 0 && (
            <View style={{ marginTop: 16 }} wrap={false}>
              <Text style={[s.eyebrow, { marginBottom: 8 }]}>Sources officielles consultées</Text>
              {sources.map((src) => (
                <View key={src.url} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>{src.label} · vérifiée le {src.checkedAt}</Text>
                  <Text style={{ fontSize: 7.5, color: C.gray }}>{src.url}</Text>
                </View>
              ))}
            </View>
          )}
          <Footer />
        </Page>
      )}

      {/* MÉTHODOLOGIE */}
      <Page size="A4" style={s.page}>
        <Image src={LOGO_BLACK} style={s.hdrLogo} />
        <Text style={s.eyebrow}>Méthodologie</Text>
        <Text style={s.h2}>Ce que cette simulation fait, et ne fait pas</Text>
        <Text style={s.intro}>Cette simulation repose sur :</Text>
        {[
          "elle estime les montants à partir du groupe, de la destination et des règles connues à la date de génération ;",
          "elle montre distinctement le coût du séjour, l’aide potentielle des OPCO et le budget référent mobilité ;",
          "elle aide le CFA à préparer son échange avec AMI Panorama, son OPCO et ses partenaires ;",
          "elle ne vaut ni accord de prise en charge, ni confirmation de montant, ni convention de mobilité.",
        ].map((b, i) => (
          <View key={i} style={s.bullet}>
            <Text style={{ color: C.orange, marginRight: 8 }}>•</Text>
            <Text style={{ flex: 1, fontSize: 10.5, color: "#3A3A40" }}>{b}</Text>
          </View>
        ))}
        <Text style={[s.legalP, { marginTop: 14 }]}>Les financements définitifs demeurent soumis à validation par les organismes compétents.</Text>
        <Footer />
      </Page>

      {/* PAGE 7, MENTIONS */}
      <Page size="A4" style={s.page}>
        <Image src={LOGO_BLACK} style={s.hdrLogo} />
        <Text style={s.eyebrow}>Mentions importantes</Text>
        <Text style={s.h2}>Confidentialité et limites de la simulation</Text>
        <Text style={s.legalP}>Cette simulation a été préparée exclusivement pour l&apos;établissement concerné. Elle est strictement confidentielle et ne peut être diffusée sans l&apos;accord préalable d&apos;AMI Panorama.</Text>
        <Text style={s.legalP}>Les montants présentés constituent des estimations fondées sur les informations communiquées et sur les règles de financement connues à la date de génération du document. Les prises en charge définitives relèvent exclusivement des OPCO et organismes compétents.</Text>
        <Text style={s.legalP}>Ce document est généré automatiquement par un outil interne dont les barèmes et règles de financement sont mis à jour périodiquement. Ces mises à jour pouvant prendre du temps, certaines informations peuvent ne plus refléter les conditions ou montants les plus récents. Nous invitons chaque établissement à vérifier les conditions en vigueur auprès de son OPCO et à mener ses propres recherches avant toute décision.</Text>
        <Text style={s.legalP}>AMI Panorama agit comme accompagnateur et facilitateur de mobilité internationale. AMI Panorama ne fournit pas de conseil financier, fiscal ou juridique.</Text>
        <Text style={s.legalP}>AMI Panorama ne garantit aucun montant de financement et ne peut être tenu responsable d&apos;une décision prise uniquement sur la base de cette simulation.</Text>
        <Text style={s.legalP}>Chaque établissement demeure responsable de réaliser ses propres vérifications, analyses et démarches de validation avant toute décision.</Text>
        <View style={{ marginTop: 22 }}><Text style={s.badge}>CONFIDENTIEL</Text></View>
        <Footer />
      </Page>
    </Document>
  );
}
