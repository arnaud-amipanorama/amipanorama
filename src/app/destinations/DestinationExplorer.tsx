"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AnimateOnView from "@/components/AnimateOnView";
import { motion, AnimatePresence } from "framer-motion";

export interface Dest {
  city: string;
  country: string;
  tag: string;
  flag: string;
  accent: string;
  photo: string;
  headline: string;
  desc: string;
  highlights: string[];
  ideal: string;
  comingSoon?: boolean;
  phare?: boolean;
}

// Contenu additionnel du modal — faits qualitatifs et vérifiables.
// Aucune statistique AMI Panorama inventée, aucun volume par destination.
const EXTRA: Record<string, { facts: string[]; gallery: string[] }> = {
  "Montréal": {
    facts: [
      "Notre destination historique — la première ouverte et la plus maîtrisée.",
      "Plus grande métropole francophone d'Amérique du Nord.",
      "L'une des plus fortes densités étudiantes du continent.",
    ],
    gallery: ["/Assets/groups/montreal-sunset.jpg", "/Assets/groups/montreal-night.jpg", "/Assets/groups/montreal-sign.jpg"],
  },
  "Séville": {
    facts: [
      "Notre deuxième pilier, après Montréal.",
      "Capitale de l'Andalousie, économie tournée vers les services et le tourisme.",
      "Patrimoine mondial UNESCO : cathédrale, Alcázar, Giralda.",
    ],
    gallery: ["/Assets/groups/seville-park.jpg", "/Assets/groups/seville-diplomas.jpg"],
  },
  "Londres": {
    facts: [
      "Référence mondiale pour l'anglais professionnel en contexte réel.",
      "L'un des premiers centres financiers et d'affaires de la planète.",
      "Densité unique d'entreprises et d'institutions internationales.",
    ],
    gallery: [],
  },
  "Malte": {
    facts: [
      "L'une des rares destinations européennes officiellement anglophones.",
      "Immersion linguistique dans un cadre méditerranéen accessible.",
      "La Valette, capitale classée au patrimoine mondial UNESCO.",
    ],
    gallery: [],
  },
  "Maroc": {
    facts: [
      "Immersion interculturelle entre héritage et modernisation.",
      "Marrakech et Casablanca : deux visages de l'économie marocaine.",
      "Liens économiques étroits avec la France.",
    ],
    gallery: [],
  },
  "Berlin": {
    facts: [
      "Capitale européenne majeure de la scène entrepreneuriale.",
      "Écosystème d'innovation ouvert et non conventionnel.",
      "Forte densité d'entreprises créatives et technologiques.",
    ],
    gallery: [],
  },
  "New York": {
    facts: [
      "L'un des marchés internationaux les plus intenses au monde.",
      "Centre mondial de la finance, du commerce et de la création.",
      "Business English de haut niveau, en contexte réel.",
    ],
    gallery: ["/Assets/groups/newyork-dumbo.jpg", "/Assets/groups/newyork-bridge.jpg"],
  },
  "Rome": {
    facts: [
      "Comprendre l'économie italienne par l'immersion.",
      "Patrimoine exceptionnel : Colisée, Forum romain, Vatican.",
      "Carrefour historique de l'Europe méditerranéenne.",
    ],
    gallery: [],
  },
  "Miami": {
    facts: [
      "Carrefour économique des Amériques.",
      "Porte d'entrée cosmopolite vers le marché américain.",
      "Business English dans un environnement accessible.",
    ],
    gallery: [],
  },
  "Séoul": {
    facts: [
      "L'une des métropoles les plus innovantes au monde.",
      "Culture professionnelle et technologique de rupture.",
      "Fenêtre directe sur l'économie asiatique du XXIe siècle.",
    ],
    gallery: [],
  },
};

