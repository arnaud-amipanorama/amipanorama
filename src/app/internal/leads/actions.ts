"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/lead";
import { getLead, updateLeadStatus } from "@/lib/lead-repository";
import { commercialRoleFor, leadsCookie, readLeadsCookie, signLeadsCookie } from "@/lib/leads-access";

export async function currentLeadsEmail(): Promise<string | null> {
  const jar = await cookies();
  const email = readLeadsCookie(jar.get(leadsCookie.name)?.value);
  if (!email) return null;
  const role = await commercialRoleFor(email);
  return role ? email : null;
}

export async function signInLeads(formData: FormData): Promise<{ error: string } | void> {
  const email = String(formData.get("email") ?? "");
  const role = await commercialRoleFor(email);
  if (!role) return { error: "Cette adresse n’ouvre pas les leads commerciaux." };
  try {
    const jar = await cookies();
    jar.set(leadsCookie.name, signLeadsCookie(email), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: leadsCookie.maxAge,
    });
  } catch {
    return { error: "L’accès n’est pas configuré sur cet environnement." };
  }
  redirect("/internal/leads");
}

export async function signOutLeads(): Promise<void> {
  const jar = await cookies();
  jar.delete(leadsCookie.name);
  redirect("/internal/leads");
}

export async function setLeadStatus(formData: FormData): Promise<void> {
  const email = await currentLeadsEmail();
  if (!email) redirect("/internal/leads");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) return;
  const existing = await getLead(id);
  if (!existing) return;
  await updateLeadStatus(id, status as LeadStatus);
  redirect(`/internal/leads/${id}`);
}
