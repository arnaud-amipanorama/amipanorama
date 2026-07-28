import type { Metadata } from "next";
import GlobalWeeksExperience from "./GlobalWeeksExperience";

export const metadata: Metadata = {
  title: "Global Weeks — mobilité internationale pour alternants",
  description:
    "Global Weeks by AMI Panorama permet aux alternants de manifester leur intérêt pour une mobilité internationale encadrée, avec leur CFA et leur employeur.",
  alternates: { canonical: "/global-weeks" },
  openGraph: {
    title: "Global Weeks by AMI Panorama",
    description:
      "Une mobilité internationale encadrée, pensée pour les alternants qui souhaitent partir même sans voyage de classe.",
    url: "/global-weeks",
  },
};

export default function GlobalWeeksPage() {
  return <GlobalWeeksExperience />;
}
