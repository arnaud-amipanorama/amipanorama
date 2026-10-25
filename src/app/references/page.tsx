import { DraftPage, draftMetadata } from "@/lib/draft-page";

export const metadata = draftMetadata("references");

export default function Page() {
  return <DraftPage slug="references" />;
}
