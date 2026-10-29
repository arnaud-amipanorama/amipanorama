import { CitizenshipRoute, citizenshipMetadata } from "@/components/european-citizenship/CitizenshipRoute";

export function generateMetadata() {
  return citizenshipMetadata("en");
}

export default async function Page({ searchParams }: { searchParams: Promise<{ access?: string }> }) {
  const params = await searchParams;
  return <CitizenshipRoute locale="en" access={params.access} />;
}
