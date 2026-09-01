"use client";

import { useState } from "react";

const items = [
  ["1. Partir du bon coût", "Le prix du séjour AMI sert à estimer le reste à payer par les étudiants. Pour les OPCO qui remboursent au réel, le montant retenu ne peut jamais dépasser les dépenses éligibles réellement supportées et justifiables par le CFA."],
  ["2. Séparer les deux enveloppes", "Le forfait référent mobilité est destiné à la coordination et aux dépenses de mobilité du CFA. La prise en charge apprenti suit le barème de l’OPCO et les justificatifs demandés. Les deux lignes ne doivent pas être additionnées comme une promesse de financement."],
  ["3. Vérifier les conditions avant d’engager", "Contrat, OPCO, durée en jours calendaires, type de convention, zone de destination, dépenses supportées par le CFA et pièces à produire peuvent changer le montant. La convention de mobilité doit être anticipée."],
  ["4. Lire le résultat comme un scénario", "Le simulateur distingue les aides utilisées pour réduire le coût des étudiants des forfaits destinés au travail du CFA. Le montant final reste soumis à l’accord de l’OPCO, au dossier complet et à la réalité des dépenses."],
];

export default function FundingGuide() {
  const [open, setOpen] = useState(false);
  return (
    <section style={{ border: "1px solid #53647E", borderRadius: 14, background: "#171E2A", overflow: "hidden" }}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", color: "#F8FAFC", background: "transparent", border: 0, padding: "17px 20px", cursor: "pointer", textAlign: "left" }}>
        <span><span style={{ color: "#9DBBFF", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Guide express</span><span style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 700 }}>Bien utiliser le simulateur de financement</span></span>
        <span aria-hidden="true" style={{ color: "#AAB7C9", fontSize: 20 }}>{open ? "−" : "+"}</span>
      </button>
      {open && <div style={{ padding: "0 20px 20px", borderTop: "1px solid #3A4659" }}>
        {items.map(([title, text]) => <div key={title} style={{ paddingTop: 16 }}><h3 style={{ fontSize: 13, margin: 0, color: "#FFFFFF" }}>{title}</h3><p style={{ color: "#D5DDEA", fontSize: 12, lineHeight: 1.6, margin: "5px 0 0" }}>{text}</p></div>)}
        <p style={{ margin: "18px 0 0", padding: 12, borderRadius: 9, background: "rgba(118,163,255,0.16)", border: "1px solid rgba(157,187,255,0.30)", color: "#F8FAFC", fontSize: 12, lineHeight: 1.55 }}>À retenir : une simulation prépare le dossier ; elle ne remplace ni la validation de l’OPCO, ni la convention, ni les justificatifs.</p>
      </div>}
    </section>
  );
}
