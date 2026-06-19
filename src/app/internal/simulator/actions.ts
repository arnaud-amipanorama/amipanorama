"use server";
import { cookies } from "next/headers";

const COOKIE = "sim_auth";

export type UnlockState = { ok?: boolean; error?: string } | null;

export async function unlock(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const pwd = String(formData.get("password") ?? "");
  const expected = process.env.SIMULATOR_PASSWORD;
  if (!expected) {
    return { error: "Simulateur non configuré (variable SIMULATOR_PASSWORD manquante)." };
  }
  if (pwd !== expected) {
    return { error: "Mot de passe incorrect." };
  }
  const jar = await cookies();
  jar.set(COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/internal",
    maxAge: 60 * 60 * 12, // 12h
  });
  return { ok: true };
}

export async function isUnlocked(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === "1";
}
