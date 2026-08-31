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
    confidence: { level: ConfidenceLevel; label: string; desc: string };
  };
  opco: { label: string; count: number; apprenti: number; referent: number; how: string; condition: string; toConfirm: boolean }[];
}

const C = {
  ink: "#0B0B12",
  gray: "#6B7280",
  light: "#9AA0AA",
  line: "#E6E7EB",
  soft: "#F6F6F8",
  orange: "#2547C7",
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
  footer: { position: "absolute", bottom: 26, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: C.light },
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
});

function Footer({ p }: { p: string }) {
  return (
    <View style={s.footer} fixed>
      <Text>AMI Panorama, Simulation financière mobilité internationale</Text>
      <Text>{p} · Confidentiel</Text>
    </View>
  );
}

export function SimulationDocument({ data }: { data: SimulationData }) {
  const { meta, kpis, opco } = data;

  // URLs absolues même origine (robuste pour @react-pdf en navigateur)
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const LOGO_WHITE = `${origin}/Assets/Brand/ami-logo-white.png`;
  const LOGO_BLACK = `${origin}/Assets/Brand/ami-logo-black.png`;

  const racFinalTotal = Math.max(0, kpis.coutBrut - kpis.financementsMobilisables);
  const comp = [
    { label: "Financements apprentis", value: kpis.apprentiTotal, color: C.blue },
    { label: "Réinjectés afin de réduire le reste à charge", value: kpis.reinjected, color: C.green },
    { label: "Reste à charge étudiant", value: racFinalTotal, color: C.orange },
  ];
  const compTotal = Math.max(comp.reduce((a, b) => a + Math.max(0, b.value), 0), 1);
  const wfMax = Math.max(kpis.coutBrut, 1);
  const wf = [
    { label: "Coût brut", value: kpis.coutBrut, color: "#C9CCD3", final: false },
    { label: "Financements apprentis", value: kpis.apprentiTotal, color: C.blue, final: false },
    { label: "Réinjection référent", value: kpis.reinjected, color: C.green, final: false },
    { label: "Reste à charge étudiant", value: racFinalTotal, color: C.orange, final: true },
  ];
  const opcoChunks = Array.from({ length: Math.ceil(opco.length / 3) }, (_, index) => opco.slice(index * 3, index * 3 + 3));
  const methodologyPage = 5 + opcoChunks.length;
  const mentionsPage = methodologyPage + 1;

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
              Cette simulation constitue une estimation préparée par AMI Panorama à partir des informations communiquées et des règles de financement connues à la date de génération. Les montants présentés sont indicatifs et demeurent soumis à validation par les OPCO et organismes compétents.
            </Text>
          </View>
        </View>
        <View>
          <View style={s.metaRow}><Text style={s.metaK}>Établissement</Text><Text style={s.metaV}>{meta.etablissement}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Destination</Text><Text style={s.metaV}>{meta.destination || "Non renseignée"}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Format</Text><Text style={s.metaV}>{meta.students} étudiants · {meta.days} jours</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Date souhaitée</Text><Text style={s.metaV}>{meta.dateSouhaitee || "Non renseignée"}</Text></View>
          <View style={s.metaRow}><Text style={s.metaK}>Généré le</Text><Text style={s.metaV}>{meta.generatedAt}</Text></View>
        </View>
      </Page>

      {/* PAGE 2, RÉSUMÉ EXÉCUTIF */}
      <Page size="A4" style={s.page}>
        <Image src={LOGO_BLACK} style={s.hdrLogo} />
        <Text style={s.eyebrow}>Résumé exécutif</Text>
        <Text style={s.h2}>L&apos;essentiel en un coup d&apos;œil</Text>
        <View style={s.kpiGrid}>
          <View style={s.kpiCard}><View style={[s.kpiInner, { backgroundColor: C.ink, borderColor: C.ink }]}>
            <Text style={[s.kpiLabel, { color: "#A2A8B4" }]}>Reste à charge moyen étudiant</Text>
            <Text style={[s.kpiValue, { color: "#FFFFFF" }]}>{eur(kpis.racAvg)}</Text>
            <Text style={[s.kpiSub, { color: "#8A90A0" }]}>après financements et réinjection</Text>
          </View></View>
          <View style={s.kpiCard}><View style={s.kpiInner}>
            <Text style={s.kpiLabel}>Financements mobilisables</Text>
            <Text style={[s.kpiValue, { color: C.green }]}>{eur(kpis.financementsMobilisables)}</Text>
            <Text style={s.kpiSub}>OPCO apprentis et réinjection</Text>
          </View></View>
          <View style={s.kpiCard}><View style={s.kpiInner}>
            <Text style={s.kpiLabel}>Budget référent affecté au CFA</Text>
            <Text style={[s.kpiValue, { color: kpis.montantConserve >= 0 ? C.ink : C.orange }]}>{eur(kpis.montantConserve)}</Text>
            <Text style={s.kpiSub}>coordination et accompagnement à justifier</Text>
          </View></View>
          <View style={s.kpiCard}><View style={s.kpiInner}>
            <Text style={s.kpiLabel}>Coût brut total</Text>
            <Text style={[s.kpiValue, { color: C.ink }]}>{eur(kpis.coutBrut)}</Text>
            <Text style={s.kpiSub}>{eur(kpis.coutParEtudiant)} par étudiant</Text>
          </View></View>
        </View>

        <View style={s.confCard}>
          <View style={[s.dot, { backgroundColor: CONF[kpis.confidence.level] }]} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{kpis.confidence.label}</Text>
            <Text style={{ fontSize: 9, color: C.gray, marginTop: 2 }}>{kpis.confidence.desc}</Text>
          </View>
          <Text style={{ fontSize: 8, color: C.light }}>Indicateur de fiabilité</Text>
        </View>
        <Footer p="02" />
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
          <Text style={s.infoBody}>
            Montant alloué par l&apos;OPCO au CFA (Centre de Formation d&apos;Apprentis) pour accompagner la mise en œuvre des mobilités étudiantes : organisation, coordination, suivi, préparation des élèves et dépenses liées au projet. <Text style={s.infoStrong}>Important :</Text> son affectation doit être cohérente avec les conditions de l&apos;OPCO, le dossier et les justificatifs à conserver ; elle ne constitue pas une marge libre.
          </Text>
        </View>

        <View style={[s.infoCard, { backgroundColor: C.soft }]}>
          <Text style={s.infoTitle}>En pratique, comment un financement se confirme-t-il ?</Text>
          <Text style={[s.infoBody, { marginTop: 8 }]}>1. Le CFA et AMI cadrent le séjour.  2. Les conditions applicables au contrat et à l&apos;OPCO sont vérifiées.  3. La convention de mobilité et les documents demandés sont préparés.  4. L&apos;OPCO instruit le dossier selon ses règles. Cette simulation intervient avant cette dernière validation.</Text>
        </View>

        <View style={s.infoCard}>
          <View style={s.infoHead}>
            <View style={[s.sw, { backgroundColor: C.blue, width: 10, height: 10, borderRadius: 3 }]} />
            <Text style={s.infoTitle}>Prise en charge de l&apos;apprenti·e</Text>
          </View>
          <Text style={s.infoBody}>
            Montant pris en charge directement par l&apos;OPCO pour chaque apprenti·e dans le cadre d&apos;une mobilité à l&apos;étranger. Cette aide peut couvrir tout ou partie des frais liés au transport, à l&apos;hébergement, à l&apos;assurance, ou encore à la restauration pendant la mobilité. Elle est généralement versée au CFA, qui la redistribue ou l&apos;utilise pour organiser la mobilité. <Text style={s.infoStrong}>Objectif :</Text> limiter les coûts restant à la charge de l&apos;apprenti·e et favoriser son départ à l&apos;international.
          </Text>
        </View>

        <View style={s.infoCard}>
          <View style={s.infoHead}>
            <View style={[s.sw, { backgroundColor: C.orange, width: 10, height: 10, borderRadius: 3 }]} />
            <Text style={s.infoTitle}>Réinjection et reste à charge</Text>
          </View>
          <Text style={s.infoBody}>
            Dans cette simulation, le CFA peut tester l&apos;affectation d&apos;une part du budget référent à la réduction du reste à charge, sans dépasser le coût restant. Le <Text style={s.infoStrong}>reste à charge moyen étudiant</Text> correspond au coût estimé après les financements modélisés ; il demeure conditionnel à l&apos;accord de l&apos;OPCO et au dossier.
          </Text>
        </View>

        <Footer p="03" />
      </Page>

      {/* PAGE 4, ANALYSE FINANCIÈRE (barres, sans pie chart) */}
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
              <Text style={s.wfLabel}>{w.final ? "" : "− "}{w.label}</Text>
              <View style={{ flex: 1, height: 12, justifyContent: "center" }}>
                <View style={{ width: `${Math.max(2, (Math.abs(w.value) / wfMax) * 100)}%`, height: 12, backgroundColor: w.color, borderRadius: 3 }} />
              </View>
              <Text style={[s.wfVal, { color: w.final ? C.orange : C.ink }]}>{eur(w.value)}</Text>
            </View>
          ))}
        </View>
        <Footer p="04" />
      </Page>

      {/* PAGE 5+, OPCO EXPLIQUÉS */}
      {opcoChunks.map((chunk, pageIndex) => (
        <Page key={pageIndex} size="A4" style={s.page}>
          <Image src={LOGO_BLACK} style={s.hdrLogo} />
          <Text style={s.eyebrow}>OPCO par OPCO</Text>
          <Text style={s.h2}>{pageIndex === 0 ? "Comprendre chaque financement" : "Suite des financements"}</Text>
          <Text style={s.intro}>Chaque bloc explique simplement ce qui est estimé, la façon dont l&apos;OPCO peut intervenir et le point à vérifier avant de compter ce financement.</Text>
          {chunk.map((o, i) => (
            <View key={i} style={s.opcoCard} wrap={false}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 12 }}>{o.label}</Text>
                  <Text style={{ fontSize: 8.5, color: C.gray, marginTop: 3 }}>{o.count} alternant{o.count > 1 ? "s" : ""} concerné{o.count > 1 ? "s" : ""}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={s.opcoKicker}>Estimation / alternant</Text>
                  <Text style={s.opcoValue}>{eur(o.apprenti)}</Text>
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>Comment cela fonctionne</Text>
                <Text style={[s.infoBody, { fontSize: 9, marginTop: 3 }]}>{o.how}</Text>
              </View>
              <View style={{ marginTop: 8, padding: 9, borderRadius: 7, backgroundColor: o.toConfirm ? "#FFF6E8" : C.soft }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, color: o.toConfirm ? C.amber : C.gray }}>{o.toConfirm ? "À CONFIRMER AVANT DE COMPTER CE MONTANT" : "À PRÉVOIR DANS LE DOSSIER"}</Text>
                <Text style={{ fontSize: 8.7, color: "#3A3A40", lineHeight: 1.55, marginTop: 3 }}>{o.condition}</Text>
              </View>
              <Text style={{ fontSize: 8.5, color: C.gray, marginTop: 8 }}>Forfait référent mobilité : {eur(o.referent)} par alternant, pour la coordination et les dépenses liées au projet du CFA.</Text>
            </View>
          ))}
          <Footer p={`0${5 + pageIndex}`} />
        </Page>
      ))}

      {/* PAGE 6, MÉTHODOLOGIE */}
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
        <Footer p={String(methodologyPage).padStart(2, "0")} />
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
        <Footer p={String(mentionsPage).padStart(2, "0")} />
      </Page>
    </Document>
  );
}
