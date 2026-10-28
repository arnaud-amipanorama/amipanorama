import type { Metadata } from "next";
import GlobalWeeksExperience from "./GlobalWeeksExperience";
import GlobalWeeksAccessGate from "./GlobalWeeksAccessGate";
import { hasGlobalWeeksAccess } from "./actions";

export const metadata: Metadata = {
  title: "Global Weeks, mobilité internationale pour alternants",
  description:
    "Global Weeks by AMI Panorama : une mobilité internationale pour les alternants, même sans voyage de promo. Dans la majorité des cas, le séjour est financé.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Global Weeks by AMI Panorama",
    description:
      "Pars en mobilité même sans voyage de classe. Dans la majorité des cas, ton séjour est financé. AMI monte le dossier avec toi.",
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