export default function DestinationExplorer({ destinations }: { destinations: Dest[] }) {
  const [active, setActive] = useState<Dest | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [active]);

  const open = (d: Dest) => { setActive(d); setImgIdx(0); };

  const gallery = active ? (EXTRA[active.city]?.gallery?.length ? EXTRA[active.city].gallery : [active.photo]) : [];
  const facts = active ? EXTRA[active.city]?.facts ?? [] : [];

  return (
    <>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        {destinations.map((d, i) => {
          const { city, country, tag, flag, accent, photo, headline, desc, highlights, ideal, comingSoon, phare } = d;
          if (comingSoon) {
            return (
              <AnimateOnView key={city} delay={i * 0.06}>
                <div style={{
                  background: "var(--bg-1)", border: "1px solid var(--border)",
                  borderRadius: 20, overflow: "hidden",
                  display: "grid", gridTemplateColumns: "340px 1fr", opacity: 0.75,
                }} className="dest-coming-soon-row">
                  <div style={{ position: "relative", minHeight: 240, overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${photo}')`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(0.4) brightness(0.6)" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(11,24,41,0.55)" }} />
                    <div style={{ position: "absolute", bottom: 28, left: 28 }}>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{flag} {country}</div>
                      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>{city}</div>
                      <div style={{ display: "inline-block", marginTop: 10, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 100, padding: "4px 12px" }}>Prochainement</div>
                    </div>
                  </div>
                  <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p style={{ fontSize: 14, fontStyle: "italic", color: "var(--text-muted)", marginBottom: 16, fontFamily: "var(--font-serif)" }}>{headline}</p>
                    <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8 }}>{desc}</p>
                    <div style={{ marginTop: 24, fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>Programme en cours de construction — disponible prochainement.</div>
                  </div>
                </div>
              </AnimateOnView>
            );
          }
          return (
            <AnimateOnView key={city} delay={i * 0.06}>
              <div className="hover-row" role="button" tabIndex={0}
                onClick={() => open(d)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(d); } }}
                style={{
                  background: "var(--bg-1)", border: "1px solid var(--border)",
                  borderRadius: 20, overflow: "hidden", cursor: "pointer",
                  display: "grid", gridTemplateColumns: "340px 1fr",
                }}>
                <div style={{ position: "relative", minHeight: 280, overflow: "hidden" }}>
                  <div className="dest-photo-inner" style={{ position: "absolute", inset: 0, backgroundImage: `url('${photo}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(11,24,41,0.38) 0%, rgba(11,24,41,0.10) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 28, left: 28 }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>{flag} {country}</div>
                    <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>{city}</div>
                    <div style={{ display: "inline-block", marginTop: 10, fontSize: 11, fontWeight: 500, color: "#fff", background: accent + "cc", borderRadius: 100, padding: "4px 12px" }}>{tag}</div>
                  </div>
                  <div style={{ position: "absolute", top: 20, right: 20, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.35)" }}>0{i + 1}</div>
                  {phare && (
                    <div style={{ position: "absolute", top: 18, left: 28, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: "rgba(232,88,53,0.92)", borderRadius: 100, padding: "4px 12px" }}>Destination phare</div>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="dest-card-body">
                  <div style={{ padding: "36px 32px", borderRight: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 14, fontStyle: "italic", color: "var(--text-secondary)", marginBottom: 16, fontFamily: "var(--font-serif)" }}>{headline}</p>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>{desc}</p>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Filières recommandées</div>
                      <div style={{ fontSize: 13, color: accent, fontWeight: 500 }}>{ideal}</div>
                    </div>
                  </div>
                  <div style={{ padding: "36px 32px", position: "relative" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>Au programme</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {highlights.map((h) => (
                        <div key={h} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0, marginTop: 7 }} />
                          <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{h}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 22, fontSize: 12.5, fontWeight: 600, color: accent, display: "flex", alignItems: "center", gap: 6 }}>
                      Voir le détail
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnView>
          );
        })}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 1000, padding: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(11,24,41,0.55)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative", width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto",
                background: "var(--bg-1)", borderRadius: 20, boxShadow: "0 30px 90px rgba(11,24,41,0.4)",
              }}
            >
              {/* Close */}
              <button onClick={() => setActive(null)} aria-label="Fermer" style={{
                position: "absolute", top: 14, right: 14, zIndex: 2,
                width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
                border: "none", background: "rgba(255,255,255,0.9)", color: "var(--text-primary)",
                fontSize: 16, boxShadow: "0 2px 10px rgba(11,24,41,0.18)",
              }}>✕</button>

              {/* Main image */}
              <div style={{ position: "relative", height: 260, overflow: "hidden", borderRadius: "20px 20px 0 0" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url('${gallery[imgIdx]}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,24,41,0.7) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 18, left: 22 }}>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{active.flag} {active.country}</div>
                  <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1 }}>{active.city}</div>
                </div>
                {active.phare && (
                  <div style={{ position: "absolute", top: 16, left: 18, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: "rgba(232,88,53,0.92)", borderRadius: 100, padding: "4px 12px" }}>Destination phare</div>
                )}
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div style={{ display: "flex", gap: 8, padding: "12px 22px 0" }}>
                  {gallery.map((g, gi) => (
                    <button key={g} onClick={() => setImgIdx(gi)} aria-label={`Image ${gi + 1}`} style={{
                      width: 56, height: 40, borderRadius: 8, cursor: "pointer", flexShrink: 0,
                      border: gi === imgIdx ? `2px solid ${active.accent}` : "1px solid var(--border)",
                      backgroundImage: `url('${g}')`, backgroundSize: "cover", backgroundPosition: "center",
                      opacity: gi === imgIdx ? 1 : 0.65, padding: 0,
                    }} />
                  ))}
                </div>
              )}

              {/* Body */}
              <div style={{ padding: "20px 26px 28px" }}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: active.accent, marginBottom: 12 }}>{active.tag}</div>
                <h3 style={{ fontSize: 18, fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500, letterSpacing: "-0.01em", marginBottom: 12 }}>{active.headline}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: facts.length ? 22 : 26 }}>{active.desc}</p>

                {facts.length > 0 && (
                  <div style={{ marginBottom: 26 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 12 }}>Points clés</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {facts.map((f) => (
                        <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: active.accent, flexShrink: 0, marginTop: 7 }} />
                          <span style={{ fontSize: 13.5, color: "var(--text-primary)", lineHeight: 1.6 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link href="/rendez-vous" className="btn-primary">Réserver un échange</Link>
                  <Link href="/contact" className="btn-ghost">Parler de ce programme</Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
