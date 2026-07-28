"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ACCESS_COOKIE = "ami_global_weeks_access";
const ACCESS_CONTEXT = "ami-panorama/global-weeks/access/v1";

function accessSignature(password: string) {
  return createHmac("sha256", password).update(ACCESS_CONTEXT).digest("base64url");
}

function matches(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

/** The route fails closed when the server-side password has not been configured. */
export async function hasGlobalWeeksAccess() {
  const password = process.env.GLOBAL_WEEKS_PASSWORD;
  if (!password) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  return Boolean(token && matches(token, accessSignature(password)));
}

export async function unlockGlobalWeeks(formData: FormData) {
  const password = process.env.GLOBAL_WEEKS_PASSWORD;
  const submitted = String(formData.get("password") ?? "");

  if (!password || !matches(submitted, password)) {
    redirect("/global-weeks?access=denied");
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, accessSignature(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 4,
    path: "/global-weeks",
  });

  redirect("/global-weeks");
}
