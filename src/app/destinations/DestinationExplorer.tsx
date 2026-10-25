import Link from "next/link";
import Image from "next/image";
import AnimateOnView from "@/components/AnimateOnView";
import { destinationPath, type Destination } from "@/data/destinations";

export default function DestinationExplorer({ destinations }: { destinations: Destination[] }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      {destinations.map((d, i) => {
        const { city, country, tag, flag, accent, photo, photoAlt, headline, description, highlights, ideal, comingSoon, phare } = d;
        if (comingSoon) {
          return (
            <AnimateOnView key={city} delay={i * 0.06}>
              <div style={{
                background: "var(--bg-1)", border: "1px solid var(--border)",
                borderRadius: 20, overflow: "hidden",
                display: "grid", gridTemplateColumns: "340px 1fr", opacity: 0.75,
              }} className="dest-coming-soon-row">
                <div style={{ position: "relative", minHeight: 240, overflow: "hidden" }}>
                  <Image src={photo} alt={photoAlt} fill sizes="(max-width: 1024px) 100vw, 340px" style={{ objectFit: "cover", filter: "grayscale(0.4) brightness(0.6)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(11,24,41,0.55)" }} />
                  <div style={{ position: "absolute", bottom: 28, left: 28 }}>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginBottom: 6 }}>{flag} {country}</div>
                    <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1, margin: 0 }}>{city}</h2>
                    <div style={{ display: "inline-block", marginTop: 10, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 100, padding: "4px 12px" }}>Prochainement</div>
                  </div>
                </div>
                <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <p style={{ fontSize: 14, fontStyle: "italic", color: "var(--text-muted)", marginBottom: 16, fontFamily: "var(--font-serif)" }}>{headline}</p>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8 }}>{description}</p>
                  <div style={{ marginTop: 24, fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>Programme en cours de construction, disponible prochainement.</div>
                </div>
              </div>
            </AnimateOnView>
          );
        }

        return (
          <AnimateOnView key={city} delay={i * 0.06}>
            <Link href={destinationPath(d)} className="hover-row" style={{
              background: "var(--bg-1)", border: "1px solid var(--border)",
              borderRadius: 20, overflow: "hidden",
              display: "grid", gridTemplateColumns: "340px 1fr",
            }}>
              <div style={{ position: "relative", minHeight: 280, overflow: "hidden" }}>
                <div className="dest-photo-inner" style={{ position: "absolute", inset: 0 }}>
                  <Image src={photo} alt={photoAlt} fill sizes="(max-width: 1024px) 100vw, 340px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(11,24,41,0.38) 0%, rgba(11,24,41,0.10) 100%)" }} />
                <div style={{ position: "absolute", bottom: 28, left: 28, right: 20 }}>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", marginBottom: 6 }}>{flag} {country}</div>
                  <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1, margin: 0 }}>{city}</h2>
                  <div style={{ display: "inline-block", marginTop: 10, fontSize: 12, fontWeight: 500, color: "#fff", background: accent + "cc", borderRadius: 100, padding: "4px 12px" }}>{tag}</div>
                </div>
                <div style={{ position: "absolute", top: 20, right: 20, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.72)" }}>0{i + 1}</div>
                {phare && (
                  <div style={{ position: "absolute", top: 18, left: 28, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", background: "rgba(27,61,136,0.92)", borderRadius: 100, padding: "4px 12px" }}>Destination phare</div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="dest-card-body">
                <div style={{ padding: "36px 32px", borderRight: "1px solid var(--border)" }}>
                  <p style={{ fontSize: 14, fontStyle: "italic", color: "var(--text-secondary)", marginBottom: 16, fontFamily: "var(--font-serif)" }}>{headline}</p>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>{description}</p>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Filières recommandées</div>
                    <div style={{ fontSize: 13, color: accent, fontWeight: 500 }}>{ideal}</div>
                  </div>
                </div>
                <div style={{ padding: "36px 32px", position: "relative" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>Au programme</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {highlights.map((h) => (
                      <div key={h} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0, marginTop: 7 }} />
                        <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{h}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 22, fontSize: 13, fontWeight: 600, color: accent, display: "flex", alignItems: "center", gap: 6 }}>
                    Voir la destination
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          </AnimateOnView>
        );
      })}
    </div>
  );
}
