import { CitizenshipRoute, citizenshipMetadata } from "@/components/european-citizenship/CitizenshipRoute";

export function generateMetadata() {
  return citizenshipMetadata("fr");
}

export default function Page() {
  return <CitizenshipRoute locale="fr" />;
}
