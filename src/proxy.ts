import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APEX = "https://amipanorama.com";

/**
 * Les hôtes *.vercel.app ne doivent pas être indexés à côté de l'apex.
 * En production, redirection permanente vers https://amipanorama.com.
 * En préproduction, la page reste consultable mais reçoit un noindex.
 *
 * Non fait ici (réglages Vercel / DNS, à documenter) :
 * - redirection www → apex
 * - projet Vercel doublon « amipanorama-site »
 */
export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
  if (!host.endsWith(".vercel.app")) return NextResponse.next();

  if (process.env.VERCEL_ENV === "production") {
    const destination = new URL(request.nextUrl.pathname + request.nextUrl.search, APEX);
    return NextResponse.redirect(destination, 308);
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml)$).*)"],
};
