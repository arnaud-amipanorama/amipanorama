import { DraftPage, draftMetadata } from "@/lib/draft-page";

export const metadata = draftMetadata("financement");

export default function Page() {
  return <DraftPage slug="financement" />;
}
