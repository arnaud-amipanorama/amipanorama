import { ImageResponse } from "next/og";

// Image de partage (réseaux sociaux, aperçus de liens, certains agents IA)
export const alt = "AMI Panorama, Mobilité internationale pour les CFA et établissements de formation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B1829",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 46, height: 4, background: "#2547C7" }} />
          <div style={{ color: "#A2A8B4", fontSize: 26, letterSpacing: 6, textTransform: "uppercase" }}>
            AMI Panorama
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#ffffff", fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
            Ouvrir le monde à celles et ceux
          </div>
          <div style={{ color: "#2547C7", fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
            qui le construiront demain.
          </div>
        </div>
        <div style={{ color: "#A2A8B4", fontSize: 27 }}>
          Opérateur de mobilité internationale · CFA & établissements de formation
        </div>
      </div>
    ),
    { ...size }
  );
}
