import type { Metadata } from "next";
import GlobalWeeksExperience from "./GlobalWeeksExperience";
import GlobalWeeksAccessGate from "./GlobalWeeksAccessGate";
import { hasGlobalWeeksAccess } from "./actions";

export const metadata: Metadata = {
  title: "Global Weeks, mobilité internationale pour alternants",
  description:
    "Global Weeks by AMI Panorama : une mobilité internationale pour les alternants, même sans voyage de promo. Un financement peut exister selon l’OPCO, le CFA et l’employeur. Aucun montant n’est garanti.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Global Weeks by AMI Panorama",
    description:
      "Pars en mobilité même sans voyage de classe. Ton séjour peut être financé selon ton OPCO, ton CFA et ton employeur. AMI le vérifie avec toi, sans garantir de montant.",
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
