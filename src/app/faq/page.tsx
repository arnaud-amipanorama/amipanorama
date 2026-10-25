import { DraftPage, draftMetadata } from "@/lib/draft-page";

export const metadata = draftMetadata("faq");

export default function Page() {
  return <DraftPage slug="faq" />;
}
