import { ImageResponse } from "next/og";

// Favicon de marque (onglet navigateur). Next génère le PNG au build.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 27,
          fontWeight: 800,
          letterSpacing: -1.5,
          fontFamily: "sans-serif",
          borderRadius: 14,
        }}
      >
        AMI
      </div>
    ),
    { ...size }
  );
}
