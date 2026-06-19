import type { Metadata } from "next";
import { isUnlocked } from "./actions";
import UnlockForm from "./UnlockForm";
import SimulatorApp from "./SimulatorApp";

export const metadata: Metadata = {
  title: "AMI Panorama — Financial Simulator",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SimulatorPage() {
  const unlocked = await isUnlocked();
  return unlocked ? <SimulatorApp /> : <UnlockForm />;
}
