import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
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
  "src/components/european-citizenship/CitizenshipRoute.tsx",
  "src/app/citoyennete-europeenne/page.tsx",
  "src/app/en/european-citizenship/page.tsx",
  "src/app/sitemap.ts",
  ".env.local.example",
];

describe("offre citoyenneté européenne", () => {
  it("garde le prix et les chiffres dans un seul objet ajustable", () => {
    expect(citizenshipOffer.priceEuros).toBeNull();
    expect(citizenshipOffer.priceMode).toBe("quote-by-group-size");
    expect(citizenshipOffer.schools).toBe(70);
    expect(citizenshipOffer.studentsMoreThan).toBe(5000);
    expect(citizenshipOffer.contactSubject).toBe("Citoyenneté européenne");
    expect(citizenshipPending.groupSizeMin).toBeNull();
    expect(citizenshipPending.phone).toBeNull();
    expect(citizenshipPending.internationalTravelIncluded).toBeNull();
    expect(citizenshipPending.foundingYear).toBeNull();
    expect(citizenshipOffer).not.toHaveProperty("trainingHours");
    expect(citizenshipOffer).not.toHaveProperty("echrVisit");
  });

  it("préremplit le formulaire existant sans montant", () => {
    const url = new URL(contactHref(), "https://amipanorama.com");
    expect(url.pathname).toBe("/contact");
    expect(url.searchParams.get("objet")).toBe("Citoyenneté européenne");
    expect(url.searchParams.get("destination")).toBe("Strasbourg");
    expect(contactHref()).not.toMatch(/949|939|€/);
  });

  it("relie les deux langues et les publie dans le sitemap", () => {
    expect(citizenshipRoutes.fr).toBe("/citoyennete-europeenne");
    expect(citizenshipRoutes.en).toBe("/en/european-citizenship");
    expect(citizenshipHref("/notre-programme")).toBe(citizenshipRoutes.fr);
    expect(citizenshipHref("/en/european-citizenship")).toBe(citizenshipRoutes.en);
    expect(citizenshipJsonLd("fr")["@graph"]).toHaveLength(3);
    expect(JSON.stringify(citizenshipJsonLd("fr"))).not.toMatch(/949|939|20 h|20 heures/);
    expect(JSON.stringify(citizenshipJsonLd("en"))).not.toMatch(/"price"\s*:|20 hours/);

    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://amipanorama.com/citoyennete-europeenne");
    expect(urls).toContain("https://amipanorama.com/en/european-citizenship");
    const french = sitemap().find((entry) => entry.url.endsWith("/citoyennete-europeenne"));
    expect(french?.alternates?.languages?.fr).toBe("https://amipanorama.com/citoyennete-europeenne");
    expect(french?.alternates?.languages?.en).toBe("https://amipanorama.com/en/european-citizenship");
  });

  it.each(["fr", "en"] as const)("publie 70 écoles et plus de 5 000 étudiants en %s, sans volume horaire", (locale) => {
    const text = collectCopyStrings(citizenshipCopy(locale)).join("\n");
    expect(text).toContain("70");
    expect(text).not.toMatch(/20\s*h\b|20\s*heures|20\s*hours/i);
    expect(text).not.toMatch(/selon disponibilités/i);
    expect(text).not.toMatch(/subject to availability/i);
    expect(text).not.toMatch(/\b15\b|\b16\b|\b35\b|\b949\b|\b939\b/);
    expect(text).not.toMatch(/3\s?000|50\s*CFA|CCI|Beno[iî]t|OPCO|financement|funding/i);
    expect(text).not.toMatch(/cathédrale|Petite France|Petite-France/i);
    if (locale === "fr") {
      expect(text).toContain("5 000+");
      expect(text).toContain("Tarif sur devis selon la taille du groupe.");
      expect(text).toContain("Foundation Degree");
      expect(text).toContain("Bachelor européen");
      expect(text).toContain("Mastère européen");
      expect(text).not.toMatch(/Master européen/i);
      expect(text).toContain("Culture et citoyenneté européennes");
      expect(text).toContain("La semaine couvre le module « Culture et citoyenneté européennes » à travers des cours, des ateliers et des visites");
      expect(text).toContain("Toutes les visites sont soumises aux disponibilités des institutions.");
      expect(text).not.toContain("Les visites d’institutions se font sur réservation, selon les créneaux ouverts par les institutions.");
      expect(text).toContain("alignés");
      expect(text).not.toMatch(/alignées|construites/);
      expect(text).toContain("l’homme");
      expect(text).toContain("(CEDH)");
    } else {
      expect(text).toContain("5,000+");
      expect(text).toContain("Quote based on group size.");
      expect(text).toContain("European Culture and Citizenship");
      expect(text).toContain("European Bachelor’s");
      expect(text).toContain("European Master’s");
      expect(text).toContain("The week covers the “European Culture and Citizenship” module through classes, workshops and visits");
      expect(text).toContain("All visits are subject to the institutions’ availability.");
      expect(text).not.toContain("Institutional visits require a reservation and follow the slots the institutions open.");
      expect(text).toContain("Human Rights");
      expect(text).toContain("(ECHR)");
    }
  });

  it("ne laisse pas de montant, de mot de passe ni de nom interdit dans les fichiers de la page", () => {
    const blob = sourceFiles.map((file) => readFileSync(resolve(process.cwd(), file), "utf8")).join("\n");
    expect(blob).not.toMatch(/949|939|CCI|Beno[iî]t|OPCO/);
    expect(blob).not.toMatch(/EUROPEAN_CITIZENSHIP_PASSWORD|ami_european_citizenship_access/);
    expect(blob).not.toMatch(/index:\s*false/);
    expect(blob).toContain("index: true");
    const llms = readFileSync(resolve(process.cwd(), "public/llms.txt"), "utf8");
    expect(llms).not.toMatch(/20\s*h\b|20\s*heures|20\s*hours/i);
  });
});
