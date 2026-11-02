import { describe, expect, it } from "vitest";
import {
  FUNDING_PROMISE,
  fundingExamplePhrase,
  globalWeeksSessions,
  publicSessionDays,
  sessionLabel,
} from "./globalWeeks";

describe("sessions publiques Global Weeks", () => {
  it("reprend les dates du post du 28 octobre, pas le brouillon du 3 au 10", () => {
    expect(globalWeeksSessions.map((session) => `${session.city} ${session.label}`)).toEqual([
      "Séville 7 au 13 mars",
      "Séville 3 au 9 octobre",
      "Montréal 2 au 9 mai",
      "Montréal 9 au 16 mai",
      "Londres 6 au 12 juin",
    ]);
    expect(JSON.stringify(globalWeeksSessions)).not.toContain("3 au 10");
    expect(globalWeeksSessions.every((session) => session.year === 2027)).toBe(true);
  });

  it("aligne la durée du simulateur sur les sessions", () => {
    expect(publicSessionDays("Montréal")).toBe(8);
    expect(publicSessionDays("Séville")).toBe(7);
    expect(publicSessionDays("Londres")).toBe(7);
    expect(publicSessionDays("New York")).toBe(8);
    expect(sessionLabel("seville-octobre")).toBe("Séville, 3 au 9 octobre 2027");
  });

  it("garde la promesse de financement et l’exemple Montréal", () => {
    expect(FUNDING_PROMISE).toBe("Dans la majorité des cas, ton voyage sera financé.");
    expect(fundingExamplePhrase()).toBe("environ 450 € pour Montréal, logement et petits-déjeuners");
    expect(`${FUNDING_PROMISE} ${fundingExamplePhrase()}`).not.toMatch(/pas automatique|sans garantir|CCI|CCIFC/i);
  });
});
