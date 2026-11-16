import localFont from "next/font/local";

/**
 * Manrope et Lora, auto-hébergées.
 * Fichiers variables OFL, sous-ensemble latin + latin-ext (mêmes contours
 * que les woff2 Google Fonts). Graisses identiques à l'ancien next/font/google :
 * Manrope 300–700, Lora 400–600 romain et italique.
 * Les variables CSS restent --font-manrope et --font-lora.
 */
export const manrope = localFont({
  src: "./manrope/manrope.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-manrope",
  display: "swap",
  adjustFontFallback: "Arial",
  declarations: [{ prop: "font-family", value: "Manrope" }],
});

export const lora = localFont({
  src: [
    { path: "./lora/lora.woff2", weight: "400 600", style: "normal" },
    { path: "./lora/lora-italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-lora",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  declarations: [{ prop: "font-family", value: "Lora" }],
});
