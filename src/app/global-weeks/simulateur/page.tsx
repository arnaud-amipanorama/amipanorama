import type { Metadata } from "next";
import GlobalWeeksAccessGate from "../GlobalWeeksAccessGate";
import { hasGlobalWeeksAccess } from "../actions";
import PublicSimulator from "./PublicSimulator";

export const metadata: Metadata = {
  title: "Estimer mon séjour Global Weeks",
  description:
    "Estimation indicative d’un séjour Global Weeks, en mobilité individuelle ou de groupe. Dans la majorité des cas, le séjour est financé.",
  robots: { index: false, follow: false },
};

export default async function PublicSimulatorPage({
  searchParams,
}: {
  searchParams: Promise<{ access?: string }>;
}) {
  const [hasAccess, params] = await Promise.all([hasGlobalWeeksAccess(), searchParams]);
  if (!hasAccess) return <GlobalWeeksAccessGate denied={params.access === "denied"} />;
  return <PublicSimulator />;
}
