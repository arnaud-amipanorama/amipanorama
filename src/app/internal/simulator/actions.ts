"use server";
import { cookies } from "next/headers";
import { accessCookie, readAccessCookie } from "@/lib/simulator-access";

export async function isUnlocked(): Promise<boolean> {
  const jar = await cookies();
  return readAccessCookie(jar.get(accessCookie.name)?.value) !== null;
}

export async function accessEmail(): Promise<string | null> {
  const jar = await cookies();
  return readAccessCookie(jar.get(accessCookie.name)?.value);
}
