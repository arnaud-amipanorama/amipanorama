"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { citizenshipRoutes, type CitizenshipLocale } from "@/data/europeanCitizenship";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SECONDS,
  accessGranted,
  accessSignature,
  submissionAccepted,
} from "@/lib/european-citizenship/access-token";

function configuredPassword() {
  const password = process.env.EUROPEAN_CITIZENSHIP_PASSWORD;
  return password ? password : undefined;
}

function pathFor(locale: CitizenshipLocale) {
  return locale === "en" ? citizenshipRoutes.en : citizenshipRoutes.fr;
}

/** Fermé quand EUROPEAN_CITIZENSHIP_PASSWORD est absente ou vide. */
export async function hasEuropeanCitizenshipAccess() {
  const cookieStore = await cookies();
  return accessGranted(configuredPassword(), cookieStore.get(ACCESS_COOKIE)?.value);
}

export async function unlockEuropeanCitizenship(formData: FormData) {
  const locale: CitizenshipLocale = formData.get("locale") === "en" ? "en" : "fr";
  const path = pathFor(locale);
  const submitted = String(formData.get("password") ?? "");

  if (!submissionAccepted(configuredPassword(), submitted)) {
    redirect(`${path}?access=denied`);
  }

  const password = configuredPassword();
  if (!password) redirect(`${path}?access=denied`);

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessSignature(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ACCESS_MAX_AGE_SECONDS,
    path: "/",
  });

  redirect(path);
}
