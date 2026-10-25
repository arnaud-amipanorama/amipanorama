import { DraftPage, draftMetadata } from "@/lib/draft-page";

export const metadata = draftMetadata("cfa");

export default function Page() {
  return <DraftPage slug="cfa" />;
}
