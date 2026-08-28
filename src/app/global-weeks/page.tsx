import type { Metadata } from "next";
import GlobalWeeksExperience from "./GlobalWeeksExperience";
import GlobalWeeksAccessGate from "./GlobalWeeksAccessGate";
import { hasGlobalWeeksAccess } from "./actions";

export const metadata: Metadata = {
  title: "Global Weeks, mobilité internationale pour alternants",
  description:
    "Global Weeks by AMI Panorama permet aux alternants de manifester leur intérêt pour une mobilité internationale encadrée, avec leur CFA et leur employeur.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Global Weeks by AMI Panorama",
    description:
      "Une mobilité internationale encadrée, pensée pour les alternants qui souhaitent partir même sans voyage de classe.",
    url: "/global-weeks",
  },
};

export default async function GlobalWeeksPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const [hasAccess, params] = await Promise.all([hasGlobalWeeksAccess(), searchParams]);
  if (!hasAccess) return <GlobalWeeksAccessGate denied={params.access === "denied"} />;
  return <GlobalWeeksExperience />;
}
