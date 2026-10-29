import { CitizenshipRoute, citizenshipMetadata } from "@/components/european-citizenship/CitizenshipRoute";

export function generateMetadata() {
  return citizenshipMetadata("fr");
}

export default async function Page({ searchParams }: { searchParams: Promise<{ access?: string }> }) {
  const params = await searchParams;
  return <CitizenshipRoute locale="fr" access={params.access} />;
}
