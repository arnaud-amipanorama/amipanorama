import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import {
  ACCESS_COOKIE,
  accessGranted,
  accessSignature,
  submissionAccepted,
} from "./access-token";

describe("protection citoyenneté européenne", () => {
  it("reste fermée sans variable d'environnement", () => {
    expect(accessGranted(undefined, "n-importe-quoi")).toBe(false);
    expect(accessGranted("", accessSignature("secret"))).toBe(false);
    expect(submissionAccepted(undefined, "")).toBe(false);
    expect(submissionAccepted("", "")).toBe(false);
  });

  it("n'accepte que le mot de passe configuré et un cookie signé, pas le mot de passe en clair", () => {
    const password = "phrase-de-test";
    const signature = accessSignature(password);
    expect(signature).not.toBe(password);
    expect(signature).not.toContain(password);
    expect(submissionAccepted(password, password)).toBe(true);
    expect(submissionAccepted(password, "autre")).toBe(false);
    expect(submissionAccepted(password, password + " ")).toBe(false);
    expect(accessGranted(password, signature)).toBe(true);
    expect(accessGranted(password, password)).toBe(false);
    expect(accessGranted(password, undefined)).toBe(false);
    expect(ACCESS_COOKIE).toBe("ami_european_citizenship_access");
  });

  it("n'écrit aucune valeur de mot de passe et retire les pages de l'index", () => {
    const example = readFileSync(resolve(process.cwd(), ".env.local.example"), "utf8");
    const action = readFileSync(resolve(process.cwd(), "src/app/citoyennete-europeenne/actions.ts"), "utf8");
    const route = readFileSync(resolve(process.cwd(), "src/components/european-citizenship/CitizenshipRoute.tsx"), "utf8");
    expect(example).toMatch(/^EUROPEAN_CITIZENSHIP_PASSWORD=\s*$/m);
    expect(action).toContain("process.env.EUROPEAN_CITIZENSHIP_PASSWORD");
    expect(action).toContain("httpOnly: true");
    expect(action).not.toMatch(/EUROPEAN_CITIZENSHIP_PASSWORD\s*=\s*["'`][^"'`]+/);
    expect(route).toContain("index: false");
    const urls = sitemap().map((entry) => entry.url).join("\n");
    expect(urls).not.toContain("citoyennete-europeenne");
    expect(urls).not.toContain("european-citizenship");
  });
});
