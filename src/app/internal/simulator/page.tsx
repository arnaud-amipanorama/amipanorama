import type { Metadata } from "next";
import { parseSimulatorMode } from "@/lib/simulator/guided";
import { isUnlocked } from "./actions";
import UnlockForm from "./UnlockForm";
import SimulatorShell from "./SimulatorShell";

export const metadata: Metadata = {
  title: "AMI Panorama, Financial Simulator",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SimulatorPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const unlocked = await isUnlocked();
  if (!unlocked) return <UnlockForm />;
  // Sans `?mode=guided` ni `?mode=expert`, on affiche le choix entre les deux simulateurs.
  return <SimulatorShell mode={parseSimulatorMode((await searchParams).mode)} />;
}
