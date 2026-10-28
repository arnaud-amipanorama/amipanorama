import { readFileSync, writeFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { KIT_PDF_PATH } from "./assets";
import { PUBLIC_SIMULATOR_LABEL } from "./public-path";
import { buildKitPdf } from "./personalize-kit";

function decodeHexOperands(input: string): string {
  return input.replace(/<([0-9A-Fa-f\s]+)>/g, (_match, hex: string) => {
    const clean = hex.replace(/\s+/g, "");
    if (!clean || clean.length % 2 !== 0) return "";
    return Buffer.from(clean, "hex").toString("latin1");
  });
}

/** Le texte ajouté par pdf-lib est souvent dans un flux compressé, en hexadécimal. */
function pdfText(bytes: Uint8Array): string {
  const latin = Buffer.from(bytes).toString("latin1");
  const parts = [latin];
  const pattern = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  for (const match of latin.matchAll(pattern)) {
    try {
      parts.push(inflateSync(Buffer.from(match[1], "latin1")).toString("latin1"));
    } catch {
      // flux déjà en clair, ou autre filtre
    }
  }
  const joined = parts.join("\n");
  return `${joined}\n${decodeHexOperands(joined)}`;
}

describe("kit référent personnalisé", () => {
  it("inscrit le nom saisi et l’adresse du simulateur public", async () => {
    const source = new Uint8Array(readFileSync(KIT_PDF_PATH));
    const pdf = await buildKitPdf(
      { prenom: "Chloé", nom: "Martin", etablissement: "CFA Étoile", employeur: "Atelier Nord", opco: "AKTO" },
      source,
    );
    writeFileSync("/tmp/kit-chloe-martin.pdf", pdf);
    const latin = pdfText(pdf);
    expect(Buffer.from(pdf).subarray(0, 5).toString()).toBe("%PDF-");
    expect(latin).toContain("Chloé Martin");
    expect(latin).toContain("CFA Étoile");
    expect(latin).toContain("Atelier Nord");
    expect(latin).toContain(PUBLIC_SIMULATOR_LABEL);
    expect(latin).toContain("https://amipanorama.com/global-weeks/simulateur");
  });

  it("laisse le placeholder de nom si personne n’est renseignée, et corrige quand même le lien", async () => {
    const pdf = await buildKitPdf({}, new Uint8Array(readFileSync(KIT_PDF_PATH)));
    const latin = pdfText(pdf);
    expect(latin).toContain(PUBLIC_SIMULATOR_LABEL);
    expect(latin).not.toContain("Chloé Martin");
  });
});
