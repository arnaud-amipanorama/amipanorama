import { DraftPage, draftMetadata } from "@/lib/draft-page";

export const metadata = draftMetadata("ecoles");

export default function Page() {
  return <DraftPage slug="ecoles" />;
}
