import { DraftPage, draftMetadata } from "@/lib/draft-page";

export const metadata = draftMetadata("entreprises");

export default function Page() {
  return <DraftPage slug="entreprises" />;
}
