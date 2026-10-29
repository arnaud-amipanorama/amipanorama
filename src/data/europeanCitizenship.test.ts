import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  citizenshipCopy,
  citizenshipHref,
  citizenshipJsonLd,
  citizenshipOffer,
  citizenshipPending,
  citizenshipRoutes,
  collectCopyStrings,
  contactHref,
} from "./europeanCitizenship";

const sourceFiles = [
  "src/data/europeanCitizenship.ts",
  "src/components/european-citizenship/EuropeanCitizenshipPage.tsx",
  "src/app/citoyennete-europeenne/page.tsx",
  "src/app/en/european-citizenship/page.tsx",
];

describe("offre citoyenneté européenne", () => {
  it("garde le prix, le volume et les chiffres dans un seul objet ajustable", () => {
    expect(citizenshipOffer.priceEuros).toBeNull();
    expect(citizenshipOffer.priceMode).toBe("quote-by-group-size");
    expect(citizenshipOffer.trainingHours).toBe(20);
    expect(citizenshipOffer.echrVisit).toBe("subject-to-availability");
    expect(citizenshipOffer.schools).toBe(70);
    expect(citizenshipOffer.studentsMoreThan).toBe(5000);
    expect(citizenshipOffer.contactSubject).toBe("Citoyenneté européenne");
    expect(citizenshipPending.groupSizeMin).toBeNull();
    expect(citizenshipPending.phone).toBeNull();
    expect(citizenshipPending.internationalTravelIncluded).toBeNull();
    expect(citizenshipPending.foundingYear).toBeNull();
  });

  it("préremplit le formulaire existant sans montant", () => {
    const url = new URL(contactHref(), "https://amipanorama.com");
    expect(url.pathname).toBe("/contact");
    expect(url.searchParams.get("objet")).toBe("Citoyenneté européenne");
    expect(url.searchParams.get("destination")).toBe("Strasbourg");
    expect(contactHref()).not.toMatch(/949|939|€/);
  });

  it("relie les deux langues", () => {
    expect(citizenshipRoutes.fr).toBe("/citoyennete-europeenne");
    expect(citizenshipRoutes.en).toBe("/en/european-citizenship");
    expect(citizenshipHref("/notre-programme")).toBe(citizenshipRoutes.fr);
    expect(citizenshipHref("/en/european-citizenship")).toBe(citizenshipRoutes.en);
    expect(citizenshipJsonLd("fr")["@graph"]).toHaveLength(3);
    expect(JSON.stringify(citizenshipJsonLd("fr"))).not.toMatch(/949|939/);
    expect(JSON.stringify(citizenshipJsonLd("en"))).not.toMatch(/"price"\s*:/);
  });

  it.each(["fr", "en"] as const)("publie 20 h, 70 écoles et plus de 5 000 étudiants en %s", (locale) => {
    const text = collectCopyStrings(citizenshipCopy(locale)).join("\n");
    if (locale === "fr") {
      expect(text).toContain("20 h");
      expect(text).toContain("70");
      expect(text).toContain("5 000+");
      expect(text).toContain("Selon disponibilités");
      expect(text).toContain("Tarif sur devis selon la taille du groupe.");
      expect(text).toContain("Foundation Degree");
      expect(text).toContain("Culture et citoyenneté européennes");
    } else {
      expect(text).toContain("20 hours");
      expect(text).toContain("70");
      expect(text).toContain("5,000+");
      expect(text).toContain("Subject to availability");
      expect(text).toContain("Quote based on group size.");
      expect(text).toContain("European Culture and Citizenship");
    }
    expect(text).not.toMatch(/\b15\b|\b16\b|\b35\b|\b949\b|\b939\b/);
    expect(text).not.toMatch(/3\s?000|50\s*CFA|CCI|Beno[iî]t|OPCO|financement|funding/i);
    expect(text).not.toMatch(/cathédrale|Petite France|Petite-France/i);
  });

  it("ne laisse pas de montant ni de nom interdit dans les fichiers de la page", () => {
    const blob = sourceFiles.map((file) => readFileSync(resolve(process.cwd(), file), "utf8")).join("\n");
    expect(blob).not.toMatch(/949|939|CCI|Beno[iî]t|OPCO/);
  });
});
