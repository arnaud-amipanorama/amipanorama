import { existsSync } from "node:fs";
import path from "node:path";
import { PUBLIC_SIMULATOR_LABEL, PUBLIC_SIMULATOR_PATH, PUBLIC_SIMULATOR_URL } from "./public-path";

export { PUBLIC_SIMULATOR_LABEL, PUBLIC_SIMULATOR_PATH, PUBLIC_SIMULATOR_URL };

/**
 * Sources du kit référent. Pour publier une nouvelle version Canva,
 * remplacer les fichiers en gardant ces noms :
 *   content/global-weeks/kit-referent.pdf
 *   content/global-weeks/flyer-referent.pdf
 * Le PowerPoint final (environ 18 Mo) n'est pas versionné.
 * Le déposer au chemin ci-dessous, ou renseigner GLOBAL_WEEKS_KIT_PPTX_URL
 * (URL https, par exemple un objet Vercel Blob).
 */
export const GLOBAL_WEEKS_CONTENT_DIR = path.join(process.cwd(), "content", "global-weeks");

export const KIT_PDF_PATH = path.join(GLOBAL_WEEKS_CONTENT_DIR, "kit-referent.pdf");
export const FLYER_PDF_PATH = path.join(GLOBAL_WEEKS_CONTENT_DIR, "flyer-referent.pdf");
export const KIT_PPTX_PATH = path.join(GLOBAL_WEEKS_CONTENT_DIR, "kit-referent.pptx");

/** Texte encore figé dans l'export Canva. Le PDF servi le recouvre. */
export const KIT_INTERNAL_SIMULATOR_LABEL = "amipanorama.com/internal/simulator";

export function kitPptxUrl(): string | null {
  const url = process.env.GLOBAL_WEEKS_KIT_PPTX_URL?.trim() ?? "";
  return url.startsWith("https://") ? url : null;
}

export function isKitPptxReady(): boolean {
  return existsSync(KIT_PPTX_PATH) || Boolean(kitPptxUrl());
}
