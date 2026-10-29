import { createHmac, timingSafeEqual } from "node:crypto";

export const ACCESS_COOKIE = "ami_european_citizenship_access";
export const ACCESS_CONTEXT = "ami-panorama/european-citizenship/access/v1";

/** Durée du cookie, reprise du verrou Global Weeks : 4 heures. */
export const ACCESS_MAX_AGE_SECONDS = 60 * 60 * 4;

export function accessSignature(password: string) {
  return createHmac("sha256", password).update(ACCESS_CONTEXT).digest("base64url");
}

export function secretsMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

/** Fermé si la variable est absente ou vide, ou si le cookie ne correspond pas. */
export function accessGranted(password: string | undefined, token: string | undefined) {
  if (!password) return false;
  if (!token) return false;
  return secretsMatch(token, accessSignature(password));
}

/** Fermé si la variable est absente ou vide, même quand le champ soumis est vide. */
export function submissionAccepted(password: string | undefined, submitted: string) {
  if (!password) return false;
  return secretsMatch(submitted, password);
}
