import { CitizenshipRoute, citizenshipMetadata } from "@/components/european-citizenship/CitizenshipRoute";

export function generateMetadata() {
  return citizenshipMetadata("en");
}

export default function Page() {
  return <CitizenshipRoute locale="en" />;
}
