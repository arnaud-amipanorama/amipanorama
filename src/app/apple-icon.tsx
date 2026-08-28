import { ImageResponse } from "next/og";

// Icône iOS (écran d'accueil / partage sur iPhone).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1829",
          color: "#FFFFFF",
          fontSize: 74,
          fontWeight: 800,
          letterSpacing: -4,
          fontFamily: "sans-serif",
        }}
      >
        AMI
      </div>
    ),
    { ...size }
  );
}
